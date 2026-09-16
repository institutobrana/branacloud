# Fase G.2E.0 - Auditoria contratual das fontes da grade antes da composicao

Data: 2026-08-03

## Resultado
- BLOQUEADA POR CONTRATO DE BACKEND.

## Git
- diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- branch: `modularizacao-segura-fase-1`
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- worktree: sujo por alteracoes preexistentes fora desta subfase
- stage: sem alteracoes novas nesta rodada
- operacoes em andamento: nenhuma

## Fontes auditadas
- `frontend-react/src/features/simbolosGraficos/simbolosGraficosApi.js`
- `frontend-react/src/features/simbolosGraficos/hooks/useSimbolosGraficosTableState.js`
- `frontend-react/src/features/simbolosGraficos/SimbolosGraficosPage.jsx`
- `backend/routes/cadastros_routes.py`
- `backend/models/simbolo_grafico.py`
- `backend/services/simbolos_service.py`
- `backend/seeds/simbolos_graficos.py`
- `backend/security/tenant.py`
- documentos de contrato e engenharia reversa citados na subfase

## API
- endpoint base: `/cadastros/simbolos-graficos`
- scope conhecido no frontend atual: `catalogo`
- scope adicional conhecido no frontend legado: `biblioteca`
- tenant: filtragem e resolucao ocorrem por `current_user.clinica_id` em varias rotas do backend
- schemas: o payload do simbolo inclui `descricao`, `legacy_id`, `codigo`, `especialidade`, `tipo_simbolo`, `tipo_marca`, `sobreposicao`, `icone`, `bitmap1`, `bitmap2`, `bitmap3`, `imagem_custom`

## Totais conhecidos
| Scope | Fonte | Regra | Tenant | Quantidade conhecida |
|---|---|---|---|---:|
| catalogo | snapshot/seed oficial e frontend atual | catalogo oficial carregado por `scope=catalogo` | global/clinica conforme seed e snapshot | 81 |
| biblioteca | seed legado + assets + clinica atual | conjunto maior observado em auditoria anterior | pode misturar itens globais e por clinica | 143 |
| ausente/outro | nao confirmado | nao ha contrato de composicao seguro ainda | nao confirmado | n/a |

## Campos reais confirmados
| Campo real | Tipo | Exemplo | Origem | Pode classificar? |
|---|---|---|---|---:|
| `id` | inteiro | `1` | modelo/response | sim |
| `legacy_id` | inteiro nulo | `1` ou `null` | seed/snapshot | sim |
| `codigo` | string | `int_coroa.bmp` | seed/snapshot | sim |
| `descricao` | string | `Coroa` | seed/snapshot | sim |
| `especialidade` | inteiro nulo | `2` | seed/snapshot | sim |
| `tipo_simbolo` | inteiro nulo | `1` ou `2` | seed/snapshot | sim |
| `tipo_marca` | inteiro nulo | `2` | seed/snapshot | sim |
| `bitmap1` | string nula | `int_coroa.bmp` | seed/snapshot | sim |
| `bitmap2` | string nula | `null` | seed/snapshot | sim |
| `bitmap3` | string nula | `null` | seed/snapshot | sim |
| `icone` | string nula | `int_coroa.bmp` | seed/snapshot | sim |
| `imagem_custom` | texto nulo | `null` ou caminho/texto | seed/snapshot e registros de clinica | sim, mas nao suficiente sozinho |
| `sobreposicao` | inteiro nulo | `1` | seed/snapshot | sim |
| `ativo` | booleano | `true` | seed/snapshot | sim |
| `clinica_id` | inteiro nulo | `1` | persistencia por clinica | sim |

## Inventario dos conjuntos
- `scope=catalogo` permanece como grade principal no frontend atual.
- `scope=biblioteca` existe no legado e no backend historico.
- A diferenca observada de 62 itens entre 81 e 143 existe, mas nao foi separada de forma deterministica em usuario real, seed, teste, copia tecnica e asset auxiliar somente pelos campos vistos.

