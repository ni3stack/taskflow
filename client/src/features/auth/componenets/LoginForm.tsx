import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, login } from "../api/authApi";
import { useAppDispatch } from "../../../app/hook";
import { setCredentials } from "../authSlice";
import { Button, Input } from "@ui-lab/ui";

function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState<string|null>(null);

  const handleSubmit = async (event:SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({
        email,
        password
      });

      sessionStorage.setItem("accessToken", response.token);
      const currentUser = await getCurrentUser(response.token);

      dispatch(setCredentials({
        token: response.token,
        user: currentUser.user,
      }));
      navigate("/dashboard");
    } catch (error){
      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="Enter your email address"
        />
      </div>
      
      <div className="form-field">
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          showPasswordToggle
          placeholder="Enter your password"
        />
        <p className="signup-prompt">
          <Link to="/forgot-password">Forgot Password</Link>
        </p>
      </div>
      {
        error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )
      }
      <Button 
        className="tsk-btn-primary" 
        type="submit"
      >
        { isLoading ? "Loggin in..." : "Log in" }
      </Button>
    </form>
  )
}

export default LoginForm;