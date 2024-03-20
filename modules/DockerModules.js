const Docker = require('dockerode');
const fs = require('fs');
const dockerSocketPath = require('./checkOs.js')

var docker = new Docker({socketPath: dockerSocketPath});

const containers = require('../containers.json');

function makeContainer(containerName, image, port, protocol, directory, env) {
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
                    };
                });
            };
        });
    });
};

async function appendContainers() {
    const containerList = await docker.listContainers({ all: true });

    var savedContainers = [];
    for (let i = 0; i < containers.length; i++) {
        savedContainers.push(containers[i].id);
    }

    for (const containerInfo of containerList) {
        for (let i = 0; i < containers.length; i++) {
            containers.filter((container) => containers[i].id !== containerInfo);
        }
        if (!savedContainers.includes(containerInfo.Id)) {
            try {

                let container = {
                    id: containerInfo.Id,
                    image: containerInfo.Image,
                    names: containerInfo.Names,
                    //dir: containerInfo.Volumes,
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
        };
    };
};

async function displayContainers() {
    try {
        fs.writeFileSync('modules/html-modules/containers.pug', '');

        for (let container of containers) {

            var containerInfo = docker.getContainer(container.id)
            //cpuMax = ,
            //cpuMin = ,
            //ramMax = ,
            //ramMin = ,
            ramUsage = 1;
            cpuUsage = 1;

            const html = '\n' + `.container.${container.id}
            .container-items.name
              p.name-cont ${container.names}
              button.containerReq.stop(id="${container.id}",
                onclick="containerReq(this.classList[1], this.id)"
              )
                svg.run(xmlns="http://www.w3.org/2000/svg", viewBox="0 0 384 512")
                  path(
                    d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
                  )
            .container-items.image
              p ${container.image}
            .container-items.directory
              p ${container.dir}
            .container-items.usage
              p RAM: ${ramUsage}
              p CPU: ${cpuUsage}
            .container-items
              .status.${container.status}`

            fs.appendFileSync('modules/html-modules/containers.pug', html, function (err) {
                if (err) {
                    console.error('Error appending container:', err);
                    reject(new Error('Could not append container'));
                } else {
                    console.log('Appended container');
                }
            });
        }
        console.log('Succesfully displayed containers');
    } catch (error) {
        console.error('Could not display containers', error);
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

function stopContainer(containerId) {
    return new Promise((resolve, reject) => {
        const container = docker.getContainer(containerId);
        container.stop((err) => {
            if (err) {
                reject(new Error('Failed to stop container'));
                console.error(`Error when stopping ${containerId}`)
            } else {
                resolve('Successfully stopped container');
                console.log(`Successfully stopped ${containerId}`);
            }
        });
    });
}

function startContainer(containerId) {
    return new Promise((resolve, reject) => {
        const container = docker.getContainer(containerId);
        container.start((err) => {
            if (err) {
                reject(new Error('Failed to start container'));
                console.error(`Error when starting ${containerId}`)
            } else {
                resolve('Successfully started container');
                console.log(`Successfully started ${containerId}`);
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
