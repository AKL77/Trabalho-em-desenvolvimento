/**
 * state.js — Estado mutável compartilhado do jogo.
 *
 * Centralizar o estado aqui evita variáveis globais soltas e facilita
 * debug: qualquer módulo que importa `state` tem visão completa do jogo.
 *
 * Regra: NUNCA re-exporte este objeto; sempre importe e modifique diretamente.
 */

export const state = {
  /** Índice 0-based da fase em execução (fase.id = faseAtualIndex + 1). */
  faseAtualIndex: 0,

  /** Posição visual do personagem no grid. */
  posX: 0,
  posY: 0,

  /**
   * Posição virtual usada durante o eval() do código Blockly.
   * Permite que cmd_temBomba() leia o estado antecipado antes da animação.
   */
  virtualX: 0,
  virtualY: 0,

  /** Fila de ações geradas pelo eval() e consumidas por processarFila(). */
  filaDeAcoes: [],
};
