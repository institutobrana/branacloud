# Contrato funcional da tela principal odontologica inspirada no EasyDental

## 1. Objetivo
Este documento define o contrato funcional da tela principal odontologica inspirada no EasyDental.

Esta e uma etapa documental.
Nenhuma implementacao foi iniciada.
Nao ha mudanca de backend, banco, seeds, endpoints, assets ou `frontend/app.js` nesta etapa.

## 2. Escopo funcional da tela
A tela principal odontologica inclui os seguintes blocos funcionais:

- menu superior;
- toolbar superior;
- identificacao do paciente ativo;
- estado sem paciente aberto;
- estado com paciente aberto;
- odontograma;
- filtro de intervencoes/tratamento;
- lista ou tabela de procedimentos;
- historico inferior;
- atalhos laterais;
- area de abas ou resumos: Paciente, Tratamento, Observacoes, Imagens, Documentos e Agenda;
- agenda resumida do dia;
- integracao futura com prontuario e tratamento.

### 2.1 O que pertence a tela principal odontologica
- leitura visual do contexto clinico;
- selecao e exibicao do paciente ativo;
- visualizacao do odontograma;
- leitura do historico clinico/procedimental;
- leitura resumida da agenda;
- navegacao por contexto de atendimento.

### 2.2 O que nao pertence a esta etapa
- edicao clinica completa;
- persistencia final de estados odontologicos;
- mudancas de banco ou schema;
- regras de agenda principal;
- fluxo de cadastro;
- refatoracao ampla de layout;
- copia de assets do EasyDental.

## 3. Classificacao por bloco

| Bloco | Descricao funcional | Classificacao | Depende de paciente ativo | Pode aparecer sem paciente | Exige dados reais | Dependencias provaveis | Risco | Prioridade |
|---|---|---|---|---|---|---|---|---|
| Menu superior | Navegacao global da tela principal | Core/comum | Nao | Sim | Nao | shell global, permissao, rota de tela | Medio | Alta |
| Toolbar superior | Atalhos de acao da tela | Core/comum | Nao | Sim | Nao | shell, estados de botao, contratos de acao | Medio | Alta |
| Paciente ativo | Identifica paciente carregado | Core/comum com uso odontologico | Sim | Sim, em estado neutro | Sim para preenchimento real | busca de paciente, cadastro, sessao | Medio | Alta |
| Estado sem paciente | Tela pronta sem contexto clinico | Especifico de Odontologia | Nao | Sim | Nao | shell, odontograma neutro, agenda resumida | Baixo | Alta |
| Estado com paciente | Tela com contexto clinico carregado | Especifico de Odontologia | Sim | Nao | Sim | paciente ativo, tratamento, historico, agenda | Alto | Alta |
| Odontograma | Representacao visual odontologica | Especifico de Odontologia | Sim | Sim, neutro | Sim para marcar estados | tratamento, arcada, dentes, resumo clinico | Alto | Alta |
| Filtro de intervencoes | Seleciona escopo de tratamento | Especifico de Odontologia | Sim | Sim, desabilitado ou neutro | Sim quando conectado | tratamento, intervencoes, catalogo | Medio | Media |
| Lista/tabela de procedimentos | Mostra procedimentos disponiveis | Especifico de Odontologia | Nao obrigatoriamente | Sim | Idealmente sim | tabela de procedimentos, tratamento, regras de exibicao | Alto | Media |
| Historico inferior | Lista de eventos clinicos | Especifico de Odontologia | Sim para preencher | Sim, vazio | Sim para leitura real | historico, tratamento, prestador, data | Alto | Alta |
| Atalhos laterais | Acoes curtas do contexto odontologico | Especifico de Odontologia | Sim ou nao, conforme atalho | Sim | Nao necessariamente nesta etapa | toolbar, tratamento, procedimentos | Medio | Media |
| Abas/resumos laterais | Contexto paciente/tratamento/imagens/docs/agenda | Core/comum com uso odontologico | Parcialmente | Sim | Algumas areas sim | prontuario, agenda, documentos, imagens | Medio | Alta |
| Agenda resumida | Visao do dia e compromissos | Core/comum com uso odontologico | Nao | Sim | Sim para dados reais | agenda, compromissos, paciente, unidade | Medio | Alta |
| Integracao futura com prontuario/tratamento | Conecta a tela ao fluxo clinico completo | Especifico de Odontologia | Sim | Nao | Sim | prontuario, tratamento, historico, agenda | Alto | Alta |

## 4. Estados obrigatorios da tela

### 4.1 Estado sem paciente aberto
- paciente nao selecionado;
- odontograma em modo neutro;
- historico vazio;
- agenda resumida ainda pode aparecer;
- toolbar e menu permanecem acessiveis;
- areas de contexto existem, mas sem dados clinicos principais.

