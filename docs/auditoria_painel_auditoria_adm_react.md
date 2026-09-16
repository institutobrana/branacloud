# Auditoria do Painel ADM -> Auditoria React

## 1. Contexto

A frente `ADM -> Auditoria` foi aberta como auditoria documental e tecnica antes de qualquer implementacao React.

O painel legado atual mostra uma tabela simples e read-only. A frente React ainda nao possui tela funcional, apenas placeholder.

## 2. Objetivo

Reconstruir o contrato real da frente a partir de:

- legado atual;
- historico Git;
- backend;
- banco;
- eventos reais ja registrados;
- requisitos de seguranca e privacidade.

## 3. Fonte visual atual

O legado atual em `frontend/index.html` renderiza a secao de auditoria com cinco colunas:

- `ID`
- `Data`
- `Ação`
- `Autor`
- `Alvo`

O carregamento usa `saCarregarAuditoria()` e a renderizacao usa `saRenderAuditoria()` em `frontend/app.js`.

## 4. Historico Git

Evidencia historica encontrada:

- o layout base da tabela vem de `c132c453` na primeira versao do arquivo legado;
- a coluna `Ação` passou por ajuste posterior em `38dae94b`;
- `saCarregarAuditoria()` e `saRenderAuditoria()` existem desde a base inicial do arquivo legado.

Conclusao historica:

- a frente sempre foi pensada como listagem simples;
- nao houve evidenca de toolbar antiga com acoes mutaveis;
- o placeholder React segue a mesma intencao inicial, mas ainda nao implementa a tabela.

## 5. Legado original

O legado original confirma:

- tela com cinco colunas;
- sem botoes por linha;
- sem modal de detalhes;
- sem exportacao;
- sem filtros visiveis na secao da tabela;
- sem paginação visual na tela.

## 6. Legado atual

O legado atual continua simples:

- menu `Auditoria...`;
- endpoint `GET /superadmin/auditoria?limit=80`;
- tabela com `ID`, `Data`, `Ação`, `Autor`, `Alvo`.

Função atual de renderizacao:

- `saRenderAuditoria()` monta a tabela diretamente com os campos `id`, `criado_em`, `acao`, `actor_email`, `alvo_tipo` e `alvo_id`.

## 7. React atual

O React atual possui somente placeholder:

- `frontend-react/src/features/admin/audit/AuditPage.jsx`
- `frontend-react/src/features/admin/AdminRoutes.jsx`
- `frontend-react/src/features/admin/adminNavigation.js`
- `frontend-react/src/app/App.jsx`

O item `Auditoria` existe no menu React, mas marcado como `Em migração`.

## 8. Backend

Pontos reais encontrados:

- `backend/models/plataforma.py`
- `backend/services/platform_admin_service.py`
- `backend/routes/superadmin_routes.py`
- `backend/routes/licenca_routes.py`
- `backend/routes/editor_textos_routes.py`

O modelo real da tabela e `PlataformaAuditoria`.

## 9. Banco

Tabela real: `plataforma_auditoria`.

Campos reais:

- `id`
- `actor_user_id`
- `actor_email`
- `acao`
- `alvo_tipo`
- `alvo_id`
- `detalhes_json`
- `ip`
- `criado_em`

Nao existem, nesta tabela, campos reais para:

- `user_agent`
- `request_id`
- `before`
- `after`
- `payload_json` separado
- `clinic_id`

## 10. Endpoint

Endpoint real de leitura:

- `GET /superadmin/auditoria?limit=80`

Contrato atual:

- exige superadmin;
- ordena por `criado_em desc, id desc`;
- limita por `limit`;
- retorna os campos reais da tabela.

## 11. Volume

Medição local atual:

- total de eventos: `58`
- tamanho total da relacao: `131072` bytes
- maior `detalhes_json`: `398` bytes
- media aproximada de `detalhes_json`: `216.5` bytes

Conclusao:

- o volume local e pequeno;
- o limit `80` e suficiente no momento;
- o problema principal nao e volume, e sim escopo funcional e privacidade.

## 12. Eventos

Eventos reais encontrados no banco local:

