# Contrato de implementação - Brana Cloude - Tabelas -> Serviços de protético

## 1. Objetivo
Definir o contrato técnico e funcional para a futura implementação do módulo `Tabelas -> Serviços de protético` no frontend React do Brana Cloude, com base nas evidências já auditadas no frontend legado, backend atual, banco/modelos e referência EasyDental Desktop.

Esta etapa não implementa código. Ela fixa o comportamento esperado para a próxima fase de desenvolvimento.

## 2. Fontes auditadas

### 2.1. Auditoria principal

- [`docs/auditoria_servicos_protetico_frontend_legado.md`](./auditoria_servicos_protetico_frontend_legado.md)

### 2.2. Contratos e mapas já existentes

- [`docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`](./fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md)
- [`docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md`](./fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md)
- [`docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md`](./fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md)
- [`docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`](./fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md)

### 2.3. Contratos gerais do repositório

- [`docs/05_banco_dados.md`](./05_banco_dados.md)
- [`docs/06_seguranca.md`](./06_seguranca.md)
- [`docs/11_roadmap_desenvolvimento.md`](./11_roadmap_desenvolvimento.md)
- [`docs/frontend_react_shell_operacional_odontologico_impl.md`](./frontend_react_shell_operacional_odontologico_impl.md)
- [`docs/frontend_react_toolbar_horizontal_operacional.md`](./frontend_react_toolbar_horizontal_operacional.md)
- [`docs/frontend_react_teste_paleta_shell_operacional.md`](./frontend_react_teste_paleta_shell_operacional.md)
- [`docs/frontend_react_menu_lateral_grupos_submenus.md`](./frontend_react_menu_lateral_grupos_submenus.md)
- [`docs/frontend_react_refino_visual_shell_operacional.md`](./frontend_react_refino_visual_shell_operacional.md)
- [`docs/frontend_react_refino_visual_shell_operacional_2.md`](./frontend_react_refino_visual_shell_operacional_2.md)
- [`docs/frontend_react_shell_topbar_fullwidth_layout.md`](./frontend_react_shell_topbar_fullwidth_layout.md)
- [`docs/frontend_react_padrao_shell_modulos_administrativos.md`](./frontend_react_padrao_shell_modulos_administrativos.md)
- [`docs/frontend_react_contrato_shell_operacional_odontologico.md`](./frontend_react_contrato_shell_operacional_odontologico.md)
- [`docs/frontend_react_contrato_autenticacao.md`](./frontend_react_contrato_autenticacao.md)
- [`docs/frontend_react_validacao_shell_visual_inicial.md`](./frontend_react_validacao_shell_visual_inicial.md)
- [`docs/frontend_react_validacao_final_login_real.md`](./frontend_react_validacao_final_login_real.md)

### 2.4. Códigos e arquivos lidos

