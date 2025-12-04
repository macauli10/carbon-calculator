// UI.js - Manipulação da interface do usuário

// Referências a elementos DOM
const DOM = {
    // Inputs
    origemInput: document.getElementById('origem'),
    destinoInput: document.getElementById('destino'),
    veiculoSelect: document.getElementById('veiculo'),
    distanciaInput: document.getElementById('distancia'),
    ocupantesInput: document.getElementById('ocupantes'),
    
    // Botões
    calcularBtn: document.getElementById('calcular'),
    limparBtn: document.getElementById('limpar'),
    usarRotaBtn: document.getElementById('usar-rota'),
    limparMapaBtn: document.getElementById('limpar-mapa'),
    limparHistoricoBtn: document.getElementById('limpar-historico'),
    exportarHistoricoBtn: document.getElementById('exportar-historico'),
    
    // Resultados
    resultDistancia: document.getElementById('result-distancia'),
    resultEmissao: document.getElementById('result-emissao'),
    resultEmissaoPessoa: document.getElementById('result-emissao-pessoa'),
    resultArvores: document.getElementById('result-arvores'),
    progressFill: document.getElementById('progress-fill'),
    impactoText: document.getElementById('impacto-text'),
    
    // Containers
    resultContent: document.querySelector('.result-content'),
    resultPlaceholder: document.querySelector('.result-placeholder'),
    comparisonContent: document.querySelector('.comparison-content'),
    historyList: document.getElementById('history-list'),
    historyPlaceholder: document.querySelector('.history-placeholder'),
    
    // Mapa
    mapContainer: document.getElementById('map')
};

// Estado da aplicação
let appState = {
    mapa: null,
    marcadores: [],
    polilinha: null,
    ultimoCalculo: null
};

/**
 * Inicializa a interface do usuário
 */
function initUI() {
    // Configurar evento de tecla Enter nos inputs
    [DOM.origemInput, DOM.destinoInput, DOM.distanciaInput, DOM.ocupantesInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calcularEmissoes();
            }
        });
    });
    
    // Preencher seletor de veículos com opções
    preencherSeletorVeiculos();
    
    // Carregar histórico
    carregarHistorico();
    
    // Inicializar estatísticas globais
    updateGlobalStats();
    
    console.log('UI inicializada com sucesso');
}

/**
 * Preenche o seletor de veículos com as opções disponíveis
 */
function preencherSeletorVeiculos() {
    // Limpar opções existentes (exceto a primeira)
    while (DOM.veiculoSelect.options.length > 0) {
        DOM.veiculoSelect.remove(0);
    }
    
    // Adicionar opções baseadas em VEHICLE_INFO
    Object.entries(VEHICLE_INFO).forEach(([id, info]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = info.nome;
        DOM.veiculoSelect.appendChild(option);
    });
}

/**
 * Exibe os resultados do cálculo na interface
 * @param {Object} resultado - Resultado do cálculo
 */
function exibirResultados(resultado) {
    // Atualizar valores
    DOM.resultDistancia.textContent = formatarValor(resultado.distancia, 'distancia');
    DOM.resultEmissao.textContent = formatarValor(resultado.emissaoTotal, 'emissao');
    DOM.resultEmissaoPessoa.textContent = formatarValor(resultado.emissaoPorPessoa, 'emissao');
    DOM.resultArvores.textContent = formatarValor(resultado.arvoresNecessarias, 'arvores');
    
    // Atualizar barra de progresso
    const porcentagem = calcularPorcentagemImpacto(resultado.emissaoPorPessoa);
    DOM.progressFill.style.width = `${porcentagem}%`;
    DOM.progressFill.style.backgroundColor = IMPACT_COLORS[resultado.nivelImpacto];
    
    // Atualizar texto de impacto
    DOM.impactoText.textContent = IMPACT_TEXTS[resultado.nivelImpacto];
    DOM.impactoText.style.color = IMPACT_COLORS[resultado.nivelImpacto];
    
    // Mostrar resultados e esconder placeholder
    DOM.resultContent.classList.remove('hidden');
    DOM.resultPlaceholder.classList.add('hidden');
    
    // Atualizar comparação de veículos
    exibirComparacaoVeiculos(resultado.distancia, resultado.veiculo, resultado.ocupantes);
    
    // Salvar no histórico
    const historicoItem = {
        ...resultado,
        origem: DOM.origemInput.value || "Origem não especificada",
        destino: DOM.destinoInput.value || "Destino não especificada"
    };
    
    saveToHistory(historicoItem);
    
    // Adicionar ao histórico visual
    adicionarAoHistoricoVisual(historicoItem);
    
    // Atualizar estado
    appState.ultimoCalculo = resultado;
}

/**
 * Exibe a comparação entre diferentes veículos
 * @param {number} distancia - Distância percorrida
 * @param {string} veiculoBase - Veículo base para comparação
 * @param {number} ocupantes - Número de ocupantes
 */
