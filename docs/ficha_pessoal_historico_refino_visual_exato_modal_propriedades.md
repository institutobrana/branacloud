# Ficha Pessoal - Historico - Ajuste visual exato da janela Propriedades do histórico

## Objetivo
Alinhar a janela `Propriedades do histórico` da aba `Historico` com a screenshot de referencia do legado, preservando a logica existente e focando apenas em fidelidade visual e rotulos.

## O que foi ajustado
- Titulo principal para `Propriedades do histórico`.
- Botao de fechar no canto superior direito com destaque vermelho.
- Linha superior com:
  - `Data`
  - `Cirurgião responsável`
  - `Região`
  - `Cor de fundo`
- Area central com:
  - `Histórico`
  - `Data de inserção`
  - `Data de atualização`
- Botoes finais com:
  - `Ok`
  - `Cancela`

## O que permaneceu igual
- Fluxo funcional da aba Historico.
- Integracao com o envelope `extra.historico_aba`.
- Uso do catalogo de prestadores para `Cirurgião responsável`.
- Ausencia de backend novo, schema novo, migration nova ou rota nova.

## Observacoes
- O ajuste visual nao altera a regra de persistencia.
- Os metadados de auditoria continuam sendo preservados apenas no envelope atual.
- A janela foi tratada como modal legado, com forte fidelidade ao desenho da referencia.

## Validacao sugerida
1. Abrir a aba Historico.
2. Selecionar uma linha.
3. Abrir `Propriedades da linha`.
4. Conferir se a composicao visual bate com a screenshot de referencia.
5. Confirmar que `Ok`, `Cancela` e `X` continuam funcionando.
