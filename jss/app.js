// App.js - Inicialização da aplicação e configuração de eventos

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora de CO2 - Inicializando...');
    
    // Inicializar UI
    initUI();
    
    // Inicializar mapa
    inicializarMapa();
    
    // Configurar eventos
    configurarEventos();
    
    // Adicionar algumas rotas predefinidas como sugestão
    adicionarSugestoesRotas();
    
    console.log('Aplicação inicializada com sucesso!');
});

/**
 * Configura todos os eventos da aplicação
 */
function configurarEventos() {
    // Botão calcular
    DOM.calcularBtn.addEventListener('click', calcularEmissoes);
    
    // Botão limpar
    DOM.limparBtn.addEventListener('click', limparCampos);
    
    // Botões do mapa
    DOM.usarRotaBtn.addEventListener('click', usarRotaMapa);
    DOM.limparMapaBtn.addEventListener('click', limparMapa);
    
    // Botões do histórico
    DOM.limparHistoricoBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todo o histórico de cálculos?')) {
            clearHistory();
            carregarHistorico();
        }
    });
    
    DOM.exportarHistoricoBtn.addEventListener('click', exportHistory);
    
    // Eventos de entrada para validação em tempo real
    DOM.distanciaInput.addEventListener('input', function() {
        const valor = this.value;
        if (valor && parseFloat(valor) > 10000) {
            this.setCustomValidity('Distância muito longa. Por favor, verifique.');
        } else {
            this.setCustomValidity('');
        }
    });
    
    DOM.ocupantesInput.addEventListener('input', function() {
        const valor = this.value;
        if (valor && parseInt(valor) > 100) {
            this.setCustomValidity('Número de ocupantes muito alto.');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Sugestão automática de cidades
    DOM.origemInput.addEventListener('input', function() {
        sugerirCidades(this, 'origem');
    });
    
    DOM.destinoInput.addEventListener('input', function() {
        sugerirCidades(this, 'destino');
    });
    
    // Teclas de atalho
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter para calcular
        if (e.ctrlKey && e.key === 'Enter') {
            calcularEmissoes();
        }
        
        // Esc para limpar
        if (e.key === 'Escape') {
            limparCampos();
        }
        
        // Ctrl + H para limpar histórico
        if (e.ctrlKey && e.key === 'h') {
            if (confirm('Limpar histórico? (Ctrl+H)')) {
                clearHistory();
                carregarHistorico();
            }
        }
    });
    
    // Salvar estado ao fechar a página
    window.addEventListener('beforeunload', function() {
        // Podemos salvar o estado atual se necessário
        console.log('Aplicação encerrada. Estado salvo.');
    });
}

/**
 * Adiciona sugestões de rotas predefinidas
 */
