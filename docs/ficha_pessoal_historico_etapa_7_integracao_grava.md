# Ficha Pessoal - Historico - Etapa 7 - integracao com Grava

## Objetivo
Integrar de forma conservadora a aba Historico com o botao geral Grava da Ficha Pessoal, usando apenas um caminho ja existente e sem criar arquitetura nova arriscada.

## Auditoria curta do caminho do Grava
- O botao `Grava` chama `fichaSalvarPaciente()` em `frontend/app.js`.
- `fichaSalvarPaciente()` usa `fichaPayloadAtual()` para montar o payload.
- O payload segue para `requestJson()` com `PUT` ou `POST` em `/cadastros/pacientes`.
- No backend, `_apply_paciente_payload()` grava `payload.extra` em `p.source_payload` via `_merge_extra_payload()`.
- O endpoint de retorno devolve `extra: dict(p.source_payload or {})`, permitindo reaplicar os dados ao reabrir o paciente.

## Arquivos auditados
- `frontend/app.js`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `backend/models/paciente.py`
- `backend/routes/cadastros_routes.py`

## Decisão técnica tomada
- A integração foi considerada segura sem alterar schema, migrations, seeds ou endpoints.
- O Histórico passou a ser serializado no envelope já existente `extra`, usando a chave `historico_aba`.
- O backend não precisou ser alterado, porque `source_payload` já existe no modelo `Paciente` e já é persistido pelo fluxo atual.

## Como o Histórico foi acoplado ao payload
- Antes do envio do paciente, o módulo do Histórico serializa as linhas locais para `extra.historico_aba`.
- Ao reaplicar o paciente, o módulo lê `extra.historico_aba` e reconstrói a grade local.
- O restante do `extra` continua intacto, mantendo compatibilidade com os campos já usados pela Ficha.

## Houve integração real com Grava
- Sim.
- A aba Historico agora participa do fluxo de gravação existente da Ficha Pessoal sem criar um caminho novo de backend.

## Confirmações
- Nao houve alteracao de backend.
- Nao houve alteracao de banco.
- Nao houve alteracao de endpoints, models, schema ou seeds.
- A blindagem textual/mojibake foi respeitada.

## Riscos observados
- O Histórico ainda depende da consistência do DOM local da grade.
- A persistência continua sendo um envelope JSON dentro de `source_payload`, o que e seguro para esta etapa, mas nao substitui um modelo dedicado futuro se a complexidade crescer.
- O comportamento dos botoes `Edita linha`, `Elimina linha` e `Propriedades da linha` continua propositalmente fora do fluxo final.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Inserir ou editar linhas localmente.
5. Usar `ENTER`/`ESC` se necessario.
6. Clicar no botao geral `Grava`.
7. Fechar e reabrir a Ficha Pessoal do mesmo paciente.
8. Confirmar se os dados do Historico permaneceram gravados.
9. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: Propriedades da linha funcional.
