# Ficha Pessoal - Adendo de reabertura da comunicacao com o modulo Anamnese

## Objetivo

Corrigir o status da consolidacao anterior da aba `Anamnese` e abrir contrato especifico para a comunicacao entre o modulo/configuracao de Anamnese e a aba Anamnese da `Ficha Pessoal`.

## Correcao de rota

A consolidacao anterior foi prematura. A aba `Anamnese` nao deve ser considerada encerrada nesta fase, porque ainda falta tratar de forma documental a comunicacao entre:

1. o modulo/configuracao de Anamnese, onde questionarios e perguntas sao criados/configurados;
2. a aba Anamnese da `Ficha Pessoal`, onde esses questionarios/perguntas sao usados no paciente.

## Confirmacao do estado atual

- a validacao visual da aba `Anamnese` continua valida;
- a confirmacao local continua valida;
- a persistencia B2 continua valida;
- a integracao ao botao geral `Grava` continua valida;
- o texto temporario `Persistencia B2 ativa.` foi removido;
- o botao temporario `Salvar anamnese` foi removido.

## O que permanece validado

- visual da aba;
- confirmacao local com `Sim`, `Nao` e `Cancelar`;
- persistencia B2 por envelope textual;
- integracao ao botao `Grava`.

## O que ainda falta

A regra de comunicacao entre o modulo/configuracao de Anamnese e a aba Anamnese da `Ficha Pessoal`.

## Diagnostico dos arquivos e funcoes encontrados

### 1. Modulo/configuracao de Anamnese

Arquivo principal de tela/controle:

- [`frontend/app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js)

Namespace/passivo auxiliar:

- [`frontend/js/modules/anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\anamnese.js)

Funcoes frontend que controlam a area de configuracao:

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

Endpoints usados pela area de configuracao:

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{questionario_id}`
- `DELETE /anamnese/questionarios/{questionario_id}`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `POST /anamnese/questionarios/{questionario_id}/perguntas`
- `PUT /anamnese/perguntas/{pergunta_id}`
- `DELETE /anamnese/perguntas/{pergunta_id}`
- `POST /anamnese/questionarios/{questionario_id}/renumerar`

Modelos/tabelas do backend:

- `backend/models/anamnese.py`
  - `AnamneseQuestionario`
  - `AnamnesePergunta`
- `backend/models/anamnese_resposta.py`
  - `AnamneseResposta`

Campos principais observados:

- questionarios: `nome`, `ativo`, `ordem`, `clinica_id`
- perguntas: `questionario_id`, `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta`, `ativo`, `clinica_id`
- respostas: `paciente_id`, `questionario_id`, `pergunta_id`, `resposta`, `clinica_id`

### 2. Aba Anamnese da Ficha Pessoal

Arquivo principal da aba clinica:

- [`frontend/js/modules/ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)

Facades/integração em:

