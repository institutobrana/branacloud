# Implementacao - prefRenderCombosDados em Preferencias / Configuracoes

## 1. Contexto

- Contrato profundo pos-`prefRenderCombosModelos` concluido.
- Decisao `CONTRATO-A`.
- Recorte recomendado: `prefRenderCombosDados`.
- Modulo comum/core.

## 2. Escopo implementado

- Helper passivo criado no modulo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Delegacao minima em `frontend/app.js`.
- Select de UF da aba `Dados`.
- Fallback local preservado.
- `prefRenderCombosDados` mantido como orquestrador.

## 3. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos_dados.md`

## 4. O que nao foi alterado

- `prefCarregarDados`
- `prefColetarPayload*`
- `prefSalvar*`
- `requestJson`
- `sysOpt*`
- `Odontograma`
- login
- usuarios
- signup
- backend
- banco
- schema/migrations/seeds/endpoints
- permissoes
- seeds
- `frontend/index.html`
- textos/labels

## 5. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`
- `git diff --stat`

## 6. Onde testar no sistema

- Tela `Preferencias`
- Abertura da modal
- Aba `Dados`
- Select de UF
- Fechamento e reabertura
- Reabertura sem salvar
- `Opcoes do Sistema` apenas como nao-regressao visual

## 7. Proxima etapa recomendada

- Validacao manual pos-implementacao do recorte `prefRenderCombosDados`.

## 8. Confirmacoes de escopo

- Codigo alterado somente nos arquivos permitidos.
- `frontend/index.html` nao alterado.
- Backend nao alterado.
- `.env` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Dados de banco nao alterados.
- PostgreSQL 18 nao excluido/desativado.
- Blindagem textual/mojibake respeitada.

## 9. Registro para roadmap

- Implementacao minima de `prefRenderCombosDados` concluida.
- Helper passivo criado/delegado.
- Fallback preservado.
- Proxima etapa recomendada: validacao manual.
- Blindagem textual/mojibake respeitada.
