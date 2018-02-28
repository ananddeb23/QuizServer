'use strict';
module.exports = (sequelize, DataTypes) => {
  var userscores = sequelize.define('userscores', {
    uname: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {});
  userscores.associate = function(models) {
    // associations can be defined here
  };
  return userscores;
};