# Ficha Pessoal - Historico - Microetapa 1 - harmonizacao textual visual

## Objetivo

Executar ajustes textuais e visuais de baixissimo risco na aba `Historico`, sem alterar a logica funcional ja implementada.

## Textos ajustados

- Cabeçalho final da grade: `Descricao do procedimento` -> `Descricao`
- Botao da toolbar: `Edita linha` -> `Editar linha`
- Botao da toolbar: `Elimina linha` -> `Excluir linha`

## Arquivos alterados

- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `docs/11_roadmap_desenvolvimento.md`

## Confirmacao de ausencia de mudanca funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Riscos observados

- Risco baixo, restrito a harmonizacao nominal da toolbar e do cabecalho.
- Nao ha impacto estrutural conhecido nesta microetapa.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Conferir os textos dos botoes da toolbar.
5. Conferir o cabecalho final da grade.
6. Abrir `Propriedades da linha` e conferir os rótulos visuais.
7. Confirmar que o comportamento da aba continua o mesmo.
8. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima microetapa recomendada

Se ainda fizer sentido apos validacao visual, seguir para refinamento visual leve do modal de `Propriedades da linha`; caso contrario, iniciar a analise dos ajustes funcionais de medio risco.
