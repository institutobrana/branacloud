# Contrato funcional definitivo - Modulo Usuarios - Novas contas

## 1. Titulo
Contrato funcional definitivo - Modulo Usuarios - Novas contas

## 2. Status
Contrato funcional definitivo.

## 3. Objetivo
Consolidar as regras funcionais finais do modulo Usuarios para novas contas/clinicas no Brana Cloud, incluindo:
- nascimento da conta;
- primeiro acesso;
- senha protegida;
- permissao por modulo;
- Tipo do usuario;
- Associar a prestador;
- Perfis de acesso;
- access_profile como base funcional;
- licenca da conta;
- diferencas aceitas pelo fato de o Brana Cloud ser SaaS.

## 4. Escopo
Este contrato cobre:
- nova conta e nova clinica;
- primeiro usuario ADM/dono;
- setup inicial;
- Usuarios e Opcoes/Configuracao como modulos sensiveis;
- cadastro de usuarios posteriores;
- permissao por modulo;
- perfis funcionais de acesso;
- tipo do usuario vindo de Tabelas Auxiliares;
- associacao a prestador;
- licenca por conta/clinica;
- relacao com contratos de seeds, prestadores, auxiliares e opcoes do sistema quando houver impacto.

## 5. Fora de escopo
Ficam fora deste contrato:
- alteracao de codigo;
- schema;
- migrations;
- scripts corretivos;
- importacao de dados do EasyDental;
- copia de arquivos do EasyDental;
- correcoes de texto/labels/mojibake;
- redefinicao comercial da licenca fora do contrato funcional aqui descrito;
- criacao ou edicao de perfis reais em bancos existentes sem processo futuro autorizado.

## 6. Referencias documentais usadas
### 6.1 Brana Cloud
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/auditoria_fina_frontend_admin_usuarios.md`
- `docs/auditoria_fina_user_admin_permissoes.md`
- `docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

