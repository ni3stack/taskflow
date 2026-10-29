import { Link } from "react-router-dom";
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
          <Link to="/features" className="public-header__nav-link">
            Features
          </Link>
          <Link to="/pricing" className="public-header__nav-link">
            Pricing
          </Link>
          <Link to="/login" className="public-header__sign-in">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
