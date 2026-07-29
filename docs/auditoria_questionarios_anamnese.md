# Auditoria tecnica, funcional e documental do modulo Anamnese

## 1. Escopo

Auditoria somente leitura do modulo Anamnese do Brana Cloud, com foco em:

- backend;
- frontend legado;
- modelos e contratos persistentes;
- dependencia com pacientes e respostas;
- comparacao com o legado desktop EasyDental;
- lacunas para a futura implementacao no frontend React.

Nao houve alteracao de codigo, banco, migrations, seeds, endpoints ou arquivos do desktop.

## 2. Ambiente e rastreabilidade

- Diretorio de trabalho: `D:/BRANA ARQUIVOS/BRANA CLOUD`
- Branch inicial: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- HEAD inicial: `c972e40935fe41d305022c4a33a8f8a3f1e665f2`

Estado inicial do Git:

- `git status --short`: worktree sujo por varias frentes ja em andamento
- `git status --branch`: branch atual `modularizacao-segura-fase-1`
- `git diff --stat`: havia alteracoes preexistentes em varios arquivos de frontend, backend e docs
- `git diff --cached --stat`: stage vazio

## 3. Documentacao preexistente consultada

Documentos consultados e considerados relevantes:

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/auditoria_anamnese_sqlserver_restauracao_untracked.md`
- `docs/auditoria_especifica_pendencias_anamnese.md`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`

Conclusao documental:

- existe historico amplo sobre Anamnese;
- o material historico e util como contexto, mas nao substitui a leitura do codigo atual;
- nao foi encontrado um documento unico e final que consolide a frente futura de React para o modulo.

## 4. Arquivos do Brana Cloud auditados

### Backend

- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `backend/routes/anamnese_routes.py`
- `backend/services/signup_service.py`
- `backend/services/runtime_bootstrap_service.py`
- `backend/services/schema_deployment/compatibility.py`
- `backend/security/permissions.py`
- `backend/main.py`

### Frontend legado

- `frontend/app.js`

### Referencias de inventario e apoio

- `backend/estrutura_eds70.txt`
- `backend/estrutura_precificacao.txt`
- `backend/estrutura_util.txt`

## 5. Visao funcional confirmada

No codigo atual, Anamnese e um modulo de configuracao e consulta de questionarios, perguntas e respostas de pacientes.

Na pratica, a tela legada opera assim:

- carrega questionarios da clinica autenticada;
- carrega perguntas do questionario selecionado;
- permite criar, editar e excluir questionarios;
- permite criar, editar e excluir perguntas;
- permite renumerar perguntas;
- permite ler e gravar respostas de paciente;
- ainda nao possui fluxo de impressao implementado, apenas placeholder de UI.

No frontend legado, o panel foi identificado como `anamnese-panel` e o titulo e `Configura questionarios de anamnese`.

## 6. Banco de dados identificado

### `anamnese_questionarios`

Fonte: `backend/models/anamnese.py`

- finalidade: cadastro de questionarios;
- colunas:
  - `id` inteiro, PK;
  - `clinica_id` inteiro, FK para `clinicas.id`, nao nulo;
  - `nome` string(120), nao nulo;
  - `ativo` boolean, nao nulo, default `True`;
  - `ordem` inteiro, nao nulo, default `1`;
  - `criado_em` datetime timezone, nao nulo, default `now`;
  - `atualizado_em` datetime timezone, nao nulo, default `now` com update automatico;
- indice/chaves:
  - PK em `id`;
  - unique `uq_anamnese_questionario_clinica_nome` em `(clinica_id, nome)`;
  - indice em `clinica_id` e `id` via `index=True`;
- relacao:
  - possui varias perguntas;
- regra de exclusao:
  - no backend, exclusao e bloqueada se ainda existirem perguntas vinculadas;
- tenant:
  - toda operacao e filtrada por `clinica_id` do usuario autenticado.

### `anamnese_perguntas`

Fonte: `backend/models/anamnese.py`

