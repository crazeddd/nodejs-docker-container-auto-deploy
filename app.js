const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { exec } = require('child_process');
const { error } = require('console');
const port = 3000;

const DockerModules = require(__dirname + '/modules/DockerModules.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('pages'));

app
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    .get('/panel', (req, res) => {
        res.sendFile(__dirname + '/pages/panel.html')
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
            res.redirect('/panel');
        } catch(error){
            res.status(500).send('Error creating container');
        }
    })

    .post('/containerReq', async (req, res) => {
        const containerName = req.body.id,
        reqType = req.body.type;

        console.log(`New inbound ${reqType} request from ${containerName}`);

        try {
            //await DockerModules.runContainer(containerName);
            res.json({ message: 'Function ran successfully' });
        } catch(error){
            res.status(500).json({error: "Error when running container request"});
            return;
        }
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});