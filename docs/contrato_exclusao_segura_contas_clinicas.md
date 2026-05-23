# Contrato de exclusão segura de contas e clínicas — Brana Cloud

## Objetivo
Nenhuma exclusao de conta ou clinica deve ser feita como DELETE manual simples.

Toda exclusao deve ser:
- identificada;
- diagnosticada;
- documentada;
- reversivel por backup;
- testada em dry-run;
- executada uma unica vez;
- validada apos execucao;
- registrada em documento.

## Escopo
Este contrato se aplica a exclusoes de:
- clinica/conta;
- usuario dono/admin;
- usuario sistema;
- prestador vinculado;
- dados de teste;
- registros vinculados por `clinica_id`;
- registros vinculados por `usuario_id`;
- registros vinculados por `prestador_id`;
- qualquer entidade cuja remocao possa afetar o sistema.

## Principios obrigatorios
- nunca excluir diretamente no banco sem diagnostico;
- nunca executar DELETE manual avulso;
- nunca excluir por nome, descricao, label, grafia ou texto visivel;
- toda exclusao deve usar IDs validados;
- exclusao de clinica deve exigir `clinica_id` e `expected_email`;
- dry-run deve ser padrao;
- `--execute` deve ser obrigatorio para execucao real;
- execucao real deve ocorrer uma unica vez por etapa autorizada;
- se houver erro, nao repetir `--execute`;
- se houver estado parcial, criar nova etapa especifica de diagnostico/correcao;
- toda execucao real deve usar transacao;
- rollback em erro;
- commit somente ao final;
- nao executar nada no import;
- preservar dados de outras clinicas;
- preservar catalogos globais;
- preservar `modelos_documento` e `etiqueta_padrao` salvo autorizacao especifica;
- respeitar blindagem textual/mojibake.

## Pastas proibidas
Nao alterar, criar, salvar ou documentar nada nas pastas:
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
- `Y:\EDS70`
- `D:\UTIL\EasyDental_7.6_BR`

## Git
Durante exclusao nao usar:
- `git clean`
- `git reset`
- `git restore`
- `git checkout`
- `git switch`
- `git stash`
- `git pull`
- `git merge`
- `git rebase`

E nao usar:
- `git add .`
- `git add -A`
- `git add -u`
- `git add docs`
- `git add backend`

Commit somente com autorizacao explicita e `git add` seletivo de arquivos exatos.

## Etapas obrigatorias de uma exclusao de clinica/conta

### Etapa A — Identificacao
- `clinica_id`;
- `expected_email`;
- nome da clinica;
- usuarios;
- prestador;
- assinatura;
- motivo;
- se e conta real ou teste;
- se o e-mail precisa ser reutilizado.

### Etapa B — Diagnostico somente leitura
- mapear tabelas com `clinica_id`;
- mapear usuarios;
- mapear prestador;
- mapear assinatura;
- mapear `access_profile`;
- mapear `etiqueta_modelo`;
- mapear pacientes, tratamentos, agenda, financeiro, anamnese, procedimentos, materiais, auxiliares;
- mapear FKs e constraints;
- mapear vinculos por `usuario_id` e `prestador_id`.

### Etapa C — Plano de exclusao
- o que sera removido;
- o que nao sera removido;
- ordem de exclusao;
- riscos;
- criterios de parada.

### Etapa D — Backup/export
- criar backup antes de qualquer execucao real;
- salvar dentro do projeto correto;
- nunca salvar em pasta proibida;
- incluir manifest e contagens.

### Etapa E — Runner controlado
- exigir `clinica_id`;
- exigir `expected_email`;
- dry-run padrao;
- `--execute` obrigatorio para execucao real;
- validacoes fortes;
- queries parametrizadas;
- transacao;
- rollback;
- commit final;
- contagens antes/depois.

### Etapa F — Dry-run
- validar sem alterar banco;
- bloquear se houver vinculo inesperado.

### Etapa G — Revisao final pre-execucao
- confirmar backup;
- confirmar dry-run;
- confirmar banco;
- confirmar e-mail;
- confirmar git status;
- confirmar autorizacao humana explicita.

### Etapa H — Execucao real
- executar uma unica vez;
- nao repetir se erro;
- registrar saida;
- confirmar commit ou rollback.

### Etapa I — Validacao pos-exclusao
- clinica removida;
- e-mail liberado;
- usuarios/prestador sem vinculos residuais;
- tabelas por `clinica_id` zeradas;
- catalogos globais preservados;
- outras clinicas nao afetadas.

### Etapa J — Fechamento documental
- consolidar resultado e pendencias.

## Criterios de parada
Parar se:
- `current_database` nao for esperado;
- e-mail nao bater exatamente;
- `clinica_id` nao bater;
- aparecer vinculo nao mapeado;
- aparecer dado real nao previsto;
- backup nao existir;
- dry-run divergir;
- git tiver diff inesperado;
- runner falhar;
- houver duvida humana.

## Checks padrao
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

## Aplicacao obrigatoria futura
Toda nova exclusao de clinica/conta deve comecar lendo este contrato.
