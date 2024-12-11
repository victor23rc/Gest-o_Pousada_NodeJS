const Funcionario = require('../models/Funcionario');
const Cargo = require('../models/Cargo'); 
const Sequelize = require('sequelize');

// Função para listar todos os funcionários
exports.getAllFuncionarios = async (req, res) => {
    try {
        // Recupera infos
        const funcionarios = await Funcionario.findAll({
            include: [{
                model: Cargo,
                attributes: ['NomeCargo'],  // Inclui apenas o nome do cargo
            }]
        });

        // Verifica se existem funcionários cadastrados
        if (funcionarios.length === 0) {
            return res.status(404).json({ msg: "Nenhum funcionário encontrado" });
        }

        // Mapeia os funcionários para adicionar o nome do cargo
        const funcionariosComCargo = funcionarios.map(funcionario => {
            return {
                ...funcionario.toJSON(),  
                NomeCargo: funcionario.Cargo ? funcionario.Cargo.NomeCargo : null  
            };
        });

        // Retorna a lista de funcionários com o nome do cargo
        return res.status(200).json(funcionariosComCargo);
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

///// Função para obter as informações de um funcionário específico
exports.getFuncionarioById = async (req, res) => {
    const { IDFuncionario } = req.params;  

    try {
        //// Busca o funcionário no banco de dados pelo ID
        const funcionario = await Funcionario.findByPk(IDFuncionario);

        //// Verifica se o funcionário foi encontrado
        if (!funcionario) {
            return res.status(404).json({ msg: "Funcionário não encontrado" });
        }

        //// Retorna as informações do funcionário encontrado
        return res.status(200).json(funcionario);
    } catch (error) {
        console.error("Erro ao obter funcionário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


//// Função para cadastrar um novo funcionário

exports.createFuncionario = async (req, res) => {
    const { NomeFuncionario, Telefone, Salario, CPF, Email, Status, IDCargo } = req.body;

    // Verifica campos obrigatórios 
    if (!NomeFuncionario || !Status || !IDCargo) {
        return res.status(400).json({ msg: "Os campos NomeFuncionario, Status e IDCargo são obrigatórios" });
    }

    try {
        // Verifica se o cargo existe no banco de dados
        const cargo = await Cargo.findByPk(IDCargo);

    
        if (!cargo) {
            return res.status(404).json({ msg: "Cargo não encontrado. Por favor, cadastre o cargo primeiro." });
        }

        // Verifica se o CPF já está cadastrado
        const cpfExistente = await Funcionario.findOne({ where: { CPF } });

        if (cpfExistente) {
            return res.status(400).json({ msg: "CPF já cadastrado. Por favor, forneça um CPF único." });
        }

        // Cria um novo funcionário no banco de dados
        const newFuncionario = await Funcionario.create({
            NomeFuncionario,
            Telefone,
            Salario,
            CPF,
            Email,
            Status,
            IDCargo
        });

        // Retorna o funcionário recém-criado
        return res.status(201).json(newFuncionario);
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Função para alterar informações de um funcionário
exports.updateFuncionario = async (req, res) => {
    const { IDFuncionario } = req.params;  
    const { NomeFuncionario, Telefone, Salario, CPF, Email, Status, IDCargo } = req.body;

 
    if (!IDFuncionario) {
        return res.status(400).json({ msg: "IDFuncionario é obrigatório" });
    }

    try {
    
        if (IDCargo) {
            const cargo = await Cargo.findByPk(IDCargo);

      
            if (!cargo) {
                return res.status(404).json({ msg: "Cargo não encontrado. Por favor, cadastre o cargo primeiro." });
            }
        }

        // Verifica se o CPF já está sendo usado por outro funcionário
        if (CPF) {
            const funcionarioComCpfExistente = await Funcionario.findOne({
                where: { CPF, IDFuncionario: { [Sequelize.Op.ne]: IDFuncionario } }  
            });

            if (funcionarioComCpfExistente) {
                return res.status(400).json({ msg: "O CPF informado já está cadastrado para outro funcionário." });
            }
        }

        // Busca o funcionário a ser atualizado no banco de dados
        const funcionario = await Funcionario.findByPk(IDFuncionario);

        // Verifica se o funcionário foi encontrado
        if (!funcionario) {
            return res.status(404).json({ msg: "Funcionário não encontrado" });
        }

        // Atualiza os campos do funcionário
        if (NomeFuncionario) funcionario.NomeFuncionario = NomeFuncionario;
        if (Telefone) funcionario.Telefone = Telefone;
        if (Salario) funcionario.Salario = Salario;
        if (CPF) funcionario.CPF = CPF;
        if (Email) funcionario.Email = Email;
        if (Status) funcionario.Status = Status;
        if (IDCargo) funcionario.IDCargo = IDCargo;

        // Salva as alterações no banco de dados
        await funcionario.save();

        // Retorna o funcionário atualizado
        return res.status(200).json(funcionario);

    } catch (error) {
        console.error("Erro ao alterar informações do funcionário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Deletar um funcionário
exports.deleteFuncionario = async (req, res) => {
    const { IDFuncionario } = req.params;  

    try {
        // Verifica se o funcionário existe
        const funcionario = await Funcionario.findByPk(IDFuncionario);

        if (!funcionario) {
            return res.status(404).json({ msg: "Funcionário não encontrado" });
        }

        // Deleta o funcionário
        await funcionario.destroy();

        // Retorna uma resposta de sucesso
        return res.status(200).json({ msg: "Funcionário excluído com sucesso" });

    } catch (error) {
        console.error("Erro ao excluir o funcionário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Alterar o status de um funcionário
exports.updateStatusFuncionario = async (req, res) => {
    const { IDFuncionario } = req.params;  
    const { Status } = req.body; 

    ///// Verifica 0 status
    if (!['ativo', 'inativo'].includes(Status)) {
        return res.status(400).json({ msg: "Status inválido. O status deve ser 'ativo' ou 'inativo'." });
    }

    try {
        // Verifica se o funcionário existe
        const funcionario = await Funcionario.findByPk(IDFuncionario);

        if (!funcionario) {
            return res.status(404).json({ msg: "Funcionário não encontrado" });
        }


        funcionario.Status = Status;


        await funcionario.save();

  
        return res.status(200).json({
            msg: `Status do funcionário ${IDFuncionario} alterado para ${Status}`,
            funcionario
        });

    } catch (error) {
        console.error("Erro ao alterar o status do funcionário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};