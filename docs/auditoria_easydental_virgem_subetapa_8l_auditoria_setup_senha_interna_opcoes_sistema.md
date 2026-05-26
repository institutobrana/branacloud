# Auditoria EasyDental virgem - Subetapa 8L - setup, senha interna e Opcoes do Sistema

## Contexto

- Referencia as Subetapas 8J e 8K.
- A 8J implementou as 10 tabelas de procedimentos/precos apenas para novas contas.
- A 8K implementou a unidade Principal / 0001 apenas para novas contas.
- Esta 8L trata somente da senha interna do sistema, do setup e das Opcoes do Sistema.
- Login SaaS nao esta em discussao nesta etapa.
- A senha de login SaaS continua obrigatoria sempre.
- Esta etapa e 100% documental e nao implementa nada.
- Observacao de ambiente: o caminho `\\Sonyvaio\\c\\EDS70` nao estava acessivel neste ambiente (`Test-Path` retornou `False`), entao a parte EasyDental foi sustentada por documentos historicos, codigo local do Brana e pela regra observada pelo usuario, sem escrita no legado.

## Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- O setup nao foi alterado.
- A senha de login SaaS nao foi alterada.
- A senha interna nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## Separacao obrigatoria de conceitos

- Login SaaS: autenticacao normal de entrada no sistema.
- Senha de login SaaS: senha usada no login normal com e-mail e senha.
- Senha interna do sistema: segredo administrativo usado para liberar modulos internos protegidos.
- Senha/setup: primeira definicao da senha interna no primeiro acesso.
- Controle interno de usuarios e senhas: flag que liga/desliga a protecao interna.
- Sistema de auditoria: flag separada de auditoria interna.
- Opcoes do Sistema: area onde as flags de seguranca e configuracao sao armazenadas.
- Menu `Configuracoes > Alterar senha`: acao de menu que precisa ser separada conceitualmente entre senha interna e senha de login.

## EasyDental virgem - regra observada pelo usuario

- Em `Opcoes de Sistema > Seguranca`, o checkbox `Ativar controle de usuarios e senhas` nasce desmarcado.
- Em `Opcoes de Sistema > Seguranca`, o checkbox `Ativar sistema de auditoria` nasce desmarcado.
- Com `Ativar controle de usuarios e senhas` desmarcado, o sistema fica liberado, sem exigir senha interna obrigatoria.
- O menu `Configuracoes` nao mostra `Altera senha` inicialmente.
- Quando o controle de usuarios e senhas e ativado, a opcao `Altera senha` passa a aparecer no menu `Configuracoes`.
- O nascimento observado e de sistema aberto/liberado quanto a senha interna.

## EasyDental virgem - achados tecnicos

- A trilha historica do projeto indica `SISTEMA` como registro estrutural unico com identidade da base, versao, preferencias e licenca/instalacao.
- A trilha historica indica `SIS_MODULO` com campo `PERMITE_SENHA`, e boa parte dos modulos depende de senha.
- A trilha historica tambem cita `SIS_PERFIL`, `USUARIO_MODULO`, `USUARIO_FUNCAO`, `USUARIO_PERFIL` e `LOGON`.
- O `LOGON` aparece como tabela/estrutura de apoio a sessao/log, nao como dado de uso a seedar.
- A auditoria desta etapa nao conseguiu reabrir o share EasyDental diretamente neste ambiente, entao a confirmacao fina dos campos virgens fica limitada aos documentos historicos e a regra observada pelo usuario.
- Nao houve escrita no legado.

## Brana Cloud atual - setup

- O setup do Brana nasce com `setup_completed = false` para o usuario inicial da conta.
- O frontend abre a tela de setup quando a sessao retorna `setup_completed === false`.
- A tela de setup pede `Defina sua senha interna`.
- O backend de setup grava `usuario.senha_interna_hash` e marca `usuario.setup_completed = True`.
- `backend/security/dependencies.py` bloqueia o acesso geral ate `setup_completed` ficar verdadeiro, com excecao apenas de `/me`, `/logout` e `/auth/setup/complete`.
- Portanto, no estado atual, o setup participa como gate de liberacao da conta para uso normal.

## Brana Cloud atual - Opcoes do Sistema

- As opcoes de sistema sao persistidas em `clinica.opcoes_sistema_json`.
- O default atual de `seguranca` em `backend/routes/system_options_routes.py` vem com:
  - `ativar_controle_usuarios = True`
  - `ativar_auditoria = True`
- O backend usa `require_admin_password_if_user_control_enabled()` para proteger modulos quando o controle de usuarios esta ligado.
- O modulo `Usuarios` e o modulo `Configuracao` ficam sujeitos a essa protecao.
- O flag `ativar_auditoria` aparece na persistencia e na UI, mas nao foi encontrado, nesta leitura, um gatilho funcional equivalente ao de `ativar_controle_usuarios`.
- O menu `Configuracoes > Alterar senha` existe no HTML, mas no Brana atual ele abre a troca de senha do usuario logado, nao um fluxo interno separado.

