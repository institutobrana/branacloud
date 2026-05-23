# Clínica 8 — Exclusão segura — Etapa 1 — Diagnóstico somente leitura

## 1. Objetivo
Mapear, somente por leitura, os vínculos da clínica 8 e do e-mail `institutobrana@gmail.com` antes de qualquer exclusão futura, para que a etapa seguinte possa ser planejada com segurança, backup e ordem correta de remoção.

## 2. Decisão de negócio
A clínica 8 foi tratada como conta de teste, com e-mail `institutobrana@gmail.com`, e não será saneada nesta trilha.

A estratégia adotada nesta fase é documentar e preparar uma eventual exclusão segura da conta/clínica de teste, para liberar o e-mail e permitir depois um novo cadastro limpo do zero.

## 3. Escopo
Foram analisados, por leitura בלבד:
- `clinicas`
- `usuarios`
- `prestador_odonto`
- `access_profile`
- `usuario_perfil_acesso`
- `assinaturas`
- `plataforma_assinaturas`
- `plataforma_cobrancas`
- `cenario`
- `relatorio_config`
- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `convenio_odonto`
- `plano_odonto`
- `calendario_faturamento_odonto`
- `lista_material`
- `material`
- `procedimento_tabela`
- `procedimento_generico`
- `procedimento_generico_fase`
- `procedimento_generico_material`
- `procedimento`
- `procedimento_material`
- `procedimento_fase`
- `pacientes`
- `tratamento`
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`
- `grupo_financeiro`
- `categoria_financeira`
- `lancamento`
- `item_auxiliar`
- `indice_financeiro`
- `indice_cotacao`
- `medicamento`
- `restricao_terapeutica`
- `etiqueta_modelo`
- `modelos_documento`
- `simbolo_grafico_catalogo`
- `doenca_cid`
- `email_codes`
- `plataforma_auditoria`

## 4. Restrições respeitadas
- Não houve exclusão.
- Não houve alteração de banco.
- Não houve alteração de código.
- Não houve runner de correção.
- Não houve runner de exclusão.
- Não houve commit.
- Não houve push.
- Não houve `git add`.
- Não houve correção textual ou mojibake.
- As pastas proibidas não foram tocadas.

## 5. Metodologia
Leituras somente de diagnóstico:
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`
- consultas `SELECT` via SQLAlchemy usando `.venv\\Scripts\\python.exe`
- leitura de `information_schema` para FKs e delete rules

Banco confirmado por leitura:
- `current_database = brana_saas`

## 6. Resultado do diagnóstico

### 6.1 Núcleo da clínica
| Campo | Valor |
| --- | --- |
| `clinicas.id` | `8` |
| `clinicas.nome` | `Instituto Brana` |
| `clinicas.email` | `institutobrana@gmail.com` |
| `clinicas.tipo_conta` | `DEMO 7 dias` |
| `clinicas.trial_ate` | `2026-05-25 15:29:04.844319` |
| `clinicas.ativo` | `true` |
| `clinicas.criado_em` | `2026-04-13 21:20:57.360549-03:00` |
| `clinicas.opcoes_sistema_json` | `null` |
| `clinicas.nome_tabela_procedimentos` | `Tabela Exemplo` |

### 6.2 Usuários vinculados
| id | codigo | nome | email | is_admin | is_system_user | prestador_id | clinica_id |
| --- | ---: | --- | --- | --- | --- | ---: | ---: |
| `19` | `255` | `Clínica` | `clinica.255.c8@system.brana.local` | `false` | `true` | `13` | `8` |
| `20` | `1` | `Instituto Brana` | `institutobrana@gmail.com` | `true` | `false` | `null` | `8` |

Leitura adicional:
- O e-mail `institutobrana@gmail.com` está preso ao usuário `usuarios.id = 20`.
- O usuário sistema `usuarios.id = 19` está ligado ao prestador `prestador_odonto.id = 13`.

### 6.3 Prestador vinculado
| id | clinica_id | source_id | usuario_id | codigo | nome | is_system_prestador |
| --- | ---: | ---: | ---: | --- | --- | --- |
| `13` | `8` | `255` | `19` | `001` | `Clínica` | `true` |

