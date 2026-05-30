# Decisão - Preferências / Configurações após validação de prefRenderCombosDados

## Contexto
- A crise de banco/cluster já foi estabilizada e o PostgreSQL 17 permanece como ambiente oficial.
- `prefRenderCombos`, `prefRenderCombosModelos` e `prefRenderCombosDados` foram validados de forma manual e conservadora.
- A frente de `Preferências / Configurações` chegou a um ponto estável após os recortes visuais/DOM já aprovados.
- Esta etapa é somente documental e não altera código nem banco.

## Estado consolidado
- A sincronização visual básica da modal permanece validada.
- `prefRenderCombos` continua validado.
- `prefRenderCombosModelos` continua validado.
- `prefRenderCombosDados` foi validado e consolidou o recorte da aba `Dados`.
- Não houve sinal nesta etapa de regressão funcional que justifique abrir um novo recorte automaticamente.

## Caminhos avaliados
- Caminho A: continuar em `Preferências / Configurações` com novo contrato profundo.
- Caminho B: pausar `Preferências / Configurações` e voltar para a matriz comparativa do próximo módulo.
- Caminho C: consolidar `Preferências / Configurações` como frente estável e exigir matriz comparativa antes de qualquer novo avanço.

## Decisão
- Decisão final: `DEC-C`.
- A frente `Preferências / Configurações` permanece consolidada como estável.
- Novo avanço nesta frente só deve ocorrer depois de uma matriz comparativa explícita, para evitar ampliar risco sem necessidade.

## Justificativa
- Os três recortes já validados cobrem a base visual/DOM que estava em pauta.
- Abrir novo contrato profundo imediatamente aumentaria a superfície de risco sem necessidade clara.
- A disciplina mais segura agora é manter a frente consolidada e exigir comparação com o próximo candidato antes de qualquer novo passo.
- Isso preserva a continuidade sem enfraquecer a blindagem que já foi construída.

## Próxima etapa recomendada
- Voltar para a matriz comparativa do próximo módulo ou frente candidata.
- Se `Preferências / Configurações` retornar mais adiante, reabrir apenas com um novo contrato explícito e bem delimitado.

## Onde testar futuramente
- Tela `Preferencias`.
- Modal.
- Abas e combos já validados.
- `Opcoes do Sistema` somente como referencia de nao-regressao, caso a frente volte a ser reavaliada.

## Confirmações de escopo
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- `permissoes/seeds` nao foram alteradas.
- A blindagem textual/mojibake foi respeitada.

## Registro para roadmap
- Decisao conservadora pos-validacao de `prefRenderCombosDados`, consolidando `Preferencias / Configuracoes` como frente estavel e exigindo matriz comparativa antes de qualquer novo avanco.
