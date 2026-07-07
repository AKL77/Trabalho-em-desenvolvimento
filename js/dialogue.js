/**
 * dialogue.js — Sistema de diálogo estilo visual novel.
 *
 * Sistema independente: pode ser reutilizado em outras páginas.
 * Ativado após a conclusão de uma fase (vitória).
 *
 * API pública:
 *   iniciarDialogo(linhas)  — exibe a sequência de falas
 *   avancarDialogo()        — avança ou fecha (chamado pelo onclick do overlay)
 */

import { TYPEWRITER_VEL_MS } from './config.js';

/* Estado interno — privado a este módulo */
let _linhas  = [];
let _index   = 0;
let _timer   = null;
let _done    = false;

/* Referências ao DOM — resolvidas uma vez para desempenho */
const _overlay    = () => document.getElementById('dialogueOverlay');
const _textEl     = () => document.getElementById('dialogueText');
const _continueEl = () => document.getElementById('dialogueContinue');

/** Inicia a sequência de diálogo. */
export function iniciarDialogo(linhas, onFim) {
  _linhas  = linhas;
  _index   = 0;
  _onFim   = onFim ?? (() => {});

  _overlay().classList.add('active');
  _exibirLinha(0);
}

let _onFim = () => {};

/**
 * Avança o diálogo ao clicar no overlay:
 *   - Typewriter rolando → mostra texto completo
 *   - Texto completo + há próxima linha → avança
 *   - Texto completo + última linha → fecha
 */
export function avancarDialogo() {
  if (!_done) {
    clearTimeout(_timer);
    _textEl().textContent = _linhas[_index];
    _done = true;
    _continueEl().classList.add('visivel');
    return;
  }

  _index++;
  if (_index < _linhas.length) {
    _exibirLinha(_index);
  } else {
    _fechar();
  }
}

/* ── Funções internas ── */

function _exibirLinha(idx) {
  _textEl().textContent = '';
  _continueEl().classList.remove('visivel');
  _done = false;
  clearTimeout(_timer);
  _typewriter(_linhas[idx]);
}

function _typewriter(texto) {
  let i = 0;
  function passo() {
    if (i < texto.length) {
      _textEl().textContent += texto[i++];
      _timer = setTimeout(passo, TYPEWRITER_VEL_MS);
    } else {
      _done = true;
      _continueEl().classList.add('visivel');
    }
  }
  passo();
}

function _fechar() {
  clearTimeout(_timer);
  _overlay().classList.remove('active');
  _onFim();
}
