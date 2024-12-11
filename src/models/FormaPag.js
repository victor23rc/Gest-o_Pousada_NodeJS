const Sequelize = require('sequelize');
const database = require('./db');

const FormaPagamento = database.define('formaPagamento', {
    IDFormaPagamento: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomePagamento: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    Status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
});

module.exports = FormaPagamento;
