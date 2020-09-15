const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskTags extends Model {
    static associate(models) {
      this.belongsTo(models.Task, { foreignKey: 'taskId' });
      this.belongsTo(models.Tag, { foreignKey: 'tagId' });

      // models.Task.belongsToMany(models.Tag, { through: TaskTags, as: 'tags', foreignKey: 'taskId' });
      // models.Tag.belongsToMany(models.Task, { through: TaskTags, as: 'tasks', foreignKey: 'tagId' });
    }
  }

  TaskTags.init({
    taskId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TaskTags',
    timestamps: false,
  });
  return TaskTags;
};
