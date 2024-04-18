import containers from '../../../containers.json';

const apiHost = import.meta.env.VITE_API_HOST;

function Containers() {

  function dockerPostReq(type, data) {
    let url = `${apiHost}/docker/${type}`;

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
  };

  const stopContainer = (self) => {
    let data = {"id": self.currentTarget.id}
    dockerPostReq('stop', data);
  };

  const startContainer = (self) => {
    let data = {"id": self.currentTarget.id}
    dockerPostReq('start', data);
  };

  return (
    <>
      {containers.map((container, index) => (
        <div key={index}>
          <div>{container.name}</div>
          <div>{container.image}</div>
          <div className={container.status}></div>
          <button onClick={stopContainer} id={container.id}>Stop Container</button>
          <button onClick={startContainer} id={container.id}>Start Container</button>
        </div>
      ))}
    </>
    )
};

export default Containers;