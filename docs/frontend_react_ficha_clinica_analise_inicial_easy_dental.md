# Analise inicial - modulo Ficha clinica

## 1. Objetivo da frente

O objetivo desta frente e mapear o modulo `Ficha clinica` do EasyDental, acessado pelo icone da barra horizontal, como modulo raiz do prontuario clinico odontologico.

Esta etapa e somente documental.

Nao autoriza mudancas em backend, frontend, banco, migrations, seeds ou regras operacionais reais.

## 2. Acesso e caminho

### 2.1 Ambiente validado

- EasyDental acessado autenticado: sim.
- Navegador usado: Edge no ambiente local do Codex.
- Tela inicial apos login: painel principal do EasyDental autenticado, com `Avisos` e saudacao ao usuario.
- Paciente de teste usado: nao confirmado nesta rodada.
- Limitacao encontrada: nao houve identificacao segura de um paciente de teste para abrir a ficha completa sem risco de documentar dados reais.

### 2.2 Caminho ate o modulo

O caminho observado foi:

1. login autenticado no EasyDental;
2. painel principal do sistema;
3. clique no icone da barra horizontal `Ficha clinica`, identificado como `Ficha clinica`/`Prontuario` na toolbar;
4. abertura da tela do prontuario clinico odontologico em area principal.

### 2.3 Resultado ao clicar em Ficha clinica

Ao clicar no icone, o EasyDental abriu o painel de `Ficha clinica`/prontuario dentro da area principal da aplicacao, sem trocar de pagina.

Sem paciente selecionado, a tela informa que nenhum tratamento foi selecionado no odontograma e orienta a selecionar um tratamento para visualizar detalhes.

## 3. Mapa do modulo Ficha clinica

### 3.1 Estrutura geral observada

O modulo aparece como uma area principal da aplicacao, integrada ao shell do EasyDental, com:

- barra horizontal superior;
- barra lateral esquerda com atalhos;
- area central do prontuario;
- painel de paciente / busca;
- area de tratamento;
- abas de contexto;
- grade de procedimentos;
- painel de calendario/agenda;
- area de pesquisa de pacientes na parte inferior.

### 3.2 Layout aproximado

- tela inteira, nao modal;
- ocupa a janela principal;
- organiza-se em colunas;
- ha barra superior, lateral e um miolo central amplo;
- o conteudo principal e dividido entre area de prontuario, area de tratamento e blocos auxiliares.

## 4. Componentes da Ficha clinica

| Componente | Tipo | Localizacao | Funcao aparente | Depende de paciente | Depende de tratamento | Acao ao clicar | Status de validacao |
|---|---|---|---|---|---|---|---|
| Barra horizontal superior | barra de acoes | topo da tela | navega entre modulos principais | sim | nao | abre modulos e atalhos | Confirmado no EasyDental autenticado |
| Icone `Ficha clinica` | botao/atalho | barra horizontal superior | abre o prontuario clinico odontologico | sim | nao | abre a Ficha clinica | Confirmado no EasyDental autenticado |
| Barra lateral esquerda | barra de atalhos | lateral esquerda | acesso rapido a modulos e funcoes | sim | nao | abre ou alterna telas | Parcialmente confirmado |
| Cabecalho do paciente | bloco informativo | topo/area principal | mostra contexto do usuario/paciente | sim | nao | nao foi usado para edicao | Parcialmente confirmado |
| Abas `Tratamento`, `Financeiro`, `Timeline`, `Documentos`, `Anotacoes` | abas | area central do prontuario | alternam subareas da ficha clinica | sim | sim | muda o painel exibido | Confirmado no EasyDental autenticado |
| Grade de procedimentos | grid/lista | area central | lista procedimentos do contexto | sim | sim | seleciona itens do tratamento | Parcialmente confirmado |
| Painel de calendario/agenda | painel auxiliar | lado direito/inferior da area central | mostra calendario e agenda do paciente | sim | nao | navega datas/contexto | Parcialmente confirmado |
| Pesquisa de pacientes | campo + lista | parte inferior | localizar/selecionar paciente em uso | sim | nao | filtra e seleciona paciente | Confirmado no EasyDental autenticado |

## 5. Tela da Ficha clinica sem tratamento

Quando nenhum tratamento esta selecionado, a area principal mostra:

- mensagem de que nenhum tratamento foi selecionado no odontograma;
- orientacao para selecionar o tratamento desejado para ver detalhes;
- abas de contexto visiveis;
- grade vazia ou sem registros;
- contador de registros em zero.

## 6. Abas e secoes observadas

### 6.1 Tratamento

- finalidade aparente: exibir e operar os tratamentos do paciente;
- vazio: mostra a mensagem de nenhum tratamento selecionado;
- preenchido: pendente de validacao com tratamento real;
- botoes: nao confirmados completamente nesta rodada;
- dependencia: paciente em uso e tratamento selecionado.

### 6.2 Financeiro

- finalidade aparente: contexto financeiro do tratamento/paciente;
- vazio: pendente de validacao;
- preenchido: pendente de validacao;
- botoes: pendente;
- dependencia: paciente e, possivelmente, tratamento.

### 6.3 Timeline

- finalidade aparente: historico cronologico de eventos;
- vazio: pendente de validacao;
- preenchido: pendente de validacao;
- botoes: pendente;
- dependencia: paciente e eventos registrados.

### 6.4 Documentos

- finalidade aparente: area de documentos do paciente;
- vazio: pendente de validacao;
- preenchido: pendente de validacao;
- botoes: pendente;
- dependencia: paciente.

### 6.5 Anotacoes

- finalidade aparente: registrar anotacoes do prontuario;
- vazio: pendente de validacao;
- preenchido: pendente de validacao;
- botoes: pendente;
- dependencia: paciente.

## 7. Relacao com Tratamento

O modulo `Tratamento` aparece como uma aba dentro da `Ficha clinica`.

O menu de acoes do tratamento nao foi validado por completo nesta rodada, mas a estrutura do prontuario deixa claro que o tratamento e um subfluxo do prontuario clinico odontologico.

`Novo tratamento` deve ser tratado como fluxo conectado a essa area, e nao como modulo raiz isolado.

### 7.1 O que foi observado no contexto Tratamento

- area de tratamento sem tratamento selecionado;
- grade de procedimentos com colunas visiveis;
- contador de registros;
- opcao de visualizar inativos;
- mensagem de vazio quando nao ha tratamento selecionado.

## 8. Relacao com procedimentos

### 8.1 Grade/lista de procedimentos

Colunas visiveis no grid:

- Procedimento;
- Regiao;
- Rep;
- Pac;
- Acoes.

### 8.2 Estado da grade

Na tela observada, o total de registros estava em zero.

Isso indica que a grade existe mesmo sem tratamento selecionado, mas permanece vazia ate haver contexto de tratamento.

### 8.3 Busca de procedimentos

A busca de procedimentos nao foi aberta de forma segura nesta rodada.

Pendente de validacao.

## 9. Relacao com orcamento e financeiro

O texto das abas mostra a existencia de contexto financeiro dentro da `Ficha clinica`.

Foi possivel confirmar apenas:

- aba `Financeiro` visivel;
- relacao entre prontuario e contexto financeiro;
- pendencia de validacao do fluxo real de aprovacao, desaprovacao e alteracao de orcamento.

Nao foi possivel confirmar aqui se o orcamento nasce automaticamente com o tratamento.

## 10. Relacao com finalizacao e execucao

Havia indicios de acao/fluxo de procedimentos e detalhes do tratamento, mas a tela observada nao permitiu fechar a validacao do modal de execucao/finalizacao nesta rodada.

Pendente de validacao.

## 11. Dependencia de paciente em uso

A `Ficha clinica` depende de paciente em uso.

