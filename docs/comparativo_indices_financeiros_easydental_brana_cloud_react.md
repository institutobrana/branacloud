# Comparativo Formal - Índices Financeiros no EasyDental Desktop, Brana Cloud, Backend Atual e Padrão React

## 1. Objetivo

Comparar, com base em evidências documentadas, o módulo `Configurações -> Índices financeiros` entre:

- EasyDental Desktop;
- frontend legado do Brana Cloud;
- backend e banco atuais do Brana Cloud;
- padrão estrutural do novo frontend React;
- prints visuais fornecidos pelo usuário.

O resultado serve como base para decisão futura de contrato funcional, sem definir ainda o contrato final nem implementar código.

## 2. Escopo

Esta etapa cobre:

- identidade do módulo;
- estrutura visual principal;
- toolbar;
- tabela de índices;
- tabela de cotações;
- fluxo mestre/detalhe;
- criação, alteração e exclusão de índice e cotações;
- regra de valor atual;
- índices nativos;
- permissões e tenant;
- dependências;
- testes;
- comparação com o padrão do Plano de contas no React;
- decisões preliminares e dúvidas.

Não inclui:

- criação de contrato funcional definitivo;
- implementação de código;
- alteração de backend, banco ou frontend;
- atualização de roadmap.

## 3. Fontes

### Fonte prevalente por tema

1. Backend e banco atuais do Brana Cloud para contratos técnicos, persistência, tenant, permissões e operações atualmente possíveis.
2. Frontend legado do Brana Cloud para o fluxo web já integrado ao backend atual.
3. EasyDental Desktop como referência funcional histórica principal.
4. Prints fornecidos pelo usuário como evidência visual da janela principal.
5. Plano de contas no novo frontend React como referência estrutural e visual.

### Documentos lidos

- [docs/auditoria_indices_financeiros_brana_cloud.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_brana_cloud.md)
- [docs/auditoria_indices_financeiros_easydental_desktop.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_easydental_desktop.md)
- [docs/contrato_funcional_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [docs/auditoria_plano_de_contas_frontend_legado.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_frontend_legado.md)
- [docs/auditoria_plano_de_contas_easydental_desktop.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_easydental_desktop.md)
- [docs/auditoria_padroes_react_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_padroes_react_plano_de_contas.md)
- [docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md)
- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)
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
- [frontend-react/tests/planoContasToolbar.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasToolbar.test.js)
- [frontend-react/tests/planoContasRouting.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasRouting.test.js)
- [frontend-react/tests/planoContasPageDelete.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasPageDelete.test.js)
- [frontend-react/tests/planoContasCategoryMigration.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigration.test.js)
- [frontend-react/tests/planoContasCategoryMigrationModal.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigrationModal.test.js)
- [frontend-react/tests/planoContasCategoryMigrationFlow.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigrationFlow.test.js)

## 4. Limitações

- A auditoria visual em runtime do EasyDental Desktop ficou bloqueada.
- Os prints do usuário confirmam apenas a janela principal, duas tabelas e os sete botões, não os modais internos.
- Não houve alteração de código, banco ou configuração.
- Esta etapa não cria o contrato funcional definitivo.

## 5. Hierarquia de fontes

### Regra adotada

- Quando o backend atual já suporta uma regra, ele prevalece para o futuro contrato.
- Quando o frontend legado mostra um fluxo já integrado e o backend é compatível, o legado reforça a forma de uso.
- Quando o EasyDental diverge do backend atual, a divergência é registrada como histórica ou funcional, não copiada automaticamente.
- Quando o print confirma a janela principal, ele vale apenas para o que é visível.
- Quando o padrão do Plano de contas ajuda na composição visual do React, ele é usado apenas como referência estrutural.

## 6. Critérios de classificação

Cada item foi classificado como:

- equivalente;
- equivalente com adaptação;
- divergente;
- exclusivo do EasyDental;
- exclusivo do Brana Cloud;
- imposto pelo backend atual;
- referência apenas visual;
- não confirmado;
- obsoleto;
- não aplicável.

Classificações complementares:

- confiança: alta, média, baixa;
- decisão futura: deve ser preservado, deve ser adaptado, deve ser descartado, exige decisão no contrato, exige validação de runtime, exige teste de backend, exige confirmação do usuário.

