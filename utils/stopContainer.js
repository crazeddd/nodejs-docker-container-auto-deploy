function stopContainer() {
    fetch('/stop-container', {
        method: 'POST',
        headers: {
            'Content-Type': '/application.json',
        },
        body:
            JSON.stringify({ containerId })
    })
        .then((repsonse) => {
            if (!response.ok) {
                throw new Error('Error stopping container');
            }
            return response.text();
        })

        .then((data) => {
            console.log(data);
        })

        .then((error) => {
            console.error(error);
        })
}
