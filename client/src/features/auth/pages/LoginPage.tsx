import { Link } from "react-router-dom";
import LoginForm from "../componenets/LoginForm";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import "../styles/auth.css";

function LoginPage() {

  return (
    <main className="auth-page">
      <div className="auth-content">
        <header className="auth-header">
            <h1>Log in to TaskFlow</h1>
            <p>Connect to TaskFlow with:</p>
        </header>

        <OAuthButtons />

        <OAuthDivider />

        <LoginForm />
        <p className="signup-prompt">
          New to Taskflow ? <Link to="/signup">Sign up for an account</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage