import { Link } from "react-router-dom";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import SignupForm from "../componenets/SignupForm";
import { Card, CardContent, CardHeader } from "@ui-lab/ui";

function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-content">
        <Card>
          <CardHeader>
            <h2>Create your TaskFlow account</h2>
            <p>Get started with Taskflow</p>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <OAuthDivider />
            <OAuthButtons />
            <p className="signup-prompt">
              Already have an account ? {" "}
              <Link to="/login">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage;