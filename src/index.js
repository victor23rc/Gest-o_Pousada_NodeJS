///  Victor Campos - Backend Projeo flutter 

/// Exports

require('dotenv').config() ///
const bcrypt = require('bcrypt') /// incriptação
const jwt = require('jsonwebtoken'); /// jwt
const  Sequelize = require('sequelize'); /// migração do banco
const express = require('express'); /// servidor

/// conexão com o banco

const database = require('./models/db'); 

//// tabelas do banco
const UsuerColumn = require('./models/User'); /// sql criação da Column usuário 
const Pedido = require('./models/Pedido'); /// cria a tabela Pedido 
const Categoria = require('./models/Categoria'); /// cria a tabela Categoria 
const Produto = require('./models/Produto'); /// cria a tabela Produto
const Fav = require('./models/Fav'); /// cria a tabela de Favoritos
const PedProd = require('./models/PedProd'); /// cria a tabela de prido/produto
const Carri = require('./models/Carri'); /// Criação da tabela carrinho 
const ProdCarri = require('./models/ProdCarri'); /// Criação da tabela produto carrinho 

const app = express()
app.use(express.json())

const port = 3009;

// Rota de teste para verificar se o servidor está online
app.get('/Teste', (req, res) => {
    res.send('Onlineeee');
});

///


app.post('/auth/register', async(req, res) => { 

    const {name, email, password, confirmPassword, endereco, telefone}  = req.body

/// validações de resposta

    if(!name) { 
        return res.status(422).json({msg: "campo Nome obrigatório"})
    }

    if(!email) { 
        return res.status(422).json({msg: "campo E-mail obrigatório"})
    }

    if(!password) { 
        return res.status(422).json({msg: "campo Senha obrigatório"})
    }

    if (password !== confirmPassword ) {
        return res.status(422).json({msg: "Confirmação de senha não confere"})

    }

    if(!endereco) { 
        return res.status(422).json({msg: "campo endereço obrigatório"})
    }

    if(!telefone) { 
        return res.status(422).json({msg: "campo telefone obrigatório"})
    }

    const userExists = await UsuerColumn.findOne({ where: { email: email } }); // select 

    if (userExists){
        return res.status(422).json({msg: "E-mail já cadastrado!"})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordash = await bcrypt.hash(password, salt)

    const user = new UsuerColumn ({
        name,
        email,
        password: passwordash,
        endereco,
        telefone,

    })

    try {

        await user.save()

        return res.status(201).json({msg: "Usuário cadastrado com sucesso"})
        
     } catch (error) {
      console.log(error)

         res
         .status(500)
         .json({
            msg: 'Erro no server, tente novamente mais tarde!',
        })
        
     }

});

/// Login User + Token

app.post('/auth/login', async(req, res) => { 

    const { email, password} = req.body

    /// validações de resposta

    const user = await UsuerColumn.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" }); 
    }

    if (!password) {
        return res.status(401).json({ msg: "digite a senha" });
    }


    /// Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ msg: "Senha incorreta" });
    }

     /// Validação gerando token

     try {
        const secret = process.env.SECRET

        const token = jwt.sign(
        {
            id: user._id,
        }, 
         secret,  
        )

         res.status(200).json({msg: 'Autenticação efetuada com suceso', token})
        
       } catch (err) {

        res
        .status(500)
        .json({
           msg: 'Erro no server, tente novamente mais tarde!',
       })
        
       }

});

//////////////// id do user 

app.get('/ident/:idUser', async (req, res) => {
    const idUser = req.params.idUser;

    try {
        // Busca o usuário no banco de dados pelo idUser
        const user = await UsuerColumn.findOne({ where: { idUser } }); /// select 

        // Se o usuário não for encontrado, retorna um erro 404
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        // Retorna os dados do usuário
        return res.status(200).json({ user });
    } catch (error) {
        // Se ocorrer um erro durante a busca do usuário, retorna um erro 500
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ msg: "Erro ao buscar usuário, tente novamente mais tarde" });
    }
});

/// Alteração de informações do usuário por ID

