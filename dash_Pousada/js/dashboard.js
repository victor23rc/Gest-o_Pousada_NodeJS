const fetchDashboardData = async () => {
  try {
    const response = await fetch('http://localhost:3009/reservas');
    const data = await response.json();

 
    if (Array.isArray(data.reservas)) {
      const reservas = data.reservas;

      
      const pessoasAlocadas = reservas.reduce((total, reserva) => total + reserva.QuantidadeHospedes, 0);

     
      const quartosLocados = new Set(reservas.map(reserva => reserva.NumeroQuarto)).size;


      const quantidadeReservas = reservas.length;

    
      const balancoMensal = reservas.reduce((total, reserva) => total + parseFloat(reserva.Valortotal), 0).toFixed(2);

     
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

// carregar 
fetchDashboardData();

function confirmarSaida() {
  return confirm("Certeza que deseja sair?");
}

// Função para carregar as acomodações reservadas
async function carregarAcomodosReservados() {
  try {
  
    const dataAtual = new Date().toISOString().split('T')[0];

    
    const responseReservas = await fetch('http://localhost:3009/quartosreservados/Lista');
    if (!responseReservas.ok) {
      throw new Error('Erro ao carregar as reservas');
    }
    const reservas = await responseReservas.json();

    
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    
    reservas.forEach(reserva => {
      
      const row = document.createElement('tr');

    
      const cellTipoQuarto = document.createElement('td');
      cellTipoQuarto.textContent = reserva.TipoQuarto;  

      const cellNumeroQuarto = document.createElement('td');
      cellNumeroQuarto.textContent = reserva.NumeroQuarto; 

      const cellIdReserva = document.createElement('td');
      cellIdReserva.textContent = reserva.IDReserva; 


      const dataSaida = new Date(reserva.DataSaida);
      const dataSaidaFormatada = dataSaida.toLocaleDateString('pt-BR'); 

      const cellDataSaida = document.createElement('td');
      cellDataSaida.textContent = dataSaidaFormatada; 

      const cellStatus = document.createElement('td');
      cellStatus.textContent = reserva.Status; 

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

// Carregar
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


    document.getElementById("popupDescricaoQuarto").textContent = data.quarto.Descricao;
    document.getElementById("popupTipoQuarto").textContent = data.quarto.Tipo;
    document.getElementById("popupValorQuarto").textContent = `R$ ${parseFloat(data.quarto.Valor).toFixed(2)}`;


    reservationPopup.style.display = "flex"; // 
  }


  popupClose.addEventListener("click", function () {
    reservationPopup.style.display = "none"; // pop-up
  });


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


async function loginUser() {
  const email = 'victor@gmail.com';
  const senha = '123';

  try {
    const response = await axios.post('http://localhost:3009/auth/login', { Email: email, Senha: senha });

    if (response.status === 200) {
      const token = response.data.token;
      localStorage.setItem("token", token);  

      setUserInfo();
    }
  } catch (error) {
    console.error('Erro ao fazer login', error);
  }
}


function setUserInfo() {
  const token = localStorage.getItem("token");  

  if (token) {
    const decodedToken = jwt_decode(token); 

   
    const userName = decodedToken.nome;

    
    const userNameElement = document.querySelector('.user-wrapper h4');
    if (userNameElement) {
      userNameElement.textContent = userName;  
    }
  }
}


window.onload = setUserInfo;
