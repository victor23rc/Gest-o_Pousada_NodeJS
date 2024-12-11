document.addEventListener("DOMContentLoaded", () => {
  // Função para obter usuários da API
  const getUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3009/usuariosInternos");

      if (response.ok) {
        const usuarios = await response.json(); // Converte a resposta em JSON

        // Obtém a referência do corpo da tabela onde os usuários serão listados
        const userTableBody = document.getElementById("userTableBody");

        // Limpa a tabela antes de inserir novos dados
        userTableBody.innerHTML = "";

      
        usuarios.forEach(usuario => {
          // Cria a linha da tabela para o usuário
          const row = document.createElement("tr");
          row.id = `user-${usuario.IDuserIN}`; 

          // Preenche a linha com os dados do usuário
          row.innerHTML = `
            <td>${usuario.Nome}</td>
            <td>${usuario.Telefone}</td>
            <td>${usuario.Email}</td>
            <td class="iconsTable">
              <a href="#" class="fa-regular fa-pen-to-square" style="color: #5787db" data-id="${usuario.IDuserIN}"></a>
              <a href="#" class="fa-regular fa-trash-can" style="color: #ff0000" data-id="${usuario.IDuserIN}"></a>
            </td>
          `;

          // Adiciona a linha à tabela
          userTableBody.appendChild(row);
        });

        // Após carregar os usuários, adiciona a funcionalidade de exclusão e edição
        addDeleteEventListeners();
        addEditEventListeners();
      } else {
        console.error("Erro ao buscar os usuários:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  

  // Função para excluir o usuário
  const deleteUser = (IDuserIN) => {
    // Fazendo a requisição DELETE para a API
    fetch(`http://localhost:3009/usuariosInternos/deletar/${IDuserIN}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Se a exclusão for bem-sucedida, removemos a linha da tabela
          alert("Usuário excluído com sucesso!");
          document.querySelector(`#user-${IDuserIN}`).remove();
        } else {
          alert("Erro ao excluir o usuário.");
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir o usuário:", error);
        alert("Erro no servidor. Tente novamente.");
      });
  };

  // Função para adicionar o evento de exclusão a cada ícone de lixeira
  const addDeleteEventListeners = () => {
    document.querySelectorAll('.fa-regular.fa-trash-can').forEach((deleteButton) => {
      deleteButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link

        const userId = event.target.getAttribute('data-id');

        // Confirmação antes de excluir
        const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmDelete) {
          deleteUser(userId); // Chama a função para excluir o usuário
        }
      });
    });
  };


  // Função para cadastar um usuário 
  const cadastrarUsuario = (event) => {
    event.preventDefault(); 
    console.log("Função de cadastro chamada");
  
    const form = event.target;
    const Nome = form.querySelector('input[name="Nome"]').value;
    const Email = form.querySelector('input[name="Email"]').value;
    const Senha = form.querySelector('input[name="Senha"]').value;
    const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
    const CPF = form.querySelector('input[name="CPF"]').value;
    const Telefone = form.querySelector('input[name="Telefone"]').value;

    /// to com sono vou dormir desisto
  
    // Validação da senha
    if (Senha !== confirmPassword) {
      alert("As senhas não são iguais amg.");
      return;
    }
  
    const apiUrl = 'http://localhost:3009/auth/register'; // endpoint
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      // objeto

      body: JSON.stringify({
        Nome: Nome,
        Email: Email,
        CPF: CPF,
        Senha: Senha,
        confirmPassword: confirmPassword,
        Telefone: Telefone
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar usuário');
        }
        return response.json(); // Retorna o usuário
      })
      .then(data => {
        alert('Usuário cadastrado com sucesso!');
        form.reset(); // Limpa o formulário
        document.getElementById('registrationForm').style.display = 'none'; // Fecha o formulário
        getUsuarios(); // Atualiza a lista de usuários
      })
      .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário.');
      });
  };
    

  // Adicionando o evento de submit no formulário de cadastro
  const form = document.getElementById('registrationForm');
  form.addEventListener('submit', cadastrarUsuario);

  // carregar os usuários assim que a página carregar
  getUsuarios();
});
