# Auxiliares / Tabelas auxiliares - Subetapa 1 - Namespace passivo

## Objetivo da subetapa

- Criar apenas a estrutura modular passiva/controlada para `Auxiliares / Tabelas auxiliares`.
- Manter `frontend/app.js` como fonte funcional da verdade.
- Não mover comportamento funcional para o novo modulo.

## Arquivos criados

- `frontend/js/modules/auxiliares.js`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`

## Arquivos alterados

- `frontend/index.html`

## Confirmacao de que nenhum comportamento funcional foi movido

- Nenhuma funcao `aux*` foi removida do monolito.
- Nenhum endpoint foi alterado.
- Nenhum bind foi alterado.
- Nenhum modal foi alterado.
- Nenhuma renderizacao foi alterada.
- Nenhuma regra de agenda foi alterada.
- `frontend/app.js` continua dono do fluxo funcional de `auxAbrir()`, `auxCarregarTipos()`, `auxCarregarItens()`, `auxDialogItem()` e `auxExcluirItem()`.

## Confirmação de que `app.js` continua dono das funções `aux*`

- Sim.
- O novo modulo nao recebeu wrappers funcionais.
- O dispatcher do shell continua apontando para `auxAbrir()` no `frontend/app.js`.
- O painel continua sendo montado e controlado pelo monolito.

## Namespace criado

- `window.BranaAuxiliaresModule`

## Contrato passivo exposto

- `meta`
- `nome`
- `subetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `helpers`
- `funcoesMonoliticas`
- `helpersCandidatosFuturos`
- `dependenciasCompartilhadas`
- `endpoints`
- `getInfo()`
- `getStatus()`
- `info()`

## Por que `index.html` foi alterado

- O projeto ja carrega outros modulos passivos antes de `app.js`.
- Para manter o mesmo padrao de carregamento e permitir inspeção via console, `frontend/js/modules/auxiliares.js` foi inserido antes de `app.js`.
- Isso nao altera o comportamento funcional do módulo.

## Riscos preservados

- O modulo continua compartilhando scaffold com `Plano de Contas`.
- O modulo continua usando `cadModal` como modal generico compartilhado.
- `auxPosSalvarDependencias()` continua sendo efeito colateral importante e foi preservado.
- Nao houve tentativa de corrigir mojibake/acentos nesta subetapa.

## Proximos passos recomendados para a Subetapa 2

- Mapear fronteiras e contratos de `Auxiliares` no `app.js` sem mover comportamento.
- Identificar apenas helpers pequenos e puros, se existirem.
- Nao integrar wrappers ainda.

## Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/auxiliares.js`: OK

## Onde testar no sistema antes de avancar

1. Fazer `Ctrl+F5`.
2. Abrir `Tabelas auxiliares...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista de tipos carrega.
5. Trocar o tipo selecionado.
6. Selecionar um item e conferir o destaque.
7. Testar `Novo`.
8. Testar `Altera`.
9. Testar `Elimina`, se for seguro.
10. Abrir um tipo com modal especial e confirmar que o `cadModal` continua funcionando.
11. Fechar e reabrir o painel.
12. Confirmar no console:
    - `window.BranaAuxiliaresModule`
    - `window.BranaAuxiliaresModule.getInfo && window.BranaAuxiliaresModule.getInfo()`

## Observacao final

- Esta Subetapa 1 manteve o comportamento visual e funcional exatamente igual ao estado documentado na Subetapa 0.
