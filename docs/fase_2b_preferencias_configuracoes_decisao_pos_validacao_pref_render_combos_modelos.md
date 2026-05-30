# Decisao - Preferencias / Configuracoes apos validacao de prefRenderCombosModelos

## 1. Contexto

- A crise de banco/cluster foi estabilizada.
- PostgreSQL 17 segue como cluster oficial.
- `prefRenderCombosModelos` foi validado manualmente.
- A frente `Preferencias / Configuracoes` permanece estavel e consolidada de forma conservadora.

## 2. Estado consolidado

- Sincronizacao visual basica da modal validada.
- `prefRenderCombos` validado.
- `prefRenderCombosModelos` validado.
- Helpers delegados ao modulo passivo existente.
- `frontend/app.js` segue mantendo os orquestradores.
- Carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissoes e seeds permanecem fora de alteracao.
- O contexto do PostgreSQL 17 e apenas resolvido, nao e alvo desta decisao.

## 3. Caminhos comparados

### Caminho A - Continuar em Preferencias / Configuracoes com novo recorte pequeno

- Beneficio: continua reduzindo o monolito em uma frente ja estabilizada.
- Risco: proximos blocos podem se aproximar de carregamento, payload, salvamento ou `sysOpt*`.
- Exigencia: contrato profundo antes de qualquer codigo.

### Caminho B - Pausar Preferencias / Configuracoes e voltar para matriz comparativa de proximo modulo

- Beneficio: reduz o risco de aprofundar demais em uma area sensivel.
- Risco: troca de contexto e necessidade de nova auditoria.
- Indicado se a frente ja tiver atingido limite conservador momentaneo.

### Caminho C - Manter Preferencias / Configuracoes como candidata, mas exigir contrato profundo antes de qualquer novo recorte

- Beneficio: preserva continuidade, mas sem codigo automatico.
- Risco: controlado.
- Recomendado quando ainda houver recortes visuais/DOM possiveis, mas com fronteiras explicitas.

## 4. Decisao conservadora

- DEC-C.

## 5. Justificativa

- `Preferencias / Configuracoes` ja absorveu os recortes visuais/DOM que estavam seguros neste momento.
- O ultimo recorte validado foi consolidado sem regressao.
- Ainda existem superficies que podem encostar em carregamento, payload, salvamento ou `sysOpt*`, entao nao e seguro abrir novo recorte automaticamente.
- Manter a frente como candidata, mas exigir contrato profundo antes de qualquer novo passo, preserva continuidade sem ampliar risco.

## 6. Proxima etapa recomendada

- Abrir contrato profundo antes de qualquer novo recorte.
- Se o proximo recorte parecer arriscado, reavaliar matriz comparativa antes de implementar qualquer coisa.
- Nenhum codigo deve ser alterado nesta etapa.

## 7. Onde testar futuramente

- Tela `Preferencias`.
- Modal.
- Abas.
- Combos.
- Fechamento/reabertura.
- `Opcoes do Sistema` apenas como nao-regressao.

## 8. Confirmacoes de escopo

- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- `.env` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- PostgreSQL 18 nao excluido/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## 9. Registro para roadmap

- Decisao conservadora apos a validacao de `prefRenderCombosModelos`: `DEC-C`.
- `Preferencias / Configuracoes` permanece como candidata consolidada.
- Proxima etapa recomendada: contrato profundo antes de qualquer novo recorte.
- Blindagem textual/mojibake respeitada.
