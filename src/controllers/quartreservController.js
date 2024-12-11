
const QuartoReservado = require('../models/QuartosReservados');  
const Reserva = require('../models/Reserva'); // Modelo de reservas

// Método para listar todos os quartos reservados
exports.getAllQuartosReserv = async (req, res) => {
  try {
    // Buscando todos os quartos reservados
    const quartosReservados = await QuartoReservado.findAll();

    // Se não houver quartos reservados, retorna um erro
    if (quartosReservados.length === 0) {
      return res.status(404).json({ msg: 'Nenhum quarto reservado encontrado.' });
    }

    // Retorna a lista de quartos reservados
    return res.status(200).json(quartosReservados);
  } catch (error) {
    console.error("Erro ao listar quartos reservados:", error);
    return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde.' });
  }
};






///




// Função para criar um novo quarto reservado
exports.createQuartoReserv = async (req, res) => {
  try {
    // Desestruturando os dados recebidos no corpo da requisição
    const { IDReserva, IDQuarto, NumeroQuarto, TipoQuarto, NomeHospede, CPF, DataEntrada, DataSaida, Status } = req.body;

    // Criando o registro de quarto reservado
    const quartoReservado = await QuartoReservado.create({
      IDReserva,
      IDQuarto,
      NumeroQuarto,
      TipoQuarto,
      NomeHospede,
      CPF,
      DataEntrada,
      DataSaida,
      Status
    });

    // Retorna o quarto reservado recém-criado
    return res.status(201).json(quartoReservado);
  } catch (error) {
    console.error('Erro ao cadastrar quarto reservado:', error);
    return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde.' });
  }
};