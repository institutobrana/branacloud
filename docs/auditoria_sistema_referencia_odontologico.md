# Auditoria do sistema odontologico de referencia

## Aviso de escopo e seguranca

O sistema externo aberto no navegador do ambiente Codex foi usado apenas como referencia visual e funcional para estudo.

Nesta etapa:

- nao houve copia de codigo;
- nao houve copia de assets;
- nao houve copia de textos proprietarios longos;
- nao houve registro de credenciais;
- nao houve extracao de endpoints internos;
- nao houve alteracao de dados;
- nao houve scrapping automatizado.

Se algum dado sensivel apareceu na interface, ele foi tratado apenas de forma generica nesta auditoria.

## Mapa de modulos observados

| Modulo | Caminho / menu observado | Finalidade | Observacoes para o Brana Cloud | Prioridade sugerida |
|---|---|---|---|---|
| Avisos | Aba inicial do painel | Centraliza comunicados e widgets operacionais | Serve como modelo de home informativa sem excesso visual | Alta |
| Painel | Aba superior do painel | Consolida visão executiva do dia | Pode inspirar a pagina inicial autenticada do Brana | Alta |
| Analise de agenda | Aba superior | Visao analitica de agenda | Referencia para futuras telas de agenda e monitoramento | Media |
| Analise de vendas | Aba superior | Visao de performance comercial | Pode orientar futuros resumos financeiros e de produção | Media |
| Analise financeira | Aba superior | Visao financeira resumida | Referencia para dashboards futuros | Media |
| Pacientes | Menu lateral / busca superior | Cadastro e consulta de pacientes | Deve virar primeiro contrato funcional do novo frontend | Alta |
| Agenda | Menu rapido / modulo principal | Controle de agendamentos | Relevante para fase posterior apos Pacientes | Alta |
| Financeiro | Menu rapido / modulo principal | Recebimentos, despesas e caixas | Referencia para separacao de areas financeiras | Media |
| Configuracao / sistema | Menu lateral e topo | Ajustes administrativos | Apenas mapear organizacao; nao copiar permissao nem estrutura interna | Baixa |
| Suporte / avisos laterais | Cards laterais | Informacao auxiliar e suporte | Pode inspirar cards laterais, sem copiar conteudo ou imagens | Baixa |

## Mapa do shell visual

### Lateral

- Barra lateral estreita em cor teal.
- Navegacao por icones, com area fixa e pouca largura.
- O rodape visual nao domina a tela.
- A lateral serve como rota principal para os modulos operacionais.

### Topo

- Barra superior clara com logo a esquerda.
- Sequencia de icones de acesso rapido.
- Campo de busca de paciente na regiao superior central.
- Area de usuario no canto direito.

### Busca

- A busca de paciente fica no topo, acessivel antes mesmo de entrar nos modulos.
- O sistema reforca a ideia de "paciente em uso" a partir da barra superior.

### Area central

- Conteudo distribuido em tabs e cards.
- O painel inicial mostra cards informativos e estados operacionais.
- A area central e usada como superficie principal de leitura e acao.

### Acoes rapidas

- Existem icones de atalho no topo para tarefas frequentes.
- Os atalhos funcionam como reforco do fluxo operacional, reduzindo cliques.

### Navegacao

- O modelo geral combina lateral + topo + tabs.
- A navegaçao privilegia acesso rapido e visual limpo.

## Mapa funcional por modulo

### Avisos / Painel

- Objetivo: mostrar resumo operacional e comunicados.
- Campos principais: saudacao, ultimo acesso, validade de licenca, contadores de avisos.
- Botoes principais: abrir seccoes, acessar itens de configuracao e suporte.
- Abas: Avisos, Painel, Analise de agenda, Analise de vendas, Analise financeira.
- Fluxo basico: login -> painel -> leitura dos blocos de status.
- Adaptar para o Brana Cloud: home autenticada com cards de situacao e informacao util.
- Nao copiar: textos de suporte, imagens e frases institucionais do sistema externo.

### Pacientes

- Objetivo: localizar e abrir o paciente em uso.
- Campos principais: pesquisa, filtros basicos e lista.
- Botões principais: pesquisar, selecionar, limpar.
- Abas: nao ficou confirmado como estrutura tabulada nesta observacao; o foco aparece na busca e na selecao.
- Fluxo basico: pesquisar -> selecionar -> abrir contexto do paciente.
- Adaptar para o Brana Cloud: tela somente leitura inicial, com busca e lista simples.
- Nao copiar: dados reais, labels proprietarios longos ou qualquer identificador sensivel.

### Ficha clinica / cadastro

