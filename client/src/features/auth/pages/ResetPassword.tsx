import { Banner, Button, Input } from "@ni3stack/ui";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom"
import type { SubmitEvent } from "react";
import { resetPassword } from "../api/authApi";
import { ArrowLeft, CheckIcon, LockIcon } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ passwordError, setPasswordError] = useState("");
  const [ formError, setFormError] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ resetSuccessful, setResetSuccessful ] = useState(false);

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
      if (response) {
        setResetSuccessful(true);
      }
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
    <div className="auth-page auth-page--single">
      { !resetSuccessful ? (
        <section className="auth-page__form-section">
          <div className="icon-container">
            <LockIcon size={24} aria-hidden="true" />
          </div>
          <header className="auth-page__form-header">
            <h2 
              id="reset-password-heading"
              className="auth-page__title"
            >
              Reset your password
              </h2>
            <p className="auth-page__description">
              Choose a new password for your account.
            </p>
          </header>
          {formError && (
            <div className="pb-4">
              <Banner variant="error">
                {formError}
              </Banner>
            </div>
          )}
          <form className="auth-page__form" onSubmit={handlePasswordUpdate}>
            <div className="auth-page__form-field">
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
            <div className="auth-page__form-field">
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
            <div className="auth-page__form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
              <Link 
                to="/forgot-password" 
                className="action action--ghost"
              >
                Request a new reset link
              </Link>
            </div>
          </form>
        </section>
      ) : (
         <section className="auth-page__form-section">
          <div className="icon-container icon-container--success">
            <CheckIcon size={20} aria-hidden="true" />
          </div>
          <header className="auth-page__form-header">
            <h2 
              id="reset-password-heading"
              className="auth-page__title"
            >
              Password updated
              </h2>
            <p className="auth-page__description">
              Your password has been reset successfully. 
              You can now sign in with your new password.
            </p>
          </header>
          <div className="auth-page__form-actions">
            <Link to="/login" className="action action--primary">
              <ArrowLeft size={16} aria-hidden="true"></ArrowLeft>
              <span>Back to sign in</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}