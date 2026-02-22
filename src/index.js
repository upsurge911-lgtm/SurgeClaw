#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const boxen = require('boxen');
const state = require('./utils/state');
const orchestrator = require('./core/orchestrator');
const { findNextPortBlock } = require('./core/port-hunter');
const inquirer = require('inquirer');

const program = new Command();

program
    .name('surgeclaw')
    .description('The King Lobster Orchestrator for OpenClaw Swarms 🦞⚡')
    .version('1.1.0');

// Initial setup
const printBanner = () => {
    const banner = `
    ███████╗██╗   ██╗██████╗  ██████╗ ███████╗ ██████╗██╗      █████╗ ██╗    ██╗
    ██╔════╝██║   ██║██╔══██╗██╔════╝ ██╔════╝██╔════╝██║     ██╔══██╗██║    ██║
    ███████╗██║   ██║██████╔╝██║  ███╗█████╗  ██║     ██║     ███████║██║ █╗ ██║
    ╚════██║██║   ██║██╔══██╗██║   ██║██╔══╝  ██║     ██║     ██╔══██║██║███╗██║
    ███████║╚██████╔╝██║  ██║╚██████╔╝███████╗╚██████╗███████╗██║  ██║╚███╔███╔╝
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 🦞⚡ 1.1.0
    `;
    console.log(chalk.cyan(banner));
};

const init = async () => {
    await state.init();
};

program
    .command('list')
    .description('List all managed OpenClaw instances')
    .action(async () => {
        await init();
        printBanner();
        const { instances } = await state.load();

        if (instances.length === 0) {
            console.log(chalk.yellow('\nNo agents found in your kingdom. Run "surgeclaw onboard" to start.'));
            return;
        }

        console.log(boxen(chalk.bold.cyan('🦞 SurgeClaw Swarm Status'), { padding: 1, margin: 1, borderStyle: 'double' }));

        instances.forEach(inst => {
            console.log(`${chalk.green('✔')} ${chalk.bold(inst.name)} [Profile: ${inst.profile}]`);
            console.log(`  ${chalk.dim('Port:')} ${inst.port}`);
            console.log(`  ${chalk.dim('Path:')} ${inst.configPath}\n`);
        });
    });

program
    .command('status [name...]')
    .description('Check the pulse of your swarm')
    .action(async (nameParts) => {
        await init();
        const { instances } = await state.load();
        const name = nameParts.length > 0 ? nameParts.join(' ') : null;

        console.log(chalk.bold.cyan('\n🦞 SurgeClaw Heartbeat Check...'));

        const checkInstances = name ? instances.filter(i => i.name === name) : instances;

        if (name && checkInstances.length === 0) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        for (const inst of checkInstances) {
            const exists = await require('fs-extra').pathExists(inst.configPath);
            const { isPortAvailable } = require('./core/port-hunter');
            const isListening = !(await isPortAvailable(inst.port));

            const initStatus = exists ? chalk.green('INITIALIZED') : chalk.red('EMPTY');
            const runStatus = isListening ? chalk.bold.green('LIVE') : chalk.dim('IDLE');

            console.log(`\n  ${chalk.bold(inst.name)}`);
            console.log(`    ${chalk.dim('Status:')} ${initStatus} | ${runStatus}`);
            console.log(`    ${chalk.dim('Port  :')} ${inst.port}`);

            if (isListening) {
                console.log(`    ${chalk.dim('Logs  :')} surgeclaw logs "${inst.name}"`);
            }
        }
        console.log('');
    });

program
    .command('logs <name...>')
    .description('Stream the real-time heartbeat (logs) of a specific agent')
    .action(async (nameParts) => {
        await init();
        const name = nameParts.join(' ');
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        const logPath = instance.logPath || require('path').join(state.getInstancePath(name), 'logs', 'gateway.log');
        const fs = require('fs-extra');

        if (!(await fs.pathExists(logPath))) {
            console.log(chalk.yellow(`\n⚠ No logs found yet for "${name}".`));
            console.log(chalk.dim(`Expected at: ${logPath}`));
            return;
        }

        console.log(chalk.bold.cyan(`\n🦞 Streaming Logs for: ${name}`));
        console.log(chalk.dim(`(Ctrl+C to stop streaming)\n`));

        const { spawn } = require('child_process');
        const tail = spawn('tail', ['-f', logPath], { stdio: 'inherit' });

        tail.on('error', (err) => {
            console.log(chalk.red(`\n✖ Error streaming logs: ${err.message}`));
        });
    });