Na ausencia de tratamento selecionado, a tela mostra a area de tratamento vazia e a orientacao para selecionar um tratamento no odontograma.

A pesquisa de pacientes fica visivel na parte inferior, indicando que a selecao de paciente faz parte do fluxo de entrada.

## 12. Tabela consolidada de componentes

| Componente | Tipo | Localizacao | Funcao aparente | Depende de paciente | Depende de tratamento | Acao ao clicar | Status de validacao |
|---|---|---|---|---|---|---|---|
| Barra horizontal superior | barra de acoes | topo | navega modulos | sim | nao | alterna modulo | Confirmado no EasyDental autenticado |
| Ficha clinica | botao/atalho | barra horizontal | abre prontuario | sim | nao | abre a ficha | Confirmado no EasyDental autenticado |
| Tratamento | aba | area central | opera tratamentos | sim | sim | alterna subarea | Confirmado no EasyDental autenticado |
| Financeiro | aba | area central | contexto financeiro | sim | sim | alterna subarea | Parcialmente confirmado |
| Timeline | aba | area central | historico cronologico | sim | sim | alterna subarea | Parcialmente confirmado |
| Documentos | aba | area central | documentos do paciente | sim | sim | alterna subarea | Parcialmente confirmado |
| Anotacoes | aba | area central | anotacoes do prontuario | sim | sim | alterna subarea | Parcialmente confirmado |
| Grade de procedimentos | grid | area central | lista procedimentos | sim | sim | seleciona item | Parcialmente confirmado |
| Pesquisa de pacientes | campo/lista | rodape | localizar paciente | sim | nao | filtra/seleciona | Confirmado no EasyDental autenticado |

## 13. Tabela de fluxos

| Fluxo | Origem | Destino/modal/tela | Pre-condicao | Efeito esperado | Status de validacao |
|---|---|---|---|---|---|
| Abrir Ficha clinica | barra horizontal | prontuario clinico odontologico | login autenticado | abrir area principal da ficha | Confirmado no EasyDental autenticado |
| Abrir Tratamento | Ficha clinica | aba Tratamento | paciente em uso | mostrar area de tratamento | Confirmado no EasyDental autenticado |
| Novo tratamento | Ficha clinica/Tratamento | modal ou fluxo relacionado | paciente em uso e contexto valido | iniciar novo tratamento | Parcialmente confirmado |
| Alterar tratamento | Tratamento | modal/fluxo de edicao | tratamento existente | editar tratamento | Pendente de validacao |
| Alterar orcamento | Tratamento | modal financeiro | tratamento existente | abrir alteracao de valores | Pendente de validacao |
| Detalhes do tratamento | Tratamento | modal de detalhes | tratamento existente | consultar/editar detalhes | Pendente de validacao |
| Incluir procedimento | Tratamento | grade/procedimento | tratamento existente | adicionar procedimento | Parcialmente confirmado |
| Finalizar procedimento | Tratamento | modal de execucao/fase | procedimento selecionado | mudar status e registrar historico | Pendente de validacao |
| Reabrir tratamento | Tratamento | acao contextual | tratamento encerrado | reativar tratamento | Pendente de validacao |
| Interromper tratamento | Tratamento | acao contextual | tratamento existente | suspender fluxo | Pendente de validacao |
| Excluir tratamento | Tratamento | acao contextual | tratamento existente | remover tratamento | Pendente de validacao |

## 14. Proposta de fases futuras

- Fase FC1 - contrato documental da Ficha clinica.
- Fase FC2 - criar entrada visual `Ficha clinica` na barra horizontal do Brana Cloud.
- Fase FC3 - criar shell visual da Ficha clinica com paciente em uso.
- Fase FC4 - criar aba ou area Tratamento dentro da Ficha clinica.
- Fase FC5 - integrar fluxo Novo tratamento.
- Fase FC6 - listar procedimentos do tratamento.
- Fase FC7 - busca e inclusao de procedimento.
- Fase FC8 - detalhes e alteracao de tratamento.
- Fase FC9 - orcamento e financeiro.
- Fase FC10 - execucao e finalizacao.
- Fase FC11 - documentos, timeline e anotacoes, se aplicavel.

## 15. Pendencias

### 15.1 Ficha clinica

- confirmar todos os menus superiores e laterais;
- confirmar o comportamento completo ao abrir sem paciente;
- confirmar o comportamento ao abrir com paciente em uso;
- confirmar os detalhes do cabecalho do paciente.

### 15.2 Paciente em uso

- confirmar fluxo exato de selecao de paciente;
- confirmar se a ficha carrega automaticamente ao selecionar um paciente;
- confirmar se ha busca dedicada com filtro por nome/codigo.

### 15.3 Tratamento

- confirmar menu completo de acoes;
- confirmar comportamento com tratamento existente;
- confirmar as regras de alteracao, reabertura e interrupcao.

### 15.4 Novo tratamento

- confirmar se o fluxo parte sempre da Ficha clinica;
- confirmar se existe modal ou janela especifica;
- confirmar os campos e obrigatoriedades.

### 15.5 Procedimentos

- confirmar busca e inclusao de procedimentos;
- confirmar dependencia de dente, regiao e faces.

### 15.6 Orcamento

- confirmar relacao entre tratamento e orcamento;
- confirmar status de aprovacao e desaprovacao.

### 15.7 Finalizacao

- confirmar modal de execucao/fase;
- confirmar efeito em status e historico.

### 15.8 Timeline, documentos e anotacoes

- confirmar escopo visual e funcional;
- confirmar se sao areas somente consulta ou tambem edicao.

## 16. Conclusao

O modulo raiz observado no EasyDental e a `Ficha clinica`.

`Tratamento` e `Novo tratamento` devem ser tratados como subfluxos conectados a esse prontuario.

Esta frente permanece documental, sem autorizacao para implementacao.

## 17. Inventario local de assets com potencial para o shell odontologico

A leitura dos ativos locais do Brana Cloud mostra que o repositorio ja possui um conjunto util de imagens odontologicas para apoiar a reproducao visual da Ficha clinica, sem depender de backend, banco ou copia direta do EasyDental.

### 17.1 Grupo arcada e dentes

- `assets/easy/arc_superior_perm.bmp` - `512x96`
- `assets/easy/arc_inferior_perm.bmp` - `512x96`
- `assets/easy/arc_faces.bmp` - `32x25`
- `assets/easy/arc_superior_perm_test.png` - `512x96`
- `assets/easy/dentes/arc_dente11.bmp` a `assets/easy/dentes/arc_dente85.bmp`

Leitura objetiva:

- as duas arcadas completas sao boas candidatas para guiar proporcao, largura e ritmo horizontal do odontograma;
- os dentes isolados formam uma familia consistente para a leitura anatomica por quadrante;
- `arc_faces.bmp` e muito pequeno e funciona melhor como marcador auxiliar do que como elemento principal.

### 17.2 Grupo de simbolos e intervencoes

- `assets/easy/sim_face.bmp`
- `assets/easy/sim_face_40.bmp`
- `assets/easy/sim_simb*.bmp`
- `assets/easy/int_cirur.bmp`
- `assets/easy/int_canal.bmp`
- `assets/easy/int_implante.bmp`
- demais `assets/easy/int_*.bmp`

Leitura objetiva:

- os simbolos `sim_*` sao pequenos e servem melhor como referencia semantica ou marcador de estado;
- os icones `int_*` sao uteis para linguagem visual de procedimentos e categorias, mas nao devem virar base literal da V1.

### 17.3 Grupo de atalhos e comandos

- `assets/easy/cmd_odontograma.bmp`
- `assets/easy/cmd_fichapes.bmp`
- `assets/easy/cmd_novotra.bmp`
- demais `assets/easy/cmd_*.bmp`

Leitura objetiva:

