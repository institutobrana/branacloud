# Fase 2 - Subetapa 1 - Contrato funcional da Tabela de protéticos

## 1. Objetivo do contrato funcional
Este documento registra como a Tabela de protéticos funciona hoje e serve como proteção antes de qualquer modularização ou refatoração futura.

Esta etapa:

- não altera código;
- não altera comportamento;
- não altera banco;
- não altera frontend;
- não altera backend;
- não altera o fluxo atual do sistema;
- não permite modularização nesta subetapa;
- não permite extração de funções nesta subetapa;
- não permite recorte de código nesta subetapa.

A modularização da Tabela de protéticos só poderá ocorrer em subetapa futura, depois que este contrato funcional estiver preservado como referência.

## 2. Decisão da primeira frente da Fase 2
A Tabela de protéticos foi escolhida como primeira frente da Fase 2.

Motivo da escolha:

- bom equilíbrio entre valor de negócio;
- risco técnico controlável;
- facilidade de teste manual;
- menor criticidade em comparação com Agenda, Conta corrente, Usuários/Login e Seeds/tabelas padrão.

## 3. Localização atual no sistema

### 3.1. Frontend principal
A Tabela de protéticos aparece hoje em `frontend/app.js` como um bloco funcional concentrado no monólito do frontend.

Referências confirmadas:

- painel principal `proteticos-panel`;
- botão de menu `data-menu-action="tabelas-protetico"` em `frontend/index.html`;
- estado global `prot`;
- cache global `proteticosCache`;
- seleção global `proteticoSelecionadoId`;
- cache de serviços `protServicosCache`;
- seleção de serviço `protServicoSelecionadoId`.

### 3.2. Frontend secundário relacionado
Existe também a frente separada de Controle de protéticos, com `ctrlProt*`, mas ela é funcionalmente distinta da Tabela de protéticos e não substitui este contrato.

### 3.3. `frontend/index.html`
Foram identificados botões de menu visíveis relacionados à área:

- `cadastro-controle-proteticos` com rótulo “Controle de protéticos...”;
- `relatorio-proteticos` com rótulo “Protéticos”;
- `tabelas-protetico` com rótulo “Serviços de protético...”.

### 3.4. `frontend/js/modules`
Não foi identificado módulo separado de protéticos em `frontend/js/modules`.

Isso reforça que a Tabela de protéticos ainda está presa ao `frontend/app.js`.

### 3.5. Funções relacionadas identificadas
Funções confirmadas em `frontend/app.js`:

- `protEnsureUI`;
- `protServicoSelecionado`;
- `protSelecionarLinha`;
- `protEditarSelecionado`;
- `protFecharRelatorio`;
- `protFecharRelatorioArquivo`;
- `protAtualizarEmailRelatorioUI`;
- `protNomeArquivoBase`;
- `protRelatorioRows`;
- `protCsvEsc`;
- `protRelatorioCsv`;
- `protRelatorioTxt`;
- `protRtfEscape`;
- `protRelatorioRtf`;
- `protRelatorioXlsHtml`;
- `protPdfEscape`;
- `protRelatorioPdfBlob`;
- `protFormatoInfo`;
- `protRelatorioBlob`;
- `protEnviarEmailRelatorio`;
- `protSelecionarDestinoRelatorio`;
- `protSalvarRelatorioArquivo`;
- `protAbrirRelatorioArquivo`;
- `protAbrirRelatorio`;
- `protRelatorioHtml`;
- `protExecutarRelatorio` não foi detalhada nesta leitura com segurança suficiente, mas aparece no fluxo de eventos;
- `protCarregarServicos`;
- `protCarregar`;
- `protAbrir`;
- `protFecharModal`;
- `protAbrirModal`;
- `protSalvarModal`;
- `protNovoCadastro`;
- `protEditarCadastro`;
- `protExcluirCadastro`;
- `protExcluirServico`;
- `protVincularEventos`.

### 3.6. IDs de elementos HTML relacionados
IDs confirmados:

