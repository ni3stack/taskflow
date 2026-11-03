import { Link, NavLink } from "react-router-dom";
import "./PublicHeader.css";


export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link to="/" className="public-header__logo">
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span className="public-header__brand-name">TaskFlow</span>
        </Link>
        <nav className="public-header__nav" aria-label="Primary navigation">
          <NavLink to="/features" className="public-header__nav-link">
            Features
          </NavLink>
          <NavLink to="/pricing" className="public-header__nav-link">
            Pricing
          </NavLink>
          <NavLink to="/login" className="public-header__sign-in">
            Sign in
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
