const crypto = require('crypto');

const generateSalt = () => crypto.randomBytes(16).toString('base64');

const encryptPassword = (plainText, salt) => crypto
  .createHash('RSA-SHA256')
  .update(plainText)
  .update(salt)
  .digest('hex');

const checkPassword = (password, user) => {
  const encryptedPassword = encryptPassword(password, user.salt);
  return encryptedPassword === user.password;
};

module.exports = { generateSalt, encryptPassword, checkPassword };
