# Clínica 8 — Exclusão segura — Etapa 8G — Auditoria e correção final da clínica remanescente — sem `--execute`

## Objetivo
Auditar por que `clinicas.id = 8` permaneceu após a execução parcial autorizada da Etapa 8F e ajustar o runner para permitir o fechamento final seguro da linha da clínica, sem executar exclusão real nesta etapa.

## Contexto
A Etapa 8F executou parcialmente com autorização explícita e removeu os vínculos dependentes da clínica 8, mas a linha da própria clínica permaneceu. O e-mail `institutobrana@gmail.com` ainda não foi liberado. Nesta etapa não houve execução real, apenas auditoria somente leitura, correção mínima do runner e dry-run.

## Auditoria somente leitura do estado parcial
Consultas somente leitura confirmaram:

- `clinicas.id = 8` ainda existe.
- Dados atuais da clínica 8:
  - `id = 8`
  - `nome = Instituto Brana`
  - `email = institutobrana@gmail.com`
  - `ativo = true`
- `institutobrana@gmail.com` não aparece mais em tabelas de usuário/autenticação.
- Vínculos já removidos permanecem zerados:
  - `usuarios` 19/20 = ausentes
  - `prestador_odonto` 13 = ausente
  - `access_profile` por `clinica_id = 8` = 0
  - `etiqueta_modelo` por `clinica_id = 8` = 0
  - `plataforma_assinaturas` da clínica 8 = 0
  - `usuario_perfil_acesso` = 0
  - demais tabelas já tratadas pelo runner = 0
- Não há tabelas restantes com `clinica_id = 8`.
- Não há registros restantes por `usuario_id in (19,20)` ou `prestador_id = 13`.

## Diagnóstico provável do motivo de `clinicas.id = 8` ter permanecido
O fechamento final da clínica ficou em no-op porque o runner tratava a tabela `clinicas` como se fosse uma tabela com coluna `clinica_id`, usando o helper genérico `delete_where_clinica`. Como `clinicas` não possui `clinica_id`, o DELETE final não atingia a linha `id = 8`. Além disso, o runner precisava aceitar o estado parcial atual, no qual usuários, prestador e assinatura já podiam estar ausentes.

## Arquivo alterado
- `backend/scripts/delete_test_clinic_runner.py`

## Correção aplicada no runner
- O runner passou a aceitar o estado parcial atual sem falhar apenas porque usuários, prestador ou assinatura já foram removidos.
- O dry-run agora evidencia explicitamente que `clinicas.id = 8` ainda está remanescente.
- O caminho futuro de execução real foi corrigido para remover a linha da clínica por:
  - `DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email`
- O runner agora verifica que o DELETE final afeta exatamente 1 linha.
- O runner continua com dry-run por padrão.
- `--execute` continua obrigatório para execução real futura.
- `modelos_documento` e `etiqueta_padrao` continuam fora da ordem de exclusão.

## Confirmações
- `--execute` não foi usado nesta etapa.
- Nada foi excluído nesta etapa.
- O banco não foi alterado nesta etapa.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado nesta etapa.
- `frontend`, `seeds`, `signup` e `access_profile` não foram alterados.

## Resultado do dry-run após a correção
- `DATABASE_ATUAL = brana_saas`
- `clinicas.id = 8` ainda existe
- `e-mail` da clínica confere com `institutobrana@gmail.com`
- estado parcial reconhecido corretamente
- `usuarios 19/20` ausentes e tratados como ok no estado parcial
- `prestador 13` ausente e tratado como ok no estado parcial
- `access_profile = 0`
- `etiqueta_modelo = 0`
- `usuario_perfil_acesso = 0`
- `plataforma_assinaturas = 0`
- `VINCULOS_NAO_MAPEADOS = []`
- `AUDITORIA_EMAIL = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- nenhuma trava indevida foi acionada
- nada foi alterado

## Contagens principais confirmadas
- `access_profile: 0`
- `agenda_legado_bloqueio: 0`
- `agenda_legado_evento: 0`
- `anamnese_perguntas: 0`
- `anamnese_questionarios: 0`
- `anamnese_respostas: 0`
- `assinaturas: 0`
- `categoria_financeira: 0`
- `convenio_odonto: 0`
- `doenca_cid: 0`
- `etiqueta_modelo: 0`
- `grupo_financeiro: 0`
- `indice_financeiro: 0`
- `item_auxiliar: 0`
- `lancamento: 0`
- `lista_material: 0`
- `plano_odonto: 0`
- `plataforma_assinaturas: 0`
- `plataforma_cobrancas: 0`
- `prestador: 0`
- `prestador_credenciamento: 0`
- `prestador_credenciamento_odonto: 0`
- `prestador_comissao: 0`
- `prestador_comissao_odonto: 0`
- `prestador_odonto: 0`
- `procedimento: 0`
- `procedimento_fase: 0`
- `procedimento_generico: 0`
- `procedimento_generico_fase: 0`
- `procedimento_generico_material: 0`
- `procedimento_material: 0`
- `procedimento_tabela: 0`
- `relatorio_config: 0`
- `restricao_terapeutica: 0`
- `simbolo_grafico_catalogo: 0`
- `tratamento: 0`
- `unidade_atendimento: 0`
- `usuario_perfil_acesso: 0`
- `usuarios: 0`

## Confirmação do estado parcial
O dry-run reconhece corretamente o estado parcial atual: a clínica 8 permanece como única linha remanescente relevante e o próximo passo em execução futura será remover somente essa linha por `id` e `email`.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Estado final do `git status --short`
Permanece com os untracked preexistentes do repositório e com este documento da Etapa 8G. Não houve diff em arquivos versionados.

## Próxima etapa recomendada
Etapa 8H — execução real final controlada para remover somente `clinicas.id = 8`, com autorização explícita, usando `--execute` uma única vez.
