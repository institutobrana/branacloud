# Auditoria funcional do catalogo de simbolos graficos

## 1. Objetivo

Registrar o contrato funcional e tecnico do catalogo de simbolos graficos usado por EasyDental, pelo legado Brana Cloud e pelo novo frontend React, com foco no uso em `Procedimentos` e `Procedimentos Genericos`.

## 2. Fontes consultadas

### 2.1 Legado desktop / EasyDental

- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Bitmaps\`
- `Y:\EDS70\Icones\`
- `Y:\EDS70\Objetos\`

### 2.2 Legado web

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `frontend/js/modules/procedimentos-genericos.js`

### 2.3 Backend

- `backend/routes/cadastros_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/models/simbolo_grafico.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`

### 2.4 Frontend React

- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosEditorMappers.js`
- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx`
- `frontend-react/src/features/procedimentosGenericos/procedimentosGenericosApi.js`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`

## 3. EasyDental desktop

### 3.0 Acesso e leitura confirmados

- `Y:\EDS70` foi acessado nesta auditoria.
- Caminhos reais lidos:
  - `Y:\EDS70\Dados\eds70.sql`
  - `Y:\EDS70\Dados\eds75_build_090617.sql`
  - `Y:\EDS70\Dados\eds75_build_0809_6.sql`
  - `Y:\EDS70\Icones\int_coroa.bmp`
  - `Y:\EDS70\Icones\int_bloco.bmp`
  - `Y:\EDS70\Icones\int_selante.bmp`
  - `Y:\EDS70\Icones\int_restaura.bmp`
  - `Y:\EDS70\Icones\int_fixa.bmp`
  - `Y:\EDS70\Icones\int_movel.bmp`
  - `Y:\EDS70\Icones\int_adesiva.bmp`
  - `Y:\EDS70\Icones\int_prof.bmp`
  - `Y:\EDS70\Icones\int_implante.bmp`
  - `Y:\EDS70\Icones\int_consulta.bmp`
- Arquivos e estruturas encontrados em `Y:\EDS70`:
  - bancos/SQL: `eds70.sql`, `eds70_build_0603.sql`, `eds70_build_0608.sql`, `eds75_build_0809_1.sql` a `eds75_build_100115_3.sql`
  - bases temporarias: `Safe\EDS70Tmp.MDB`, `Temp\EDS70Tmp.MDB`
  - tabelas auxiliares exportadas: `Dados\Dist\*.raw`
  - icones/bitmaps: `Icones\*.bmp`, `Bitmaps\*.bmp`
  - objetos odontologicos: `Objetos\*.dat`
  - textos e configuracoes: `Textos\*.rtf`, `Textos\*.doc`, `MSDE\setup.ini`
- `_SIMBOLO_ODONTO` e `_SIMBOLO_ANOMALIA` foram identificadas diretamente em `Y:\EDS70\Dados\eds70.sql`, nas definicoes `CREATE TABLE` e nas constraints de foreign key com `TAB_GEN_ITEM` e `TAB_PRC_ITEM`.
- Nao houve inspeccao visual segura do modulo desktop `Configuracoes -> Simbolos graficos` dentro do executavel EasyDental, porque nesta rodada a evidencia veio do dump SQL e dos assets do disco, nao de execucao navegada do desktop.

### 3.4 Significado dos bitmap

| Campo | Tipo fisico | Conteudo observado | Formato / dimensao | Contexto de uso | Procedimentos | Procedimentos genericos | Odontograma / outros | Classificacao |
|---|---|---|---|---|---|---|---|---|
| `BITMAP1` | `varchar(20)` no SQL; texto tecnico no Brana | nome do arquivo principal do simbolo | BMP 24x24 nos exemplos medidos | imagem principal do simbolo | usado como preview e fallback principal | usado como preview e fallback principal | usado como asset `int_*` no conjunto medico/odontologico | Confirmado por banco + confirmado por codigo |
| `BITMAP2` | `varchar(20)` no SQL | nulo no catalogo consultado | nao observada | reservada ou nao usada no recorte atual | nao confirmada | nao confirmada | nao confirmada | Nao confirmado |
| `BITMAP3` | `varchar(20)` no SQL | nulo no catalogo consultado | nao observada | reservada ou nao usada no recorte atual | nao confirmada | nao confirmada | nao confirmada | Nao confirmado |

### 3.5 Leitura funcional adicional

Os itens medidos em `Y:\EDS70\Icones` e no React mostram correspondencia exata de bytes e dimensao em varios simbolos basicos:

