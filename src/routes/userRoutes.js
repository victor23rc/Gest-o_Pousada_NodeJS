const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Rota para buscar um usuário pelo id
router.get('/users/:idUser', userController.getUserById);


// Rota para cadastrar um hóspede
router.post('/user/hospede', userController.createHospede);


// Rota para alterar as informações de um usuário
router.put('/user/alter/:IDHospede', userController.updateUser);

// Rota para alterar a senha de um usuário
router.put('/user/alterPass/:IDHospede', userController.updatePassword);

// Rota para Excluir a senha de um usuário
router.delete('/user/delete/:IDHospede', userController.deleteUser);

// Rota para Listar toso os usuários;
router.get("/user/Lista", userController.getAllUse);

// Rota para listar todos os hóspedes
router.get("/user/Lista", userController.getAllUse);


module.exports = router;
