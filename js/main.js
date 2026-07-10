/**
 * main.js — Ponto de entrada do jogo.
 *
 * Responsabilidades:
 *   - Orquestrar os módulos (carregarFase, iniciarExecucao)
 *   - Expor funções em window para os onclick= do HTML
 *   - Inicializar listeners globais (ResizeObserver, click fora do menu)
 */

import { fases }                               from './phases.js';
import { state }                               from './state.js';
import { workspace, atualizarToolbox,
         adicionarBlocoInicio, aplicarEscala } from './workspace.js';
import { desenharMapa, atualizarVisual }        from './renderer.js';
import { cmd_moverFrente, cmd_moverCima,
         cmd_pular, cmd_temBomba,
         processarFila, verificarVitoria,
         resetarFase }                         from './engine.js';
import { iniciarDialogo, avancarDialogo,
         mostrarConclusao, acaoConclusaoReiniciar,
         acaoConclusaoAvancar }                    from './dialogue.js';
import { gerarDotsFases, toggleMenu,
         abrirConfiguracoes, abrirModal,
         fecharModal, fecharModalOverlay,
         abrirDicas, abrirConteudos }          from './ui.js';

/* ── Funções expostas globalmente ──────────────────────────────
   O eval() do Blockly gera código como `cmd_moverFrente();`,
   que precisa existir em window. As demais são chamadas por onclick=. */
Object.assign(window, {
  // Comandos do Blockly (usados no eval)
  cmd_moverFrente,
  cmd_moverCima,
  cmd_pular,
  cmd_temBomba,

  // Orquestração
  carregarFase,
  iniciarExecucao,
  reiniciarFase,
  confirmarReiniciar,

  // UI
  toggleMenu,
  abrirConfiguracoes,
  fecharModal,
  fecharModalOverlay,
  abrirDicas,
  abrirConteudos,

  // Diálogo
  avancarDialogo,
  acaoConclusaoReiniciar,
  acaoConclusaoAvancar,
});

/* ── Orquestração ──────────────────────────────────────────── */

/** Carrega uma fase pelo id (1-based). */
function carregarFase(id) {
  state.faseAtualIndex = id - 1;
  const fase = fases[state.faseAtualIndex];

  document.getElementById('fase-descricao').innerHTML = fase.descricao || '';
  state.posX = fase.inicio.x;
  state.posY = fase.inicio.y;

  desenharMapa(fase.mapa);
  atualizarVisual(false);
  atualizarToolbox(fase.blocos);

  workspace.clear();
  adicionarBlocoInicio();

  document.getElementById('btnExecutar').disabled = false;
  gerarDotsFases(carregarFase);
  aplicarEscala();
}

/** Executa o código conectado ao bloco Início. */
function iniciarExecucao() {
  document.getElementById('btnExecutar').disabled = true;

  const fase = fases[state.faseAtualIndex];
  state.posX     = fase.inicio.x;
  state.posY     = fase.inicio.y;
  state.virtualX = state.posX;
  state.virtualY = state.posY;
  state.filaDeAcoes = [];
  atualizarVisual(false);

  // Gera código apenas da cadeia ligada ao bloco Início; blocos soltos são ignorados
  const [inicioBlock] = workspace.getBlocksByType('inicio');
  if (inicioBlock) {
    // eslint-disable-next-line no-eval
    eval(javascript.javascriptGenerator.blockToCode(inicioBlock));
  }

  processarFila(() =>
    verificarVitoria(() =>
      iniciarDialogo(fase.dialogos, () => {
        const proximaId = state.faseAtualIndex + 2;
        mostrarConclusao(
          `Parabéns! Você completou a fase ${fase.id}!`,
          /* Jogar novamente */
          () => {
            state.posX = fase.inicio.x;
            state.posY = fase.inicio.y;
            atualizarVisual(false);
            document.getElementById('btnExecutar').disabled = false;
          },
          /* Avançar */
          proximaId <= fases.length
            ? () => carregarFase(proximaId)
            : () => {
                state.posX = fase.inicio.x;
                state.posY = fase.inicio.y;
                atualizarVisual(false);
                document.getElementById('btnExecutar').disabled = false;
              }
        );
      })
    )
  );
}

function reiniciarFase() {
  abrirModal('modalReiniciar');
}

function confirmarReiniciar() {
  fecharModal('modalReiniciar');
  carregarFase(state.faseAtualIndex + 1);
}

/* ── Inicialização ─────────────────────────────────────────── */

window.onload = () => {
  carregarFase(1);

  // double-rAF: garante escala correta após o primeiro paint
  requestAnimationFrame(() => requestAnimationFrame(aplicarEscala));

  // Recalcula escala quando o painel do jogo mudar de tamanho
  new ResizeObserver(aplicarEscala)
    .observe(document.querySelector('.game-panel'));

  // Fecha o dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hamburger-wrapper')) {
      document.getElementById('dropdownMenu')?.classList.remove('open');
    }
  });
};