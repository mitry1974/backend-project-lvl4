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
    },
  }, {
    sequelize,
    modelName: 'TaskStatus',
  });
  return TaskStatus;
};
