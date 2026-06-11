# Correcao funcional leve dos campos do modal `Novo tratamento`

## 1. Objetivo da etapa

Remover o valor provisório/hardcoded do campo `Idade` no modal `Novo tratamento` e consolidar a regra leve de que, sem paciente selecionado e sem data de nascimento segura, o campo deve permanecer vazio.

## 2. Base documental usada

- `docs/contrato_tecnico_modulo_tratamento.md`
- `docs/contrato_layout_comportamento_tela_novo_tratamento.md`
- `docs/implementacao_visual_modal_novo_tratamento.md`
- `docs/validacao_visual_modal_novo_tratamento.md`
- `docs/contrato_funcional_campos_modal_novo_tratamento.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend/js/modules/novo-tratamento-modal.js`

## 3. Campos avaliados

- `Inicio`
- `Finalizacao`
- `Situacao`
- `Tabela principal`
- `Indice`
- `Cirurgiao responsavel`
- `Unidade de atendimento`
- `Observacoes`
- `Inclusao`
- `Alteracao`
- `Idade`
- `Arcada predominante`
- `Copiar intervencoes a realizar do tratamento anterior`
- `Ok`
- `Cancela`

## 4. Campos corrigidos

- `Idade`

## 5. Campos preservados sem alteração

- `Inicio`
- `Finalizacao`
- `Situacao`
- `Tabela principal`
- `Indice`
- `Cirurgiao responsavel`
- `Unidade de atendimento`
- `Observacoes`
- `Inclusao`
- `Alteracao`
- `Arcada predominante`
- `Copiar intervencoes a realizar do tratamento anterior`
- `Ok`
- `Cancela`

## 6. Regra aplicada ao campo Idade

O valor fixo `64a 6m` foi removido.

Regra atual:

- se nao houver paciente selecionado com data de nascimento segura, o campo `Idade` permanece vazio;
- nao ha inventario de idade nesta etapa;
- nao ha busca nova de paciente nesta etapa;
- nao ha tentativa de calculo ou persistencia.

## 7. Regra aplicada aos campos Inclusão e Alteração

Nesta etapa, os campos `Inclusao` e `Alteracao` permanecem vazios.

Regra aplicada:

- se nao houver tratamento salvo, nao inventar data/hora;
- manter o estado neutro/ vazio;
- deixar a origem futura para a persistencia real.

## 8. Confirmacao de que Ok continua sem gravacao

Confirmado.

- o botao `Ok` continua sem chamar API;
- o botao `Ok` continua sem persistir tratamento;
- o botao `Ok` pode apenas fechar a janela, como ja ocorria.

## 9. Confirmacao de que backend, banco e migrations nao foram alterados

Confirmado.

- nenhum arquivo de backend foi alterado;
- nenhum banco foi alterado;
- nenhuma migration foi criada;
- nenhuma seed foi criada.

## 10. Pendências que ainda dependem de confirmação do usuário

- `Situacao`
- `Cirurgiao responsavel`
- `Unidade de atendimento`
- `Arcada predominante`
- `Copiar intervencoes a realizar do tratamento anterior`
- possivel criterio final para `Idade` quando houver paciente selecionado
- possivel criterio final para `Inclusao` e `Alteracao` quando houver persistencia real

## 11. Proxima etapa recomendada

Proxima etapa recomendada:

- confirmacao do usuario sobre as regras dos campos pendentes ou, alternativamente, contrato da aba `Convenio` antes de qualquer nova correção funcional.
