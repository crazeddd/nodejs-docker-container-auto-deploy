const express = require('express');
const Docker = require('dockerode');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var docker = new Docker();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const html = `
        <html>
          <head>
             <title>hehe</title>
          </head>
            <body>
            <h1>Make Container</h1>
            <form action="/create-container" method="post">
            <label for="username">Server name:</label>
            <input type="text" id="username" name="username" required>
            <button type="submit">Create Container</button>
            </form>
           </body>
        </html>
        `;
    res.send(html);
});

app.post('/create-container', (req, res) => {
    console.log('Received POST request with body:', req.body);

    const serverName = req.body.username;

    console.log(serverName);

    if (!serverName) {
        res.status(400).send('Server name reqired');
        return;
    }

    const containerConfig = {
        Image: 'itzg/minecraft-server', //An example image
        name: serverName,
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
                    res.status(200).send('');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});