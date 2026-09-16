# Implementacao da visao geral funcional do Painel ADM no React

## 1. Objetivo

Implementar a primeira entrega funcional de `ADM -> Visao geral` no frontend React do Brana Cloude usando apenas dados reais e leitura.

## 2. Escopo

- Toolbar funcional com `Atualizar`.
- 10 cards de KPI do endpoint de overview.
- Nova tabela de 4 colunas abaixo dos cards.
- Estado de loading, erro e vazio.
- Hook, service e utils proprios.
- Testes estruturais e de contrato.

## 3. Fora do escopo

- Tabelas completas de clinicas, usuarios, cobrancas e auditoria.
- Acoes por linha.
- Operacoes de escrita.
- Migration e banco.
- Commit e push.

## 4. Estado inicial do Git

- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- HEAD: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`
- Ahead/behind apos fetch: `0 0`
- Stage inicial: vazio

## 5. Documentos usados

- `docs/auditoria_integracao_painel_adm_frontend_react.md`
- `docs/contrato_modularizacao_painel_adm_frontend_react.md`
- `docs/matriz_paridade_painel_adm_legado_react.md`
- `docs/plano_migracao_funcional_painel_adm_react.md`
- `docs/implementacao_navegacao_lateral_master_painel_adm_react.md`
- `docs/frontend_react_padrao_shell_modulos_administrativos.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. Legado auditado

O endpoint usado pela visao geral continua sendo `GET /superadmin/overview`, protegido por `_require_superadmin(current_user)` e baseado em `is_platform_superadmin_user(current_user)`.

## 7. Endpoint

- `GET /superadmin/overview`

## 8. Metodo

- `GET`

## 9. Arquivo backend

- `backend/routes/superadmin_routes.py`

## 10. Dependencias de autorizacao

- `get_current_user`
- `is_platform_superadmin_user`
- regra `is_master` apenas para visibilidade no frontend

## 11. Estrutura da resposta

Campos usados:

- `total_clinicas`
- `total_usuarios`
- `usuarios_ativos`
- `clinicas_ativas`
- `clinicas_suspensas`
- `clinicas_expiradas`
- `clinicas_trial`
- `clinicas_sem_usuario`
- `clinicas_arquivadas`
- `mrr_estimado`
- `arr_estimado`
- `acessos_clinicas`

## 12. Filtros implementados

Nenhum filtro foi implementado nesta etapa, porque o endpoint atual nao expunha contrato de filtro para overview.

## 13. Filtros adiados

- Buscar clinica
- Status da clinica
- Buscar usuario
- Status do usuario
- Perfil administrativo
- Plano

## 14. Indicadores implementados

- Total de clinicas
- Total de usuarios
- MRR
- ARR
- Ativas
- Trial
- Expiradas
- Suspensas
- Sem usuario
- Arquivadas

## 15. Quantidade final de indicadores

- `10`

## 16. Regra de MRR

O valor e exibido exatamente como o backend retorna em `mrr_estimado`, sem recálculo no frontend.

## 17. Regra de ARR

O valor e exibido exatamente como o backend retorna em `arr_estimado`, sem recálculo no frontend.

## 18. Tabela de acesso

A tela exibe uma tabela de 4 colunas abaixo dos cards:

- `Clinica`
- `Usuario responsavel`
- `Ultimo acesso`
- `Status`

O backend entrega `acessos_clinicas` com composicao somente de leitura. A coluna `Ultimo acesso` usa `usuarios.ultimo_login_em`, que representa o ultimo login bem-sucedido do usuario responsavel pela clinica. Quando o campo existe mas ainda esta `null`, o front mostra `Nao registrado`; quando o payload antigo nao trouxer o campo, mostra `Nao disponivel`.

## 19. Atividade recente

O contrato atual do endpoint nao expunha feed estruturado de atividades recentes. A area foi preservada para leitura futura, sem fabricar dados.

## 20. Arquitetura modular criada

- `overview/OverviewPage.jsx`
- `overview/components/*`
- `overview/hooks/useAdminOverview.js`
- `overview/adminOverviewApi.js`
- `overview/utils/*`

## 21. Estados visuais

- Loading inicial
- Atualizacao manual
- Erro
- Vazio
- Tabela de acesso vazia