## 7. Identidade do módulo

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nome do módulo | `Configurações -> Índices financeiros` | `Configuração de índices financeiros` na janela; menu `config-indices-financeiros` | Router `indices-financeiros` | `Configurações` como espaço de navegação | equivalente com adaptação | alta | backend + legado + desktop | deve ser adaptado | título do React ainda precisa ser fechado |
| Caminho no menu | `Configurações -> Índices financeiros` | `data-menu-action="config-indices-financeiros"` | rota protegida pelo módulo `financeiro` | item de configuração no shell | equivalente com adaptação | alta | desktop + legado + backend | deve ser preservado | rota do React ainda não está implantada |
| Título da janela/página | não confirmado visualmente no runtime | `Configuração de índices financeiros` | resposta/rota não define título visual | página React deve receber título do módulo | divergente | média | legado + backend | exige decisão no contrato | print confirma apenas a janela principal, sem modal |
| Nomenclatura de índice | `índice` / `reais` / `moeda corrente` | `nome`, `sigla`, `valor atual` | `nome`, `sigla`, `numero`, `valor_atual` | `grupo/categoria` no Plano de contas não se aplica aqui | equivalente com adaptação | alta | backend + desktop | deve ser adaptado | o React não deve copiar semântica do Plano de contas |
| Nomenclatura de cotação | `cotação` | `cotação` | `cotacao_id` + `data` + `valor` | tabela detalhada própria | equivalente com adaptação | alta | backend + desktop | deve ser adaptado | chave técnica diferente entre desktop e backend |
| Uso de `reais` | índice nativo | `Cotações para Reais` na UI legada | `R$ / Reais` como reservado | pode aparecer como label de apoio | equivalente | alta | desktop + backend + print | deve ser preservado | texto exato da página React ainda pode variar |
| Uso de `valor atual` | existe como conceito do índice | coluna visível na tabela superior | calculado por leitura | colunas de cálculo em tabela | equivalente com adaptação | alta | backend + desktop + print | deve ser preservado | regra de cálculo não deve ser reimplementada no front |
| Siglas nativas | `R$`, `UHO`, `UPO`, `USO` | confirmadas no mapeamento técnico, com UPO parcialmente confirmado no recorte lido | reservados por número/sigla | não há equivalente direto | equivalente com adaptação | média | backend + desktop | exige decisão no contrato | UPO segue como parcialmente confirmado no desktop |

### Nomenclatura recomendada para o React

- `Configurações -> Índices financeiros`
- título funcional: `Índices financeiros`
- tabela inferior: `Cotações para reais`
- índice nativo: `Reais`

### Textos já confirmados

- `Índices financeiros`
- `Cotações para reais`
- `Novo índice`
- `Altera`
- `Elimina`
- `Fecha`
- `Novo valor`

### Textos que ainda exigem decisão

- título final da página React;
- textos de confirmação de migração e exclusão;
- mensagens de erro do fluxo de runtime React.

## 8. Estrutura visual

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Janela compacta | confirmada pelos prints | modal compacta em `frontend/app.js` | não define visual | página em shell com content area | equivalente com adaptação | alta | print + legado + React | deve ser adaptado | o React deve abandonar visual de modal única e virar página |
| Tabela superior | confirmada pelos prints | `Índices financeiros` | lista com `valor_atual` calculado | tabela principal do módulo | equivalente | alta | print + backend + legado | deve ser preservado | campos técnicos ocultos ainda pendentes |
| Tabela inferior | confirmada pelos prints | `Cotações` / `Cotações para Reais` | lista por `cotacao_id` | tabela secundária/ detalhe | equivalente com adaptação | alta | print + backend + legado | deve ser adaptado | layout vertical parece o mais coerente com o módulo |
| Botões laterais | confirmados pelos prints | toolbar interna da modal | endpoints suportam todos | toolbar global ou local da página | equivalente com adaptação | alta | print + backend | deve ser adaptado | decidir se `Fecha` permanece no React |
| Botão Fecha | confirmado visualmente | fecha modal no legado | sem efeito no backend | pode fechar página/voltar | divergente | alta | print + legado | exige decisão no contrato | em React pode virar navegação de retorno |

### Recomendação visual preliminar

- A composição mais coerente é uma página React com duas tabelas empilhadas verticalmente, mantendo a lógica mestre/detalhe.
- Os botões de ação devem migrar para a toolbar.
- `Fecha` deve existir como ação de navegação apenas se o contrato quiser espelhar explicitamente o legado; caso contrário, pode ser substituído por navegação de retorno.

## 9. Toolbar

### Comparativo dos sete comandos

