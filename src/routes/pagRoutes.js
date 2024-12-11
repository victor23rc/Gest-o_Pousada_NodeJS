const express = require('express');
const router = express.Router();
const pagController = require('../controllers/pagController');  

// Rota para listar todas as formas de pagamento
router.get('/formasPagamento/Lista', pagController.getAllFormasPagamento);

// Rota para obter informações de uma forma de pagamento específica
router.get('/formasPagamento/:IDFormaPagamento', pagController.getFormaPagamentoById);

// Rota para cadastrar uma nova forma de pagamento
router.post('/formasPagamento/cadastrar', pagController.createFormaPagamento);

// Rota para alterar informações de uma forma de pagamento
router.put('/formasPagamento/alterar/:IDFormaPagamento', pagController.updateFormaPagamento);

// Rota para excluir uma forma de pagamento
router.delete('/formasPagamento/deletar/:IDFormaPagamento', pagController.deleteFormaPagamento);


module.exports = router;
