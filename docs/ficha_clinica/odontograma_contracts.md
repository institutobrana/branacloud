# FC4 — contratos funcionais canônicos recuperados

STATUS = P1_R1_RECONCILED_FOR_REVIEW
CURRENT_BASELINE = 6e7cdd5de3551f4d1b120f5d0da579e364746d38
BRANCH = modularizacao-segura-fase-1
MANUAL_DECISIONS_DOCUMENTED = 10/10
IMPLEMENTATION_STARTED = NÃO
VISUAL_IMPLEMENTATION_STARTED = NÃO
SCHEMA_CHANGED = NÃO
MIGRATION_CREATED = NÃO

## P1.R1 — autoridade e proveniência vigentes

Data da consolidação documental: 2026-10-05; não é a data presumida dos testes.
As decisões D01–D10 abaixo têm EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE:
testes e prints do EasyDental Desktop informados pelo usuário no pedido P1.R1.
Não são testes reexecutados pelo Codex, nova captura de tela, SELECT ou trace.
Não foram fornecidos nesta rodada arquivos de prints com IDs/caminhos verificáveis;
não inventar tais referências. O relato detalhado fica preservado aqui e no
[dossiê](../reverse_engineering/easydental_odontograma_fc4.md).
Não solicitar repetição. DO_NOT_REOPEN = D01–D10; só reabrir com
PROVEN_CONTRADICTION = SIM e prova objetiva.

P0D/P0H/P0I permanecem registros históricos. P1 foi relatório de design nesta
conversa, sem arquivo de design implementado. O quadro de reconciliação abaixo
preserva suas propostas relevantes. O registro histórico no fim deste documento
não é norma ativa onde contrariar P1.R1. Catálogo HYBRID/representação congelada,
fallback de usuário sem prestador e bloqueio genérico por pagamento estão superados.

## D01 — catálogo vivo; valores próprios

CATALOG_BEHAVIOR = LIVE.
INTERVENTION_OWN_FINANCIAL_VALUES = PERSISTED.
PATIENT_VALUE_FOLLOWS_CATALOG = NÃO.
TRANSFER_VALUE_FOLLOWS_CATALOG = NÃO.
SYMBOL_FOLLOWS_CATALOG = SIM.
DESCRIPTION_FOLLOWS_CATALOG = SIM.

Teste informado: modificar o cadastro do procedimento fez nome/descrição, símbolo
e demais dados cadastrais/visuais refletirem em intervenções existentes; valores
paciente e repasse continuaram próprios. O read model resolve catálogo atual,
não um snapshot clínico congelado. Auditoria pode registrar valores anteriores
sem usá-los como autoridade de apresentação. Versionamento/hash de asset serve
integridade, autorização, cache e deploy; nunca congela o símbolo da ocorrência.

Persistir marcação aplicada, slots, faixas e faces ainda é necessário para preservar
os alvos gravados. Não reinterpretar esses alvos só porque mudou o recurso atual.
Mudança posterior de classificação/TIPMARCA com alvos incompatíveis exige tratamento
técnico explícito de compatibilidade; não inventar conversão automática nem pedir
repetição do teste de catálogo vivo. Os metadados aplicados não congelam nome/símbolo.

## D02 — identidade de slot, vazio e dentição mista

SLOT_IS_CLINICAL_IDENTITY = SIM.
FDI_IS_CLINICAL_IDENTITY = NÃO.
TOOTH_IMAGE_IS_IDENTITY = NÃO.
EMPTY_SLOT_CAN_HAVE_INTERVENTION = SIM.
MIXED_DENTITION_SUPPORTED = SIM.
DENTITION_CHANGE_DOES_NOT_MOVE_INTERVENTION = SIM.

Teste informado: depois de aplicar uma intervenção, substituir a figura por outro
dente, decíduo ou nenhum dente manteve a intervenção no mesmo lugar. Relação clínica:
intervenção → slot_id estável. Número/FDI, dentição, condição e imagem são atributos
mutáveis de apresentação/estado. Origem/estado na aplicação pode ser auditado,
mas não deve obrigar o renderer atual a exibir o dente antigo. Slot não pode ser
recriado por renumeração/sincronização. Histórico permanece associado ao slot original.

## D03 — classificação de cobrança e Grava esta/todas

BILLING_CLASSIFICATION_AFFECTS_APPLICATION_FLOW = SIM.
REGION_FIELD_ROLE = DISPLAY_CURRENT_TARGET.
REGION_FIELD_EDITABLE = NÃO.
SAVE_CURRENT_PERSISTS_IMMEDIATELY = SIM.
CANCEL_DOES_NOT_ROLLBACK_PREVIOUS_SAVE_CURRENT = SIM.
SAVE_ALL_AVAILABLE_FOR_INTERVENTION_CLASS = NÃO.