function exibirComparacaoVeiculos(distancia, veiculoBase, ocupantes) {
    const comparacoes = compararVeiculos(distancia, veiculoBase, ocupantes);
    
    // Limpar conteúdo anterior
    DOM.comparisonContent.innerHTML = '';
    
    // Criar container para as comparações
    const container = document.createElement('div');
    container.className = 'comparison-grid';
    
    // Adicionar cada veículo para comparação
    comparacoes.forEach(veiculo => {
        const veiculoCard = document.createElement('div');
        veiculoCard.className = 'comparison-item';
        
        // Destacar o veículo base
        if (veiculo.veiculo === veiculoBase) {
            veiculoCard.classList.add('current-vehicle');
        }
        
        veiculoCard.innerHTML = `
            <div class="comparison-icon">
                <i class="${veiculo.icone}"></i>
            </div>
            <div class="comparison-info">
                <h4>${veiculo.nomeVeiculo}</h4>
                <p class="emission-value">${formatarValor(veiculo.emissaoPorPessoa, 'emissao')}</p>
                <p class="impact-level ${veiculo.nivelImpacto.toLowerCase()}">${IMPACT_TEXTS[veiculo.nivelImpacto]}</p>
            </div>
        `;
        
        container.appendChild(veiculoCard);
    });
    
    DOM.comparisonContent.appendChild(container);
    
    // Adicionar estilo para a grade
    const style = document.createElement('style');
    style.textContent = `
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            width: 100%;
        }
        .comparison-item {
            background: white;
            border-radius: 10px;
            padding: 15px;
            border: 2px solid #e9ecef;
            transition: all 0.3s;
        }
        .comparison-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .comparison-item.current-vehicle {
            border-color: #1a936f;
            background-color: #f8fff9;
        }
        .comparison-icon {
            font-size: 2rem;
            color: #1a936f;
            margin-bottom: 10px;
        }
        .comparison-info h4 {
            font-size: 0.9rem;
            margin-bottom: 5px;
            color: #114b5f;
        }
        .emission-value {
            font-weight: 700;
            font-size: 1.1rem;
            color: #1a936f;
            margin-bottom: 5px;
        }
        .impact-level {
            font-size: 0.8rem;
            padding: 3px 8px;
            border-radius: 10px;
            display: inline-block;
        }
        .impact-level.baixo {
            background-color: #d4edda;
            color: #155724;
        }
        .impact-level.moderado {
            background-color: #fff3cd;
            color: #856404;
        }
        .impact-level.alto {
            background-color: #f8d7da;
            color: #721c24;
        }
        .impact-level.muito_alto {
            background-color: #f5c6cb;
            color: #721c24;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Adiciona um cálculo ao histórico visual
 * @param {Object} calculo - Objeto de cálculo
 */
function adicionarAoHistoricoVisual(calculo) {
    // Remover placeholder se existir
    if (!DOM.historyList.classList.contains('hidden')) {
        DOM.historyPlaceholder.classList.add('hidden');
    }
    
    // Criar elemento do histórico
    const li = document.createElement('li');
    li.className = 'history-item';
    
    // Formatar data
    const data = new Date(calculo.dataCalculo);
    const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    
    li.innerHTML = `
        <div class="history-info">
            <div class="history-route">
                <i class="fas fa-route"></i> ${calculo.origem} → ${calculo.destino}
            </div>
            <div class="history-details">
                ${VEHICLE_INFO[calculo.veiculo]?.nome || calculo.veiculo} • ${calculo.ocupantes} ocupante(s) • ${dataFormatada}
            </div>
        </div>
        <div class="history-co2">
            ${formatarValor(calculo.emissaoPorPessoa, 'emissao')}
        </div>
    `;
    
    // Adicionar no início da lista
    DOM.historyList.prepend(li);
    DOM.historyList.classList.remove('hidden');
}

/**
 * Carrega o histórico do localStorage para a interface
 */
function carregarHistorico() {
    const historico = getHistory();
    
    if (historico.length === 0) {
        DOM.historyList.classList.add('hidden');
        DOM.historyPlaceholder.classList.remove('hidden');
        return;
    }
    
    // Limpar lista atual
    DOM.historyList.innerHTML = '';
    
    // Adicionar cada item do histórico
    historico.slice(0, 10).forEach(calculo => {
        adicionarAoHistoricoVisual(calculo);
    });
    
    DOM.historyList.classList.remove('hidden');
    DOM.historyPlaceholder.classList.add('hidden');
}

/**
 * Limpa todos os campos de entrada
 */
function limparCampos() {
    DOM.origemInput.value = '';
    DOM.destinoInput.value = '';
    DOM.distanciaInput.value = '';
    DOM.ocupantesInput.value = '1';
    
    // Restaurar placeholder de resultados
    DOM.resultContent.classList.add('hidden');
    DOM.resultPlaceholder.classList.remove('hidden');
    
    // Limpar comparação
    DOM.comparisonContent.innerHTML = '<p>Selecione um veículo para ver a comparação</p>';
    
    // Limpar mapa
    if (appState.mapa) {
        limparMapa();
    }
    
    // Focar no primeiro campo
    DOM.origemInput.focus();
}

/**
 * Inicializa o mapa Leaflet
 */
function inicializarMapa() {
    // Criar mapa com vista no Brasil
    appState.mapa = L.map('map').setView([-15.7801, -47.9292], 4);
    
    // Adicionar tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(appState.mapa);
    
    // Adicionar controle de escala
    L.control.scale().addTo(appState.mapa);
    
    // Configurar eventos do mapa
    configurarEventosMapa();
    
    console.log('Mapa inicializado');
}

/**
 * Configura eventos do mapa
 */
function configurarEventosMapa() {
    // Evento de clique no mapa
    appState.mapa.on('click', function(e) {
        if (appState.marcadores.length < 2) {
            adicionarMarcador(e.latlng);
            
            // Se tivermos dois marcadores, traçar rota
            if (appState.marcadores.length === 2) {
                tracarRota();
            }
        }
    });
}

/**
 * Adiciona um marcador no mapa
 * @param {Object} latlng - Coordenadas {lat, lng}
 */
function adicionarMarcador(latlng) {
    const marcador = L.marker(latlng).addTo(appState.mapa);
    
    // Adicionar popup com coordenadas
    marcador.bindPopup(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`).openPopup();
    
    // Adicionar ao array de marcadores
    appState.marcadores.push({
        marcador: marcador,
        coordenadas: latlng
    });
}

