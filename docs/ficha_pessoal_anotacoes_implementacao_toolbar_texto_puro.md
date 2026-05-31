# Ficha Pessoal — Implementação da toolbar da aba Anotações com texto puro

## 1. Contexto

A aba `Anotações` da `Ficha pessoal` foi tratada como bloco contínuo de observações do paciente.

O diagnóstico comparativo anterior mostrou que:

- no Brana Cloud o conteúdo era um `textarea` simples, com toolbar visual sem comportamento real;
- a persistência continuava sendo texto puro;
- no workspace não houve evidencia direta da UI do EasyDental, apenas o mapeamento indireto do campo `ANOTAC -> anotacoes`.

Esta etapa executa a primeira correção pequena e controlada baseada no contrato `FICHA-ANOT-CONTR-A`.

## 2. Base documental usada

- `docs/ficha_pessoal_anotacoes_diagnostico_comparativo_easydental_brana.md`
- `docs/ficha_pessoal_anotacoes_contrato_correcao_toolbar_persistencia.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

## 3. Decisão aplicada

Decisão aplicada: `FICHA-ANOT-CONTR-A`

Interpretação da execução:

- primeira implementação visual/local em texto puro;
- sem alterar backend;
- sem alterar banco;
- sem alterar payload;
- sem alterar formato de salvamento.

## 4. Escopo implementado

- criação do módulo dedicado `frontend/js/modules/ficha_pessoal_anotacoes.js`;
- consumo do módulo por `frontend/app.js` como fachada fina;
- substituição dos botões de planejamento por comportamento mínimo real e seguro;
- aplicação de marcação textual simples e reversível no `textarea`;
- preservação do foco/cursor quando possível;
- fallback defensivo caso o módulo não carregue ou os elementos não existam.

Comandos implementados em texto puro:

- negrito: `**texto**`
- itálico: `_texto_`
- sublinhado: `__texto__`
- lista: `- item`

## 5. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/ficha_pessoal_anotacoes.js`
- `docs/ficha_pessoal_anotacoes_implementacao_toolbar_texto_puro.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. Backup criado

Backup obrigatório criado antes da entrega em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/`

Arquivos incluídos no backup:

- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/frontend/app.js`
- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/frontend/js/modules/ficha_pessoal_anotacoes.js`

## 7. Confirmações

- `frontend/app.js` alterado somente para integração/fachada;
- `frontend/js/modules/ficha_pessoal_anotacoes.js` criado e consumido;
- `frontend/index.html` não alterado;
- backend não alterado;
- banco não alterado;
- schema/migrations/seeds/endpoints não alterados;
- `.env` não alterado;
- `requestJson` não alterado;
- payload não alterado;
- formato de salvamento não alterado;
- exclusão não alterada;
- permissões não alteradas.

## 8. Como testar manualmente

1. Abrir o sistema.
2. Ir em `Ficha Pessoal`.
3. Abrir um paciente existente.
4. Entrar na aba `Anotações`.
5. Digitar texto simples.
6. Selecionar uma palavra e testar `Negrito`.
7. Selecionar uma palavra e testar `Italico`.
8. Selecionar uma palavra e testar `Sublinhado`.
9. Testar `Lista`.
10. Gravar.
11. Fechar a ficha ou trocar de paciente e voltar.
12. Confirmar que o conteúdo persistiu como texto puro.
13. Confirmar que `Dados pessoais`, `Dados complementares`, `Anamnese` e `Histórico` continuam abrindo.
14. Confirmar que salvar paciente continua funcionando.

## 9. Riscos remanescentes

- a persistência continua em texto puro, portanto a semântica rica do EasyDental não foi reproduzida integralmente;
- o uso de marcadores simples pode exigir ajuste de UX em um contrato futuro;
- a aba ainda convive com outros blocos da `Ficha pessoal`, então qualquer expansão deve continuar bem limitada.

## 10. Plano de retorno manual usando backup

Se houver regressão, o retorno manual deve usar a cópia em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/`

Esse backup:

- não substitui commit;
- não autoriza `git reset`;
- não autoriza `git restore`;
- não autoriza `git clean`;
- não autoriza `git revert`.

## 11. Registro para roadmap

Esta implementação fica registrada como a primeira correção pequena da aba `Anotações`, mantendo texto puro, fachada fina em `frontend/app.js` e modularização controlada sem tocar em backend, banco ou formato de salvamento.
