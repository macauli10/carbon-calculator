// Dados de rotas predefinidas para facilitar os testes
const PREDEFINED_ROUTES = {
    "São Paulo - Rio de Janeiro": {
        origem: "São Paulo, SP",
        destino: "Rio de Janeiro, RJ",
        distancia: 430, // km
        duracao: "5h 30min",
        descricao: "Rodovia Presidente Dutra"
    },
    "Rio de Janeiro - Belo Horizonte": {
        origem: "Rio de Janeiro, RJ",
        destino: "Belo Horizonte, MG",
        distancia: 450,
        duracao: "6h",
        descricao: "Rodovia BR-040"
    },
    "São Paulo - Campinas": {
        origem: "São Paulo, SP",
        destino: "Campinas, SP",
        distancia: 100,
        duracao: "1h 30min",
        descricao: "Rodovia Bandeirantes"
    },
    "Brasília - Goiânia": {
        origem: "Brasília, DF",
        destino: "Goiânia, GO",
        distancia: 210,
        duracao: "2h 45min",
        descricao: "Rodovia BR-060"
    },
    "Porto Alegre - Florianópolis": {
        origem: "Porto Alegre, RS",
        destino: "Florianópolis, SC",
        distancia: 460,
        duracao: "6h",
        descricao: "Rodovia BR-101"
    },
    "Salvador - Feira de Santana": {
        origem: "Salvador, BA",
        destino: "Feira de Santana, BA",
        distancia: 110,
        duracao: "1h 45min",
        descricao: "Rodovia BR-324"
    },
    "Fortaleza - Natal": {
        origem: "Fortaleza, CE",
        destino: "Natal, RN",
        distancia: 530,
        duracao: "7h",
        descricao: "Rodovia BR-304"
    },
    "Curitiba - São Paulo": {
        origem: "Curitiba, PR",
        destino: "São Paulo, SP",
        distancia: 410,
        duracao: "5h 15min",
        descricao: "Rodovia Régis Bittencourt"
    }
};

// Coordenadas geográficas de cidades brasileiras para o mapa
const CITY_COORDINATES = {
    "São Paulo, SP": [-23.5505, -46.6333],
    "Rio de Janeiro, RJ": [-22.9068, -43.1729],
    "Belo Horizonte, MG": [-19.9191, -43.9386],
    "Brasília, DF": [-15.7801, -47.9292],
    "Salvador, BA": [-12.9714, -38.5014],
    "Fortaleza, CE": [-3.7172, -38.5434],
    "Manaus, AM": [-3.1190, -60.0217],
    "Curitiba, PR": [-25.4284, -49.2733],
    "Recife, PE": [-8.0476, -34.8770],
    "Porto Alegre, RS": [-30.0346, -51.2177],
    "Belém, PA": [-1.4558, -48.4902],
    "Goiânia, GO": [-16.6869, -49.2648],
    "Campinas, SP": [-22.9056, -47.0608],
    "São Luís, MA": [-2.5387, -44.2823],
    "Natal, RN": [-5.7793, -35.2009],
    "Florianópolis, SC": [-27.5954, -48.5480],
    "Maceió, AL": [-9.6481, -35.7172],
    "João Pessoa, PB": [-7.1195, -34.8450],
    "Teresina, PI": [-5.0919, -42.8038],
    "Cuiabá, MT": [-15.6010, -56.0974],
    "Aracaju, SE": [-10.9472, -37.0731],
    "Porto Velho, RO": [-8.7612, -63.9039],
    "Boa Vista, RR": [2.8195, -60.6714],
    "Rio Branco, AC": [-9.9754, -67.8249],
    "Macapá, AP": [0.0349, -51.0664],
    "Vitória, ES": [-20.3155, -40.3128],
    "Palmas, TO": [-10.1844, -48.3336],
    "Feira de Santana, BA": [-12.2667, -38.9667]
};

// Histórico de cálculos (armazenado no localStorage)
let calculationHistory = [];

// Inicializar histórico do localStorage
function initializeHistory() {
    const savedHistory = localStorage.getItem('co2CalculatorHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
    }
}

// Salvar cálculo no histórico
function saveToHistory(calculation) {
    calculationHistory.unshift(calculation); // Adiciona no início
    
    // Limitar histórico aos últimos 50 cálculos
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    
    // Salvar no localStorage
    localStorage.setItem('co2CalculatorHistory', JSON.stringify(calculationHistory));
    
    // Atualizar estatísticas globais
    updateGlobalStats();
}

// Obter histórico
function getHistory() {
    return calculationHistory;
}

// Limpar histórico
function clearHistory() {
    calculationHistory = [];
    localStorage.removeItem('co2CalculatorHistory');
    updateGlobalStats();
}

// Exportar histórico como JSON
function exportHistory() {
    const dataStr = JSON.stringify(calculationHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'historico-co2.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Atualizar estatísticas globais
function updateGlobalStats() {
    const totalCalculations = calculationHistory.length;
    const totalCO2 = calculationHistory.reduce((sum, calc) => sum + calc.emissaoTotal, 0);
    const totalTrees = calculationHistory.reduce((sum, calc) => sum + calc.arvoresNecessarias, 0);
    
    // Atualizar no DOM se os elementos existirem
    if (document.getElementById('total-calculos')) {
        document.getElementById('total-calculos').textContent = totalCalculations;
    }
    
    if (document.getElementById('total-co2')) {
        document.getElementById('total-co2').textContent = Math.round(totalCO2);
    }
    
    if (document.getElementById('total-arvores')) {
        document.getElementById('total-arvores').textContent = Math.round(totalTrees);
    }
}

// Obter coordenadas de uma cidade
function getCityCoordinates(cityName) {
    return CITY_COORDINATES[cityName] || null;
}

// Obter rotas predefinidas
function getPredefinedRoutes() {
    return PREDEFINED_ROUTES;
}

// Inicializar ao carregar
initializeHistory();

// Exportar para uso global
window.PREDEFINED_ROUTES = PREDEFINED_ROUTES;
window.CITY_COORDINATES = CITY_COORDINATES;
window.calculationHistory = calculationHistory;
window.saveToHistory = saveToHistory;
window.getHistory = getHistory;
window.clearHistory = clearHistory;
window.exportHistory = exportHistory;
window.updateGlobalStats = updateGlobalStats;
window.getCityCoordinates = getCityCoordinates;
window.getPredefinedRoutes = getPredefinedRoutes;