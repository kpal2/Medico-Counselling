import { Link } from "react-router-dom";
import RouteLinks from "./RouteLinks";

const Navbar = () => {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link to="/" className="brand">
          <span className="brand__logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7c-2.2 0-4 1.8-4 4v2c0 4.4 3.6 8 8 8h2c2.2 0 4-1.8 4-4v-2c0-4.4-3.6-8-8-8H7Z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M17 7h0.8A3.2 3.2 0 0 1 21 10.2v3.6A3.2 3.2 0 0 1 17.8 17H17"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.65"
              />
            </svg>
          </span>
          <span className="brand__name">MediCounsel</span>
        </Link>

        <RouteLinks />

        <div className="topbar__right">
          <span className="authStatus">Public beta</span>
          <button className="primaryBtn primaryBtn--disabled" type="button" disabled>
            Premium Coming Soon
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
