# Fase G.3D.1 - Correcao do refresh da grade apos create

Data: 2026-08-04

## Causa raiz
O endpoint `GET /cadastros/simbolos-graficos?scope=catalogo` filtrava a grade apenas pelos 81 registros oficiais do EasyDental e descartava simbolos criados pelo usuario no React.

## Correcao aplicada
- a listagem passou a incluir simbolos com `origem=simbolo_usuario` explicitamente marcados pela clinica atual;
- o create passou a gravar `origem=simbolo_usuario`.

## Resultado
- o POST cria o simbolo;
- o GET posterior retorna o mesmo ID;
- a grade renderiza a nova linha;
- o registro fica selecionado;
- `Altera` e `Elimina` funcionam pela interface.