- finalidade: cadastro de perguntas do questionario;
- colunas:
  - `id` inteiro, PK;
  - `clinica_id` inteiro, FK para `clinicas.id`, nao nulo;
  - `questionario_id` inteiro, FK para `anamnese_questionarios.id`, nao nulo;
  - `numero` inteiro, nao nulo;
  - `tipo_pergunta` inteiro, nao nulo, default `1`;
  - `tipo_resposta` inteiro, nao nulo, default `1`;
  - `texto` string(400), nao nulo;
  - `mensagem_alerta` string(255), nulo;
  - `ativo` boolean, nao nulo, default `True`;
  - `criado_em` datetime timezone, nao nulo, default `now`;
  - `atualizado_em` datetime timezone, nao nulo, default `now` com update automatico;
- indice/chaves:
  - PK em `id`;
  - unique `uq_anamnese_pergunta_clinica_questionario_numero` em `(clinica_id, questionario_id, numero)`;
  - indice em `clinica_id`, `questionario_id` e `id`;
- relacao:
  - pertence a um questionario;
- tenant:
  - todas as leituras e escritas respeitam `clinica_id`.

### `anamnese_respostas`

Fonte: `backend/models/anamnese_resposta.py`

- finalidade: respostas de paciente para perguntas de anamnese;
- colunas:
  - `id` inteiro, PK;
  - `clinica_id` inteiro, FK para `clinicas.id`, nao nulo;
  - `paciente_id` inteiro, FK para `pacientes.id`, nao nulo;
  - `questionario_id` inteiro, FK para `anamnese_questionarios.id`, nao nulo;
  - `pergunta_id` inteiro, FK para `anamnese_perguntas.id`, nao nulo;
  - `resposta` text, nulo;
  - `atualizado_em` datetime timezone, nao nulo, default `now` com update automatico;
- indice/chaves:
  - PK em `id`;
  - unique `uq_anamnese_resposta_clinica_paciente_pergunta` em `(clinica_id, paciente_id, pergunta_id)`;
- relacao:
  - vincula paciente, questionario e pergunta;
- tenant:
  - gravacao e leitura filtradas por `clinica_id`.

## 7. Backend: endpoints identificados

Arquivo principal: `backend/routes/anamnese_routes.py`

Todos os endpoints abaixo exigem autenticacao via `get_current_user` e permissao via `require_module_access("anamnese")`.

### Questionarios

- `GET /anamnese/questionarios`
  - lista questionarios da clinica ordenados por `ordem` e `nome`;
  - resposta: lista com `id`, `nome`, `ativo`, `ordem`.

- `POST /anamnese/questionarios`
  - cria questionario;
  - valida nome nao vazio;
  - bloqueia nome duplicado na mesma clinica;
  - pode copiar perguntas de outro questionario da mesma clinica.

- `PUT /anamnese/questionarios/{questionario_id}`
  - atualiza questionario;
  - valida nome nao vazio;
  - bloqueia duplicidade de nome na clinica.

- `DELETE /anamnese/questionarios/{questionario_id}`
  - exclui questionario;
  - retorna `409` se ainda houver perguntas vinculadas.

### Perguntas

- `GET /anamnese/questionarios/{questionario_id}/perguntas`
  - lista perguntas do questionario por `numero` e `id`.

- `POST /anamnese/questionarios/{questionario_id}/perguntas`
  - cria pergunta;
  - valida texto nao vazio;
  - valida `tipo_pergunta` e `tipo_resposta` em `1, 2, 3`;
  - se numero nao for informado, usa `max(numero) + 1`.

- `PUT /anamnese/perguntas/{pergunta_id}`
  - atualiza pergunta;
  - valida texto nao vazio;
  - valida numero maior que zero;
  - bloqueia numero duplicado no mesmo questionario.

- `DELETE /anamnese/perguntas/{pergunta_id}`
  - exclui pergunta.

- `POST /anamnese/questionarios/{questionario_id}/renumerar`
  - renumera perguntas na ordem atual da consulta;
  - reescreve os numeros sequencialmente a partir de 1.

### Respostas

