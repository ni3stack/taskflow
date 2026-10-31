import { Link } from "react-router-dom";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import SignupForm from "../componenets/SignupForm";
import { AuthPageBanner } from "../componenets/AuthPageBanner";
import "../styles/auth.css";
import { ArrowRight } from "lucide-react";

function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <section
          className="auth-page__form-section"
          aria-labelledby="sign-up-heading"
        >
          <header className="auth-page__form-header">
            <h2 id="sign-in-heading" className="auth-page__title">
              Get started with Taskflow
            </h2>
            <p className="auth-page__description">
              Create your TaskFlow account
            </p>
          </header>
          <SignupForm />
          <OAuthDivider />
          <OAuthButtons />
          <p className="auth-page__navigation">
            <span>Already have an account ?</span>
            <Link to="/login" className="action action--ghost">
              Log in
              <ArrowRight size={16} aria-hidden="true"/>
            </Link>
          </p>
        </section>
        <AuthPageBanner />
      </div>
    </div>
  )
}

export default SignupPage;