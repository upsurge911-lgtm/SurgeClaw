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
 * Finds the next available port block of size 20.
 * @param {number} startPort The port to start searching from.
 * @returns {Promise<number>} The first available port in the block.
 */
async function findNextPortBlock(startPort = 18789) {
    const state = require('../utils/state');
    const { instances } = await state.load();
    const assignedPorts = instances.map(i => i.port);

    let currentPort = startPort;
    const blockSize = 20;

    while (true) {
        let allAvailable = true;

        // Check if assigned in state
        if (assignedPorts.includes(currentPort)) {
            allAvailable = false;
        }

        // Check if network available
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
