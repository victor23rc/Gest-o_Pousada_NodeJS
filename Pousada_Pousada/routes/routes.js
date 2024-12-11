
const API_URL = "http://localhost:3009/auth";
const cors = require('cors');
app.use(cors());

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: email, Senha: senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login realizado com sucesso!');
            console.log('Token:', data.token);
            // Armazene o token no localStorage para futuras requisições
            localStorage.setItem('token', data.token);
            // Redirecione o usuário para a área restrita
            window.location.href = "/dashboard"; // Altere para sua URL de área restrita
        } else {
            alert(data.msg || 'Erro no login!');
        }
    } catch (error) {
        console.error('Erro ao conectar à API:', error);
        alert('Erro ao conectar ao servidor.');
    }
});

const jwt = require('jsonwebtoken');
// Middleware para validar o token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtém o token do cabeçalho

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret); // Verifica o token
        req.userId = decoded.id; // Adiciona o ID do usuário à requisição
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Token inválido.' });
    }
}

// Use o middleware em rotas protegidas
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ msg: 'Bem-vindo à área restrita!' });
});

