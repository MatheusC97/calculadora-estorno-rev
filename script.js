document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos Comuns ---
    const calcularBtn = document.getElementById('calcularBtn');
    const calcTypeRadios = document.querySelectorAll('input[name="calcType"]');
    
    // --- Elementos para Cálculo de ESTORNO ---
    const estornoFields = document.getElementById('estorno-fields');
    const valorContratadoEstornoInput = document.getElementById('valorContratadoEstorno');
    const periodicidadeEstornoSelect = document.getElementById('periodicidadeEstorno');
    const mesesUtilizacaoEstornoSelect = document.getElementById('mesesUtilizacaoEstorno');
    const aplicarMultaEstornoCheckbox = document.getElementById('aplicarMultaEstorno');
    
    const estornoResultsSection = document.getElementById('estorno-results');
    const resumoValorContratadoEstorno = document.getElementById('resumoValorContratadoEstorno');
    const resumoMrrAtualEstorno = document.getElementById('resumoMrrAtualEstorno');
    const resumoMesesUtilizacaoEstorno = document.getElementById('resumoMesesUtilizacaoEstorno');
    const resumoValorSemMultaEstorno = document.getElementById('resumoValorSemMultaEstorno');
    const valorMultaDisplayEstorno = document.getElementById('valorMultaDisplayEstorno');
    const resumoValorMultaEstorno = document.getElementById('resumoValorMultaEstorno');
    const resumoValorComMultaEstorno = document.getElementById('resumoValorComMultaEstorno');

    // --- Elementos para Cálculo de MULTA ---
    const multaFields = document.getElementById('multa-fields');
    const valorContratadoMultaInput = document.getElementById('valorContratadoMulta');
    const periodicidadeMultaSelect = document.getElementById('periodicidadeMulta');
    const mesesUtilizacaoMultaSelect = document.getElementById('mesesUtilizacaoMulta');

    const multaResultsSection = document.getElementById('multa-results');
    const resumoValorContratadoMulta = document.getElementById('resumoValorContratadoMulta');
    const resumoMrrAtualMulta = document.getElementById('resumoMrrAtualMulta');
    const resumoPeriodicidadeMulta = document.getElementById('resumoPeriodicidadeMulta');
    const resumoValorMultaMulta = document.getElementById('resumoValorMultaMulta');

    // --- Preenche as opções de Meses de Utilização (1 a 12) para AMBOS os selects ---
    for (let i = 1; i <= 12; i++) {
        const optionEstorno = document.createElement('option');
        optionEstorno.value = i;
        optionEstorno.textContent = i;
        mesesUtilizacaoEstornoSelect.appendChild(optionEstorno);

        const optionMulta = document.createElement('option');
        optionMulta.value = i;
        optionMulta.textContent = i;
        mesesUtilizacaoMultaSelect.appendChild(optionMulta);
    }

    // --- Função auxiliar para formatar como moeda BRL ---
    const formatCurrency = (value) => {
        if (isNaN(value)) {
            return 'R$ 0,00'; 
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // --- Função para limpar campos de um grupo ---
    function clearFields(groupElement) {
        const inputs = groupElement.querySelectorAll('input[type="number"]');
        const selects = groupElement.querySelectorAll('select');
        inputs.forEach(input => input.value = '0'); // Define como '0' ao invés de vazio
        selects.forEach(select => select.selectedIndex = 0); // Seleciona a primeira opção
        if (groupElement.querySelector('input[type="checkbox"]')) {
            groupElement.querySelector('input[type="checkbox"]').checked = false;
        }
    }

    // --- Função para esconder todas as seções de resultado ---
    function hideAllResults() {
        estornoResultsSection.style.display = 'none';
        multaResultsSection.style.display = 'none';
    }

    // --- Lógica para mostrar/esconder grupos de campos com base na escolha Multa/Estorno ---
    function toggleCalcFields() {
        const selectedCalcType = document.querySelector('input[name="calcType"]:checked').value;
        
        hideAllResults(); // Esconde os resultados sempre que a opção de cálculo muda

        if (selectedCalcType === 'estorno') {
            estornoFields.style.display = 'block';
            multaFields.style.display = 'none';
            clearFields(multaFields); // Limpa campos da seção de multa
        } else { // selectedCalcType === 'multa'
            estornoFields.style.display = 'none';
            multaFields.style.display = 'block';
            clearFields(estornoFields); // Limpa campos da seção de estorno
        }
    }

    // Adiciona listeners aos botões de rádio de tipo de cálculo
    calcTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleCalcFields);
    });

    // Chama a função uma vez ao carregar a página para definir o estado inicial
    toggleCalcFields();

    // --- Listener Principal do Botão Calcular ---
    calcularBtn.addEventListener('click', () => {
        const selectedCalcType = document.querySelector('input[name="calcType"]:checked').value;
        hideAllResults(); // Garante que apenas a seção relevante será mostrada

        if (selectedCalcType === 'estorno') {
            // --- Lógica de Cálculo de ESTORNO ---
            const valorContratado = parseFloat(valorContratadoEstornoInput.value.replace(',', '.'));
            const periodicidade = parseInt(periodicidadeEstornoSelect.value);
            const mesesUtilizacao = parseInt(mesesUtilizacaoEstornoSelect.value);
            const aplicarMulta = aplicarMultaEstornoCheckbox.checked;

            // Validação de ESTORNO
            if (isNaN(valorContratado) || valorContratado <= 0) {
                alert('Para o cálculo de Estorno: Por favor, insira um Valor Contratado válido e positivo.');
                return;
            }
            if (isNaN(mesesUtilizacao) || mesesUtilizacao <= 0) {
                alert('Para o cálculo de Estorno: Por favor, selecione os Meses de Utilização.');
                return;
            }

            const mrrAtual = valorContratado / periodicidade;
            let valorJaUtilizado = mrrAtual * mesesUtilizacao;
            let valorSemMulta = valorContratado - valorJaUtilizado;
            
            if (valorSemMulta < 0) {
                valorSemMulta = 0;
            }

            let valorDaMulta = 0;
            let valorTotalEstorno = valorSemMulta;

            if (aplicarMulta) {
                valorDaMulta = valorSemMulta * 0.30; // Multa padrão de 30%
                valorTotalEstorno = valorSemMulta - valorDaMulta;
            }
            
            if (valorTotalEstorno < 0) {
                valorTotalEstorno = 0;
            }

            // Exibir resultados de ESTORNO
            resumoValorContratadoEstorno.textContent = formatCurrency(valorContratado);
            resumoMrrAtualEstorno.textContent = formatCurrency(mrrAtual);
            resumoMesesUtilizacaoEstorno.textContent = mesesUtilizacao;
            resumoValorSemMultaEstorno.textContent = formatCurrency(valorSemMulta);
            
            if (aplicarMulta && valorDaMulta > 0) {
                valorMultaDisplayEstorno.style.display = 'block';
                resumoValorMultaEstorno.textContent = formatCurrency(valorDaMulta);
            } else {
                valorMultaDisplayEstorno.style.display = 'none';
                resumoValorMultaEstorno.textContent = formatCurrency(0);
            }

            resumoValorComMultaEstorno.textContent = formatCurrency(valorTotalEstorno);
            estornoResultsSection.style.display = 'block';

        } else { // selectedCalcType === 'multa'
            // --- Lógica de Cálculo de MULTA ---
            const valorContratado = parseFloat(valorContratadoMultaInput.value.replace(',', '.'));
            const periodicidade = parseInt(periodicidadeMultaSelect.value);
            const mesesUtilizacao = parseInt(mesesUtilizacaoMultaSelect.value);
            
            // Validação de MULTA
            if (isNaN(valorContratado) || valorContratado <= 0) {
                alert('Para o cálculo de Multa: Por favor, insira um Valor Contratado válido e positivo.');
                return;
            }
            if (isNaN(mesesUtilizacao) || mesesUtilizacao <= 0 || mesesUtilizacao >= 12) {
                alert('Para o cálculo de Multa: Por favor, selecione os Meses de Utilização (entre 1 e 11) para multa de fidelidade.');
                return;
            }

            const mrrAtual = valorContratado / periodicidade;
            const mesesRestantes = 12 - mesesUtilizacao;
            let valorDaMulta = 0;

            if (mesesRestantes > 0) { // Apenas calcula multa se ainda houver meses a serem utilizados
                valorDaMulta = mrrAtual * mesesRestantes;
            }

            // Exibir resultados de MULTA
            resumoValorContratadoMulta.textContent = formatCurrency(valorContratado);
            resumoMrrAtualMulta.textContent = formatCurrency(mrrAtual);
            resumoPeriodicidadeMulta.textContent = periodicidadeMultaSelect.options[periodicidadeMultaSelect.selectedIndex].text;
            resumoValorMultaMulta.textContent = formatCurrency(valorDaMulta);

            multaResultsSection.style.display = 'block';
        }
    });
});