Com múltiplos slots: Grava esta grava somente a região atual, mantém modal aberto
e avança. Cancelar/fechar depois não desfaz unidades confirmadas. Grava todas
aplica às regiões selecionadas, grava cada ocorrência e fecha o modal.
A evidência descreve o caminho bem-sucedido; comportamento legado após erro de lote
continua não provado. STOP no primeiro erro é proposta técnica Brana, não teste novo.

Classificação Elemento/Face: seleção participa e o fluxo atual/todas pode se aplicar.
Classificação Intervenção: duplo clique no procedimento abre propriedades sem seleção
de slot; Grava todas não se aplica. Região é label do alvo/contexto atual, não input
para escolher livremente destino. Nenhum default universal de habilitação é inferido.

CLASSIFICAÇÃO DE COBRANÇA ≠ TIPMARCA: a primeira escolhe fluxo/alvo de apresentação;
o segundo define FACE/DENTE/GRUPO/ARCADA/GERAL/SEGMENTO e cardinalidade quando aplicável.
Não inferir equivalência automática Intervenção=GERAL ou Face=TIPMARCA 1 sem resolver
cadastro/compatibilidade. Para Intervenção, a unidade é sem slot e tem render lateral.

## D04 — usuário precisa de prestador associado

USER_PROVIDER_LINK_REQUIRED = SIM.
USER_WITHOUT_PROVIDER_VALID_STATE = NÃO.
DEFAULT_PROVIDER_SOURCE = prestador associado ao usuário corrente.
PROVIDER_REQUIRED = SIM.
PROVIDER_NULL_ALLOWED = NÃO.
PROVIDER_EDITABLE = SIM.
PROVIDER_HISTORY_MODEL = ID/FK persistido; nome não é snapshot integral.

Teste informado: cadastro do usuário foi bloqueado com a mensagem
"Campo Associar a prestador não pode ser nulo." Brana permitir usuário sem vínculo
é KNOWN_DEFECT_TO_FIX_LATER. Retirado o fluxo normal de escolher outro prestador
para contornar usuário inválido. A edição do prestador no modal continua permitida
para usuário validamente vinculado. Usuário e PrestadorOdonto não são o mesmo ID.
Design: exigir vínculo válido no tenant; se ausente/inválido, erro e regularização
posterior do cadastro, sem inventar fallback. Nenhum cadastro é corrigido nesta fase.

## D05 — datas clínicas automáticas, editáveis

MARKING_DATE_DEFAULT = CURRENT_CLINICAL_DATE.
MARKING_DATE_EDITABLE = SIM.
FINALIZATION_DATE_DEFAULT_ON_REALIZED = CURRENT_CLINICAL_DATE.
FINALIZATION_DATE_EDITABLE = SIM.
CLINICAL_DATES_ARE_TECHNICAL_TIMESTAMPS = NÃO.

Teste informado: inclusão preenche Marcação com data vigente; mudança de Situação
para Realizada preenche Finalização automaticamente; ambos podem ser alterados.
Design mantém data_marcacao_clinica/data_finalizacao_clinica separadas de
created_at/updated_at técnicos e data_evento de fase. Preencher default quando
necessário, aceitar edição explícita e não redefaultar em replay/releitura.
Fonte/fuso da data clínica web e comportamento em limpeza explícita são políticas
técnicas a formalizar; não transformar isso em nova dúvida sobre os defaults provados.

## D06 — centavos e parcelamento

MONEY_BUSINESS_SCALE = 2.
INSTALLMENT_SPLIT_PRESERVES_TOTAL = SIM.
ROUNDING_RESIDUAL_DISTRIBUTION = DETERMINISTIC.

Teste informado: R$ 200,00 / 3 = 66,67 + 66,67 + 66,66. Não afirmar precisão interna
do EasyDental. Brana deve operar valores monetários de negócio em centavos exatos;
precisão intermediária maior é técnica e não muda essa escala. Proposta Brana:
decimais exatos/centavos inteiros, quociente e resto distribuído em ordem definida,
como no exemplo. Regras de cálculo intermediário/migração não podem truncar fonte
legada silenciosamente. Catálogo inicializa nova ocorrência; alteração posterior
não reprifica paciente/repasse de ocorrências já gravadas.

## D07 — catálogo reutilizável de fases e histórico

PROCEDURE_PHASE_IS_AUXILIARY_CATALOG = SIM.
PHASE_REUSABLE = SIM.
GENERIC_PROCEDURE_PHASE_ASSOCIATION = SIM.
PHASE_IN_USE_CAN_BE_DELETED = NÃO.

