import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { 
  Banner, 
  Button,
  Input
} from "@ni3stack/ui";
import { forgotPassword } from "../api/authApi";
import "../styles/auth.css";
import { AuthPageBanner } from "../componenets/AuthPageBanner";
import { ArrowLeft, MailIcon } from "lucide-react";

export  default function ForgotPassword() {
  const [ email, setEmail ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ isLinkSent, setIsLinkSent ] = useState(false);
  const [ formError, setFormError ] = useState("");


  const handleSubmit = async(e:SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError("");
    setIsSubmitting(true);

    try {
      await forgotPassword({ email })
      setIsLinkSent(true);
    }catch(error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Unable to process your request");
      }
    }finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        { !isLinkSent ? 
          (<section
            className="auth-page__form-section auth-page__form-section-centered"
            aria-labelledby="forgot-password"
          >
            <header className="auth-page__form-header">
              <h2 id="forgot-password" className="auth-page__title">Forgot your password?</h2>
              <p className="auth-page__description">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </header>

            {formError && (
              <div className="pb-4">
                <Banner variant="error">
                  {formError}
                </Banner>
              </div>
            )}
            <form className="auth-page__form" onSubmit={handleSubmit}>
              <div className="auth-page__form-field">
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="auth-page__form-actions">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
                <Link to="/login" className="action action--ghost">Back to sign in</Link>
              </div>
            </form> 
          </section>
        ) :
          (
          <section 
            className="auth-page__form-section auth-page__form-section-centered"
            aria-labelledby="reset-confirmation-heading"
          >
            <div className="icon-container">
              <MailIcon size={24} aria-hidden="true" />
            </div>
            <header className="auth-page__form-header">
              <h1 id="reset-confirmation-heading"
                className="auth-page__title">
                  Check your inbox
              </h1>
              <p className="auth-page__description">
                If an account exists for this email address, you'll receive an email
                with instructions to reset your password.
              </p>
              <p className="auth-page__description">
                Check your spam folder if you don't see the email.
              </p>
            </header>

            <div className="auth-page__form-actions">
              <Link to="/login" className="action action--primary">
                <ArrowLeft size={16} aria-hidden="true"></ArrowLeft>
                <span>Back to sign in</span>
              </Link>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEmail("");
                  setFormError("");
                  setIsLinkSent(false);
                }}
                className="auth-page__retry"
              >
                Try another email
              </Button>
            </div>
          </section>
          )
        }
        <AuthPageBanner />
      </div>
    </div>
  )
}