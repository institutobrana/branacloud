# Brana Cloude — FC4-P1.R1 / checkpoint documental de reconciliação

STATUS = COMPLETE — DOCUMENTAÇÃO PARA REVISÃO, NÃO IMPLEMENTAÇÃO
DOCUMENTATION_DATE = 2026-10-05
BRANCH = modularizacao-segura-fase-1
BASELINE = 6e7cdd5de3551f4d1b120f5d0da579e364746d38
HEAD_AT_START = 6e7cdd5de3551f4d1b120f5d0da579e364746d38
WORKTREE_CLEAN_AT_START = SIM
CHECKPOINT_SCOPE = FC4-P1.R1: 10 decisões manuais, design reconciliado e continuidade
CHECKPOINT_COMMIT = NOT_CREATED_IN_THIS_ROUND
GIT_CLOSE = POSTERIOR SOB AUTORIZAÇÃO
MANUAL_DECISIONS_DOCUMENTED = 10/10
READY_FOR_P1_R1_CHECKPOINT = SIM — sujeito à revisão documental
FC3_D5 = HOMOLOGATED / PRESERVED
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
SCHEMA_CHANGED = NÃO
MIGRATION_CREATED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
P2_STARTED = NÃO
AUDITORIA_PROCEDIMENTOS_STARTED = NÃO

## Proveniência, autoridade e limites

P0D preserva investigação/consolidação naquele momento. P0H/P0I consolidam pré-P1,
versionados no baseline acima. P1 foi relatório de design proposto na conversa,
sem alteração de arquivos. P1.R1 documenta correção após testes/prints informados
pelo usuário: EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE. Não é claim de novos
prints/queries/testes capturados pelo Codex. Nenhum caminho/hash de print não entregue
foi inventado; o registro descritivo integral está nos contratos/dossiê.
Não pedir repetição. Não reabrir D01–D10 sem PROVEN_CONTRADICTION = SIM e prova.

O checkpoint P0D NÃO foi alterado. Notas P0H/P0I e matrizes continuam históricas;
os textos antigos preservados têm marcação de histórico/superação e não prevalecem
sobre P1.R1. Não criar hash recursivo: commit inexistente nesta rodada. Fechamento
Git futuro deve registrar hash externamente ou referência THIS_COMMIT própria.

## Entregáveis e lista seletiva autorizada

1. [Estado](../ficha_clinica_odontograma_estado_atual.md).
2. [Contratos/design e roundtrip](../ficha_clinica/odontograma_contracts.md).
3. [Dossiê/manual, seção 14](../reverse_engineering/easydental_odontograma_fc4.md).
4. [Assets](../ficha_clinica/odontograma_assets_map.md).
5. [Símbolos](../ficha_clinica/odontograma_symbol_assets_matrix.md).
6. [Continuidade](../ficha_clinica/odontograma_continuacao.md).
7. [Roadmap](../11_roadmap_desenvolvimento.md), seção P1.R1 posterior.
8. Este checkpoint: docs/checkpoints/ficha_clinica_odontograma_fc4_p1_r1_checkpoint.md.

Sete documentos existentes alterados + um checkpoint criado. Nada fora de docs.
Assets/aliases/matrizes não reauditorados nem regularizados: 2.147 candidatos,
1.213 hashes únicos, 181 com caminho A/B autorizado; 81 símbolos/79 nomes gráficos/
zero referências ausentes no snapshot. Autorização C não mudou.

## Decisões incorporadas

| Decisão | Evidência/correção vigente | Resultado documental |
|---|---|---|
| 1 | Catálogo LIVE, nome/símbolo refletem mudanças; valores próprios paciente/repasse não | PASS |
| 2 | Slot identidade; FDI/imagem não; decíduo/vazio/mista mantêm ocorrência | PASS |
| 3 | Esta confirma/avança sem rollback por Cancelar; todas confirma/fecha; cobrança rege fluxo; Região label | PASS |
| 4 | Usuário sem prestador não é válido; default vínculo; web sem vínculo é defeito futuro | PASS |
| 5 | Defaults vigentes de Marcação/Finalização ao Realizada, editáveis; técnicos separados | PASS |
| 6 | Duas casas de negócio e 66,67/66,67/66,66; soma exata, precisão interna não provada | PASS |
| 7 | Fases auxiliares reutilizáveis via genérico; fase em uso protegida; fase/conclusão/manual distintos | PASS |
| 8 | Orçamento pendente durável, reaprovar/reconciliar preservando pagamento; sem veto genérico de delete | PASS |
| 9 | Símbolo obrigatório, ausência é gap; Intervenção lateral, Elemento/Face odontograma | PASS |
| 10 | OWNER + replay versus nova intenção + versão/auditoria; ocorrências repetidas independentes | PASS |

BILLING_CLASSIFICATION_DOCUMENTED = SIM.
DUPLICATE_INTENTIONAL_INTERVENTIONS_DOCUMENTED = SIM.
USER_ODONTOGRAM_PREFERENCES_DOCUMENTED = SIM.
SHELL_REQUIREMENTS_DOCUMENTED = SIM.
ODONTOGRAM_STATUS_COLOR_SOURCE = USER_PREFERENCE.
INTERVENTION_STATUS_STORES_COLOR = NÃO.
UNIQUE_CONSTRAINT_TREATMENT_SLOT_PROCEDURE = PROIBIDA.
SHELL_DECISION = PENDENTE; HYBRID é recomendação, não decisão final.
PROCEDURE_PHASE_IS_AUXILIARY_CATALOG = SIM.
FINANCIAL_RECONCILIATION_MODEL = PRESERVE_REALIZED_PAYMENT_AND_RECONCILE_DIFFERENCE.
DELETE_INTERVENTION_BLOCKED_IF_PAYMENT_EXISTS = NÃO como regra geral.

