const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { exec } = require('child_process');
const DockerModules = require(__dirname + '/modules/DockerModules.js');

app.use(bodyParser.urlencoded({ extended: true }));

app
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    .get('/pannel', (req, res) => {
        res.sendFile(__dirname + '/pages/pannel.html')
    })

    .post('/create-container', async (req, res) => {
        await DockerModules.removeStoppedContainers();

        const containerName = req.body.username;

        if(!containerName) {
            res.status(400).send('Container name reqired');
            return;
        }
        try {
            var container = await DockerModules.makeContainer(containerName);
            res.redirect('/pannel');
        } catch(error){
            res.status(500).send('Error creating container');
        }
    })

    .post('/stop-container', async (req, res) => {
        const  containerName  = req.body.username;
        try {
            await DockerModules.stopContainer(containerName);
        } catch(error){
            res.status(500).send('Error stopping container');
        }
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});