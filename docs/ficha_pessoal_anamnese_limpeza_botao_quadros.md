# Ficha Pessoal - Limpeza inicial da aba Anamnese - remocao do botao Atualizar e quadros antigos

## Contexto
- A aba `Anamnese` ja havia recebido a base com nome do paciente e combo de questionarios.
- Nesta subetapa, o objetivo foi apenas limpar a tela antiga para deixar a aba com a parte superior pronta e uma area inferior vazia para evolucao futura.
- Nao houve mudanca de backend, banco, payload, salvamento ou permissao.

## Objetivo desta subetapa
- Remover o botao `Atualizar anamnese`.
- Remover os quadros antigos da parte inferior da aba:
  - `Perguntas de anamnese`
  - `Resposta / Observacao clinica`
  - mensagem/area de alerta antiga
- Manter apenas:
  - nome do paciente no topo;
  - combo `Questionario`;
  - espaco inferior vazio para futura lista.
- Nao alterar ainda a logica do combo.
- Nao alterar `Procura` nesta rodada.

## Escopo permitido
- Ajustar apenas `frontend/app.js`.
- Atualizar a documentacao da rodada.
- Atualizar o roadmap.
- Criar backup manual antes da alteracao.

## Escopo proibido
- backend.
- banco.
- schema, migrations, seeds, endpoints.
- `.env`.
- `requestJson`.
- payload.
- formato de salvamento.
- exclusao.
- permissoes.
- `Anotacoes`.
- `Historico`.
- `Editor de Textos`.
- `Agenda`.
- `Financeiro`.
- qualquer nova implementacao da lista de perguntas, Sim/Nao, campo complementar ou alerta clinico.

## Backup criado
- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_limpeza_botao_quadros/frontend/app.js`

## O que foi removido da tela
- O botao `Atualizar anamnese`.
- O quadro de `Perguntas de anamnese`.
- O quadro de `Resposta / Observacao clinica`.
- A mensagem antiga de alerta da area inferior.
- A aparencia em duas colunas da area inferior da aba.

## O que foi removido ou desativado por tras do botao
- O binding do botao de atualizacao.
- O codigo exclusivo que tentava salvar resposta da pergunta selecionada.
- O codigo que tentava imprimir a anamnese pela acao do botao.
- O fluxo antigo que lia e renderizava as respostas individuais na area inferior.
- O codigo que dependia dos quadros antigos para funcionar.

## O que foi mantido
- O nome do paciente no topo.
- O combo `Questionario`.
- O bloqueio para abrir `Anamnese` sem paciente valido.
- O bloqueio para abrir `Historico` sem paciente valido.
- A carga de questionarios pela fonte existente.
- A estrutura de `frontend/app.js` como fachada principal.
- O salvamento textual da anamnese sem alterar formato de persistencia.

## Confirmacoes
- `frontend/index.html` nao foi alterado.
- backend nao foi alterado.
- banco nao foi alterado.
- `requestJson` nao foi alterado.
- payload nao foi alterado.
- salvamento nao foi alterado.
- exclusao nao foi alterada.
- permissoes nao foram alteradas.
- nenhum modulo novo foi criado.

## Riscos remanescentes
- A aba `Anamnese` segue dependente de `frontend/app.js`.
- A combo continua sem evolucao funcional nova nesta subetapa.
- Qualquer avanço futuro para lista de perguntas, respostas ou alerta clinico precisa de novo contrato.

## Plano de retorno manual usando backup
- Se houver regressao visual ou funcional, restaurar `frontend/app.js` a partir do backup em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_limpeza_botao_quadros/frontend/app.js`.
- Depois disso, revalidar login, menus, `Ficha Pessoal`, `Anamnese` e `Historico`.

## Como testar manualmente
1. Abrir o sistema.
2. Fazer login.
3. Conferir que os menus principais respondem.
4. Abrir `Ficha Pessoal`.
5. Selecionar um paciente valido.
6. Entrar na aba `Anamnese`.
7. Confirmar que o topo mostra o nome do paciente.
8. Confirmar que o combo `Questionario` aparece.
9. Confirmar que a area inferior esta vazia, sem os quadros antigos.
10. Trocar o questionario e observar apenas o comportamento da combo.
11. Abrir `Historico` e confirmar que continua bloqueado sem paciente valido.
12. Voltar para outras abas e conferir que a navegacao segue estavel.

## Registro para roadmap
- Esta rodada registra a limpeza inicial da aba `Anamnese`, deixando apenas a base superior com paciente + questionario e um espaco inferior vazio para futura lista.
- O objetivo foi eliminar o botao antigo e os quadros inferiores sem mexer na fonte de dados, no formato de salvamento ou em outros modulos da ficha.
- O arquivo de implementacao desta rodada foi `frontend/app.js`.
