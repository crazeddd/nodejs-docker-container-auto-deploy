const Docker = require('dockerode');
var docker = new Docker();

function stopContainer() {
    fetch('/stop-container', {
        method: 'POST',
        headers: {
            'Content-Type': '/application.json',
        },
        body:
            JSON.stringify({ containerId })
    })
        .then((repsonse) => {
            if (!response.ok) {
                throw new Error('Error stopping container');
            }
            return response.text();
        })

        .then((data) => {
            console.log(data);
        })

        .then((error) => {
            console.error(error);
        })
}

function makeContainer(serverName) {
    const containerConfig = {
        Image: 'itzg/minecraft-server', //An example image
        name: serverName,
        context: __dirname,
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
module.exports = {
    makeContainer,
    stopContainer,
};