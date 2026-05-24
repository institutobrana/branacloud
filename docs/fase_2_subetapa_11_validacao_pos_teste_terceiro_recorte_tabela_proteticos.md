# Fase 2 — Subetapa 11 — Validação pós-teste do terceiro recorte funcional da Tabela de protéticos

## 1. Contexto
Esta etapa registra a validação humana após o terceiro recorte funcional mínimo da Fase 2.

## 2. Recorte validado
- Função movida: `protCsvEsc`;
- Origem anterior: `frontend/app.js`;
- Destino atual: `frontend/js/modules/tabela-proteticos-helpers.js`;
- Commit validado: `958a38c`;
- `frontend/app.js` não ficou com diff final no audit da Subetapa 10;
- `frontend/index.html` não foi alterado na Subetapa 10.

## 3. Resultado do teste humano
Validação humana pendente de confirmação explícita no retorno desta etapa.

## 4. Fluxos considerados no teste
Os fluxos que deveriam ser testados conforme a Subetapa 10 foram:

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

## 5. Interpretação da validação
A Subetapa 11 fica como registro documental pendente e não deve autorizar a Subetapa 12 funcional.

## 6. Limites da validação
- não houve teste automatizado específico novo;
- a validação foi manual ou está pendente, conforme o item 3;
- a validação não autoriza recortes grandes;
- próximos recortes devem continuar pequenos, reversíveis e auditáveis.

## 7. Próximo passo recomendado
Recomenda-se que a próxima subetapa seja documental para decidir/confirmar o recorte de `protPdfEscape`.

`protPdfEscape` atua em conteúdo de exportação PDF.

`protPdfEscape` não deve ser movido antes de decisão documental.

`protServicoSelecionado` continua fora por depender de cache/estado.

Salvar, excluir, carregar, relatório completo, e-mail, eventos, backend e banco continuam fora.

Se a confirmação humana positiva não estiver disponível, o usuário deve executar o teste manual antes de qualquer nova subetapa.

## 8. Registro para roadmap
- A Subetapa 11 registra a validação pós-teste do terceiro recorte funcional da Fase 2;
- `protCsvEsc` permanece isolado em `frontend/js/modules/tabela-proteticos-helpers.js`;
- `protNomeArquivoBase` e `protFormatoInfo` permanecem isolados e validados;
- a Tabela de protéticos segue como primeira frente ativa da Fase 2;
- se houver validação humana positiva, próximos recortes podem continuar mantendo o padrão mínimo, reversível e auditável;
- se não houver validação humana positiva, bloquear avanço funcional até teste manual;
- o próximo candidato possível continua sendo `protPdfEscape`, mas só após decisão documental;
- `protServicoSelecionado`, persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora do próximo recorte;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 9. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_11_validacao_pos_teste_terceiro_recorte_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir backend.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 10. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_11_validacao_pos_teste_terceiro_recorte_tabela_proteticos.md`.
