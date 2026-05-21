# Auditoria de fechamento EasyDental x Brana Cloud - contrato de usuarios

## 1. Titulo
Auditoria de fechamento EasyDental x Brana Cloud - contrato de usuarios

## 2. Objetivo
Fechar, por leitura e comparacao, as pendencias restantes do pre-contrato funcional do modulo Usuarios para novas contas, com foco em:
- permissoes padrao por Tipo do usuario;
- senha administrativa/protegida;
- perfis funcionais de acesso e relacao com prestadores;
- nascimento de `access_profile`/perfis funcionais em novas contas;
- fonte oficial dos perfis funcionais;
- relacao entre Tipo do usuario, Associar a prestador, Permissoes de acesso e Perfis de acesso;
- diferencas aceitaveis entre EasyDental desktop e Brana Cloud SaaS.

## 3. Branch conferida
- `modularizacao-segura-fase-1`

## 4. Estado inicial do git
- Branch atual confirmada: `modularizacao-segura-fase-1`
- O workspace ja continha varios `?? docs/...` anteriores e nao relacionados a esta auditoria.
- Nao houve alteracao em codigo nesta etapa.

## 5. Documento base usado
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`

## 6. Fontes Brana Cloud consultadas
### Codigo
- `backend/services/signup_service.py`
- `backend/routes/auth_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/services/access_profiles_service.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/models/usuario.py`
- `backend/models/clinica.py`
- `backend/models/prestador_odonto.py`
- `backend/routes/cadastros_routes.py`
- `backend/routes/prestadores_routes.py`
- `backend/security/permissions.py`
- `backend/security/admin_password.py`
- `backend/security/dependencies.py`
- `backend/security/trial_middleware.py`
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/js/modules/auxiliares.js`
- `frontend/index.html`

### Documentos
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/auditoria_fina_frontend_admin_usuarios.md`
- `docs/auditoria_fina_user_admin_permissoes.md`
- `docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/04_funcionalidades.md`
- `docs/06_seguranca.md`
- `docs/07_fluxos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- varios docs de `docs/_historico_auditoria/`

## 7. Fontes EasyDental consultadas
### Diretivos/arquivos locais em modo somente leitura
- `D:\UTIL\EasyDental_7.6_BR\Readme.doc`

### Disponibilidade de referencia legada
- `Y:\EDS70` nao estava disponivel neste ambiente (`Test-Path` retornou `False`).
- `D:\UTIL\EasyDental_7.6_BR` estava disponivel (`Test-Path` retornou `True`).

## 8. Confirmacao de leitura somente
- O EasyDental/legado foi usado apenas como referencia de leitura.
- Nao houve copia de arquivo, edicao, salvamento, importacao, migracao ou execucao corretiva no legado.

## 9. Confirmacao de que nada foi criado/alterado nas pastas EasyDental/legado
- Confirmado.
- Nenhum arquivo foi criado, alterado ou salvo nas pastas do EasyDental/legado.

## 10. Observacao EasyDental desktop x Brana Cloud SaaS
- EasyDental e desktop.
- Brana Cloud e SaaS.
- A logica funcional principal deve ser preservada.
- Adaptacoes tecnicas sao aceitaveis quando derivam do modelo SaaS.
- Diferencas que mudarem regra de negocio devem ser destacadas como decisao de produto.

## 11. Permissoes padrao por Tipo do usuario no EasyDental
### Evidencias encontradas
No `Readme.doc` do EasyDental local aparecem trechos sobre:
- configuracoes de permissoes de acesso de usuarios;
- novo conceito de `perfil`;
- perfis de acesso definidos como `areas` de acesso de cada usuario;
- cada cirurgiao/prestador com area de acesso especifica;
- controle de usuarios e permissao em contexto de modulo.

### Conclusao comparativa
- O EasyDental confirma o conceito de permissao por usuario e perfil por area.
- Nesta auditoria nao foi encontrado um mapa textual que prove uma matriz identica e fixa por Tipo do usuario para todos os tipos citados, nem um arquivo-seed explicitamente identificado como fonte unica dessa matriz.
- A referencia EasyDental apoia a existencia de perfis e permissoes iniciais, mas nao fecha sozinha todos os detalhes de baseline por tipo.

## 12. Permissoes padrao por Tipo do usuario no Brana Cloud
### Evidencia de codigo
- `backend/security/permissions.py` define `PERMISSION_LEVELS = ("desabilitado", "protegido", "habilitado")`.
- `default_permissions(tipo_usuario, is_admin)` gera o baseline.
- Para `is_admin=True`, todos os modulos nascem `habilitado`.
- Para `tipo_usuario == "Clínica"`, `usuarios`, `prestadores`, `financeiro`, `relatorios` e `configuracao` nascem `protegido`, enquanto outros modulos podem nascer `habilitado`.
- Para tipos administrativos/auxiliares, varios modulos nascem `desabilitado` ou `protegido`.