## 22. Altura final da toolbar ADM

A toolbar reutiliza o shell compacto ja consolidado no ADM, sem criar nova regra global de altura.

## 23. Comparacao com Medicamentos

A visao geral usa botao `Atualizar` em `size="small"` e segue a densidade compacta esperada para a barra horizontal.

## 24. Erro runtime encontrado

- O navegador retornava `401 Unauthorized` em `GET /api/superadmin/overview`.
- A mensagem visivel no shell era "Nao foi possivel carregar a visao geral" com detalhe "Sessao expirada." antes da correcao.

## 25. Causa raiz

- O service inicial do overview usava `fetch` direto sem montar o header `Authorization: Bearer <token>`.
- O runtime confirmou que o backend recebeu a chamada sem credencial.

## 26. Cliente HTTP reutilizado

- O overview passou a reutilizar o mesmo padrao de autenticacao dos demais services do React: leitura do token pela camada de sessao e envio automatico do header `Authorization`.
- A montagem da URL continua sendo feita por `buildApiUrl('/superadmin/overview')`.

## 27. Como o token e enviado

- O token e lido por `getToken()` em `frontend-react/src/features/auth/authStorage.js`.
- O service injeta `Authorization: Bearer <token>` nos headers da request.
- Quando nao ha token, o service retorna `401` antes de fazer a chamada.

## 28. Tratamento de 401

- `401` permanece como erro.
- Nao ha conversao em sucesso vazio.
- Nao ha bypass de MASTER.
- O hook so mostra o erro amigavel e preserva o fluxo de tentativa manual.

## 29. Sincronizacao com sessao

- A consulta continua protegida pela propria tela ADM e pelo fluxo de autorizacao.
- O hook so dispara a consulta depois que o componente e renderizado para usuario autorizado.

## 30. Testes corrigidos

- O teste agora valida o `Authorization` real no request.
- Tambem cobre o caso de sessao ausente.

## 31. Resultado runtime

- O `401` original era causado por requisicao sem token.
- O service agora envia `Bearer` corretamente.

## 32. Indicadores carregados

- A validacao de contrato confirmou `10` indicadores no payload do overview.

## 33. Avisos preexistentes do Ant Design

- Os avisos sobre `Card` `bordered` deprecated e `Modal` `destroyOnClose` deprecated sao preexistentes e nao causam o `401`.

## 34. Backend alterado ou nao

Houve alteracao pequena e controlada em `backend/routes/superadmin_routes.py` para compor `acessos_clinicas` com base em dados ja existentes.

## 35. Banco alterado ou nao

Houve alteracao aditiva de banco por migration manual reversivel: `backend/scripts/migrar_usuarios_ultimo_login_em.py`.

- Coluna criada: `usuarios.ultimo_login_em`.
- Tipo: `TIMESTAMP WITH TIME ZONE`.
- Nullable: sim.
- Default: nenhum.
- Backfill: nenhum.

## 36. Limitacoes

- Sem validacao manual no navegador nesta sessao.
- Sem filtros contratados no endpoint atual.

## 37. Proxima etapa

Clinicas, mantendo a fundacao ADM e a visao geral funcional ja criada.

## 38. Confirmacao de ausencia de commit e push

- Sem commit
- Sem push

## 39. Atualizacao desta etapa

- O botao `Atualizar` saiu da area branca e passou para a faixa horizontal global do ADM na visao geral.
- O texto `Visao geral` foi removido da barra.
- A visao geral passou a exibir uma tabela de 4 colunas abaixo dos cards.
- O resumo online foi removido da interface.
- O backend foi ajustado apenas para compor a lista de acesso a partir de dados existentes.
- A frente de ultimo acesso criou `usuarios.ultimo_login_em` e passou a preencher o campo somente em login bem-sucedido.

## 40. Correcao visual e textual da Visao geral

