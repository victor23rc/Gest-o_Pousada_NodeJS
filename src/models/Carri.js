const Sequelize = require('sequelize');
const database = require('./db');
const Usuario = require('./User'); // Corrija o nome do arquivo se necessário

const Carrinho = database.define('Carrinho', {
    CarrinhoID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // Referencia ao modelo Usuario
            key: 'idUser' // Chave estrangeira referenciada
        }
    }
});

module.exports = Carrinho;
