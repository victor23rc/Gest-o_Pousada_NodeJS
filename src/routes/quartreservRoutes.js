const express = require('express');
const router = express.Router();
const quartosReservController = require('../controllers/quartreservController');

// Rota para listar todos os quartos reservados
router.get('/quartosreservados/lista', quartosReservController.getAllQuartosReserv);

// Rota para cadastrar um novo quarto reservado
router.post('/quartosreservados/cadastrar', quartosReservController.createQuartoReserv);

module.exports = router;
