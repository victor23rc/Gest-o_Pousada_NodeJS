const Sequelize = require('sequelize');
const database = require('./db');

const Hospede = database.define('hospede', {
    IDHospede: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeHospede: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Telefone: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    Email: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    Endereco: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    Senha: {
        type: Sequelize.STRING(60),
        allowNull: true
    },
    CPF: {
        type: Sequelize.STRING(110),
        allowNull: true,
        unique: true
    },
    DataCadastro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});


module.exports = Hospede;
