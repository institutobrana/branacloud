# Desenho tecnico preliminar do layout estatico da futura tela principal odontologica

## 1. Objetivo
Este documento registra o desenho tecnico preliminar do layout estatico da futura tela principal odontologica.

Esta e uma etapa documental.
Nenhuma implementacao foi iniciada.
O objetivo e orientar uma futura implementacao modular, sem aumentar o monolitico.

## 2. Premissas principais
- tela especifica de Odontologia;
- subpartes core/comum quando aplicavel;
- layout inicialmente estatico, sem dados reais;
- sem persistencia;
- sem endpoints novos;
- sem alteracao de banco;
- sem reaproveitamento/copiacao de assets do EasyDental;
- sem edicao clinica do odontograma nesta primeira versao;
- foco em equivalencia estrutural inicial, nao em equivalencia total de todas as funcoes.

## 3. Local de entrada futuro no Brana Cloud

### 3.1 Proposta de entrada
Para a futura implementacao, a entrada mais segura e tratar a tela como uma area odontologica propria, com integracao visual a partir do shell existente.

Proposta documental:
- entrar por um ponto de navegacao odontologico ja reconhecivel no Brana Cloud;
- manter uma rota/estado proprio do frontend para nao depender do fluxo global;
- depender de paciente ativo apenas no modo funcional futuro, nao no layout estatico inicial;
- manter um ponto de integracao pequeno, isolavel e removivel.

### 3.2 Onde a tela poderia ser chamada
Os pontos de integracao futuros mais provaveis, sem alteracao agora, sao:
- `frontend/index.html` como shell global;
- `frontend/js/modules/odontograma-v1-shell.js` como moldura visual ja existente;
- `frontend/js/modules/odontograma-v1.js` como coordenador do fluxo odontologico atual;
- `frontend/js/modules/odontograma-v1-paciente-search.js` como ponto de contexto de paciente;
- `frontend/js/modules/odontograma-v1-history-grid.js` como apoio a historico visual;
- `frontend/js/modules/agenda-principal-legado-utils.js` e `frontend/js/modules/agenda-principal-semana-utils.js` como apoio de agenda;
- `frontend/js/modules/ficha-pessoal-aba-historico.js` como referencia funcional de grade/historico;
- `frontend/js/modules/procedimentos-genericos.js` e `frontend/js/modules/intervencoes-procedimentos.js` como apoio de catalogo/procedimentos.

### 3.3 Decisao tecnica sugerida
- deve existir uma area/tela odontologica propria;
- deve haver rota/estado proprio no frontend;
- o menu existente pode ser apenas um ponto de entrada futuro;
- a tela nao deve nascer dependente de backend real na fase estatico-visual;
- o paciente ativo so deve ser exigido na fase funcional posterior.

## 4. Arquivos novos planejados

### 4.1 `frontend/js/modules/tela-principal-odontologica.js`
- Responsabilidade: coordenar a tela principal odontologica futura.
- Classificacao: especifico de Odontologia.
- Dependencias: shell global, estado visual, paciente futuro, agenda futura, historico futuro.
- Risco: alto se concentrar regras demais.
- Motivo para existir separado: evitar que a tela volte a virar monolito.
- Nao deve conter: acesso direto a banco, payloads, regras de permissao ou logica de escrita.

### 4.2 `frontend/js/modules/tela-principal-odontologica-layout.js`
- Responsabilidade: estruturar a composicao visual em regioes.
- Classificacao: especifico de Odontologia.
- Dependencias: contrato funcional, shell, tamanhos, estados visuais.
- Risco: medio.
- Motivo para existir separado: isolar a geografia da tela do resto das regras.
- Nao deve conter: fetch, gravacao, regras clinicas ou integração com dados reais.

### 4.3 `frontend/js/modules/tela-principal-odontologica-estado.js`
- Responsabilidade: controlar estados sem paciente, com paciente mockado e erro visual.
- Classificacao: core/comum com uso odontologico.
- Dependencias: layout, simuladores locais, contrato de estado.
- Risco: medio.
- Motivo para existir separado: permitir trocar estados sem tocar no layout.
- Nao deve conter: persistencia, backend, banco ou manipulacao real de agenda.

