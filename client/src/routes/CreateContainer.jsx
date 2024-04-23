import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

const apiHost = import.meta.env.VITE_API_HOST;

function Panel() {
  const [data, setData] = useState({});
  let navigate = useNavigate();

  //EVENT HANDLER CODE FROM W3 SCHOOLS NOT MINE
  const handleChange = (event) => {
    const name = event.target.name,
      value = event.target.value;
    setData((values) => ({ ...values, [name]: value }));
  };

  //Fetchs the stop or start containers function via the API
  const sumbitForm = async (self) => {
    self.preventDefault();

    let url = `${apiHost}/docker/build-container`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then((obj) => {
        console.log(obj.body);
        if (obj.status <= 200) {
          navigate('/');
        }
      });
  };

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <form className="widget secondary column" onSubmit={sumbitForm}>
          <h5>Create New Container</h5>
          <br />
          <div className="row">
            <input
              placeholder="Image"
              name="image"
              value={data.image || ''}
              onChange={handleChange}
            />
            <input
              placeholder="Name"
              name="name"
              value={data.name || ''}
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="row">
            <input
              placeholder="Port"
              name="port"
              value={data.port || ''}
              onChange={handleChange}
            />
            <input
              placeholder="Host Port"
              name="host_port"
              value={data.host_port || ''}
              onChange={handleChange}
            />
            <input
              placeholder="Protocol"
              name="protocol"
              value={data.protocol || ''}
              onChange={handleChange}
            />
          </div>
          <br />
          <input
            placeholder="Env, Ex: FOO=TRUE, BAR=FALSE"
            name="env"
            value={data.env || ''}
            onChange={handleChange}
          />
          <br />
          <button className="primary" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="var(--secondary)"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
              />
            </svg>
          </button>
        </form>
        <Footer />
      </main>
    </>
  );
}

export default Panel;
