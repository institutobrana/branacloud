# Fechamento funcional — Menu de contexto da Agenda

## 1. Objetivo e status

A frente `Agenda — Menu de contexto — botão direito` está concluída e congelada. Ela cobre o menu contextual do frontend React nas visualizações diária e semanal, sem encerrar o módulo Agenda como um todo.

```text
AGENDA_CONTEXT_MENU = COMPLETE
FUNCTIONAL = COMPLETE
VISUAL = COMPLETE
RUNTIME = PASS
LIGHT_MODE = PASS
DARK_MODE = PASS
MANUAL_HOMOLOGATION = PASS
CONTEXT_MENU_CONTRACT_FROZEN = SIM
```

## 2. Contrato funcional final

Em horário livre, o botão direito abre `Novo agendamento...`, que reutiliza `AgendaEventModal` em modo novo, com data, hora e contexto atual da Agenda. A abertura não grava dados.

Em evento existente, a ordem é:

1. `Editar agendamento...`
2. `Excluir agendamento`
3. separador
4. `Repetir agendamento...`
5. `Abrir odontograma...`
6. `Abrir ficha pessoal...`
7. `Pesquisar iguais...`

Editar reutiliza o modal existente em modo edição. Repetir reutiliza o mesmo modal e abre diretamente a aba `Repete agendamento`, sem executar a repetição automaticamente (`REPEAT_POST_ON_OPEN = 0`).

## 3. Exclusão direta

`Excluir agendamento` fecha o menu e abre diretamente a confirmação, sem abrir `AgendaEventModal` antes.

- Título: `Eliminar agendamento`
- Corpo: `Deseja eliminar o agendamento de '<nome>'?`
- Ações: `Eliminar` e `Cancelar`

Cancelar não chama API. Confirmar reutiliza `deleteAgendaEvent(event.id)`, o refresh existente e o tratamento de erro existente.

## 4. Placeholders

Os itens de odontograma, ficha pessoal e pesquisa de iguais permanecem visíveis e clicáveis, sem navegação, API funcional ou escrita. Exibem:

- `Abrir odontograma: em planejamento.`
- `Abrir ficha pessoal: em planejamento.`
- `Pesquisar iguais: em planejamento.`

`Repetir agendamento...` é funcional e aparece como item habilitado normal; não é placeholder.

## 5. Seleção, diária/semanal e lifecycle

O clique direito em evento atualiza a seleção e as ações usam o evento selecionado. Uma única implementação compartilhada atende Agenda diária e semanal.

O menu abre por `contextmenu` com `preventDefault`, usa posicionamento fixo com clamp de viewport e fecha após ação, clique externo, Escape, blur, resize ou scroll. Listeners globais são removidos no cleanup.

## 6. Visual React final

O visual legado foi deliberadamente substituído pelo padrão React baseado em Ant Design e nos tokens Brana Cloude.

- Fonte: Inter, 14px, line-height 22px
- Item: 32px, padding 5px 12px
- Raio: 12px
- Tema claro: fundo `#ffffff`, texto `#163328`, hover `#e5ede0`
- Tema escuro: fundo `#142225`, texto `#e6f0f1`, hover `#183235`
- Tokens: `branaTokens.css`, `getBranaTheme()` e tokens Ant Design

Itens funcionais usam aparência normal. Placeholders usam texto secundário sutil, mas continuam clicáveis.

## 7. Homologação manual

O operador confirmou no runtime:

- fluxo contextual;
- Novo, Editar e exclusão direta;
- Repetir com abertura direta da aba correta;
- placeholders;
- visual claro e escuro;
- funcionamento diário/semanal.

Resultado: `OPERATOR_MANUAL_HOMOLOGATION = PASS`.

## 8. Testes e runtime

- Testes automatizados: 19 PASS, 0 FAIL.
- Build: PASS, exit code 0.
- Vite observado: PID 15820.
- Backend observado: PID 18224.
- HTTPS localhost: 200.
- HTTPS LAN: 200.
- Backend health: 200.
- POST/PUT/PATCH/DELETE persistentes: 0.

Os PIDs são evidência da sessão de homologação, não uma garantia permanente.

## 9. Arquivos relevantes

- `frontend-react/src/features/agendaSemanal/components/AgendaContextMenu.jsx`
- `frontend-react/src/features/agendaSemanal/components/AgendaDeleteConfirmModal.jsx`
- `frontend-react/src/features/agendaSemanal/components/agendaContextMenu.css`
- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`
- `frontend-react/src/features/agendaSemanal/components/AgendaEventModal.jsx`
- `frontend-react/tests/agendaContextMenu.test.mjs`
- testes permanentes de repetição relacionados à Agenda

## 10. Laboratório temporário

O laboratório C2/R12/R12E foi temporário, não integra a arquitetura funcional final e foi removido completamente, sem rota DEV, import ou executável residual.

## 11. Contrato congelado

Sem nova decisão explícita, futuras frentes não devem alterar a ordem dos itens, ações, exclusão direta, confirmação, abertura direta da aba de repetição, placeholders, seleção, lifecycle, visual React ou cobertura diária/semanal.

## 12. Fora de escopo

Este fechamento não encerra o módulo Agenda, não altera backend, API, FullCalendar, regras de negócio, documentação de outras frentes, GitHub, deploy ou AWS. Commit e push permanecem pendentes de uma etapa própria.
