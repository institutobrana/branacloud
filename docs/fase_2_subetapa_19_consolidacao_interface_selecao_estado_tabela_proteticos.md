# Fase 2 — Subetapa 19 — Consolidação documental final da interface de seleção/estado da Tabela de protéticos

## 1. Contexto
Os helpers puros já foram extraídos e isolados.

`protServicoSelecionado` foi analisado em múltiplas subetapas.

Ele depende de cache/estado.

A decisão sobre mover ou pausar precisa ser consolidada antes de qualquer código.

## 2. Estado atual
- helpers já isolados em `frontend/js/modules/tabela-proteticos-helpers.js`;
- `protServicoSelecionado` ainda em `frontend/app.js`;
- `frontend/js/modules/tabela-proteticos-selecao-estado.js` ainda não existe;
- esta etapa não move código.

## 3. Síntese das Subetapas 15 a 18
- Subetapa 15: reavaliação de `protServicoSelecionado`;
- Subetapa 16: definição documental da camada de seleção/estado;
- Subetapa 17: mapeamento das funções dependentes de seleção/estado;
- Subetapa 18: contrato de interface da camada de seleção/estado.

## 4. O que já foi extraído com segurança
- `protNomeArquivoBase`;
- `protFormatoInfo`;
- `protCsvEsc`;
- `protPdfEscape`.

Esses eram helpers mais puros, com menor dependência de estado.

## 5. O que torna `protServicoSelecionado` diferente
- depende de `protServicosCache`;
- depende de `protServicoSelecionadoId`;
- participa da seleção atual de serviço;
- pode afetar edição de serviço selecionado;
- pode afetar exclusão de serviço selecionado;
- pode afetar relatório/exportação se a seleção estiver incorreta;
- não deve ser misturado de forma precipitada com helpers puros.

## 6. Contrato consolidado para eventual camada futura
Se um dia for criada `frontend/js/modules/tabela-proteticos-selecao-estado.js`, a interface mínima recomendada é:

- começar com apenas `protServicoSelecionado`;
- preservar assinatura atual;
- preservar retorno atual;
- preservar comportamento atual;
- manter compatibilidade global;
- evitar alteração de chamadas existentes;
- evitar alterar `protSelecionarLinha`, `protEditarSelecionado`, `protExcluirServico`, `protRelatorioRows` e demais funções.

## 7. Avaliação de risco final
Riscos principais:

- criar arquivo novo aumenta a superfície de integração;
- mover função dependente de estado é mais arriscado do que mover helper puro;
- ausência de teste automatizado específico;
- risco de quebra silenciosa da seleção;
- risco de regressão em editar/excluir serviço;
- risco de regressão em relatório/exportação;
- risco de avanço excessivo na frente.

## 8. Alternativas finais

### Opção A
Avançar para futura Subetapa 20 funcional, criando `frontend/js/modules/tabela-proteticos-selecao-estado.js` e movendo somente `protServicoSelecionado`.
- Vantagem: avança a organização da frente.
- Risco: eleva a superfície de integração.
- Impacto: exige novo arquivo e coordenação com `app.js`.
- Quando seria aceitável: somente após contrato mais sólido e teste manual.
- Recomendação: não agora.

### Opção B
Pausar/consolidar a frente Tabela de protéticos após os helpers puros já extraídos.
- Vantagem: reduz risco imediato e estabiliza o que já foi extraído.
- Risco: posterga a reorganização da seleção/estado.
- Impacto: nenhum no código agora.
- Quando seria aceitável: quando o acoplamento e o risco ainda forem altos.
- Recomendação: sim.

### Opção C
Fazer mais uma documentação específica antes de qualquer decisão funcional.
- Vantagem: aprofunda o entendimento do acoplamento.
- Risco: prolonga a etapa documental.
- Impacto: nenhum no código agora.
- Quando seria aceitável: se ainda houver dúvida técnica relevante.
- Recomendação: alternativa secundária.

## 9. Decisão recomendada
Opção B: pausar/consolidar a frente Tabela de protéticos após os helpers puros já extraídos.

## 10. Justificativa da decisão
Essa é a decisão mais segura porque:

- os helpers puros já extraídos entregaram ganho seguro sem mexer em estado;
- `protServicoSelecionado` depende de estado/cache e aumenta o risco;
- mover sem necessidade imediata pode quebrar seleção, edição e relatório/exportação;
- a frente já acumulou documentação suficiente para um fechamento parcial responsável;
- continuar sem teste automatizado específico aumenta o risco de regressão.

## 11. Contrato mínimo para eventual Subetapa 20
Se houver novo avanço funcional, a próxima etapa deverá ser documental de fechamento parcial da frente Tabela de protéticos.

Em especial, antes de qualquer código novo, deve haver nova decisão documental que:

- confirme se haverá ou não camada de seleção/estado;
- confirme se `protServicoSelecionado` continua fora;
- confirme se haverá novo contrato de interface;
- confirme se a frente será encerrada parcialmente ou retomada depois.

## 12. Onde testar futuramente
Se houver eventual recorte funcional de seleção/estado, o usuário deverá testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- trocar seleção entre serviços;
- editar serviço selecionado;
- abrir modal de serviço;
- criar serviço;
- editar serviço;
- excluir serviço;
- abrir relatório;
- exportar relatórios;
- confirmar que criação, edição e exclusão de protético continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 13. Registro para roadmap
- A Subetapa 19 consolida documentalmente a decisão sobre a interface de seleção/estado;
- helpers puros já extraídos permanecem isolados;
- `protServicoSelecionado` continua fora até eventual subetapa funcional própria ou até fechamento/consolidação da frente;
- a decisão desta etapa define se haverá Subetapa 20 funcional, fechamento parcial ou nova documentação;
- a Tabela de protéticos continua como primeira frente ativa da Fase 2;
- próximos passos devem permanecer pequenos, reversíveis, auditáveis e com teste humano;
- persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 14. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 15. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `frontend/js/modules/tabela-proteticos-selecao-estado.js` não foi criado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md`.