### 6.2 EasyDental
- `D:\UTIL\EasyDental_7.6_BR\Readme.doc`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Help\Manual_EDS70_Completo.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Help\Manual_EDS70_CAP_01.pdf` a `Manual_EDS70_CAP_13.pdf`
- `USUARIO.raw`
- `SIS_PERFIL.raw`
- `SIS_MODULO.raw`
- `SIS_FUNCAO.raw`
- `_TIPO_USUARIO.raw`
- `PRESTADOR.raw`
- `UNIDADE.raw`
- `SISTEMA.raw`
- `eds70.sql`
- `eds70_build_0603.sql`
- `eds70_build_0608.sql`

## 7. Relacao com contratos existentes
Este contrato complementa e deve ser lido em conjunto com:
- contrato de seeds de novas contas;
- contratos de Prestadores;
- contratos de Tabelas Auxiliares;
- contratos de Opcoes/Configuracao;
- contratos de Licenca/conta, se existirem;
- contratos de Agenda/Conta Corrente, se existirem.

Se houver conflito entre este documento e um contrato anterior, este documento prevalece para o modulo Usuarios em novas contas, salvo decisao futura de produto documentada em revisao formal.

## 8. Nota EasyDental desktop x Brana Cloud SaaS
EasyDental e desktop. Brana Cloud e SaaS.

O contrato preserva a logica funcional principal herdada do EasyDental, mas aceita adaptacoes tecnicas necessarias ao modelo SaaS.

O que e heranca funcional deve ser preservado.
O que e adaptacao SaaS deve ser registrado como tal.
O que ainda depende de decisao de produto nao deve ser tratado como implementacao definitiva fora deste documento.

## 9. Nascimento de nova conta
### Regra oficial
1. Toda nova conta nasce com uma clinica.
2. A clinica recebe um `clinica_id`.
3. Toda nova conta nasce com o primeiro usuario ADM/dono.
4. Toda nova conta nasce com o prestador sistemico `Clínica`.
5. O prestador `Clínica` aparece no modulo Prestadores.
6. O prestador `Clínica` e estrutural/sistemico.
7. O prestador `Clínica` nao pode ser apagado pelo usuario.
8. O prestador `Clínica` tem suporte/configuracao de agenda.
9. A nova conta nasce com licenca/plano associado a clinica/conta.
10. O primeiro acesso fica pendente ate o setup inicial ser concluido.

## 10. Primeiro acesso
### Regra oficial
1. O primeiro usuario da conta e o ADM/dono.
2. O ADM faz login com e-mail + senha.
3. No primeiro acesso, deve aparecer uma tela especial de setup inicial.
4. Essa tela aparece somente enquanto `setup_completed` estiver pendente/falso.
5. A tela informa que o usuario e o administrador/dono da conta.
6. O setup inicial conclui a configuracao inicial da conta.
7. O setup inicial configura/ativa a logica de senha protegida para modulos protegidos.
8. Apos concluido, o setup nao deve reaparecer indevidamente.

## 11. Senha de login x senha protegida
### Regra oficial
1. Senha de login serve para entrar no sistema com e-mail + senha.
2. Senha protegida serve para liberar modulos em estado Protegido.
3. As finalidades funcionais sao diferentes.
4. O ADM pode, na pratica, usar a mesma senha, mas a finalidade no sistema e diferente.
5. A auditoria do EasyDental confirmou o conceito funcional de senha protegida, mas nao encontrou campo proprio separado em `.raw`/`.sql`.
6. O Brana Cloud atual usa a `senha_hash` do admin da clinica para desbloqueio protegido.
7. O contrato aceita a implementacao atual como regra inicial SaaS.
8. A criacao de armazenamento proprio para senha administrativa/protegida fica como evolucao futura opcional, se o produto decidir reforcar separacao tecnica.
9. Essa evolucao futura nao bloqueia o contrato funcional atual.

## 12. Usuarios e Opcoes/Configuracao como modulos sensiveis
### Regra oficial
1. Usuarios e Opcoes do Sistema/Configuracao sao modulos sensiveis.
2. Esses modulos devem nascer protegidos/restritos desde o inicio.
3. O ADM pode acessar esses modulos mediante senha protegida.
4. Usuarios comuns nao devem administrar esses modulos por padrao.
5. Alteracoes futuras de permissao nesses modulos devem ser tratadas com cuidado, pois afetam a seguranca da conta.

## 13. Usuarios criados pelo ADM
### Regra oficial
1. Depois do primeiro acesso, o ADM pode criar usuarios.
2. Usuarios criados pelo ADM tem login proprio.
3. O login do usuario e feito com e-mail + senha.
4. Usuarios podem alterar ou recuperar senha pelo fluxo normal de login.
5. Usuarios podem ser ativos ou inativos.
6. Usuario inativo nao deve acessar o sistema.
7. Usuarios criados pelo ADM podem ser vinculados a unidade de atendimento.
8. Usuarios criados pelo ADM podem ser associados a um prestador principal, quando aplicavel.
9. O ADM pode configurar permissoes por modulo.
10. O ADM pode configurar perfis funcionais/prestadores na aba Perfis de acesso.

## 14. Licenca da conta
### Regra oficial
1. A licenca pertence a conta/clinica.
2. No Brana Cloud, por ser SaaS, a licenca pode ser demo, mensal, anual ou outro modelo definido pelo produto.
3. Se a licenca estiver valida, os usuarios da conta podem acessar conforme suas permissoes.
4. Se a licenca estiver vencida, todos os usuarios daquela conta devem ser bloqueados.
5. O bloqueio por licenca vencida vale para ADM e usuarios comuns.
6. A licenca e uma camada anterior as permissoes internas.
7. Mesmo que o usuario tenha permissao interna, ele nao deve acessar se a licenca estiver vencida.
8. Essa regra e adaptacao SaaS em relacao ao EasyDental desktop, que trabalhava com autorizacao/licenca de instalacao/rede.

## 15. Tipo do usuario
### Regra oficial
1. Tipo do usuario nao e lista fixa interna do modulo Usuarios.
2. Tipo do usuario vem de Tabelas Auxiliares.
3. O modulo Usuarios apenas consome essa lista.
4. Os tipos podem ser alterados em Tabelas Auxiliares.
5. Exemplos atuais vistos na UI:
   - Dentista (CD)
   - Auxiliar (ACD)
   - Secretaria(o)
   - Gerente
   - Atendente
   - Protetico
   - Perito
   - Vendedor(a)
   - THD
6. Esses exemplos nao sao lista imutavel no contrato.
7. Se o ADM alterar Tipos de usuario em Tabelas Auxiliares, o combo de Usuarios deve refletir essa alteracao.
8. Tipo do usuario e classificacao de negocio.
9. Tipo do usuario nao e perfil funcional.
10. Tipo do usuario nao e permissao por modulo.

## 16. Permissoes iniciais por Tipo do usuario
### Regra oficial
1. O Brana Cloud adota baseline inicial de permissoes por Tipo do usuario e por `is_admin`.
2. Essa politica esta implementada atualmente em `backend/security/permissions.py`.
3. A auditoria EasyDental confirmou permissoes por modulo/funcoes e estados `Desabilitado`, `Habilitado` e `Protegido`.
4. A auditoria EasyDental nao encontrou uma matriz textual unica e completa por Tipo do usuario em `.raw`/`.sql`/manual.
5. Assim, o baseline por Tipo do usuario no Brana Cloud deve ser tratado como politica SaaS oficial inicial, compativel com a logica funcional herdada, mas nao como copia literal comprovada do EasyDental.
6. Essa matriz deve ser documentada, versionada, auditavel e ajustavel por decisao de produto.
7. O ADM pode alterar as permissoes depois no modulo Usuarios.
8. Alteracoes futuras nessa matriz devem ser feitas em etapa propria, com documentacao e testes.

## 17. Estados de permissao
Cada modulo/função pode assumir estados equivalentes a:

1. Habilitado / Permitir acesso:
   - o modulo aparece normal;
   - o usuario consegue abrir.

2. Desabilitado / Proibir acesso:
   - o modulo aparece no menu com aparencia apagada/desabilitada;
   - o usuario nao consegue abrir.

3. Protegido / Solicitar senha:
   - o modulo aparece;
   - ao clicar, o sistema solicita senha protegida;
   - se validada, o modulo abre;
   - se nao validada, o modulo nao abre.

## 18. Associar a prestador
### Regra oficial
1. O campo `Associar a prestador` no cadastro de usuario define o prestador principal associado ao usuario.
2. A lista vem do modulo Prestadores.
3. Esse vinculo e diferente da aba Perfis de acesso.
4. Esse vinculo ajuda a definir a identidade operacional do usuario dentro da clinica.
5. No EasyDental, o vinculo com prestador aparece como parte importante do cadastro de usuario.
6. No Brana Cloud, esse vinculo aparece por `prestador_row_id`/`prestador_id`.
7. O prestador associado pode influenciar agenda, atendimento, conta corrente ou outros contextos, conforme regra de cada modulo.

## 19. Perfis de acesso
### Regra oficial
1. Perfis de acesso nao sao cargos.
2. Perfis de acesso nao sao Tipos de usuario.
3. Perfis de acesso nao substituem Permissoes de acesso.
4. Perfis de acesso representam areas/perfis funcionais do sistema.
5. Exemplos:
   - Agenda de horarios
   - Controle de estoque
   - Controle de protetico
   - Controle de recibos
   - Creditos na conta corrente
   - Debitos na conta corrente
   - Intervencoes
   - Pacientes
   - Relatorios estatisticos
   - Relatorios financeiros
6. O quadro superior da aba Perfis de acesso representa o perfil funcional/area.
7. O quadro inferior representa os prestadores marcaveis para o perfil funcional selecionado.
8. Para cada perfil funcional, o ADM marca quais prestadores o usuario pode acessar.
9. Se o prestador estiver marcado naquele perfil funcional, o usuario acessa o contexto daquele prestador naquela area.
10. Se o prestador estiver desmarcado naquele perfil funcional, o usuario nao acessa o contexto daquele prestador naquela area.
11. O vinculo funcional e usuario + perfil funcional + prestador.
12. No EasyDental, isso aparece em `SIS_PERFIL.raw` e `USUARIO_PERFIL`.
13. No Brana Cloud, isso corresponde a `access_profile` e `usuario_perfil_acesso`.

## 20. `access_profile` como base funcional obrigatoria
### Regra oficial
1. Nova clinica nao nasce com cargos/usuarios padrao.
2. Nova clinica nao deve nascer com cargos como Secretaria, Dentista ou Financeiro criados automaticamente como usuarios.
3. Porém, nova clinica deve nascer com a estrutura funcional base de Perfis de acesso.
4. Essa estrutura e representada no Brana Cloud por `access_profile`.
5. `access_profile` e base funcional do sistema, nao cargo.
6. `usuario_perfil_acesso` deve representar os vinculos usuario + perfil funcional + prestador.
7. `usuario_perfil_acesso` pode nascer vazio, salvo vinculos minimos definidos por regra de produto.
8. O ADM configura os vinculos depois.
9. A ausencia de `access_profile` em uma clinica torna a aba Perfis de acesso vazia/incompleta.
10. A clinica 1 sem `access_profile` e estado inconsistente a ser tratado em correcao futura, se autorizado.

## 21. Fonte oficial dos perfis funcionais
### Regra oficial
1. A referencia EasyDental encontrou `SIS_PERFIL.raw` como base funcional.
2. O Brana Cloud nao deve depender de arquivo solto ausente como `sis_perfil_sql.csv` na raiz do projeto.
3. A fonte oficial dos perfis funcionais no Brana Cloud deve ser versionada dentro do projeto.
4. A recomendacao funcional e criar seed versionado no backend ou servico de bootstrap controlado.
5. `SIS_PERFIL.raw`/`sis_perfil_sql.csv` podem servir como referencia historica, mas nao devem ser dependencia operacional solta.
6. A implementacao tecnica deve ser feita em etapa futura separada.

## 22. Diferenca entre Tipo, Prestador, Permissoes e Perfis
O contrato registra explicitamente:

1. Tipo do usuario:
   - vem de Tabelas Auxiliares;
   - classifica o usuario;
   - pode influenciar baseline de permissoes no Brana Cloud;
   - nao e perfil funcional.

2. Associar a prestador:
   - define prestador principal do usuario;
   - vem do modulo Prestadores;
   - nao e permissao por modulo;
   - nao e o mesmo que Perfis de acesso.

3. Permissoes de acesso:
   - definem se o usuario pode abrir modulos/funcoes;
   - usam `Habilitado`, `Desabilitado` e `Protegido`.

4. Perfis de acesso:
   - definem acesso por perfil funcional e prestador;
   - controlam contexto operacional dentro dos modulos permitidos.

## 23. Camadas de acesso
O acesso final de um usuario depende das seguintes camadas:

1. licenca da conta ativa;
2. usuario ativo;
3. login valido;
4. permissao do modulo/função;
5. senha protegida, se o modulo/função estiver Protegido;
6. vinculo com prestador/contexto, quando o modulo depender desse contexto;
7. unidade/prestador/configuracoes especificas de cada modulo.

## 24. Regras para novas clinicas
### Regra oficial
1. Nova clinica nasce com base de conta ativa e primeiro usuario ADM/dono.
2. Nova clinica nasce com prestador sistemico `Clínica`.
3. Nova clinica nasce com licenca/plano associado.
4. Nova clinica nasce com a protecao inicial de `Usuarios` e `Opcoes/Configuracao`.
5. Nova clinica nasce com `Tipo do usuario` vindo de Tabelas Auxiliares.
6. Nova clinica deve nascer com `access_profile` base funcional oficial.
7. Nova clinica nao deve nascer com cargos padrao prontos como usuarios criados automaticamente.
8. O ADM monta usuarios, prestadores vinculados, permissoes e perfis depois do primeiro acesso.

## 25. Regras para clinicas existentes sem `access_profile`
### Regra oficial
1. Clinicas existentes sem `access_profile`, como a clinica 1, nao sao tratadas por este contrato como bootstrap automatico silencioso.
2. O tratamento dessas clinicas exige correcao futura autorizada, com validacao e impacto controlado.
3. A aba Perfis de acesso pode ficar vazia/incompleta enquanto a base funcional nao existir.
4. O contrato nao autoriza criacao retroativa automatica sem decisao de produto.

## 26. Decisoes SaaS assumidas
O Brana Cloud assume como adaptacoes SaaS:
1. licenca demo/mensal/anual por conta/clinica;
2. protected grant via `X-Protected-Grant`;
3. reutilizacao da `senha_hash` do admin da clinica para desbloqueio protegido;
4. `access_profile` como estrutura funcional versionada;
5. tipo do usuario vindo de Tabelas Auxiliares via API/combos;
6. acesso por API/JSON em vez de estrutura desktop nativa.

## 27. Correcoes futuras / alinhamentos tecnicos posteriores
Sem executar nada neste momento, o contrato registra como evolucao futura:

1. criar fonte oficial versionada dos perfis funcionais no backend;
2. garantir que novas clinicas recebam `access_profile` base;
3. tratar clinicas existentes sem `access_profile`, como a clinica 1, somente com autorizacao futura;
4. documentar e, se necessario, refinar a matriz de permissoes por Tipo do usuario em `backend/security/permissions.py`;
5. avaliar futuramente armazenamento proprio para senha protegida, se o produto decidir;
6. alinhar UI da aba Perfis de acesso ao contrato;
7. manter testes manuais do fluxo de nova conta, primeiro acesso, usuarios, permissoes, perfis e licenca.

## 28. Pontos que nao devem ser confundidos
1. Tipo do usuario nao e cargo funcional.
2. Associar a prestador nao e permissao por modulo.
3. Permissoes de acesso nao sao Perfis de acesso.
4. Perfis de acesso nao sao cargos.
5. Senha protegida nao e a mesma coisa que senha de login, mesmo que a implementacao atual possa reaproveitar a mesma credencial.
6. `access_profile` nao e lista de usuarios.
7. `usuario_perfil_acesso` nao e permissao por modulo.

## 29. Impactos sobre outros contratos
Este contrato deve ser referenciado em futuras atualizacoes de:
- contratos de seeds de novas contas;
- contratos de Tabelas Auxiliares;
- contratos de Prestadores;
- contratos de Opcoes/Configuracao;
- contratos de Licenca/conta, se existirem;
- contratos de Agenda/Conta Corrente, se existirem.

## 30. Critérios de teste manual futuro
Quando houver implementacao ou correcao futura, o usuario devera testar:
1. cadastro de nova conta;
2. primeiro login do ADM;
3. tela de setup inicial;
4. acesso a Usuarios com senha protegida;
5. acesso a Opcoes/Configuracao com senha protegida;
6. criacao de usuario comum com e-mail e senha;
7. recuperacao/alteracao de senha do usuario comum;
8. combo Tipo do usuario vindo de Tabelas Auxiliares;
9. combo Associar a prestador vindo de Prestadores;
10. aba Permissoes de acesso;
11. modulo Habilitado abrindo normalmente;
12. modulo Desabilitado aparecendo apagado e nao abrindo;
13. modulo Protegido pedindo senha;
14. aba Perfis de acesso com perfis funcionais carregados;
15. marcacao/desmarcacao de prestadores por perfil funcional;
16. licenca valida permitindo login;
17. licenca vencida bloqueando todos os usuarios da conta.

## 31. Confirmações de escopo
Este contrato foi produzido somente por leitura e comparacao documental.

Nao houve:
- alteracao de codigo;
- alteracao de banco;
- alteracao de seeds;
- alteracao de migrations;
- alteracao de frontend;
- alteracao de backend;
- alteracao do EasyDental/legado;
- criacao ou edicao de arquivos em `Y:\EDS70` ou `D:\UTIL\EasyDental_7.6_BR`.

## 32. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 33. Estado final do git
- Branch conferida: `modularizacao-segura-fase-1`
- O workspace ja continha varios `?? docs/...` anteriores e nao relacionados a esta etapa.
- O arquivo deste contrato ficou salvo como documento novo para revisao posterior.

