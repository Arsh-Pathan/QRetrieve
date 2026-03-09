const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
};

const isValidContact = (contact) => {
  return isValidEmail(contact) || isValidPhone(contact);
};

module.exports = { isValidEmail, isValidPhone, isValidContact };
