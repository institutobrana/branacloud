# Convênios e Planos — Subetapa 1 — Análise documental do helper normalizeText

## 1. Objetivo da análise documental

Esta subetapa documenta, de forma estreita e conservadora, o helper puro `normalizeText()` existente no módulo Convênios e Planos.

O foco é entender a pureza, as entradas e saídas, as dependências diretas e os riscos de futura delegação, sem alterar qualquer arquivo funcional, sem mover lógica e sem tocar em evento, clique, duplo clique, renderização, modais, payload, salvamento, exclusão, API, backend, banco ou schema.

## 2. Base documental consultada

Documentos lidos nesta análise:

- `docs/convenios_planos_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`

## 3. Onde `normalizeText()` está definido

`normalizeText()` está definido em:

- `frontend/js/modules/convenios-planos.js`

Ele aparece no topo do arquivo do namespace passivo do módulo.

## 4. Assinatura atual da função

A assinatura atual é:

```javascript
function normalizeText(value)
```

## 5. Lógica atual da função

Em termos funcionais, a função:

- converte a entrada para string;
- trata `null` e `undefined` como string vazia;
- aplica `trim()`;
- normaliza sequências de espaços em branco para um único espaço;
- devolve a string final já aparada e compactada.

Não há lógica condicional de domínio, nem validação de negócio própria além dessa normalização textual básica.

## 6. Entradas esperadas

A função espera qualquer valor que possa ser convertido para string, por exemplo:

- texto digitado pelo usuário;
- `null` / `undefined`;
- números;
- strings vazias;
- valores com espaços extras.

## 7. Saídas retornadas

Retorna sempre uma string.

Em termos práticos:

- retorna string vazia para valores nulos/indefinidos ou apenas espaços;
- retorna o conteúdo aparado quando há texto válido;
- reduz múltiplos espaços internos para um único espaço.

## 8. Altera DOM

Não.

`normalizeText()` não acessa `document`, não lê elementos, não escreve em interface e não depende de nenhum nó DOM.

## 9. Altera estado global

Não.

A função não escreve em variáveis globais, não altera flags, não troca seleção e não modifica estruturas compartilhadas.

## 10. Lê ou altera cache global

Não.

Ela não lê caches do módulo e não escreve em caches do módulo.

## 11. Chama API / `requestJson`

Não.

Não há chamada de rede, `fetch` ou `requestJson`.

## 12. Monta payload

Não diretamente.

A função apenas normaliza texto. Ela não cria payload HTTP por conta própria.

## 13. Salva dados

Não.

Ela não grava em backend, não persiste dados e não executa `POST`, `PUT` ou qualquer operação equivalente.

## 14. Exclui dados

Não.

Não há exclusão, confirmação ou ação equivalente.

## 15. Altera vínculo entre convênio e plano

Não.

`normalizeText()` não conhece convênio, plano, `row_id`, relacionamentos, filtros ou dependência entre registros.

## 16. Altera paciente

Não.

Não há referência a ficha do paciente, caches de paciente ou rotas clínicas.

## 17. Altera procedimento

Não.

Não há dependência de procedimentos, tratamentos, materiais ou vínculos clínicos.

## 18. Altera tabela, preço, custo, reajuste ou financeiro

Não.

Ela não toca tabela de preços, custos, reajustes, repasses, financeiro ou calendário de faturamento.

## 19. Depende de evento, clique ou duplo clique

Não.

`normalizeText()` não depende de evento, clique, `dblclick`, heurística de segundo clique rápido ou seleção de linha.

## 20. Depende de renderização

Não.

Ela não monta HTML, não recria `tbody`, não chama rotina de render e não depende do estado visual do painel.

## 21. Depende de modal

Não.

Não abre, fecha, preenche ou valida modal.

## 22. Altera texto visível

Não diretamente.

Ela não escreve texto de interface. O efeito é indireto: ao normalizar nomes ou códigos, pode influenciar o texto que depois será exibido ou salvo por outras rotinas.

## 23. Pode afetar validações de nome de convênio ou plano

Sim.

Ela é a base textual usada pelas validações locais do módulo:

- `normalizarNomeConvenio()`
- `validarNomeConvenio()`
- `normalizarNomePlano()`
- `validarNomePlano()`
- `normalizarCodigoRegistro()`

