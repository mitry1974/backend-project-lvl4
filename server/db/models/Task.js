'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define('Task', {
    taskName: DataTypes.STRING
  }, {});
  tasks.associate = function(models) {
    // associations can be defined here
  };
  return tasks;
};
