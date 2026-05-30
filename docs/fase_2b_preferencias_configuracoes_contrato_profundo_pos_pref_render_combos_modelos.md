# Contrato profundo - Preferências / Configurações após prefRenderCombosModelos

## 1. Contexto

- Preferências / Configurações foi consolidada de forma conservadora.
- A decisão anterior foi `DEC-C`.
- `prefRenderCombosModelos` foi validado manualmente.
- O objetivo desta etapa é mapear o próximo recorte sem implementar código.

## 2. Estado consolidado

- Sincronização visual básica da modal validada.
- `prefRenderCombos` validado.
- `prefRenderCombosModelos` validado.
- Helpers delegados ao módulo passivo existente.
- `frontend/app.js` continua mantendo os orquestradores.
- Carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissões e seeds permanecem fora de alteração.

## 3. Mapeamento remanescente

### `frontend/app.js`

- `prefRenderCombosDados()`
- `prefRenderCombosAmbiente()`
- `prefRenderCombosOdontograma()`
- `prefSincronizarUI()`
- `prefCarregarDados()`
- `prefColetarPayload()`
- `prefColetarPayloadModelos()`
- `prefColetarPayloadAmbiente()`
- `prefColetarPayloadDados()`
- `prefColetarPayloadOdontograma()`
- `prefSalvarGeral()`
- `prefSalvarModelos()`
- `prefSalvarAmbiente()`
- `prefSalvarDados()`
- `prefSalvarOdontograma()`
- `prefAbrir()`
- `prefAbrirDialogoFonteAmbiente()`
- `prefRenderListaAmbiente()`
- `prefAplicarPreviewAmbiente()`
- `prefAmbienteSecoesAtuais()`
- `prefAmbienteSecaoAtiva()`
- `prefAmbienteEstiloAtual()`
- `prefAmbienteTextoExemplo()`
- `prefAmbienteDialogoValor()`
- `prefAmbienteEstiloDeDialogo()`

### `frontend/js/modules/preferencias-opcoes-sistema.js`

- `prefRenderSelectOptions()`
- `prefRenderUfOptions()`
- `prefAmbienteRenderLista()`
- `prefAmbienteAplicarPreview()`
- `prefAmbienteMontarPreview()`
- `prefAtualizarTituloModal()`
- `prefSelecionarAbaModal()`
- `prefRenderCombosGeraisModal()`
- `prefRenderCombosModelosModal()`
- helpers puros de estilo/ambiente já consolidados

## 4. Candidatos avaliados

| Candidato | Função/área | Tipo | Risco | Benefício | Decisão |
|---|---|---|---|---|---|
| 1 | `prefRenderCombosDados()` / `prefRenderUfOptions()` | Visual/DOM puro | RISCO-BAIXO | Mantém a Fase 2B avançando em um bloco pequeno e isolado | Candidato seguro |
| 2 | `prefRenderCombosAmbiente()` / `prefRenderListaAmbiente()` | Visual/DOM com estado e callbacks | RISCO-MEDIO | Segue a consolidação da aba Ambiente | Exigir contrato mais específico |
| 3 | `prefRenderCombosOdontograma()` | Visual/DOM com dropdowns e interação | RISCO-MEDIO | Pode consolidar parte da aba Odontograma | Bloqueado por enquanto |
| 4 | `prefSincronizarUI()` como orquestração adicional | Orquestração | RISCO-ALTO | Não separe agora | Bloqueado |

## 5. Decisão do contrato

- CONTRATO-A.

## 6. Recorte recomendado

### Nome

- `prefRenderCombosDados`

### Objetivo

- Extrair ou consolidar a montagem visual/DOM do select de UF da aba `Dados`, mantendo `prefSincronizarUI` como orquestrador.

### Fronteira permitida

- Renderização do select de UF.
- Uso de helper puro/DOM para preencher opções.
- Fallback local equivalente.

### Fronteira proibida

- `prefCarregarDados`
- `prefColetarPayload*`
- `prefSalvar*`
- `requestJson`
- `sysOpt*`
- `Odontograma`
- login
- usuários
- signup
- backend
- banco
- permissões
- seeds

### Arquivos futuros permitidos

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/` de implementação/validação
- `docs/11_roadmap_desenvolvimento.md`

### Arquivos futuros proibidos

- `frontend/index.html`
- backend funcional
- banco/schema/migrations/seeds/endpoints
- `.env`
- PostgreSQL 18

### Funções que não podem ser tocadas

- `prefCarregarDados`
- `prefColetarPayload*`
- `prefSalvar*`
- `sysOpt*`
- qualquer função de gravação, autenticação, permissão ou banco

### Fallback esperado

- Renderização local simples de opções de UF quando o módulo passivo não estiver disponível.

### Checks esperados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`
- validação manual de `Preferencias > Dados`
- reabertura da modal sem salvar
- checagem rápida de `Opções do Sistema` apenas como não-regressão

### Onde testar

- Tela `Preferencias`
- Modal
- Aba `Dados`
- Select de UF
- Fechamento e reabertura
- Reabertura sem salvar

## 7. Se houver necessidade de recuar

- Se o recorte `Dados` começar a encostar em payload, salvamento ou carregamento, a frente deve voltar para matriz comparativa.

## 8. Confirmações de escopo

- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- `.env` não alterado.
- Banco, schema, migrations, seeds e endpoints não alterados.
- PostgreSQL 18 não excluído/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## 9. Registro para roadmap

- Contrato profundo pós-`prefRenderCombosModelos` concluído.
- Candidatos avaliados e risco classificado.
- Decisão: `CONTRATO-A`.
- Recorte recomendado: `prefRenderCombosDados`.
- Blindagem textual/mojibake respeitada.
