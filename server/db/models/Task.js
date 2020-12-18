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
    scopes: {
      byStatus: (statusId) => ({ where: { statusId } }),
      byAssignedTo: (assignedToId) => ({ where: { assignedToId } }),
      byCreator: (creatorId) => ({ where: { creatorId } }),
      // byTag: (tagId) => ({
      //   model: 'Tag',
      //   as: 'tags',
      //   where: { id: tagId },
      // }),
    },
    sequelize,
    modelName: 'Task',
  });

  Task.associate = (models) => {
    Task.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
    Task.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    Task.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
    Task.belongsToMany(models.Tag, { through: 'TaskTags', as: 'tags', foreignKey: 'taskId' });

    Task.addScope('byTag', (tagId) => ({
      include: [{
        model: models.Tag,
        as: 'tags',
        where: {
          id: {
            [sequelize.Op.eq]: tagId,
          },
        },
      }],
    }));
  };

  return Task;
};
