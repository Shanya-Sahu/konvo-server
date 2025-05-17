export function validateLoginInput(email, password) {
  if (!email || !password) {
    return "Email and password are required.";
  }

  // Trim and validate email format
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Invalid email format.";
  }

  return null;
}
