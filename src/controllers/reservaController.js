const Reserva = require('../models/Reserva');
const Quarto = require('../models/Quarto'); 
const Hospede = require('../models/Hospede');
const FormaPagamento = require('../models/FormaPag');
const Funcionario = require('../models/Funcionario');
const { Op } = require('sequelize');


///// Função para listar todas as reservas
exports.getAllReservas = async (req, res) => {
    try {
        ////// Busca todas as reservas, incluindo a associação com o Hospede e Quarto
        const reservas = await Reserva.findAll({
            include: [
                {
                    model: Hospede,
                    as: 'hospede', 
                    attributes: ['IDHospede', 'NomeHospede', 'Telefone', 'Email'] 
                },
                {
                    model: Quarto,
                    as: 'quarto', 
                    attributes: ['IDQuarto', 'Descricao', 'Tipo', 'Valor']  
                }
            ]
        });

        // Verifica se não há reservas
        if (reservas.length === 0) {
            return res.status(404).json({
                msg: "Não há reservas registradas."
            });
        }

        // Se existirem reservas, retorna elas com status 200
        return res.status(200).json({
            msg: "Reservas encontradas com sucesso.",
            reservas: reservas
        });
    } catch (error) {
        // Tratamento de erro
        console.error("Erro ao listar reservas:", error);
        return res.status(500).json({
            msg: "Erro no servidor, tente novamente mais tarde."
        });
    }
};

////////// Função para obter uma reserva específica pelo ID
exports.getReservaById = async (req, res) => {
    const { IDreserva } = req.params;  

    try {
        // Busca a reserva com o ID fornecido, incluindo as associações com Hospede e Quarto
        const reserva = await Reserva.findOne({
            where: { IDreserva },  
            include: [
                {
                    model: Hospede,
                    as: 'hospede'  
                },
                {
                    model: Quarto,
                    as: 'quarto',  
                    attributes: ['IDQuarto', 'Descricao', 'Tipo', 'Valor']  
                }
            ]
        });

        //// Verifica se a reserva foi encontrada
        if (!reserva) {
            return res.status(404).json({
                msg: "Reserva não encontrada."
            });
        }

        ///// Retorna os detalhes da reserva com status 200
        return res.status(200).json({
            msg: "Reserva encontrada com sucesso.",
            reserva: reserva
        });
    } catch (error) {
        //// Tratamento de erro caso a consulta falhe
        console.error("Erro ao obter reserva:", error);
        return res.status(500).json({
            msg: "Erro no servidor, tente novamente mais tarde."
        });
    }
};



exports.createReserva = async (req, res) => {
    try {
        // Extraímos os dados do corpo da requisição
        const {  NumeroQuarto, IDFormaPagamento, entrada, saida, QuantidadeHospedes, Valortotal, Descricao, Nome, CPF, Telefone, Email } = req.body;

        ///  Verifica se o Quarto existe pelo Número do Quarto
        const quarto = await Quarto.findOne({ where: { NumeroQuarto } });
        if (!quarto) {
            return res.status(400).json({
                msg: "Quarto não encontrado. Verifique o número do quarto e tente novamente."
            });
        }

        /////// Verifica se a Forma de Pagamento existe
        const formaPagamento = await FormaPagamento.findByPk(IDFormaPagamento);
        if (!formaPagamento) {
            return res.status(400).json({
                msg: "Forma de pagamento não encontrada. Verifique o ID da forma de pagamento e tente novamente."
            });
        }

        ///// Convertendo as datas de entrada e saída para objetos Date
        const dataEntrada = new Date(entrada);
        const dataSaida = new Date(saida);

        ///// Validação: Verifica se o Quarto está disponível no período solicitado
        const reservaExistente = await Reserva.findOne({
            where: {
                NumeroQuarto: quarto.NumeroQuarto,  //// voltar para ver se deu certo.
                [Op.and]: [
                    {
                        entrada: {
                            [Op.lt]: dataSaida 
                        }
                    },
                    {
                        saida: {
                            [Op.gt]: dataEntrada 
                        }
                    }
                ]
            }
        });

        if (reservaExistente) {
            return res.status(400).json({
                msg: "O quarto já está reservado para as datas solicitadas. Tente outro período."
            });
        }

        // Calculando o valor total caso não seja informado
        const valorReserva = Valortotal || (QuantidadeHospedes * quarto.Valor);

        // Criando a nova reserva 
        const reserva = await Reserva.create({
            IDQuarto: quarto.IDQuarto,
            IDFormaPagamento,
            entrada,
            saida,
            QuantidadeHospedes,
            Valortotal: valorReserva,  
            Descricao,
            Nome, 
            CPF,
            Telefone, 
            Email,
            NumeroQuarto: quarto.NumeroQuarto
        });
        
        return res.status(201).json({
            msg: "Reserva criada com sucesso.",
            reserva
        });

    } catch (error) {
        
        console.error("Erro ao criar reserva:", error);
        return res.status(500).json({
            msg: "Erro ao criar reserva. Tente novamente mais tarde."
        });
    }
};

exports.deleteReserva = async (req, res) => {
    try {
        /// Pegando o IDReserva da URL
        const { IDReserva } = req.params;

        /// Verifica se a reserva existe
        const reserva = await Reserva.findByPk(IDReserva);
        if (!reserva) {
            return res.status(404).json({
                msg: "Reserva não encontrada. Verifique o ID e tente novamente."
            });
        }

        // Deletando a reserva
        await reserva.destroy();

        // Retorna resposta de sucesso
        return res.status(200).json({
            msg: "Reserva deletada com sucesso."
        });

    } catch (error) {
        console.error("Erro ao deletar reserva:", error);
        return res.status(500).json({
            msg: "Erro ao deletar reserva. Tente novamente mais tarde."
        });
    }
};

exports.updateStatusReserva = async (req, res) => {
    try {
        // Pegando o ID da reserva e o novo status da requisição
        const { IDReserva } = req.params;
        const { Status } = req.body;

        // Verifica se o status informado é válido
        if (!['confirmada', 'cancelada'].includes(Status)) {
            return res.status(400).json({
                msg: "Status inválido. O status deve ser 'confirmada' ou 'cancelada'."
            });
        }

        // Verifica se a reserva existe
        const reserva = await Reserva.findByPk(IDReserva);
        if (!reserva) {
            return res.status(404).json({
                msg: "Reserva não encontrada. Verifique o ID e tente novamente."
            });
        }

        // Atualiza o status da reserva
        reserva.Status = Status;

        // Salva as alterações no banco de dados
        await reserva.save();

        // Retorna a resposta de sucesso
        return res.status(200).json({
            msg: `Status da reserva alterado para '${Status}'.`,
            reserva
        });

    } catch (error) {
        console.error("Erro ao alterar status da reserva:", error);
        return res.status(500).json({
            msg: "Erro ao alterar status da reserva. Tente novamente mais tarde."
        });
    }
};
