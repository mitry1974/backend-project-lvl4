const i18next = require('i18next');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      this.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
      this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
      this.belongsToMany(models.Tag, { through: 'TaskTags', as: 'tags', foreignKey: 'taskId' });
    }
  }

  Task.init({
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

  return Task;
};
