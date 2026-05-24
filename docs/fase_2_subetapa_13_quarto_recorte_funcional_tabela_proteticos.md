# Fase 2 — Subetapa 13 — Quarto recorte funcional mínimo da Tabela de protéticos

## 1. Contexto
Esta etapa executa o quarto recorte funcional mínimo definido documentalmente na Subetapa 12.

A Subetapa 12 recomendou `protPdfEscape` como o próximo helper a ser extraído.

## 2. Escopo executado
Foi movida somente a função `protPdfEscape`.

- Função movida: `protPdfEscape`
- Arquivo de origem: `frontend/app.js`
- Arquivo de destino: `frontend/js/modules/tabela-proteticos-helpers.js`
- Ajustes mínimos feitos em `frontend/app.js`: remoção da definição local da função para manter o consumo pelo arquivo novo sem alterar o comportamento.
- `frontend/index.html`: não foi alterado.
- Motivo técnico da abordagem escolhida: manter compatibilidade com o carregamento global já existente, sem mexer em fluxo, DOM, backend ou regras de negócio.

## 3. Escopo não executado
Nenhuma outra função foi movida.

Não foram movidas:

- `protServicoSelecionado`;
- qualquer outra função da Tabela de protéticos.

## 4. Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/tabela-proteticos-helpers.js`
- `docs/fase_2_subetapa_13_quarto_recorte_funcional_tabela_proteticos.md`

## 5. Preservação funcional
A assinatura, o retorno e o comportamento de `protPdfEscape` foram preservados.

O helper continua escapando texto para a sintaxe de PDF exatamente como antes, sem alterar o resultado esperado.

## 6. Blindagem textual/mojibake
Nenhum texto visível, acento, label, mensagem, placeholder ou string visível foi corrigido.

A blindagem textual/mojibake foi respeitada integralmente.

## 7. Checks executados
Checks executados nesta etapa:

- `node --check frontend/app.js` - OK, sem saída.
- `node --check frontend/js/modules/tabela-proteticos-helpers.js` - OK, sem saída.

## 8. Teste manual obrigatório antes de avançar
Antes de qualquer próximo recorte funcional, o usuário deve testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar relatório em PDF;
- conferir conteúdo do PDF exportado;
- conferir caracteres especiais no PDF;
- conferir nome do arquivo gerado;
- confirmar que exportações CSV e demais formatos continuam intactas;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 9. Registro para roadmap
- O quarto recorte funcional da Fase 2 foi realizado.
- `protPdfEscape` agora está isolado em `frontend/js/modules/tabela-proteticos-helpers.js`.
- `protNomeArquivoBase`, `protFormatoInfo` e `protCsvEsc` permanecem isolados.
- A Tabela de protéticos continua como primeira frente ativa da Fase 2.
- Próximos recortes só devem ocorrer após teste manual humano.
- `protServicoSelecionado` deve continuar para depois, por depender de cache/estado.
- Persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 10. Commit seletivo obrigatório
Arquivos que podem entrar no commit desta etapa:

- `frontend/app.js`
- `frontend/js/modules/tabela-proteticos-helpers.js`
- `docs/fase_2_subetapa_13_quarto_recorte_funcional_tabela_proteticos.md`

`frontend/index.html` só pode entrar no commit se tivesse sido realmente alterado e houvesse justificativa técnica explícita. Nesta etapa, ele não foi alterado.

Regras de commit seletivo:

- não usar `git add .`;
- não usar `git add docs/`;
- não incluir untracked antigos;
- não incluir `backend`;
- não incluir banco/schema/migrations/seeds/endpoints;
- commit deve ser seletivo e auditado.

## 11. Confirmações finais
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
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_13_quarto_recorte_funcional_tabela_proteticos.md`.