- [`frontend/app.js`](../frontend/app.js)
- [`frontend/index.html`](../frontend/index.html)
- [`frontend/js/modules/tabela-proteticos-helpers.js`](../frontend/js/modules/tabela-proteticos-helpers.js)
- [`backend/routes/proteticos_routes.py`](../backend/routes/proteticos_routes.py)
- [`backend/models/protetico.py`](../backend/models/protetico.py)
- [`backend/models/controle_protetico.py`](../backend/models/controle_protetico.py)
- [`backend/models/contato.py`](../backend/models/contato.py)
- [`backend/routes/relatorios_routes.py`](../backend/routes/relatorios_routes.py)
- [`backend/routes/agenda_contatos_routes.py`](../backend/routes/agenda_contatos_routes.py)
- [`backend/security/dependencies.py`](../backend/security/dependencies.py)
- [`backend/security/permissions.py`](../backend/security/permissions.py)
- [`backend/main.py`](../backend/main.py)
- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Mensagens.txt`
- `Y:\EDS70\Mesclagem.txt`
- `Y:\EDS70\Textos\TERMO_PROTESE_FIXA_BRANA.rtf`

## 3. Escopo da implementação
O escopo da futura implementação no frontend React inclui:

- acesso ao módulo em `Tabelas -> Serviços de protético`;
- uso do shell global do Brana Cloud;
- barra lateral e barra horizontal integradas em L;
- toolbar pertencente ao shell;
- combo de protético na barra horizontal;
- tabela compacta com cinco colunas;
- filtros por coluna;
- seleção única de linha;
- modal compacto para novo e alteração;
- exclusão com confirmação;
- impressão/exportação compatível com o contrato atual;
- preservação dos endpoints e regras do backend existente.

## 4. Fora de escopo
Ficam fora desta etapa:

- alteração de backend;
- alteração de banco;
- criação de migration;
- criação ou alteração de endpoint;
- implementação de lógica de negócio no componente visual;
- duplicação de toolbar interna fora do shell;
- criação de campo `codigo` no backend;
- alteração do frontend legado;
- alteração do roadmap;
- alteração da auditoria já criada;
- commit ou push.

## 5. Decisões funcionais fixadas

### 5.1. Localização

O módulo ficará em `Tabelas -> Serviços de protético`.

### 5.2. Shell

O módulo deve usar o shell operacional do Brana Cloud, com:

- barra lateral;
- barra horizontal;
- união visual em L sem emenda;
- conteúdo da página abaixo da toolbar;
- compatibilidade com tema claro e escuro.

### 5.3. Barra horizontal

A barra horizontal deve conter:

- `Novo serviço`
- `Altera`
- `Elimina`
- `Imprime`
- combo `Protético`

Não deve haver botão `Fecha` dentro da toolbar do módulo, pois o fechamento é responsabilidade do shell/navegação da página.

### 5.4. Tabela

A tabela deve conter exatamente cinco colunas:

1. `Código`
2. `Serviço`
3. `Índice`
4. `Preço`
5. `Prazo`

### 5.5. Campo Código

- A coluna `Código` exibe `ServicoProtetico.id`.
- É um identificador técnico.
- É somente leitura.
- Não é código de negócio.
- Não é editável.
- Não entra no modal.
- Não exige alteração de backend ou banco.
- Não deve ser criado novo campo `codigo`.

### 5.6. Mapeamento dos campos

- `Código` -> `id`
- `Serviço` -> `nome`
- `Índice` -> `indice`
- `Preço` -> `preco`
- `Prazo` -> `prazo`

## 6. Contratos do backend

### 6.1. Router e segurança

O módulo é atendido por `backend/routes/proteticos_routes.py`, com:

- `prefix="/proteticos"`
- proteção por `get_current_user`
- dependência `require_module_access("procedimentos")`
- isolamento por `current_user.clinica_id`

### 6.2. Endpoints que o React deve preservar

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/proteticos` | listar protéticos da clínica |
| POST | `/proteticos` | criar protético |
| PATCH | `/proteticos/{protetico_id}` | alterar protético |
| DELETE | `/proteticos/{protetico_id}` | excluir protético |
| GET | `/proteticos/{protetico_id}/servicos` | listar serviços do protético |
| POST | `/proteticos/{protetico_id}/servicos` | criar serviço |
| PUT | `/proteticos/servicos/{servico_id}` | alterar serviço |
| DELETE | `/proteticos/servicos/{servico_id}` | excluir serviço |
| POST | `/relatorios/enviar-email` | envio opcional de relatório |

### 6.3. Schemas observados

- `ProteticoPayload`:
  - `nome: str`
- `ServicoPayload`:
  - `nome: str`
  - `indice: str = "R$"`
  - `preco: float = 0`
  - `prazo: int = 0`

### 6.4. Regras do backend

- `nome` de protético é obrigatório e único por clínica.
- `nome` de serviço é obrigatório e único por protético.
- `indice` aceita texto e default `R$`.
- `preco` é numérico e convertido no backend.
- `prazo` é inteiro e normalizado para zero ou maior.
- o backend responde com `id`, `nome`, `indice`, `preco`, `prazo` e `protetico_id` para serviços.

## 7. Mapeamento de dados

### 7.1. Tabelas e modelos

- `protetico`
- `servico_protetico`
- `controle_protetico`
- `contato`
- `_INDICE` no desktop EasyDental
- `TAB_PRT_ITEM` no desktop EasyDental
- `CTRLPROTETICO` no desktop EasyDental

### 7.2. Modelo `Protetico`