- `editor_textos.exportar_pdf`
- `editor_textos.exportar_pdf_falha`
- `editor_textos.preparar_pdf_acrobat`
- `editor_textos.preparar_pdf_acrobat_falha`
- `editor_textos.abrir_pdf_preparado`
- `editor_textos.abrir_pdf_preparado_app`
- `editor_textos.assinar_pdf_solicitado`
- `editor_textos.assinar_pdf_concluido`
- `editor_textos.assinar_pdf_falha`
- `editor_textos.assinar_pdf_windows_store_solicitado`
- `editor_textos.assinar_pdf_windows_store_concluido`
- `editor_textos.assinar_pdf_windows_store_falha`
- `clinica_nova_conta_create`
- `clinica_plano_update`
- `clinica_status_update`
- `clinica_trial_extend`
- `clinica_delete_definitivo`
- `licenca_checkout_criado`
- `licenca_pagamento_aprovado`
- `usuario_reset_senha`
- `usuario_status_update`
- `usuario_perfil_update`

## 13. Autores

Autores reais encontrados:

- `gleissontel@gmail.com`
- `wilker@digitalprodutora.com.br`

Nao houve registro de autor nulo no banco local analisado.

## 14. Alvos

Alvos reais encontrados:

- `editor_textos_pdf`
- `clinica`
- `usuario`

## 15. Payloads

O detalhe operacional fica em `detalhes_json`.

Observacao:

- o payload nao e bruto, mas pode conter informacoes sensiveis do evento;
- o tamanho e pequeno no banco local;
- o contrato da tabela principal nao deve exibir esse campo por padrao sem filtro.

## 16. Seguranca

O evento de auditoria deve ser tratado como dado sensivel administrativo.

Seguros para a tabela principal:

- `id`
- `criado_em`
- `acao`
- `actor_email`
- `alvo_tipo`
- `alvo_id`

Seguros apenas em detalhes:

- `actor_user_id`
- `detalhes_json`
- `ip`

Campos proibidos ou ausentes na tabela atual:

- `senha`
- `token`
- `Authorization`
- `user_agent`
- `request_id`
- `before`
- `after`

## 17. Privacidade

Mesmo sem dados clinicos diretos, auditoria administrativa pode expor:

- identificadores internos;
- emails de admin;
- alvos operacionais;
- IP do autor.

Por isso, a fase inicial deve ser somente leitura e sem modal aberto por padrao com payload bruto.

## 18. Paginação

O endpoint atual usa `limit`.

Nao foi identificado:

- offset dedicado;
- cursor;
- paginação server-side formal.

Conclusao:

- a paginação atual pode ser tratada depois;
- o volume local nao exige paginacao obrigatoria ainda.

## 19. Filtros

Filtros uteis e seguros para fase inicial:

- data;
- ação;
- autor;
- tipo de alvo;
- alvo.

Filtros que dependem de contrato adicional:

- request id;
- ip;
- module;
- resultado;
- before/after.

## 20. Botões

Botões candidatos para Fase 1:

- `Atualizar`
- `Exportar CSV`
- `Ver detalhes`

Botões rejeitados para Fase 1:

- `Excluir`
- `Editar`
- `Limpar logs`
- `Reprocessar`

Botão condicional:

- `Ver alvo` somente se houver contrato seguro de tipo/id navegável.

## 21. Relação com Clínicas

Eventos de clínica são a principal familia atual da auditoria.

Eventos confirmados:

- nova conta;
- plano alterado;
- status alterado;
- trial estendido;
- exclusao definitiva;
- checkout;
- pagamento aprovado.

## 22. Relação com Usuários

Eventos confirmados:

- reset de senha;
- status do usuario;
- perfil do usuario.

Nao foi encontrado, nesta rodada, inventario completo de login/logout/renew dentro da mesma tabela.

## 23. Relação com Cobranças

A tabela de auditoria ja registra eventos de licenca/cobranca:

- checkout criado;
- pagamento aprovado.

Nao foi mapeado evento proprio de cancelamento, estorno ou sincronizacao separado no conjunto local analisado.

## 24. Riscos

- payload pode expor contexto sensivel;
- alvo e string, nao entidade navegavel;
- nao existe `request_id`;
- nao existe `user_agent`;
- nao existe `before`/`after` estruturado;
- o endpoint nao tem paginacao formal;
- o legado atual ainda nao tem filtro nem toolbar.

## 25. Conclusao

A frente `ADM -> Auditoria` pode começar com uma listagem read-only simples, desde que:

- use os cinco campos do legado;
- mantenha `Atualizar`;
- permita exportacao CSV;
- trate `Ver detalhes` com filtro forte de dados;
- nao tente navegar o alvo sem contrato adicional.

## 26. Recomendacao

Fase 1 recomendada:

- rota `/app/adm/auditoria`;
- tabela read-only;
- `Atualizar`;
- `Exportar CSV`;
- `Ver detalhes`;
- filtros basicos por coluna;
- sem mutacao;
- sem exclusao;
- sem limpeza;
- sem backend novo nesta etapa.
