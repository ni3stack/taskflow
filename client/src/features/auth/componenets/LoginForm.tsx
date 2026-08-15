import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login } from "../api/authApi";
import { useAppDispatch } from "../../../app/hook";
import { setCredentials } from "../authSlice";

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
      const currentUser = await getCurrentUser(response.token);

      dispatch(setCredentials({
        token: response.token,
        user: currentUser.user
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
          <label htmlFor="email">Email</label>
          <input 
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="Enter your email address"
          />
      </div>
      <div className="form-field">
          <div className="password-header">
                <label htmlFor="password">Password</label>
                <a href="/forgot-password">Forgot Password</a>
          </div>
          <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter your password"
          />
      </div>
      {
        error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )
      }
      <button 
        className="btn btn-primary" 
        type="submit"
      >
        { isLoading ? "Loggin in..." : "Log in" }
      </button>
    </form>
  )
}

export default LoginForm;