- `int_coroa.bmp`
- `int_bloco.bmp`
- `int_selante.bmp`
- `int_restaura.bmp`
- `int_fixa.bmp`
- `int_movel.bmp`
- `int_adesiva.bmp`
- `int_prof.bmp`
- `int_implante.bmp`
- `int_consulta.bmp`

Em todos esses pares, o arquivo em `Y:\EDS70\Icones` e o arquivo do React em `frontend-react/public/assets/easy/` possuem mesma dimensao `24x24` e mesmo hash SHA-256 truncado, o que confirma copia binaria igual para esses casos.

O dump consultado tambem confirmou que:

- `BITMAP2` e `BITMAP3` nao aparecem preenchidos nos registros consultados do catalogo;
- `ICONE` coincide com `BITMAP1` em todos os registros do catalogo analisado;
- o preview do React hoje depende, na pratica, de `imagem_url`, `icone` e `bitmap1`.

### 3.1 Tabelas encontradas

No dump `Y:\EDS70\Dados\eds70.sql` aparecem as tabelas:

- `_SIMBOLO_ODONTO`
- `_SIMBOLO_ANOMALIA`

### 3.2 Estrutura observada

As duas tabelas compartilham os campos principais:

- `NROSIM`
- `DESCRICAO`
- `ESPECIAL`
- `TIPMARCA`
- `TIPSIMB`
- `BITMAP1`
- `BITMAP2`
- `BITMAP3`
- `SOBREPOS`
- `ICONE`

Em `_SIMBOLO_ANOMALIA` ainda aparece:

- `BITANOMALIA`

### 3.3 Leitura funcional

O desktop confirma que o catalogo mistura:

- codigo interno do simbolo;
- descricao;
- especialidade associada;
- tipo de marca;
- imagem principal e bitmaps alternativos.

## 4. Legado web

### 4.1 Editor e helpers

O fluxo principal do legado web esta em `frontend/app.js`.

Trechos confirmados:

- `simbolosSelecionarBiblioteca(id)` preenche nome, especialidade, tipo de marca, codigo e preview;
- `simbolosAbrirModal(modo)` abre o modal em modo `novo` ou `editar`;
- `simbolosSalvarModal()` grava o simbolo;
- `simbolosExcluirSelecionado()` remove o simbolo;
- `simbolosAplicarModoModal(item)` bloqueia campos e biblioteca quando o simbolo e de sistema;
- `simbolosAbrirEditor(url)` e `simbolosFecharEditor()` controlam o editor auxiliar.

### 4.2 Label do simbolo

O helper passivo do fluxo de procedimentos confirma o criterio de rotulacao:

- `procFmtSimboloLabel(item)` em `frontend/js/modules/intervencoes-procedimentos.js`
- retorno: descricao primeiro, depois codigo

Isso evita exibir caminho de arquivo ou identificador tecnico cru como label final.

### 4.3 Preview e selecao

O fluxo legado usa:

- `simbolosAtualizarPreview(...)`
- `simbolosEspecialidadeNome(...)`
- `simbolosEspecialidadeResolverValor(...)`
- `simbolosSetModalCodigo(...)`
- `simbolosSetModalRefId(...)`

O comportamento observavel e:

- seleciona simbolo pela biblioteca;
- usa descricao e codigo para exibir a opcao;
- mostra preview com a imagem customizada quando existe;
- cai para bitmap ou asset padrao quando nao existe imagem customizada.

### 4.4 Funcoes e consultas localizadas

#### Ajuste de preview e texto no legado web

- Caminho: `frontend/js/modules/intervencoes-procedimentos.js`
- Funcao: `procFmtSimboloLabel(item)`
- Lógica: retorna `descricao` primeiro e `codigo` como fallback
- Campos usados: `descricao`, `nome`, `codigo`
- Evidência: helper passivo carregado no namespace `BranaIntervencoesProcedimentosModule`

#### Carregamento do catálogo no frontend legado

- Caminho: `frontend/app.js`
- Funções:
  - `simbolosSelecionarBiblioteca(id)`
  - `simbolosAbrirModal(modo)`
  - `simbolosSalvarModal()`
  - `simbolosAplicarModoModal(item)`
  - `simbolosAtualizarPreview(codigo)`
- Lógica observada:
  - seleciona item da biblioteca;
  - preenche nome, especialidade, tipo de marca e codigo;
  - resolve preview por codigo/icone;
  - salva por endpoint de símbolos gráficos.