- `id` int PK
- `nome` string 150 obrigatória
- `clinica_id` FK obrigatória
- unicidade: `clinica_id + nome`

### 7.3. Modelo `ServicoProtetico`

- `id` int PK
- `protetico_id` FK obrigatória
- `clinica_id` FK obrigatória
- `nome` string 180 obrigatória
- `indice` string 10 obrigatória, default `R$`
- `preco` float obrigatória, default `0`
- `prazo` int obrigatória, default `0`
- unicidade: `protetico_id + nome`

### 7.4. Relacionamentos complementares

- `controle_protetico.protetico_id -> protetico.id`
- `controle_protetico.servico_protetico_id -> servico_protetico.id`
- `contato.protetico_id -> protetico.id`

### 7.5. Desktop EasyDental

O SQL do EasyDental mostrou:

- `CTRLPROTETICO.NROPRO`
- `CTRLPROTETICO.NROSER`
- `CTRLPROTETICO.NROIND`
- `CTRLPROTETICO.VALOR`
- `CTRLPROTETICO.DATAENV`
- `CTRLPROTETICO.DATARET`
- `TAB_PRT_ITEM.NROPRO`
- `TAB_PRT_ITEM.NROSER`
- `TAB_PRT_ITEM.DESCRICAO`
- `TAB_PRT_ITEM.NROIND`
- `TAB_PRT_ITEM.PRECO`
- `TAB_PRT_ITEM.PRAZO`
- `TAB_PRT_ITEM.NROPRO` referencia `CONTATO.NROCONTATO`
- `TAB_PRT_ITEM.NROIND` referencia `_INDICE.NROIND`

## 8. Decisão da coluna Código

### 8.1. Decisão fixa

A coluna `Código` será apresentada como `ServicoProtetico.id`.

### 8.2. Consequências

- não cria novo contrato de backend;
- não exige campo adicional no modal;
- não altera schema;
- não muda a escrita do payload;
- não implica `codigo` de negócio.

### 8.3. Regra de exibição

O React deve mostrar o `id` como identificador técnico visível, preferencialmente formatado apenas como número simples.

### 8.4. Risco aceito

O risco aceitável é semântico: o usuário verá um código técnico, não um código de negócio histórico do desktop. Isso deve ficar explícito na UI/documentação.

## 9. Combo Protético

### 9.1. Fonte

- `GET /proteticos`
- filtragem por clínica feita no backend
- ordenação por nome sem acento

### 9.2. Valor e label

- `value`: `id`
- `label`: `nome`

### 9.3. Seleção inicial

- se houver seleção válida anterior, preservá-la;
- caso contrário, selecionar o primeiro protético disponível;
- se não houver protéticos, manter estado vazio e explicativo.

### 9.4. Quando a lista recarregar

- manter a seleção se o `id` ainda existir;
- se o protético selecionado não existir mais, escolher o primeiro disponível ou manter vazio, conforme a lista resultante;
- ao trocar de protético, limpar seleção e filtros da grade;
- recarregar a lista de serviços.

### 9.5. Estados

- loading do combo;
- erro ao carregar protéticos;
- vazio sem protéticos cadastrados;
- vazio sem protético selecionado.

### 9.6. Botões dependentes

Enquanto nenhum protético estiver selecionado:

- `Novo serviço` desabilitado;
- `Altera` desabilitado;
- `Elimina` desabilitado;
- `Imprime` desabilitado;
- tabela vazia com estado explicativo.

## 10. Tabela

### 10.1. Colunas

- `Código`
- `Serviço`
- `Índice`
- `Preço`
- `Prazo`

### 10.2. Fonte dos dados

Consulta:

- `GET /proteticos/{protetico_id}/servicos`

### 10.3. Ordenação

- ordenação inicial por `nome`, conforme retorno do backend atual;
- o frontend não deve reordenar de forma que altere o contrato sem necessidade documentada.

### 10.4. Seleção

- seleção única por `id`;
- usar `data-row-id`/equivalente para rastreio visual;
- linha selecionada marcada com estado visual dedicado.

### 10.5. Contador

- o contador deve refletir o total de serviços do protético atualmente selecionado;
- após inclusão, alteração ou exclusão, o contador deve ser atualizado junto com a recarga.

### 10.6. Filtros

