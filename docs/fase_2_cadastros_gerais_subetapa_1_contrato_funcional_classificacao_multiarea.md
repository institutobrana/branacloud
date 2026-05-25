# Fase 2 - Cadastros Gerais - Subetapa 1 - Contrato funcional e classificacao multiarea

## Contexto
Esta subetapa abre a frente `Cadastros Gerais` de forma estritamente documental.

O objetivo desta etapa e consolidar o contrato funcional inicial da frente, registrar o mapa de telas/menus que o usuario realmente ve, e classificar a frente quanto ao alcance multiarea, sem qualquer alteracao de codigo.

Este recorte segue o padrao conservador da Fase 2: primeiro documentar, depois separar fronteiras, e somente em etapa futura avaliar qualquer recorte tecnico.

## Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_preferencias_opcoes_subetapa_9_consolidacao_pausa_recomendacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/procedimentos_genericos_subetapa_5b_fixtures_payload_pgenpayloadfromstate.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## Confirmacao da frente anterior pausada
A frente `Preferencias e Opcoes do Sistema` foi documentada como pausada/consolidada na Subetapa 9.

Esta subetapa apenas respeita essa decisao e inicia a proxima frente recomendada pelo roadmap: `Cadastros Gerais`.

## Justificativa para iniciar Cadastros Gerais
O inventario geral do sistema mostra que `Cadastros Gerais` nao e um unico modulo isolado, mas um agrupamento funcional que concentra telas, menus e rotas misturadas entre:

- tabelas auxiliares;
- grupos e categorias;
- simbolos graficos;
- unidades de atendimento;
- CID;
- pacientes;
- procedimentos genericos;
- partes de configuracao e tabelas auxiliares;
- outros cadastros adjacentes que aparecem no mesmo bloco de navegacao do usuario.

O backend confirma essa mistura em `backend/routes/cadastros_routes.py`, que agrega dominios diferentes sob um unico arquivo.

## Nomes e telas que o usuario realmente ve
O usuario nao ve um rotulo unico chamado `Cadastros Gerais` como tela separada. O agrupamento aparece distribuido em menus e acoes visiveis.

As entradas visiveis mais relevantes sao:

- `Novo paciente...`
- `Abre paciente...`
- `Fecha paciente...`
- `Ficha pessoal...`
- `Ficha rapida...`
- `Ficha de anamnese...`
- `Ficha de historico...`
- `Dados complementares...`
- `Controle de retornos...`
- `Restricoes terapeuticas...`
- `Medicamentos...`
- `Convênios e planos...`
- `Controle de estoque...`
- `Controle de proteticos...`
- `Prestadores...`
- `Unidades de atendimento...`
- `Tabelas auxiliares...`
- `Intervencoes / Procedimentos...`
- `Servicos de protetico...`
- `Doencas (CID)...`
- `Procedimentos genericos...`
- `Simbolos graficos...`
- `Anamnese...`
- `Plano de contas...`
- `Agendas...`
- `Etiquetas...`
- `Preferencias...`
- `Opcoes do sistema...`

Entradas adjacentes que tambem ajudam a compor o bloco documental ampliado:

- `Pesquisa pacientes...`
- `Conta corrente do paciente...`
- `Conectar-se ao sistema...`
- `Desconectar-se do sistema...`
- `Sair do sistema`

## Mapa inicial de responsabilidades

### Auxiliares e tabelas auxiliares
- Visivel para o usuario como `Tabelas auxiliares...`
- Frontend relacionado: `aux`
- Modulo existente: `frontend/js/modules/auxiliares.js`
- Backend relacionado: `GET/POST/PUT/DELETE /cadastros/auxiliares*`
- Dependencia: `configuracao`
- Leitura tecnica: dominio comum/core, com uso transversal em outros fluxos

### Grupos e categorias
- Visivel para o usuario como parte do bloco de cadastro/configuracao de classificacoes
- Frontend relacionado: uso de `plano`
- Backend relacionado: `GET/POST/PUT/DELETE /cadastros/grupos*` e `/cadastros/categorias*`
- Dependencia: `financeiro`
- Leitura tecnica: dominio comum/core, mas instalado dentro de um arquivo de cadastros

### Simbolos graficos
- Visivel para o usuario como `Simbolos graficos...`
- Frontend relacionado: `simbolos`
- Modulo existente: `frontend/js/modules/simbolos-graficos.js`
- Backend relacionado: `GET/POST/PUT/DELETE /cadastros/simbolos-graficos`
- Dependencia: `procedimentos`
- Leitura tecnica: misto, com forte inclinacao odontologica

### Unidades de atendimento
- Visivel para o usuario como `Unidades de atendimento...`
- Frontend relacionado: `unidade`
- Modulo existente: `frontend/js/modules/unidades.js`
- Backend relacionado: `GET/POST/PUT/DELETE /cadastros/unidades-atendimento*`
- Leitura tecnica: comum/core, com uso transversal em agenda, usuarios e prestadores