- `proteticos-panel`;
- `prot-cbo`;
- `prot-tbody`;
- `prot-total`;
- `prot-btn-novo`;
- `prot-btn-editar`;
- `prot-btn-excluir`;
- `prot-btn-imprimir`;
- `prot-btn-fechar`;
- `prot-modal-backdrop`;
- `prot-modal-title`;
- `prot-modal-nome`;
- `prot-modal-indice`;
- `prot-modal-preco`;
- `prot-modal-prazo`;
- `prot-modal-ok`;
- `prot-modal-cancelar`;
- `prot-relatorio-backdrop`;
- `prot-relatorio-tabela`;
- `prot-relatorio-titulo`;
- `prot-relatorio-saida`;
- `prot-relatorio-ok`;
- `prot-relatorio-cancelar`;
- `prot-relatorio-arquivo-backdrop`;
- `prot-relatorio-arquivo-path`;
- `prot-relatorio-arquivo-picker`;
- `prot-relatorio-arquivo-formato`;
- `prot-relatorio-arquivo-email-row`;
- `prot-relatorio-arquivo-email-check`;
- `prot-relatorio-arquivo-email`;
- `prot-relatorio-arquivo-assunto`;
- `prot-relatorio-arquivo-corpo`;
- `prot-relatorio-arquivo-ok`;
- `prot-relatorio-arquivo-cancelar`.

### 3.7. Botões visíveis confirmados

- `Novo serviço...`
- `Altera...`
- `Elimina`
- `Imprime...`
- `Fecha`
- `Ok`
- `Cancela`

### 3.8. Modais confirmados

- `prot-modal-backdrop` com título “Insere serviço” ou “Altera serviço”;
- `prot-relatorio-backdrop` com título “Tabela de serviços de protético”;
- `prot-relatorio-arquivo-backdrop` com título “Salvar relatório em arquivo”.

### 3.9. Eventos associados

- `change` no seletor de protético;
- ativação padrão de linha na tabela via `bindStandardGridActivation`;
- `click` em `Novo serviço...`;
- `click` em `Altera...`;
- `click` em `Elimina`;
- `click` em `Imprime...`;
- `click` em `Fecha`;
- `click` em `Ok` no modal de serviço;
- `click` em `Cancela` no modal de serviço;
- `click` em `Ok` no modal de relatório;
- `click` em `Cancela` no modal de relatório;
- `click` no seletor de destino do relatório;
- `change` no checkbox de envio de e-mail do relatório;
- `click` no salvamento do relatório em arquivo;
- `click` no cancelamento do relatório em arquivo.

### 3.10. Endpoints chamados pelo frontend

- `GET /proteticos`
- `POST /proteticos`
- `PATCH /proteticos/{id}`
- `DELETE /proteticos/{id}`
- `GET /proteticos/{protetico_id}/servicos`
- `POST /proteticos/{protetico_id}/servicos`
- `PUT /proteticos/servicos/{servico_id}`
- `DELETE /proteticos/servicos/{servico_id}`
- `POST /relatorios/enviar-email`

### 3.11. Backend relacionado

- `backend/routes/proteticos_routes.py`
- `backend/models/protetico.py`
- `backend/main.py`
- `backend/routes/controle_proteticos_routes.py` como módulo relacionado, mas separado
- `backend/models/controle_protetico.py` como tabela relacionada ao controle
- `backend/routes/agenda_contatos_routes.py` como dependência indireta
- `backend/models/contato.py` como dependência indireta
- `backend/security/permissions.py` como base de permissão associada

## 4. Como funciona hoje

### 4.1. Acesso à Tabela de protéticos
O usuário acessa a Tabela de protéticos pelo menu de Configurações, ação `tabelas-protetico`.

O handler do menu chama `protAbrir()`.

### 4.2. Carregamento inicial
Ao abrir a tela:

