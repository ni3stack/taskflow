import { resend } from "../config/email";
import { getPasswordResetEmailHtml } from "../utils/emailTemplates";

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
):Promise<void> {

  const resetUrl = 
    `http://taskflow.test:5173/reset-password?token=${resetToken}`;
  
  const { error } = await resend.emails.send({
    from: "TaskFlow <onboarding@resend.dev>",
    to: [email],
    subject: "Reset your TaskFlow password",
    html: getPasswordResetEmailHtml(resetUrl)
  })

  if(error) {
    throw new Error(
      `Failed to send password resend ${error.message} `
    );
  }
} 