- filtros por coluna nos cabeçalhos;
- sem campo duplicado de busca na toolbar;
- filtros sobre os registros já carregados, salvo se futuramente existir endpoint remoto comprovado.

### 10.7. Estados

- loading da tabela;
- lista vazia;
- erro de carregamento;
- resposta obsoleta descartada quando o protético troca rapidamente.

## 11. Filtros

Os filtros devem seguir o padrão dos módulos React já concluídos:

- por cabeçalho;
- independentes por coluna;
- sem busca duplicada na toolbar;
- compatíveis com tabela compacta.

### 11.1. Tipo de filtro por coluna

- `Código`: numérico ou exato;
- `Serviço`: texto parcial;
- `Índice`: texto parcial ou exato;
- `Preço`: monetário/número;
- `Prazo`: numérico/exato.

### 11.2. Ao trocar de protético

- limpar filtros;
- limpar seleção;
- carregar nova lista.

## 12. Seleção

### 12.1. Regra geral

- apenas uma linha selecionada por vez.

### 12.2. Identificação técnica

- seleção baseada em `id`;
- não depender de índice da posição na lista.

### 12.3. Após refresh

- manter seleção se o `id` ainda existir;
- caso contrário, limpar ou selecionar o primeiro item válido, conforme padrão do módulo.

### 12.4. Acessibilidade

- `aria-selected` na linha selecionada;
- navegação por teclado conforme padrão já usado em módulos equivalentes;
- foco visível.

## 13. Novo serviço

### 13.1. Pré-condição

- protético selecionado.

### 13.2. Endpoint

- `POST /proteticos/{protetico_id}/servicos`

### 13.3. Payload

- `nome`
- `indice`
- `preco`
- `prazo`

### 13.4. Modal

- título dinâmico de criação;
- não exibir `Código`;
- campos somente os aceitos pelo backend;
- bloqueio durante salvamento;
- prevenção de duplo envio.

### 13.5. Comportamento

- validar nome obrigatório;
- converter preço de forma segura;
- preservar zero;
- normalizar prazo como inteiro não negativo;
- fechar modal e recarregar tabela após sucesso;
- preservar protético selecionado;
- selecionar o novo registro se o retorno trouxer o `id`.

## 14. Alteração

### 14.1. Pré-condições

- protético selecionado;
- exatamente uma linha selecionada.

### 14.2. Endpoint

- `PUT /proteticos/servicos/{servico_id}`

### 14.3. Regras

- abrir o mesmo modal de Novo;
- hidratar o formulário com o registro selecionado;
- modo de edição distinto do modo de criação;
- usar o `servico_id` real;
- bloquear enquanto salva;
- impedir edição do registro errado.

### 14.4. Pós-sucesso

- recarregar a lista;
- preservar a linha alterada quando possível;
- limpar estado temporário do modal.

## 15. Exclusão

### 15.1. Pré-condições

- protético selecionado;
- linha selecionada.

### 15.2. Endpoint

- `DELETE /proteticos/servicos/{servico_id}`

### 15.3. Regras

- modal de confirmação;
- mostrar claramente o serviço que será removido;
- bloquear clique duplicado durante exclusão;
- limpar seleção da linha excluída;
- recarregar a lista;
- tratar erro com retorno do backend.

### 15.4. Fora de escopo

Não implementar exclusão do protético pai nesta frente.

## 16. Impressão

### 16.1. Evidência do legado

O frontend legado gera relatórios com:

- `Tela`
- `Impressora`
- `Arquivo`
- `PDF`
- `HTML`
- `RTF`
- `XLS`
- `TXT`
- `CSV`
- envio opcional por `POST /relatorios/enviar-email`

### 16.2. Contrato mínimo para a primeira implementação React

A primeira implementação deve, no mínimo:

- abrir o fluxo somente com protético selecionado;
- reutilizar os serviços já carregados ou realizar nova leitura comprovada;
- preservar nome do protético;
- preservar `Serviço`, `Índice`, `Preço`, `Prazo`;
- incluir `Código` como `id` técnico ou justificar tecnicamente sua ausência no preview, sem inventar outro contrato.

### 16.3. Estratégia de reuso

O backend atual não precisa ganhar novo endpoint para a primeira versão, desde que o React consiga gerar a saída com base nas mesmas leituras já existentes.

