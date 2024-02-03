//const { json, response } = require("express");

document.getElementById('stopContainerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    console.log("Received stop request");

    const containerName = document.getElementById('containerName').value;
        const res = fetch('/stop-container', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                json.stringify({ "containerName": "containerName" })
        });

        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Error stopping container');
        }
    });