- os `cmd_*` sao bons para toolbar/atalhos;
- nao devem ser tratados como referencia principal de arcada ou odontograma.

### 17.4 Conclusao do inventario local

- ha material visual suficiente para orientar a composicao da Ficha clinica;
- a melhor base para a arcada continua sendo o grupo `arc_superior_perm.bmp`, `arc_inferior_perm.bmp` e a familia `arc_denteXX.bmp`;
- a familia `sim_*` e os `int_*` podem entrar depois como refinamento de linguagem visual;
- a implementacao continua somente documental nesta rodada.

## Validacao direta EasyDental autenticado - Ficha clinica com paciente em uso

### 1. Selecao de paciente de teste

- EasyDental acessado autenticado: sim.
- Navegador usado: Edge no ambiente local do Codex.
- Paciente de teste usado: sim, tratado nesta documentacao como `[paciente de teste]`.
- Como abrir/localizar paciente: pela pesquisa de pacientes na parte inferior da Ficha clinica, a partir do painel principal.
- Como a Ficha clinica identifica o paciente em uso: pelo cabecalho superior do prontuario e pela area central de tratamento.
- O paciente em uso aparece no cabecalho: sim, com nome e informacoes resumidas do registro; os dados sensiveis nao foram reproduzidos aqui.
- A selecao do paciente altera automaticamente a Ficha clinica: sim, ao confirmar a selecao a tela carrega o prontuario do paciente.

### 2. Entrada na Ficha clinica com paciente em uso

- Caminho exato observado: painel principal -> `Ficha clinica`/`Prontuario` -> pesquisa de pacientes -> selecao do registro -> confirmacao.
- A Ficha clinica abre como: area/tela principal integrada ao shell.
- Mantem barra horizontal superior: sim.
- Mantem barra lateral: sim.
- Mostra dados do paciente: sim, no cabecalho.
- Areas preenchidas: cabecalho do paciente, aba Tratamento ativa, grade de procedimentos e resumo do tratamento.
- Areas vazias ou pendentes: Financeiro, Timeline, Documentos e Anotacoes mostram areas proprias, mas o conteudo de detalhe ainda depende do contexto selecionado.
- Carregamento automatico: a aba Tratamento carrega imediatamente com o contexto do paciente; as demais abas ficam visiveis como parte do prontuario.

### 3. Abas da Ficha clinica

#### 3.1 Tratamento

- nome exato: `Tratamento`;
- posicao: primeira aba do bloco principal;
- conteudo visivel: grade de procedimentos e resumo do tratamento;
- estado vazio: sem tratamento, mostra mensagem de nenhum tratamento selecionado;
- estado preenchido: lista de procedimentos do tratamento selecionado;
- botoes disponiveis: `Novo...`, filtro de procedimentos, toggles e acoes do bloco;
- menus disponiveis: botoes de acao do tratamento e atalhos da area;
- depende de tratamento: sim;
- depende de procedimento: sim, para a grade ganhar registros reais;
- depende de orcamento: parcialmente, para visoes financeiras relacionadas;
- status de validacao: Confirmado no EasyDental autenticado.

#### 3.2 Financeiro

- nome exato: `Financeiro`;
- posicao: segunda aba;
- conteudo visivel: resumo financeiro e indicador de lancamentos/recebimentos;
- estado vazio: mostra contagem zerada quando nao ha itens financeiros;
- estado preenchido: exibiria lancamentos do paciente/tratamento;
- botoes disponiveis: aacao de visualizacao/financeiro do painel;
- menus disponiveis: ainda pendentes de detalhamento fino;
- depende de tratamento: sim;
- depende de orcamento: sim, de forma aparente;
- status de validacao: Parcialmente confirmado.

#### 3.3 Timeline

- nome exato: `Timeline`;
- posicao: terceira aba;
- conteudo visivel: historico cronologico de eventos do paciente/tratamento;
- estado vazio: sem eventos detalhados nesta rodada;
- estado preenchido: mostra entradas datadas e descricoes resumidas;
- botoes disponiveis: nao detalhados nesta rodada;
- menus disponiveis: pendente de validacao;
- depende de tratamento: sim;
- depende de procedimento: possivelmente sim;
- depende de orcamento: nao confirmado;
- status de validacao: Parcialmente confirmado.

#### 3.4 Documentos

- nome exato: `Documentos`;
- posicao: quarta aba;
- conteudo visivel: area de documentos do prontuario;
- estado vazio: indica zero documentos quando nao ha anexos;
- estado preenchido: pendente de validacao em outro caso;
- botoes disponiveis: nao detalhados nesta rodada;
- menus disponiveis: pendente de validacao;
- depende de tratamento: nao obrigatoriamente;
- depende de procedimento: nao confirmado;
- depende de orcamento: nao;
- status de validacao: Parcialmente confirmado.

#### 3.5 Anotacoes

- nome exato: `Anotacoes`;
- posicao: quinta aba;
- conteudo visivel: area de anotacoes do prontuario;
- estado vazio: area sem texto detalhado nesta rodada;
- estado preenchido: pendente de validacao;
- botoes disponiveis: nao detalhados nesta rodada;
- menus disponiveis: pendente de validacao;
- depende de tratamento: nao obrigatoriamente;
- depende de procedimento: nao confirmado;
- depende de orcamento: nao;
- status de validacao: Parcialmente confirmado.

### 4. Tratamento dentro da Ficha clinica

- A aba Tratamento e a primeira area operacional do prontuario.
- Existe grade/lista de procedimentos.
- A grade pode aparecer vazia ou com procedimentos, dependendo do paciente.
- As colunas visiveis incluem `Procedimento`, `Ações` e, no contexto observado, linhas com identificacao/regiao/pac.
- Ha icones/status de procedimento, incluindo indicacao de procedimento finalizado.
- O bloco de acoes do tratamento fica na parte superior da area de tratamento.
- Ha botao/acao para criar novo tratamento: sim, `Novo...`.
- Ha selecao de tratamento atual: sim, com tratamentos listados em abas/seletores.
- O tratamento possui codigo/status visivel no titulo das abas de tratamento.
- Quando nao existe tratamento selecionado, a tela mostra mensagem orientando a selecionar o tratamento no odontograma.

### 5. Menu de acoes do Tratamento

Os botoes observados na area do tratamento foram:

- `Novo procedimento`;
- `Orçamento`;
- `Finalizar tratamento`;
- `Interromper tratamento`;
- `Reabrir tratamento`;
- `Excluir tratamento`;
- `Gerenciar guia OdontoPrev`.

Status resumido:

- `Novo procedimento`: confirmado como acao da ficha;
- `Orçamento`: confirmado como acao da ficha;
- `Finalizar tratamento`: confirmado como acao da ficha;
- `Interromper tratamento`: confirmado como acao da ficha;
- `Reabrir tratamento`: confirmado como acao da ficha;
- `Excluir tratamento`: confirmado como acao da ficha;
- `Gerenciar guia OdontoPrev`: visivel, mas fora do foco principal desta frente.

### 6. Novo tratamento como subfluxo da Ficha clinica

- O botao `Novo...` aparece dentro da Ficha clinica.
- Ao clicar, abre o modal `Novo tratamento`.
- Titulo exato: `Novo tratamento`.
- Abas existentes: `Dados principais` e `Dados de convenio`.
- Campos visiveis: data de abertura, prestador responsavel, unidade de atendimento, paciente, beneficio, tabela/moeda, tipo de faturamento, tipo de atendimento, observacoes, idade do paciente, arcada predominante e checkbox de copia.
- Botoes visiveis: `Gravar tratamento` e `Cancelar`.
- O paciente vem preenchido automaticamente: sim, no contexto observado.
- Cancela sem salvar: sim.
- Ha alerta de alteracao nao salva: nao confirmado nesta rodada.
- Ha campos obrigatorios visuais: visualmente ha campos com estrutura de formulario, mas a obrigatoriedade exata ainda requer validacao fina.