program
    .command('onboard')
    .description('Add a new OpenClaw agent to your swarm')
    .option('-n, --name <name>', 'Name of the agent')
    .option('-r, --role <role>', 'Role of the agent')
    .option('-m, --mode <mode>', 'Deployment mode (personal/enterprise)')
    .action(async (options) => {
        await init();
        printBanner();
        console.log(chalk.bold.cyan('\n🦞 SurgeClaw Onboarding Wizard'));

        let { name, role, mode: instanceMode } = options;

        if (!name || !role) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Name your new agent:',
                    when: !name,
                    validate: input => input.length > 0 ? true : 'Name is required'
                },
                {
                    type: 'list',
                    name: 'mode',
                    message: 'What best describes your deployment?',
                    choices: [
                        { name: 'Personal (Standard: No restrictions)', value: 'personal' },
                        { name: 'Enterprise (Regulated: Audit logging, strict isolation)', value: 'enterprise' }
                    ],
                    default: 'personal'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is this agent\'s primary mission?',
                    choices: ['The Researcher', 'The Coder', 'The Scout', 'Custom'],
                    when: !role
                }
            ]);
            name = name || answers.name;
            role = role || answers.role;
            instanceMode = answers.mode;
        }

        const mode = instanceMode || 'personal';

        const { instances } = await state.load();
        const { isPortAvailable } = require('./core/port-hunter');
        const port18789Busy = !(await isPortAvailable(18789));

        let startPort = 18789;

        // EMERGENCY PATCH (v1.0.3): Protect Port 18789 from collisions
        // If an agent exists OR if 18789 is busy, we MUST jump to the swarm block (18809+)
        if (instances.length > 0 || port18789Busy) {
            startPort = 18809;
            if (port18789Busy && instances.length === 0) {
                console.log(chalk.yellow('\n  Safety Alert: Detected active service on Port 18789 (Main Office).'));
                console.log(chalk.dim('  I will reserve this port and onboard your new agent starting at Port 18809.'));
            }
        } else {
            // Only ask if it is the first agent AND 18789 is actually free
            const { hasMain } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'hasMain',
                    message: 'Do you plan to run a primary OpenClaw instance alongside this swarm?',
                    default: true
                }
            ]);

            if (hasMain) {
                console.log(chalk.cyan('\n  Confirmed. Reserving Port 18789 for your Main office.'));
                startPort = 18809;
            }
        }

        const profile = `surge-${name}`;
        const port = await findNextPortBlock(18810); // Start swarm at 18810+

        const instance = {
            name,
            profile,
            port,
            role,
            configPath: state.getConfigPath(name),
            stateDir: state.getStateDir(name),
            logPath: require('path').join(state.getInstancePath(name), 'logs', 'gateway.log'),
            mode: mode
        };

        console.log(chalk.bold.cyan('\n  🦞 THE KING LOBSTER ORCHESTRATOR ⚡'));
        console.log(chalk.italic.dim('           "Built to Multiply. Born to Lead."\n'));

        const fs = require('fs-extra');
        const path = require('path');
        await fs.ensureDir(path.dirname(instance.configPath));
        await fs.ensureDir(instance.stateDir);
        await fs.ensureDir(path.dirname(instance.logPath));

        // Automate Log Isolation (v1.0.4)
        // If config exists, we patch it. If not, we'll wait for setup.
        if (await fs.pathExists(instance.configPath)) {
            try {
                const config = await fs.readJson(instance.configPath);
                config.logging = config.logging || {};
                config.logging.file = instance.logPath;
                await fs.writeJson(instance.configPath, config, { spaces: 2 });
                console.log(chalk.dim(`  ✔ Log isolation configured: ${instance.logPath}`));
            } catch (err) {
                // Config might be malformed or empty, skip patching
            }
        }

        await state.addInstance(instance);

        // Sentinel Audit
        await state.logAudit('ONBOARD_INSTANCE', {
            name,
            role,
            mode: instance.mode
        });

        // Sentinel Strict Mode (Perms 600)
        await state.secureInstance(name);

        console.log(chalk.green(`\n✔ Agent "${name}" initialized in your swarm!`));
        console.log(chalk.cyan(`\nNext Step: Step into the office to configure this agent:`));
        console.log(chalk.bold.white(`  surgeclaw configure "${name}"`));
        console.log(chalk.dim(`\n(Inside the office, run "openclaw onboard" to configure the agent's soul)`));
        console.log(chalk.dim(`\nNote: Every agent now has a 150-port safe buffer for browser profiles.`));
    });

