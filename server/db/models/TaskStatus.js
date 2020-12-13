module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TaskStatus',
  });

  TaskStatus.prototype.getFullName = function getFullName() {
    return this.name;
  };

  return TaskStatus;
};
