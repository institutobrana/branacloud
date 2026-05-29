# Inventario - Conta Paulo Gustavo ID 13 no cluster PostgreSQL 18

## Contexto
- PostgreSQL 17 foi definido como cluster oficial.
- PostgreSQL 18 foi preservado temporariamente porque contem a conta `Paulo Gustavo ID 13`.
- O backup dos dois clusters ja foi realizado e validado.
- Esta etapa e somente de inventario tecnico antes do dry-run de migracao.

## Escopo
- Somente leitura.
- Nenhuma migracao foi executada.
- Nenhum restore foi executado.
- Nenhum dado foi alterado.
- Nenhum codigo foi alterado.

## Backups confirmados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg17_oficial_20260529_143341.dump` - `3047721` bytes
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg17_oficial_20260529_143341.schema.sql` - `162588` bytes
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg18_conta13_20260529_143341.dump` - `3044707` bytes
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg18_conta13_20260529_143341.schema.sql` - `162707` bytes
- Os backups continuam fora do Git.

## Identidade do PostgreSQL 18
- `current_database()`: `brana_saas`
- `current_user`: `postgres`
- `inet_server_addr()`: `::1/128`
- `inet_server_port()`: `5433`
- `version()`: `PostgreSQL 18.3 on x86_64-windows, compiled by msvc-19.44.35225, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- `pg_postmaster_start_time()`: `2026-05-29 14:42:14.475125-03`
- `now()`: `2026-05-29 14:43:20.055921-03`

## Dados da clinica ID 13
Consulta no `brana_saas` do PostgreSQL 18 retornou a seguinte clinica:

```json
{
  "id": 13,
  "cnpj": null,
  "nome": "Paulo Gustavo",
  "ativo": true,
  "email": "pagamentosccb@gmail.com",
  "criado_em": "2026-05-27T14:36:36.671179-03:00",
  "trial_ate": "2027-05-27T21:12:09.601728",
  "tipo_conta": "Anual",
  "chave_licenca": null,
  "data_ativacao": "2026-05-27T21:12:09.601728-03:00",
  "licenca_usuario": null,
  "opcoes_sistema_json": null,
  "nome_tabela_procedimentos": "Brana"
}
```

## Tabelas com vinculo por `clinica_id`
Foram encontradas `49` tabelas com coluna `clinica_id` no cluster 18.

```text
access_profile | 10
agenda_legado_bloqueio | 0
agenda_legado_evento | 0
anamnese_perguntas | 41
anamnese_questionarios | 3
anamnese_respostas | 0
assinaturas | 0
calendario_faturamento_odonto | 0
categoria_financeira | 86
cenario | 0
contato | 0
controle_protetico | 0
convenio_odonto | 10
doenca_cid | 14486
etiqueta_modelo | 8
grupo_financeiro | 13
indice_cotacao | 0
indice_financeiro | 4
item_auxiliar | 1226
lancamento | 0
lista_material | 1
medicamento | 0
modelos_documento | 0
pacientes | 0
plano_odonto | 10
plataforma_assinaturas | 1
plataforma_cobrancas | 0
prestador | 0
prestador_comissao | 0
prestador_comissao_odonto | 0
prestador_credenciamento | 0
prestador_credenciamento_odonto | 0
prestador_odonto | 2
procedimento | 1599
procedimento_fase | 0
procedimento_generico | 591
procedimento_generico_fase | 0
procedimento_generico_material | 0
procedimento_material | 0
procedimento_tabela | 10
protetico | 0
relatorio_config | 0
restricao_terapeutica | 0
servico_protetico | 0
simbolo_grafico_catalogo | 138
tratamento | 0
unidade_atendimento | 1
usuario_perfil_acesso | 0
usuarios | 2
```

## Inventario dos registros principais

### usuarios
- `id 30`:
  - `nome`: `ClÃ­nica`
  - `email`: `clinica.255.c13@system.brana.local`
  - `clinica_id`: `13`
  - `is_admin`: `false`
  - `is_system_user`: `true`
  - `ativo`: `true`
  - `setup_completed`: `true`
  - `prestador_id`: `19`
  - `unidade_atendimento_id`: `null`
- `id 31`:
  - `nome`: `Paulo Gustavo`
  - `email`: `pagamentosccb@gmail.com`
  - `clinica_id`: `13`
  - `is_admin`: `true`
  - `is_system_user`: `false`
  - `ativo`: `true`
  - `setup_completed`: `true`
  - `prestador_id`: `20`
  - `unidade_atendimento_id`: `null`

### prestador_odonto
- `id 19`:
  - `nome`: `ClÃ­nica`
  - `usuario_id`: `30`
  - `clinica_id`: `13`
  - `source_id`: `255`
  - `codigo`: `001`
  - `is_system_prestador`: `true`
- `id 20`:
  - `nome`: `Paulo Gustavo`
  - `usuario_id`: `31`
  - `clinica_id`: `13`
  - `source_id`: `1`
  - `codigo`: `002`
  - `is_system_prestador`: `false`

### unidade_atendimento
- `id 8`:
  - `nome`: `Principal`
  - `clinica_id`: `13`
  - `source_id`: `1`
  - `codigo`: `0001`
  - `qtd_sala`: `0`

