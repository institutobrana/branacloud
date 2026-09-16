# Auditoria Git Local

Este documento registra a etapa de auditoria somente leitura do Git local usada pelo runner de release do Brana Cloude.

## Objetivo

- confirmar que o repositório local existe e e um worktree Git valido;
- coletar branch, HEAD, remotes e status local;
- identificar arquivos obrigatorios presentes na trilha oficial;
- sinalizar sujeira de worktree, staging e conflitos sem alterar nada.

## Comandos permitidos

Somente leitura, com `git.exe`:

- `git rev-parse --show-toplevel`
- `git rev-parse --abbrev-ref HEAD`
- `git rev-parse HEAD`
- `git rev-parse --short HEAD`
- `git remote -v`
- `git status --porcelain=v1 --branch`

## Saida esperada

O runner passa a anexar um `GitSummary` na auditoria com:

- `RepositoryRoot`
- `Branch`
- `Head`
- `HeadShort`
- `ModifiedCount`
- `StagedCount`
- `UntrackedCount`
- `DeletedCount`
- `RenamedCount`
- `ConflictedCount`
- `WorktreeDirty`
- `StageDirty`
- `Warnings`
- `Errors`

## Regras

- nao executar `git add`
- nao executar `git reset`
- nao executar `git commit`
- nao executar `git push`
- nao tentar corrigir estado local
- nao usar arquivos `.taskdef*.json` como prova de estado da AWS

## Resultado

Se o repositório estiver acessivel e os arquivos obrigatorios existirem, a auditoria Git local permanece informativa. Se houver conflitos ou arquivos obrigatorios ausentes, o runner passa a indicar estado Git invalido.
