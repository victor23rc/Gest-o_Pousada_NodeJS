///  Victor Campos - Backend Pousada 

/// Exports

require('dotenv').config(); /// Carregar variáveis de ambiente
const bcrypt = require('bcrypt'); /// Criptografia de senha
const jwt = require('jsonwebtoken'); /// JWT
const Sequelize = require('sequelize'); /// ORM para migração de banco
const express = require('express'); /// Servidor Express
const cors = require('cors'); /// front

/// Conexão com as rotas
const authRoutes = require('./routes/authRoutes');  /// Importa as rotas de autenticação
const userRoutes = require('./routes/userRoutes');  /// Importa as rotas dos usuários
const pagRoutes = require('./routes/pagRoutes');  /// Importa as rotas dos usuários
const cargosRoutes = require('./routes/cargosRoutes');  /// Importa as rotas dos usuários
const quartosRoutes = require('./routes/quartosRoutes'); /// Importa as rotas dos quartos
const userINTRoutes = require('./routes/userINTRoutes'); /// Importa as rotas dos USUÁRIOS INTERNOS 
const funcioRoutes = require('./routes/funcioRoutes'); /// Importa as rotas dos Funcionarios
const reservaRoutes = require('./routes/reservaRoutes'); /// Importa as rotas de reserva
const payRoutes = require('./routes/payRoutes'); /// Importa as rotas de reserva
const quartreservRoute = require('./routes/quartreservRoutes'); /// Importa as rotas de Quartos reservados 


/// Conexão com o banco
const database = require('./models/db'); 

/// Novas tabelas do banco
const UserHospede = require('./models/Hospede'); /// Tabela de Hospedes
const Cargos = require('./models/Cargo'); /// Tabela de Cargos
const FormaPagamento  = require('./models/FormaPag'); /// Tabela de FormaPag
const Quartos = require('./models/Quarto'); /// Tabela de Quartos
const UsuarioInterno = require('./models/UserInt'); /// Tabela de UsuarioInterno
const Funciona = require('./models/Funcionario'); /// Tabela de Funcionarios
const ReservasHospd = require('./models/Reserva'); /// Tabela de Reservas
const Payment = require('./models/Pagamento'); /// Tabela de Caixa de Pagamentos
const QuartReserv = require('./models/QuartosReservados'); /// Tabela de Quartos reservados


const app = express(); 
app.use(express.json()); 

const port = 3009; /// Definição da porta do servidor

app.use(cors());


// rotas 
app.use(authRoutes);  /// Configura as rotas para autenticação
app.use(userRoutes);  // Usar a rota de usuário
app.use(pagRoutes);  // Usar a rota de PG
app.use(cargosRoutes); // Usar a rota de cargos
app.use(quartosRoutes); // Usar a rota de Quartos
app.use(userINTRoutes); // Usar a rota de Usuários internos 
app.use(funcioRoutes); // Usar a rota de funcionarios
app.use(reservaRoutes); // Usar a rota de Reservas
app.use(payRoutes); // Usar a rota de Reservas
app.use(quartreservRoute); // Usar a rota de Reservas dos quartos



// Inicializa o banco de dados e inicia o servidor
(async () => {
    try {
        await database.sync();  /// Sincroniza o banco de dados
        app.listen(port, () => {  /// Inicia o servidor
            console.log(`Servidor conectado na porta ${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
})();
