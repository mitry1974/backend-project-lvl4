const crypto = require('crypto');

export const generateSalt = () => crypto.randomBytes(16).toString('base64');

export const encryptPassword = (plainText, salt) => crypto
  .createHash('RSA-SHA256')
  .update(plainText)
  .update(salt)
  .digest('hex');

export const checkPassword = (password, user) => {
  const encryptedPassword = encryptPassword(password, user.salt);
  return encryptedPassword === user.password;
};