Esses helpers dependem diretamente de `normalizeText()` e herdam sua lógica de aparar e compactar espaços.

## 24. Helpers que dependem dela dentro de `frontend/js/modules/convenios-planos.js`

Dependência direta identificada:

- `normalizarNomeConvenio(valor)` chama `normalizeText(valor)`
- `normalizarNomePlano(valor)` chama `normalizeText(valor)`
- `normalizarCodigoRegistro(valor)` chama `normalizeText(valor)`

Dependência em cadeia:

- `validarNomeConvenio(valor)` depende de `normalizarNomeConvenio(valor)`
- `validarNomePlano(valor)` depende de `normalizarNomePlano(valor)`

## 25. Se `frontend/app.js` chama diretamente `normalizeText()`

Não.

O `frontend/app.js` não chama `normalizeText()` diretamente.

O que existe no `app.js` é uma camada de wrapper/fallback:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Essa camada tenta usar `window.BranaConveniosPlanosModule?.helpers[helperName]` e, se não conseguir, cai para a normalização local equivalente.

## 26. Se já há wrapper/fallback no `app.js` relacionado a validação/normalização

Sim.

Há um wrapper/fallback explícito em `frontend/app.js` para campo textual do módulo Convênios e Planos.

Características observadas:

- busca o helper exposto pelo namespace passivo;
- usa fallback local compatível;
- mantém o comportamento de normalização mesmo se o namespace não estiver disponível;
- centraliza o uso em validação/payload, não em DOM.

## 27. Risco de regressão funcional ao futuramente delegar ou consolidar esse helper

Existe risco, mas ele é controlável e relativamente baixo se a delegação respeitar o comportamento atual.

Pontos de atenção:

- `normalizeText()` é simples, mas está no caminho de payloads de convênio e plano;
- uma mudança sutil em trim, compressão de espaços ou tratamento de nulos pode alterar `codigo`, `codigo_ans` e `nome`;
- a camada de fallback do `app.js` foi feita justamente para reduzir esse risco;
- a consolidação futura deve preservar a semântica atual exatamente.

Conclusão:

- o risco não é alto como o de eventos, modais ou duplo clique;
- ainda assim, qualquer consolidação futura precisa de validação cuidadosa porque o helper influencia dados persistidos.

## 28. Risco textual / mojibake

Existe risco textual no módulo como contexto geral, porque há strings visíveis com mojibake em validações do namespace passivo.

No entanto:

- `normalizeText()` em si não cria texto visível de interface;
- o helper não corrige nem produz mojibake;
- a blindagem textual continua obrigatória;
- nenhuma correção textual foi aplicada nesta subetapa.

## 29. Risco relacionado ao histórico de duplo clique

O histórico de duplo clique é sensível no módulo, mas `normalizeText()` não depende disso.

Relação prática:

- nenhuma;
- o helper não lê clique, não registra eventos e não participa da heurística de segundo clique rápido;
- o risco de duplo clique permanece no módulo como um todo, mas não é causado por esse helper.

## 30. Classificação de pureza

**Puro**

Motivo:

- não usa DOM;
- não usa cache global;
- não altera estado;
- não chama API/requestJson;
- não salva;
- não exclui;
- não monta payload sensível por conta própria;
- não mexe em vínculo convênio/plano;
- não mexe em paciente;
- não mexe em procedimento;
- não mexe em tabela/preço/reajuste/custo/financeiro;
- não depende de evento, clique, duplo clique ou renderização;
- não altera strings visíveis diretamente.

## 31. Recomendação final

**Avançar futuramente para delegação controlada**

Justificativa:

- a pureza do helper foi confirmada;
- o comportamento é estável e simples;
- já existe wrapper/fallback no `app.js`;
- a migração futura pode ser feita sem mexer em comportamento se a semântica for preservada.

## 32. Próxima etapa recomendada

Próxima etapa documental sugerida:

- analisar `normalizarNomeConvenio()` e sua cadeia com `validarNomeConvenio()`;

Alternativamente, se a prioridade for a mínima superfície de mudança:

- analisar `normalizarCodigoRegistro()`

Essa próxima etapa deve continuar sem tocar em evento, clique, renderização, modais, payload, salvamento, exclusão, API ou backend.

## 33. Fechamento

Esta análise é exclusivamente documental.

Nenhum arquivo funcional foi alterado, e nenhuma correção textual foi aplicada.
