# Fechamento — Agenda / botão Paciente

## 1. Escopo e fonte de verdade

Esta frente encerra a ação **Paciente** da barra horizontal da Agenda React. O código atual e os testes/runtime homologados são a fonte de verdade; este registro não reabre auditorias anteriores nem representa o fechamento do módulo Agenda inteiro.

## 2. Arquitetura compartilhada

Dia e Semana usam a mesma Agenda React, a mesma toolbar, o mesmo modal de pesquisa e a mesma lógica. Há uma implementação de botão, modal e pesquisa, sem duplicação por modo.

## 3. Contrato funcional

O botão `Paciente` abre `Pesquisa agendamentos`. A pesquisa usa `GET /agenda-legado`, com substring em nome ou assunto, `trim`, comparação case-insensitive, Enter para executar, Tab sem executar e sem busca automática ao digitar ou trocar filtros.

Estado inicial: texto vazio; futuros, passados, pacientes e compromissos marcados; `Pesquisa` e `Edita...` desabilitados; foco no campo de pesquisa.

## 4. Filtros e resultados

Futuro é data/hora maior ou igual ao momento atual; passado é data/hora anterior. Paciente é tipo 1 ou evento com `nro_pac`; compromisso é tipo 2 ou evento sem `nro_pac`. A pesquisa exige texto não vazio e pelo menos um filtro temporal. Com ambos os tipos desmarcados, o resultado é vazio.

A tabela mantém as colunas `Data`, `Hora`, `Paciente / Compromisso` e `Cirurgião`, ordenadas por data e hora ascendentes, com seleção única. O cabeçalho e o conteúdo ficam centralizados. As larguras homologadas são 105px, 70px, 300px e 150px.

## 5. Edição e duplo clique

`Edita...` e duplo clique convergem para o editor existente da Agenda, usando o mesmo bridge para pacientes e compromissos. Nenhum segundo editor foi criado.

## 6. Limite visual

Até dez linhas ficam visíveis. Acima disso, o scroll é vertical e interno à tabela, com cabeçalho e rodapé preservados. Todos os resultados permanecem no `dataSource`; não há paginação nem `slice` para dez itens.

## 7. Cirurgião

O contrato final é `AgendaLegadoEvento.id_prestador → PrestadorOdonto.id → PrestadorOdonto.apelido`. O `GET /agenda-legado` foi enriquecido com `prestador_apelido` por lookup bulk filtrado por `clinica_id`, sem N+1. O frontend renderiza `item.prestador_apelido || ''`. IDs nulos ou prestadores não encontrados resultam em vazio.

## 8. Visual

O modal React tem largura homologada de 720px, layout compacto, campo e Pesquisa na mesma linha, opções em grade 2x2, tabela como corpo principal e rodapé à direita com `Edita...` e `Fecha`. Light e dark mode seguem os tokens/componentes React do Brana Cloud; o visual não copia pixel a pixel a janela Windows legada.

## 9. Arquivos finais envolvidos

- `frontend-react/src/features/agendaSemanal/components/AgendaSemanalToolbar.jsx`
- `frontend-react/src/features/agendaSemanal/components/AgendaSearchModal.jsx`
- `frontend-react/src/features/agendaSemanal/components/agendaSearchModal.css`
- `frontend-react/src/features/agendaSemanal/api/agendaSemanalApi.js`
- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`
- `backend/routes/agenda_legado_routes.py`
- `backend/models/prestador_odonto.py`
- `frontend-react/tests/agendaPatientSearch.test.mjs`

## 10. Testes, runtime e homologação

Os testes relevantes passaram com 23/23; o build passou com exit code 0. O runtime homologado preservou Dia/Semana, pesquisa, filtros, seleção, edição, duplo clique, scroll, light/dark e a resolução do apelido do cirurgião. A homologação manual do operador foi registrada como PASS.

As evidências de infraestrutura da sessão foram Vite PID 15820, backend PID 18224, HTTPS localhost 200, HTTPS LAN 200 e health 200. Nenhum write de negócio foi executado.

## 11. Contrato congelado

`AGENDA_PATIENT_ACTION_FROZEN = SIM`. Não alterar sem nova decisão: toolbar compartilhada, endpoint e filtros, estado inicial, tabela, limite de dez linhas, resolução de `id_prestador`, seleção, edição, duplo clique, integração Dia/Semana e visual React.

## 12. Regressões futuras

Qualquer regressão deve ser tratada em nova frente, preservando o módulo Agenda como `IN DEVELOPMENT`. Não registrar PAC-2C como executada; este fechamento considera o comportamento final React homologado.

## 13. Fora de escopo

Ficam fora deste fechamento: conclusão do módulo Agenda inteiro, outros botões da toolbar, novas funções de pacientes, alteração de backend além do enriquecimento já implementado, deploy, AWS, commit e push.
