function serverReq(reqType) {
    const containerName = document.getElementById('containerName').value;
    var status = document.getElementById('status');

    console.log(`Passing ${reqType} request for ${containerName}...`);

    const data = {
        id: containerName,
        type: reqType,
    }

    const res = fetch('/containerReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

        .then(res => res.json()) 
        .then(data => {
            if (res.ok) {
                console.log(data.message);
                status.textContent = 'Running';
            } else {
                throw new Error('Error stopping container');
            }
        });
};