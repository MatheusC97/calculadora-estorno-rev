document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos
    const valorContratadoInput = document.getElementById('valorContratado');
    const periodicidadeSelect = document.getElementById('periodicidade');
    const mesesUtilizacaoSelect = document.getElementById('mesesUtilizacao');
    const aplicarMultaCheckbox = document.getElementById('aplicarMulta');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultsSection = document.querySelector('.results-section');

    // Elementos de resumo
    const resumoValorContratado = document.getElementById('resumoValorContratado');
    const resumoMrrAtual = document.getElementById('resumoMrrAtual');
    const resumoMesesUtilizacao = document.getElementById('resumoMesesUtilizacao');
    const resumoValorSemMulta = document.getElementById('resumoValorSemMulta');
    const resumoValorComMulta = document.getElementById('resumoValorComMulta');

    // Preenche as opções de Meses de Utilização (1 a 12)
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        mesesUtilizacaoSelect.appendChild(option);
    }

    // Função auxiliar para formatar como moeda BRL
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    calcularBtn.addEventListener('click', () => {
        const valorContratado = parseFloat(valorContratadoInput.value.replace(',', '.'));
        const periodicidade = parseInt(periodicidadeSelect.value);
        const mesesUtilizacao = parseInt(mesesUtilizacaoSelect.value);
        const aplicarMulta = aplicarMultaCheckbox.checked; // true se marcado, false se não

        // Validação básica
        if (isNaN(valorContratado) || valorContratado <= 0) {
            alert('Por favor, insira um valor contratado válido e positivo.');
            resultsSection.style.display = 'none';
            return;
        }
        if (isNaN(mesesUtilizacao) || mesesUtilizacao <= 0) {
            alert('Por favor, selecione os meses de utilização.');
            resultsSection.style.display = 'none';
            return;
        }

        // Cálculo do MRR Atual
        const mrrAtual = valorContratado / periodicidade;

        // Cálculo do Valor (sem multa)
        let valorSemMulta = valorContratado - (mrrAtual * mesesUtilizacao);
        
        // Garante que o valor sem multa não seja negativo (se o cliente utilizou mais do que pagou)
        if (valorSemMulta < 0) {
            valorSemMulta = 0;
        }

        let valorTotalEstorno = valorSemMulta;

        // Aplicação da multa, se necessário
        if (aplicarMulta) {
            const valorMulta = valorSemMulta * 0.30; // 30% de multa
            valorTotalEstorno = valorSemMulta - valorMulta;
        }
        
        // Garante que o estorno não seja negativo
        if (valorTotalEstorno < 0) {
            valorTotalEstorno = 0;
        }

        // Exibir resultados formatados
        resumoValorContratado.textContent = formatCurrency(valorContratado);
        resumoMrrAtual.textContent = formatCurrency(mrrAtual);
        resumoMesesUtilizacao.textContent = mesesUtilizacao; // Não é um valor monetário
        resumoValorSemMulta.textContent = formatCurrency(valorSemMulta);
        resumoValorComMulta.textContent = formatCurrency(valorTotalEstorno);

        resultsSection.style.display = 'block';
    });
});
