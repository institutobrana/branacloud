# Unidades - Subetapa 4 - Wrapper de `statusHtml`

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da alteração: limpo
- Arquivos analisados: `frontend/app.js`, `frontend/js/modules/unidades.js`, `frontend/index.html`
- Arquivos alterados nesta etapa: `frontend/app.js`, `docs/unidades_subetapa_4_wrapper_status_html.md`
- `frontend/index.html` foi alterado: não
- `frontend/js/modules/unidades.js` foi alterado: não

## Contrato real encontrado

O namespace carregado em `window.BranaUnidadesModule` expõe:

- `meta`
- `status`
- `helpers`
- `helpers.statusHtml`

O helper modular disponível e utilizado como referência é `window.BranaUnidadesModule.helpers.statusHtml`.

## Função alterada no `app.js`

- `unidadeStatusHtml(ativo)`

## Lógica aplicada

A função `unidadeStatusHtml(ativo)` passou a atuar como wrapper opcional:

1. tenta obter `window.BranaUnidadesModule`
2. tenta usar `mod.helpers.statusHtml`
3. se necessário, tenta `mod.statusHtml`
4. se o helper modular existir e funcionar, usa o resultado dele
5. se o helper modular não existir ou lançar erro, cai no fallback local
6. o fallback local preserva exatamente o HTML já usado pelo `app.js`

## Garantias preservadas

- `unidadeStatusHtml` continua existindo no `app.js`
- nenhuma função foi removida do `app.js`
- nenhum comportamento funcional foi deslocado para o módulo
- o módulo continua sem registrar eventos
- o módulo continua sem acessar DOM
- o módulo continua sem fazer fetch/API
- o módulo continua sem sobrescrever funções globais funcionais
- o duplo clique de Unidades não foi alterado nesta etapa

## Riscos residuais

- se o contrato do namespace modular mudar, o wrapper cairá no fallback local
- se o helper modular passar a lançar erro, o fallback local continuará protegendo a tela

## Teste manual recomendado

- abrir `Cadastro > Unidades de atendimento`
- confirmar que a coluna de status continua renderizando normalmente
- validar que o fluxo de alteração por botão e o duplo clique continuam iguais

## Próxima subetapa recomendada

- criar wrapper equivalente para `unidadeFmtCodigo(valor, idx)` ou, depois dele, para `unidadeTelefonePadrao(idx, tipos)`
