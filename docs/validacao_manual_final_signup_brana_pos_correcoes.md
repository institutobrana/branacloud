# Validação manual final do signup Brana pós-correções

## 1. Objetivo
Registrar a validação manual final do fluxo de criação de nova conta após as correções do Problema 1 e do Problema 2, sem alterar código, banco ou dados operacionais.

## 2. Contexto
Os testes manuais finais foram executados pelo usuário após os commits principais desta trilha. O objetivo aqui é apenas documentar o resultado informado como validado manualmente.

## 3. Commits já aplicados
- `5c8ef7a` - Corrige login, senha interna e perfis de usuarios
- `8c1f7c5` - Corrige seed canonico Brana no signup
- `cb20715` - Documenta exclusao segura da clinica 15
- `9c4df78` - Documenta exclusoes seguras de clinicas de teste

## 4. Resumo das correções feitas
- separação entre senha de login e senha interna
- ajuste de perfis/usuários
- seed canônico próprio da Brana com 336 procedimentos
- consumo do seed canônico no signup
- documentação e versionamento das exclusões seguras das clínicas de teste

## 5. Confirmação sobre a clínica 15
A clínica 15 contaminada foi excluída com segurança antes do teste manual final.

## 6. Conta/e-mail usado no teste
O teste manual final foi realizado com `institutobrana@gmail.com`.

## 7. Checklist validado pelo usuário
O usuário informou que os testes passaram e validou manualmente:
- criação de nova conta sem erro 500;
- login com senha de login;
- senha interna separada da senha de login;
- Tabela exemplo criada sem inflar para 681 procedimentos;
- Brana criada corretamente;
- Brana com 336 procedimentos;
- ausência de PARTICULAR em nova conta;
- seed Brana vindo do seed canônico versionado;
- Brana sem materiais vinculados, fases, composições ou `procedimento_generico_id`;
- fluxo geral apto para continuidade.

## 8. Resultado do teste
Resultado informado pelo usuário: os testes estão ok e o fluxo de signup passou após as correções.

## 9. Mojibake / UTF-8
A correção de mojibake/UTF-8 permaneceu fora desta trilha, conforme a regra de blindagem textual.

## 10. Pendências fora da trilha atual
Permanecem fora desta trilha os artefatos antigos de anamnese, SQLServer, restauração, auditorias gerais e arquivos soltos de organização do workspace.

## 11. Confirmação de escopo desta etapa
Nenhum código foi alterado nesta etapa. Esta documentação apenas registra a validação manual final já executada pelo usuário.

## 12. Próximo passo recomendado
Manter a trilha principal encerrada e tratar somente as pendências fora de escopo em etapa separada, se necessário.