#### Persistencia e uso em Procedimentos

- Caminho: `backend/routes/procedimentos_routes.py`
- Relações encontradas:
  - `TAB_PRC_ITEM` referencia `_SIMBOLO_ODONTO` por `NROSIM`
  - `TAB_GEN_ITEM` referencia `_SIMBOLO_ODONTO` por `NROSIM`
- Lógica observada:
  - procedimento e procedimento generico guardam vínculo ao simbolo do catálogo;
  - o backend do Brana aceita `simbolo_grafico` e `simbolo_grafico_legacy_id` no contrato atual.

#### Persistencia em Procedimentos Genericos

- Caminho: `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`
- Funções:
  - `resolveSimboloValue(item)`
  - `findSimboloByValue(items, valor)`
  - `resolveSimboloSelectValue(simbolos, state)`
  - `resolvePreviewFileName(fileName)`
  - `SymbolPreview({ simbolos, state })`
- Lógica observada:
  - usa `simbolo_grafico` e `simbolo_grafico_legacy_id`;
  - exibe `descricao` no combo;
  - preview usa `imagem_url`, depois `icone/bitmap1/2/3`, depois asset padrão.

## 5. Backend

### 5.1 Rota oficial do catalogo

Arquivo: `backend/routes/cadastros_routes.py`

Rota confirmada:

- `GET /cadastros/simbolos-graficos`

Parametro relevante:

- `scope=catalogo`
- `scope=genericos`
- `scope=procedimentos`

### 5.2 Regra de filtragem

O backend confirma tres perfis de consumo:

- `catalogo`: lista oficial da tela `Configura simbolos`;
- `genericos`: lista para `Procedimentos Genericos`;
- `procedimentos`: lista para `Procedimentos`, aceitando catalogo oficial e simbolos personalizados da clinica.

### 5.3 Contrato retornado

Cada item retornado pela rota inclui:

- `id`
- `legacy_id`
- `codigo`
- `descricao`
- `especialidade`
- `tipo_marca`
- `tipo_marca_label`

### 5.4 Validacao autenticada desta rodada

Validacao real com sessao autenticada:

- `GET /me`
  - status `200`
  - usuario autenticado com `clinica_id = 1`
  - permissao de `procedimentos` habilitada no contexto retornado
- `GET /cadastros/simbolos-graficos?scope=procedimentos`
  - status `200`
  - total de itens `141`
  - campos observados: `codigo`, `descricao`, `especialidade`, `icone`, `id`, `imagem_custom`, `imagem_url`, `legacy_id`, `tipo_marca`, `tipo_marca_label`, `tipo_simbolo`
  - valores de `value` calculados no frontend atual mostraram `140` distintos e `1` repetido, com repeticao unica em `sim_30.bmp`
- `GET /cadastros/simbolos-graficos?scope=genericos`
  - status `200`
  - total de itens `79`
  - nenhum valor repetido no recorte validado
- `GET /cadastros/auxiliares?tipo=Símbolo gráfico`
  - status `200`
  - retorno vazio `[]`

Conclusao objetiva desta rodada:

- o endpoint autenticado de `procedimentos` e o de `genericos` existem e estao respondendo;
- o recorte de `procedimentos` possui uma duplicidade isolada de `codigo/value` em `sim_30.bmp`, mas o restante do catalogo se manteve consistente para o objetivo da tela;
- o catalogo auxiliar nao e a fonte real do fluxo validado nesta rodada;
- o contrato funcional suficiente para o novo frontend React continua disponivel sem mexer em backend, banco ou payloads nesta etapa.
- `tipo_simbolo`
- `icone`
- `imagem_custom`
- `imagem_url`

### 5.4 Observacao tecnica importante

O backend monta `imagem_url` a partir de `imagem_custom` ou de `/desktop-assets/easy/{icone}` quando o simbolo possui icone.

### 5.5 Endpoint canônico e diferença entre rotas

Comparacao resumida dos endpoints:

- `GET /cadastros/simbolos-graficos?scope=procedimentos`
  - adequado para `Procedimentos`
  - retorna catalogo filtrado por escopo e permite simbolos personalizados da clinica
- `GET /cadastros/simbolos-graficos?scope=genericos`
  - adequado para `Procedimentos Genericos`
  - prioriza o mesmo catálogo, com filtro especifico do generico
- `GET /cadastros/auxiliares?tipo=Símbolo gráfico`
  - fallback apenas para ausencia de dados no endpoint canonico
  - nao deve ser a fonte principal do contrato