### 16.4. Estratégia de risco

Se a reprodução completa de todos os formatos elevar o risco, a impressão pode ser tratada como subetapa posterior, sem bloquear CRUD principal.

## 17. Menu

### 17.1. Item

- rótulo funcional: `Serviços de protético`
- categoria: `Tabelas`
- posição: alfabética dentro do grupo de tabelas

### 17.2. Identificador interno

O contrato deve alinhar o identificador interno ao padrão real de `routes.jsx` e `App.jsx`, mantendo a nomenclatura do módulo coerente com:

- `servicos-protetico`

### 17.3. Navegação

- o item deve abrir a página da feature sem fallback ao dashboard;
- a navegação deve seguir o padrão de rota do projeto.

## 18. Rota

### 18.1. Padrão observado no projeto

O React atual usa rotas em estilo `/app/...`, com mapeamento em `App.jsx` e `routes.jsx`.

### 18.2. Rota proposta

- proposta base: `/app/tabelas/servicos-protetico`

### 18.3. Regra do contrato

A rota definitiva deve seguir o padrão do repositório, mas esta proposta é a candidata documentada para a futura implementação.

## 19. Shell e toolbar

### 19.1. Shell

- usar o shell operacional já implementado no React;
- não criar toolbar interna duplicada na página;
- manter barra lateral e horizontal no formato em L;
- preservar o conteúdo abaixo da toolbar.

### 19.2. Toolbar do módulo

A toolbar da feature deve ficar no shell e conter:

- `Novo serviço`
- `Altera`
- `Elimina`
- `Imprime`
- combo `Protético`

### 19.3. Botão Fecha

Não incluir `Fecha` nesta toolbar.

### 19.4. Compactação

- botões compactos;
- componentes globais quando compatíveis;
- sem repetir padrão de busca já existente em módulos com filtros por cabeçalho.

## 20. Tema

- compatibilidade com tema claro e escuro;
- não usar cores isoladas só para este módulo;
- usar os tokens do shell atual;
- preservar contraste de grade, toolbar, modal e filtros.

## 21. Arquitetura modular

### 21.1. Estrutura sugerida

```text
frontend-react/src/features/servicosProtetico/
  ServicosProteticoPage.jsx
  components/
    ServicosProteticoToolbar.jsx
    ServicosProteticoTable.jsx
    ServicosProteticoModal.jsx
    ServicosProteticoDeleteModal.jsx
    ServicosProteticoPrintModal.jsx
    ProteticoSelect.jsx
    ServicosProteticoFilters.jsx
  hooks/
    useServicosProtetico.js
    useServicosProteticoSelection.js
    useServicosProteticoMutation.js
  services/
    servicosProteticoApi.js
  utils/
    servicosProteticoMappers.js
    servicosProteticoFormatters.js
    servicosProteticoHelpers.js
  constants/
    servicosProteticoColumns.js
    servicosProteticoDefaults.js
  validation/
    servicosProteticoValidators.js
```

### 21.2. Responsabilidades

- `Page`: orquestra estado e composição
- `Toolbar`: ações, combo e botões
- `Select`: seleção de protético
- `Table`: listagem e seleção de linha
- `Filters`: filtros por coluna
- `Modal`: inclusão e alteração
- `DeleteModal`: confirmação de exclusão
- `PrintModal`: parâmetros de impressão
- `hooks`: leitura, seleção e mutação
- `services`: chamadas HTTP
- `utils`: normalização e formatação
- `constants`: colunas, defaults e chaves
- `validation`: regras de formulário

### 21.3. Dependências permitidas

- shell e componentes globais já existentes quando compatíveis;
- hooks de autenticação e estado global do projeto;
- utilitários de moeda, texto e seleção já consolidados.

### 21.4. Dependências proibidas

- acesso direto ao backend a partir de JSX puro;
- regras de negócio espalhadas em componente visual;
- duplicação de toolbar;
- estado do modal acoplado à tabela inteira;
- cópia integral do `frontend/app.js` legado.

## 22. Responsabilidades por arquivo

### 22.1. `ServicosProteticoPage.jsx`

- compor a feature;
- conectar shell e feature;
- orquestrar estados principais.