### 4.2 Estado com paciente aberto
- paciente ativo carregado;
- odontograma contextualizado;
- historico pode ser carregado;
- abas/resumos mostram contexto do atendimento;
- agenda resumida pode refletir compromisso do paciente ou do dia.

### 4.3 Estado com paciente aberto sem historico
- paciente ativo carregado;
- historico vazio;
- nenhuma quebra de layout;
- odontograma continua visivel;
- areas laterais continuam operantes em modo de leitura.

### 4.4 Estado com paciente aberto com historico
- paciente ativo carregado;
- historico preenchido;
- eventos e procedimentos visiveis;
- integracao visual com tratamento mantida.

### 4.5 Estado com agenda carregada
- agenda mostra itens do dia;
- pode existir com ou sem paciente;
- nao deve travar a visualizacao do odontograma;
- deve se comportar como painel de apoio.

### 4.6 Estado sem dados de agenda
- painel de agenda exibe vazio controlado;
- nao quebra a tela;
- continua coerente com a tela principal.

### 4.7 Estado futuro com odontograma editavel
- apenas como subetapa futura;
- depende de contrato proprio;
- nao faz parte da entrega documental atual.

### 4.8 Estado somente leitura
- odontograma e historico podem existir apenas para visualizacao;
- este estado e aceitavel na fase inicial;
- a edicao fica para subetapa futura.

## 5. Regras funcionais por regiao

### 5.1 Campo Paciente
- deve exibir codigo e nome quando houver paciente ativo;
- deve ficar vazio ou neutro quando nao houver paciente ativo;
- nao deve criar paciente nesta etapa;
- nao deve alterar cadastro nesta etapa.

### 5.2 Odontograma
- inicialmente deve ser tratado como bloco visual;
- edicao clinica deve ser subetapa futura;
- marcacoes devem depender do paciente ativo;
- sem paciente, deve aparecer neutro;
- nao alterar persistencia ainda.

### 5.3 Procedimentos
- lista de procedimentos disponiveis;
- filtro de intervencoes/tratamento;
- relacao futura com tabela de procedimentos;
- nao alterar seeds nesta etapa;
- nao alterar backend nesta etapa.

### 5.4 Historico inferior
- deve listar data, cirurgiao/prestador, regiao e descricao;
- sem paciente, deve ficar vazio;
- com paciente, deve carregar dados do historico/tratamento;
- nesta fase ainda nao implementar leitura real.

### 5.5 Agenda resumida
- aparece mesmo sem paciente;
- deve ser tratada como integracao controlada futura;
- nao alterar agenda principal nesta etapa;
- nao alterar endpoints de agenda nesta etapa.

### 5.6 Toolbar e atalhos
- mapear como contrato funcional;
- nao implementar cliques ainda;
- cada atalho deve ser validado em subetapa propria;
- nao copiar icones do EasyDental.

### 5.7 Abas/resumos superiores direitos
- Paciente;
- Tratamento;
- Observacoes;
- Imagens;
- Documentos;
- Agenda;
- definir apenas funcao esperada;
- nao implementar navegacao ainda.

## 6. Limites explicitos do contrato
Este contrato nao faz parte de:

- implementar tela;
- criar componente visual;
- alterar `frontend/app.js`;
- alterar backend;
- alterar banco;
- alterar seeds;
- alterar permissoes;
- alterar agenda;
- alterar ficha pessoal;
- corrigir textos/mojibake fora do escopo;
- copiar assets do EasyDental.

## 7. Dependencias futuras
Dependencias provaveis para fases posteriores:

- paciente ativo;
- ficha pessoal;
- odontograma;
- procedimentos e tabelas de procedimentos;
- historico de tratamento;
- prestadores/cirurgiao;
- agenda;
- documentos e imagens;
- permissoes;
- banco e endpoints futuros.

## 8. Plano de subetapas recomendado apos o contrato
- Subetapa B: inventario do que ja existe no Brana Cloud;
- Subetapa C: inventario tecnico somente leitura das fontes EasyDental;
- Subetapa D: layout estatico inicial sem dados reais;
- Subetapa E: estado sem paciente e estado com paciente ativo;
- Subetapa F: odontograma apenas visual;
- Subetapa G: historico inferior somente leitura;
- Subetapa H: integracao controlada com procedimentos;
- Subetapa I: integracao controlada com agenda;
- Subetapa J: toolbar e atalhos;
- Subetapa K: persistencia, validacao e testes reais.

## 9. Criterios de aceite futuros
- tela abre sem paciente sem erro;
- tela abre com paciente sem erro;
- historico vazio nao quebra layout;
- odontograma visual nao depende de edicao;
- agenda resumida nao interfere na agenda principal;
- toolbar nao executa acao sem contrato;
- nenhuma regra de banco e alterada sem subetapa propria.

## 10. Registro para roadmap
- criacao do contrato funcional da tela principal odontologica;
- confirmacao de que a implementacao ainda nao comecou;
- proxima etapa recomendada: inventario do que ja existe no Brana Cloud.
