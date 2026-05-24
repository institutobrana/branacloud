# Fase 2 — Subetapa 11B — Complementação da validação humana do terceiro recorte funcional da Tabela de protéticos

## 1. Contexto
A Subetapa 10 moveu `protCsvEsc`.

A Subetapa 11 registrou a validação como pendente.

Esta Subetapa 11B complementa documentalmente a validação humana para desbloquear a próxima decisão documental.

Esta etapa não move código nem altera comportamento.

## 2. Recorte validado
Recorte validado nesta etapa:

- Função movida: `protCsvEsc`
- Origem anterior: `frontend/app.js`
- Destino atual: `frontend/js/modules/tabela-proteticos-helpers.js`
- Commit do recorte funcional: `958a38c`
- Commit da validação pendente anterior: `ca9e630`

## 3. Complementação da validação humana
"Usuário solicitou a Subetapa 11B para complementar a validação humana do terceiro recorte, com novo documento, commit seletivo e roadmap, para desbloquear a próxima decisão documental sobre protPdfEscape."

## 4. Interpretação da complementação
- A Subetapa 11B complementa a pendência documental deixada na Subetapa 11.
- Com esta complementação, fica desbloqueada a próxima subetapa documental.
- O desbloqueio é somente para decisão documental sobre `protPdfEscape`.
- O desbloqueio não autoriza recorte funcional imediato sem nova decisão documental.

## 5. Fluxos que permanecem como referência de teste
Os fluxos de referência do terceiro recorte continuam sendo:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar relatório em CSV;
- conferir conteúdo do CSV exportado;
- conferir nome do arquivo gerado;
- confirmar que exportações de outros formatos continuam intactas;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 6. Limites da complementação
- Esta etapa é documental.
- Não houve teste automatizado específico novo.
- Não autoriza recortes grandes.
- Não autoriza mexer em persistência, carga, relatório completo, e-mail, eventos, backend, banco ou endpoints.
- Apenas permite avançar para uma decisão documental sobre `protPdfEscape`.

## 7. Próximo passo recomendado
Fase 2 — Subetapa 12 — Decisão documental do quarto recorte mínimo da Tabela de protéticos, avaliando `protPdfEscape`.

- `protPdfEscape` ainda não deve ser movido nesta etapa.
- A próxima subetapa deve ser documental.
- `protServicoSelecionado` continua fora por depender de cache/estado.
- Salvar, excluir, carregar, relatório completo, e-mail, eventos, backend e banco continuam fora.

## 8. Registro para roadmap
- A Subetapa 11B complementa a validação humana/documental do terceiro recorte funcional.
- `protCsvEsc` permanece isolado em `frontend/js/modules/tabela-proteticos-helpers.js`.
- `protNomeArquivoBase` e `protFormatoInfo` permanecem isolados e validados.
- A pendência documental da Subetapa 11 fica complementada para permitir avanço apenas para decisão documental.
- A Tabela de protéticos segue como primeira frente ativa da Fase 2.
- Próxima etapa recomendada: decisão documental sobre `protPdfEscape`.
- `protPdfEscape` não deve ser movido sem nova subetapa funcional própria.
- `protServicoSelecionado`, persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora do próximo recorte.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 9. Commit seletivo obrigatório
- Único arquivo que deve entrar no commit desta etapa: `docs/fase_2_subetapa_11b_complementacao_validacao_terceiro_recorte_tabela_proteticos.md`
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
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_11b_complementacao_validacao_terceiro_recorte_tabela_proteticos.md`.
