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
    .version('1.0.0');

// Initial setup
const printBanner = () => {
    const banner = `
    ███████╗██╗   ██╗██████╗  ██████╗ ███████╗ ██████╗██╗      █████╗ ██╗    ██╗
    ██╔════╝██║   ██║██╔══██╗██╔════╝ ██╔════╝██╔════╝██║     ██╔══██╗██║    ██║
    ███████╗██║   ██║██████╔╝██║  ███╗█████╗  ██║     ██║     ███████║██║ █╗ ██║
    ╚════██║██║   ██║██╔══██╗██║   ██║██╔══╝  ██║     ██║     ██╔══██║██║███╗██║
    ███████║╚██████╔╝██║  ██║╚██████╔╝███████╗╚██████╗███████╗██║  ██║╚███╔███╔╝
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 🦞⚡ 1.0.0
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
    .command('status')
    .description('Check the pulse of your swarm')
    .action(async () => {
        await init();
        const { instances } = await state.load();

        console.log(chalk.bold.cyan('\n🦞 SurgeClaw Heartbeat Check...'));

        for (const inst of instances) {
            const exists = await require('fs-extra').pathExists(inst.configPath);
            const status = exists ? chalk.green('INITIALIZED') : chalk.red('WAITING FOR SETUP');
            console.log(`  ${inst.name.padEnd(15)} [${status}] on Port ${inst.port}`);
        }
    });

program
    .command('onboard')
    .description('Add a new OpenClaw agent to your swarm')
    .option('-n, --name <name>', 'Name of the agent')
    .option('-r, --role <role>', 'Role of the agent')
    .action(async (options) => {
        await init();
        printBanner();
        console.log(chalk.bold.cyan('\n🦞 SurgeClaw Onboarding Wizard'));

        let { name, role } = options;

        if (!name || !role) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Name your new high-power agent:',
                    when: !name,
                    validate: input => input.length > 0 ? true : 'Name is required'
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
        }

        const { instances } = await state.load();
        let startPort = 18789;

        // Trust but Verify: Check for existing OpenClaw
        if (instances.length === 0) {
            const { hasMain } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'hasMain',
                    message: 'Are you already running a primary OpenClaw instance on this machine?',
                    default: true
                }
            ]);

            const { isPortAvailable } = require('./core/port-hunter');
            const port18789Busy = !(await isPortAvailable(18789));

            if (hasMain) {
                console.log(chalk.cyan('\n  Confirmed. Reserving Port 18789 for your Main office.'));
                startPort = 18809;
            } else if (port18789Busy) {
                console.log(chalk.yellow('\n  Safety Alert: Your answer was "No", but I detected an active service on Port 18789.'));
                console.log(chalk.dim('  I will reserve this port for your safety and shift your new agent to Port 18809.'));
                startPort = 18809;
            }
        }

        const profile = `surge-${name}`;
        const port = await findNextPortBlock(startPort);

        const instance = {
            name,
            profile,
            port,
            role,
            configPath: state.getConfigPath(name),
            stateDir: state.getStateDir(name)
        };

        console.log(chalk.bold.cyan('\n  🦞 THE KING LOBSTER ORCHESTRATOR ⚡'));
        console.log(chalk.italic.dim('           "Built to Multiply. Born to Lead."\n'));

        await require('fs-extra').ensureDir(require('path').dirname(instance.configPath));
        await require('fs-extra').ensureDir(instance.stateDir);

        await state.addInstance(instance);

        console.log(chalk.green(`\n✔ Agent "${name}" initialized in your swarm!`));
        console.log(chalk.cyan(`\nTo setup his soul, run: `) + chalk.bold.white(`surgeclaw ${name} setup`));
        console.log(chalk.dim(`(This will trigger the native OpenClaw setup wizard inside this isolated cabinet)`));
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
        console.log(chalk.green('✔ Swarm processes terminated.'));
    });

program
    .command('start <name>')
    .description('Launch an agent as a persistent background process')
    .action(async (name) => {
        await init();
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        console.log(chalk.bold.cyan(`\n🦞 Deploying ${name} to the background...`));
        await orchestrator.startGateway(instance, instance.port);
        console.log(chalk.green(`✔ ${name} is now running on Port ${instance.port}!`));
        console.log(chalk.dim('You can close this terminal window; the agent will stay alive.'));
    });

program
    .command('stop <name>')
    .description('Stop a specific background agent')
    .action(async (name) => {
        await init();
        const instance = await state.getInstance(name);

        if (!instance) {
            console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
            return;
        }

        console.log(chalk.bold.yellow(`\n🦞 Signaling ${name} to stand down...`));
        const shell = require('shelljs');
        shell.exec(`pkill -f "profile ${instance.profile}"`, { silent: true });
        console.log(chalk.green(`✔ ${name} has been stopped.`));
    });

program
    .command('configure <name>')
    .description('Step inside an agent\'s cabinet and enter Configure Mode (Immersive Sub-shell)')
    .action(async (name) => {
        await init();
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
            SURGE_ACTIVE_AGENT: name
        };

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
    .arguments('[name] [commands...]')
    .description('Run a command for a specific agent')
    .action(async (name, commands) => {
        await init();

        if (['onboard', 'list', 'status', 'configure', 'start', 'stop', 'swarm'].includes(name)) return;

        let targetInstance;

        if (!name || (await state.getInstance(name)) === undefined) {
            const { instances } = await state.load();
            if (instances.length === 0) {
                if (name) console.log(chalk.red(`\n✖ Agent "${name}" not found.`));
                else console.log(chalk.yellow('\nNo agents found. Run "surgeclaw onboard" first.'));
                return;
            }

            const actualCommands = name ? [name, ...commands] : commands;

            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selected',
                    message: `Which agent should run: ${chalk.cyan(actualCommands.join(' ')) || 'this command'}?`,
                    choices: instances.map(i => ({ name: `${i.name} (Port: ${i.port})`, value: i.name }))
                }
            ]);
            targetInstance = instances.find(i => i.name === answers.selected);
            return await orchestrator.runCommand(targetInstance, actualCommands);
        }

        targetInstance = await state.getInstance(name);

        if (!commands || commands.length === 0) {
            console.log(chalk.yellow(`\nAgent "${name}" is active. Example: surgeclaw ${name} gateway`));
            return;
        }

        try {
            await orchestrator.runCommand(targetInstance, commands);
        } catch (err) {
            // Error handled by child process inheritance
        }
    });

program.parse(process.argv);
