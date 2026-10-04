# FC4 — contratos funcionais canônicos recuperados

STATUS = P0H_CONSOLIDATED_FOR_REVIEW; implementação FC4 não iniciada.
Baseline funcional FC3-D5: 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1.
CURRENT_BASELINE = b47114f9cc60c54981391c7c23baa21d83a0aeb6 (P0E documental).
Referência: Desktop EasyDental 7.6 auditado; Cloud é referência UX separada.
Detalhes técnicos/confiança estão no [dossiê](../reverse_engineering/easydental_odontograma_fc4.md).

## Seleção e contexto

SELECTION_TARGET = SLOT ODONTOLÓGICO. Slot vazio continua selecionável; bitmap e
FDI não são requisitos da identidade/hitbox. SLOT_IDENTITY != FDI automaticamente.
Desktop: clique; Ctrl+clique adiciona; Shift/drag selecionam intervalo; Esc limpa.
Cloud: modo Seleção explícito, acumulativo. Brana: decisão UX pendente; nenhuma
dessas referências é decisão de produto nesta fase.

Tratamento/guia selecionado determina NROTRA de destino. Filtros históricos não
alteram automaticamente o tratamento de destino. Sem contexto válido, não
inventar criação automática nem escolher outro tratamento.

## Marcações, cardinalidade e render

| Código | Tipo | Unidade de gravação | DENTE/FACE | Região/render |
|---:|---|---|---|---|
| 1 | FACE | Elemento associado às faces | FACE com cinco flags; não presumir DENTE obrigatório | Faces selecionadas do slot |
| 2 | DENTE | Elemento selecionado | Uma associação DENTE por slot | Símbolo no elemento |
| 3 | GRUPO | Trecho contíguo, separado em 16/17 | DENTE por slot abrangido | Composição contínua no trecho |
| 4 | ARCADA | Uma intervenção por arcada | 16 DENTE numa arcada completa | Superior 1–16 / inferior 17–32 |
| 5 | GERAL | Contexto geral | Sem writer DENTE/FACE no fluxo recuperado | Área geral da boca |
| 6 | SEGMENTO | Uma intervenção por arcada selecionada | DENTE por slot dos vários trechos | União dos trechos, sem preencher lacunas |

Não há regra universal 1 dente = 1 intervenção. Ambas as arcadas em ARCADA ou
SEGMENTO geram dois contextos de gravação. Região usa a numeração do tratamento,
preservando faixas; não presumir numeração FDI a partir do índice de slot.

Exemplo derivado, não teste de banco: slots 2,3,7,8,18 → GRUPO: três intervenções
com 2/2/1 associações; SEGMENTO: duas com 4/1; ARCADA: duas com 16/16. Esse exemplo
explica o contrato recuperado, não altera dados reais.

## Faces por posição

| Campo | SLOT_RANGE | ANATOMICAL_MEANING |
|---|---|---|
| FACE1 | 1–16 | Vestibular |
| FACE1 | 17–32 | Lingual |
| FACE2 | 1–8 e 17–24 | Mesial |
| FACE2 | 9–16 e 25–32 | Distal |
| FACE3 | 1–16 | Palatina |
| FACE3 | 17–32 | Vestibular |
| FACE4 | 1–8 e 17–24 | Distal |
| FACE4 | 9–16 e 25–32 | Mesial |
| FACE5 | 6–11 e 22–27 | Incisal |
| FACE5 | Demais slots | Oclusal |

SLOT POSITION não é FDI automaticamente. Imagem arc_faces, hitbox anatômica e
pintura são contratos diferentes. Conversão fixa do importador histórico Brana
não prova essa orientação e não deve ser reutilizada cegamente.

## Gravação

Grava esta: validações → contexto → INSERT/UPDATE intervenção → writers por
marcação → histórico → transação → refresh → próximo elemento ou fechamento.
Grava todas: reutiliza FormOk do índice atual até o último. Não promete uma única
transação externa atômica para o lote nem continuidade universal depois de erro.
Gravação deve preservar paciente/tratamento/procedimento, prestador, situação,
datas, observações, alvos, valores e opção de exclusão do orçamento.

## Situação, símbolo e visual