1. `protAbrir()` garante a UI;
2. `protVincularEventos()` registra os eventos apenas uma vez;
3. o frontend esconde os outros painéis;
4. a tela de protéticos é exibida;
5. `protCarregar()` chama `GET /proteticos`;
6. a lista de protéticos é salva em `proteticosCache`;
7. o protético selecionado é mantido em `proteticoSelecionadoId` quando possível;
8. `protCarregarServicos()` busca os serviços do protético selecionado;
9. a tabela é renderizada por `protRender()`.

### 4.3. Exibição dos dados
A tela mostra:

- um seletor de protético;
- uma grade de serviços do protético selecionado;
- colunas de serviço, índice, preço e prazo;
- contador de total de serviços;
- modal de serviço;
- modal de relatório;
- modal de relatório em arquivo.

### 4.4. Seleção de item
O item é selecionado de duas formas:

- pelo `change` no seletor `prot-cbo`;
- pelo clique/ativação de linha na tabela via `bindStandardGridActivation`.

Quando uma linha é selecionada:

- `protSelecionarLinha()` atualiza `protServicoSelecionadoId`;
- a linha recebe classe visual `selected`.

### 4.5. Criação de protético
A criação do protético principal ocorre por `protNovoCadastro()`.

Fluxo atual:

1. abre `window.prompt("Nome do protético:","")`;
2. valida se o texto foi informado;
3. envia `POST /proteticos` com payload `{ nome }`;
4. se der certo, o ID retornado passa a ser o `proteticoSelecionadoId`;
5. `protCarregar()` recarrega a lista e os serviços.

### 4.6. Edição de protético
A edição do protético principal ocorre por `protEditarCadastro()`.

Fluxo atual:

1. localiza o protético atualmente selecionado;
2. abre `window.prompt("Altere o nome do protético:", atual.nome || "")`;
3. valida o novo nome;
4. envia `PATCH /proteticos/{id}` com payload `{ nome }`;
5. se der certo, recarrega com `protCarregar()`.

### 4.7. Exclusão de protético
A exclusão do protético principal ocorre por `protExcluirCadastro()`.

Fluxo atual:

1. localiza o protético atualmente selecionado;
2. pede confirmação em `window.confirm`;
3. envia `DELETE /proteticos/{id}`;
4. limpa a seleção;
5. recarrega com `protCarregar()`.

O backend remove o protético e depende do comportamento de cascata da tabela relacionada.

### 4.8. Criação de serviço
A criação de serviço ocorre por `protAbrirModal()` sem item e depois `protSalvarModal()`.

Fluxo atual:

1. o usuário clica em `Novo serviço...`;
2. `protAbrirModal()` exige que exista protético selecionado;
3. o modal abre com campos em branco ou padrão;
4. `protSalvarModal()` valida nome e preço;
5. o payload é montado com `nome`, `indice`, `preco` e `prazo`;
6. o envio usa `POST /proteticos/{protetico_id}/servicos`;
7. após sucesso, o modal fecha e a lista de serviços é recarregada.

### 4.9. Edição de serviço
A edição de serviço ocorre por seleção de linha e `protEditarSelecionado()`.

Fluxo atual:

1. o usuário seleciona uma linha;
2. `protEditarSelecionado()` chama `protAbrirModal(item)`;
3. o modal abre com os valores atuais;
4. `protSalvarModal()` detecta o `editId`;
5. o envio usa `PUT /proteticos/servicos/{servico_id}`;
6. após sucesso, fecha e recarrega a lista de serviços.

### 4.10. Exclusão de serviço
A exclusão de serviço ocorre por `protExcluirServico()`.

Fluxo atual:

1. o usuário seleciona uma linha;
2. `protExcluirServico()` pede confirmação;
3. envia `DELETE /proteticos/servicos/{servico_id}`;
4. recarrega os serviços do protético selecionado.

### 4.11. Mensagens, alertas e erros
Mensagens identificadas:

- `Selecione um protético.`
- `Selecione um serviço.`
- `Informe o serviço.`
- `Preço inválido.`
- `Falha ao carregar protéticos.`
- `Falha ao carregar serviços de protético.`
- `Falha ao criar protético.`
- `Falha ao alterar protético.`
- `Falha ao excluir protético.`
- `Falha ao gravar serviço.`
- `Falha ao excluir serviço.`
- `Sessao invalida. Faca login novamente.`

