# Ficha Pessoal - Validacao do botao Procura reentrante

## Contexto
- O botao `Procura...` da `Ficha Pessoal` foi corrigido no commit `1b53fb4`.
- A correcao fez o botao abrir sempre a tela de pesquisa de pacientes.
- A abertura direta por codigo permaneceu apenas para os fluxos de teclado/blur.

## Commit validado
- `1b53fb4`

## Correcao validada
- O botao `Procura...` passou a funcionar de forma reentrante.
- Depois de selecionar um paciente, o usuario conseguiu clicar em `Procura...` novamente sem fechar a `Ficha Pessoal`.
- A tela de pesquisa abriu outra vez como esperado.

## Resultado informado pelo usuario
- `PASSOU`

## Fluxo testado
1. Abrir `Ficha Pessoal`.
2. Clicar em `Procura...`.
3. Selecionar paciente.
4. A ficha carregar.
5. Clicar novamente em `Procura...` sem fechar a ficha.
6. A pesquisa abrir novamente.
7. Permitir nova selecao de paciente.

## Decisao pos-validacao
- A correcao do botao `Procura...` esta validada e pode ser considerada concluida.

## Confirmacoes de nao alteracao
- nenhum codigo alterado;
- `frontend/app.js` nao alterado nesta validacao;
- `frontend/index.html` nao alterado;
- `frontend/js/modules` nao alterado;
- backend nao alterado;
- banco nao alterado;
- schema/migrations/seeds/endpoints nao alterados;
- `.env` nao alterado;
- `requestJson` nao alterado;
- payload nao alterado;
- formato de salvamento nao alterado;
- exclusao nao alterada;
- permissoes nao alteradas.

## Proxima recomendacao
- Retomar a aba `Anamnese` em uma nova subetapa pequena.
- Preferencialmente, corrigir a combo `Questionario` para listar todos os questionarios da conta/clinica ou preparar a area inferior para listar perguntas do questionario selecionado.
- Nao misturar as duas evolucoes sem um contrato claro.

## Registro para roadmap
- Esta rodada registra a validacao manual da correcao do botao `Procura...` da `Ficha Pessoal`.
- A correcao foi confirmada como reentrante pelo teste manual informado pelo usuario.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta validacao.
