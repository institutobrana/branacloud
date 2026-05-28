# Auditoria EasyDental virgem - Subetapa 8U-C - validacao manual da nova conta apos 8P/8K/8R/8U

## 1. Contexto

- Esta etapa registra a validacao manual bem-sucedida da nova conta apos as Subetapas 8P, 8K, 8R e 8U.
- A base foi liberada pela exclusao segura da clinica 12 vinculada a `institutobrana@gmail.com`.
- Depois disso, houve uma tentativa de criacao que falhou com `NameError: name '_apply_user_links' is not defined`.
- A falha foi corrigida em `docs/correcao_signup_apply_user_links_apos_8u.md` e no commit `01e04fd697d9acd2068d9cd9a86f6e59e309744f`.
- Com a correcao aplicada, o usuario informou que os testes ficaram ok e que a conta foi criada corretamente.

## 2. Resultado informado pelo usuario

- Testes ok.
- Conta criada corretamente.
- A Subetapa 8U-C foi considerada ok pelo usuario.

## 3. Itens validados

| Item | Resultado | Observacao |
| --- | --- | --- |
| `signup/confirm` | OK | O fluxo passou apos a correcao do `_apply_user_links`. |
| Unidade `Principal / 0001` | OK | A nova conta nasceu com a unidade inicial correta. |
| Tabelas da 8P | OK | As tabelas de procedimentos continuaram corretas. |
| `Tabela Exemplo` | Ausente | A conta nao nasceu com a tabela legada. |
| `Brana` padrao/privada | OK | O comportamento esperado permaneceu valido. |
| Prestador `Clínica` | OK | O prestador sistemico continuou presente. |
| Prestador ADM/Mestre funcional | OK | O prestador ADM continuou disponivel. |
| Tipo `Cirurgiao dentista` no prestador ADM | OK | O tipo do prestador ADM permaneceu correto. |
| Usuario ADM como `Dentista (CD)` | OK | O usuario ADM nasceu com o tipo esperado. |
| Usuario ADM vinculado ao prestador ADM | OK | O usuario ADM ficou associado ao prestador correto. |
| Usuario ADM vinculado a unidade `Principal / 0001` | OK | O vinculo de unidade ficou correto. |
| Setup para ADM inicial | OK | O setup continuou aparecendo para o ADM inicial. |

## 4. Correcoes acumuladas confirmadas

- `PRIVATE_TABLE_NAME`.
- `senha_interna_hash`.
- `_apply_user_links`.

## 5. Fora de escopo

- Implementacao.
- Setup para usuarios posteriores.
- Opcoes do Sistema.
- Controle de usuarios/senhas.
- Auditoria.
- Alteracao de senha.
- Correcao textual da tela de setup.
- Frontend.
- EasyDental.

## 6. Proxima subetapa recomendada

- Subetapa 8V - impedir que a tela de setup apareca para usuarios criados posteriormente, mantendo setup para o ADM inicial da nova conta.

## 7. Plano de verificacao

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- nenhum codigo foi alterado;
- frontend nao foi alterado;
- backend nao foi alterado;
- banco/schema/migrations/seeds/endpoints nao foram alterados;
- nenhuma conta foi criada ou excluida nesta etapa;
- setup nao foi alterado;
- EasyDental nao foi alterado;
- blindagem textual/mojibake respeitada.
