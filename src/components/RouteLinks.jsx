import { NavLink } from "react-router-dom";

const ugLinks = [
  { to: "/medical", label: "UG Home", end: true },
  { to: "/explore", label: "Trends" },
  { to: "/predictor", label: "Predictor" },
  { to: "/cutoff", label: "Cutoffs" },
  { to: "/colleges", label: "Colleges" },
];

const pgLinks = [
  { to: "/pg", label: "PG Home", end: true },
  { to: "/pg/explore", label: "Trends" },
  { to: "/pg/predictor", label: "Predictor" },
  { to: "/pg/cutoff", label: "Cutoffs" },
  { to: "/pg/colleges", label: "Colleges" },
];

const RouteLinks = ({ variant = "ug" }) => {
  const links = variant === "pg" ? pgLinks : ugLinks;

  return (
    <nav className="nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `nav__link ${isActive ? "isActive" : ""}`}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default RouteLinks;