## Design e contradições resolvidas

Quadro de reconciliação dos contratos: C01 símbolo congelado; C02 descrição
congelada; C03 usuário sem vínculo como fluxo normal; C04 veto financeiro genérico;
C05 procedimento legitimamente sem símbolo; C06 data somente explícita versus
default automático; C07 todas sem restrição de cobrança; C08 TIPMARCA como único
decisor do alvo visual. Complementos E01–E06 (slot, centavos, fases, intenções, cor,
cancelamento) não aumentam artificialmente o contador.

P1_DESIGN_CONTRADICTIONS_FIXED = 8.
P1_DESIGN_REMAINING_CONTRADICTIONS = 0.
REVISED_SCHEMA_DESIGN_STATUS = COMPLETE — CONCEITUAL.
REVISED_API_DESIGN_STATUS = COMPLETE — CONCEITUAL.

Schema: agregado de intervenção, slot estável/estado mutável, targets/ranges/faces,
tipo aplicado, cobrança/contexto, catálogo vivo/símbolo obrigatório, financeiro
próprio, catálogo de fases e eventos, FK web/proveniência do histórico, revisão de
orçamento/reconciliação, ledger idempotente/version e preferências por usuário.
API: normalização por cobrança, create/esta/todas, update, fase/completa, delete
individual, leitura contextual/catalogo vivo/preferências, pendência/reaprovação
financeira e retorno por unidade. Tenant/módulos/OWNER/versão em toda mutação clínica.
Aprovação financeira é operação separada; delete integral de tratamento também.

## Validação conceitual e documental

ROUNDTRIP_REVISED_STATUS = PASS.
ROUNDTRIP_REVISED_CASES = 21 — A–U.
ROUNDTRIP_REVISED_PASS = 21.
ROUNDTRIP_REVISED_FAIL = 0.
ROUNDTRIP_REVISED_LOSS_CASES = NENHUM nos casos projetados.
Casos I/M seguem símbolo vivo; J/N mantêm valores próprios. K/L mantêm IDs/estados
independentes; O/P slot decíduo/vazio; Q Intervenção sem slot/lateral; R eventos de
fase repetidos/datas distintas; S/T crédito/débito 500 sem estorno; U cor pessoal.
Controle de centavos 20.000 = 6.667+6.667+6.666 e replay sem terceira ocorrência.

Simulação em memória, NÃO teste de implementação/schema/DB/renderer/EasyDental.
Nenhum teste manual do usuário foi repetido; nenhum script de aplicação/migração
foi executado. Build/testes funcionais/runtime não executados: source não mudou.

DOCUMENTATION_CONTRADICTIONS = 0
MOJIBAKE_CHECK = PASS — UTF-8 e conteúdo alterado
LINK_REVIEW = PASS
ASSET_MATRIX_INTACT = SIM
SYMBOL_MATRIX_INTACT = SIM
GIT_DIFF_CHECK = PASS

Revisão UTF-8 estrita nos oito documentos; links locais resolvidos. Matrizes
tabulares de assets/símbolos preservadas integralmente em relação ao baseline.
Mojibake histórico preexistente no roadmap permanece inalterado e fora do escopo;
nenhuma correção genérica foi feita. PASS de encoding não significa saneamento
retroativo desses trechos. Não houve nova inspeção de assets nem liberação de C.

## Blockers, pausa e próximo trabalho separado

BLOCKING_BEFORE_P2 = revisão/design documentado e fechamento posterior; migração
segura/rollback; inventário dos writers; políticas técnicas/contexto/erro de lote/
centavos/locks/permissões/compatibilidade e reconciliação por revisão.
BLOCKING_BEFORE_P3 = auditar/regularizar símbolos no módulo separado; shell/UX;
hitboxes/composição/preferências; recursos A/B e homologação manual.
BLOCKING_BEFORE_DELETE = integrar/testar pendência/reaprovação/reconciliação,
pagamentos/baixas preservados, histórico automático/manual, permissões/lease/
versão/locks. Veto genérico por pagamento REMOVIDO; delete tratamento é distinto.

AFTER_P1_R1_CHECKPOINT = PAUSE_FC4.
FC4_PAUSE_AFTER_CHECKPOINT = SIM.
NEXT_SEPARATE_MODULE = PROCEDIMENTOS.
Auditar/quantificar procedimentos sem símbolo, listar tabelas, cadastro/validação
obrigatória e plano seguro de regularização, sem inventar símbolo e preservando
dados. Não iniciar essa auditoria aqui. Não iniciar P2.
FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
VISUAL_IMPLEMENTATION_REQUIRES_MANUAL_HOMOLOGATION = SIM.
ANTES DE FC4-P3: AVISAR O USUÁRIO.

## Segurança e fechamento posterior

DOCUMENTATION_FILES_CHANGED = 8.
SOURCE_FILES_CHANGED = 0.
FILES_CHANGED_OUTSIDE_DOCS = 0.
DATABASES_CHANGED = 0.
REGISTRY_CHANGED = 0.
DSN_CHANGED = 0.
RUNTIME_CHANGED = NÃO.
COMMIT_CREATED = NÃO.
PUSH_PERFORMED = NÃO.
FETCH_PERFORMED = NÃO.
Staging/commit/push/validação remota são uma rodada posterior explicitamente
autorizada. Worktree final terá somente os oito documentos desta lista, para revisão.
