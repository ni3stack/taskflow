import { Link } from "react-router-dom";
import OAuthButtons from "../componenets/OAuthButtons";
import OAuthDivider from "../componenets/OAuthDivider";
import SignupForm from "../componenets/SignupForm";

function SignupPage() {
    return (
        <div className="auth-page">
            <div className="auth-content">
                <header className="auth-header">
                    <h1>Create your TaskFlow account</h1>
                    <p>Get started with Taskflow</p>
                </header>

                <SignupForm />

                <OAuthDivider />

                <OAuthButtons />

                <p className="signup-prompt">
                    Already have an account ? {" "}
                    <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default SignupPage;