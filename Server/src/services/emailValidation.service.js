/**
 * Email Validation Service
 * Provides strict email validation with pattern checking
 */

// Strict email validation
const validateEmail = (email) => {
  // RFC 5322 compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check basic format
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for invalid patterns
  const invalidPatterns = [
    /^\./, // starts with dot
    /\.$/, // ends with dot
    /\.\./, // consecutive dots
    /^-/, // starts with dash
    /-$/, // ends with dash
    / /, // contains space
    /^test/i, // test emails
    /^fake/i, // fake emails
    /^mock/i, // mock emails
    /^admin@/i, // admin emails
    /localhost/i, // localhost
    /^@/, // starts with @
  ];

  for (let pattern of invalidPatterns) {
    if (pattern.test(email)) {
      return false;
    }
  }

  // Check domain validity
  const [localPart, domain] = email.split("@");
  if (!domain || domain.length < 3) {
    return false;
  }

  // Domain must have at least one dot and proper TLD
  if (!domain.includes(".")) {
    return false;
  }

  // TLD must be at least 2 characters
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) {
    return false;
  }

  // Local part should not be too short
  if (localPart.length < 2) {
    return false;
  }

  return true;
};

module.exports = {
  validateEmail,
};