- Objetivo: concentrar dados do paciente e informacoes clinicas.
- Campos principais: nao foram todos abertos nesta auditoria; a organizacao parece segmentada por grupos.
- Botões principais: salvar, cancelar, editar, anexar quando aplicavel.
- Abas: estrutura por abas e seccoes e provavel, mas nao foi auditada em profundidade nesta etapa.
- Fluxo basico: abrir paciente -> consultar/editar grupos -> salvar ou sair.
- Adaptar para o Brana Cloud: divisao clara por blocos e leitura facil.
- Nao copiar: estrutura textual ou rótulos proprietarios nao observados de forma completa.

### Odontograma

- Objetivo: registrar e visualizar status dental e procedimentos.
- Campos principais: arcadas, dentes, faces, estados de procedimento.
- Botões principais: selecionar procedimento, registrar, alternar estados, abrir tratamento.
- Abas: nao detalhadas nesta auditoria.
- Fluxo basico: selecionar paciente -> abrir odontograma -> registrar ou acompanhar procedimentos.
- Adaptar para o Brana Cloud: desenho clinico claro, com foco em legibilidade e estado por cor.
- Nao copiar: assets, icones ou desenho proprietario do sistema externo.

### Tratamentos / orcamentos

- Objetivo: montar planos, procedimentos e valores.
- Campos principais: procedimentos, valores, status e observacoes.
- Botões principais: incluir, remover, aprovar, imprimir, enviar.
- Abas: nao detalhadas nesta auditoria.
- Fluxo basico: paciente -> tratamento -> composicao de procedimentos -> revisao.
- Adaptar para o Brana Cloud: contrato simples e auditavel.
- Nao copiar: regras internas nao visiveis nem textos longos da tela externa.

### Agenda

- Objetivo: organizar compromissos.
- Campos principais: data, horario, profissional, paciente, status.
- Botões principais: criar, reagendar, cancelar, concluir.
- Abas: analises e visoes diferentes aparentes no painel.
- Fluxo basico: selecionar periodo -> agendar -> acompanhar status.
- Adaptar para o Brana Cloud: tela clara, previsivel e com prioridade para fluxo diario.
- Nao copiar: layout especifico ou nomenclaturas proprietarias nao confirmadas.

### Financeiro

- Objetivo: acompanhar entradas, saidas e recebimentos.
- Campos principais: contas, vencimentos, recebimentos e filtros.
- Botões principais: registrar, receber, quitar, imprimir.
- Abas: analises financeiras visiveis no painel.
- Fluxo basico: filtrar -> conferir -> operar lancamentos.
- Adaptar para o Brana Cloud: sumarizacao simples e confiavel.
- Nao copiar: textos de aviso e elementos institucionais do sistema externo.

### Relatorios / documentos

- Objetivo: imprimir ou exportar informacoes operacionais.
- Campos principais: filtros e periodo.
- Botões principais: gerar, imprimir, exportar.
- Abas: nao detalhadas nesta auditoria.
- Fluxo basico: escolher relatorio -> filtrar -> gerar saida.
- Adaptar para o Brana Cloud: area de relatorios enxuta e orientada a tarefa.
- Nao copiar: nomes ou modelos internos nao observados integralmente.

### Configuracoes / usuarios / permissoes

- Objetivo: ajustes administrativos e acesso.
- Campos principais: menus e estruturas de admin.
- Botões principais: abrir, configurar, filtrar.
- Abas: nao detalhadas nesta auditoria.
- Fluxo basico: menu admin -> configurar -> salvar.
- Adaptar para o Brana Cloud: apenas organizacao conceitual de menus.
- Nao copiar: regras de permissao, credenciais ou dados administrativos internos.

## Matriz de aproveitamento para o Brana Cloud

| Item observado | Classificacao |
|---|---|
| Busca de paciente no topo | Adaptar agora |
| Rail lateral estreita por icones | Adaptar agora |
| Tabs superiores do painel | Adaptar agora |
| Card de saudacao e estado de licenca | Adaptar agora |
| Cards laterais de suporte | Adaptar depois |
| Analises de agenda / vendas / financeiro | Adaptar depois |
| Estrutura de odontograma por arcadas e estados | Somente referencia |
| Textos institucionais e suporte do sistema externo | Evitar |
| Imagens, logos, icones e assets do sistema externo | Evitar |
| Regras internas nao confirmadas da ficha clinica | Somente referencia |
| Layout de relatorios e docs nao detalhado | Somente referencia |

## Proxima etapa recomendada

A proxima etapa recomendada para o Brana Cloud e criar o contrato da tela **Pacientes em modo somente leitura** no `frontend-react`, com:

- busca;
- listagem;
- abertura de paciente;
- sem cadastro;
- sem edicao;
- sem exclusao;
- sem odontograma ainda.

Isso oferece a primeira tela funcional real apos o shell inicial, com risco controlado.
