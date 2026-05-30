# Matriz comparativa - pos Convênios e Planos

## Objetivo

- Registrar a matriz comparativa da Fase 2B após a pausa da frente `Convênios e Planos`.
- A análise serve para decidir se existe alguma frente ainda segura para modularização/refatoração conservadora sem ampliar risco funcional.
- Esta etapa é somente documental.

## Contexto

- A frente `Convênios e Planos` foi pausada após `CONVPLAN-SHELL-DEC-C`.
- A renderização visual das listas, o helper visual/passivo de containers e a validação manual já foram concluídos.
- As próximas frentes candidatas precisam ser reavaliadas com foco em risco relativo, clareza de fronteira e possibilidade real de recorte seguro.

## Frentes avaliadas

| Frente | Estado atual | Arquivos principais | Modularização parcial | Módulo passivo | Helpers já extraídos | Risco atual | Próximo recorte possível | Exige contrato profundo? | Exige microcontrato? | Backend/db/requestJson/payload | Salvamento/exclusão | Permissões | Agenda/calendário/financeiro | Avanço baixo-médio? | Pausar? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Preferências / Configurações | Consolidada e pausada como referência estável | `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js` | Sim | Sim | Sim | baixo | Apenas revisita residual se surgir fronteira muito clara | Sim | Sim | médio | médio | baixo | baixo | Sim, mas já consolidada | Sim, se não houver fronteira nova |
| Prestadores | Parcialmente validada e pausada | `frontend/app.js`, `frontend/js/modules/prestadores.js` | Sim | Sim | Sim | médio-alto | Não há recorte novo seguro imediato | Sim | Sim | alto | alto | médio | médio | Não, sem nova auditoria/contrato | Sim |
| Convênios e Planos | Parcialmente validada e pausada | `frontend/app.js`, `frontend/js/modules/convenios-planos.js` | Sim | Sim | Sim | médio-alto | Nenhum recorte novo seguro imediato | Sim | Sim | alto | alto | médio | alto | Não, frente pausada | Sim |
| Conta Corrente | Em desenvolvimento, sem recorte seguro recente nesta trilha | `frontend/app.js`, backend/rotas financeiras | Parcial/indireta | Não claro | Não claro | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | alto | Não | Sim |
| Relatórios | Em desenvolvimento e sensível | `frontend/app.js`, módulos de relatório | Parcial/indireta | Não claro | Parcial | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | alto | Não | Sim |
| Índices Financeiros | Em desenvolvimento, sensível | `frontend/app.js`, rotas financeiras | Parcial/indireta | Não claro | Não claro | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | alto | Não | Sim |
| Tabela de Serviços de Prótese / Protéticos | Em desenvolvimento | `frontend/app.js`, `frontend/js/modules/prestadores.js` e controles protéticos | Parcial | Parcial | Alguns | médio-alto | Apenas depois de contrato específico | Sim | Sim | alto | alto | médio | médio-alto | Baixo, sem novo contrato | Sim |
| Usuários / Segurança | Em desenvolvimento e sensível | `frontend/app.js`, backend de usuários e permissões | Parcial | Parcial | Alguns | crítico | Não recomendado agora | Sim | Sim | crítico | crítico | crítico | baixo | Não | Sim |
| Editor de Texto | Em desenvolvimento avançado e sensível | `frontend/app.js`, módulos do editor, serviços de PDF | Parcial | Sim | Sim | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | baixo | Não | Sim |
| Cadastros Gerais / Tabelas auxiliares | Em desenvolvimento backend/menor clareza para recorte frontend | `backend/routes/cadastros_routes.py`, `frontend/app.js` | Parcial | Não claro | Alguns | médio-alto | Só com mapeamento bem fechado | Sim | Sim | alto | médio | médio | baixo | Sim, mas exige revisão | Sim |
| Medicamentos | Em desenvolvimento e misto com editor/receitas | `backend/routes/medicamentos_routes.py`, `frontend/app.js` | Parcial | Parcial | Alguns | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | baixo | Não | Sim |
| Anamnese | Em desenvolvimento e sensível | `backend/routes/anamnese_routes.py`, `frontend/app.js` | Parcial | Parcial | Alguns | alto | Não recomendado agora | Sim | Sim | alto | alto | médio | baixo | Não | Sim |
| Agenda principal | Pausada e considerada crítica | `backend/routes/agenda_*`, `frontend/app.js` | Sim | Sim | Sim | crítico | Não recomendado agora | Sim | Sim | crítico | crítico | médio | crítico | Não | Sim |
| Outras frentes candidatas do roadmap | Variável, em geral mais sensíveis ou menos claras | Variável | Variável | Variável | Variável | médio-alto a crítico | Depende de nova triagem | Sim | Sim | alto | alto | médio | alto | Não | Sim |

## Análise consolidada

- `Preferências / Configurações` permanece como a frente mais controlada entre as já modularizadas, mas já está consolidada e nao exige novo avanço automático.
- `Prestadores` e `Convênios e Planos` ficaram parcialmente validados e pausados, sem fronteira nova suficientemente clara para implementação imediata.
- As demais frentes listadas ainda concentram risco medio-alto, alto ou critico, especialmente onde ha dependência de backend, `requestJson`, payload, salvamento, exclusão, permissões, agenda/calendário ou financeiro.
- `Cadastros Gerais / Tabelas auxiliares` tem possibilidade de recorte, mas a fronteira é menos clara e envolve rotas backend, então nao foi escolhida como avanço imediato.

## Decisão final

- `MATRIZ-POS-CONV-C`
- A Fase 2B tecnica deve permanecer pausada por ora.
- A recomendação é fazer uma revisão documental geral antes de abrir um novo recorte.

## Motivo

- As frentes já modularizadas estão consolidadas ou pausadas.
- As frentes restantes apresentam risco alto ou crítico ou dependem de contratos mais profundos do que o momento atual permite.
- Não existe, neste ponto, um candidato novo com fronteira suficientemente clara para avançar sem ampliar risco.

## Risco

- Risco geral da próxima investida: médio-alto a crítico, dependendo da frente.
- Como não há frente segura imediatamente evidente, a opção mais segura é pausar e reavaliar.

## Próximo documento obrigatório

- Documento de revisão documental geral da Fase 2B antes de novo recorte.
- Se a retomada ocorrer, ela deve começar por nova decisão documental e não por implementação direta.

## Arquivos que provavelmente serão apenas auditados

- `docs/11_roadmap_desenvolvimento.md`
- docs de matriz/decisão da Fase 2B
- documentos de fronteiras, contratos e validações já existentes

## Arquivos proibidos

- `frontend/index.html`
- `backend/**`
- `banco/**`
- `schema/**`
- `migrations/**`
- `seeds/**`
- `endpoints/**`
- `.env`
- scripts de migração
- dumps/backups
- qualquer arquivo funcional fora de uma nova autorização documental

## Onde o usuário testaria futuramente

- Não há frente nova aprovada para implementação imediata.
- O usuário só deverá testar novamente após uma nova decisão documental específica.

## Commit seletivo obrigatório

- Se esta etapa for confirmada como somente documental, o commit deve incluir apenas este documento e o roadmap.

## Registro para roadmap

- A matriz comparativa pós-Convênios e Planos foi aberta.
- A decisão final foi `MATRIZ-POS-CONV-C`.
- A Fase 2B técnica permanece pausada por ora para revisão documental geral antes de qualquer novo recorte.
- Nenhum código ou banco foi alterado nesta etapa documental.
- O próximo passo recomendado é revisao documental geral antes de escolher nova frente.
