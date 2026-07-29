# Encerramento tecnico final - Questionarios de Anamnese no frontend React

## 1. Objetivo

Encerrar tecnicamente a frente React de `Configuracoes -> Questionarios de anamnese`, consolidando a implementacao entregue, o comportamento real dos botoes, a auditoria de impressao e os limites assumidos para a proxima frente futura.

## 2. Escopo entregue

- shell em L integrado ao React;
- toolbar da anamnese integrada ao padrao visual do modulo administrativo;
- combo de questionarios no lado esquerdo da barra;
- CRUD de questionarios;
- copia de questionario;
- CRUD de perguntas;
- selecao unica por radio na tabela;
- tabela sem filtros;
- rodape com total completo;
- comportamento real do botao `1,2... Renumera perguntas` como atalho para a primeira pergunta da lista;
- botao `Imprime` mantido desabilitado;
- auditoria tecnica da impressao concluindo que a frente nao deve ser implementada nesta etapa.

## 3. Rota e menu

- rota/entrada funcional da feature: `Configuracoes -> Questionarios de anamnese`;
- o acesso segue a navegacao do shell atual do React;
- a feature permanece isolada, sem mistura com outras frentes administrativas.

## 4. Arquitetura modular

Arquivos principais da feature:

- `frontend-react/src/features/questionariosAnamnese/QuestionariosAnamnesePage.jsx`
- `frontend-react/src/features/questionariosAnamnese/questionariosAnamnese.css`
- `frontend-react/src/features/questionariosAnamnese/questionariosAnamneseApi.js`
- `frontend-react/src/features/questionariosAnamnese/hooks/useQuestionariosAnamnese.js`
- `frontend-react/src/features/questionariosAnamnese/components/QuestionariosAnamneseToolbar.jsx`
- `frontend-react/src/features/questionariosAnamnese/components/QuestionariosAnamneseTable.jsx`
- `frontend-react/src/features/questionariosAnamnese/components/QuestionarioFormModal.jsx`
- `frontend-react/src/features/questionariosAnamnese/components/QuestionarioDeleteDialog.jsx`
- `frontend-react/src/features/questionariosAnamnese/components/PerguntaFormModal.jsx`
- `frontend-react/src/features/questionariosAnamnese/components/PerguntaDeleteDialog.jsx`

Arquivos compartilhados que participam da montagem:

- `frontend-react/src/components/BranaModal.jsx`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/services/api.js`

## 5. Endpoints consumidos

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{id}`
- `DELETE /anamnese/questionarios/{id}`
- `GET /anamnese/questionarios/{id}/perguntas`
- `POST /anamnese/questionarios/{id}/perguntas`
- `PUT /anamnese/perguntas/{id}`
- `DELETE /anamnese/perguntas/{id}`

## 6. CRUD de questionarios

Confirmado:

- listar questionarios da clinica autenticada;
- criar questionario vazio;
- criar questionario copiando outro questionario;
- alterar questionario;
- excluir questionario vazio;
- bloquear exclusao com `409` quando houver perguntas vinculadas.

## 7. Copia de questionario

Confirmado:

- a copia ocorre no mesmo `POST /anamnese/questionarios`;
- o frontend expõe a opcao de copia no modal de criacao;
- o combo de origem fica desabilitado quando a copia nao esta ativa;
- o fluxo funciona sem criar endpoint novo.

## 8. CRUD de perguntas

Confirmado:

- listar perguntas do questionario selecionado;
- criar pergunta;
- alterar pergunta;
- excluir pergunta;
- manter numero, tipo, texto e mensagem de alerta conforme contrato;
- o backend continua sendo a fonte da regra de numero, tipos e limites.

## 9. Tabela

Estado final entregue:

- coluna de radio para selecao unica;
- coluna `Nº`;
- coluna `Texto da pergunta`;
- sem filtros nos cabecalhos;
- destaque visual da linha selecionada;
- scroll vertical;
- cabecalho fixo;
- rodape com total completo de perguntas.

## 10. Selecao

Confirmado:

- a linha selecionada fica consistente com o radio;
- a criacao e exclusao preservam uma selecao util quando possivel;
- o primeiro item e retomado quando a tela precisa reposicionar a lista.

## 11. Ausencia de filtros

- nao ha filtros de coluna na implementacao atual;
- qualquer referencia anterior a filtros de cabecalho nao faz parte do estado final desta frente.

## 12. Rodape

- o rodape mostra o total completo de perguntas do questionario;
- o valor e atualizado com a lista atual exibida.

## 13. Botao `1,2...`

Comportamento real:

- leva a selecao para a primeira pergunta da lista;
- faz scroll do container para o topo;
- nao abre modal;
- nao chama API;
- nao altera numeracao.

## 14. Botao Imprime

Estado final:

- permanece desabilitado;
- nao possui handler funcional;
- nao chama API;
- nao abre alerta;
- nao executa impressao.

## 15. Auditoria de impressao

Resultado consolidado:

- o frontend legado do Brana Cloud tinha apenas um alert de planejamento;
- o backend nao possui rota de impressao;
- nao foi localizado relatorio desktop reaproveitavel com seguranca nesta auditoria;
- a impressao foi deixada fora do escopo funcional desta frente;
- a frente futura de impressao permanece pendente de contrato proprio.

## 16. Motivo para nao implementar impressao

A impressao foi excluida do escopo por ausencia de contrato seguro. Implementar `window.print`, preview, PDF ou endpoint novo exigiria nova auditoria e nova decisao funcional, e isso nao foi autorizado nesta etapa.

## 17. Testes executados

Validações locais realizadas:

- leitura do estado atual da feature;
- leitura do contrato backend;
- leitura da interface React;
- leitura do legado frontend;
- leitura do acervo EasyDental local;
- conferência do contrato/plano/documentação.

Nao foi executada navegacao manual nesta passagem.

## 18. Build

- build nao foi executado nesta passada de encerramento;
- a etapa anterior ja havia validado a feature em build de forma separada;
- se necessario, o comando oficial continua sendo `npm.cmd run build`.

## 19. Riscos

- o fluxo de impressao permanece como pendencia futura;
- a definicao visual e funcional de tipos de pergunta continua dependente de contrato de produto;
- a tabela nao possui filtros nesta fase;
- qualquer expansao do modulo precisa preservar isolamento por clinica.

## 20. Limitacoes

- nao foi localizado contrato de impressao da anamnese pronto para reaproveitamento;
- nao foi alterado backend;
- nao foi alterado banco;
- nao foram feitos commits ou pushes;
- o worktree segue com outras frentes preexistentes.

## 21. Pendencia futura de impressao

A impressao deve ser tratada como nova frente, com auditoria propria e contrato separado, caso o produto decida implementa-la.

## 22. Criterios de aceite atendidos

- shell correto;
- toolbar correta;
- CRUD de questionarios funcional;
- copia de questionario funcional;
- CRUD de perguntas funcional;
- tabela sem filtros;
- selecao por radio;
- rodape funcional;
- botao `1,2...` sem chamada de API;
- `Imprime` desabilitado;
- documentacao alinhada ao estado real.

## 23. Estado Git e preservacao

- branch preservada: `modularizacao-segura-fase-1`;
- HEAD preservado;
- stage preservado vazio;
- nenhuma alteracao alheia foi revertida;
- backend nao foi alterado;
- banco nao foi alterado diretamente;
- `Y:\EDS70` permaneceu somente leitura;
- nenhum commit;
- nenhum push.
