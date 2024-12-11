const Sequelize = require('sequelize');
const database = require('./db');
const Hospede = require('./Hospede');
const Reserva = require('./Reserva');
const FormaPagamento = require('./FormaPag');
const Funcionario = require('./Funcionario');

const Payment = database.define('Payment', {
    IDPagamento: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ValorPago: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    MetodoPagamentoDetalhado: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    Desconto: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: true
    },
    DataPagamento: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    TipoPagamento: {
        type: Sequelize.ENUM('parcial', 'total'),
        defaultValue: 'total',
        allowNull: false
    },
    StatusPagamento: {
        type: Sequelize.ENUM('confirmado', 'pendente', 'cancelado'),
        defaultValue: 'confirmado',
        allowNull: false
    },
    TotalEmCaixa: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: true
    }
});

// Associações com as chaves estrangeiras
Payment.belongsTo(Hospede, {
    foreignKey: {
        name: 'IDHospede',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Payment.belongsTo(Reserva, {
    foreignKey: {
        name: 'IDReserva',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Payment.belongsTo(FormaPagamento, {
    foreignKey: {
        name: 'IDFormaPagamento',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Payment.belongsTo(Funcionario, {
    foreignKey: {
        name: 'IDFuncionario',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

module.exports = Payment; 
