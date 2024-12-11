const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rota de cadastro de usuário
router.post('/auth/register', authController.register);

// Rota de registro login
router.post('/auth/login', authController.login);

module.exports = router;
