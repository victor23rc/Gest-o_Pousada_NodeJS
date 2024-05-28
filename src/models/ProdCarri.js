const Sequelize = require('sequelize');
const database = require('./db');
const Produto = require('./Produto'); //
const Carrinho = require('./Carri'); 

const ProdutoCarrinho = database.define('ProdutoCarrinho', {
    ProdCarID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ProdutoID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Produto, // Referencia ao modelo Produto
            key: 'ProdutoID' // Chave estrangeira referenciada
        }
    },
    CarrinhoID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Carrinho, // Referencia ao modelo Carrinho
            key: 'CarrinhoID' // Chave estrangeira referenciada
        }
    }
});

module.exports = ProdutoCarrinho;