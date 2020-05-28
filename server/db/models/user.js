import crypto from 'crypto';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      get() {
        return () => this.getDataValue('password');
      },
      set(value) {
        this.password = value;
      },
    },
    salt: {
      get() {
        return () => this.getDataValue('salt');
      },
      set(value) {
        this.salt = value;
      },
    },
    role: DataTypes.STRING,
  }, {});

  User.associate = function (models) {
    // associations can be defined here
  };

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
      user.salt(User.generateSalt());
      const encryptedPassword = User.encryptPassword(user.password(), user.salt());
      user.password(encryptedPassword);
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  User.prototype.checkPassword = function checkPassword(password) {
    return User.encryptPassword(password, this.salt()) === this.password();
  };

  return User;
};

