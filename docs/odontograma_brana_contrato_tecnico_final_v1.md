# Odontograma Brana - Contrato tecnico final da V1

## 1. Objetivo

Fechar o contrato tecnico final da V1 do odontograma Brana, definindo com precisao quais leituras, payloads, contratos de frontend e dependencias minimas serao necessarias para uma primeira entrega segura.

Este documento nao implementa nada. Ele apenas consolida a interface minima entre backend e frontend para a V1, mantendo a diretriz de modularizacao explicita e evitando uma arquitetura monolitica.

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

Quando a implementacao real acontecer, o odontograma deve seguir modularizacao explicita no backend e no frontend.

Isto significa:
- evitar concentrar logica em `app.js`
- separar leitura, renderizacao, eventos, validacao e acesso a dados
- manter contratos pequenos e claros por bloco
- evitar monolitos funcionais ou arquivos gigantes

## 6. Base documental consultada

- `docs/odontograma_brana_contrato_minimo_implementacao_modular.md`
- `docs/odontograma_brana_contrato_modelagem_futura.md`
- `docs/odontograma_easydental_validacao_dente_face_status_intervencao.md`
- `docs/odontograma_easydental_diagrama_relacional_contrato_modelagem_brana.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 7. Casos de uso exatos da V1

### Entram na V1

- abrir o odontograma de um paciente
- carregar o tratamento selecionado
- carregar a arcada base do tratamento
- listar as intervencoes do tratamento
- mostrar os status basicos das intervencoes
- mostrar o vinculo da intervencao com o dente
- mostrar face quando existir, sem depender disso para funcionar
- exibir historico narrativo complementar apenas se necessario e sem misturar com intervencao

### Ficam para V2 ou posterior

- edicao avancada por face
- recursos graficos complexos
- importacao visual do legado
- paridade visual completa com EasyDental
- regras avancadas de cor e sobreposicao
- automacoes clinicas profundas
- sincronizacao com documentos e imagens

## 8. Leituras minimas do backend

### 8.1 Obter resumo do odontograma do paciente/tratamento

- Objetivo: devolver uma visao compacta da sessao odontologica ativa
- Parametros minimos: `paciente_id`, `tratamento_id`
- Resposta minima esperada: paciente, tratamento, contagem basica de intervencoes, arcada carregada e status disponiveis
- Dependencias: tratamento existente, lookup de status, arcada base
- Riscos: devolver resumo demais ou misturar regra de renderizacao com leitura

### 8.2 Obter slots da arcada

- Objetivo: carregar a estrutura visual da arcada por tratamento
- Parametros minimos: `tratamento_id`
- Resposta minima esperada: slots com `slot_ordem`, `numero_dente_fdi`, `tipo_slot` e `observacao`
- Dependencias: tratamento, slot base, relacao com paciente
- Riscos: tratar arcada como dente clinico puro ou exigir bitmap legado na leitura

### 8.3 Obter intervencoes do tratamento

- Objetivo: listar as intervencoes vinculadas ao tratamento
- Parametros minimos: `tratamento_id`
- Resposta minima esperada: intervencoes com `intervencao_id`, `status_id`, `procedimento_id`, `prestador_id`, `dente_id`, `face_id` opcional, datas e observacao resumida
- Dependencias: intervencao, procedimento, prestador, status, dente e face
- Riscos: misturar planejado e executado sem diferenciar estado

### 8.4 Obter lookup de status

- Objetivo: devolver os status suportados pela V1
- Parametros minimos: nenhum ou filtro opcional de contexto
- Resposta minima esperada: id do status, codigo e descricao
- Dependencias: `_STATUS_INTERV`
- Riscos: inventar status novos sem lastro na base ou no contrato

### 8.5 Obter detalhes de dente vinculados as intervencoes

- Objetivo: trazer a camada de detalhe anatomico por intervencao
- Parametros minimos: `tratamento_id` ou `intervencao_id`
- Resposta minima esperada: `dente_id`, `numero_fdi`, `bitmap_referencia` ou equivalente documental, e relacao com a intervencao
- Dependencias: `DENTE` e `INTERVENCAO`
- Riscos: fazer `DENTE` depender de `ARCADA` ou tratar como redundancia

### 8.6 Obter faces quando existirem

- Objetivo: recuperar a marcacao compacta de face por intervencao
- Parametros minimos: `tratamento_id` ou `intervencao_id`
- Resposta minima esperada: `face_id` ou linha equivalente, flags de face e relacao com dente/intervencao
- Dependencias: `FACE` e `INTERVENCAO`
- Riscos: exigir face para tudo ou assumir que face e multlinha quando nao e

## 9. Payloads minimos de resposta

### 9.1 `payload_resumo_odontograma`

Campos obrigatorios:
- `paciente_id`
- `tratamento_id`
- `arcada`
- `status_lookups`
- `intervencoes_count`

Campos opcionais:
- `historico_resumo`
- `prestador_responsavel`
- `datas_relevantes`

Campos adiados para V2:
- `bitmap_referencia`
- `regra_visual`
- `sobreposicoes_avancadas`

Observacao de compatibilidade:
- O payload deve ser compacto e nao exigir que o frontend conheca tabela interna do legado.

### 9.2 `payload_arcada_slots`

Campos obrigatorios:
- `slot_ordem`
- `numero_dente_fdi`
- `tipo_slot`
- `observacao`

Campos opcionais:
- `anomalias`
- `matriz_visual_json`

Campos adiados para V2:
- `bitmap_referencia`
- `cor`

Observacao de compatibilidade:
- A V1 precisa apenas da geometria base e do vinculo com o tratamento.

### 9.3 `payload_intervencoes`

Campos obrigatorios:
- `intervencao_id`
- `status_id`
- `status_nome`
- `procedimento_id`
- `procedimento_nome`
- `prestador_id`
- `dente_id`
- `data_planejada`
- `data_execucao`
- `observacao`

Campos opcionais:
- `face_id`
- `historico_id`

Campos adiados para V2:
- `simbolo_id`
- `bitmap_referencia`
- `cor`

Observacao de compatibilidade:
- O payload deve diferenciar claramente planejado, observado e realizado quando o status indicar isso.

### 9.4 `payload_status_lookup`

Campos obrigatorios:
- `status_id`
- `codigo`
- `descricao`

Campos opcionais:
- `reservado`

Campos adiados para V2:
- `cor`
- `ordem_exibicao`

Observacao de compatibilidade:
- A V1 usa lookup enxuto, sem inventar taxonomia nova.

### 9.5 `payload_dentes_intervencao`

Campos obrigatorios:
- `intervencao_id`
- `dente_id`
- `numero_dente_fdi`

Campos opcionais:
- `bitmap_referencia`
- `observacao`

Campos adiados para V2:
- `regra_visual`
- `simbolo_id`

Observacao de compatibilidade:
- O frontend nao deve assumir que toda intervencao tera mais de um dente.

### 9.6 `payload_faces_intervencao_opcional`

Campos obrigatorios:
- `intervencao_id`
- `dente_id`
- `face_flags`

Campos opcionais:
- `face_id`
- `observacao`

Campos adiados para V2:
- `desenho_avancado`
- `sobreposicao`

Observacao de compatibilidade:
- Face existe como apoio opcional na V1, nao como dependencia obrigatoria da tela.

## 10. Contratos minimos esperados pelo frontend

### 10.1 Modulos que consomem cada payload

- `odontograma-bootstrap.js` consome o `payload_resumo_odontograma`
- `odontograma-arcada-render.js` consome o `payload_arcada_slots`
- `odontograma-intervencoes.js` consome o `payload_intervencoes` e o `payload_status_lookup`
- `odontograma-dente-face.js` consome `payload_dentes_intervencao` e `payload_faces_intervencao_opcional`
- `odontograma-historico.js` consome o resumo narrativo, se fornecido
- `odontograma-validacoes.js` consome os mesmos payloads para consistencia minima

### 10.2 Dependencias que nao devem ser exageradas

- `odontograma-arcada-render.js` nao deve depender de historico completo
- `odontograma-intervencoes.js` nao deve depender da renderizacao final da arcada para carregar dados
- `odontograma-dente-face.js` nao deve decidir a estrutura geral da tela
- `odontograma-historico.js` nao deve controlar o fluxo principal de procedimentos
- `odontograma-eventos.js` nao deve carregar regra clinica pesada

### 10.3 Fluxo de inicializacao

1. carregar resumo do odontograma
2. carregar status basicos
3. carregar arcada
4. carregar intervencoes
5. carregar detalhes de dente
6. carregar faces opcionais
7. renderizar
8. disponibilizar narrativas complementares, se existirem

### 10.4 Estados minimos da tela

- tratamento selecionado
- arcada carregada
- lista de intervencoes carregada
- status basicos disponiveis
- selecao de dente atual, se houver
- face opcional, se houver
- resumo narrativo opcional

### 10.5 Erros minimos a tratar

- tratamento nao encontrado
- paciente sem tratamento ativo
- ausencia de arcada
- ausencia de intervencoes
- status desconhecido
- dente sem vinculo
- face indisponivel
- falha de leitura no backend

## 11. Decisao sobre V1 somente leitura ou nao

Decisao: V1 somente leitura.

Justificativa:
- a base confirmada ainda pede separacao cuidadosa entre arcada, intervencao, dente, face e historico
- a prioridade da V1 e entregar visibilidade e consistencia de leitura
- qualquer escrita precoce aumentaria o risco arquitetural e o risco de mistura entre planejamento e execucao
- a ausencia de paridade visual completa com o EasyDental reforca a escolha por leitura primeiro

## 12. O que fica fora da V1

- bitmaps do legado
- paridade visual completa
- regras avancadas de cor e sobreposicao
- edicao avancada por face
- migracao historica
- automacoes clinicas
- escrita complexa
- qualquer fluxo extenso sem validacao
- dependencia de `app.js` como orquestrador unico

## 13. Dependencias da futura implementacao

- migration minima
- modelos e schemas backend
- rotas de leitura
- fixture de teste ou base segura
- frontend bootstrap
- renderizacao inicial
- contrato estavel entre frontend e backend

## 14. Ordem tecnica imediata apos este contrato

1. migration minima da V1
2. backend de leitura e contratos
3. teste isolado backend
4. frontend render base
5. integracao frontend-backend
6. validacao manual na ficha do paciente

## 15. Pontos de teste futuros

- ficha do paciente
- aba odontograma
- abertura de paciente com tratamento ativo
- renderizacao inicial da arcada
- lista de intervencoes do tratamento
- exibicao dos status basicos
- vinculacao com dente
- visualizacao de face opcional
- integracao com historico narrativo complementar

## 16. Riscos a evitar

- concentrar tudo em `app.js`
- criar um backend unico e gigante para odontograma
- misturar renderizacao com persistencia
- misturar narrativa clinica com intervencao
- tratar `FACE` como repeticao de `DENTE`
- depender de bitmap legado na V1
- tentar reproduzir toda cor e sobreposicao antes da base funcional
- deixar sem contrato claro entre backend e frontend

## 17. Registro para roadmap

- Criacao do contrato tecnico final da V1 do odontograma Brana
- Definicao de payloads minimos e leituras minimas
- Reforco da implementacao modular no backend e frontend
- Etapa somente documental
- Nenhum codigo alterado
- Nenhum banco alterado
- Nenhuma migration, endpoint ou tela criada
- Proxima etapa futura sugerida: migration minima da V1