### 22.2. `ServicosProteticoToolbar.jsx`

- renderizar ações da barra horizontal;
- conter o combo de protético;
- refletir estados de loading/erro/disable.

### 22.3. `ServicosProteticoTable.jsx`

- renderizar linhas;
- aplicar filtros visuais;
- sinalizar seleção.

### 22.4. `ServicosProteticoModal.jsx`

- receber estado de criação/edição;
- validar e submeter payload.

### 22.5. `ServicosProteticoDeleteModal.jsx`

- confirmar exclusão.

### 22.6. `ServicosProteticoPrintModal.jsx`

- preparar parâmetros e formatos do relatório.

### 22.7. `ProteticoSelect.jsx`

- carregar e exibir protéticos;
- reportar seleção.

### 22.8. `useServicosProtetico.js`

- buscar protéticos e serviços;
- manter loading, erro e atualização.

### 22.9. `useServicosProteticoSelection.js`

- controlar seleção de protético e de linha.

### 22.10. `useServicosProteticoMutation.js`

- encapsular create/update/delete.

### 22.11. `servicosProteticoApi.js`

- encapsular `GET /proteticos`, `GET /proteticos/{id}/servicos`, `POST`, `PUT`, `DELETE`.

### 22.12. `servicosProteticoMappers.js`

- mapear API -> tela e tela -> payload.

### 22.13. `servicosProteticoFormatters.js`

- formatar `preco`, `prazo`, `indice` e `id` para exibição.

### 22.14. `servicosProteticoValidators.js`

- validar campos aceitos pelo backend.

## 23. Estados da interface

### 23.1. Estados necessários

- loading do combo
- loading da tabela
- loading de mutação
- erro do combo
- erro da tabela
- vazio sem protéticos
- vazio sem protético selecionado
- vazio sem serviços
- linha selecionada
- linha não selecionada
- modal aberto em create
- modal aberto em edit
- exclusão pendente

### 23.2. Botões habilitados/desabilitados

- dependem de protético selecionado;
- dependem de linha selecionada;
- dependem de mutação em andamento.

### 23.3. Acessibilidade

- foco inicial no modal;
- Escape fecha modal conforme padrão global;
- `aria-selected` na linha ativa;
- labels sempre associados a inputs;
- IDs estáveis para teste automatizado.

## 24. Validações

### 24.1. Novo e Alteração

- `nome` obrigatório;
- `indice` não pode ser reinterpretado como moeda/fator sem base comprovada;
- `preco` deve aceitar zero;
- `prazo` deve seguir contrato atual e ser não negativo quando permitido pelo backend;
- impedir envio duplicado.

### 24.2. Texto e números

- não inventar máscara que altere o payload final;
- o que é formatado na tela deve ser convertido de volta com segurança.

## 25. Normalização de dados

### 25.1. Serviço

- manter `nome` limpo;
- preservar caixa e acentuação conforme o backend receber;
- não inferir prefixos ou grupos.

### 25.2. Índice

- o valor atual é textual;
- exibir com normalização apenas visual;
- enviar sem converter para cálculo.

### 25.3. Preço

- usar formato pt-BR na tabela e modal;
- converter string visual em número apenas no payload;
- não persistir string formatada.

### 25.4. Prazo

- exibir inteiro;
- manter zero quando permitido;
- não inventar unidade.

## 26. Formatação de valores

- `preco`: moeda pt-BR na tabela e no modal;
- `prazo`: inteiro simples;
- `indice`: texto;
- `codigo/id`: número simples.

## 27. Segurança

- a autoridade de isolamento continua sendo o backend;
- o frontend não envia `clinica_id`;
- o frontend só deve usar IDs retornados por consultas autorizadas;
- erros 401/403 seguem a infraestrutura global;
- erros 404 devem resultar em refresh seguro da lista;
- sem fallback global ou mockado.

## 28. Tratamento de erros

### 28.1. Listagem

- erro ao carregar protéticos: mostrar mensagem e impedir ações dependentes;
- erro ao carregar serviços: mostrar mensagem e manter combo disponível.

### 28.2. Mutação

- bloquear duplo clique;
- exibir mensagem de backend quando houver conflito/404/validação;
- não perder contexto do protético.

