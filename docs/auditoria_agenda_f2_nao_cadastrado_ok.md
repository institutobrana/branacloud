# Brana Cloude — Agenda — F2.AUDIT-R1

## Escopo e resultado

Auditoria read-only dos contratos de Situação, pessoa não cadastrada e habilitação do `Ok`. Nenhum código funcional, CSS, backend, teste, Vite ou banco foi alterado nesta rodada. Não foram executados POST, PUT, PATCH ou DELETE.

## Ambiente

- Vite HTTPS existente reutilizado na porta 5173, sem reinício.
- `https://localhost:5173/app/`: HTTP 200.
- `https://192.168.3.41:5173/app/`: HTTP 200.
- `VITE_RUNTIME_FROZEN = SIM`.

## Situação

O contrato informado e preservado é `status = 0` sem texto; não foi criado fallback nem label artificial.

No React atual, `createEditDraft` normaliza `raw.status` para `String(...)`. As opções do Select também usam valores string e labels derivados do catálogo. A fonte do catálogo é `GET /agenda-legado/status-agendamento`, alimentada por `ItemAuxiliar`; o backend retorna campos estruturados como `id`, `codigo`, `descricao`, `ordem` e `valor_int`.

O runtime observado anteriormente confirmou status zero visualmente vazio. A comprovação runtime de pelo menos três eventos reais com status diferente de zero não foi repetida nesta rodada; portanto `SITUACAO_CONTRACT = INCOMPLETO` para o fechamento formal solicitado, embora a cadeia number→string esteja comprovada por código.

## Pessoa não cadastrada — contrato encontrado no código legado

O frontend legado (`frontend/app.js`) implementa:

1. Nome de paciente não encontrado aciona o diálogo `agendaLegadoAbrirDialogNomeNaoEncontrado`.
2. O texto é `O paciente <nome> não foi encontrado no cadastro de pacientes.`.
3. As opções são `Agendá-lo como um novo paciente` (`novo`) e `Procurá-lo no cadastro de pacientes` (`buscar`).
4. `buscar` abre o Menu de pacientes; `novo` confirma o nome livre no draft, sem vincular paciente.
5. O payload usa `nro_pac = null` quando não há paciente vinculado e preserva `nome`, telefones, tipos de telefone, motivo, status, prestador e unidade.

Esse mapeamento é estático. A sessão legítima do frontend legado estava expirada e não foi possível obter runtime sem intervenção normal de login. Não houve bypass, token inventado ou impressão de credencial. Assim, o fluxo não cadastrado não está fechado em runtime.

O botão `...` do legado chama o Menu de pacientes; isso é distinto do diálogo de nome não encontrado. O significado operacional do botão `Novo...` do Menu não foi homologado em runtime nesta rodada.

## Habilitação e persistência

No React atual, o botão principal `Ok` de `AgendaEventModal` está explicitamente renderizado como `disabled`, sem regra de habilitação.

No legado, o botão `Ok` é acionável e a validação ocorre no handler `agendaLegadoSalvarModal`, que valida horário, resolve o nome/paciente, valida data/hora, escala e conflitos antes da persistência. A resolução de nome pode interromper o salvamento para abrir o diálogo de pessoa não cadastrada ou o Menu de pacientes.

Endpoints identificados no backend:

- CREATE: `POST /agenda-legado`.
- UPDATE: `PUT /agenda-legado/{item_id}`.
- DELETE: `DELETE /agenda-legado/{item_id}`.

O payload aceita `nro_pac` nulo e campos textuais/telefônicos, mas a matriz completa de habilitação do `Ok` e o comportamento runtime para paciente cadastrado, não cadastrado e compromisso dependem da sessão legítima do legado e não foram declarados como comprovados.

## Veredito

- `SITUACAO_CONTRACT = INCOMPLETO` por falta de runtime R1 com três status não zero.
- `NON_REGISTERED_PATIENT_CONTRACT = INCOMPLETO` por sessão legada expirada e ausência de reprodução runtime.
- `OK_ENABLEMENT_CONTRACT = INCOMPLETO`.
- `PERSISTENCE_CONTRACT = PARCIALMENTE MAPEADO; não testado com escrita`.
- `F2_READY_FOR_IMPLEMENTATION = NÃO`.
- `AGENDA — F2.AUDIT-R1 = INCOMPLETA`.

Próxima ação segura: autenticar manualmente o frontend legado pelo fluxo normal e repetir apenas as provas runtime pendentes, sem alterar código e sem salvar agendamento real.

