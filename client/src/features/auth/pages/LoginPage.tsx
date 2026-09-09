import { Link } from "react-router-dom";
import LoginForm from "../componenets/LoginForm";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import "../styles/auth.css";
import { Card, CardContent, CardHeader } from "@ui-lab/ui";

function LoginPage() {

  return (
    <main className="auth-page">
      <div className="auth-content">
        <Card>
          <CardHeader>
            <h2>Welcome back</h2>
            <p>Sign in to continue to TaskFlow.</p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <OAuthDivider />
            <OAuthButtons />
            <p className="signup-prompt">
              New to Taskflow ? <Link to="/signup">Sign up for an account</Link>
            </p>
           </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage