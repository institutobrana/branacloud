# Convênios e Planos - Subetapa 3 - Helpers puros

## 1. Contexto

Esta Subetapa 3 é somente documental e de helpers puros.
O objetivo é adicionar helpers textuais simples e previsíveis ao namespace passivo de `Convênios e Planos`, sem integrar nada ao `frontend/app.js`.

## 2. Arquivos alterados

- `frontend/js/modules/convenios-planos.js`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`

## 3. Confirmacao de passividade

O namespace `window.BranaConveniosPlanosModule` continua passivo, com:

- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`

Os helpers foram adicionados apenas como utilitários puros para uso futuro.

## 4. Helpers criados

### `normalizarNomeConvenio(valor)`

- Entrada: qualquer valor.
- Saída: string.
- Regras:
  - `null`/`undefined` viram string vazia;
  - aplica `trim`;
  - reduz múltiplos espaços internos para um espaço;
  - não altera acentos;
  - não altera caixa.

### `validarNomeConvenio(valor)`

- Entrada: qualquer valor.
- Saída: objeto previsível.
- Formato:
  - `{ ok: boolean, valor: string, motivo: string }`
- Regras:
  - usa `normalizarNomeConvenio` internamente;
  - inválido somente quando o nome normalizado fica vazio.

### `normalizarNomePlano(valor)`

- Entrada: qualquer valor.
- Saída: string.
- Regras:
  - `null`/`undefined` viram string vazia;
  - aplica `trim`;
  - reduz múltiplos espaços internos para um espaço;
  - não altera acentos;
  - não altera caixa.

### `validarNomePlano(valor)`

- Entrada: qualquer valor.
- Saída: objeto previsível.
- Formato:
  - `{ ok: boolean, valor: string, motivo: string }`
- Regras:
  - usa `normalizarNomePlano` internamente;
  - inválido somente quando o nome normalizado fica vazio.

### `normalizarCodigoRegistro(valor)`

- Entrada: qualquer valor.
- Saída: string.
- Regras:
  - `null`/`undefined` viram string vazia;
  - aplica `trim`;
  - reduz múltiplos espaços internos para um espaço;
  - não remove caracteres;
  - não altera caixa;
  - não aplica máscara.

## 5. Regras de pureza

Os helpers foram criados para serem puros e previsíveis:

- não acessam DOM;
- não usam `document`;
- não usam `querySelector`;
- não usam `fetch`;
- não usam `requestJson`;
- não criam eventos;
- não dependem de estado global mutável;
- não alteram `convPlanCfg`, caches ou seleções;
- não alteram payloads;
- não chamam endpoints;
- não alteram comportamento funcional.

## 6. O que explicitamente não foi feito

Não foram criados nesta etapa:

- helpers de cobertura;
- helpers de carência;
- helpers de payload;
- helpers de endpoint;
- helpers de renderização;
- helpers de status visual dependentes de HTML/CSS/DOM;
- helpers de seleção;
- helpers de calendário de faturamento;
- helpers de modal;
- helpers de eventos;
- wrappers no `app.js`.

## 7. Confirmação sobre o `app.js`

Os helpers ainda não são usados pelo `frontend/app.js`.
O `frontend/app.js` continua sendo a fonte funcional da verdade.

## 8. Confirmação sobre DOM, eventos e backend

Nesta etapa não houve:

- DOM;
- `fetch`;
- `requestJson`;
- eventos;
- `bindStandardGridActivation`;
- renderização;
- modais;
- backend;
- banco;
- endpoints.

## 9. Confirmação sobre pastas legadas

Nada foi salvo em:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`

## 10. Próxima etapa recomendada

Próximo passo sugerido: Subetapa 4, apenas se houver teste manual suficiente para justificar integração com fallback local.

## 11. Resumo final

Foram adicionados apenas helpers textuais simples e puros, sem integração com o fluxo funcional do sistema.