- [`frontend/app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js)

Funcoes frontend que controlam a aba clinica:

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

Endpoints consumidos pela aba clinica:

- `GET /anamnese/questionarios`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `GET /anamnese/pacientes/{paciente_id}/respostas?questionario_id={id}`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

## Respostas objetivas ao contrato

1. O arquivo/tela do modulo de configuracao e [`frontend/app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js), com a tela criada por `anamneseEnsureUI()`.
2. Questionarios sao criados/edidatos/excluidos por `anamneseSalvarQuestionario()`, `anamneseAbrirModalQuestionario()` e `anamneseExcluirQuestionario()`.
3. Perguntas sao criadas/edidatos/excluidas por `anamneseSalvarPergunta()`, `anamneseAbrirModalPergunta()` e `anamneseExcluirPergunta()`.
4. Os endpoints do modulo sao os listados acima, todos sob `/anamnese`.
5. Os modelos sao `AnamneseQuestionario`, `AnamnesePergunta` e `AnamneseResposta`.
6. A aba Anamnese da Ficha Pessoal consome os mesmos dados, mas em fluxo clinico separado.
7. Nao existe duplicidade de fonte de dados no servidor; existe apenas estado local distinto em cada area do frontend.
8. Existe cache local em ambas as areas, mas nao um cache compartilhado entre configuracao e ficha.
9. Ao recarregar a aba Anamnese, o frontend refaz a consulta na fonte atual.
10. Ao alterar pergunta/questionario na configuracao, a aba reflete a mudanca na proxima carga da aba ou na troca de questionario.
11. Respostas antigas continuam vinculadas por `pergunta_id`, nao por texto.
12. Se uma pergunta ja respondida for alterada, a resposta antiga segue vinculada ao mesmo `pergunta_id` enquanto a pergunta existir.
13. Se uma pergunta for removida ou ocultada, o comportamento seguro e nao exibi-la na aba clinica; a persistencia historica deve ser tratada com contrato proprio se houver necessidade de auditoria.
14. Se a ordem das perguntas mudar, a resposta continua vinculada por `pergunta_id`.
15. A persistencia B2 salva `pergunta_id` suficiente para sobreviver a mudancas de ordem e texto.
16. O `questionario_id` salvo no envelope B2 e suficiente como contexto adicional, mas nao substitui `pergunta_id`.
17. O frontend da Ficha Pessoal recarrega questionarios/perguntas quando a aba e aberta ou quando o questionario muda.
18. Nao existe necessidade de evento global nesta fase.
19. Nao existe necessidade de backend novo nesta fase.
20. Nao existe necessidade de alteracao de banco nesta fase.
21. O menor ajuste seguro, caso seja necessario evoluir a comunicacao, e o refresh controlado na abertura da aba ou na troca de questionario.
22. Se a sincronizacao precisar ser imediata entre telas abertas ao mesmo tempo, ai sim um contrato posterior podera avaliar invalidez simples ou evento leve.
23. Se a comunicacao nao for cuidada, o risco e exibir dados estaveis mas desatualizados ate a proxima recarga da aba.

## Analise das opcoes

### FICHA-ANAM-COMUNIC-A

Confirmar apenas o vinculo atual.

Situacao:
- a aba clinica ja consome os dados atuais e recarrega por leitura de fonte na abertura/troca de questionario;
- e uma opcao valida apenas se o objetivo for documentar que nao ha bug real neste momento.

### FICHA-ANAM-COMUNIC-B

Refresh controlado ao abrir a aba ou trocar questionario.

Situacao:
- corresponde melhor ao comportamento existente e ao menor ajuste seguro;
- nao exige evento global nem backend novo;
- e a melhor base se houver necessidade de reforcar a comunicacao entre configuracao e ficha.

### FICHA-ANAM-COMUNIC-C

InvalidaÃ§Ã£o simples apos alteracao no modulo Anamnese.

Situacao:
- so vale se for necessario sinalizar alteracoes feitas no cadastro/configuracao para a aba clinica sem depender apenas do reload manual;
- aumenta um pouco a complexidade frontend.

### FICHA-ANAM-COMUNIC-D

Integracao mais ampla entre modulos.

Situacao:
- nao recomendada nesta fase;
- seria excesso para o problema identificado;
- aumenta o risco de regressao global.

## Decisao recomendada

`FICHA-ANAM-COMUNIC-B`

Motivo:
- e o menor ajuste seguro;
- esta alinhada ao comportamento atual do sistema;
- evita evento global;
- evita backend novo;
- preserva o fluxo clinico existente.

## Escopo permitido da proxima implementacao

- ajustes apenas na comunicacao de refresh entre configuracao e aba clinica, se o usuario pedir;
- eventualmente reforcar a recarga da aba ao abrir ou ao trocar questionario;
- manter a persistencia B2;
- manter o fluxo do botao `Grava`;
- manter a confirmacao local.

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

## Riscos

- dados da aba clinica ficarem desatualizados ate a proxima recarga;
- confusao entre configuracao e consumo se a fonte nao for recarregada no momento correto;
- regressao se a sincronizacao for tentada por evento global sem necessidade;
- duplicacao desnecessaria de cache se for criada uma segunda fonte local sem invalidacao clara.

## Onde testar futuramente

- abrir o modulo de configuracao de Anamnese;
- criar/renomear/reordenar uma pergunta;
- voltar para a aba `Anamnese` na `Ficha Pessoal`;
- recarregar a aba e confirmar a leitura da fonte atual;
- trocar de questionario;
- validar que respostas continuam vinculadas por `pergunta_id`;
- testar comportamento com pergunta desativada/removida em contrato futuro, se for criado.

