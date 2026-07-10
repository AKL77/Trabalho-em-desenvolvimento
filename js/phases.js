/**
 * phases.js — Dados de todas as fases do jogo.
 *
 * Cada fase tem:
 *   id        {number}   — identificador 1-based
 *   descricao {string}   — HTML exibido na Row 2
 *   mapa      {number[][]}— grid de tiles (ver TILE_DICT em config.js)
 *   inicio    {x, y}    — posição inicial do personagem
 *   blocos    {string[]} — blocos Blockly disponíveis nesta fase
 *   conteudos {string[]} — tópicos que o aluno deve dominar
 *   dialogos  {string[]} — falas exibidas ao concluir a fase
 */

export const fases = [
  {
    id: 1,
    descricao: '<strong>Objetivo:</strong> Chegue ao baú, desviando da bomba!',
    mapa: [
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 2, 2, 8, 2, 2, 9, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    ],
    inicio: { x: 1, y: 3 },
    blocos: ['mover_frente', 'se_bomba', 'pular'],
    conteudos: ['Sequência de comandos', 'Estrutura condicional'],
    dialogos: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla metus ut nulla dignissim molestie.',
      'Aenean tincidunt justo ut elementum pharetra. Morbi a nibh ornare, accumsan nunc et, finibus quam.',
      'Vivamus rutrum vulputate tortor vel ultricies. Mauris ullamcorper auctor efficitur.',
    ],
  },
  {
    id: 2,
    descricao: '🗺️ <strong>Fase 2:</strong> Explore o novo cenário! Use <em>"Mover para frente"</em> e <em>"Mover para cima"</em> para navegar até o objetivo.',
    mapa: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
    inicio: { x: 1, y: 5 },
    blocos: ['mover_frente', 'mover_cima', 'pular', 'se_bomba'],
    conteudos: ['Navegação em duas dimensões', 'Planejamento de rota', 'Sequência de comandos'],
    dialogos: [
      'Muito bem! Você dominou a navegação em duas dimensões.',
      'Combinar "mover para frente" e "mover para cima" exige planejamento de rota.',
      'Você está pronto para desafios ainda mais complexos!',
    ],
  },
];
