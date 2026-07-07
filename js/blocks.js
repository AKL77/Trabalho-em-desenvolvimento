/**
 * blocks.js — Definições e geradores dos blocos Blockly.
 *
 * Para adicionar um novo bloco:
 *   1. Defina Blockly.Blocks['nome'] com init()
 *   2. Adicione o gerador em javascript.javascriptGenerator.forBlock['nome']
 *   3. Adicione 'nome' ao array `blocos` da(s) fase(s) em phases.js
 *
 * Blockly e javascript (gerador JS) são globais carregados pelo <script> no HTML.
 */

/* ── Bloco Início ── */
Blockly.Blocks['inicio'] = {
  init() {
    this.appendDummyInput().appendField('▶  Início');
    this.setNextStatement(true, null);
    this.setColour('#e07b00');
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
  },
};
javascript.javascriptGenerator.forBlock['inicio'] = () => '';

/* ── Movimento ── */
Blockly.Blocks['mover_frente'] = {
  init() {
    this.appendDummyInput().appendField('Mover para frente');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  },
};
javascript.javascriptGenerator.forBlock['mover_frente'] = () => 'cmd_moverFrente();\n';

Blockly.Blocks['mover_cima'] = {
  init() {
    this.appendDummyInput().appendField('Mover para cima');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  },
};
javascript.javascriptGenerator.forBlock['mover_cima'] = () => 'cmd_moverCima();\n';

/* ── Pulo ── */
Blockly.Blocks['pular'] = {
  init() {
    this.appendDummyInput().appendField('Pular');
    this.setPreviousStatement(true, null);
    // Sem setNextStatement: bloco terminal (nada conecta abaixo)
    this.setColour(160);
  },
};
javascript.javascriptGenerator.forBlock['pular'] = () => 'cmd_pular();\n';

/* ── Condicional ── */
Blockly.Blocks['se_bomba'] = {
  init() {
    this.appendStatementInput('DO').appendField('Se houver bomba à frente');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
  },
};
javascript.javascriptGenerator.forBlock['se_bomba'] = (block) => {
  const branch = javascript.javascriptGenerator.statementToCode(block, 'DO');
  return `if (cmd_temBomba()) {\n${branch}}\n`;
};
