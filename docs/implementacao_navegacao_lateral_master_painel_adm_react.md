# Implementacao da navegacao lateral MASTER do Painel ADM no React

## 1. Objetivo

Reposicionar o Painel ADM do Brana Cloude para um agrupador proprio no rail lateral principal do frontend React, visivel somente para conta MASTER real, com submenu lateral e rotas filhas preparadas.

## 2. Escopo

- Regra MASTER centralizada no frontend a partir do contrato de sessao.
- Agrupador ADM no rail lateral principal.
- Submenu lateral com cinco itens.
- Rotas `/app/adm`, `/app/adm/clinicas`, `/app/adm/usuarios`, `/app/adm/cobrancas` e `/app/adm/auditoria`.
- Remocao da navegacao horizontal interna em pills do ADM.
- Shells neutros para as telas ainda nao implementadas.

## 3. Fora do escopo

- Dashboard funcional com dados reais.
- Tabelas reais de clinicas, usuarios, cobrancas e auditoria.
- Acoes administrativas destrutivas.
- Alteracoes de banco, migration ou commit.

## 4. Estado inicial do Git

- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- HEAD inicial: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`
- Ahead/behind inicial: `0 0`
- Stage inicial: vazio

## 5. Documentos usados

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/auditoria_integracao_painel_adm_frontend_react.md`
- `docs/contrato_modularizacao_painel_adm_frontend_react.md`
- `docs/matriz_paridade_painel_adm_legado_react.md`
- `docs/plano_migracao_funcional_painel_adm_react.md`
- `docs/refinamento_visual_fundacao_painel_adm_react.md`
- `docs/implementacao_fundacao_painel_adm_frontend_react.md`
- `docs/encerramento_fundacao_painel_adm_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. Regra MASTER encontrada

O backend trata a conta proprietaria por `is_owner_email(usuario.email)`. O `/me` agora expõe `is_master` derivado dessa regra, e o React passa a usar apenas esse campo para liberar o ADM.

## 7. Dados usados no React

- `user.is_master`
- `user.is_admin`
- `user.is_superadmin`
- `loading` da sessao

Somente `is_master` libera o Painel ADM.

## 8. Backend alterado ou nao

Alterado de forma minima e segura:

- `backend/security/user_context.py` passou a expor `is_master` no `/me`.

Nao houve alteracao de banco ou migration.

## 9. Componente do rail auditado

O rail real e `frontend-react/src/layout/BranaIconRail.jsx`.

## 10. Posicao do icone ADM

O ADM ficou no final do rail, abaixo de Ajuda/Suporte, sem reservar espaco para usuarios nao MASTER.

## 11. Icone escolhido

`SafetyCertificateOutlined`.

## 12. Submenu

O submenu ADM foi encaixado no painel lateral do rail com:

- Visão geral
- Clínicas
- Usuários
- Cobranças
- Auditoria

## 13. Rotas

- `/app/adm`
- `/app/adm/clinicas`
- `/app/adm/usuarios`
- `/app/adm/cobrancas`
- `/app/adm/auditoria`

## 14. Protecao

- MASTER: visivel e navegavel.
- SUPERADMIN nao MASTER: bloqueado.
- admin comum: bloqueado.
- usuario comum: bloqueado.
- sessao ausente ou carregando: bloqueio conservador.

## 15. Remocao da navegacao horizontal

A navegacao em pills da fundacao anterior foi retirada da composicao ativa do ADM. O fluxo agora depende do rail e do submenu lateral.

## 16. Shell das paginas

As telas nao implementadas exibem apenas shell neutro, titulo correto e mensagem discreta de conteudo ainda nao disponivel.

## 17. Arquivos alterados

- `backend/security/user_context.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/admin/AdminRoutes.jsx`
- `frontend-react/src/features/admin/AdminHomePage.jsx`
- `frontend-react/src/features/admin/adminAccess.js`
- `frontend-react/src/features/admin/adminNavigation.js`
- `frontend-react/src/features/admin/adminRoutes.js`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/tests/adminAccess.test.js`
- `frontend-react/tests/adminRoutes.test.js`

## 18. Testes

- `node --test frontend-react/tests/adminAccess.test.js frontend-react/tests/adminRoutes.test.js`

## 19. Build

- `cmd /c npm run build` em `frontend-react`

## 20. Validacao manual

Validacao manual de navegador nao foi executada nesta rodada. A confirmacao ficou limitada a teste automatizado e build.

## 21. Tema

A estrutura respeita o tema global do frontend React, sem dependencia de um layout escuro ou claro especifico.

## 22. Responsividade

O rail e o submenu continuam dentro do padrÃ£o responsivo existente do shell React.

## 23. Limitacoes

- Nao houve navegador automatizado nesta rodada.
- O shell ainda nao tem dados reais.
- O backend foi ajustado apenas no contrato do `/me`.

## 24. Proxima etapa

Iniciar a Visão geral funcional do ADM com o primeiro modulo de leitura real, mantendo o mesmo padrÃ£o lateral.

## 25. Confirmacao de ausencia de commit e push

Nao houve commit.
Nao houve push.
