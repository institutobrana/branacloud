# Ficha Pessoal - Historico - Dependencia do prestador/executante para o campo Cirurgiao responsavel - auditoria Brana

## Objetivo

Auditar documental e tecnicamente se o Brana Cloud ja possui base suficiente para sustentar o campo `Cirurgiao responsavel` da aba `Historico` como campo funcional ligado ao executante/prestador, e mapear com clareza o que ja existe e o que ainda falta para fechar a equivalencia real.

Esta etapa e exclusivamente documental/auditiva. Nao altera frontend, backend, banco, schema, migration, seed, endpoint, model ou persistencia.

## Fontes auditadas

### Brana Cloud

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\ficha-pessoal-aba-historico.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\users-admin-modal-visual.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\usuario.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\prestador.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\prestador_odonto.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\usuario_perfil_acesso.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\tratamento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\auth_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\prestadores_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\tratamentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\user_admin_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\security\dependencies.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\security\user_context.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\signup_service.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_engenharia_reversa.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_6_reclassificacao_funcional_dependencias.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_7_confirmacao_easydental_cirurgiao_regiao_dependencias.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_usuario_prestador_clinica.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_usuarios_permissoes_login_sessao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\comparacao_easydental_regra_usuario_prestador_clinica.md`

## O que existe hoje no Brana sobre prestadores

### Confirmado

- Existe cadastro de prestadores no modelo `PrestadorOdonto`.
- O modelo `PrestadorOdonto` possui `id`, `clinica_id`, `source_id`, `usuario_id`, `codigo`, `nome`, `tipo_prestador`, `executa_procedimento`, `is_system_prestador` e outros campos de cadastro.
- Existe rota de listagem de prestadores em `backend/routes/prestadores_routes.py`.
- A listagem de prestadores retorna o prestador sistemico e os demais itens da clinica.
- O frontend usa `GET /cadastros/prestadores` para montar combos e listas.
- O painel de prestadores existe no frontend e e consumido por `frontend/app.js` e `frontend/js/modules/prestadores.js`.

### Fortemente provavel

- O prestador sistemico `Clinica` e o prestador de uso estrutural/base da conta.
- O sistema ja tem conceito de prestador que executa procedimento, porque `PrestadorOdonto.executa_procedimento` existe e e preservado em setup/criacao.

## O que existe hoje no Brana sobre vinculo usuario/prestador

### Confirmado

- O modelo `Usuario` possui `prestador_id` com FK para `prestador_odonto.id`.
- O modelo `PrestadorOdonto` possui `usuario_id` com FK para `usuarios.id`.
- O modelo `UsuarioPerfilAcesso` possui `prestador_id` junto com `usuario_id` e `perfil_id`.
- O helper `_apply_user_links()` em `backend/routes/user_admin_routes.py` aplica `usuario.prestador_id` e sincroniza `prestador.usuario_id`.
- O helper `_load_prestador_from_same_clinic()` valida prestador da mesma clinica e protege o prestador sistemico.
- O fluxo de criacao/edicao de usuario aceita `prestador_row_id`.
- O `build_user_context()` devolve `prestador_id` no payload de `/me`.
- O login e o contexto de sessao carregam esse vinculo operacional.

### Fortemente provavel

- O vinculo usuario/prestador e parte do contrato operacional da clinica, nao apenas um dado secundario.
- O mesmo vinculo e usado tanto para agenda quanto para permissao e contexto de uso.

## O que existe hoje no Brana sobre contexto de login e sessao

### Confirmado

- `POST /login` gera token com `user_id`, `clinica_id` e `is_admin`.
- `GET /me` devolve `prestador_id`, `unidade_atendimento_id`, `is_admin`, `is_superadmin`, `setup_completed` e permissoes.
- `get_current_user()` carrega o usuario do token, bloqueia conta sistemica sem sessao interativa, bloqueia usuario inativo e exige setup concluido em rotas nao permitidas.
- O frontend armazena o token e monta `sessaoAtual` com o contexto retornado por `/me`.
- O frontend usa `sessaoAtual.prestador_id` como preferencia/fallback em areas de agenda e lista de prestadores.

### Fortemente provavel

- A sessao atual ja possui base suficiente para identificar o profissional logado ou o prestador vinculado ao usuario.
- O contexto de login pode sustentar default por usuario/prestador, desde que a tela consumidora leia esse contexto.

## O que existe hoje no Brana sobre tratamento/intervencao aplicavel ao tema

### Confirmado

- O modelo `Tratamento` possui `cirurgiao_responsavel_id`, `cirurgiao_contratado_id`, `cirurgiao_solicitante_id` e `cirurgiao_executante_id`.
- O modelo `Tratamento` armazena o nome do responsavel/executante em campos auxiliares de texto.
- A rota `/tratamentos/novo/combos` monta a lista `cirurgioes` a partir de usuarios ativos da clinica.
- Essa mesma rota define `cirurgiao_responsavel_id` padrao com `current_user.id`.
- Se o usuario atual nao estiver na lista de cirurgioes, a rota cai para o primeiro item disponivel.
- O fluxo de tratamento ja sabe trabalhar com contexto de usuario logado e com default de cirurgiao.
- O tratamento persiste `source_payload` no JSONB do modelo, e a clinica/paciente tambem recebe informacoes resumidas em `source_payload`.

### Fortemente provavel

- O tratamento ja prova que o Brana tem um ponto de apoio real para default de executante baseado no usuario logado.
- O executante do tratamento e operacionalmente um usuario da clinica, nao um campo isolado sem contexto.

## Pontos reutilizaveis para a aba Historico

### Reutilizaveis hoje

- `PrestadorOdonto` como cadastro base de prestadores.
- `Usuario.prestador_id` como vinculo operacional.
- `PrestadorOdonto.usuario_id` como link inverso.
- `GET /me` com `prestador_id`.
- `sessaoAtual.prestador_id` no frontend.
- `GET /cadastros/prestadores` para lista de selecao.
- `Tratamento.cirurgiao_responsavel_id` e rota `/tratamentos/novo/combos` como prova de default por contexto de usuario.
- `frontend/js/modules/ficha-pessoal-aba-historico.js` como ponto onde a linha do Historico e reaplicada via `extra.historico_aba`.

### Reutilizavel com cautela

- A lista de cirurgioes do tratamento, porque ela esta baseada em usuarios ativos da clinica e pode servir como referencia funcional para o Historico.
- O contexto de sessao e usuario logado, porque ja esta pronto no backend e no frontend.

## Lacunas encontradas

### Confirmado como lacuna

- O modulo `ficha-pessoal-aba-historico.js` continua local e textual para `Cirurgiao` e `Regiao`.
- A aba `Historico` nao esta acoplada diretamente ao contexto de login/prestador.
- Nao existe, no Historico, um caminho explicitamente confirmado para auto-preencher `Cirurgiao` com base no usuario logado.
- Nao existe, no Historico, prova de combo/lista de prestador conectada ao prestador logado.
- Nao existe, no Historico, prova de que a origem visual do campo seja a mesma do legado.
- Nao existe, no Historico, ligacao formal com `Tratamento` para herdar executante/default.

### Nao encontrado

- Nao foi encontrado um helper especifico do Historico para resolver `Cirurgiao` a partir da sessao.
- Nao foi encontrado um endpoint especifico do Historico para buscar prestador default/executante.
- Nao foi encontrado um contrato visual do EasyDental que feche a origem do controle do Historico.

## Classificacao das conclusoes

### Confirmado

- O Brana ja possui cadastro de prestadores.
- O Brana ja possui vinculo usuario/prestador.
- O Brana ja carrega prestador no contexto de sessao.
- O Brana ja possui tratamento com campo de cirurgiao responsavel e default por usuario logado.

### Fortemente provavel

- O Brana ja tem base suficiente para sustentar um campo funcional de executante/prestador.
- O contexto de login ja pode ser usado para apontar um default de profissional.

### Hipotese

- O campo `Cirurgiao` da aba `Historico` pode ser auto-preenchido a partir de `sessaoAtual.prestador_id`, `current_user.id` ou da mesma logica usada no tratamento.
- A aba `Historico` pode compartilhar um pequeno helper de default com tratamento ou com agenda.

### Nao encontrado

- Nao foi encontrado o acoplamento real da aba `Historico` com o contexto de prestador/executante.
- Nao foi encontrado auto-preenchimento confirmado do `Cirurgiao` dentro do Historico.
- Nao foi encontrado combo/lista/lookup do Historico ligado a prestador.

## Resposta objetiva

### Da para sustentar `Cirurgiao` com o que ja existe?

Sim, na parte estrutural e de dominio:

- existe cadastro de prestadores;
- existe vinculo usuario/prestador;
- existe sessao com `prestador_id`;
- existe tratamento com default de cirurgiao por usuario logado.

### Da para fechar a equivalencia real do campo `Cirurgiao` na aba `Historico` somente com o que ja existe?

Nao, ainda nao.

O Brana ja tem a base, mas o modulo do Historico nao usa essa base de forma direta para auto-preencher ou ligar o campo ao executante/prestador.

### E necessario abrir novo ciclo/modulo?

Sim, se a meta for fechar a equivalencia real do comportamento do Historico no estilo EasyDental.

O ciclo novo pode ser pequeno e focado em apoio:

- resolver o default de `Cirurgiao` a partir da sessao/usuario/prestador;
- decidir se o Historico vai usar o mesmo conjunto de cirurgioes do tratamento;
- ligar o Historico ao contexto de tratamento quando houver linha clinica vinculada;
- manter a persistencia atual por `extra.historico_aba` durante a transicao.

## Recomendacao

- Abrir uma frente de apoio para o Historico com foco em default de executante/prestador.
- Reusar a base ja pronta de `usuarios`, `prestador_id`, `GET /me` e `tratamentos/novo/combos`.
- Nao tentar fechar isso apenas por ajuste textual.
- Nao mexer no backend funcional da aba sem contrato claro de default e origem do campo.

## Confirmacao de ausencia de alteracao funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Como testar no sistema

1. Abrir a Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Conferir que o campo `Cirurgiao` continua local/textual hoje.
5. Conferir que a aba nao recebe default automatico de prestador/executante por enquanto.
6. Abrir o modulo de tratamentos e comparar o comportamento de default de cirurgiao com o contexto da sessao.
7. Conferir que nenhuma outra aba da Ficha Pessoal foi afetada.

## Conclusao

O Brana ja tem a espinha dorsal necessaria para representar prestador, vinculo usuario/prestador, contexto de login e default de cirurgiao em tratamento. Porem, a aba `Historico` ainda nao esta amarrada a essa espinha dorsal para fechar o comportamento real de `Cirurgiao responsavel`. Para equivaler ao EasyDental sem improviso, e necessario abrir um pequeno ciclo de apoio ou modulo de integracao do Historico com o contexto de executante/prestador.
