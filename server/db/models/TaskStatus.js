const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskStatus extends Model {
    // static associate(models) {
    //   // define association here
    // }
  }

  TaskStatus.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TaskStatus',
  });

  TaskStatus.prototype.toString = function toString() {
    return this.name;
  };

  return TaskStatus;
};
