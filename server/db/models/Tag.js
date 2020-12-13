module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Tag.associate = (models) => Tag.belongsToMany(models.Task, { through: 'TaskTags', foreignKey: 'tagId' });

  Tag.prototype.getName = function getName() {
    return this.name;
  };

  return Tag;
};
