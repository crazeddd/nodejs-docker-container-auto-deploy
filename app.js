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

    .get('/create-container', async (req, res) => {
        res.sendFile(__dirname + '/pages/create-container.html')
    })

    .post('/build-container', async (req, res) => {
        //Testing
        await DockerModules.removeStoppedContainers();

        const containerName = req.body.id;


        if (!containerName) {
            res.status(400).send('Container name reqired');
            return;
        }

        try {
            await DockerModules.makeContainer(containerName);
            res.redirect('/panel');
        } catch (error) {
            res.status(500).send('Error creating container');
        }
    })

    .post('/containerReq', async (req, res) => {
        const containerName = req.body.id,
            reqType = req.body.type;

        if (!containerName) {
            res.json({ message: "Container name required" });
            return;
        }

        console.log(`New inbound ${reqType} request from ${containerName}`);

        try {
            //WILL REPLACE EVAL SOON
            const message = await eval(`DockerModules.${reqType}Container(containerName)`);

            res.json({ message: message });
        } catch (error) {
            res.json({ message: error.message });
        }
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});