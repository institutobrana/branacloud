# Decisão - Convênios e Planos após validação da renderização de listas

## Contexto

- A matriz curta pós-Prestadores escolheu `Convênios e Planos`.
- Os contratos foram abertos em sequência até o microcontrato de renderização de listas.
- A implementação mínima de renderização das listas foi feita e validada manualmente.

## Estado consolidado

- Lista de convênios validada.
- Lista de planos validada.
- Renderização visual validada.
- `convPlanRenderConvenios` e `convPlanRenderPlanos` permanecem como orquestradores.
- Fallback local preservado.
- Áreas sensíveis preservadas.

## Candidatos restantes avaliados

| Candidato | Área/função | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- |
| Seleção visual de convênio | Estado visual / linha selecionada | Médio | Continua a coerência visual da lista | Avaliado |
| Seleção visual de plano | Estado visual / linha selecionada | Médio | Continua a coerência visual da lista | Avaliado |
| Shell visual / abrir-fechar | Estrutura do painel | Baixo-médio | Mantém a experiência de abertura/fechamento | Avaliado |
| Filtros locais | Filtro visual / refinamento de lista | Médio | Ajuda a navegação sem tocar no servidor | Avaliado |
| Modais internos apenas visuais | UI de apoio | Médio | Pode ampliar utilidade sem tocar em dados | Avaliado |
| Eventos/wiring local | Bindings da tela | Médio | Organiza a interação local | Avaliado |
| `requestJson` | Chamada remota | Alto | Habilita leitura/integração, mas sobe muito o risco | Bloqueado |
| Payload/coleta | Montagem de dados | Alto | Pré-requisito para mutação funcional | Bloqueado |
| Salvamento | Persistência | Alto | Fluxo funcional sensível | Bloqueado |
| Exclusão | Mutação destrutiva | Alto | Risco elevado e fora do recorte atual | Bloqueado |
| Calendário/faturamento | Área sensível de negócio | Alto | Funcionalidade útil, mas complexa | Bloqueado |
| Permissões | Segurança/escopo | Alto | Pode impactar acesso global | Bloqueado |
| Backend/banco | Persistência/serviço | Crítico | Exige mudança estrutural fora do escopo | Bloqueado |

## Caminhos comparados

### Caminho A

- Continuar em `Convênios e Planos` com novo contrato profundo.
- Benefício: continuidade na frente atual.
- Risco: os próximos candidatos podem encostar em seleção, shell, eventos ou áreas sensíveis.
- Exigência: contrato profundo específico antes de qualquer código.

### Caminho B

- Consolidar `Convênios e Planos` como parcialmente validado e voltar para matriz comparativa.
- Benefício: evita aprofundar em frente de risco médio.
- Risco: troca de contexto.
- Indicado se os próximos candidatos subirem demais de risco.

### Caminho C

- Manter `Convênios e Planos` como candidata, mas exigir novo microcontrato antes de qualquer avanço.
- Benefício: preserva continuidade sem implementar automaticamente.
- Risco: controlado.
- Indicado se houver candidato pequeno, mas não suficientemente seguro para implementação direta.

## Decisão conservadora

- A decisão registrada foi `CONVPLAN-DEC-C`.
- `Convênios e Planos` permanece consolidada como parcialmente validada.
- Não haverá avanço automático para seleção, shell, eventos, `requestJson`, payload, salvamento, exclusão, calendário/faturamento, permissões, backend ou banco.

## Justificativa

- O recorte visual de listas já foi validado e consolidado.
- Os próximos candidatos ainda encostam em áreas de maior risco e não justificam um avanço automático.
- O caminho mais seguro é manter a frente como candidata e exigir novo microcontrato antes de qualquer mudança funcional adicional.

## Próxima etapa recomendada

- Abrir novo microcontrato antes de qualquer avanço.
- Não iniciar novo recorte automaticamente nesta etapa.

## Onde testar futuramente

- Tela `Convênios e Planos`.
- Listas.
- Seleção visual.
- Filtros.
- Abertura/fechamento.
- Modais internos.
- Calendário/faturamento apenas como não-regressão, salvo se forem alvo futuro específico.

## Confirmações de escopo

- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- `.env` não alterado.
- Banco/schema/migrations/seeds/endpoints não alterados.
- PostgreSQL 18 não excluído/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap

- `Convênios e Planos` ficou consolidado como frente parcialmente validada.
- A decisão conservadora é `CONVPLAN-DEC-C`.
- A próxima ação só deve ocorrer após novo microcontrato.
