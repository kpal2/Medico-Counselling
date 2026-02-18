import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="appShell">
      <Navbar />
      <main className="pageWrap">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
