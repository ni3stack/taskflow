import { Banner, Button, Card, CardContent, CardHeader, Input } from "@ui-lab/ui";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

export  default function ForgotPassword() {
  const [ email, setEmail ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ isLinkSent, setIsLinkSent ] = useState(false);
  const [ formError, setFormError ] = useState("");


  const handleSubmit = async(e:SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await forgotPassword({ email })
      console.log(response.message);
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
      <div className="auth-content">
        { !isLinkSent ? (
          <Card>
            <CardHeader>
                <h2>Forgot your password?</h2>
                <p>
                  Enter your email and we'll send you a link to reset your password.
                </p>
            </CardHeader>
            <CardContent>
              {formError && (
                <Banner variant="error">
                  {formError}
                </Banner>
              )}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                  <div className="form-actions">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send reset link"}
                    </Button>
                    <div className="signup-prompt">
                      <Link to="/login">Back to Login</Link>
                    </div>
                  </div>
                </form> 
            </CardContent>
          </Card>
        ) : (
          <p>
            If an account exists for this email address, you'll receive an email
            with instructions to reset your password.
          </p>
        )
      }
      </div>
    </div>
  )
}