Fluxo informado: Tabelas Auxiliares → Fases de procedimento; Procedimento Genérico
associa fases cadastradas; procedimento de tabela referencia o genérico; a intervenção
disponibiliza suas fases. EasyDental impede excluir fase em uso. Não modelar fases
como lista fixa ou somente texto privado de cada procedimento.

Proveniência web obrigatória: PHASE_HISTORY, FULL_COMPLETION_HISTORY, MANUAL_HISTORY,
com FK da intervenção e IDs de origem separados. Cardinalidade total 0..N.
Cada baixa consciente de fase tem identidade/evento próprios e data independente;
não impor UNIQUE(intervenção,fase), pois pode haver baixas repetidas.

| Ação | Situação/efeito | Histórico gerenciado |
|---|---|---|
| CREATE Observada / Realizar | Mantém situação | Não cria conclusão automática |
| Baixa de fase | Intervenção continua Realizar | INSERT PHASE_HISTORY com fase/data |
| Nova baixa de fase | Independente, data pode diferir | Outro evento PHASE_HISTORY |
| Finaliza Toda intervenção | Realizada + finalização clínica | FULL_COMPLETION_HISTORY |
| Situação → Realizada / CREATE Realizada | Conclui; default de finalização editável | FULL_COMPLETION_HISTORY |
| Realizada → Realizar | Reabre ocorrência | Remove histórico automático correspondente; não narrativa manual |
| EDIT finalizada | Permitido | Atualização vinculada pertinente e auditoria |
| DELETE intervenção | Hard delete da ocorrência | Remove histórico automático relacionado, inclusive fases relacionadas |
| Edição de narrativa manual | Não é baixa/conclusão automática | MANUAL_HISTORY tem política própria |

Não inventar abrangência universal de remoção de fases ao reabrir a situação:
"correspondente" deve ser delimitado por proveniência/vínculo/evento. Não apagar
MANUAL_HISTORY por cascade automático. Fases concluídas e narrativa manual são
entidades distintas; retenção/auditoria de uma remoção não as torna registros ativos.
Status 1 Observada / 2 Realizada / 3 Realizar permanece; não criar Interrompida.

## D08 — orçamento pendente e reconciliação, não veto genérico

FINANCIAL_RECONCILIATION_MODEL = PRESERVE_REALIZED_PAYMENT_AND_RECONCILE_DIFFERENCE.
DELETE_INTERVENTION_BLOCKED_IF_PAYMENT_EXISTS = NÃO como regra geral.
AUTO_REVERSE_REALIZED_PAYMENT = NÃO.
BUDGET_CHANGE_REQUIRES_REAPPROVAL = SIM.
BUDGET_PENDING_WARNING_PERSISTS_UNTIL_ADJUSTMENT = SIM.
TREATMENT_DELETE_IS_DISTINCT_OPERATION = SIM.

Evidência informada: alterar/excluir intervenção modifica orçamento e deixa pendente/
não aprovado. Aviso reaparece TODA VEZ ao abrir até ajuste efetivo; abrir/fechar tela
ou dispensar aviso não limpa pendência. Aprovação gera conta corrente do paciente.
Mudança antes da baixa preserva conta corrente anterior até nova aprovação, que
recalcula débitos. Com baixa, pagamento permanece e nova aprovação reconcilia:
pago 2.000,00 / orçamento 1.500,00 → crédito paciente 500,00;
pago 2.000,00 / orçamento 2.500,00 → débito restante 500,00.

Baixa efetivada na conta corrente clínica/cirurgião não muda automaticamente:
correção posterior é manual no módulo correspondente. Excluir uma intervenção
não remove a baixa realizada. Excluir tratamento inteiro remove conjunto relacionado
(lançamentos, históricos, orçamento), conforme observado; é operação distinta.
Não extrapolar automaticamente esse delete integral para todo módulo/tipo de baixa,
nem implementá-lo/acioná-lo como consequência da última intervenção removida.

Regra preservada: Observada não entra; Realizar/Realizada entram se não excluídas.
Não incluir pertence à intervenção. Valores próprios continuam autoridades.
Inclusão no orçamento não é aprovação e não gera por si só parcela.

Design: revisão de orçamento persistente, versão aprovada e marcador de ajuste/
reaprovação pendente. Mutação que muda conteúdo orçamentário invalida aprovação
na mesma unidade clínica. Leitura/fechar aviso são sem efeitos persistentes.
Nova aprovação, com expected_budget_version, calcula a revisão corrente e reconcilia
débitos pendentes preservando pagamentos efetivados e auditoria. Nunca soma novamente
todos os débitos antigos ao novo total. Crédito/debito da diferença é projeção
financeira explícita, não intervenção fictícia nem estorno automático.

