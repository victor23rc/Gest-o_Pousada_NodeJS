document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();  

    const nomePagamento = document.getElementById('name').value;
    const descricao = document.getElementById('descricao').value;

  
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
        
        if (this.dataset.editing) {
            
            const id = this.dataset.editing;
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
                loadFormasPagamento(); 
                document.getElementById('registrationForm').reset(); 
                this.dataset.editing = ''; 
                toggleFormVisibility(false); 
            } else {
                alert(result.msg || "Erro ao atualizar forma de pagamento.");
            }
        } else {
       
            const response = await fetch('http://localhost:3009/formasPagamento/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),  
            });

            const result = await response.json();

            if (response.ok) {
                alert("Forma de pagamento cadastrada com sucesso!");
                loadFormasPagamento(); 
                document.getElementById('registrationForm').reset(); 
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


function loadFormasPagamento() {
    fetch('http://localhost:3009/formasPagamento/Lista')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('formasPagamentoTableBody');
            tableBody.innerHTML = ''; 

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
                    editFormaPagamento(id);  // id do editar
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
                        deleteFormaPagamento(id);  
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



function editFormaPagamento(id) {
 
    fetch(`http://localhost:3009/formasPagamento/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos para edição:", data);  

         
            togglePopupVisibility(true);


            document.getElementById('name').value = data.NomePagamento;
            document.getElementById('descricao').value = data.Descricao;

        
            const form = document.getElementById('editFormPG');
            form.dataset.editing = id;
        })
        .catch(error => {
            console.error('Erro ao buscar dados para edição:', error);
            alert('Erro ao buscar dados para edição.');
        });
}



function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    popup.style.display = visible ? 'block' : 'none';
}





document.getElementById('editFormPG').addEventListener('submit', async function(e) {
    e.preventDefault(); 


    const nomePagamento = document.getElementById('namePUT').value;
    const descricao = document.getElementById('descricaoPUT').value;


    if (!nomePagamento || !descricao) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const dados = {
        NomePagamento: nomePagamento,
        Descricao: descricao
    };

    const id = this.dataset.editing; 

    console.log("Dados a serem enviados para a API:", dados);  

    try {
        const response = await fetch(`http://localhost:3009/formasPagamento/alterar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const result = await response.json();
        console.log("Resposta da API após atualização:", result);  

        if (response.ok) {
            alert("Forma de pagamento atualizada com sucesso!");
            loadFormasPagamento(); 
            togglePopupVisibility(false); 
        } else {
            alert(result.msg || "Erro ao atualizar forma de pagamento.");
        }
    } catch (error) {
        console.error('Erro ao enviar os dados de edição:', error);
        alert("Erro ao editar forma de pagamento, tente novamente.");
    }
});




function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    popup.style.display = visible ? 'block' : 'none';
}

///////////


document.getElementById('editFormPG').addEventListener('submit', async function(e) {
    e.preventDefault(); 

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

   

    const id = this.dataset.editing; 

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
            loadFormasPagamento(); 
            togglePopupVisibility(false); // Fechar o pop-up 
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
        
        const row = document.querySelector(`a[data-id="${id}"]`).closest('tr');
        row.remove();
        alert("Forma de pagamento deletada com sucesso!");
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao deletar forma de pagamento!");
    });
}



function togglePopupVisibility(visible) {
    const popup = document.getElementById('editPopup');
    if (visible) {
        popup.style.display = 'block'; 
    } else {
        popup.style.display = 'none'; 
    }
}


document.getElementById('closePopup').addEventListener('click', function() {
    togglePopupVisibility(false); 
});


window.addEventListener('click', function(event) {
    const popup = document.getElementById('editPopup');
    if (event.target === popup) {
        togglePopupVisibility(false); 
    }
});
