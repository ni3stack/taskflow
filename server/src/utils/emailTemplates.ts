export function getPasswordResetEmailHtml(resetUrl: string): string {
  return `
    <h2>Reset your TaskFlow password</h2>

    <p>
      We received a request to reset your TaskFlow password.
    </p>

    <p>
    <a href="${resetUrl}">
        Reset your password
    </a>
    </p>

    <p>
      This link will expire in 15 minutes.
    </p>

    <p>
      If you did not request a password reset,
      you can safely ignore this email.
    </p>
  `;
}