Pagamento realizado e conta corrente anterior são distintos da revisão orçamentária
nova. Regra do aviso é estado durável, não flag transitória da UI. Definir escritor
autorizado de ajuste efetivo/reaprovação; simples reconhecimento do aviso não vale.
Não criar veto por pagamento existente. Permanecem tenant/permissão/OWNER/versão,
locks financeiros e reconciliação correta como requisitos de implementação.

## D09 — símbolo obrigatório e alvo conforme cobrança

PROCEDURE_SYMBOL_REQUIRED = SIM.
VALID_PROCEDURE_WITHOUT_SYMBOL = NÃO.
BRANA_EXISTING_PROCEDURES_WITHOUT_SYMBOL = DATA_INTEGRITY_GAP.
INTERVENTION_CLASS_SYMBOL_RENDER_TARGET = SIDE_PANEL.
ELEMENT_FACE_SYMBOL_RENDER_TARGET = ODONTOGRAM.

Evidência informada: cadastro operacional exige símbolo; a ausência atual no Brana
é falta de validação, não categoria legítima sem desenho. Não inventar símbolo ou
fallback para regularizar. Inventário/quantificação/validação e plano de regularização
pertencem ao módulo separado Procedimentos, NÃO iniciado nesta rodada.
Símbolo existe e sua autorização A/B são requisitos distintos: existir não libera C.
Classificação Intervenção desenha no quadro lateral direito; Elemento/Face no
odontograma. TIPMARCA sozinho não decide o quadro lateral. Catálogo atual resolve
símbolo/nome; imagem de dente, inclusive decídua/ausente, não é símbolo do procedimento.

## D10 — OWNER, idempotência, versão e ocorrências independentes

DUPLICATE_PROCEDURE_SAME_SLOT_ALLOWED = SIM.
UNIQUE_CONSTRAINT_TREATMENT_SLOT_PROCEDURE = PROIBIDA.
EACH_OCCURRENCE_INDEPENDENT = SIM.

Mesmo procedimento pode ser incluído conscientemente várias vezes no mesmo slot.
Cada nova intenção cria nova ocorrência/intervenção; orçamento/painel, finalização,
edição e exclusão são independentes. Símbolos idênticos podem se sobrepor; não deduplicar
ocorrências para simplificar renderer. Replay do MESMO comando não cria outra ocorrência.
OWNER obrigatório; RESTRICTED/UNKNOWN fail-closed pela FC3-D5, sem mecanismo substituto.

Design mantém COMMAND_ID/UNIT_ID no escopo clínica/paciente/tratamento/operação.
Nova intenção recebe novos IDs, mesmo payload/slot/procedimento. Unicidade é da chave
idempotente, NÃO do conteúdo clínico. Mesma identidade + mesmo payload retorna sucesso
confirmado; payload diferente conflita. Retries preservam sucessos; ledger/resultados
e unidade clínica são atomicamente consistentes. Versão inteira/CAS evita overwrite
stale mesmo em OWNER; auditoria técnica não substitui história clínica ou lease.

## Preferências e shell — evidência manual adicional

EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE.
ODONTOGRAM_STATUS_COLOR_SOURCE = USER_PREFERENCE.
INTERVENTION_STATUS_STORES_COLOR = NÃO.
STATUS_STORES_SEMANTIC_STATE = SIM.

Preferências por usuário: Anomalias, Condição observada, Já realizado, A realizar.
Exemplo informado preto/verde/azul/vermelho, TODOS configuráveis, não defaults
imutáveis. Renderer resolve paleta do usuário; mudança de preferência não altera
status, histórico, orçamento ou versão clínica. Também foram observados especialidade
mais utilizada, filtro mais utilizado e opções de apresentação.

SHELL_DECISION = PENDENTE.
CURRENT_RECOMMENDATION = HYBRID: base React moderna + comportamento clínico Desktop.

Requisitos futuros do shell, sem implementação:

1. Odontograma.
2. Lista de procedimentos.
3. Especialidades/filtros.
4. Painel contextual por dente/slot.
5. Lista das intervenções do elemento, preservando ocorrências.
6. Quadro lateral para classificação Intervenção.
7. Editar intervenção.
8. Finalizar intervenção.
9. Eliminar intervenção.
10. Alternar dentição.
11. Seleção múltipla.
12. Ctrl+clique para seleção individual.
13. Shift+clique para grupo.
14. Preferências do odontograma.
15. Cores configuráveis.
16. Filtro de intervenções.
17. Tratamento/paciente em contexto.