### 6.4 access_profile
Contagem bruta da clínica 8:
- `16` registros

Registros encontrados:
| id | source_id | nome | reservado |
| --- | ---: | --- | --- |
| `51` | `1` | `Pacientes` | `true` |
| `52` | `2` | `Intervenções` | `true` |
| `53` | `3` | `Agenda de horários` | `true` |
| `54` | `4` | `Créditos na conta corrente` | `true` |
| `55` | `5` | `Débitos na conta corrente` | `true` |
| `56` | `6` | `Controle de estoque` | `true` |
| `57` | `7` | `Controle de protético` | `true` |
| `58` | `8` | `Controle de recibos` | `true` |
| `59` | `9` | `Relatórios estatísticos` | `true` |
| `60` | `10` | `Relatórios financeiros` | `true` |
| `81` | `30` | `Controle de protetico` | `true` |
| `82` | `50` | `Creditos na conta corrente` | `true` |
| `83` | `60` | `Debitos na conta corrente` | `true` |
| `84` | `70` | `Intervencoes` | `true` |
| `85` | `90` | `Relatorios estatisticos` | `true` |
| `86` | `100` | `Relatorios financeiros` | `true` |

Leitura técnica:
- Há mistura de legado acentuado e registros novos sem acento.
- Os `source_id` presentes são `1..10` e depois `30`, `50`, `60`, `70`, `90`, `100`.
- As clínicas 1, 4 e 8 aparecem na mesma família de tabelas com isolamento por `clinica_id`.

### 6.5 Tabelas com registros na clínica 8
| Tabela | Qtde | Observação |
| --- | ---: | --- |
| `usuarios` | `2` | Usuário sistema e usuário dono/admin |
| `prestador_odonto` | `1` | Prestador sistema vinculado ao usuário `19` |
| `access_profile` | `16` | Legado misto com acentos e sem acento |
| `plataforma_assinaturas` | `1` | `status = trial`, `plano = DEMO` |
| `convenio_odonto` | `10` | IDs `61..70` |
| `plano_odonto` | `10` | IDs `61..70` |
| `procedimento_tabela` | `2` | IDs `56` e `57` |
| `procedimento_generico` | `591` | Sem filhos em `procedimento_generico_fase` e `procedimento_generico_material` |
| `procedimento` | `56` | Todos com `tabela_id = 56` e `procedimento_generico_id = null` |
| `lista_material` | `1` | `id = 25` |
| `material` | `244` | Vinculado indiretamente à `lista_material.id = 25` |
| `anamnese_questionarios` | `3` | IDs `7`, `18`, `19` |
| `anamnese_perguntas` | `41` | Distribuição: `7 -> 17`, `18 -> 12`, `19 -> 12` |
| `grupo_financeiro` | `13` | Cadastros auxiliares de financeiro |
| `categoria_financeira` | `86` | Cadastros auxiliares de financeiro |
| `item_auxiliar` | `1226` | Cadastros auxiliares de financeiro |
| `indice_financeiro` | `4` | Índices financeiros |
| `doenca_cid` | `14486` | Catálogo grande e sensível |
| `etiqueta_modelo` | `8` | Referencia `modelos_documento` compartilhado |
| `simbolo_grafico_catalogo` | `142` | Catálogo de símbolos/bitmap |

### 6.6 Tabelas avaliadas sem registros para a clínica 8
| Tabela | Qtde |
| --- | ---: |
| `assinaturas` | `0` |
| `plataforma_cobrancas` | `0` |
| `cenario` | `0` |
| `relatorio_config` | `0` |
| `agenda_legado_evento` | `0` |
| `agenda_legado_bloqueio` | `0` |
| `calendario_faturamento_odonto` | `0` |
| `pacientes` | `0` |
| `tratamento` | `0` |
| `anamnese_respostas` | `0` |
| `lancamento` | `0` |
| `indice_cotacao` | `0` |
| `medicamento` | `0` |
| `restricao_terapeutica` | `0` |
| `usuario_perfil_acesso` | `0` |
| `prestador_credenciamento_odonto` | `0` |
| `prestador_comissao_odonto` | `0` |
| `prestador_credenciamento` | `0` |
| `prestador_comissao` | `0` |
| `modelos_documento` | `0` |

