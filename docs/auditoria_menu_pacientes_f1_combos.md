# MENU PACIENTES — F1.AUDIT

Data: 2026-08-30  
Escopo: auditoria read-only dos combos Cirurgião, Filtro e Visualização.

## Resultado executivo

A auditoria está **INCOMPLETA** para declarar o contrato runtime legado. O
código legado e o backend permitem reconstruir a cadeia de dados, mas a aba
legada disponível estava com sessão expirada durante a tentativa de validação.
Por isso, contagens e listas observadas no runtime legado não foram inventadas.
Nenhum arquivo funcional, CSS, backend ou banco foi alterado.

## React atual

O `MenuPacientesModal` atual, em
`src/features/menuPacientes/components/MenuPacientesModal.jsx`, renderiza:

| Controle | Itens atuais | Valor inicial | Situação |
|---|---|---:|---|
| Cirurgião | `<<Todos>>` | `*` | hardcoded; sem efeito |
| Filtro | `<<Todos>>` | `*` | hardcoded; sem efeito |
| Visualização | `Nome, número` | `nome` | hardcoded; sem efeito |

O componente filtra localmente somente por letra e texto. O campo de pesquisa
usa nome/número localmente; os três combos não alteram a lista. No runtime
React, os três controles estavam presentes e alinhados, com retângulos de
156 × 30 px; nenhuma opção estava aberta no instante da inspeção.

## Legado: cadeia comprovada por código

| Etapa | Arquivo/função | Evidência |
|---|---|---|
| Montagem | `frontend/app.js`, `fichaMenuPacEnsureUI` | cria os quatro selects e a régua |
| Preferências | `fichaMenuPacCarregarPreferencias` | lê `GET /cadastros/pacientes/menu-preferences` |
| Opções | `fichaMenuPacCarregarOptions` | lê `GET /cadastros/pacientes/menu-options` |
| Pesquisa | `fichaMenuPacPesquisar` | envia filtros para `GET /cadastros/pacientes/menu` |
| Backend opções | `backend/routes/cadastros_routes.py`, `listar_pacientes_menu_options` | monta cirurgiões, status, visualização e pesquisa |
| Backend lista | `listar_pacientes_menu` | aplica filtros e ordenação |

## Cirurgião

- Fonte: `PrestadorOdonto`, filtrado por `clinica_id`.
- Endpoint de opções: `GET /cadastros/pacientes/menu-options`.
- Campo interno: `PrestadorOdonto.source_id`.
- Label: `PrestadorOdonto.nome`.
- Ordenação: nome normalizado ascendente e `id` ascendente.
- Opção Todos: label `<<Todos>>`, valor `0`.
- Filtro aplicado: paciente cujo `ID_PRESTADOR` normalizado seja igual ao
  valor escolhido.
- Lista/contagens runtime: **NÃO COMPROVADAS**, pois a sessão legada expirou.

## Filtro

O combo representa a situação do paciente, não um filtro genérico de agenda.

Valores definidos no backend:

| Label | Valor | Regra |
|---|---:|---|
| `<<Todos>>` | 0 | não restringe |
| `Ativo` | 2 | código de situação 2 |
| `Em tratamento` | 3 | código de situação 3 |
| `Faleceu` | 4 | código de situação 4 |
| `Inativo` | 1 | código de situação 1 |
| `<<Todos os ativos>>` | 98 | situações 2 ou 3 |
| `<<Todos os inativos>>` | 99 | situações 1 ou 4 |
| auxiliares ativos | IDs derivados | compara texto da situação auxiliar |

A lista de auxiliares vem dos itens auxiliares da clínica. A ordem exata
depende dos registros reais e não foi medida no runtime legado nesta sessão.

## Visualização

`PACIENTE_MENU_VISUALIZACAO_OPTIONS` define:

| Label | Valor | Efeito comprovado no backend |
|---|---:|---|
| Nome, número | 1 | nome + código |
| Sobrenome, nome, número | 2 | nome invertido + código; ordena por sobrenome |
| Nome, matrícula | 3 | coluna 2 matrícula |
| Nome, telefone | 4 | coluna 2 telefone |
| Nome, prontuário | 5 | coluna 2 prontuário |
| Nome, data de nascimento | 6 | coluna 2 data de nascimento |

O backend também retorna `coluna2_label` e `valor_coluna2`. A escolha altera
coluna, nome exibido e, no valor 2, a ordenação; não altera o endpoint.

## Pesquisa, A-Z e combinação

O legado envia simultaneamente `q`, `cir_menu_pac`, `status_menu_pac`,
`visualizacao_menu_pac`, `pesquisa_menu_pac` e `active_ord_menu_pac` para o
endpoint `/cadastros/pacientes/menu`. Os filtros são aplicados de forma
sequencial, portanto a semântica comprovada no código é **AND**.