### CID
- Visivel para o usuario como `Doencas (CID)...`
- Frontend relacionado: `cid`
- Modulo existente: `frontend/js/modules/cid.js`
- Backend relacionado: `/cid`
- Leitura tecnica: dependente de subdominio clinico, com uso transversal em documentos e cadastro

### Pacientes
- Visivel para o usuario como `Novo paciente...`, `Abre paciente...`, `Fecha paciente...`, `Ficha pessoal...`, `Ficha rapida...`, `Ficha de anamnese...`, `Ficha de historico...`, `Dados complementares...`
- Frontend relacionado: `ficha`
- Backend relacionado: `/cadastros/pacientes*`, incluindo menu, navegacao e proximo codigo
- Dependencia: `procedimentos`
- Leitura tecnica: misto, com forte peso clinico e transacional

### Procedimentos genericos
- Visivel para o usuario como `Procedimentos genericos...`
- Frontend relacionado: `pgen`
- Modulo existente: `frontend/js/modules/procedimentos-genericos.js`
- Backend relacionado: `/cadastros/procedimentos-genericos*`
- Dependencia: `procedimentos`
- Leitura tecnica: misto, com peso odontologico e impacto em seed/contrato

### Plano de contas
- Visivel para o usuario como `Plano de contas...`
- Frontend relacionado: `plano`
- Modulo existente: `frontend/js/modules/plano-contas.js`
- Backend relacionado: grupos e categorias no proprio `cadastros_routes.py`
- Dependencia: `financeiro`
- Leitura tecnica: misto, com base comum financeira

### Medicamentos
- Visivel para o usuario como `Medicamentos...`
- Frontend relacionado: `medicamentos`
- Modulo existente: `frontend/js/modules/medicamentos.js`
- Backend relacionado: `/medicamentos`
- Leitura tecnica: adjacente ao bloco de cadastros e ao fluxo clinico

### Prestadores
- Visivel para o usuario como `Prestadores...`
- Frontend relacionado: `prest`
- Modulo existente: `frontend/js/modules/prestadores.js`
- Backend relacionado: `/cadastros/prestadores*`
- Leitura tecnica: misto, com conexao com agenda, convenios e usuarios

### Convenios e planos
- Visivel para o usuario como `Convênios e planos...`
- Frontend relacionado: `convPlan`
- Modulo existente: `frontend/js/modules/convenios-planos.js`
- Backend relacionado: `/cadastros/convenios-planos*`
- Dependencia: `configuracao`
- Leitura tecnica: misto, com conexoes com pacientes, agenda e financeiro

### Anamnese
- Visivel para o usuario como `Anamnese...`
- Frontend relacionado: `anamnese`
- Modulo existente: `frontend/js/modules/anamnese.js`
- Backend relacionado: `/anamnese*`
- Leitura tecnica: clinico e dependente de subdominio

### Itens adjacentes no mesmo ecossistema de cadastro
- `Controle de estoque...`
- `Controle de proteticos...`
- `Agendas...`
- `Etiquetas...`
- `Preferencias...`
- `Opcoes do sistema...`

Esses itens nao definem sozinhos a frente `Cadastros Gerais`, mas entram no mapa ampliado porque aparecem no mesmo bloco de navegacao do usuario e compartilham dependencias com os cadastros centrais.

## Mapa inicial de responsabilidades tecnicas
O mapa tecnico preliminar e:

- `frontend/app.js` continua como fonte funcional principal de abertura, renderizacao, selecao, eventos, modais, salvar e excluir;
- `frontend/index.html` continua como fonte dos menus e dos containers visiveis;
- `frontend/js/modules` existe como apoio passivo de helpers em varios dominios, sem assumir a funcao funcional principal;
- `backend/routes/cadastros_routes.py` e um concentrador real de dominios diferentes;
- as dependencias de permissao ja mostram que a frente nao e homogênea;
- a separacao futura deve respeitar dominio, permissao e tipo de fluxo.

## Classificacao multiarea
Classificacao registrada: `mista`.

Justificativa:

- ha nucleo comum/core em auxiliares, unidades, grupos e categorias;
- ha componente claramente odontologico em simbolos graficos, CID, procedimentos genericos, anamnese e partes dos fluxos de pacientes;
- ha componentes mistos e transversais em plano de contas, medicamentos, prestadores e convenios/planos;
- ha dependencia de subdominio em varias rotas e menus, com uso de `configuracao`, `procedimentos` e `financeiro`.

Leitura auxiliar da classificacao:

- comum/core em alguns cadastros basicos;
- especifica de odontologia em parte dos cadastros clinicos;
- mista como classificacao global da frente;
- dependente de subdominio em rotas que nao devem ser tratadas como um bloco unico no futuro.