## F2.AUDIT-R2 — fechamento runtime parcial

A sessão legada foi encontrada autenticada e a Agenda abriu. Um evento real foi aberto sem persistência. O catálogo runtime de Situação apresentou 15 opções textuais, com valores string (`8`, `6`, `15`, `5`, `2`, `7`, `1`, `12`, `10`, `3`, `4`, `11`, `14`, `13`, `9`). O evento aberto nesta execução possuía Situação vazia; não foi usado como prova de status não-zero.

O botão `Ok` do editor legado não foi acionado, pois o fluxo faria persistência potencial. Também não foi possível concluir, nesta execução, a reprodução controlada de um novo agendamento com nome não cadastrado: a interface exibida não ofereceu um caminho seguro e inequívoco para abrir esse fluxo sem risco de escrita. Nenhum POST, PUT, PATCH ou DELETE foi executado.

Resultado: `SITUACAO_CONTRACT = INCOMPLETO`, `NON_REGISTERED_PATIENT_CONTRACT = INCOMPLETO` e `OK_ENABLEMENT_CONTRACT = INCOMPLETO`. A implementação React permanece intocada e `F2_READY_FOR_IMPLEMENTATION = NÃO`.

## F2.AUDIT-R3 — comparação dirigida sem write

O legado autenticado abriu o agendamento de referência em `03/09/2026` às `07:45`, identificado no DOM como `data-id = 53440`, com Situação `REAVALIAO` e valor `13`.

No React HTTPS, o evento acessado na mesma data apresentou o Select com o catálogo textual correto, incluindo `REAVALIAÇÃO`, mas o campo fechado renderizou visualmente `13`. O valor interno observado no controle foi `13`, e o valor da opção correspondente é `13`. Isso confirma uma divergência visual entre valor selecionado e label renderizado no React.

Entretanto, o DOM React não expôs o ID do evento. Além disso, a abertura apresentou horário `07:40` e nome divergente do texto do botão usado como alvo, enquanto o legado apresentou `07:45`. Portanto, a identidade do mesmo registro não pôde ser provada com segurança por ID/data/hora/prestador/unidade; o achado é evidência de bug potencial, não uma conclusão causal final.

O status zero continua normal e vazio. Não foram executados writes. O fluxo completo de pessoa não cadastrada e a matriz de habilitação do `Ok` continuam pendentes; não foi acionado o `Ok` principal.

Resultado: `SITUACAO_CONTRACT = INCOMPLETO`, `NON_REGISTERED_PATIENT_CONTRACT = INCOMPLETO`, `OK_ENABLEMENT_CONTRACT = INCOMPLETO` e `F2_READY_FOR_IMPLEMENTATION = NÃO`. Nenhum código funcional foi alterado.

## F2.STATUS-R4 — causa do raw value no Select

O registro de referência foi comparado por data, hora, paciente e contexto selecionado: `03/09/2026`, `07:45`, Walter Jurandir Poceiro Filho, prestador Gleisson Tel e unidade Instituto Brana - Odontologia. No legado, o registro `53440` apresentou status `13` / `REAVALIAO`. No React, o evento correspondente abriu em `03/09/2026` às `07:45`, com o mesmo paciente, e o campo fechado de Situação não resolveu o label; o dropdown, entretanto, continha `REAVALIAÇÃO`.

A causa técnica é comprovada pela cadeia de transformação: o backend fornece itens de catálogo com `id`, `codigo`, `descricao` e `valor_int`; o componente React constrói `statusOptions` usando `String(item.value ?? item.id)`, ignorando `valor_int`. O evento carrega o código/status `13`, enquanto o valor efetivo da opção pode ser o `id` da linha auxiliar, não o código `valor_int`. Sem correspondência entre `Select.value` e `option.value`, o Ant Design conserva o valor bruto em vez de exibir o label. A correção mínima proposta é usar o campo canônico do catálogo (`valor_int`, ou uma normalização equivalente comprovada) ao construir as options, preservando `status = 0` vazio. A correção não foi aplicada nesta etapa.

O segundo evento React testado, `03/09/2026` às `07:40`, Aparecida Altina Alves Freitas, também não exibiu texto no campo fechado; porém seu status bruto não foi exposto no DOM. Não foi usado como prova independente de status não-zero.