Não houve correção textual dessas mensagens nesta etapa.

## 5. Botões, ações e eventos

| Botão / ação | ID / classe / função associada | Comportamento atual | Risco se quebrar | Onde testar |
|---|---|---|---|---|
| Abrir Tabela de protéticos | `data-menu-action="tabelas-protetico"` / `protAbrir()` | Exibe a tela e carrega protéticos e serviços | Alto | Menu Configurações > Tabelas > Serviços de protético |
| Trocar protético | `prot-cbo` / `change` | Recarrega a lista de serviços do protético selecionado | Alto | Trocar o item do seletor e validar a grade |
| Selecionar serviço | `prot-tbody` / `bindStandardGridActivation` / `protSelecionarLinha()` | Marca a linha e define o serviço selecionado | Médio/alto | Clicar em uma linha da tabela |
| Novo serviço | `prot-btn-novo` / `protAbrirModal()` | Abre modal de cadastro de serviço | Alto | Botão “Novo serviço...” |
| Editar serviço | `prot-btn-editar` / `protEditarSelecionado()` | Abre modal com dados do serviço selecionado | Alto | Botão “Altera...” |
| Excluir serviço | `prot-btn-excluir` / `protExcluirServico()` | Pede confirmação e remove o serviço | Alto | Botão “Elimina” |
| Imprimir | `prot-btn-imprimir` / `protAbrirRelatorio()` | Abre modal de relatório | Médio/alto | Botão “Imprime...” |
| Fechar tela | `prot-btn-fechar` | Oculta o painel e mostra a área vazia | Médio | Botão “Fecha” |
| Salvar serviço | `prot-modal-ok` / `protSalvarModal()` | Envia POST ou PUT e recarrega serviços | Alto | Modal de serviço, botão “Ok” |
| Cancelar serviço | `prot-modal-cancelar` / `protFecharModal()` | Fecha o modal sem salvar | Médio | Modal de serviço, botão “Cancela” |
| Executar relatório | `prot-relatorio-ok` / `protExecutarRelatorio()` | Gera saída do relatório na forma escolhida | Médio | Modal de relatório, botão “Ok” |
| Cancelar relatório | `prot-relatorio-cancelar` / `protFecharRelatorio()` | Fecha o modal de relatório | Baixo/médio | Modal de relatório, botão “Cancela” |
| Escolher destino de arquivo | `prot-relatorio-arquivo-picker` / `protSelecionarDestinoRelatorio()` | Abre seletor de arquivo quando o navegador permite | Médio | Modal de arquivo, botão da pasta |
| Salvar relatório em arquivo | `prot-relatorio-arquivo-ok` / `protSalvarRelatorioArquivo()` | Gera blob, grava download ou usa File Picker | Médio/alto | Modal de arquivo, botão “Ok” |
| Cancelar relatório em arquivo | `prot-relatorio-arquivo-cancelar` / `protFecharRelatorioArquivo()` | Fecha o modal de arquivo | Baixo/médio | Modal de arquivo, botão “Cancela” |

## 6. Campos e dados manipulados

