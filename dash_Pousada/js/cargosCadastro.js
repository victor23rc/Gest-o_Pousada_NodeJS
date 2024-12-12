
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();  

 
  const nomeCargo = document.getElementById('NomeCargo').value;
  const salario = document.getElementById('Salario').value;
  const descricao = document.getElementById('Descricao').value;


  if (!nomeCargo || !salario || !descricao) {
      alert('Todos os campos são obrigatórios!');
      return;
  }


  const cargoData = {
      NomeCargo: nomeCargo,
      Salario: salario,
      Descricao: descricao,
      Status: 'Ativo'  
  };

  // Chama a função para enviar os dados para a API
  cadastrarCargo(cargoData);
});

// Função para realizar a requisição POST para cadastrar o cargo
async function cadastrarCargo(cargoData) {
  try {
      const response = await fetch('http://localhost:3009/cargos/cadastrar', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(cargoData)  // Envia os dados em formato JSON
      });

      // Checa se a resposta foi bem-sucedida
      if (!response.ok) {
          const errorData = await response.json();
          alert('Erro: ' + errorData.msg || 'Erro desconhecido.');
          return;
      }

      // Caso a requisição seja bem-sucedida
      const data = await response.json();
      alert('Cargo cadastrado com sucesso!');
      console.log(data);  
      
      document.getElementById('modalCargos').style.display = 'none';
      
      
      window.location.reload();
  } catch (error) {
      console.error('Erro ao cadastrar cargo:', error);
      alert('Ocorreu um erro ao cadastrar o cargo. Tente novamente mais tarde.');
  }
}

// Função para carregar a lista de cargos
function carregarCargos() {
  const apiUrl = 'http://localhost:3009/cargos/Lista';

  fetch(apiUrl)
      .then(response => response.json())
      .then(cargos => {
          const tableBody = document.getElementById('cargoTableBody');
          tableBody.innerHTML = '';  // Limpando o conteúdo antes de adicionar os dados

          if (cargos.length === 0) {
              tableBody.innerHTML = '<tr><td colspan="4">Nenhum cargo encontrado.</td></tr>';
          } else {
              cargos.forEach(cargo => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td>${cargo.NomeCargo}</td>
                      <td>${cargo.Salario}</td>
                      <td>${cargo.Descricao}</td>
                      <td class="iconsTable">
                 <a href="#" class="fa-regular fa-pen-to-square" style="color: #5787db" onclick="editarCargo(${cargo.IDCargo})"></a>
                <a href="#" class="fa-regular fa-trash-can" style="color: #ff0000" onclick="excluirCargo(${cargo.IDCargo})"></a>
                      </td>
                  `;
                  
                  tableBody.appendChild(row);  // Adicionando a linha criada ao corpo da tabela
              });
          }
      })
      .catch(error => {
          console.error('Erro ao carregar cargos:', error);
      });
}

// Chamar a função para carregar os cargos quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarCargos);


  // Função para excluir um Cargo
  function excluirCargo(IDCargo) {
    const confirmacao = confirm('Você tem certeza que deseja excluir este Cargo?'); // Confirmação de exclusão
  
    if (confirmacao) {
      const apiUrl = `http://localhost:3009/cargos/deletar/${IDCargo}`; // URL para excluir o Cargo
  
      fetch(apiUrl, {
        method: 'DELETE', // Método DELETE para excluir o recurso
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir Cargo');
        }
        return response.json(); // Retorna a resposta da exclusão
      })
      .then(data => {
        alert('Cargo excluído com sucesso!'); // Mensagem de sucesso
        carregarCargos(); // Recarrega a lista de hóspedes
      })
      .catch(error => {
        console.error('Erro ao excluir CARGO:', error);
        alert('Erro ao excluir o Cargo.');
      });
    }
  }
  
