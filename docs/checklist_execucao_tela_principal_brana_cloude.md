# Checklist de Execucao da Tela Principal

Este checklist acompanha a correção da tela principal do Brana Cloude para aproximá-la da referência do EasyDental, com foco em execução segura, validação incremental e commits pequenos.

## Legenda

- `[ ]` pendente
- `[~]` em andamento
- `[x]` concluido

## 1. Base e congelamento

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| B01 | Validar login no Brana Cloud | Frontend | Nenhuma | Login abre sem erro | [x] |
| B02 | Validar paciente piloto 214 | Frontend + Backend | B01 | Paciente carrega e permanece consistente | [x] |
| B03 | Validar tratamento piloto 239 | Frontend + Backend | B02 | Tratamento aparece com 17 intervenções | [x] |
| B04 | Registrar estado atual da tela principal | Frontend | B02 | Existe baseline visual e funcional | [x] |
| B05 | Confirmar fluxo real pelo Odontograma V1 | Frontend | B01 | A tela principal abre pelo caminho real | [x] |
| B06 | Remover caminho mock da tela principal | Frontend | B05 | Nenhum fallback ativo para a tela legada | [x] |
| B07 | Remover módulos legados da tela mock | Frontend | B06 | Arquivos legados deixam de existir no runtime | [x] |

## 2. Contrato funcional

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| C01 | Listar quadros obrigatórios da tela | Produto + Frontend | B04 | Escopo claro dos blocos da tela | [x] |
| C02 | Definir estado sem paciente | Produto + Frontend | C01 | O vazio tem comportamento definido | [x] |
| C03 | Definir estado com paciente | Produto + Frontend | C01 | O paciente em uso tem comportamento definido | [x] |
| C04 | Definir estado com tratamento selecionado | Produto + Frontend | C01 | O tratamento ativo tem comportamento definido | [x] |
| C05 | Definir estado com odontograma preenchido | Produto + Frontend | C01 | O caso completo tem comportamento definido | [x] |
| C06 | Definir fonte de dados por bloco | Backend + Frontend | C01 | Cada bloco tem origem de dados explícita | [x] |
| C07 | Definir comportamento esperado por bloco | Produto + Frontend | C01 | Não existem ambiguidades de interação | [x] |
| C08 | Consolidar contrato tecnico da tela | Produto + Frontend | C02-C07 | Documento de contrato fechado | [x] |
| C09 | Consolidar inventario dos quadros | Frontend | C08 | Lista final dos blocos da tela | [x] |
| C10 | Consolidar matriz EasyDental x Brana | Frontend + Produto | C08 | Divergencias registradas por bloco | [x] |

## 3. Auditoria bloco a bloco

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| A01 | Auditar cabecalho do paciente | Frontend | C08 | Nome, codigo e estado consistentes | [x] |
| A02 | Auditar odontograma | Frontend + Backend | C08 | Leitura clinica correta no piloto | [~] |
| A03 | Auditar tratamentos por data | Frontend + Backend | C08 | Lista e selecao de tratamentos corretas | [~] |
| A04 | Auditar contexto clinico | Frontend + Backend | C08 | Blocos laterais coerentes com o paciente | [~] |
| A05 | Auditar agenda | Frontend + Backend | C08 | Agenda mostra dados e estado vazio corretos | [~] |
| A06 | Auditar procedimentos registrados | Frontend + Backend | C08 | Grade inferior mostra os eventos certos | [x] |
| A07 | Auditar historico clinico | Frontend + Backend | C08 | Historico reflete o legado esperado | [~] |
| A08 | Auditar imagens | Frontend + Backend | C08 | Imagens listam o que for associado ao paciente | [~] |
| A09 | Auditar documentos | Frontend + Backend | C08 | Documentos aparecem quando existirem | [~] |
| A10 | Auditar avisos e paines auxiliares | Frontend + Backend | C08 | Avisos nao conflitam com o fluxo clinico | [x] |
| A11 | Classificar divergencias por tipo | Frontend + Produto | A01-A10 | Cada problema fica marcado como visual, funcional, dado ou contrato | [x] |

## 4. Shell visual

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| S01 | Ajustar estrutura geral da pagina | Frontend | A11 | A tela base fica parecida com a referencia | [ ] |
| S02 | Ajustar posicionamento dos blocos | Frontend | S01 | Ordem e hierarquia dos blocos ficam corretas | [ ] |
| S03 | Ajustar densidade visual | Frontend | S01 | A tela deixa de parecer espaçada demais | [ ] |
| S04 | Ajustar bordas, divisões e proporcoes | Frontend | S01 | O recorte dos quadros fica coerente | [ ] |
| S05 | Ajustar composição geral | Frontend | S02-S04 | A tela lembra o EasyDental sem quebrar o fluxo | [ ] |

