# Fase 2 — Subetapa 8 — Validação pós-teste do segundo recorte funcional da Tabela de protéticos

## 1. Contexto
Esta etapa registra a validação humana após o segundo recorte funcional mínimo da Fase 2.

Ela consolida a confirmação de que `protFormatoInfo` foi isolado com segurança suficiente para seguir no roadmap da Tabela de protéticos.

## 2. Recorte validado
Recorte validado nesta etapa:

- Função movida: `protFormatoInfo`
- Origem anterior: `frontend/app.js`
- Destino atual: `frontend/js/modules/tabela-proteticos-helpers.js`
- Commit validado: `1aaf052`
- `frontend/index.html` não foi alterado na Subetapa 7.

## 3. Resultado do teste humano
"testes ok"

## 4. Fluxos considerados no teste
Os fluxos considerados no teste humano foram os definidos na Subetapa 7:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar relatório nos formatos disponíveis;
- conferir conteúdo/arquivo exportado;
- conferir nome do arquivo gerado;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 5. Interpretação da validação
Com base no teste humano informado, o segundo recorte funcional mínimo pode ser considerado validado nesta etapa.

A ausência de erros reportados reforça que o isolamento de `protFormatoInfo` manteve o comportamento esperado do fluxo validado.

## 6. Limites da validação
Esta validação tem limites claros:

- não houve teste automatizado específico novo;
- a validação foi manual;
- a validação não autoriza recortes grandes;
- próximos recortes devem continuar pequenos, reversíveis e auditáveis.

## 7. Próximo passo recomendado
A próxima subetapa deve ser documental para decidir entre:

- `protCsvEsc`;
- `protPdfEscape`.

Ambos atuam em conteúdo de exportação e nenhum deve ser movido antes de uma decisão documental.

`protServicoSelecionado` continua fora por depender de cache/estado.

Salvar, excluir, carregar, relatório completo, e-mail, eventos, backend e banco continuam fora.

## 8. Registro para roadmap
- A Subetapa 8 valida humanamente o segundo recorte funcional da Fase 2.
- `protFormatoInfo` permanece isolado e validado.
- `protNomeArquivoBase` permanece isolado e validado.
- A Tabela de protéticos segue como primeira frente ativa da Fase 2.
- Próximos recortes só devem avançar mantendo o padrão mínimo, reversível e auditável.
- A próxima decisão documental deve escolher entre `protCsvEsc` e `protPdfEscape`.
- `protServicoSelecionado`, persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora do próximo recorte.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 9. Commit seletivo obrigatório
- Único arquivo que deve entrar no commit desta etapa: `docs/fase_2_subetapa_8_validacao_pos_teste_segundo_recorte_tabela_proteticos.md`
- Não usar `git add .`.
- Não usar `git add docs/`.
- Não incluir untracked antigos.
- Não incluir `frontend/app.js`.
- Não incluir `frontend/index.html`.
- Não incluir `frontend/js/modules`.
- Não incluir `backend`.
- Não incluir banco/schema/migrations/seeds/endpoints.
- Commit deve ser seletivo e auditado.

## 10. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `backend` não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_8_validacao_pos_teste_segundo_recorte_tabela_proteticos.md`.