| Campo | Origem do dado | Obrigatório / opcional | Uso em criação | Uso em edição | Exibido em listagem | Risco de alteração |
|---|---|---|---|---|---|---|
| `nome` do protético | `window.prompt` e payload `POST/PATCH /proteticos` | Obrigatório pelo backend | Sim | Sim | Sim, no seletor | Alto |
| `nome` do serviço | `prot-modal-nome` | Obrigatório | Sim | Sim | Sim, na grade | Alto |
| `indice` | `prot-modal-indice` | Opcional com padrão `R$` | Sim | Sim | Sim, na grade | Médio |
| `preco` | `prot-modal-preco` / `procParse` | Obrigatório na prática, com default numérico | Sim | Sim | Sim, na grade | Alto |
| `prazo` | `prot-modal-prazo` | Opcional com default `0` | Sim | Sim | Sim, na grade | Médio |
| `protetico_id` | seleção atual `prot-cbo` | Obrigatório para criar serviço | Sim | Indireto | Sim, via contexto | Alto |
| `id` do serviço | seleção de linha `protServicoSelecionadoId` | Técnico | Não | Sim | Sim, seleção | Alto |
| `título do relatório` | `prot-relatorio-titulo` | Opcional com default fixo | Não | Não | Não | Baixo/médio |
| `saída do relatório` | `prot-relatorio-saida` | Opcional com default `Tela` | Não | Não | Não | Médio |
| `caminho do arquivo` | `prot-relatorio-arquivo-path` | Opcional | Não | Não | Não | Médio |
| `e-mail do relatório` | `prot-relatorio-arquivo-email` | Condicional | Não | Não | Não | Médio |
| `assunto` / `corpo` do e-mail | `prot-relatorio-arquivo-assunto` / `prot-relatorio-arquivo-corpo` | Condicional | Não | Não | Não | Médio |

## 7. Dados carregados

### 7.1. Lista de protéticos
Endpoint:

- `GET /proteticos`

Formato esperado:

- array de objetos com `id` e `nome`.

Ordenação:

- ordenação alfabética por nome, feita no backend com normalização de texto.

Dependência de clínica:

- sim, por `current_user.clinica_id`.

Dependência de usuário/permissão:

- sim, o backend exige acesso ao módulo `procedimentos`.

Cache/local state:

- `proteticosCache`;
- `proteticoSelecionadoId`.

### 7.2. Lista de serviços
Endpoint:

- `GET /proteticos/{protetico_id}/servicos`

Formato esperado:

- array de objetos com `id`, `nome`, `indice`, `preco`, `prazo` e `protetico_id`.

Ordenação:

- por nome do serviço no backend.

Dependência de clínica:

- sim.

Dependência de protético selecionado:

- sim, é obrigatória.

Cache/local state:

- `protServicosCache`;
- `protServicoSelecionadoId`.

### 7.3. Relatórios
Os dados usados no relatório saem da própria cache de serviços da tela.

Os formatos identificados são:

- Tela;
- Impressora;
- Arquivo.

Limitação:

- a confirmação completa da lógica de `protExecutarRelatorio()` não foi detalhada linha a linha nesta etapa, então alguns detalhes de saída ficam como “a confirmar em subetapa técnica”.

## 8. Dados salvos

### 8.1. Criação de protético
Endpoint:

- `POST /proteticos`

Payload aproximado:

- `{ nome }`

Validações antes do envio:

- o nome não pode ser vazio.

Efeito após salvar:

- seleciona o novo protético;
- recarrega a lista e os serviços.

### 8.2. Atualização de protético
Endpoint:

- `PATCH /proteticos/{id}`

Payload aproximado:

- `{ nome }`

Validações antes do envio:

- o nome não pode ser vazio.

Efeito após salvar:

- recarrega a lista e os serviços.

### 8.3. Exclusão de protético
Endpoint:

- `DELETE /proteticos/{id}`

Validações antes do envio:

- confirmação do usuário.

Efeito após salvar:

- limpa a seleção;
- recarrega a tela.

### 8.4. Criação de serviço
Endpoint:

- `POST /proteticos/{protetico_id}/servicos`

Payload aproximado:

- `{ nome, indice, preco, prazo }`

Validações antes do envio:

- nome obrigatório;
- preço precisa ser parseável;
- prazo é normalizado para inteiro não negativo.

Efeito após salvar:

- fecha modal;
- recarrega serviços.

### 8.5. Atualização de serviço
Endpoint:

- `PUT /proteticos/servicos/{servico_id}`

Payload aproximado:

- `{ nome, indice, preco, prazo }`

Validações antes do envio:

- nome obrigatório;
- preço precisa ser parseável;
- prazo é normalizado para inteiro não negativo.

