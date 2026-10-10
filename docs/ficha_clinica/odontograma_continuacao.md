# Brana Cloude — FC4 / onde continuar após P1.CLOSE

CURRENT_STATUS = P1_COMPLETE
LAST_COMPLETED_PHASE = FC4_P1_CLOSE
NEXT_SAFE_PHASE = P2 — somente após autorização separada
P2_STATUS = NOT_STARTED
READY_FOR_FC4_P2 = SIM
BASELINE_PRE_CLOSE = b9f4fee8a5f15ebdb5328b6f28d0f8abe7d9d777
BRANCH = modularizacao-segura-fase-1

Leia o [contrato canônico vigente](odontograma_contracts.md), especialmente
D01–D10, AA (primeiro pacote P2) e AB (20 deferidos). Não criar contrato paralelo.
P1 fecha contrato + segurança R1.1; não implementa writer, lista ou odontograma.
P2 começa pelo inventário real de schema/dados/proveniência e prova isolada,
não por DML produtivo. Procedimentos está COMPLETE no baseline acima.

Grava esta confirma uma unidade e persiste; Grava todas confirma um procedimento
× N unidades ALL_OR_NOTHING. TIPOCOBR não determina alvo; TIPMARCA determina.
Preservar OWNER/tenant/módulo e futuros gates CAS/idempotência/rollback.
Avisar antes de P3 visual e exigir homologação manual. Não iniciar P2 agora.

## Registro histórico — superseded pelo P1.CLOSE

Todo o conteúdo abaixo, inclusive “vigente”, pausa em Procedimentos, P1.R1 e
planejamento P2–P9, é evidência histórica. Não é instrução atual de retomada.

# FC4 — onde continuar

CURRENT_BASELINE = 6e7cdd5de3551f4d1b120f5d0da579e364746d38
BRANCH = modularizacao-segura-fase-1
CURRENT_STATUS = FC4-P1.R1 COMPLETE — documentação reconciliada para revisão
LAST_COMPLETED_PHASE = FC4-P1.R1
LAST_SAFE_PHASE = FC4-P1.R1 — design/documentação, não implementação
NEXT_SAFE_PHASE = REVISÃO E FECHAMENTO GIT DOCUMENTAL POSTERIOR, sob autorização
FC4_P1_STATUS = COMPLETE — design proposto anterior, corrigido em P1.R1
FC4_P1_R1_STATUS = COMPLETE
READY_FOR_P1_R1_CHECKPOINT = SIM
MANUAL_DECISIONS_DOCUMENTED = 10/10
P1_DESIGN_CONTRADICTIONS_FIXED = 8
P1_DESIGN_REMAINING_CONTRADICTIONS = 0
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
SELECTION_UX_DECISION = PENDENTE
SHELL_DECISION = PENDENTE
CURRENT_RECOMMENDATION = HYBRID: React moderno + comportamento clínico Desktop

## Como retomar sem esta conversa

1. Ler [contratos vigentes P1.R1](odontograma_contracts.md): D01–D10, schema/API,
   reconciliação do relatório P1 e roundtrip A–U.
2. Ler [checkpoint P1.R1](../checkpoints/ficha_clinica_odontograma_fc4_p1_r1_checkpoint.md)
   e [dossiê, seção 14](../reverse_engineering/easydental_odontograma_fc4.md).
3. Revisar o diff somente documental. Fechamento Git será rodada posterior com
   autorização própria; não executar commit/push nesta rodada.
4. Após checkpoint/versionamento, manter FC4 pausada. Próximo módulo separado:
   Procedimentos, somente quando autorizado. Não iniciar P2/visual/regularização
   automaticamente nem exigir repetir testes do usuário.

## AUTHORITATIVE_DOCS

- [Estado](../ficha_clinica_odontograma_estado_atual.md).
- [Contratos](odontograma_contracts.md).
- [Dossiê](../reverse_engineering/easydental_odontograma_fc4.md).
- [Assets](odontograma_assets_map.md).
- [Símbolos](odontograma_symbol_assets_matrix.md).
- [Roadmap](../11_roadmap_desenvolvimento.md), seção P1.R1 posterior.
- [Checkpoint P1.R1](../checkpoints/ficha_clinica_odontograma_fc4_p1_r1_checkpoint.md).
- [Checkpoint histórico P0D](../checkpoints/ficha_clinica_odontograma_fc4_p0d_checkpoint.md):
  preservado, NÃO reescrito nesta rodada.
- [FC3-D5](../ficha_clinica_estado_atual.md): permanece HOMOLOGATED.

## DO_NOT_REOPEN — D01–D10

EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE; relato de testes/prints do usuário,
não novas capturas/traces/SELECT do Codex. Não solicitar repetição. Só reabrir com
PROVEN_CONTRADICTION = SIM, prova objetiva e preservação da origem.

1. Catálogo LIVE: nome/símbolo seguem cadastro; paciente/repasse são valores próprios.
2. Slot estável é identidade; FDI/figura não; vazio, decíduo e dentição mista não movem ocorrência.
3. Grava esta confirma região atual e avança; Cancelar não desfaz gravados; todas
   confirma selecionados e fecha em sucesso. Cobrança Intervenção não exige slot
   e não oferece Grava todas. Região é apresentação não editável.
4. Usuário deve possuir prestador associado; default dele. Ausência web é defeito,
   não fluxo normal para escolher outro prestador e contornar vínculo.
5. Marcação default data clínica vigente; Realizada preenche Finalização vigente;
   ambas editáveis e diferentes de timestamps técnicos.
6. Dinheiro de negócio com duas casas; parcelamento soma exata e resto determinístico.
7. Fases auxiliares reutilizáveis via genérico; fase em uso não pode excluir;
   baixas PHASE_HISTORY independentes, conclusão completa e narrativa manual distintas.
8. Mudança de orçamento pendente até ajuste/reaprovação; pagamento preservado;
   reconciliar diferença, não estornar baixa clínica/cirurgião; sem veto genérico
   de delete por pagamento; delete tratamento é operação diferente.
9. Todo procedimento válido tem símbolo; ausências web são gap; Intervenção render
   lateral e Elemento/Face no odontograma. Não inventar símbolo.
10. OWNER + idempotência + versão; inclusão consciente repetida gera nova ocorrência;
    UNIQUE(tratamento,slot,procedimento) proibida.

Também preservar: seis marcações/cardinalidades/faixas e faces posicionais; contexto
selecionado de tratamento; status 1/2/3; orçamento exclui Observada; hard delete;
sem interrupt/repeat dedicado legado; cópia de tratamento não é replay de comando.
Cores são preferências por usuário, não atributo clínico. Shell ainda pendente.

## BLOCKERS_BY_PHASE

BLOCKING_BEFORE_P2 = design documentado/revisado e fechamento posterior; plano seguro
de migração; inventário dos writers; políticas técnicas de data/contexto/centavos,
batch/retry/locks, permissões e revisão/reconciliação orçamentária.
BLOCKING_BEFORE_P3 = auditoria/regularização de símbolos; shell/UX; hitboxes/composição;
preferências; autorização A/B e homologação manual.
BLOCKING_BEFORE_DELETE = integração/testes financeiros por revisão, reaprovação,
preservação de pagamentos/baixas; histórico automático/manual; permissões/lease/
version/locks. Pagamento existente não é veto genérico; esse blocker antigo caiu.
Nenhum blocker pede repetir D01–D10. Correção de usuário sem prestador é futura.

FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
VISUAL_IMPLEMENTATION_REQUIRES_MANUAL_HOMOLOGATION = SIM.
ANTES DE FC4-P3: AVISAR O USUÁRIO.

## NEXT_PROMPT_OBJECTIVE

Revisar esta consolidação e, somente em rodada autorizada, fechar documentalmente
Git/checkpoint. Depois PAUSE_FC4. Módulo separado Procedimentos deverá auditar
quantidade/tabelas de procedimentos sem símbolo, regra atual de cadastro/validação
e plano de regularização preservando dados, SEM símbolo inventado. Esse módulo
não foi iniciado aqui. P2 permanece não iniciado.

## Proveniência e restrições

P0D = estado técnico naquele momento; P0H/P0I = consolidação pré-P1 versionada;
P1 = relatório proposto anterior aos testes; P1.R1 = correção documental após
10 decisões manuais. As recomendações antigas HYBRID/representação imutável,
fallback sem vínculo e bloqueio genérico financeiro abaixo são HISTÓRICAS SUPERADAS,
não decisões vigentes. CURRENT_BASELINE antigo/THIS_COMMIT abaixo pertence ao P0I
já versionado em 6e7cdd5de3551f4d1b120f5d0da579e364746d38, não ao checkpoint novo.
Não alterar backend/frontend/schema/DB/runtime, criar migration, iniciar P2/
Procedimentos, commitar ou pushar nesta rodada.

## Registro histórico P0H/P0I — conteúdo anterior preservado

Tudo abaixo descreve a etapa anterior. Em divergência, P1.R1 acima prevalece.
Os metadados THIS_COMMIT deste registro identificam o checkpoint P0I, não um
commit criado em P1.R1. Nenhuma proposta superada deve ser reativada.

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
