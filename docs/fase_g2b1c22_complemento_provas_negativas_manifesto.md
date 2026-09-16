# Fase G.2B.1C.2.2 - Complemento das provas negativas

Data: 2026-08-04

## 1. Resultado
- APROVADA;
- BLOQUEADA POR DIVERGENCIA;
- BLOQUEADA POR SEGURANCA.

## 2. Manifesto canonico
- arquivo: `backend/manifests/simbolos_graficos_origem_g2b1c2_v1.json`
- checksum antes: `dd01ca096842b69385f5e16e4d84057b33c43daf08a3cbccb7d8783012077f7a`
- checksum depois: `dd01ca096842b69385f5e16e4d84057b33c43daf08a3cbccb7d8783012077f7a`
- alterado: nao

## 3. IDs
- records: `1113`
- unicos: `1113`
- duplicados: `0`
- invalidos: `0`
- nulos: `0`

## 4. Adulteracoes
- categoria alterada: rejeitada com `categoria_invalida:1`
- assinatura: rejeitada com `signature_mismatches = 1`, `conflicts = 1`, `exit_status = 2`
- checksum: rejeitado com `checksum_invalido`
- ID duplicado: rejeitado com `id_duplicado:1` e `ids_nao_unicos`
- categoria desconhecida: rejeitada com `categoria_invalida:1`
- categoria proibida: rejeitada com `categoria_invalida:1`
- todas rejeitadas: sim

## 5. Apply
- APPLY_ENABLED: `False`
- comando: `--apply` contra o manifesto canonico
- exit code: erro de runtime antes de qualquer escrita
- mensagem: `Modo --apply nao autorizado na Fase G.2B.1C.1.`
- UPDATE: `0`
- commit: `0`
- escrita: `0`

## 6. Testes
- comando: `python -m unittest backend.tests.test_backfill_origem_simbolos_graficos backend.tests.test_simbolos_graficos_origem_dry_run backend.tests.test_simbolos_graficos_origem_migration backend.tests.test_simbolo_grafico_origem_model`
- total: `13`
- aprovados: `13`
- falhas: `0`
- erros: `0`
- skips: `0`

## 7. Banco final
- total: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- distintas: `0`
- alteracoes: `0`

## 8. Temporarios
- criados: copias temporarias apenas fora do repositório
- removidos: sim, ao final da execucao
- manifesto preservado: sim

## 9. Proxima etapa
### Fase G.2B.1C.3.0
Plano documental de pre-aplicacao, backup, rollback e ambiente isolado.

Ainda proibido:
- alterar `APPLY_ENABLED`;
- executar `UPDATE`;
- preencher origem;
- executar apply;
- criar `scope=grade`;
- alterar React.
