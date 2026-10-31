import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LoginForm from "../componenets/LoginForm";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import { AuthPageBanner } from "../componenets/AuthPageBanner";

import "../styles/auth.css";

function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <section 
          className="auth-page__form-section"
          aria-labelledby="sign-in-heading"
        >
          <header className="auth-page__form-header">
            <h1 id="sign-in-heading" className="auth-page__title">Welcome back.</h1>
            <p className="auth-page__description">Sign in to continue to Taskflow.</p>
          </header>
          <LoginForm />
          <OAuthDivider />
          <OAuthButtons />
          <p className="auth-page__navigation">
            <span>New to TaskFlow ?</span>
            <Link to="/signup" className="action action--ghost">
              Get started for free
              <ArrowRight size={16} aria-hidden="true"/>
            </Link>
          </p>
        </section>
        <AuthPageBanner />
      </div>
    </div>
  );
}

export default LoginPage