Efeito após salvar:

- fecha modal;
- recarrega serviços.

### 8.6. Exclusão de serviço
Endpoint:

- `DELETE /proteticos/servicos/{servico_id}`

Validações antes do envio:

- confirmação do usuário.

Efeito após salvar:

- recarrega os serviços do protético.

### 8.7. Persistência de relatório em arquivo
Endpoint:

- `POST /relatorios/enviar-email`

Payload aproximado:

- `FormData` com `to_email`, `subject`, `body`, `filename` e `file`.

Efeito após salvar:

- feedback em `footerMsg`;
- fechamento do modal de arquivo.

## 9. Endpoints e backend

| Método HTTP | Rota / endpoint | Função frontend | Possível handler/backend | Operação realizada | Risco | Observações |
|---|---|---|---|---|---|---|
| `GET` | `/proteticos` | `protCarregar()` | `listar_proteticos()` em `backend/routes/proteticos_routes.py` | Lista protéticos da clínica | Alto | Base de toda a tela |
| `POST` | `/proteticos` | `protNovoCadastro()` | `criar_protetico()` | Cria novo protético | Alto | Usa `clinica_id` da sessão |
| `PATCH` | `/proteticos/{id}` | `protEditarCadastro()` | `alterar_protetico()` | Atualiza nome do protético | Alto | Verifica duplicidade por clínica |
| `DELETE` | `/proteticos/{id}` | `protExcluirCadastro()` | `excluir_protetico()` | Remove protético | Alto | Pode afetar serviços relacionados |
| `GET` | `/proteticos/{protetico_id}/servicos` | `protCarregarServicos()` | `listar_servicos()` | Lista serviços do protético | Alto | Depende do protético selecionado |
| `POST` | `/proteticos/{protetico_id}/servicos` | `protSalvarModal()` | `criar_servico()` | Cria serviço de protético | Alto | Payload com preço e prazo |
| `PUT` | `/proteticos/servicos/{servico_id}` | `protSalvarModal()` | `alterar_servico()` | Atualiza serviço existente | Alto | Reusa o mesmo modal |
| `DELETE` | `/proteticos/servicos/{servico_id}` | `protExcluirServico()` | `excluir_servico()` | Remove serviço | Alto | Recarrega a grade |
| `POST` | `/relatorios/enviar-email` | `protEnviarEmailRelatorio()` | `relatorios_routes` / handler equivalente | Envio de relatório por e-mail | Médio/alto | Dependência indireta da tela |

## 10. Entidades e tabelas de banco envolvidas

### 10.1. Entidades confirmadas

- `protetico`
- `servico_protetico`
- `controle_protetico`
- `usuarios`
- `pacientes`
- `clinicas`
- `contato` com campo `protetico_id`

### 10.2. Campos relevantes identificados

- `protetico.id`
- `protetico.nome`
- `protetico.clinica_id`
- `servico_protetico.id`
- `servico_protetico.protetico_id`
- `servico_protetico.clinica_id`
- `servico_protetico.nome`
- `servico_protetico.indice`
- `servico_protetico.preco`
- `servico_protetico.prazo`
- `controle_protetico.protetico_id`
- `controle_protetico.servico_protetico_id`
- `controle_protetico.cirurgiao_id`
- `controle_protetico.paciente_id`
- `controle_protetico.data_envio`
- `controle_protetico.data_entrega`
- `controle_protetico.valor`
- `controle_protetico.pago`
- `contato.protetico_id`

### 10.3. Dependência de clínica / tenant
Confirmada.

Todo o fluxo principal usa `current_user.clinica_id` para filtrar e gravar.

### 10.4. Risco multiclínica / multiusuário
Alto.

Qualquer erro de filtro por clínica ou de reaproveitamento de ID pode misturar dados de clínicas distintas.

### 10.5. Relação com outros módulos