`pesquisa_menu_pac=1` pesquisa nome por prefixo; `2` pesquisa código por
prefixo. A-Z também é aplicado ao mesmo conjunto filtrado. A lista real e as
contagens por combinação continuam **NÃO COMPROVADAS em runtime legado**.

## Endpoint atual do React

O módulo extraído chama `GET /agenda-legado/pacientes?limit=5000`, que não
fornece as opções dos combos nem aceita seus parâmetros. Portanto, esse
endpoint isolado é insuficiente para reproduzir o contrato dos três combos.
Já existem endpoints backend adequados: `/cadastros/pacientes/menu-options`
e `/cadastros/pacientes/menu`; eles ainda não são consumidos pelo modal React.

## Reuso com Cadastro → Pacientes

`features/pacientes` já expõe `listarPacientesMenu` e
`listarPacientesMenuOptions`, com os mesmos parâmetros e endpoints. Há uma
base de reuso segura, mas esta auditoria não refatorou imports nem alterou
comportamento.

## Legado × React

| Controle | Legado | React atual | Divergência |
|---|---|---|---|
| Cirurgião | opções dinâmicas de prestadores; filtra pacientes | `<<Todos>>` hardcoded; sem efeito | SIM |
| Filtro | situações reais/auxiliares; filtra pacientes | `<<Todos>>` hardcoded; sem efeito | SIM |
| Visualização | 6 opções; muda colunas/ordenação | 1 opção; sem efeito | SIM |
| Combinação | filtros AND no backend | letra/texto local apenas | SIM |

## Plano futuro, sem implementação nesta fase

1. F1.1: consumir `menu-options` e ligar Cirurgião ao contrato numérico.
2. F1.2: ligar Filtro aos códigos e situações auxiliares reais.
3. F1.3: ligar Visualização às seis opções e à coluna retornada.
4. Revalidar runtime legado e React com o mesmo contexto, incluindo
   contagens, combinações e A-Z.

## Validações desta auditoria

- Vite HTTPS reutilizado: PID 19604; localhost e LAN retornaram `200 OK`.
- Testes focados da Agenda: 53 PASS / 0 FAIL.
- Build: não executado; não houve alteração de código.
- Writes: POST 0, PUT 0, PATCH 0, DELETE 0.
- Backend, banco, CSS e frontend: não alterados.

## Veredito

- Contrato Cirurgião: **PARCIALMENTE COMPROVADO**.
- Contrato Filtro: **PARCIALMENTE COMPROVADO**.
- Contrato Visualização: **COMPROVADO por código; runtime pendente**.
- Endpoint atual do React suficiente: **NÃO**.
- Pronto para implementação: **NÃO**, até completar runtime legado.
- `MENU PACIENTES — F1.AUDIT = INCOMPLETA`.

## F1.AUDIT-R1 — comprovação runtime

- Autenticação legítima do legado: **NÃO CONCLUÍDA**. A sessão disponível
  retornou `Sessão expirada, faça login novamente!` e o fluxo foi encerrado
  sem tentativa de bypass ou credencial inventada.
- Modal legado e combos: **NÃO ABERTOS** nesta rodada; portanto lista real,
  valores recuperados do DOM, situações auxiliares e contagens permanecem
  **NÃO COMPROVADOS em runtime**.
- Evidência de código/backend preservada: `menu-options` fornece Cirurgião,
  Filtro, Visualização e Pesquisa; `menu` recebe os parâmetros e aplica os
  filtros em conjunto.
- React/feature `menuPacientes`: zero diff.
- Agenda e backend: zero alterações.
- Vite HTTPS: reutilizado na porta 5173, localhost e LAN retornaram `200 OK`.
- Testes baseline read-only: 53 PASS / 0 FAIL.
- Build: NOT NEEDED, pois não houve alteração de código.
- Writes: POST 0, PUT 0, PATCH 0, DELETE 0.

### Veredito R1

Cirurgião runtime: **NÃO**  
Filtro runtime: **NÃO**  
Visualização runtime: **NÃO**  
Situações auxiliares runtime: **NÃO**  
Contagens runtime: **NÃO**  
Combinações runtime: **NÃO**  
Contrato completo: **NÃO**  

`MENU PACIENTES — F1.AUDIT = INCOMPLETA`  
`PRONTO PARA IMPLEMENTAÇÃO DOS COMBOS = NÃO`

## F1.AUDIT-R1 — comprovação runtime complementar

Em 2026-08-30 a sessão legítima do legado foi retomada e o Menu de pacientes
foi aberto. O runtime confirmou:

### Cirurgião

| Label | Value |
|---|---:|
| `<<Todos>>` | 0 |
| Adriana Sadôco Ferraz Jascinto | 258 |
| Agenda - TLMK | 257 |
| Alisson Cristovão Butarelo | 256 |
| Clínica | 255 |
| Gleisson Tel | 1 |

### Filtro

