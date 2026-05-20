# Recomendação do próximo módulo após Procedimentos Genéricos

## 1. Contexto
O ciclo seguro inicial de Procedimentos Genéricos foi considerado finalizado nesta rodada, após a sequência documental e técnica que consolidou o namespace passivo, a correção monetária compartilhada e a auditoria/validação do payload sensível sem extração de `pgenPayloadFromState(state)`.

Referências de base:

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `docs/procedimentos_genericos_subetapa_5b_fixtures_payload_pgenpayloadfromstate.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`

## 2. Comandos iniciais executados
Saídas registradas no início da revisão:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short

git diff --stat

git log --oneline -12
c5836ac docs: registra fixtures de payload de procedimentos genericos
b21da88 docs: audita payload de procedimentos genericos
fcc6b57 docs: registra recomendacao pos-etiquetas
26dc1b9 feat(frontend): inicia ciclo seguro de procedimentos genericos
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
```

## 3. Documentos consultados
Documentos encontrados e analisados:

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `docs/procedimentos_genericos_subetapa_5b_fixtures_payload_pgenpayloadfromstate.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`

Documentos ausentes:

- nenhum dos documentos obrigatórios consultados nesta rodada estava ausente

## 4. Estado atual da branch
- Branch: `modularizacao-segura-fase-1`
- HEAD recente consolidado: `c5836ac docs: registra fixtures de payload de procedimentos genericos`
- Base funcional imediata anterior: `b21da88 docs: audita payload de procedimentos genericos`
- `git status --short` inicial: limpo
- `git diff --stat` inicial: sem diff

## 5. Critérios de escolha
Os critérios usados foram conservadores:

- fronteiras claras e painel próprio
- baixa dependência de cálculo monetário
- baixo acoplamento com `agenda`, `editor de textos` e `financeiro`
- possibilidade real de começar com Subetapa 0 documental e Subetapa 1 passiva
- menor risco de regressão visual/funcional
- manual de teste simples e rollback previsível

## 6. Módulos já encerrados
Módulos com ciclo seguro encerrado ou já consolidado nesta linha de trabalho:

- `Unidades`
- `Plano de Contas`
- `CID`
- `Medicamentos`
- `Auxiliares / Tabelas auxiliares`
- `Etiquetas / Configuração de modelos de etiqueta`
- `Procedimentos Genéricos` no ciclo inicial já documentado nesta rodada, com `pgenStatusDot` extraído e `pgenPayloadFromState` ainda mantido no `app.js`

## 7. Módulos candidatos avaliados

### Tabela comparativa de risco

| Módulo | Tamanho / superfície | Dependências críticas | Risco de regressão | Classificação |
|---|---|---|---|---|
| `Anamnese` | Médio; dois blocos históricos, lista, questionários, perguntas, duas modais | `requestJson`, modal próprio, renumeração, vínculo clínico | Médio | **Recomendado agora** |
| `Símbolos Gráficos` | Médio/alto; lista, biblioteca, modal, editor externo e bridge com iframe | `requestJson`, `postMessage`, editor externo, vínculo com procedimentos | Alto | Possível, mas com cautela |
| `Prestadores` | Médio/baixo; lista e filtros, porém parte das ações ainda é placeholder | sessão, agenda, convênios, comissões | Médio | Possível, mas com cautela |
| `Convênios e Planos` | Médio/alto; dois grids e migração/exclusão | faturamento/calendário, scaffold compartilhado | Alto | Não recomendado agora |
| `Materiais` | Alto; múltiplas listas, tabs, modais e valores | unidades, índices, vínculos e números | Alto | Não recomendado agora |
| `Índices financeiros` | Alto; lista, cotações, exclusão com validação e migração | financeiro e uso cruzado | Alto | Não recomendado agora |
| `Agenda` | Alto; modos dia/semana/clínica, standalone e muitos eventos | fluxo operacional amplo | Alto | Alto risco, deixar para depois |
| `Editor de Textos` | Muito alto; editor rico, imagens, sandbox e standalones | DOM pesado, persistência complexa, integrações clínicas | Muito alto | Alto risco, deixar para depois |
| `Cenário financeiro` | Alto; cálculos e contratos monetários | `procCenario`, `toFloat`, `procFmtMoeda`, `procParse` | Muito alto | Alto risco, deixar para depois |
| `Procedimentos / Intervenções` | Muito alto; o maior bloco do app | custos, materiais, símbolos, payload e financeiro | Muito alto | Alto risco, deixar para depois |

### 7.1 Anamnese
- Tem cerca de duas áreas históricas no `app.js`, mas a implementação ativa é concentrada.
- Possui lista, questionários, perguntas, renumeração e duas modais.
- Não depende de contrato monetário nem de cálculo financeiro.
- Os endpoints são diretos e a superfície de teste manual é simples.
- Apesar da sensibilidade clínica, o risco técnico é menor do que em símbolos, agenda, editor e financeiro.

### 7.2 Símbolos Gráficos
- Tem uma superfície maior do que parece à primeira vista.
- Há editor externo em iframe e troca de mensagens com `postMessage`.
- A integração com procedimentos aumenta o risco de acoplamento.
- É um candidato possível, mas não o primeiro desta rodada.

### 7.3 Prestadores
- O painel é dedicado, mas parte das ações atuais ainda é placeholder/migração.
- Há dependências com agenda, convênios e comissão.
- Pode ser modularizado, porém o valor de segurança é menor do que Anamnese.

### 7.4 Convênios e Planos
- Toca em calendário de faturamento e regras de migração/exclusão.
- A fronteira funcional já é mais sensível.
- Não é a melhor escolha agora.

### 7.5 Materiais
- Muito acoplado a listas, unidades, índices, vínculos e valores.
- Alto volume de DOM e de chamadas de API.
- Não recomendado como próxima fronteira segura.

### 7.6 Índices financeiros
- Envolve cotações, uso e migração.
- A superfície é claramente financeira.
- Não recomendado agora.

### 7.7 Agenda
- Fluxo operacional amplo, com modos diferentes e muitos eventos.
- Risco alto de regressão funcional.
- Deve ficar para depois.

### 7.8 Editor de Textos
- A superfície é grande e rica demais para ser o próximo passo seguro.
- Usa DOM complexo, imagens, persistência e modo standalone.
- Alto risco.

### 7.9 Cenário financeiro
- Continua no grupo de maior sensibilidade monetária do aplicativo.
- Depende diretamente de contratos e cálculos financeiros.
- Não deve ser o próximo módulo.

### 7.10 Procedimentos / Intervenções
- É o bloco mais sensível e pesado do app.
- Toca em custos, materiais, símbolos, vínculos e payload.
- Não é apropriado para a próxima rodada.

## 8. Módulos que não devem ser priorizados agora
Por risco técnico e/ou monetário, a ordem de espera recomendada é:

- `Procedimentos / Intervenções`
- `Cenário financeiro`
- `Editor de Textos`
- `Agenda`
- `Índices financeiros`
- `Materiais`
- `Convênios e Planos`
- `Símbolos Gráficos` como primeira opção
- `Prestadores` como primeira opção

## 9. Módulo recomendado
**Recomendado agora: `Anamnese`**

## 10. Justificativa técnica
- Tem fronteira mais clara que os módulos financeiros e editoriais.
- Não depende de `procFmtMoeda`, `procParse`, `toFloat` ou `procCenario`.
- Não toca em payload sensível de custos ou materiais.
- Possui lista, questionários, perguntas e modais bem definidos.
- Dá para iniciar com Subetapa 0 puramente documental e Subetapa 1 passiva, mantendo `frontend/app.js` como fonte funcional da verdade.
- O rollback tende a ser simples porque a tela é autocontida.

## 11. Riscos do módulo escolhido
- Existe duplicidade histórica de blocos no `app.js`, o que exige cuidado para mapear a implementação ativa.
- Há renumeração de perguntas e dois fluxos de modal, então os contratos precisam ser bem descritos.
- Há vínculo clínico/paciente, então a validação visual do fluxo precisa ser feita com atenção.
- A extração funcional precoce seria arriscada; o ciclo deve começar documental/passivo.

## 12. Proposta de Subetapa 0 para o módulo recomendado
Se a decisão for seguir com `Anamnese`, a Subetapa 0 deve:

- mapear a função principal de abertura;
- listar as funções de questionários, perguntas, renumeração, exclusão e modais;
- identificar estado/cache, DOM, eventos e endpoints;
- destacar trechos legados que não devem ser movidos;
- registrar helpers puros candidatos com extrema cautela;
- manter o arquivo como documentação apenas.

## 13. Proposta de Subetapa 1 para o módulo recomendado
Na Subetapa 1, a abordagem conservadora deve ser:

- criar `frontend/js/modules/anamnese.js`;
- expor apenas `window.BranaAnamneseModule`;
- adicionar metadados e `getInfo()` / `getStatus()`;
- carregar o script antes de `frontend/app.js` no `index.html`;
- não mover lógica funcional;
- não criar wrappers ainda;
- não mexer em backend, banco ou endpoints.

## 14. Checklist de teste manual inicial
Antes de qualquer modularização futura de `Anamnese`:

1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Anamnese` pelo menu correspondente.
3. Confirmar abertura do painel.
4. Confirmar carregamento da lista de questionários/perguntas.
5. Trocar de questionário.
6. Abrir `Novo...` e `Altera...`.
7. Testar a modal de pergunta.
8. Testar a renumeração de perguntas.
9. Fechar e reabrir o painel.
10. Confirmar console sem `ReferenceError` ou `TypeError`.

