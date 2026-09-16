# Matriz tecnica - Botoes alvo da toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Referencia funcional externa: toolbar principal do EasyDental observada em `Y:\EDS70`.

Natureza deste documento: matriz tecnica documental de botoes.

Status: documental apenas.

## 2. Objetivo

Definir a lista oficial de trabalho dos botoes da toolbar alvo, com mapeamento de funcao, icone, origem tecnica e nivel de confirmacao.

Este documento nao implementa nada.

Este documento nao remove nada.

Este documento existe para apoiar:

- a troca da toolbar por etapa;
- a validacao funcional do shell principal;
- a comparacao com a referencia EasyDental;
- a reducao de risco antes da codificacao;
- o fechamento de lacunas ainda abertas.

Observacao importante:

- nem todo botao da toolbar alvo tera um modulo real no Brana Cloude nesta fase;
- alguns botoes serao placeholders visuais, mantendo o lugar da referencia EasyDental sem acao operacional final;
- os placeholders devem ficar explicitamente documentados para evitar confusao entre "icone existente" e "fluxo implementado".

## 3. Fonte tecnica

### 3.1 Brana Cloude

- `frontend/index.html`
- `frontend/app.js`
- `assets/`
- `assets/easy/`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/js/modules/novo-tratamento-paciente-gate.js`

### 3.2 EasyDental

- `Y:\EDS70\EDS70.exe`
- `Y:\EDS70\Icones\cmd_*.bmp`

## 4. Toolbar atual do Brana Cloude

A toolbar atual visivel no topo do sistema possui, no minimo:

- Cenario anual
- Tabela de materiais
- Procedimentos / tabela de precos
- Conta corrente
- Dashboard

Esses botoes representam a toolbar atual, mas nao esgotam os comandos que o shell expoe por menu e atalho.

## 5. Matriz final fechada de 20 botoes

Esta e a matriz oficial de trabalho da toolbar principal.

Os itens de 1 a 12 sao fluxos reais ou equivalentes ja suportados pelo shell atual.

Os itens de 13 a 20 sao placeholders visuais documentados, mantidos para reproduzir a geometria da referencia sem prometer fluxo funcional completo nesta fase.

| Ordem | Botao / label | Asset candidato | Acao / comportamento | Status |
|---|---|---|---|---|
| 1 | Novo paciente | `cmd_novopac.bmp` | `cadastro-novo-paciente` -> `fichaAbrirNovo()` | confirmado |
| 2 | Menu de pacientes | `cmd_menupac.bmp` | `cadastro-abre-paciente` -> `fichaAbrirExistente()` / gate de paciente | confirmado |
| 3 | Novo tratamento | `cmd_novotra.bmp` | `tratamento-novo` -> `BranaNovoTratamentoPacienteGate` | confirmado |
| 4 | Agenda | `cmd_agepes.bmp` | `agenda-dia`, `agenda-semana` e `agenda-proximo` conforme contexto | confirmado |
| 5 | Conta corrente | `cmd_ccpac.bmp` | `conta-corrente` / `financeiro-cc-cirurgiao` -> `ccAbrir()` | confirmado |
| 6 | Odontograma | `cmd_odontograma.bmp` | abre o modulo de odontograma quando disponivel | confirmado |
| 7 | Editor de textos | `cmd_editor.bmp` | `ferr-editor-textos` -> abre o editor em aba unica | confirmado |
| 8 | Receita | `cmd_receita.bmp` | cria fluxo de receita do editor de textos | confirmado |
| 9 | Preferencias | `cmd_preferencias.bmp` | `config-preferencias` -> `prefAbrir()` | confirmado |
| 10 | Indices financeiros | `cmd_cnfindice.bmp` | `config-indices-financeiros` -> `indicesAbrir()` | confirmado |
| 11 | Configuracoes | `cmd_config.bmp` | `config-opcoes-sistema` / menus de configuracao | confirmado |
| 12 | Sobre / Ajuda | `cmd_help.bmp` | `sobre` -> abre modal institucional | confirmado |
| 13 | Tela | `cmd_tela.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 14 | Inserir | `cmd_insere.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 15 | Remover | `cmd_remove.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 16 | Copiar | `cmd_copia.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 17 | Filtrar | `cmd_filtra.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 18 | Procurar | `cmd_procura.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 19 | Detalhes | `cmd_detalhes.bmp` | placeholder visual; sem acao operacional final | placeholder |
| 20 | Rapido | `cmd_rapido.bmp` | placeholder visual; sem acao operacional final | placeholder |

Observacao de fechamento:

- se um desses botoes mudar de papel no futuro, a mudanca precisa ser refletida nesta matriz antes de ir para codigo;
- o status de placeholder nao invalida o layout, apenas evita prometer comportamento que ainda nao existe;
- a ordem acima e a ordem oficial de referencia para a primeira versao final da toolbar.

## 6. Mapeamento por funcao no Brana Cloude

### 6.1 Comandos que ja possuem handler claro

- `cadastro-novo-paciente`
- `cadastro-abre-paciente`
- `cadastro-fecha-paciente`
- `tratamento-novo`
- `tratamento-orcamento`
- `tratamento-imprime`
- `agenda-dia`
- `agenda-semana`
- `agenda-proximo`
- `agenda-contatos`
- `config-preferencias`
- `config-opcoes-sistema`
- `config-indices-financeiros`
- `cadastro-prestadores`
- `cadastro-unidades-atendimento`
- `financeiro-cc-paciente`
- `financeiro-cc-cirurgiao`

### 6.2 Comandos que ainda precisam de fechamento de semantica

- `cmd_tela.bmp`
- `cmd_insere.bmp`
- `cmd_remove.bmp`
- `cmd_copia.bmp`
- `cmd_filtra.bmp`
- `cmd_procura.bmp`
- `cmd_detalhes.bmp`
- `cmd_rapido.bmp`

## 7. Regras de implementacao futura

1. A toolbar nova deve usar a matriz final de 20 botoes acima.
2. Botoes marcados como placeholder devem manter o layout e o asset, mas sem fluxo falso.
3. Cada botao novo deve apontar para uma acao existente ou para um stub documentado.
4. Botoes administrativos devem respeitar permissao e contexto.
5. Nao misturar a troca visual com outras refatoracoes.

## 8. Criterios de validacao por botao

Para cada botao da toolbar alvo, validar:

- icone correto;
- rotulo correto;
- acao correta;
- permissao correta;
- estado habilitado/desabilitado;
- ausencia de erro no console;
- retorno esperado ao workspace;
- compatibilidade com paciente em uso quando aplicavel.

## 9. Ordem recomendada de entrada em producao

### Fase 1

- Novo paciente
- Menu de pacientes
- Novo tratamento
- Agenda
- Conta corrente

### Fase 2

- Preferencias
- Editor de textos
- Receita
- Odontograma
- Indices financeiros
- Configuracoes

### Fase 3

- Sobre / Ajuda
- Tela
- Inserir
- Remover
- Copiar
- Filtrar
- Procurar
- Detalhes
- Rapido

## 10. Conclusao

Esta matriz organiza a toolbar alvo em uma lista de trabalho segura.

A recomendacao tecnica permanece a mesma:

1. fechar a lista definitiva de botoes da primeira fase;
2. implementar a toolbar nova isoladamente;
3. validar;
4. remover a antiga somente no fim.
