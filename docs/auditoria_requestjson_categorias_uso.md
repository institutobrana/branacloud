# Auditoria documental — requestJson por categorias de uso e risco

## 1. Resumo executivo

Esta auditoria consolida o uso de `requestJson` no frontend `frontend/app.js` em categorias de comportamento e risco, sem alterar qualquer código. O objetivo é reduzir a incerteza para a modularização futura, separando o que hoje está misturado em fluxos de autenticação, sessão, permissões, financeiro, cadastro, exclusão, exportação e rotas dinâmicas.

O ponto central continua o mesmo das auditorias anteriores: `requestJson` não é um helper neutro. Ele faz parte do contrato operacional do sistema, porque participa de autenticação, tratamento de erro protegido, grant, sessão e leitura de respostas que afetam o estado global da aplicação. Por isso, a maior parte das chamadas deve ser tratada como área de risco documental antes de qualquer refatoração funcional.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto analisado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração funcional foi feita nesta etapa

## 3. Arquivos analisados

Arquivos e conjuntos mais relevantes consultados para esta classificação:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`
- `backend/routes`
- Documentos anteriores de auditoria sobre inventário mestre, usuários, auth, segurança e matriz de endpoints

## 4. Total aproximado de chamadas

A varredura documental de `frontend/app.js` encontrou aproximadamente:

- `264` ocorrências de `requestJson(` ou `postJson(` consideradas como chamadas/atalhos do mesmo contrato de rede
- `5` ocorrências com comportamento fora do JSON simples, ligadas a `blob`, `raw`, `text` ou `FormData`

Observação: este número é aproximado e serve como base documental. Há chamadas diretas e atalhos que se sobrepõem ao mesmo fluxo de rede.

## 5. Critério de classificação

A classificação foi feita por domínio aparente, risco funcional e tipo de contrato de rede. Os grupos foram separados quando houve sinais de:

- autenticação, sessão ou grant protegido
- payload sensível
- operação destrutiva
- exportação/download/blob
- rota montada dinamicamente
- relação com financeiro, usuários, permissões, licença, trial ou superadmin
- dependência forte de `/me` ou do estado global de sessão

## 6. Matriz por categoria de uso

| Categoria | Qtde. aprox. | Exemplos de chamadas/rotas | Domínio | Risco | Observação |
|---|---:|---|---|---|---|
| auth / sessão / grant protegido | 27 | `login`, `logout`, `setup`, `/me`, unlock protegido, heartbeat | segurança / sessão | Crítico | Contrato central; mexer aqui afeta toda a aplicação |
| JSON simples | 38 | listagens e buscas sem payload sensível aparente | leitura geral | Baixo a médio | Ainda pode esconder dependências de estado, mas tende a ser menos arriscado |
| payload sensível | 22 | envio de dados de cadastro, edição, vínculo ou configuração | cadastro / estado | Alto | Pode tocar em validação, persistência e regras de negócio |
| financeiro / índices / cenário | 12 | financeiro, índices financeiros, cenário | financeiro | Crítico | Área de maior sensibilidade para cálculo, reajuste e persistência |
| usuários / senha / permissões | 12 | users, password, permissões, perfis, grant | segurança / admin | Crítico | Alto acoplamento com `requestJson`, permissões e sessão |
| licença / trial / superadmin | 77 | `licenca*`, `sa*`, rotas administrativas e de liberação | plataforma / controle | Crítico | Grupo mais misturado e mais sensível do sistema |
| pacientes | 6 | fluxos de cadastro e busca relacionados a pacientes | cadastro clínico | Alto | Pode se cruzar com sessão, clínica e vínculos de atendimento |
| materiais | 5 | materiais, custos, vínculos e consulta | estoque / custo | Alto | Frequentemente acoplado a procedimentos e financeiro |
| procedimentos / intervenções | 26 | procedimentos, tratamentos, controle protético | clínica / produção | Crítico | Um dos blocos mais densos e com risco de regressão |
| agenda | 18 | agenda legado, contatos e ações associadas | agenda | Alto | Tende a misturar UI, seleção, filtros e persistência |
| editor de textos | 13 | editor, templates, composição de texto | conteúdo / configuração | Médio a alto | Possui forte acoplamento com renderização e conteúdo persistido |
| blob / download / exportação | 5 | export, download, PDF, arquivo, resposta binária | saída de arquivo | Alto | Contrato diferente do JSON simples; exige cuidado com headers e resposta |
| template strings dinâmicas | 28 | rotas montadas com `\`${...}\`` | roteamento dinâmico | Alto | Dificulta auditoria exata e liga frontend ao formato interno da rota |
| exclusões / ações destrutivas | 14 | delete, excluir, remoções, cancelamentos | mutação destrutiva | Crítico | Pode acionar cascata, integridade e confirmação de UI |

## 7. Categorias mais críticas

As categorias que merecem bloqueio documental antes de qualquer modularização são:

1. `auth / sessão / grant protegido`
2. `licença / trial / superadmin`
3. `financeiro / índices / cenário`
4. `usuários / senha / permissões`
5. `procedimentos / intervenções`
6. `exclusões / ações destrutivas`
7. `blob / download / exportação`

Esses grupos combinam transporte, autorização, estado global e mutação persistente. A chance de regressão funcional é alta.

## 8. Categorias mais misturadas

Os grupos com maior mistura de responsabilidade foram:

- `licença / trial / superadmin`
- `procedimentos / intervenções`
- `agenda`
- `financeiro / índices / cenário`
- `usuários / senha / permissões`
- `editor de textos`
- `materiais`

Nesses grupos, o `requestJson` aparece combinado com regras de negócio, UI, validação, permissão e salvamento, o que dificulta qualquer extração prematura.

## 9. Categorias que parecem mais seguras apenas para auditoria adicional

Essas áreas podem receber auditoria documental futura, mas ainda não são candidatas seguras para modularização imediata:

- listagens JSON simples de consulta
- algumas buscas auxiliares de cadastros
- rotas de apoio com baixo volume de payload
- exportações isoladas, desde que separadas do estado central

Mesmo assim, o critério de segurança aqui é apenas documental. Não é recomendação de extração funcional.

## 10. Relação com `/me` e contratos de segurança

O uso de `requestJson` se conecta diretamente com o contrato de autenticação já mapeado nas auditorias anteriores:

- injeta `Authorization: Bearer <token>` quando a requisição exige autenticação
- lida com respostas que podem exigir grant protegido
- participa do tratamento de expiração de sessão
- conversa com o estado carregado por `/me`
- sustenta fluxos que dependem de permissões e visibilidade de menu

Isso significa que qualquer mudança em `requestJson` pode quebrar tanto a sessão quanto o acesso aos módulos protegidos.

## 11. Relação com endpoints autenticados já mapeados

A maior parte das chamadas de `requestJson` se encaixa nos grupos de endpoints já identificados na auditoria da matriz de segurança:

- `auth`, `me`, `logout`, `setup`
- `admin/users`
- `superadmin`
- `licenca`
- `financeiro`
- `indices-financeiros`
- `procedimentos`
- `materiais`
- `agenda`
- `editor-textos`
- `relatorios`
- `preferences`, `system-options`, `cadastros`

A auditoria confirma que o frontend não usa `requestJson` apenas como transporte, mas como parte do mapa funcional dos módulos.

## 12. Grupos que dependem mais fortemente de `requestJson`

Os blocos do frontend com maior dependência aparente de `requestJson` são:

- login, sessão e setup
- usuários, perfis, permissões e grant protegido
- superadmin e licença
- financeiro, índices e cenário
- procedimentos, tratamentos e controle protético
- agenda e editor de textos
- materiais e cadastros associados

Esses grupos devem permanecer fora de qualquer modularização apressada.

## 13. Endereçamento dinâmico e rotas montadas

Foi identificada uma quantidade relevante de chamadas com template strings dinâmicas, especialmente em grupos administrativos e operacionais.

Risco documental associado:

- dificulta contagem exata de endpoints
- reduz rastreabilidade entre frontend e backend
- aumenta a chance de divergência entre nome de rota e contrato real
- complica a extração segura por helper ou módulo

## 14. Blobs, downloads e exportações

As chamadas não JSON simples são poucas, mas relevantes. Elas aparecem como exportações ou downloads e geralmente dependem de comportamento diferente em headers, responseType ou leitura binária.

Esses fluxos merecem auditoria própria porque:

- não seguem o mesmo contrato das respostas JSON
- podem quebrar em mudanças de autenticação ou cabeçalho
- costumam estar acoplados a relatórios ou geração de arquivo

## 15. Exclusões e ações destrutivas

As chamadas de exclusão e mutação destrutiva devem ser tratadas como grupo de risco crítico, porque normalmente envolvem:

- confirmação de usuário
- dependências de seleção atual
- recálculo de estado local
- cascata de persistência
- revalidação de listas e vínculos

Mesmo quando a API parece simples, o impacto funcional é alto.

## 16. Lacunas restantes

Ainda faltam auditorias mais finas para:

- mapear todas as 264 chamadas uma a uma por endpoint exato
- separar com precisão chamadas diretas de `requestJson` e atalhos de rede usados como wrapper operacional
- classificar todos os casos dinâmicos de template string sem ambiguidade
- cruzar cada chamada sensível com permissões e tela de origem
- auditar em detalhe os fluxos de exportação/download e as exclusões específicas

## 17. O que não deve ser modularizado ainda

Não devem ser modularizados neste momento:

- autenticação, sessão, logout, login e grant protegido
- `/me` e tudo que depende do carregamento inicial de sessão
- permissões, perfis e visibilidade de menu
- licença, trial, superadmin e tenant
- financeiro, índices e cenário
- usuários, senha e operações administrativas
- procedimentos, intervenções, materiais e vínculos clínicos
- exclusões e qualquer fluxo destrutivo
- exportações/downloads com comportamento fora do JSON simples

## 18. Próxima etapa documental recomendada

A próxima etapa documental mais segura é:

1. auditoria linha a linha apenas dos grupos críticos mais misturados
2. auditoria separada de template strings dinâmicas por domínio
3. auditoria documental de exportações/downloads e exclusões
4. apenas depois disso, avaliação de candidatos reais a extração funcional

## 19. Conclusão

`requestJson` é um eixo estrutural da aplicação, não um detalhe utilitário. Esta auditoria confirma que a melhor estratégia continua sendo documentação cuidadosa, isolamento conceitual e priorização de risco antes de qualquer modularização futura.

A regra prática para a próxima fase é simples: primeiro documentar com precisão, depois separar com segurança.
