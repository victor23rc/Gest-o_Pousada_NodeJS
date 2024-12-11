
// Listar todos os quartos

const Quarto = require('../models/Quarto');  


// Listar todos os quartos
exports.getAllQuartos = async (req, res) => {
    try {
       
        const quartos = await Quarto.findAll();

     
        if (quartos.length === 0) {
            return res.status(404).json({ msg: "Nenhum quarto encontrado" });
        }

      
        return res.status(200).json(quartos);
    } catch (error) {
        console.error("Erro ao listar quartos:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


// Listar um quarto específico por ID
exports.getQuartoById = async (req, res) => {
    try {
      
        const { IDQuarto } = req.params;

        
        const quarto = await Quarto.findByPk(IDQuarto);

     
        if (!quarto) {
            return res.status(404).json({ msg: "Quarto não encontrado" });
        }

     
        return res.status(200).json(quarto);

    } catch (error) {
        console.error("Erro ao buscar quarto:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Cadastrar um novo quarto

exports.createQuarto = async (req, res) => {
    try {
        // Desestruturando os dados enviados no corpo da requisição
        const { Descricao, NumeroQuarto, Tipo, Valor, Status } = req.body;


        if (!Descricao || !Tipo || !Valor) {
            return res.status(400).json({ msg: "Campos obrigatórios ausentes." });
        }

      
        const quartoExistente = await Quarto.findOne({ where: { NumeroQuarto } });

        if (quartoExistente) {
            return res.status(400).json({ msg: "Número do quarto já está em uso." });
        }

        // Cria um novo quarto no banco de dados
        const novoQuarto = await Quarto.create({
            Descricao,
            NumeroQuarto,
            Tipo,
            Valor,
            Status: Status || 'ativo'  
            
        });

        // Retorno
        return res.status(201).json(novoQuarto);

    } catch (error) {
        console.error("Erro ao cadastrar quarto:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


// Alterar informações de um quarto específico
exports.updateQuarto = async (req, res) => {
    try {
  
        const { IDQuarto } = req.params;

       
        const { Descricao, Tipo, Valor, Status, Quantidade } = req.body;

       
        const quarto = await Quarto.findByPk(IDQuarto);

        if (!quarto) {
            return res.status(404).json({ msg: "Quarto não encontrado" });
        }

        // Atualiza os dados do quarto
        quarto.Descricao = Descricao || quarto.Descricao;  
        quarto.Tipo = Tipo || quarto.Tipo;
        quarto.Valor = Valor || quarto.Valor;
        quarto.Status = Status || quarto.Status;
        quarto.Quantidade = Quantidade || quarto.Quantidade;

        // Salva as alterações no banco de dados
        await quarto.save();

        // Retorna o quarto atualizado
        return res.status(200).json(quarto);

    } catch (error) {
        console.error("Erro ao atualizar quarto:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


// Excluir um quarto específico
exports.deleteQuarto = async (req, res) => {
    try {
        // Pega o ID do quarto a partir dos parâmetros da URL
        const { IDQuarto } = req.params;

        // Verifica se o quarto existe
        const quarto = await Quarto.findByPk(IDQuarto);

        if (!quarto) {
            return res.status(404).json({ msg: "Quarto não encontrado" });
        }

        // Exclui o quarto do banco de dados
        await quarto.destroy();

        // Retorna uma mensagem de sucesso
        return res.status(200).json({ msg: "Quarto excluído com sucesso" });

    } catch (error) {
        console.error("Erro ao excluir quarto:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


// Atualizar o status de um quarto (ativo ou inativo)
exports.updateQuartoStatus = async (req, res) => {
    const { IDQuarto } = req.params;  
    const { Status } = req.body;    

    try {
        // Verifica se o status informado é válido
        if (!['ativo', 'inativo'].includes(Status)) {
            return res.status(400).json({ msg: "Status inválido. Use 'ativo' ou 'inativo'." });
        }

        // Encontra o quarto pelo ID
        const quarto = await Quarto.findByPk(IDQuarto);

        if (!quarto) {
            return res.status(404).json({ msg: "Quarto não encontrado" });
        }

        // Atualiza o status do quarto
        quarto.Status = Status;
        await quarto.save();  // Salva as mudanças no banco de dados

        return res.status(200).json({ msg: `Status do quarto atualizado para '${Status}'`, quarto });
    } catch (error) {
        console.error("Erro ao atualizar status do quarto:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};
