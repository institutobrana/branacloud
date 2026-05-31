# Ficha Pessoal - Anamnese - Contrato manual EasyDental para o fluxo de configuracao e clinica

## Objetivo

Abrir contrato especifico, com base nos pontos funcionais fornecidos pelo usuario e no acervo local do projeto, para alinhar o fluxo da Anamnese entre:

1. o modulo de configuracao de Anamnese;
2. a aba `Anamnese` da `Ficha Pessoal`.

## Correcao de rota

A leitura documental anterior sobre a Anamnese ficou ampla demais em comunicacao/refresh entre modulos. O manual EasyDental, conforme os pontos informados pelo usuario, pede um recorte mais preciso:

- questionarios e perguntas sao configurados no modulo de configuracao;
- a aba clinica usa esse cadastro no paciente;
- `tipo_pergunta`, `tipo_resposta`, mensagem critica e alertas fazem parte do contrato funcional;
- o questionario `Principal` e a referencia base de entrada;
- a copia de perguntas entre questionarios faz parte do fluxo;
- a impressao de questionario em branco existe como necessidade funcional do legado.

## Confirmacao do estado atual

- a aba `Anamnese` da `Ficha Pessoal` continua aberta;
- a validacao visual continua valida;
- a confirmacao local continua valida;
- a persistencia B2 continua valida;
- a integracao ao botao geral `Grava` continua valida;
- o texto temporario `Persistencia B2 ativa.` foi removido;
- o botao temporario `Salvar anamnese` foi removido.

## O que permanece validado

- visual da aba;
- confirmacao local com `Sim`, `Nao` e `Cancelar`;
- persistencia B2 por envelope textual;
- integracao ao botao `Grava`;
- carregamento de questionarios e perguntas pelo fluxo atual;
- vinculo de respostas por paciente, questionario e pergunta.

## O manual EasyDental exige, segundo os pontos fornecidos

- fluxo `Configuracao -> Anamnese` e `Ficha Pessoal -> Anamnese`;
- questionario `Principal` como referencia inicial;
- suporte a ate 255 questionarios;
- suporte a ate 255 perguntas por questionario;
- uso de `tipo_pergunta`;
- uso de `tipo_resposta`;
- mensagens criticas e alertas por pergunta;
- copia de perguntas entre questionarios;
- impressao de questionario em branco;
- separacao clara entre cadastro/configuracao e uso clinico.

## O que foi encontrado no codigo do Brana Cloud

### 1. Modulo de configuracao de Anamnese

Arquivo principal:

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js)

Namespace auxiliar:

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\anamnese.js)

Funcoes relevantes:

- `anamneseEnsureUI()`
- `anamneseRender()`
- `anamneseSelecionado()`
- `anamneseQuestionarioSelecionado()`
- `anamneseRenderComboCopiarQuestionario()`
- `anamneseAtualizarEstadoCopiarQuestionario()`
- `anamneseRenderQuestionarios()`
- `anamneseCarregarQuestionarios()`
- `anamneseCarregarPerguntas()`
- `anamneseAbrirModalQuestionario()`
- `anamneseSalvarQuestionario()`
- `anamneseAbrirModalPergunta()`
- `anamneseSalvarPergunta()`
- `anamneseExcluirQuestionario()`
- `anamneseExcluirPergunta()`
- `anamneseRenumeraPerguntas()`
- `anamneseVincularEventos()`
- `anamneseAbrir()`

