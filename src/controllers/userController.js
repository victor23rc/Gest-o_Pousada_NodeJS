const UserHospede = require('../models/Hospede');  

////////// Função para cadastara um hospede.

exports.createHospede = async (req, res) => {
    const { NomeHospede, Email, CPF, Endereco, Telefone } = req.body;

    /////// Validação dos campos obrigatórios
    if (!NomeHospede || !Email || !Telefone) {
        return res.status(422).json({ msg: "Nome, Email e Telefone são obrigatórios" });
    }

    try {
        /// Verifica se já existe um hóspede com o mesmo email
        const existingUser = await UserHospede.findOne({ where: { Email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Já existe um hóspede cadastrado com este email." });
        }

        /// Criação do hóspede
        const newHospede = await UserHospede.create({
            NomeHospede,
            Email,
            CPF,
            Endereco: Endereco || '', 
            Telefone
        });

        //// Retorna a resposta com o hóspede criado
        res.status(201).json({ msg: "Hóspede cadastrado com sucesso", hospede: newHospede });
    } catch (error) {
        console.error("Erro ao cadastrar hóspede:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


//// Função para buscar um usuário pelo id
exports.getUserById = async (req, res) => {
    const idUser = req.params.idUser;  

    try {
        //// Busca o usuário no banco de dados pelo id
        const user = await UserHospede.findOne({ where: { IDHospede: idUser } });  

  
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        //// Retorna os dados do usuário
        return res.status(200).json({ user });
    } catch (error) {
        ///// Se ocorrer um erro durante a busca do usuário, retorna um erro 500
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ msg: "Erro ao buscar usuário, tente novamente mais tarde" });
    }
}; 


// //////////////////////Função para alterar as informações do usuário

exports.updateUser = async (req, res) => {
    const IDHospede = req.params.IDHospede;  
    const { NomeHospede, Email, CPF, Telefone } = req.body;

    // Validação dos campos obrigatórios
    if (!NomeHospede && !Email && !CPF && !Telefone) {
        return res.status(422).json({ msg: "Nenhum campo foi informado para alteração" });
    }

    try {
        ////// Busca o usuário no banco de dados pelo IDHospede
        const userH = await UserHospede.findOne({ where: { IDHospede } });

        if (!userH) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        /////// Atualiza apenas os campos que foram enviados e validados
        if (NomeHospede && NomeHospede.trim() !== "") {
            userH.NomeHospede = NomeHospede;
        } else if (NomeHospede === "") {
            return res.status(422).json({ msg: "Campo NomeHospede não pode ser vazio" });
        }

        if (Email) userH.Email = Email;

       /*  if (CPF) {
            // Validação do CPF
            if (CPF.length !== 11) {
                return res.status(422).json({ msg: "CPF deve ter 11 dígitos" });
            }
            userH.CPF = CPF;
        } */

        if (Telefone) userH.Telefone = Telefone;

        //////// Salva as alterações no banco de dados
        await userH.save();

        ////// Retorna o usuário com as informações atualizadas
        res.status(200).json(userH);
    } catch (error) {
        console.error("Erro ao alterar usuário:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


/// Alterar senha 

const bcrypt = require('bcrypt');
const UsuerHospede = require('../models/Hospede');  // Seu modelo de usuário

//// Função para alterar a senha
exports.updatePassword = async (req, res) => {
    const IDHospede = req.params.IDHospede;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(422).json({ msg: "Campos de senha obrigatórios" });
    }

    try {
        const user = await UsuerHospede.findOne({ where: { IDHospede } });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.Senha);

        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Senha atual incorreta" });
        }

        if (newPassword.length < 6) {
            return res.status(422).json({ msg: "A nova senha deve ter pelo menos 6 caracteres" });
        }

        const salt = await bcrypt.genSalt(12);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        user.Senha = newPasswordHash;
        await user.save();

        res.status(200).json({ msg: "Senha alterada com sucesso" });
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};

// Função para excluir usuário
exports.deleteUser = async (req, res) => {
    const IDHospede = req.params.IDHospede; // Obtém o IDHospede a partir da URL
   

    // Verifica se a senha foi fornecida

    try {
        //// Busca o usuário no banco de dados
        const user = await UsuerHospede.findOne({ where: { IDHospede } });

        ///// Verifica se o usuário foi encontrado
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        // Remove o usuário do banco de dados
        await UsuerHospede.destroy({ where: { IDHospede } });

        // Responde com sucesso
        return res.status(200).json({ msg: "Usuário deletado com sucesso" });

    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
};


///////// Listar todos os usuários: 
exports.getAllUse = async (req, res) => {
    try {
        //// Busca todos os hóspedes na tabela
        const userH = await UsuerHospede.findAll({
            attributes: ['IDHospede', 'NomeHospede', 'Email', 'Telefone', 'CPF', 'createdAt'], // Escolha os atributos necessários
        });

        ///// Verifica se não há registros
        if (userH.length === 0) {
            return res.status(204).json({ msg: "Nenhum hóspede encontrado." });
        }

        res.status(200).json(userH);
    } catch (error) {
        console.error("Erro ao listar hóspedes:", error);
        res.status(500).json({ msg: "Erro no servidor. Tente novamente mais tarde." });
    }
};
