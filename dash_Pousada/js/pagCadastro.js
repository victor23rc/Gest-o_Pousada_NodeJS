document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Impede o envio padrão do formulário

    const nomePagamento = document.getElementById('name').value;
    const descricao = document.getElementById('descricao').value;

    // Verificando se os campos foram preenchidos
    if (!nomePagamento || !descricao) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const dados = {
        NomePagamento: nomePagamento,
        Descricao: descricao,
        Status: "ativo"  
    };

    try {
        // Verificar se estamos editando ou criando
        if (this.dataset.editing) {
            // Estamos editando uma forma de pagamento, enviar uma requisição PUT
            const id = this.dataset.editing;
            const response = await fetch(`http://localhost:3009/formasPagamento/alterar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),  // Enviar os dados alterados
            });

            const result = await response.json();

            if (response.ok) {
                alert("Forma de pagamento atualizada com sucesso!");
                loadFormasPagamento(); // Recarregar as formas de pagamento
                document.getElementById('registrationForm').reset(); // Limpar o formulário
                this.dataset.editing = ''; // Limpar o ID de edição
                toggleFormVisibility(false); // Ocultar o formulário após a edição
            } else {
                alert(result.msg || "Erro ao atualizar forma de pagamento.");
            }
        } else {
            // Caso contrário, estamos criando uma nova forma de pagamento
            const response = await fetch('http://localhost:3009/formasPagamento/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),  // Enviar os dados para criação
            });

            const result = await response.json();

            if (response.ok) {
                alert("Forma de pagamento cadastrada com sucesso!");
                loadFormasPagamento(); // Recarregar as formas de pagamento
                document.getElementById('registrationForm').reset(); // Limpar o formulário
            } else {
                alert(result.msg || "Erro ao cadastrar forma de pagamento.");
            }
        }
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro no servidor, tente novamente mais tarde.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadFormasPagamento();
});

// Função para carregar as formas de pagamento
function loadFormasPagamento() {
    fetch('http://localhost:3009/formasPagamento/Lista')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('formasPagamentoTableBody');
            tableBody.innerHTML = ''; // Limpar a tabela antes de adicionar novas linhas

            data.forEach(forma => {
                const row = document.createElement('tr');

                const nomeCell = document.createElement('td');
                nomeCell.textContent = forma.NomePagamento;

                const acaoCell = document.createElement('td');
                acaoCell.classList.add('iconsTable');

                // Criar ícone de editar
                const editIcon = document.createElement('a');
                editIcon.href = '#';
                editIcon.classList.add('fa-regular', 'fa-pen-to-square');
                editIcon.style.color = '#5787db';
                editIcon.setAttribute('data-id', forma.IDFormaPagamento);
                editIcon.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    editFormaPagamento(id);  // Chama a função de editar passando o ID
                });

                // Criar ícone de excluir
                const deleteIcon = document.createElement('a');
                deleteIcon.href = '#';
                deleteIcon.classList.add('fa-regular', 'fa-trash-can');
                deleteIcon.style.color = '#ff0000';
                deleteIcon.setAttribute('data-id', forma.IDFormaPagamento);
                deleteIcon.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    if (confirm("Tem certeza que deseja excluir essa forma de pagamento?")) {
                        deleteFormaPagamento(id);  // Chama a função de deletar passando o ID
                    }
                });

                acaoCell.appendChild(editIcon);
                acaoCell.appendChild(deleteIcon);

                row.appendChild(nomeCell);
                row.appendChild(acaoCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar formas de pagamento:', error);
        });
}


// Função para editar a forma de pagamento
function editFormaPagamento(id) {
    // Buscar os dados da forma de pagamento a ser editada
    fetch(`http://localhost:3009/formasPagamento/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos para edição:", data);  // Log para verificar os dados recebidos

            // Exibir o pop-up de edição
            togglePopupVisibility(true);

            // Preencher o formulário com os dados da forma de pagamento
            document.getElementById('name').value = data.NomePagamento;
            document.getElementById('descricao').value = data.Descricao;

            // Configurar o formulário para edição (armazena o ID da forma de pagamento)
            const form = document.getElementById('editFormPG');
            form.dataset.editing = id;
        })
        .catch(error => {
            console.error('Erro ao buscar dados para edição:', error);
            alert('Erro ao buscar dados para edição.');
        });
}


