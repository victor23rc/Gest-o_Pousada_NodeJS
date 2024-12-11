const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController');

// Rota para listar todos os pagamentos
router.get('/pagamentos', payController.listPayments);

// Rota para buscar um pagamento específico pelo ID
router.get('/pagamentos/:id', payController.getPaymentById);

// Rota para efetuar um pagamento
router.post('/pagamentos/efetuar', payController.makePayment);

// Rota para deletar um pagamento
router.delete('/pagamentos/deletar/:id', payController.deletePayment);

// Alterar um pagamento

router.put('/pagamentos/status/:id', payController.updatePaymentStatus);

module.exports = router;
