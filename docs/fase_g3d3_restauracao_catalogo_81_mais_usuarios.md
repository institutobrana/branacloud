# Fase G.3D.3 - Restauracao do catalogo visual de 81 simbolos + usuarios

Data: 2026-08-04

## Causa
A correcao anterior ampliou demais a grade ao aceitar simbolos sem `legacy_id` como se fossem usuarios reais.

## Regra corrigida
- manter os 81 simbolos oficiais canonicos pelo catalogo funcional;
- incluir somente simbolos com `origem=simbolo_usuario` explicitamente marcados pela clinica atual;
- nao aceitar `legacy_id IS NULL` como criterio automatico de listagem.

## Resultado esperado
- a grade volta ao contrato funcional correto;
- registros tecnicos, seeds, fixtures e copias auxiliares deixam de entrar apenas por ausencia de `legacy_id`;
- Novo, Altera e Elimina continuam funcionando;
- o backfill historico continua congelado.

## Validacao
- a correcao foi aplicada em `backend/routes/cadastros_routes.py`;
- o teste de listagem foi ampliado para cobrir simbolo tecnico sem `legacy_id` e origem nula;
- a documentacao de G.3D.1 foi ajustada para refletir a regra mais estreita.

## Proxima etapa
Se a grade voltar ao conjunto funcional esperado, seguir para G.4A sem reabrir backfill.
