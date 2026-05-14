# Subetapa 0 - Mapeamento monolítico de Etiquetas / Configuração de modelos de etiqueta

## 1. Contexto

Esta etapa é exclusivamente documental e faz parte da modularização segura do projeto Brana Cloud.

Registros de contexto:

- branch esperada: `modularizacao-segura-fase-1`
- baseline funcional conhecido: `38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares`
- HEAD documental atual da branch: `1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos`
- módulo escolhido: `Etiquetas / Configuração de modelos de etiqueta`
- motivo da escolha: fronteiras mais claras e risco relativo menor do que `Anamnese`, `Símbolos gráficos`, `Prestadores`, `Convênios e planos`, `Materiais`, `Procedimentos`, `Procedimentos genéricos`, `Índices financeiros`, `Agenda` e `Editor de textos`

## 2. Comandos iniciais executados

### `git branch --show-current`

```text
modularizacao-segura-fase-1
```

### `git status --short`

```text
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
```

Observação: a pendência documental pré-existente `docs/recomendacao_proximo_modulo_pos_auxiliares.md` foi registrada e mantida como estava.

### `git diff --stat`

```text
```

### `git log --oneline -10`

```text
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
795c664 Usa helper modular de status em Unidades com fallback
```

## 3. Arquivos lidos

Documentos obrigatórios encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos obrigatórios ausentes:

- nenhum

## 4. Arquivos de código analisados

- `frontend/app.js`
- `frontend/index.html`

## 5. Localização do módulo no app.js

O módulo aparece no monólito em pontos bem definidos:

- menu: `frontend/index.html:2649` com `data-menu-action="config-etiquetas"`
- dispatcher: `frontend/app.js:22920-22921` chamando `etqAbrir()`
- bloco funcional principal: `frontend/app.js:1761-2092` aproximadamente
- preferências relacionadas: `frontend/app.js:2098`, `2126`, `2418`, `2557`, `2691`
- criação dinâmica dos backdrops e modal: `frontend/app.js:2056-2063`

## 6. Função principal de abertura

Função principal identificada:

- `etqAbrir()`

## 7. Funções relacionadas

### Abertura / fechamento

- `etqEnsureUI()`
- `etqAbrir()`
- `etqFecharModal()`

### Renderização / montagem visual

- `etqRender()`
- `etqRenderCombos()`
- `etqSyncPreview()`

### Carregamento de lista / dados

- `etqCarregarDados()`

### Seleção

- `etqSelecionarLinha(tr)`
- `etqSelecionado()`

### Criação / edição / persistência

- `etqAbrirModal(modo)`
- `etqAplicarPadraoSelecionado()`
- `etqFixarPadraoUser()`
- `etqSalvarModal()`

### Exclusão

- `etqExcluirSelecionado()`

### Impressão / preview / modelo

- `etqNumero(valor, padrao)`
- `etqFormatNumero(valor)`
- `etqArquivosOrdenados()`
- `etqResolverArquivoPadrao(padraoId)`
- `etqLayoutFromItem(item)`
- `etqTesteImprimir()`

### Binds / eventos

- os binds são centralizados em `etqEnsureUI()`

### Helpers internos

- `etqNumero(valor, padrao)`
- `etqFormatNumero(valor)`

## 8. Fluxo funcional observado

Fluxo atual observado:

1. O menu `Etiquetas...` aciona `config-etiquetas`.
2. O dispatcher chama `etqAbrir()`.
3. `etqAbrir()` garante a criação da UI via `etqEnsureUI()`.
4. `etqCarregarDados()` busca padrões, arquivos e modelos.
5. `etqRender()` monta a tabela com os modelos carregados.
6. O backdrop principal é exibido.
7. A seleção de uma linha atualiza `selectedId`.
8. `Novo modelo...` e `Altera...` abrem o modal de edição.
9. `etqSalvarModal()` valida campos, monta payload e faz POST/PUT.
10. `Elimina` confirma e faz DELETE.
11. `Teste` abre uma janela temporária e renderiza o layout de impressão local.
12. O painel e o modal podem ser fechados e reabertos sem sair do shell.

