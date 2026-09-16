# Fase G.2B.0.1 - Plano tecnico da migration e do backfill de origem

Data: 2026-08-03

## Resultado
- APROVADO PARA G.2B.1A.

## 1. Git
- diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- branch: `modularizacao-segura-fase-1`
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- worktree: sujo por alteracoes preexistentes fora desta subfase
- stage: sem alteracoes novas desta rodada
- operacoes em andamento: nenhuma

## 1.1 Estado atual
- G.2B.1A executada;
- campo `origem` criado no model;
- compatibilidade de banco adicionada de forma aditiva;
- dados historicos continuam sem classificacao;
- G.2B.1A validada e encerrada;
- G.2B.1B executada em modo somente leitura;
- dry-run concluido;
- relatorios JSON e CSV gerados em `docs/audits/`;
- nenhuma escrita em banco ocorreu.
- G.2B.1B.1 executada como reconciliacao de qualidade;
- resultado preliminar nao autorizado para backfill;
- diferenca 81 x 636 explicada como linhas funcionais versus linhas fisicas;
- continua proibido escrever origem.
- G.2B.1B.4 e a fonte canonica da classificacao;
- G.2B.1C.0 e a fonte canonica do plano reversivel;
- nenhum backfill foi executado;
- origem permanece nula nos 1113 registros;
- nenhum script operacional foi criado;
- a proxima etapa permitida e G.2B.1C.2.

> A G.2B.1C.1 foi implementada, validada e encerrada. A etapa seguinte e apenas documental e nao autoriza executar `--apply`.

## 2. Estado contratual consolidado
- `G.1E` aprovada e homologada em runtime manual;
- `G.2E.0` bloqueada por contrato de backend;
- `G.2B.0` fechada em documentacao;
- o backend atual ja reconhece `catalogo_oficial` por `legacy_id`;
- `scope=biblioteca` nao e suficiente para a composicao segura da grade;
- o futuro `scope=grade` depende de origem explicita.

## 3. Campo definido
- nome Python: `origem`
- nome da coluna: `origem`
- nome no schema: `origem`
- nome no JSON: `origem`
- justificativa: curto, claro, direto, compatível com o dominio e alinhado com o contrato G.2B.0.

## 4. Tipo definido
- banco: `VARCHAR`
- Python: `str | None`
- schema: string ou `Literal` futura, conforme camada
- constraint: `CHECK` ou validacao equivalente em etapa posterior, conforme o padrao real do projeto
- valores persistidos iniciais: apenas os realmente necessarios para classificar dados conhecidos

## 5. Nulabilidade
- estado inicial: `nullable=True`
- default: nenhum default de negocio permanente
- `server_default`: nao usar
- estado final: pode ser endurecido somente se toda a base estiver classificada com seguranca

## 6. Indices
- indice simples em `origem`: postergado
- indice composto em `clinica_id, origem, ativo`: postergado
- justificativa: a G.2B.1A aprova apenas a adicao estrutural do campo; a necessidade real de indice fica para a etapa em que a consulta existir

## 7. Migration
- ferramenta real observada: scripts e compatibilidade por startup/hotfix, nao uma pasta Alembic visivel neste repositório
- estrategia recomendada para a G.2B.1A: alteracao aditiva e isolada do model com migration compatível com o padrao real do projeto
- upgrade: adicionar coluna nullable, opcionalmente criar indice se justificado
- downgrade: remover indice, remover constraint se existir e remover coluna
- transacao: sim, no escopo da migration
- compatibilidade: preservar registros existentes sem alteracao de valor nesta primeira etapa

## 8. Dados existentes
- evidencia confirmada por leitura de codigo:
  - `legacy_id` existe e separa o catalogo oficial;
  - `clinica_id` existe e marca tenant;
  - `imagem_custom` existe e nao define origem sozinho;
  - `ativo` existe e pode ser usado no futuro para exclusao logica;
  - os seeds oficiais e complementares ja mostram separacao entre catalogo e extras.
- conclusao:
  - a adicao do campo nao depende de conhecer a classificacao completa de todos os registros agora;
  - os registros indefinidos podem permanecer nulos na G.2B.1A.

## 9. Dry-run
- entrada: leitura de registros existentes e classificacao preliminar
- saida: JSON, CSV ou markdown, conforme a ferramenta auxiliar da etapa futura
- regras: classificar apenas o que tiver evidencia suficiente
- conflitos: registrar em vez de adivinhar
- aprovacao: apenas quando a classificacao manual ou derivada tiver base objetiva

