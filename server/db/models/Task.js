module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
    },
    description: DataTypes.TEXT,
    statusId: {
      type: DataTypes.INTEGER,
    },
    creatorId: {
      type: DataTypes.INTEGER,
    },
    assignedToId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Task',
  });

  Task.associate = (models) => {
    Task.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
    Task.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    Task.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
    Task.belongsToMany(models.Tag, { through: 'TaskTags', as: 'tags', foreignKey: 'taskId' });
  };

  return Task;
};
