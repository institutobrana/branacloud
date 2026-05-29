# Plano dry-run - Migração da conta ID 13 do PostgreSQL 18 para o PostgreSQL 17

## Contexto
- O cluster PostgreSQL 17 foi definido como oficial.
- O cluster PostgreSQL 18 permanece preservado temporariamente porque contem a conta `Paulo Gustavo ID 13`.
- O backup dos dois clusters ja foi realizado e validado.
- O inventario da conta ID 13 no PostgreSQL 18 ja foi concluido.
- Esta etapa nao executa migracao.

## Escopo
- Somente leitura e planejamento tecnico.
- Nenhum restore foi executado.
- Nenhuma migracao foi executada.
- Nenhum dado foi alterado.
- Nenhum codigo foi alterado.

## Backups de referencia
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341`
- Arquivos:
  - `brana_saas_pg17_oficial_20260529_143341.dump`
  - `brana_saas_pg17_oficial_20260529_143341.schema.sql`
  - `brana_saas_pg18_conta13_20260529_143341.dump`
  - `brana_saas_pg18_conta13_20260529_143341.schema.sql`

## Estado e conflitos revalidados no cluster 17
- `clinicas.id = 13` continua livre.
- `pagamentosccb@gmail.com` continua livre em `clinicas` e `usuarios`.
- `usuarios.id 30/31` continuam livres.
- `prestador_odonto.id 19/20` continuam livres.
- `unidade_atendimento.id 8` continua livre.
- `access_profile.id 101-110` continuam livres.
- `max(id)` atuais no cluster 17:
  - `clinicas = 18`
  - `usuarios = 45`
  - `prestador_odonto = 25`
  - `unidade_atendimento = 3`
  - `access_profile = 186`
  - `usuario_perfil_acesso = 10`
- `sequence last_value` batem com os maximos atuais.
- Restricoes relevantes encontradas:
  - `clinicas.email` possui indice unico `ix_clinicas_email`
  - `usuarios.email` possui indice unico `ix_usuarios_email`
  - `prestador_odonto` possui `uq_prestador_odonto_clinica_source`
  - `unidade_atendimento` possui `uq_unidade_atendimento_clinica_source`
  - `access_profile` possui `uq_access_profile_clinica_source`
  - `usuario_perfil_acesso` possui `uq_usuario_perfil_acesso`
  - FKs relevantes nao sao deferrable

## Estrategia escolhida
- Estrategia preliminar mantida: `MIG-A`.
- A clinica `ID 13` pode ser preservada no cluster 17 porque esta livre.
- O dry-run deve considerar o ciclo `usuario <-> prestador_odonto` com inserts iniciais nulos em uma das pontas, seguido de atualizacao de vinculos.

## Ordem preliminar de migracao
Ordem proposta, respeitando dependencias reais:
1. `clinicas`
2. `unidade_atendimento`
3. `usuarios` com `prestador_id` temporariamente nulo quando necessario
4. `prestador_odonto` com `usuario_id` ajustado apos inserir usuarios, se necessario
5. atualizacao dos vinculos cruzados `usuarios.prestador_id` e `prestador_odonto.usuario_id`
6. `access_profile`
7. `usuario_perfil_acesso`
8. tabelas auxiliares com `clinica_id = 13`
9. tabelas dependentes de usuarios/prestadores/unidades/procedimentos
10. `plataforma_assinaturas` se existir registro para a clinica 13
11. `plataforma_auditoria` somente se o usuario autorizar em etapa futura
12. ajuste final de sequences via `setval`

## Grupos a migrar, avaliar e nao migrar

### Migrar
- `clinica ID 13`
- usuarios da clinica 13
- prestadores da clinica 13
- unidade principal
- `access_profile` da clinica 13
- tabelas auxiliares com `clinica_id = 13`

### Avaliar
- `plataforma_auditoria`
- logs
- dados muito volumosos
- dados derivados/seed que possam ser recriados
- tabelas com dependencias mais complexas
- `plataforma_assinaturas` caso exista registro efetivo para a clinica 13

### Nao migrar
- dados globais sem `clinica_id`
- configuracoes de ambiente
- dados de outros tenants
- backups/dumps
- sequences como copia direta; apenas ajuste final com `setval`

## Arquivo SQL dry-run
- Caminho criado: `docs/dry_run_migracao_conta13_pg18_para_pg17.sql`
- O arquivo nao foi executado nesta etapa.

## Validacoes pre-migracao obrigatorias futuras
- backups recentes confirmados
- PostgreSQL 17 ativo
- PostgreSQL 18 acessivel
- conflitos de ID e e-mail ausentes
- usuario autorizar execucao

## Validacoes pos-migracao futuras
- clinica ID 13 aparece no cluster 17
- usuarios 30/31 aparecem
- login `pagamentosccb@gmail.com` funciona, se aplicavel
- prestadores, unidade e perfis aparecem
- o sistema abre a conta
- sequences consistentes
- cluster 18 ainda preservado ate validacao final

## Riscos
- dependencias ocultas
- sequences
- constraints unicas
- mojibake preservado
- dados volumosos
- auditoria/logs
- FK circular usuario/prestador

## Critério de parada
- Parar antes de qualquer execucao se surgir conflito novo de ID, e-mail, sequence, FK, regra de negocio ou dependencia nao mapeada.
- Parar tambem se o dry-run ainda nao cobrir tabela sensivel descoberta depois.

## Proxima etapa recomendada
- Subetapa D somente depois de aprovacao explicita: execucao controlada da migracao em transacao, ou refinamento adicional do SQL se o dry-run ficar incompleto.

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
- SQL dry-run nao executado.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- O plano dry-run da migracao da conta `ID 13` foi preparado com ordem, dependencias, grupos e validacoes para a futura execucao controlada.
