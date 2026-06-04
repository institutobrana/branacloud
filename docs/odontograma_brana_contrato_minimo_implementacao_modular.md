# Odontograma Brana - Contrato minimo de implementacao modular

## 1. Objetivo

Definir o menor recorte implementavel e seguro para o futuro odontograma Brana, agora baseado nos fatos confirmados pela auditoria do EasyDental.

Este documento nao implementa nada. Ele apenas registra a direcao minima de arquitetura para uma primeira entrega modular, com backend e frontend separados por responsabilidade e sem arquitetura monolitica.

## 2. Escopo

- Nao e implementacao
- Nao e migration
- Nao e endpoint
- Nao e tela
- Nao altera banco
- Nao altera codigo
- Nao altera frontend
- Nao altera backend
- Nao altera seeds
- Nao altera arquivos do EasyDental

## 3. Confirmacao de etapa somente documental

- Foram usados apenas documentos existentes e consultas de leitura
- Nenhum `UPDATE`, `DELETE`, `INSERT`, `ALTER`, `DROP`, `CREATE` ou `TRUNCATE` foi executado
- Nenhum dado do Brana foi modificado
- Nenhum dado do EasyDental foi modificado
- Nenhuma migration foi criada ou aplicada

## 4. Classificacao do modulo

- Odontograma = modulo especifico de Odontologia
- Nao tratar como modulo core/comum
- Sem controle multiarea nesta etapa

## 5. Diretriz obrigatoria de modularizacao futura

Quando a implementacao real acontecer, a nova tela de odontograma deve seguir modularizacao explicita no backend e no frontend.

Isto significa:
- evitar concentrar logica em `app.js`
- separar leitura, renderizacao, eventos, validacao e acesso a dados
- manter contratos pequenos e claros por bloco
- evitar monolitos funcionais ou arquivos gigantes

## 6. Base documental consultada