Fluxo de impressão / preview:

- `etqSyncPreview()` recalcula o preview visual dentro da modal de edição.
- `etqTesteImprimir()` gera uma página HTML local em janela nova e dispara `print()`.

## 9. Estado, variáveis globais e caches

O estado central do módulo está concentrado em `etqCfg`.

Campos relevantes observados:

- `backdrop`
- `modal`
- `tbody`
- `total`
- `btnNovo`
- `btnEditar`
- `btnExcluir`
- `btnTeste`
- `btnFechar`
- `editBackdrop`
- `editModal`
- `editTitle`
- `editNome`
- `editArquivo`
- `editPadrao`
- `editMargemEsq`
- `editMargemSup`
- `editEspH`
- `editEspV`
- `editColunas`
- `editLinhas`
- `editPreview`
- `editOk`
- `editCancel`
- `padroes`
- `arquivos`
- `modelos`
- `selectedId`
- `editMode`
- `editId`

Outros estados relacionados:

- `ETQ_PADRAO_ARQUIVO_MAP` como tabela de referência para resolver arquivo padrão
- seleção de item em `selectedId`
- caches de listas carregadas em `padroes`, `arquivos` e `modelos`

## 10. DOM, IDs e seletores

Elementos e seletores usados:

- menu: `button[data-menu-action="config-etiquetas"]`
- backdrop principal: `#config-etiquetas-backdrop`
- modal principal: `.etq-modal`
- barra de ações: `.etq-toolbar`
- botão novo: `#etq-btn-novo`
- botão altera: `#etq-btn-editar`
- botão elimina: `#etq-btn-excluir`
- botão teste: `#etq-btn-teste`
- botão fecha: `#etq-btn-fechar`
- grade: `.etq-grid`
- corpo da tabela: `#etq-tbody`
- totalizador: `#etq-total`
- backdrop de edição: `#config-etiquetas-edit-backdrop`
- modal de edição: `.etq-edit-modal`
- grid de edição: `.etq-edit-grid`
- campos: `#etq-edit-nome`, `#etq-edit-arquivo`, `#etq-edit-padrao`, `#etq-edit-m-esq`, `#etq-edit-m-sup`, `#etq-edit-esp-h`, `#etq-edit-esp-v`, `#etq-edit-col`, `#etq-edit-lin`
- preview: `#etq-preview-grid`
- botões do modal: `#etq-edit-ok`, `#etq-edit-cancel`
- classes internas do preview/linha:
  - `.etq-preview-frame`
  - `.etq-preview-box`
  - `.etq-edit-row`
  - `.etq-edit-row.dual`
  - `.etq-edit-row.full`
  - `.etq-edit-row.line`
  - `.etq-edit-actions`
  - `.etq-footer`

## 11. Eventos e binds

Eventos e binds observados:

- clique no botão `Novo modelo...`
- clique no botão `Altera...`
- clique no botão `Elimina`
- clique no botão `Teste`
- clique no botão `Fecha`
- clique no botão `Ok` do modal de edição
- clique no botão `Cancela` do modal de edição
- `change` em `#etq-edit-padrao`
- `change` em `#etq-edit-arquivo`
- `input` nos campos numéricos do modal de edição
- clique no backdrop principal para fechar
- clique no backdrop de edição para fechar
- ativação de grade via `bindStandardGridActivation(etqCfg.tbody, etqSelecionarLinha, ()=>etqAbrirModal("editar"))`

O duplo clique não aparece como handler manual explícito, mas a ativação da grade é delegada ao helper `bindStandardGridActivation`.

## 12. Endpoints/API