### 6.7 Vínculos indiretos encontrados
| Origem | Vínculo | Resultado |
| --- | --- | --- |
| `lista_material.id = 25` | `material.lista_id` | `244` materiais |
| `procedimento_tabela.id = 56` | `procedimento.tabela_id` | `56` procedimentos |
| `procedimento_generico.id` | `procedimento_generico_fase` / `procedimento_generico_material` | `0` filhos |
| `procedimento.id` | `procedimento_material` / `procedimento_fase` | `0` filhos |
| `anamnese_questionarios.id = 7, 18, 19` | `anamnese_perguntas.questionario_id` | `17 + 12 + 12 = 41` perguntas |
| `clínica 8` | `email_codes` | `0` registros com `institutobrana@gmail.com` |
| `clínica 8` | `plataforma_auditoria` | `0` registros com `actor_user_id in (19,20)` ou `actor_email = institutobrana@gmail.com` |

### 6.8 FKs e constraints relevantes
| Tabela | FK / Constraint | Delete rule | Impacto |
| --- | --- | --- | --- |
| `usuarios` | `usuarios_clinica_id_fkey` | `NO ACTION` | A clínica não pode sair enquanto existir usuário vinculado |
| `prestador_odonto` | `prestador_odonto_clinica_id_fkey` | `NO ACTION` | O prestador bloqueia a exclusão da clínica |
| `prestador_odonto` | `prestador_odonto_usuario_id_fkey` | `NO ACTION` | O usuário `19` não deve ser apagado antes do prestador |
| `access_profile` | `access_profile_clinica_id_fkey` | `NO ACTION` | Perfis da clínica precisam ser removidos antes da clínica |
| `usuario_perfil_acesso` | `usuario_perfil_acesso_*` | `NO ACTION` | Se existirem linhas, bloqueiam usuário, prestador e perfil |
| `assinaturas` | `assinaturas_clinica_id_fkey` | `NO ACTION` | Assinatura da clínica bloquearia remoção direta |
| `assinaturas` | `assinaturas_plano_id_fkey` | `NO ACTION` | Depende de `planos`, que parece ser catálogo global |
| `plataforma_assinaturas` | `plataforma_assinaturas_clinica_id_fkey` | `NO ACTION` | Registro de assinatura plataforma precisa ser tratado |
| `convenio_odonto` | `convenio_odonto_clinica_id_fkey` | `NO ACTION` | Convênios da clínica devem sair antes da clínica |
| `plano_odonto` | `plano_odonto_clinica_id_fkey` | `NO ACTION` | Planos da clínica devem sair antes da clínica |
| `procedimento_generico` | `procedimento_generico_clinica_id_fkey` | `NO ACTION` | Catálogo clínico precisa sair antes da clínica |
| `procedimento` | `procedimento_clinica_id_fkey` | `NO ACTION` | Procedimentos bloqueiam a clínica |
| `lista_material` | `lista_material_clinica_id_fkey` | `NO ACTION` | Lista de materiais precisa sair antes da clínica |
| `material` | `material_lista_id_fkey` | `CASCADE` | Ao remover a lista, os materiais caem em cascata |
| `procedimento_material` | `procedimento_material_procedimento_id_fkey` | `CASCADE` | Filhos do procedimento caem em cascata |
| `procedimento_fase` | `procedimento_fase_procedimento_id_fkey` | `CASCADE` | Filhos do procedimento caem em cascata |
| `procedimento_generico_fase` | `procedimento_generico_fase_procedimento_generico_id_fkey` | `CASCADE` | Filhos do procedimento genérico caem em cascata |
| `procedimento_generico_material` | `procedimento_generico_material_procedimento_generico_id_fkey` | `CASCADE` | Filhos do procedimento genérico caem em cascata |
| `procedimento_generico_material` | `procedimento_generico_material_material_id_fkey` | `CASCADE` | Depende do material |
| `doenca_cid` | `doenca_cid_clinica_id_fkey` | `CASCADE` | É o único FK de clínica com cascata direta observado |
| `indice_cotacao` | `indice_cotacao_indice_id_fkey` | `CASCADE` | Filhos do índice caem em cascata |
| `relatorio_config` | `relatorio_config_usuario_id_fkey` | `NO ACTION` | Em caso de futuro uso, o usuário bloqueia a limpeza |
| `etiqueta_modelo` | `etiqueta_modelo_modelo_documento_id_fkey` | `NO ACTION` | Depende de catálogo compartilhado `modelos_documento` |
| `etiqueta_modelo` | `etiqueta_modelo_padrao_id_fkey` | `NO ACTION` | Depende de catálogo compartilhado `etiqueta_padrao` |

