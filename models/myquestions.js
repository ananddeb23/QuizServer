

module.exports = (sequelize, DataTypes) => {
  const myquestions = sequelize.define('myquestions', {
    question: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
    options: DataTypes.ARRAY(DataTypes.STRING),
  }, {});
  myquestions.associate = function (models) {
    // associations can be defined here
  };
  return myquestions;
};
