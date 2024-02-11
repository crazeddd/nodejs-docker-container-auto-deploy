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

    var savedContainers = [];
    for (let i = 0; i < containers.length; i++) {
        savedContainers.push(containers[i].id);
    }

    for (const containerInfo of containerList) {
        if (!savedContainers.includes(containerInfo.Id)) {
            try {

                let container = {
                    id: containerInfo.Id,
                    names: containerInfo.Names,
                    status: containerInfo.State
                };

                containers.push(container);

                fs.writeFile("containers.json", JSON.stringify(containers), err => {
                    if (err) throw new (err);
                });

                console.log(`Found and appended container: ${containerInfo.Names[0]}`);
            } catch (error) {
                console.error(`Error appending container: ${containerInfo.Names[0]}`, error);
                throw new Error(`Error appending container: ${containerInfo.Names[0]}`);
            }
        } else {
            console.error("Container already exists in database");
        }
    }
};

function displayContainers() {
    for (let container of containers) {
        const html = `
        <div class="container">
           <div class="container-items">
            <div>${container.names}</div>
            <button class="containerReq" id="" onClick="">Edit</button>
            <button class="containerReq stop" id="${container.id}" onClick="containerReq(this.id)">Stop</button>
            <button class="containerReq start" id="${container.id}" onClick="containerReq(this.id)">Start</button>
            <p id="res">Waiting for server...</p>
           </div>
            <div class="container-items">
            <div id="status">${container.status}</div>
          </div>
        </div>`
        
        console.log(html)
    }
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
    appendContainers,
    displayContainers,
    stopContainer,
    startContainer,
    removeStoppedContainers,
};