app.put("/user/alter/:idUser", async (req, res) => {
    const idUser = req.params.idUser; // Corrigido para extrair corretamente o idUser da URL
    const { name, email, endereco, telefone } = req.body;

    try {
        // Busca o usuário no banco de dados pelo idUser
        const user = await UsuerColumn.findOne({ where: { idUser } });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        // Atualiza as informações do usuário
        user.name = name;
        user.email = email;
        user.endereco = endereco;
        user.telefone = telefone;

        // Salva as alterações no banco de dados
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error("Erro ao alterar usuário:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
});

    /// alteração de senha
  
    app.put("/user/alterPass/:id", async (req, res) => {
        const userId = req.params.id; //  extrair  o ID do usuário da URL
        const { currentPassword, newPassword } = req.body;
    
        if (!currentPassword || !newPassword) {
            return res.status(422).json({ msg: "Campos de senha obrigatórios" });
        }
    
        try {
            // Busca pelo usuário via ID
            const user = await UsuerColumn.findOne({ where: { idUser: userId } });
    
            // Verifica se o usuário foi encontrado
            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
    
            // Compara as senhas
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Senha atual incorreta" });
            }
    
            // Gera um novo hash para a nova senha usando o bcrypt
            const salt = await bcrypt.genSalt(12);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
            // Atualiza a senha do usuário no banco
            user.password = newPasswordHash;
            await user.save();
    
            res.status(200).json({ msg: "Senha alterada com sucesso" });
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
        }
    });

    /// deletando usuário 

    app.delete("/user/delete/:idUser", async (req, res) => {
        const userId = req.params.idUser
        const { password } = req.body;
    
        try {
            // Busca o usuário no banco de dados pelo idUser
            const user = await UsuerColumn.findOne({ where: { idUser: userId } });

         // Verifica o user

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
    
    
            // Verifica se a senha foi fornecida
            if (!password) {
                return res.status(422).json({ msg: "Senha obrigatória para excluir o usuário" });
            }

        // compara senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Senha incorreta" });
        }

        // Remove o usuário do banco de dados
        await UsuerColumn.destroy({ where: { idUser: userId } });
        return res.status(200).json({ msg: "Usuário deletado com sucesso" });

            
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
        }
    });

    /// Lista de usuários para saber o ID sem consultar no banco 
  
    app.get('/users/Lista', async (req, res) => {
        try {
            const users = await UsuerColumn.findAll();
            
            // Verifica se a lista de usuários está vazia
            if (users.length === 0) {
                return res.status(404).json({ msg: "Nenhum usuário encontrado" });
            }
    
            // Retorna os usuários
            res.status(200).json(users);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
        }
    });

/// Categoria do produto


