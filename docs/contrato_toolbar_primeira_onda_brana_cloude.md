# Contrato tecnico - Primeira onda da toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Base documental:

- `docs/contrato_tecnico_toolbar_principal_brana_cloude.md`
- `docs/inventario_toolbar_principal_brana_cloude.md`
- `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md`

Status: documental apenas.

## 2. Objetivo

Fechar a primeira onda de implementacao da nova toolbar em um conjunto pequeno e controlado de botoes, para permitir validacao segura antes de qualquer expansao de escopo.

Este documento nao implementa nada.

Este documento nao autoriza a remocao da toolbar antiga.

## 3. Escopo da primeira onda

A primeira onda inclui apenas:

1. Novo paciente
2. Menu de pacientes
3. Novo tratamento
4. Agenda
5. Conta corrente

Esses cinco comandos formam o nucleo minimo da toolbar alvo.

## 4. Justificativa da selecao

Esses botoes foram escolhidos porque:

- representam o fluxo central da experiencia clinica;
- cobrem o ponto de entrada de paciente e tratamento;
- cobrem a navegacao diaria mais frequente;
- cobrem um ponto financeiro basico;
- permitem validar a toolbar sem incluir demasiadas dependencias logo no inicio.

## 5. Mapeamento funcional da primeira onda

### 5.1 Novo paciente

- Asset candidato: `cmd_novopac.bmp`
- Acao atual: `cadastro-novo-paciente`
- Handler atual: `fichaAbrirNovo()`
- Dependencias: paciente nao ativo, autenticacao, permissao do modulo

### 5.2 Menu de pacientes

- Asset candidato: `cmd_menupac.bmp`
- Acao atual: fluxo de menu de pacientes / gate de paciente
- Handler atual: `fichaMenuPacAbrir()` e helpers correlatos
- Dependencias: busca/seleca de paciente, paciente ativo, estado da ficha

### 5.3 Novo tratamento

- Asset candidato: `cmd_novotra.bmp`
- Acao atual: `tratamento-novo`
- Handler atual: `BranaNovoTratamentoPacienteGate`
- Dependencias: paciente em uso ou abertura do menu de pacientes, modais de tratamento

### 5.4 Agenda

- Asset candidato: `cmd_agepes.bmp`
- Acao atual: agenda diaria/semanal/proximo
- Handler atual: `agenda-dia`, `agenda-semana`, `agenda-proximo`
- Dependencias: contexto de agenda e permissao do modulo

### 5.5 Conta corrente

- Asset candidato: `CC.png` ou `cmd_ccpac.bmp` / `cmd_cccir.bmp`, conforme variante final
- Acao atual: conta corrente do paciente e do cirurgiao
- Handler atual: `financeiro-cc-paciente` e `financeiro-cc-cirurgiao`
- Dependencias: contexto financeiro, paciente ou cirurgiao selecionado, permissao do modulo

## 6. Regras de implementacao da primeira onda

1. A primeira onda deve ser implementada como componente isolado.
2. A toolbar antiga deve permanecer ativa enquanto a nova nao estiver validada.
3. Os botoes da primeira onda devem usar assets locais ja confirmados.
4. Botoes fora da primeira onda nao entram neste passo.
5. Nenhum codigo morto deve ser removido neste momento.
6. Nenhum handler antigo deve ser apagado antes da validacao.

## 7. Critérios de aceite da primeira onda

A primeira onda so pode ser considerada aceita quando:

- os cinco botoes estiverem visiveis;
- cada botao abrir a acao esperada;
- o paciente em uso continuar funcional;
- o menu de pacientes continuar abrindo;
- Novo tratamento continuar respeitando o gate de paciente;
- Agenda e Conta corrente continuarem acessiveis;
- nao houver erro de console relevante;
- a toolbar antiga ainda puder ser reativada.

## 8. Condicoes para passar para a segunda onda

Somente passar para a segunda onda se:

- a primeira onda estiver funcional;
- a validacao manual estiver registrada;
- a toolbar nova nao apresentar regressao visual relevante;
- o fallback estiver comprovadamente preservado;
- os testes basicos tiverem sido executados.

## 9. Fora de escopo

Ficam fora desta primeira onda:

- preferencias;
- historico;
- anamnese;
- odontograma;
- orcamento;
- backup;
- indices financeiros;
- configuracoes;
- ajuda;
- sair;
- botões de refinamento e segunda/quarta onda.

## 10. Conclusao

A primeira onda reduz risco e permite que a nova toolbar seja validada com o minimo de superficie funcional.

Se esta fase falhar, o sistema ainda deve permanecer recuperavel pela toolbar antiga.
