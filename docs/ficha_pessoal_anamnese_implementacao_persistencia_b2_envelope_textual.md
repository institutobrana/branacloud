# Ficha pessoal - Anamnese - Implementacao da persistencia B2 por envelope textual

## 1. Objetivo da etapa

Implementar a persistencia real da aba `Anamnese` da `Ficha Pessoal` seguindo o contrato `FICHA-ANAM-PERSIST-B2`, salvando e recarregando `Sim` / `Nao` + complemento por paciente/questionario/pergunta, sem criar backend novo, banco novo, migration nova ou endpoint novo.

## 2. Contexto

Esta etapa nasce depois da modularizacao visual da aba `Anamnese` e da validacao da confirmacao local sem salvamento.

O foco agora e guardar o estado real das respostas, reaproveitando a estrutura atual do Brana Cloud e o endpoint de respostas ja existente.

## 3. Decisao usada

**FICHA-ANAM-PERSIST-B2**

Motivo resumido:

- o Brana Cloud ja possui rotas e modelos de anamnese;
- a persistencia atual continua textual;
- a evolucao mais segura e usar um envelope textual estruturado;
- a equivalencia 1:1 com o legado EasyDental fica como contrato futuro separado.

## 4. Arquivos alterados

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `docs/ficha_pessoal_anamnese_implementacao_persistencia_b2_envelope_textual.md`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Backup criado

Backup manual criado antes da alteracao:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_persistencia_b2_envelope_textual/`

Arquivo salvo no backup:

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

## 6. Endpoint reaproveitado

O endpoint atual foi reaproveitado sem alteracao de contrato externo:

- `GET /anamnese/pacientes/{paciente_id}/respostas?questionario_id={id}`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

O `GET` retorna as perguntas do questionario selecionado junto com a resposta salva.
O `PUT` continua recebendo `pergunta_id` e `resposta`, mas agora a resposta pode ser um envelope textual JSON stringificado.

## 7. Formato do envelope textual

Foi adotado um envelope textual JSON stringificado, compativel com o campo textual atual do endpoint.

Campos do envelope:

- `versao`
- `paciente_id`
- `questionario_id`
- `questionario_nome`
- `pergunta_id`
- `pergunta_texto`
- `resposta`
- `complemento`

Exemplo conceitual:

```json
{
  "versao": 2,
  "paciente_id": 123,
  "questionario_id": 5,
  "questionario_nome": "Principal",
  "pergunta_id": 77,
  "pergunta_texto": "Esta atualmente sob tratamento medico?",
  "resposta": "sim",
  "complemento": "Tratamento para pressao alta"
}
```

## 8. Como salva Sim / Nao

- Ao marcar `Sim` ou `Nao`, o estado local registra a resposta da pergunta.
- No salvamento, cada pergunta alterada e serializada em um envelope JSON stringificado.
- O valor de `resposta` no envelope recebe `sim` ou `nao`.
- Se a pergunta ficar sem resposta e sem complemento, o sistema envia string vazia para permitir limpeza da resposta salva.

## 9. Como salva complemento

- O complemento digitado fica no estado local da pergunta.
- Ao salvar, ele vai para o campo `complemento` do envelope.
- Se existir complemento sem resposta marcada, o envelope ainda pode ser salvo, preservando a observacao.

## 10. Como separa paciente / questionario / pergunta

- O paciente fica separado pelo parametro da rota `paciente_id`.
- O questionario fica separado por `questionario_id` no envelope e no `GET` de carregamento.
- Cada pergunta fica separada por `pergunta_id`.
- O salvamento ocorre pergunta a pergunta, sem misturar um questionario com outro.

## 11. Como recarrega respostas

- Ao abrir um paciente ou trocar de questionario, o sistema consulta `GET /anamnese/pacientes/{paciente_id}/respostas?questionario_id={id}`.
- O frontend interpreta a resposta salva.
- Se vier envelope JSON, ele recupera `Sim`, `Nao` e complemento.
- Se vier texto antigo simples, o sistema tenta compatibilizar sem apagar silenciosamente.
- O estado local e o estado salvo sao sincronizados ao carregar.

## 12. Comportamento do botao Sim no modal de confirmacao

- O botao `Sim` passa a acionar a rotina segura de salvamento B2.
- Se o salvamento concluir com sucesso, a acao pendente prossegue.
- Se o salvamento falhar, o usuario permanece na aba atual e e avisado.

## 13. Comportamento apos salvar com sucesso

- O estado alterado e limpo.
- O `dirty` local e zerado.
- O estado salvo passa a refletir o estado atual da tela.
- O formulario continua carregado com as respostas atuais.

## 14. Comportamento em erro de salvamento

- O estado alterado permanece.
- O usuario recebe aviso de erro.
- Nada e apagado silenciosamente.
- A tela continua pronta para nova tentativa de salvamento.

## 15. Compatibilidade com dados antigos

- Se a resposta antiga for apenas `sim` ou `nao`, o sistema reconcilia isso como resposta simples.
- Se existir texto antigo nao reconhecido, ele nao e apagado silenciosamente.
- O sistema tenta preservar o conteudo em complemento/texto compativel para nao perder informacao antiga.

## 16. Confirmacoes de nao alteracao

- `frontend/app.js` nao foi alterado nesta etapa.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` fora da aba Anamnese nao foi alterado.
- backend nao foi alterado.
- banco nao foi alterado.
- schema nao foi alterado.
- migrations nao foram alteradas.
- seeds nao foram alteradas.
- endpoints nao foram alterados.
- `.env` nao foi alterado.
- `requestJson` nao foi alterado.
- payload externo nao foi alterado.
- formato externo do endpoint nao foi alterado.
- exclusao nao foi alterada.
- permissoes nao foram alteradas.
- `Procura...` nao foi quebrado.
- a confirmacao local continua funcionando.

