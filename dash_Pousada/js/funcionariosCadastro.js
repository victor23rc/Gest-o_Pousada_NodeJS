


// Aguardando o envio do formulário
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Previne o comportamento padrão de envio do formulário

    // Captura os dados dos campos do formulário
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telephone').value;
    const cargo = document.getElementById('levelUsers').value;  // O valor selecionado do cargo
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('address').value;

    // Validação de campos obrigatórios
    if (!nome || !email || !telefone || !cpf || !endereco || !cargo) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    // Monta o objeto com os dados do funcionário
    const funcionarioData = {
        NomeFuncionario: nome,
        Email: email,
        Telefone: telefone,
        CPF: cpf,
        Endereco: endereco,
        IDCargo: cargo,
        Status: 'ativo'  // Supondo que o status seja sempre 'ativo' ao cadastrar
    };

    // Chama a função para enviar os dados para a API
    cadastrarFuncionario(funcionarioData);
});

// Função para realizar a requisição POST para cadastrar o funcionário
async function cadastrarFuncionario(funcionarioData) {
    try {
        const response = await fetch('http://localhost:3009/funcionarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcionarioData)  // Envia os dados em formato JSON
        });

        // Checa se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erro: ' + errorData.msg || 'Erro desconhecido.');
            return;
        }

        // Caso a requisição seja bem-sucedida
        const data = await response.json();
        alert('Funcionário cadastrado com sucesso!');
        console.log(data);  // Opcional: Exibir a resposta da API no console ou realizar outras ações.
        
        // Fechar o modal após o cadastro
        document.getElementById('modalFuncionarios').style.display = 'none';
        
        // Aqui, você pode adicionar a lógica para atualizar a lista de funcionários ou limpar o formulário.
        window.location.reload();
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        alert('Ocorreu um erro ao cadastrar o funcionário. Tente novamente mais tarde.');
    }
}

// Função para carregar a lista de funcionários
function carregarFuncionarios() {
    // URL da API
    const apiUrl = 'http://localhost:3009/funcionarios';

    // Fazendo a requisição para a API
    fetch(apiUrl)
        .then(response => response.json())  // Convertendo a resposta para JSON
        .then(funcionarios => {
            // Obtendo o corpo da tabela onde os dados serão inseridos
            const tableBody = document.getElementById('teamTableBody');
            tableBody.innerHTML = ''; // Limpando o conteúdo antes de adicionar os dados

            // Verificando se há funcionários para exibir
            if (funcionarios.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
            } else {
                // Iterando sobre os funcionários e criando as linhas da tabela
                funcionarios.forEach(funcionario => {
                    // Criando uma nova linha para o funcionário
                    const row = document.createElement('tr');

                    // Adicionando as células (td) para cada dado do funcionário
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
                    
                    // Adicionando a linha criada ao corpo da tabela
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar funcionários:', error);
        });
}

// Função para formatar CPF
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Chamar a função para carregar os funcionários quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarFuncionarios);


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Requisição para obter os cargos
        const response = await fetch('http://localhost:3009/cargos/Lista');
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar cargos');
        }

        // Converte a resposta em JSON
        const cargos = await response.json();

        // Obtém o select de cargos no formulário
        const select = document.getElementById('levelUsers');

        // Limpa qualquer conteúdo anterior (se necessário)
        select.innerHTML = '';

        // Adiciona a opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Selecione um Cargo';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        // Preenche o select com os cargos recebidos da API
        cargos.forEach(cargo => {
            const option = document.createElement('option');
            option.value = cargo.IDCargo;  // valor que será enviado ao servidor
            option.textContent = cargo.NomeCargo;  // texto que será exibido para o usuário
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cargos:', error);
        // Você pode exibir uma mensagem para o usuário ou lidar com o erro de outra maneira
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