| Comando | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Novo índice | existe visualmente | abre `cadModalAbrir` | `POST /indices-financeiros` | botão de toolbar/modal | equivalente | alta | backend + legado + print | deve ser preservado | validação visual de foco no modal ficou bloqueada |
| Altera índice | existe visualmente | usa seleção do índice | `PATCH /indices-financeiros/{numero}` | botão contextual por seleção | equivalente com adaptação | alta | backend + legado + print | deve ser preservado | decisão de habilitação depende da seleção ativa |
| Elimina índice | existe visualmente | consulta uso e pode migrar | `GET /em-uso`, `DELETE`, `POST /migrar-e-excluir` | ação perigosa com diálogo | equivalente com adaptação | alta | backend + legado + desktop | exige decisão no contrato | fluxo de migração precisa ser explicitado |
| Novo valor | existe visualmente | abre modal com data e valor | `POST /cotacoes` | ação contextual por índice selecionado | equivalente | alta | backend + legado + print | deve ser preservado | backend define validação principal |
| Altera valor | existe visualmente | usa cotações do índice selecionado | `PATCH /cotacoes/{cotacao_id}` | ação contextual por cota selecionada | equivalente | alta | backend + legado + print | deve ser preservado | depende da seleção da tabela inferior |
| Elimina valor | existe visualmente | confirma antes de excluir | `DELETE /cotacoes/{cotacao_id}` | ação contextual perigosa | equivalente | alta | backend + legado + print | deve ser preservado | sem proteção especial de última cotação no backend atual |
| Fecha | existe visualmente | fecha a modal | não há endpoint | pode virar navegação/voltar | divergente | alta | print + legado | exige decisão no contrato | botão pode ser omitido ou reinterpretado |

### Decisões preliminares de toolbar

- `Novo índice`, `Altera`, `Elimina`, `Novo valor`, `Altera` e `Elimina` devem existir no React.
- `Altera` e `Elimina` devem depender da seleção correspondente.
- `Novo valor` deve depender de índice selecionado.
- `Fecha` deve ser decidido no contrato: preservar como retorno/navegação ou omitir.

## 10. Tabela de índices

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Colunas | `Índice`, `Sigla`, `Valor atual` | mesma estrutura visual | `nome`, `sigla`, `numero`, `valor_atual` | tabelas compactas com colunas explícitas | equivalente com adaptação | alta | print + backend + legado | deve ser preservado | chave visual do React ainda precisa ser fechada |
| Ordem | índice, sigla, valor atual | mesma ordem no legado | ordenação de serviço por nome | colunas ordenadas manualmente | equivalente | alta | print + backend | deve ser preservado | ordenação técnica é por nome no backend atual |
| Formatação | valor monetário com casas decimais | `formatNumFixed(..., 4)` | `valor_atual` calculado em leitura | formatadores de tabela | equivalente com adaptação | alta | backend + legado | deve ser preservado | exibição exata do decimal precisa de decisão visual |
| Seleção | linha ativa | `indiceSelNumero` | seleção por `numero`/`id` | rowSelection única | equivalente | alta | backend + legado + print | deve ser preservado | seleção deve ser única |
| Estado vazio | janela vazia sem registros | `Nenhum índice cadastrado.` | lista vazia retornável | empty state já usado no React | equivalente | alta | backend + legado | deve ser preservado | texto final do empty state no React pode variar |
| Valor atual | visível | calculado por leitura | última cotação por `data desc, id desc`; reservado sem cotação `1.0`; comum sem cotação `0.0` | tabela de exibição e recarga | divergente | alta | backend | deve ser preservado | desktop usa regra histórica diferente (`sp_GetValorIndice`) |

### Correspondência técnica

- EasyDental:
  - `_INDICE.NOMIND`
  - `_INDICE.SIGIND`
  - valor calculado por `sp_GetValorIndice`
- Brana Cloud:
  - `IndiceFinanceiro.nome`
  - `IndiceFinanceiro.sigla`
  - `IndiceFinanceiro.numero`
  - `valor_atual` calculado em leitura
- React:
  - colunas visíveis devem refletir `nome`, `sigla` e `valor atual`
  - chave de seleção deve ser estável
  - campos ocultos devem existir apenas se necessários para referência técnica