### 6.9 Dados que parecem exclusivos da clínica 8
- `clinicas.id = 8`
- `clinicas.email = institutobrana@gmail.com`
- `usuarios.id = 20`
- `prestador_odonto.id = 13`
- `plataforma_assinaturas.id = 11`
- `lista_material.id = 25`
- `procedimento_tabela.id = 56` e `57`
- `anamnese_questionarios.id = 7`, `18`, `19`
- `access_profile.id = 51..60` e `81..86`

### 6.10 Dados que parecem compartilhados e exigem cautela
- As famílias de tabelas com `clinica_id` também aparecem para as clínicas `1`, `4` e `8`.
- `doenca_cid`, `simbolo_grafico_catalogo`, `etiqueta_modelo`, `procedimento_generico`, `procedimento`, `convenio_odonto`, `plano_odonto`, `grupo_financeiro`, `categoria_financeira`, `item_auxiliar`, `indice_financeiro`, `lista_material`, `material` e `anamnese_*` seguem o padrão multi-clínica.
- `modelos_documento`, `planos`, `tiss_tipo_tabela` e `etiqueta_padrao` são catálogos compartilhados ou globais e não devem ser apagados como se fossem dados da clínica 8.

## 7. Mapa de dependências

### 7.1 Núcleo da clínica
- `clinicas.id = 8`
- `plataforma_assinaturas.id = 11`
- `assinaturas = 0`
- `plataforma_cobrancas = 0`
- `cenario = 0`

### 7.2 Usuários / autenticação
- `usuarios.id = 19`
- `usuarios.id = 20`
- `email_codes = 0` para `institutobrana@gmail.com`
- `plataforma_auditoria = 0` para `actor_user_id in (19,20)` e para `actor_email = institutobrana@gmail.com`

### 7.3 Prestadores
- `prestador_odonto.id = 13`
- `prestador_credenciamento_odonto = 0`
- `prestador_comissao_odonto = 0`
- `prestador_credenciamento = 0`
- `prestador_comissao = 0`

### 7.4 Perfis / permissões
- `access_profile = 16`
- `usuario_perfil_acesso = 0`

### 7.5 Configurações / preferências
- `relatorio_config = 0`
- `unidade_atendimento = 0`
- `plataforma_assinaturas.id = 11`
- `plataforma_cobrancas = 0`

### 7.6 Cadastros auxiliares
- `convenio_odonto = 10`
- `plano_odonto = 10`
- `grupo_financeiro = 13`
- `categoria_financeira = 86`
- `indice_financeiro = 4`
- `item_auxiliar = 1226`
- `doenca_cid = 14486`
- `simbolo_grafico_catalogo = 142`
- `etiqueta_modelo = 8`
- `modelos_documento = 0`

### 7.7 Cadastros clínicos
- `procedimento_tabela = 2`
- `procedimento_generico = 591`
- `procedimento = 56`
- `lista_material = 1`
- `material = 244`
- `pacientes = 0`
- `tratamento = 0`

### 7.8 Agenda
- `agenda_legado_evento = 0`
- `agenda_legado_bloqueio = 0`

### 7.9 Financeiro
- `grupo_financeiro = 13`
- `categoria_financeira = 86`
- `item_auxiliar = 1226`
- `indice_financeiro = 4`
- `lancamento = 0`
- `indice_cotacao = 0`

### 7.10 Anamnese
- `anamnese_questionarios = 3`
- `anamnese_perguntas = 41`
- `anamnese_respostas = 0`

### 7.11 Outros vínculos encontrados
- `lista_material.id = 25` com `244` materiais
- `procedimento_tabela.id = 56` com `56` procedimentos ligados por `tabela_id`
- `procedimento_generico` sem filhos em `procedimento_generico_fase` e `procedimento_generico_material`
- `procedimento` sem filhos em `procedimento_material` e `procedimento_fase`