| Label | Value |
|---|---:|
| `<<Todos>>` | 0 |
| Faleceu | 201659 |
| Ativo | 200421 |
| Em tratamento | 200837 |
| Inativo | 200804 |
| `<<Todos os ativos>>` | 98 |
| `<<Todos os inativos>>` | 99 |

Os valores de situações individuais são IDs auxiliares reais desta clínica;
98 e 99 são os agrupadores especiais comprovados no runtime.

### Visualização e Pesquisa

| Controle | Label | Value |
|---|---|---:|
| Visualização | Nome, número | 1 |
| Visualização | Sobrenome, nome, número | 2 |
| Visualização | Nome, matrícula | 3 |
| Visualização | Nome, telefone | 4 |
| Visualização | Nome, prontuário | 5 |
| Visualização | Nome, data de nascimento | 6 |
| Pesquisa | Nome | 1 |
| Pesquisa | Número | 2 |

Estado inicial observado: Cirurgião `0`, Filtro `0`, Visualização `1`,
Pesquisa `2`. O modal mediu 690 × 640 px, com 1.631 linhas visíveis no
carregamento inicial e texto `1631 pacientes listados`.

### Limitação de contagens e combinações

Não foram alterados combos, letras ou texto durante esta comprovação. O código
legado liga `change` dos quatro selects a `fichaMenuPacSalvarPreferencias`, que
executa `PATCH /cadastros/pacientes/menu-preferences` antes da nova pesquisa.
Como esta fase exige zero writes, contagens por opção, combinações e efeitos de
tabela permanecem pendentes de uma estratégia de leitura que não dispare esse
PATCH. Portanto, a existência/valor dos itens está comprovada em runtime, mas
o contrato completo de efeitos e contagens ainda não está liberado.

### Estado final R1

- Login legítimo: SIM.
- Menu legado aberto: SIM.
- Listas e valores dos três combos: SIM, comprovados.
- Contagens por opção e combinações: NÃO, preservadas para não gerar PATCH.
- React, `features/menuPacientes`, Agenda, backend e API: ZERO DIFF.
- GET: carregamentos normais; POST/PUT/PATCH/DELETE: 0 nesta auditoria.
- Testes focados da Agenda: 53 PASS / 0 FAIL.
- `MENU PACIENTES — F1.AUDIT = INCOMPLETA` até fechar os efeitos sem escrita.

## F1.AUDIT-R3 — fechamento read-only por API GET

### Sessão e escopo

- Sessão legada legítima: válida; Menu de pacientes aberto.
- Vite HTTPS reutilizado: PID 19604; localhost e LAN retornaram `200 OK`.
- Frontend, CSS, backend, API e banco: zero alterações.

### Evidência runtime

As listas e valores de Cirurgião, Filtro e Visualização foram confirmados no
DOM do legado. O estado inicial foi Cirurgião `0`, Filtro `0`, Visualização
`1`, Pesquisa `2`, com 1.631 linhas e `1631 pacientes listados`.

### Pendência de GET parametrizado

Não foi possível executar os GETs parametrizados de
`/cadastros/pacientes/menu` por um cliente autenticado separado. A avaliação
isolada do navegador não expõe `fetch`, cookies ou token. Alterar selects pela
UI dispara `PATCH /cadastros/pacientes/menu-preferences`, proibido nesta fase.

Para preservar zero writes, não foram alterados combos, A-Z ou texto de
pesquisa. Permanecem não comprovados: contagens por Cirurgião/Filtro, totais
A/M/Z, combinações, smoke dos seis modos e pesquisa por nome/número via GET.

### Veredito R3

- Listas e valores runtime: **COMPROVADOS**.
- Contagens API, A-Z e combinações: **NÃO COMPROVADOS**.
- Writes: POST 0, PUT 0, PATCH 0, DELETE 0.
- Testes focados: 53 PASS / 0 FAIL.
- `MENU PACIENTES — F1.AUDIT = INCOMPLETA`.
- Pronto para implementação funcional: **NÃO**.

## F1.AUDIT-R4 — GET autenticado no browser runtime

O Vite HTTPS foi reutilizado normalmente (PID 19604; localhost e LAN `200
OK`). A tentativa de reconectar à aba legada autenticada iniciou com a sessão
disponível, mas o bloco de consultas excedeu o timeout do runtime e o kernel
foi resetado. Após a reconexão, a aba legada não estava mais disponível; restou
somente a aba React.

Não foram impressos, persistidos ou forjados tokens/cookies. Também não foram
alterados selects, portanto não houve PATCH de preferências. Nenhum GET
parametrizado adicional pôde ser executado após a perda do contexto autenticado.

Resultado R4:

- GET parametrizado autenticado: **NÃO CONCLUÍDO**.
- Contagens, A-Z, combinações e amostras API: **NÃO COMPROVADOS**.
- POST/PUT/PATCH/DELETE: 0.
- Código, CSS, backend e API: ZERO DIFF.
- `MENU PACIENTES — F1.AUDIT = INCOMPLETA`.
- Pronto para implementação funcional: **NÃO**.
