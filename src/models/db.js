/// conexão com o banco


const  Sequelize = require('sequelize');

  const sequelize = new Sequelize('projetoloja', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql'
  });

  module.exports = sequelize;