- Agenda de contatos: pode sincronizar `Protetico` a partir de contato do tipo protético;
- Controle de protéticos: usa `Protetico` e `ServicoProtetico` como base;
- Procedimentos / custo de laboratório: existe ligação conceitual com custo protético em módulos financeiros e de procedimentos;
- Permissões: acesso é restringido ao módulo `procedimentos`.

## 11. Dependências com outros módulos

### 11.1. Ficha pessoal
Não foi identificada dependência direta confirmada nesta etapa.

### 11.2. Procedimentos
Dependência confirmada.

- o backend aplica `require_module_access("procedimentos")`;
- o menu mapeia a área para o eixo de procedimentos;
- o controle de protéticos e a tabela de protéticos convivem no mesmo domínio funcional.

### 11.3. Planos / convênios
Não foi identificada dependência direta confirmada nesta etapa.

### 11.4. Financeiro
Dependência indireta.

- a tabela exibe preço;
- o relatório exporta valores;
- a área de protéticos se conecta conceitualmente ao custo de laboratório.

### 11.5. Agenda
Dependência indireta confirmada.

- `backend/routes/agenda_contatos_routes.py` importa `Protetico`;
- contatos do tipo protético podem ser sincronizados com a tabela de protéticos.

### 11.6. Relatórios
Dependência parcial confirmada.

- a própria tela gera relatório;
- o envio por e-mail passa pelo endpoint de relatórios;
- a tela pode gerar arquivo em vários formatos.

### 11.7. Configurações
Dependência confirmada pelo ponto de entrada no menu de Configurações.

### 11.8. Permissões
Dependência confirmada.

- o acesso ao backend é protegido pelo módulo `procedimentos`.

### 11.9. Usuários/Login
Dependência indireta por sessão e autenticação.

- os endpoints usam `get_current_user`;
- a clínica atual e a sessão autenticada definem o escopo.

## 12. Funções candidatas a futura extração

| Função candidata | Arquivo atual | Responsabilidade aparente | Risco de extração | Dependências | Recomendação |
|---|---|---|---|---|---|
| `protRender` | `frontend/app.js` | Renderiza a grade de serviços e total | Médio | `protServicosCache`, seleção, formatação | Extrair depois |
| `protCarregarServicos` | `frontend/app.js` | Busca serviços do protético selecionado | Alto | `requestJson`, seleção atual, `protRender` | Extrair cedo, mas só após mapear contratos |
| `protCarregar` | `frontend/app.js` | Busca protéticos e encadeia carga de serviços | Alto | `requestJson`, cache, seletor, `protCarregarServicos` | Extrair cedo |
| `protAbrirModal` | `frontend/app.js` | Abre modal de serviço e prepara edição | Alto | estado do protético selecionado, DOM do modal | Extrair depois |
| `protSalvarModal` | `frontend/app.js` | Salva criação/edição de serviço | Muito alto | parse de preço, modal, endpoint, recarregamento | Extrair depois |
| `protNovoCadastro` | `frontend/app.js` | Cria novo protético via prompt | Alto | `window.prompt`, endpoint, recarga | Extrair cedo, com cautela |
| `protEditarCadastro` | `frontend/app.js` | Edita nome do protético principal | Alto | prompt, endpoint, recarga | Extrair cedo, com cautela |
| `protExcluirCadastro` | `frontend/app.js` | Exclui protético principal | Muito alto | confirmação, endpoint, recarga | Extrair depois |
| `protExcluirServico` | `frontend/app.js` | Exclui serviço selecionado | Alto | confirmação, seleção, endpoint | Extrair depois |
| `protAbrirRelatorio` | `frontend/app.js` | Abre modal de relatório | Médio | cache de protéticos, DOM do relatório | Extrair depois |
| `protExecutarRelatorio` | `frontend/app.js` | Gera relatório em tela/impressora/arquivo | Alto | formato, HTML, destino, exportação | Não extrair ainda |
| `protSalvarRelatorioArquivo` | `frontend/app.js` | Faz exportação e envio de e-mail | Muito alto | File Picker, Blob, FormData, email | Não extrair ainda |

## 13. Riscos funcionais

