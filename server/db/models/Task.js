export default (sequelize, DataTypes) => {
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
    this.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
    this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    this.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
    this.belongsToMany(models.Tag, { through: 'TaskTags', as: 'tags', foreignKey: 'taskId' });
  };

  return Task;
};
