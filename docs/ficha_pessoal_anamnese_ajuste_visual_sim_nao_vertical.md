# Ficha Pessoal - Ajuste visual da Anamnese - Sim e Nao em coluna vertical

## Contexto

- A aba `Anamnese` da `Ficha Pessoal` ja havia recebido a lista visual de perguntas do questionario selecionado.
- O teste manual anterior passou parcialmente: questionario apareceu, a lista inferior mudou ao trocar a combo, as perguntas apareceram, os controles `Sim` / `Nao` apareceram e o campo de complemento apareceu.
- O ponto visual restante era a organizacao dos controles `Sim` e `Nao`, que no Brana Cloud apareciam lado a lado.
- O padrao desejado, com base no print do EasyDental, e manter `Sim` acima de `Nao` na coluna esquerda da pergunta.

## Objetivo desta subetapa

- Fazer somente o ajuste visual da area inferior da aba `Anamnese`.
- Organizar `Sim` e `Nao` em coluna vertical.
- Aproximar a aparencia do padrao visual do EasyDental.
- Manter a implementacao sem salvamento e sem alteracao funcional.

## Resultado do teste manual anterior

- O usuario informou que a tela passou parcialmente.
- O questionario apareceu corretamente.
- Ao trocar a tabela/questionario na combo, a lista inferior tambem mudou.
- As perguntas apareceram.
- Os controles `Sim` / `Nao` apareceram.
- O campo de complemento apareceu.
- Nao houve salvamento, como planejado.

## Arquivos alterados

- [`frontend/js/modules/ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)
- [`docs/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\docs\ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\docs\11_roadmap_desenvolvimento.md)

## Backup criado

- Pasta: `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical/`
- Arquivo incluido: `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

## O que foi ajustado visualmente

- Os controles `Sim` e `Nao` passaram a ficar um abaixo do outro.
- A caixa de complemento ficou posicionada ao lado, em coluna compatível com o layout da pergunta.
- A area inferior manteve rolagem vertical.
- O numero e o texto da pergunta foram preservados.

## O que foi preservado

- Lista de perguntas.
- Combo `Questionario`.
- Troca de questionario.
- Ausencia de salvamento.
- Ausencia de backend.
- Ausencia de banco.
- Ausencia de payload.

## Confirmacoes

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js` alterado.
- `frontend/app.js` nao alterado nesta subetapa.
- `frontend/index.html` nao alterado.
- backend nao alterado.
- banco nao alterado.
- schema/migrations/seeds/endpoints nao alterados.
- `.env` nao alterado.
- `requestJson` nao alterado.
- payload nao alterado.
- formato de salvamento nao alterado.
- exclusao nao alterada.
- permissoes nao alteradas.
- `Procura` nao alterado.
- `Anotacoes` nao alterada.
- `Historico` nao alterado.
- `Configuracoes -> Anamnese` nao alterado.
- salvamento nao implementado.
- mensagens clinicas nao implementadas.
- pergunta critica nao implementada.

## Riscos remanescentes

- A mudanca continua sendo puramente visual e local.
- O principal risco remanescente e regressao de layout caso a lista tenha muitas perguntas ou textos longos.
- O fluxo global da `Ficha Pessoal` nao foi tocado.

## Plano de retorno manual usando backup

- Se houver problema visual, restaurar `frontend/js/modules/ficha-pessoal-aba-anamnese.js` a partir do backup manual desta subetapa.
- Nao restaurar outros arquivos fora do escopo.

## Como testar manualmente

1. Abrir o sistema.
2. Fazer login.
3. Abrir `Ficha Pessoal`.
4. Selecionar um paciente.
5. Entrar na aba `Anamnese`.
6. Confirmar nome do paciente.
7. Confirmar combo `Questionario`.
8. Confirmar que as perguntas aparecem.
9. Confirmar que `Sim` e `Nao` aparecem um abaixo do outro.
10. Confirmar que a caixa complementar aparece alinhada de forma aceitavel.
11. Trocar de questionario e confirmar que a lista continua mudando.
12. Confirmar que nao ha salvamento obrigatorio nesta etapa.
13. Testar `Procura`.
14. Testar `Dados pessoais`.
15. Testar `Dados complementares`.
16. Testar `Anotacoes`.
17. Testar `Historico`.
18. Testar `Sair`.

## Registro para roadmap

- Ajuste visual pontual na lista de perguntas da aba `Anamnese`.
- Organizacao de `Sim` e `Nao` em coluna vertical para aproximacao do padrao EasyDental.
- Sem alteracao de salvamento, backend, banco, payload ou `requestJson`.

## Blindagem textual/mojibake

- Respeitada conforme a regra do repositorio.
- Nenhuma correcao textual fora do escopo foi aplicada.
