// Função para aplicar a máscara no CPF
function aplicarMascaraCPF(event) {
  let input = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
  if (input.length <= 11) {
    input = input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  event.target.value = input;
}

// Adicionando oq foi digitado no campo CPF
document.getElementById('guestCPF').addEventListener('input', aplicarMascaraCPF);


// Função para aplicar a máscara no Telefone
function aplicarMascaraTelefone(event) {
  let input = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
  if (input.length <= 11) {
    input = input.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  event.target.value = input;
}

// Adicionando oq foi digitado ao campo de Telefone
document.getElementById('guestPhone').addEventListener('input', aplicarMascaraTelefone);



const pricePerAdult = 50; // valor por adulto
const pricePerChild = 25; // valor por criança
const baseRate = 100; // diária do quarto

let NumeroQuarto = null;

// Função para calcular a quantidade de dias entre o checkin e checkout
function calculateDays(checkinDate, checkoutDate) {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const timeDiff = checkout - checkin;
  return timeDiff / (1000 * 60 * 60 * 24);
}

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").setAttribute("min", today);
  document.getElementById("checkout").setAttribute("min", today);
});

function highlightSelectedDays() {
  const checkinDate = document.getElementById("checkin").value;
  const checkoutDate = document.getElementById("checkout").value;
  if (checkinDate) {
    document.getElementById("checkin").classList.add("selected-day");
  }
  if (checkoutDate) {
    document.getElementById("checkout").classList.add("selected-day");
  }
}

document.querySelector('.btn-reservar').addEventListener('click', function (event) {
  event.preventDefault();

  const adults = document.getElementById('adults').value;
  const children = document.getElementById('children').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const price = document.getElementById('preco-valor').innerText;

  document.getElementById('modal-adults').innerText = adults;
  document.getElementById('modal-children').innerText = children;
  document.getElementById('modal-checkin').innerText = checkin;
  document.getElementById('modal-checkout').innerText = checkout;
  document.getElementById('modal-price').innerText = price;

  new bootstrap.Modal(document.getElementById('confirmModal')).show();
});

// Função de confirmação da reserva
function confirmReservation() {
  const name = document.getElementById('guestName').value;
  const phone = document.getElementById('guestPhone').value;
  const email = document.getElementById('guestEmail').value;
  const cpf = document.getElementById('guestCPF').value;
  const payment = document.getElementById('paymentMethod').value;

  if (name && phone && email && cpf && payment) {
    alert('Reserva confirmada! Obrigado, ' + name + '!');
    document.getElementById('confirmModal').modal('hide');
    cadastrarReserva();
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

// Função para calcular o preço total da reserva
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

// Função para buscar as formas de pagamento da API
async function fetchPaymentMethods() {
  try {
    const response = await fetch('http://localhost:3009/formasPagamento/Lista');
    if (!response.ok) {
      throw new Error('Erro ao buscar formas de pagamento');
    }

    const formasPagamento = await response.json();
    const selectElement = document.getElementById('paymentMethod');
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione uma forma de pagamento';
    selectElement.appendChild(defaultOption);

    formasPagamento.forEach(formaPagamento => {
      const option = document.createElement('option');
      option.value = formaPagamento.IDFormaPagamento;
      option.textContent = formaPagamento.NomePagamento;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar as formas de pagamento:', error);
  }
}

document.querySelectorAll('.btn-reservar').forEach(button => {
  button.addEventListener('click', function () {

    NumeroQuarto = this.getAttribute('data-room-id');
    console.log(`Quarto selecionado: ${NumeroQuarto}`);
  });
});

// Função de cadastro de reserva
const cadastrarReserva = () => {
  const Nome = document.getElementById('guestName').value;
  const Email = document.getElementById('guestEmail').value;
  const CPF = document.getElementById('guestCPF').value;
  const Telefone = document.getElementById('guestPhone').value;
  const entrada = document.getElementById('checkin').value;
  const saida = document.getElementById('checkout').value;
  let Valortotal = document.getElementById('preco-valor').innerText;

  

  if (NumeroQuarto === null) {
    alert('Por favor, selecione um quarto antes de confirmar a reserva.');
    return;
  }

  // Calculando a quantidade de hóspedes (adultos + crianças)
  const quantidadeAdultos = parseInt(document.getElementById('adults').value) || 0;
  const quantidadeCriancas = parseInt(document.getElementById('children').value) || 0;
  const quantidadeHospedes = quantidadeAdultos + quantidadeCriancas;
  const IDFormaPagamento = document.getElementById('paymentMethod').value;

  Valortotal = parseFloat(Valortotal.replace(',', '.')).toFixed(2);

  console.log({
    Nome: Nome,
    Email: Email,
    CPF: CPF,
    Telefone: Telefone,
    entrada: entrada,
    saida: saida,
    Valortotal: Valortotal,
    QuantidadeHospedes: quantidadeHospedes,
    IDFormaPagamento: IDFormaPagamento,
    NumeroQuarto: NumeroQuarto
  });

  let campoErro = '';
  if (!Nome) {
    campoErro = 'Nome';
  } else if (!Email) {
    campoErro = 'Email';
  } else if (!CPF) {
    campoErro = 'CPF';
  } else if (!Telefone) {
    campoErro = 'Telefone';
  } else if (!entrada) {
    campoErro = 'Data de Entrada';
  } else if (!saida) {
    campoErro = 'Data de Saída';
  } else if (!IDFormaPagamento) {
    campoErro = 'Forma de Pagamento';
  } else if (!NumeroQuarto) {
    campoErro = 'Número do Quarto';
  }

  if (campoErro) {
    alert(`Por favor, preencha o campo: ${campoErro}`);
    return;
  }

  const apiUrl = 'http://localhost:3009/reservas';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Nome: Nome,
      Email: Email,
      CPF: CPF,
      Telefone: Telefone,
      entrada: entrada,
      saida: saida,
      Valortotal: Valortotal,
      QuantidadeHospedes: quantidadeHospedes,
      IDFormaPagamento: IDFormaPagamento,
      NumeroQuarto: NumeroQuarto
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao cadastrar reserva');
      }
      return response.json();
    })
    .then(async data => {
      const reservaId = data.reserva.IDreserva;
      const quartoReservadoData = {
        IDReserva: reservaId,
        NumeroQuarto: NumeroQuarto,
        TipoQuarto: "Standard",
        NomeHospede: Nome,
        CPF: CPF,
        DataEntrada: entrada,
        DataSaida: saida,
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

      alert("Reserva realizada com sucesso, informações enviadas via e-mail!");
      document.getElementById('registrationForm').reset();
      document.getElementById('registrationForm').style.display = 'none';
      window.location.reload();
    })
    .catch(error => {
      console.error('Erro ao cadastrar reserva:', error);
      alert('O quarto já está reservado para as datas solicitadas. Tente outro período');
    });
};

document.addEventListener('DOMContentLoaded', function () {
  fetchPaymentMethods();

  const form = document.querySelector('#registrationForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      cadastrarReserva();
    });
  }
});
