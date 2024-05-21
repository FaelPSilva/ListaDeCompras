var mascaraMoeda = (event) => {
    var onlyDigits = event.target.value
        .split("")
        .filter(s => /\d/.test(s))
        .join("")
        .padStart(3, "0");
    var digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    event.target.value = maskCurrency(digitsFloat);
};

var maskCurrency = (valor, locale = 'pt-BR', currency = 'BRL') => {

    var formattedValue = Number(valor).toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    });
    return formattedValue;
}


function formatarMoeda(valor) {

    // Verifica se o valor é válido
    if (isNaN(valor)) return valor;

    // Converte para string e remove caracteres não numéricos
    valor = valor.toString().replace(/\D/g, '');

    // Adiciona zeros à esquerda se necessário para garantir dois dígitos decimais
    valor = valor.padStart(3, '0');

    // Divide a parte inteira da parte decimal
    const parteInteira = valor.slice(0, -2);
    const parteDecimal = valor.slice(-2);

    // Formatação da parte inteira com separador de milhares
    const parteInteiraFormatada = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retorna o valor formatado com a parte decimal
    return `${parteInteiraFormatada},${parteDecimal}`;
}

var inputOrcamento = document.getElementById('meuOrçamento');
var botaoEnviarOrcamento = document.getElementById('envOrçamento');
var disponivelElemento = document.getElementById('disponivel');

botaoEnviarOrcamento.addEventListener('click', () => {
    let orcamento = document.getElementById('meuOrçamento').value.trim();
    let saldoElemento = document.getElementById('saldo');
    if (orcamento !== '') {
        console.log(orcamento)
        // var valorNumerico = parseFloat(orcamento.replace(/[^\d.,]/g, '').replace(',', '.'));

        //var valorFormatado = valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        var valorFormatado = formatarMoeda(orcamento);
        console.log(valorFormatado)

        saldoElemento.textContent = `SALDO: ${valorFormatado}`;
        disponivelElemento = document.getElementById('disponivel').textContent = `Disponível: ${valorFormatado}`;
    } else {
        alert('Digite um valor de orçamento válido.');
    }
});

var inputListaCompras = document.getElementById('produto');
var botaoAdicionarItem = document.getElementById('addItem');
var corpoTabelaCompras = document.getElementById('corpoTabelaCompras');

var botaoLimparLista = document.getElementById('botaoLimparLista');

let listaCompras = [];

botaoAdicionarItem.addEventListener('click', () => {
    var novoItem = inputListaCompras.value.trim().toLowerCase();
    if (novoItem !== '') {
        if (!itemJaNaLista(novoItem)) {
            adicionarItemATabela(novoItem);
            listaCompras.push(novoItem);
            inputListaCompras.value = '';

            var inputsPreco = document.querySelectorAll('#corpoTabelaCompras input[type="text"]');
            inputsPreco.forEach(input => {
                input.addEventListener('input', mascaraMoeda);
            });
        } else {
            alert('Item já está na lista');
        }
    } else {
        alert('Adicione algum produto');
    }
});

var botaoRemoverItem = document.getElementById('remove');
botaoRemoverItem.addEventListener('click', () => {
    var itemRemover = inputListaCompras.value.trim().toLowerCase();
    if (itemRemover !== '') {
        var indexItem = listaCompras.indexOf(itemRemover);
        if (indexItem !== -1) {
            listaCompras.splice(indexItem, 1);
            removerItemDaTabela(itemRemover);
        } else {
            alert('Item não está na lista');
        }
        inputListaCompras.value = '';

        calcularSaldoDisponivel();
    } else {
        alert('Digite o item a ser removido');
    }
});

function adicionarItemATabela(item) {
    var newRow = corpoTabelaCompras.insertRow();

    var cellItem = newRow.insertCell();
    var cellPreco = newRow.insertCell();
    var cellQuantidade = newRow.insertCell();
    var cellExcluir = newRow.insertCell();

    cellItem.textContent = item;

    var inputPreco = document.createElement('input');
    inputPreco.type = 'text';
    inputPreco.style.maxWidth = '80px';
    cellPreco.appendChild(inputPreco);

    var inputQuantidade = document.createElement('input');
    inputQuantidade.type = 'number';
    inputQuantidade.style.maxWidth = '50px';
    cellQuantidade.appendChild(inputQuantidade);

    var botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>'; // Ícone de lixeira
    botaoExcluir.classList.add('botao-excluir');
    cellExcluir.appendChild(botaoExcluir);

    botaoExcluir.addEventListener('click', () => {
        var indexItem = listaCompras.indexOf(item);
        if (indexItem !== -1) {
            listaCompras.splice(indexItem, 1);
            newRow.remove();

            calcularSaldoDisponivel();
        }
    });

    inputPreco.addEventListener('input', function (event) {
        mascaraMoeda(event);
        calcularSaldoDisponivel();
    });

    inputQuantidade.addEventListener('input', function (event) {
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        calcularSaldoDisponivel();
    });
}

function removerItemDaTabela(item) {
    var rows = corpoTabelaCompras.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')[0];
        if (cell.textContent.toLowerCase() === item) {
            corpoTabelaCompras.deleteRow(i);
            break;
        }
    }

    calcularSaldoDisponivel();
}


function itemJaNaLista(item) {
    return listaCompras.includes(item);
}

botaoLimparLista.addEventListener('click', () => {
    var confirmacao = confirm('Tem certeza que quer limpar a lista?');
    if (confirmacao) {
        limparLista();
    } else {
        alert('Operação cancelada');
    }
});


function formatarMoeda2(valor) {
    // Verifica se o valor é um número válido
    if (isNaN(valor)) return "Valor inválido";

    // Converte para um número de ponto flutuante e divide por 100 para representar corretamente os centavos
    let valorNumerico = parseFloat(valor) / 100;

    // Formata o número para o padrão de moeda brasileira
    return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}



function calcularSaldoDisponivel() {
    let disponivelElemento = document.getElementById('disponivel');
    let saldoElemento = document.querySelector("#saldo").textContent;
    var inputsPreco = document.querySelectorAll('#corpoTabelaCompras input[type="text"]');
    var inputsQuantidade = document.querySelectorAll('#corpoTabelaCompras input[type="number"]');

    let totalCompra = 0;

    for (let i = 0; i < inputsPreco.length; i++) {
        var preco = parseFloat(inputsPreco[i].value.replace(/[^\d.,]/g, '').replace(',', '.')) * 100;
        var quantidade = parseInt(inputsQuantidade[i].value) || 0;

        totalCompra += preco * quantidade;
    }

    let posicaoRS = saldoElemento.indexOf('R$');


    let precoNumericoTexto = saldoElemento.substring(posicaoRS + 2).trim();


    let saldo = Number(precoNumericoTexto.replace(/[^\d]/g, ''));


    console.log(saldo);


    var disponivel = saldo - totalCompra;

    disponivelElemento.textContent = `Disponível: ${formatarMoeda2(disponivel)}`;
    disponivelElemento.style.color = disponivel < 0 ? 'red' : 'green';
}

function limparLista() {
    corpoTabelaCompras.innerHTML = '';
    listaCompras = [];
    calcularSaldoDisponivel();
}
