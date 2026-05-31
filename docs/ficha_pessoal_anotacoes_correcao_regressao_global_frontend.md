# Ficha Pessoal — Correção emergencial de regressão global após toolbar de Anotações

## 1. Sintoma informado pelo usuário

Após o commit `721d9e7dd9d8d2341705dcb1b7a541f29a468d52`, o sistema passou a abrir a tela de login e permitir autenticação, porém depois de entrar nenhuma função do sistema respondia.

Relato recebido:

- o sistema abre com login;
- após entrar, nenhum menu funciona;
- botões perderam função;
- até o botão `Sair` não sai do sistema.

## 2. Commit causador provável

- `721d9e7dd9d8d2341705dcb1b7a541f29a468d52`

## 3. Arquivos investigados

- `frontend/app.js`
- `frontend/js/modules/ficha_pessoal_anotacoes.js`
- `docs/ficha_pessoal_anotacoes_implementacao_toolbar_texto_puro.md`
- `docs/11_roadmap_desenvolvimento.md`
- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/frontend/app.js`
- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/frontend/js/modules/ficha_pessoal_anotacoes.js`

## 4. Causa encontrada

A regressão foi tratada como causada pela integração global da toolbar da aba `Anotações` no `frontend/app.js`.

Mesmo com `node --check` aprovado, a alteração adicionou carregamento e amarração de comportamento novo no boot da aplicação, o que coincidiu com a quebra global dos menus após o login.

Na ausência de console do navegador e diante do impacto global, a abordagem mais segura foi restaurar o `frontend/app.js` ao estado anterior ao commit causador.

## 5. Correção aplicada

- `frontend/app.js` foi restaurado manualmente a partir do backup:
  - `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/frontend/app.js`
- A toolbar da aba `Anotações` ficou temporariamente desativada na prática, porque o `frontend/app.js` voltou ao estado anterior à integração.
- O arquivo `frontend/js/modules/ficha_pessoal_anotacoes.js` permaneceu no disco, mas sem consumo pelo `app.js`.

## 6. Se foi usado backup ou não

Sim.

O backup manual foi usado como fonte de retorno seguro, sem recorrer a `git reset`, `git restore`, `git clean` ou `git revert`.

## 7. Confirmações de escopo

- `frontend/app.js` alterado apenas para restaurar funcionamento global;
- `frontend/js/modules/ficha_pessoal_anotacoes.js` ficou sem consumo após a restauração;
- `frontend/index.html` não alterado;
- backend não alterado;
- banco não alterado;
- schema/migrations/seeds/endpoints não alterados;
- `.env` não alterado;
- `requestJson` não alterado;
- payload não alterado;
- formato de salvamento não alterado;
- exclusão não alterada;
- permissões não alteradas.

## 8. Plano de teste manual

1. Abrir o sistema.
2. Fazer login.
3. Testar menus principais.
4. Testar botão `Sair`.
5. Abrir `Ficha Pessoal`.
6. Abrir um paciente.
7. Testar se `Dados pessoais` abre.
8. Testar se `Dados complementares` abre.
9. Testar se `Anotações` abre.
10. Testar se `Anamnese` abre.
11. Testar se `Histórico` abre.
12. Somente se o sistema global voltar a funcionar, reavaliar a toolbar de `Anotações`.

## 9. Registro para roadmap

Esta correção emergencial registra a reversão controlada da integração da toolbar de `Anotações`, priorizando a recuperação do funcionamento global do frontend antes de qualquer tentativa futura de reativar a toolbar.
