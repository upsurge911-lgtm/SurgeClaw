const { spawn } = require('child_process');
const state = require('../utils/state');
const path = require('path');

class Orchestrator {
    /**
     * Runs an openclaw command for a specific instance.
     * @param {Object} instance The instance object from state.
     * @param {string[]} args The arguments to pass to openclaw.
     */
    async runCommand(instance, args) {
        return new Promise((resolve, reject) => {
            const env = {
                ...process.env,
                OPENCLAW_HOME: path.dirname(instance.configPath),
                OPENCLAW_CONFIG_PATH: instance.configPath,
                OPENCLAW_STATE_DIR: instance.stateDir,
                OPENCLAW_GATEWAY_PORT: String(instance.port)
            };

            console.log(`\n\x1b[36m[SurgeClaw] Routing to ${instance.name}...\x1b[0m`);

            const child = spawn('openclaw', ['--profile', instance.profile, ...args], {
                env,
                cwd: path.dirname(instance.configPath),
                stdio: 'inherit',
                shell: true
            });

            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Command failed with code ${code}`));
            });
        });
    }

    /**
     * Spawns a gateway in the background or foreground.
     */
    async startGateway(instance, port) {
        const env = {
            ...process.env,
            HOME: path.dirname(instance.configPath),
            OPENCLAW_HOME: path.dirname(instance.configPath),
            OPENCLAW_CONFIG_PATH: instance.configPath,
            OPENCLAW_STATE_DIR: instance.stateDir,
            OPENCLAW_GATEWAY_PORT: String(instance.port)
        };

        console.log(`\n\x1b[32m[SurgeClaw] Starting Gateway for ${instance.name} on port ${port}...\x1b[0m`);

        // Note: port is handled by openclaw gateway internally if passed in args
        const child = spawn('openclaw', ['--profile', instance.profile, 'gateway', '--port', port.toString(), '--allow-unconfigured'], {
            env,
            cwd: path.dirname(instance.configPath),
            stdio: 'ignore',
            detached: true
        });

        child.unref();
        return child;
    }
}

module.exports = new Orchestrator();
