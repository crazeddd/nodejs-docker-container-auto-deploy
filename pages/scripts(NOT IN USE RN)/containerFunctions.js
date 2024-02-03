document.getElementById('stopContainerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    console.log("Received stop request");
    const containerName = document.getElementById('containerName').value;

    var status = getElementById('status');
    console.log(containerName);

    const res = fetch('/stop-container', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({ containerName })
    })

        .then(res => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error('Error stopping container');
            }
        })
        .then(data => {
            status.textContent = data;
        });
});