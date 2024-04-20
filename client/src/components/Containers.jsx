import { useState } from 'react';

import containers from '../../../containers.json';

import '../index.css'

const apiHost = import.meta.env.VITE_API_HOST;

function Containers() {
  const [isActive, setIsActive] = useState(false);

  function dockerPostReq(type, data) {
    let url = `${apiHost}/docker/${type}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error:", err));
  }

  function dockerGetReq(type) {
    let url = `${apiHost}/docker/${type}`;

    fetch(url, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error:", err));
  }

  dockerGetReq('refresh');

  const containerState = async () => {
    await dockerGetReq('state')
    if (dockerGetReq == 'running') {
      return('running');
    } else if (dockerGetReq == 'exited') {
      return('exited');
    }
  }

  const reqContainer = async (self) => {
    setIsActive(current => !current);
    if (isActive) {
      let data = { id: self.currentTarget.id };
      dockerPostReq('stop', data);
    } else {
      let data = { id: self.currentTarget.id };
      dockerPostReq('start', data);
    }
  };

  return (
    <>
      <div className="servers column">
        {containers.map((container, index) => (
          <div className="server widget secondary row" key={index}>
            <div className="row">
              <button
                onClick={reqContainer}
                id={container.id}
                className="circle secondary"
                style={{ fill: isActive ? 'red' : '' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                </svg>
              </button>
              <div className="center">
                <h5>{container.names}</h5>
                <small className="muted">{container.image}</small>
              </div>
            </div>
            <div className="center">
            <svg
              className={containerState}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M576 0c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V32c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7 14.3-32 32-32zM352 224V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32zM96 416v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V416c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
            </svg>
            </div>
          </div>
        ))}
        {containers.length == 0 && (
          <div className="server widget secondary row">
            <p className="muted">
              Its looking a bit empty in here, why not create a container?
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Containers;

/*<div key={index}>
<div>{container.name}</div>
<div>{container.image}</div>
<div className={container.status}></div>
<button onClick={stopContainer} id={container.id}>Stop Container</button>
<button onClick={startContainer} id={container.id}>Start Container</button>
</div>*/
