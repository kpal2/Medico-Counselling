import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const Layout = ({ children }) => {
  return (
    <div className="appShell">
      <ScrollToTop />
      <Navbar />
      <main className="pageWrap">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
