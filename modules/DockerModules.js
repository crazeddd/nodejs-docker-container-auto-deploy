const Docker = require('dockerode');
var docker = new Docker();

function stopContainer(containerName) {
    const container = docker.getContainer(containerName);
    container.stop((err) => {
        if (err) {
            console.error("Error stopping container");
            console.error(err);
        } else {
            console.log('Successfully stopped container.');
        }
    });
}

function makeContainer(containerName) {
    const containerConfig = {
        Image: 'itzg/minecraft-server', //An example image
        name: containerName,
        context: __dirname,
        Env: [
           'EULA=TRUE',
           'PORT=25565'
        ],
    };

    docker.createContainer(containerConfig, (err, container) => {
        if (err) {
            console.error('Error creating container:', err);
        } else {
            container.start((startErr) => {
                if (startErr) {
                    console.error('Error starting container:', startErr);
                } else {
                    console.log('Container created and started successfully');
                }
            });
        }
    });
} 

async function removeStoppedContainers() {
    const containers = await docker.listContainers({ all: true });
    for (const containerInfo of containers) {
        if (containerInfo.State === 'exited') {
            const container = docker.getContainer(containerInfo.Id);
            try {
                await container.remove();
                console.log(`Removed container: ${containerInfo.Names[0]}`);
            } catch (error) {
                console.error(`Error removing container: ${containerInfo.Names[0]}`, error);
            }
        }
    }
}

// Call this function after stopping the containers
module.exports = {
    makeContainer,
    stopContainer,
    removeStoppedContainers,
};