function adicionarSugestoesRotas() {
    const rotas = getPredefinedRoutes();
    const rotasContainer = document.createElement('div');
    rotasContainer.className = 'routes-suggestions';
    rotasContainer.innerHTML = '<h4><i class="fas fa-lightbulb"></i> Rotas Sugeridas</h4>';
    
    const lista = document.createElement('div');
    lista.className = 'suggestions-list';
    
    Object.entries(rotas).slice(0, 4).forEach(([nome, rota]) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <div class="suggestion-route">${nome}</div>
            <div class="suggestion-distance">${rota.distancia} km</div>
            <button class="btn-suggestion" data-origem="${rota.origem}" data-destino="${rota.destino}" data-distancia="${rota.distancia}">
                <i class="fas fa-check"></i> Usar
            </button>
        `;
        
        lista.appendChild(item);
    });
    
    rotasContainer.appendChild(lista);
    
    // Inserir após a seção de entrada
    DOM.inputSection.parentNode.insertBefore(rotasContainer, DOM.inputSection.nextSibling);
    
    // Adicionar eventos aos botões de sugestão
    setTimeout(() => {
        document.querySelectorAll('.btn-suggestion').forEach(btn => {
            btn.addEventListener('click', function() {
                const origem = this.getAttribute('data-origem');
                const destino = this.getAttribute('data-destino');
                const distancia = this.getAttribute('data-distancia');
                
                DOM.origemInput.value = origem;
                DOM.destinoInput.value = destino;
                DOM.distanciaInput.value = distancia;
                
                // Focar no seletor de veículo
                DOM.veiculoSelect.focus();
            });
        });
    }, 100);
    
    // Adicionar estilos para as sugestões
    const style = document.createElement('style');
    style.textContent = `
        .routes-suggestions {
            background: #f0f9ff;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid #cce5ff;
        }
        .routes-suggestions h4 {
            color: #114b5f;
            margin-bottom: 15px;
            font-family: 'Poppins', sans-serif;
            font-size: 1.1rem;
        }
        .routes-suggestions h4 i {
            color: #1a936f;
            margin-right: 8px;
        }
        .suggestions-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
        }
        .suggestion-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .suggestion-route {
            font-weight: 600;
            color: #114b5f;
            font-size: 0.9rem;
        }
        .suggestion-distance {
            color: #1a936f;
            font-weight: 700;
            font-size: 0.9rem;
        }
        .btn-suggestion {
            background-color: #1a936f;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn-suggestion:hover {
            background-color: #0d7c5f;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Sugere cidades baseadas na entrada do usuário
 * @param {HTMLInputElement} input - Campo de entrada
 * @param {string} tipo - Tipo de campo ('origem' ou 'destino')
 */
function sugerirCidades(input, tipo) {
    const valor = input.value.toLowerCase();
    if (valor.length < 2) return;
    
    const cidades = Object.keys(CITY_COORDINATES);
    const sugestoes = cidades.filter(cidade => 
        cidade.toLowerCase().includes(valor)
    ).slice(0, 5);
    
    // Remover lista anterior
    const listaAnterior = document.getElementById(`suggestions-${tipo}`);
    if (listaAnterior) {
        listaAnterior.remove();
    }
    
    if (sugestoes.length === 0) return;
    
    // Criar nova lista
    const lista = document.createElement('div');
    lista.id = `suggestions-${tipo}`;
    lista.className = 'suggestions-dropdown';
    
    sugestoes.forEach(cidade => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = cidade;
        item.addEventListener('click', function() {
            input.value = cidade;
            lista.remove();
            
            // Se ambos os campos estiverem preenchidos, focar na distância
            if (DOM.origemInput.value && DOM.destinoInput.value) {
                DOM.distanciaInput.focus();
            }
        });
        lista.appendChild(item);
    });
    
    // Posicionar abaixo do input
    const rect = input.getBoundingClientRect();
    lista.style.position = 'absolute';
    lista.style.top = `${rect.bottom + window.scrollY}px`;
    lista.style.left = `${rect.left + window.scrollX}px`;
    lista.style.width = `${rect.width}px`;
    
    document.body.appendChild(lista);
    
    // Remover lista ao clicar fora
    setTimeout(() => {
        const removerLista = function(e) {
            if (!lista.contains(e.target) && e.target !== input) {
                lista.remove();
                document.removeEventListener('click', removerLista);
            }
        };
        
        document.addEventListener('click', removerLista);
    }, 100);
    
    // Adicionar estilos
    if (!document.getElementById('suggestions-style')) {
        const style = document.createElement('style');
        style.id = 'suggestions-style';
        style.textContent = `
            .suggestions-dropdown {
                background: white;
                border: 1px solid #ced4da;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
            }
            .suggestions-dropdown .suggestion-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
                border-bottom: 1px solid #f1f3f4;
            }
            .suggestions-dropdown .suggestion-item:last-child {
                border-bottom: none;
            }
            .suggestions-dropdown .suggestion-item:hover {
                background-color: #f8f9fa;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Exibe uma mensagem de notificação
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo de notificação ('success', 'error', 'info')
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remover notificação anterior se existir
    const notificacaoAnterior = document.querySelector('.notification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    // Criar notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notification ${tipo}`;
    notificacao.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${mensagem}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Adicionar ao corpo
    document.body.appendChild(notificacao);
    
    // Adicionar evento para fechar
    notificacao.querySelector('.notification-close').addEventListener('click', function() {
        notificacao.remove();
    });
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, 5000);
    
    // Adicionar estilos
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border-left: 5px solid #1a936f;
            }
            .notification.success {
                border-left-color: #4cd964;
            }
            .notification.error {
                border-left-color: #ff3b30;
            }
            .notification.info {
                border-left-color: #007aff;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-content i {
                font-size: 1.2rem;
            }
            .notification.success i {
                color: #4cd964;
            }
            .notification.error i {
                color: #ff3b30;
            }
            .notification.info i {
                color: #007aff;
            }
            .notification-close {
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                font-size: 1rem;
                padding: 0;
                margin-left: 15px;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Expor função de notificação para uso global
window.mostrarNotificacao = mostrarNotificacao;