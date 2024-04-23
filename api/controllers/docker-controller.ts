//Npm Imports
const Docker = require("dockerode");
const fs = require("fs");
var path = require("path");

const containersPath = path.join(__dirname, "../../containers.json");

var docker = new Docker(); //Create a new instance of dockerode

exports.stopContainer = async (req, res) => {
  let containerId = req.body.id; //Gets the id body elem
  let container = docker.getContainer(containerId); //Gets the container from id
  container.stop((err) => {
    //Attempts to stop container
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
  let containerId = req.body.id; //Gets the id body elem
  let container = docker.getContainer(containerId); //Gets the container from id
  container.start((err) => {
    //Attempts to start container
    if (err) {
      res.status(500).json(`Failed to start container ${containerId}`);
      console.error(`Error when starting ${containerId} (${err})`);
    } else {
      res.status(200).json(`Successfully started container ${containerId}`);
      console.log(`Successfully started ${containerId}`);
    }
  });
};

exports.refreshContainers = async (req, res) => {
  let containers : any[] = [];
  try {
    const containerList = await docker.listContainers({ all: true }); //Grabs a list of all running containers

    for (const containerInfo of containerList) {
      //For each container found
      let container = {
        //Gets container id, image, names, and state
        id: containerInfo.Id,
        image: containerInfo.Image,
        names: containerInfo.Names,
        state: containerInfo.State,
      };

      containers.push(container);
    }
    res.json(containers);
  } catch (err) {
    console.error("Error processing containers:", err);
    res.status(500).json("Error processing containers");
  }
};

exports.buildContainer = async (req, res) => {
  for (let input in req.body) {
    //Tests all input fields to assure they're filled
    if (input == null) {
      return res.status(500).json("Please fill out all the inputs");
    }
  }
  const containerConfig = {
    //Creates container config based on user inputs
    Image: req.body.image,
    name: req.body.name,
    ExposedPorts: {
      [`${req.body.port}/${req.body.protocol}`]: {},
    },
    HostConfig: {
      PortBindings: {
        [`${req.body.port}/${req.body.protocol}`]: [
          { HostPort: req.body.host_port },
        ],
      },
    },
    Env: [req.body.env],
  };

  console.log(containerConfig);

  docker.createContainer(containerConfig, (err, container) => {
    //Attempts to create container
    if (err) {
      res.status(500).json(`Failed to create container ${err}`);
      console.error(`Error creating container: ${err}`);
    } else {
      container.start((startErr) => {
        //After successfully creating container attempts to start container
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
