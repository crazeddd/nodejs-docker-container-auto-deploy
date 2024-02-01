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

    .post('/create-container', (req, res) => {

    //FOR TESTING ONlY

    console.log('Received POST request with body:', req.body);

    const serverName = req.body.username;

    if (!serverName) {
        res.status(400).send('Server name reqired');
        return;
    }

    DockerModules.makeContainer(serverName);

    //containerId = serverName.container.Id
    res.redirect('/pannel');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});