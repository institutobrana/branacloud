# Autorizacao tecnica pendente - Correcao dos 106 nomes da PARTICULAR

## Objetivo

Preparar a aplicacao segura, transacional e reversivel dos `106` nomes corrigiveis da tabela `PARTICULAR` do Brana Cloud, sem executar o `apply` nesta etapa.

## Escopo

Somente `procedimento.nome`.

## Contexto validado

- Clinica: `1`
- Tabela tecnica: `18`
- Tabela de negocio: `4`
- Nome da tabela: `PARTICULAR`
- Total de procedimentos: `336`
- Casos seguros: `106`
- Casos de revisao manual: `63`
- Registro bloqueado: `Procedimento 5200`

## Preview seguro

- JSON: [`docs/preview_correcao_textual_particular_segura.json`](./preview_correcao_textual_particular_segura.json)
- CSV: [`docs/preview_correcao_textual_particular_segura.csv`](./preview_correcao_textual_particular_segura.csv)
- Hash JSON: `f826a7a949cc7028e9740a84c09921904f89ccda94cab3116551e48a586510df`
- Hash CSV: `1e4ae5c62cec0190b0e88c29dd638057f819cd3d573cd8357f0102536526beb9`

## Backup criado

- JSON: [`backend/backups/particular_nomes_antes_correcao_106.json`](../backend/backups/particular_nomes_antes_correcao_106.json)
- CSV: [`backend/backups/particular_nomes_antes_correcao_106.csv`](../backend/backups/particular_nomes_antes_correcao_106.csv)
- Hash JSON: `e77e57d6cb8879f4bdfabc42d91b7ee40e98532348ae7264be3f81a58cab1f3f`
- Hash CSV: `f56d6a67b1ea36a43ce6551ae2c684a85cced6ad70e58563a7acda5cc7eb8f06`
- O diretório `backend/backups/` permanece coberto pela regra de ignorado do Git.

## Script final

- [`backend/scripts/corrigir_nomes_particular_operacional.py`](../backend/scripts/corrigir_nomes_particular_operacional.py)

Modos implementados:
- `--preview`
- `--apply`
- `--rollback`
- `--status`

## Resultado do dry-run

- `106` registros elegiveis validados
- `0` divergencias no lote seguro
- `0` ausentes
- `0` corrigidos previamente
- `PRONTO_PARA_APPLY`
- preview idempotente confirmado em execuções consecutivas

## Resultado do status

`PRONTO_PARA_APPLY`

## Testes executados

- `python -m py_compile backend/scripts/corrigir_nomes_particular_operacional.py`
- `--preview` duas vezes
- `--status`
- verificacao de hash do preview
- verificacao de hash do backup

## Campos protegidos

- `procedimento.id`
- `procedimento.codigo`
- `procedimento.tabela_id`
- `procedimento.procedimento_generico_id`
- `preco`
- `custo`
- `custo_lab`
- `especialidade`
- `simbolo`
- `forma de cobranca`
- `observacoes`
- `status`
- `vinculos com materiais`
- `materiais herdados`
- `vinculos clinicos`
- `historicos`
- qualquer outro campo fora de `procedimento.nome`

## Comandos preparados

### Apply

```powershell
python backend/scripts/corrigir_nomes_particular_operacional.py --apply --confirm-preview-hash f826a7a949cc7028e9740a84c09921904f89ccda94cab3116551e48a586510df
```

### Rollback

```powershell
python backend/scripts/corrigir_nomes_particular_operacional.py --rollback
```

## Riscos

- divergencia de nome no banco entre o preview e o estado atual
- aplicacao parcial, que deve abortar
- qualquer tentativa de escrita fora do escopo de `procedimento.nome`

## Critérios de aborto

- hash do preview divergente
- hash do backup divergente
- total diferente de `106`
- nome atual divergente
- id ausente
- tabela/clínica divergente
- registro já aplicado parcialmente

## Estado atual

O `apply` ainda **nao foi executado** e permanece aguardando autorizacao explicita do usuario.