## 11. Tabela de cotações

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Data | `DATA` em PK composta | data exibida no detalhe | `data` em string ISO | campos de data já existentes no React | equivalente com adaptação | alta | desktop + backend | deve ser preservado | formato de entrada visual não foi confirmado no desktop runtime |
| Cotação | `VALOR` | `cotação` | `valor` float | campo numérico/decimal | equivalente com adaptação | alta | backend + desktop | deve ser preservado | precisão visual no desktop ficou parcial |
| Chave | `(NROIND, DATA)` | `cotacao_id` | `cotacao_id` + `indice_id` | id técnico interno | divergente | alta | backend + desktop | exige decisão no contrato | o React não deve espelhar PK histórica do desktop |
| Ordenação | por data | visualmente compatível com lista temporal | `data asc, id asc` ao listar | ordenação de tabela | equivalente com adaptação | alta | backend + desktop | deve ser adaptado | ordem técnica do backend difere do desempate histórico |
| Estado vazio | sem cotações | mensagem de vazio no legado | lista vazia | empty state | equivalente | alta | backend + legado + print | deve ser preservado | texto final no React ainda pode variar |
| Atualização do valor atual | por data `<=` a consulta | recarga após mutação | recálculo em leitura com última cotação | atualização após mutação | divergente | alta | backend + desktop | deve ser adaptado | a regra de domínio deve vir do backend |

### Divergências principais

- EasyDental usa chave por `(NROIND, DATA)`.
- Brana Cloud usa identificador técnico `cotacao_id`.
- Desktop calcula por `DATA <= data` na procedure.
- Brana Cloud calcula por última cotação em leitura.
- O React não deve recalcular a regra de domínio localmente.

## 12. Fluxo mestre/detalhe

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Seleção inicial | não confirmada visualmente no runtime | primeiro índice disponível se seleção sumir | `indiceSelNumero` recai no primeiro item quando necessário | hooks de seleção preservável | equivalente com adaptação | média | backend + legado | deve ser preservado | visual runtime do desktop continua bloqueado |
| Carregamento inferior | depende do índice | recarrega cotações ao mudar seleção | GET separado por índice | tabela dependente do painel mestre | equivalente | alta | backend + legado | deve ser preservado | a UI React deve lidar com loading concorrente |
| Troca de índice | não confirmada visualmente | limpa `cotacaoSelId` e recarrega cotações | recarregamento separado | state local de seleção | equivalente | alta | backend + legado | deve ser preservado | risco de corrida em troca rápida |
| Atualização cruzada | valor atual visível | recarga após mutações | recálculo em leitura | hook de estado/refresh | equivalente com adaptação | alta | backend + legado | deve ser preservado | React deve evitar atualização fora de ordem |
| Ausência de cotações | não confirmado visualmente | empty state textual | lista vazia | empty state padrão | equivalente | alta | backend + legado | deve ser preservado | texto final pode ser adaptado |

### Riscos de runtime

- cotações de índice anterior aparecendo após troca rápida;
- seleção inválida persistindo após refresh;
- valor atual não atualizar após mutação;
- botões operarem sobre registro incorreto.

## 13. Novo índice

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Campos | não confirmados visualmente | `Nome`, `Sigla` | `IndicePayload(nome, sigla)` | modais simples com campos mínimos | equivalente com adaptação | alta | backend + legado | deve ser preservado | limite de caracteres no desktop não foi confirmado |
| Nível técnico | reservado/nativo | trim + uppercase | trim + uppercase no backend | form validators e normalizers | equivalente com adaptação | alta | backend + legado | deve ser preservado | frontend não deve assumir regra de domínio sozinho |
| Valor inicial | não confirmado visualmente | modal simples sem campo de valor inicial | cria índice sem cotação obrigatória | novo modal simples | divergente | alta | backend + legado | exige decisão no contrato | primeira cotação não é obrigatória no backend atual |
| Duplicidade | não confirmada visualmente | não localizada constraint explícita | unicidade por clínica/numero; nome/sigla sem constraint explícita encontrada | validações de formulário | divergente | média | backend | exige teste de backend | regra de nome/sigla precisa de decisão |
| Resposta | não confirmada visualmente | recarrega a tela | retorna dados do índice | refresh local do estado | equivalente | alta | backend + legado | deve ser preservado | resposta visual do desktop não foi observada |