1 Observada / verde; 2 Realizada / azul; 3 Realizar / vermelho. Cores históricas
configuráveis, não obrigatoriamente embutidas no asset. Não criar Interrompida.

Intervenção → (NROTAB,NROINT) → procedimento → NROSIM → _SIMBOLO_ODONTO → TIPMARCA/TIPSIMB
→ BITMAP1/2/3/ICONE → alvo → situação/cor. Ícone de picker não equivale a símbolo
clínico composto. Render conforme a tabela de marcação; pixel-a-pixel legado não
é requisito. Símbolo inválido: fora do contrato válido recuperado; sem fallback
inventado, sem provocar corrupção para descobrir comportamento.

## Orçamento

Inclusão: STATUS != Observada AND ORCAMENTO = 0. ORCAMENTO significa “Não incluir”.
Observada não entra; Realizar e Realizada entram se não excluídas. Valores próprios:
VALOR_PACIENTE e VALOR_REPASSE; demais campos financeiros: DATA_REPASSE, COD_GLOSA,
MSG_AUTOR. Aparecer no orçamento != gerar parcela. Aprovação financeira separada.

Brana atual possui overrides no source_payload. Gap futuro: formalizar ownership
dos valores/exclusão e compatibilizar o tratamento de Observada; não corrigir agora.

## Edição, histórico, finalização e exclusão

- Editar: intervenção selecionada → propriedades preenchidas → Grava esta.
- Histórico no helper recuperado: Realizada insere; edição de realizada atualiza
  data/auditoria; outra situação remove o histórico nesse caminho. Não generalizar
  isso para todo uso da tabela HISTORICO.
- Finalização completa: STATUS=2, DATFIN, HISTORICO e refresh. Fases intermediárias
  podem registrar histórico sem finalizar toda a intervenção.
- Exclusão: hard delete com limpezas relacionadas, cascade DENTE/FACE/HISTORICO,
  CustomData, refresh e auditoria conforme caminho. Item desaparece da visão de
  orçamento baseada em intervenção. Não há estorno automático comprovado de parcelas.
- Permissões/regras de orçamento aprovado e tratamento finalizado devem ser
  consideradas; não prometer exclusão irrestrita nem desenhar financeiro inteiro.
- Interromper intervenção: NÃO na versão auditada. Interromper tratamento: SIM.
- Repetir intervenção dedicado: NÃO na versão auditada. Copiar intervenções Realizar
  do tratamento anterior ao criar novo tratamento: SIM, incluindo DENTE/FACE.

## Prestador e observação manual P0G.R2

PROVIDER_REQUIRED = SIM.
PROVIDER_NULL_ALLOWED = NÃO no legado INTERVENCAO auditado.
PROVIDER_EDITABLE = SIM.
DEFAULT_PROVIDER_SOURCE = prestador vinculado ao usuário corrente, conforme cadastro/configuração do usuário.
PROVIDER_HISTORY_MODEL = ID/FK persistido; nome não é snapshot integral.
PROVIDER_CONTRACT_READY = SIM.

USER_OBSERVATION: usuário corrente Tel → prestador vinculado Tel → modal abriu
com Cirurgião Tel, antes de alteração manual. Não generalizar o nome Tel.
Regra geral STRONG por convergência do relato autorizado, TEasyLookupPrestador,
DDL e INSERT/UPDATE recuperados. Não é uma nova captura automatizada ou consulta
ao banco realizada em P0H. A nulabilidade atual do modelo web não é a regra do legado.

Também USER_OBSERVATION, somente nesse caso: Tabela de preços PARTICULAR;
Intervenção Cimentação de Coroa Total Definitiva; Região 41; Situação Realizar;
Marcação 04/10/2026; Finalização vazia. Financeiro: Receber do paciente 150;
Receber do convênio 0,00; Previsão de recebimento vazia; Não incluir no orçamento
desmarcado. Com um alvo selecionado, Grava esta habilitado e Grava todas desabilitado.
GRAVA_TODAS_ENABLEMENT_RULE = PARTIAL / NON_BLOCKING: não extrapolar uma regra
universal de habilitação. Nenhuma gravação faz parte dessa evidência.

## Identidade histórica e datas

