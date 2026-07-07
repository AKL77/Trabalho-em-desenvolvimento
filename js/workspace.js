/**
 * workspace.js — Configuração e gerenciamento do Blockly workspace.
 *
 * Responsabilidades:
 *   - Criar e exportar o workspace
 *   - Gerenciar a toolbox (blocos disponíveis por fase)
 *   - Escala responsiva do painel do jogo
 *   - Inserir o bloco Início fixo em cada fase
 */

import './blocks.js';       // registra todos os blocos antes do inject
import { fases } from './phases.js';
import { state }  from './state.js';

/* Blockly.inject precisa do DOM — como módulos são sempre deferidos,
   o DOM já está pronto quando este código é avaliado.               */
export const workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  trashcan: true,
  theme: Blockly.Themes.Dark,
});

/**
 * Atualiza a toolbox com os blocos permitidos para a fase atual.
 * O bloco 'inicio' NÃO é incluído — ele é adicionado programaticamente.
 */
export function atualizarToolbox(blocosPermitidos) {
  const xmlStr =
    '<xml style="display:none">' +
    blocosPermitidos.map(b => `<block type="${b}"></block>`).join('') +
    '</xml>';
  workspace.updateToolbox(xmlStr);
}

/**
 * Insere o bloco Início fixo no workspace.
 * Deve ser chamado após cada workspace.clear().
 */
export function adicionarBlocoInicio() {
  const bloco = workspace.newBlock('inicio');
  bloco.initSvg();
  bloco.render();
  bloco.moveBy(30, 20);
}

/**
 * Calcula a maior escala inteira que cabe no painel e aplica ao viewport.
 * Lê dimensões diretamente da fase atual → funciona com qualquer tamanho de mapa.
 * Se clientWidth/Height ainda for 0 (layout não pronto), agenda retry com rAF.
 */
export function aplicarEscala() {
  const fase = fases[state.faseAtualIndex];
  if (!fase) return;

  const gamePanel = document.querySelector('.game-panel');
  const wrapper   = document.querySelector('.game-viewport-wrapper');
  const viewport  = document.querySelector('.game-viewport');
  if (!gamePanel || !wrapper || !viewport) return;

  if (gamePanel.clientWidth === 0 || gamePanel.clientHeight === 0) {
    requestAnimationFrame(aplicarEscala);
    return;
  }

  const gridW  = fase.mapa[0].length * 16;
  const gridH  = fase.mapa.length    * 16;
  const margem = 24;

  const escala = Math.max(1, Math.min(
    Math.floor((gamePanel.clientWidth  - margem) / gridW),
    Math.floor((gamePanel.clientHeight - margem) / gridH),
  ));

  viewport.style.transform = `scale(${escala})`;
  wrapper.style.width      = `${gridW * escala}px`;
  wrapper.style.height     = `${gridH * escala}px`;
}
