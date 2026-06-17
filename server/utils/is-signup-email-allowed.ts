// Allowlist of emails permitted to register, from the SIGNUP_ALLOWED_EMAILS
// env var (comma-separated). Add an email there to "invite" someone.
// If the var is unset/empty, sign-up stays open (backwards compatible).
const allowlist = (process.env.SIGNUP_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isSignupEmailAllowed(email: string): boolean {
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.trim().toLowerCase());
}
