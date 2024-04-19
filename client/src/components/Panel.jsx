import Containers from "./Containers";
import Nav from "./Nav";
import NavTop from "./NavTop";
import Footer from "./Footer";

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
