/**
 * config.js — Constantes globais do jogo.
 * Adicione aqui valores que são usados em múltiplos módulos.
 */

/** Mapeia o valor lógico de um tile para sua posição no spritesheet. */
export const TILE_DICT = {
  0: { col: 0, linha: 0 },  // grama clara
  1: { col: 1, linha: 0 },  // grama escura
  2: { col: 2, linha: 0 },  // caminho
  3: { col: 3, linha: 0 },  // pedra
  8: { col: 4, linha: 0 },  // bomba
  9: { col: 5, linha: 0 },  // objetivo (baú)
};

/** Velocidade de cada passo de animação (ms). */
export const PASSO_MS = 500;

/** Velocidade do typewriter do diálogo (ms por caractere). */
export const TYPEWRITER_VEL_MS = 36;