### 7. Procedimentos dentro da Ficha clinica

- Onde aparecem: na grade central da aba Tratamento.
- Existe botao/icone especifico para novo procedimento: sim, `Novo procedimento`.
- Depende de tratamento aberto: sim, pelo comportamento observado da area.
- Abre pesquisa de procedimento: nao foi aberto nesta rodada, mas o botao de novo procedimento existe.
- Exige dente/regiao/faces: pendente de validacao.

### 8. Financeiro / Orcamento

- A aba `Financeiro` existe e mostra informacao financeira resumida.
- O botao/acao `Orçamento` aparece na area do tratamento.
- O fluxo de orcamento depende do tratamento: sim, de forma aparente.
- Status como pendente/aprovado/desaprovado: nao confirmados nesta rodada.

### 9. Timeline, Documentos e Anotacoes

- As abas existem como parte interna da Ficha clinica.
- `Timeline` mostra historico datado.
- `Documentos` mostra area de documentos.
- `Anotacoes` mostra area de anotacoes.
- Todas parecem pertencer ao prontuario clinico integrado, nao a modulos independentes.

### 10. Dependencias e regras confirmadas

- A Ficha clinica exige paciente em uso: sim.
- O clique em Ficha clinica sem paciente leva a area inicial sem tratamento selecionado e com orientacao de selecao: parcialmente confirmado.
- O paciente em uso aparece no cabecalho: sim.
- Tratamento e a primeira aba operacional: sim.
- Existe tratamento ativo selecionado: sim, no paciente observado.
- Novo tratamento depende da Ficha clinica aberta: sim.
- Procedimentos dependem de tratamento aberto: sim, pelo comportamento observado da grade e das acoes.
- Orcamento depende de tratamento aberto: sim, de forma aparente.
- Financeiro depende de orcamento: parcialmente confirmado.
- Timeline registra acoes clinicas: sim, de forma aparente.
- Documentos e Anotacoes sao abas internas da Ficha clinica: sim.

### 11. Atualizacao das tabelas

As tabelas de componentes e fluxos devem considerar os novos itens confirmados nesta validacao, especialmente:

- `Novo procedimento`;
- `Orçamento`;
- `Finalizar tratamento`;
- `Interromper tratamento`;
- `Reabrir tratamento`;
- `Excluir tratamento`;
- `Gerenciar guia OdontoPrev`;
- a selecao efetiva do paciente em uso;
- a grade de procedimentos preenchida;
- o modal `Novo tratamento` como subfluxo.

### 12. Pendencias remanescentes

- confirmar o menu completo de acoes em estados diferentes de tratamento;
- confirmar a busca de procedimentos em detalhe;
- confirmar o fluxo de inclusao de procedimento;
- confirmar o comportamento financeiro e o status de orcamento;
- confirmar o modal de execucao/finalizacao;
- confirmar documentos e anotacoes em estado preenchido.

### 13. Conclusao desta validacao

A Ficha clinica abriu com paciente em uso e mostrou claramente:

- paciente no cabecalho;
- abas `Tratamento`, `Financeiro`, `Timeline`, `Documentos`, `Anotacoes`;
- grade de procedimentos;
- botoes de acao do tratamento;
- subfluxo `Novo tratamento`.

Isso confirma a Ficha clinica como o shell raiz do prontuario clinico odontologico, com Tratamento e Novo tratamento como fluxos internos.

## 14. Implementacao FC2 no frontend-react

- A entrada visual `Ficha clinica` foi conectada na barra superior do `frontend-react` e roteada em `frontend-react/src/app/App.jsx` para `/app/ficha-clinica`.
- O shell inicial da Ficha clinica foi criado em `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`, com card hero, estado de paciente em uso, pesquisa visual de pacientes e abas `Tratamento`, `Financeiro`, `Timeline`, `Documentos` e `Anotacoes`.
- A tela respeita o paciente em uso por estado local de sessao, sem alterar backend, banco ou o frontend legado.
- A area de Tratamento recebeu grade vazia, botoes visuais de acao e mensagem de fluxo em implantacao, como passo seguro e reversivel.
- A validacao de build do `frontend-react` foi concluida com sucesso em `cmd /c npm run build`.

## Fase FC2B - Refino de geometria do shell Ficha clinica

- A tela foi refinada para ficar menos com cara de dashboard e mais com cara de software operacional clinico, mantendo o shell em 3 areas.
- A geometria geral passou a usar uma composicao mais compacta, com area esquerda odontograma mais larga, area central Tratamento/grade e painel lateral direito teal mais contido.
- O topo do odontograma, o topo do Tratamento e o inicio do painel lateral direito permanecem alinhados como bloco unico da Ficha clinica.
- O odontograma visual continua apenas como placeholder geometrico, sem refinamento fino de dentes ou integracao com o modulo real.
- O painel central de Tratamento continua com abas, toolbar e grade vazia, sem persistencia, sem backend e sem acao clinica real.
- O painel lateral direito continua apenas visual, com calendario, estado do paciente em uso e acoes placeholder.
- Pendencias para FC2C: refino do odontograma/arcada visual, densidade do painel Tratamento e ajuste fino do painel lateral direito.

## Fase FC2C - Refino visual do odontograma/arcada

- Arquivos alterados nesta etapa: `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`, `frontend-react/src/features/fichaClinica/fichaClinica.css`, `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md` e `docs/11_roadmap_desenvolvimento.md`.
- O odontograma recebeu arcada superior e inferior com dentes placeholder mais anatomicos, numeração visivel, duas linhas de faces/circulos entre as arcadas e area branca plana mais proxima da referencia EasyDental.
- A barra de categorias clinicas foi adicionada abaixo da arcada, com itens compactos e primeira categoria ativa apenas de forma visual.
- As abas inferiores `Boca` e `Dente` foram preservadas com estilo mais simples, e a mensagem inferior passou a ficar mais discreta e centralizada.
- Nao houve implementacao de logica clinica real, clique em dente, selecao de face, persistencia ou backend.
- O que ficou placeholder: dentes, faces, categorias, toolbar superior do odontograma e area de vazio informativa.
- Pendencia para a proxima fase: refino do painel Tratamento e, depois, ajuste fino do painel lateral direito.

## Fase FC2C-2 - Refino fino do odontograma e paleta clinica

- Arquivos alterados nesta etapa: `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`, `frontend-react/src/features/fichaClinica/fichaClinica.css`, `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md` e `docs/11_roadmap_desenvolvimento.md`.
- Os dentes placeholder passaram a variar por grupo, com incisivos mais estreitos, caninos mais pontiagudos, pre-molares intermediarios e molares mais largos, mantendo 16 posicoes por arcada.
- As duas linhas de faces/circulos ficaram mais tecnicas, com divisoes internas simuladas e visual mais denso na area entre as arcadas.
- A barra de categorias clinicas passou a exibir iconografia simples por categoria, mantendo leitura compacta e ativa apenas no primeiro item.
- As abas `Boca` e `Dente` foram achatadas visualmente e a area inferior ganhou maior semelhanca com a referencia, com fundo branco amplo e mensagem centralizada.
- Nao houve implementacao de logica clinica real, clique funcional, selecao de face, persistencia ou backend.
- O que ficou placeholder: dentes, faces, categorias, toolbar superior do odontograma e a area de vazio informativa.
- Pendencias para a proxima fase: refino do painel Tratamento, seguido do ajuste fino do painel lateral direito.

## 18. Auditoria de assets odontologicos para odontograma

### 18.1 Diretórios inspecionados

Foram inspecionados os caminhos:

- `frontend-react/src/assets/`
- `frontend/assets/`
- `frontend/img/`
- `frontend/images/`
- `frontend/public/`
- `public/`
- `assets/`
- `backend/static/`