### Comparacao
- O Brana Cloud tem baseline claro por Tipo do usuario.
- Isto combina com a ideia de heranca funcional do EasyDental, mas e mais explicito e programatico no SaaS.
- O comportamento atual nao indica baseline universal totalmente igual para todos os usuarios.

### Recomendacao para o contrato
- Registrar que o baseline por Tipo do usuario e parte do contrato atual do Brana Cloud.
- Registrar tambem que a matriz pode ser ajustada por produto se a clinica demandar outra politica para novos perfis de usuario.

## 13. Senha administrativa/protegida no EasyDental
### Evidencia encontrada
- O `Readme.doc` mostra o conceito de permissao/perfil e de liberacao por senha em contexto de controle de acesso.
- A referencia consultada confirma a existencia funcional de um mecanismo de liberacao/protecao.

### Limite da evidência
- Nesta auditoria nao foi localizado um armazenamento textual claramente separado para a senha administrativa/protegida em outro campo proprio do legado consultado.

### Conclusao comparativa
- O EasyDental confirma a ideia funcional de senha/liberacao protegida.
- A separacao fisica do armazenamento nao ficou comprovada nesta auditoria.

## 14. Senha administrativa/protegida no Brana Cloud
### Evidencia de codigo
- `backend/security/admin_password.py` resolve o admin da clinica e valida `verify_password(senha, admin.senha_hash)`.
- `backend/security/dependencies.py` aceita `X-Protected-Password` e `X-Protected-Grant`.
- O frontend usa `ensureProtectedGrant()`, `unlockProtectedGrant()` e reexecuta chamadas com `X-Protected-Grant`.

### Comparacao
- O Brana Cloud usa a `senha_hash` do admin da clinica para desbloqueio protegido.
- Isso preserva a finalidade funcional de liberar modulos protegidos.
- Contudo, nao ha campo proprio separado de senha administrativa/protegida no estado atual do codigo.

### Recomendacao para o contrato
- Registrar que, funcionalmente, a senha de login e a senha administrativa/protegida tem finalidades diferentes.
- Registrar como pendencia de produto/técnica se o armazenamento precisa ser separado ou se a implementacao atual e aceitavel.

## 15. Perfis funcionais de acesso no EasyDental
### Evidencia encontrada
- O `Readme.doc` diz que o sistema de perfis permite definir `areas` de acesso de cada usuario.
- O texto associa cada cirurgiao/prestador a uma area de acesso especifica.
- Os docs historicos do Brana Cloud reforcam a leitura de heranca EasyDental para perfis e vinculos.

### Conclusao comparativa
- O EasyDental confirma a ideia de perfis como areas funcionais e acesso por prestador/contexto.
- A estrutura conceitual de perfis funcionais e consistente com a leitura de `Perfis de acesso` no Brana Cloud.

## 16. Perfis funcionais de acesso no Brana Cloud
### Evidencia de codigo
- `backend/security/permissions.py` define `ACCESS_PROFILE_SCHEMA` com perfis como:
  - Administrador
  - Clínica
  - Cirurgião dentista
  - Auxiliar odontológico(a)
  - Funcionário(a) administrativo(a)
  - Gerente administrativo
  - Atendente
- `backend/services/access_profiles_service.py` le `sis_perfil_sql.csv` na raiz do projeto.
- `backend/routes/user_admin_routes.py` expõe `GET /admin/users/{id}/profiles` e `PATCH /admin/users/{id}/profiles`.
- O frontend renderiza a aba de perfis com uma lista de perfis funcionais e um quadro de prestadores.

### Comparacao
- O Brana Cloud confirma a separacao entre `Permissões de acesso` e `Perfis de acesso`.
- A interpretacao funcional e compatível com o EasyDental: perfis sao areas/contextos, nao cargos padrao.

### Recomendacao para o contrato
- Registrar `Perfis de acesso` como perfis funcionais/areas, e nao como cargos.
- Registrar que `access_profile` e `usuario_perfil_acesso` fazem parte do contrato funcional do SaaS.

## 17. Quadro superior Perfil x quadro inferior Prestadores
### EasyDental
- A referencia textual consultada indica areas de acesso por usuario e associacao por prestador/cirurgiao.

### Brana Cloud
- `usersPerfRenderProfiles()` monta a lista superior de perfis.
- `usersPerfRenderPrestadores()` monta os prestadores do perfil selecionado.
- `usersPerfHandlePrestadorChange()` salva o vinculo usuario + perfil + prestador.