## 14. Altera índice

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Índices nativos | reservados | bloqueio de reservados | `reservado=True` impede alteração | modais com estado inicial | equivalente | alta | backend + desktop | deve ser preservado | UPO continua parcialmente confirmado no desktop |
| Campos editáveis | não confirmados visualmente | `Nome`, `Sigla` | `IndiceUpdatePayload` | modal editável | equivalente com adaptação | alta | backend + legado | deve ser preservado | se o número interno aparece na UI segue não confirmado |
| Valor atual no modal | não confirmado visualmente | não observado | não é editado diretamente | não deve ser editável no React | divergente | alta | backend | deve ser preservado | valor atual deve vir da tabela, não do modal |

## 15. Elimina índice

### Comparativo

| Cenário | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reservado | bloqueado | bloqueado | 400 `Índice reservado do sistema.` | bloqueio em diálogo | equivalente | alta | backend + desktop + legado | deve ser preservado | confirmação visual do desktop não foi observada |
| Em uso | bloqueado | consulta `em-uso` e migra | 409 em exclusão simples; migração via endpoint próprio | fluxo perigoso com diálogo | equivalente com adaptação | alta | backend + legado | deve ser preservado | desktop runtime não confirmou a migração |
| Sem uso | exclusão simples | confirmação simples | DELETE simples | ação perigosa com confirmação | equivalente | alta | backend + legado + print | deve ser preservado | título exato da confirmação no desktop continua não localizado |
| Com cotações | não confirmada visualmente | cotações são removidas ao excluir índice | `IndiceCotacao` tem cascade `delete-orphan` e FK `CASCADE` | exclusão com cuidado | equivalente com adaptação | alta | backend | deve ser preservado | efeito visual final não foi observado no runtime desktop |

### Matriz de cenários

| Cenário | EasyDental | Brana Cloud | React futuro | Classificação | Confiança | Decisão futura |
| --- | --- | --- | --- | --- | --- | --- |
| Índice reservado | bloqueado | bloqueado | bloqueio explícito | equivalente | alta | deve ser preservado |
| Índice comum sem uso | confirmação simples | DELETE simples | confirmação + ação | equivalente com adaptação | alta | deve ser preservado |
| Índice comum com cotações | não localizado visualmente | cotações removidas/cascade | diálogo com clareza | equivalente com adaptação | alta | deve ser adaptado |
| Índice comum em uso | bloqueio/migração histórica | migração e exclusão por endpoint | modal de migração | equivalente com adaptação | alta | deve ser preservado |
| Índice comum em uso e com cotações | histórico | backend atual suporta migração + cascade | modal específico | equivalente com adaptação | alta | deve ser preservado |
| Sem destino | não localizado | 400 `Selecione o índice destino.` | validação da UI | equivalente | alta | deve ser preservado |
| Falha parcial | não localizado | 404/409/403 | tratamento de erro explícito | equivalente | alta | deve ser preservado |

## 16. Novo e altera cotação

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Data | `DATA` na PK | campo de data textual/ISO | `data` string ISO | campo de data controlado | equivalente com adaptação | alta | backend + desktop | deve ser preservado | máscara/calendário do desktop não foi observado visualmente |
| Valor | `VALOR` float | `step=0.0001` no legado | `valor` float | input numérico/decimal | equivalente com adaptação | alta | backend + legado | deve ser preservado | precisão visual exata depende do front |
| Datas futuras | não localizado | não localizado | backend aceita qualquer data parseável | validação de UX pendente | não confirmado | média | backend | exige teste de backend | regra futura depende de decisão |
| Datas retroativas | historicamente válidas | recarrega a lista | cálculo por última cotação em leitura | update após mutação | equivalente com adaptação | alta | backend + desktop | deve ser adaptado | comportamento de futuro/retroativo no desktop runtime não foi observado |
| Múltiplas cotações na mesma data | PK composta sugere não | não localizado | DDL com possível unicidade por índice/data no desktop; backend usa `cotacao_id` e não localizei constraint explícita | não deve ser assumido | divergente | média | backend + desktop | exige teste de backend | constraint física do backend ficou parcialmente confirmada |

## 17. Elimina cotação

### Comparativo

| Item | EasyDental | Brana Cloud legado | Backend atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Confirmação | não localizado visualmente | `window.confirm` | DELETE simples | diálogo perigoso | equivalente com adaptação | alta | backend + legado | deve ser preservado | texto exato do desktop não foi confirmado |
| Mais recente | regra histórica por data | recarrega tabela | recálculo em leitura | re-render após mutação | equivalente com adaptação | alta | backend | deve ser preservado | desktop runtime não confirmou o efeito visual |
| Única cotação | não localizado visualmente | não observado | backend permite exclusão | depende da tabela | equivalente | alta | backend | deve ser preservado | proteção da última cotação não existe no backend atual |

