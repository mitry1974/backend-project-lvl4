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

  TaskStatus.prototype.getName = function getName() {
    return this.name;
  };

  return TaskStatus;
};
