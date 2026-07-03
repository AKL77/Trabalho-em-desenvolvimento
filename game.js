const TILE_DICT = {
  0: { col: 0, linha: 0 }, 
  1: { col: 1, linha: 0 }, 
  2: { col: 2, linha: 0 }, 
  3: { col: 3, linha: 0 }, 
  8: { col: 4, linha: 0 }, 
  9: { col: 5, linha: 0 }  
};

const fases = [
  {
    id: 1,
    descricao: '<strong>Objetivo:</strong> Chegue ao baú!',
    mapa: [
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 2, 2, 8, 2, 2, 9, 0, 1, 0], // 8=bomba em x:3, 9=objetivo em x:6
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    ],
    inicio: { x: 1, y: 3 },
    blocos: ['mover_frente', 'se_bomba', 'pular'],
    conteudos: ['Sequência de comandos', 'Estrutura condicional', 'Detecção de obstáculos']
  },
  {
    id: 2,
    mapa: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    ],
    descricao: '🗺️ <strong>Fase 2:</strong> Explore o novo cenário! Use <em>"Mover para frente"</em> e <em>"Mover para cima"</em> para navegar até o objetivo.',
    inicio: { x: 1, y: 5 }, 
    blocos: ['mover_frente', 'mover_cima', 'pular', 'se_bomba'],
    conteudos: ['Navegação em duas dimensões', 'Planejamento de rota', 'Sequência de comandos']
  }
];

// ── Bloco Início: ponto de partida obrigatório de toda sequência ──
Blockly.Blocks['inicio'] = {
  init: function() {
    this.appendDummyInput().appendField("▶  Início");
    this.setNextStatement(true, null); // hat block: só tem encaixe embaixo
    this.setColour('#e07b00');         // laranja
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
  }
};

// O bloco Início não gera código próprio; os blocos abaixo geram automaticamente
javascript.javascriptGenerator.forBlock['inicio'] = function() { return ''; };

