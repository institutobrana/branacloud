# FC4 — onde continuar

CURRENT_BASELINE = b47114f9cc60c54981391c7c23baa21d83a0aeb6
BRANCH = modularizacao-segura-fase-1
CURRENT_STATUS = FC4-P0H COMPLETE — checkpoint documental P0I
FC4_P0H_STATUS = COMPLETE
BASELINE_PRE_P0H = b47114f9cc60c54981391c7c23baa21d83a0aeb6
FC4_P0H_DOCUMENTATION_COMMIT = THIS_COMMIT
FC4_P1_BASELINE = FC4_P0H_DOCUMENTATION_COMMIT
LAST_SAFE_PHASE = FC4-P0G.R2 — investigação concluída, incorporada documentalmente em P0H
LAST_COMPLETED_PHASE = FC4-P0G.R2
NEXT_SAFE_PHASE = FC4-P1 — DESIGN DE SCHEMA/API
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
CURRENT_BLOCKERS = NENHUM para iniciar o design P1 sob autorização separada; gaps de implementação preservados
TECHNICAL_BLOCKERS_BEFORE_P1 = NENHUM
READY_FOR_FC4_P1 = SIM — DESIGN SOMENTE
SCHEMA_CHANGED = NÃO
MIGRATION_CREATED = NÃO
EASYDENTAL_RUNTIME_REQUIRED = NÃO para iniciar P1
NON_BLOCKING_GAPS = autorização C, desenho pixel-a-pixel, referência inválida fora do catálogo válido
SELECTION_UX_DECISION = PENDING_USER_DECISION

CURRENT_BASELINE identifica a base da consolidação P0H. Seu versionamento é a
rodada posterior P0I; o commit deste checkpoint (THIS_COMMIT) é o baseline para
P1. LAST_COMPLETED_PHASE conserva a última investigação concluída, P0G.R2;
P0H é a consolidação documental concluída, não uma nova investigação.

## AUTHORITATIVE_DOCS

- [Estado](../ficha_clinica_odontograma_estado_atual.md)
- [Contratos](odontograma_contracts.md)
- [Dossiê](../reverse_engineering/easydental_odontograma_fc4.md)
- [Assets](odontograma_assets_map.md)
- [Símbolos](odontograma_symbol_assets_matrix.md)
- [Roadmap](../11_roadmap_desenvolvimento.md), seção FC4 / consolidação P0H
- [Checkpoint histórico P0D](../checkpoints/ficha_clinica_odontograma_fc4_p0d_checkpoint.md), com referência posterior P0H
- [Lease congelado](../ficha_clinica_estado_atual.md)

## DO_NOT_REOPEN

Sem contradição PROVEN, não repetir engenharia reversa de slot/slot vazio,
seis tipos de marcação, Grava esta/todas, tratamento de destino, status,
orçamento, ausência de interrupt/repeat dedicado, cópia de tratamento, hard delete,
orientação posicional de faces, cardinalidade Grupo/Segmento/Arcada e OWNER obrigatório.
Também congelados: DATCAD clínica/DATFIN finalização completa; timestamps técnicos;
prestador default por usuário vinculado (regra STRONG, não generalizar o caso Tel);
slot lógico como identidade histórica; valores próprios por intervenção;
histórico web requer vínculo inequívoco separado da origem, cardinalidade 0..N;
lease não substitui stale protection. Catálogo legado HYBRID não prova snapshot
integral; o híbrido explícito Brana é recomendação de design, não comportamento legado.
Não converter confiança STRONG em PROVEN pelo simples fato de estar documentada.

## NEXT_PROMPT_OBJECTIVE

Iniciar somente sob autorização separada o design FC4-P1 de schema/API, usando
as diferenças Brana documentadas e o checklist P1_DESIGN_DECISIONS_REQUIRED dos
contratos: alvos/slot vazio, faixas por arcada, faces, histórico/proveniência,
financeiro próprio, catálogo/representação aplicada, idempotência comando/unidade,
versão/CAS, locks/transações, comandos/read model/erros e roundtrip dos seis tipos,
incluindo renumeração e mudança posterior do catálogo. Não começar implementação, migration, P3 ou
D6 automaticamente.

## BLOCKERS_BY_PHASE

BLOCKING_BEFORE_P1 = NENHUM.
BLOCKING_BEFORE_BACKEND_IMPLEMENTATION = alvos/faixas; histórico/transações;
ownership financeiro; regra Observada; batch/retry; idempotência; versão/stale
update; validações tenant/paciente/tratamento/prestador.
BLOCKING_BEFORE_DELETE_IMPLEMENTATION = aprovação; lançamento; pagamento;
reconciliação; permissões; histórico relacionado. Política pode ser desenhada em
P1; não há reversão automática comprovada.
BLOCKING_BEFORE_P3_VISUAL = UX; hitboxes; composição; símbolo versionado;
subset autorizado; homologação manual.

P0F = COMPLETE; P0G = PARTIAL investigativo; P0G.R1 = STOPPED sem mutação;
P0G.R2 = COMPLETE; P0H = COMPLETE. Prestador está fechado por observação manual e convergência
estática. P0H consolida essas evidências, não executa novas ações no Desktop.
Batch STOP é proposta Brana (LEGACY_BATCH_ON_ERROR=UNPROVEN), com atomicidade por
unidade, resultado parcial e retry só de falhas/pendentes. Híbrido explícito,
idempotência e proteção stale são requisitos futuros, não código implementado.

Primeira fase visual = FC4-P3. **FC4-P3 introduz alterações visuais e requer
homologação manual.** Avisar o usuário antes. Opções Desktop-like, Cloud-like,
Hybrid ainda sem escolha. Assets C não estão liberados; ausência de bitmap não
elimina slot nem hitbox. Não usar FDI como identidade automática do slot.

## Restrições permanentes desta entrega

FC3-D5 HOMOLOGATED; frontend legado REFERENCE_ONLY; não copiar assets EasyDental;
não alterar runtime saudável, banco ou schema. Arquivos novos são somente docs;
matrizes são artefatos documentais duráveis, não manifests temporários de runtime.
