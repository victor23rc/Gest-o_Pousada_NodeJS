const express = require('express');
const router = express.Router();
const funcioController = require('../controllers/funcioController');  // Importando o controller

// Rota para listar todos os funcionários
router.get('/funcionarios', funcioController.getAllFuncionarios);

// Rota para obter informações de um funcionário específico
router.get('/funcionarios/:IDFuncionario', funcioController.getFuncionarioById);

// Rota para cadastrar um novo funcionário
router.post('/funcionarios/cadastrar', funcioController.createFuncionario);

// Rota para alterar informações de um funcionário
router.put('/funcionarios/alterar/:IDFuncionario', funcioController.updateFuncionario);

// Rota para deletar um funcionário
router.delete('/funcionarios/deletar/:IDFuncionario', funcioController.deleteFuncionario);

// Rota para alterar o status de um funcionário
router.put('/funcionarios/alterarStatus/:IDFuncionario', funcioController.updateStatusFuncionario);



module.exports = router;
