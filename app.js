const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const DockerModules = require('./modules/DockerModules.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('pages'));
app.set('view engine', 'pug');

app
    .get('/', (req, res) => {
        res.render(__dirname + '/index.pug');
    })

    .get('/panel', async (req, res) => {
        try {
            await DockerModules.appendContainers();
            await DockerModules.displayContainers();
            res.render(__dirname + '/pages/panel.pug');
        } catch (error) {
            console.error(error);
        }
    })

    .get('/create-container', async (req, res) => {
        res.render(__dirname + '/pages/create-container.pug');
    })

    .post('/build-container', async (req, res) => {
        //Testing
        await DockerModules.removeStoppedContainers();

        const configVars = [
            containerName = req.body.containerName,
            image = req.body.image,
            containerPort = req.body.port,
            protocol = req.body.protocol,
            directory = req.body.directory,
            env = req.body.env
        ];

        if (!containerName) {
            res.status(400).send('Container name reqired');
            return;
        }

        if (!image) {
            res.status(400).send('Container image reqired');
            return;
        }

        try {
            let message = await DockerModules.makeContainer(...configVars);
            await DockerModules.appendContainers();

            //res.status(201).send({ message: message });
            res.redirect('/panel');
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    .get('/append-containers', async (req, res) => {
        try {
            let message = await DockerModules.appendContainers();
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    /*.get('/display-containers', async (req, res) => {
        try {
            let message = DockerModules.displayContainers();
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })*/

    .post('/containerReq', async (req, res) => {
        const id = req.body.id,
            reqType = req.body.type;

        if (!id) {
            res.json({ message: "Container name required" });
            return;
        }

        console.log(`New inbound ${reqType} request from ${id}`);

        try {
            //WILL REPLACE EVAL SOON
            let message = await eval(`DockerModules.${reqType}Container(id)`);

            res.status(200).json({ message: message });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});