## 17. Riscos residuais

- O salvamento ainda depende de chamadas por pergunta e pode haver falha parcial se a conexao cair no meio do processo.
- A equivalencia 1:1 com o legado EasyDental ainda nao foi provada integralmente.
- O envelope textual e compativel com a estrutura atual, mas e uma representacao intermediaria; uma evolucao futura para schema mais explicito pode ser necessaria.

## 18. Onde testar no sistema

1. Abrir o sistema.
2. Fazer login.
3. Abrir `Ficha Pessoal`.
4. Selecionar um paciente salvo.
5. Entrar em `Anamnese`.
6. Selecionar um questionario.
7. Marcar `Sim` em uma pergunta.
8. Marcar `Nao` em outra.
9. Preencher complemento em uma ou mais perguntas.
10. Salvar pela acao disponivel da Anamnese ou pelo fluxo definido pelo sistema.
11. Confirmar que o estado alterado foi limpo apos salvar.
12. Sair da aba e voltar.
13. Confirmar que `Sim`, `Nao` e complementos foram recarregados.
14. Trocar para outro questionario.
15. Confirmar que respostas do questionario anterior nao aparecem indevidamente no outro.
16. Salvar respostas no segundo questionario.
17. Voltar ao primeiro questionario e confirmar que suas respostas continuam corretas.
18. Trocar de paciente.
19. Confirmar que respostas do paciente anterior nao aparecem no novo paciente.
20. Voltar ao paciente original e confirmar que respostas permanecem.
21. Alterar uma resposta salva.
22. Tentar sair sem salvar.
23. Confirmar que o modal de alteracoes aparece.
24. Clicar Cancelar e confirmar que mantem alteracoes.
25. Tentar sair novamente.
26. Clicar Sim.
27. Confirmar se o Sim salva e prossegue.
28. Clicar Nao em outro teste e confirmar que descarta alteracao local.
29. Confirmar que `Procura...`, `Novo`, `Fechar`, `Sair`, navegacao entre pacientes e troca de questionario continuam protegidos.
30. Confirmar que menus e botoes continuam respondendo apos login.
31. Confirmar que nao houve regressao global.

## 19. Conclusao

A implementacao B2 usa o endpoint atual com um envelope textual JSON stringificado, salva `Sim` / `Nao` + complemento por paciente/questionario/pergunta, recarrega o estado ao abrir o paciente ou trocar questionario e preserva a confirmacao local.

O backend, o banco e os endpoints permaneceram inalterados.

## 20. Registro para roadmap

Este documento registra:

- a implementacao da persistencia B2 por envelope textual;
- o reaproveitamento do endpoint atual;
- a ausencia de backend novo, banco novo, migration nova e endpoint novo;
- o estado da confirmacao local apos integracao;
- a pendencia futura de persistencia estruturada 1:1 EasyDental, se ainda vier a ser necessaria;
- a confirmacao de que nenhum codigo, backend, banco, payload, `requestJson` ou contrato externo foi alterado fora do escopo desta etapa.
