# Validacao da primeira onda - Toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Base documental:

- `docs/implementacao_toolbar_primeira_onda_brana_cloude.md`
- `docs/checklist_execucao_toolbar_primeira_onda_brana_cloude.md`

Status: validacao tecnica registrada.

## 2. Ambiente de validacao

- navegador automatizado via Chrome local;
- pagina: `http://127.0.0.1:8000/app`;
- validacao inicial sem sessao autenticada no navegador automatizado.

## 3. Resultados da validacao

### 3.1 Sintaxe

- `node --check frontend/js/modules/toolbar-principal-primeira-onda.js` -> OK

### 3.2 Renderizacao

- a area `.toolbar-left` passou a exibir 5 botoes;
- os botoes renderizados foram:
  - `toolbar-novo-paciente`
  - `toolbar-menu-pacientes`
  - `toolbar-novo-tratamento`
  - `toolbar-agenda`
  - `toolbar-conta-corrente`

### 3.3 Assets conferidos

- `cmd_novopac.bmp`
- `cmd_menupac.bmp`
- `cmd_novotra.bmp`
- `cmd_agepes.bmp`
- `cmd_ccpac.bmp`

### 3.4 Acao executada com sucesso

- chamada direta de `executarAcaoMenu("conta-corrente")`
- resultado observado no footer: `Módulo Conta Corrente aberto.`

### 3.5 Mensagem de rede observada

- houve `401 Unauthorized` na validacao automatizada sem sessao ativa;
- isso ocorreu por ausencia de login no ambiente de teste, nao por falha de montagem da toolbar.

### 3.6 Tentativa autenticada com perfil local

- foi localizada uma entrada `brana_token` no perfil local do Chrome do usuario;
- a injeção desse token na automação permitiu abrir a pagina, mas o backend respondeu com mensagem de sessao expirada;
- conclusao: a barra monta corretamente, porem a sessao local reaproveitada nao estava mais valida no servidor no momento do teste.

## 4. Conclusao da validacao

A primeira onda foi considerada tecnicamente montada e funcionalmente ligada aos handlers existentes.

O teste funcional completo em sessao autenticada ainda deve ser feito no navegador do usuario para fechar o aceite visual/operacional.
