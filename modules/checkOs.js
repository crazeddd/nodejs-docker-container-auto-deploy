const os = require('os');

function checkOs() {
    let dockerSocketPath;
    if (os.platform() === 'win32') {
        console.log('Detected windows, running on windows socket path')
        dockerSocketPath = '\\\\.\\pipe\\docker_engine'; // Windows path
    } else {
        console.log('Detected linux, running on linux socket path')
        dockerSocketPath = '/var/run/docker.sock'; // Unix/Linux path
    }
}

module.exports = checkOs;