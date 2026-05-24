# Fase 2 — Correção de trilha após commit ae98032

## 1. Contexto
A frente Tabela de protéticos já estava pausada/consolidada, e a próxima frente correta era Editor de texto.

## 2. Commit fora da sequência
- commit: `ae98032`
- arquivo alterado: `docs/fase_2_subetapa_11_validacao_pos_teste_terceiro_recorte_tabela_proteticos.md`
- motivo da correção: esse commit retomou uma subetapa antiga da Tabela de protéticos após a frente já estar fechada parcialmente.

## 3. Decisão
- não fazer reset;
- não fazer revert;
- não apagar histórico;
- tratar `ae98032` como registro documental fora da sequência esperada;
- seguir adiante pela trilha correta.

## 4. Trilha correta
- Tabela de protéticos permanece pausada/consolidada;
- documento de fechamento parcial: `docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`
- commit: `54bc643`
- reavaliação de próximas frentes: `docs/fase_2_reavaliacao_proximas_frentes_pos_tabela_proteticos.md`
- commit: `cc66bdf`
- próxima frente: Editor de texto
- próxima etapa: Fase 2 — Editor de texto — Subetapa 1 — Contrato funcional
- documento esperado: `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`

## 5. O que não fazer
- não retomar Tabela de protéticos agora;
- não mover `protServicoSelecionado`;
- não criar `tabela-proteticos-selecao-estado.js`;
- não alterar código;
- não mexer em backend;
- não mexer em banco;
- não mexer em endpoints;
- não mexer em permissões/sessão;
- não mexer em textos visíveis.

## 6. Registro para roadmap
- `ae98032` foi identificado como commit documental fora da sequência esperada;
- a frente Tabela de protéticos permanece pausada/consolidada;
- a decisão de próxima frente continua sendo Editor de texto;
- a próxima etapa correta é contrato funcional do Editor de texto;
- não houve autorização para nova alteração funcional;
- commit seletivo e blindagem textual/mojibake continuam obrigatórios.

## 7. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_correcao_trilha_pos_commit_ae98032.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 8. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum `reset`, `revert`, `restore` ou `clean` foi executado.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_correcao_trilha_pos_commit_ae98032.md`.
