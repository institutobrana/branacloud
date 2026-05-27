# Auditoria EasyDental virgem - Subetapa 8T - validação manual e contrato complementar do usuário ADM/setup

## 1. Contexto

- Esta subetapa referencia as Subetapas 8P, 8K, 8R e 8S.
- A Subetapa 8P corrigiu os seeds das tabelas de procedimentos por tabela EasyDental.
- A Subetapa 8K implementou a unidade Principal / 0001.
- A Subetapa 8R implementou o prestador ADM/Mestre funcional em novas contas, preservando o prestador sistêmico Clínica.
- A Subetapa 8S executou a exclusão segura da clínica 11 para liberar `institutobrana@gmail.com`.
- Nesta 8T houve validação manual da nova conta criada depois dessas etapas.
- O teste passou nos pontos principais ja fechados:
  - tabelas de procedimentos corretas;
  - unidade Principal / 0001 correta;
  - prestador Clínica correto;
  - prestador ADM/Mestre funcional correto;
  - tipo Cirurgião dentista no prestador ADM.
- A nova pendencia funcional apareceu no modulo Usuários.
- A decisão atualizada sobre setup foi consolidada: manter a tela de setup para o primeiro acesso do ADM inicial e impedir que ela apareça para usuarios criados depois dentro da mesma conta.

## 2. Validacao manual informada pelo usuario

- As tabelas de procedimentos nasceram corretas.
- A unidade Principal / 0001 nasceu correta.
- O prestador Clínica nasceu correto.
- O prestador ADM/Mestre funcional nasceu correto.
- O prestador ADM usa o nome informado no cadastro.
- O prestador ADM nasceu como Cirurgião dentista.
- O usuario criado depois recebeu tela de setup, o que confirmou que o setup ainda esta sendo tratado como gate de usuario e nao apenas como etapa da conta/ADM inicial.
- A nova pendencia identificada e que o modulo Usuários precisa nascer com:
  - Tipo de usuário = Dentista (CD);
  - Associar a prestador = prestador ADM/Mestre funcional;
  - Unidade de atendimento = Principal / 0001.

## 3. Regra contratual atualizada - usuário ADM

- O usuario ADM inicial das novas contas deve nascer com Tipo de usuário = Dentista (CD).
- O usuario ADM inicial das novas contas deve nascer associado ao prestador ADM/Mestre funcional.
- O usuario ADM inicial das novas contas deve nascer associado à unidade Principal / 0001.
- A regra vale somente para novas contas.
- Contas existentes permanecem preservadas.
- O nome do prestador ADM continua vindo do cadastro da conta.
- O nome do usuário ADM pode continuar seguindo o contrato da conta, sem renomear o sistema inteiro para Mestre.

## 4. Regra contratual atualizada - tela de setup

- A tela de setup permanece para o primeiro acesso do ADM inicial da nova conta.
- A tela de setup nao deve aparecer para usuarios criados posteriormente.
- O setup passa a ser etapa da conta/ADM inicial, nao etapa de todo usuario novo.
- O usuario criado depois deve entrar pelo login normal.
- O login SaaS continua obrigatorio.
- A senha interna/setup ainda nao sera redesenhada nesta etapa.
- Opções do Sistema ainda nao devem ser alteradas nesta etapa.
- O controle de usuarios/senhas ainda nao deve ser redesenhado nesta etapa.

## 5. Comparacao EasyDental x Brana

| Item | EasyDental virgem | Brana atual | Regra proposta | Pendencia |
| --- | --- | --- | --- | --- |
| Clinica | Prestador sistêmico literal, preservado como base da conta | Prestador sistêmico Clínica ja existe e foi preservado | Manter como prestador sistêmico | Definir apenas a visibilidade e a proteção final |
| Mestre | Papel admin-like funcional, nao renomeado no Brana | ADM/Mestre funcional existe como equivalente pratico | Nao renomear tudo para Mestre; manter o contrato do Brana | Falta ajustar o nascimento do usuario ADM no modulo Usuários |
| Usuario ADM inicial | Nasce com papel funcional de maior privilegio | Nasce com `tipo_usuario="Clínica"` no contrato atual de signup | Nascer como Dentista (CD) | Ajuste isolado futuro |
| Vinculo com prestador | O admin inicial fica funcionalmente ligado ao papel de maior privilegio | O signup ja vincula o usuario inicial ao prestador ADM | Manter o vinculo ao prestador ADM/Mestre funcional | Validar se o modulo Usuários reflete esse vinculo |
| Vinculo com unidade | Unidade inicial existe como base da conta | Unidade Principal / 0001 ja foi implementada | O usuario ADM deve apontar para Principal / 0001 | O signup atual nao garante esse vinculo no usuario |
| Setup para usuario novo | Nao deve virar etapa de todo usuario comum | Hoje a sessao bloqueia ate `setup_completed` | Setup apenas para ADM inicial da conta | Separar conta inicial de usuarios posteriores |
| Opções do Sistema > Segurança | Contrato observado, mas nao redesenhado aqui | Default atual continua aplicando protecao interna | Manter fora desta etapa | Contrato futuro especifico |