// Função para alternar a visibilidade do pop-up de edição
function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    popup.style.display = visible ? 'block' : 'none';
}




// Evento de envio do formulário de edição
document.getElementById('editFormPG').addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Alterando para os novos IDs dos campos no formulário pop-up
    const nomePagamento = document.getElementById('namePUT').value;
    const descricao = document.getElementById('descricaoPUT').value;

    // Verificando se os campos foram preenchidos
    if (!nomePagamento || !descricao) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const dados = {
        NomePagamento: nomePagamento,
        Descricao: descricao
    };

    const id = this.dataset.editing; // Obter o ID da forma de pagamento a ser editada

    console.log("Dados a serem enviados para a API:", dados);  // Log para verificar os dados antes de enviar à API

    try {
        const response = await fetch(`http://localhost:3009/formasPagamento/alterar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const result = await response.json();
        console.log("Resposta da API após atualização:", result);  // Log para verificar a resposta da API

        if (response.ok) {
            alert("Forma de pagamento atualizada com sucesso!");
            loadFormasPagamento(); // Recarregar as formas de pagamento
            togglePopupVisibility(false); // Fechar o pop-up após a edição
        } else {
            alert(result.msg || "Erro ao atualizar forma de pagamento.");
        }
    } catch (error) {
        console.error('Erro ao enviar os dados de edição:', error);
        alert("Erro ao editar forma de pagamento, tente novamente.");
    }
});



// Função para alternar a visibilidade do pop-up de edição
function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    popup.style.display = visible ? 'block' : 'none';
}

///////////


document.getElementById('editFormPG').addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const nomePagamento = document.getElementById('name').value;
    const descricao = document.getElementById('descricao').value;


    if (!nomePagamento || !descricao) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const dados = {
        NomePagamento: nomePagamento,
        Descricao: descricao
    };

   

    const id = this.dataset.editing; // Obter o ID da forma de pagamento a ser editada

    try {
        const response = await fetch(`http://localhost:3009/formasPagamento/alterar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Forma de pagamento atualizada com sucesso!");
            loadFormasPagamento(); // Recarregar as formas de pagamento
            togglePopupVisibility(false); // Fechar o pop-up após a edição
        } else {
            alert(result.msg || "Erro ao atualizar forma de pagamento.");
        }
    } catch (error) {
        console.error('Erro ao enviar os dados de edição:', error);
        alert("Erro ao editar forma de pagamento, tente novamente.");
    }
});


//////////////


// Função para deletar a forma de pagamento
function deleteFormaPagamento(id) {
    fetch(`http://localhost:3009/formasPagamento/deletar/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar forma de pagamento');
        }
        return response.json();
    })
    .then(data => {
        // Após a exclusão, remover a linha da tabela
        const row = document.querySelector(`a[data-id="${id}"]`).closest('tr');
        row.remove();
        alert("Forma de pagamento deletada com sucesso!");
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao deletar forma de pagamento!");
    });
}


// Função para alternar a visibilidade do pop-up
function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    if (visible) {
        popup.style.display = 'block'; // Exibir o pop-up
    } else {
        popup.style.display = 'none'; // Ocultar o pop-up
    }
}

// Função para fechar o pop-up ao clicar no "X"
document.getElementById('closePopup').addEventListener('click', function() {
    togglePopupVisibility(false); // Oculta o pop-up
});

// Opcional: Fecha o pop-up quando o usuário clica fora do conteúdo
window.addEventListener('click', function(event) {
    const popup = document.getElementById('editPopup');
    if (event.target === popup) {
        togglePopupVisibility(false); // Fecha o pop-up se o clique for fora do conteúdo
    }
});
