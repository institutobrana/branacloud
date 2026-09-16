# Fase G.2B.1C.0 - Plano reversivel do backfill de origem, sem executar escrita

Data: 2026-08-03

## 1. Resultado
- status: `PLANO DOCUMENTAL REVERSIVEL; NENHUMA ESCRITA AUTORIZADA`
- fonte canonica de entrada: `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`
- nenhuma alteracao foi executada em banco, model, migration, API, React ou seeds

## 2. Base consolidada de entrada
- total de registros: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- classificacao consolidada:
  - `catalogo_oficial`: `636`
  - `seed_interno`: `464`
  - `fixture_teste`: `2`
  - `asset_auxiliar`: `11`
  - `simbolo_usuario`: `0`
  - `copia_tecnica`: `0`
  - `indefinido`: `0`
  - conflitos: `0`

## 3. Objetivo tecnico
- definir um backfill futuro que seja auditavel, idempotente, bloqueante por divergencia e inteiramente reversivel;
- impedir recalculo livre durante a escrita;
- preservar os registros manuais e as categorias tecnicas comprovadas;
- separar planejamento documental de qualquer execucao operacional.

## 4. Artefato canonico de entrada
- artefato preferencial: manifesto imutavel gerado a partir do JSON final aprovado da consolidacao;
- a escrita futura nao deve depender de recalculo dinamico sem comparacao;
- o manifesto deve ser a fonte valida de expectativa para cada linha alvo.

### Conteudo minimo do manifesto
- `id`
- `categoria_esperada`
- `rule_id`
- `signature`
- `checksum` dos campos relevantes
- `expected_origin`

### Campos de validacao por registro
- `id`
- `origem atual`
- `legacy_id`
- `clinica_id`
- `codigo`
- `descricao`
- `tipo_marca`
- `tipo_simbolo`
- assinatura normalizada
- checksum do subconjunto relevante

## 5. Escopo de escrita futuro
- somente a coluna `origem`;
- somente os IDs listados no manifesto;
- somente linhas com `origem IS NULL`;
- somente registros cuja assinatura atual corresponda ao manifesto;
- nenhum outro campo pode ser alterado.

## 6. Comportamento por categoria

### `catalogo_oficial`
- quantidade esperada: `636`
- fonte positiva: `legacy_id` oficial + snapshot funcional consolidado
- regra de validação: identidade funcional e assinatura normalizada devem coincidir com o manifesto
- preservacao: manter o valor somente se a linha ainda estiver nula e a assinatura bater

### `seed_interno`
- quantidade esperada: `464`
- fonte positiva: assinatura canonica do conjunto complementar
- regra de validação: codigo e assinatura deterministica do seed devem corresponder ao manifesto
- preservacao: nao sobrescrever qualquer valor posterior fora do manifesto

### `fixture_teste`
- quantidade esperada: `2`
- fonte positiva: IDs explícitos de teste manual em homologacao
- regra de validação: descricoes de teste devem bater exatamente com o manifesto
- preservacao: nao tratar como seed nem como usuario

### `asset_auxiliar`
- quantidade esperada: `11`
- fonte positiva: `sim_30.bmp` com `imagem_custom` presente e assinatura comprovada
- regra de validação: somente os IDs/assinaturas do manifesto podem ser atualizados
- preservacao: manter como categoria tecnica, nao como dado de grade

### `simbolo_usuario`
- quantidade atual: `0`
- decisao: bloqueado para este plano

### `copia_tecnica`
- quantidade atual: `0`
- decisao: bloqueado para este plano

### `indefinido`
- quantidade atual: `0`
- decisao: nao entra no manifesto

## 7. Idempotencia
- primeira execucao: atualiza somente origens nulas validas;
- segunda execucao: atualizacoes esperadas = `0`;
- qualquer divergencia de origem existente cancela ou falha antes de escrever;
- a operacao deve ser rerun-safe.

