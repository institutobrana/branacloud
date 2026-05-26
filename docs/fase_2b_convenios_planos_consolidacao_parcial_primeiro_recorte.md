# Fase 2B - Convênios e Planos - Consolidação parcial após primeiro recorte validado

## 1. Identificação da etapa

- Fase 2B.
- Convênios e Planos.
- Frente comum/core transversal.
- Consolidação parcial após primeiro recorte validado.
- Etapa exclusivamente documental.

## 2. Recorte já concluído

### Lista principal e contadores de Convênios e Planos

- O que foi extraído parcialmente do `app.js`:
  - montagem visual da lista principal de Convênios;
  - montagem do contador de Convênios;
  - montagem visual da lista principal de Planos;
  - montagem do contador de Planos;
  - composição HTML das linhas, preservando estado selecionado e status exibido.
- Helpers criados/ajustados no módulo passivo:
  - `escHtml(valor)`;
  - `montarLinhasConvenios(lista, selectedId, statusFormatter)`;
  - `montarLinhasPlanos(lista, convenioSelecionadoId, selectedPlanoId, statusFormatter)`.
- O que permaneceu no `app.js`:
  - `convPlanCarregar()`;
  - seleção de convênio e plano;
  - abertura/fechamento do painel;
  - botões de ação;
  - modais;
  - calendário de faturamento;
  - salvar/excluir;
  - payload;
  - `requestJson`;
  - fluxos transversais.
- Commit de implementação:
  - `81379b6d2c9901ab0e77ab4bf6bf1f4e7da0bc8e`
- Commit de validação pós-teste:
  - `5802169519a62d4545a24b441cad6971f24142d5`
- Resultado do teste:
  - passou após correção pontual.

## 3. Registro da anomalia e correção pontual

- Durante o teste foi visto mojibake vermelho na seção Telefones.
- A auditoria confirmou que era preexistente.
- A implementação de listas/contadores não causou o mojibake.
- A correção foi feita separadamente.
- A correção alterou somente o literal `â˜Ž` para `&#9742;` em `convPlanConvenioPhoneRowV2(prefix, label)`.
- Não houve limpeza textual ampla.
- Não houve correção de outros textos, acentos, labels, placeholders ou mensagens.

## 4. Estado atual de Convênios e Planos

- Parte do visual/local já saiu de `app.js`.
- Permanecem no `app.js` a orquestração de carregamento, seleção, abertura/fechamento, botões, modais, calendário, salvar, excluir, payload e `requestJson`.
- Ainda existem áreas sensíveis, sobretudo as que se aproximam de calendário, modais, persistência e fluxos transversais.
- Há ganho seguro possível em continuar, mas a margem está menor do que no primeiro recorte.
- Continuar agora pode começar a encostar em calendário, modais, salvar, excluir, `requestJson`, payload, pacientes, agenda, financeiro, recebimentos, procedimentos, prestadores ou permissões se o escopo não for novamente delimitado.

## 5. Áreas que continuam proibidas

- backend;
- banco;
- endpoints;
- permissões;
- `requestJson`;
- payload efetivo;
- salvamento;
- exclusão;
- criação/edição real de convênio;
- criação/edição real de plano;
- calendário de faturamento;
- modais funcionais;
- pacientes;
- agenda;
- financeiro;
- recebimentos;
- procedimentos;
- prestadores;
- validações críticas;
- correções textuais;
- correções de acento;
- labels/placeholders/mensagens;
- mojibake.

## 6. Risco de continuar em Convênios e Planos

- Ainda pode haver recortes médios pequenos e seguros, mas a proximidade com calendário, modais e persistência aumenta o risco de desvio de escopo.
- O principal cuidado é não atravessar para salvar, excluir, `requestJson`, payload ou fluxos transversais sem novo contrato.

## 7. Opções de próximo caminho

### Opção A: pausar Convênios e Planos e voltar para nova matriz comparativa

- Risco: baixo.
- Ganho esperado: alto para reduzir risco.
- Clareza de teste: alta.
- Rollback mental: simples.
- Chance de tocar áreas proibidas: baixa.
- Recomendação: favorável.

### Opção B: fazer um segundo contrato profundo ainda em Convênios e Planos

- Risco: médio.
- Ganho esperado: moderado.
- Clareza de teste: razoável, desde que o recorte seja visual/local.
- Rollback mental: simples se o contrato for bem fechado.
- Chance de tocar áreas proibidas: média se o recorte não for bem delimitado.
- Recomendação: possível, mas secundária.

### Opção C: abrir contrato profundo em outra frente da Fase 2B

- Risco: depende da frente escolhida.
- Ganho esperado: alto se a frente estiver mais segura.
- Clareza de teste: variável.
- Rollback mental: variável.
- Chance de tocar áreas proibidas: variável.
- Recomendação: viável, mas só após nova matriz comparativa.

## 8. Recomendação

- Convênios e Planos deve ser pausado por enquanto.
- A próxima etapa deve ser uma nova matriz comparativa documental.
- Não deve haver implementação direta sem novo contrato.
- O sucesso do primeiro recorte não autoriza ampliar escopo automaticamente.

## 9. Registro para roadmap

- A consolidação parcial do primeiro recorte médio validado em Convênios e Planos foi registrada.
- O teste manual passou após a correção pontual do mojibake.
- O estado atual da frente na Fase 2B ficou documentado.
- Os limites ainda vigentes foram reforçados.
- A próxima subetapa recomendada é pausar Convênios e Planos e abrir nova matriz comparativa documental.
- Esta etapa não escolheu implementação direta.
- A blindagem textual/mojibake foi respeitada.
