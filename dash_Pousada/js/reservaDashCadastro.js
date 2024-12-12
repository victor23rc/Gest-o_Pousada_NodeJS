// Máscara para o CPF
function mascaraCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); 
  return cpf;
}

// Máscara para o Telefone
function mascaraTelefone(telefone) {
  telefone = telefone.replace(/\D/g, ""); 
  telefone = telefone.replace(/^(\d{2})(\d)/, "($1) $2");
  telefone = telefone.replace(/(\d{5})(\d{4})$/, "$1-$2"); 
  return telefone;
}


// aplica as máscaras
function aplicarMascara(event) {
  const campo = event.target;
  if (campo.id === "cpf") {
      campo.value = mascaraCPF(campo.value);
  } else if (campo.id === "guestPhone") {
      campo.value = mascaraTelefone(campo.value);
  }
}

// Aplicando as máscaras ao carregar a página
document.getElementById("cpf").addEventListener("input", aplicarMascara);
document.getElementById("guestPhone").addEventListener("input", aplicarMascara);




document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('openModalButton').addEventListener('click', function () {
    document.getElementById('modalReserva').style.display = 'block';
  });

  document.querySelector('.closeModalCargos').addEventListener('click', function () {
    document.getElementById('modalReserva').style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('modalReserva')) {
      document.getElementById('modalReserva').style.display = 'none';
    }
  });

  const form = document.getElementById('registrationForm');
  const modal = document.getElementById('modalReserva');

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const numeroQuarto = document.getElementById('formQuartos').value;
    const formaPagamento = document.getElementById('formPagamento').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const nome = document.getElementById('Salario').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('guestPhone').value;
    const email = document.getElementById('guestEmail').value;
    const adultos = parseInt(document.getElementById('adults').value) || 0;
    const criancas = parseInt(document.getElementById('children').value) || 0;

    const quantidadeHospedes = adultos + criancas;

    const days = calculateDays(checkin, checkout);
    if (days <= 0) {
      alert("A data de check-out deve ser posterior à data de check-in!");
      return;
    }

    const pricePerAdult = 50;
    const pricePerChild = 25;
    const baseRate = 100;
    const totalPrice = (baseRate * days) + (pricePerAdult * adultos * days) + (pricePerChild * criancas * days);

    const formData = {
      NumeroQuarto: numeroQuarto,
      IDFormaPagamento: formaPagamento,
      entrada: checkin,
      saida: checkout,
      QuantidadeHospedes: quantidadeHospedes,
      Valortotal: totalPrice.toFixed(2),
      Nome: nome,
      CPF: cpf,
      Telefone: telefone,
      Email: email,
    };

    console.log("Informações do Formulário:", formData);

    sendReservationData(formData);

    async function sendReservationData(formData) {
      try {
        const response = await fetch('http://localhost:3009/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer a reserva');
        }

        const data = await response.json();
        console.log('Reserva realizada:', data);

        const reservaId = data.reserva.IDreserva;

        const quartoReservadoData = {
          IDReserva: reservaId,
          NumeroQuarto: numeroQuarto,
          TipoQuarto: "Standard",
          NomeHospede: nome,
          CPF: cpf,
          DataEntrada: checkin,
          DataSaida: checkout,
          Status: "reservado"
        };

        const quartoReservadoResponse = await fetch('http://localhost:3009/quartosreservados/cadastrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quartoReservadoData),
        });

        if (!quartoReservadoResponse.ok) {
          throw new Error('Erro ao registrar o quarto reservado');
        }

        const quartoReservadoDataResponse = await quartoReservadoResponse.json();
        console.log('Quarto reservado criado:', quartoReservadoDataResponse);

        alert("Reserva e quarto reservado criados com sucesso!");
        modal.style.display = "none";

      } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao realizar a reserva, tente novamente!");
      }
      window.location.reload();
    }
    
  });


  function calculateDays(checkinDate, checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const timeDiff = checkout - checkin;
    return timeDiff / (1000 * 60 * 60 * 24);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").setAttribute("min", today);
  document.getElementById("checkout").setAttribute("min", today);
});

function calculateTotalPrice() {
  const adults = parseInt(document.getElementById('adults').value) || 0;
  const children = parseInt(document.getElementById('children').value) || 0;
  const checkinDate = document.getElementById('checkin').value;
  const checkoutDate = document.getElementById('checkout').value;

  if (checkinDate && checkoutDate) {
    const days = calculateDays(checkinDate, checkoutDate);
    if (days > 0) {
      const total = (baseRate * days) + (pricePerAdult * adults * days) + (pricePerChild * children * days);
      document.getElementById('preco-valor').textContent = total.toFixed(2).replace('.', ',');
    } else {
      document.getElementById('preco-valor').textContent = "0,00";
    }
  }
}

