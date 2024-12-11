const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserInt = require('../models/UserInt'); 

// Função para o cadastro de usuário

exports.register = async (req, res) => {
    const { Nome, Email, Senha, confirmPassword, CPF, Telefone } = req.body;

    const requiredFields = [
        { field: Nome, msg: "campo Nome obrigatório" },
        { field: Email, msg: "campo E-mail obrigatório" },
        { field: Senha, msg: "campo Senha obrigatório" }, 
        { field: Telefone, msg: "campo Telefone obrigatório" },
    ];

    for (const { field, msg } of requiredFields) {
        if (!field) return res.status(422).json({ msg });
    }
    
    if (Senha !== confirmPassword) {
        return res.status(422).json({ msg: "Confirmação de senha não confere" });
    } 

    if (CPF && CPF.length !== 11) {
        return res.status(422).json({ msg: "CPF deve ter 11 dígitos" });
    }

    const userExistsByCPF = await UserInt.findOne({ where: { CPF: CPF } });
    if (userExistsByCPF) {
        return res.status(422).json({ msg: "CPF já cadastrado!" });
    }

    const userExistsByEmail = await UserInt.findOne({ where: { Email: Email } });
    if (userExistsByEmail) {
        return res.status(422).json({ msg: "E-mail já cadastrado!" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(Senha, salt);

    const userH = new UserInt({
        Nome,
        Email,
        Senha: passwordHash,
        CPF,
        Telefone,
    });

    try {
        await userH.save();
        return res.status(201).json({ msg: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
    }
};


// Função para o login

exports.login = async (req, res) => {
    const { Email, Senha } = req.body;

    if (!Email) {
        return res.status(422).json({ msg: "Campo E-mail é obrigatório" });
    }

    if (!Senha) {
        return res.status(422).json({ msg: "Campo senha é obrigatório" });
    }

    // Verificar se o usuário existe
    const userH = await UserInt.findOne({ where: { Email } });

    if (!userH) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(Senha, userH.Senha);

    if (!isPasswordValid) {
        return res.status(401).json({ msg: "Senha incorreta" });
    }

    // Gerar o token JWT
    try {
        const secret = process.env.SECRET;  // Pegando a chave secreta do arquivo .env

        if (!secret) {
            console.error("A chave secreta não foi definida no arquivo .env!");
            return res.status(500).json({ msg: 'Erro interno: chave secreta não definida.' });
        }

        const token = jwt.sign(
            { id: userH.id },
            secret,
            { expiresIn: '1h' }  // O token expira em 1 hora
        );

        return res.status(200).json({ msg: 'Autenticação efetuada com sucesso', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: 'Erro no servidor, tente novamente mais tarde!',
        });
    }
};

