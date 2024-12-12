// Função para carregar a lista de hóspedes
function carregarHospedes() {
    const apiUrl = 'http://localhost:3009/user/Lista';  // URL para a API de hóspedes
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar os hóspedes');
        }
        return response.json(); // Converte a resposta para JSON
      })
      .then(hospedes => {
        const tableBody = document.querySelector('#hospedeTable tbody');
        tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados
  
        // Verifica se há hóspedes
        if (hospedes.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="6">Nenhum hóspede encontrado.</td></tr>';
        } else {
          // Adiciona cada hóspede à tabela
          hospedes.forEach(hospede => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${hospede.NomeHospede}</td>
              <td>${hospede.Telefone || 'Não informado'}</td>
              <td>${hospede.Email || 'Não informado'}</td>
              <td>${hospede.CPF || 'Não informado'}</td>
              <td>${new Date(hospede.createdAt).toLocaleDateString()}</td>
              <td class="iconsTable">
                <a href="#" class="fa-regular fa-pen-to-square" style="color: #5787db" onclick="editarHospede(${hospede.IDHospede})"></a>
                <a href="#" class="fa-regular fa-trash-can" style="color: #ff0000" onclick="excluirHospede(${hospede.IDHospede})"></a>
              </td>
            `;
            tableBody.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error('Erro ao carregar hóspedes:', error);
       
      });
  }
  
  // Função para cadastrar um hóspede
  function cadastrarHospede(event) {
    event.preventDefault(); 
  
    const form = event.target;
    const formData = new FormData(form);
  
    const nome = formData.get('name');
    const email = formData.get('email');
    const CPF = formData.get('carId');
    const telefone = formData.get('telephone');
    const endereco = formData.get('address');
  
    const apiUrl = 'http://localhost:3009/user/hospede'; // URL para a API de cadastro de hóspede
  
    // Envia os dados para a API via POST
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        NomeHospede: nome,
        Email: email,
        CPF: CPF,
        Endereco: endereco,
        Telefone: telefone
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao cadastrar hóspede');
      }
      return response.json(); // Retorna o hóspede cadastrado
    })
    .then(data => {
      alert('Hóspede cadastrado com sucesso!'); // Mensagem de sucesso
      form.reset(); // Limpa o formulário
      document.getElementById('modalHospedes').style.display = 'none'; // Fecha o modal (se aberto)
      carregarHospedes(); // Atualiza a lista de hóspedes
    })
    .catch(error => {
      console.error('Erro ao cadastrar hóspede:', error);
      alert('Erro ao cadastrar hóspede.');
    });
  }
  
  // Adiciona o evento de envio do formulário de cadastro
  const form = document.getElementById('registrationForm');
  form.addEventListener('submit', cadastrarHospede);
  
  // Carregar a lista de hóspedes ao carregar a página
  document.addEventListener('DOMContentLoaded', carregarHospedes);


  // Função para excluir um hóspede
function excluirHospede(idHospede) {
    const confirmacao = confirm('Você tem certeza que deseja excluir este hóspede?'); // Confirmação de exclusão
  
    if (confirmacao) {
      const apiUrl = `http://localhost:3009/user/delete/${idHospede}`; // URL para excluir o hóspede
  
      fetch(apiUrl, {
        method: 'DELETE', // Método DELETE para excluir o recurso
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir hóspede');
        }
        return response.json(); // Retorna a resposta da exclusão
      })
      .then(data => {
        alert('Hóspede excluído com sucesso!'); // Mensagem de sucesso
        carregarHospedes(); // Recarrega a lista de hóspedes
      })
      .catch(error => {
        console.error('Erro ao excluir hóspede:', error);
        alert('Erro ao excluir o hóspede.');
      });
    }
  }
  