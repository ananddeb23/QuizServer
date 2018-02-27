'use strict';
module.exports = (sequelize, DataTypes) => {
  var useranswers = sequelize.define('useranswers', {
    questionId: DataTypes.INTEGER,
    uname: DataTypes.STRING,
    answer: DataTypes.STRING
  }, {});
  useranswers.associate = function(models) {
    // associations can be defined here
  };
  return useranswers;
};