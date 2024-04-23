import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

function Support() {
  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div>
          <h5>If you need help please refer to the readme!</h5>
          <br/>
          <p className="muted"><i>In deployment this would be a support page</i></p>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default Support;
