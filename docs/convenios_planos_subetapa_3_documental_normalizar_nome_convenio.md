# Convênios e Planos — Subetapa 3 — Análise documental do helper normalizarNomeConvenio

## 1. Objetivo da análise documental

Esta subetapa documenta, de forma estreita e conservadora, o helper `normalizarNomeConvenio()` do módulo Convênios e Planos.

O foco é entender a pureza, a relação com `normalizeText()`, as entradas e saídas, os contratos de uso e os riscos de futura delegação, sem alterar qualquer arquivo funcional e sem tocar em evento, clique, duplo clique, renderização, modais, payload, salvamento, exclusão, API, backend, banco ou schema.

## 2. Base documental consultada

Documentos lidos nesta análise:

- `docs/convenios_planos_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_1_documental_normalize_text.md`
- `docs/convenios_planos_subetapa_2_documental_normalizar_codigo_registro.md`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Onde `normalizarNomeConvenio()` está definido

`normalizarNomeConvenio()` está definido em:

- `frontend/js/modules/convenios-planos.js`

Ele faz parte do namespace passivo do módulo Convênios e Planos.

## 4. Assinatura atual da função

A assinatura atual é:

```javascript
function normalizarNomeConvenio(valor)
```

## 5. Lógica atual da função

Em termos funcionais, a função:

- recebe um valor;
- encaminha esse valor para `normalizeText()`;
- retorna o resultado dessa normalização textual.

Não há lógica adicional de negócio, não há leitura de DOM e não há mutação de estado.

## 6. Se `normalizarNomeConvenio()` depende diretamente de `normalizeText()`

Sim.

A dependência é direta e explícita:

- `normalizarNomeConvenio(valor)` chama `normalizeText(valor)`.

## 7. Entradas esperadas

A função espera qualquer valor que possa ser convertido para texto pela normalização base, por exemplo:

- nome digitado pelo usuário;
- nome vazio;
- `null`;
- `undefined`;
- número;
- string com espaços extras;
- string já normalizada.

## 8. Saídas retornadas

Retorna sempre uma string normalizada.

Em termos práticos, o resultado segue o comportamento de `normalizeText()`:

- texto aparado;
- espaços múltiplos comprimidos;
- string vazia quando a entrada for nula, indefinida ou composta só por espaços.

## 9. Como trata valores nulos, vazios, indefinidos, numéricos ou não-string

O tratamento é herdado diretamente de `normalizeText()`:

- `null` e `undefined` viram string vazia antes da normalização;
- valores vazios ou só com espaços resultam em string vazia depois do `trim()`;
- números e outros tipos são convertidos para string;
- qualquer string resultante sofre compactação de espaços em branco.

## 10. Altera DOM

Não.

`normalizarNomeConvenio()` não acessa `document`, não busca elementos e não altera interface.

## 11. Altera estado global

Não.

A função não escreve em variáveis globais, não muda seleção, não altera flags e não interfere no estado do módulo.

## 12. Lê ou altera cache global

Não.

Ela não consulta caches e não grava caches.

## 13. Chama API / `requestJson`

Não.

Não há chamada de rede, `fetch` ou `requestJson`.

## 14. Monta payload

Não diretamente.

A função não cria payload sozinha. Ela apenas normaliza um valor que pode depois ser incluído em payload por outra rotina.

## 15. Salva dados

Não.

Ela não grava em backend, não persiste dados e não executa `POST`, `PUT` ou qualquer operação equivalente.

## 16. Exclui dados

Não.

Não há exclusão, confirmação ou ação equivalente.

## 17. Altera vínculo entre convênio e plano

Não.

`normalizarNomeConvenio()` não conhece relações de negócio, `row_id`, convênio, plano ou filtros.

## 18. Altera paciente

Não.

Não há consumo de dados de paciente, ficha ou caches clínicos.

## 19. Altera procedimento

Não.

Não há relação com procedimentos, tratamentos ou materiais.

## 20. Altera tabela, preço, custo, reajuste ou financeiro

Não.

A função não toca tabela de preços, custos, reajustes, repasses, financeiro ou calendário de faturamento.

## 21. Depende de evento, clique ou duplo clique

Não.

Ela não usa evento, clique, `dblclick` ou heurística de segundo clique rápido.

## 22. Depende de renderização

Não.

Ela não monta HTML, não recria `tbody` e não depende de renderização.

## 23. Depende de modal

Não.

Não abre, fecha ou valida modal.

## 24. Altera texto visível

Não diretamente.

Como `normalizeText()`, ela não escreve na interface. Seu efeito é indireto, porque o nome normalizado pode depois ser exibido ou salvo por outras rotinas.

## 25. Se ela pode afetar validações de nome de convênio

Sim.

Ela é a base textual usada pelas validações locais do módulo para nome de convênio:

- `validarNomeConvenio()`

Também é usada em fluxo de payload:

- `convPlanConvenioPayloadV2()` usa `convPlanNormalizarNomeConvenioLocal(...)` para o campo `nome`.

Isso significa que qualquer mudança futura em `normalizarNomeConvenio()` pode impactar tanto a validação quanto o nome persistido.

