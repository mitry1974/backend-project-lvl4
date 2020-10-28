const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
      unique: true,
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
      allowNull: false,
      defaultValue: '',
    },
    salt: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'creatorId' });
    User.hasOne(models.Task, { foreignKey: 'assignedToId' });
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
      user.salt = User.generateSalt(); // eslint-disable-line
      user.password = User.encryptPassword(user.password, user.salt); // eslint-disable-line
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);
  User.beforeBulkCreate(setSaltAndPassword);
  User.beforeBulkUpdate(setSaltAndPassword);

  User.prototype.checkPassword = function checkPassword(password) {
    const encryptedPassword = User.encryptPassword(password, this.salt);
    return encryptedPassword === this.password;
  };

  User.prototype.toString = function toString() {
    return `${this.email}, (${this.firstname} ${this.lastname})`;
  };

  return User;
};
