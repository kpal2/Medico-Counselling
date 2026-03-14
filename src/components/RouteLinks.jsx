import { NavLink } from "react-router-dom";

const RouteLinks = () => {
  return (
    <nav className="nav">
      <NavLink to="/" className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}>
        Home
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}>
        Trends
      </NavLink>
      <NavLink to="/predictor" className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}>
        Predictor
      </NavLink>
      <NavLink to="/cutoff" className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}>
        Cutoffs
      </NavLink>
      <NavLink to="/colleges" className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}>
        Colleges
      </NavLink>
    </nav>
  );
};

export default RouteLinks;
