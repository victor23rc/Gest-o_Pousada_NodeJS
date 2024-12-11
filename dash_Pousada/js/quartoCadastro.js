// Função para carregar os quartos e exibir os ícones de editar e excluir
function loadQuartos() {
    fetch('http://localhost:3009/quartos/Lista')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('quartosTableBody');
            tableBody.innerHTML = ''; // Limpar a tabela antes de adicionar novos quartos

            data.forEach(quarto => {
                const row = document.createElement('tr');

                // Coluna do Número do Quarto
                const numeroQuartoCell = document.createElement('td');
                numeroQuartoCell.textContent = quarto.NumeroQuarto;  // Número do quarto


                // Coluna do Tipo
                const tipoCell = document.createElement('td');
                tipoCell.textContent = quarto.Tipo;

                // Coluna da Descrição
                const descricaoCell = document.createElement('td');
                descricaoCell.textContent = quarto.Descricao;


                // Coluna do Valor
                const valorCell = document.createElement('td');
                valorCell.textContent = `R$ ${parseFloat(quarto.Valor).toFixed(2)}`;  // Garantir que o valor seja um número com duas casas decimais

                // Coluna de Ações (Editar e Excluir)
                const acaoCell = document.createElement('td');
                acaoCell.classList.add('iconsTable');

                // Criar ícone de editar
                const editIcon = document.createElement('a');
                editIcon.href = '#';
                editIcon.classList.add('fa-regular', 'fa-pen-to-square');
                editIcon.style.color = '#5787db';
                editIcon.setAttribute('data-id', quarto.IDQuarto);
                editIcon.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    editQuarto(id);  // Chama a função de editar passando o ID do quarto
                });

                // Criar ícone de excluir
                const deleteIcon = document.createElement('a');
                deleteIcon.href = '#';
                deleteIcon.classList.add('fa-regular', 'fa-trash-can');
                deleteIcon.style.color = '#ff0000';
                deleteIcon.setAttribute('data-id', quarto.IDQuarto);
                deleteIcon.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    if (confirm("Tem certeza que deseja excluir esse quarto?")) {
                        deleteQuarto(id);  // Chama a função de excluir passando o ID do quarto
                    }
                });

                acaoCell.appendChild(editIcon);
                acaoCell.appendChild(deleteIcon);

                // Adicionando as células à linha da tabela
                row.appendChild(numeroQuartoCell); // Número do quarto
                row.appendChild(tipoCell);         // Tipo do quarto
                row.appendChild(descricaoCell);    // Descrição do quarto
                row.appendChild(valorCell);        // Valor do quarto
                row.appendChild(acaoCell);         // Ações (Editar/Excluir)

                // Adicionando a linha à tabela
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar quartos:', error);
          
        });
}

// Função para editar o quarto
function editQuarto(id) {
    fetch(`http://localhost:3009/quartos/${id}`)
        .then(response => response.json())
        .then(data => {
            // Exibir o formulário de cadastro de quarto
            toggleFormVisibility(true);

            // Preencher o formulário com os dados do quarto
            document.getElementById('number').value = data.NumeroQuarto;  // Número do quarto
            document.getElementById('Valor').value = data.Valor;
            document.getElementById('roomType').value = data.Tipo;
            document.getElementById('desc').value = data.Descricao;

            // Configurar o formulário para edição (marcar que estamos editando)
            const form = document.getElementById('registrationForm');
            form.dataset.editing = id;  // Armazenar o ID do quarto que está sendo editado
        })
        .catch(error => {
            console.error('Erro ao buscar dados para edição:', error);
            alert('Erro ao buscar dados para edição.');
        });
}

// Função para alternar a visibilidade do formulário de edição
function toggleFormVisibility(visible) {
    const form = document.getElementById('registrationForm');
    if (visible) {
        form.style.display = 'block'; // Exibir o formulário
    } else {
        form.style.display = 'none'; // Ocultar o formulário
    }
}

// Função para excluir o quarto
function deleteQuarto(id) {
    fetch(`http://localhost:3009/quartos/deletar/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar quarto');
        }
        return response.json();
    })
    .then(data => {
        // Após a exclusão, remover a linha da tabela
        const row = document.querySelector(`a[data-id="${id}"]`).closest('tr');
        row.remove();
        alert("Quarto deletado com sucesso!");
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao deletar quarto!");
    });
}

// Função para cadastrar um novo quarto
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Previne o envio padrão do formulário

    // Obtém os valores dos campos
    const numeroQuarto = document.getElementById("number").value;
    const valor = document.getElementById("Valor").value;
    const tipo = document.getElementById("roomType").value;
    const descricao = document.getElementById("desc").value;

    // Verificando se os campos foram preenchidos
    if (!numeroQuarto || !valor || !tipo || !descricao) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    // Cria o objeto com os dados a serem enviados
    const roomData = {
        NumeroQuarto: numeroQuarto,
        Valor: parseFloat(valor),  // Certificando-se que o valor é um número
        Tipo: tipo,
        Descricao: descricao
    };

    // Faz a requisição POST para a API de cadastro
    fetch('http://localhost:3009/quartos/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg) {
            alert(data.msg);  // Exibe mensagem de sucesso ou erro
        } else {
            alert("Quarto cadastrado com sucesso!");
            loadQuartos(); // Recarregar os quartos cadastrados
            document.getElementById('registrationForm').reset(); // Limpar o formulário
        }
    })
    .catch(error => {
        console.error("Erro ao cadastrar o quarto:", error);
        alert("Erro ao cadastrar o quarto. Tente novamente mais tarde.");
    });
});

// Carregar os quartos assim que a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    loadQuartos();
});