Blockly.Blocks['mover_frente'] = {
  init: function() {
    this.appendDummyInput().appendField("Mover para frente");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['mover_cima'] = {
  init: function() {
    this.appendDummyInput().appendField("Mover para cima");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['pular'] = {
  init: function() {
    this.appendDummyInput().appendField("Pular");
    this.setPreviousStatement(true, null);
    this.setColour(160);
  }
};

Blockly.Blocks['se_bomba'] = {
  init: function() {
    this.appendStatementInput("DO").appendField("Se houver bomba à frente");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
  }
};

javascript.javascriptGenerator.forBlock['mover_frente'] = function() { return "cmd_moverFrente();\n"; };
javascript.javascriptGenerator.forBlock['mover_cima'] = function() { return "cmd_moverCima();\n"; };
javascript.javascriptGenerator.forBlock['pular'] = function() { return "cmd_pular();\n"; };
javascript.javascriptGenerator.forBlock['se_bomba'] = function(block) {
  const branch = javascript.javascriptGenerator.statementToCode(block, 'DO');
  return `if (cmd_temBomba()) {\n${branch}}\n`;
};

let workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  trashcan: true,
  theme: Blockly.Themes.Dark
});

let faseAtualIndex = 0;
let filaDeAcoes = [];

let posX = 0; 
let posY = 0;
let virtualX = 0;
let virtualY = 0;

/**
 * Gera os quadradinhos de fase na Row 1 com base no array `fases`.
 * O dot da fase atual fica maior e destacado em verde.
 */
function gerarDotsFases() {
  const container = document.getElementById('levelIndicator');
  if (!container) return;
  container.innerHTML = '';
  fases.forEach((fase) => {
    const dot = document.createElement('div');
    dot.className = 'level-dot' + (fase.id === faseAtualIndex + 1 ? ' active' : '');
    dot.textContent = fase.id;
    dot.title = 'Fase ' + fase.id;
    dot.onclick = () => carregarFase(fase.id);
    container.appendChild(dot);
  });
}

function toggleMenu() {
  document.getElementById('dropdownMenu').classList.toggle('open');
}

function reiniciarFase() {
  abrirModal('modalReiniciar');
}

function confirmarReiniciar() {
  fecharModal('modalReiniciar');
  carregarFase(faseAtualIndex + 1);
}

function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

function fecharModalOverlay(event, id) {
  if (event.target === event.currentTarget) fecharModal(id);
}

function abrirDicas() {
  abrirModal('modalDicas');
}

function abrirConteudos() {
  const fase = fases[faseAtualIndex];
  const container = document.getElementById('conteudosTags');
  container.innerHTML = '';
  (fase.conteudos || []).forEach(texto => {
    const tag = document.createElement('span');
    tag.className = 'conteudo-tag';
    tag.textContent = texto;
    container.appendChild(tag);
  });
  abrirModal('modalConteudos');
}

function abrirConfiguracoes() {
  document.getElementById('dropdownMenu').classList.remove('open');
  // Configurações serão implementadas futuramente
}

/** Insere o bloco Início fixo no workspace após um workspace.clear(). */
function adicionarBlocoInicio() {
  const bloco = workspace.newBlock('inicio');
  bloco.initSvg();
  bloco.render();
  // moveBy existe em todas as versões modernas do Blockly (moveToXY foi removido no v10)
  bloco.moveBy(30, 20);
}

function aplicarEscala() {
  const fase = fases[faseAtualIndex];
  if (!fase) return;

  const gamePanel = document.querySelector('.game-panel');
  const wrapper   = document.querySelector('.game-viewport-wrapper');
  const viewport  = document.querySelector('.game-viewport');
  if (!gamePanel || !wrapper || !viewport) return;

  // Se o layout flex ainda não calculou as dimensões, tenta no próximo frame
  if (gamePanel.clientWidth === 0 || gamePanel.clientHeight === 0) {
    requestAnimationFrame(aplicarEscala);
    return;
  }

  const cols  = fase.mapa[0].length;
  const rows  = fase.mapa.length;
  const gridW = cols * 16;
  const gridH = rows * 16;
  const margem = 24;

  const escala = Math.max(1, Math.min(
    Math.floor((gamePanel.clientWidth  - margem) / gridW),
    Math.floor((gamePanel.clientHeight - margem) / gridH)
  ));

  viewport.style.transform = `scale(${escala})`;
  wrapper.style.width      = (gridW * escala) + 'px';
  wrapper.style.height     = (gridH * escala) + 'px';
}

function carregarFase(id) {
  faseAtualIndex = id - 1;
  const fase = fases[faseAtualIndex];
  document.getElementById('fase-descricao').innerHTML = fase.descricao || '';

  posX = fase.inicio.x;
  posY = fase.inicio.y;

  desenharMapa(fase.mapa);
  atualizarVisual(false);
  atualizarToolbox(fase.blocos);
  workspace.clear();
  adicionarBlocoInicio(); // Início é sempre o ponto de partida em toda fase
  document.getElementById('btnExecutar').disabled = false;
  gerarDotsFases();       // atualiza o dot ativo na Row 1
  aplicarEscala();
}

function desenharMapa(matriz) {
  const container = document.getElementById('cenario');
  container.innerHTML = '';
  
  for (let y = 0; y < matriz.length; y++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let x = 0; x < matriz[y].length; x++) {
      const tileLogico = matriz[y][x];
      
      const cell = document.createElement('div');
      cell.className = 'tile';
      
      // SE FOR O BAÚ (Objetivo 9)
      if (tileLogico === 9) {
        cell.classList.add('bau');
        cell.id = 'bau-vitoria'; 
      } 
      // SE FOR O CENÁRIO NORMAL
      else {
        const coordenadas = TILE_DICT[tileLogico];
        const deslocamentoX = coordenadas.col * -16;
        const deslocamentoY = coordenadas.linha * -16;
        
        cell.style.backgroundPosition = `${deslocamentoX}px ${deslocamentoY}px`;
      }
      
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }
}

function atualizarToolbox(blocosPermitidos) {
  let xmlStr = '<xml style="display: none">';
  blocosPermitidos.forEach(bloco => {
    xmlStr += `<block type="${bloco}"></block>`;
  });
  xmlStr += '</xml>';
  workspace.updateToolbox(xmlStr);
}

function cmd_moverFrente() {
  filaDeAcoes.push('FRENTE');
  virtualX++;
}

function cmd_moverCima() {
  filaDeAcoes.push('CIMA');
  virtualY--;
}

function cmd_pular() {
  filaDeAcoes.push('PULAR');
  virtualX += 2;
}

function cmd_temBomba() {
  const fase = fases[faseAtualIndex];
  if (fase.mapa[virtualY] && fase.mapa[virtualY][virtualX + 1] === 8) {
    return true;
  }
  return false;
}

function iniciarExecucao() {
  document.getElementById('btnExecutar').disabled = true;
  
  const fase = fases[faseAtualIndex];
  posX = fase.inicio.x;
  posY = fase.inicio.y;
  virtualX = posX;
  virtualY = posY;
  filaDeAcoes = [];
  atualizarVisual(false);

  // Executa APENAS os blocos conectados ao Início; blocos soltos são ignorados
  const blocosInicio = workspace.getBlocksByType('inicio');
  if (blocosInicio.length > 0) {
    const code = javascript.javascriptGenerator.blockToCode(blocosInicio[0]);
    eval(code);
  }

  processarFila();
}

function processarFila() {
  if (filaDeAcoes.length === 0) {
    verificarVitoria();
    return;
  }

  let acao = filaDeAcoes.shift();
  let pulando = false;

  if (acao === 'FRENTE') posX++;
  else if (acao === 'CIMA') posY--;
  else if (acao === 'PULAR') {
    posX += 2;
    pulando = true;
  }

  atualizarVisual(pulando);

  // Verifica colisão com bomba a cada passo (não só no final)
  const tileAtualPasso = fases[faseAtualIndex].mapa[posY]?.[posX] ?? -1;
  if (tileAtualPasso === 8) {
    setTimeout(() => {
      const fase = fases[faseAtualIndex];
      alert("💥 Explodiu! Tente novamente.");
      document.getElementById('btnExecutar').disabled = false;
      posX = fase.inicio.x;
      posY = fase.inicio.y;
      atualizarVisual(false);
    }, 600);
    return; // Para a fila: não processa próximas ações
  }

  setTimeout(processarFila, 500); 
}

function atualizarVisual(pulando) {
  const charDiv = document.getElementById('personagem');
  charDiv.style.transform = `translate(${posX * 16}px, ${posY * 16}px)`;
  
  if (pulando) {
    // Pulo: remove caminhada e ativa sprite de pulo
    charDiv.classList.remove('andando');
    charDiv.classList.add('pulo');
    setTimeout(() => charDiv.classList.remove('pulo'), 450);
  } else {
    // Caminhada: ativa sprite de walk, remove ao fim do movimento
    charDiv.classList.remove('pulo');
    charDiv.classList.add('andando');
    setTimeout(() => charDiv.classList.remove('andando'), 400);
  }
}

function verificarVitoria() {
  const fase = fases[faseAtualIndex];
  const tileAtual = fase.mapa[posY] ? fase.mapa[posY][posX] : -1;
  
  if (tileAtual === 9) {
    // 1. Inicia a animação de abrir o baú
    document.getElementById('bau-vitoria').classList.add('bau-abrindo');
    
    // 2. Espera 600ms para exibir a mensagem
    setTimeout(() => {
      alert("🎉 Baú aberto! Objetivo concluído!");
      document.getElementById('btnExecutar').disabled = false;
      posX = fase.inicio.x;
      posY = fase.inicio.y;
      atualizarVisual(false);
    }, 600);
  } 
  else if (tileAtual === 8) {
    alert("💥 Explodiu! Tente novamente.");
    resetarFase(fase); // Você pode criar uma função auxiliar para evitar código repetido
  } 
  else {
    alert("❌ Não chegou ao objetivo. Tente novamente!");
    resetarFase(fase);
  }
}

function resetarFase(fase) {
  document.getElementById('btnExecutar').disabled = false;
  posX = fase.inicio.x;
  posY = fase.inicio.y;
  atualizarVisual(false);
}

/**
 * Alterna o estado visual do botão de dica.
 * O conteúdo de cada dica será implementado futuramente.
 */
window.onload = () => {
  carregarFase(1);

  // Garante escala correta após o browser terminar o primeiro paint
  // (double-rAF: 1º frame agenda o layout, 2º frame lê as dimensões reais)
  requestAnimationFrame(() => requestAnimationFrame(aplicarEscala));

  // Recalcula escala sempre que o painel do jogo mudar de tamanho
  new ResizeObserver(() => aplicarEscala())
    .observe(document.querySelector('.game-panel'));

  // Fecha o dropdown ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hamburger-wrapper')) {
      document.getElementById('dropdownMenu')?.classList.remove('open');
    }
  });
};