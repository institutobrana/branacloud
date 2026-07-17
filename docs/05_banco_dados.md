# 05 - Banco de Dados

## Tipo e conexao

O Brana Cloude usa PostgreSQL via SQLAlchemy. A conexao esta em `backend/database.py` e depende de `DATABASE_URL`.

`backend/main.py` carrega `backend/.env` antes de importar `database.py`, entao o backend local funciona sem `set` manual quando `backend/.env` esta correto.

## Base ORM

Todos os modelos usam `Base` de `backend/database.py`. Os modelos ficam em `backend/models/`.

O startup pode executar `Base.metadata.create_all(bind=engine)` quando `BRANA_ENABLE_SCHEMA_BOOTSTRAP` estiver ativo. Isso cria tabelas ausentes, mas nao substitui migrations.

## Tabelas principais

| Area | Tabelas |
| --- | --- |
| Clinicas e usuarios | `clinicas`, `usuarios`, `access_profile`, `usuario_perfil_acesso`, `email_codes` |
| Plataforma | `planos`, `assinaturas`, `plataforma_assinaturas`, `plataforma_cobrancas`, `plataforma_auditoria` |
| Pacientes e cadastros | `pacientes`, `unidade_atendimento`, `contato`, `doenca_cid`, `item_auxiliar` |
| Agenda | `agenda_legado_evento`, `agenda_legado_bloqueio` |
| Financeiro | `grupo_financeiro`, `categoria_financeira`, `lancamento`, `cenario`, `indice_financeiro`, `indice_cotacao` |
| Materiais | `lista_material`, `material` |
| Medicamentos | `medicamento`, `restricao_terapeutica` |
| Prestadores | `prestador`, `prestador_credenciamento`, `prestador_comissao`, `prestador_odonto`, `prestador_credenciamento_odonto`, `prestador_comissao_odonto` |
| Convenios e planos | `convenio_odonto`, `plano_odonto`, `calendario_faturamento_odonto` |
| Procedimentos | `procedimento_tabela`, `procedimento`, `procedimento_material`, `procedimento_fase`, `procedimento_generico`, `procedimento_generico_fase`, `procedimento_generico_material`, `simbolo_grafico_catalogo`, `tiss_tipo_tabela` |
| Tratamentos | `tratamento` |
| Anamnese | `anamnese_questionarios`, `anamnese_perguntas`, `anamnese_respostas` |
| Documentos e relatorios | `modelos_documento`, `etiqueta_padrao`, `etiqueta_modelo`, `relatorio_config` |
| Proteticos | `protetico`, `servico_protetico`, `controle_protetico` |

## Relacionamento multi-tenant

A maioria das tabelas operacionais possui `clinica_id` com `ForeignKey("clinicas.id")`. Isso inclui usuarios, pacientes, agenda, financeiro, procedimentos, prestadores, materiais, medicamentos, documentos, relatorios, anamnese e tratamentos.

Regra central: uma rota operacional deve sempre consultar, criar, editar e excluir dados usando `current_user.clinica_id`.

## Relacionamentos importantes

- `clinicas` possui muitos `usuarios`.
- `usuarios` pertence a uma `clinica` e pode se relacionar com prestador e unidade.
- `pacientes` e usado por agenda, tratamentos, anamnese e documentos.
- `procedimento` se relaciona com materiais e fases.
- `procedimento_generico` se relaciona com fases e materiais genericos.
- `convenio_odonto` possui planos e calendarios.
- `prestador_odonto` pode ter credenciamentos e comissoes.
- `anamnese_questionarios` possui perguntas; respostas vinculam paciente/pergunta/questionario.
- `modelo_documento` e usado por editor, agenda, receitas, atestados e PDF.

## Bootstrap e compatibilidade

O startup contem hotfixes aditivos para:

- Colunas criticas de `usuarios`.
- Colunas criticas de `simbolo_grafico_catalogo`.
- Colunas criticas de `anamnese_perguntas`.

Isso reduz falhas em bancos antigos, mas e divida tecnica. O plano correto e criar migrations formais.

## Executor one-shot de schema

Foi criado um executor separado para inicializar bancos PostgreSQL vazios ou descartaveis sem mexer no startup permanente:

- `backend/scripts/apply_schema_baseline.py --plan`
- `backend/scripts/apply_schema_baseline.py --apply`
- `backend/scripts/apply_schema_baseline.py --validate`

O executor registra a versao aplicada em `brana_schema_versions`, usa advisory lock e exige ACK explicito por variavel de ambiente.

## Provisionamento do tenant inicial

O provisionamento do primeiro tenant de homologacao foi separado do executor de schema e ficou documentado em `docs/contrato_provisionamento_tenant_inicial_aws.md`.

O fluxo inicial usa o schema ja aplicado e cria somente:

- clinica;
- unidade principal;
- prestador principal;
- usuario administrador;
- perfil administrativo nativo;
- vinculos obrigatorios entre usuario, prestador, unidade e perfil.

## Regras importantes

- Nunca commitar banco, dump ou backup.
- Nunca usar SQLite como banco do web atual.
- `DATABASE_URL` real deve ficar somente em `backend/.env` local ou segredo de ambiente.
- Antes de alterar modelo, mapear rotas afetadas e criar plano de migration.
- Nao executar migration destrutiva sem backup e aprovacao.
