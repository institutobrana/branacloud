# Verificacao funcional dos 143 simbolos da grade

Data: 2026-08-03

## Resultado
- APROVADA PARA DECISAO.

## Runtime
- URL: `http://192.168.3.41:5173/app/configuracoes/simbolos-graficos`
- scope: `biblioteca`
- status: `200`
- chamadas GET: `2`
- total API: `143`
- total grade: `143`

## Composicao
- total: `143`
- com legacy_id: `81`
- sem legacy_id: `62`
- oficiais: `81`
- usuarios legitimos: `0 confirmados entre os 62`
- testes: `2`
- seeds: `59`
- copias: `1`
- tecnicos: `0 confirmados como cadastro usuario`
- indeterminados: `0`

## Os 81
- origem: snapshot oficial carregado por `backend/services/simbolos_service.py`
- tipo_simbolo: `1`
- clinica: `1`
- protecao: simbolos de sistema bloqueados para criacao/exclusao manual
- deveriam aparecer: sim, no contrato atual da grade

## Os 62
- legitimos: `59` como biblioteca-base/seed local da clinica
- testes: `2`
- antigos: `1` copia/seed de simbolo oficial
- em uso: sim, fazem parte da biblioteca exibida pela tela
- orfaos: `0 confirmados`
- indeterminados: `0`

## Testes
- quantidade: `2`
- IDs: `1814`, `1815`
- descricoes:
  - `TESTE SIMBOLO REACT 2D2 20260801-1420`
  - `TESTE SIMBOLO REACT MICROETAPA D1 2026-08-02 00:00`
- impacto no total: `2`
- remocao futura: apenas pelo fluxo oficial de exclusao, se o produto decidir remover registros de teste

## Referencias
- odontograma: os itens `int_*` e `sim_*` sem `legacy_id` sao biblioteca-base visual usada no fluxo do simbolo/odontograma
- procedimentos: o backend usa a mesma entidade para selecoes e mapeamentos do modulo
- historico: os testes acima pertencem a esta frente
- demais vinculos: `frontend/app.js`, `frontend-react/src/features/simbolosGraficos/*`

## Duplicacoes
- mesmo BMP: existe reutilizacao de BMP em mais de um simbolo
- duplicidade legitima: sim, por finalidade diferente
- duplicidade funcional: nao confirmada
- grupos encontrados: nao ha duplicidade ativa relevante no recorte auditado

## Backend
- catalogo: `scope=catalogo` retorna o snapshot oficial filtrado por `legacy_id`
- biblioteca: `scope=biblioteca` retorna a biblioteca ativa da clinica
- tenant: filtrado por `current_user.clinica_id`
- ativo: somente `ativo IS TRUE`
- tipo: `tipo_simbolo = 1` para oficiais; `tipo_simbolo = 2` para biblioteca/usuario
- legacy_id: separa o catalogo oficial dos itens locais

## Duas chamadas GET
- causa: efeito normal da montagem da tela em desenvolvimento e da carga paralela de dados
- iniciadores: hook da tabela e a recarga do estado da pagina
- impacto: nenhuma divergencia entre API e grade
- correcao necessaria: nenhuma nesta rodada, porque nao houve loop

## Contrato historico
- legado web: o modulo historico admite biblioteca ativa da clinica, nao apenas catalogo puro
- EasyDental: a biblioteca-base inclui simbolos oficiais e itens auxiliares do dominio odontologico
- documentacao: a auditoria confirma o contrato `scope=biblioteca`
- fluxo Novo: o novo cadastro deve aparecer na mesma grade

## Total funcional esperado
- total recomendado: `143`
- categorias incluidas: oficiais, seeds/biblioteca-base e testes ainda presentes na base
- categorias excluidas: nenhum registro de outra clinica; nenhum inativo
- justificativa: o contrato aprovado da grade e a biblioteca completa da clinica

## Decisao sobre scope
- manter biblioteca: sim
- alterar: nao nesta rodada
- filtros adicionais: nao recomendados apenas para reduzir esteticamente o total
- frontend/backend: manter alinhados ao tenant e ao estado ativo

## Codigo
- alterado: nao
- motivo: esta rodada e somente de verificacao e documentacao

## Documentacao
- criada: `docs/verificacao_funcional_143_simbolos_grade.md`
- atualizada: `docs/auditoria_composicao_grade_simbolos_graficos_scope_biblioteca.md`, `docs/diagnostico_post_reload_lista_simbolos_graficos.md`, `docs/homologacao_runtime_post_basico_simbolo_grafico.md`

## Git
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- Branch: `modularizacao-segura-fase-1`
- Stage inicial: sem alteracoes de git feitas por esta rodada
- Stage final: sem alteracoes de git feitas por esta rodada
- Commit: nao realizado
- Push: nao realizado

## Proxima etapa
- A decisao recomendada e manter `scope=biblioteca` e seguir para a homologacao do fluxo Novo apenas se surgir um novo sintoma funcional.