## 8. Riscos identificados
- FK `NO ACTION` impedindo exclusão direta da clínica enquanto existirem usuários, prestador, perfis e cadastros clínicos.
- FK `NO ACTION` impedindo exclusão direta do usuário `20` enquanto existir algum vínculo indireto que o referencie.
- FK `NO ACTION` entre `prestador_odonto.usuario_id` e `usuarios.id`, o que exige remover o prestador antes do usuário `19`.
- Possível efeito em cascata nos ramos de `material`, `procedimento`, `procedimento_generico` e `indice_financeiro` se a ordem futura não for definida com cuidado.
- Risco de apagar catálogo compartilhado por engano, principalmente `modelos_documento`, `planos`, `tiss_tipo_tabela` e `etiqueta_padrao`.
- Risco de tratar como único o que é multi-clínica: as tabelas com registros também existem para as clínicas `1` e `4`.
- Risco de deixar sobras em tabelas auxiliares não óbvias, como auditoria e códigos de e-mail, mesmo quando o núcleo principal já tiver sido removido.
- Risco de remover a clínica sem backup do estado atual, perdendo o histórico de teste e a trilha de comparação do cadastro limpo.

## 9. Hipótese de ordem futura de exclusão
Hipótese documental, sem execução:
1. Backup lógico e conferência final de escopo.
2. Revisar e remover ramos vazios ou dependentes que já estão zerados.
3. Remover `anamnese_respostas` se surgirem linhas futuras.
4. Remover `lancamento`, `indice_cotacao`, `relatorio_config`, `usuario_perfil_acesso`, `prestador_credenciamento*`, `prestador_comissao*`, `agenda_legado_*`, `contato`, `controle_protetico`, `calendario_faturamento_odonto`, `medicamento`, `restricao_terapeutica`, `plataforma_cobrancas` caso apareçam dados futuros ou se houver necessidade de limpeza explícita.
5. Remover `procedimento_material`, `procedimento_fase`, `procedimento_generico_material`, `procedimento_generico_fase` se vierem a existir em revisões futuras.
6. Remover `procedimento`, `procedimento_generico`, `procedimento_tabela`.
7. Remover `material` e depois `lista_material`.
8. Remover `anamnese_perguntas` e `anamnese_questionarios`.
9. Remover `etiqueta_modelo`.
10. Remover `plataforma_assinaturas`, `plano_odonto`, `convenio_odonto`, `grupo_financeiro`, `categoria_financeira`, `indice_financeiro`, `item_auxiliar`, `doenca_cid`, `simbolo_grafico_catalogo`.
11. Remover `prestador_odonto`.
12. Remover `usuarios`.
13. Remover `clinicas` por último.

Observação:
- Como alguns ramos estão zerados neste diagnóstico, a ordem final real pode ser menor do que a hipótese acima.
- `doenca_cid` merece backup específico porque é volumoso e usa `CASCADE` direto com a clínica.

## 10. Recomendações para a Etapa 2
- Produzir um plano documental de exclusão segura com contagem final por tabela.
- Incluir backup antes de qualquer execução real.
- Validar novamente os vínculos de `usuarios`, `prestador_odonto`, `access_profile`, `plataforma_assinaturas`, `convenio_odonto`, `plano_odonto`, `procedimento`, `procedimento_generico`, `lista_material`, `material` e `anamnese_*`.
- Confirmar que `institutobrana@gmail.com` continua livre para novo cadastro após a limpeza.
- Manter a Etapa 2 somente em nível documental, sem `DELETE`, `UPDATE`, `INSERT`, `TRUNCATE`, `DROP` ou runner.

## 11. Confirmações finais
- Somente `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md` foi criado/modificado nesta etapa.
- Nenhum código foi alterado.
- O banco não foi alterado.
- Nenhum dado foi excluído.
- O frontend não foi alterado.
- O backend não foi alterado.
- `seeds` e runners não foram alterados.
- Não houve `git add`, `commit` ou `push`.
- A blindagem textual/mojibake foi respeitada.
- As pastas proibidas não foram tocadas.