program
    .command('offboard <name...>')
    .description('Decommission an agent and remove them from the swarm')
    .action(async (nameParts) => {
        await init();
        const name = nameParts.join(' ');
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to remove agent "${name}" from the swarm?`,
                default: false
            }
        ]);

        if (!confirm) return;

        console.log(chalk.yellow(`\n🦞 Retiring ${name}...`));

        // Stop process
        const shell = require('shelljs');
        shell.exec(`pkill -f "profile ${instance.profile}"`, { silent: true });

        // Remove from state
        await state.removeInstance(name);

        const { wipe } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'wipe',
                message: `Do you want to wipe all physical data folders for "${name}"? (Irreversible)`,
                default: false
            }
        ]);

        if (wipe) {
            const agentRoot = state.getInstancePath(name);
            await require('fs-extra').remove(agentRoot);
            console.log(chalk.green(`✔ Data folders for ${name} purged.`));
        }

        // Sentinel Audit
        await state.logAudit('OFFBOARD_INSTANCE', { name, contentWiped: wipe });

        console.log(chalk.green(`\n✔ Agent "${name}" offboarded successfully.`));
    });

program
    .command('uninstall')
    .description('Completely remove SurgeClaw and its configurations')
    .action(async () => {
        await init();
        printBanner();

        console.log(chalk.bold.red('\n⚠ WARNING: This will dismantle the King Lobster\'s kingdom.'));

        const { mode } = await inquirer.prompt([
            {
                type: 'list',
                name: 'mode',
                message: 'Choose your uninstallation depth:',
                choices: [
                    { name: 'Ghost Mode (Safe): Delete manager config, keep agent data.', value: 'ghost' },
                    { name: 'Nuclear Mode (Total): Wipe every trace of SurgeClaw.', value: 'nuclear' },
                    { name: 'Cancel', value: 'cancel' }
                ]
            }
        ]);

        if (mode === 'cancel') return;

        console.log(chalk.yellow('\n🦞 Dismantling SurgeClaw...'));

        // Stop all agents
        const shell = require('shelljs');
        shell.exec('pkill -f openclaw', { silent: true });

        if (mode === 'nuclear') {
            const { instances } = await state.load();
            for (const inst of instances) {
                const agentRoot = state.getInstancePath(inst.name);
                await require('fs-extra').remove(agentRoot);
            }
            console.log(chalk.green('✔ All agent data cabinets purged.'));
        }

        // Sentinel Audit
        await state.logAudit('CLI_UNINSTALL', { mode });

        // Wipe global config
        await require('fs-extra').remove(state.root);
        console.log(chalk.green(`✔ SurgeClaw global configuration (${state.root}) removed.`));

        console.log(chalk.bold.green('\nUninstallation complete. SurgeClaw has left the building. 🦞👋'));
        console.log(chalk.dim('Note: To remove the npm package, run "npm uninstall -g advantage-surgeclaw" manually.\n'));
    });

const swarm = program.command('swarm').description('Manage the entire agent swarm');

swarm
    .command('start')
    .description('Launch all registered agents in the background')
    .action(async () => {
        await init();
        const { instances } = await state.load();

        if (instances.length === 0) {
            console.log(chalk.yellow('\nNo agents in your kingdom. Run "surgeclaw onboard" first.'));
            return;
        }

        console.log(chalk.bold.cyan(`\n🦞 Waking up the swarm (${instances.length} agents)...`));
        for (const instance of instances) {
            process.stdout.write(`  Deploying ${chalk.bold(instance.name)}... `);
            try {
                await orchestrator.startGateway(instance, instance.port);

                // Sentinel Strict Mode (Perms 600)
                await state.secureInstance(instance.name);

                // Sentinel Audit
                await state.logAudit('START_INSTANCE', { name: instance.name, context: 'swarm' });
                console.log(chalk.green('✔'));
            } catch (err) {
                console.log(chalk.red('✖'));
            }
        }
        console.log(chalk.bold.green('\nSwarm is live. You can close this terminal.'));
    });

swarm
    .command('stop')
    .description('Stop all running agents in the swarm')
    .action(async () => {
        console.log(chalk.bold.yellow('\n🦞 Sent the signal to stand down...'));
        const shell = require('shelljs');
        shell.exec('pkill -f openclaw', { silent: true });

        // Sentinel Audit
        await state.logAudit('STOP_SWARM', { reason: 'manual_kill' });

        console.log(chalk.green('✔ Swarm processes terminated.'));
    });

program
    .command('start <name...>')
    .description('Launch an agent as a persistent background process')
    .action(async (nameParts) => {
        await init();
        const name = nameParts.join(' ');
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        console.log(chalk.bold.cyan(`\n🦞 Deploying ${name} to the background...`));
        await orchestrator.startGateway(instance, instance.port);

        // Sentinel Strict Mode (Perms 600)
        await state.secureInstance(name);

        // Sentinel Audit
        await state.logAudit('START_INSTANCE', { name, context: 'single' });

        console.log(chalk.green(`✔ ${name} is now running on Port ${instance.port}!`));
        console.log(chalk.dim('You can close this terminal window; the agent will stay alive.'));
    });

program
    .command('stop <name...>')
    .description('Stop a specific background agent')
    .action(async (nameParts) => {
        await init();
        const name = nameParts.join(' ');
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        console.log(chalk.bold.yellow(`\n🦞 Signaling ${name} to stand down...`));
        const shell = require('shelljs');
        shell.exec(`pkill -f "profile ${instance.profile}"`, { silent: true });

        // Sentinel Audit
        await state.logAudit('STOP_INSTANCE', { name });

        console.log(chalk.green(`✔ ${name} has been stopped.`));
    });

program
    .command('configure <name...>')
    .description('Step inside an agent\'s cabinet and enter Configure Mode (Immersive Sub-shell)')
    .action(async (nameParts) => {
        await init();
        const name = nameParts.join(' ');
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        console.log(boxen(chalk.bold.cyan(`🦞 You have stepped into Office: ${name}`), { padding: 1, borderStyle: 'double' }));
        console.log(chalk.yellow(`Environment locked to Profile: ${instance.profile} | Port: ${instance.port}`));
        console.log(chalk.dim('Type "exit" to leave this agent\'s cabinet.\n'));

        const env = {
            ...process.env,
            HOME: require('path').dirname(instance.configPath),
            OPENCLAW_HOME: require('path').dirname(instance.configPath),
            OPENCLAW_CONFIG_PATH: instance.configPath,
            OPENCLAW_STATE_DIR: instance.stateDir,
            OPENCLAW_GATEWAY_PORT: String(instance.port), // Seed the port!
            SURGE_ACTIVE_AGENT: name,
            PS1: `(🦞 ${name}) %n@%m %1~ %# `,
            PROMPT: `(🦞 ${name}) %n@%m %1~ %# `
        };

        // Sentinel Audit
        await state.logAudit('ENTER_OFFICE', { name });

        const shell = process.env.SHELL || 'bash';
        const { spawn } = require('child_process');
        const child = spawn(shell, {
            env,
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            console.log(chalk.bold.cyan(`\n🦞 Stepped out of Office: ${name}. Back in the Kingdom.`));
        });
    });

