const net = require('net');

async function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    });
}

/**
 * Finds the next available port block of size 150.
 * To support multiple browser profiles and derived ports (Canvas +4, Browser +11..110),
 * we need a large spacing to prevent collisions.
 * 
 * Port 18789 is explicitly blacklisted to protect the "Main Office" project.
 * 
 * @param {number} startPort The port to start searching from.
 * @returns {Promise<number>} The first available port in the block.
 */
async function findNextPortBlock(startPort = 18810) {
    const state = require('../utils/state');
    const { instances } = await state.load();
    const assignedPorts = instances.map(i => i.port);

    let currentPort = startPort;
    const blockSize = 150; // High-isolation block size

    while (true) {
        // Absolute Blacklist: Port 18789 is Holy Ground
        if (currentPort === 18789) {
            currentPort = 18810;
            continue;
        }

        let allAvailable = true;

        // Check if assigned in SurgeClaw state
        if (assignedPorts.includes(currentPort)) {
            allAvailable = false;
        }

        // Check if network available (proactive probing)
        if (allAvailable && !(await isPortAvailable(currentPort))) {
            allAvailable = false;
        }

        if (allAvailable) {
            return currentPort;
        }

        // Skip to next block
        currentPort += blockSize;

        // Safety break
        if (currentPort > 65000) {
            throw new Error('No available port blocks found.');
        }
    }
}

module.exports = { findNextPortBlock, isPortAvailable };