| Endpoint | Método | Função que chama | Finalidade | Payload / retorno aparente |
|---|---|---|---|---|
| `/config/etiquetas/padroes` | GET | `etqCarregarDados()` | Carregar padrões de etiqueta | retorno esperado: `{ padroes: [...] }` |
| `/config/etiquetas/arquivos` | GET | `etqCarregarDados()` | Carregar arquivos/modelos de impressão | retorno esperado: `{ arquivos: [...] }` |
| `/config/etiquetas/modelos` | GET | `etqCarregarDados()` | Carregar modelos cadastrados | retorno esperado: `{ modelos: [...] }` |
| `/config/etiquetas/modelos` | POST | `etqSalvarModal()` | Criar modelo de etiqueta | payload: `nome`, `padrao_id`, `modelo_documento_id`, `margem_esq`, `margem_sup`, `esp_horizontal`, `esp_vertical`, `nro_colunas`, `nro_linhas` |
| `/config/etiquetas/modelos/{id}` | PUT | `etqSalvarModal()` | Editar modelo de etiqueta | mesmo payload do POST |
| `/config/etiquetas/modelos/{id}` | DELETE | `etqExcluirSelecionado()` | Eliminar modelo de etiqueta | sem payload aparente |

Seus retornos aparentes incluem campos usados pela renderização:

- `item.id`
- `item.nome`
- `item.nome_arquivo`
- `item.padrao_nome`
- `item.reservado`
- `item.modelo_documento_id`
- `item.padrao_id`
- `item.margem_esq`
- `item.margem_sup`
- `item.esp_horizontal`
- `item.esp_vertical`
- `item.nro_colunas`
- `item.nro_linhas`

## 13. Dependências compartilhadas

Dependências compartilhadas observadas:

- `requestJson`
- `esc`
- `ensureModalChrome`
- `bindStandardGridActivation`
- `window.alert`
- `window.confirm`
- `window.open`
- `footerMsg`
- `sessaoAtual`
- `menuActionAccessLevel`
- `menuActionModule`
- `closeModalByBackdropId`
- `modalTitleByBackdropId`
- `modalInsetsById`
- `prefRenderCombosModelos`
- `prefColetarPayloadModelos`

Dependências de shell / menu / layout:

- o menu `Etiquetas...` está no shell principal
- o dispatcher chama `etqAbrir()`
- o menu-action `config-etiquetas` é classificado no override de permissões do shell
- o modal/backdrop usa entradas próprias em `modalTitleByBackdropId` e `modalInsetsById`
- o bloco é montado dinamicamente por `etqEnsureUI()`

Dependências de preferências:

- `prefRenderCombosModelos()` popula o combo `pref-modelo-etiqueta`
- `prefColetarPayloadModelos()` persiste `modelo_padrao_etiquetas_id`

Dependências de impressão/modelos:

- `etqTesteImprimir()`
- `window.open()`
- `print()`

## 14. Candidatos a helpers puros

Helpers realmente seguros identificados nesta Subetapa 0:

| Candidato | Responsabilidade | Entrada esperada | Saída esperada | Por que parece seguro | Riscos |
|---|---|---|---|---|---|
| `etqNumero(valor, padrao)` | Converter texto/valor para número com fallback | qualquer valor + fallback numérico | número ou fallback | puro, parametrizado, sem DOM, sem estado global, sem fetch | baixo; depende apenas do comportamento de `Number()` e substituição de vírgula |
| `etqFormatNumero(valor)` | Formatar número em string com duas casas e vírgula | valor numérico | string formatada ou vazio | puro, parametrizado, sem DOM, sem estado global, sem fetch | baixo; apenas formatação |
| `etqLayoutFromItem(item)` | Calcular layout de impressão de um modelo de etiqueta | objeto do modelo | objeto com dimensões e posições | puro, sem DOM e sem chamadas externas | moderado apenas se o contrato do item mudar; hoje parece estável |

Outros trechos relacionados a arquivos/padrões ou preview não foram considerados seguros nesta Subetapa 0, porque dependem de estado do módulo ou de DOM.