- Mojibake encontrado em labels da Visao geral: `Total de cl?nicas`, `Total de usu?rios`, `Sem usu?rio` e textos correlatos salvos com encoding incorreto em arquivos do frontend.
- Causa raiz: strings ja corrompidas no codigo da feature, nao texto vindo do backend, fonte, locale ou CSS.
- Textos corrigidos com UTF-8 real: `Total de clínicas`, `Total de usuários`, `Sem usuário`, `Clínica`, `Usuário responsável`, `Último acesso`, `Não registrado`, `Não disponível`, `Indisponível`.
- O titulo `Clínicas e responsável` foi removido da tabela, mantendo as quatro colunas e os dados.
- A secao `Atividade recente` foi removida integralmente da composicao ativa.
- Componente removido: `OverviewRecentActivity.jsx`.
- Imports e CSS especificos de atividade recente foram removidos.
- A ordem final da pagina ficou: barra com `Atualizar`, dez cards, tabela de quatro colunas e fim do conteudo funcional.
- Testes ADM/Overview atualizados para cobrir textos UTF-8, ausencia das secoes removidas, dez cards, quatro colunas, ultimo acesso, status e botao Atualizar.
- Build validado com `cmd /c npm run build`.
- Validacao manual no navegador nao executada nesta etapa.
- Backend, banco e migration permaneceram inalterados nesta correcao textual/visual.
- Sem commit e sem push.

## 41. Ajustes visuais pontuais da Visao geral

- O espaco entre a grid dos dez cards e a tabela foi ajustado em `.admin-overview-metrics-grid`.
- Regra usada: `margin-bottom: 12px`.
- A decisao manteve o ajuste em um unico ponto estrutural, sem CSS global e sem alterar cards, tabela, Materiais ou Medicamentos.
- Na coluna `Status`, a exibicao visual passou de `Online` para `Ativo` e de `Offline` para `Inativo`.
- A semantica do backend foi preservada: `online` continua representando status real de sessao, apenas o rotulo visual da tabela mudou.
- Cores preservadas: `Ativo` verde, `Inativo` vermelho e `Indisponivel` neutro.
- Acessibilidade preservada com texto visivel e `aria-label` nos indicadores.
- Testes ADM/Overview atualizados e build validado.
- Validacao manual no navegador nao executada nesta etapa.
- Backend, banco, login, renew, logout, token, migration e modelo permaneceram inalterados.
- Sem commit e sem push.

## 42. Correcao do espaco real e largura da tabela da Visao geral

- A validacao runtime mostrou que o ajuste anterior em `.admin-overview-metrics-grid { margin-bottom: 12px; }` nao produziu espaco visual suficiente entre os cards e a tabela.
- Causa do espaco pouco aparente: a tabela era renderizada logo apos a grid dentro do fluxo do modulo, e o espacamento dependia do fim da grid em vez do inicio estrutural do bloco da tabela.
- Causa da largura total: o painel `.admin-overview-clinic-access` era o proprio bloco da tabela e, como item normal do conteiner pai, expandia para toda a largura disponivel; o `Table` do Ant Design tambem ocupa `100%` do seu conteiner.
- Causa runtime persistente encontrada depois: `frontend-react/src/features/admin/admin.css` nao estava importado no bundle da Visao geral, entao o navegador nao recebia as regras `.admin-overview-access-table-wrapper`.
- Ajuste aplicado: a pagina passou a envolver `OverviewClinicAccessTable` com `.admin-overview-access-table-wrapper`.
- Ajuste de carregamento aplicado: `OverviewPage.jsx` passou a importar `../admin.css`.
- O wrapper recebeu `margin-top: 24px` para criar espaco real entre a grid dos cards e o inicio do painel da tabela.
- O wrapper recebeu `width: clamp(560px, 50%, 920px)` e `max-width: 100%`, mantendo alinhamento a esquerda em desktop amplo e largura proxima de metade da area util.
- Em telas ate `900px`, o wrapper volta para `width: 100%` e `max-width: 100%`, preservando responsividade.
- `.admin-overview-metrics-grid` deixou de ser o ponto responsavel pelo espaco e ficou com `margin-bottom: 0`.
- `.admin-overview-clinic-access` e `.admin-overview-clinic-access-table` ficaram com `width: 100%`, mas agora limitados pelo wrapper especifico.
- Nao houve alteracao em dados, endpoint, autenticacao, backend, banco, migration, textos, status, colunas, Materiais, Medicamentos ou CSS global.
- Testes estruturais atualizados para garantir import do CSS da feature, wrapper, espaco via `margin-top`, largura em `clamp(560px, 50%, 920px)` e fallback responsivo.
- Sem commit e sem push.