- `GET /anamnese/pacientes/{paciente_id}/respostas`
  - lista respostas de um paciente;
  - aceita `questionario_id` por query param;
  - se nao for informado, usa o primeiro questionario da clinica por `ordem`.

- `PUT /anamnese/pacientes/{paciente_id}/respostas`
  - cria/atualiza resposta de uma pergunta;
  - se resposta vier vazia, remove o registro existente.

## 8. Frontend legado: funcionamento confirmado

Arquivo principal: `frontend/app.js`

### Ciclo de tela

- a tela e aberta pela funcao `anamneseAbrir()`;
- a interface eh criada em `anamneseEnsureUI()`;
- os eventos sao ligados em `anamneseVincularEventos()`;
- o panel e mostrado e o workspace vazio e ocultado;
- depois sao carregados questionarios e perguntas.

### Combo de questionarios

- fonte: `GET /anamnese/questionarios`;
- ao carregar, se houver registros o primeiro pode ser selecionado por padrao quando a selecao atual nao existir mais;
- se nao houver registros, o combo mostra `Sem questionario`.

### Lista de perguntas

- fonte: `GET /anamnese/questionarios/{id}/perguntas`;
- a grade mostra `numero` e `texto`;
- a primeira linha passa a ser a selecionada apos carregamento;
- duplo clique em uma linha abre edicao da pergunta.

### Botoes

- `Novo...` questionario: abre modal de cadastro;
- `Altera...` questionario: exige selecao;
- `Elimina`: confirma antes de chamar DELETE;
- `Imprime...`: ainda e placeholder, com alerta de que esta em planejamento;
- `Nova pergunta...`: abre modal de pergunta;
- `Altera...` da pergunta: exige selecao;
- `Elimina` da pergunta: confirma antes de chamar DELETE;
- `1,2... Renumera perguntas`: chama o endpoint de renumeracao.

### Modais

- modal de questionario:
  - nome;
  - opcao de copiar perguntas de outro questionario;
  - esse comportamento e desabilitado em edicao;
- modal de pergunta:
  - numero;
  - tipo de pergunta;
  - tipo de resposta;
  - texto;
  - mensagem de alerta.

### Regras observadas no frontend

- nome de questionario e texto de pergunta sao trimados antes do envio;
- numero de pergunta invalido bloqueia o salvamento;
- exclusao de questionario/pregunta exige confirmacao;
- impressao ainda nao tem fluxo funcional.

## 9. Regras confirmadas

### Questionarios

- nome obrigatorio: sim;
- duplicidade de nome na mesma clinica: nao permitida;
- limite de caracteres: o model usa `String(120)` para nome;
- codigo interno: nao localizado;
- status ativo/inativo: existe;
- questionario padrao: o seed da signup usa `Principal` como padrao;
- exclusao com perguntas: bloqueada;
- exclusao logica: o codigo atual mostra exclusao fisica no registro;
- isolamento por clinica: sim;
- ordenacao: por `ordem` e `nome`.

### Perguntas

- texto obrigatorio: sim;
- limite de caracteres: `String(400)`;
- numero informado ou gerado automaticamente: ambos;
- numeros repetidos: nao permitidos no mesmo questionario;
- lacunas: permitidas, mas a renumeracao corrige a sequencia;
- ordem: o backend e o frontend usam `numero`;
- tipo de resposta: existe (`1, 2, 3`);
- resposta textual: sim, armazenada em `anamnese_respostas.resposta`;
- observacao/mensagem: existe `mensagem_alerta`;
- exclusao logica: nao localizada;
- pergunta respondida pode ser alterada/excluida: o codigo nao bloqueia explicitamente;
- texto copiado para historico: nao confirmado.

### Tipos de pergunta e resposta

- o backend valida os codigos `1`, `2` e `3`;
- o significado visual ou funcional de cada codigo nao foi localizado no codigo atual;
- qualquer interpretacao mais especifica ainda depende de decisao de produto ou de outra fonte tecnica.

### Renumeracao