HISTORICAL_SLOT_IDENTITY_RULE = slot lógico original.
FDI_IS_IDENTITY = NÃO. DISPLAY_NUMBER_IS_IDENTITY = NÃO.
SLOT_RENUMBERING_EFFECT_ON_HISTORY = não reidentificar a associação clínica histórica.
Requisito Brana: identidade estável do slot + FDI/número exibido separados +
condição do elemento no momento da aplicação. Isso não promete remapeamento
pixel-a-pixel de todos os bitmaps históricos do legado.

DATCAD = data clínica de marcação/entrada.
DATFIN = finalização/execução completa.
TIME_STAMP_INS = inclusão técnica. TIME_STAMP_UPD = alteração técnica.
HISTORICO.DATA = fase/evento realizado, não necessariamente execução completa.
DATE_SEMANTICS_READY = SIM. Design P1 deve mapear esses conceitos aos campos web;
não usar timestamps técnicos como substitutos das datas clínicas.

## Catálogo e representação histórica — evidência versus recomendação

LEGACY_EVIDENCE:

- INTERVENTION_CATALOG_HISTORY_MODEL = HYBRID.
- PRICE_HISTORY_RULE = valor próprio persistido por intervenção.
- SYMBOL_HISTORY_RULE = HYBRID: consultas ao catálogo coexistem com recursos
  preservados em associações; não afirmar snapshot integral nem catálogo sempre vivo.
- MARKING_TYPE_HISTORY_RULE = sem snapshot explícito completo no legado.

BRANA_ARCHITECTURE_RECOMMENDATION para P1: modelo híbrido explícito. Manter
referência ao catálogo/procedimento atual separada da representação aplicada:
tipo de marcação aplicado, slots/alvos, faixas ordenadas por arcada,
faces/orientação, valores próprios, símbolo/representação aplicada/versionada e
contexto histórico suficiente. Não é comportamento legado PROVEN nem schema
já aprovado/implementado. Mudança posterior do catálogo não pode ser confundida
com alteração deliberada de uma intervenção histórica.

## Histórico web e lifecycle

CURRENT_HISTORY_LINK_SUFFICIENT = NÃO.
WEB_INTERVENTION_HISTORY_LINK_REQUIREMENT = vínculo web inequívoco à intervenção + legacy source id separado.
CARDINALITY = 0..N.

O campo source_intervencao_id atual registra origem, sem FK web inequívoca. Ver
[modelo atual](../../backend/models/historico_paciente.py) e
[serviço atual](../../backend/services/historico_paciente_service.py).
Separar proveniência automática, fase e narrativa manual antes de desenhar
update/delete: a matriz abaixo descreve o helper legado, não autoriza apagar
todo histórico do paciente.

| Evento no fluxo recuperado | Efeito vinculado | Confiança / limite |
|---|---|---|
| CREATE Observada | NONE | STRONG; helper condicionado à situação |
| CREATE Realizar | NONE | STRONG; mesmo caminho |
| CREATE Realizada | INSERT | STRONG; convergência helper/SQL |
| Observada/Realizar → Realizada | INSERT | STRONG; transição no helper |
| Realizada → Realizar | DELETE vinculado | STRONG; caminho recuperado, não narrativa global |
| Realizada → Observada | DELETE vinculado | STRONG; mesmo limite |
| EDIT Realizada | UPDATE data/auditoria | PROVEN no SQL recuperado; não comprova atualização automática de descrição/região/prestador |
| FINALIZE | Histórico conforme fase/realização | STRONG; fase pode não concluir a intervenção |
| DELETE | Limpeza dos vínculos relacionados | PROVEN para hard delete/cascades auditados; não para estorno financeiro |

HISTORY_TRANSACTION_BOUNDARY = uma unidade clínica completa.
BRANA_SAFE_REQUIREMENT = intervenção + alvos + histórico automático atomicamente
consistentes. É requisito futuro Brana; não prova arquitetura transacional total
de todas as ações legado. A capacidade web atual é PARTIAL e requer design do vínculo
e integração do lifecycle, não apenas reaproveitar o commit do serviço manual.

## Propriedades financeiras e exclusão

