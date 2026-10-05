# Brana Cloude — FC4 / Odontograma operacional

STATUS = P1_R1_DOCUMENTATION_RECONCILED_FOR_REVIEW
BRANCH = modularizacao-segura-fase-1
CURRENT_BASELINE = 6e7cdd5de3551f4d1b120f5d0da579e364746d38
FC3_D5_BASELINE = 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1
CURRENT_STATUS = FC4-P1.R1 COMPLETE — design/documentação para revisão
LAST_COMPLETED_PHASE = FC4-P1.R1
NEXT_SAFE_PHASE = REVISÃO E FECHAMENTO DOCUMENTAL POSTERIOR, sob autorização
MANUAL_DECISIONS_DOCUMENTED = 10/10
CANONICAL_FLOW_STATUS = PROVEN_WITH_NON_BLOCKING_GAPS
P1_DESIGN_CONTRADICTIONS_FIXED = 8
P1_DESIGN_REMAINING_CONTRADICTIONS = 0
REVISED_SCHEMA_DESIGN_STATUS = COMPLETE
REVISED_API_DESIGN_STATUS = COMPLETE
ROUNDTRIP_REVISED_STATUS = PASS — conceitual
ROUNDTRIP_REVISED_LOSS_CASES = NENHUM nos casos projetados
READY_FOR_P1_R1_CHECKPOINT = SIM
AFTER_P1_R1_CHECKPOINT = PAUSE_FC4
FC4_PAUSE_AFTER_CHECKPOINT = SIM
NEXT_SEPARATE_MODULE = PROCEDIMENTOS
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
SCHEMA_CHANGED = NÃO
P2_STARTED = NÃO
AUDITORIA_PROCEDIMENTOS_STARTED = NÃO
COMMIT_CREATED_DURING_P1_R1 = NÃO
PUSH_PERFORMED_DURING_P1_R1 = NÃO

## Autoridade vigente P1.R1

Brana Cloude: código continua fonte da verdade sobre implementação. Contratos
alvo foram reconciliados com USER_MANUAL_RUNTIME_EVIDENCE fornecida pelo usuário.
Testes/prints foram relatados no pedido; nenhum teste EasyDental foi reexecutado,
nenhuma nova imagem/consulta ao banco foi obtida pelo Codex. Não solicitar repetição.

Autoridade funcional e design completos: [contratos P1.R1](ficha_clinica/odontograma_contracts.md).
Proveniência: [dossiê, seção 14](reverse_engineering/easydental_odontograma_fc4.md).
Retomada: [continuação](ficha_clinica/odontograma_continuacao.md).
Validações/escopo: [checkpoint P1.R1](checkpoints/ficha_clinica_odontograma_fc4_p1_r1_checkpoint.md).
Os quadros de assets e símbolos preservam o snapshot documental P0D, não congelam
catálogo vivo nem autorizam categoria C.

## Dez decisões e requisitos adicionais incorporados

| ID | Contrato vigente |
|---|---|
| D01 | Catálogo LIVE: nome/símbolo/dados cadastrais refletem mudanças; paciente/repasse próprios permanecem |
| D02 | Slot estável é identidade; permanente/decíduo/vazio/dentição mista não deslocam intervenção |
| D03 | Grava esta confirma atual/avança; Cancelar não desfaz; todas grava/fecha em sucesso; cobrança rege fluxo; Região não editável |
| D04 | Usuário precisa prestador associado; default desse vínculo; ausência web é KNOWN_DEFECT_TO_FIX_LATER |
| D05 | Marcação vigente na inclusão; Finalização vigente ao Realizada; ambas editáveis; timestamps técnicos separados |
| D06 | Escala monetária de negócio 2; 200/3 = 66,67+66,67+66,66; soma preservada |
| D07 | Fases auxiliares reutilizáveis via genérico; exclusão em uso bloqueada; fase/conclusão/manual com proveniência inequívoca |
| D08 | Orçamento pendente durável/reaprovação; pagamento permanece; reconciliar diferença; sem veto genérico por pagamento |
| D09 | Símbolo obrigatório; ausências web são gap; cobrança Intervenção desenha lateral, Elemento/Face no odontograma |
| D10 | OWNER + idempotência + versão; novas intenções podem repetir procedimento/slot; ocorrências independentes |

Cores: ODONTOGRAM_STATUS_COLOR_SOURCE = USER_PREFERENCE;
INTERVENTION_STATUS_STORES_COLOR = NÃO; STATUS_STORES_SEMANTIC_STATE = SIM.
Preferências incluem anomalias/observada/realizada/realizar, especialidade/filtro e
apresentação. Shell precisa odontograma/lista/painéis/fases/ações/dentição/seleção/
preferências/contexto, conforme lista de 17 requisitos nos contratos.
SHELL_DECISION = PENDENTE. CURRENT_RECOMMENDATION = HYBRID: React moderno + Desktop.