## 5. Blocos clínicos principais

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| D01 | Ajustar odontograma | Frontend + Backend | S05 | O caso piloto representa o legado corretamente | [ ] |
| D02 | Ajustar lista de tratamentos por data | Frontend + Backend | S05 | O tratamento ativo muda a tela inteira quando selecionado | [ ] |
| D03 | Ajustar procedimentos registrados | Frontend + Backend | S05 | A grade inferior reflete os procedimentos reais | [ ] |
| D04 | Ajustar contexto clinico | Frontend + Backend | S05 | Paciente, tratamento e observacoes batem com o caso | [ ] |
| D05 | Ajustar historico clinico | Frontend + Backend | S05 | O historico fica legivel e fiel ao piloto | [ ] |
| D06 | Ajustar agenda | Frontend + Backend | S05 | A agenda mostra os compromissos e estados corretos | [ ] |

## 6. Complemento de backend, se necessario

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| R01 | Identificar dado faltante por bloco | Backend | A11 | Fica claro o que o frontend nao consegue montar sozinho | [ ] |
| R02 | Ajustar rota ou payload minimo | Backend | R01 | O frontend recebe o dado esperado | [ ] |
| R03 | Garantir autenticacao nas rotas novas | Backend | R02 | Nenhuma rota operacional fica sem auth | [ ] |
| R04 | Garantir tenant por clinica_id | Backend | R02 | Nenhum dado cruza clinicas indevidamente | [ ] |
| R05 | Validar integridade do piloto apos ajuste | Frontend + Backend | R02-R04 | O paciente piloto continua abrindo sem regressao | [ ] |

## 7. Validacao comparativa

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| V01 | Abrir a referencia EasyDental | Operador + Frontend | S05 | A referencia esta visivel para comparacao | [ ] |
| V02 | Abrir o Brana com o mesmo paciente | Frontend | S05 | O mesmo caso esta no Brana | [ ] |
| V03 | Comparar blocos visualmente | Frontend + Produto | V01-V02 | Diferenças ficam registradas | [ ] |
| V04 | Comparar comportamento dos blocos | Frontend + Produto | V01-V02 | Interações divergentes ficam registradas | [ ] |
| V05 | Registrar divergencias finais | Frontend + Produto | V03-V04 | Lista final fechada e priorizada | [ ] |

## 8. Limpeza do legado

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| L01 | Revisar sobras de codigo morto | Frontend | V05 | Nao ha vinculo funcional restante | [ ] |
| L02 | Remover chamadas obsoletas restantes | Frontend | L01 | Nao existe porta dos fundos para a tela antiga | [ ] |
| L03 | Validar runtime sem tela mock | Frontend | L02 | O browser sobe apenas no caminho oficial | [ ] |

## 9. Documentacao e encerramento

| ID | Tarefa | Responsavel | Dependencia | Criterio de aceite | Status |
|---|---|---|---|---|---|
| M01 | Atualizar contratos afetados | Frontend + Produto | V05 | Contratos refletem o codigo real | [ ] |
| M02 | Atualizar inventarios | Frontend | M01 | Inventarios batem com o runtime atual | [ ] |
| M03 | Atualizar roadmap | Frontend + Produto | M01 | Roadmap reflete o estado final da execucao | [ ] |
| M04 | Registrar remocoes e motivo | Frontend | L03 | Ha rastreabilidade do que foi removido | [ ] |
| M05 | Registrar estado final da tela | Frontend + Produto | M01-M04 | Existe um as-built claro para manutencao futura | [ ] |

## Protocolo de commit

1. Commit da base e contrato.
2. Commit do shell visual.
3. Commit dos blocos clinicos.
4. Commit do complemento de backend, se necessario.
5. Commit da validacao comparativa.
6. Commit da limpeza do legado.
7. Commit da documentacao final.

## Estado atual

- Base congelada: concluida.
- Legado mock removido: concluido.
- Contrato funcional: concluido.
- Auditoria bloco a bloco: em andamento.
- Shell visual: pendente.
- Blocos clinicos: pendente.
- Backend complementar: pendente.
- Validacao comparativa: pendente.
- Documentacao final: pendente.
