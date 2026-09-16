# Implementacao da primeira onda - Toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Base documental:

- `docs/contrato_tecnico_toolbar_principal_brana_cloude.md`
- `docs/inventario_toolbar_principal_brana_cloude.md`
- `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md`
- `docs/plano_execucao_toolbar_principal_brana_cloude.md`
- `docs/contrato_toolbar_primeira_onda_brana_cloude.md`
- `docs/checklist_execucao_toolbar_primeira_onda_brana_cloude.md`

Status: implementacao da primeira onda concluida.

## 2. Objetivo

Registrar a implementacao isolada da primeira onda da nova toolbar do Brana Cloude, mantendo fallback preservado e sem alterar backend, banco ou autenticacao.

## 3. Arquivos alterados

- `frontend/js/modules/toolbar-principal-primeira-onda.js`
- `frontend/index.html`

## 4. O que foi implementado

### 4.1 Nova toolbar isolada

Foi criado um modulo isolado que monta a primeira onda da toolbar no frontend, reaproveitando a area esquerda da toolbar principal.

### 4.2 Botoes da primeira onda

Os botoes implementados sao:

1. Novo paciente
2. Menu de pacientes
3. Novo tratamento
4. Agenda
5. Conta corrente

### 4.3 Assets utilizados

- `cmd_novopac.bmp`
- `cmd_menupac.bmp`
- `cmd_novotra.bmp`
- `cmd_agepes.bmp`
- `cmd_ccpac.bmp`

### 4.4 Estrategia de fallback

- a toolbar antiga nao foi removida;
- o modulo guarda a HTML anterior da area esquerda para restauracao futura;
- a troca foi feita apenas na area esquerda da toolbar, preservando a area direita e os IDs de usuario/sessao.

## 5. Comportamento esperado apos a implementacao

- Novo paciente abre o fluxo existente.
- Menu de pacientes abre o fluxo de selecao existente.
- Novo tratamento continua usando o gate de paciente em uso.
- Agenda abre o fluxo existente.
- Conta corrente abre o modulo existente.

## 6. Dependencias preservadas

- `user-email`
- `user-role`
- `user-license`
- `btn-open-users`
- `btn-sair`
- fluxo de login
- estado de paciente em uso
- permissao de usuario

## 7. Validacao realizada

- sintaxe do novo modulo verificada com `node --check`;
- validacao automatizada via Chrome local confirmou que a toolbar-left passou a renderizar os cinco botoes da primeira onda;
- a chamada direta de `executarAcaoMenu("conta-corrente")` retornou o footer esperado `Módulo Conta Corrente aberto.`;
- a toolbar nova reportou status `mounted: true` e `buttonCount: 5`.

## 8. Observacao sobre a validacao sem login

Na validacao automatizada sem sessao ativa, houve uma resposta `401 Unauthorized` ao acionar o modulo financeiro via navegador automatizado.

Isso nao foi tratado como regressao da toolbar em si, porque o comando chegou ao handler correto e a toolbar foi montada com sucesso. O alerta indica apenas que o ambiente de teste estava sem autenticao ativa.

## 9. Limites atuais

- ainda nao foi iniciada a segunda onda;
- a toolbar antiga continua presente como fallback;
- nao houve limpeza de codigo morto;
- a area direita da toolbar continua sob o desenho atual do shell;
- a validacao funcional completa em ambiente autenticado ainda deve ser feita no navegador do usuario.

## 10. Conclusao

A primeira onda da toolbar principal foi implementada de forma isolada e controlada.

O proximo passo e validar com sessao autenticada no navegador do usuario e, depois, decidir a expansao para a segunda onda.