- renumera todas as perguntas do questionario;
- respeita a ordem atual da consulta ordenada por `numero`, depois `id`;
- usa incremento sequencial de 1;
- nao foi localizado `rollback` transacional explicitado;
- afeta somente a coluna `numero`, nao a chave de resposta;
- risco principal: impactar integridade de contratos antigos que assumam numero como referencia humana.

### Impressao

- o que e impresso: nao localizado;
- preview: nao localizado;
- endpoint dedicado: nao localizado;
- botao no frontend legado: confirmado como placeholder;
- reutilizacao futura: pendente de definicao.

## 10. Dependencias e impactos

Confirmado por busca reversa:

- `frontend/app.js` usa o modulo para abrir a tela e operar a lista;
- `backend/security/permissions.py` classifica o modulo `anamnese`;
- `backend/services/signup_service.py` garante seeds obrigatorios de anamnese;
- `backend/services/runtime_bootstrap_service.py` chama a garantia de seed na inicializacao;
- `backend/services/schema_deployment/compatibility.py` aplica compatibilidade de schema para `anamnese_perguntas`;
- `backend/routes/cid_routes.py` e `backend/routes/medicamentos_routes.py` tambem dependem da permissao `anamnese`;
- o backend possui scripts de migracao, backfill e importacao de anamnese.

Impactos mapeados:

- pacientes: sim, via `anamnese_respostas`;
- prontuario/ficha: sim, o frontend legado usa a tela de ficha pessoal/anamnese;
- atendimento/consulta: dependencia indireta, nao confirmada como persistencia direta neste recorte;
- frontend React: ha apenas menu desabilitado e contrato ainda ausente.

## 11. EasyDental Desktop

Confirmado somente o que foi possivel localizar no filesystem de `Y:/EDS70`:

- arquivos de dados/artefatos `ANAMNESE_PERG.raw` e `ANAMNESE_QUEST.raw`;
- logs `ANAMNESE_PERG.log` e `ANAMNESE_QUEST.log`;
- bitmaps e icones de anamnese, como `ico_dedoanamnese.bmp`;
- referencias de estrutura em `backend/estrutura_eds70.txt`.

Limite da validacao:

- nao foi possivel abrir aqui os arquivos binarios/execucoes do desktop para inspecionar fluxo visual completo;
- os nomes encontrados confirmam a existencia do modulo, mas nao substituem a leitura funcional do aplicativo desktop em execucao.

## 12. Diferenças e lacunas para o React

Confirmado:

- o backend ja expoe um contrato util para questionarios, perguntas e respostas;
- o frontend legado possui toda a operacao basica;
- o React atual ainda nao possui tela funcional para o modulo, apenas entradas de menu desabilitadas.

Lacunas:

- impressao;
- contrato de contrato de visualizacao/preview;
- shell visual futuro em L com toolbar modular;
- testes de contrato e de interface para o novo frontend;
- especificacao formal da experiencia de copia de questionario e do fluxo de renumeracao.

## 13. Riscos encontrados

- exclusao de questionario pode falhar se houver perguntas vinculadas;
- renumeracao reescreve numeros e pode afetar referencias externas que usem numero como chave humana;
- o fluxo de impressao ainda e um placeholder no frontend legado;
- a validacao de resposta textual e permissiva e nao determina semantica do conteudo;
- o desktop foi confirmado apenas por inventario de arquivos, nao por execucao interativa.

## 14. Decisoes pendentes antes da implementacao

- estrategia de impressao;
- comportamento ao excluir pergunta com respostas existentes;
- comportamento ao alterar texto de pergunta ja respondida;
- confirmacao antes de renumerar;
- confirmacao antes de excluir;
- estados e permissao dos botoes;
- significado visual dos tipos de pergunta;
- necessidade de preservar a selecao do ultimo questionario.

## 15. Conclusao

O modulo Anamnese existe de forma funcional no backend e no frontend legado, com base persistente clara para questionarios, perguntas e respostas. O React ainda nao oferece a implementacao; portanto, a futura frente precisa de uma tela modular, contrato de impressao e criterio claro para renumeracao e exclusao.