### Comparacao e recomendacao
- A estrutura do Brana Cloud e coerente com a leitura funcional do EasyDental.
- O contrato deve explicitar que o quadro superior representa perfis funcionais e o inferior representa prestadores marcaveis.

## 18. Papel de access_profile
### Brana Cloud
- `backend/services/access_profiles_service.py` depende de `sis_perfil_sql.csv` na raiz do projeto.
- Se o arquivo nao existe, a leitura retorna lista vazia.
- `GET /admin/users/{id}/profiles` usa os perfis resultantes para renderizar a aba.

### Comparacao com a referencia
- O conceito de perfis funcionais existe em ambos os lados.
- No Brana Cloud atual, a fonte operacional desses perfis depende de seed/CSV.

### Recomendacao para o contrato
- Tratar `access_profile` como estrutura funcional base do contrato do SaaS, nao como cargo de negocio.
- Registrar que a ausencia de `access_profile` deixa a aba vazia, o que e incompativel com o objetivo funcional da tela.

## 19. Papel de usuario_perfil_acesso
### Brana Cloud
- `usuario_perfil_acesso` guarda o vinculo entre usuario, perfil e prestador.
- O endpoint `PATCH /admin/users/{user_id}/profiles` cria esses registros.

### Comparacao com a referencia
- O comportamento bate com a leitura conceitual do EasyDental: usuario + area/perfil + prestador.

### Recomendacao para o contrato
- Registrar `usuario_perfil_acesso` como a tabela de vinculo operacional do perfil funcional com o prestador e o usuario.

## 20. Papel de sis_perfil_sql.csv ou equivalente
### Brana Cloud
- `backend/services/access_profiles_service.py` aponta para `ROOT_DIR / "sis_perfil_sql.csv"`.
- O arquivo nao existe no workspace do Brana Cloud.
- A ausência do arquivo explica `profiles: []` para a clinica 1.

### EasyDental
- A referencia local consultada confirma perfis/areas, mas nao forneceu nesta auditoria um arquivo equivalente identificado com o mesmo nome.

### Recomendacao para o contrato
- Registrar `sis_perfil_sql.csv` como pendencia de fonte oficial/base funcional.
- Se nao voltar como arquivo raiz, a estrutura equivalente precisa existir como seed versionado ou outro mecanismo equivalente, desde que preserve a regra funcional.

## 21. Se access_profile deve nascer como estrutura funcional base
### Evidencia comparativa
- O EasyDental confirma perfis/areas por usuario/prestador.
- O Brana Cloud usa `access_profile` como fonte da tela de perfis.
- Sem `access_profile`, a aba fica vazia.

### Recomendacao
- Sim: para o contrato funcional do SaaS, `access_profile` deve nascer como estrutura funcional base, ou deve haver equivalente oficial que cumpra a mesma funcao.
- Isso nao significa criar cargos padrao como Secretaria/Dentista/Financeiro.
- Significa disponibilizar a base funcional da aba `Perfis de acesso`.

## 22. Diferenca entre cargos padrao e perfis funcionais
- Cargos padrao:
  - seriam classificacoes de negocio/operacao;
  - ex.: Secretario, Dentista, Financeiro.
- Perfis funcionais:
  - sao areas/contextos do sistema;
  - ex.: Agenda de horarios, Controle de estoque, Pacientes, Relatorios.

### Recomendacao
- O contrato deve afirmar que a aba `Perfis de acesso` trabalha com perfis funcionais, nao com cargos padrao.

## 23. Diferenca entre Tipo do usuario e Perfis de acesso
- Tipo do usuario:
  - vem de Tabelas Auxiliares;
  - classifica o usuario;
  - influencia baseline de permissao.
- Perfis de acesso:
  - controlam contexto de prestador em areas funcionais.

### Recomendacao
- Registrar explicitamente que sao conceitos distintos e nao substituiveis.

## 24. Diferenca entre Associar a prestador e Perfis de acesso
- Associar a prestador:
  - define o prestador principal do usuario;
  - e um vinculo de identidade operacional.
- Perfis de acesso:
  - definem em quais areas e contextos o usuario pode operar com quais prestadores.

### Recomendacao
- Registrar que o vinculo principal com prestador e separado do vinculo funcional por perfil.

## 25. Diferenca entre Permissoes de acesso e Perfis de acesso
- Permissoes de acesso:
  - controlam se o usuario pode abrir ou nao modulos;
  - usam permitir/proibir/solicitar senha.
- Perfis de acesso:
  - controlam o contexto funcional por prestador dentro das areas liberadas.

