const Docker = require('dockerode');
const fs = require("fs");
var docker = new Docker();

const containers = require('../containers.json');

function makeContainer(containerName, image, port, protocol, directory, env) {
    console.log(containerName, image, port, protocol, directory, env)
    return new Promise((resolve, reject) => {

        const containerConfig = {
            Image: image,
            name: containerName,
            ExposedPorts: {
                [`${port}/${protocol}`]: {}
            },
            HostConfig: {
                PortBindings: {
                    [`${port}/${protocol}`]: [{ HostPort: port }]
                }
            },
            Env: [
                env
            ],
        };

        console.log(containerConfig);

        var container = docker.createContainer(containerConfig, (err, container) => {
            if (err) {
                reject(new Error('Failed to create container'));
                console.error('Error creating container:', err);
            } else {
                container.start((startErr) => {
                    if (startErr) {
                        console.error('Error starting container:', startErr);
                    } else {
                        resolve('Container created and started successfully');
                        console.log('Container created and started successfully');
                    }
                });
            }
        });
    })
}

async function appendContainers() {
    const containerList = await docker.listContainers({ all: true });
    for (const containerInfo of containerList) {
        //let cont = JSON.parse(fs.readFileSync(containers));
        if (containerInfo.Id.toString == containers.id.toString) {
            try {

                console.log(containerInfo.Id);
                console.log(containers.id)
                console.log(containerInfo.Id.toString == containers.id.toString);

                let container = {
                    id: [`${containerInfo.Id}`],
                    name: [`${containerInfo.Names}`],
                    status: [`${containerInfo.State}`]
                };
                //MAKE WRITE TO JSON HERE

                console.log(`Found and appended container: ${containerInfo.Names[0]}`);
            } catch (error) {
                console.error(`Error appending container: ${containerInfo.Names[0]}`, error);
            }
        } else {
            console.error("Container already exists in database");
        }
    }
};

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
    appendContainers,
    stopContainer,
    startContainer,
    removeStoppedContainers,
};