// Catch-all for instance-specific commands
program
    .arguments('[args...]')
    .description('Run a command for a specific agent')
    .action(async (args) => {
        await init();

        if (args.length === 0) {
            program.help();
            return;
        }

        const knownCommands = ['onboard', 'list', 'status', 'configure', 'start', 'stop', 'swarm', 'offboard', 'uninstall'];
        if (knownCommands.includes(args[0])) return;

        const { instances } = await state.load();

        if (instances.length === 0) {
            console.log(chalk.yellow('\nNo agents found. Run "surgeclaw onboard" first.'));
            return;
        }

        // Try to match agent name by checking argument prefixes
        let targetInstance;
        let commandArgs = [];

        for (let i = 1; i <= args.length; i++) {
            const potentialName = args.slice(0, i).join(' ');
            const found = instances.find(inst => inst.name === potentialName);
            if (found) {
                targetInstance = found;
                commandArgs = args.slice(i);
                break;
            }
        }

        if (!targetInstance) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selected',
                    message: "Select an agent:",
                    choices: instances.map(i => ({ name: `${i.name} (Port: ${i.port})`, value: i.name }))
                }
            ]);
            targetInstance = instances.find(i => i.name === answers.selected);
            commandArgs = args;
        }

        if (commandArgs.length === 0) {
            console.log(chalk.yellow(`\nAgent "${targetInstance.name}" is active. Example: surgeclaw ${targetInstance.name} gateway`));
            return;
        }

        try {
            await orchestrator.runCommand(targetInstance, commandArgs);
        } catch (err) {
            // Error handled by child process inheritance
        }
    });

program.parse(process.argv);