document.getElementById('adults').addEventListener('change', calculateTotalPrice);
document.getElementById('children').addEventListener('change', calculateTotalPrice);
document.getElementById('checkin').addEventListener('change', calculateTotalPrice);
document.getElementById('checkout').addEventListener('change', calculateTotalPrice);

function fetchReservas() {
  fetch('http://localhost:3009/reservas')
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('reservasTableBody');
      tableBody.innerHTML = '';

      data.reservas.forEach(reserva => {
        const row = document.createElement('tr');

        const numeroQuartoCell = document.createElement('td');
        numeroQuartoCell.textContent = reserva.NumeroQuarto || 'Não Informado';

        const tipoQuartoCell = document.createElement('td');
        tipoQuartoCell.textContent = reserva.quarto?.Tipo ?? 'Não Informado';  // Usando '??' para tratar valores null/undefined


        const nomeHospedeCell = document.createElement('td');
        nomeHospedeCell.textContent = reserva.Nome || 'Não Informado';

        const entradaCell = document.createElement('td');
        entradaCell.textContent = new Date(reserva.entrada).toLocaleDateString('pt-BR');

        const saidaCell = document.createElement('td');
        saidaCell.textContent = new Date(reserva.saida).toLocaleDateString('pt-BR');

        const hospedesCell = document.createElement('td');
        hospedesCell.textContent = reserva.QuantidadeHospedes || 'Não Informado';

        const acaoCell = document.createElement('td');
        acaoCell.classList.add('iconsTable');

        const editIcon = document.createElement('a');
        editIcon.href = '#';
        editIcon.classList.add('fa-regular', 'fa-pen-to-square');
        editIcon.style.color = '#5787db';

        editIcon.setAttribute('data-id', reserva.IDreserva);
        editIcon.addEventListener('click', (event) => {
          const id = event.target.getAttribute('data-id');
          editReserva(id);
        });

        const deleteIcon = document.createElement('a');
        deleteIcon.href = '#';
        deleteIcon.classList.add('fa-regular', 'fa-trash-can');
        deleteIcon.style.color = '#ff0000';
        deleteIcon.setAttribute('data-id', reserva.IDreserva);
        deleteIcon.addEventListener('click', (event) => {
          const id = event.target.getAttribute('data-id');
          if (confirm("Tem certeza que deseja excluir essa reserva?")) {
            deleteReserva(id);
          }
        });

        acaoCell.appendChild(editIcon);
        acaoCell.appendChild(deleteIcon);

        row.appendChild(numeroQuartoCell);
        row.appendChild(tipoQuartoCell);
        row.appendChild(nomeHospedeCell);
        row.appendChild(entradaCell);
        row.appendChild(saidaCell);
        row.appendChild(hospedesCell);
        row.appendChild(acaoCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar reservas:', error);

    });
}

async function fetchFormasPagamento() {
  try {
    const response = await fetch('http://localhost:3009/formasPagamento/Lista');
    if (!response.ok) {
      throw new Error('Falha ao obter formas de pagamento');
    }
    const formasPagamento = await response.json();
    const selectElement = document.getElementById('formPagamento');
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione uma forma de pagamento';
    selectElement.appendChild(defaultOption);

    formasPagamento.forEach(forma => {
      const option = document.createElement('option');
      option.value = forma.IDFormaPagamento;
      option.textContent = forma.NomePagamento;
      selectElement.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar formas de pagamento:', error);
  }
}

async function fetchQuartos() {
  try {
    const response = await fetch('http://localhost:3009/quartos/Lista');
    if (!response.ok) {
      throw new Error('Falha ao obter quartos');
    }
    const quartos = await response.json();
    const selectElement = document.getElementById('formQuartos');
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um quarto';
    selectElement.appendChild(defaultOption);

    quartos.forEach(quarto => {
      const option = document.createElement('option');
      option.value = quarto.NumeroQuarto;
      option.textContent = quarto.NumeroQuarto;
      selectElement.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar quartos:', error);
  }
}

function deleteReserva(id) {
  fetch(`http://localhost:3009/reservas/deletar/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao deletar quarto');
      }
      return response.json();
    })
    .then(data => {

      const row = document.querySelector(`a[data-id="${id}"]`).closest('tr');
      row.remove();
      alert("Reserva deletada com sucesso!");
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao deletar reserva!");
    });
}

window.onload = function () {
  fetchReservas();
  fetchFormasPagamento();
  fetchQuartos();
};
