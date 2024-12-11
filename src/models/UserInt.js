const Sequelize = require('sequelize');
const database = require('./db');
const Cargo = require('./Cargo'); 

const UsuarioInterno = database.define('usuarioInterno', {
    IDuserIN: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    CPF: {
        type: Sequelize.CHAR(11),
        allowNull: true,
        unique: true
    },
    Senha: {
        type: Sequelize.STRING(60),
        allowNull: true
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
        type: Sequelize.STRING(50),
        allowNull: true
    },
    Status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
});

// chave estrangeira
UsuarioInterno.belongsTo(Cargo, {
    foreignKey: {
        name: 'IDCargo',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

module.exports = UsuarioInterno;
