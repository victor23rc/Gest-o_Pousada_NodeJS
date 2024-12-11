// reservaRoutes.js
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');


// Definindo as rotas para a tabela de reservas
router.get('/reservas', reservaController.getAllReservas);

// Rota para obter informações de uma reserva específica pelo ID
router.get('/reservas/:IDreserva', reservaController.getReservaById);

// Rota para criar uma nova reserva
router.post('/reservas', reservaController.createReserva);

// Rota para deletar uma reserva
router.delete('/reservas/deletar/:IDReserva', reservaController.deleteReserva);

// Rota para alterar o status da reserva
router.put('/reservas/status/:IDReserva', reservaController.updateStatusReserva);

module.exports = router;
