# Auditoria profunda EasyDental - manual, instalacao, seeds e regras do modulo Usuarios

## 1. Titulo
Auditoria profunda EasyDental - manual, instalacao, seeds e regras do modulo Usuarios

## 2. Objetivo
Aprofundar a referencia EasyDental, com foco no modulo Usuarios, permissões, perfis de acesso, tipos de usuario, prestadores, senha administrativa/protegida, licenca e nascimento/configuracao inicial, para comparar com o Brana Cloud e atualizar as recomendacoes do contrato funcional definitivo do modulo Usuarios para novas contas.

## 3. Branch conferida
`modularizacao-segura-fase-1`

## 4. Estado inicial do git
- `git status --short`: havia apenas arquivos `untracked` antigos do workspace, sem alteracoes de codigo rastreadas nesta etapa.
- `git diff --stat`: sem diffs rastreados de codigo nesta etapa.
- `git log --oneline -10`: mantinha os commits recentes `d9b3673` e `22e7652` no topo da trilha de Usuarios/Admin.

## 5. Fontes EasyDental consultadas
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_01.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_02.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_03.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_04.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_05.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_06.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_07.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_08.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_09.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_10.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_11.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_12.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_CAP_13.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Help\Manual_EDS70_Completo.pdf`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\eds70.sql`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\eds70_build_0603.sql`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\eds70_build_0608.sql`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\USUARIO.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\SIS_MODULO.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\SIS_FUNCAO.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\SIS_PERFIL.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\_TIPO_USUARIO.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\ANAMNESE_QUEST.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\PRESTADOR.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\UNIDADE.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Dados\Dist\SISTEMA.raw`
- `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\EDS70Tmp.MDB` foi localizado, mas nao foi aberto com escrita nem alterado.
- `Y:\EDS70` foi verificado com `Test-Path` e retornou `False` neste ambiente.

## 6. PDFs/manuais encontrados
- Foram encontrados o manual completo e os capitulos `CAP_01` a `CAP_13`.
- O manual e pesquisavel por texto em varias secoes.
- Nao foi necessário OCR pesado.

## 7. Partes do manual analisadas
- Capitulo 1: instalacao, registro/licenca e primeira abertura.
- Capitulo 2: tour inicial, `usuario-mestre`, menu principal e permissões/perfil.
- Capitulo 3: cadastro de prestadores e relacao com usuarios.
- Capitulo 10: configuracao de usuarios, permissões de acesso, preferencias, tabelas auxiliares e opcoes do sistema.

## 8. Arquivos de instalacao analisados
- `eds70.sql`
- `eds70_build_0603.sql`
- `eds70_build_0608.sql`
- `USUARIO.raw`
- `SIS_MODULO.raw`
- `SIS_FUNCAO.raw`
- `SIS_PERFIL.raw`
- `_TIPO_USUARIO.raw`
- outros `.raw` de referencia do instalador, para contexto de estrutura e seeds.

## 9. Seeds/tabelas/scripts identificados
- Tabelas legadas relevantes no SQL do EasyDental:
  - `USUARIO`
  - `USUARIO_MODULO`
  - `USUARIO_FUNCAO`
  - `USUARIO_PERFIL`
  - `SIS_MODULO`
  - `SIS_FUNCAO`
  - `SIS_PERFIL`
  - `_TIPO_USUARIO`
  - `PRESTADOR`
- Seeds/pacotes relevantes no instalador:
  - `SIS_MODULO.raw`
  - `SIS_FUNCAO.raw`
  - `SIS_PERFIL.raw`
  - `_TIPO_USUARIO.raw`
  - `USUARIO.raw`
- Limitação: os arquivos `raw` sao uma representacao binaria/compactada do pacote legado; a leitura foi suficiente para extrair nomes e relacoes principais, mas nao para reconstituir integralmente todas as regras com a mesma facilidade de um CSV simples.

## 10. Limitacoes encontradas
- `Y:\EDS70` nao estava disponivel.
- Nao foi localizado um manual PDF explicito separado por modulo para Usuarios; o manual pesquisado e o manual completo/capitulos do EasyDental 7.0.
- O manual nao fechou, de forma textual, uma matriz completa de permissões por tipo de usuario para todos os tipos citados.
- O manual nao confirmou uma senha administrativa separada em campo proprio.
- O manual nao descreveu licenca demo/mensal/anual; descreve licenca de instalacao/autorizacao e uso em rede.

## 11. Usuarios no EasyDental
- O manual confirma que existe cadastro de usuarios e login do sistema.
- Ao abrir o EasyDental pela primeira vez, existe apenas o `usuario-mestre` com plenos poderes.
- O manual registra que o cadastro de usuario possui nome, apelido/login, associacao a prestador, unidade de atendimento e inativacao.
- O SQL legado mostra a tabela `USUARIO` com `TIPO`, `APELIDO`, `SENHA`, `PERMISSOES`, `ID_PRESTADOR`, `ID_UNIDADE` e `ALTERASENHA`.

## 12. Tipo do usuario no EasyDental
- O arquivo `_TIPO_USUARIO.raw` traz tipos como:
  - Dentista (CD)
  - Auxiliar (ACD)
  - Secretária(o)
  - Gerente
  - Atendente
  - Protético
  - Perito
  - Vendedor(a)
  - THD
  - Clínica
- O manual mostra que `Tipo do usuario` e um conceito separado de permissões e perfis.
- A evidência de instalacao sugere que os tipos sao baseados em tabela/seed do pacote legado, nao em lista fixa do front.

## 13. Permissões de acesso no EasyDental
- O manual define tres estados para modulos/funcoes:
  - `Desabilitado`: acesso proibido.
  - `Habilitado`: acesso permitido.
  - `Protegido`: acesso permitido mediante senha do usuario.
- O manual afirma que o modulo de permissões permite alterar acesso por modulo e por funcao interna.
- O menu `Configuração` inclui `Usuários` e `Opções do sistema`, e o manual destaca que `Opções do sistema` e configuravel apenas pelo `usuário-mestre`.
- A versão 7.0 introduz explicitamente `novos recursos de permissao e niveis de acesso a modulos do sistema` e `restrição de acesso por módulo e por perfil`.

## 14. Matriz de permissões por Tipo do usuario no EasyDental
- O manual nao fechou uma matriz completa por tipo em texto corrido.
- O SQL legado e os arquivos `USUARIO_MODULO`/`USUARIO_FUNCAO` mostram que a permissao e armazenada por usuario e por nivel, e nao apenas por cargo textual.
- `SIS_MODULO.raw` e `SIS_FUNCAO.raw` listam modulos e funcoes com `PERMITE_SENHA`.
- Conclusao: existe baseline/estrutura de permissao por usuario com suporte a modulos/funcoes protegidos, mas a matriz completa por tipo de usuario nao ficou documentada de forma textual no manual consultado.

## 15. Perfis de acesso no EasyDental
- O manual e o instalador confirmam a existencia de `perfil` e `permissao por perfil` como recurso novo da versao 7.0.
- `SIS_PERFIL.raw` contem perfis funcionais/areas como:
  - Pacientes
  - Intervenções
  - Agenda de horários
  - Créditos na conta corrente
  - Débitos na conta corrente
  - Controle de estoque
  - Controle de protético
  - Controle de recibos
- A relação estrutural do banco legado inclui `USUARIO_PERFIL (ID_USUARIO, ID_PRESTADOR, ID_PERFIL)`.

## 16. Nascimento dos perfis funcionais no EasyDental
- O instalador traz `SIS_PERFIL.raw`, `SIS_MODULO.raw` e `SIS_FUNCAO.raw` como seeds/base do pacote.
- Isso indica que os perfis funcionais nascem junto com a instalacao/base do sistema, e nao como cargos padrao criados manualmente pelo ADM no primeiro uso.
- A base funcional e formada por areas/perfis e modulos/funcoes do sistema.

## 17. Prestadores no EasyDental
- O manual define prestadores como cirurgioes-dentistas, THDs e outros profissionais que atuam diretamente na clinica.
- O cadastro de prestadores existe em `Cadastro - Prestadores`.
- O manual confirma que o apelido do prestador pode ser usado como login se o prestador for usuario do sistema.
- O manual confirma que prestadores podem ou nao ser usuarios do sistema.
- O manual confirma credenciamentos, comissoes, agenda e conta corrente relacionadas a prestador.
- O SQL legado mostra a tabela `PRESTADOR` com campos de identificacao, apelido, tipo, dados cadastrais, conta, alerta e especialidades.

## 18. Associar usuario a prestador no EasyDental
- O manual afirma que todo usuario deve estar vinculado a um prestador previamente cadastrado.
- O campo `Associar a prestador` e explicitamente um vinculo entre o usuario e o prestador.
- Isso define a identidade operacional do usuario dentro da clinica e influencia agenda, conta corrente e outros contextos do sistema.

## 19. Senha administrativa/protegida no EasyDental
- O manual confirma que existe acesso `Protegido` mediante senha do usuario para modulos/funcoes.
- A evidência consultada confirma a senha de protecao como conceito funcional.
- Nao foi localizado, no manual consultado, um campo proprio claramente separado da senha de login para a senha administrativa/protegida.
- A evidencia do pacote legado mostra `SIS_MODULO.raw` e `SIS_FUNCAO.raw` com `PERMITE_SENHA`, indicando que a protecao e uma propriedade do modulo/funcao.

## 20. Licença/vencimento no EasyDental
- O manual do EasyDental 7.0 descreve licenca de instalacao/autorizacao, chave de licenca e uso em rede.
- O manual nao fechou, nas paginas consultadas, um modelo SaaS demo/mensal/anual.
- O Brana Cloud, por outro lado, trabalha explicitamente com `DEMO 7 dias`, `Mensal` e `Anual`.
- Essa diferenca e funcionalmente relevante e deve ser tratada como adaptacao SaaS, nao como copia literal do desktop.

## 21. Comparação com Brana Cloud
- O Brana Cloud preserva a estrutura funcional principal: usuario, prestador, permissões por modulo, perfis funcionais e protecao por senha/grant.
- O Brana Cloud usa `setup_completed`, `protected_password_required`, `X-Protected-Grant`, `access_profile`, `usuario_perfil_acesso`, `tipo_usuario` vindo de Tabelas Auxiliares e licenca por clinica.
- O Brana Cloud tambem usa `senha_hash` do admin da clinica para o desbloqueio protegido.
- O fluxo de primeiro acesso e o fluxo protegido estao implementados no front e no backend atuais.

## 22. Permissões por tipo no Brana Cloud
- A politica atual de baseline esta explicitada em `backend/security/permissions.py`.
- O tipo `Clínica` recebe baseline com modulos sensiveis como `usuarios`, `prestadores`, `financeiro`, `relatorios` e `configuracao` em estado `protegido`.
- Tipos como `Dentista`, `Auxiliar`, `Gerente administrativo`, `Atendente` e `Funcionário(a) administrativo(a)` possuem baselines diferentes.
- Para `is_admin=True`, o baseline e totalmente `habilitado`.

## 23. Tipo do usuario no Brana Cloud
- O combo do modal de usuarios vem de `GET /cadastros/auxiliares?tipo=Tipos de usuário`.
- O front usa `usersTiposCache` e filtra o item `Clínica` do combo do modal.
- O tipo do usuario nao e dono do modulo Usuarios; ele e consumido de Tabelas Auxiliares.
- O banco atual e o codigo mantem esta separacao.

## 24. access_profile no Brana Cloud
- O Brana Cloud implementa `access_profile` e `usuario_perfil_acesso` como a camada de perfis funcionais.
- `backend/services/access_profiles_service.py` tenta carregar `sis_perfil_sql.csv` na raiz do projeto.
- A ausencia desse arquivo no workspace faz `ensure_access_profiles()` retornar vazio para clinicas sem seed local.
- O endpoint `GET /admin/users/{id}/profiles` devolve `profiles`, `prestadores` e `assignments`.

## 25. usuario_perfil_acesso no Brana Cloud
- A relacao de persistencia existe em `backend/models/usuario_perfil_acesso.py` e nas rotas de `user_admin_routes.py`.
- O modelo amarra `usuario_id`, `perfil_id` e `prestador_id`.
- O estado observado no banco atual mostra a tabela vazia, o que explica a aba `Perfis de acesso` sem marcacoes persistidas para a clinica 1.

## 26. Senha protegida no Brana Cloud
- O Brana Cloud usa `verify_admin_password(db, clinica_id, senha)` para validar o desbloqueio protegido.
- A validacao usa a `senha_hash` do admin da clinica, sem ter sido encontrado um campo separado para senha administrativa/protegida.
- O front implementa `ensureProtectedGrant()` e `unlockProtectedGrant()` com retry via `X-Protected-Grant`.
- O fluxo funcional de protecao esta ativo e o problema de ping 403/200 foi corrigido no commit `d9b3673`.

## 27. Diferenças aceitáveis por SaaS
- Persistencia e seeds podem ficar no backend/API em vez de depender do formato legado desktop.
- O Brana Cloud pode usar JSON, APIs e rotas separadas em vez da estrutura interna do executavel desktop.
- A licenca demo/mensal/anual e uma adaptacao SaaS valida, mesmo sem equivalente textual direto no manual do EasyDental.
- O front web pode ter telas e modalizacao distintas, desde que a regra funcional permaneça.

## 28. Diferenças funcionais relevantes
- O EasyDental consultado nao confirmou um armazenamento proprio separado para senha administrativa/protegida; o Brana Cloud reaproveita a `senha_hash` do admin da clinica.
- O EasyDental nao fechou em texto a matriz completa de permissões por tipo de usuario; o Brana Cloud fecha isso explicitamente em codigo.
- O EasyDental traz perfis funcionais como base do sistema; o Brana Cloud depende de `access_profile`/`usuario_perfil_acesso` e hoje a clinica 1 nao os possui em dados persistidos.
- O EasyDental trabalha com licenca de instalacao/autorizacao; o Brana Cloud trabalha com plano/licenca SaaS.

## 29. Pontos confirmados para contrato definitivo
- Nova conta nasce com clinica, ADM/dono e prestador sistemico `Clínica`.
- `Usuario` pode ser ativo/inativo, vinculado a prestador e unidade.
- `Tipo do usuario` vem de Tabelas Auxiliares.
- `Permissões de acesso` controlam `habilitado`, `desabilitado` e `protegido`.
- `Perfis de acesso` sao contextos funcionais por perfil + prestador.
- O acesso final depende de licenca, usuario ativo, login, permissao de modulo, senha protegida quando exigida e contexto de prestador/unidade.

## 30. Pontos ainda inconclusivos
- Se a senha administrativa/protegida deve ter armazenamento proprio ou se a implementacao atual deve ser aceita definitivamente.
- Se `sis_perfil_sql.csv` deve voltar como fonte oficial ou se o seed deve ser versionado no backend.
- Se novas clinicas devem nascer com `access_profile` como estrutura funcional base obrigatoria ou se a tela pode nascer vazia por regra de produto.
- A matriz completa de permissões por tipo de usuario no EasyDental nao foi fechada em texto manual; foi inferida pela estrutura do instalador e do banco.

## 31. Recomendações para contrato final
- Manter `baseline` por Tipo do usuario como regra do Brana Cloud, porque o codigo atual ja faz isso.
- Exigir matriz documentada por Tipo do usuario no contrato final, mesmo que algumas permissões sejam ajustadas depois pelo ADM.
- Exigir `access_profile` como estrutura funcional base para novas clinicas, para a aba `Perfis de acesso` nao ficar vazia.
- Tratar `sis_perfil_sql.csv` como fonte oficial enquanto a estrategia de seed ainda nao for substituida por uma fonte versionada equivalente.
- Registrar explicitamente que senha administrativa/protegida e senha de login tem finalidades diferentes.
- A proxima etapa funcional deve decidir a politica de seed e o armazenamento da senha protegida antes de qualquer novo refinamento de modularizacao.

## 32. Correcoes futuras sugeridas, sem executar
- Reavaliar a origem oficial de `access_profile` para novas clinicas.
- Definir, em produto, se a senha protegida permanece reaproveitando `senha_hash`.
- Documentar a matriz de permissões por tipo em contrato formal.
- Se necessario, estabilizar a fonte de perfis funcionais com seed versionado.

## 33. Confirmacao de que nenhum codigo foi alterado
Nenhum arquivo de codigo foi alterado nesta auditoria.

## 34. Confirmacao de que banco/seeds/migrations nao foram alterados
Nenhum banco, seed ou migration foi alterado. As consultas ao banco, quando feitas, foram apenas `SELECT`.

## 35. Confirmacao de que frontend/backend nao foram alterados
Frontend e backend nao foram alterados nesta auditoria.

## 36. Confirmacao de que EasyDental/legado foi usado somente leitura
O EasyDental foi consultado apenas como referencia historica e funcional, em leitura apenas.

## 37. Confirmacao de que nada foi criado/alterado nas pastas EasyDental/legado
Nada foi criado, editado, movido, copiado ou apagado nas pastas `Y:\EDS70` e `D:\UTIL\EasyDental_7.6_BR`.

## 38. Confirmacao de blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada. Textos visiveis nao foram corrigidos nesta auditoria.

## 39. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 40. Estado final do git
- `git status --short`: apenas `untracked` antigos do workspace e o documento desta auditoria.
- `git diff --stat`: sem mudancas rastreadas de codigo nesta auditoria.

## 41. Proximo passo recomendado
Criar o contrato funcional definitivo do modulo Usuarios para novas contas, agora com as pendencias resumidas e a diferença EasyDental desktop x Brana Cloud SaaS explicitamente separada.