FIRST_VISUAL_IMPLEMENTATION_PHASE = FC4-P3.
VISUAL_IMPLEMENTATION_REQUIRES_MANUAL_HOMOLOGATION = SIM.
ANTES DE FC4-P3: AVISAR O USUÁRIO.

## Reconciliação do relatório P1 original

Origem OLD_PROPOSAL: relatório de design P1 entregue na conversa, anterior às
decisões manuais. C01–C08 são propostas efetivamente superadas; E01–E06 são
complementações/clarezas, não contadas artificialmente como contradições.

| ID / tipo | OLD_PROPOSAL | NEW_EVIDENCE | CORRECTED_DESIGN | IMPACT |
|---|---|---|---|---|
| C01 contradição | Símbolo aplicado imutável governa render | D01 símbolo segue catálogo | Resolver símbolo vivo; versionar asset só tecnicamente | Read model/renderer/cache |
| C02 contradição | Descrição aplicada congelada na visão histórica | D01 descrição segue catálogo | Descrição corrente; anterior só auditoria | Read model/painel/orçamento |
| C03 contradição | Usuário sem vínculo escolhe prestador como fluxo normal | D04 cadastro inválido sem vínculo | Exigir vínculo; regularizar defeito depois | Validação de usuário/comando |
| C04 contradição | Pagamento/lançamento bloqueia delete genericamente | D08 alterações/exclusões permitidas; reaprovar e reconciliar | Preservar pagamento; orçamento pendente; sem veto genérico | Financeiro/delete/locks |
| C05 contradição | Possível procedimento válido sem símbolo | D09 simbolização obrigatória | Gap de integridade, sem fallback | Cadastro/rollout visual |
| C06 contradição | Realizada depende de data explicitamente fornecida como requisito proposto | D05 data vigente preenche automaticamente e é editável | Default clínico e edição; timestamps separados | Modal/comando |
| C07 contradição | Grava todas genérico sem restringir por cobrança | D03 Intervenção não tem Grava todas | Roteamento por classificação antes de normalizar | Write model/modal |
| C08 contradição | Área geral/slot por TIPMARCA bastava para decidir render | D09 Intervenção vai ao quadro lateral | Classificação determina painel; tipo organiza alvos aplicáveis | Read model/shell |
| E01 complemento | Slot/FDI separados, condição capturada | D02 mista/decíduo/vazio confirmados | Estado atual do slot vivo; alvo imóvel | Targets/apresentação |
| E02 esclarecimento | Precisão de negócio ainda para aprovação | D06 duas casas e soma exata | Centavos canônicos; precisão interna não provada | Financeiro/parcelamento |
| E03 complemento | Fases/eventos sem catálogo reutilizável completo | D07 cadeia auxiliar→genérico→tabela e fase em uso protegida | Catálogo referenciado e eventos 0..N distintos | Schema/histórico |
| E04 complemento | Idempotência por comando/unidade | D10 duplicação consciente permitida | Novos IDs por intenção; nenhuma UNIQUE por conteúdo clínico | Integridade/lote |
| E05 complemento | Paleta configurável genericamente | Preferências adicionais por usuário | Cor fora da intervenção; resolver por usuário | Preferências/renderer |
| E06 complemento | Cancelamento/erro de lote sem detalhar UX | D03 cancelar não desfaz gravados; sucesso de todas fecha modal | Avanço/fechamento por resultados; STOP só proposta | Modal/retry |

P1_DESIGN_CONTRADICTIONS_FIXED = 8.
P1_DESIGN_REMAINING_CONTRADICTIONS = 0.

## REVISED_SCHEMA_DESIGN — proposta, não implementação

