/**
 * renderer.js — Renderização visual do mapa e do personagem.
 *
 * Responsabilidades:
 *   - Desenhar o mapa de tiles no DOM
 *   - Atualizar posição e sprite do personagem
 */

import { TILE_DICT } from './config.js';
import { state }     from './state.js';

/**
 * Recria o grid de tiles a partir da matriz lógica.
 * Tile 9 (baú) recebe classe .bau e id #bau-vitoria para animação de abertura.
 */
export function desenharMapa(matriz) {
  const container = document.getElementById('cenario');
  container.innerHTML = '';

  for (let y = 0; y < matriz.length; y++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    for (let x = 0; x < matriz[y].length; x++) {
      const tileLogico = matriz[y][x];
      const cell = document.createElement('div');
      cell.className = 'tile';

      if (tileLogico === 9) {
        cell.classList.add('bau');
        cell.id = 'bau-vitoria';
      } else {
        const { col, linha } = TILE_DICT[tileLogico];
        cell.style.backgroundPosition = `${col * -16}px ${linha * -16}px`;
      }

      rowDiv.appendChild(cell);
    }

    container.appendChild(rowDiv);
  }
}

/**
 * Move o personagem para state.posX/posY e troca o sprite conforme a ação.
 * @param {boolean} pulando — se true, usa sprite de pulo; caso contrário, de caminhada.
 */
export function atualizarVisual(pulando) {
  const charDiv = document.getElementById('personagem');
  charDiv.style.transform = `translate(${state.posX * 16}px, ${state.posY * 16}px)`;

  if (pulando) {
    charDiv.classList.remove('andando');
    charDiv.classList.add('pulo');
    setTimeout(() => charDiv.classList.remove('pulo'), 450);
  } else {
    charDiv.classList.remove('pulo');
    charDiv.classList.add('andando');
    setTimeout(() => charDiv.classList.remove('andando'), 400);
  }
}
