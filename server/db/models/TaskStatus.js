const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskStatus extends Model {
    // static associate(models) {
    //   // define association here
    // }
  }

  TaskStatus.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TaskStatus',
  });
  return TaskStatus;
};

