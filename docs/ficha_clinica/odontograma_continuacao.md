# FC4 — onde continuar

CURRENT_BASELINE = 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1
BRANCH = modularizacao-segura-fase-1
CURRENT_STATUS = FC4-P0E documental concluída; implementação não iniciada
LAST_SAFE_PHASE = FC4-P0E — fechamento documental da consolidação FC4-P0D
NEXT_SAFE_PHASE = FC4-P1 — design de schema/API
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
DATABASE_MIGRATION_CREATED = NÃO
CURRENT_BLOCKERS = NENHUM para iniciar o design P1 sob autorização separada; gaps de implementação preservados
NON_BLOCKING_GAPS = autorização C, desenho pixel-a-pixel, referência inválida fora do catálogo válido
SELECTION_UX_DECISION = PENDING_USER_DECISION

## AUTHORITATIVE_DOCS

- [Estado](../ficha_clinica_odontograma_estado_atual.md)
- [Contratos](odontograma_contracts.md)
- [Dossiê](../reverse_engineering/easydental_odontograma_fc4.md)
- [Assets](odontograma_assets_map.md)
- [Símbolos](odontograma_symbol_assets_matrix.md)
- [Roadmap](../11_roadmap_desenvolvimento.md), seção FC4-P0D
- [Lease congelado](../ficha_clinica_estado_atual.md)

## DO_NOT_REOPEN

Sem contradição objetiva, não repetir engenharia reversa de slot/slot vazio,
seis tipos de marcação, Grava esta/todas, tratamento de destino, status,
orçamento, ausência de interrupt/repeat dedicado, cópia de tratamento, hard delete,
orientação posicional de faces, cardinalidade Grupo/Segmento/Arcada e OWNER obrigatório.
Não converter confiança STRONG em PROVEN pelo simples fato de estar documentada.

## NEXT_PROMPT_OBJECTIVE

Iniciar somente sob autorização separada o design FC4-P1 de schema/API, usando
as diferenças Brana documentadas. Não começar implementação, migration, P3 ou
D6 automaticamente.

Primeira fase visual = FC4-P3. **FC4-P3 introduz alterações visuais e requer
homologação manual.** Avisar o usuário antes. Opções Desktop-like, Cloud-like,
Hybrid ainda sem escolha. Assets C não estão liberados; ausência de bitmap não
elimina slot nem hitbox. Não usar FDI como identidade automática do slot.

## Restrições permanentes desta entrega

FC3-D5 HOMOLOGATED; frontend legado REFERENCE_ONLY; não copiar assets EasyDental;
não alterar runtime saudável, banco ou schema. Arquivos novos são somente docs;
matrizes são artefatos documentais duráveis, não manifests temporários de runtime.
