import { Link } from "react-router-dom";
import "./PublicFooter.css";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <p className="public-footer__tagline">
          Taskflow . Your task today. Your team tomorrow.
        </p>

        <div className="public-footer_nav">
          <nav 
            className="public-footer__nav"
            aria-label="Footer navigation"
          >
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/login">Sign in</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}