## 18. Regra do valor atual

### Comparativo

| Tema | EasyDental | Brana Cloud | Frontend legado | React futuro | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Regra principal | `sp_GetValorIndice` + `CREDENCIAMENTO.VALOR_US` + `COTACAO` por `DATA <= data` + fallback `1.00` | última cotação por `data desc, id desc`; reservado sem cotação `1.0`; comum sem cotação `0.0` | exibe `valor_atual` e recarrega após mutação | deve apenas exibir resposta do backend | divergente | alta | backend + desktop | deve ser preservado pelo backend atual | o React não deve recalcular domínio localmente |

### Diferenças críticas

- O desktop e o backend atual usam lógica diferente de valor atual.
- O futuro contrato deve prevalecer com a regra do backend atual para o Brana Cloud.
- O React deve exibir e atualizar, não redefinir a regra.

## 19. Índices nativos

| Número | EasyDental | Brana Cloud | Proteção | Valor sem cotação | Alteração | Exclusão | Uso | Classificação | Confiança | Decisão futura |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 255 | `Reais` / `R$` | confirmado | reservado | `1.0` no backend, `1.00` na procedure | bloqueada | bloqueada | moeda base | equivalente | alta | deve ser preservado |
| 2 | `UHO` | confirmado | reservado | `1.0`/fallback reservado | bloqueada | bloqueada | honorários | equivalente | alta | deve ser preservado |
| 1 | `USO` | confirmado | reservado | `1.0`/fallback reservado | bloqueada | bloqueada | serviços | equivalente | alta | deve ser preservado |
| 3 | `UPO` | parcialmente confirmado no recorte lido | reservado | fallback reservado se confirmado | bloqueada | bloqueada | procedimento odontológico | parcialmente confirmado | média | exige confirmação do usuário/runtime |

## 20. Permissões e tenant

| Tema | EasyDental | Brana Cloud | Frontend legado | React futuro | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Autenticação | não confirmado | obrigatório | frontend não é barreira | deve consumir contexto autenticado | divergente | alta | backend | deve ser preservado | desktop não foi observado em runtime |
| Tenant/clínica | estrutura histórica local | `current_user.clinica_id` em todas as rotas | filtro por clínica | nunca receber `clinica_id` manual | equivalente com adaptação | alta | backend | deve ser preservado | isolamento do desktop não foi confirmado |
| 401/403 | não localizado | suportado | alertas no front | tratamento no React | equivalente | alta | backend | deve ser preservado | desktop runtime sem confirmação |

## 21. Dependências

### Comparativo resumido

| Dependência | EasyDental | Brana Cloud | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Procedimentos | `TAB_PRC`, `TAB_PRT_ITEM`, `TRATAMENTO` | rotas e service usam `indice_em_uso` | tabelas e seleção dependente | equivalente com adaptação | alta | backend + desktop | deve ser preservado | fluxos do desktop ainda não foram vistos em runtime |
| Materiais | `TAB_MAT` | rota de materiais usa índice | tabela dependente | equivalente com adaptação | alta | backend + desktop | deve ser preservado | visual desktop não foi confirmado |
| Tratamentos | `TRATAMENTO.NROIND` | migração atualiza `Tratamento.indice` | dependência crítica | equivalente com adaptação | alta | backend + desktop | deve ser preservado | impacto de exclusão precisa constar no contrato |
| Conta corrente / honorários | `CCCIRURGIAO`, `CCPACIENTE` | referências no banco legado e mensagens | sem equivalente direto | divergente | média | desktop + backend | exige decisão no contrato | UI futura não deve copiar semântica de conta-corrente sem revisão |
| Relatórios | não confirmado | TISS e outros relatórios existem no diretório | sem equivalente direto | não confirmado | baixa | desktop | exige validação de runtime | sem evidência específica de consumo de índices |

## 22. Testes

### Situação atual

- Não há teste dedicado com nome próprio para `indices_financeiros`.
- Há cobertura indireta de financeiro, materiais e procedimentos.
- No Plano de contas React, existem testes de toolbar, roteamento, exclusão e migração de categorias.

### Lacunas mínimas

- rota;
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
- regra de atualização do valor atual.

## 23. Comparação com Plano de contas

### O que pode ser reutilizado conceitualmente

- shell;
- barra em L;
- toolbar;
- tabela;
- seleção;
- dialogs;
- hooks;
- API;
- validators;
- testes de rota e toolbar.

