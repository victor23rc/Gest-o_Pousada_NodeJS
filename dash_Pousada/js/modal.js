document.addEventListener("DOMContentLoaded", function () {
  function setupModalCargos() {
    const modalCargos = document.getElementById("modalCargos");
    const btnCargos = document.getElementById("openModalCargos");
    const spanCargos = document.getElementsByClassName("closeModalCargos")[0];

    btnCargos.onclick = function () {
      modalCargos.style.display = "block";
    };

    spanCargos.onclick = function () {
      modalCargos.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalCargos) {
        modalCargos.style.display = "none";
      }
    };
  }

  setupModalCargos();
});

document.addEventListener("DOMContentLoaded", function () {
  function setupModalPagamento() {
    const modalPagamento = document.getElementById("modalPagamento");
    const btnPagamento = document.getElementById("openModalPagamento");
    const spanPagamento = document.getElementsByClassName(
      "closeModalPagamento"
    )[0];

    btnPagamento.onclick = function () {
      modalPagamento.style.display = "block";
    };

    spanPagamento.onclick = function () {
      modalPagamento.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalPagamento) {
        modalPagamento.style.display = "none";
      }
    };
  }
  setupModalPagamento();
});

document.addEventListener("DOMContentLoaded", function () {
  function setupModalQuartos() {
    const modalQuartos = document.getElementById("modalQuartos");
    const btnQuartos = document.getElementById("openModalQuartos");
    const spanQuartos = document.getElementsByClassName("closeModalQuartos")[0];

    btnQuartos.onclick = function () {
      modalQuartos.style.display = "block";
    };

    spanQuartos.onclick = function () {
      modalQuartos.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalQuartos) {
        modalQuartos.style.display = "none";
      }
    };
  }
  setupModalQuartos();
});

document.addEventListener("DOMContentLoaded", function () {
  function setupModalFuncionarios() {
    const modalFuncionarios = document.getElementById("modalFuncionarios");
    const btnFuncionarios = document.getElementById("openModalFuncionarios");
    const spanFuncionarios = document.getElementsByClassName(
      "closeModalFuncionarios"
    )[0];

    btnFuncionarios.onclick = function () {
      modalFuncionarios.style.display = "block";
    };

    spanFuncionarios.onclick = function () {
      modalFuncionarios.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalFuncionarios) {
        modalFuncionarios.style.display = "none";
      }
    };
  }
  setupModalFuncionarios();
});

document.addEventListener("DOMContentLoaded", function () {
  function setupModalHospedes() {
    const modalHospedes = document.getElementById("modalHospedes");
    const btnHospedes = document.getElementById("openModalHospedes");
    const spanHospedes =
      document.getElementsByClassName("closeModalHospedes")[0];

    btnHospedes.onclick = function () {
      modalHospedes.style.display = "block";
    };

    spanHospedes.onclick = function () {
      modalHospedes.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalHospedes) {
        modalHospedes.style.display = "none";
      }
    };
  }
  setupModalHospedes();
});

document.addEventListener("DOMContentLoaded", function () {
  function setupModalUsuarios() {
    const modalUsuarios = document.getElementById("modalUsuarios");
    const btnUsuarios = document.getElementById("openModalUsuarios");
    const spanUsuarios =
      document.getElementsByClassName("closeModalUsuarios")[0];

    btnUsuarios.onclick = function () {
      modalUsuarios.style.display = "block";
    };

    spanUsuarios.onclick = function () {
      modalUsuarios.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modalUsuarios) {
        modalUsuarios.style.display = "none";
      }
    };
  }
  setupModalUsuarios();
});

//////////////////////// Modal Reserva ///////////////////