## 26. Se ela tem relação direta ou indireta com `validarNomeConvenio()`

Sim, de forma direta e em cadeia.

Dependência direta no módulo passivo:

- `validarNomeConvenio(valor)` chama `normalizarNomeConvenio(valor)`.

Dependência em cadeia:

- `validarNomeConvenio(valor)` depende do resultado normalizado para decidir se o nome está presente.

## 27. Funções ou helpers que dependem dela dentro de `frontend/js/modules/convenios-planos.js`

Dependência direta identificada:

- `validarNomeConvenio(valor)` depende de `normalizarNomeConvenio(valor)`

Dependência em cadeia:

- `helpers.validarNomeConvenio` expõe essa cadeia ao namespace passivo

Dependência no `app.js` via wrapper/fallback:

- `convPlanNormalizarNomeConvenioLocal(valor)` tenta usar o helper exposto pelo namespace passivo;
- `convPlanConvenioPayloadV2()` usa esse wrapper para o campo `nome`.

## 28. Se `frontend/app.js` chama diretamente `normalizarNomeConvenio()` ou apenas helpers/wrappers expostos pelo namespace

O `frontend/app.js` não chama `normalizarNomeConvenio()` diretamente.

Ele chama a cadeia via wrapper/fallback:

- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`

Esses wrappers procuram `window.BranaConveniosPlanosModule?.helpers.normalizarNomeConvenio`.

## 29. Se já há wrapper/fallback no `app.js` relacionado à normalização ou validação de nome de convênio

Sim.

Existe um wrapper/fallback explícito para a normalização do nome de convênio:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`

Esse padrão protege o app contra ausência do namespace ou indisponibilidade do helper exposto.

## 30. Risco de regressão funcional ao futuramente delegar ou consolidar esse helper

Existe risco, mas ele é controlável.

Pontos de atenção:

- `normalizarNomeConvenio()` parece simples, mas influencia o nome persistido e validado do convênio;
- mudanças pequenas em trim ou compressão de espaços podem alterar o texto salvo;
- o `app.js` já usa fallback local para proteger o comportamento atual;
- qualquer delegação futura deve preservar a semântica exata.

Conclusão:

- o risco é menor do que o de eventos, modais, renderização ou duplo clique;
- ainda assim, é um ponto de cadastro e payload e precisa ser tratado com cuidado.

## 31. Risco textual / mojibake

Existe risco textual no módulo como contexto geral, porque o namespace passivo contém strings visíveis com mojibake em mensagens de validação.

Para `normalizarNomeConvenio()`:

- não há geração direta de texto de interface;
- o helper não corrige nem produz mojibake;
- a blindagem textual continua obrigatória;
- nenhuma correção textual foi aplicada nesta subetapa.

## 32. Risco relacionado ao histórico de duplo clique

O histórico de duplo clique é sensível no módulo, mas `normalizarNomeConvenio()` não participa disso.

Relação prática:

- nenhuma;
- o helper não lê clique, não registra eventos e não integra heurística de segundo clique rápido;
- o risco de duplo clique permanece no módulo como um todo, mas não é causado por esse helper.

## 33. Risco por ser uma função textual usada em cadastro, validação ou payload

Sim, existe risco moderado por esse motivo.

Mesmo sendo pura, ela faz parte de um caminho funcional que alcança:

- validação de nome de convênio;
- payload de convênio;
- campos de cadastro já consumidos por outros fluxos.

Isso não a torna sensível no sentido de DOM/evento, mas torna a consolidação futura algo que precisa ser preservado com exatidão.

## 34. Classificação de pureza

**Puro**

Motivo:

- não usa DOM;
- não usa cache global;
- não altera estado;
- não chama API/requestJson;
- não salva;
- não exclui;
- não monta payload sensível diretamente;
- não mexe em vínculo convênio/plano;
- não mexe em paciente;
- não mexe em procedimento;
- não mexe em tabela/preço/reajuste/custo/financeiro;
- não depende de evento, clique, duplo clique ou renderização;
- não altera strings visíveis diretamente.

## 35. Recomendação final

**Avançar futuramente para delegação controlada**

Justificativa:

- a pureza do helper foi confirmada;
- a dependência de `normalizeText()` está clara e simples;
- `validarNomeConvenio()` já depende dele em cadeia direta;
- o `app.js` já possui fallback local compatível;
- a futura consolidação pode ser feita com baixo risco se a semântica for preservada.

## 36. Próxima etapa recomendada

Próxima etapa documental sugerida:

- analisar `validarNomeConvenio()` antes, porque ela é a próxima peça de negócio da cadeia;
- alternativamente, analisar `normalizarNomePlano()` se a intenção for manter a sequência textual do cadastro;
- se preferir seguir a trilha de validação, analisar `validarNomePlano()` depois.

Essa próxima etapa deve continuar sem tocar em evento, clique, renderização, modais, payload, salvamento, exclusão, API ou backend.

## 37. Fechamento

Esta análise é exclusivamente documental.

Nenhum arquivo funcional foi alterado, e nenhuma correção textual foi aplicada.