Endpoint oficial recomendado para a frente atual:

- `GET /cadastros/simbolos-graficos?scope=procedimentos`

## 6. Frontend React

### 6.1 Procedimentos

`frontend-react/src/features/procedimentos/procedimentosApi.js` consome:

- `GET /cadastros/simbolos-graficos?scope=procedimentos`

Se vier vazio, faz fallback para:

- `/cadastros/auxiliares?tipo=Símbolo gráfico`

### 6.2 Normalizacao

O React normaliza o simbolo com:

- `codigo`
- `descricao`
- `legacy_id`
- `imagem_url`
- `icone`
- `bitmap1`
- `bitmap2`
- `bitmap3`

### 6.3 Contracto do select

`frontend-react/src/features/procedimentos/procedimentosEditorMappers.js` resolve:

- `resolveProcedimentoSymbolValue(item)`
- `findProcedimentoSymbolByValue(items, valor)`
- `resolveProcedimentoSymbolSelectValue(simbolos, state)`
- `resolveProcedimentoSymbolLabel(item)`
- `resolveProcedimentoSymbolPreviewCandidates(simbolos, state)`

O contrato atual aceita:

- id legado;
- codigo do simbolo;
- preview por `imagem_url`;
- preview por `icone`;
- preview por `bitmap1/2/3`.

### 6.4 Contrato em Procedimentos Genericos

`frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx` e `procedimentosGenericosApi.js` usam o mesmo endpoint com `scope=genericos`.

O modal generico tambem:

- resolve label por descricao/codigo;
- guarda `simbolo_grafico` e `simbolo_grafico_legacy_id`;
- usa preview com fallback de asset.

### 6.5 Matriz ponta a ponta de 10 simbolos

| NROSIM | DESCRICAO | ESPECIAL | TIPMARCA | TIPSIMB | BITMAP1 / ICONE | Brana legacy_id | Brana codigo | imagem_url/preview | Correspondencia |
|---|---|---:|---:|---:|---|---:|---|---|---|
| 1 | Coroa | 2 | 2 | 1 | `int_coroa.bmp` | 1 | `int_coroa.bmp` | `/assets/easy/int_coroa.bmp` | sim |
| 2 | Restauração metálica-fundida | 5 | 2 | 1 | `int_bloco.bmp` | 2 | `int_bloco.bmp` | `/assets/easy/int_bloco.bmp` | sim |
| 3 | Selante | 8 | 2 | 1 | `int_selante.bmp` | 3 | `int_selante.bmp` | `/assets/easy/int_selante.bmp` | sim |
| 4 | Restauração | 1 | 1 | 1 | `int_restaura.bmp` | 4 | `int_restaura.bmp` | `/assets/easy/int_restaura.bmp` | sim |
| 5 | Prótese parcial fixa | 2 | 3 | 1 | `int_fixa.bmp` | 5 | `int_fixa.bmp` | `/assets/easy/int_fixa.bmp` | sim |
| 6 | Prótese parcial removível | 2 | 6 | 1 | `int_movel.bmp` | 6 | `int_movel.bmp` | `/assets/easy/int_movel.bmp` | sim |
| 7 | Prótese adesiva | 2 | 3 | 1 | `int_adesiva.bmp` | 7 | `int_adesiva.bmp` | `/assets/easy/int_adesiva.bmp` | sim |
| 8 | Profilaxia | 1 | 5 | 1 | `int_prof.bmp` | 8 | `int_prof.bmp` | `/assets/easy/int_prof.bmp` | sim |
| 9 | Implante | 6 | 2 | 1 | `int_implante.bmp` | 9 | `int_implante.bmp` | `/assets/easy/int_implante.bmp` | sim |
| 10 | Consulta | 5 | 5 | 1 | `int_consulta.bmp` | 10 | `int_consulta.bmp` | `/assets/easy/int_consulta.bmp` | sim |

Observação:

- nesses 10 casos o asset existe em `Y:\EDS70\Icones` e em `frontend-react/public/assets/easy/` com mesma dimensão `24x24`;
- o hash dos pares é idêntico;
- o preview do React resolve o mesmo arquivo nesses exemplos.

## 7. Contrato consolidado

### 7.1 Chaves tecnicas

O identificador tecnico do simbolo pode vir como:

- `id`
- `legacy_id`
- `codigo`

### 7.2 Label visual

O label visual consolidado e:

- `descricao` primeiro;
- `codigo` como fallback;
- nunca o caminho do arquivo.

### 7.3 Preview visual

