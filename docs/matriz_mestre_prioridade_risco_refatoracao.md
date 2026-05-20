# Matriz mestre de prioridade, risco e estratégia de refatoração do frontend e backend

## 1. Resumo executivo

Esta matriz consolida as auditorias documentais já concluídas e transforma os achados em uma leitura estratégica única para orientar a sequência futura de auditorias e, apenas depois, uma eventual refatoração modular segura.

A conclusão central permanece consistente: o Brana Cloud ainda está fortemente concentrado em poucos eixos críticos, especialmente `frontend/app.js`, contratos de autenticação/autorização, `requestJson`, módulos de alto risco operacional e arquivos centrais do backend. A presença de módulos já parcialmente documentados não significa separação funcional segura. Em vários casos, o sistema está apenas descrito, mas não realmente desacoplado.

O mapa mestre abaixo prioriza congelamento documental em áreas sensíveis, auditoria fina em áreas ainda misturadas e separação futura apenas onde o risco já estiver suficientemente mapeado.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Natureza da etapa: exclusivamente documental e de leitura
- Nenhuma alteração funcional foi feita

## 3. Auditorias-base utilizadas

Auditorias consolidadas nesta matriz:

1. `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
2. `docs/auditoria_usuarios_permissoes_login_sessao.md`
3. `docs/auditoria_contratos_auth_requestjson_me_security.md`
4. `docs/auditoria_matriz_endpoints_autenticados_dependencias_seguranca.md`
5. `docs/auditoria_requestjson_categorias_uso.md`

## 4. Matriz mestre por domínio/módulo

| Domínio | Frontend menu/app.js | JS próprio | Backend | Acoplamento auth/tenant/licença | Risco | Estado da auditoria | Congelar agora? | Próxima ação documental |
|---|---|---|---|---|---|---|---|---|
| Auth / sessão / `/me` / grant | Sim, central em `app.js` | Não identificado | Sim | Crítico | Crítico | Alto nível já documentado | Sim | Apenas auditoria fina de contratos, sem refatoração |
| Usuários / perfis / permissões | Sim | Não identificado | Sim | Crítico | Crítico | Documentado, mas ainda concentrado | Sim | Auditoria linha a linha dos fluxos e permissões críticas |
| Licença / trial / superadmin | Sim | Não identificado | Sim | Crítico | Crítico | Documentado parcialmente | Sim | Auditoria fina de rotas, middleware e contratos de liberação |
| `requestJson` / transporte de rede | Sim, transversal | Não identificado | Indireto | Crítico | Crítico | Documentado por categorias | Sim | Só auditoria complementar; não modularizar |
| Financeiro / índices / cenário | Sim | Não identificado claro | Sim | Alto a crítico | Crítico | Parcialmente auditado | Sim | Auditoria fina de cálculo, exclusão e reajuste |
| Procedimentos / intervenções / tratamentos | Sim | Parcial ou não claro | Sim | Alto | Crítico | Parcialmente auditado | Sim | Auditoria fina dos fluxos mais sensíveis |
| Materiais | Sim | Não identificado claro | Sim | Alto | Alto | Parcialmente auditado | Sim | Auditoria fina de vínculos e custo |
| Agenda | Sim | Não identificado claro | Sim | Médio a alto | Alto | Parcialmente auditado | Não imediatamente | Auditoria documental complementar por subfluxos |
| Editor de textos | Sim | Não identificado claro | Sim | Médio a alto | Alto | Parcialmente auditado | Não imediatamente | Auditoria de exportação, template e persistência |
| Relatórios | Sim | Não identificado claro | Sim | Médio | Alto | Auditado em nível mestre | Não imediatamente | Auditoria de exportação/download e endpoints específicos |
| Pacientes | Sim | Não identificado claro | Sim | Médio a alto | Alto | Auditado de forma geral | Não imediatamente | Auditoria fina se houver novos fluxos |
| Prestadores | Sim | Não identificado claro | Sim | Médio | Médio a alto | Parcialmente auditado | Não imediatamente | Auditoria documental complementar |
| Convênios / planos | Sim | Não identificado claro | Sim | Médio | Médio a alto | Parcialmente auditado | Não imediatamente | Auditoria documental complementar |
| Materiais / procedimentos vinculados | Sim | Não identificado claro | Sim | Alto | Crítico | Mistura recorrente | Sim | Auditoria fina antes de qualquer separação |
| Etiquetas / relatórios auxiliares | Sim | Não identificado claro | Sim | Baixo a médio | Médio | Auditado em nível mestre | Não necessariamente | Auditoria posterior se houver dependência de exportação |
| Preferências / opções do sistema | Sim | Não identificado claro | Sim | Alto | Alto | Parcialmente auditado | Sim | Auditoria fina de contratos de configuração |
| Auxiliares / tabelas auxiliares | Sim | Não identificado claro | Sim | Médio | Médio | Parcialmente auditado | Não imediatamente | Auditoria complementar por submódulo |
| CIDs / anamnese | Sim | Não identificado claro | Sim | Médio | Médio a alto | Parcialmente auditado | Não imediatamente | Auditoria complementar por fluxo clínico |
| Controle protético / protéticos | Sim | Não identificado claro | Sim | Alto | Alto | Auditado em nível mestre | Sim | Auditoria fina antes de separação |
| Unidades de atendimento / configuração | Sim | Não identificado claro | Sim | Alto | Alto | Parcialmente auditado | Sim | Auditoria fina de configuração e tenant |
| Cadastros agregados (`cadastros_routes.py`) | Sim | Não identificado claro | Sim | Alto | Crítico | Alta mistura de responsabilidades | Sim | Auditoria fina por subdomínio antes de qualquer mudança |
| Agenda contatos / agenda legado | Sim | Não identificado claro | Sim | Médio | Alto | Parcialmente auditado | Não imediatamente | Auditoria fina por fluxo e relação com agenda |
| System options / config central | Sim | Não identificado claro | Sim | Alto | Alto | Parcialmente auditado | Sim | Auditoria fina porque cruza segurança e configuração |

## 5. Classificação consolidada por prioridade

### Prioridade documental imediata

- Auth / sessão / `/me` / grant
- Usuários / perfis / permissões
- Licença / trial / superadmin
- `requestJson` / transporte de rede
- Financeiro / índices / cenário
- Procedimentos / intervenções / tratamentos
- Materiais / procedimentos vinculados
- Preferências / opções do sistema
- Cadastros agregados
- System options / config central
- Controle protético / protéticos
- Unidades de atendimento / configuração

### Prioridade documental posterior

- Agenda
- Editor de textos
- Relatórios
- Pacientes
- Prestadores
- Convênios / planos
- CIDs / anamnese
- Etiquetas / relatórios auxiliares
- Auxiliares / tabelas auxiliares
- Agenda contatos / agenda legado

### Congelado por alto risco

- Auth / sessão / `/me` / grant
- Usuários / perfis / permissões
- Licença / trial / superadmin
- Financeiro / índices / cenário
- Procedimentos / intervenções / tratamentos
- Materiais / procedimentos vinculados
- Preferências / opções do sistema
- Cadastros agregados
- System options / config central
- Controle protético / protéticos
- Unidades de atendimento / configuração

### Candidato futuro de separação

- Relatórios, após auditoria fina de exportação
- Agenda, após mapeamento de subfluxos
- Editor de textos, após auditoria de persistência e exportação
- Pacientes, apenas após fechamento dos vínculos clínicos
- Prestadores e convênios, se o acoplamento administrativo ficar claramente isolado

## 6. Classificação consolidada por risco

### Crítico

- Auth / sessão / `/me` / grant
- Usuários / perfis / permissões
- Licença / trial / superadmin
- `requestJson` / transporte de rede
- Financeiro / índices / cenário
- Procedimentos / intervenções / tratamentos
- Materiais / procedimentos vinculados
- Preferências / opções do sistema
- Cadastros agregados
- System options / config central
- Controle protético / protéticos
- Unidades de atendimento / configuração

### Alto

- Agenda
- Editor de textos
- Relatórios
- Pacientes
- Prestadores
- Convênios / planos
- CIDs / anamnese
- Etiquetas / relatórios auxiliares
- Auxiliares / tabelas auxiliares
- Agenda contatos / agenda legado

### Médio

- Alguns fluxos auxiliares de consulta e listagem com baixo payload aparente
- Partes de módulos já mapeados, mas sem dependência sensível direta

### Menor

- Não há área importante claramente classificada como menor risco para modularização imediata; mesmo os fluxos aparentemente simples ainda podem depender de sessão, tenant ou permissões.

## 7. Leitura consolidada do estado atual

O estado atual da refatoração pode ser lido assim:

- o sistema foi documentado em nível estrutural, mas ainda não está funcionalmente separado;
- os domínios centrais permanecem misturados em arquivos de alto impacto;
- os contratos de auth e sessão são o eixo que sustenta todo o restante;
- `requestJson` é um ponto transversal de risco, não um helper isolado;
- o backend já revelou uma estrutura de rotas e dependências, mas ainda há arquivos concentradores e grupos heterogêneos;
- a modularização futura precisa ser guiada por risco, não por conveniência de extração.

## 8. O que não deve ser modularizado ainda

Não modularizar ainda:

- autenticação, sessão, logout, login e `/me`
- grant protegido e qualquer fluxo de desbloqueio
- permissões, perfis e visibilidade de menu
- licença, trial, superadmin e tenant
- financeiro, índices e cenário
- usuários e operações administrativas
- procedimentos, intervenções, tratamentos e vínculos
- materiais e custo relacionado
- exclusões e mutações destrutivas
- exportações/downloads e blobs
- qualquer fluxo que dependa de `requestJson` como contrato de segurança, não só como transporte

## 9. Sequência recomendada das próximas auditorias documentais

1. Auditoria fina de `auth`, `me`, grant protegido e sessão
2. Auditoria fina de usuários, permissões e administração
3. Auditoria fina de licença, trial, superadmin e tenant
4. Auditoria fina de financeiro, índices e cenário
5. Auditoria fina de procedimentos, intervenções e tratamentos
6. Auditoria fina de materiais e vínculos com custo
7. Auditoria fina de exportações/downloads e exclusões
8. Auditoria posterior de agenda, editor e relatórios
9. Só então, reavaliação de candidatos a separação funcional controlada

## 10. Conclusão estratégica

A matriz mestre mostra que o Brana Cloud ainda se encontra em fase de documentação e isolamento conceitual, não de modularização segura. O melhor uso do esforço agora é continuar reduzindo incerteza e concentrando a atenção nos domínios mais críticos e mais misturados.

Em termos práticos, os blocos que cruzam auth, permissões, tenant, licença, financeiro, procedimentos e exclusões devem continuar congelados. A próxima evolução segura é documental, seletiva e orientada por risco.
