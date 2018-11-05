var config = require('./config');

var Sequelize = require('sequelize')
  , sequelize = new Sequelize(config.mysql.database, config.mysql.usr, config.mysql.pwd, {
	host: config.mysql.host,
	dialect: "mysql",
        log: console.log
});

  module.exports = sequelize;