INTERVENTION_FINANCIAL_PROPERTY_OWNER = INTERVENCAO no legado.
Inclui valor paciente, valor repasse, não incluir, glosa, mensagem autorização e
previsão repasse. BUDGET_VALUE_AUTHORITY = INTERVENCAO no contrato legado/futuro.
Preço de catálogo não é autoridade histórica quando existir valor próprio.

Brana atual: source_payload/overrides = PARCIAL; valores podem recorrer ao catálogo,
e previsão existente no tratamento não equivale à propriedade por intervenção.
BUDGET_OBSERVED_MISMATCH = CONFIRMED: caminho auditado soma itens incluídos sem
exclusão explícita de Observada. FIX_TYPE_EXPECTED = SERVICE_RULE. Separar esse
ajuste de cálculo do design das propriedades financeiras; nenhum foi implementado.
Referência: [serviço de orçamento](../../backend/services/orcamento_service.py).

DELETE_POLICY_REQUIRED_BEFORE_P1 = NÃO.
BLOCKING_BEFORE_DELETE_IMPLEMENTATION = SIM.
Proposta segura: bloquear exclusão com lançamento/pagamento/reconciliação pendente
até fluxo financeiro explícito. Aprovação, permissões e vínculos históricos também
precisam de precondições. Não prometer exclusão irrestrita ou reversão automática.
Finalização pode opcionalmente lançar CCPACIENTE; isso não equivale a orçamento
gerar parcela automaticamente.

## Lote, idempotência e concorrência — requisitos Brana futuros

BATCH_UNIT = unidade normalizada por marcação, preservando as cardinalidades acima.
BATCH_TRANSACTION_BOUNDARY = uma unidade clínica completa.
BATCH_ON_ERROR = STOP — proposta segura, não regra legado comprovada.
LEGACY_BATCH_ON_ERROR = UNPROVEN.
PARTIAL_RESULT_REQUIRED = SIM.
BATCH_RETRY = reprocessar somente falhas/pendentes, preservando sucessos confirmados.
Grava todas não implica transação externa única; comandos deverão identificar
unidades e devolver resultado por unidade sem duplicar sucessos.

CREATE_IDEMPOTENCY_REQUIRED = SIM.
IDEMPOTENCY_SCOPE = BOTH — comando e unidade.
Escopo: clínica/paciente/tratamento/operação. Mesma identidade + mesmo payload
→ mesmo resultado; mesma identidade + payload diferente → conflito. P1 deve
definir identidade e equivalência de payload, sem escolher mecanismo aqui.

STALE_UPDATE_PROTECTION_REQUIRED = SIM.
LEASE_ALONE_IS_SUFFICIENT = NÃO.
Versão esperada/compare-and-swap por intervenção, além do clinical lease.
Locks transacionais quando contexto financeiro compartilhado exigir. Não afirmar
que a exclusividade de sessão detecta formulário antigo, reenvio ou edição stale.

## Prontidão e decisões de P1 — design somente

TECHNICAL_BLOCKERS_BEFORE_P1 = NENHUM.
BLOCKING_BEFORE_P1 = NENHUM.
READY_FOR_FC4_P1 = SIM — DESIGN SOMENTE.
IMPLEMENTATION_STARTED = NÃO. SCHEMA_CHANGED = NÃO. MIGRATION_CREATED = NÃO.

P1_DESIGN_DECISIONS_REQUIRED:

- associação intervenção↔slot e slot vazio;
- target e tipo de marcação aplicado;
- faixas ordenadas/agrupadas por arcada e faces/orientação;
- vínculo/proveniência do histórico e propriedades financeiras próprias;
- referência ao catálogo e representação/símbolo aplicado/versionado;
- idempotência de comando/unidade e versão otimista;
- locks/transações, read model, write commands e erros de domínio;
- roundtrip completo dos seis tipos;
- renumeração de slot e mudança posterior de catálogo/preço/símbolo.

BLOCKING_BEFORE_BACKEND_IMPLEMENTATION: modelo de alvos/faixas; histórico/transações;
ownership financeiro; regra Observada; batch/retry; idempotência; versão/stale
update; validações tenant/paciente/tratamento/prestador.

BLOCKING_BEFORE_DELETE_IMPLEMENTATION: aprovação; lançamento; pagamento;
reconciliação; permissões; histórico relacionado.

