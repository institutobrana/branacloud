# Clínica 9 — Exclusão segura — Etapa 1 — Diagnóstico somente leitura

## Contexto
- A clinica 9 foi criada automaticamente pelo Codex.
- O objetivo futuro e excluir essa conta para permitir teste manual real pela tela.
- O contrato de exclusao segura foi criado nesta etapa e deve orientar toda a trilha futura.

## Objetivo
Mapear o estado atual da clinica 9 antes de qualquer exclusao.

## Identidade confirmada
- `clinica_id = 9`
- `expected_email = institutobrana@gmail.com`
- usuario sistema esperado: `21`
- usuario admin/dono esperado: `22`
- prestador esperado: `14`
- `access_profile` esperado: `10`
- `etiqueta_modelo` esperado: `83` a `90`

## Resultado das consultas somente leitura

### Clinica 9
- `id = 9`
- `nome = Instituto Brana`
- `email = institutobrana@gmail.com`
- `ativo = true`
- `trial_ate = 2026-05-29 23:02:10.674084`
- `tipo_conta = DEMO 7 dias`

### E-mail `institutobrana@gmail.com`
- Em `clinicas`: presente apenas na clinica 9.
- Em `usuarios/autenticacao`: presente em `usuarios.id = 22`.
- Em `email_codes`: dois registros de signup, um usado e um pendente, ambos vinculados ao e-mail.
- Em `plataforma_auditoria`: nenhum registro encontrado.

### Usuarios
- `usuarios.id = 21`
  - `nome = Clínica`
  - `email = clinica.255.c9@system.brana.local`
  - `clinica_id = 9`
  - `tipo_usuario = Clínica`
  - `is_admin = false`
  - `is_system_user = true`
  - `setup_completed = true`
  - `prestador_id = 14`
- `usuarios.id = 22`
  - `nome = Instituto Brana`
  - `email = institutobrana@gmail.com`
  - `clinica_id = 9`
  - `tipo_usuario = Clínica`
  - `is_admin = true`
  - `is_system_user = false`
  - `setup_completed = false`
  - `prestador_id = null`

### Prestador
- `prestador_odonto.id = 14`
  - `nome = Clínica`
  - `email = null`
  - `clinica_id = 9`
  - `usuario_id = 21`
  - `is_system_prestador = true`
  - `inativo = false`

### access_profile
- Contagem: `10`
- Lista exata:
  1. `Agenda de horarios`
  2. `Controle de estoque`
  3. `Controle de protetico`
  4. `Controle de recibos`
  5. `Creditos na conta corrente`
  6. `Debitos na conta corrente`
  7. `Intervencoes`
  8. `Pacientes`
  9. `Relatorios estatisticos`
  10. `Relatorios financeiros`
- `source_id` observado:
  - `10`
  - `20`
  - `30`
  - `40`
  - `50`
  - `60`
  - `70`
  - `80`
  - `90`
  - `100`

### etiqueta_modelo
- Contagem: `8`
- IDs: `83` a `90`
- Registros:
  - `Envelope1`
  - `Envelope2`
  - `Envelope3`
  - `Pimaco completo (6080)`
  - `Pimaco completo (6081)`
  - `Pimaco completo (A4254)`
  - `Pimaco completo (A4255)`
  - `Pimaco completo (A4256)`
- Relacao com `modelos_documento` e `etiqueta_padrao`:
  - `modelo_documento_id` presente nos registros
  - `padrao_id` presente nos registros
  - `modelos_documento` e `etiqueta_padrao` seguem globais/shared e nao devem ser apagados

### Assinatura / plano / cobranca
- `plataforma_assinaturas`: 1 registro na clinica 9
  - `id = 12`
  - `plano = DEMO`
  - `status = trial`
- `assinaturas`: nenhuma linha vinculada a `clinica_id = 9`
- `plataforma_cobrancas`: nenhuma linha vinculada a `clinica_id = 9`

### Dados reais impeditivos
Nao foram encontrados registros em:
- `pacientes`
- `tratamento`
- `lancamento`
- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `anamnese_respostas`
- `plataforma_cobrancas`
- `usuario_perfil_acesso`

