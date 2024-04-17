//import { useState } from 'react';
//require('dotenv').config();

import containers from '../containers.json';

//const apiHost = process.env.REACT_APP_API_HOST;

function Containers() {
  //const [count, setCount] = useState(0);

  function containerPostReq(type, data) {
    let url = `https://solid-pancake-57qrww64ggf4w44-8080.app.github.dev/docker/${type}`;

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
    containerPostReq('stop', this.parentNode.nodeName.id);
  };

  function startContainer() {
    containerPostReq('start', this.parentNode.nodeName.id);
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