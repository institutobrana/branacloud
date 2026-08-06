# Contrato Funcional - Índices Financeiros

## 1. Objetivo

Definir o contrato funcional definitivo do módulo `Configurações -> Índices financeiros` para o novo frontend React do Brana Cloud, alinhado ao backend atual e às decisões já aprovadas pelo usuário.

## 2. Escopo

Este contrato cobre:

- acesso ao módulo;
- shell;
- barra lateral em L;
- toolbar horizontal;
- duas tabelas empilhadas;
- seleção mestre/detalhe;
- modais de índice, cotação e migração;
- regras de criação, alteração, exclusão e migração;
- estados de loading, vazio e erro;
- permissões e tenant;
- acessibilidade, responsividade e tema;
- testes contratuais futuros.

Fora de escopo:

- alteração de backend;
- alteração de banco;
- nova migração;
- reprodução da procedure do EasyDental;
- filtros;
- busca;
- impressão;
- exportação;
- paginação, salvo exigência real do endpoint;
- botão `Fecha`;
- criação ou alteração de índices nativos;
- novo sistema de permissões;
- cálculos financeiros no React;
- mudanças em módulos dependentes;
- redesign global do shell.

## 3. Fontes

### Fontes principais

- [docs/auditoria_indices_financeiros_brana_cloud.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_brana_cloud.md)
- [docs/auditoria_indices_financeiros_easydental_desktop.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_easydental_desktop.md)
- [docs/comparativo_indices_financeiros_easydental_brana_cloud_react.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/comparativo_indices_financeiros_easydental_brana_cloud_react.md)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [frontend/index.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py)
- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py)
- [backend/models/indice_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/indice_financeiro.py)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/security/dependencies.py)
- [frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx)
- [frontend-react/src/layout/BranaShell.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaShell.jsx)
- [frontend-react/src/layout/BranaActionTopbar.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaActionTopbar.jsx)
- [frontend-react/src/components/BranaTable.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaTable.jsx)
- [frontend-react/src/components/BranaModal.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaModal.jsx)
- [frontend-react/src/theme/branaTokens.css](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/theme/branaTokens.css)
- [frontend-react/src/styles/globals.css](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/styles/globals.css)
- [docs/contrato_funcional_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [docs/auditoria_padroes_react_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_padroes_react_plano_de_contas.md)
- [docs/auditoria_plano_de_contas_frontend_legado.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_frontend_legado.md)

## 4. Hierarquia de fontes

1. Backend e banco atuais do Brana Cloud.
2. Frontend legado do Brana Cloud.
3. EasyDental Desktop.
4. Prints do usuário para a janela principal.
5. Padrões React do Plano de contas.

### Regra de prevalência

- O backend atual prevalece para regras de domínio, persistência, tenant, permissões, respostas e identificação de cotações.
- O frontend legado prevalece para o fluxo web já integrado ao backend atual.
- O EasyDental é referência histórica e não pode sobrescrever silenciosamente o backend atual.
- Os prints só valem para o que é visível.
- O Plano de contas é referência estrutural, sem importação de regras de negócio.

## 5. Decisões aprovadas

1. O botão `Fecha` não existirá no React.
2. A toolbar horizontal terá exatamente dois grupos:
   - `Novo índice`, `Altera`, `Elimina`
   - separador visual
   - `Novo valor`, `Altera`, `Elimina`
3. As duas tabelas ficarão empilhadas verticalmente.
4. O texto visível da tabela inferior será preservado exatamente como `Cotações para reais`.
5. `UPO` será tratado como índice nativo no React.
6. O React não calculará o valor atual. O valor mostrado será sempre o retornado pelo backend.
7. O frontend React seguirá o backend atual para endpoints, permissões, tenant, registros reservados, bloqueios, exclusão, migração, regra do valor atual e identificação das cotações.
8. O Plano de contas será apenas referência estrutural, sem copiar regras de negócio.

## 6. Identidade do módulo

- Nome do módulo: `Índices financeiros`
- Agrupamento lateral: `Configurações`
- Texto do item lateral: `Índices financeiros`
- Texto visível da tabela inferior: `Cotações para reais`
- Indices nativos:
  - `255` -> `Reais / R$`
  - `2` -> `UHO`
  - `1` -> `USO`
  - `3` -> `UPO`

### Classificação funcional

- `Nome do módulo`: equivalente com adaptação
- `Cotações para reais`: equivalente
- `Índice` / `Sigla` / `Valor atual`: equivalente com adaptação
- `UPO`: equivalente com adaptação, agora assumido como nativo por decisão aprovada

## 7. Acesso e rota

### Rota proposta

- `configuracoes/indices-financeiros`

### Screen interno

- `indices-financeiros`

### Página futura

- `IndicesFinanceirosPage`

### Título visível

- `Índices financeiros`

### Breadcrumb

- Não obrigatório por enquanto.
- Só incluir se o shell atual realmente usar breadcrumb na área.

### Permissões exigidas

- autenticação válida;
- acesso ao módulo financeiro;
- isolamento por clínica no backend.

### Comportamento de acesso negado

- HTTP `401`: redirecionar/solicitar login conforme padrão do projeto.
- HTTP `403`: exibir acesso negado conforme padrão do projeto.
- HTTP `404`: tratar como recurso inexistente, sem assumir que o usuário tem acesso ao módulo.

### Comportamento de rota direta

- a página deve carregar normalmente se o usuário estiver autenticado e autorizado;
- caso contrário, o shell deve redirecionar ou bloquear conforme padrão global do projeto.

### Comportamento de recarga

- a recarga deve reconstituir o estado a partir do backend;
- se a seleção anterior ainda existir, preservar;
- se não existir mais, aplicar fallback seguro.

## 8. Permissões

- O backend é a fonte de verdade para permissão.
- O React não deve simular permissão por conta própria.
- O módulo depende de `require_module_access("financeiro")`.
- O frontend deve apenas reagir aos códigos `401`, `403`, `404` e `409`.

## 9. Tenant

- Nenhum `clinica_id` será informado manualmente pelo frontend.
- Todas as requisições dependem do contexto autenticado.
- O backend deve continuar filtrando por `current_user.clinica_id`.
- O React não pode misturar registros entre clínicas.

## 10. Shell

- O módulo deve abrir dentro do shell real do projeto.
- O shell deve usar a composição padrão com rail lateral, topbar e workspace.
- A página de `Índices financeiros` deve ocupar a área de conteúdo principal do workspace.

## 11. Barra em L

- A barra lateral e a barra horizontal devem aparecer como composição contínua do mesmo shell.
- Não deve existir emenda visual estranha entre o rail lateral e a banda operacional.
- O módulo deve usar os tokens e superfícies do sistema já existentes.
- O layout deve permanecer compacto e legível em tema claro e escuro.

## 12. Toolbar

### Ordem exata

1. `Novo índice`
2. `Altera`
3. `Elimina`
4. separador
5. `Novo valor`
6. `Altera`
7. `Elimina`

### Identificadores funcionais

- `novo_indice`
- `altera_indice`
- `elimina_indice`
- `novo_valor`
- `altera_cotacao`
- `elimina_cotacao`

### Contrato dos botões

| Botão | Pré-condição | Habilitado | Desabilitado | Ação | Modal/Confirmação | Dependência | Loading | Duplo submit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Novo índice | usuário autorizado e sem mutação | sim | durante loading/mutação | abre modal de novo índice | modal | nenhuma | bloqueado | bloqueado |
| Altera | índice selecionado | sim | sem seleção, reservado, loading/mutação | abre modal de alteração do índice | modal | seleção do índice | bloqueado | bloqueado |
| Elimina | índice selecionado | sim | sem seleção, reservado, loading/mutação | consulta uso e decide fluxo | confirmação ou modal de migração | seleção do índice | bloqueado | bloqueado |
| Novo valor | índice selecionado | sim | sem seleção, loading/mutação | abre modal de nova cotação | modal | seleção do índice | bloqueado | bloqueado |
| Altera | cotação selecionada | sim | sem seleção, loading/mutação | abre modal de edição da cotação | modal | seleção da cotação | bloqueado | bloqueado |
| Elimina | cotação selecionada | sim | sem seleção, loading/mutação | pede confirmação e remove cotação | confirmação | seleção da cotação | bloqueado | bloqueado |

### Regras de estado

- `Novo índice` habilita quando o usuário tiver permissão e não houver mutação em andamento.
- `Altera índice` exige índice selecionado e fica desabilitado para índice reservado.
- `Elimina índice` exige índice selecionado e consulta uso antes de decidir o fluxo.
- `Novo valor` exige índice selecionado e segue o backend atual quanto à possibilidade de cotação em índice reservado.
- `Altera cotação` exige cotação selecionada.
- `Elimina cotação` exige cotação selecionada.

## 13. Layout

- As seções devem ficar empilhadas verticalmente.
- A seção superior contém `Índices financeiros`.
- A seção inferior contém `Cotações para reais`.
- A proporção inicial deve priorizar a tabela superior, mantendo a inferior legível.
- Deve haver scroll interno quando necessário.
- A toolbar não deve sobrepor as tabelas.
- O layout deve ser responsivo para larguras menores sem virar cards.

## 14. Tabela de índices

### Colunas visíveis

1. `Índice`
2. `Sigla`
3. `Valor atual`

### Regras

- A chave técnica da linha deve ser estável.
- Os campos técnicos `id`, `numero` e `reservado` devem permanecer ocultos.
- A seleção deve ser única e controlada pela linha.
- A seleção inicial deve seguir o padrão documentado pelo backend/legado:
  - selecionar o primeiro índice disponível;
  - preservar o item válido após recarga;
  - limpar ou aplicar fallback seguro se o item desaparecer.
- O valor atual deve ser formatado apenas para exibição.
- O React não deve recalcular o valor atual.
- O separador decimal deve seguir pt-BR.
- Não adicionar símbolo monetário automaticamente.

### Ordenação inicial

- seguir a ordenação do backend;
- a tabela deve carregar já ordenada e estável.

## 15. Tabela de cotações

### Colunas visíveis

1. `Data`
2. `Cotações`

### Observação de texto

- o título da seção será `Cotações para reais`;
- o nome da coluna permanece `Cotações` no contrato visual, mas a exibição da unidade monetária não deve ser forçada.

### Regras

- a chave técnica da linha deve usar `cotacao_id`;
- `indice_id` ou número técnico podem existir apenas como campo oculto;
- a ordenação deve seguir o backend: mais recente primeiro, com desempate por id;
- a data deve ser formatada em pt-BR;
- a cotação deve ser formatada em pt-BR;
- não recalcular cotação no front;
- a tabela inferior deve mostrar vazio próprio quando não houver histórico;
- ao selecionar um índice sem histórico, mostrar a mensagem `Nenhuma cotação cadastrada.`

### Estado sem índice selecionado

- mostrar orientação para selecionar um índice.

## 16. Relação mestre/detalhe

- A tabela de índices é a mestre.
- A tabela de cotações é o detalhe.
- Ao trocar o índice, a seleção da cotação deve ser limpa.
- O carregamento das cotações deve ser independente.
- Requisições fora de ordem não podem sobrescrever o detalhe atual.
- A seleção deve ser preservada quando o registro ainda existir.
- Mutação em uma tabela deve recarregar a outra quando necessário.

## 17. Estados de loading

- A página deve exibir loading inicial.
- A tabela de índices deve ter loading próprio.
- A tabela de cotações deve ter loading próprio.
- O loading de uma tabela não deve travar a outra além do necessário.
- O botão correspondente deve ficar bloqueado durante a mutação.

## 18. Estados vazios

- Página sem dados: vazio controlado.
- Tabela de índices vazia: mensagem apropriada.
- Tabela de cotações vazia: `Nenhuma cotação cadastrada.`
- Índice sem seleção: mensagem orientativa.

## 19. Estados de erro

- Erro de página.
- Erro ao carregar índices.
- Erro ao carregar cotações.
- Erro de validação.
- Erro de permissão.
- Erro de não encontrado.
- Erro de conflito.

O mecanismo de exibição deve seguir o padrão atual do projeto e não criar um sistema paralelo de erro.

## 20. Novo índice

### Modal

- Título: `Novo índice financeiro`
- Campos:
  - `Nome`
  - `Sigla`

### Regras

- ambos obrigatórios;
- trim antes de enviar;
- sigla em maiúsculas no backend;
- não incluir `numero`, `valor atual`, `reservado` ou `clinica_id`;
- não incluir cotação inicial;
- submit via `POST /indices-financeiros`;
- impedir duplo envio;
- manter modal aberto em erro;
- fechar somente após sucesso;
- recarregar a lista de índices;
- selecionar o novo índice se a resposta fornecer chave estável.

### Classificação de evidência

- obrigatório pelo backend;
- confirmado no legado;
- confirmado pelo EasyDental;
- padrão estrutural React.

## 21. Altera índice

### Modal

- Título: `Altera índice financeiro`

### Regras

- preencher a partir do índice selecionado;
- campos editáveis: `Nome` e `Sigla`;
- bloquear índices reservados;
- submit via `PATCH /indices-financeiros/{numero}`;
- impedir alteração concorrente de seleção;
- recarregar índices e preservar seleção quando possível;
- atualizar a toolbar após sucesso.

### O que não existe no contrato

- edição de `valor atual`;
- edição de `numero`;
- edição de `reservado`.

## 22. Elimina índice

### Fluxo

1. Consultar `GET /indices-financeiros/{numero}/em-uso`.
2. Se reservado, bloquear.
3. Se sem uso, pedir confirmação simples e usar `DELETE /indices-financeiros/{numero}`.
4. Se em uso, abrir fluxo de migração.

### Migração

- título de modal definido pelo padrão do projeto;
- origem visível;
- seletor de destino obrigatório;
- destino diferente da origem;
- destinos inválidos removidos da lista;
- submit via `POST /indices-financeiros/{numero}/migrar-e-excluir`.

### Comportamento após sucesso

- recarregar índices;
- recarregar cotações;
- aplicar seleção segura no próximo item válido.

## 23. Migração

- A migração é obrigatória quando o índice estiver em uso.
- A migração deve ser controlada por modal próprio.
- O React deve mostrar os índices de destino válidos da mesma clínica.
- O React não deve assumir migração automática sem confirmação.
- O backend atual prevalece sobre qualquer tentativa de regra local.

## 24. Novo valor

### Modal

- Título: `Novo valor`

### Campos

- `Data`
- `Cotação`

### Regras

- índice associado deve aparecer apenas como contexto, não como campo editável;
- data obrigatória;
- cotação obrigatória;
- controle numérico com separador pt-BR;
- payload no formato esperado pelo backend;
- não assumir valor mínimo ou negativo sem evidência do backend;
- submit via `POST /indices-financeiros/{numero}/cotacoes`;
- impedir duplo envio;
- fechar após sucesso;
- recarregar cotações e índices;
- selecionar a nova cotação se possível.

## 25. Altera valor

### Modal

- Título: `Altera valor`

### Regras

- preencher data e cotação da linha selecionada;
- submit via `PATCH /indices-financeiros/{numero}/cotacoes/{cotacao_id}`;
- o contrato não deve oferecer campo que o backend não aceite;
- preservar a seleção depois da recarga quando possível;
- recarregar tabela inferior e superior após sucesso.

## 26. Elimina valor

- Exige cotação selecionada.
- Usar confirmação explícita.
- Submit via `DELETE /indices-financeiros/{numero}/cotacoes/{cotacao_id}`.
- Recarregar as duas tabelas após sucesso.
- O React não recalcula qual cotação virou atual.
- O fallback exibido deve vir do backend.

## 27. Regra do valor atual

- O valor atual é responsabilidade do backend.
- O React apenas exibe o valor retornado.
- O desktop histórico usa `sp_GetValorIndice` e fallback `1.00`.
- O Brana Cloud atual usa última cotação por `data desc, id desc`, com fallback `1.0` para reservados e `0.0` para comuns sem cotação.
- O contrato futuro deve seguir o backend atual.

## 28. Índices reservados

- `255 -> Reais / R$`
- `2 -> UHO`
- `1 -> USO`
- `3 -> UPO`

### Regras

- não alterar;
- não excluir;
- manter visíveis;
- permitir seleção;
- bloquear alteração e exclusão;
- permitir o comportamento de cotação apenas se o backend atual permitir.

## 29. Endpoints

### Tabela contratual

| Função | Método | Endpoint | Parâmetros | Body | Resposta | Uso no React | Atualização após sucesso | Erros relevantes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Listar índices | GET | `/indices-financeiros` | nenhum | nenhum | lista de índices | carregar tabela superior | recarregar índices e seleção | 401, 403 |
| Criar índice | POST | `/indices-financeiros` | nenhum | `{ nome, sigla }` | índice criado/dados do índice | novo índice | recarregar índices | 400, 401, 403 |
| Alterar índice | PATCH | `/indices-financeiros/{numero}` | `numero` | `{ nome?, sigla? }` | dados do índice | alterar índice | recarregar índices | 400, 401, 403, 404 |
| Verificar uso | GET | `/indices-financeiros/{numero}/em-uso` | `numero` | nenhum | `{ em_uso: bool }` | definir fluxo de exclusão | nenhum efeito direto | 401, 403, 404 |
| Migrar e excluir | POST | `/indices-financeiros/{numero}/migrar-e-excluir` | `numero` | `{ numero_destino }` | sucesso | fluxo de migração | recarregar tudo | 400, 401, 403, 404 |
| Excluir índice | DELETE | `/indices-financeiros/{numero}` | `numero` | nenhum | sucesso | exclusão simples | recarregar índices e cotações | 400, 401, 403, 404, 409 |
| Listar cotações | GET | `/indices-financeiros/{numero}/cotacoes` | `numero` | nenhum | lista de cotações | carregar tabela inferior | recarregar cotações | 401, 403, 404 |
| Criar cotação | POST | `/indices-financeiros/{numero}/cotacoes` | `numero` | `{ data, valor }` | sucesso | novo valor | recarregar cotações e índices | 400, 401, 403, 404 |
| Alterar cotação | PATCH | `/indices-financeiros/{numero}/cotacoes/{cotacao_id}` | `numero`, `cotacao_id` | `{ data, valor }` | sucesso | alterar valor | recarregar cotações e índices | 400, 401, 403, 404 |
| Excluir cotação | DELETE | `/indices-financeiros/{numero}/cotacoes/{cotacao_id}` | `numero`, `cotacao_id` | nenhum | sucesso | eliminar valor | recarregar cotações e índices | 401, 403, 404 |

## 30. Payloads

### Confirmados

- Criar índice: `{ nome, sigla }`
- Alterar índice: `{ nome?, sigla? }`
- Criar/alterar cotação: `{ data, valor }`
- Migrar e excluir: `{ numero_destino }`

### Regras

- não incluir `clinica_id`;
- não incluir `id` se o endpoint não exigir;
- não incluir campos de domínio que o backend não aceite.

## 31. Respostas

- Lista de índices: lista de objetos com chave estável e `valor_atual`.
- Lista de cotações: lista de `{ id, data, valor }`.
- Sucesso de criação/alteração/exclusão: usar `detail` conforme backend.
- Em erro, respeitar os códigos e mensagens retornadas pelo backend.

## 32. Validações

- Nome obrigatório.
- Sigla obrigatória.
- Índice reservado bloqueado para alterar e excluir.
- Cotação exige índice selecionado.
- Cotação exige data.
- Cotação exige valor.
- O React não deve duplicar regra de domínio que já exista no backend.

## 33. Mensagens

### Categorias

- validação local;
- erro de backend;
- reservado;
- em uso;
- migração necessária;
- exclusão;
- sucesso;
- erro de rede;
- acesso negado;
- não encontrado;
- estado vazio.

### Regra

- As mensagens devem seguir o padrão do projeto React.
- Não copiar mensagens antigas do EasyDental quando não forem apropriadas para web.

## 34. Confirmações

- Exclusão de índice comum sem uso: confirmação simples.
- Exclusão de índice em uso: não executar exclusão simples; abrir migração.
- Exclusão de cotação: confirmação explícita.
- Migração: confirmação explícita.

## 35. Atualização após mutações

- Criar índice: recarregar índices.
- Alterar índice: recarregar índices e preservar seleção quando possível.
- Excluir índice: recarregar índices e cotações.
- Criar cotação: recarregar cotações e índices.
- Alterar cotação: recarregar cotações e índices.
- Excluir cotação: recarregar cotações e índices.

## 36. Seleção

- Seleção única em ambas as tabelas.
- Linha clicável.
- Seleção baseada em chave técnica estável.
- Seleção de cotações limpa quando o índice muda.
- Seleção inválida deve ser corrigida ou limpa após recarga.

## 37. Acessibilidade

- Foco visível.
- Labels associados aos campos.
- Tab e Shift+Tab previsíveis.
- Esc fecha modais conforme padrão do projeto.
- Enter submete apenas quando seguro.
- Foco retorna ao botão que abriu o modal quando possível.
- Botões desabilitados semânticamente.

## 38. Responsividade

- Desktop como uso principal.
- Tabelas empilhadas.
- Scroll interno.
- Redução controlada de alturas.
- Sem sobreposição com toolbar.
- Não transformar a tela em cards.
- Não ocultar colunas automaticamente sem contrato explícito.

## 39. Tema claro e escuro

- Usar tokens existentes.
- Preservar contraste e seleção.
- Cabeçalho, bordas e modais devem respeitar o tema.
- Não criar valores fixos se já existir token compartilhado.

## 40. Responsabilidades funcionais futuras

- Página;
- toolbar;
- tabela de índices;
- tabela de cotações;
- hooks;
- API;
- mappers;
- validators;
- modais;
- helpers de reservados;
- formatação.

O contrato não define ainda a árvore definitiva de arquivos.

## 41. Testes contratuais

### Matriz mínima futura

- item lateral;
- rota;
- shell;
- banda em L;
- toolbar;
- leitura de índices;
- leitura de cotações;
- seleção mestre/detalhe;
- criação;
- alteração;
- exclusão;
- migração;
- índices reservados;
- tenant;
- erros;
- regra de atualização do valor atual;
- tema claro/escuro;
- acessibilidade básica.

## 42. Fora de escopo

- alteração de backend;
- alteração de banco;
- nova migração;
- mudança da regra do valor atual;
- reprodução da procedure do EasyDental;
- filtros;
- busca;
- impressão;
- exportação;
- paginação, salvo exigência real do endpoint;
- botão `Fecha`;
- criação ou alteração de índices nativos;
- novo sistema de permissões;
- cálculos financeiros no React;
- mudanças em módulos dependentes;
- redesign global do shell.

## 43. Riscos

- Recalcular o valor atual no React.
- Copiar regras do Plano de contas para este domínio.
- Assumir comportamento visual sem runtime confirmado.
- Misturar EasyDental histórico com contrato do backend atual.
- Expor `clinica_id` manualmente no frontend.

## 44. Critérios de aceite

- rota acessível;
- shell correto;
- barra em L sem emenda;
- toolbar correta;
- duas tabelas;
- seleção mestre/detalhe;
- leitura real;
- CRUD de índices comuns;
- proteção dos reservados;
- CRUD de cotações;
- exclusão com migração;
- atualização do valor atual;
- loading, vazio e erro;
- tenant;
- permissões;
- tema claro e escuro;
- testes;
- build;
- validação runtime;
- ausência de mojibake;
- documentação atualizada.

## 45. Dúvidas residuais

- Nenhuma dúvida contratual essencial permanece aberta além de detalhes textuais de implementação visual que podem ser resolvidos pelo padrão do projeto.

## 46. Conclusão

O contrato do novo frontend React para `Índices financeiros` deve seguir o backend atual como fonte de verdade, manter a estrutura visual confirmada pelos prints e pela comparação formal, preservar os índices nativos e tratar o Plano de contas apenas como referência estrutural.

## 47. Próxima etapa recomendada

1. Implementar a página React seguindo este contrato.
2. Criar os testes contratuais mínimos.
3. Validar runtime e tema antes de fechar a entrega.

## 48. Fechamento contratual desta rodada

Este contrato permanece consolidado com o runtime final homologado em `06/08/2026`.

Confirmações adicionais:

- a sessão autenticada depende de `brana_token`;
- `/api/me` com `200` continua sendo a verificação de sessão;
- os seis modais finais foram visualizados e mantidos sem mutação ao cancelar;
- os reservados seguem protegidos contra exclusão e migracao;
- `valor atual` continua vindo do backend, nunca de calculo local;
- os testes e o build permaneceram verdes nesta rodada.
