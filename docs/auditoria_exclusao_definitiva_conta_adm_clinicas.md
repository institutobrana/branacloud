# Auditoria de exclusao definitiva - ADM Clinicas

Data: 2026-07-21

Diretorio auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch auditada: `modularizacao-segura-fase-1`

HEAD auditado: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`

Remote esperado confirmado: `https://github.com/institutobrana/branacloud.git`

## 1. Decisao final

**B. Precisa atualizar o script antes**

A exclusao definitiva nao pode entrar no painel ADM agora. O repositorio ja contem um endpoint `DELETE /superadmin/clinicas/{clinica_id}` e scripts historicos de exclusao, mas a cobertura atual nao e suficiente para uma acao de painel: a rota backend remove apenas parte dos vinculos atuais do tenant, os runners seguros sao especificos para clinicas de teste antigas, e o script generico nao possui as travas operacionais exigidas pelo contrato vigente.

## 2. Escopo e limites desta auditoria

- Auditoria exclusivamente de leitura sobre codigo, scripts e documentacao.
- Nenhum endpoint foi chamado.
- Nenhum `DELETE`, `UPDATE`, `INSERT`, migracao ou script destrutivo foi executado.
- Nenhum arquivo funcional de frontend, backend, banco ou storage foi alterado.
- Unica criacao autorizada: este documento.
- Sem commit e sem push.

## 3. Checks Git iniciais

- `git status --short`: worktree ja estava suja com muitas alteracoes preexistentes.
- `git branch --show-current`: `modularizacao-segura-fase-1`.
- `git remote -v`: `origin https://github.com/institutobrana/branacloud.git`.
- `git rev-parse HEAD`: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`.
- `git diff --cached --name-only`: vazio.
- `git fetch origin`: executado sem divergencia reportada.
- `git rev-list --left-right --count origin/modularizacao-segura-fase-1...modularizacao-segura-fase-1`: `0 0`.

## 4. Contrato vigente localizado

Arquivo principal: `docs/contrato_exclusao_segura_contas_clinicas.md`.

Regras relevantes:

- Exclusao de conta/clinica nunca deve ser `DELETE` manual simples.
- Deve haver identificacao, diagnostico, plano, backup/export, runner controlado, dry-run, revisao pre-execucao, execucao unica e validacao pos-exclusao.
- Exclusao de clinica deve exigir `clinica_id` e `expected_email`.
- Dry-run deve ser o padrao.
- `--execute` deve ser obrigatorio para execucao real.
- Execucao real deve usar transacao, rollback em erro e commit somente ao final.
- A operacao deve preservar dados de outras clinicas e catalogos globais.
- Qualquer vinculo nao mapeado e criterio de parada.

## 5. Fluxo React atual do botao Excluir

Arquivo: `frontend-react/src/features/admin/clinics/components/ClinicsToolbarContent.jsx`.

Estado encontrado:

- O botao `Excluir` existe na toolbar.
- O botao esta renderizado com `disabled`.
- Nao ha `onDelete`, hook de exclusao ou chamada ao backend a partir do React atual.
- O modulo `frontend-react/src/features/admin/clinics/services/adminClinicActionsApi.js` nao exporta funcao de exclusao.

Conclusao: o frontend React nao dispara exclusao hoje, mas a presenca visual do botao sem fluxo seguro pode induzir implementacao futura perigosa se conectada diretamente a rota existente.

## 6. Endpoint backend existente

Arquivo: `backend/routes/superadmin_routes.py`.

Rota encontrada:

- `@router.delete("/clinicas/{clinica_id}")`
- Funcao: `superadmin_delete_clinica`
- Autorizacao atual: `_require_superadmin(current_user)`
- Bloqueio atual: `_is_owner_clinica(db, clinica.id)`
- Execucao: chama `_delete_clinica_definitiva(db, clinica)` e registra auditoria `clinica_delete_definitivo`.

Problema: a rota existe, mas nao satisfaz o contrato de exclusao segura para acionamento pelo painel.

## 7. Funcao produtiva de exclusao encontrada

Arquivo: `backend/routes/superadmin_routes.py`.

Funcao: `_delete_clinica_definitiva`.

Ela remove explicitamente:

- `procedimento_material`
- `procedimento`
- `material` via listas
- `lista_material`
- `lancamento`
- `categoria_financeira`
- `grupo_financeiro`
- `item_auxiliar`
- `cenario`
- `plataforma_cobrancas`
- `plataforma_assinaturas`
- `assinaturas`
- `usuarios`
- `email_codes`
- `clinicas`

Ela nao cobre todos os modelos atuais com `clinica_id`, nao faz dry-run, nao gera backup/export, nao valida `expected_email`, nao imprime plano, nao valida contagens antes/depois, nao trata storage e nao possui criterio formal de parada para vinculos novos.

## 8. Lacunas principais da rota backend

Tabelas/modelos atuais nao cobertos pela funcao produtiva ou com cobertura insuficiente:

- `access_profile`
- `usuario_perfil_acesso`
- `unidade_atendimento`
- `prestador`
- `prestador_odonto`
- `prestador_credenciamento`
- `prestador_comissao`
- `prestador_credenciamento_odonto`
- `prestador_comissao_odonto`
- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`
- `convenio_odonto`
- `plano_odonto`
- `calendario_faturamento_odonto`
- `contato`
- `controle_protetico`
- `doenca_cid`
- `etiqueta_modelo`
- `indice_financeiro`
- `indice_cotacao`
- `medicamento`
- `restricao_terapeutica`
- `modelos_documento`
- `motivo_agendamento`
- `odontograma_arcada_slots`
- `odontograma_intervencoes`
- `odontograma_dentes`
- `odontograma_faces`
- `pacientes`
- `procedimento_fase`
- `procedimento_generico`
- `procedimento_generico_fase`
- `procedimento_generico_material`
- `procedimento_tabela`
- `protetico`
- `servico_protetico`
- `quadro_avisos`
- `relatorio_config`
- `simbolo_grafico_catalogo`
- `tratamento`

