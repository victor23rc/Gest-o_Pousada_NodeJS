const express = require('express');
const router = express.Router();
const userINTController = require('../controllers/userINTController');  // Importando o controller

// Rota para listar todos os usuários internos
router.get('/usuariosInternos', userINTController.getAllUsuariosInternos);

// Rota para obter informações de um usuário interno específico
router.get('/usuariosInternos/:IDuserIN', userINTController.getUsuarioInternoById);

// Rota para cadastrar um novo usuário interno
router.post('/usuariosInternos/cadastrar', userINTController.createUsuarioInterno);

// Rota para alterar informações de um usuário interno
router.put('/usuariosInternos/alterar/:IDuserIN', userINTController.updateUsuarioInterno);

// Rota para deletar um usuário interno
router.delete('/usuariosInternos/deletar/:IDuserIN', userINTController.deleteUsuarioInterno);

// Rota para desativar ou ativar um usuário interno
router.put('/usuariosInternos/alterarStatus/:IDuserIN', userINTController.toggleStatusUsuarioInterno);





module.exports = router;