## 8. Pre-condicoes obrigatorias
- total da tabela = `1113`;
- `origem IS NULL = 1113`;
- `origem IS NOT NULL = 0`;
- nenhum ID duplicado no manifesto;
- nenhuma categoria desconhecida;
- manifesto com checksum valido;
- banco e schema esperados;
- ambiente explicitamente autorizado;
- backup logico disponivel;
- janela formal aprovada para qualquer futura execucao.

## 9. Detectores de divergencia
- registro ausente do manifesto;
- ID duplicado;
- assinatura atual diferente da esperada;
- categoria diferente da registrada;
- origem ja preenchida em linha que deveria ser atualizada;
- banco ou schema diferente do alvo;
- contagem total diferente da consolidada.

## 10. Transacao
- abrir conexao;
- iniciar transacao;
- aplicar modo restritivo;
- validar banco, manifesto e contagens;
- validar todos os registros alvo;
- somente entao executar updates;
- validar contagens finais;
- commit apenas se tudo corresponder;
- rollback integral em qualquer erro.

## 11. Rollback
### Rollback transacional
- qualquer erro antes do commit deve reverter a transacao inteira.

### Rollback posterior
- se houver necessidade de desfazer uma execucao futura, o plano reverso deve:
  - aceitar apenas IDs do manifesto original;
  - validar que a origem atual corresponde a categoria aplicada;
  - restaurar `origem` para `NULL`;
  - nao alterar registros reclassificados por fases posteriores;
  - ser idempotente;
  - gerar relatorio propio.

## 12. Execucao futura
### `--dry-run`
- le manifesto;
- valida banco;
- valida registros;
- calcula updates planejados;
- nao executa `UPDATE`;
- gera relatorio;
- retorna exit code nao zero em divergencia.

### `--apply`
- modo explicito e separado;
- nao deve ser o comportamento padrao;
- exige confirmacao formal de backfill-origem.

## 13. Sinalizadores de seguranca
- `--database brana_saas`
- `--expected-total 1113`
- `--manifest <arquivo>`
- `--apply`
- `--confirm-backfill-origem`
- `--environment local|hml|prod`

O script futuro deve recusar execucao se:
- o ambiente nao for informado;
- o manifesto nao corresponder;
- `--apply` nao for explicito;
- a origem ja estiver parcialmente preenchida sem plano de retomada;
- o banco nao for o esperado.

## 14. Logs e relatorios
### Antes
- total;
- origem nula;
- origem preenchida;
- contagem esperada por categoria;
- checksum do manifesto.

### Durante
- IDs processados;
- categoria;
- resultado;
- conflito;
- sem conteudo sensivel.

### Depois
- total;
- contagem por origem;
- atualizacoes;
- nao atualizados;
- conflitos;
- duracao;
- commit ou rollback.

### Saidas
- JSON;
- CSV resumido;
- Markdown de fechamento.

## 15. Backup
- exportar ao menos:
  - `id`;
  - `origem`;
  - `legacy_id`;
  - `clinica_id`;
  - assinatura;
- proteger o arquivo contra sobrescrita;
- avaliar `pg_dump` da tabela e snapshot filtrado para ambiente futuro.

## 16. Testes futuros obrigatorios
- dry-run nao escreve;
- apply exige flag explicita;
- banco incorreto e rejeitado;
- total divergente e rejeitado;
- origem parcialmente preenchida e rejeitada;
- ID ausente e rejeitado;
- ID duplicado no manifesto e rejeitado;
- categoria desconhecida e rejeitada;
- rollback restaura `NULL` somente para o conjunto do manifesto;
- segunda execucao nao altera nada.

## 17. Sequencia operacional futura da G.2B.1C
1. gerar manifesto imutavel a partir da consolidacao G.2B.1B.4;
2. executar dry-run do plano de backfill;
3. validar manifesto, banco, contagens e assinaturas;
4. obter aprovacao formal para apply;
5. executar transacao restritiva com update apenas de `origem`;
6. validar contagens finais;
7. emitir relatorio de fechamento;
8. registrar rollback reversivel.

## 18. Decisao formal
- o backfill ainda nao esta autorizado;
- a fase G.2B.1C.0 aprova somente desenho tecnico e documentacao;
- qualquer escrita depende de novo plano, validacao adicional e aprovacao explicita.
