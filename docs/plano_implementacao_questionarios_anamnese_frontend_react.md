# Plano de implementacao - Questionarios de Anamnese no frontend React

## 1. Premissas

- nao alterar o backend nesta etapa;
- nao alterar o frontend legado;
- nao criar rotas novas;
- nao mexer em banco, migrations ou seeds;
- trabalhar somente na futura implementacao React quando autorizada.

## 2. Pre-requisitos

Antes de codificar:

- revisar este contrato funcional;
- confirmar permissao `anamnese`;
- validar a lista real de endpoints existentes;
- validar o shell atual do React;
- confirmar padrao de componentes reutilizaveis.

## 3. Sequencia segura

### Etapa 1

- criar pagina orquestradora da feature;
- conectar consulta de questionarios;
- renderizar estado vazio, loading e erro.

### Etapa 2

- criar toolbar modular;
- criar combo de questionario;
- criar tabela de perguntas.

### Etapa 3

- criar modal de questionario;
- criar modal de pergunta;
- criar confirmacao de exclusao.

### Etapa 4

- ligar CRUD de questionarios;
- ligar CRUD de perguntas;
- ligar renumeracao;
- preservar selecao.

### Etapa 5

- integrar leitura e salvamento de respostas em contexto de paciente;
- fechar contrato de impressao;
- cobrir com testes.

## 4. Arquivos futuros provaveis

Os nomes abaixo sao sugestoes de organizacao, nao um compromisso final:

- `frontend-react/src/features/anamnese/QuestionariosAnamnesePage.jsx`
- `frontend-react/src/features/anamnese/components/QuestionariosAnamneseToolbar.jsx`
- `frontend-react/src/features/anamnese/components/QuestionariosAnamneseTable.jsx`
- `frontend-react/src/features/anamnese/components/QuestionarioAnamneseModal.jsx`
- `frontend-react/src/features/anamnese/components/PerguntaAnamneseModal.jsx`
- `frontend-react/src/features/anamnese/services/anamneseApi.js`
- `frontend-react/src/features/anamnese/hooks/useQuestionariosAnamnese.js`
- `frontend-react/src/features/anamnese/hooks/usePerguntasAnamnese.js`

## 5. Dependencias tecnicas

- cliente HTTP autenticado ja usado pelo projeto;
- padrao de loading e error state;
- padrao de modal confirmado em outras features;
- tipos/contratos da feature;
- utilitarios de validacao de texto e numero.

## 6. Testes necessarios

### Unitarios

- validacao de nome de questionario;
- validacao de texto de pergunta;
- normalizacao de numero;
- regras de habilitacao de botoes.

### Integracao

- carregamento da lista de questionarios;
- carregamento da lista de perguntas;
- criar/editar/excluir questionario;
- criar/editar/excluir pergunta;
- renumeracao.

### Contrato

- status codes esperados;
- estrutura das respostas;
- comportamento em `409` ao excluir questionario com perguntas;
- comportamento de respostas vazias.

### Interface

- combo seleciona questionario;
- tabela atualiza ao trocar combo;
- modais abrem e fecham corretamente;
- selecao e preservada apos reload.

### Manual

- login;
- troca de questionario;
- salvar e excluir;
- renumerar;
- imprimir;
- conferir tema claro e escuro.

## 7. Riscos

- depender de contrato incompleto de impressao;
- perder selecao da tabela apos recarga;
- duplicar regras do backend no frontend sem necessidade;
- criar dependencias ciclicas entre modal, tabela e hooks;
- introduzir regressao no shell global.

## 8. Impressao

### Situacao auditada

- no frontend legado do Brana Cloud, o botao `Imprime...` da configuracao de Anamnese nao chama fluxo de relatorio nem endpoint dedicado;
- a acao atual exibida no codigo e apenas um `alert` de planejamento;
- no backend da feature de anamnese nao existe rota de impressao;
- no acervo EasyDental local encontrado nesta sessao, a anamnese aparece claramente como cadastro, perguntas, respostas e estruturas de dados; nao foi localizada, neste recorte, uma rotina de impressao de anamnese legivel e diretamente reaproveitavel.

### Conclusao funcional

- a impressao nao deve ser assumida como simples `window.print`;
- nao ha base segura para inventar um contrato de PDF, preview ou endpoint novo nesta etapa;
- a frente futura deve ser tratada como projeto separado, dependente de nova auditoria visual e contratual do fluxo clinico/impressao.

### Diretriz para o React

- manter o botao `Imprime` desabilitado enquanto nao houver contrato confirmado;
- se futuramente a impressao for habilitada, a implementacao deve nascer em componente e servico proprios;
- a primeira versao deve respeitar a ausencia de contrato, sem inserir placeholder funcional enganosamente definitivo.

## 8. Pontos de parada

Interromper a implementacao se:

- o contrato de impressao ainda nao estiver definido;
- houver divergencia entre desktop e backend sobre renumeracao ou exclusao;
- o frontend legado indicar comportamento adicional nao documentado;
- o backend exigir ajuste para suportar o novo fluxo.

## 11. Decisoes pendentes antes da implementacao

