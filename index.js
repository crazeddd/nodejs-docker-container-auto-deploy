const express = require('express');
const Docker = require('dockerode');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { exec } = require('child_process');

var docker = new Docker();

app.use(bodyParser.urlencoded({ extended: true }));

app
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    .get('/pannel', (req, res) => {
        res.sendFile(__dirname + '/pages/pannel.html')
    })

    .post('/create-container', (req, res) => {

    //FOR TESTING ONlY

    console.log('Received POST request with body:', req.body);

    const serverName = req.body.username;

    if (!serverName) {
        res.status(400).send('Server name reqired');
        return;
    }

    //containerId = serverName.container.Id

    const containerConfig = {
        Image: 'itzg/minecraft-server', //An example image
        name: serverName,
        context: __dirname,
    };

    docker.createContainer(containerConfig, (err, container) => {
        if (err) {
            console.error('Error creating container:', err);
            res.status(500).send('Error creating container');
        } else {
            container.start((startErr) => {
                if (startErr) {
                    console.error('Error starting container:', startErr);
                    res.status(500).send('Error starting container');
                } else {
                    console.log('Container created and started successfully');
                }
            });
        }
    });
    res.redirect('/pannel');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});