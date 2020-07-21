const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    // static associate(models) {
    // }
  }

  Task.init({
    taskName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};