No resultado bruto desta varredura, apareceram `1414` arquivos de imagem nos formatos `png`, `jpg`, `jpeg`, `svg`, `webp`, `gif`, `ico` e `bmp`, concentrados quase integralmente em `assets/`. Dentro do filtro por nomes odontologicos, `493` arquivos bateram com termos como `dente`, `arcada`, `odont`, `face`, `implante`, `canal` e `procedimento`.

### 18.2 Quantidade e distribuicao

- `frontend-react/src/assets/`: `2` imagens, ambas de marca (`brana.png` e `logo_brana.png`), sem valor direto para o odontograma.
- `assets/`: `1412` imagens, incluindo praticamente todo o acervo visual util para odontologia.

### 18.3 Assets candidatos para dentes e arcada

Os melhores candidatos encontrados foram:

- `assets/Bitmaps/Dentes2d/arc_superior_perm.bmp` - `512x96` - `192,1 KB`
- `assets/Bitmaps/Dentes2d/arc_inferior_perm.bmp` - `512x96` - `192,1 KB`
- `assets/Bitmaps/Dentes2d/arc_dente11.bmp` - `32x70` - `3,2 KB`
- `assets/Bitmaps/Dentes2d/arc_faces.bmp` - `32x25` - `1,8 KB`
- `assets/Bitmaps/Dentes3d/arc_dente11.bmp` - `32x70` - `4,4 KB`
- `assets/easy/arc_superior_perm.bmp` - `512x96` - `192,1 KB`
- `assets/easy/arc_inferior_perm.bmp` - `512x96` - `192,1 KB`
- `assets/easy/dentes/arc_dente11.bmp` a `assets/easy/dentes/arc_dente85.bmp`
- `assets/easy/arc_faces.bmp` - `32x25` - `1,8 KB`

Leitura objetiva:

- ha arcadas completas prontas para guiar proporcao e ritmo horizontal;
- ha familias completas de dentes isolados em `32x70`, com boa leitura anatomica por quadrante;
- `arc_faces.bmp` serve melhor como referencia auxiliar do que como elemento principal.

### 18.4 Assets candidatos para faces odontologicas

Os candidatos mais proximos de faces e marcadores de face foram:

- `assets/easy/sim_face.bmp` - `15x15` - `0,1 KB`
- `assets/easy/sim_face_40.bmp` - `12x12` - `0,1 KB`
- `assets/Bitmaps/arc_faces.bmp` - `32x25` - `1,8 KB`
- `assets/easy/arc_faces.bmp` - `32x25` - `1,8 KB`

Leitura objetiva:

- os `sim_face*` sao muito pequenos, úteis como marcador ou legenda;
- `arc_faces.bmp` parece ser o melhor candidato de face auxiliar, mas ainda nao substitui o desenho principal do odontograma.

### 18.5 Assets candidatos para paleta clinica e categorias

Foram encontrados os seguintes candidatos:

- `assets/easy/esp_Cirurgia.bmp` - `40x25` - `3 KB`
- `assets/easy/esp_Endodontia.bmp` - `40x25` - `3 KB`
- `assets/easy/esp_Implantodontia.bmp` - `40x25` - `3 KB`
- `assets/easy/esp_Odontopediatria.bmp` - `40x25` - `3 KB`
- `assets/easy/esp_Ortodontia.bmp` - `40x25` - `3 KB`
- `assets/easy/esp_Periodontia.bmp` - `100x25` - `7,4 KB`
- `assets/ciruriga.png` - `124x124` - `20,3 KB`
- `assets/dentistica.png` - `124x124` - `21,2 KB`
- `assets/diagnostico.png` - `124x124` - `21,2 KB`
- `assets/endodontia.png` - `124x124` - `19,7 KB`
- `assets/estetica.png` - `124x124` - `19,9 KB`
- `assets/gerais.png` - `124x124` - `20,8 KB`
- `assets/procedimentos.png` - `124x124` - `17,4 KB`

Leitura objetiva:

- os BMPs `esp_*` parecem adequados como paleta clinica ou categoria visual;
- os PNGs do raiz `assets/` parecem utilitarios de interface e podem apoiar categorias/atalhos, mas nao parecem ser o desenho principal do odontograma;
- `assets/procedimentos.png` ja esta usado pelo frontend legado no botao de odontograma.

### 18.6 Outros assets odontologicos relevantes

- `assets/easy/int_canal.bmp` - `24x24` - `1,7 KB`
- `assets/easy/int_cirur.bmp` - `24x24` - `1,7 KB`
- `assets/easy/int_implante.bmp` - `24x24` - `1,7 KB`
- `assets/easy/int_faceta.bmp` - `24x24` - `1,7 KB`
- `assets/Bitmaps/arc_facet_11.bmp` a `assets/Bitmaps/arc_facet_48.bmp`
- `assets/Bitmaps/arc_implante_i.bmp`
- `assets/Bitmaps/arc_implante_s.bmp`
- `assets/Bitmaps/ger_cirurgia.bmp` - `24x24` - `1,7 KB`

Leitura objetiva:

- esses ativos reforcam a existencia de uma biblioteca odontologica legada consistente;
- podem ajudar em refinamento de procedimentos, estados e categorias futuras;
- nao sao essenciais para substituir os dentes CSS imediatos.

### 18.7 Verificacao de origem provavel

- `assets/easy/arc_faces.bmp`, `assets/easy/arc_superior_perm.bmp`, `assets/easy/arc_inferior_perm.bmp`, `assets/easy/dentes/arc_dente11.bmp`, `assets/easy/sim_face.bmp`, `assets/easy/int_canal.bmp` e `assets/easy/int_implante.bmp` ja aparecem referenciados em documentos do proprio projeto, indicando reaproveitamento interno do acervo local.
- `assets/procedimentos.png` e usado no frontend legado em `frontend/app.js` como icone do botao `Odontograma`.
- `assets/Bitmaps/Dentes2d/*` e `assets/Bitmaps/Dentes3d/*` parecem acervo legado local de alta aderencia ao odontograma, mas nao foram encontrados referencias diretas no codigo durante esta auditoria.
- `frontend-react/src/assets/brana.png` e `frontend-react/src/assets/logo_brana.png` sao apenas brand assets e nao entram na camada odontologica.

### 18.8 Avaliacao final

- existe asset adequado para dentes: sim;
- existe asset adequado para faces: sim, mas como marcador auxiliar;
- existe asset adequado para paleta clinica: sim;
- existe material suficiente para substituir o CSS atual do odontograma por assets do proprio projeto: sim.

### 18.9 Recomendacao para a proxima etapa

**Opcao A**: foram encontrados assets bons de dentes/arcada.

Proxima etapa recomendada: `FC2C-3` substituir os dentes CSS por assets existentes do projeto, mantendo o fallback visual atual ate a validacao final.

## 19. Auditoria da origem visual do odontograma no EasyDental Cloud

### 19.1 Metodo de inspecao usado

- acesso autenticado ao EasyDental Cloud Web;
- abertura da `Ficha clínica` pelo botao do topo com `data-qtip="Ficha clínica"`;
- leitura do DOM com `Elements`/seletores do navegador;
- verificacao de `img`, `canvas`, `svg` e elementos com `background-image` via `getComputedStyle`;
- leitura de recursos carregados por `performance.getEntriesByType('resource')`.

### 19.2 Tela inspecionada

- painel principal autenticado do EasyDental Cloud;
- `Ficha clínica` aberta com painel de odontograma visivel;
- paciente de teste selecionado apenas para liberar o shell odontologico;
- nenhum dado sensivel de paciente foi registrado.

### 19.3 Mecanismo visual encontrado

O odontograma Cloud não apareceu como `canvas` nem como `svg` na inspeção feita.