### Tabelas com `clinica_id = 9`
Registros > 0 encontrados:
- `usuarios`: `2`
- `prestador_odonto`: `1`
- `access_profile`: `10`
- `etiqueta_modelo`: `8`
- `plataforma_assinaturas`: `1`
- `procedimento`: `56`
- `procedimento_generico`: `591`
- `procedimento_tabela`: `2`
- `convenio_odonto`: `10`
- `plano_odonto`: `10`
- `categoria_financeira`: `86`
- `grupo_financeiro`: `13`
- `indice_financeiro`: `4`
- `item_auxiliar`: `1226`
- `simbolo_grafico_catalogo`: `138`
- `doenca_cid`: `14486`
- `lista_material`: `1`
- `anamnese_questionarios`: `3`
- `anamnese_perguntas`: `41`

### Vínculos por `usuario_id in (21,22)`
- `prestador_odonto`: 1 registro para `usuario_id = 21`
- Não foram encontrados outros vínculos residuais relevantes por `usuario_id in (21,22)`

### Vínculos por `prestador_id = 14`
- `usuarios`: 1 registro vinculado por `prestador_id = 14`
- Não foram encontrados outros vínculos residuais relevantes por `prestador_id = 14`

### FKs / constraints relevantes
- `usuarios_clinica_id_fkey -> clinicas.id`
- `prestador_odonto_clinica_id_fkey -> clinicas.id`
- `prestador_odonto_usuario_id_fkey -> usuarios.id`
- `access_profile_clinica_id_fkey -> clinicas.id`
- `etiqueta_modelo_clinica_id_fkey -> clinicas.id`
- `etiqueta_modelo_modelo_documento_id_fkey -> modelos_documento.id`
- `etiqueta_modelo_padrao_id_fkey -> etiqueta_padrao.id`

### Clinicas 1 e 4
- Nenhuma relacao direta de exclusao foi identificada com a clinica 9.
- Nao ha evidencias de heranca ou compartilhamento operacional com a nova clinica 9.

## Mapa de vinculos por grupo
- **Núcleo da clínica**: `clinicas.id = 9`, `nome = Instituto Brana`, `email = institutobrana@gmail.com`
- **Usuarios**: `21`, `22`
- **Prestador**: `14`
- **Perfis**: `access_profile` com 10 registros
- **Etiquetas**: `etiqueta_modelo` com 8 registros
- **Assinatura/cobranca**: `plataforma_assinaturas` com 1 registro, `assinaturas` e `plataforma_cobrancas` vazias
- **Dados reais impeditivos**: nenhum encontrado
- **Tabelas auxiliares**: `procedimento`, `procedimento_generico`, `procedimento_tabela`, `convenio_odonto`, `plano_odonto`, `categoria_financeira`, `grupo_financeiro`, `indice_financeiro`, `item_auxiliar`, `simbolo_grafico_catalogo`, `doenca_cid`, `lista_material`, `anamnese_questionarios`, `anamnese_perguntas`
- **Outros vinculos**: `email_codes` com registros de signup

## Riscos identificados
- `modelos_documento` e `etiqueta_padrao` sao globais/shared e nao podem ser apagados por engano.
- O e-mail ja foi reutilizado com sucesso, entao uma exclusao futura precisa preservar o contrato oficial e o dry-run antes de qualquer `--execute`.
- A clinica 9 foi criada por fluxo de runtime/backend, entao a exclusao futura deve respeitar o contrato e nao assumir estado manual da tela.

## Diferenças em relação à clínica 8
- A clinica 9 e recem-criada.
- Nao possui o estado parcial antigo da clinica 8.
- Nao carrega os historicos de correção/exclusao ja usados na clinica 8.
- A exclusao tende a ser menor e mais direta, mas ainda deve seguir o contrato oficial.

## Recomendação da próxima etapa
- Criar ou ajustar runner reutilizavel ou especifico para excluir a clinica 9.
- Gerar backup/export.
- Executar dry-run.
- Somente depois executar `--execute`, se autorizado.

## Confirmações
- somente leitura;
- nada excluído;
- banco não alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT`;
- nenhum `--execute`;
- `frontend`, `backend`, `seeds`, `signup` e `access_profile` não alterados;
- pastas proibidas não tocadas;
- sem `git add`, `commit` ou `push`.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Estado final do git status --short
Permanece com os untracked preexistentes do repositório e com estes documentos da Etapa 9B. Nao houve diff em arquivos versionados.
