function containerReq(reqType) {
    const containerName = document.getElementById('containerName').value;
    var status = document.getElementById("status");

    console.log(`Passing ${reqType} request for ${containerName}...`);

    const data = {
        id: containerName,
        type: reqType,
    }

    const req = fetch('/containerReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            status.textContent = data.message;
        })
};

//create-server.js

function createContainer() {
    const containerName = document.getElementById('containerName').value,
    ports = document.getElementById('ports').value;

    var status = document.getElementById("status");

    const data = {
        id: containerName,
        ports: ports,
    }

    const req = fetch('/containerReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            status.textContent = data.message;
        })

}