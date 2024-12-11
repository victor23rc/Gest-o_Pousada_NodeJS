
const Payment = require('../models/Pagamento'); // Modelo de pagamento
const Reserva = require('../models/Reserva'); // Modelo de reserva
const FormaPagamento = require('../models/FormaPag'); // Modelo de forma de pagamento
const Funcionario = require('../models/Funcionario'); // Modelo de funcionário


   // Buscando todos os pagamentos no banco de dados

exports.listPayments = async (req, res) => {
    try {
     
        const payments = await Payment.findAll();

        // Se não encontrar pagamentos
        if (!payments.length) {
            return res.status(404).json({ msg: "Nenhum pagamento encontrado." });
        }

        // Retorna os pagamentos 
        return res.status(200).json({
            msg: "Pagamentos encontrados.",
            payments
        });

    } catch (error) {
        console.error("Erro ao listar pagamentos:", error);
        return res.status(500).json({
            msg: "Erro ao listar pagamentos. Tente novamente mais tarde."
        });
    }
};

//// busca pelo id 

exports.getPaymentById = async (req, res) => {
    try {
        // Extrair o ID do pagamento a partir dos parâmetros da requisição
        const { id } = req.params;

        // Buscando o pagamento no banco de dados pelo ID
        const payment = await Payment.findByPk(id);

        // Se não encontrar o pagamento
        if (!payment) {
            return res.status(404).json({
                msg: `Pagamento com ID ${id} não encontrado.`
            });
        }

        // Retorna o pagamento encontrado
        return res.status(200).json({
            msg: "Pagamento encontrado.",
            payment
        });

    } catch (error) {
        console.error("Erro ao buscar pagamento:", error);
        return res.status(500).json({
            msg: "Erro ao buscar pagamento. Tente novamente mais tarde."
        });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        // Obtemos o ID do pagamento a partir da URL
        const { id } = req.params;

        // Verificamos se o pagamento existe
        const pagamento = await Payment.findByPk(id);
        if (!pagamento) {
            return res.status(404).json({ msg: "Pagamento não encontrado. Verifique o ID do pagamento." });
        }

        // Deletamos o pagamento
        await pagamento.destroy();

        // Retornamos uma resposta de sucesso
        return res.status(200).json({
            msg: "Pagamento deletado com sucesso."
        });

    } catch (error) {
        console.error("Erro ao deletar pagamento:", error);
        return res.status(500).json({
            msg: "Erro ao deletar pagamento. Tente novamente mais tarde."
        });
    }
};

//// realizar pagamento, cansei quero domir kk

exports.makePayment = async (req, res) => {
    try {
        
        const { ValorPago, MetodoPagamentoDetalhado, Desconto, TipoPagamento, StatusPagamento, IDReserva, IDFormaPagamento, IDFuncionario } = req.body;

       
        if (!ValorPago) {
            return res.status(400).json({ msg: "O valor pago é obrigatório." });
        }

        // Verifica se a reserva existe
        const reserva = await Reserva.findByPk(IDReserva);
        if (!reserva) {
            return res.status(400).json({ msg: "Reserva não encontrada. Verifique o ID da reserva." });
        }

        // Verifica se a forma de pagamento existe
        const formaPagamento = await FormaPagamento.findByPk(IDFormaPagamento);
        if (!formaPagamento) {
            return res.status(400).json({ msg: "Forma de pagamento não encontrada. Verifique o ID da forma de pagamento." });
        }

        // Verifica se o funcionário existe (se o IDFuncionario foi passado)
        const funcionario = IDFuncionario ? await Funcionario.findByPk(IDFuncionario) : null;
        if (IDFuncionario && !funcionario) {
            return res.status(400).json({ msg: "Funcionário não encontrado. Verifique o ID do funcionário." });
        }

        // Criando o pagamento no banco de dados
        const pagamento = await Payment.create({
            ValorPago,
            MetodoPagamentoDetalhado,
            Desconto: Desconto || 0, 
            TipoPagamento,
            StatusPagamento,
            IDReserva,
            IDFormaPagamento,
            IDFuncionario
        });

      
        if (TipoPagamento === 'total') {
            await reserva.update({ Status: 'confirmada' });
        }

        // Retorna a confirmação do pagamento criado
        return res.status(201).json({
            msg: "Pagamento efetuado com sucesso.",
            pagamento
        });

    } catch (error) {
        console.error("Erro ao efetuar pagamento:", error);
        return res.status(500).json({
            msg: "Erro ao efetuar pagamento. Tente novamente mais tarde."
        });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { StatusPagamento } = req.body;

       
        if (!StatusPagamento || !['confirmado', 'pendente', 'cancelado'].includes(StatusPagamento)) {
            return res.status(400).json({
                msg: "Status inválido. Os valores possíveis são: 'confirmado', 'pendente' ou 'cancelado'."
            });
        }

        // Verificamos se o pagamento existe
        const pagamento = await Payment.findByPk(id);
        if (!pagamento) {
            return res.status(404).json({
                msg: "Pagamento não encontrado. Verifique o ID do pagamento."
            });
        }

        // Atualiza o status do pagamento
        pagamento.StatusPagamento = StatusPagamento;

        // Salva as alterações no banco de dados
        await pagamento.save();

        // Retorno
        return res.status(200).json({
            msg: "Status de pagamento atualizado com sucesso.",
            pagamento
        });

    } catch (error) {
        console.error("Erro ao atualizar status do pagamento:", error);
        return res.status(500).json({
            msg: "Erro ao atualizar status do pagamento. Tente novamente mais tarde."
        });
    }
};