const Docker = require("dockerode");
const fs = require("fs");
const path = require('path');
//const dockerSocketPath = require('./checkOs.js')

const containersPath = path.join(__dirname, '../../containers.json');

var docker = new Docker();

exports.stopContainer = async (req, res) => {
  let containerId = req.body.id;
  let container = docker.getContainer(containerId);
  container.stop((err) => {
    if (err) {
      res.status(500).json(`Failed to stop container ${containerId}`);
      console.error(`Error when stopping ${containerId} (${err})`);
    } else {
      res.status(200).json(`Successfully stopped container ${containerId}`);
      console.log(`Successfully stopped ${containerId}`);
    }
  });
};

exports.startContainer = async (req, res) => {
  let containerId = req.body.id;
  let container = docker.getContainer(containerId);
  container.start((err) => {
    if (err) {
      res.status(500).json(`Failed to start container ${containerId}`);
      console.error(`Error when starting ${containerId} (${err})`);
    } else {
      res.status(200).json(`Successfully started container ${containerId}`);
      console.log(`Successfully started ${containerId}`);
    }
  });
};

exports.buildContainer = async (req, res) => {
  for (let input in req.body) {
    if (input == null) {
      return res.status(500).json("Please fill out all the inputs");
    }
  }
  const containerConfig = {
    Image: req.body.image,
    name: req.body.name,
    ExposedPorts: {
      [`${req.body.port}/${req.body.protocol}`]: {},
    },
    HostConfig: {
      PortBindings: {
        [`${req.body.port}/${req.body.protocol}`]: [
          { HostPort: req.body.port },
        ],
      },
    },
    Env: [req.body.env],
  };

  console.log(containerConfig);

  docker.createContainer(containerConfig, (err, container) => {
    if (err) {
      res.status(500).json(`Failed to create container`);
      console.error("Error creating container: ", err);
    } else {
      container.start((startErr) => {
        if (startErr) {
          console.error("Error starting container: ", startErr);
        } else {
          res
            .status(200)
            .json(`Container ${container} created and started successfully!`);
          console.log(
            `Container ${container} created and started successfully!`
          );
        }
      });
    }
  });
};

exports.appendContainers = async (req, res) => {
  try {
    let containers = JSON.parse(
      fs.readFileSync(containersPath, { encoding: "utf8" })
    );
    const containerList = await docker.listContainers({ all: true });
    const savedContainers = containers.map((container) => container.id);

    let caughtNewContainer = false;
    for (const containerInfo of containerList) {
      if (!savedContainers.includes(containerInfo.Id)) {
        let container = {
          id: containerInfo.Id,
          image: containerInfo.Image,
          names: containerInfo.Names,
          status: containerInfo.State,
        };

        containers.push(container);
        caughtNewContainer = true;
        if (caughtNewContainer) {
          try {
            fs.writeFileSync(
              containersPath,
              JSON.stringify(containers)
            );
          } catch (err) {
            console.error(
              `Error appending container: ${containerInfo.Names[0]}`,
              err
            );
            res
              .status(500)
              .json(`Error appending container: ${containerInfo.Names[0]}`);
            return;
          }
        }
        console.log(`Found and appended container: ${containerInfo.Names[0]}`);
        res
          .status(200)
          .json(`Found and appended container: ${containerInfo.Names[0]}`);
      }
    }
  } catch (err) {
    console.error("Error processing containers:", err);
    res.status(500).json("Error processing containers");
  }
};

/*async function displayContainers() {
    try {
        fs.writeFileSync('public/views/containers.pug', '');

        for (let container of containers) {

            var containerInfo = docker.getContainer(container.id)
            //cpuMax = ,
            //cpuMin = ,
            //ramMax = ,
            //ramMin = ,
            ramUsage = 1;
            cpuUsage = 1;

            const html = '\n' + `.container.${container.id}
            .container-items.name
              p.name-cont ${container.names}
              button.containerReq.stop(id="${container.id}",
                onclick="containerReq(this.classList[1], this.id)"
              )
                svg.run(xmlns="http://www.w3.org/2000/svg", viewBox="0 0 384 512")
                  path(
                    d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
                  )
            .container-items.image
              p ${container.image}
            .container-items.directory
              p ${container.dir}
            .container-items.usage
              p RAM: ${ramUsage}
              p CPU: ${cpuUsage}
            .container-items
              .status.${container.status}`

            fs.appendFileSync('public/views/containers.pug', html, function (err) {
                if (err) {
                    console.error('Error appending container:', err);
                    reject(new Error('Could not append container'));
                } else {
                    console.log('Appended container');
                }
            });
        }
        console.log('Succesfully displayed containers');
    } catch (error) {
        console.error('Could not display containers: ', error);
    }
}*/

//FOR TESTING
/*async function removeStoppedContainers() {
    const containers = await docker.listContainers({ all: true });
    for (const containerInfo of containers) {
        if (containerInfo.State === 'exited') {
            const container = docker.getContainer(containerInfo.Id);
            try {
                await container.remove();
                console.log(`Removed container: ${containerInfo.Names[0]}`);
            } catch (err) {
                console.error(`Error removing container: ${containerInfo.Names[0]}`, err);
            }
        }
    }
}*/

exports.containerState = (req, res) => {
  let containerId = req.body.id;
  let container = docker.getContainer(containerId);
  return container.State;
};