### access_profile
Perfis reservados da clinica 13:
- `id 101` - `Agenda de horarios`
- `id 102` - `Controle de estoque`
- `id 103` - `Controle de protetico`
- `id 104` - `Controle de recibos`
- `id 105` - `Creditos na conta corrente`
- `id 106` - `Debitos na conta corrente`
- `id 107` - `Intervencoes`
- `id 108` - `Pacientes`
- `id 109` - `Relatorios estatisticos`
- `id 110` - `Relatorios financeiros`
- Todos com `reservado = true`, `clinica_id = 13`, `source_id` entre `10` e `100`.

### usuario_perfil_acesso
- Nenhum registro encontrado para a clinica 13.

### plataforma_auditoria
- Nenhum evento relacionado a `clinica_id = 13`, `Paulo Gustavo` ou `pagamentosccb@gmail.com` foi encontrado neste inventario.

## Dependencias por IDs
IDs que existem no cluster 18 e merecem preservacao no inventario atual:
- clinica: `13`
- usuarios: `30`, `31`
- prestadores: `19`, `20`
- unidade: `8`
- access_profile: `101` a `110`
- sequences do cluster 18:
  - `clinicas_id_seq = 15`
  - `usuarios_id_seq = 37`
  - `prestador_odonto_id_seq = 24`
  - `unidade_atendimento_id_seq = 10`
  - `access_profile_id_seq = 130`
  - `usuario_perfil_acesso_id_seq` sem valor util no cluster 18

## Conflitos no cluster 17
Comparacao resumida dos IDs principais:

| Objeto | ID no cluster 18 | Existe no cluster 17? | Conflito? | Recomendacao preliminar |
|---|---:|---|---|---|
| Clinica | 13 | Nao | Nao | Pode ser preservada |
| Usuario system | 30 | Nao | Nao | Pode ser preservado |
| Usuario Paulo Gustavo | 31 | Nao | Nao | Pode ser preservado |
| Prestador system | 19 | Nao | Nao | Pode ser preservado |
| Prestador Paulo Gustavo | 20 | Nao | Nao | Pode ser preservado |
| Unidade principal | 8 | Nao | Nao | Pode ser preservada |
| Access profile 101-110 | 101-110 | Nao | Nao | Pode ser preservado |
| Usuarios 44/45 do cluster 17 | N/A no cluster 18 | Sim no cluster 17 | Nao para a conta 13 | Permanecem como registros ja existentes no cluster 17 |

Conferencias adicionais no cluster 17:
- `clinicas.id = 13`: nao existe.
- `clinicas.email = pagamentosccb@gmail.com`: nao existe.
- `usuarios.id IN (30,31,44,45)`: somente `44` e `45` existem.
- `prestador_odonto.id IN (19,20)`: nao existem.
- `unidade_atendimento.id = 8`: nao existe.
- `access_profile.id BETWEEN 101 AND 110`: nao existem.
- `max` atuais do cluster 17:
  - `clinicas = 18`
  - `usuarios = 45`
  - `prestador_odonto = 25`
  - `unidade_atendimento = 3`
  - `access_profile = 186`
  - `usuario_perfil_acesso = 10`
- Sequences do cluster 17:
  - `clinicas_id_seq = 18`
  - `usuarios_id_seq = 45`
  - `prestador_odonto_id_seq = 25`
  - `unidade_atendimento_id_seq = 3`
  - `access_profile_id_seq = 186`
  - `usuario_perfil_acesso_id_seq = 10`

## Estrategia preliminar
- **MIG-A** e a recomendacao preliminar: preservar `clinica_id = 13` e preservar os IDs internos da conta, porque os IDs verificados no cluster 17 estao livres para a conta 13.
- **MIG-B** nao parece necessario neste momento, porque nao ha conflito direto detectado para a conta 13.
- **MIG-C** fica como contingencia caso aparecam conflitos adicionais em tabelas nao cobertas por este inventario.
- **MIG-D** continua valido como cautela se alguma dependencia oculta exigir nova analise.

## Riscos
- Conflitos de IDs em tabelas nao cobertas ainda.
- E-mails unicos ou chaves unicas em tabelas auxiliares.
- Dependencias de sequences.
- Vínculos quebrados entre usuarios, prestadores e unidade.
- Dados sensiveis que devem ser preservados integralmente.
- Tabelas esquecidas em uma migração futura.
- Auditoria incompleta se novas tabelas com `clinica_id` forem descobertas depois.

## Proxima etapa recomendada
- Subetapa C: plano de migracao dry-run sem execucao.

## Estado final dos servicos
- O PostgreSQL 18 temporario foi parado ao final do inventario.
- O PostgreSQL 17 oficial permaneceu ativo.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `.env` nao alterado.
- `banco/schema/migrations/seeds/endpoints` nao alterados.
- `permissoes/seeds` nao alteradas.
- Nenhum restore executado.
- Nenhuma migracao executada.
- Cluster 18 nao excluido.
- Backups nao versionados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Esta etapa registra o inventario completo da conta `Paulo Gustavo ID 13` no cluster PostgreSQL 18 para preparar o dry-run de migracao futura.