### 4.4 `frontend/js/modules/tela-principal-odontologica-odontograma.js`
- Responsabilidade: renderizacao visual do bloco de odontograma.
- Classificacao: especifico de Odontologia.
- Dependencias: layout, estados visuais, futura camada de desenho dental.
- Risco: alto.
- Motivo para existir separado: manter a parte mais sensivel isolada.
- Nao deve conter: edicao real, payloads, rotas ou persistencia.

### 4.5 `frontend/js/modules/tela-principal-odontologica-historico.js`
- Responsabilidade: renderizacao da grade inferior e do historico visual.
- Classificacao: especifico de Odontologia.
- Dependencias: layout, estado, dados mockados futuros.
- Risco: alto.
- Motivo para existir separado: evitar acoplamento com a aba Historico existente.
- Nao deve conter: alteracao da ficha pessoal real ou escrita clinica.

### 4.6 `frontend/js/modules/tela-principal-odontologica-procedimentos.js`
- Responsabilidade: area visual de procedimentos e filtro de tratamento.
- Classificacao: especifico de Odontologia.
- Dependencias: catalogo visual, layout, estado.
- Risco: alto.
- Motivo para existir separado: isolar catalogo e interface de selecao.
- Nao deve conter: tabelas reais, seeds, escrita ou validacao backend.

### 4.7 `frontend/js/modules/tela-principal-odontologica-agenda-resumo.js`
- Responsabilidade: painel visual da agenda resumida do dia.
- Classificacao: core/comum com uso odontologico.
- Dependencias: layout, estado, agenda futura controlada.
- Risco: medio.
- Motivo para existir separado: permitir desligar agenda sem quebrar a tela.
- Nao deve conter: agenda real, endpoints ou sincronizacao.

### 4.8 `frontend/js/modules/tela-principal-odontologica-toolbar.js`
- Responsabilidade: toolbar especifica da tela.
- Classificacao: core/comum com uso odontologico.
- Dependencias: shell, layout, estados visuais.
- Risco: medio.
- Motivo para existir separado: preservar a barra de acoes como modulo isolado.
- Nao deve conter: eventos globais, atalho de sistema ou acoplamento com app.js.

### 4.9 `frontend/js/modules/tela-principal-odontologica-contratos.js`
- Responsabilidade: centralizar contratos de estado, area e regra visual futura.
- Classificacao: core/comum.
- Dependencias: documentos de contrato funcional e desenho tecnico.
- Risco: medio.
- Motivo para existir separado: guardar as regras de fronteira fora do layout.
- Nao deve conter: render, fetch, banco ou logica de negocio real.

## 5. Arquivos existentes que nao devem ser tocados inicialmente

### 5.1 `frontend/app.js`
- Motivo para nao mexer agora: e a camada global mais sensivel e pode aumentar o monolitico.
- Risco de alteracao: muito alto.
- Condicao futura para poder mexer: apenas com wrapper minimo e autorizacao especifica.

### 5.2 `frontend/index.html`
- Motivo para nao mexer agora: e shell global protegida pelo contrato de blindagem.
- Risco de alteracao: alto.
- Condicao futura para poder mexer: somente se um wrapper minimo de entrada for formalmente autorizado.

### 5.3 Arquivos de agenda principal
- Motivo para nao mexer agora: ja possuem responsabilidade propria e podem ser afetados por acoplamento indevido.
- Risco de alteracao: alto.
- Condicao futura para poder mexer: somente com contrato proprio de integracao de agenda odontologica.

### 5.4 Arquivos de ficha pessoal
- Motivo para nao mexer agora: ja sustentam historico e anamnese com contratos proprios.
- Risco de alteracao: alto.
- Condicao futura para poder mexer: apenas apos definir fronteira clara entre ficha pessoal e tela odontologica.

### 5.5 Arquivos de odontograma V1 existentes
- Motivo para nao mexer agora: ja sao a base tecnica atual e podem servir como ponto de integracao futura.
- Risco de alteracao: alto.
- Condicao futura para poder mexer: somente se a nova tela reutilizar pontos bem delimitados sem refatoracao ampla.

### 5.6 Arquivos de procedimentos e tabelas
- Motivo para nao mexer agora: envolvem catalogos, seeds e contratos sensiveis.
- Risco de alteracao: alto.
- Condicao futura para poder mexer: apenas com contrato tecnico proprio e sem escrita antecipada.

