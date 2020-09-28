const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskTags extends Model {
    static associate(models) {
      this.belongsTo(models.Task, { foreignKey: 'taskId' });
      this.belongsTo(models.Tag, { foreignKey: 'tagId' });
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
