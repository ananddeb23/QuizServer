'use strict';
module.exports = (sequelize, DataTypes) => {
  var myquestions = sequelize.define('myquestions', {
    question: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
    option1: DataTypes.STRING,
    option2: DataTypes.STRING,
    option3: DataTypes.STRING,
    option4: DataTypes.STRING
  }, {});
  myquestions.associate = function(models) {
    // associations can be defined here
  };
  return myquestions;
};