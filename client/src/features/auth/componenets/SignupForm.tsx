import { useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

function SignupForm() {
  const navigate = useNavigate();
  const [ error, setError ] = useState<string | null>(null);
  const [ isloading, setIsLoading ] = useState(false);
  const [ name, setName ] = useState<string>("");
  const [ emailId, setEmailId ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ confirmPassword, setConfirmPassword ] = useState<string>("");

  const handleSignupSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({
        name,
        password,
        email:emailId,
      });
      navigate("/login");
    } catch(error) {
        setError(
            error instanceof Error
              ? error.message
              : "Unable to create account"
        );
    } finally {
        setIsLoading(false);
    }
  };
  return (
      <form className="auth-form" onSubmit={handleSignupSubmit}>
          <div className="form-field">
              <label htmlFor="name">Name</label>
              <input 
                  id="name"
                  type="text"
                  name="name"
                  value={name} 
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  required
                  autoComplete="name"
              />
          </div>
          <div className="form-field">
              <label htmlFor="emailId">Email</label>
              <input
                  id="emailId"
                  type="email"
                  name="email"
                  value={emailId}
                  autoComplete="email"
                  onChange={(event) => setEmailId(event?.target.value)}
                  placeholder="Enter your Email address" />
          </div>
          <div className="form-field">
              <label htmlFor="password">Password</label>
              <input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  placeholder="Enter your password"
              />
          </div>
          <div className="form-field">
              <label htmlFor="password">Confirm Password</label>
              <input 
                  id="password"
                  type="confirmPassword" 
                  value={confirmPassword} 
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="confirm-password"
                  required
                  placeholder="Enter your password again"
              />
          </div>
          {
              error && (
                  <p className="auth-error" role="alert">{error}</p>
              )
          }
          <div>
              <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={isloading}
              >
                  { isloading ? "Creating account..." : "Create account"}
              </button>
          </div>
      </form>
  )
}

export default SignupForm;