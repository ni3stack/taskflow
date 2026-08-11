import LoginForm from "../componenets/LoginForm";
import "../styles/auth.css";

function LoginPage() {

  return (
    <main className="auth-page">
      <div className="auth-content">
        <header className="auth-header">
            <h1>Log in to TaskFlow</h1>
            <p>Connect to TaskFlow with:</p>
        </header>

        <div className="oauth-options">
            <button type="button">Google</button>
            <button type="button">GitHub</button>
        </div>

        <div className="oauth-divider">
          <span>Or continue with</span>
        </div>
        <LoginForm />
        <div className="signup-prompt">
            <p>New to Taskflow ?<a href="/signup">Sign up for an account</a></p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage