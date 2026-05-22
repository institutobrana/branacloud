# Subetapa 6D - Decisao e Plano Seguro para Correcao de Clinicas Existentes

## Branch
`modularizacao-segura-fase-1`

## Commit base
`86191d4 - Documenta dry-run atualizado de clinicas existentes`

## Objetivo
Registrar a decisao documental e o plano seguro para tratar as clinicas existentes que ainda estao sem `access_profile` ou com `access_profile` incompleto, sem executar qualquer correcao nesta etapa.

## Estado atual confirmado pelo dry-run 6C
- Banco consultado em modo somente leitura: `brana_saas`
- `current_database = brana_saas`
- Clinica 1:
  - `total_expected = 10`
  - `existing = 0`
  - `missing = 10`
  - `skipped = 0`
  - `would_create_count = 10`
- Clinica 4:
  - `total_expected = 10`
  - `existing = 0`
  - `missing = 10`
  - `skipped = 0`
  - `would_create_count = 10`
- Clinica 8:
  - `total_expected = 10`
  - `existing = 3`
  - `missing = 7`
  - `skipped = 0`
  - `would_create_count = 7`
- Perfis existentes na clinica 8:
  - Pacientes
  - Controle de estoque
  - Controle de recibos
- Perfis faltantes na clinica 8:
  - Agenda de horarios
  - Controle de protetico
  - Creditos na conta corrente
  - Debitos na conta corrente
  - Intervencoes
  - Relatorios estatisticos
  - Relatorios financeiros

## Arquivos analisados
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/services/signup_service.py`
- `backend/models/access_profile.py`
- `backend/database.py`
- `backend/.env`
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md`
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Opcoes comparadas

### Opcao A - corrigir todas as clinicas elegiveis de uma vez
Vantagens:
- resolve o conjunto todo em uma unica passagem.

Riscos:
- alteracao ampla no banco principal;
- maior dificuldade de rollback;
- maior risco de efeito colateral;
- menor capacidade de validacao incremental.

### Opcao B - corrigir uma clinica especifica primeiro
Vantagens:
- alteracao menor;
- melhor rastreabilidade;
- permite validar o runner em uma clinica;
- permite confirmar a UI depois em cenario controlado.

Riscos:
- ainda exige autorizacao explicita antes da execucao;
- pode deixar outras clinicas pendentes por mais tempo.

### Opcao C - manter apenas documentado e nao corrigir agora
Vantagens:
- zero risco operacional imediato.

Riscos:
- a UI pode continuar vazia ou incompleta;
- usuarios existentes podem continuar sem `Perfis de acesso`;
- o problema funcional fica documentado, mas nao resolvido.

## Opcao recomendada
Adotar a opcao mais segura:
- primeiro criar um runner controlado e idempotente, sem executar;
- depois executar em uma unica clinica autorizada;
- validar;
- so depois decidir as demais clinicas.

## Clinica sugerida para primeira correcao futura
- Clinica 1 e a candidata mais simples para a primeira correcao controlada, porque esta em `0/10` e nao exige preservacao de perfis parciais.
- Clinica 8 continua exigindo cuidado extra, pois ja possui 3 perfis por nome e deve preservar `Pacientes`, `Controle de estoque` e `Controle de recibos`.

## Plano recomendado para 6E, 6F e 6G
- 6E: criar runner controlado de bootstrap para clinicas existentes, sem executar.
- 6F: executar runner somente para uma clinica especifica autorizada.
- 6G: validar dry-run e leitura apos correcao.
- 6H: decidir as demais clinicas.
- Depois disso: avaliar a estabilizacao da UI da aba `Perfis de acesso`.

## Requisitos minimos para o futuro runner 6E
- receber `clinica_id` explicitamente;
- exigir flag ou argumento de confirmacao;
- confirmar `current_database = brana_saas`;
- nao rodar automaticamente no import;
- usar `ensure_default_access_profiles_for_clinic(db, clinica_id)`;
- nao duplicar logica;
- nao alterar `usuario_perfil_acesso`;
- nao sobrescrever perfis existentes;
- nao apagar perfis existentes;
- retornar resumo `created`/`existing`/`skipped`;
- permitir `dry-run` ou modo execucao separadamente;
- documentar claramente o que faria ou fez;
- nao ser chamado pelo signup;
- nao ser chamado por endpoint;
- nao ser seed automatico.

## Criterios antes de qualquer execucao real 6F
- autorizacao explicita do usuario;
- clinica-alvo informada claramente;
- confirmacao de `current_database = brana_saas`;
- backup ou ponto de reversao definido, se aplicavel;
- resultado do dry-run confirmado;
- lista exata do que sera criado;
- confirmacao de que `usuario_perfil_acesso` nao sera alterado.

## Relacao com a UI
- Nao corrigir UI antes de resolver a base de `access_profile` das clinicas existentes.
- Apos corrigir uma clinica e validar os dados, testar se a aba `Perfis de acesso` passa a ter base funcional.
- So entao estabilizar o layout e o comportamento da aba.

## Confirmacoes de escopo
- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhum bootstrap real foi executado.
- Nenhuma clinica foi corrigida.
- `usuario_perfil_acesso` nao foi alterado.
- `frontend`, `UI` e rotas/endpoints nao foram alterados.

## Riscos remanescentes
- Clinicas existentes podem continuar sem `access_profile` ou com acesso incompleto.
- A UI pode continuar vazia ou inconsistente enquanto a base de dados nao for tratada.
- Correcoes reais devem seguir somente apos autorizacao explicita.

## Proxima etapa recomendada
- Subetapa 6E: criar um runner controlado de bootstrap para clinicas existentes, sem executar.

