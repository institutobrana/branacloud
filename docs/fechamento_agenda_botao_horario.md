# Fechamento — Agenda / botão Horário

## Estado

Frente encerrada documentalmente e congelada após homologação manual do operador.

```text
AGENDA_TOOLBAR_HORARIO = COMPLETE
AGENDA_TOOLBAR_HORARIO_FROZEN = SIM
MANUAL_OPERATOR_HOMOLOGATION = PASS
AGENDA_OVERALL_STATUS = IN_DEVELOPMENT
```

## Objetivo e escopo

Registrar o contrato final de `Agenda → toolbar horizontal → Horário`, que abre o modal `Pesquisa horarios livres`. O fechamento cobre somente essa ação; o módulo Agenda inteiro permanece em desenvolvimento.

## Histórico

- HOR-1 até HOR-1I: auditoria forense progressiva do legado e fechamento dos contratos de Dia/Semana, filtros, resultados, edição, datas, permissões e referência visual.
- HOR-2, HOR-2A e HOR-2B: implementação React, correção da auto-seleção da primeira linha e validação pós-implementação.
- HOR-3: retorno ao modal de horários após Cancelar no editor originado por free slot e alinhamento da arquitetura espacial.
- HOR-4A até HOR-4D: auditoria e integração do contrato compartilhado de datas, incluindo normalização parcial em runtime.
- HOR-5: fechamento documental e congelamento formal.

## Fonte de verdade e arquitetura

O código atual é a fonte de verdade. A implementação React compartilhada atende Dia e Semana por uma única ação e um único modal:

```text
ID legado: agenda-semana-btn-horario
Handler legado: agendaSemanaHorariosAbrir()
Modal React: AgendaFreeSlotsModal
Escopo React: Dia + Semana
```

O modal usa identidade visual React/Ant Design e arquitetura espacial baseada no legado: Dias da semana à esquerda; Cirurgião e Unidade verticalmente à direita; Horário entre; Período entre; Pesquisa; tabela abaixo; Edita... e Fecha no rodapé à direita.

## Contrato funcional congelado

- Dias: Segunda a Sábado (`[1,2,3,4,5,6]`); Domingo não existe no filtro; padrão marcado.
- Cirurgião e Unidade usam catálogos reais e valores por ID.
- Horário válido: início menor que fim; padrão comprovado `07:00–20:00`, conforme configuração/fallback.
- Período inicia desligado; com OFF, datas ficam desabilitadas. Com ON, ambas ficam habilitadas e a pesquisa exige duas datas preenchidas, com fim maior ou igual ao início. A mesma data é válida.
- Pesquisa: `GET /agenda-legado/horarios-livres`. O cálculo de horários livres permanece no backend; não há algoritmo duplicado no React.
- Resultados: Data, Dia, Hora, Duração e Cirurgião. O datasource preserva os resultados retornados, sem paginação artificial nem `slice(0,10)`, com scroll interno.
- Seleção: única; a primeira linha é selecionada automaticamente quando há resultados; Edita... depende de seleção válida.
- Edita... e duplo clique usam o mesmo bridge e abrem o `AgendaEventModal` em modo de novo agendamento. Free slot não possui `event_id` persistido.
- Cancelar, quando o editor foi aberto a partir de free slot, retorna ao modal de horários preservando filtros, resultados e seleção. Esse comportamento não se aplica aos demais fluxos de novo agendamento.

## Contrato compartilhado de datas

Fonte: `frontend-react/src/features/contaCorrenteCirurgiao/dateParsing.js`, função `normalizeContaCorrenteDateInput`, com referência funcional em `Ficha Pessoal → Dados pessoais → Nascimento`.

```text
Visual: DD/MM/YYYY
Interno: YYYY-MM-DD
Normalização: blur e Tab
Durante digitação: não normaliza
Enter: sem normalização especial
UTC/toISOString: não utilizado
```

Matriz congelada:

```text
"1"          → inválido
"01"         → completa mês/ano da referência
"010"        → inválido
"0109"       → completa ano
"01/09"      → completa ano
"010926"     → DDMMYY válido
"01092026"   → inválido
"01/09/26"   → inválido
"01/09/2026" → válido
```

Datas impossíveis são rejeitadas e valor vazio é permitido.

## Visual e temas

O contrato visual aprovado é React/Ant Design moderno, sem cópia pixel a pixel do Windows legado. A largura segue até aproximadamente 640px respeitando o viewport seguro. A tabela usa scroll interno; o cabeçalho acompanha o corpo e não é sticky/fixed. Light e dark mode foram aceitos na homologação manual do operador.

## Testes, runtime e homologação

Os testes focados existentes e o build foram executados durante a implementação; o operador realizou a validação runtime final e informou PASS para o fluxo funcional, retorno após Cancelar, arquitetura interna e campos de data. A homologação manual do operador é a fonte final deste fechamento. O Codex registra que sua coleta automatizada de runtime foi parcial na HOR-4D e não a apresenta como prova executada pelo Codex.

Nenhuma persistência faz parte da frente: `POST_PERSISTENT = 0`, `PUT_PERSISTENT = 0`, `PATCH_PERSISTENT = 0`, `DELETE_PERSISTENT = 0` e `SQL_WRITE = 0`.

## Itens congelados e fora de escopo

Ficam congelados: identidade da ação, Dia/Semana compartilhados, filtros, prestador, unidade, horário, período, datas, pesquisa, resultados, auto-seleção, edição/duplo clique, retorno após Cancelar, arquitetura visual e scroll da tabela.

Ficam fora de escopo: Agenda inteira, backend, banco, schema, infraestrutura Vite/HTTPS, outras ações da toolbar, novos formatos de data, novos parsers, alterações de tema global e qualquer refatoração.

## Regras para futuras regressões

Qualquer mudança no botão Horário deve preservar o endpoint, o contrato de datas, a seleção única, o bridge de novo agendamento, o retorno contextual após Cancelar, Dia + Semana e o cabeçalho não sticky. Uma regressão deve ser reproduzida antes de qualquer alteração e homologada novamente pelo operador.

## Conclusão

```text
FUNCTIONAL_IMPLEMENTATION = COMPLETE
DOCUMENTATION = COMPLETE
AGENDA_TOOLBAR_HORARIO = COMPLETE / FROZEN
AGENDA_OVERALL_STATUS = IN_DEVELOPMENT
```
