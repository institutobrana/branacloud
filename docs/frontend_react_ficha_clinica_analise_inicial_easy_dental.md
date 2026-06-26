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
