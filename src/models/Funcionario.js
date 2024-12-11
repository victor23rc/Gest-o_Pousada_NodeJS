const Sequelize = require('sequelize');
const database = require('./db');
const Cargo = require('./Cargo'); 

const Funcionario = database.define('funcionario', {
    IDFuncionario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeFuncionario: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    Telefone: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    Salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    CPF: {
        type: Sequelize.CHAR(11),
        allowNull: true,
        unique: true
    },
    Email: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    Status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
});

// Definição da chave estrangeira
Funcionario.belongsTo(Cargo, {
    foreignKey: {
        name: 'IDCargo',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Funcionario;
