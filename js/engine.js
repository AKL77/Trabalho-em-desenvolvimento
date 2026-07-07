/**
 * engine.js — Lógica de execução do jogo.
 *
 * Responsabilidades:
 *   - Funções cmd_* chamadas pelo código gerado pelo Blockly (via eval)
 *   - Processamento da fila de ações com animação
 *   - Verificação de vitória/derrota
 *   - Reset de fase
 *
 * IMPORTANTE: cmd_* são expostos em window por main.js porque o eval()
 * do Blockly gera chamadas simples como `cmd_moverFrente();`.
 */

import { fases }          from './phases.js';
import { state }          from './state.js';
import { atualizarVisual } from './renderer.js';
import { PASSO_MS }       from './config.js';

/* ── Comandos Blockly ────────────────────────────────────────── */

export function cmd_moverFrente() {
  state.filaDeAcoes.push('FRENTE');
  state.virtualX++;
}

export function cmd_moverCima() {
  state.filaDeAcoes.push('CIMA');
  state.virtualY--;
}

export function cmd_pular() {
  state.filaDeAcoes.push('PULAR');
  state.virtualX += 2;
}

/** Retorna true se o próximo tile à frente da posição virtual for uma bomba. */
export function cmd_temBomba() {
  const { mapa } = fases[state.faseAtualIndex];
  return !!(mapa[state.virtualY] && mapa[state.virtualY][state.virtualX + 1] === 8);
}

/* ── Fila de ações ───────────────────────────────────────────── */

/**
 * Processa a fila de ações uma por uma com delay de animação.
 * Importado e chamado por main.js após o eval() do workspace.
 */
export function processarFila(onVitoria) {
  if (state.filaDeAcoes.length === 0) {
    onVitoria();
    return;
  }

  const acao   = state.filaDeAcoes.shift();
  const pulando = acao === 'PULAR';

  if (acao === 'FRENTE')   state.posX++;
  else if (acao === 'CIMA') state.posY--;
  else if (acao === 'PULAR') state.posX += 2;

  atualizarVisual(pulando);

  // Colisão com bomba — para a fila imediatamente
  const tileAtual = fases[state.faseAtualIndex].mapa[state.posY]?.[state.posX] ?? -1;
  if (tileAtual === 8) {
    setTimeout(() => {
      alert('💥 Explodiu! Tente novamente.');
      resetarFase();
    }, 600);
    return;
  }

  setTimeout(() => processarFila(onVitoria), PASSO_MS);
}

/* ── Vitória e reset ─────────────────────────────────────────── */

/**
 * Verifica o tile em que o personagem parou e aciona o callback correto.
 * @param {Function} onDialogo — chamado ao atingir o baú (tile 9)
 */
export function verificarVitoria(onDialogo) {
  const { mapa } = fases[state.faseAtualIndex];
  const tileAtual = mapa[state.posY]?.[state.posX] ?? -1;

  if (tileAtual === 9) {
    document.getElementById('bau-vitoria').classList.add('bau-abrindo');
    setTimeout(onDialogo, 700);
  } else if (tileAtual === 8) {
    alert('💥 Explodiu! Tente novamente.');
    resetarFase();
  } else {
    alert('❌ Não chegou ao objetivo. Tente novamente!');
    resetarFase();
  }
}

/** Reposiciona o personagem na posição inicial e reativa o botão Executar. */
export function resetarFase() {
  const fase = fases[state.faseAtualIndex];
  state.posX = fase.inicio.x;
  state.posY = fase.inicio.y;
  atualizarVisual(false);
  document.getElementById('btnExecutar').disabled = false;
}
