'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define('tasks', {
    taskName: DataTypes.STRING
  }, {});
  tasks.associate = function(models) {
    // associations can be defined here
  };
  return tasks;
};