Ordem observada:

1. `imagem_url` customizada, quando existe.
2. `icone` do simbolo.
3. `bitmap1`.
4. `bitmap2`.
5. `bitmap3`.
6. asset padrao de EasyDental quando o nome indica arquivo conhecido.

### 7.4 Separacao de consumo

- `scope=procedimentos` atende `Procedimentos`.
- `scope=genericos` atende `Procedimentos Genericos`.
- `scope=catalogo` atende a biblioteca oficial de configuracao.

### 7.5 Quantidades e inconsistencias do banco Brana

Consulta de leitura ao banco do Brana confirmou:

- total de símbolos: `559`
- com `legacy_id`: `320`
- sem `legacy_id`: `239`
- com descrição preenchida: `559`
- com imagem válida por `imagem_custom`/`icone`/`bitmap1/2/3`: `559`
- grupos com duplicidade de `legacy_id` nao nulo: `81`
- linhas repetidas acima do primeiro registro dentro do subconjunto nao nulo: `239`
- grupos com duplicidade de `codigo`: `421` linhas repetidas acima do primeiro registro
- grupos com duplicidade de `descricao`: `417` linhas repetidas acima do primeiro registro
- referências em `procedimento.simbolo_grafico_legacy_id`: `1029` linhas, `62` valores distintos
- referências em `procedimento_generico.simbolo_grafico`: `598` linhas, `61` valores distintos

Essas duplicidades não invalidam o catálogo, mas confirmam que o Brana funciona como catálogo de clínica com múltiplos registros repetidos de origem/importação.

## 8. Conclusao da auditoria

O catalogo de simbolos graficos ja tem contrato funcional suficiente para o novo frontend React sem inventar regra:

- backend entrega a colecao;
- o legado web expõe a edicao com nome, especialidade, tipo e preview;
- o React ja possui lookup, label e preview compativeis;
- o mesmo catalogo atende `Procedimentos` e `Procedimentos Genericos`, com scope diferente.

Nao foi necessario alterar backend, banco ou migrations nesta auditoria.

### 8.1 Decisao tecnica final desta validacao autenticada

Decisao: **A - seguir com a implementacao do frontend React usando o contrato atual, sem alterar backend nesta etapa**.

Justificativa:

- a validacao autenticada confirmou as rotas e o formato de resposta esperados;
- `scope=genericos` nao apresentou valores repetidos no recorte validado;
- `scope=procedimentos` mostrou apenas uma duplicidade isolada de `sim_30.bmp`, sem invalidar o contrato geral da frente;
- o lookup e o preview continuam resolvidos pela camada React ja existente, que pode seguir com o contrato consolidado sem inventar regra;
- nao ha necessidade comprovada de migration, novo endpoint ou mudanca no payload para esta etapa.

## 9. Divergencias objetivas

As divergencias hoje nao sao de regra de label, e sim de camada de catalogo/importacao:

- registro: múltiplos símbolos duplicados no Brana para o mesmo `legacy_id` e `codigo`;
- valor: o mesmo arquivo BMP/ico é repetido em registros diferentes;
- imagem esperada: o mesmo `int_*.bmp` do EasyDental;
- imagem resolvida: o mesmo `int_*.bmp` no React para os exemplos medidos;
- função responsavel: `resolveProcedimentoSymbolPreviewCandidates(...)` e `SymbolPreview(...)` no React;
- causa objetiva: catálogo do Brana contém duplicidades e depende de `legacy_id`/`codigo` para resolver o preview.

Para os 10 símbolos medidos acima, não houve divergência de preview.

## 10. Decisão obrigatória

Decisão: **D — normalizar/importar dados e assets antes das telas.**

Justificativa:

- o contrato visual básico já está coerente nos símbolos mais usados;
- o banco do Brana ainda contém duplicidades grandes de `legacy_id`, `codigo` e `descricao`;
- `BITMAP2` e `BITMAP3` não aparecem preenchidos no catálogo consultado, então não justificam hoje uma regra de interface;
- a próxima camada segura é consolidar importação e normalização do catálogo, antes de expandir qualquer tela nova que dependa de preview sem ambiguidade.

## 11. Próxima implementação exata

Antes de qualquer implementação de tela nova que use símbolos gráficos, a próxima ação segura é:

- normalizar a origem do catálogo de símbolos;
- reduzir duplicidades por `legacy_id` e `codigo`;
- consolidar o contrato canônico de assets;
- só depois seguir para a implementação visual/funcional das telas consumidoras.