app.post('/categoria/register', async (req, res) => {
    const { nome, imagem } = req.body;

    // Validações de resposta
    if (!nome) {
        return res.status(422).json({ msg: "Campo nome obrigatório" });
    }

    try {
        // Cria uma nova categoria e captura o ID gerado
        const newCategory = await Categoria.create({
            nome,
            imagem
        });

        
        return res.status(201).json({ id: newCategory.CategoriaID, msg: "Categoria cadastrada" });
    } catch (error) {
        
        console.error("Erro ao criar a categoria:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

///// remover categoria 

app.delete('/categoria/remove', async (req, res) => {

    const { CategoriaID } = req.body;

    // Validações de resposta
    if (!CategoriaID) {
        return res.status(422).json({ msg: "Campo CategoriaID obrigatório para remoção" });
    } 

    try {
        // Remover CategoriaID
        const RemoveCategoria = await Categoria.destroy({ where: { CategoriaID } });

        if (RemoveCategoria === 0) {
            return res.status(404).json({ msg: "Categoria não encontrado no carrinho" });
        }

        return res.status(200).json({ msg: " Categoria removida com sucesso" });
    } catch (error) {
        console.error("Erro ao remover Categoria:", error);
        return res.status(500).json({ msg: "Erro do servidor" });
    }
});

///// cadastrar produto

app.post('/produtos/register', async (req, res) => {
    const { nome, QTD_Disponivel , QTD_Produto, preco, CategoriaID } = req.body;

    // Validações de resposta
    if (!nome) {
        return res.status(422).json({ msg: "Campo nome obrigatório" });
    }

    if (!QTD_Disponivel) {
        return res.status(422).json({ msg: "Campo QTD_Disponivel lobrigatório" });
    } 

    if (!QTD_Produto) {
        return res.status(422).json({ msg: "Campo QTD_Produto obrigatório" });
    }    

    if (!preco) {
        return res.status(422).json({ msg: "Campo preço obrigatório" });
    }

    if (!CategoriaID) {
        return res.status(422).json({ msg: "Campo CategoriaID obrigatório" });
    }

    try {
        // Cria uma nova categoria e captura o ID gerado
        const newProduto = await Produto.create({
            nome,
            QTD_Disponivel,
            QTD_Produto,
            preco,
            CategoriaID
        });

        
        return res.status(201).json({ id: newProduto.ProdutoID, msg: "Produto Cadastrado" });
    } catch (error) {
        
        console.error("Erro ao criar a categoria:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

////  (Comprando produto)

app.post('/produtos/compra', async (req, res) => {
    const { produtoId, quantidadeComprada } = req.body;

    try {
        // Obter o produto do banco de dados
        const produto = await Produto.findByPk(produtoId);

        if (!produto) {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }

        // Verificar se há quantidade suficiente disponível
        if (produto.QTD_Disponivel < quantidadeComprada) {
            return res.status(400).json({ msg: "Quantidade disponível insuficiente" });
        }

        // Diminuir a quantidade disponível com base na quantidade comprada
        produto.QTD_Disponivel -= quantidadeComprada;

        // Salvar as alterações no banco de dados
        await produto.save();

        return res.status(200).json({ msg: "Compra realizada com sucesso" });
    } catch (error) {
        console.error("Erro ao realizar a compra:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

///// API Favoritos 

app.post('/favoritos/add', async (req, res) => {
    const { idUser, ProdutoID } = req.body;

    // Validações de resposta
    if (!idUser) {
        return res.status(422).json({ msg: "Campo idUser obrigatório" });
    } 

    if (!ProdutoID) {
        return res.status(422).json({ msg: "Campo produtoId obrigatório" });
    }    

    try {

        // Adicionar o favorito
        const novoFavorito = await Fav.create({
            idUser,
            ProdutoID
        });

        return res.status(201).json({ id: novoFavorito.id, msg: "Favorito adicionado com sucesso" });
    } catch (error) {
        console.error("Erro ao adicionar favorito:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  
});

////////////////////// removendo favoritos

app.delete('/favoritos/remove', async (req, res) => {
    const { id } = req.body;

    // Validações de resposta
    if (!id) {
        return res.status(422).json({ msg: "Campo id obrigatório para remoção" });
    } 

    try {
        // Remover o favorito pelo ID
        const favoritoRemovido = await Fav.destroy({ where: { id } });

        if (favoritoRemovido === 0) {
            return res.status(404).json({ msg: "Favorito não encontrado" });
        }

        return res.status(200).json({ msg: "Favorito removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});


////// Carrinho  CarrinhoID

app.post('/carrinho/add', async (req, res) => {
    const { idUser } = req.body;

    // Validações de resposta
    if (!idUser) {
        return res.status(422).json({ msg: "Campo idUser obrigatório" });
    } 

    try {
        // Adicionar usuário ao carrinho
        const novoCarrinho = await Carri.create({
            idUser,
        });

        // Retornar uma resposta com status 201 (Created) e o ID do carrinho criado
        return res.status(201).json({ id: novoCarrinho.id, msg: "Usuário adicionado ao carrinho com sucesso" });
    } catch (error) {
        // Lidar com erros, caso ocorram, e retornar uma mensagem de erro adequada
        console.error("Erro ao adicionar usuário ao carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

///// Remove carrinho 
 
app.delete('/carrinho/remove', async (req, res) => {
    const { CarrinhoID } = req.body;

    // Validações de resposta
    if (!CarrinhoID) {
        return res.status(422).json({ msg: "Campo idUser obrigatório para remoção" });
    } 

    try {
        // Remover usuário do carrinho
        const carrinhoRemovido = await Carri.destroy({ where: { CarrinhoID } });

        if (carrinhoRemovido === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado no carrinho" });
        }

        return res.status(200).json({ msg: "Usuário removido do carrinho com sucesso" });
    } catch (error) {
        console.error("Erro ao remover usuário do carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

/// produto/carrinho


app.post('/ProdCarri/add', async (req, res) => {
    const { ProdutoID, CarrinhoID } = req.body;

    // Validações de resposta
    if (!ProdutoID) {
        return res.status(422).json({ msg: "Campo ProdutoID obrigatório" });
    } 

    if (!CarrinhoID) {
        return res.status(422).json({ msg: "Campo CarrinhoID obrigatório" });
    } 

    try {
        // Adiciona os valores das chaves a tabela produto/carrinho 

        const novoCProdCarri = await ProdCarri.create({
            ProdutoID,
            CarrinhoID
        });

        // Retornar uma resposta com status 201 (Created) e o ID do carrinho criado
        return res.status(201).json({ id: novoCProdCarri.ProdCarID, msg: " adicionado com sucesso" });
    } catch (error) {
        // Lidar com erros, caso ocorram, e retornar uma mensagem de erro adequada
        console.error("Erro ao adicionar usuário ao carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

/// remover produto/carrinho

app.delete('/ProdCarri/remove', async (req, res) => {
    const { ProdCarID } = req.body;

    // Validações de resposta
    if (!ProdCarID) {
        return res.status(422).json({ msg: "Campo ProdCarID obrigatório para remoção" });
    } 

    try {
        // Remover usuário do carrinho
        const RemoveProdCarri = await ProdCarri.destroy({ where: { ProdCarID } });

        if (RemoveProdCarri === 0) {
            return res.status(404).json({ msg: "ProdCarID não encontrado no carrinho" });
        }

        return res.status(200).json({ msg: " removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover usuário do carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

//// tabela pedidos: 


app.post('/Pedidos/add', async (req, res) => {
    const { idUser } = req.body;

    // Validações de resposta
    if (!idUser) {
        return res.status(422).json({ msg: "Campo idUser obrigatório" });
    } 

    try {
        // Adiciona o usuário que fez o pedido na tabela

        const novoPedido = await Pedido.create({
            idUser
        });

        // Retornar uma resposta com status 201 (Created) e o ID da produto na tabela (chave primaria)
        return res.status(201).json({ id: novoPedido.PedidoID, msg: " adicionado com sucesso" });
    } catch (error) {
        // Lidar com erros, caso ocorram, e retornar uma mensagem de erro adequada
        console.error("Erro ao adicionar usuário ao carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

/// remover Pedidos

app.delete('/Pedidos/remove', async (req, res) => {

    const { PedidoID } = req.body;

    // Validações de resposta
    if (!PedidoID) {
        return res.status(422).json({ msg: "Campo PedidoID obrigatório para remoção" });
    } 

    try {
        // Remover usuário do carrinho
        const RemovePedido = await Pedido.destroy({ where: { PedidoID } });

        if (RemovePedido === 0) {
            return res.status(404).json({ msg: "PedidoID não encontrado no carrinho" });
        }

        return res.status(200).json({ msg: " removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover usuário do carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});


///////////////// pedprodsss


app.post('/PedidoProduto/add', async (req, res) => {
    const { quantidade, PedidoID, ProdutoID } = req.body;

    // Validações de resposta
    if (!quantidade) {
        return res.status(422).json({ msg: "Campo Quantidade obrigatório" });
    } 

    if (!PedidoID) {
        return res.status(422).json({ msg: "Campo PedidoID obrigatório" });
    } 

    if (!ProdutoID) {
        return res.status(422).json({ msg: "Campo ProdutoID obrigatório" });
    } 

    try {
        // Adiciona os valores da tabela pedido produto 

        const novoPedProd = await PedProd.create({
            quantidade,
            PedidoID,
            ProdutoID
        });

        // Retornar uma resposta com status 201 (Created) e o ID 
        return res.status(201).json({ id: novoPedProd.IDPedProd, msg: " adicionado com sucesso" });
    } catch (error) {
        // Lidar com erros, caso ocorram, e retornar uma mensagem de erro adequada
        console.error("Erro ao adicionar usuário ao carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});


/// remover pedprod

app.delete('/PedidoProduto/remove', async (req, res) => {

    const { IDPedProd } = req.body;

    // Validações de resposta
    if (!IDPedProd) {
        return res.status(422).json({ msg: "Campo IDPedProd obrigatório para remoção" });
    } 

    try {
        // Remover usuário do carrinho
        const RemovePedProd = await PedProd.destroy({ where: { IDPedProd } });

        if (RemovePedProd === 0) {
            return res.status(404).json({ msg: "IDPedProd não encontrado no carrinho" });
        }

        return res.status(200).json({ msg: " removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover usuário do carrinho:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

//// LISTAR PEDPROD

app.get('/PedidoProduto/list', async (req, res) => {
    try {
        // Consulta todos os registros da tabela PedidoProduto
        const pedidosProdutos = await PedProd.findAll();

        if (listPedProd.length === 0) {
            return res.status(404).json({ msg: "Nenhum usuário encontrado" });
        }

        // Retorna os resultados como resposta
        return res.status(200).json(pedidosProdutos);
    } catch (error) {
        console.error("Erro ao listar PedidoProduto:", error);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
});



// Inicializa o banco de dados e inicia o servidor
(async () => {
    try {
        await database.sync();
        app.listen(port, () => {
            console.log('Servidor conectado');
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
})();