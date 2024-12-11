const UsuarioInterno = require('../models/UserInt');  // Importando o modelo de UsuárioInterno

// Listar todos os usuários internos
exports.getAllUsuariosInternos = async (req, res) => {
    try {
        
        const usuarios = await UsuarioInterno.findAll();

       
        if (usuarios.length === 0) {
            return res.status(404).json({ msg: "Nenhum usuário interno encontrado." });
        }

        // Clista de users
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários internos:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};


// Obter informações de um usuário interno específico pelo id

exports.getUsuarioInternoById = async (req, res) => {
    const { IDuserIN } = req.params; 

    try {
       
        const usuario = await UsuarioInterno.findByPk(IDuserIN);

        // Verificando se o usuário foi encontrado
        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado." });  // Caso o usuário não exista
        }

        
        return res.status(200).json(usuario);  // Retorna o usuário encontrado 
    } catch (error) {
        console.error("Erro ao obter usuário interno:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

// Cadastrar um novo usuário interno
exports.createUsuarioInterno = async (req, res) => {
    const { Nome, CPF, Telefone, Email,  } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!Nome || !CPF || !Telefone || !Email) {
        return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
    }

    try {
        // Verifica se já existe um usuário com o mesmo CPF
        const usuarioExistente = await UsuarioInterno.findOne({ where: { CPF } });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "Já existe um usuário com esse CPF." });
        }

        // Cria um novo usuário interno no banco de dados
        const newUsuarioInterno = await UsuarioInterno.create({
            Nome,
            CPF,
            Telefone,
            Email,
        });

        // Retorna o usuário criado com status 201
        return res.status(201).json(newUsuarioInterno);
    } catch (error) {
        console.error("Erro ao cadastrar usuário interno:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};


exports.updateUsuarioInterno = async (req, res) => {
    const { IDuserIN } = req.params; 
    const { Nome, CPF, Telefone, Email, Endereco, IDCargo, Status } = req.body;

    if (!IDuserIN) {
        return res.status(400).json({ msg: "ID do usuário é obrigatório." });
    }

    try {
    
        const usuario = await UsuarioInterno.findByPk(IDuserIN);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }

        if (CPF && CPF !== usuario.CPF) {
            const usuarioExistente = await UsuarioInterno.findOne({ where: { CPF } });
            if (usuarioExistente) {
                return res.status(400).json({ msg: "Já existe um usuário com esse CPF." });
            }
            usuario.CPF = CPF; 
        }

        // Atualiza os dados do usuário com os novos valores enviados no corpo da requisição
        usuario.Nome = Nome || usuario.Nome;
        usuario.Telefone = Telefone || usuario.Telefone;
        usuario.Email = Email || usuario.Email;
        usuario.Endereco = Endereco || usuario.Endereco;
        usuario.IDCargo = IDCargo || usuario.IDCargo;
        usuario.Status = Status || usuario.Status;

        // Salva as alterações no banco de dados
        await usuario.save();

        // Retorna o usuário com os dados atualizados
        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao atualizar usuário interno:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};


// Deletar um usuário interno
exports.deleteUsuarioInterno = async (req, res) => {
    const { IDuserIN } = req.params;  

    // Verifica se o ID foi fornecido corretamente
    if (!IDuserIN) {
        return res.status(400).json({ msg: "ID do usuário é obrigatório." });
    }

    try {
        // Busca o usuário no banco de dados pelo ID
        const usuario = await UsuarioInterno.findByPk(IDuserIN);

        // Verifica se o usuário foi encontrado
        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }

        // Deleta o usuário do banco de dados
        await usuario.destroy();

        // Responde com sucesso
        return res.status(200).json({ msg: "Usuário interno excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir usuário interno:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

// Alterar o status (ativo/inativo) de um usuário interno
exports.toggleStatusUsuarioInterno = async (req, res) => {
    const { IDuserIN } = req.params;  
    const { Status } = req.body;  

    // Verifica se o status foi fornecido e se é válido
    if (!Status || (Status !== 'ativo' && Status !== 'inativo')) {
        return res.status(400).json({ msg: "Status inválido. O status deve ser 'ativo' ou 'inativo'." });
    }

    // Verifica se o ID foi fornecido corretamente
    if (!IDuserIN) {
        return res.status(400).json({ msg: "ID do usuário é obrigatório." });
    }

    try {
        // Busca o usuário no banco de dados pelo ID
        const usuario = await UsuarioInterno.findByPk(IDuserIN);

        // Verifica se o usuário foi encontrado
        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }

        // Atualiza o status do usuário
        usuario.Status = Status;

        // Salva as alterações no banco de dados
        await usuario.save();

        // Retorna o usuário com o status atualizado
        return res.status(200).json({ msg: `Usuário ${Status === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`, usuario });
    } catch (error) {
        console.error("Erro ao alterar status do usuário interno:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};