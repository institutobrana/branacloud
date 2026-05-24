# Fase 2 — Reavaliação das próximas frentes após Tabela de protéticos

## 1. Contexto
A primeira frente ativa da Fase 2 foi a Tabela de protéticos, e ela foi pausada/consolidada parcialmente na Subetapa 20.

## 2. Estado atual
- Tabela de protéticos fechada parcialmente;
- helpers puros extraídos;
- frente pausada/consolidada;
- nenhuma nova alteração funcional autorizada nessa frente sem nova decisão documental.

## 3. Frentes candidatas a reavaliar
- Editor de texto;
- Ficha pessoal;
- Agenda;
- Conta corrente;
- Usuários/Login;
- Seeds/tabelas padrão;
- Tabela de protéticos, apenas como frente pausada, não como próxima frente imediata.

## 4. Critérios de comparação
As frentes foram comparadas por:

- valor de negócio;
- risco técnico;
- dependência de backend;
- dependência de banco;
- risco em permissões/sessão;
- risco textual/mojibake;
- quantidade provável de acoplamento em `frontend/app.js`;
- possibilidade de recortes pequenos;
- necessidade de contrato funcional prévio;
- necessidade de teste manual humano.

## 5. Análise resumida por frente

### Editor de texto
- Motivo para considerar: tem valor de negócio relevante e foi apontado como bom candidato preliminar na comparação da Subetapa 0.
- Riscos principais: acoplamento em `app.js`, fluxo de documentos/modelos e possível dependência de renderização/exportação.
- Parece adequada para iniciar agora: sim, com cautela.
- Precisa de contrato funcional antes: sim.
- Deve aguardar: somente após o contrato funcional inicial.

### Ficha pessoal
- Motivo para considerar: impacto alto no prontuário e no atendimento.
- Riscos principais: maior acoplamento, risco funcional alto, provável integração com banco e fluxos centrais.
- Parece adequada para iniciar agora: não como próxima frente imediata.
- Precisa de contrato funcional antes: sim, e com maior detalhamento.
- Deve aguardar: sim, até haver diagnóstico mais detalhado.

### Agenda
- Motivo para considerar: é central na operação diária.
- Riscos principais: risco funcional alto, integração com sessão, permissões, dados dinâmicos e possíveis dependências de backend.
- Parece adequada para iniciar agora: não.
- Precisa de contrato funcional antes: sim.
- Deve aguardar: sim.

### Conta corrente
- Motivo para considerar: eixo financeiro importante.
- Riscos principais: risco alto em dados e comportamento, possíveis integrações financeiras e de persistência.
- Parece adequada para iniciar agora: não.
- Precisa de contrato funcional antes: sim.
- Deve aguardar: sim.

### Usuários/Login
- Motivo para considerar: sistema de acesso é estrutural.
- Riscos principais: permissões, sessão, autenticação, impacto sistêmico.
- Parece adequada para iniciar agora: não.
- Precisa de contrato funcional antes: sim, com prioridade muito alta.
- Deve aguardar: sim.

### Seeds/tabelas padrão
- Motivo para considerar: importante para implantação e base de dados.
- Riscos principais: inicialização do sistema, banco, compatibilidade de ambientes e fluxo de instalação.
- Parece adequada para iniciar agora: não.
- Precisa de contrato funcional antes: sim.
- Deve aguardar: sim.

### Tabela de protéticos
- Motivo para considerar: já foi a primeira frente e já foi pausada/consolidada parcialmente.
- Riscos principais: frente já estabilizada; retomada sem nova decisão pode quebrar o fechamento parcial.
- Parece adequada para iniciar agora: não como próxima frente imediata.
- Precisa de contrato funcional antes: apenas se for retomada no futuro.
- Deve aguardar: sim, até nova decisão documental.

## 6. Recomendação da próxima frente
Recomenda-se **Editor de texto** como próxima frente, de forma conservadora, **desde que** o início seja documental com contrato funcional antes de qualquer código.

## 7. Justificativa da recomendação
O Editor de texto oferece bom valor de negócio, e a leitura da Subetapa 0 já o colocou entre os candidatos preliminares viáveis.

Ao mesmo tempo, ele parece menos arriscado do que Agenda, Conta corrente, Usuários/Login e Seeds/tabelas padrão.

Comparado com Ficha pessoal, ele tende a ter risco mais controlável para uma primeira retomada após o fechamento parcial da Tabela de protéticos.

Por isso, ele equilibra melhor valor e risco, desde que o próximo passo seja documental.

## 8. O que não fazer agora
- não retomar Tabela de protéticos por código agora;
- não mexer em `protServicoSelecionado`;
- não mexer em backend;
- não mexer em banco;
- não mexer em seeds;
- não mexer em permissões/sessão;
- não iniciar recorte funcional sem contrato documental da nova frente.

## 9. Próxima etapa sugerida
A próxima etapa deve ser documental:

- contrato funcional do Editor de texto.

Se houver dúvida adicional sobre essa frente, a etapa documental pode começar com mapeamento técnico inicial, mas a preferência é por contrato funcional.

## 10. Registro para roadmap
- A frente Tabela de protéticos foi pausada/consolidada na Subetapa 20;
- esta etapa reavalia as próximas frentes da Fase 2;
- a próxima frente recomendada é Editor de texto;
- a justificativa resumida é o melhor equilíbrio entre valor de negócio e risco controlável;
- a próxima etapa deve ser documental antes de qualquer alteração funcional;
- commit seletivo e teste manual humano continuam obrigatórios;
- a blindagem textual/mojibake continua obrigatória;
- Tabela de protéticos só deve ser retomada com nova decisão documental.

## 11. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_reavaliacao_proximas_frentes_pos_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 12. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_reavaliacao_proximas_frentes_pos_tabela_proteticos.md`.
