# Fase 2B - Preferencias remanescentes - Implementacao minima do preview visual da aba Ambiente

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
  - `docs/11_roadmap_desenvolvimento.md`

## Objetivo da etapa

- Esta etapa implementou a primeira delegacao minima do recorte medio controlado da Fase 2B.
- O foco foi a parte estritamente visual/local do preview da aba Ambiente em Preferencias.
- O fluxo de carregamento, salvamento, `requestJson`, payload e endpoints permaneceu inalterado.
- O modulo comum/core `Preferencias / Configuracoes remanescentes` permaneceu com a mesma fronteira funcional.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes tocadas

### No `frontend/app.js`

- `prefRenderListaAmbiente()`
- `prefAplicarEstiloAmbiente(el, style)`
- `prefAplicarPreviewAmbiente()`
- `prefEnsureAmbienteOverrides()`
- `prefRebuildAmbientePreview()`

### No modulo passivo

- `prefAmbienteNormalizeStyleId()`
- `prefAmbienteEnsureOverrides(targetDocument)`
- `prefAmbienteAplicarEstiloElemento(elemento, style)`
- `prefAmbienteRenderList({ container, secoes, ativa, esc, onSelect })`
- `prefAmbienteAplicarPreview({ refs, secoes })`
- `prefAmbienteColetarRefs(root)`
- `prefAmbienteMontarPreview({ backdrop, onToggleItem })`

## O que saiu parcialmente do `app.js`

- A montagem visual do preview da aba Ambiente foi delegada ao modulo passivo existente.
- A aplicacao visual dos estilos da preview passou a ser centralizada no modulo.
- A renderizacao da lista lateral de secoes da aba Ambiente passou a ser delegada ao modulo.
- A injeccao do estilo visual auxiliar da aba Ambiente passou a ser delegada ao modulo.
- A construcao do preview interno da area de exemplo passou a ser delegada ao modulo.

## O que permaneceu no `app.js`

- A abertura da modal de Preferencias.
- O carregamento dos dados.
- O salvamento por aba.
- O roteamento de menu.
- O fechamento da modal.
- O dialogo de fonte da aba Ambiente.
- O fluxo de `prefSincronizarUI()`.
- O fluxo de `prefCarregarDados()`.
- O fluxo de `prefSalvar*()`.
- O fluxo de `sysOpt*()`.

## Confirmacoes tecnicas

- `requestJson` nao foi alterado.
- O payload efetivo nao foi alterado.
- O salvamento nao foi alterado.
- Backend nao foi alterado.
- Banco nao foi alterado.
- Endpoints nao foram alterados.
- Permissoes nao foram alteradas.
- `frontend/index.html` nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- Textos quebrados, acentos estranhos ou mojibake existentes foram mantidos sem correccao.

## Riscos

- O preview depende de refs criadas dinamicamente na modal.
- Um erro na delegacao poderia deixar a aba Ambiente sem preview ou duplicar listeners.
- Como o recorte e local, o risco principal e visual, nao de persistencia.

## Rollback mental

- Reverter a delegacao no `app.js` para as rotinas locais anteriores.
- Remover o uso dos helpers novos no modulo passivo.
- Manter intactos carregamento, salvamento, endpoints e payload.
- Revalidar somente a aba Ambiente sem mexer nas demais abas.

## Teste manual obrigatorio

1. Abrir o sistema.
2. Ir em `Configuracao > Preferencias`.
3. Abrir a aba `Ambiente`.
4. Trocar a secao na lista da aba Ambiente.
5. Clicar em `Altera letra...` se o botao existir nessa tela.
6. Observar se o preview visual continua funcionando.
7. Clicar em `Restaura padroes`.
8. Alternar para as abas:
   - `Geral`
   - `Modelos`
   - `Dados do usuario`
   - `Odontograma`
9. Fechar sem salvar e reabrir Preferencias.
10. Confirmar que:
   - modal abre normalmente;
   - modal fecha normalmente;
   - preview nao quebrou;
   - carregamento nao quebrou;
   - salvamento nao foi afetado;
   - Opcoes do sistema nao foi afetado;
   - mensagens e `footerMsg` nao mudaram.

## Limite da etapa

- Nao avancar para nova subetapa apos esta implementacao.
- A proxima etapa deve ser apenas validacao documental pos-teste, depois que o usuario confirmar o comportamento.
