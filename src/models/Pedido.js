/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');
const ProjetoLoja = require('./User');


const Pedido = database.define('Pedido', {
    PedidoID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dataPedido: {
        type: Sequelize.DATE,
        allowNull: true
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ProjetoLoja, // Referencia ao modelo ProjetoLoja (tabela usuario)
            key: 'idUser' // Chave estrangeira referenciada
        }
    }
});

module.exports = Pedido;