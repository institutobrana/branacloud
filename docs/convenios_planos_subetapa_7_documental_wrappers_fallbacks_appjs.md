# Convênios e Planos — Subetapa 7 — Documentação dos wrappers/fallbacks locais no app.js

## 1. Objetivo da documentação
Mapear, em leitura conservadora, os wrappers/fallbacks locais existentes em `frontend/app.js` para os helpers textuais já documentados do módulo Convênios e Planos, sem alterar qualquer comportamento funcional.

## 2. Quais wrappers/fallbacks locais existem no frontend/app.js
Foram identificados os seguintes wrappers/fallbacks locais relacionados aos helpers do módulo:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Não foram encontrados wrappers locais específicos para `validarNomeConvenio()` ou `validarNomePlano()` no trecho analisado.

## 3. Detalhamento de cada wrapper/fallback encontrado

### `convPlanNormalizeTextLocal(valor)`
- Assinatura: `function convPlanNormalizeTextLocal(valor)`
- Helper correspondente no módulo: `normalizeText()`
- Chama `window.BranaConveniosPlanosModule`: não diretamente.
- Possui fallback local: sim, é o fallback local base.
- O fallback replica lógica do módulo: sim, em nível conservador de string, com `String(valor == null ? "" : valor).trim().replace(/\s+/g, " ")`.
- Retorna valor simples ou objeto estruturado: valor simples de texto.
- Retorna mensagem textual: não.
- Há risco textual/mojibake: baixo, porque só normaliza espaços e converte para string; o risco fica nas mensagens visíveis consumidas por camadas superiores.
- Altera DOM: não.
- Altera estado global: não.
- Lê ou altera cache global: não.
- Chama API/requestJson: não.
- Monta payload diretamente: não.
- Salva: não.
- Exclui: não.
- Altera vínculo convênio/plano: não.
- Depende de convênio selecionado: não.
- Altera paciente: não.
- Altera procedimento: não.
- Altera tabela/preço/custo/reajuste/financeiro: não.
- Depende de evento, clique ou duplo clique: não.
- Depende de renderização: não.
- Depende de modal: não.

### `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- Assinatura: `function convPlanNormalizarCampoTextoLocal(valor, helperName)`
- Helper correspondente no módulo: é o wrapper genérico para `normalizeText()`, `normalizarNomeConvenio()`, `normalizarNomePlano()` e `normalizarCodigoRegistro()` conforme `helperName`.
- Chama `window.BranaConveniosPlanosModule`: sim, consulta `window.BranaConveniosPlanosModule?.helpers`.
- Possui fallback local: sim.
- O fallback replica lógica do módulo: sim, retorna `convPlanNormalizeTextLocal(valor)` quando o helper do módulo não existe, falha ou não retorna string.
- Retorna valor simples ou objeto estruturado: valor simples de texto.
- Retorna mensagem textual: não.
- Há risco textual/mojibake: baixo no wrapper em si; o risco fica no conteúdo textual que pode ser consumido por validadores e payloads.
- Altera DOM: não.
- Altera estado global: não.
- Lê ou altera cache global: não.
- Chama API/requestJson: não.
- Monta payload diretamente: não.
- Salva: não.
- Exclui: não.
- Altera vínculo convênio/plano: não.
- Depende de convênio selecionado: não diretamente.
- Altera paciente: não.
- Altera procedimento: não.
- Altera tabela/preço/custo/reajuste/financeiro: não.
- Depende de evento, clique ou duplo clique: não.
- Depende de renderização: não.
- Depende de modal: não.

