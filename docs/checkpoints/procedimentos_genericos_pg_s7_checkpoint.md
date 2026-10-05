# Brana Cloude — Procedimentos Genéricos / checkpoint PG-S7

DOCUMENTATION_DATE = 2026-10-05
BRANCH = modularizacao-segura-fase-1
BASELINE_INICIAL = 4483cbba428e847562b9a149ca16ca2af772a177
CHECKPOINT_COMMIT = THIS_COMMIT
CHECKPOINT_SCOPE = source/testes PG-S5/PG-S5.R1 homologados + reconciliação documental
MODULE_STATUS = CLOSED_AND_HOMOLOGATED
PG_S6_MANUAL_HOMOLOGATION = PASS

## Proveniência e causa

| Marco | Identificador / limite |
|---|---|
| LAST_PROVEN_WORKING_DOCUMENTED_COMMIT | 339ec59ee2c64e956b3a5587edb47b2e1d87212f |
| REGRESSION_CAUSAL_COMMIT | 5a2fcff20af5444556715104b1a5be0b4cdb6d71 |
| PG_S1_FIX_COMMIT | 4483cbba428e847562b9a149ca16ca2af772a177 |

PG-S0 comprovou que `SymbolPreview` descartava `/desktop-assets/easy/...` e
reconstruía `/assets/easy/...`, que retornava 404 no runtime React com base `/app/`.
O commit causal não é afirmado como primeiro commit observado quebrado em runtime;
o primeiro marco é estado funcional **documentado**, não reexecução histórica.
Nenhum teste antigo foi solicitado novamente ao usuário.

PG-S1 restaurou o preview preservando a URL canônica e candidatos compatíveis com
`BASE_URL`; Vite DEV prioriza cópia local para URL canônica desktop, sem descartá-la.
Falha avança ao próximo candidato, esgotamento exibe `Sem imagem`. Exemplo observado:
0001 / `sim_outras.bmp` → `/app/assets/easy/sim_outras.bmp`, dimensão natural 15×15.
Não é caminho universal hardcoded; backend/endpoint `scope=genericos` não mudaram.
PG-S2 homologou preview e auditoria ciana; PG-S3A versionou o fix acima.

## Ajustes PG-S5 e PG-S5.R1 homologados em PG-S6

1. Duplo clique chama o mesmo fluxo de Alterar com alvo explícito do registro clicado.
   Clique simples apenas seleciona; radio/controles internos não duplicam abertura.
2. Tabela com scroll vertical 480 px, cerca de 15 linhas, todos os registros
   carregados acessíveis (591 no caso observado), contador fora do corpo rolável,
   filtros/ordenação/seleção e responsividade preservados. Não é paginação.
3. Inclusão/Alteração cianos nos dois temas, 28 px de altura, padding `0 10px`,
   colunas equivalentes e gap horizontal 8 px. 198×28 no viewport observado.
4. Modal no padrão Preferências: BranaModal/header/close, Tabs `type="card"`,
   três abas Principal/Custos diretos/Vínculos, superfícies clara/escura e footer
   coerentes. Ações/ordem Ok → Cancela e handlers preservados.
5. Principal compactada por espaçamentos locais: seis pares label/campo com gap
   2 px; datas com gap vertical zero; inputs mantêm altura e largura funcional.
   Sem clipping ou novo scroll interno. Não há altura artificial fixa.
6. Custos: Tempo total de execução e Custo de protético editáveis/visualmente normais.
   Custo da hora clínica, Custo fixo da intervenção, Custo de materiais e Custo total
   calculados/readonly, apresentados como `output` ciano claro/escuro.
   Fórmulas, estado, payload, moeda, labels, ordem e validações preservados.
7. Preview de símbolo e demais ajustes anteriores sem regressão observada.

PG_S5_R1_STATUS = COMPLETE
READY_FOR_PG_S6_MANUAL_HOMOLOGATION = SIM
TABLE_SCROLL_Y = 480
AUDIT_FIELDS_GAP = 8px
MODAL_HEIGHT_BEFORE = 566.84px
MODAL_HEIGHT_AFTER = 517.42px
VERTICAL_HEIGHT_REDUCTION = 49.42px
MEASUREMENT_VIEWPORT = 738x704 (medição técnica PG-S5.R1, não geometria universal)
SYMBOL_PREVIEW_REGRESSION = NÃO
LIGHT_THEME = PASS
DARK_THEME = PASS