Endpoints usados:

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{questionario_id}`
- `DELETE /anamnese/questionarios/{questionario_id}`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `POST /anamnese/questionarios/{questionario_id}/perguntas`
- `PUT /anamnese/perguntas/{pergunta_id}`
- `DELETE /anamnese/perguntas/{pergunta_id}`
- `POST /anamnese/questionarios/{questionario_id}/renumerar`

### 2. Aba clinica de Anamnese

Arquivo principal:

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)

Facade / integracao:

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js)

Funcoes relevantes:

- `fichaAnamneseCarregarQuestionarios()`
- `fichaAnamneseSelecionarQuestionario()`
- `fichaAnamneseCarregar()`
- `fichaAnamneseSalvarPendentes()`
- `fichaAnamneseTemAlteracoesPendentes()`
- `fichaAnamneseAba.beforeAbandonar()`
- `fichaAnamneseAba.beforeSetTab()`
- `fichaAnamneseAba.onPacienteAplicado()`
- `fichaAnamneseAba.onLimparNovo()`
- `fichaAnamneseAba.bind()`
- `fichaAnamneseAba.carregarQuestionarios()`
- `fichaAnamneseAba.carregarPerguntas()`
- `fichaAnamneseAba.salvarAnamneseAtual()`

Endpoints consumidos:

- `GET /anamnese/questionarios`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `GET /anamnese/pacientes/{paciente_id}/respostas?questionario_id={id}`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

### 3. Modelos e campos observados

Backend:

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\anamnese.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\models\anamnese.py)
- [`D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\anamnese_resposta.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\models\anamnese_resposta.py)

Campos principais:

- questionarios: `nome`, `ativo`, `ordem`, `clinica_id`
- perguntas: `questionario_id`, `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta`, `ativo`, `clinica_id`
- respostas: `paciente_id`, `questionario_id`, `pergunta_id`, `resposta`, `clinica_id`

## Campos hoje consumidos pela aba clinica

- o combo de questionarios e carregado;
- a lista de perguntas e carregada;
- o paciente atual e exibido no cabecalho;
- as respostas sao lidas e salvas pelo contrato B2;
- o controle visual atual mostra `Sim` / `Nao` e complemento;
- `tipo_resposta` e `mensagem_alerta` existem no backend, mas a aba clinica ainda nao foi comprovada como dependente deles para o desenho visual completo.

## Lacunas encontradas

- nao foi comprovada, nesta leitura, uma equivalencia visual 1:1 com o EasyDental;
- nao foi comprovado o uso clinico completo de `tipo_resposta` para decidir o controle exibido;
- nao foi comprovado o uso clinico efetivo de `mensagem_alerta` como alerta per-question;
- nao foi comprovada a impressao de questionario em branco no fluxo clinico;
- o questionario `Principal` existe como seed base, mas a variante de 35 perguntas do manual continua em analise;
- a comunicacao entre configuracao e tela clinica ainda depende de recarga e troca de aba/questionario, sem evento compartilhado amplo.

## Comparacao EasyDental x Brana Cloud

### EasyDental, segundo os pontos fornecidos

- configuracao e uso clinico bem definidos;
- questionario `Principal` como referencia inicial;
- muitos questionarios e muitas perguntas;
- uso de `tipo_pergunta` e `tipo_resposta`;
- alerta critico e mensagem de alerta por pergunta;
- copia de perguntas;
- impressao de questionario em branco.

### Brana Cloud, neste momento

- configuracao e uso clinico existem, mas a equivalencia funcional ainda nao foi provada em todos os pontos;
- o backend possui o contrato de questionarios, perguntas e respostas;
- a aba clinica carrega perguntas e respostas e usa persistencia B2;
- a configuracao permite CRUD e copia de perguntas;
- `tipo_resposta` e `mensagem_alerta` existem no modelo, mas ainda nao foram provados como usados clinicamente no mesmo nivel do manual;
- `Principal` existe como seed base, mas a serie completa do manual permanece em audicao/validacao documental;
- a impressao em branco nao foi comprovada como equivalente ao legado;
- nao foi comprovado, nesta leitura, o suporte pratico a 255 questionarios e 255 perguntas por questionario no fluxo clinico exibido.

## Analise das opcoes

### FICHA-ANAM-MANUAL-A

Confirmar apenas a comunicacao atual entre configuracao e aba clinica.

Situacao:
- valida o vinculo basico;
- nao fecha a leitura do manual;
- e util como fotografia, mas nao como alinhamento funcional mais rico.