Risco: a exclusao via painel pode falhar por FK, deixar residuos, ou remover parcialmente dados antes de erro se o fluxo de transacao/rollback nao for garantido no nivel adequado.

## 9. Scripts localizados

Scripts de exclusao encontrados:

- `backend/scripts/remover_conta_teste.py`
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/delete_test_clinic_9_runner.py`
- `backend/scripts/delete_test_clinic_10_runner.py`
- `backend/scripts/delete_test_clinic_11_runner.py`
- `backend/scripts/delete_test_clinic_12_runner.py`
- `backend/scripts/delete_test_clinic_15_runner.py`

Scripts de backup historicos relacionados tambem existem para etapas especificas, por exemplo clinicas 9, 10 e 15.

## 10. Classificacao dos scripts

`backend/scripts/remover_conta_teste.py`:

- Generico por e-mail.
- Localiza clinicas por `clinicas.email` e fallback por `usuarios.email`.
- Monta dependencias via inspector, colunas `clinica_id`, FKs para `clinicas`, FKs para `usuarios` e `email_codes`.
- Usa confirmacao interativa `y`.
- Usa transacao em `engine.begin()` para execucao.
- Nao exige `clinica_id`.
- Nao exige `expected_email` pareado com `clinica_id`.
- Pode atingir multiplas clinicas do mesmo e-mail.
- Nao tem dry-run formal com flag imutavel; imprime plano antes da confirmacao.
- Nao faz backup/export.
- Nao tem blindagem Owner/Master/current operator.
- Nao trata storage.
- Nao deve ser usado pelo painel.

`backend/scripts/delete_test_clinic_*_runner.py`:

- Sao runners tecnicos especificos, travados para clinicas de teste.
- Possuem dry-run por padrao e `--execute` explicito.
- Exigem `clinica_id` e `expected_email`.
- Alguns validam ids esperados de usuarios, prestadores e contagens.
- Dependem de lista estatica de tabelas e ordem planejada.
- Nao sao genericos para qualquer tenant do painel.
- Nao cobrem automaticamente novos modelos adicionados depois.
- Nao tratam storage.

## 11. Historico documental de exclusoes reais

Documentos como `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md` e `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md` confirmam o padrao operacional:

- diagnostico somente leitura;
- backup/export antes;
- dry-run sem `--execute`;
- execucao real controlada uma unica vez;
- auditoria pos-exclusao.

Esse historico reforca que a exclusao definitiva ja foi tratada como operacao tecnica controlada, nao como acao direta de painel.

## 12. Inventario de dados por `clinica_id`

O modelo atual possui dezenas de tabelas com escopo de clinica. Principais dominios:

- Identidade e acesso: `usuarios`, `access_profile`, `usuario_perfil_acesso`.
- Organizacao: `clinicas`, `unidade_atendimento`, `prestador`, `prestador_odonto`.
- Agenda: `agenda_legado_evento`, `agenda_legado_bloqueio`, `motivo_agendamento`.
- Pacientes e clinico: `pacientes`, `tratamento`, `anamnese_*`, `odontograma_*`.
- Financeiro: `grupo_financeiro`, `categoria_financeira`, `lancamento`, `indice_financeiro`, `indice_cotacao`.
- Materiais/procedimentos: `lista_material`, `material`, `procedimento`, `procedimento_material`, `procedimento_fase`, `procedimento_generico*`, `procedimento_tabela`.
- Convenios: `convenio_odonto`, `plano_odonto`, `calendario_faturamento_odonto`.
- Protetico: `protetico`, `servico_protetico`, `controle_protetico`, `contato`.
- Plataforma: `assinaturas`, `plataforma_assinaturas`, `plataforma_cobrancas`, `plataforma_auditoria`.
- Cadastros auxiliares: `item_auxiliar`, `doenca_cid`, `etiqueta_modelo`, `simbolo_grafico_catalogo`, `medicamento`, `restricao_terapeutica`, `relatorio_config`, `modelos_documento`, `quadro_avisos`.

Conclusao: qualquer exclusao produtiva precisa ser baseada em inventario dinamico/validado de modelos e constraints, nao somente em uma lista antiga.

## 13. FKs e ordem de exclusao

Foram encontradas FKs com `CASCADE`, `SET NULL`, `RESTRICT` e FKs sem `ondelete` explicito.

Exemplos de risco:

- `controle_protetico.protetico_id` usa `RESTRICT`.
- `usuarios` possui vinculos com prestador/unidade sem cascade completo.
- `usuario_perfil_acesso` vincula usuario, prestador e perfil.
- `tratamento`, `quadro_avisos`, `relatorio_config`, agenda e odontograma podem referenciar usuarios, pacientes, prestadores ou clinica.

Conclusao: a ordem de exclusao precisa ser calculada/testada contra o schema real ou mantida por uma matriz atualizada com testes de cobertura.

## 14. Assinatura, cobranca e auditoria

`_delete_clinica_definitiva` remove `assinaturas`, `plataforma_assinaturas` e `plataforma_cobrancas` da clinica.

Lacunas:

- Nao ha backup/export integrado desses registros.
- Nao ha confirmacao de cancelamento operacional externo.
- `plataforma_auditoria` nao e removida nem formalmente preservada por contrato especifico nesta funcao.
- A rota registra auditoria depois da exclusao, mas nao ha comprovante de dry-run, manifest, backup ou plano.

Recomendacao: auditoria historica deve ser preservada por padrao, mas a politica precisa estar documentada antes de painel.

## 15. Storage local

Storage localizado:

- Criacao: `backend/services/signup_service.py`
- Base: `storage/modelos/clinicas/{clinica_id}`
- Uso operacional: `backend/routes/editor_textos_routes.py` e `backend/services/modelos_service.py`

Lacunas:

- A rota DELETE nao remove storage.
- Os runners historicos auditados nao tratam remocao de storage como etapa transacional.
- Storage nao participa de rollback de banco.
- Remocao fisica exige validacao de caminho, bloqueio de symlink/path traversal, backup/copia previa e plano de compensacao.

Conclusao: exclusao de painel nao pode ser considerada completa sem politica explicita para storage.

## 16. Contas protegidas

Protecoes existentes:

- `is_owner_email` em `backend/security/superadmin.py`.
- `_is_owner_clinica` em `backend/routes/superadmin_routes.py`.
- `is_system_user` em `backend/security/system_accounts.py`.

Limites:

- A rota DELETE exige apenas `_require_superadmin`, nao Owner-only.
- A rota bloqueia clinica owner, mas nao exige confirmacao de operador proprietario.
- Nao ha protecao explicita contra excluir a propria clinica do operador exceto se ela for owner.
- Nao ha trava contra ultima clinica operacional, ambiente errado, backup ausente ou email divergente.
- Scripts genericos nao carregam contexto de operador autenticado.

## 17. Soft delete, suspensao e alternativa segura

O painel ja possui caminho reversivel de status:

- `PATCH /superadmin/clinicas/{clinica_id}/status`
- Acoes de suspender/ativar alteram `clinica.ativo`.
- Esse fluxo sincroniza assinatura e registra auditoria.

Conclusao: para painel, o caminho seguro imediato e manter Suspender/Ativar. Exclusao definitiva deve ficar bloqueada ate existir mecanismo robusto.

## 18. Requisitos minimos antes de painel

Antes de qualquer implementacao de `Excluir` no ADM React:

- Criar runner/servico unico atualizado para o schema atual.
- Exigir `clinica_id`, `expected_email` e confirmacao textual.
- Dry-run padrao e `--execute` explicito.
- Backup/export obrigatorio com manifest e contagens.
- Bloquear Owner/Master, conta do operador, system user indevido, banco inesperado e storage fora da raiz.
- Cobrir todas as tabelas atuais com `clinica_id`, FKs por usuario/prestador/paciente/tratamento e registros auxiliares por e-mail.
- Definir politica para `plataforma_auditoria`.
- Definir politica para storage.
- Ter teste automatizado que falhe quando nova tabela com `clinica_id` nao estiver no plano.
- Ter endpoint de painel somente depois de reutilizar esse mecanismo, preferencialmente em modo enfileirado/operacao tecnica auditavel.

## 19. Por que nao pode entrar no painel agora

- A rota DELETE existe e parece produtiva, mas e incompleta para o modelo atual.
- O frontend nao chama a rota, mas o contrato de acoes ADM cita `DELETE /superadmin/clinicas/{id}`.
- O contrato de exclusao segura exige backup/dry-run/runner, e a rota nao implementa isso.
- O script generico e amplo demais para uso no painel.
- Os runners seguros sao especificos demais para uso no painel.
- Storage nao esta coberto.
- A cobertura de FKs e tabelas novas nao esta garantida.

## 20. Testes e validacoes executadas nesta auditoria

Validacao estatica executada:

```powershell
.\.venv\Scripts\python.exe -m py_compile backend\scripts\remover_conta_teste.py backend\scripts\delete_test_clinic_runner.py backend\scripts\delete_test_clinic_9_runner.py backend\scripts\delete_test_clinic_10_runner.py backend\scripts\delete_test_clinic_11_runner.py backend\scripts\delete_test_clinic_12_runner.py backend\scripts\delete_test_clinic_15_runner.py
```

Resultado: passou sem saida.

Observacao: `py_compile` nao executa exclusao, nao conecta em endpoints e nao altera banco.

## 21. Nao executado

- Nenhum dry-run contra banco, porque esta auditoria nao recebeu alvo descartavel especifico e a decisao nao depende de executar script.
- Nenhum endpoint DELETE.
- Nenhum teste de UI.
- Nenhuma alteracao em banco.
- Nenhuma exclusao de storage.

## 22. Conclusao operacional

O botao `Excluir` deve permanecer desabilitado/desconectado no painel React. A proxima etapa correta e atualizar um mecanismo tecnico de exclusao segura, com cobertura completa do schema atual, backup, dry-run, travas de ambiente e validacao pos-exclusao. So depois disso faz sentido discutir se o painel pode iniciar essa operacao, e mesmo assim preferencialmente como fluxo supervisionado, nao como exclusao direta imediata.