BLOCKING_BEFORE_P3_VISUAL: escolha UX; hitboxes; composição; símbolo versionado;
subset de assets autorizado; homologação manual.

FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
VISUAL_IMPLEMENTATION_REQUIRES_MANUAL_HOMOLOGATION = SIM.
ANTES DE FC4-P3: AVISAR O USUÁRIO. UX/hitboxes não bloqueiam o design P1;
pixel-a-pixel e refinamentos estéticos não são lacunas estruturais.
Não reabrir contratos congelados sem contradição PROVEN. A ausência de blocker
para design não significa exaustão global do legado ou implementação liberada.

## Segurança FC3-D5

TREATMENT_ODONTOGRAM_WRITE_DOMAIN: mutação somente OWNER; RESTRICTED/UNKNOWN
fail-closed. Auth, módulo, tenant e validação paciente/tratamento no backend; lease
frontend não é barreira final. Não alterar D5: heartbeat OWNER=20s, recheck
RESTRICTED=20s, TTL=90s, pagehide best-effort, persisted=true não libera.
FIRST_SUCCESSFUL_ACQUIRE; exatamente um owner; sem fila/FIFO/takeover.

## Crosswalk e gaps

| Conceito | EasyDental | Brana atual | Frontend gap | Backend gap | Schema gap |
|---|---|---|---|---|---|
| slot | Entidade de seleção, inclusive vazio | ArcadaSlot | Hitbox/estado | Escrita de associação | Intervenção↔slot |
| FDI | Número do contexto; slot não é número | Número nullable no slot | Resolução dinâmica | Validar contexto | FDI obrigatório nas associações |
| face | Flags posicionais | Flags anatômicas por FDI | Orientação/pintura | Conversão/validação | Associação por slot |
| intervention | Propriedades e writers | Modelo/leituras | Fluxo operacional | Create/batch/lifecycle | Alvos completos |
| procedure | TAB_PRC_ITEM | Catálogo | Picker integrado | Validar procedimento/tabela | Base existente |
| marking type | Seis tipos | Tipo no símbolo | Modo selecionado | Dispatcher validado | Preservar tipo/alvo |
| region | Descrição por faixas | Derivação FDI/override | Visualização fiel | Não reduzir a FDI ordenado | Representação explícita |
| range | Trechos agrupados por tipo | Sem entidade própria | Seleção por trechos | Cardinalidade | Faixas/agrupamentos |
| symbol | NROSIM e recursos; história HYBRID | Catálogo e preview | Renderer da representação aplicada | Read/render histórico suficiente | Representação aplicada/versionada a desenhar |
| status | 1/2/3 | Lookup | Cor/ações | Efeitos de lifecycle | Mapear código, não assumir PK |
| treatment | Selecionado define destino | Modelo/criação | Guia/contexto | Validar destino | Base existente |
| budget | Intervenção filtrada | Serviço/overrides | Sincronização | Regra Observada/exclusão | Valores/exclusão próprios |
| history | Helpers por ação, 0..N | Source id sem FK web inequívoca | Exibição/proveniência | Lifecycle atômico | Vínculo web separado da origem legado |
| provider | ID obrigatório; default usuário vinculado STRONG | FK opcional na intervenção; usuário vinculado | Default/edição | Tenant/validade/obrigatoriedade | Validar contrato web em P1 |
| dates | Clínica, finalização, timestamps, fase | Planejada/execução/timestamps | Entrada correta | Separar data clínica/técnica/fase | Mapear sem perda em P1 |
| values | Valores próprios da intervenção | Catálogo+JSON | Propriedades | Ownership dos overrides | Contrato normalizado pendente |
| lease | Não transplantar lock Desktop | FC3-D5 homologada | OWNER gating | Guard existente/futuras rotas | Sem mudança D5 |

Leituras existentes: GET /odontograma/status, /arcada-slots, /intervencoes, /resumo.
Atualização parcial existente: PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id},
com guard. Capacidades futuras: create/apply, update de alvos, finalize, delete,
render/read completo, history/budget; avaliar reutilização antes de criar endpoints.
Backend novo não implementado; modelos aceitam vários dentes por intervenção,
mas isso sozinho não preserva todas as seis marcações.
