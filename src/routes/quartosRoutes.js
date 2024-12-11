const express = require('express');
const router = express.Router();
const quartosController = require('../controllers/quartosController');

// Rota para listar todos os quartos
router.get('/quartos/Lista', quartosController.getAllQuartos);

// Rota para listar um quarto específico pelo ID
router.get('/quartos/:IDQuarto', quartosController.getQuartoById);

// Rota para cadastrar um novo quarto
router.post('/quartos/cadastrar', quartosController.createQuarto);

// Rota para alterar as informações de um quarto específico
router.put('/quartos/alterar/:IDQuarto', quartosController.updateQuarto);

// Rota para excluir um quarto
router.delete('/quartos/deletar/:IDQuarto', quartosController.deleteQuarto);

// Rota para alterar o status de um quarto (ativo ou inativo)
router.put('/quartos/alterar-status/:IDQuarto', quartosController.updateQuartoStatus);


module.exports = router;
