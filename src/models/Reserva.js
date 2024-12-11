const Sequelize = require('sequelize');
const database = require('./db');
const Hospede = require('./Hospede'); 
const Quarto = require('./Quarto'); 
const FormaPagamento = require('./FormaPag'); 

const Reserva = database.define('reserva', {
    IDreserva: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    entrada: {
        type: Sequelize.DATE,
        allowNull: true
    },
    saida: {
        type: Sequelize.DATE,
        allowNull: true
    },
    QuantidadeHospedes: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Valortotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    Descricao: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    DataReserva: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    Status: {
        type: Sequelize.ENUM('confirmada', 'cancelada'),
        allowNull: true
    }, 
    Nome: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    CPF: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Telefone: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    NumeroQuarto: {
        type: Sequelize.INTEGER(20),
        allowNull: true
    },
    Email: {
        type: Sequelize.STRING(50),
        allowNull: false
    }

});

// chaves estrangeiras
Reserva.belongsTo(Hospede, {
    foreignKey: {
        name: 'IDHospede',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Reserva.belongsTo(Quarto, {
    foreignKey: {
        name: 'IDQuarto',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Reserva.belongsTo(FormaPagamento, {
    foreignKey: {
        name: 'IDFormaPagamento',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

module.exports = Reserva;
