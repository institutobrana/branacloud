# Convênios e Planos — Subetapa 2 — Análise documental do helper normalizarCodigoRegistro

## 1. Objetivo da análise documental

Esta subetapa documenta, de forma estreita e conservadora, o helper puro `normalizarCodigoRegistro()` do módulo Convênios e Planos.

O foco é entender a pureza, a dependência em relação a `normalizeText()`, as entradas e saídas, os contratos de uso e os riscos de futura delegação, sem alterar qualquer arquivo funcional e sem tocar em evento, clique, duplo clique, renderização, modais, payload, salvamento, exclusão, API, backend, banco ou schema.

## 2. Base documental consultada

Documentos lidos nesta análise:

- `docs/convenios_planos_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_1_documental_normalize_text.md`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Onde `normalizarCodigoRegistro()` está definido

`normalizarCodigoRegistro()` está definido em:

- `frontend/js/modules/convenios-planos.js`

Ele faz parte do namespace passivo do módulo Convênios e Planos.

## 4. Assinatura atual da função

A assinatura atual é:

```javascript
function normalizarCodigoRegistro(valor)
```

## 5. Lógica atual da função

Em termos funcionais, a função:

- recebe um valor;
- encaminha esse valor para `normalizeText()`;
- retorna o resultado dessa normalização textual.

Não há lógica de domínio adicional, não há validação própria, não há leitura de DOM e não há mutação de estado.

## 6. Se `normalizarCodigoRegistro()` depende diretamente de `normalizeText()`

Sim.

A dependência é direta e explícita:

- `normalizarCodigoRegistro(valor)` chama `normalizeText(valor)`.

## 7. Entradas esperadas

A função espera qualquer valor que possa ser convertido para texto pela normalização base, por exemplo:

- código digitado pelo usuário;
- código vazio;
- `null`;
- `undefined`;
- número;
- string com espaços extras;
- string com caracteres já normalizados.

## 8. Saídas retornadas

Retorna sempre uma string normalizada.

Em termos práticos, o resultado segue o comportamento de `normalizeText()`:

- texto aparado;
- espaços múltiplos comprimidos;
- string vazia quando a entrada for nula, indefinida ou composta só por espaços.

## 9. Tratamento de valores nulos, vazios, indefinidos, numéricos ou não-string

O tratamento é herdado diretamente de `normalizeText()`:

- `null` e `undefined` viram string vazia antes da normalização;
- valores vazios ou só com espaços resultam em string vazia depois do `trim()`;
- números e outros tipos são convertidos para string;
- qualquer string resultante sofre compactação de espaços em branco.

## 10. Altera DOM

Não.

`normalizarCodigoRegistro()` não acessa `document`, não busca elementos e não altera interface.

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

Ela não grava em backend, não persiste dados e não executa operações de `POST`, `PUT` ou equivalentes.

## 16. Exclui dados

Não.

Não há exclusão, confirmação ou ação equivalente.

## 17. Altera vínculo entre convênio e plano

Não.

`normalizarCodigoRegistro()` não conhece relações de negócio, `row_id`, convênio, plano ou filtros.

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

Como `normalizeText()`, ela não escreve na interface. Seu efeito é indireto, porque o código normalizado pode depois ser exibido ou salvo por outras rotinas.

## 25. Pode afetar validações de código/registro de convênio ou plano

Sim.

Ela é usada na cadeia textual do módulo para normalizar códigos de registro antes de validação ou payload:

- `convPlanConvenioPayloadV2()` usa `convPlanNormalizarCodigoRegistroLocal(...)` para `codigo` e `codigo_ans`;
- `convPlanPlanoPayloadV2()` usa `convPlanNormalizarCodigoRegistroLocal(...)` para `codigo`.

Isso significa que qualquer mudança futura em `normalizarCodigoRegistro()` pode impactar o texto persistido de códigos e chaves de registro.

## 26. Funções ou helpers que dependem dela dentro de `frontend/js/modules/convenios-planos.js`

Dependência direta identificada:

- `normalizarCodigoRegistro(valor)` depende de `normalizeText(valor)`

Dependência em cadeia dentro do módulo passivo:

- `helpers.normalizarCodigoRegistro`

Dependência no `app.js` via wrapper/fallback:

- `convPlanNormalizarCodigoRegistroLocal(valor)` tenta usar o helper exposto pelo namespace passivo;
- `convPlanConvenioPayloadV2()` usa esse wrapper para `codigo` e `codigo_ans`;
- `convPlanPlanoPayloadV2()` usa esse wrapper para `codigo`.

## 27. Se `frontend/app.js` chama diretamente `normalizarCodigoRegistro()` ou apenas helpers expostos pelo namespace

O `frontend/app.js` não chama `normalizarCodigoRegistro()` diretamente.

Ele chama a cadeia via wrapper/fallback:

- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Esses wrappers procuram `window.BranaConveniosPlanosModule?.helpers.normalizarCodigoRegistro`.

## 28. Se já há wrapper/fallback no `app.js` relacionado a código/registro

Sim.

Existe um wrapper/fallback explícito para código/registro:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Esse padrão protege o app contra ausência do namespace ou contra indisponibilidade do helper exposto.

## 29. Risco de regressão funcional ao futuramente delegar ou consolidar esse helper

Existe risco, mas ele é controlável.

Pontos de atenção:

- `normalizarCodigoRegistro()` parece simples, mas influencia campos persistidos de código e código ANS;
- mudanças pequenas em trim ou compressão de espaços podem alterar o texto salvo;
- o `app.js` já usa fallback local para proteger o comportamento atual;
- qualquer delegação futura deve preservar a semântica exata.

Conclusão:

- o risco é menor do que o de eventos, modais, renderização ou duplo clique;
- ainda assim, é um ponto de dados persistidos e precisa ser tratado com cuidado.

## 30. Risco textual / mojibake

Existe risco textual no módulo como contexto geral, porque o namespace passivo contém strings visíveis com mojibake em mensagens de validação.

Para `normalizarCodigoRegistro()`:

- não há geração direta de texto de interface;
- o helper não corrige nem produz mojibake;
- a blindagem textual continua obrigatória;
- nenhuma correção textual foi aplicada nesta subetapa.

## 31. Risco relacionado ao histórico de duplo clique

O histórico de duplo clique é sensível no módulo, mas `normalizarCodigoRegistro()` não participa disso.

Relação prática:

- nenhuma;
- não lê clique, não registra evento e não integra heurística de segundo clique rápido;
- o risco de duplo clique permanece no módulo como um todo, mas não é causado por esse helper.

## 32. Classificação de pureza

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

## 33. Recomendação final

**Avançar futuramente para delegação controlada**

Justificativa:

- a pureza do helper foi confirmada;
- a dependência de `normalizeText()` está clara e simples;
- o `app.js` já possui fallback local compatível;
- a futura consolidação pode ser feita com baixo risco se a semântica for preservada.

## 34. Próxima etapa recomendada

Próxima etapa documental sugerida:

- analisar `normalizarNomeConvenio()` antes, por ser o nome de negócio mais exposto;
- alternativamente, analisar `normalizarNomePlano()`;
- se a intenção for seguir a cadeia de validação, analisar as validações (`validarNomeConvenio()` e/ou `validarNomePlano()`) em seguida.

Essa próxima etapa deve continuar sem tocar em evento, clique, renderização, modais, payload, salvamento, exclusão, API ou backend.

## 35. Fechamento

Esta análise é exclusivamente documental.

Nenhum arquivo funcional foi alterado, e nenhuma correção textual foi aplicada.
