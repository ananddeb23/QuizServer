'use strict';
module.exports = (sequelize, DataTypes) => {
  var myanswers = sequelize.define('myanswers', {
    questionId: DataTypes.INTEGER,
    answer: DataTypes.STRING
  }, {});
  myanswers.associate = function(models) {
    // associations can be defined here
  };
  return myanswers;
};