## 6. Diagnostico Brana somente leitura

- O nascimento atual do usuario ADM esta em `backend/services/signup_service.py`.
- O helper de nascimento da conta cria o usuario admin com `tipo_usuario="Clínica"`.
- O helper de nascimento da conta ja vincula o usuario admin ao prestador ADM funcional via `prestador_id`.
- O helper de nascimento da conta nao garante `unidade_atendimento_id` para o usuario ADM.
- O valor atual de `tipo_usuario` do ADM inicial permanece `Clínica`.
- O valor atual de `prestador_id` do ADM inicial aponta para o prestador ADM/Mestre funcional.
- O valor atual de `unidade_atendimento_id` do ADM inicial nao esta fechado como contrato e segue pendente de ajuste.
- O frontend do modulo Usuarios mostra:
  - Tipo de usuário via combo carregado de `Tipos de usuário`;
  - Associar a prestador via combo carregado de prestadores;
  - Unidade de atendimento via combo carregado de unidades.
- O valor que corresponde a Dentista (CD) ja existe no catalogo de permissao e no fallback do frontend.
- O mapeamento visivel no frontend usa `Dentista` / `Cirurgião dentista` como tipo associado ao perfil dentista.
- O ponto de ajuste futuro fica principalmente em `backend/services/signup_service.py`, com reflexos em `backend/routes/user_admin_routes.py` e no preenchimento inicial do frontend.
- Risco principal: o usuario ADM continuar nascendo com tipo errado e sem unidade, embora o prestador ja esteja correto.

## 7. Diagnostico EasyDental

- A documentacao historica e as leituras anteriores confirmam `Clínica` como papel estrutural literal.
- A documentacao historica e as leituras anteriores tratam `Mestre` como equivalente funcional do usuario de maior privilegio.
- A equivalencia funcional adotada no Brana e:
  - Clínica = prestador sistêmico;
  - Mestre = ADM/Mestre funcional.
- O Brana nao vai renomear tudo para Mestre.
- O nome do prestador ADM continua vindo do cadastro.
- A tela de setup no legado foi tratada como um mecanismo de seguranca/configuracao inicial, mas o contrato desta frente separa isso da vida de usuarios criados depois.
- Limitação desta auditoria: a parte EasyDental foi sustentada pelos documentos historicos ja gerados e pela validacao manual relatada pelo usuario, sem escrita no legado.

## 8. Fora de escopo

- Implementação.
- Alterar setup agora.
- Alterar Opções do Sistema.
- Alterar senha interna.
- Alterar tabelas/procedimentos.
- Alterar unidade Principal / 0001.
- Alterar frontend.
- Alterar contas existentes.
- Corrigir texto da tela de setup.
- Alterar EasyDental.

## 9. Riscos

- ADM nascer sem tipo correto.
- ADM nao vincular ao prestador certo.
- ADM nao vincular a unidade.
- Usuario comum cair em setup.
- Misturar setup com login SaaS.
- Afetar contas existentes.
- Confundir o contrato do Mestre com uma renomeacao geral do Brana.

## 10. Proximas subetapas recomendadas

- 8U: implementar usuario ADM com Tipo Dentista (CD), prestador ADM e unidade Principal / 0001.
- 8V: ajustar setup para nao aparecer para usuarios criados posteriormente.
- Depois: contrato de Opções do Sistema > Segurança.

## 11. Plano de verificação

- Somente este documento novo e o roadmap foram alterados.
- Nenhum código foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- Backend nao foi alterado.
- Banco/schema/migrations/seeds/endpoints nao foram alterados.
- Nenhuma conta foi criada.
- Nenhuma conta foi excluída.
- EasyDental nao foi alterado.
- Setup nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
