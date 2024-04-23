//React import
import { useState, useEffect } from "react";

import "../index.css";

//.env var
const apiHost = import.meta.env.VITE_API_HOST;

function Containers() {
  const [containers, appendContainers] = useState([]);

  //Fetchs the stop or start containers function via the API
  const updateContainers = (type: string, data: { id: any; }) => {
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
  };

  //Fetchs the appendContainers function via the API
  const fetchContainers = async () => {
    let url = `${apiHost}/docker/refresh`;

    try {
      let res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        let data = await res.json();
        appendContainers(data);
      }
    } catch (err) {
      console.log(`Couldnt refresh containers ${err}`);
    }
  };

  // Updates container state server side
  const changeState = async (self: any) => {
    function getStateById(containers: any[], id: number) {
      var container = containers.find(function (obj: any) {
        return obj.id === id;
      });
      return container ? container.state : null;
    }

    let containerId = self.currentTarget.id;
    let containerState = getStateById(containers, containerId);

    if (containerState == "running") {
      let data = { id: containerId };
      updateContainers("stop", data);
    } else {
      let data = { id: containerId };
      updateContainers("start", data);
    }
  };

  // Play svg
  const play = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
    </svg>
  );

  // Pause svg
  const pause = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
    </svg>
  );

  useEffect(() => {
      fetchContainers();
      const interval = setInterval(fetchContainers, 2000); // Poll every 2 seconds
      return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <>
      <div className="servers column">
        {containers.map(
          // Map each container in the containers json obj
          (container : any, index : number) => (
            <div className="server widget secondary row" key={index}>
              <div className="row">
                <button
                  onClick={changeState}
                  className="circle secondary"
                  id={container.id}
                >
                  {container.state == "running" ? pause : play}
                </button>
                <div className="center">
                  <h5>{container.names}</h5>
                  <small className="muted">{container.image}</small>
                </div>
              </div>
              <div className="center">
                <svg
                  className={container.state}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M576 0c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V32c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7 14.3-32 32-32zM352 224V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32zM96 416v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V416c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
                </svg>
              </div>
            </div>
          )
        )}
        {containers.length == 0 && ( //If no containers present
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