## Classificacao dos adicionais
- usuario real comprovado: nao confirmado de forma suficiente nesta subfase
- seed interno comprovado: parte dos registros e seeds sao comprovadamente de origem seed/snapshot
- teste comprovado: ha scripts e arquivos de teste/backup no repositório, mas a vinculacao item a item nao foi fechada aqui
- copia tecnica comprovada: alguns itens aparecem como derivados/auxiliares, mas nao ha marcador universal
- asset auxiliar comprovado: sim para itens BMP auxiliares e listas de assets
- indeterminados: permanecem itens sem marcacao segura

## Seeds e fixtures
- o backend carrega seeds oficiais a partir de snapshot JSON e RAW de simbolos
- o seed oficial distingue catalogo por `legacy_id > 0`
- o seed adicional de biblioteca/usuario inclui entradas com `legacy_id = null`
- existe material suficiente para rastrear origem de parte dos itens, mas nao um marcador unico e universal para todo o conjunto de biblioteca

## Tenant
- o backend resolve a clinica atual por `current_user.clinica_id` em varias rotas relevantes
- o seed de simbolos da tabela final e aplicado por clinica em `backend/seeds/simbolos_graficos.py`
- o contrato atual nao fornece, no nivel de resposta da grade, uma origem explicita e suficiente para garantir que somente registros de usuario real entrem na composicao sem heuristica adicional
- o frontend sozinho nao garante isolacao segura de origem

## Critério minimo de usuario real
- persistido: sim, quando o item existe na tabela por clinica
- nao oficial: presumido, mas nao comprovado apenas pelos campos atuais
- tenant atual: sim via `clinica_id`, quando presente
- nao seed: nao garantido so com os campos atuais
- nao teste: nao garantido so com os campos atuais
- nao asset auxiliar: nao garantido so com os campos atuais

## Estrategias avaliadas
| Estrategia | Seguranca | Tenant | Deterministica | Exige backend |
|---|---:|---:|---:|---:|
| scope=biblioteca + filtro no frontend | baixa | parcial | nao | nao |
| compor catalogo + conjunto seguro atual | media-baixa | parcial | nao | sim |
| endpoint existente para registros de usuario | nao comprovada | desconhecida | nao | sim |
| futuro scope=grade | alta se definido | alta se definido | sim se contrato novo | sim |
| adicionar origem explicita no backend | alta | alta | sim | sim |

## Estrategia recomendada
- opçao: aguardar contrato de backend com origem explicita ou scope de grade separado
- justificativa: o backend atual nao fornece distinção suficiente para separar com seguranca usuario real, seed, teste e copia tecnica sem heuristica
- segurança: insuficiente para liberar composicao frontend autônoma
- dependencia de backend: sim

## Decisao da subfase
### BLOQUEADA POR CONTRATO DE BACKEND
- a origem nao esta explicitada de forma suficiente
- `scope=biblioteca` mistura categorias e nao e base segura para a grade principal
- o tenant existe nas rotas, mas nao garante sozinho a separacao de usuario real versus seed/teste/auxiliar
- a distinção de registros adicionais depende de heuristica e de rastreio adicional
- registros indeterminados nao podem entrar na grade principal

## Evidencias resumidas
- o frontend atual chama `listSimbolosGraficos({ scope: 'catalogo' })`
- o frontend legado conhece `scope=catalogo` e `scope=biblioteca`
- o backend possui `SimboloGrafico.clinica_id`, `legacy_id`, `imagem_custom` e `ativo`
- o seed oficial separa catalogo por `legacy_id > 0`
- o seed da biblioteca inclui itens com `legacy_id = null`
- nao existe, neste conjunto auditado, um marcador unico e definitivo que permita separar todos os 7 grupos pedidos sem heuristica adicional

## Consequencia para a proxima etapa
- G.2E.1 nao deve ser iniciada no frontend sem novo contrato de backend.
- A frente correta agora e G.2B: contrato minimo de backend para origem e `scope=grade`.
- Nenhuma implementacao de frontend esta autorizada antes desse contrato.
- Nenhuma inferencia de origem deve ser feita apenas com `scope=biblioteca`.
- Esta auditoria fica como bloco tecnico de transicao para a fase G.2B.0.