Nenhum write foi executado. `SITUACAO_READY_FOR_FIX = SIM` apenas para a frente do Select; a auditoria global F2 permanece incompleta porque pessoa não cadastrada e habilitação do Ok continuam pendentes.

## F2.AUDIT-R8 — fechamento dos contratos finais

R8 confirmou em runtime legado, sem persistência, a seleção efetiva de paciente cadastrado. O novo editor iniciou com Ok habilitado; após Tipo Paciente, a abertura do Menu e a seleção de Jossicleide Florentino Guerra (ID 1621), o nome e o telefone foram carregados no editor e o Ok permaneceu habilitado. O editor foi cancelado sem write.

O diálogo de nome não encontrado possui somente Ok e Cancela; não possui X próprio. A ausência do X é N/A, não pendência. Cancela preserva o editor e o draft. O contrato de edição não cadastrado é derivável do código/modelo: AgendaPayload e PUT aceitam nro_pac nullable, nome textual e telefones textuais.

O código legado não atribui disabled dinamicamente ao Ok; as validações ocorrem no clique, antes da montagem do payload e do POST/PUT. Com as evidências anteriores de Paciente, Não cadastrado e Compromisso, a regra é ALWAYS_ENABLED_WHILE_EDITOR_IS_OPEN.

Não houve POST, PUT, PATCH ou DELETE. A documentação desta rodada fecha a auditoria R8; a implementação funcional React permanece como etapa posterior autorizada.

## F2.STATUS-FIX-R5 — correção aplicada e runtime pendente

Foi aplicada somente a correção do construtor de options de Situação em `AgendaEventModal.jsx`: o valor da option passou a usar `valor_int`, com valor `0` excluído do catálogo visual para preservar o contrato de status zero sem texto. Foi adicionado teste contratual diferenciando `valor_int = 13` de `id` auxiliar.

Validações: 8 testes focados passaram; `npm run build` terminou com exit code 0, com apenas o warning conhecido de chunk grande. O Vite precisou ser iniciado porque não havia listener válido na porta 5173; depois iniciou em HTTPS nas URLs Local e Network.

O runtime AFTER do evento `03/09/2026 07:45 / ID 53440` não foi fechado: após o reload a sessão React não carregou esse registro de forma determinística para reabertura, e não foi usado evento substituto para declarar sucesso. Portanto `RUNTIME_AFTER = INCOMPLETO` e `AGENDA — F2.STATUS-FIX-R5 = INCOMPLETA` até confirmação visual do label `REAVALIAÇÃO` no evento exato.

## F2.AUDIT-R6 — fechamento parcial em runtime

Com a sessão legada autenticada, foi aberto um novo agendamento sem salvar. O preenchimento do nome artificial `TESTE PACIENTE NAO CADASTRADO R6` e a saída do campo abriram, antes de qualquer write, o diálogo com o texto `O paciente TESTE PACIENTE NAO CADASTRADO R6 não foi encontrado no cadastro de pacientes.` e as opções `Agendá-lo como um novo paciente` e `Procurá-lo no cadastro de pacientes`. O default/foco observado foi a opção `novo`.

Ao confirmar `novo`, nenhum modal adicional foi aberto: o próprio editor permaneceu, o nome ficou no draft, `nro_pac` permaneceu nulo e não houve criação imediata de paciente. Isso confirma semanticamente um agendamento textual sem vínculo cadastral. Ao repetir com `buscar`, o Menu de pacientes foi aberto e carregado, confirmando que esse ramo só é acionado após a escolha explícita.

O botão `Ok` legado foi observado habilitado no novo agendamento inicial, após seleção de Compromisso e após preenchimento de Assunto. O código mostra que a validação adicional ocorre em `agendaLegadoSalvarModal`: horário, resolução do nome, data/hora, escala e conflitos são validados antes do POST/PUT. O `Ok` não foi acionado.

Ainda não foram fechados runtime: matriz completa de paciente cadastrado, Cancelar/X do diálogo, edit mode de registro não cadastrado e todos os campos/condições da habilitação para os três modos. Nenhum POST, PUT, PATCH ou DELETE foi executado.

Resultado: `NON_REGISTERED_PATIENT_CONTRACT = PARCIALMENTE COMPROVADO`, `OK_ENABLEMENT_CONTRACT = PARCIALMENTE COMPROVADO`, `PERSISTENCE_CONTRACT = PARCIALMENTE MAPEADO` e `F2_READY_FOR_IMPLEMENTATION = NÃO`.
