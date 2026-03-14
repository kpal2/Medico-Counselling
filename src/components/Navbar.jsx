import { Link } from "react-router-dom";
import { useState } from "react";
import RouteLinks from "./RouteLinks";
import AuthModal from "./AuthModal";
import { useAuth } from "../hooks/auth-context";

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, supabase, loading } = useAuth();

  const identityLabel = user?.user_metadata?.full_name || user?.email || user?.phone || "Account";

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  return (
    <>
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
            {loading ? (
              <span className="authStatus">Checking session...</span>
            ) : user ? (
              <>
                <span className="authStatus" title={identityLabel}>{identityLabel}</span>
                <button className="linkBtn" type="button" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <button className="linkBtn" type="button" onClick={() => setIsAuthOpen(true)}>Sign In</button>
            )}
            <button className="primaryBtn" type="button" onClick={() => setIsAuthOpen(true)}>
              {user ? "Account" : "Get Premium Access"}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
