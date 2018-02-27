

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('myquestions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    question: {
      type: Sequelize.STRING,
    },
    questionId: {
      type: Sequelize.INTEGER,
    },
    options: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('myquestions'),
};
