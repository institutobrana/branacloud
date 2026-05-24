# Fechamento da Fase 1 e Abertura da Fase 2 — Refatoração Controlada

## 1. Decisão oficial
A Fase 1 da modularização segura chegou ao limite seguro.

A Fase 1 está encerrada estrategicamente.

O `frontend/app.js` ainda permanece grande, mas nao sera quebrado apenas por tamanho.

## 2. O que a Fase 1 representou
A Fase 1 priorizou:

- modularizacao de baixo risco;
- extracoes pequenas;
- helpers e trechos visuais seguros;
- evitacao de mudancas em regras criticas sem contrato funcional.

## 3. Motivo para encerrar a Fase 1
O conjunto de partes faceis/baixo risco ja foi explorado.

Novas extracoes relevantes tendem a envolver modulos medios ou criticos.

Continuar procurando apenas "baixo risco" pode gerar pouco beneficio real.

A proxima evolucao exige planejamento mais robusto.

## 4. Nova estrategia da Fase 2
A pergunta deixa de ser "qual modulo e mais facil?".

A pergunta passa a ser "qual modulo importante vale o risco de uma refatoracao controlada?".

A Fase 2 sera orientada por:

- prioridade de negocio;
- risco controlado;
- teste manual claro;
- contrato funcional antes de qualquer codigo.

## 5. Regra obrigatoria antes de qualquer codigo na Fase 2
Antes de alterar qualquer modulo medio/importante, criar contrato funcional contendo:

- como funciona hoje;
- quais botoes existem;
- quais dados carrega;
- quais dados salva;
- quais endpoints usa;
- quais riscos existem;
- onde testar;
- o que nao pode mudar.

## 6. Modulos candidatos a Fase 2
Os candidatos documentais da Fase 2, sem escolha definitiva nesta etapa, sao:

- Ficha pessoal;
- Agenda;
- Editor de texto;
- Tabela de proteticos;
- Relatorios;
- Conta corrente;
- Usuarios/Login;
- Seeds/tabelas padrao.

## 7. Critérios de escolha da primeira frente da Fase 2
A primeira frente da Fase 2 deve considerar:

- prioridade de negocio;
- frequencia de uso;
- risco tecnico;
- facilidade de teste manual;
- dependencia de backend/banco/seeds/permissoes;
- impacto no usuario;
- beneficio de reduzir acoplamento no `app.js`.

## 8. Pendencia paralela dos untracked de Anamnese/restauracao
O workspace possui arquivos untracked em `docs/` relacionados a Anamnese, EDS70, restauracao, auditoria, CSV, TXT, SQL, PATCH e JSON.

Esses arquivos:

- nao fazem parte deste fechamento;
- nao devem ser adicionados automaticamente;
- precisam de triagem separada;
- podem conter dados sensiveis ou evidencia tecnica local;
- nao bloqueiam a decisao estrategica de encerrar a Fase 1;
- bloqueiam qualquer commit amplo em `docs/`.

## 9. Regras permanentes herdadas para a Fase 2
As regras permanentes para a Fase 2 sao:

- blindagem textual/mojibake obrigatoria;
- alteracoes pequenas;
- documentacao antes de codigo;
- checklist de testes antes de prosseguir;
- commits seletivos;
- nada de operacoes destrutivas no Git;
- nada de alteracao de banco sem etapa propria e autorizacao explicita.

## 10. Onde testar esta etapa
Esta etapa e documental, portanto nao ha teste funcional de tela.

Checks obrigatorios:

- `git status --short`
- `git diff -- docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`
- confirmar que somente o documento desta etapa foi criado/modificado.

## 11. Próximo passo recomendado
Fase 2 — Subetapa 0: escolha documentada da primeira frente prioritaria de refatoracao controlada.

Essa proxima subetapa tambem deve ser documental, sem alteracao de codigo.
