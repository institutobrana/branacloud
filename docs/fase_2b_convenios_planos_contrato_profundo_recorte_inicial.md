# Contrato profundo - Convênios e Planos

## 1. Contexto

- `Preferências / Configurações` foi consolidada como frente estável.
- `Prestadores` foi parcialmente validado e encerrado nesta rodada.
- A matriz curta pós-Prestadores recomendou `Convênios e Planos` como próxima frente.
- Este documento é apenas documental e não altera código nem banco.
- O objetivo é mapear o menor recorte seguro possível antes de qualquer implementação futura.

## 2. Estado atual de Convênios e Planos

### 2.1. Blocos principais em `frontend/app.js`

O bloco de `Convênios e Planos` está concentrado principalmente em:

- `convPlanRenderConvenios()` em torno da linha `7038`
- `convPlanRenderPlanos()` em torno da linha `7039`
- `convPlanSelecionarConvenio()` em torno da linha `7040`
- `convPlanSelecionarPlano()` em torno da linha `7041`
- `convPlanEnsureUI()` em torno da linha `7042`
- `convPlanCarregar()` em torno da linha `7043`
- `convPlanVincularEventos()` em torno da linha `7044`
- `convPlanAbrir()` em torno da linha `7045`

Também há fluxo de calendário/faturamento relacionado em:

- `convPlanCalAbrirModal()`
- `convPlanCalEnsureUI()`
- `convPlanCalBind()`
- `convPlanCalAbrir()`
- `convPlanCalCarregar()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`
- `convPlanCalSelecionar()`
- `convPlanCalRender()`

### 2.2. Módulo passivo existente

Existe módulo passivo em [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js), com namespace `window.BranaConveniosPlanosModule`.

Helpers/exportações presentes:

- `meta`
- `helpers`
- `getInfo()`
- `getStatus()`

Helpers passivos mapeados no módulo:

- `normalizarNomeConvenio()`
- `validarNomeConvenio()`
- `normalizarNomePlano()`
- `validarNomePlano()`
- `normalizarCodigoRegistro()`
- `escHtml()`
- `montarLinhasConvenios()`
- `montarLinhasPlanos()`

### 2.3. Wrappers/fallbacks já presentes em `app.js`

Há wrappers locais e fallback estrutural no `app.js`, por exemplo:

- `convPlanNormalizarCampoTextoLocal()`
- `convPlanNormalizarNomeConvenioLocal()`
- `convPlanNormalizarNomePlanoLocal()`
- `convPlanNormalizarCodigoRegistroLocal()`
- `convPlanSetObjectOptionsV2()`
- `convPlanStatusDotV2()`
- `convPlanCurrentConvenioV2()`
- `convPlanCurrentPlanoV2()`

## 3. Matriz de risco

| Área | Funções/trechos | Tipo | Risco | Pode recortar agora? | Justificativa |
| --- | --- | --- | --- | --- | --- |
| Lista/renderização visual | `convPlanRenderConvenios`, `convPlanRenderPlanos`, `montarLinhasConvenios`, `montarLinhasPlanos` | DOM/visual | RISCO-BAIXO-MEDIO | Sim, com contrato | É a fronteira mais observável e local, mas há duas listas ligadas. |
| Seleção de convênio/plano | `convPlanSelecionarConvenio`, `convPlanSelecionarPlano` | DOM + estado local | RISCO-MEDIO | Sim, com contrato | A seleção afeta as duas listas e exige cuidado com estado. |
| Filtros locais simples | filtro de convenios/planos por seleção atual | Estado local | RISCO-MEDIO | Sim, com contrato | Filtro depende da seleção e não deve encostar em carregamento remoto. |
| Shell visual / abrir-fechar | `convPlanEnsureUI`, `convPlanAbrir`, `convPlanVincularEventos` | DOM estrutural | RISCO-BAIXO-MEDIO | Sim, com contrato | Pode ser isolado como shell, mas os botões já ligam a fluxos sensíveis. |
| Modais internos apenas visuais | `convPlanCalEnsureUI`, `convPlanCalAbrirModal` | DOM + modal | RISCO-MEDIO | Só se o contrato for específico | O calendário/faturamento torna o modal mais sensível. |
| Payload / coleta | `convPlanCalModalPayload`, possíveis payloads de convênio/plano | mutação | RISCO-ALTO | Não | Encosta em persistência. |
| Salvamento | `convPlanCalSalvar`, futuros salvamentos de convênio/plano | mutação | RISCO-ALTO | Não | Há escrita real e necessidade de backend. |
| requestJson | `convPlanCarregar`, `convPlanCalCarregar`, `convPlanCalSalvar`, `convPlanCalExcluir` | rede / persistência | RISCO-ALTO | Não | Já depende de API e estado remoto. |
| Exclusão | `convPlanCalExcluir`, exclusões de convênio/plano | mutação | RISCO-ALTO | Não | Risco funcional e de dados. |
| Calendário/faturamento | `convPlanCal*` | negócio / financeiro | RISCO-ALTO | Não | Fluxo sensível e ligado a faturamento. |
| Permissões | ações protegidas / escopo de acesso | segurança | RISCO-ALTO | Não | Qualquer avanço pode cruzar proteção funcional. |
| Backend/banco | rotas `/cadastros/convenios-planos/*` | crítico | RISCO-CRÍTICO | Não | Fora do recorte mínimo para esta etapa. |