### `convPlanNormalizarNomeConvenioLocal(valor)`
- Assinatura: `function convPlanNormalizarNomeConvenioLocal(valor)`
- Helper correspondente no módulo: `normalizarNomeConvenio()`
- Chama `window.BranaConveniosPlanosModule`: indiretamente, via `convPlanNormalizarCampoTextoLocal`.
- Possui fallback local: sim, herda o fallback de `convPlanNormalizarCampoTextoLocal`.
- O fallback replica lógica do módulo: sim, cai para a normalização base local quando necessário.
- Retorna valor simples ou objeto estruturado: valor simples de texto.
- Retorna mensagem textual: não.
- Há risco textual/mojibake: baixo no wrapper em si; o risco maior está na validação e nas mensagens consumidas depois.
- Altera DOM: não.
- Altera estado global: não.
- Lê ou altera cache global: não.
- Chama API/requestJson: não.
- Monta payload diretamente: não.
- Salva: não.
- Exclui: não.
- Altera vínculo convênio/plano: não.
- Depende de convênio selecionado: não diretamente.
- Altera paciente: não.
- Altera procedimento: não.
- Altera tabela/preço/custo/reajuste/financeiro: não.
- Depende de evento, clique ou duplo clique: não.
- Depende de renderização: não.
- Depende de modal: não.

### `convPlanNormalizarNomePlanoLocal(valor)`
- Assinatura: `function convPlanNormalizarNomePlanoLocal(valor)`
- Helper correspondente no módulo: `normalizarNomePlano()`
- Chama `window.BranaConveniosPlanosModule`: indiretamente, via `convPlanNormalizarCampoTextoLocal`.
- Possui fallback local: sim.
- O fallback replica lógica do módulo: sim, cai para a normalização base local quando necessário.
- Retorna valor simples ou objeto estruturado: valor simples de texto.
- Retorna mensagem textual: não.
- Há risco textual/mojibake: baixo no wrapper em si; o risco maior está na cadeia de cadastro/validação que consome esse valor.
- Altera DOM: não.
- Altera estado global: não.
- Lê ou altera cache global: não.
- Chama API/requestJson: não.
- Monta payload diretamente: não.
- Salva: não.
- Exclui: não.
- Altera vínculo convênio/plano: não.
- Depende de convênio selecionado: não diretamente.
- Altera paciente: não.
- Altera procedimento: não.
- Altera tabela/preço/custo/reajuste/financeiro: não.
- Depende de evento, clique ou duplo clique: não.
- Depende de renderização: não.
- Depende de modal: não.

### `convPlanNormalizarCodigoRegistroLocal(valor)`
- Assinatura: `function convPlanNormalizarCodigoRegistroLocal(valor)`
- Helper correspondente no módulo: `normalizarCodigoRegistro()`
- Chama `window.BranaConveniosPlanosModule`: indiretamente, via `convPlanNormalizarCampoTextoLocal`.
- Possui fallback local: sim.
- O fallback replica lógica do módulo: sim, cai para a normalização base local quando necessário.
- Retorna valor simples ou objeto estruturado: valor simples de texto.
- Retorna mensagem textual: não.
- Há risco textual/mojibake: baixo no wrapper em si; o risco maior está na cadeia de cadastro que usa códigos e nomes juntos.
- Altera DOM: não.
- Altera estado global: não.
- Lê ou altera cache global: não.
- Chama API/requestJson: não.
- Monta payload diretamente: não.
- Salva: não.
- Exclui: não.
- Altera vínculo convênio/plano: não.
- Depende de convênio selecionado: não diretamente.
- Altera paciente: não.
- Altera procedimento: não.
- Altera tabela/preço/custo/reajuste/financeiro: não.
- Depende de evento, clique ou duplo clique: não.
- Depende de renderização: não.
- Depende de modal: não.

## 4. Quais funções de payload consomem esses wrappers/fallbacks
As funções de payload observadas são:

- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`

Elas consomem os wrappers locais para normalização dos campos textuais antes de montar o objeto final.

## 5. Se convPlanConvenioPayloadV2() consome wrappers de convênio
Sim. Ela consome:

- `convPlanNormalizarCodigoRegistroLocal()`
- `convPlanNormalizarNomeConvenioLocal()`

## 6. Se convPlanPlanoPayloadV2() consome wrappers de plano
Sim. Ela consome:

- `convPlanNormalizarCodigoRegistroLocal()`
- `convPlanNormalizarNomePlanoLocal()`

## 7. Se há consumo direto dos helpers do módulo fora dos wrappers
Não foi identificado consumo direto dos helpers do módulo fora dos wrappers locais em `app.js`. O consumo observado ocorre via `convPlanNormalizarCampoTextoLocal(...)`.

## 8. Se existe duplicação de lógica entre app.js e frontend/js/modules/convenios-planos.js
Sim. Há duplicação conservadora de normalização textual entre o módulo e o `app.js`, especialmente no fallback base de texto.

## 9. Se a duplicação é intencional como fallback conservador
Sim. O desenho atual mostra duplicação intencional para manter continuidade funcional caso o namespace do módulo não esteja disponível ou retorne algo inesperado.

## 10. Se uma futura delegação controlada deveria manter fallback local
Sim. A leitura atual indica que o fallback local é parte do desenho defensivo e deve ser preservado em qualquer delegação controlada.

## 11. Se uma futura delegação controlada deveria alterar somente wrappers e não payload/salvamento
Sim. A alteração segura futura, se vier a ocorrer, deve ficar restrita aos wrappers/fallbacks, sem tocar em payload real, salvamento, exclusão, eventos, seleção, renderização ou modal.

## 12. Quais wrappers são candidatos a uma futura integração funcional mínima
Como leitura documental, os candidatos mais naturais seriam:

- `convPlanNormalizarNomeConvenioLocal`
- `convPlanNormalizarNomePlanoLocal`
- `convPlanNormalizarCodigoRegistroLocal`

Todos já operam como integração mínima conservadora via fallback.

## 13. Quais wrappers NÃO devem ser alterados ainda
Não devem ser alterados nesta fase:

- `convPlanNormalizarCampoTextoLocal`
- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`

Também não devem ser alterados os fluxos de evento, clique, duplo clique, seleção, modais ou renderização.

## 14. Riscos específicos envolvendo payload de convênio
O principal risco é que qualquer mudança de wrapper altere o conteúdo final de `convPlanConvenioPayloadV2()`, especialmente nomes e códigos normalizados.

## 15. Riscos específicos envolvendo payload de plano
O risco principal é que mudanças nos wrappers alterem o objeto retornado por `convPlanPlanoPayloadV2()`, afetando o cadastro do plano vinculado ao convênio selecionado.

## 16. Riscos específicos envolvendo convênio selecionado e vínculo convênio/plano
O risco é indireto, mas sensível: o payload do plano depende do convênio selecionado, então uma mudança no wrapper pode refletir em uma etapa de salvamento que já é dependente do vínculo funcional.

## 17. Riscos específicos envolvendo mensagens textuais de validação
Não há wrappers de validação direta aqui, mas os wrappers alimentam validadores e payloads que podem resultar em mensagens textuais. O risco é documental e deve ser preservado sem correção de string.

## 18. Riscos específicos envolvendo duplo clique
Não foi identificado vínculo direto entre esses wrappers e a heurística de duplo clique. O risco do histórico de duplo clique permanece fora destes wrappers.

## 19. Riscos específicos envolvendo renderização
Não foi identificado vínculo direto com renderização. O risco é baixo nessa camada.

## 20. Riscos específicos envolvendo modais
Os wrappers não manipulam modais diretamente, então o risco aqui é indireto via payloads usados por ações de modal.

## 21. Se há relação com pacientes
Não há relação direta.

## 22. Se há relação com procedimentos
Não há relação direta.

## 23. Se há relação com tabelas, preços, custos, reajustes ou financeiro
Não há relação direta.

## 24. Se há relação com backend/API/banco
Não diretamente nos wrappers, mas o resultado deles alimenta payloads que depois seguem para APIs e persistência. Portanto, a relação é indireta.

## 25. Classificação da segurança para futura integração
`segura para wrapper mínimo`

## 26. Recomendação final
`avançar para integração funcional mínima de um wrapper específico`

## 27. Próxima etapa recomendada
Se houver etapa seguinte, ela deve focar em um wrapper isolado e manter o fallback local, sem tocar em payload real, salvamento, exclusão, eventos, clique, duplo clique, seleção, renderização, modais ou vínculo convênio/plano.

## Observações de segurança
- Esta análise não alterou código.
- Não houve mudança em DOM, eventos, clique, duplo clique, renderização, modal, payload, salvamento, exclusão, backend ou banco.
- Qualquer mensagem textual observada deve ser tratada apenas como risco documental, sem correção nesta etapa.
