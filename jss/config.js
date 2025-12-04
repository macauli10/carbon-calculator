// Constantes de emissão de CO2 por tipo de veículo (kg CO2 por km)
const CO2_FACTORS = {
    // Transporte individual
    carro_gasolina: 0.12,      // Carro a gasolina (médio)
    carro_etanol: 0.05,        // Carro a etanol
    carro_diesel: 0.15,        // Carro a diesel
    carro_eletrico: 0.03,      // Carro elétrico (considerando produção de energia)
    moto: 0.08,                // Moto
    
    // Transporte coletivo
    onibus: 0.09,              // Ônibus (emissão por passageiro, considerando ocupação média)
    
    // Transporte de carga
    caminhao: 0.25,            // Caminhão (médio)
    
    // Transporte aéreo
    aviao: 0.18                // Avião (por passageiro, voos domésticos)
};

// Fator de compensação (árvores necessárias para compensar 1 kg de CO2)
const COMPENSATION_FACTOR = 0.022; // Uma árvore absorve aproximadamente 22 kg de CO2 por ano

// Limites para classificação de impacto ambiental (kg CO2 por pessoa)
const IMPACT_LEVELS = {
    BAIXO: 5,      // Até 5 kg CO2
    MODERADO: 20,  // Até 20 kg CO2
    ALTO: 50,      // Até 50 kg CO2
    MUITO_ALTO: 100 // Acima de 50 kg CO2
};

// Cores para os níveis de impacto
const IMPACT_COLORS = {
    BAIXO: "#4cd964",
    MODERADO: "#ffcc00",
    ALTO: "#ff9500",
    MUITO_ALTO: "#ff3b30"
};

// Textos para os níveis de impacto
const IMPACT_TEXTS = {
    BAIXO: "Baixo Impacto",
    MODERADO: "Impacto Moderado",
    ALTO: "Alto Impacto",
    MUITO_ALTO: "Impacto Muito Alto"
};

// Fatores de conversão
const CONVERSION_FACTORS = {
    KG_TO_TREES: COMPENSATION_FACTOR, // kg CO2 para árvores
    KM_TO_MILES: 0.621371,           // km para milhas
    KG_TO_LBS: 2.20462               // kg para libras
};

// Configurações padrão
const DEFAULT_SETTINGS = {
    distancia: 0,
    veiculo: "carro_gasolina",
    ocupantes: 1,
    unidadeDistancia: "km",
    unidadeEmissao: "kg",
    tema: "claro"
};

// Lista de veículos com informações detalhadas
const VEHICLE_INFO = {
    carro_gasolina: {
        nome: "Carro a Gasolina",
        icone: "fas fa-car",
        descricao: "Veículo movido a gasolina, emissões moderadas a altas",
        eficiencia: "8-12 km/l"
    },
    carro_etanol: {
        nome: "Carro a Etanol",
        icone: "fas fa-car",
        descricao: "Veículo movido a etanol, emissões mais baixas que gasolina",
        eficiencia: "7-10 km/l"
    },
    carro_diesel: {
        nome: "Carro a Diesel",
        icone: "fas fa-car",
        descricao: "Veículo movido a diesel, maior eficiência mas emissões mais altas",
        eficiencia: "12-16 km/l"
    },
    carro_eletrico: {
        nome: "Carro Elétrico",
        icone: "fas fa-car",
        descricao: "Veículo elétrico, emissões baixas (depende da fonte de energia)",
        eficiencia: "5-8 km/kWh"
    },
    moto: {
        nome: "Moto",
        icone: "fas fa-motorcycle",
        descricao: "Motocicleta, emissões moderadas",
        eficiencia: "20-30 km/l"
    },
    onibus: {
        nome: "Ônibus",
        icone: "fas fa-bus",
        descricao: "Transporte coletivo, emissão por passageiro",
        eficiencia: "2-3 km/l (por passageiro)"
    },
    caminhao: {
        nome: "Caminhão",
        icone: "fas fa-truck",
        descricao: "Veículo de carga, altas emissões",
        eficiencia: "3-5 km/l"
    },
    aviao: {
        nome: "Avião",
        icone: "fas fa-plane",
        descricao: "Transporte aéreo, altas emissões por passageiro",
        eficiencia: "15-20 L/100km (por passageiro)"
    }
};

// Exportar para uso global
window.CO2_FACTORS = CO2_FACTORS;
window.COMPENSATION_FACTOR = COMPENSATION_FACTOR;
window.IMPACT_LEVELS = IMPACT_LEVELS;
window.IMPACT_COLORS = IMPACT_COLORS;
window.IMPACT_TEXTS = IMPACT_TEXTS;
window.CONVERSION_FACTORS = CONVERSION_FACTORS;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
window.VEHICLE_INFO = VEHICLE_INFO;