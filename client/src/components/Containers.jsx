//import { useState } from 'react'
//require('dotenv').config();

import containers from '../containers.json'

function Containers() {
  //const [count, setCount] = useState(0);

  function containerReq(type, data) {
    let url = `http://localhost:8080/docker/${type}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data
      })
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
  };

  function stopContainer() {
    containerReq('stop', '656');
  };

  function startContainer() {
    containerReq('start', '656');
  };

  return (
    <>
      {containers.map((container, index) => (
        <div key={index} id={container.id}>
          <div>{container.name}</div>
          <div>{container.image}</div>
          <div class={container.status}></div>
          <button onClick={stopContainer}>Stop Container</button>
          <button onClick={startContainer}>Start Container</button>
        </div>
      ))}
    </>
    )
};

export default Containers;