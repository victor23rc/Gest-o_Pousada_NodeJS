const fetchDashboardData = async () => {
  try {
    const response = await fetch('http://localhost:3009/reservas');
    const data = await response.json();

    // Verifique se a resposta contém a chave "reservas" e é um array
    if (Array.isArray(data.reservas)) {
      const reservas = data.reservas;

      // 1. Quantidade de pessoas alocadas
      const pessoasAlocadas = reservas.reduce((total, reserva) => total + reserva.QuantidadeHospedes, 0);

      // 2. Quantidade de quartos locados
      const quartosLocados = new Set(reservas.map(reserva => reserva.NumeroQuarto)).size;

      // 3. Quantidade de reservas
      const quantidadeReservas = reservas.length;

      // 4. Balanço mensal (soma do valor total das reservas)
      const balancoMensal = reservas.reduce((total, reserva) => total + parseFloat(reserva.Valortotal), 0).toFixed(2);

      // Exibir os valores no front-end
      document.getElementById('pessoasAlocadas').textContent = pessoasAlocadas;
      document.getElementById('quartosLocados').textContent = quartosLocados;
      document.getElementById('quantidadeReservas').textContent = quantidadeReservas;
      document.getElementById('balancoMensal').textContent = `R$${balancoMensal}`;
    } else {
      console.error('A chave "reservas" não contém um array válido');
    }
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
  }
};

// Chama a função ao carregar a página
fetchDashboardData();

function confirmarSaida() {
  return confirm("Certeza que deseja sair?");
}

// Função para carregar as acomodações reservadas com seus detalhes
async function carregarAcomodosReservados() {
  try {
    // Obter a data atual no formato ISO (ex: "2024-12-08")
    const dataAtual = new Date().toISOString().split('T')[0];

    // Fazer requisição para a API de quartos reservados
    const responseReservas = await fetch('http://localhost:3009/quartosreservados/Lista');
    if (!responseReservas.ok) {
      throw new Error('Erro ao carregar as reservas');
    }
    const reservas = await responseReservas.json();

    // Obter referência para o corpo da tabela
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Limpar a tabela antes de preencher

    // Iterar sobre as reservas para preenchê-las na tabela
    reservas.forEach(reserva => {
      // Criar a linha da tabela
      const row = document.createElement('tr');

      // Criar células para cada informação
      const cellTipoQuarto = document.createElement('td');
      cellTipoQuarto.textContent = reserva.TipoQuarto;  // Tipo do Quarto (nome do quarto)

      const cellNumeroQuarto = document.createElement('td');
      cellNumeroQuarto.textContent = reserva.NumeroQuarto; // Número do Quarto

      const cellIdReserva = document.createElement('td');
      cellIdReserva.textContent = reserva.IDReserva; // ID da Reserva

      // Formatando a Data de Saída para o formato DD/MM/YYYY
      const dataSaida = new Date(reserva.DataSaida);
      const dataSaidaFormatada = dataSaida.toLocaleDateString('pt-BR'); // Exibe no formato DD/MM/YYYY

      const cellDataSaida = document.createElement('td');
      cellDataSaida.textContent = dataSaidaFormatada; // DataSaida formatada

      const cellStatus = document.createElement('td');
      cellStatus.textContent = reserva.Status; // Status da reserva (Ocupado / Livre)

      // Adicionar as células à linha
      row.appendChild(cellTipoQuarto);
      row.appendChild(cellNumeroQuarto);
      row.appendChild(cellIdReserva);
      row.appendChild(cellDataSaida);  // Adicionar a célula de Data de Saída
      row.appendChild(cellStatus);

      // Adicionar a linha à tabela
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Erro ao carregar dados:', error);

  }
}

// Carregar os dados assim que a página for carregada
carregarAcomodosReservados();

/////////////////// ver reserva unica 


document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const reservationPopup = document.getElementById("reservationPopup");
  const popupClose = document.getElementById("popupClose");

  // Função para abrir o pop-up com os dados da reserva
  function openPopup(data) {
    document.getElementById("popupIdReserva").textContent = data.IDreserva;
    document.getElementById("popupEntrada").textContent = new Date(data.entrada).toLocaleDateString();
    document.getElementById("popupSaida").textContent = new Date(data.saida).toLocaleDateString();
    document.getElementById("popupQuantidadeHospedes").textContent = data.QuantidadeHospedes;
    document.getElementById("popupValorTotal").textContent = `R$ ${parseFloat(data.Valortotal).toFixed(2)}`;
    document.getElementById("popupNome").textContent = data.Nome;
    document.getElementById("popupCPF").textContent = data.CPF;
    document.getElementById("popupTelefone").textContent = data.Telefone;
    document.getElementById("popupEmail").textContent = data.Email;
    document.getElementById("popupNumeroQuarto").textContent = data.NumeroQuarto;

    // Detalhes do quarto
    document.getElementById("popupDescricaoQuarto").textContent = data.quarto.Descricao;
    document.getElementById("popupTipoQuarto").textContent = data.quarto.Tipo;
    document.getElementById("popupValorQuarto").textContent = `R$ ${parseFloat(data.quarto.Valor).toFixed(2)}`;

    // Exibe o pop-up
    reservationPopup.style.display = "flex"; // Torna o pop-up visível
  }

  // Função para fechar o pop-up
  popupClose.addEventListener("click", function () {
    reservationPopup.style.display = "none"; // Oculta o pop-up
  });

  // Enviar a requisição para buscar os dados da reserva
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const reservaId = searchInput.value.trim();

      if (reservaId) {
        fetch(`http://localhost:3009/reservas/${reservaId}`)
          .then(response => response.json())
          .then(data => {
            if (data.msg === "Reserva encontrada com sucesso.") {
              openPopup(data.reserva);
            } else {
              alert("Reserva não encontrada.");
            }
          })
          .catch(error => {
            console.error("Erro ao buscar dados da reserva:", error);
            alert("Erro ao buscar dados da reserva.");
          });
      } else {
        alert("Por favor, digite um ID de reserva.");
      }
    }
  });
});

/////////// token

// Exemplo de requisição de login com o axios (ou fetch)
async function loginUser() {
  const email = 'victor@gmail.com';
  const senha = '123';

  try {
    const response = await axios.post('http://localhost:3009/auth/login', { Email: email, Senha: senha });

    if (response.status === 200) {
      const token = response.data.token;
      localStorage.setItem("token", token);  // Armazena o token no localStorage

      // Agora, você pode exibir o nome do usuário ou redirecionar para a página principal
      setUserInfo();
    }
  } catch (error) {
    console.error('Erro ao fazer login', error);
  }
}

// Função para configurar o nome do usuário após login
function setUserInfo() {
  const token = localStorage.getItem("token");  // Recupera o token JWT do localStorage

  if (token) {
    const decodedToken = jwt_decode(token); // Decodifica o token

    // O nome do usuário foi adicionado no payload, então podemos acessá-lo assim:
    const userName = decodedToken.nome;

    // Agora, você pode exibir o nome na página. Por exemplo:
    const userNameElement = document.querySelector('.user-wrapper h4');
    if (userNameElement) {
      userNameElement.textContent = userName;  // Define o nome do usuário na página
    }
  }
}

// Chame a função para configurar o nome do usuário ao carregar a página
window.onload = setUserInfo;
