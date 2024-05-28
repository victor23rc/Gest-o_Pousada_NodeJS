/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');
const Pedido = require('./Pedido'); 
const Produto = require('./Produto'); 

const PedidoProduto = database.define('PedProd', {
    IDPedProd: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantidade: {
        type: Sequelize.INTEGER
    },
    PedidoID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Pedido, // Referencia ao modelo Pedido
            key: 'PedidoID' // Chave estrangeira referenciada
        }
    },
    ProdutoID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Produto, // Referencia ao modelo Produto
            key: 'ProdutoID' // Chave estrangeira referenciada
        }
    }
});

module.exports = PedidoProduto;