| Entidade/conceito | Design reconciliado / delta conceitual |
|---|---|
| Slot | Reutilizar ArcadaSlot com ID estável, ordem lógica/arcada, FDI/display nullable, dentição/condição/figura mutáveis, versão de contexto |
| Intervenção | Ocorrência independente: tenant/paciente/tratamento/procedimento/tabela/prestador/status/datas/observações/version; sem UNIQUE(tratamento,slot,procedimento) |
| Cobrança | Resolver classificação do catálogo antes do fluxo; preservar classificação/contexto da aplicação para integridade, sem congelar símbolo/descrição atuais |
| Targets | FK intervenção↔slot, ordinal, marcação aplicada; sem FDI obrigatório; zero slots para cobrança Intervenção |
| Ranges | Faixas ordenadas por arcada; extremos/topologia e membros exatos; GRUPO uma por trecho; SEGMENTO união sem lacunas; ARCADA uma por arcada |
| Faces | FK ao alvo, anatomia M/D/V/L/P/O/I, posição FACE1..5/orientação; legado bruto separado |
| Procedimento/símbolo | Referência viva obrigatória; catálogos atuais fornecem nome/símbolo. Não criar applied_symbol imutável como autoridade clínica |
| Assets | Manifest/path/hash/revisão técnica e autorização A/B; catálogo atual escolhe recurso. Não pin por ocorrência para congelar comportamento |
| Valores próprios | Relação financeira 1:1: paciente/repasse, não incluir, glosa, autorização, previsão; escala de negócio 2; sem fallback dinâmico para reprecificar ocorrência existente |
| Fases | Catálogo auxiliar reutilizável por tenant + associação genérico↔fase; FK em uso protegida, não exclusão cascade da fase utilizada |
| Histórico | FK web inequívoca 0..N, phase_id/event_id/proveniência PHASE_HISTORY/FULL_COMPLETION_HISTORY/MANUAL_HISTORY; IDs legados separados |
| Orçamento | Contexto por tratamento com revisão corrente, revisão aprovada e pendência durável; alteração clínica relevante invalida aprovação |
| Financeiro | Pagamentos efetivados preservados; revisão de débitos/crédito paciente por aprovação idempotente, com vínculo/proveniência de reconciliação; não estorno automático de baixa clínica/cirurgião |
| Comando/unidade | Ledger dedicado, hash canônico e resultado por intenção/unidade; sucessos não duplicados, novas intenções permitidas |
| Concorrência | Version integer/CAS da intervenção; expected_budget_version na aprovação; locks de contexto financeiro e lease existente |
| Preferências | Reutilizar armazenamento/rotas por usuário; paleta/especialidade/filtro/apresentação fora do estado clínico |

INTERVENTION_MODEL_DESIGN = agregado existente evoluído, não clínica paralela.
RANGE_STORAGE_DESIGN = alvos + faixas normalizados, com igualdade da união/membros.
CLINICAL_TRANSACTION_BOUNDARY = intervenção + targets/ranges/faces + financeiro
próprio + histórico automático pertinente + invalidação de orçamento + auditoria
e resultado idempotente. PARTIAL_UNIT_WRITE_ALLOWED = NÃO.
Aprovação/reconciliação tem transação própria do contexto financeiro; não ocorre
automaticamente a cada inclusão ou delete de intervenção.
REVISED_SCHEMA_DESIGN_STATUS = COMPLETE — design documental revisável.
PROPOSED_SCHEMA_DELTA_AFTER_MANUAL_EVIDENCE = entidades/campos/relações do quadro;
nenhuma migration criada. Mudanças de catálogo não podem deslocar/reidentificar
targets gravados. Integridade de símbolo nulo/classificação desconhecida gera erro
explícito, não símbolo automático nem escolha por heurística.

## REVISED_API_DESIGN — proposta, não implementação

Base conceitual: /odontograma/pacientes/{paciente_id}/tratamentos/{tratamento_id}.
Não são rotas já criadas. Reutilizar GETs V1, catálogo, tratamentos, preferências,
histórico e orçamento por adapters; novo PATCH orçamentário deve compartilhar
serviço de agregado, versão/lifecycle, sem writer paralelo.

| Contrato/comando | Input e efeito esperado |
|---|---|
| NORMALIZE_SELECTION | Procedimento e seleção; resolver cobrança. Elemento/Face valida slots/faces/faixas/cardinalidade; Intervenção aceita zero slots e produz uma unidade lateral. Preview puro, sem escrita |
| CREATE / SAVE_CURRENT | COMMAND_ID/UNIT_ID, unidade atual, prestador vinculado válido, status/datas/valores. Default clínico quando omitido; grava unidade, retorna ID/version/efeitos; modal avança, sem rollback de sucessos no Cancelar |
| APPLY_ALL | Lista ordenada de unidades Elemento/Face; rejeitar para classificação Intervenção; commit por unidade/resultado individual; sucesso completo fecha modal; STOP em erro é proposta técnica |
| UPDATE | intervention_id + expected_version + campos explícitos; nome/símbolo não congelados; editar finalizada permitido; se conteúdo orçamentário muda, invalidar aprovação |
| FINALIZE_PHASE | Ocorrência + phase_id associado + event_id/data + expected_version; evento PHASE_HISTORY; continua Realizar; novas baixas podem repetir fase com novos IDs/datas |
| FINALIZE_COMPLETE / status Realizada | Ocorrência + expected_version; finalização vigente por default editável; conclusão/histórico automático, sem parcela automática |
| DELETE_INTERVENTION | ID/version/permissões/OWNER; remove ocorrência e histórico automático relacionado, invalida orçamento; NÃO elimina pagamento realizado ou baixa clínica/cirurgião |
| READ_VIEW / CONTEXT_PANEL | Slots atuais + ocorrências distintas por ID; alvos/faixas/faces; procedimento/nome/símbolo atuais; valores próprios; status semântico; painel de destino por cobrança; versões/histórico |
| READ_PREFERENCES | Paleta e especialidade/filtro/apresentação do usuário; sem alteração do estado clínico |
| READ_BUDGET | Revisão, aprovação, pendência/aviso durável, totais e pagamentos; abrir/fechar/dispensar aviso não modifica nada |
| APPROVE_BUDGET / ADJUST_EFFECTIVELY | expected_budget_version + command_id + plano financeiro; reconciliar revisão corrente, preservar pagamentos, devolver crédito/débito e aprovação consistente. ACK visual sozinho não ajusta |
| READ_COMMAND_RESULT | Reconsulta autenticada do resultado confirmado; não reexecuta write |
| DELETE_TREATMENT | Operação distinta, fora da implementação desta rodada; conjunto relacionado conforme evidência, sem confundir com delete individual |