### O que exige adaptação

- disposição das tabelas;
- fluxo mestre/detalhe;
- atualização cruzada;
- loading por detalhe;
- migração de exclusão;
- formatação de data e decimal.

### O que não pode ser copiado

- grupos nativos do Plano de contas;
- categorias;
- regras de migração de categorias;
- semântica de contas;
- payloads;
- exclusões específicas.

### Arquivos concretos de referência

- [frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx)
- [frontend-react/src/layout/BranaShell.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaShell.jsx)
- [frontend-react/src/layout/BranaActionTopbar.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaActionTopbar.jsx)
- [frontend-react/src/components/BranaTable.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaTable.jsx)
- [frontend-react/src/components/BranaModal.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaModal.jsx)
- [frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)
- [frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx)
- [frontend-react/tests/planoContasToolbar.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasToolbar.test.js)
- [frontend-react/tests/planoContasRouting.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasRouting.test.js)

## 24. Matriz mestra

| Item | EasyDental | Brana Cloud legado | Backend/banco atual | React de referência | Classificação | Confiança | Fonte prevalente | Decisão futura | Lacuna | Risco |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menu | confirmado parcialmente | confirmado | imposto pelo backend | referência estrutural | equivalente com adaptação | alta | backend + legado | deve ser preservado | runtime visual do desktop bloqueado | baixo |
| Título | não confirmado visualmente | `Configuração de índices financeiros` | não define visual | página React a decidir | divergente | média | legado + backend | exige decisão no contrato | título final do React | baixo |
| Tabela de índices | confirmado pelos prints + técnico | confirmado | imposto pelo backend | referência de duas tabelas | equivalente com adaptação | alta | backend + print | deve ser preservado | layout final no React | médio |
| Tabela de cotações | confirmado pelos prints + técnico | confirmado | imposto pelo backend | referência de duas tabelas | equivalente com adaptação | alta | backend + print | deve ser preservado | título “para reais” precisa ser mantido | médio |
| Valor atual | confirmado tecnicamente | confirmado | imposto pelo backend | exibição em tabela | divergente | alta | backend | deve ser preservado pelo backend atual | desktop usa outra regra histórica | alto |
| Seleção | parcialmente confirmada | confirmado | imposto pelo backend | rowSelection única | equivalente com adaptação | alta | backend + legado | deve ser preservado | runtime desktop bloqueado | médio |
| Novo índice | parcialmente confirmado | confirmado | suportado | modal simples | equivalente com adaptação | alta | backend + legado | deve ser preservado | regra de primeira cotação | médio |
| Altera índice | parcialmente confirmado | confirmado | suportado | modal editável | equivalente com adaptação | alta | backend + legado | deve ser preservado | UPO parcialmente confirmado | médio |
| Elimina índice | parcialmente confirmado | confirmado | suportado | diálogo perigoso | equivalente com adaptação | alta | backend + legado | deve ser preservado | migração no desktop não confirmada visualmente | alto |
| Novo valor | parcialmente confirmado | confirmado | suportado | modal numérico | equivalente com adaptação | alta | backend + legado | deve ser preservado | formato de data no desktop | médio |
| Altera valor | parcialmente confirmado | confirmado | suportado | modal numérico | equivalente com adaptação | alta | backend + legado | deve ser preservado | datas retroativas | médio |
| Elimina valor | parcialmente confirmado | confirmado | suportado | diálogo perigoso | equivalente com adaptação | alta | backend + legado | deve ser preservado | proteção da última cotação | alto |
| Fecha | não confirmado visualmente no runtime | confirmado pelos prints | não imposto pelo backend | pode virar navegação | divergente | alta | print + legado | exige decisão no contrato | manter ou omitir | baixo |
| Migração | não confirmado visualmente | confirmado no backend | imposto pelo backend | modal de migração | equivalente com adaptação | alta | backend | deve ser preservado | fluxo visual desktop bloqueado | alto |
| Índices nativos | confirmado parcialmente | confirmado parcialmente | imposto pelo backend | sem equivalente | equivalente com adaptação | média | backend + desktop | deve ser preservado | UPO ainda pede confirmação adicional | médio |
| Permissões | não confirmado visualmente | `require_module_access("financeiro")` | imposto pelo backend | consumo de contexto | imposto pelo backend atual | alta | backend | deve ser preservado | desktop sem confirmação de tenant local | alto |
| Tenant | não confirmado visualmente | `clinica_id` | imposto pelo backend | contexto autenticado | imposto pelo backend atual | alta | backend | deve ser preservado | não misturar registros de clínica | alto |
| Loading | não observado no desktop | presente no legado | imposto pelo backend | presente no React | equivalente | alta | backend + React | deve ser preservado | runtime desktop bloqueado | baixo |
| Estado vazio | confirmado pelos artefatos e prints | presente no legado | imposto pelo backend | presente no React | equivalente | alta | backend + print | deve ser preservado | texto final do React | baixo |
| Erro | confirmado tecnicamente | confirmado no legado | imposto pelo backend | presente no React | equivalente | alta | backend | deve ser preservado | mensagens visuais do desktop não confirmadas | médio |
| Tema | não confirmado | tema legado sem padrão atual | tokens no React | `branaTokens.css` + `globals.css` | equivalente com adaptação | alta | React | deve ser adaptado | contrastes e densidade final | médio |
| Responsividade | não confirmado | modal legado compacto | não define visual | shell responsivo | equivalente com adaptação | média | React | deve ser adaptado | layout móvel do módulo | médio |
| Testes | inexistente dedicado | indiretos | backend atual sem suíte dedicada | referências de Plano de contas | divergente | alta | backend + React | exige teste de backend | cobertura específica ainda falta | médio |

