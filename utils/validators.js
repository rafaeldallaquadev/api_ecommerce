const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) return false;

  const [local, domain] = normalizedEmail.split('@');

  if (!local || !domain) return false;

  if (domain.startsWith('.') || domain.endsWith('.')) return false;

  if (normalizedEmail.includes('..')) return false;

  return true;
}

export function isValidPassword(password) {
  if (!password || password.length < 8) return false;

  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;

  return true;
}

export function isValidName(name) {
  if (!name) return false;

  const normalizedName = name.trim();

  if (!normalizedName || normalizedName.length < 2) return false;
  if (normalizedName.length > 100) return false;

  return true;
}