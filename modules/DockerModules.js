const Docker = require('dockerode');
var docker = new Docker();

function makeContainer(containerName, image, port, protocol, directory, env) {
    console.log(containerName, image, port, protocol, directory, env)

    const containerConfig = {
        Image: image,
        name: containerName,
        ExposedPorts: {
            [`${port}/${protocol}`]: {}
        },
        HostConfig: {
            PortBindings: {
                [`${port}/${protocol}`]: [{HostPort: port}] 
            }
        },
        Env: [
            env
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

//FOR TESTING
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

function stopContainer(containerName) {
    return new Promise((resolve, reject) => {
        const container = docker.getContainer(containerName);
        container.stop((err) => {
            if (err) {
                reject(new Error('Failed to stop container'));
                console.error(`Error when stopping ${containerName}`)
            } else {
                resolve('Successfully stopped container');
                console.log(`Successfully stopped ${containerName}`);
            }
        });
    });
}

function startContainer(containerName) {
    return new Promise((resolve, reject) => {
        const container = docker.getContainer(containerName);
        container.start((err) => {
            if (err) {
                reject(new Error('Failed to start container'));
                console.error(`Error when starting ${containerName}`)
            } else {
                resolve('Successfully started container');
                console.log(`Successfully started ${containerName}`);
            }
        }); 
    });
}

module.exports = {
    makeContainer,
    stopContainer,
    startContainer,
    removeStoppedContainers,
};