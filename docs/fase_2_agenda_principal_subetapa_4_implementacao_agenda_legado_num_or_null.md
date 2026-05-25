# Fase 2 - Agenda principal - Subetapa 4 - Implementação mínima do helper puro agendaLegadoNumOrNull e validação manual do fluxo de agenda legado

## 1. Título da etapa
Implementação mínima do helper puro `agendaLegadoNumOrNull` e validação manual do fluxo de agenda legado.

## 2. Objetivo
Executar a primeira extração mínima da `Agenda principal`, movendo apenas o helper puro `agendaLegadoNumOrNull` para um módulo JS adequado, sem alterar a semântica, sem tocar em backend e sem mexer em qualquer outra regra da agenda.

## 3. Escopo
Escopo desta subetapa:

- extrair somente `agendaLegadoNumOrNull`;
- manter exatamente a mesma semântica atual;
- expor o helper para uso global antes de `frontend/app.js`;
- remover apenas a definição local duplicada em `frontend/app.js`;
- registrar a alteração documental no roadmap;
- validar sintaticamente os arquivos JS alterados;
- preparar o plano de teste manual do usuario.

## 4. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 5. Resumo das Subetapas 1, 2 e 3
Subetapa 1:
- definiu o contrato funcional inicial;
- registrou fronteiras com agenda do dia, semana, proximo agendado, avisos, configuracao de agendas, recorrencia, Google Calendar e agenda legado;
- deixou `Agenda de contatos` fora do recorte.

Subetapa 2:
- mapeou os fluxos de abertura;
- documentou os modos dia/semana, proximo agendado, quadro de avisos e configuracao de agendas;
- registrou a fronteira com agenda legado e a consolidacao de agenda contatos.

Subetapa 3:
- reavaliou os candidatos a helper puro;
- escolheu `agendaLegadoNumOrNull` como primeiro helper para futura implementacao;
- registrou a fronteira exata e os riscos.

## 6. Helper extraido
Helper extraido:

- `agendaLegadoNumOrNull`

Semantica preservada:
- `Number(value)` como conversao inicial;
- `Math.trunc(n)` quando o valor e finito;
- `null` quando o valor nao e finito.

## 7. Arquivo de origem
Arquivo de origem da definicao removida:

- `frontend/app.js`

Localizacao aproximada anterior:

- por volta da linha `7679` no bloco de helpers de `agendaLegado`.

## 8. Arquivo de destino
Arquivo de destino criado para o helper:

- `frontend/js/modules/agenda-principal-legado-utils.js`

Padrao de exposicao:
- modulo IIFE;
- exportacao em `window.BranaAgendaPrincipalLegadoUtils`;
- exposicao direta de `window.agendaLegadoNumOrNull` para manter a compatibilidade com as chamadas ja existentes em `frontend/app.js`.

## 9. Pontos de uso preservados
Pontos de uso mantidos sem alteracao:

- `agendaLegadoModalPayload` em `frontend/app.js` usa `agendaLegadoNumOrNull` para `tipo` e `status`;
- o helper continua sendo chamado exatamente nos mesmos pontos;
- nao houve mudanca na assinatura;
- nao houve mudanca na ordem de execucao dos fluxos;
- nao houve mudanca na semantica de chamada.

## 10. Semantica preservada
Foi preservado o comportamento original:

- valor numerico valido continua virando numero truncado;
- strings numericas continuam sendo convertidas pela mesma regra;
- valores vazios ou nao finitos continuam retornando `null`;
- nao houve ajuste de regra;
- nao houve ajuste visual;
- nao houve ajuste textual.

## 11. Arquivos alterados
Arquivos alterados nesta subetapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_4_implementacao_agenda_legado_num_or_null.md`
- `docs/11_roadmap_desenvolvimento.md`

## 12. Arquivos nao alterados
Nao foram alterados:

- backend;
- banco;
- schema;
- migrations;
- seeds;
- endpoints;
- permissões;
- `frontend/js/modules` fora do novo arquivo criado;
- `Agenda de contatos`;
- salvamento;
- edicao;
- exclusao;
- modal;
- renderizacao;
- recorrencia;
- Google Calendar.

## 13. Riscos tecnicos
Riscos tecnicos identificados:

- quebrar a compatibilidade se o script novo nao carregar antes de `frontend/app.js`;
- alterar a semantica de `null` versus numero truncado;
- alterar a passagem de `tipo` e `status` no payload da agenda legado;
- inserir dependencia inesperada em outro ponto do carregamento do HTML;
- regredir o fluxo de abertura da agenda legado se o helper nao estiver disponivel antes do `app.js`.

Mitigacao aplicada:
- o novo script foi inserido antes de `frontend/app.js`;
- o helper foi mantido com o mesmo nome global esperada pelas chamadas existentes;
- a definicao local duplicada foi removida apenas depois da exposicao do helper no modulo novo.

## 14. Validacao tecnica executada
Validacao tecnica executada nesta subetapa:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`
- conferencia dos pontos de uso de `agendaLegadoNumOrNull` em `frontend/app.js`
- conferencia do carregamento do novo script antes de `frontend/app.js` em `frontend/index.html`

Resultado:
- sem erros de sintaxe;
- sem alteracao dos pontos de uso;
- sem mudanca de semantica documentada.

## 15. Plano de teste manual para o usuario
Depois da entrega, o usuario deve testar:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Criar um agendamento na agenda legado com campos numericos relacionados a tipo/status, se esses campos estiverem disponiveis.
4. Salvar com valores preenchidos.
5. Editar o mesmo agendamento.
6. Salvar novamente.
7. Testar tambem salvar com valores vazios nesses campos, quando possivel.
8. Confirmar que a `Agenda do dia` continua abrindo.
9. Confirmar que a `Agenda da semana` continua abrindo.
10. Confirmar que o `proximo agendado` continua aparecendo sem erro.
11. Verificar se nao aparece erro no console do navegador.

## 16. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- alterar qualquer outro helper;
- extrair outro candidato;
- alterar salvamento;
- alterar edicao;
- alterar exclusao;
- alterar modal;
- alterar renderizacao;
- alterar recorrencia;
- alterar Google Calendar;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper extraido.

## 17. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 5 - Validacao manual da extracao do helper agendaLegadoNumOrNull e revisao do primeiro impacto funcional`

## 18. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao de textos visiveis, labels, placeholders, acentos ou mojibake.

Se houver texto estranho ou corrompido em arquivos lidos, isso deve ser apenas registrado como pendencia futura, sem qualquer correcao nesta etapa.

## 19. Registro para roadmap
- A primeira extracao minima de helper puro foi concluida.
- O helper extraido foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O fluxo de agenda legado continua funcional na semantica documentada.
- O proximo passo recomendado e a validacao manual do usuario.

## 20. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_4_implementacao_agenda_legado_num_or_null.md`
- `docs/11_roadmap_desenvolvimento.md`