Read model: IDs/contexto/version; slot atual com dentição/figura/FDI/display;
marking/targets/ranges/faces persistidos; catálogo vivo; valores/exclusão próprios;
status/data; fase/eventos; orçamento pendente/revisão; financeiro necessário por
permissão; preferências separadas. Não colapsar duplicatas por slot/procedimento.

Contexto deriva de current_user.clinica_id. Validar paciente/tratamento/procedimento/
tabela/slot/prestador/fase no mesmo tenant; IDs de código legado ≠ PK web.
require_module_access continua obrigatório; OWNER via FC3-D5 em toda mutação do
domínio protegido. Reaprovação já protegida não ganha bypass. Preferência pessoal
não vira mutação clínica para efeito de cor, mantendo suas permissões próprias.

Erros: LEASE_CONFLICT, SESSION_INVALID, SLOT_INVALID, MARKING_INVALID, RANGE_INVALID,
PATIENT_TREATMENT_MISMATCH, PROCEDURE_INVALID, PROVIDER_INVALID,
USER_PROVIDER_LINK_REQUIRED, STATUS_INVALID, PHASE_INVALID/PHASE_IN_USE,
BILLING_CLASSIFICATION_INVALID, SYMBOL_REQUIRED, FINANCIAL_RESTRICTION,
STALE_UPDATE, IDEMPOTENCY_CONFLICT, PARTIAL_BATCH_FAILURE, BUDGET_REVISION_STALE.
FINANCIAL_RESTRICTION não significa "há pagamento, não pode alterar"; cobre
permissões/contexto/reconciliação/estado incompatível comprovado. Códigos HTTP
e contratos finais dependem da padronização de projeto, não implementados aqui.
REVISED_API_DESIGN_STATUS = COMPLETE — design documental revisável.

## Roundtrip revisado A–U

Simulação conceitual em memória, sem DB/GUI/source. Referência numérica de exemplo
é a configuração estática documentada, não equivalência universal slot=FDI.
WRITE→PERSIST→READ preserva alvos/ocorrências/valores próprios; render usa catálogo
e preferências VIVOS. Não exigir igualdade de nome/símbolo/cor antigos: a mudança
esperada nesses campos é contrato funcional, não perda de associação clínica.

