# Unidades - Subetapa 5 - Wrapper de `fmtCodigo`

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da alteração: limpo
- Arquivos analisados: `frontend/app.js`, `frontend/js/modules/unidades.js`, `frontend/index.html`
- Arquivos alterados nesta etapa: `frontend/app.js`, `docs/unidades_subetapa_5_wrapper_fmt_codigo.md`
- `frontend/index.html` foi alterado: não
- `frontend/js/modules/unidades.js` foi alterado: não

## Contrato real encontrado

O namespace carregado em `window.BranaUnidadesModule` expõe:

- `meta`
- `status`
- `helpers`
- `helpers.fmtCodigo`
- `helpers.statusHtml`
- `helpers.telefonePadrao`

O helper modular usado como referência nesta etapa é `window.BranaUnidadesModule.helpers.fmtCodigo`.

## Função alterada no `app.js`

- `unidadeFmtCodigo(valor, idx)`

## Lógica aplicada

A função `unidadeFmtCodigo(valor, idx)` passou a atuar como wrapper opcional:

1. tenta obter `window.BranaUnidadesModule`
2. tenta usar `mod.helpers.fmtCodigo`
3. se necessário, tenta `mod.fmtCodigo`
4. se o helper modular existir e funcionar, usa o resultado dele
5. se o helper modular não existir ou lançar erro, cai no fallback local
6. o fallback local preserva exatamente a lógica atual de formatação de código

## Garantias preservadas

- `unidadeFmtCodigo` continua existindo no `app.js`
- nenhuma função foi removida do `app.js`
- `unidadeStatusHtml` não foi alterada nesta etapa, exceto pela preservação do wrapper já existente
- nenhum comportamento funcional foi deslocado para o módulo
- o módulo continua sem registrar eventos
- o módulo continua sem acessar DOM
- o módulo continua sem fazer fetch/API
- o módulo continua sem sobrescrever funções globais funcionais
- o duplo clique de Unidades não foi alterado nesta etapa
- a coluna Código continua renderizando normalmente

## Riscos residuais

- se o contrato do namespace modular mudar, o wrapper cairá no fallback local
- se o helper modular passar a lançar erro, o fallback local continuará protegendo a coluna Código

## Teste manual recomendado

- abrir `Cadastro > Unidades de atendimento`
- confirmar que a coluna Código continua exibindo os valores formatados como antes
- validar que o botão `Altera...` e o duplo clique seguem intactos

## Próxima subetapa recomendada

- criar wrapper equivalente para `unidadeTelefonePadrao(idx, tipos)`
