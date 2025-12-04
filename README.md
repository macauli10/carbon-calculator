# Documentação do Projeto


# Calculadora de CO2 - Emissões de Transporte

Uma aplicação web para calcular e visualizar as emissões de dióxido de carbono (CO₂) geradas por diferentes meios de transporte.

## Funcionalidades

- **Cálculo de Emissões**: Calcula as emissões de CO₂ baseadas na distância e tipo de veículo
- **Comparação de Veículos**: Compara as emissões entre diferentes tipos de transporte
- **Mapa Interativo**: Permite traçar rotas no mapa para calcular distâncias automaticamente
- **Histórico de Cálculos**: Armazena e exibe cálculos anteriores
- **Níveis de Impacto**: Classifica o impacto ambiental das emissões
- **Compensação com Árvores**: Calcula quantas árvores são necessárias para compensar as emissões

## Estrutura do Projeto


carbon-calculator/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos completos
├── js/
│   ├── config.js          # Constantes e configurações
│   ├── routes-data.js     # Dados de rotas e histórico
│   ├── calculator.js      # Lógica de cálculos
│   ├── ui.js             # Manipulação da interface
│   └── app.js            # Inicialização e eventos
└── README.md


## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização com design responsivo
- **JavaScript (ES6+)**: Lógica da aplicação
- **Leaflet.js**: Biblioteca para mapas interativos
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia
- **LocalStorage**: Armazenamento local do histórico

## Como Usar

1. **Insira os dados da viagem**:
   - Local de origem e destino
   - Tipo de veículo
   - Distância (ou use o mapa para calcular)
   - Número de ocupantes

2. **Use o mapa**:
   - Clique em dois pontos no mapa para criar uma rota
   - A distância será calculada automaticamente
   - Use o botão "Usar Rota do Mapa" para preencher os campos

3. **Calcule as emissões**:
   - Clique em "Calcular Emissões" ou pressione Ctrl+Enter
   - Veja os resultados detalhados
   - Compare com outros meios de transporte

4. **Acesse o histórico**:
   - Todos os cálculos são salvos automaticamente
   - Exporte o histórico como JSON
   - Limpe o histórico quando necessário

## Fatores de Emissão

Os cálculos são baseados em médias internacionais de emissão por tipo de veículo:

- Carro a Gasolina: 0.12 kg CO₂/km
- Carro a Etanol: 0.05 kg CO₂/km
- Carro a Diesel: 0.15 kg CO₂/km
- Carro Elétrico: 0.03 kg CO₂/km
- Moto: 0.08 kg CO₂/km
- Ônibus: 0.09 kg CO₂/km (por passageiro)
- Caminhão: 0.25 kg CO₂/km
- Avião: 0.18 kg CO₂/km (por passageiro)

## Compensação Ambiental

A calculadora usa um fator de compensação onde:
- 1 árvore absorve aproximadamente 22 kg de CO₂ por ano
- Portanto, 1 kg de CO₂ = 0.022 árvores necessárias para compensação

## Níveis de Impacto

- **Baixo**: Até 5 kg CO₂ por pessoa
- **Moderado**: 5-20 kg CO₂ por pessoa
- **Alto**: 20-50 kg CO₂ por pessoa
- **Muito Alto**: Acima de 50 kg CO₂ por pessoa

## Instalação e Execução

1. Clone ou baixe o projeto
2. Abra o arquivo `index.html` em um navegador web
3. Não é necessário servidor ou instalação adicional

## Personalização

- Modifique `js/config.js` para ajustar fatores de emissão
- Adicione novas rotas em `js/routes-data.js`
- Ajuste cores e estilos em `css/style.css`

## Licença

Este projeto é destinado para fins educacionais e de conscientização ambiental. Sinta-se à vontade para modificar e distribuir.

## Contribuições

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para:
- Reportar problemas
- Sugerir novos recursos
- Enviar melhorias de código

## Autor

Calculadora de CO2 - Projeto de Conscientização Ambiental

© 2023 - Todos os direitos reservados


##  Instruções de Uso

1. **Execute o projeto**: Basta abrir o arquivo `index.html` em qualquer navegador moderno.

2. **Funcionalidades principais**:
   - Insira origem e destino (ou use o mapa)
   - Selecione o tipo de veículo
   - Informe a distância ou use o mapa para calcular
   - Clique em "Calcular Emissões"
   - Veja os resultados e comparações

3. **Recursos do mapa**:
   - Clique em dois pontos para criar uma rota
   - Use "Usar Rota do Mapa" para preencher automaticamente
   - Veja a distância calculada no popup da linha

4. **Histórico**:
   - Todos os cálculos são salvos automaticamente
   - Exporte como JSON com o botão "Exportar"
   - Limpe quando necessário

