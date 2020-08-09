const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      this.belongsTo(models.TaskStatus, { foreignKey: 'statusId' });
      this.belongsTo(models.User, { foreignKey: 'creatorId' });
      this.belongsTo(models.User, { foreignKey: 'assignedToId' });
      this.belongsToMany(models.Tag, { through: 'TaskTags' });
    }
  }

  Task.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.TEXT,
    statusId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};