## Source/testes incluídos

- `frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`
- `frontend-react/src/styles/globals.css` — diff local a Procedimentos Genéricos
- `frontend-react/tests/procedimentosGenericosPage.test.mjs` — teste específico novo

`procedimentosGenericosSymbolPreview.test.mjs` já versionado em PG-S1 permanece
inalterado; executado novamente. Nenhum novo diff em source foi criado em PG-S7.

## Validações e limites

Suíte segura sem banco produtivo, executada novamente em PG-S7:

```powershell
cd frontend-react
node --test tests/procedimentosGenericosPage.test.mjs tests/procedimentosGenericosSymbolPreview.test.mjs tests/procedimentosSymbolPreview.test.mjs tests/procedimentosDashboardPreview.test.mjs tests/simbolosGraficosApi.test.js tests/simbolosGraficosMapper.test.js tests/servicosProtetico.test.js
```

TESTS_PASS = 60
TESTS_FAIL = 0
Cobertura: clique/duplo clique/alvo/radio/Alterar, 591 registros/contador/scroll,
abas/campos/handlers, preview/candidatos, dois editáveis e quatro resultados,
CSS local/ciano nos temas. API de gravação mockada, nenhuma gravação real em PG-S7.
Geometria e preview vieram da observação runtime PG-S5.R1; PG-S6 é evidência manual
de homologação fornecida pelo usuário, não nova execução UI do auditor em PG-S7.
Sem build/deploy ou certificação de ambientes não observados.

OFFICIAL_RUNTIME_PRESERVED = SIM
DATABASE_CHANGED = 0
BACKEND_CHANGED = 0
SCHEMA_CHANGED = NÃO
API_CHANGED = NÃO
ASSETS_CHANGED = NÃO
RUNTIME_CHANGED = NÃO

## Documentação reconciliada

- [Encerramento histórico](../encerramento_temporario_procedimentos_genericos_frontend_react.md)
- [Auditoria histórica do catálogo](../auditoria_funcional_catalogo_simbolos_graficos_easydental_brana_cloud.md)
- [Contrato de normalização / preview vigente](../contrato_normalizacao_catalogo_simbolos_graficos_brana_cloud.md)
- [Contrato do módulo](../contrato_implementacao_procedimentos_genericos_frontend_react.md)
- [Recomendação histórica / prioridade atual](../recomendacao_proximo_modulo_pos_procedimentos_genericos.md)
- [Roadmap](../11_roadmap_desenvolvimento.md)
- [Continuidade](../10_continuidade.md)

Pausa original, dados históricos, contagens e caminhos antigos foram preservados
com notas de superação/proveniência. P0D/P0H/P0I/P1.R1 de FC4 não foram reescritos.
Commit/push/igualdade remota e worktree clean serão reportados após os gates PG-S7;
THIS_COMMIT evita referência recursiva e não afirma push antes de sua validação.

## DO_NOT_REOPEN e próximo passo

Não reabrir sem PROVEN_CONTRADICTION = SIM e prova: preview; duplo clique;
scroll/contador; modal Preferências; gap de auditoria; compactação;
regra visual dos Custos diretos. Mudança nova exige autorização própria.

NEXT_MODULE = PROCEDIMENTOS
NEXT_PHASE = PROCEDIMENTOS-SIMBOLOS-P0
MODE = READ-ONLY
PROCEDIMENTOS_STARTED = NÃO
FC4_STATUS = PAUSED_AFTER_P1_R1
FC4_RESUME = NÃO

Planejamento somente: quantificar procedimentos sem símbolo, listar registros e
tabelas, verificar cadastro/validação, vínculo genérico/classificação de cobrança,
símbolos existentes e regularização segura sem inventar símbolos. Não iniciar
auditoria, validação obrigatória, regularização ou FC4 neste fechamento.