- a tabela não carregar;
- o seletor de protético ficar vazio ou apontar para item errado;
- salvar protético errado por causa de estado global incorreto;
- salvar serviço com protético incorreto;
- perder o vínculo por clínica;
- excluir protético com impacto indevido em serviços;
- quebrar a edição de serviços;
- quebrar a listagem ordenada;
- quebrar o relatório;
- quebrar o envio por e-mail;
- quebrar o fluxo usado pela agenda de contatos;
- quebrar o controle de protéticos que reutiliza a mesma entidade;
- quebrar permissões do módulo de procedimentos.

## 14. Riscos técnicos

- dependência de variáveis globais do `frontend/app.js`;
- dependência de `requestJson`;
- dependência de `getToken` / sessão autenticada;
- dependência de `footerMsg` para feedback;
- dependência de DOM já carregado e injeção dinâmica de HTML;
- eventos duplicados se `protVincularEventos()` for chamado fora da guarda `dataset.bound`;
- funções chamadas indiretamente por menu HTML;
- acoplamento com a lógica de relatório e exportação em arquivo;
- acoplamento com permissão backend `procedimentos`;
- endpoint compartilhado com outras frentes de protético;
- ausência de testes automatizados específicos para essa tela;
- ausência de módulo JS separado para a Tabela de protéticos.

## 15. O que não pode mudar

Nas próximas subetapas, deve permanecer igual:

- nomes e textos visíveis;
- comportamento dos botões;
- ordem esperada dos fluxos;
- endpoints;
- payloads;
- permissões;
- escopo por clínica;
- mensagens de sucesso e erro;
- forma de abrir e fechar modais;
- forma de recarregar dados;
- compatibilidade com dados existentes;
- relação entre protético e serviços;
- relação entre protético e relatórios;
- relação entre protético e agenda de contatos.

## 16. Onde testar futuramente

Checklist manual futuro:

- abrir a tela da Tabela de protéticos;
- listar protéticos;
- trocar de protético no seletor;
- listar serviços do protético selecionado;
- criar novo protético;
- editar protético existente;
- salvar alterações;
- cancelar edição;
- fechar o modal;
- criar novo serviço;
- editar serviço existente;
- salvar serviço;
- cancelar modal;
- excluir serviço, se o recurso existir;
- excluir protético, se o recurso existir;
- testar com usuário com permissão adequada;
- testar com usuário sem permissão adequada;
- recarregar a página e validar persistência;
- testar se a agenda de contatos continua reconhecendo protéticos;
- testar se o controle de protéticos continua carregando a base;
- testar mensagens de erro e sucesso.

Se algum teste não puder ser confirmado agora, ele fica como pendente para a subetapa técnica.

## 17. Plano sugerido para a próxima subetapa
Recomendação conservadora:

**Fase 2 — Subetapa 2 — Mapeamento técnico detalhado das funções da Tabela de protéticos no app.js**

Motivo:

- ainda há muitas funções acopladas no monólito;
- o contrato funcional já foi definido, mas a fronteira técnica precisa ficar mais explícita antes de qualquer recorte;
- existem dependências com relatório, exportação, sessão, seleção global e agenda de contatos.

## 18. Registro para commit e roadmap

- Tabela de protéticos foi escolhida como primeira frente da Fase 2;
- esta etapa criou apenas contrato funcional;
- não houve alteração de código;
- a próxima etapa ainda deve respeitar este contrato funcional;
- qualquer recorte futuro deve ser pequeno, reversível e testável;
- a modularização ainda não está autorizada nesta subetapa.

## 19. Onde testar esta etapa
Como esta etapa é documental, não há teste funcional de tela.

Checks obrigatórios desta etapa:

- `git status --short`
- `git diff -- docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`
- confirmação de que somente este documento foi criado ou modificado.

## 20. Observação sobre blindagem textual
A blindagem textual e de mojibake foi respeitada nesta etapa.

Nenhuma string visível do sistema foi corrigida, reescrita ou normalizada neste contrato.
