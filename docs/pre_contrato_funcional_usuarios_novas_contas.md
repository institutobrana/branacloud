# Pre-contrato funcional consolidado - Modulo Usuarios - Novas contas

## 1. Titulo
Pre-contrato funcional consolidado - Modulo Usuarios - Novas contas

## 2. Objetivo
Registrar, de forma organizada, as regras funcionais maduras ja levantadas nas auditorias e as decisoes funcionais explicadas pelo usuario para o modulo Usuarios em novas contas/clinicas, separando o que ja esta confirmado, o que e desejado pelo produto e o que ainda depende de decisao futura.

## 3. Aviso
Este documento e um **pre-contrato funcional**. Ele **nao e o contrato definitivo**.

Ele serve para consolidar:
- regras ja confirmadas;
- regras desejadas pelo produto;
- pontos ainda pendentes;
- diferencas aceitaveis entre EasyDental desktop e Brana Cloud SaaS;
- pontos que precisarao de validacao ou correcao futura.

## 4. Contexto das auditorias
Este pre-contrato consolida evidencias e conclusoes provenientes das auditorias e documentos ja produzidos na trilha de Usuarios, permissões, primeiro acesso, perfis, licenca e referencia EasyDental, incluindo:
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/auditoria_fina_frontend_admin_usuarios.md`
- `docs/auditoria_fina_user_admin_permissoes.md`
- `docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`

## 5. Nota sobre EasyDental desktop x Brana Cloud SaaS
O EasyDental e a referencia historica principal. O Brana Cloud precisa preservar a logica funcional central herdada, mas e um SaaS e pode exigir adaptacoes tecnicas.

Regras:
- heranca funcional principal deve ser preservada;
- adaptacoes SaaS sao aceitas quando necessarias;
- diferencas de implementacao nao sao automaticamente erro;
- mudancas que alterem a regra de negocio devem ser registradas e decididas;
- o contrato final futuro deve separar heranca funcional, adaptacao SaaS, comportamento atual do codigo e decisao de produto.

## 6. Regras de nascimento de nova conta
Regra desejada consolidada:

1. Toda nova conta nasce com uma clinica.
2. A clinica recebe um `clinica_id`.
3. Toda nova conta nasce com o primeiro usuario ADM/dono.
4. Toda nova conta nasce com um prestador sistemico chamado `Clínica`.
5. O prestador `Clínica` aparece no modulo Prestadores.
6. O prestador `Clínica` e estrutural/sistemico.
7. O prestador `Clínica` nao pode ser apagado pelo usuario.
8. O prestador `Clínica` tem suporte/configuracao de agenda, ainda que nao exista necessariamente um booleano explicito `tem_agenda`.
9. A nova conta nasce com licenca/plano associado a clinica/conta.

## 7. Regras de primeiro acesso
Regra desejada consolidada:

1. O primeiro usuario da conta e o ADM/dono.
2. O ADM faz login com e-mail + senha.
3. No primeiro acesso, deve aparecer uma tela especial de setup inicial.
4. Essa tela deve aparecer somente uma vez.
5. Essa tela deve informar que o usuario e o administrador/dono da conta.
6. O primeiro acesso conclui a configuracao inicial.
7. O primeiro acesso configura a senha administrativa/protegida usada para liberar modulos protegidos.
8. O Brana Cloud atual usa a `senha_hash` do admin para login e desbloqueio protegido, conforme auditoria.
9. Para o contrato, a senha administrativa/protegida tem finalidade conceitualmente diferente da senha de login.
10. O ADM pode escolher usar a mesma senha, mas a finalidade deve ser separada:
   - senha de login: entrar no sistema;
   - senha administrativa/protegida: liberar modulos protegidos dentro do sistema.
11. Fica pendente a decisao tecnica/produto se a senha administrativa/protegida deve ter armazenamento proprio ou se a implementacao atual pode ser aceita.

## 8. Senha de login x senha administrativa/protegida
Consolidacao:

- senha de login: autentica o usuario no sistema com e-mail + senha;
- senha administrativa/protegida: libera modulos protegidos dentro do sistema;
- a finalidade e diferente mesmo que a implementacao atual reaproveite a mesma `senha_hash`.

## 9. Usuarios e Opcoes/Configuracao como modulos sensiveis
Regra desejada consolidada:

1. Usuarios e Opcoes do Sistema/Configuracao sao modulos sensiveis.
2. Esses modulos devem nascer protegidos/restritos desde o inicio.
3. O ADM pode acessar esses modulos mediante senha administrativa/protegida.
4. Usuarios comuns nao devem administrar esses modulos por padrao.
5. A protecao desses modulos faz parte da configuracao inicial da conta.

## 10. Usuarios criados pelo ADM
Regra desejada consolidada:

1. Depois do primeiro acesso, o ADM pode criar usuarios.
2. Usuarios criados pelo ADM podem ser dentistas, secretarias, auxiliares, gerentes, atendentes ou outros tipos configurados.
3. Cada usuario criado deve ter login proprio com e-mail e senha.
4. O usuario criado pelo ADM deve conseguir acessar o sistema com seu proprio login.
5. O usuario criado pelo ADM pode alterar ou recuperar sua senha pela tela normal de login.
6. O usuario pode ser ativo ou inativo.
7. Usuario inativo nao deve acessar o sistema.
8. Usuarios criados pelo ADM podem ser vinculados a unidade de atendimento.
9. Usuarios criados pelo ADM podem ser associados a um prestador principal, quando aplicavel.

## 11. Login proprio dos usuarios
Consolidacao:

- o codigo atual trabalha com e-mail + senha;
- novos usuarios criados pelo ADM nao sao usuarios de sistema;
- o fluxo de recuperacao/alteracao de senha existe no backend por rotas publicas de forgot/reset.

## 12. Recuperacao/alteracao de senha
Regra desejada consolidada:

1. O usuario criado pelo ADM pode alterar sua senha pela tela normal de login.
2. O usuario criado pelo ADM pode recuperar sua senha pela tela normal de login.
3. O fluxo de recuperacao e separavel do fluxo administrativo de desbloqueio protegido.

## 13. Licenca da conta
Regra desejada consolidada:

1. A licenca pertence a conta/clinica.
2. A conta pode ser demo, mensal, anual ou outro modelo definido pelo produto.
3. Se a licenca estiver valida, usuarios da conta podem acessar o sistema conforme suas permissoes.
4. Se a licenca estiver vencida, todos os usuarios daquela conta devem ser bloqueados.
5. O bloqueio por licenca vencida deve valer para ADM e usuarios comuns.
6. A licenca e uma camada anterior as permissoes internas.
7. Mesmo que o usuario tenha permissao interna, ele nao deve acessar se a licenca da conta estiver vencida.

## 14. Tipo do usuario vindo de Tabelas Auxiliares
Regra desejada consolidada:

1. O campo `Tipo do usuario` nao pertence como lista fixa ao modulo Usuarios.
2. O campo `Tipo do usuario` vem do modulo Tabelas Auxiliares.
3. O modulo Usuarios apenas consome essa lista.
4. Os tipos de usuario podem ser alterados em Tabelas Auxiliares.
5. Exemplos vistos na UI:
   - Dentista (CD)
   - Auxiliar (ACD)
   - Secretaria(o)
   - Gerente
   - Atendente
   - Protetico
   - Perito
   - Vendedor(a)
   - THD
6. Esses exemplos nao devem ser tratados como lista imutavel no contrato.
7. Se o ADM alterar Tipos de usuario em Tabelas Auxiliares, o combo do modulo Usuarios deve refletir a alteracao.

## 15. Associar a prestador
Regra desejada consolidada:

1. O campo `Associar a prestador` no cadastro de usuario define o prestador principal associado ao usuario.
2. A lista desse campo vem do modulo Prestadores.
3. Nem todo usuario precisa ser prestador.
4. Alguns usuarios, como dentistas, normalmente devem ser associados a um prestador.
5. O ADM pode ser prestador ou nao.
6. Esse vinculo e diferente da aba Perfis de acesso.
7. O vinculo principal ajuda a definir a identidade operacional do usuario dentro da clinica.
8. O prestador associado pode influenciar agenda, atendimento, conta corrente ou outros contextos do sistema, conforme regras de cada modulo.

## 16. Permissoes de acesso
A aba `Permissões de acesso` controla o acesso a modulos.

Cada modulo pode ter tres estados:

1. Permitir acesso:
   - o modulo aparece normal;
   - o usuario consegue abrir.

2. Proibir acesso:
   - o modulo aparece no menu com aparencia apagada/desabilitada;
   - o usuario nao consegue abrir.

3. Solicitar senha:
   - o modulo aparece;
   - ao clicar, o sistema solicita a senha administrativa/protegida;
   - se a senha estiver correta, o modulo abre;
   - se a senha estiver errada, o modulo nao abre.

Consolidacao adicional:

4. Permissoes de acesso sao uma camada separada da aba Perfis de acesso.
5. Permissoes de acesso definem se o usuario pode abrir ou nao determinado modulo.
6. O Brana Cloud atual indica baseline por Tipo do usuario, conforme auditoria.
7. O pre-contrato registra que isso ainda exige decisao:
   - manter permissoes padrao por tipo de usuario;
   - ou usar politica base comum para novos usuarios;
   - ou permitir baseline por tipo desde que esteja documentado e configuravel.
8. Esta decisao nao fica fechada como contrato definitivo nesta etapa.

## 17. Perfis de acesso
Interpretacao refinada consolidada:

1. A aba `Perfis de acesso` nao representa cargos padrao.
2. A aba `Perfis de acesso` nao deve ser confundida com Tipo do usuario.
3. A aba `Perfis de acesso` nao substitui Permissoes de acesso.
4. A aba `Perfis de acesso` trabalha com perfis funcionais/areas funcionais do sistema.
5. Exemplos de perfis funcionais vistos na referencia:
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
6. Para cada perfil funcional selecionado, o ADM marca quais prestadores aquele usuario pode acessar.
7. O quadro superior representa perfis funcionais/areas.
8. O quadro inferior representa prestadores marcaveis para o perfil funcional selecionado.
9. Se o usuario tiver o prestador marcado naquele perfil funcional, ele tera acesso ao contexto daquele prestador dentro daquela area.
10. Se o prestador estiver desmarcado naquele perfil funcional, o usuario nao tera acesso ao contexto daquele prestador naquela area.
11. Exemplo:
   - Perfil funcional: Controle de estoque.
   - Prestador Adriana desmarcado.
   - Resultado: o usuario nao acessa o Controle de estoque no contexto do prestador Adriana.
12. O vinculo provavel e: usuario + perfil funcional + prestador.
13. No Brana Cloud, isso se relaciona com `access_profile` e `usuario_perfil_acesso`.
14. Nova clinica nao deve nascer com cargos padrao como Secretaria, Dentista ou Financeiro.
15. Porem, pode ser necessario que nova clinica nasca com a estrutura funcional base de Perfis de acesso, pois isso nao representa cargos, mas areas funcionais do sistema.
16. Essa decisao ainda deve ser refinada com base no EasyDental e no Brana Cloud:
   - `access_profile` deve ser seed/base funcional oficial?
   - ou a tela deve funcionar sem `access_profile`?
17. Esta decisao nao fica fechada como contrato definitivo nesta etapa.

## 18. Diferenca entre tipo, prestador, permissoes e perfis
### Tipo do usuario
- vem de Tabelas Auxiliares;
- classifica o usuario;
- nao e permissao;
- nao e perfil funcional.

### Associar a prestador
- define o prestador principal do usuario;
- vem do modulo Prestadores;
- nao e permissao por modulo;
- nao e a mesma coisa que Perfis de acesso.

### Permissoes de acesso
- definem se o usuario pode abrir modulos;
- trabalham com permitir, proibir ou solicitar senha.

### Perfis de acesso
- definem acesso por perfil funcional e prestador;
- controlam contexto operacional dentro dos modulos permitidos.

## 19. Camadas de acesso
O acesso final de um usuario depende de varias camadas:

1. licenca da conta ativa;
2. usuario ativo;
3. login valido;
4. permissao do modulo;
5. senha administrativa/protegida, se o modulo exigir;
6. vinculo com prestador/contexto, quando o modulo depender desse contexto;
7. unidade/prestador/configuracoes especificas de cada modulo.

## 20. Pontos ja maduros para contrato
Ja estao maduros para entrar no contrato funcional futuro:

- fluxo de nascimento de nova conta;
- primeiro acesso com `setup_completed`;
- prestador sistemico `Clínica`;
- modulo `Usuarios` protegido por senha/grant;
- combo `Tipo do usuario` vindo de Tabelas Auxiliares;
- vinculo usuario/prestador;
- vinculo usuario/unidade;
- licenca por clinica;
- bloqueio global por licenca vencida;
- separacao entre permissao por modulo e perfil funcional.

## 21. Pontos pendentes antes do contrato definitivo
Pendencias registradas:

1. Decidir se a senha administrativa/protegida tera armazenamento proprio ou continuara usando `senha_hash` do ADM.
2. Investigar/decidir permissoes padrao por Tipo do usuario com base no EasyDental e no Brana Cloud.
3. Decidir se `access_profile` sera estrutura funcional base obrigatoria para novas clinicas.
4. Decidir se `sis_perfil_sql.csv` voltara como fonte oficial ou se havera seed versionado dentro do backend.
5. Confirmar matriz de permissoes padrao por tipo de usuario.
6. Confirmar no EasyDental o nascimento dos perfis funcionais e sua relacao com prestadores.
7. Confirmar diferencas aceitaveis entre desktop e SaaS.
8. Depois disso, criar contrato funcional definitivo.

## 22. Diferenças esperadas entre EasyDental e SaaS
- EasyDental e desktop.
- Brana Cloud e SaaS.
- O Brana Cloud deve preservar a logica funcional principal.
- Diferencas pequenas podem existir por causa do modelo SaaS.
- Diferencas tecnicas nao devem ser automaticamente consideradas erro.
- Diferencas que mudarem regra de negocio devem ser registradas e decididas.
- O contrato final deve dizer o que e heranca funcional e o que e adaptacao SaaS.

## 23. Proxima etapa recomendada
A proxima etapa recomendada e transformar este pre-contrato em contrato funcional definitivo, depois de:
- decidir a politica da senha administrativa/protegida;
- decidir o papel oficial de `access_profile` e do seed correspondente;
- confirmar a matriz de permissoes por tipo de usuario;
- validar as diferencas aceitaveis entre EasyDental desktop e Brana Cloud SaaS.

## 24. Confirmacoes de escopo
- Nenhum codigo foi alterado.
- Banco nao foi alterado.
- Frontend nao foi alterado.
- Backend nao foi alterado.
- Seeds nao foram alterados.
- Migrations nao foram executadas.
- EasyDental/legado nao foi alterado.
- Nada foi copiado do EasyDental.
- A blindagem textual/mojibake foi respeitada.

## 25. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 26. Estado final do git
- Branch conferida: `modularizacao-segura-fase-1`
- `git status --short` permanece com os `untracked` antigos do workspace e este documento novo.
- `git diff --stat` nao mostra mudancas rastreadas de codigo nesta etapa.

