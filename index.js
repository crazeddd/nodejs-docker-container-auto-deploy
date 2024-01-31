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
              <a href="https://fictional-waddle-q5q4wwr97x3xj7q-3000.app.github.dev/create-container">
              <button>Run Container</button>
              </a>
           </body>
        </html>
        `;
    res.send(html);
});

app.get('/create-container', (req, res) => {
    
    const containerConfig = {
        Image: 'itzg/minecraft-server',
        name: 'users-mc-server'
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
    console.log(`Server is running on port ${ port } `);
});