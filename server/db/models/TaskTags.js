module.exports = (sequelize, DataTypes) => {
  const TaskTags = sequelize.define('TaskTags', {
    taskId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TaskTags',
    timestamps: false,
  });

  TaskTags.associate = (models) => {
    TaskTags.belongsTo(models.Task, { foreignKey: 'taskId' });
    TaskTags.belongsTo(models.Tag, { foreignKey: 'tagId' });
  };
  return TaskTags;
};