## 15. O que NÃO mover por enquanto

Trechos que devem permanecer no `app.js` nas próximas subetapas:

- `etqEnsureUI()`
- `etqAbrir()`
- `etqCarregarDados()`
- `etqRender()`
- `etqSelecionarLinha()`
- `etqSelecionado()`
- `etqAbrirModal()`
- `etqAplicarPadraoSelecionado()`
- `etqFixarPadraoUser()`
- `etqSyncPreview()`
- `etqSalvarModal()`
- `etqExcluirSelecionado()`
- `etqFecharModal()`
- `etqTesteImprimir()`
- os binds instalados em `etqEnsureUI()`
- o bloco de criação dos backdrops/modais
- a integração com preferências em `prefRenderCombosModelos()` e `prefColetarPayloadModelos()`

Atenção especial:

- abertura principal do painel
- binds
- chamadas de API
- persistência
- exclusão
- manipulação direta de DOM
- modais
- impressão / preview
- comunicação indireta com preferências

## 16. Riscos específicos

Riscos técnicos observados:

- acoplamento com `app.js` ainda alto porque o painel é criado dinamicamente no próprio arquivo
- dependência de DOM criado em runtime por `etqEnsureUI()`
- risco de quebra de bind se a montagem do backdrop mudar
- risco de item selecionado/caches em `etqCfg.modelos`
- risco em salvar/excluir por uso de `requestJson`
- risco de endpoints não mapeados se o contrato do backend mudar
- risco de impressão/preview/modelos por uso de `window.open()` e `print()`
- risco de nomes parecidos com outros módulos porque há integração com preferências via `pref-modelo-etiqueta`
- risco de encoding/textos acentuados já visível em alguns rótulos do HTML gerado

Acoplamento com outros módulos:

- não identifiquei acoplamento direto com pacientes ou odontograma
- o principal acoplamento externo observado é com Preferências, via modelos padrão de etiquetas

## 17. Recomendação conservadora para Subetapa 1

Recomendação conservadora:

Criar futuramente `frontend/js/modules/etiquetas.js` como namespace passivo/controlado.

Na Subetapa 1, permitir apenas:

- criar `window.BranaEtiquetasModule`
- expor `getInfo()`
- expor `getStatus()`
- opcionalmente expor constantes informativas/documentais
- carregar o script no `frontend/index.html` antes do `app.js`

Na Subetapa 1, não permitir:

- mover funções do `app.js`
- delegar comportamento
- alterar abertura do painel
- alterar carregamento de lista
- alterar edição
- alterar salvamento
- alterar exclusão
- alterar endpoints
- criar wrappers funcionais
- mexer em backend ou banco

## 18. Onde testar antes de avançar

1. Abrir o sistema no navegador com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta` no menu.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edição.
7. Fechar modal ou painel, se existir.
8. Salvar apenas se for seguro e reversível.
9. Excluir apenas se for seguro e reversível; se não for seguro, não testar exclusão nesta etapa.
10. Fechar e reabrir o painel.
11. Confirmar console sem `ReferenceError` ou `TypeError`.

## 19. Checks finais

### `git status --short`

```text
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
```

### `git diff --stat`

```text
```

### `node --check frontend/app.js`

```text
sem saída (exit code 0)
```

Resultado esperado confirmado:

- apenas pendências documentais aparecem no status
- não houve alteração em `frontend/app.js`
- não houve alteração em `frontend/index.html`
- não houve alteração em backend
- não houve alteração em banco
- não houve alteração em endpoints

## 20. Confirmação final

Confirmo explicitamente:

- nenhum código funcional foi alterado
- `frontend/app.js` não foi alterado
- `frontend/index.html` não foi alterado
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum módulo `frontend/js/modules/etiquetas.js` foi criado
- nenhum namespace passivo foi criado nesta etapa
- nenhum commit foi feito
- a etapa foi somente documental
