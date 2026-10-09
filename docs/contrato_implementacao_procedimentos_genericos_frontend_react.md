# Contrato de Implementação - Procedimentos Genéricos

> Precedência de domínio: [contrato canônico de Procedimentos/Genéricos](contrato_edicao_procedimentos_roundtrip.md). Afirmações anteriores conflitantes sobre herança/propagação cadastral, cópia própria de materiais, fases em todo save ou Mostrar símbolo são **SUPERSEDED**. Cadastro próprio do Genérico e homologações visuais PG-S7 permanecem; seus campos não se propagam ao Procedimento concreto.

> As seções iniciais são o contrato da implementação inicial. Seu "próximo passo"
> foi posteriormente executado; o contrato vigente do ciclo homologado está na
> seção PG-S7 abaixo. Não usar os limites da etapa inicial para negar os modais
> já existentes nem para autorizar nova implementação.

## Contexto consolidado

A frente de `Procedimentos genéricos` já existia no legado do Brana Cloud e já possui backend, modelo ORM e vínculo com fases e materiais.

Esta etapa consolidou apenas o contrato funcional e a implementação inicial do novo frontend React.

## Fontes auditadas

- `backend/routes/cadastros_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/material.py`
- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/auxiliaresApi.js`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`

## Contrato funcional confirmado

### Listagem

- `Código`
- `Procedimento genérico`
- `Especialidade`
- `Status`

### Status visual

- círculo verde = ativo
- círculo vermelho = inativo

### Barra de ações

- `Novo procedimento`
- `Altera...`
- `Elimina...`
- `Fases`
- `Materiais`

### Filtros

- `Especialidades`
- `Procedimentos`

Mapeamento da API:

- `especialidade`
- `q`

## Decisão de escopo

- Não mexer em backend nesta etapa.
- Não mexer em banco nesta etapa.
- Não inventar modal completo.
- Não inventar editor de fases.
- Não inventar editor de materiais.
- Não pedir arquivos `.ui` nesta etapa.

## Implementação inicial no React

- A rota nova foi ligada em `Tabelas > Procedimentos genéricos`.
- A página nova lista os registros do backend existente.
- Os filtros trabalham com `q` e `especialidade`.
- A listagem usa o padrão visual da frente de tabelas auxiliares.
- Os botões principais estão renderizados e com comportamento mínimo controlado.

## Próximo passo recomendado

Consolidar o modal/edição desta frente em uma etapa separada, quando houver validação visual suficiente para isso.

## Contrato vigente PG-S7 — ciclo fechado e homologado

PROCEDIMENTOS_GENERICOS_STATUS = COMPLETE / HOMOLOGATED.
PG_S6_MANUAL_HOMOLOGATION = PASS — declaração explícita do usuário.
Autoridade consolidada: [checkpoint PG-S7](checkpoints/procedimentos_genericos_pg_s7_checkpoint.md).

- Clique simples seleciona; duplo clique abre o mesmo fluxo de Alterar para o
  registro clicado, passado explicitamente à rotina, sem depender de state antigo.
  Controles internos de linha não provocam dupla abertura.
- `BranaTable` local usa `scroll={{ y: 480 }}`, cerca de 15 linhas de 32 px;
  todos os registros carregados permanecem acessíveis, sem paginação/truncamento.
  Contador externo ao corpo rolável; filtros, ordenação, radio e responsividade preservados.
- Inclusão/Alteração: readonly ciano claro/escuro, altura 28 px, padding `0 10px`,
  colunas equivalentes e gap horizontal 8 px. Larguras adaptam-se igualmente ao espaço.
- Modal alinhado ao padrão Preferências: header/close via BranaModal, abas card
  Principal/Custos diretos/Vínculos, superfícies clara `#f5f0e6` e escura `#142225`,
  footer com gap 8 px. Ordem funcional **Ok → Cancela** preservada.
- Principal: gap local label/campo de 2 px nos seis pares do formulário;
  Inclusão/Alteração mantêm gap vertical zero. Sem reduzir inputs ou largura funcional.
  Medição no viewport 738×704: 566,84 → 517,42 px, redução 49,42 px, sem clipping
  e sem scroll interno introduzido. Não é altura fixa nem garantia de geometria universal.
- Custos diretos: somente Tempo total de execução e Custo de protético editáveis.
  Custo da hora clínica, Custo fixo da intervenção, Custo de materiais e Custo total
  são resultados calculados/readonly (`output`), cianos nos dois temas.
  Fórmulas, precisão, estado, payload, validações, labels e ordem não mudaram.
- Preview utiliza resolução compatível com base/runtime, com a URL canônica
  preservada. [Regra vigente](contrato_normalizacao_catalogo_simbolos_graficos_brana_cloud.md#23-atualização-vigente-pg-s7--resolução-de-preview).

### DO_NOT_REOPEN

Não reabrir sem PROVEN_CONTRADICTION = SIM e prova: preview; duplo clique;
tabela/scroll/contador; modal padrão Preferências; gap Inclusão/Alteração;
compactação vertical; regra visual dos Custos diretos. Refinamento novo exige
escopo/autorização separada, não repetição dos testes já homologados.

Próximo módulo planejado: PROCEDIMENTOS-SIMBOLOS-P0 — READ-ONLY AUDIT.
Não iniciado. Não implementar símbolo obrigatório nem retomar FC4 neste fechamento.

## Código literal — correção R3A

O código de Procedimento Genérico é um identificador textual, único por clínica.
Zeros à esquerda são significativos: `00200` e `0200` são entidades distintas,
assim como cada par até `00206`/`0206` e, quando cadastrados, `0001`/`1`.
CRUD, payload, persistência, resposta e recarga preservam o texto; somente espaços
externos são removidos. Código vazio continua inválido. Não converter códigos
existentes para número nem aplicar padding na gravação ou na comparação de identidade.

O gerador de próximo código apenas sugere um novo código livre; ele não define
equivalência entre códigos existentes. A pesquisa textual por substring permanece
inalterada e pode retornar ambos os códigos sem fundir seus IDs. Não há migration
nem alteração automática de códigos já persistidos nesta correção.

Os tipos dos itens de Fases e Materiais são declarados antes do payload principal,
com referências concretas. Isso mantém os mesmos campos/defaults e permite a
validação HTTP do CRUD sem referências de tipos pendentes no FastAPI.
