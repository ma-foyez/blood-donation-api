const maskEmail = (email) => {
  const [localPart, domainPart] = email.split("@");
  const visibleChars = 2; // Number of visible characters in the local part
  const maskedLocal = `${localPart.substring(0, visibleChars)}${"*".repeat(
    localPart.length - visibleChars
  )}`;
  return `${maskedLocal}@${domainPart}`;
};

module.exports = maskEmail;
