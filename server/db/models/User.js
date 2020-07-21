const crypto = require('crypto');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    // }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    firstname: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    lastname: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    salt: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.generateSalt = function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
  };

  User.encryptPassword = function encryptPassword(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  };

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = User.generateSalt(); // eslint-disable-line
      user.password = User.encryptPassword(user.password, user.salt); // eslint-disable-line
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  User.prototype.checkPassword = function checkPassword(password) {
    return User.encryptPassword(password, this.salt) === this.password;
  };

  return User;
};