## Comparativo EasyDental x Brana

| Item | EasyDental virgem | Brana atual | Diferenca | Risco | Regra proposta |
|---|---|---|---|---|---|
| Login SaaS | Fora da discussao da senha interna | Sempre obrigatorio | Sem conflito conceitual | Baixo | Manter sempre obrigatorio |
| Senha interna / setup | Nao nasce obrigando senha interna, segundo regra observada | `setup_completed = false` bloqueia a conta ate a senha interna ser criada | Brana nasce mais fechada | Alto | Separar login SaaS de senha interna |
| Controle de usuarios e senhas | Nasce desmarcado | Nasce `true` no default de `seguranca` | Brana esta invertido em relacao ao observado | Alto | Nas novas contas, nascer desativado |
| Sistema de auditoria | Nasce desmarcado | Nasce `true` no default de `seguranca` | Brana esta invertido em relacao ao observado | Medio | Nas novas contas, nascer desativado ou ficar pendente, conforme contrato |
| `Configuracoes > Alterar senha` | Aparece depois de ativar o controle interno | Aparece sempre no menu e abre troca de senha do usuario atual | Semantica diferente | Alto | Separar a senha interna da senha de login e condicionar a aparicao ao controle interno |
| Bloqueio de modulos internos | Liberado com controle interno desativado | `Usuarios` e `Configuracao` dependem de protecao quando o controle esta ativo | Brana usa gate mais rigido | Alto | Nas novas contas, abrir os modulos no nascimento e deixar a protecao interna opcional |

## Regra contratual proposta para novas contas Brana

- Login SaaS continua obrigatorio sempre.
- O controle interno de usuarios e senhas deve nascer desativado.
- A auditoria interna deve nascer desativada ou ficar pendente, ate contrato futuro confirmar necessidade.
- A senha interna/setup nao deve nascer obrigatoria.
- `Opcoes do Sistema` e `Usuarios` nao devem depender de senha interna no nascimento.
- A opcao interna `Alterar senha` so deve aparecer depois que o controle interno for ativado.
- O setup nao deve criar nem exigir a senha interna para liberar a conta.
- As configuracoes devem ficar em `Opcoes do Sistema`, nao em um bloqueio de primeiro acesso.

## Itens que nao devem ser alterados no contrato

- Senha de login SaaS.
- Autenticacao da conta.
- Protecao basica de acesso ao SaaS.
- Admin inicial.
- Usuario system.
- Unidade Principal / 0001.
- As 10 tabelas de procedimentos/precos da 8J.
- TISS.
- Permissoes formais, salvo contrato futuro especifico.

## Riscos

| Risco | Impacto | Mitigacao | Teste obrigatorio | Observacao |
|---|---|---|---|---|
| Remover bloqueio interno e expor modulos indevidamente | Alto | Separar login SaaS de senha interna e manter gates por modulo, se necessario | Abrir `Usuarios` e `Opcoes do Sistema` em nova conta | Exige contrato tecnico proprio |
| Confundir senha interna com senha de login | Alto | Tratar as duas senhas como conceitos diferentes no contrato e na UI | Criar nova conta e validar login normal + senha interna | Evita regressao de autenticao |
| Quebrar o menu de usuarios | Alto | Nao misturar setup com permissoes nesta etapa | Acessar `Usuarios` apos o nascimento | O menu nao deve exigir bloqueio indevido |
| Quebrar `Opcoes do Sistema` | Alto | Manter flags e persistencia separadas e documentadas | Abrir `Opcoes do Sistema` em nova conta | O comportamento deve ficar previsivel |
| Quebrar alteracao de senha | Medio | Separar troca de senha de login da senha interna | Testar o menu `Alterar senha` | Hoje a semantica do menu no Brana e diferente do EasyDental |
| Afetar contas existentes | Alto | Limitar qualquer futura mudanca a novas contas | Abrir conta antiga e validar que permanece igual | Conta 16 e baseline |
| Alterar auditoria sem contrato | Medio | Tratar `ativar_auditoria` como pendencia tecnica ate novo contrato | Validar leitura das opcoes sem escrita | Evita decisao prematura |

## Proxima subetapa recomendada

- A proxima etapa mais segura e uma validacao manual da nova conta 8J/8K antes de mexer no setup.
- Motivo: a trilha documental ja separou os conceitos, mas a liberacao pratica da conta e o comportamento do menu ainda merecem confirmacao em uma conta real de teste antes de qualquer contrato de implementacao do setup interno.

## Plano de verificacao

- Somente este documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- Backend nao foi alterado.
- Banco/schema/migrations/seeds/endpoints nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- O setup nao foi alterado.
- A senha de login SaaS nao foi alterada.
- A senha interna nao foi alterada.
- Dados sensiveis nao foram expostos.
- A blindagem textual/mojibake foi respeitada.