### Recomendacao
- Registrar que uma camada nao substitui a outra.

## 26. Nascimento de novas contas no EasyDental quanto aos pontos pendentes
### O que a referencia consultada sugere
- O EasyDental historicamente trabalha com usuarios, perfis e areas de acesso.
- O `Readme.doc` sugere que o sistema de perfis e parte do conceito de acesso individual por usuario e prestador.

### Limite desta auditoria
- Nao foi possivel, nesta etapa, fechar com certeza absoluta todos os detalhes de bootstrap inicial de novas contas apenas a partir do material consultado.

### Conclusao conservadora
- O EasyDental confirma a linha funcional geral, mas alguns detalhes de implementacao precisam permanecer como decisao de contrato.

## 27. Nascimento de novas contas no Brana Cloud quanto aos pontos pendentes
### Confirmado no codigo
- Nova conta nasce com clinica, usuario ADM, prestador sistemico `Clínica`, licença demo/trial e primeiro acesso.
- O baseline de permissoes existe.
- O tipo de usuario vem de Tabelas Auxiliares.
- `access_profile` depende de `sis_perfil_sql.csv`, que nao existe no workspace.

### Conclusao
- O Brana Cloud cobre a estrutura principal, mas a parte de perfis funcionais depende de fonte/base que ainda precisa ser fechada no contrato.

## 28. Diferenças aceitáveis por SaaS
- Armazenamento/implementacao interna diferente da do desktop, desde que preserve a regra funcional.
- Uso de `senha_hash` do admin para desbloqueio protegido, se o produto aceitar essa equivalência funcional.
- Seed versionado ou fonte interna equivalente para perfis, se a mesma regra funcional for mantida.
- Reposicao da experiencia por API/JSON em vez de arquivos ou tabelas do desktop.

## 29. Diferenças que exigem decisão de produto
- Se a senha administrativa precisa ou nao de armazenamento proprio.
- Se `access_profile` deve ser seed/base oficial obrigatoria.
- Se novas contas devem nascer com perfis funcionais carregados ou com estrutura vazia.
- Se a matriz de permissao por tipo de usuario e fixa ou configuravel.

## 30. Diferenças que indicam correção técnica futura
- `sis_perfil_sql.csv` ausente no workspace e `access_profile` vazio para a clinica 1.
- Possivel necessidade de fonte oficial versionada para perfis funcionais.
- Qualquer divergencia entre o baseline de permissao por tipo e a politica de negocio desejada.

## 31. Pontos confirmados para o contrato definitivo
- primeiro acesso com `setup_completed`;
- prestador sistemico `Clínica` e nao apagavel;
- senha administrativa/protegida com finalidade distinta da senha de login;
- usuario com login proprio;
- tipo do usuario vindo de Tabelas Auxiliares;
- permissao de acesso por modulo em tres estados;
- perfis funcionais por prestador/contexto;
- bloqueio global por licenca vencida.

## 32. Pontos ainda inconclusivos, se houver
- armazenamento proprio versus reaproveitamento de `senha_hash` para a senha protegida;
- fonte oficial definitiva de `access_profile`;
- se novas contas devem nascer com a estrutura funcional base preenchida ou com seed equivalente carregado automaticamente;
- grau de configurabilidade da matriz por Tipo do usuario.

## 33. Recomendacao objetiva para criar o contrato definitivo
O contrato definitivo deve:
- preservar a logica funcional EasyDental herdada;
- explicitar as adaptacoes SaaS;
- formalizar `access_profile` como base funcional do modulo;
- decidir a politica da senha protegida;
- manter a separacao clara entre Tipo do usuario, Associar a prestador, Permissoes de acesso e Perfis de acesso.

## 34. Confirmacao de que nenhum codigo foi alterado
- Confirmado.

## 35. Confirmacao de que banco, seeds e migrations nao foram alterados
- Confirmado.

## 36. Confirmacao de que frontend/backend nao foram alterados
- Confirmado.

## 37. Confirmacao de que EasyDental/legado nao foi alterado
- Confirmado.

## 38. Confirmacao de que blindagem textual/mojibake foi respeitada
- Confirmado.
- Nao houve correcao de textos, acentos, labels, mensagens, placeholders, strings visiveis ou mojibake.

## 39. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 40. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- `git status --short` permanece com os `untracked` antigos do workspace e os documentos novos desta trilha.
- `git diff --stat` nao mostra alteracoes rastreadas em codigo nesta auditoria.

## 41. Proximo passo recomendado
- Criar o contrato funcional definitivo do modulo Usuarios para novas contas, usando este fechamento comparativo como base de decisao.

