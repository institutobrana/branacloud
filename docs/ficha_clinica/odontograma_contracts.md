# FC4 — contratos funcionais canônicos recuperados

STATUS = CONSOLIDATED_FOR_REVIEW; implementação FC4 não iniciada.
Baseline: 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1.
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
| symbol | NROSIM, recursos e tipo | Catálogo e preview | Renderer clínico | Read/render suficiente | Base existente, integração pendente |
| status | 1/2/3 | Lookup | Cor/ações | Efeitos de lifecycle | Mapear código, não assumir PK |
| treatment | Selecionado define destino | Modelo/criação | Guia/contexto | Validar destino | Base existente |
| budget | Intervenção filtrada | Serviço/overrides | Sincronização | Regra Observada/exclusão | Valores/exclusão próprios |
| history | Helpers por ação | Fluxo equivalente não completo | Exibição consistente | Efeitos atômicos | Avaliar persistência atual |
| provider | ID_PRESTADOR | Relação prestador | Seleção | Tenant/validade | Base existente |
| dates | DATCAD/DATFIN/auditoria | Planejada/execução/timestamps | Entrada correta | Semântica de finalização | Avaliar campos adicionais |
| values | Valores próprios da intervenção | Catálogo+JSON | Propriedades | Ownership dos overrides | Contrato normalizado pendente |
| lease | Não transplantar lock Desktop | FC3-D5 homologada | OWNER gating | Guard existente/futuras rotas | Sem mudança D5 |

Leituras existentes: GET /odontograma/status, /arcada-slots, /intervencoes, /resumo.
Atualização parcial existente: PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id},
com guard. Capacidades futuras: create/apply, update de alvos, finalize, delete,
render/read completo, history/budget; avaliar reutilização antes de criar endpoints.
Backend novo não implementado; modelos aceitam vários dentes por intervenção,
mas isso sozinho não preserva todas as seis marcações.
