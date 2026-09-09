import { Banner, Button, Card, CardContent, CardHeader, Input } from "@ui-lab/ui";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import type { SubmitEvent } from "react";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ passwordError, setPasswordError] = useState("");
  const [ formError, setFormError] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handlePasswordUpdate = async(
    e: SubmitEvent<HTMLFormElement>
  ):Promise<void> => {
    e.preventDefault();

    setPasswordError("");
    setFormError("");

    if (!token) {
      setFormError("Invalid or missing password reset link");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Password and confirm password do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword({ token, password });
      console.log(response.message);
      navigate("/login");
    }catch (error) {
      if(error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Unable to reset password");
      }
    }finally {
      setIsSubmitting(false);
    }
    
  }
  return (
    <div className="auth-page">
      <div className="auth-content">
        <Card>
          <CardHeader>
            <h2>Reset your password</h2>
            <p>Choose a new password for your account.</p>
          </CardHeader>
          <CardContent>
            {
              formError && (
              <Banner variant="error">{formError}</Banner>
              )
            }
            <form className="auth-form" onSubmit={handlePasswordUpdate}>
              <div className="form-field">
                <Input 
                  type="password"
                  label="New password"
                  value={password}
                  showPasswordToggle
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="password must contain upper case, lower case and a special character."
                />
              </div>
              <div>
                <Input
                  type="password"
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordError}
                  showPasswordToggle
                  required
                />
              </div>
               <div className="form-actions">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update password"}
                  </Button>
                  <div className="signup-prompt">
                    <Link to="/forgot-password">Request a new reset link</Link>
                  </div>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}