## 15. Riscos conhecidos
- dependência com a ficha/paciente
- modal dupla
- renumeração de perguntas
- bloco histórico duplicado
- possibilidade de regras clínicas ocultas
- necessidade de preservar o comportamento de `requestJson` e validações locais

## 16. Critério para parar
Se a futura Subetapa 0 de Anamnese mostrar qualquer uma destas condições, a modularização deve parar antes de qualquer extração:

- a função de abertura estiver misturada com fluxo de outro módulo
- houver dependência de agenda, financeiro ou editor
- houver payload sensível não mapeável
- houver comportamento duplicado entre blocos e não ficar claro qual é o ativo
- houver risco de alterar respostas ou renumeração

## 17. Checks finais
Checks executados após a análise:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/procedimentos-genericos.js`
- `git status --short`
- `git diff --stat`

Resultado esperado após a criação deste relatório:

```text
?? docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md
```

Não deve haver alteração em:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- backend
- banco
- endpoints

## 18. Onde testar antes de qualquer futura extração
1. Abrir o sistema no navegador com `Ctrl+F5`.
2. Abrir `Anamnese`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Abrir um questionário.
6. Abrir uma pergunta.
7. Testar a renumeração.
8. Fechar e reabrir o painel.
9. Confirmar console sem `ReferenceError` ou `TypeError`.

## 19. Confirmação final
- Nenhum código funcional foi alterado nesta etapa.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- backend não foi alterado.
- banco não foi alterado.
- endpoints não foram alterados.
- nenhuma nova modularização foi iniciada.
- nenhum commit foi feito.
