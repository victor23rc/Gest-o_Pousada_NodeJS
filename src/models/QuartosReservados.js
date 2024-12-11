const Sequelize = require('sequelize');
const database = require('./db'); 
const Quarto = require('./Quarto'); 
const Reserva = require('./Reserva'); 

const QuartosReservados = database.define('quartosReservados', {
    IDQuartoReservado: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: true,
        primaryKey: true
    },
    IDReserva: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Reserva, // Referência ao modelo Reserva
            key: 'IDreserva' // Chave primária da tabela Reserva
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    IDQuarto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Quarto, 
            key: 'IDQuarto' // Chave primária 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    NumeroQuarto: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    TipoQuarto: {
        type: Sequelize.ENUM('Premium', 'Luxo', 'Standard'),
        allowNull: true
    },
    DataEntrada: {
        type: Sequelize.DATE,
        allowNull: true
    },
    DataSaida: {
        type: Sequelize.DATE,
        allowNull: true
    },
    Status: {
        type: Sequelize.ENUM('Livre', 'Reservado'),
        allowNull: true,
        defaultValue: 'Livre'
    },
    DataCadastro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true
    }
});


QuartosReservados.belongsTo(Reserva, {
    foreignKey: 'IDReserva',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

QuartosReservados.belongsTo(Quarto, {
    foreignKey: 'IDQuarto',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = QuartosReservados;
