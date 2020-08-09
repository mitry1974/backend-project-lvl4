module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tasks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    creatorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    assignedToId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('tasks'),
};
