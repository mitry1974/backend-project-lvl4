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
      validate: {
        notEmpty: {
          args: true,
          get msg() {
            return i18next.t('views.tasks.errors.name_not_empty');
          },
        },
      },
    },
    description: DataTypes.TEXT,
    statusId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          get msg() {
            return i18next.t('views.tasks.errors.status_not_empty');
          },
        },
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          get msg() {
            return i18next.t('views.tasks.errors.creator_not_empty');
          },
        },
      },
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          get msg() {
            return i18next.t('views.tasks.errors.assigned_not_empty');
          },
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};