| Caso | Comando/forma persistida | READ / RENDER / HISTORY / BUDGET esperados |
|---|---|---|
| A FACE 46, M/O | Slot 19, faces anatômicas e FACE2/FACE5 | Duas faces, catálogo atual; Realizar sem conclusão, valores próprios elegíveis |
| B DENTE 11 | Slot 8, uma ocorrência | Elemento atual, símbolo vivo, uma contribuição |
| C GRUPO 14–16 | Slots 3/4/5, faixa [3..5], uma ocorrência | Trecho completo, sem contar preço por slot automaticamente |
| D SEGMENTO 12–13 + 16 | Slots 3/6/7, [3..3]+[6..7], uma ocorrência | Preserva lacunas e uma unidade da arcada |
| E ARCADA superior | Slots 1..16 e uma faixa, uma ocorrência | Arcada completa; duas arcadas seriam duas unidades |
| F GERAL | Contexto geral sem DENTE/FACE obrigatório | Sem inventar slots; render usa também classificação de cobrança |
| G slot vazio | slot_id presente, FDI/figura nullable | Associação/render não desaparecem |
| H slot renumerado | Mesmo slot_id, número atual alterado | Não move intervenção; origem fica em auditoria |
| I símbolo muda no catálogo | procedimento_id vivo | Intervenção existente reflete símbolo novo; alvo não muda |
| J preço muda no catálogo | Valores próprios persistidos | Não reprifica paciente/repasse existentes |
| K procedimento duas vezes no slot | Novos COMMAND_ID/UNIT_ID e dois IDs de intervenção | Duas ocorrências/painel/contribuições; replay de uma não cria terceira |
| L uma Realizada, outra Realizar | Status/version por ocorrência | Conclusão/histórico e edição/exclusão independentes |
| M símbolo muda com duas ocorrências | Ambas referenciam procedimento vivo | Ambas usam símbolo novo, podendo se sobrepor; não deduplicar |
| N preço muda com duas ocorrências | Cada ocorrência guarda paciente/repasse próprios | Ambas mantêm seus valores; soma orçamentária preservada |
| O permanente → decíduo | Atualiza atributos do mesmo slot | Dentição mista e intervenção no mesmo lugar |
| P slot sem dente | Remove figura/FDI do slot, não alvo | Intervenção continua existente no slot vazio |
| Q cobrança Intervenção sem seleção | Uma ocorrência, zero slots, sem APPLY_ALL | Símbolo/painel lateral e orçamento; não forçar GERAL como equivalência |
| R fase repetida, datas distintas | phase_id reutilizado, event_ids diferentes | Duas linhas PHASE_HISTORY; ocorrência continua Realizar |
| S pago 2.000 / orçamento 1.500 | Pagamento intacto; revisão nova pendente | Reaprovação produz crédito paciente 500; baixa clínica/cirurgião intacta |
| T pago 2.000 / orçamento 2.500 | Pagamento intacto; revisão nova pendente | Reaprovação produz débito restante 500; baixa clínica/cirurgião intacta |
| U cor de preferência muda | Somente preferência do usuário | Renderer muda cor; status/version/histórico/orçamento clínicos não mudam |

Controle adicional: slots 2,3,7,8,18 → GRUPO 3 unidades (2/2/1 alvos);
SEGMENTO 2 (4/1); ARCADA 2 (16/16). R$200,00/3 conserva 20.000 centavos.
ROUNDTRIP_REVISED_STATUS = PASS.
ROUNDTRIP_REVISED_LOSS_CASES = NENHUM nos casos conceituais projetados.
PASS não é teste de banco/migration/financeiro/renderer implementado.

## Migração, writers, blockers e pausa

Dados atuais são fonte da verdade sobre implementação, não prova de aderência.
Preservar raw/source e IDs; adicionar targets/faixas/history FK e financeiro próprio
sem inferir slot por FDI ambíguo. Não congelar catálogo por backfill de snapshot
aplicado. Fonte histórica de faces deve resolver mapeamento posicional; importador
que recria slot/associação exige adaptação futura, nunca execução nesta rodada.
Fases inline atuais precisam conciliação com catálogo auxiliar reutilizável,
sem inventar equivalências por descrição. Pagamentos efetivados e vínculos de
reconciliação precisam plano seguro de migração, não estorno por normalização.

BLOCKING_BEFORE_P2 = revisão/aprovação do design reconciliado e fechamento Git
posterior; plano seguro de migração/rollback; inventário dos writers atuais;
políticas técnicas de contexto/data/centavos/erro de lote/retry/locks e contratos
financeiros por revisão, permissões e compatibilidade. Não repetir D01–D10.
BLOCKING_BEFORE_P3 = auditoria/regularização de procedimentos sem símbolo;
shell/UX; hitboxes/composição; preferências; subset A/B autorizado e homologação manual.
BLOCKING_BEFORE_DELETE = implementação/testes de pendência e reaprovação/reconciliação,
preservação de pagamentos/baixas, proveniência/limpeza automática do histórico,
permissões/OWNER/versões/locks e integração dos writers. Veto genérico por pagamento
FOI REMOVIDO; delete de tratamento inteiro tem contrato/escopo separado.
NON_BLOCKING_GAPS = pixel-a-pixel legado e refinamentos estéticos, sem liberar assets C.

AFTER_P1_R1_CHECKPOINT = PAUSE_FC4.
FC4_PAUSE_AFTER_CHECKPOINT = SIM.
NEXT_SEPARATE_MODULE = PROCEDIMENTOS, sob autorização separada.
Objetivo posterior: auditar/quantificar ausência de símbolos, listar tabelas, verificar
cadastro/validação obrigatória e planejar regularização preservando dados, sem inventar
símbolos. AUDITORIA_PROCEDIMENTOS_STARTED = NÃO. P2 = NOT STARTED.
READY_FOR_P1_R1_CHECKPOINT = SIM — documental, sujeito à revisão; sem commit/push.

## Registro histórico P0H/P0I — preservado, não vigente onde superado

O conteúdo abaixo registra o estado pré-P1.R1. Em divergência, prevalecem D01–D10
e o design reconciliado acima; propostas anteriores não devem ser reativadas.

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