### 28.3. Impressão

- falha de formato ou geração deve ser tratada sem travar a tela principal;
- se necessário, manter a impressão como subetapa posterior.

## 29. Acessibilidade

- foco inicial claro;
- labels explícitos;
- seleção visível;
- teclado suportado conforme padrão dos módulos equivalentes;
- cabeçalhos de tabela legíveis;
- uso consistente de `aria-selected` e estados visuais.

## 30. Testes

### 30.1. Menu e rota

- item presente em ordem alfabética;
- rota correta;
- não cair no dashboard por fallback;
- toolbar correta no shell.

### 30.2. Combo

- carrega protéticos;
- troca de protético;
- preserva seleção quando possível;
- limpa grade e filtros quando necessário.

### 30.3. Tabela

- cinco colunas;
- `Código` vindo de `id`;
- filtros;
- seleção única;
- contador.

### 30.4. CRUD

- novo;
- alteração;
- exclusão;
- refresh;
- bloqueio de duplo envio;
- mensagens de erro.

### 30.5. Tema

- claro;
- escuro;
- modal;
- filtros;
- tabela;
- toolbar.

### 30.6. Regressão

- build;
- login;
- shell;
- rotas de outros módulos;
- backend de autenticação;
- módulos já consolidados.

### 30.7. Validação manual

Teste manual obrigatório com evidências visuais:

- abrir o módulo;
- trocar protético;
- criar serviço;
- alterar serviço;
- excluir serviço;
- abrir impressão;
- validar contraste em tema claro e escuro.

## 31. Critérios de aceite

- o módulo abre pelo menu de Tabelas;
- o combo de protético funciona;
- a tabela mostra 5 colunas;
- `Código` é `id`;
- `Serviço`, `Índice`, `Preço`, `Prazo` são preservados;
- CRUD respeita o backend atual;
- não há novo campo `codigo`;
- shell e toolbar seguem o padrão do projeto;
- filtros por coluna funcionam;
- não há duplicação de toolbar interna;
- o backend continua sendo autoridade de segurança por clínica.

## 32. Etapas de implementação

### Etapa 1 - Base
- menu, rota e leitura;
- shell e composição da página.

### Etapa 2 - Dados e seleção
- combo de protético;
- listagem de serviços;
- filtros;
- estados.

### Etapa 3 - Novo serviço
- modal;
- validações;
- POST.

### Etapa 4 - Alteração
- hidratação;
- PUT;
- preservação de seleção.

### Etapa 5 - Exclusão
- confirmação;
- DELETE;
- refresh.

### Etapa 6 - Impressão
- fluxo mínimo seguro;
- formatos suportados pela estratégia definida.

### Etapa 7 - Fechamento
- testes;
- documentação;
- consolidação.

## 33. Estratégia de commits

- commits pequenos e seletivos;
- cada etapa deve parar em um ponto de aceite verificável;
- não agrupar menu, shell, CRUD e impressão no mesmo commit;
- evitar commit monolítico;
- só avançar após teste manual.

## 34. Riscos

- inventar coluna Código;
- confundir `id` técnico com código de negócio;
- interpretar errado `indice`;
- quebrar o isolamento por clínica;
- perder o comportamento do combo ao recarregar;
- quebrar impressão ao tentar reproduzir tudo de uma vez;
- duplicar toolbar fora do shell;
- misturar regras de negócio no componente visual;
- divergência entre terminologia desktop e web.

## 35. Pendências

- decisão final sobre o formato de impressão da primeira entrega;
- decisão sobre se `Código` será apenas `id` técnico na UI;
- validação visual final da rota proposta;
- definição da divisão exata dos arquivos da feature conforme o padrão final do repositório;
- validação de reuso de componentes globais do shell.

## 36. Condições para encerramento

A implementação futura só pode ser considerada encerrada quando:

- o módulo abrir pelo menu correto;
- o shell estiver integrado sem toolbar duplicada;
- o combo de protético estiver funcional;
- a tabela mostrar as cinco colunas;
- CRUD estiver preservado;
- impressão estiver coerente com o contrato acordado;
- segurança por clínica estiver intacta;
- testes manuais e de regressão estiverem concluídos;
- a documentação da implementação estiver atualizada.