/**
 * Traça uma rota entre os marcadores
 */
function tracarRota() {
    if (appState.marcadores.length < 2) return;
    
    // Calcular distância aproximada (fórmula de Haversine)
    const coord1 = appState.marcadores[0].coordenadas;
    const coord2 = appState.marcadores[1].coordenadas;
    
    const distancia = calcularDistanciaHaversine(
        coord1.lat, coord1.lng,
        coord2.lat, coord2.lng
    );
    
    // Atualizar campo de distância
    DOM.distanciaInput.value = distancia.toFixed(1);
    
    // Traçar linha entre os pontos
    if (appState.polilinha) {
        appState.mapa.removeLayer(appState.polilinha);
    }
    
    appState.polilinha = L.polyline([
        [coord1.lat, coord1.lng],
        [coord2.lat, coord2.lng]
    ], {
        color: '#1a936f',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(appState.mapa);
    
    // Ajustar vista para mostrar toda a rota
    const grupo = L.featureGroup([appState.marcadores[0].marcador, appState.marcadores[1].marcador]);
    appState.mapa.fitBounds(grupo.getBounds().pad(0.2));
    
    // Adicionar popup na linha com a distância
    appState.polilinha.bindPopup(`Distância: ${distancia.toFixed(1)} km`).openPopup();
}

/**
 * Calcula distância usando a fórmula de Haversine
 * @param {number} lat1 - Latitude ponto 1
 * @param {number} lon1 - Longitude ponto 1
 * @param {number} lat2 - Latitude ponto 2
 * @param {number} lon2 - Longitude ponto 2
 * @returns {number} Distância em km
 */
function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Limpa os elementos do mapa
 */
function limparMapa() {
    // Remover marcadores
    appState.marcadores.forEach(item => {
        appState.mapa.removeLayer(item.marcador);
    });
    appState.marcadores = [];
    
    // Remover polilinha
    if (appState.polilinha) {
        appState.mapa.removeLayer(appState.polilinha);
        appState.polilinha = null;
    }
    
    // Limpar campo de distância
    DOM.distanciaInput.value = '';
}

/**
 * Usa a rota do mapa para preencher os campos
 */
function usarRotaMapa() {
    if (appState.marcadores.length < 2) {
        alert('Adicione dois pontos no mapa para criar uma rota');
        return;
    }
    
    // Já atualizamos a distância ao traçar a rota
    // Agora só precisamos calcular as emissões
    calcularEmissoes();
}

/**
 * Calcula as emissões baseadas nos campos atuais
 */
function calcularEmissoes() {
    try {
        // Obter valores dos campos
        const origem = DOM.origemInput.value;
        const destino = DOM.destinoInput.value;
        const veiculo = DOM.veiculoSelect.value;
        const distancia = parseFloat(DOM.distanciaInput.value);
        const ocupantes = parseInt(DOM.ocupantesInput.value) || 1;
        
        // Validar entradas
        if (!distancia || distancia <= 0) {
            throw new Error("Por favor, insira uma distância válida");
        }
        
        if (!veiculo) {
            throw new Error("Por favor, selecione um tipo de veículo");
        }
        
        // Calcular emissões
        const resultado = calcularEmissoesCO2(distancia, veiculo, ocupantes);
        
        // Adicionar origem e destino ao resultado
        resultado.origem = origem;
        resultado.destino = destino;
        
        // Exibir resultados
        exibirResultados(resultado);
        
    } catch (error) {
        alert(`Erro: ${error.message}`);
        console.error(error);
    }
}

// Exportar funções para uso global
window.initUI = initUI;
window.calcularEmissoes = calcularEmissoes;
window.limparCampos = limparCampos;
window.inicializarMapa = inicializarMapa;
window.usarRotaMapa = usarRotaMapa;
window.limparMapa = limparMapa;
window.carregarHistorico = carregarHistorico;

// Exportar referências DOM
window.DOM = DOM;
window.appState = appState;