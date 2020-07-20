module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define('task', {
    taskName: DataTypes.STRING,
  }, {});
  tasks.associate = function associate() {
    // associations can be defined here
  };
  return tasks;
};