### 5.7 Backend
- Motivo para nao mexer agora: a etapa atual e somente visual/documental.
- Risco de alteracao: muito alto.
- Condicao futura para poder mexer: somente depois do layout estatico estar fechado e aprovado.

### 5.8 Schema, migrations e seeds
- Motivo para nao mexer agora: podem alterar base, compatibilidade e comportamento estrutural.
- Risco de alteracao: muito alto.
- Condicao futura para poder mexer: apenas em subetapa propria, com contrato de persistencia.

## 6. Arquitetura visual planejada

### 6.1 Shell/menu superior
- Função visual: contexto global da aplicação e entrada da tela.
- Comportamento estatico inicial: barra superior presente, sem acao funcional real.
- Comportamento futuro com dados reais: navegação para subareas e comandos.
- Dependencia futura: shell global e permissao.
- Risco: medio.
- Criterios de aceite visual: alinhamento, altura consistente e ausencia de quebra de layout.

### 6.2 Toolbar superior
- Função visual: acoes rapidas da tela odontologica.
- Comportamento estatico inicial: icones ou botoes apenas decorativos/placeholder.
- Comportamento futuro com dados reais: acionar rotinas da tela.
- Dependencia futura: modulo proprio de toolbar.
- Risco: medio.
- Criterios de aceite visual: densidade visual correta e separacao clara do shell.

### 6.3 Linha de paciente ativo
- Função visual: identificacao do paciente e do contexto atual.
- Comportamento estatico inicial: linha vazia ou mockada.
- Comportamento futuro com dados reais: codigo, nome e estado do atendimento.
- Dependencia futura: paciente ativo.
- Risco: alto.
- Criterios de aceite visual: estado vazio e preenchido claramente distintos.

### 6.4 Area central esquerda do odontograma
- Função visual: bloco central do odontograma e da arcada.
- Comportamento estatico inicial: desenho neutro, sem edicao.
- Comportamento futuro com dados reais: estados visuais da arcada e do tratamento.
- Dependencia futura: modulo odontograma proprio.
- Risco: alto.
- Criterios de aceite visual: proporcao, clareza dos blocos e separacao das regioes.

### 6.5 Area de filtro/tratamento
- Função visual: seletor de escopo de tratamento.
- Comportamento estatico inicial: apenas representacao visual.
- Comportamento futuro com dados reais: filtro real do tratamento ativo.
- Dependencia futura: contrato de tratamento.
- Risco: medio/alto.
- Criterios de aceite visual: posicao coerente e legibilidade.

### 6.6 Lista/tabela de procedimentos
- Função visual: lista de procedimentos e suporte de selecao.
- Comportamento estatico inicial: apenas estrutura visual.
- Comportamento futuro com dados reais: lista filtravel e contextual.
- Dependencia futura: catalogo proprio de procedimentos.
- Risco: alto.
- Criterios de aceite visual: grade/colunas e densidade equivalentes ao contrato.

### 6.7 Atalhos laterais
- Função visual: acoes curtas e foco operacional.
- Comportamento estatico inicial: placeholders, sem acao real.
- Comportamento futuro com dados reais: comandos de contexto.
- Dependencia futura: toolbar/acoes da tela.
- Risco: medio.
- Criterios de aceite visual: alinhamento lateral e ninguem invadindo o painel central.

### 6.8 Area superior direita com abas/resumos
- Função visual: contexto de paciente, tratamento, observacoes, imagens, documentos e agenda.
- Comportamento estatico inicial: abas ou faixas apenas visuais.
- Comportamento futuro com dados reais: conteudo por aba.
- Dependencia futura: contratos proprios de cada subarea.
- Risco: medio.
- Criterios de aceite visual: divisao clara e leitura facil.

### 6.9 Agenda resumida do dia
- Função visual: painel resumido de compromissos.
- Comportamento estatico inicial: linhas e horarios mockados.
- Comportamento futuro com dados reais: agenda real apenas depois.
- Dependencia futura: modulo de agenda proprio.
- Risco: medio.
- Criterios de aceite visual: nao competir com o odontograma.

