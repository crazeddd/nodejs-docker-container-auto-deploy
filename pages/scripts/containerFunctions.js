function containerReq(reqType, id) {
    var status = document.getElementById("status");
    var res = document.getElementById("res");

    console.log(`Passing ${reqType} request for ${id}...`);

    const data = {
        id: id,
        type: reqType,
    }

    const req = fetch('/containerReq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

        .then(res => res.json())
        .then(data => {
            res.textContent = data.message;
            console.log(data.message);
        });

};

//create-server.js

/*function createContainer() {
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

} */