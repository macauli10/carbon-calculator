// Calculadora de CO2 - Funções principais de cálculo

/**
 * Calcula as emissões de CO2 baseadas nos parâmetros fornecidos
 * @param {number} distancia - Distância percorrida em km
 * @param {string} tipoVeiculo - Tipo de veículo (chave de CO2_FACTORS)
 * @param {number} ocupantes - Número de ocupantes no veículo
 * @returns {Object} Objeto com resultados do cálculo
 */
function calcularEmissoesCO2(distancia, tipoVeiculo, ocupantes = 1) {
    // Validar entradas
    if (!distancia || distancia <= 0) {
        throw new Error("Distância deve ser um número positivo");
    }
    
    if (!CO2_FACTORS[tipoVeiculo]) {
        throw new Error("Tipo de veículo inválido");
    }
    
    if (!ocupantes || ocupantes <= 0) {
        ocupantes = 1;
    }
    
    // Fator de emissão do veículo (kg CO2 por km)
    const fatorEmissao = CO2_FACTORS[tipoVeiculo];
    
    // Cálculo da emissão total (kg CO2)
    const emissaoTotal = distancia * fatorEmissao;
    
    // Cálculo da emissão por pessoa (kg CO2)
    const emissaoPorPessoa = emissaoTotal / ocupantes;
    
    // Cálculo de árvores necessárias para compensação
    const arvoresNecessarias = emissaoPorPessoa * COMPENSATION_FACTOR;
    
    // Determinar nível de impacto ambiental
    const nivelImpacto = determinarNivelImpacto(emissaoPorPessoa);
    
    // Retornar objeto com resultados
    return {
        distancia: distancia,
        veiculo: tipoVeiculo,
        ocupantes: ocupantes,
        fatorEmissao: fatorEmissao,
        emissaoTotal: parseFloat(emissaoTotal.toFixed(2)),
        emissaoPorPessoa: parseFloat(emissaoPorPessoa.toFixed(2)),
        arvoresNecessarias: parseFloat(arvoresNecessarias.toFixed(2)),
        nivelImpacto: nivelImpacto,
        dataCalculo: new Date().toISOString()
    };
}

/**
 * Determina o nível de impacto ambiental baseado nas emissões
 * @param {number} emissaoPorPessoa - Emissão de CO2 por pessoa em kg
 * @returns {string} Nível de impacto (BAIXO, MODERADO, ALTO, MUITO_ALTO)
 */
function determinarNivelImpacto(emissaoPorPessoa) {
    if (emissaoPorPessoa <= IMPACT_LEVELS.BAIXO) {
        return "BAIXO";
    } else if (emissaoPorPessoa <= IMPACT_LEVELS.MODERADO) {
        return "MODERADO";
    } else if (emissaoPorPessoa <= IMPACT_LEVELS.ALTO) {
        return "ALTO";
    } else {
        return "MUITO_ALTO";
    }
}

/**
 * Calcula a porcentagem de impacto para a barra de progresso
 * @param {number} emissaoPorPessoa - Emissão de CO2 por pessoa em kg
 * @returns {number} Porcentagem de 0 a 100
 */
function calcularPorcentagemImpacto(emissaoPorPessoa) {
    const maxEmissao = 100; // Consideramos 100 kg como máximo para 100%
    let porcentagem = (emissaoPorPessoa / maxEmissao) * 100;
    
    // Limitar entre 0 e 100
    return Math.min(Math.max(porcentagem, 0), 100);
}

/**
 * Compara as emissões entre diferentes tipos de veículos
 * @param {number} distancia - Distância percorrida em km
 * @param {string} veiculoBase - Tipo de veículo base para comparação
 * @param {number} ocupantes - Número de ocupantes
 * @returns {Array} Array de objetos com comparações
 */
function compararVeiculos(distancia, veiculoBase, ocupantes = 1) {
    const veiculosParaComparar = Object.keys(CO2_FACTORS);
    const resultados = [];
    
    // Calcular para cada veículo
    veiculosParaComparar.forEach(veiculo => {
        const resultado = calcularEmissoesCO2(distancia, veiculo, ocupantes);
        
        // Adicionar informações do veículo
        resultado.nomeVeiculo = VEHICLE_INFO[veiculo]?.nome || veiculo;
        resultado.icone = VEHICLE_INFO[veiculo]?.icone || "fas fa-question";
        
        resultados.push(resultado);
    });
    
    // Ordenar por emissão (menor para maior)
    resultados.sort((a, b) => a.emissaoPorPessoa - b.emissaoPorPessoa);
    
    return resultados;
}

/**
 * Calcula a economia de CO2 ao usar um veículo mais eficiente
 * @param {number} distancia - Distância percorrida em km
 * @param {string} veiculoAtual - Tipo de veículo atual
 * @param {string} veiculoAlternativo - Tipo de veículo alternativo
 * @param {number} ocupantes - Número de ocupantes
 * @returns {Object} Objeto com dados da economia
 */
function calcularEconomiaCO2(distancia, veiculoAtual, veiculoAlternativo, ocupantes = 1) {
    const emissaoAtual = calcularEmissoesCO2(distancia, veiculoAtual, ocupantes);
    const emissaoAlternativa = calcularEmissoesCO2(distancia, veiculoAlternativo, ocupantes);
    
    const economia = emissaoAtual.emissaoPorPessoa - emissaoAlternativa.emissaoPorPessoa;
    const percentualEconomia = (economia / emissaoAtual.emissaoPorPessoa) * 100;
    
    return {
        economiaCO2: parseFloat(economia.toFixed(2)),
        percentualEconomia: parseFloat(percentualEconomia.toFixed(1)),
        veiculoAtual: VEHICLE_INFO[veiculoAtual]?.nome || veiculoAtual,
        veiculoAlternativo: VEHICLE_INFO[veiculoAlternativo]?.nome || veiculoAlternativo,
        arvoresEconomizadas: parseFloat((economia * COMPENSATION_FACTOR).toFixed(2))
    };
}

/**
 * Converte unidades de medida
 * @param {number} valor - Valor a ser convertido
 * @param {string} tipoConversao - Tipo de conversão ('kmParaMilhas', 'kgParaLibras')
 * @returns {number} Valor convertido
 */
function converterUnidades(valor, tipoConversao) {
    switch (tipoConversao) {
        case 'kmParaMilhas':
            return valor * CONVERSION_FACTORS.KM_TO_MILES;
        case 'kgParaLibras':
            return valor * CONVERSION_FACTORS.KG_TO_LBS;
        default:
            return valor;
    }
}

/**
 * Formata um número para exibição com unidades
 * @param {number} valor - Valor a ser formatado
 * @param {string} tipo - Tipo de valor ('distancia', 'emissao', 'arvores')
 * @returns {string} Valor formatado
 */
function formatarValor(valor, tipo) {
    if (typeof valor !== 'number') {
        return valor;
    }
    
    switch (tipo) {
        case 'distancia':
            return `${valor.toFixed(1)} km`;
        case 'emissao':
            return `${valor.toFixed(2)} kg CO₂`;
        case 'arvores':
            return `${valor.toFixed(1)} árvores`;
        default:
            return valor.toString();
    }
}

// Exportar funções para uso global
window.calcularEmissoesCO2 = calcularEmissoesCO2;
window.determinarNivelImpacto = determinarNivelImpacto;
window.calcularPorcentagemImpacto = calcularPorcentagemImpacto;
window.compararVeiculos = compararVeiculos;
window.calcularEconomiaCO2 = calcularEconomiaCO2;
window.converterUnidades = converterUnidades;
window.formatarValor = formatarValor;