## 4. Candidatos avaliados

| Candidato | Função/área | Tipo | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- | --- |
| `montarLinhasConvenios` | lista visual de convênios | DOM/visual | RISCO-BAIXO-MEDIO | alto | Candidato possível |
| `montarLinhasPlanos` | lista visual de planos | DOM/visual | RISCO-BAIXO-MEDIO | alto | Candidato possível |
| `convPlanSelecionarConvenio` | seleção de convênio | DOM + estado | RISCO-MEDIO | médio | Candidato possível com contrato |
| `convPlanSelecionarPlano` | seleção de plano | DOM + estado | RISCO-MEDIO | médio | Candidato possível com contrato |
| `convPlanEnsureUI` | shell visual | DOM estrutural | RISCO-BAIXO-MEDIO | médio | Candidato possível |
| `convPlanVincularEventos` | wiring de botões/listas | DOM + eventos | RISCO-MEDIO | médio | Candidato possível, mas exige fronteira clara |
| `convPlanCal*` | calendário/faturamento | negócio/financeiro | RISCO-ALTO | alto | Bloqueado nesta fase |
| `convPlanCarregar` | carregamento remoto | requestJson | RISCO-ALTO | alto | Bloqueado nesta fase |
| `convPlanCalSalvar` / exclusões | escrita real | mutação | RISCO-ALTO | alto | Bloqueado nesta fase |

## 5. Decisão do contrato

**Decisão:** `CONVPLAN-CONTRATO-B`

## 6. Justificativa

- Há um recorte pequeno e útil em listas/seleção/shell visual.
- Porém, `Convênios e Planos` já mostra ligação imediata com calendário/faturamento e com fluxos de gravação, então o risco é maior que em um helper puramente visual.
- A decisão conservadora é manter o recorte possível, mas exigir um contrato ainda mais específico antes de qualquer implementação.
- Assim, preservamos a frente como candidata segura o suficiente para continuar a análise, sem abrir a porta para `requestJson`, payload, salvamento ou calendário.

## 7. Recorte recomendado

### Nome

`Convênios e Planos - contrato visual mínimo de lista e seleção`

### Objetivo

- Mapear e isolar o bloco visual de convênios e planos.
- Manter lista, seleção e shell sob controle.
- Evitar qualquer avanço em calendário/faturamento e mutações.

### Fronteira permitida

- `montarLinhasConvenios`
- `montarLinhasPlanos`
- `convPlanRenderConvenios`
- `convPlanRenderPlanos`
- `convPlanSelecionarConvenio`
- `convPlanSelecionarPlano`
- `convPlanEnsureUI`
- `convPlanVincularEventos` apenas no que for wiring visual local

### Fronteira proibida

- `convPlanCarregar`
- `convPlanCal*`
- `requestJson`
- payload
- salvamento
- exclusão
- calendário/faturamento
- backend
- banco
- permissões
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)

### Arquivos futuros permitidos

- [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js)
- [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)
- documento de implementação futura, se houver

### Arquivos proibidos

- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)
- backend funcional
- banco/schema/migrations/seeds/endpoints
- `.env`
- scripts de migração
- dumps e backups

### Funções proibidas

- `convPlanCarregar`
- `convPlanCalAbrir`
- `convPlanCalCarregar`
- `convPlanCalSalvar`
- `convPlanCalExcluir`
- `convPlanCalModalPayload`
- qualquer função que acione requestJson ou mutação

### Fallback esperado

- fallback local preservado em `app.js` para renderização e seleção, caso o módulo passivo não esteja disponível.

### Checks esperados

- abrir/fechar painel;
- renderizar listas;
- selecionar convênio e plano;
- manter destaque visual;
- sem tocar em calendário/faturamento;
- sem tocar em persistência.

### Onde testar

- tela `Convênios e Planos`;
- lista principal;
- seleção;
- filtros;
- abertura/fechamento;
- modais apenas como referência futura, não como alvo inicial.

## 8. Se não houver recorte seguro

Não é o caso neste momento. Há recorte visual mínimo possível, mas ele deve ficar protegido por contrato mais específico antes de qualquer implementação.

## 9. Confirmações de escopo

- nenhum código alterado;
- nenhum dado de banco alterado;
- frontend/app.js não alterado;
- frontend/index.html não alterado;
- frontend/js/modules não alterado;
- backend não alterado;
- `.env` não alterado;
- banco/schema/migrations/seeds/endpoints não alterados;
- PostgreSQL 18 não excluído/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 10. Registro para roadmap

Convênios e Planos entrou em contrato profundo documental com recorte visual mínimo possível, mas classificado de forma conservadora como `CONVPLAN-CONTRATO-B` para exigir contrato ainda mais específico antes de qualquer implementação.