## 25. Decisões preliminares

### Elementos suficientemente confirmados para entrar no contrato

- nome do módulo;
- caminho no menu;
- duas tabelas;
- sete botões;
- existência de índices nativos;
- dependências com procedimentos, materiais e tratamentos;
- regra de valor atual do backend atual;
- tenant e permissões no backend;
- layout base de duas tabelas para o React.

### Elementos que devem seguir obrigatoriamente o backend atual

- endpoints;
- payloads;
- proteção de reservados;
- tenant por clínica;
- valor atual calculado em leitura no backend;
- exclusão/migração conforme backend;
- tratamento de 401/403/404/409.

### Elementos que podem seguir o padrão visual do React

- shell;
- toolbar compacta;
- tabelas compactas;
- modais com `BranaModal`;
- loading, vazio e erro;
- tema com tokens globais.

### Elementos ainda pendentes de decisão ou validação

- existência final do botão `Fecha` no React;
- disposição final das tabelas;
- texto final das mensagens de migração;
- proteção especial da última cotação;
- confirmação visual adicional de UPO;
- comportamento exato de runtime do EasyDental.

## 26. Questões ao usuário

- O botão `Fecha` deve existir como ação explícita na página React ou pode virar apenas navegação de retorno?
- As duas tabelas devem ficar empilhadas verticalmente, como nos prints, ou lado a lado?
- Queremos manter o texto `Cotações para reais` exatamente assim no React?
- A confirmação visual adicional de `UPO` no EasyDental ainda é necessária para fechar o contrato?
- O comportamento de cotações sem histórico deve seguir o fallback do backend ou exibir estado especial no front?

## 27. Conclusão

O módulo de índices financeiros é claramente o mesmo domínio nas quatro fontes, mas cada camada mostra um recorte diferente:

- o EasyDental entrega a referência histórica do domínio;
- o frontend legado confirma o fluxo web já integrado;
- o backend atual define o contrato técnico que prevalece;
- os prints confirmam a janela principal;
- o padrão React do Plano de contas fornece a linguagem visual e modular.

As principais divergências já estão explícitas:

- a regra de valor atual difere entre desktop e backend;
- a chave técnica das cotações mudou de `NROIND, DATA` para `cotacao_id`;
- o botão `Fecha` é visualmente confirmável no legado, mas ainda precisa de decisão para o React;
- UPO segue parcialmente confirmado no recorte do desktop.

## 28. Próxima etapa recomendada

1. Fechar as duas questões abertas que realmente dependem de decisão do usuário: botão `Fecha` e disposição final das tabelas.
2. A partir disso, redigir o contrato funcional definitivo do módulo.
3. Só então implementar a página React.

## 29. Fechamento comparativo

Conclusao operacional desta rodada:

- o contrato final do React deve seguir o backend atual para regras de dominio e de sessao;
- o desktop continua como referencia historica para nomenclatura e organizacao visual;
- a frente homologada confirmou a composicao final com toolbar unica, duas tabelas e seis modais;
- a autenticacao funcional do React usa `brana_token` e valida sessao via `/api/me`.
