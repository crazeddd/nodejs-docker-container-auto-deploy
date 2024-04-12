//import { useState } from 'react'

function Containers() {
  //const [count, setCount] = useState(0)

  const containerIdInput = document.getElementById("containerId");

  function stopContainer() {
    var containerId = containerIdInput.textContent;

    fetch('https://solid-pancake-57qrww64ggf4w44.github.dev/docker/stop', {
      method: 'POST',
      body: containerId,
    })
    .then((response) => {
      console.log("response.headers =", response.headers);
      return response.blob();
    })
    .then(data => {
      console.log(data);
    });
  };

  return (
    <>
      <button onClick={stopContainer}>Stop Container</button>
    </>
  )
};

export default Containers

