/**
 * ui.js — Interações de interface: modais, menu, level dots, dicas, conteúdos.
 *
 * Funções exportadas são expostas em window por main.js
 * (necessário para onclick= inline no HTML).
 */

import { fases } from './phases.js';
import { state } from './state.js';

/* ── Level dots ── */

/** Recria os quadradinhos de fase, destacando o atual. */
export function gerarDotsFases(onCarregarFase) {
  const container = document.getElementById('levelIndicator');
  if (!container) return;
  container.innerHTML = '';

  fases.forEach((fase) => {
    const dot = document.createElement('div');
    dot.className = 'level-dot' + (fase.id === state.faseAtualIndex + 1 ? ' active' : '');
    dot.textContent = fase.id;
    dot.title       = 'Fase ' + fase.id;
    dot.onclick     = () => onCarregarFase(fase.id);
    container.appendChild(dot);
  });
}

/* ── Menu hambúrguer ── */

export function toggleMenu() {
  document.getElementById('dropdownMenu').classList.toggle('open');
}

export function abrirConfiguracoes() {
  document.getElementById('dropdownMenu').classList.remove('open');
  // TODO: implementar modal de configurações
}

/* ── Sistema de modais ── */

export function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

export function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

/** Fecha o modal ao clicar no overlay (fora do card). */
export function fecharModalOverlay(event, id) {
  if (event.target === event.currentTarget) fecharModal(id);
}

/* ── Modais específicos ── */

export function abrirDicas() {
  abrirModal('modalDicas');
}

export function abrirConteudos() {
  const fase      = fases[state.faseAtualIndex];
  const container = document.getElementById('conteudosTags');
  container.innerHTML = '';

  (fase.conteudos || []).forEach(texto => {
    const tag = document.createElement('span');
    tag.className   = 'conteudo-tag';
    tag.textContent = texto;
    container.appendChild(tag);
  });

  abrirModal('modalConteudos');
}
