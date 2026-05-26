# Fase 2B - Convênios e Planos - Correção pontual do mojibake no ícone de telefones

## Objetivo da etapa
- Corrigir pontualmente o mojibake vermelho identificado na área de `Telefones` da modal de `Convênios e Planos`.
- Manter todo o restante do fluxo inalterado.

## Causa identificada pela auditoria
- A auditoria apontou que o mojibake parecia preexistente no literal usado pela função `convPlanConvenioPhoneRowV2()` em `frontend/app.js`.
- O texto afetado aparecia como `â˜Ž`, ocupando o lugar de um símbolo/ícone de telefone.

## Arquivo alterado
- `frontend/app.js`

## Função alterada
- `convPlanConvenioPhoneRowV2(prefix, label)`

## Literal corrigido
- Literal mojibake `â˜Ž` substituído por `&#9742;`.

## Confirmacao de correção pontual
- A correção foi pontual e restrita ao ícone/símbolo de telefone.
- Não houve refatoração.
- Não houve alteração de layout além do mínimo necessário para remover o mojibake identificado.

## O que não foi alterado
- `frontend/js/modules/convenios-planos.js`
- `frontend/index.html`
- backend, banco, endpoints, permissões
- `requestJson`, payload, salvamento, exclusão
- calendário, listas/contadores, modais funcionais
- pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores
- textos visíveis, labels, placeholders e mensagens, exceto o literal do ícone de telefone

## Confirmacao de blindagem textual/mojibake
- A blindagem textual/mojibake foi respeitada.
- A exceção foi aplicada somente ao literal pontual já identificado na auditoria.

## Teste manual obrigatório
1. Abrir o sistema.
2. Ir em `Cadastro > Convênios e Planos`.
3. Abrir/visualizar a modal onde aparece a seção `Telefones`.
4. Confirmar que o mojibake vermelho `â˜...` não aparece mais.
5. Confirmar que o ícone/símbolo de telefone aparece corretamente ou, no mínimo, sem mojibake.
6. Confirmar que a lista de Convênios continua carregando.
7. Confirmar que o contador de Convênios continua coerente.
8. Confirmar que a lista de Planos continua carregando.
9. Confirmar que o contador de Planos continua coerente.
10. Não testar salvar.
11. Não testar exclusão.

## Risco residual
- Existe risco residual baixo de a mesma codificação incorreta existir em outro ponto visual semelhante fora desta linha.
- Se isso ocorrer, a próxima correção deve ser tratada separadamente.

## Rollback mental
- Reverter apenas o literal da linha de telefones para a versão anterior, caso o símbolo exibido não seja o esperado.
- Nenhum outro fluxo deve ser revertido junto.