### 6.10 Grade inferior de historico/procedimentos
- Função visual: narrativa clinica e lista de registros.
- Comportamento estatico inicial: grade vazia ou mockada.
- Comportamento futuro com dados reais: historico carregado por paciente/tratamento.
- Dependencia futura: contrato de historico.
- Risco: alto.
- Criterios de aceite visual: alinhamento de colunas e vazios controlados.

### 6.11 Rodape/status, se aplicavel
- Função visual: estado, feedback e mensagens nao clinicas.
- Comportamento estatico inicial: opcional e discreto.
- Comportamento futuro com dados reais: feedback de selecao ou modo.
- Dependencia futura: shell.
- Risco: baixo/medio.
- Criterios de aceite visual: nao poluir a tela principal.

## 7. Estados visuais estaticos planejados

### Estado 1 - sem paciente aberto
- campo paciente vazio/neutro;
- odontograma neutro;
- historico vazio;
- agenda resumida independente;
- layout preservado sem dados reais.

### Estado 2 - com paciente ativo simulado
- codigo/nome preenchidos com dados mockados;
- odontograma ainda visual/neutro ou com marcacao simulada controlada;
- historico inferior com linhas mockadas;
- sem persistencia.

### Estado 3 - paciente ativo sem historico
- paciente ativo simulado;
- historico vazio com layout preservado;
- nenhuma quebra de geometria.

### Estado 4 - erro/ausencia de dados simulada
- layout continua intacto;
- blocos exibem vazio controlado;
- erro nao derruba a tela.

Esses estados sao apenas planejamento e nao devem ser implementados nesta etapa.

## 8. Regras para futura implementacao esttica
- usar dados mockados locais apenas na etapa visual, se autorizado futuramente;
- nao consultar backend inicialmente;
- nao gravar nada;
- nao alterar paciente real;
- nao alterar historico real;
- nao alterar agenda real;
- nao alterar odontograma real;
- nao alterar procedimentos reais;
- nao copiar assets do EasyDental;
- nao aumentar `frontend/app.js`;
- criar modulos pequenos;
- preservar wrappers/fallbacks;
- permitir desligar/remover a tela sem afetar modulos existentes.

## 9. Integracoes proibidas na primeira implementacao visual
- banco;
- backend;
- endpoints;
- agenda real;
- paciente real;
- historico real;
- procedimentos reais;
- permissoes;
- edicao de odontograma;
- upload/visualizacao real de imagens;
- documentos reais;
- faturamento/financeiro.

## 10. Criterios de aceite para futura Subetapa D real
- abrir a tela sem erro;
- nao alterar `app.js`, salvo wrapper minimo previamente autorizado;
- nao quebrar telas existentes;
- nao chamar backend;
- nao gravar dados;
- layout distinguir claramente estado sem paciente e com paciente mockado;
- historico mockado renderizar sem afetar historico real;
- agenda resumida ser apenas visual;
- odontograma ser apenas visual;
- testes manuais definidos.

## 11. Onde testar futuramente
Quando a implementacao for autorizada, o teste devera ocorrer:
- no frontend local do Brana Cloud;
- no menu/tela futura definida;
- no estado sem paciente;
- no estado com paciente mockado;
- validando que agenda, ficha pessoal e odontograma existentes continuam funcionando;
- confirmando que nenhum dado real foi alterado.

## 12. Riscos tecnicos
- risco de duplicar logica existente;
- risco de aumentar o monolitico;
- risco de acoplar tela nova com modulos antigos;
- risco de misturar mock com dados reais;
- risco de confundir layout estatico com implementacao funcional;
- risco de usar assets do EasyDental;
- risco de mexer em banco antes da hora;
- risco de mexer na agenda principal;
- risco de mexer na ficha pessoal;
- risco de mexer no odontograma V1 atual.

## 13. Proxima etapa recomendada
Recomendo a Subetapa D1: implementacao minima do esqueleto visual estatico, sem dados reais e sem backend.

## 14. Registro para roadmap
- criacao do desenho tecnico preliminar do layout estatico;
- confirmacao de que a implementacao ainda nao comecou;
- arquivos novos planejados registrados;
- arquivos existentes protegidos registrados;
- proxima etapa recomendada: D1 implementacao minima do esqueleto visual estatico, se autorizada.
