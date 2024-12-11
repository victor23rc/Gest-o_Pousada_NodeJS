const Cargo = require('../models/Cargo');
// Função para listar todos os cargos

exports.getAllCargos = async (req, res) => {
    try {
        const cargos = await Cargo.findAll();

        console.log('Cargos encontrados:', cargos); 

        if (cargos.length === 0) {
     
            return res.status(404).json({ msg: "Nenhum cargo encontrado" });
        }

        return res.status(200).json(cargos);
    } catch (error) {
        console.error("Erro ao listar cargos:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Função para obter um cargo pelo ID
exports.getCargoById = async (req, res) => {
    try {
        const { IDCargo } = req.params;  

        // Busca o cargo pelo ID
        const cargo = await Cargo.findOne({ where: { IDCargo } });

        // Verifica se o cargo foi encontrado
        if (!cargo) {
            return res.status(404).json({ msg: "Cargo não encontrado" });
        }

        return res.status(200).json(cargo);
    } catch (error) {
        console.error("Erro ao buscar cargo:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Cadastrar um novo cargo
exports.createCargo = async (req, res) => {
    try {
        const { NomeCargo, Descricao, Salario, Status } = req.body; 

        // Valida se todos os campos obrigatórios estão presentes
        if (!NomeCargo || !Status) {
            return res.status(400).json({ msg: "Nome e Status são obrigatórios" });
        }

        // Verifica se o cargo já existe 
        const cargoExistente = await Cargo.findOne({ where: { NomeCargo } });

        if (cargoExistente) {
            return res.status(400).json({ msg: "Já existe um cargo com esse nome." });
        }

        // Cria o novo cargo
        const novoCargo = await Cargo.create({
            NomeCargo,
            Descricao,
            Salario,
            Status
        });

        // Retorna o cargo criado
        return res.status(201).json(novoCargo);
    } catch (error) {
        console.error("Erro ao cadastrar cargo:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Alterar um cargo existente
exports.updateCargo = async (req, res) => {
    try {
        const { IDCargo } = req.params; 
        const { NomeCargo, Descricao, Salario, Status } = req.body; 

        // Verifica se o cargo existe
        const cargoExistente = await Cargo.findOne({ where: { IDCargo } });

        if (!cargoExistente) {
            return res.status(404).json({ msg: "Cargo não encontrado" });
        }

        // Atualiza as informações do cargo
        const cargoAtualizado = await Cargo.update(
            { NomeCargo, Descricao, Salario, Status },
            { where: { IDCargo } }
        );

      
        if (cargoAtualizado[0] === 0) {
            return res.status(400).json({ msg: "Nenhuma alteração foi feita" });
        }

        // Retorna os dados do cargo atualizado
        return res.status(200).json({
            msg: "Cargo atualizado com sucesso",
            cargo: { IDCargo, NomeCargo, Descricao, Salario, Status }
        });
    } catch (error) {
        console.error("Erro ao atualizar cargo:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

//// Excluir um cargo
exports.deleteCargo = async (req, res) => {
    try {
        const { IDCargo } = req.params; //// ID

        // Verifica se o cargo existe
        const cargoExistente = await Cargo.findOne({ where: { IDCargo } });

        if (!cargoExistente) {
            return res.status(404).json({ msg: "Cargo não encontrado" });
        }

        // Exclui o cargo, usando destroy, para apagar, função aprendidad com o Arthur
        await Cargo.destroy({ where: { IDCargo } });

        // Retorna a resposta de sucesso
        return res.status(200).json({ msg: "Cargo excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir cargo:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};
