# Auditoria da Propagacao de Estado da Tela Principal

## Objetivo

Verificar como o estado do paciente e do tratamento se propaga entre:

- `frontend/app.js`
- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/js/modules/odontograma-v1.js`

## Fluxo observado

### 1. Fonte inicial do paciente

`frontend/app.js` aplica o paciente na ficha por meio de `fichaAplicarPaciente(item)`.

Nessa etapa:
- `fichaPacienteAtualId` e `fichaCodigoUltimoResolvido` sao atualizados;
- os campos da ficha recebem o paciente;
- o wrapper de tela chama `BranaPacienteEmUsoHeaderV1.sync(item)`.

### 2. Prontuario

`frontend/js/modules/prontuario.js`:

- resolve o paciente em uso por `getSources()`;
- expoe `obterPacienteEmUso()`;
- atualiza o seu proprio card por `renderEntry()` e `updateRenderedEntry()`;
- usa `safeSyncHeader()` para tentar sincronizar o cabeçalho.

### 3. Cabecalho do paciente em uso

`frontend/js/modules/paciente-em-uso-header.js`:

- resolve fontes de paciente por `getSources()`;
- normaliza o paciente antes de renderizar;
- renderiza o numero via campo `numero`;
- renderiza o nome via campo `nome`;
- salva o ultimo paciente visto em `lastPaciente`.

### 4. Odontograma

`frontend/js/modules/odontograma-v1.js`:

- guarda o paciente em `state.paciente`;
- sincroniza o header por `headerModule.sync(state.paciente)`;
- monta o seletor de tratamento e o resumo do odontograma;
- ao receber `fichaAplicarPaciente`, atualiza `state.paciente` e faz `refresh(true)`.

## Divergencia principal encontrada

A divergencia de contrato entre os modulos foi corrigida no caminho do paciente em uso:

- `app.js` passou a priorizar o nome legado de exibicao;
- `paciente-em-uso-header.js` passou a normalizar o paciente antes de renderizar;
- `odontograma-v1.js` e o seletor de paciente passaram a usar a mesma preferencia de nome;
- o numero do paciente ficou consistente no cabeçalho e no prontuario.

## Efeito colateral observado

Ainda existem listas auxiliares legadas que exibem nomes duplicados em outros blocos do aviso geral, mas isso nao interfere no paciente em uso nem no odontograma principal.

## Conclusao tecnica

A propagacao de estado agora esta unificada para o fluxo principal da tela:

- os eventos existem;
- os wrappers existem;
- a ficha, o prontuario, o cabecalho e o odontograma usam a mesma base de paciente.

## Recomendacao de correcao

Manter a mesma estrategia de normalizacao para qualquer novo bloco que consuma paciente em uso.

## Status da auditoria

- concluido em nivel de auditoria;
- pendencia de implementacao: apenas os blocos auxiliares legados ainda podem precisar de limpeza visual.
