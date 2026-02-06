const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const DEFAULT_ROOT = path.join(os.homedir(), '.surgeclaw');
const OPENCLAW_ROOT = path.join(os.homedir(), '.openclaw');
const STATE_FILE_NAME = 'state.json';

class StateManager {
    constructor() {
        this.root = process.env.SURGECLAW_ROOT || DEFAULT_ROOT;
        this.statePath = path.join(this.root, STATE_FILE_NAME);

        // Safety: If we are in a sandbox (SURGECLAW_ROOT is set), 
        // we keep instances inside the sandbox to prevent affecting global state.
        if (process.env.SURGECLAW_ROOT) {
            this.instancesDir = path.join(this.root, 'instances');
        } else {
            // Production: Align with native OpenClaw agent directory for GUI visibility
            this.instancesDir = path.join(OPENCLAW_ROOT, 'agents');
        }
    }

    async init() {
        await fs.ensureDir(this.root);
        await fs.ensureDir(this.instancesDir);
        if (!(await fs.pathExists(this.statePath))) {
            await this.save({ instances: [] });
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
}

module.exports = new StateManager();
