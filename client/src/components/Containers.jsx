//import { useState } from 'react'

function Containers() {
  //const [count, setCount] = useState(0);

  const containerIdInput = document.getElementById("containerId");

  function stopContainer() {
    let data = containerIdInput.value;
    let url = `${process.env.API_HOST}/docker/stop`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify({
        id: data
      })
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <>
      <button onClick={stopContainer}>Stop Container</button>
    </>
  )
};

export default Containers;