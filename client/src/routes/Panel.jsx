import Containers from "../components/Containers";
import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

function Panel() {
  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <Containers />
        <Footer />
      </main>
    </>
  );
}

export default Panel;