O mecanismo observado foi uma combinação de:

- elementos `img` para ícones e marcadores;
- `background-image` em `div` e `span` do shell ExtJS;
- arquivos carregados individualmente, sem evidência de sprite único para o odontograma inteiro.

### 19.4 Recursos visuais encontrados

Recursos relevantes observados na Ficha clínica:

- `images/dente_vazio.png`
- `images/dente_vazio2.png`
- `images/ico_menu_odontograma.png`
- `images/ico_odontograma_toolbar_prc_pesquisa.png`
- `images/ico_odontograma_toolbar_prc_favorito.png`
- `images/int_cirur.bmp`
- `images/int_implante.bmp`
- `images/int_canal.bmp`
- `images/int_boticao.bmp`
- `images/int_fluor.bmp`
- `images/int_apicecto.bmp`
- `images/int_aprof_vestib.png`
- `images/int_biop_labio.png`
- `images/int_biop_ling.png`
- `images/int_biop_mand.png`
- `images/int_biop_maxila.png`
- `images/int_exostose_max.png`
- `images/int_torus_mand.png`
- `images/int_torus_palat.png`
- `images/int_consulta.bmp`
- `images/int_enxerto.bmp`
- `images/int_frenec.bmp`
- `images/int_generico01.bmp`
- `images/int_generico02.bmp`
- `images/int_generico03.bmp`
- `images/int_generico04.bmp`
- `images/int_hemi.bmp`
- `images/int_mordida.bmp`
- `images/int_raspagem.bmp`
- `images/int_retalho.bmp`
- `images/int_rizec.bmp`
- `images/int_ulecto.bmp`
- `images/ico_ficha_clinica_tratamento_orcamento.svg`
- `images/ico_ficha_clinica_tratamento_finaliza.svg`
- `images/ico_ficha_clinica_tratamento_interrompe.svg`
- `images/ico_ficha_clinica_tratamento_reabre.svg`
- `images/ico_ficha_clinica_tratamento_exclui.svg`
- `images/ico_ficha_clinica_desafixar_painel.svg`
- `images/ico_ficha_clinica_painel_calendario.svg`
- `images/ico_ficha_clinica_painel_search.svg`
- `images/ico_ficha_clinica_painel_novo.svg`

Leitura objetiva:

- o Cloud usa imagens individuais e backgrounds CSS;
- o odontograma observado usa `dente_vazio.png` e `dente_vazio2.png` como base visual do shell;
- os marcadores `int_*` existem em formato compatível com a biblioteca local do Brana;
- não houve evidência de canvas, SVG puro ou sprite único para todo o odontograma.

### 19.5 Comparação com assets locais

Comparando com os assets já auditados no Brana Cloud:

