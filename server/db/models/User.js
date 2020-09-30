import crypto from 'crypto';

export default (sequelize, DataTypes) => {
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
    confirm: {
      type: DataTypes.VIRTUAL,
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
    this.hasMany(models.Task, { foreignKey: 'creatorId' });
    this.hasOne(models.Task, { foreignKey: 'assignedToId' });
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

  User.prototype.checkPassword = function checkPassword(password) {
    const encryptedPassword = User.encryptPassword(password, this.salt);
    return encryptedPassword === this.password;
  };

  User.prototype.toString = function toString() {
    return `${this.email}, (${this.firstname} ${this.lastname})`;
  };

  return User;
};
