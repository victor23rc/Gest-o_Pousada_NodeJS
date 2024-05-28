/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');
const Categoria = require('./Categoria'); 

const Produto = database.define('Produto', {
    ProdutoID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(50)
    },
    QTD_Disponivel: {
        type: Sequelize.INTEGER
    },
    QTD_Produto: {
        type: Sequelize.STRING(60)
    },
    Preco: {
        type: Sequelize.DECIMAL(10, 2)
    },
    CategoriaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Categoria, // Referencia ao modelo Categoria
            key: 'CategoriaID' // Chave estrangeira referenciada
        }
    }
});

module.exports = Produto;