# Clinica 8 - Exclusao segura - Etapa 3 - Runner controlado sem execucao

## 1. Objetivo
Criar um runner/script de exclusao controlada para a clinica 8, mas sem executar exclusao real nesta etapa.

O foco e disponibilizar a estrutura segura, auditavel e conservadora para a fase futura de dry-run e, somente depois, para uma eventual execucao real autorizada.

## 2. Contexto da decisao
- A clinica 8 e uma conta de teste.
- A clinica 8 nao sera saneada.
- O objetivo futuro e a exclusao segura da conta/clinica de teste ID 8.
- O resultado esperado em uma etapa futura e liberar o e-mail `institutobrana@gmail.com` para um novo cadastro limpo.

## 3. Arquivo criado
- `backend/scripts/delete_test_clinic_runner.py`

## 4. Regras de seguranca implementadas
- Dry-run por padrao.
- `--execute` existe, mas nesta etapa permanece bloqueado por design.
- `--clinica-id` obrigatorio.
- `--expected-email` obrigatorio.
- Clinica travada para `8`.
- E-mail travado para `institutobrana@gmail.com`.
- Validacao de `current_database`.
- Validacao do cadastro carregado por `clinica_id`.
- Validacao do e-mail encontrado.
- Validacao de usuarios vinculados.
- Validacao de prestador vinculado.
- Validacao de assinatura/plataforma quando existir.
- Uso de `SessionLocal` do proprio projeto.
- Queries parametrizadas.
- Nenhum efeito no import.
- Estrutura pronta para transacao/rollback futuro.
- Execucao real bloqueada nesta etapa com erro explicito.

## 5. O que o runner faz em dry-run
- Imprime o modo `DRY-RUN`.
- Mostra o database atual.
- Mostra a clinica encontrada.
- Mostra o e-mail encontrado.
- Mostra os usuarios encontrados.
- Mostra o prestador encontrado.
- Mostra a assinatura/plataforma encontrada.
- Mostra contagens por tabela.
- Mostra a ordem planejada de exclusao.
- Mostra aviso de que nada foi alterado.

## 6. O que o runner ainda nao deve fazer nesta etapa
- Nao deve executar exclusao real.
- Nao deve apagar nada.
- Nao deve alterar banco.
- Nao deve rodar com `--execute` para remover registros.
- Nao deve apagar dados compartilhados.
- Nao deve apagar catálogos globais por nome ou grafia.

## 7. Confirmacoes desta etapa
- O runner nao foi executado com `--execute`.
- Nada foi excluido.
- O banco nao foi alterado.
- O frontend nao foi alterado.
- O backend fora do script autorizado nao foi alterado.
- `seeds`, `signup` e `access_profile` nao foram alterados.

## 8. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## 9. Proxima etapa recomendada
Etapa 4 - executar dry-run controlado do runner, sem `--execute`, registrar a saida e validar contagens.

## 10. Confirmacoes finais
- Somente `backend/scripts/delete_test_clinic_runner.py` e `docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md` foram criados/modificados nesta etapa.
- Nada foi excluido.
- O banco nao foi alterado.
- O runner nao foi executado com `--execute`.
- O frontend nao foi alterado.
- O backend somente recebeu o script autorizado.
- `seeds`, `signup` e `access_profile` nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- As pastas proibidas nao foram tocadas.