### G.2B.1B executada
- `catalogo_oficial`: `636`
- `seed_interno`: `464`
- `fixture_teste`: `2`
- `asset_auxiliar`: `11`
- `indefinido`: `0`
- conflitos: `0`
- total lido: `1113`
- relatorio JSON: `docs/audits/g2b1b_dry_run_origem_simbolos_20260803_163258.json`
- relatorio CSV: `docs/audits/g2b1b_dry_run_origem_simbolos_20260803_163258.csv`

### G.2B.1B.3 revisada
- ampliacao das evidencias positivas concluiu sem deixar registros indefinidos;
- `catalogo_oficial`: `636`
- `seed_interno`: `464`
- `fixture_teste`: `2`
- `asset_auxiliar`: `11`
- `indefinido`: `0`
- conflitos: `0`

### G.2B.1B.1 reconciliada
- `catalogo_oficial`: `636` linhas fisicas
- `legacy_id` distintos oficiais: `81`
- clinicas distintas: `8`
- `seed_interno`: `477`
- `indefinido`: `0`
- conclusao: bloqueado para backfill ate amostragem e validacao funcional

## 10. Backfill
- estrategia: aditiva primeiro, backfill depois
- idempotencia: obrigatoria
- lote: por clinica e por grupo de origem, quando houver classificador seguro
- logs: obrigatorios
- rollback: precisa permitir restaurar `null` para lotes aplicados por engano
- nenhuma escrita e autorizada nesta fase

## 11. Model
- alteracao futura: adicionar `origem` como coluna nullable no model `SimboloGrafico`
- validator: validacao de valores permitidos na camada Python ou schema
- compatibilidade: registros antigos continuam validos com `origem = null` ate serem classificados

## 12. Schemas
- create: o cliente nao deve escolher origem
- update: o cliente nao deve alterar origem
- response: a origem pode ser retornada
- origem enviada pelo cliente: proibida

## 13. Flags
- persistidas: somente a origem, se a etapa posterior decidir persistir mais de um marcador
- derivadas: `eh_oficial`, `eh_usuario`, `eh_seed`, `pode_compor_grade`
- regras: derivar a partir da origem para evitar inconsistencias

## 14. POST futuro
- origem: atribuida no backend, nao pelo frontend
- tenant: resolvido pela sessao/current_user
- imagem: pode ser nula
- ativo: conforme default do model

## 15. Scopes
- `catalogo`: permanece sem mudanca nesta etapa
- `biblioteca`: permanece sem mudanca nesta etapa
- `grade`: nao sera criado na G.2B.1A

## 16. Testes futuros
- model: aceita valores validos e rejeita valores invalidos
- schema: create/update nao permitem origem vinda do cliente
- migration: cria e remove coluna
- regressao: scopes existentes permanecem estaveis

## 17. Arquivos permitidos na G.2B.1A
- `backend/models/simbolo_grafico.py`
- migration aditiva correspondente ao padrao real do projeto
- testes de model/schema/migration para a etapa
- documentacao da fase

## 18. Microetapas
- `G.2B.1A`: campo aditivo no model e migration
- `G.2B.1B`: dry-run de classificacao
- `G.2B.1C`: backfill dos registros comprovados
- `G.2B.1D`: validacao pos-backfill
- `G.2B.2`: flags e schema de resposta
- `G.2B.3`: `scope=grade`

## 19. Decisao tecnica
### APROVADO PARA G.2B.1A

Motivos:
- a adicao do campo pode ser feita sem decidir o backfill completo agora;
- o estado inicial `nullable=True` preserva compatibilidade;
- a classificacao de origem pode ocorrer depois, com dry-run e prova documental;
- nao ha necessidade de reescrever o contrato de listagem nesta etapa.

## 19.1 Registro da aplicacao
- model atualizado com `origem`;
- migration aditiva criada para `simbolo_grafico_catalogo.origem`;
- compatibilidade de startup mantida em modo aditivo;
- nenhum registro foi classificado;
- nenhum scope novo foi criado.

## 20. Riscos remanescentes
- registros historicos com origem ambigua;
- possivel necessidade de indice composto se a consulta futura crescer;
- necessidade de backfill auditavel antes de endurecer a coluna;
- necessidade de manter o frontend fora dessa decisao por enquanto.

## 21. Proxima etapa
### Fase G.2B.1C.2
Gerar o manifesto operacional real em dry-run, com `APPLY_ENABLED` mantido em `False`.

Nao executar `--apply`.
Nao preencher origem.
Nao alterar React.

## 21.1 Encerramento subsequente
### Fase G.2B.1C.2.1
Validacao final e encerramento formal do manifesto operacional.

Confirmado em leitura:
- checksum canonico;
- totais por categoria;
- total geral `1113`;
- dry-run repetido com resultado identico;
- `--apply` bloqueado;
- base preservada sem escrita.
