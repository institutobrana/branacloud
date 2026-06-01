# Ficha Pessoal - Historico - Microetapa 2 - refino visual leve do modal de Propriedades da linha

## Objetivo

Executar refinamentos visuais leves no modal de `Propriedades da linha` da aba `Historico`, sem alterar logica funcional, persistencia ou comportamento de teclado.

## Refinamentos visuais realizados

- Ajuste de leitura no texto de apoio do cabecalho do modal.
- Ajuste do agrupamento visual do bloco de informacao interna.
- Pequeno refinamento de espacamento vertical no corpo do modal.
- Pequeno refinamento de leitura no bloco de aviso sobre campos fora desta etapa.

## Textos / rótulos ajustados

- Texto de apoio do cabecalho:
  - antes: `Campos locais da linha selecionada. Itens futuros seguem pendentes nesta etapa.`
  - depois: `Campos principais da linha selecionada. Itens futuros permanecem fora desta etapa.`
- Titulo do bloco de aviso:
  - antes: `Campos pendentes nesta etapa`
  - depois: `Campos fora desta etapa`

## Arquivos alterados

- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `docs/11_roadmap_desenvolvimento.md`

## Confirmacao de ausencia de mudanca funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao da abertura/fechamento do modal.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Riscos observados

- Risco baixo, limitado a leitura visual e pequenos ajustes de espaco.
- Nao foram introduzidos campos novos nem regras novas.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Selecionar uma linha.
5. Abrir `Propriedades da linha`.
6. Conferir a organizacao visual, o espaco entre blocos, os rótulos e a legibilidade do modal.
7. Confirmar que `Aplicar`, `Cancelar`, `X` e `Escape` continuam funcionando como antes.
8. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima microetapa recomendada

Iniciar a analise e, se autorizado, a execucao do primeiro ajuste funcional de medio risco.