- `assets/Bitmaps/Dentes2d/arc_superior_perm.bmp`
- `assets/Bitmaps/Dentes2d/arc_inferior_perm.bmp`
- `assets/Bitmaps/Dentes2d/arc_faces.bmp`
- `assets/Bitmaps/Dentes2d/arc_dente11.bmp`
- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/arc_faces.bmp`
- `assets/easy/dentes/arc_dente11.bmp` até `arc_dente85.bmp`
- `assets/easy/sim_face.bmp`
- `assets/easy/sim_face_40.bmp`

Conclusão da comparação:

- o Cloud não mostrou nomes idênticos para arcada e dente isolado;
- ainda assim, o padrão visual é compatível com a mesma família semântica;
- os `int_*` do Cloud e os `int_*` locais parecem altamente compatíveis para paleta clínica;
- os assets locais seguem sendo bons candidatos para a V1, mesmo sem correspondência literal de nome em todos os casos.

### 19.6 Avaliação final e recomendação

- parece usar imagens: sim;
- parece usar CSS `background-image`: sim;
- parece usar canvas: não apareceu evidência;
- parece usar SVG: apareceu apenas em alguns ícones do shell, não como motor principal do odontograma;
- parece usar sprite: não apareceu evidência clara;
- os assets locais provavelmente são compatíveis visualmente: sim.

**Opcao A**: EasyDental Cloud usa imagens/arquivos semelhantes aos assets locais.

Próxima etapa recomendada: substituir o CSS do Brana por assets locais já existentes, começando pelos dentes/arcada e mantendo o fallback atual.

## 20. FC2C-3 - Odontograma com assets locais no frontend-react

- Escopo executado: somente frontend visual da `Ficha clinica`, sem backend, banco, migration ou alteracao operacional.
- Implementacao aplicada: o odontograma do `frontend-react` passou a compor arcadas com `arc_superior_perm.bmp` e `arc_inferior_perm.bmp`, com fileiras auxiliares usando `sim_face_40.bmp` e `arc_faces.bmp`, todos copiados para `frontend-react/public/assets/fichaClinica/odontograma/`.
- As categorias clinicas do shell passaram a consumir imagens locais quando disponiveis, preservando o fallback visual ja existente no codigo.
- O comportamento clinico continua placeholder; nao houve alteracao de persistencia, selecao de paciente ou regras de tratamento.
- Validacao prevista: build do `frontend-react` e comparacao visual fina com o print de referencia da Ficha clinica.

## 21. FC2C-3 - Refino fino do odontograma apos comparacao visual

- A estrategia final passou a usar dentes isolados em 32 posicoes, em vez de arcadas completas, porque a composicao ficou mais ampla e mais proxima do EasyDental Cloud.
- As faces ficaram em duas linhas repetidas com `arc_faces.bmp`, mantendo apenas a presenca visual de separadores odontologicos sem criar miniaturas centrais estranhas.
- A numeracao foi tratada como placeholder visual em hemaxarcos, usando a sequencia `8 7 6 5 4 3 2 1 1 2 3 4 5 6 7 8`.
- O odontograma continua sem logica clinica real, sem selecao funcional de dentes ou faces e sem persistencia.
- O quadro foi reforcado como area branca plana, com borda fina e pequena aba inferior esquerda integrada ao contorno.

## 22. Medicao DOM do odontograma no EasyDental Cloud

### 22.1 Metodo usado

- Sessao autenticada confirmada no navegador in-app do Codex.
- A leitura estrutural foi complementada pelo print de referencia do EasyDental Cloud enviado na tarefa.
- A medicao foi feita sem gravacao, sem criacao de procedimento, sem alteracao de paciente e sem copia de assets.
- Nao houve exposicao de credenciais, token, cookie ou dado clinico.

### 22.2 Tabela 1 - Blocos principais

| Elemento | Tipo DOM | Classe/identificador seguro | Width | Height | X relativo | Y relativo | Observacoes |
|---|---|---|---:|---:|---:|---:|---|
| Quadro externo do odontograma | painel / div ExtJS | sem identificador seguro exposto | 726 px | 316 px | 4 px | 10 px | borda cinza fina e fundo branco muito claro |
| Area interna onde ficam os dentes | painel / div | sem identificador seguro exposto | 706 px | 287 px | 11 px | 22 px | comporta 16 posicoes superiores e 16 inferiores |
| Dentes superiores | img / background-image | shell visual sem id confiavel exposto | 702 px | 86 px | 15 px | 22 px | 16 dentes; passo medio horizontal de 45,1 px |
| Linha de faces superior | img / background-image | shell visual sem id confiavel exposto | 706 px | 29 px | 11 px | 122 px | circulos/placas cinzas no estilo placeholder |
| Numeracao superior | texto | labels numericos sem id confiavel exposto | 706 px | 18 px | 12 px | 151 px | fonte pequena, cinza clara |
| Linha de faces inferior | img / background-image | shell visual sem id confiavel exposto | 706 px | 29 px | 11 px | 184 px | repeticao da grade de faces |
| Dentes inferiores | img / background-image | shell visual sem id confiavel exposto | 706 px | 100 px | 12 px | 219 px | 16 dentes inferiores; composicao mais compacta que a superior |
| Pequena aba / orelha inferior esquerda | div / painel | sem identificador seguro exposto | 24 px | 31 px | 0 px | 314 px | recorte de quadro integrado ao contorno inferior |
| Paleta clinica / categorias | toolbar + icones | palette / toolbar sem id confiavel exposto | 702 px | 78 px | 101 px | 471 px | sequencia compacta de categorias e comandos |
| Abas Boca / Dente | tabs / abas | tabs visiveis sem id confiavel exposto | 214 px | 32 px | 90 px | 561 px | `Boca` ativa e `Dente` inativa |
| Area inferior da mensagem | painel de texto | message area sem id confiavel exposto | 727 px | 323 px | 84 px | 587 px | mensagem centralizada em cinza sobre fundo branco |

### 22.3 Tabela 2 - Itens visuais

| Item | Arquivo / Background | Render width | Render height | Natural size | Observacoes |
|---|---|---:|---:|---|---|
| Dente superior padrao | `dente_vazio.png` / `dente_vazio2.png` no shell ExtJS | 25 a 31 px | 58 a 86 px | n/d no DOM observado | fundo limpo, com leitura anatomica de dente isolado |
| Dente inferior padrao | `dente_vazio.png` / `dente_vazio2.png` no shell ExtJS | 20 a 35 px | 55 a 80 px | n/d no DOM observado | formato mais compacto, com cauda visual inferior |
| Face superior | background-image / icone simples | 34 px | 29 px | n/d no DOM observado | contorno cinza, sem preenchimento pesado |
| Face inferior | background-image / icone simples | 34 px | 29 px | n/d no DOM observado | repeticao identica da grade superior |
| Paleta clinica | icones pequenos do shell | 24 px a 40 px | 24 px a 25 px | n/d no DOM observado | linguagem visual compacta, com baixa altura util |
| Barra de acao clinica | toolbar / icones pequenos | 20 px a 24 px | 20 px a 24 px | n/d no DOM observado | altura visual enxuta, sem ocupar o quadro principal |

### 22.4 Tabela 3 - Espacamentos

| Relacao | Medida em px | Observacao |
|---|---:|---|
| quadro -> primeira linha de dentes | 12 px | margem superior curta, sem o efeito de card solto |
| dentes superiores -> faces superiores | 15 px | separacao vertical curta, mantendo a leitura da arcada |
| faces superiores -> numeracao | 7 px | texto fica colado a linha de faces para leitura rapida |
| numeracao -> faces inferiores | 18 px | respiro intermediario entre as grades |
| faces inferiores -> dentes inferiores | 15 px | distancia semelhante a linha superior |
| odontograma -> paleta clinica | 33 px | a paleta entra logo abaixo do quadro, sem grande vazamento vertical |
| paleta -> abas Boca / Dente | 12 px | distancia pequena, com transicao clara para a area inferior |

### 22.5 Leitura tecnica

- O EasyDental usa um odontograma mais compacto e mais vertical do que a versao atual do Brana.
- As arcadas ocupam um quadro com borda leve e fundo branco quase plano, sem sombra forte.
- As duas linhas de faces ficam entre as arcadas e a numeracao, reforcando a leitura clinica sem ocupar muito espaco.
- A paleta clinica fica imediatamente abaixo do quadro, com icones pequenos e densidade visual alta.
- A area inferior de mensagem e grande, mas visualmente muito limpa, deixando o foco no odontograma.

## 23. Comparacao com o Brana Cloud atual

### 23.1 Leitura geral

- O Brana Cloud atual ainda mostra o shell da `Ficha clinica`, mas nao expoe a mesma composicao compacta do odontograma do EasyDental Cloud na captura atual.
- A tela do Brana esta mais aberta, com card hero maior no topo e blocos laterais mais vazios.
- O EasyDental tem um bloco odontologico bem mais denso, com quadro, arcadas, faces, paleta e abas empilhadas.

### 23.2 Comparacao resumida

| Medida | EasyDental Cloud | Brana Cloud atual | Leitura |
|---|---:|---:|---|
| largura do quadro principal | 726 px | nao exposto como odontograma real na captura atual; o card principal do shell fica por volta de 1.57k px de largura | o Brana ainda esta em shell amplo, nao no bloco odontologico compacto |
| altura do quadro principal | 316 px | cerca de 283 px no card hero superior | o Brana precisa ganhar mais densidade vertical no fluxo odontologico |
| altura dos dentes | 58 a 86 px | nao exposto como bloco dental real na captura atual | falta o stack odontologico final |
| largura dos dentes | 20 a 35 px | nao exposto como bloco dental real na captura atual | falta a leitura de dente isolado/arcada compacta |
| espacamento vertical entre linhas | 7 a 18 px, conforme a transicao | nao exposto como bloco dental real na captura atual | o Brana ainda nao reproduz a sequencia fina de linhas |
| distancia odontograma -> paleta | 33 px | nao exposto como bloco dental real na captura atual | a paleta precisa ficar muito mais proxima do quadro |

### 23.3 Conclusao da comparacao

- O Brana atual precisa sair do aspecto de card de dashboard e assumir um shell odontologico mais denso.
- A referencia do EasyDental sugere quadro branco plano, borda fina, arcadas compactas e paleta logo abaixo.
- O principal ganho nao e so trocar desenho de dente, mas acertar proporcao, densidade e espacamento vertical.

## 24. Recomendacao tecnica para o proximo ajuste

- Largura alvo do quadro: manter algo muito proximo de 726 px no bloco odontologico principal.
- Altura alvo do quadro: cerca de 316 px para a area das arcadas.
- Dentes superiores: alvo entre 24 px e 26 px de largura, com altura visual entre 58 px e 78 px.
- Dentes inferiores: alvo entre 20 px e 35 px de largura, com altura visual entre 55 px e 80 px.
- Faces: manter 34 px por 29 px, em duas linhas compactas.
- Distancias alvo: 15 px entre dentes e faces, 7 px entre faces e numeracao, e cerca de 33 px entre odontograma e paleta.
- Estrategia para remover o fundo cinza: usar fundo branco plano, borda cinza clara fina e sombra praticamente inexistente.
- Estrategia para arcada: preferir dentes isolados bem alinhados a uma arcada unica muito larga, porque a leitura do EasyDental parece mais modular e menos `bitmap inteiro`.
- Sobre os BMPs atuais: eles sao uteis como base, mas a composicao final fica melhor quando o desenho e limpo, leve e com transparencia bem controlada.
- Proxima evolucao sugerida: ajustar primeiro proporcao e espaco, depois refinar os assets se ainda houver distancia visual relevante.

## 25. Fase FC2C-6 - Aplicacao das proporcoes medidas do EasyDental Cloud

### 25.1 Referencia usada

- Quadro externo: aproximadamente `726 x 316 px`.
- Area interna: aproximadamente `706 x 287 px`.
- Passo horizontal medio entre dentes: aproximadamente `45,1 px`.
- Faces: aproximadamente `34 x 29 px`.
- Dentes superiores: aproximadamente `25-31 px` de largura e `58-86 px` de altura.
- Dentes inferiores: aproximadamente `20-35 px` de largura e `55-80 px` de altura.
- Paleta clinica: aproximadamente `702 x 78 px`.
- Abas Boca/Dente: aproximadamente `214 x 32 px`.
- Distancia odontograma -> paleta: aproximadamente `33 px`.

### 25.2 Ajustes aplicados no Brana

- O quadro do odontograma foi compactado visualmente e perdeu a sensacao de card alto demais.
- A coluna esquerda ficou mais alinhada ao topo e passou a ocupar menos altura inutil.
- O odontograma interno recebeu linhas mais proximas da referencia e espaco vertical reduzido.
- Os dentes foram aumentados um pouco e passaram a ocupar shells com recorte mais limpo.
- As faces foram ampliadas e ganharam leitura mais proxima da referencia EasyDental.
- A numeracao ficou menor, mais leve e mais colada as faces.
- A paleta clinica foi apertada para ficar mais proxima do bloco odontologico.
- As abas `Boca` e `Dente` ficaram mais planas, compactas e com menor margem.
- A area inferior de mensagem ficou menos alta e mais limpa.

### 25.3 Limitacoes de asset

- Os BMPs de dente continuam sendo assets legados RGB sem alpha.
- Se algum fundo cinza persistir, a causa mais provavel e a propria arte do arquivo, nao a geometria do shell.
- Foi aplicado recorte/encaixe visual no CSS para reduzir o impacto do quadrado aparente.
- Nao houve tentativa de criar novo asset, nem de baixar imagem do EasyDental Cloud.

## 26. Fase FC2C-7 - Limpeza dos dentes com PNGs locais transparentes

### 26.1 O que foi feito

- Os BMPs locais usados pelo odontograma foram convertidos para PNG transparente em `frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/`.
- A derivacao foi feita somente a partir dos arquivos ja existentes no repositorio, sem copiar, baixar ou recriar assets do EasyDental Cloud.
- O componente `FichaClinicaPage.jsx` passou a apontar para os PNGs limpos, preservando a mesma familia de nomes dos dentes.
- O CSS da ficha clinica teve o shell dos dentes neutralizado para nao desenhar fundo cinza proprio por tras das imagens.

### 26.2 Efeito esperado

- O quadrado cinza dos BMPs deixa de aparecer como bloco visivel por tras dos dentes.
- A silhueta do dente continua com proporcao parecida com a medida visual anterior.
- A tela permanece baseada em assets locais do Brana Cloud e nao depende de imagem externa.

### 26.3 Observacao tecnica

- A pasta nova e paralela a pasta legada de BMPs, para manter o historico intacto e facilitar comparacao futura.
- Se houver novo refinamento de proporcao, ele deve partir dessa base limpa e nao da copia direta de referencia externa.

### 26.4 O que continua placeholder

- O odontograma continua sem clique funcional em dente.
- A selecao de faces continua sem efeito clinico real.
- Nao existe persistencia operacional.
- Nao existe backend novo, banco novo ou fluxo de tratamento novo.
- O painel de Tratamento central nao recebeu comportamento funcional adicional.

## 27. Fase FC2C-8 - Polimento fino do odontograma

### 27.1 Ajustes visuais aplicados

- Os dentes foram ampliados levemente para ocupar melhor a area util do quadro.
- O espa�o branco abaixo da arcada foi reduzido por compactacao do frame e do canvas do odontograma.
- As faces/circulos ficaram mais leves, com menor contraste e leitura mais suave.
- A paleta clinica recebeu polimento fino com menos espacamento, botoes mais compactos e iconografia levemente menor.
- A area inferior de mensagem foi elevada e compactada para reduzir vazio visual entre as faixas.

### 27.2 Efeito esperado

- O lado esquerdo da Ficha clinica fica mais denso e mais proximo da referencia EasyDental Cloud.
- A composicao continua limpa, tecnica e sem exagero de escala.
- O escopo permanece visual, sem qualquer logica clinica real, sem clique funcional e sem persistencia.

## 28. Fase FC2C-9 - Refino da barra horizontal de especialidades

### 28.1 Ajustes visuais aplicados

- A barra de especialidades abaixo do odontograma foi refinada para ficar mais compacta e mais proxima do EasyDental Cloud.
- A navegação horizontal foi tratada visualmente com trilha rolavel, setas laterais discretas e bloco inicial de menu.
- Os itens de especialidade ficaram menores, mais técnicos e com melhor alinhamento visual.
- A especialidade ativa recebeu destaque discreto para lembrar o estado selecionado da faixa original.

### 28.2 Efeito esperado

- A faixa passa a parecer um controle horizontal de sistema, e nao um conjunto de chips modernos.
- O escopo continua estritamente visual, sem clique clinico funcional, sem filtro real e sem persistencia.

## 29. Fase FC2C-10 - Varredura e refino da barra horizontal de especialidades

### 29.1 Ajustes visuais aplicados

- A barra de especialidades foi reorganizada como um scroller de blocos com icone acima do rotulo.
- O bloco passou a usar assets locais do acervo do projeto, preservando o shell da Ficha clinica.
- O comportamento de overflow horizontal ficou mais proximo da leitura vista no EasyDental Cloud.

### 29.2 Efeito esperado

- A faixa fica mais densa e mais tecnica, sem virar chip moderno.
- O escopo segue estritamente visual, sem backend, banco, migration ou persistencia clinica.

## 30. Fase FC2C-11 - Separacao entre procedimentos e especialidades

### 30.1 Ajustes visuais aplicados

- A area abaixo do odontograma foi corrigida para duas camadas distintas.
- A camada superior agora mostra procedimentos visuais da especialidade ativa usando assets locais do projeto.
- A camada inferior agora mostra apenas as 18 especialidades abreviadas, em barra horizontal rolavel.
- O comportamento observado no EasyDental Cloud foi usado como referencia visual, sem copiar assets do Cloud.

### 30.2 Efeito esperado

- A leitura estrutural fica mais fiel ao EasyDental Cloud.
- A faixa superior permanece placeholder visual e a troca clinica real continua fora de escopo.
- O escopo segue sem backend, sem banco e sem migration.

## 31. Fase FC2C-12 - Rolagem horizontal das barras de procedimentos e especialidades

### 31.1 Ajustes visuais aplicados

- As setas laterais passaram a controlar a rolagem horizontal local das duas barras abaixo do odontograma.
- A barra superior rola os ícones de procedimentos da especialidade ativa.
- A barra inferior rola as especialidades abreviadas.
- O comportamento segue visual/local, sem filtro clínico real.

### 31.2 Efeito esperado

- O usuário consegue navegar pelos itens que não cabem de uma vez na tela.
- A estrutura continua sem persistência, sem backend e sem lógica clínica funcional.
## 32. Fase FC2C-13 - Compactacao do bloco esquerdo

### 32.1 Ajustes visuais aplicados

- O quadro do odontograma foi compactado para reduzir a sensacao de bloco esticado.
- O espaco branco abaixo da arcada foi reduzido e a altura util da area ficou mais enxuta.
- As barras de procedimentos e especialidades passaram a acompanhar melhor a largura compacta do odontograma.
- A densidade vertical do conjunto foi refinada com menos vazios entre quadro, barras, abas e area de mensagem.
- A area inferior da mensagem foi elevada e compactada para ficar mais proxima do topo da zona util.

### 32.2 Efeito esperado

- O bloco esquerdo da Ficha clinica fica mais denso, proporcional e proximo da referencia EasyDental Cloud.
- O ajuste continua somente visual, sem clique clinico real, sem backend, sem banco e sem persistencia.

## 33. Fase FC2C-14 - Reducao horizontal adicional do bloco esquerdo

### 33.1 Ajustes visuais aplicados

- O bloco esquerdo foi reduzido mais uma vez em largura para buscar o limite visual indicado pela linha azul do print de referencia.
- O quadro do odontograma e as barras abaixo ficaram mais estreitos e contidos.
- O conjunto passou a se organizar como um bloco unico mais compacto, sem espalhar tanto os elementos laterais.
- A compactacao anterior foi preservada, com pouca folga vertical e leitura densa do conjunto.

### 33.2 Efeito esperado

- O bloco esquerdo fica mais proximo da referencia visual do EasyDental Cloud.
- O ajuste continua somente visual, sem clique clinico real, sem backend, sem banco e sem persistencia.
