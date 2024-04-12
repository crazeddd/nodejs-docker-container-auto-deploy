exports.stopContainer = async (req, res) => {
    console.log('stopededh');
    var containerId = req.body;
    const container = docker.getContainer(containerId);
    container.stop((err) => {
        if (err) {
            res.json({ message: 'Failed to stop container' });
            console.error(`Error when stopping ${containerId}`)
        } else {
            res.json({ message: 'Successfully stopped container' });
            console.log(`Successfully stopped ${containerId}`);
        }
    });
}