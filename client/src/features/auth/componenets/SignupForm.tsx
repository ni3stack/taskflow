import { useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { Banner, Button, Input } from "@ni3stack/ui";

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
        <Input 
          id="name"
          type="text"
          label="Name"
          value={name} 
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
          autoComplete="name"
        />
      </div>
      <div className="form-field">
        <Input
          id="emailId"
          type="email"
          label="Email"
          value={emailId}
          autoComplete="email"
          onChange={(event) => setEmailId(event?.target.value)}
          placeholder="Enter your Email address" />
      </div>
      <div className="form-field">
        <Input 
          id="password"
          type="password" 
          value={password} 
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
          showPasswordToggle
          placeholder="Enter your password"
          helperText="password must contain upper case, lower case and a special character."
        />
      </div>
      <div className="form-field">
        <Input 
          id="password"
          type="confirmPassword" 
          value={confirmPassword} 
          label="Confirm Password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="confirm-password"
          required
          showPasswordToggle
          placeholder="Enter your password again"
        />
      </div>
      {
        error && (
          <Banner variant="error">{error}</Banner>
        )
      }
      <Button 
        className="tsx-btn-primary" 
        type="submit"
        disabled={isloading}
      >
        { isloading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

export default SignupForm;