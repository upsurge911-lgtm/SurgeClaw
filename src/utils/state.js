const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const DEFAULT_ROOT = path.join(os.homedir(), '.surgeclaw');
const OPENCLAW_ROOT = path.join(os.homedir(), '.openclaw');
const STATE_FILE_NAME = 'state.json';

class StateManager {
    constructor() {
        // Find the "Real Home" if we are currently inside an isolated agent sub-shell
        // Inside a sub-shell, os.homedir() returns the agent's folder, not the user's home.
        const currentHome = os.homedir();
        let realRoot = DEFAULT_ROOT;

        // If we detect the isolated path signature, we step back to find the real .surgeclaw
        if (currentHome.includes('.surgeclaw/agents')) {
            const parts = currentHome.split(path.sep);
            const surgeIndex = parts.indexOf('.surgeclaw');
            if (surgeIndex !== -1) {
                // Reconstruct the real root path from the prefix
                realRoot = parts.slice(0, surgeIndex + 1).join(path.sep);
            }
        }

        this.root = process.env.SURGECLAW_ROOT || realRoot;
        this.statePath = path.join(this.root, STATE_FILE_NAME);

        // Total Isolation (Phase 1.5): Store swarm agents inside realRoot/agents
        this.instancesDir = path.join(this.root, 'agents');
    }

    async init() {
        // Ensure we don't accidentally create directories inside an agent's folder
        await fs.ensureDir(this.root);
        await fs.ensureDir(this.instancesDir);

        // Phase 1.5 Migration: Move agents from ~/.openclaw/agents to ~/.surgeclaw/agents
        const oldInstancesDir = path.join(OPENCLAW_ROOT, 'agents');
        if (!process.env.SURGECLAW_ROOT && await fs.pathExists(oldInstancesDir)) {
            const state = await this.load();
            let migrated = false;
            for (const instance of state.instances) {
                if (instance.configPath && instance.configPath.includes(oldInstancesDir)) {
                    const oldPath = path.join(oldInstancesDir, instance.name);
                    const newPath = path.join(this.instancesDir, instance.name);

                    if (await fs.pathExists(oldPath) && !(await fs.pathExists(newPath))) {
                        console.log(`[surgeclaw] Migrating ${instance.name} to isolated storage...`);
                        await fs.move(oldPath, newPath);
                        migrated = true;
                    }

                    instance.configPath = path.join(newPath, 'openclaw.json');
                    instance.stateDir = path.join(newPath, 'state');
                    if (instance.logPath && instance.logPath.includes(oldInstancesDir)) {
                        instance.logPath = instance.logPath.replace(oldInstancesDir, this.instancesDir);
                    }
                    migrated = true;
                }
            }
            if (migrated) {
                await this.save(state);
                console.log('[surgeclaw] Swarm migration to dedicated storage verified.');
            }
        }
    }

    async load() {
        try {
            return await fs.readJson(this.statePath);
        } catch (err) {
            return { instances: [] };
        }
    }

    async save(state) {
        await fs.writeJson(this.statePath, state, { spaces: 2 });
    }

    async addInstance(instance) {
        const state = await this.load();
        state.instances.push(instance);
        await this.save(state);
    }

    async removeInstance(name) {
        const state = await this.load();
        state.instances = state.instances.filter(i => i.name !== name);
        await this.save(state);
    }

    async getInstance(name) {
        const state = await this.load();
        return state.instances.find(i => i.name === name);
    }

    getInstancePath(name) {
        return path.join(this.instancesDir, name);
    }

    getStateDir(name) {
        return path.join(this.getInstancePath(name), 'state');
    }

    getConfigPath(name) {
        return path.join(this.getInstancePath(name), 'openclaw.json');
    }

    getLogPath(name) {
        return path.join(this.getInstancePath(name), 'logs', 'gateway.log');
    }

    async readConfig(name) {
        const configPath = this.getConfigPath(name);
        if (await fs.pathExists(configPath)) {
            return await fs.readJson(configPath);
        }
        return null;
    }

    async writeConfig(name, config) {
        const configPath = this.getConfigPath(name);
        await fs.writeJson(configPath, config, { spaces: 2 });
    }

    async getMemoryFiles(name) {
        const agentDir = this.getInstancePath(name);
        const results = [];

        const searchDirs = [
            agentDir,
            path.join(agentDir, 'memory'),
            path.join(agentDir, 'MEMORY'),
        ];

        for (const dir of searchDirs) {
            if (await fs.pathExists(dir)) {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isFile() && entry.name.endsWith('.md')) {
                        const relPath = path.relative(agentDir, path.join(dir, entry.name));
                        const stat = await fs.stat(path.join(dir, entry.name));
                        results.push({
                            name: entry.name,
                            path: relPath,
                            size: stat.size,
                            modified: stat.mtime.toISOString()
                        });
                    }
                }
            }
        }
        return results;
    }

    async readMemoryFile(name, filePath) {
        const fullPath = path.join(this.getInstancePath(name), filePath);
        if (await fs.pathExists(fullPath)) {
            return await fs.readFile(fullPath, 'utf-8');
        }
        return null;
    }

    async logAudit(action, details = {}) {
        try {
            const auditFile = path.join(this.root, 'audit.log');
            const entry = JSON.stringify({
                timestamp: new Date().toISOString(),
                user: os.userInfo().username,
                action,
                ...details
            }) + '\n';

            await fs.appendFile(auditFile, entry);
        } catch (error) {
            // Silently fail audit logging
        }
    }

    async secureInstance(name) {
        try {
            const instance = await this.getInstance(name);
            if (!instance || instance.mode !== 'enterprise') return;

            const instanceDir = this.getInstancePath(name);
            // Permissions: 700 for dirs, 600 for files
            await fs.chmod(instanceDir, 0o700);

            if (await fs.pathExists(instance.configPath)) {
                await fs.chmod(instance.configPath, 0o600);
            }
        } catch (error) {
            console.error(chalk.red(`[Sentinel] Security enforcement failure for "${name}": ${error.message}`));
        }
    }
}

module.exports = new StateManager();
