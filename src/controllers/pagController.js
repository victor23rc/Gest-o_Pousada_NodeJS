
const FormaPagamento = require('../models/FormaPag');
const express = require('express');
const router = express.Router();

// Listar todas as formas de pagamento

exports.getAllFormasPagamento = async (req, res) => {
    try {
        const formasPagamento = await FormaPagamento.findAll();

        // Verifica se não existem formas de pagamento
        if (formasPagamento.length === 0) {
            return res.status(404).json({ msg: "Nenhuma forma de pagamento encontrada" });
        }

        return res.status(200).json(formasPagamento);
    } catch (error) {
        console.error("Erro ao listar formas de pagamento:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Obter informações de uma forma de pagamento específica
exports.getFormaPagamentoById = async (req, res) => {
    const { IDFormaPagamento } = req.params;

    try {
        const formaPagamento = await FormaPagamento.findOne({
            where: { IDFormaPagamento }
        });

        // Verifica se a forma de pagamento foi encontrada
        if (!formaPagamento) {
            return res.status(404).json({ msg: "Forma de pagamento não encontrada" });
        }

        return res.status(200).json(formaPagamento);
    } catch (error) {
        console.error("Erro ao obter forma de pagamento:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Cadastrar uma nova forma de pagamento
exports.createFormaPagamento = async (req, res) => {
    const { NomePagamento, Descricao, Status } = req.body; 


    if (!NomePagamento) {
        return res.status(400).json({ msg: "O campo NomePagamento é obrigatório" });
    }

    try {
        // Cria a nova forma de pagamento db
        const newFormaPagamento = await FormaPagamento.create({
            NomePagamento,
            Descricao,
            Status
        });

        
        return res.status(201).json(newFormaPagamento);
    } catch (error) {
        console.error("Erro ao cadastrar forma de pagamento:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Alterar informações de uma forma de pagamento
exports.updateFormaPagamento = async (req, res) => {
    const { IDFormaPagamento } = req.params;  
    const { NomePagamento, Descricao, Status } = req.body;  

   
    if (!IDFormaPagamento) {
        return res.status(400).json({ msg: "IDFormaPagamento é obrigatório" });
    }

    try {
       
        const formaPagamento = await FormaPagamento.findByPk(IDFormaPagamento);

       
        if (!formaPagamento) {
            return res.status(404).json({ msg: "Forma de pagamento não encontrada" });
        }

        
        if (NomePagamento) formaPagamento.NomePagamento = NomePagamento;
        if (Descricao) formaPagamento.Descricao = Descricao;
        if (Status) formaPagamento.Status = Status;

      
        await formaPagamento.save();

        
        return res.status(200).json(formaPagamento);
    } catch (error) {
        console.error("Erro ao alterar forma de pagamento:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Deletar uma forma de pagamento
exports.deleteFormaPagamento = async (req, res) => {
    const { IDFormaPagamento } = req.params;  

    // Verifica se o ID foi fornecido corretamente
    if (!IDFormaPagamento) {
        return res.status(400).json({ msg: "IDFormaPagamento é obrigatório" });
    }

    try {
        // Busca a forma de pagamento 
        const formaPagamento = await FormaPagamento.findByPk(IDFormaPagamento);

        // Verifica se a forma de pagamento foi encontrada
        if (!formaPagamento) {
            return res.status(404).json({ msg: "Forma de pagamento não encontrada" });
        }

        // Deleta a forma de pagamento
        await formaPagamento.destroy();

        // Responde com sucesso
        return res.status(200).json({ msg: "Forma de pagamento excluída com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir forma de pagamento:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};
