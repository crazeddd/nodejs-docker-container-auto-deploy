// Install necessary Node.js packages:
// npm install express dockerode

const express = require('express');
const Docker = require('dockerode');
const app = express();
const port = 3000;

const docker = new Docker();

app.get('/', (req, res) => {

    const html = `
        <html>
          <head>
            <title>hehe</title>
            </head>
            <body>
            <h1>Container</h1>
           
           </body>
        </html>
        `;

    res.send(html);
});

app.get('/create-container', (req, res) => {
    // You can replace this with logic to generate container configurations dynamically.
    const containerConfig = {
        Image: 'ubuntu:latest',
        Cmd: ['echo', 'Hello, World!'],
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
                    res.status(200).send('Container created and started successfully');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${ port } `);
});