- `docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md`
- `docs/odontograma_easydental_diagrama_relacional_contrato_modelagem_brana.md`
- `docs/odontograma_easydental_diagramas_mermaid.md`
- `docs/odontograma_brana_contrato_modelagem_futura.md`
- `docs/odontograma_easydental_validacao_dente_face_status_intervencao.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 7. Achados consolidados usados como premissa

- `ARCADA` e camada estrutural/visual com 32 slots por tratamento na base analisada
- `INTERVENCAO` e camada principal de procedimento
- `DENTE` e camada por intervencao, nao redundante com `ARCADA`
- `FACE` e camada compacta por intervencao, observada como `0..1` no snapshot analisado
- `_STATUS_INTERV` e lookup enxuto de status da intervencao
- `HISTORICO` e majoritariamente narrativo, nao tabela principal de procedimento
- `TAB_PRC_ITEM` aponta para `_SIMBOLO_ODONTO`
- A regra visual nao deve ser simplificada prematuramente para RGB puro
- A futura implementacao deve ser modularizada no backend e frontend, evitando monolitos

## 8. Primeira entrega minima segura

### 8.1 O que entra na V1

A primeira entrega minima segura deve ser conservadora e pequena:

- renderizar a arcada base
- permitir leitura e visualizacao dos slots
- exibir intervencoes por tratamento
- mostrar status basicos de intervencao
- manter vinculo com dente
- aceitar face apenas como apoio opcional, se o dado existir
- nao depender ainda de bitmaps herdados do EasyDental
- nao exigir paridade visual completa do legado

### 8.2 O que a V1 precisa suportar em dados

- paciente
- tratamento
- slots da arcada
- numero do dente FDI
- intervencao por tratamento
- status de intervencao
- vinculo da intervencao com dente
- vinculo opcional com face
- vinculo com procedimento
- observacao resumida
- prestador
- datas minimas relevantes

### 8.3 O que nao entra na V1

- importacao de bitmap do EasyDental
- paridade visual completa do legado
- todas as regras de cor
- todas as sobreposicoes simbolicas
- migracao historica completa
- edicao avancada por face
- recursos graficos complexos
- sincronizacao com documentos e imagens
- automacoes clinicas profundas

## 9. Modulos backend futuros

### 9.1 Proposta de organizacao minima

O backend deve permanecer organizado por responsabilidade. Como o projeto atual trabalha com camadas como `routes`, `services` e `schemas`, a proposta minima e manter o mesmo padrao por dominio odontologico:

- `backend/routes/odontograma_routes.py`
- `backend/services/odontograma_service.py`
- `backend/schemas/odontograma_schema.py`
- `backend/models/odontograma_model.py`
- `backend/mappers/odontograma_mapper.py`
- `backend/contracts/odontograma_contract.py`

### 9.2 Responsabilidade de cada bloco

#### `backend/routes/odontograma_routes.py`
- expor rotas do odontograma
- receber e devolver payloads
- nao conter regra clinica pesada
- nao conter acesso direto complexo ao banco
- risco se virar monolito: concentrar fluxo HTTP, validacao e regras de negocio no mesmo arquivo

#### `backend/services/odontograma_service.py`
- orquestrar regras de negocio do odontograma
- montar visoes de arcada, intervencoes e status
- coordenar dependencias entre tratamento, procedimento, dente e face
- nao conter contrato HTTP
- risco se virar monolito: virar ponto unico de toda regra clinica e visual

#### `backend/schemas/odontograma_schema.py`
- definir contratos de entrada e saida
- validar campos minimos
- manter consistencia de tipos
- nao embutir regras de persistencia
- risco se virar monolito: misturar validacao, transformacao e regra de negocio

#### `backend/models/odontograma_model.py`
- representar entidades persistentes ou visoes de leitura
- servir de base para relacionamento com tratamento, intervencao, dente e face
- nao conter logica de UI
- risco se virar monolito: misturar persistencia com montagem de resposta

#### `backend/mappers/odontograma_mapper.py`
- converter entre legado, modelo interno e resposta de API
- isolar adaptacoes de nomes e formatos
- nao decidir regra clinica
- risco se virar monolito: misturar adaptacao de dados com regra de negocio

#### `backend/contracts/odontograma_contract.py`
- registrar contratos documentais de payload e retorno
- manter a primeira versao bem pequena
- nao definir schema SQL
- risco se virar monolito: virar documento morto e dependencia confusa

## 10. Modulos frontend futuros

### 10.1 Proposta de organizacao minima

O frontend deve ficar em `frontend/js/modules/`, seguindo o padrao ja usado no projeto.

Blocos candidatos:
- `frontend/js/modules/odontograma-bootstrap.js`
- `frontend/js/modules/odontograma-api.js`
- `frontend/js/modules/odontograma-estado.js`
- `frontend/js/modules/odontograma-arcada-render.js`
- `frontend/js/modules/odontograma-intervencoes.js`
- `frontend/js/modules/odontograma-dente-face.js`
- `frontend/js/modules/odontograma-historico.js`
- `frontend/js/modules/odontograma-eventos.js`
- `frontend/js/modules/odontograma-dialogos.js`
- `frontend/js/modules/odontograma-validacoes.js`

### 10.2 Responsabilidade de cada modulo

#### `odontograma-bootstrap.js`
- inicializar a tela
- montar dependencias
- disparar carregamento inicial
- nao conter logica de desenho detalhada
- risco se concentrar demais: virar substituto de `app.js`

#### `odontograma-api.js`
- encapsular chamadas ao backend
- padronizar endpoints e erros
- nao conter renderizacao
- risco se concentrar demais: misturar transporte com regra de tela

#### `odontograma-estado.js`
- centralizar estado da tela do odontograma
- manter tratamento, arcada, intervencoes e selecao corrente
- nao renderizar interface
- risco se concentrar demais: virar banco de dados paralelo em memoria

#### `odontograma-arcada-render.js`
- renderizar a arcada base
- desenhar slots e estados visuais simples
- nao tratar procedimentos, validacoes ou dialogos
- risco se concentrar demais: misturar desenho com logica de fluxo

#### `odontograma-intervencoes.js`
- carregar e apresentar intervencoes
- lidar com status basicos
- nao resolver animacao, evento global ou persistencia complexa
- risco se concentrar demais: acumular negocio, UI e API

#### `odontograma-dente-face.js`
- tratar visualizacao e relacao com dente e face
- manter a granularidade separada
- nao absorver renderizacao de arcada inteira
- risco se concentrar demais: transformar a camada anatmica em regra geral

#### `odontograma-historico.js`
- exibir narrativa clinica complementar
- nao assumir papel principal de procedimento
- risco se concentrar demais: disputar responsabilidade com intervencoes

#### `odontograma-eventos.js`
- concentrar bindings e interacoes do odontograma
- nao conter regra clinica nem renderizacao pesada
- risco se concentrar demais: reintroduzir logica monolitica de interacoes

#### `odontograma-dialogos.js`
- tratar modais, confirmacoes e mensagens
- nao conter persistencia nem desenho
- risco se concentrar demais: virar camada de UI e negocio misturadas

#### `odontograma-validacoes.js`
- validar entradas e combinacoes de dados
- nao salvar nem renderizar
- risco se concentrar demais: duplicar regra de backend sem contrato claro

## 11. Contratos minimos de dados

### 11.1 V1 obrigatorio

- `paciente_id`
- `tratamento_id`
- `slot_ordem`
- `numero_dente_fdi`
- `tipo_slot`
- `intervencao_id`
- `status_id`
- `procedimento_id`
- `prestador_id`
- `observacao_resumida`
- `data_planejada`
- `data_execucao`

### 11.2 V1 opcional ou condicional

- `face_id`
- `simbolo_id`
- `anomalias`
- `matriz_visual_json`
- `cor`
- `bitmap_referencia`

### 11.3 V2 ou posterior

- sobreposicoes simbolicas avancadas
- importacao visual de legado
- edicao refinada por face
- multiplas camadas de desenho
- automacoes clinicas mais profundas

## 12. O que fica fora da V1

- importacao de bitmap do EasyDental
- paridade visual completa do legado
- todas as regras de cor
- todas as sobreposicoes simbolicas
- migracao historica completa
- edicao avancada por face
- recursos graficos complexos
- sincronizacao com documentos e imagens
- automacoes clinicas profundas
- qualquer dependencia de `app.js` como ponto unico

## 13. Ordem segura de implementacao futura

1. Contrato tecnico final
2. Migration minima
3. Backend leitura
4. Frontend renderizacao base
5. Vinculo com intervencoes
6. Status basicos
7. Dente
8. Face
9. Historico narrativo complementar
10. Recursos visuais avancados

## 14. Pontos de teste futuros

- Ficha do paciente
- aba odontograma
- renderizacao inicial da arcada
- selecao de tratamento
- lista de intervencoes do tratamento
- vinculo com dente
- vinculo com face
- exibicao de status
- integracao com historico narrativo

## 15. Riscos arquiteturais a evitar

- concentrar tudo em `app.js`
- criar um backend unico e gigante para odontograma
- misturar renderizacao com persistencia
- misturar narrativa clinica com intervencao
- tratar `FACE` como repeticao de `DENTE`
- depender de bitmap legado na primeira entrega
- tentar reproduzir toda cor e sobreposicao antes da base funcional
- deixar sem contrato claro entre backend e frontend

## 16. Registro para roadmap

- Criacao do contrato minimo de implementacao modular do odontograma Brana
- Reforco explicito de modularizacao futura no backend e frontend
- Etapa somente documental
- Modulo especifico de Odontologia
- Nenhum codigo alterado
- Nenhum banco alterado
- Nenhuma migration, endpoint ou tela criada
- Proxima trilha futura: eventual contrato tecnico final antes da primeira implementacao
