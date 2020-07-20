const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
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
  }, { timestamps: true });

  user.associate = function associate() {
    // associations can be defined here
  };

  user.generateSalt = function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
  };

  user.encryptPassword = function encryptPassword(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  };

  const setSaltAndPassword = (u) => {
    if (u.changed('password')) {
      u.salt = user.generateSalt(); // eslint-disable-line
      u.password = user.encryptPassword(u.password, u.salt); // eslint-disable-line
    }
  };

  user.beforeCreate(setSaltAndPassword);
  user.beforeUpdate(setSaltAndPassword);

  user.prototype.checkPassword = function checkPassword(password) {
    return user.encryptPassword(password, this.salt) === this.password;
  };

  return user;
};