## Design revisado e gaps de implementação

Intervenção referencia slot e catálogo; marcação/faixas/faces/alvos são persistidos,
sem congelar nome/símbolo. Classificação de cobrança é distinta de TIPMARCA e determina
seleção/painel; Intervenção não exige slot/não tem Grava todas. Financeiro próprio
por ocorrência; revisão/aprovação de orçamento e reconciliação separadas da inclusão.
Fases são catálogo referenciado, eventos 0..N. IDs por intenção, versão por ocorrência,
histórico automático distinto do manual. Não há UNIQUE(tratamento,slot,procedimento).

Gaps atuais continuam: associações por FDI, falta de alvos/faixas completos e vínculo
web do histórico; financeiro parcial em overrides; regra Observada requer SERVICE_RULE.
Acrescentados ao registro: usuário sem prestador é defeito; procedimento sem símbolo
é DATA_INTEGRITY_GAP; fases inline atuais precisam conciliação com catálogo reutilizável;
preferências/cobrança/reconciliação precisam integrar o futuro read/write model.
Não quantificados ou corrigidos nesta rodada; módulo Procedimentos não iniciado.

BLOCKING_BEFORE_P2 = revisão/design documentado, fechamento posterior, migração
segura e writers, políticas técnicas e integração financeira/lease/versões.
BLOCKING_BEFORE_P3 = auditoria/regularização de símbolos, shell/UX, hitboxes/
composição/preferências, subset autorizado e homologação manual.
BLOCKING_BEFORE_DELETE = implementação/testes de pendência, reaprovação/reconciliação,
preservação de pagamentos/baixas/histórico e permissões/locks/versões. Não é veto
genérico por pagamento. Delete de tratamento é operação distinta, não implementada.

## Planejamento e preservação histórica

P0D preservado; P0H/P0I pré-P1 preservados; P1 completo como design proposto em
relatório da conversa; P1.R1 completo documentalmente após decisões manuais.
P0D/P0H não são reescritos retroativamente. Recomendações antigas abaixo têm
precedência histórica, não funcional. Só reabrir D01–D10 com PROVEN_CONTRADICTION.
Após checkpoint/fechamento documental: PAUSE_FC4; próximo módulo separado:
PROCEDIMENTOS sob autorização própria. Não iniciar P2 nem Procedimentos aqui.

FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
VISUAL_IMPLEMENTATION_REQUIRES_MANUAL_HOMOLOGATION = SIM.
ANTES DE FC4-P3: AVISAR O USUÁRIO.
FC3-D5 permanece HOMOLOGATED; OWNER obrigatório e RESTRICTED/UNKNOWN fail-closed.

## Registro histórico P0H/P0I — conteúdo anterior preservado

Tudo abaixo descreve a etapa anterior. Em divergência, P1.R1 acima prevalece.
Os metadados THIS_COMMIT deste registro identificam o checkpoint P0I, não um
commit criado em P1.R1. Nenhuma proposta superada deve ser reativada.

STATUS = P0H_DOCUMENTATION_CONSOLIDATED_FOR_REVIEW
BRANCH = modularizacao-segura-fase-1
BASELINE = 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1
CURRENT_BASELINE = b47114f9cc60c54981391c7c23baa21d83a0aeb6
CURRENT_STATUS = FC4-P0H COMPLETE — checkpoint documental P0I
FC4_P0H_STATUS = COMPLETE
BASELINE_PRE_P0H = b47114f9cc60c54981391c7c23baa21d83a0aeb6
FC4_P0H_DOCUMENTATION_COMMIT = THIS_COMMIT
FC4_P1_BASELINE = FC4_P0H_DOCUMENTATION_COMMIT
LAST_COMPLETED_PHASE = FC4-P0G.R2 (última investigação concluída)
CURRENT_PHASE = FC4-P0I — fechamento documental, sem iniciar P1
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
NEXT_SAFE_PHASE = FC4-P1 — design de schema/API
CANONICAL_FLOW_STATUS = PROVEN_WITH_NON_BLOCKING_GAPS
FC4_P0C_FINAL_STATUS = COMPLETE
TECHNICAL_BLOCKERS_BEFORE_P1 = NENHUM
READY_FOR_FC4_P1 = SIM — DESIGN SOMENTE
SCHEMA_CHANGED = NÃO
MIGRATION_CREATED = NÃO

## Escopo e autoridade