## Riscos tecnicos
- `backend/routes/cadastros_routes.py` e grande e mistura dominios diferentes;
- `frontend/app.js` continua concentrando o comportamento de abertura e persistencia de varias telas;
- `frontend/js/modules` ainda sao passivos e nao resolvem a fragmentacao funcional;
- algumas rotas dependem de `configuracao`, outras de `procedimentos` e outras de `financeiro`;
- o grupo visual de cadastros nao corresponde a um unico dominio tecnico;
- ha risco de misturar area comum com area odontologica ou financeira em qualquer futura separacao;
- ha risco documental de confundir nomes de menu com nomes de dominio;
- textos estranhos, mojibake e labels historicos podem existir e devem ser apenas registrados, nunca corrigidos nesta frente.

## Limites do que NAO sera alterado
Nesta subetapa nao e permitido:

- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar arquivos em `frontend/js/modules`;
- alterar backend;
- alterar rotas;
- alterar models;
- alterar services;
- alterar banco;
- alterar schema;
- alterar migrations;
- alterar seeds;
- alterar endpoints;
- executar `INSERT`, `UPDATE` ou `DELETE`;
- executar qualquer `PATCH` funcional;
- criar helper JS;
- extrair funcao;
- mover codigo;
- renomear funcoes;
- renomear labels;
- corrigir textos visiveis;
- corrigir acentos;
- corrigir mojibake;
- alterar permissoes;
- criar flags de multiarea;
- implementar controle multiarea;
- misturar documentacao com refatoracao funcional.

## Contrato funcional inicial
O contrato funcional inicial da frente `Cadastros Gerais` fica registrado assim:

- a frente e um agrupamento documental de telas e tabelas de referencia;
- o usuario enxerga entradas separadas no menu, nao uma tela unica chamada `Cadastros Gerais`;
- o conjunto inclui cadastros basicos, clinicos, financeiros e de apoio que compartilham navegacao e dependencia tecnica;
- `frontend/app.js` segue como fonte funcional principal ate nova autorizacao;
- `backend/routes/cadastros_routes.py` segue como fonte oficial do conjunto de rotas agregadas;
- os nomes visiveis do usuario devem permanecer como estao;
- nao ha autorizacao para reorganizar o codigo nesta etapa;
- a classificacao multiarea fica apenas registrada, sem flag, sem banco e sem permissao nova.

## Proposta conservadora da proxima subetapa
Subetapa 2 recomendada:

- `Fase 2 - Cadastros Gerais - Subetapa 2 - Mapa documental de fronteiras por dominio e dependencias de permissao`

Objetivo conservador dessa proxima subetapa:

- detalhar quais telas, rotas e dependencias pertencem a cada subdominio;
- separar apenas no papel o que e comum, odontologico, misto ou dependente de subdominio;
- manter a frente sem alteracao de codigo;
- preparar o terreno para qualquer decisao futura de modularizacao segura.

## Onde testar futuramente quando houver alteracao real
Quando houver alguma alteracao real, os pontos de validacao futuros devem ser estes:

- `Cadastro > Tabelas auxiliares...`
- `Cadastro > Plano de contas...`
- `Cadastro > Doencas (CID)...`
- `Cadastro > Unidades de atendimento...`
- `Cadastro > Procedimentos genericos...`
- `Configurações > Simbolos graficos...`
- `Cadastro > Novo paciente...`
- `Cadastro > Abre paciente...`
- `Cadastro > Convênios e planos...`
- `Cadastro > Prestadores...`
- `Cadastro > Medicamentos...`
- `Cadastro > Anamnese...`
- abrir, listar, editar, salvar e excluir somente onde isso for seguro;
- confirmar console sem `ReferenceError`, `TypeError` ou regressao de abertura;
- confirmar que a navegacao continua no mesmo menu e sem renomeacao visual.

## Blindagem textual/mojibake
Esta subetapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder ou string visivel.

Se algum texto estranho, mojibake ou label historico aparecer em documentos consultados, ele deve ser tratado apenas como risco ou pendencia futura, nunca como alvo de correcao nesta etapa.

## Registro para roadmap
- A frente `Preferencias e Opcoes do Sistema` permanece pausada/consolidada.
- A frente `Cadastros Gerais` foi iniciada documentalmente.
- A Subetapa 1 foi criada sem alteracao de codigo.
- A classificacao multiarea registrada para `Cadastros Gerais` e `mista`.
- O contrato funcional inicial foi definido em nivel documental.
- A proxima subetapa recomendada e `Mapa documental de fronteiras por dominio e dependencias de permissao`.
- Nenhum backend, banco, endpoint, permissao ou string visivel foi alterado.
- Nenhuma implementacao de controle multiarea foi criada.

## Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_cadastros_gerais_subetapa_1_contrato_funcional_classificacao_multiarea.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Documenta contrato funcional de cadastros gerais"`
- `git push`

## Observacao final
Esta subetapa e exclusivamente documental.

Nenhum codigo foi alterado.