- estrategia de impressao;
- comportamento ao excluir pergunta com respostas existentes;
- comportamento ao alterar texto de pergunta ja respondida;
- confirmacao antes de renumerar;
- confirmacao antes de excluir;
- estados e permissao dos botoes;
- significado visual dos tipos de pergunta;
- preservacao da selecao do ultimo questionario.

## 9. Estrategia para nao interferir em outras frentes

- manter tudo isolado na feature de anamnese;
- evitar alterar `App.jsx` alem do roteamento minimo futuro;
- nao tocar em modulos administrativos adjacentes;
- reaproveitar padroes ja consolidados em outras features;
- manter commits pequenos e testeados.

## 10. Resultado esperado

Ao final da primeira onda de implementacao futura, a feature deve:

- abrir no shell atual;
- listar questionarios;
- listar perguntas;
- suportar CRUD basico;
- suportar renumeracao;
- manter isolamento por clinica;
- estar preparada para o fluxo de respostas de paciente e impressao.

## 11. Modal Novo questionario

### Referencia de legado

- o frontend legado exibe um modal de criacao com o titulo `Cria novo questionario de anamnese`;
- o fluxo historico inclui o campo de nome e a opcao de copiar perguntas de outro questionario;
- a documentacao e o backend confirmam o cadastro de questionarios e a possibilidade tecnica de copiar perguntas no `POST /anamnese/questionarios`;
- a copia e uma lacuna funcional de validacao pratica no React atual, nao uma implementacao a ser assumida sem confirmacao visual e contratual completa.

### Campos previstos

- `Nome do questionario`;
- `Copiar do questionario`;
- combo de origem para copia, habilitado somente quando a opcao de copia estiver ativa.

### Estados previstos

- modal fechado;
- modal aberto em criacao;
- foco inicial no campo Nome;
- validacao pendente;
- carregamento de salvamento;
- erro de validacao;
- erro de rede;
- cancelamento;
- sucesso com atualizacao do combo e selecao do novo questionario.

### Validacoes confirmadas

- nome obrigatorio;
- nome trimado antes do envio quando coerente com o contrato atual;
- nao aceitar somente espacos;
- respeitar o limite real de `120` caracteres do model;
- manter acentos e capitalizacao;
- duplicidade bloqueada pela API com `400` e mensagem de negocio;
- o frontend deve preservar a mensagem do backend sem inventar regra adicional.

### Contratos existentes

- `GET /anamnese/questionarios`;
- `POST /anamnese/questionarios`;
- `PUT /anamnese/questionarios/{questionario_id}`;
- `DELETE /anamnese/questionarios/{questionario_id}`;
- `GET /anamnese/questionarios/{questionario_id}/perguntas`;
- o contrato de copia via `POST /anamnese/questionarios` existe no backend atual, mas precisa ser tratado como opcao confirmada somente apos checagem do campo real, do fluxo e do comportamento em falha parcial.

### Situacao da copia

- o backend atual aceita `copiar_do_questionario_id` no payload do POST e copia perguntas do questionario de origem;
- a copia ocorre no mesmo fluxo de criacao do questionario;
- o backend copia apenas perguntas, nao respostas de pacientes nem historico clinico;
- os campos copiados sao `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta` e `ativo`;
- a copia respeita a ordem de origem e tenta preservar os numeros quando possivel;
- nao foi identificado suporte especifico para rollback visual no frontend, apenas a transacao implícita do fluxo de persistencia do backend;
- para o React, a copia deve ser tratada como parte do mesmo modal, mas ainda exige confirmacao de UX antes de ser exposta.

### Riscos

- questionario criado sem copia caso a operacao parcial falhe;
- duplicidade de nome retornada pela API;
- duplicidade de numero ao copiar dados legados com conflitos;
- dependencia de comportamento transacional do backend para evitar inconsistencias;
- nao assumir que o usuario quer copiar perguntas sempre;
- nao copiar respostas, historico ou metadados fora do contrato confirmado.

### Arquitetura modular

- componente visual dedicado do modal;
- hook ou bloco de mutacao separado do componente visual;
- API estendida somente para o contrato existente, sem novos endpoints;
- pagina orquestradora responsavel por atualizar combo e selecao apos sucesso;
- validacao local simples e aderente ao backend;
- mensagens de sucesso e erro no padrao atual do aplicativo.

### Critérios de aceite

- abrir modal em estado limpo;
- campo Nome focado;
- cancelar sem deixar resquicios de estado;
- salvar nome valido;
- tratar duplicidade sem fechar o modal automaticamente;
- atualizar o combo apos sucesso;
- selecionar o novo questionario apos criacao;
- manter o fluxo preparado para a futura decisao sobre copia.

### Decisoes pendentes

- expor ou nao a opcao de copia no primeiro corte do React;
- como apresentar o combo de origem quando a copia estiver ativa;
- se a copia deve ser oferecida apenas com questionarios existentes;
- se a UI deve permitir selecionar o proprio questionario como origem;
- como sinalizar ao usuario a falha parcial de copia, se ocorrer;
- quando e como confirmar o comportamento da copia no shell React.
