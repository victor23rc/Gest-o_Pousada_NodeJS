const express = require('express');
const router = express.Router();
const cargosController = require('../controllers/cargosController');


// Rota para listar todos os cargos
router.get('/cargos/Lista', cargosController.getAllCargos);

// Rota para buscar um cargo específico pelo ID
router.get('/cargos/:IDCargo', cargosController.getCargoById);

// Rota para cadastrar um novo cargo
router.post('/cargos/cadastrar', cargosController.createCargo); 

// Rota para alterar informações de um cargo
router.put('/cargos/alterar/:IDCargo', cargosController.updateCargo);

// Rota para excluir um cargo
router.delete('/cargos/deletar/:IDCargo', cargosController.deleteCargo);



module.exports = router;