Este é o estado canônico da frente **FC4**, não uma reabertura da FC3-D5. O código
atual continua sendo a fonte da verdade sobre o que está implementado. Contratos
recuperados do Desktop descrevem a referência funcional futura, não capacidades
já implementadas no Brana. Não houve migration, escrita de banco, mudança visual,
reinício ou implementação nesta fase. O fechamento P0E versiona somente a
documentação consolidada da P0D. BASELINE acima preserva a origem FC3-D5;
CURRENT_BASELINE é o commit documental P0E. P0H incorpora os resultados posteriores
P0F/P0G/R1/R2, sem versionamento, implementação ou nova observação runtime.
O versionamento dessa consolidação ocorre posteriormente em P0I. CURRENT_BASELINE
acima identifica a base pré-P0H; o checkpoint THIS_COMMIT passa a ser o baseline
para P1, sem inserir o próprio hash no seu conteúdo. Isso não inicia o design.

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
6. [Roadmap](11_roadmap_desenvolvimento.md): seção FC4 / consolidação P0H.
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
| P0F | COMPLETE; auditoria de prontidão | Lacunas estruturais encaminhadas à investigação P0G |
| P0G | PARTIAL investigativo | Não equivale à implementação nem à exaustão global do binário |
| P0G.R1 | STOPPED sem mutação | Inspeção direta de janela indisponível; não prova ausência de runtime |
| P0G.R2 | COMPLETE; prestador fechado e requisitos pré-P1 consolidados | Observação manual e evidência estática; propostas Brana separadas do legado |
| P0H | COMPLETE; consolidação documental | Sem commit/push na rodada P0H; versionamento posterior em P0I; P1 não iniciada |

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

BLOCKING_BEFORE_P1 = NENHUM. A liberação é para design, não para implementação.
Os requisitos e decisões de P1 estão integralmente nos [contratos](ficha_clinica/odontograma_contracts.md).
BLOCKING_BEFORE_BACKEND_IMPLEMENTATION = alvos/faixas; histórico/transações;
ownership financeiro; regra Observada; batch/retry; idempotência; versão/stale
update; validações tenant/paciente/tratamento/prestador.
BLOCKING_BEFORE_DELETE_IMPLEMENTATION = aprovação; lançamento; pagamento;
reconciliação; permissões; histórico relacionado.
BLOCKING_BEFORE_P3_VISUAL = UX; hitboxes; composição; símbolo versionado;
subset de assets autorizado; homologação manual.
NON_BLOCKING_GAPS = pixel-a-pixel legado; símbolo inválido fora do catálogo válido;
autorização individual dos recursos C; cobertura visual integral ainda PARCIAL.
Nenhum desses gaps foi escondido ou considerado implementado.

## Consolidação posterior P0F/P0G/R1/R2

- Prestador: obrigatório e não nulo no legado; editável; default do prestador
  vinculado ao usuário corrente. Regra generalizada STRONG, caso manual Tel→Tel
  registrado no dossiê. Persistência ID/FK, sem snapshot integral do nome.
- Catálogo/história legado: HYBRID; valores próprios por intervenção; símbolo
  HYBRID; sem snapshot explícito completo do tipo aplicado. Recomendação Brana:
  híbrido explícito, preservando representação aplicada e referência ao catálogo.
- Slot histórico: lógico original; FDI/número exibido não são identidade;
  renumeração não reidentifica a associação histórica.
- Datas: DATCAD clínica; DATFIN finalização completa; timestamps técnicos;
  HISTORICO.DATA fase/evento. DATE_SEMANTICS_READY = SIM.
- Histórico web: vínculo inequívoco à intervenção + legacy source id separado,
  cardinalidade 0..N. Modelo atual insuficiente; ciclo e confiança por evento nos contratos.
- Financeiro: propriedades próprias da INTERVENCAO no legado; JSON/overrides
  Brana PARCIAL. BUDGET_OBSERVED_MISMATCH = CONFIRMED; ajuste esperado SERVICE_RULE.
- Requisitos Brana futuros: unidade clínica atômica; lote com resultados parciais
  e STOP proposto; idempotência comando/unidade; versão esperada/CAS além do lease.
- Exclusão financeira: decisão não bloqueia P1, mas bloqueia implementação do
  delete. Não há reversão automática comprovada; finalização pode opcionalmente
  lançar CCPACIENTE, o que não significa parcela automática pelo orçamento.

Isso consolida evidência suficiente para design; não afirma exaustão técnica
global da política de catálogo, aprovação de todas as decisões ou correção do código atual.

SELECTION_UX_DECISION = PENDING_USER_DECISION (Desktop-like / Cloud-like / Hybrid).
FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
**FC4-P3 introduz alterações visuais e requer homologação manual.** Avisar o usuário
explicitamente antes dessa fase; não começar P1 ou P3 automaticamente.

FC3-D5 permanece HOMOLOGATED: OWNER obrigatório no domínio de escrita clínica;
RESTRICTED/UNKNOWN fail-closed; backend é autoridade final. Takeover fora do escopo.
