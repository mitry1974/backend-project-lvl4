const { generateSalt, encryptPassword } = require('../../lib/password');

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

  User.prototype.getFullName = function getFullName() {
    return `${this.email}, (${this.firstname} ${this.lastname})`;
  };

  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'creatorId' });
    User.hasOne(models.Task, { foreignKey: 'assignedToId' });
  };

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = generateSalt(); // eslint-disable-line
      user.password = encryptPassword(user.password, user.salt); // eslint-disable-line
    }
  };

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);
  User.beforeBulkCreate(setSaltAndPassword);
  User.beforeBulkUpdate(setSaltAndPassword);

  return User;
};