### FICHA-ANAM-MANUAL-B

Fazer a aba clinica respeitar `tipo_resposta` como menor ajuste seguro.

Situacao:
- e o proximo passo mais conservador para aproximar a tela do manual;
- nao exige backend novo nem banco novo;
- prepara o terreno para diferenciar o que a pergunta pede na interface clinica.

### FICHA-ANAM-MANUAL-C

Adicionar uso clinico de `mensagem_alerta` e questoes criticas.

Situacao:
- pode vir depois de B;
- aumenta a fidelidade ao manual;
- precisa de criterios claros para nao confundir alertas de preferencia com alertas de pergunta.

### FICHA-ANAM-MANUAL-D

Integrar preferencias/odontograma ao fluxo clinico.

Situacao:
- existe base de preferencias no projeto;
- o uso clinico ainda nao foi comprovado nesta leitura;
- e um passo posterior, nao o primeiro.

### FICHA-ANAM-MANUAL-E

Rever/adequar o seed `Principal` e a variante de maior cobertura documental.

Situacao:
- deve ser tratado como frente separada;
- o seed atual valido possui 17 perguntas;
- a variante de 35 perguntas permanece em analise e nao deve ser misturada com a evolucao de UI.

## Decisao recomendada

`FICHA-ANAM-MANUAL-B`

Motivo:

- e o menor ajuste seguro que aproxima a tela clinica do manual;
- respeita a estrutura atual do backend e do frontend;
- nao exige backend novo, banco novo ou evento global;
- permite tratar `tipo_resposta` antes de avanços mais delicados como mensagens criticas e impressao.

## Escopo permitido da proxima implementacao

- ajustar a aba clinica para respeitar `tipo_resposta` no desenho da resposta exibida;
- manter o contrato B2 atual de persistencia;
- manter o botao `Grava`;
- manter a confirmacao local;
- manter o recarregamento ao abrir a aba ou trocar questionario;
- reforcar a leitura do questionario atual quando necessario.

## Escopo proibido da proxima implementacao

- backend novo;
- banco novo;
- migrations;
- endpoints novos;
- `.env`;
- `requestJson` novo;
- payload novo;
- mudanca no formato de salvamento;
- exclusao;
- permissoes;
- reescrita de historico;
- evento global amplo sem contrato;
- correcoes textuais/mojibake fora do escopo.

## Riscos registrados

- ficar apenas com refresh e nao refletir o manual;
- tratar `tipo_resposta` de forma incorreta e quebrar a leitura clinica;
- misturar alerta de pergunta com alerta de preferencia;
- ampliar demais o escopo e reabrir risco de regressao global;
- tentar resolver UI, persistencia e manual no mesmo passo.

## Plano da proxima subetapa

1. Se houver autorizacao para evoluir a Anamnese, partir de `FICHA-ANAM-MANUAL-B`.
2. Ajustar a aba clinica para respeitar `tipo_resposta`.
3. Manter o contrato B2 de persistencia.
4. Validar se o questionario `Principal` esta aparecendo corretamente como base.
5. So depois abrir contrato separado para `mensagem_alerta` e questoes criticas, se necessario.

## Onde testar depois

- abrir o modulo de configuracao de Anamnese;
- criar, renomear, reordenar ou copiar uma pergunta/questionario;
- voltar para a aba `Anamnese` da `Ficha Pessoal`;
- recarregar a aba e confirmar o questionario atual;
- validar se o tipo de resposta esperado esta sendo respeitado;
- confirmar que as respostas continuam vinculadas por `pergunta_id`;
- validar se `Principal` continua como base de entrada;
- se necessario, testar impressao em branco em contrato futuro especifico.

## Observacao final

O PDF do manual EasyDental nao estava acessivel localmente nesta sessao. Este contrato foi montado com os pontos funcionais fornecidos pelo usuario e com os artefatos locais do projeto, sem inventar comprovacao direta que nao foi encontrada no workspace.
