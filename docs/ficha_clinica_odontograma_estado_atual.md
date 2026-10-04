# Brana Cloude — FC4 / Odontograma operacional

STATUS = DOCUMENTATION_CHECKPOINT_COMPLETE
BRANCH = modularizacao-segura-fase-1
BASELINE = 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1
CURRENT_BASELINE = 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1
CURRENT_STATUS = FC4-P0E_DOCUMENTATION_CLOSED
LAST_COMPLETED_PHASE = FC4-P0E (fechamento documental da consolidação FC4-P0D)
CURRENT_PHASE = fechamento documental concluído
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
NEXT_SAFE_PHASE = FC4-P1 — design de schema/API
CANONICAL_FLOW_STATUS = PROVEN_WITH_NON_BLOCKING_GAPS
FC4_P0C_FINAL_STATUS = COMPLETE

## Escopo e autoridade

Este é o estado canônico da frente **FC4**, não uma reabertura da FC3-D5. O código
atual continua sendo a fonte da verdade sobre o que está implementado. Contratos
recuperados do Desktop descrevem a referência funcional futura, não capacidades
já implementadas no Brana. Não houve migration, escrita de banco, mudança visual,
reinício ou implementação nesta fase. O fechamento P0E versiona somente a
documentação consolidada da P0D.

O prefixo IMPLEMENTATION_STARTED refere-se à nova frente operacional FC4. Modelos,
leituras V1, assets, shell React e FC3-D5 já existem e não são apagados por esse
status. Documentos antigos V1 de leitura não definem o novo contrato de escrita.

## Documentos de autoridade e ordem de leitura

1. [Continuação](ficha_clinica/odontograma_continuacao.md): ponto de retomada.
2. [Contratos](ficha_clinica/odontograma_contracts.md): referência operacional.
3. [Dossiê](reverse_engineering/easydental_odontograma_fc4.md): fontes, endereços,
   SQLs, níveis de confiança e limites da engenharia reversa.
4. [Assets](ficha_clinica/odontograma_assets_map.md): matriz individual deduplicada,
   metadados, aliases, callers candidatos e autorização.
5. [Símbolos](ficha_clinica/odontograma_symbol_assets_matrix.md): snapshot de 81 símbolos.
6. [Roadmap](11_roadmap_desenvolvimento.md): seção FC4-P0D.
7. [FC3-D5](ficha_clinica_estado_atual.md): lease homologado e congelado.

## Fases anteriores e preservação de evidência

| Fase | Resultado preservado | Limite |
|---|---|---|
| P0 | PARTIAL; mapeamento Brana/Desktop | Schema sozinho não prova fluxo |
| P0A | PARTIAL; runtime/conexão identificados | Banco real; nenhuma mutação autorizada |
| P0B | Observação assistida anterior à gravação | Operador controla GUI; relato não substitui trace |
| P0B.R1 | Referências incorporadas à continuidade de P0B | Não há relatório separado recuperado para inventar detalhes exclusivos |
| P0B.R2 | PARTIAL; Delphi/VCL, forms, SQLs, marcações | Preservar STRONG onde não houve prova direta |
| P0B.R3 | Aprofundamento de faces, writers e render | Orientação por slot, não conversão fixa do importador |
| P0B.R4 | COMPLETE; fluxo com gaps não bloqueantes | Não prometer algoritmo gráfico pixel-a-pixel |
| P0C | PARTIAL originalmente | Três entregáveis documentais faltavam |
| P0D | Consolidação e fechamento dos três blockers P0C | Implementação permaneceu não iniciada |
| P0E | Revisão, checkpoint e versionamento documental | Próxima fase segura: design P1 sob autorização separada |

As conclusões anteriores são preservadas com sua origem. Revalidação binária P0D
não significa reexecução de traces, consultas históricas ou testes de gravação.

## Fechamento dos blockers P0C

- Faces: tabela de 32 slots revalidada em EDS70.exe, hash registrado no dossiê;
  ponteiros e bytes do conversor reproduzidos. FACE_SLOT_ORIENTATION_TABLE_STATUS=PROVEN.
- Assets: 2.147 candidatos físicos / 1.213 hashes únicos, com todos os aliases,
  campos individuais e classificação de autorização. ASSET_MATRIX_STATUS=COMPLETE.
- Símbolos: 81 registros / 79 nomes gráficos, zero referências sem arquivo no
  acervo candidato. SYMBOL_ASSET_MATRIX_STATUS=COMPLETE.

COMPLETE aqui significa **matriz classificada**, não autorização de todo recurso
histórico, nem renderer implementado. SAFE_TO_REUSE=SIM em 181 hashes; categoria C
permanece UNPROVEN e não pode ser escolhida para implementação sem autorização.

## Brana atual e diferenças comprovadas

CURRENT_BRANA_SCHEMA_SUFFICIENT = PARCIAL.

1. Slots existem, mas DENTE/FACE exigem FDI e não vinculam intervenção ao slot vazio.
2. Tipo de marcação existe no símbolo, não como alvo preservado da intervenção.
3. Faixas/agrupamentos não têm representação explícita nas associações atuais.
4. Valores/exclusão do orçamento têm overrides em source_payload do tratamento;
   isso não equivale a contrato próprio final suficiente por intervenção.

O cálculo auditado do orçamento soma itens incluídos sem excluir explicitamente
Observada nesse caminho. Gap de desenho futuro; não corrigido e não classificado
automaticamente como regressão FC3-D5. O React atual mostra arcada estática;
assets e botões visuais não significam odontograma operacional.

## Riscos classificados e próximos passos

BLOCKING_GAPS de conhecimento legado para design = NENHUM.
Gaps de implementação = schema/alvos, escrita, renderer, histórico/orçamento e UX.
NON_BLOCKING_GAPS = pixel-a-pixel legado; símbolo inválido fora do catálogo válido;
autorização individual dos recursos C; cobertura visual integral ainda PARCIAL.
Nenhum desses gaps foi escondido ou considerado implementado.

SELECTION_UX_DECISION = PENDING_USER_DECISION (Desktop-like / Cloud-like / Hybrid).
FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
**FC4-P3 introduz alterações visuais e requer homologação manual.** Avisar o usuário
explicitamente antes dessa fase; não começar P1 ou P3 automaticamente.

FC3-D5 permanece HOMOLOGATED: OWNER obrigatório no domínio de escrita clínica;
RESTRICTED/UNKNOWN fail-closed; backend é autoridade final. Takeover fora do escopo.
