


// Aguardando o envio do formulário
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();  

    // Captura os dados 
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telephone').value;
    const cargo = document.getElementById('levelUsers').value;  
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('address').value;

    // Validação de campos obrigatórios
    if (!nome || !email || !telefone || !cpf || !endereco || !cargo) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    // Monta o objeto 
    const funcionarioData = {
        NomeFuncionario: nome,
        Email: email,
        Telefone: telefone,
        CPF: cpf,
        Endereco: endereco,
        IDCargo: cargo,
        Status: 'ativo'  
    };

 
    cadastrarFuncionario(funcionarioData);
});

async function cadastrarFuncionario(funcionarioData) {
    try {
        const response = await fetch('http://localhost:3009/funcionarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcionarioData)  
        });

        
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erro: ' + errorData.msg || 'Erro desconhecido.');
            return;
        }

      
        const data = await response.json();
        alert('Funcionário cadastrado com sucesso!');
        console.log(data);  
        
      
        document.getElementById('modalFuncionarios').style.display = 'none';
        
       
        window.location.reload();
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        alert('Ocorreu um erro ao cadastrar o funcionário. Tente novamente mais tarde.');
    }
}


function carregarFuncionarios() {
    // URL da API
    const apiUrl = 'http://localhost:3009/funcionarios';

    // Fazendo a requisição para a API
    fetch(apiUrl)
        .then(response => response.json())  
        .then(funcionarios => {
           
            const tableBody = document.getElementById('teamTableBody');
            tableBody.innerHTML = ''; 

        
            if (funcionarios.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
            } else {

                funcionarios.forEach(funcionario => {
                
                    const row = document.createElement('tr');

               
                    row.innerHTML = `
                    <td>${funcionario.NomeFuncionario}</td>
                    <td>${funcionario.Telefone}</td>
                    <td>${formatarCPF(funcionario.CPF)}</td>
                    <td>${funcionario.cargo.NomeCargo}</td>
                    <td>${funcionario.Email}</td>
                    <td class="iconsTable">
                        <a href="#" class="fa-regular fa-pen-to-square" style="color: #5787db"></a>
                        <a href="#" class="fa-regular fa-trash-can" 
                           style="color: #ff0000" 
                           onclick="excluirFuncionario(${funcionario.IDFuncionario})"></a>
                    </td>
                `;
                    
               
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar funcionários:', error);
        });
}


function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}


document.addEventListener('DOMContentLoaded', carregarFuncionarios);


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Requisição para obter os cargos
        const response = await fetch('http://localhost:3009/cargos/Lista');
        
     
        if (!response.ok) {
            throw new Error('Erro ao buscar cargos');
        }

       
        const cargos = await response.json();

       
        const select = document.getElementById('levelUsers');

       
        select.innerHTML = '';

       
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Selecione um Cargo';
        defaultOption.value = '';
        select.appendChild(defaultOption);

      
        cargos.forEach(cargo => {
            const option = document.createElement('option');
            option.value = cargo.IDCargo;  
            option.textContent = cargo.NomeCargo;  
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cargos:', error);
        
    }
});











// Função para excluir um funcionário
async function excluirFuncionario(idFuncionario) {
    // Confirmar se o usuário realmente deseja excluir
    const confirmacao = confirm('Você tem certeza que deseja excluir este funcionário?');
    if (!confirmacao) return;  // Se o usuário cancelar a ação, nada será feito

    try {
        // Realizando a requisição DELETE para a API
        const response = await fetch(`http://localhost:3009/funcionarios/deletar/${idFuncionario}`, {
            method: 'DELETE',  // Método DELETE para excluir
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Checa se a resposta da API foi bem-sucedida (status 200 ou 204)
        if (response.ok) {
            // Caso a exclusão seja bem-sucedida
            alert('Funcionário excluído com sucesso!');
            
            // Recarregar a lista de funcionários após a exclusão
            carregarFuncionarios(); // Função que carrega a lista de funcionários (já implementada)
        } else {
            // Se a resposta não for ok, tenta pegar a mensagem de erro retornada pela API
            const errorData = await response.json();
            alert(`Erro ao excluir funcionário: ${errorData.msg || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Ocorreu um erro ao excluir o funcionário. Tente novamente mais tarde.');
    }
}


