export default (sequelize, DataTypes) => {
  const TaskTags = sequelize.define('TaskTags', {
    taskId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  }, {
    modelName: 'TaskTags',
    timestamps: false,
  });

  TaskTags.associate = (models) => {
    this.belongsTo(models.Task, { foreignKey: 'taskId' });
    this.belongsTo(models.Tag, { foreignKey: 'tagId' });
  };

  return TaskTags;
};
