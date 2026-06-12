# Revalidação runtime pós-rollback e pós-hotfix de login - Novo tratamento

## 1. Objetivo da etapa

Registrar o estado real observado em runtime após:

- o rollback seletivo do fluxo `Novo tratamento`;
- o hotfix anterior de login do usuario `gleissontel@gmail.com`.

Esta etapa foi apenas observacional. Nenhum codigo foi alterado.

## 2. Estado de referencia pós-rollback

- O rollback seletivo do fluxo `Novo tratamento` permanece como referencia documental em `fb344bd`.
- Os arquivos de entrada do fluxo tratavam `Tratamento -> Novo tratamento` como trilha pausada e reavaliavel.
- Nesta revalidacao, nenhum arquivo de codigo foi alterado.

## 3. Estado de referencia pós-restauração do login

- O hotfix anterior foi registrado em `f107c49`.
- Naquele momento, a conta `gleissontel@gmail.com` havia sido restaurada com sucesso.
- Durante esta nova revalidacao runtime, o estado atual do registro voltou a divergir do hash observado no hotfix, e o login do usuario voltou a responder com `400`.
- Portanto, o estado observado agora nao corresponde mais ao estado validado anteriormente no hotfix.

## 4. Ambiente de teste

- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Navegador interno do Codex apontando para `http://127.0.0.1:8000/app`
- Usuario alvo: `gleissontel@gmail.com`

## 5. Resultado do login

- No navegador real, o login com `gleissontel@gmail.com` nao ficou funcional nesta revalidacao.
- A tela exibiu `Senha incorreta`.
- A chamada direta ao backend tambem retornou `400 Bad Request` com `Senha incorreta`.
- Como o login falhou, nao houve entrada no sistema nesta revalidacao.

## 6. Resultado de `Tratamento -> Novo tratamento` sem paciente em uso

- Nao foi possivel chegar ao menu `Tratamento`.
- Nao foi possivel acionar `Novo tratamento`.
- O fluxo nao passou da barreira de login.

## 7. Resultado apos selecao de paciente no Menu de pacientes

- Nao aplicavel nesta revalidacao.
- O `Menu de pacientes` nao foi alcançado porque o login nao abriu o sistema.

## 8. Resultado quando ja existe paciente em uso

- Nao aplicavel nesta revalidacao.
- O fluxo nao chegou a uma tela autenticada onde esse estado pudesse ser observado.

## 9. Se Ficha pessoal entra ou nao no fluxo atual

- Nao foi possivel observar Ficha pessoal nesta rodada.
- O login nao permitiu avancar ao shell autenticado.

## 10. Se header/faixa de paciente em uso aparece ou nao

- Nao foi possivel observar a faixa/header nesta rodada.
- O login nao permitiu chegar ao estado autenticado da tela principal.

## 11. O que ficou comprovado

- O estado atual observado nesta revalidacao nao esta igual ao estado validado no hotfix anterior.
- O usuario `gleissontel@gmail.com` continua sujeito a `400` no `/login` no momento desta checagem.
- O fluxo `Novo tratamento` continua inacessivel enquanto a autenticacao nao sobe.
- Nao houve alteracao de codigo nesta etapa.

## 12. O que continua pendente

- Entender por que o hash do usuario voltou a divergir do estado antes validado.
- Restaurar um estado de login estavel para `gleissontel@gmail.com`.
- Repetir a observacao do fluxo `Tratamento -> Novo tratamento` apos o login voltar a funcionar.

## 13. Proxima etapa recomendada

- Investigar e estabilizar o estado de login do usuario `gleissontel@gmail.com`.
- Depois, repetir a revalidacao runtime do fluxo `Tratamento -> Novo tratamento`.
- Somente entao considerar o fluxo como definitivamente reobservado apos o rollback.
