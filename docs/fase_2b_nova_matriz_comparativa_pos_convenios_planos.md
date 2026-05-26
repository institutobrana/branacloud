# Fase 2B - Nova matriz comparativa apos pausa de Convenios e Planos

## 1. Identificacao da etapa

- Fase 2B.
- Nova matriz comparativa.
- Pos-consolidacao parcial de `Convênios e Planos`.
- Etapa exclusivamente documental.

## 2. Motivo da nova matriz

- `Preferências` ja entregou dois recortes validados e foi pausada.
- `Prestadores` ja entregou um recorte validado e foi pausado.
- `Convênios e Planos` ja entregou um recorte validado e foi pausado.
- Continuar automaticamente em qualquer uma dessas frentes pode aumentar risco.
- A proxima decisao precisa comparar frentes novamente.
- Nao deve haver implementacao direta.

## 3. Criterios de decisao

- Menor contato com backend.
- Menor contato com `requestJson`.
- Menor contato com payload.
- Menor contato com salvamento.
- Menor contato com exclusao.
- Menor contato com permissoes.
- Menor risco textual/mojibake.
- Teste manual claro.
- Rollback mental simples.
- Ganho real de organizacao do `app.js`.
- Possibilidade de contrato profundo objetivo.
- Possibilidade de recorte medio pequeno.

## 4. Matriz comparativa

| Candidato | Classificacao | Modulo em `frontend/js/modules` | Tamanho provavel no `app.js` | DOM | Eventos | Modal | `requestJson` | Payload | Salvamento | Exclusao | Backend/endpoints | Permissoes | Risco textual/mojibake | Risco funcional | Ganho esperado | Teste manual | Rollback mental | Contrato profundo | Implementacao futura | Evitar por enquanto / Fase 3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `Medicamentos` | comum/core transversal | sim | medio/alto | alto | medio/alto | sim | sim | sim | sim | sim | alto | medio | medio | medio/alto | alto | claro | claro | sim | sim | nao agora |
| `Ficha pessoal` | comum/core transversal | possivel ou parcial | medio | medio/alto | medio | possivel | possivel | possivel | possivel | nao foco | medio/alto | medio | medio | medio | medio | claro | razoavel | sim | sim | nao agora |
| `Conta corrente` | comum/core transversal | possivel | medio | medio | medio | possivel | possivel | possivel | sim | sim | alto | alto | baixo/medio | alto | medio | claro | simples | sim | possivel | cautela |
| `Indices financeiros` | comum/core transversal | possivel | medio | medio | medio | possivel | possivel | possivel | sim | sim | alto | alto | baixo/medio | alto | medio | claro | simples | sim | possivel | cautela / futuro |
| `Materiais` | comum/core transversal | sim | alto | alto | alto | sim | sim | sim | sim | sim | alto | medio/alto | medio | alto | alto | medio | medio | sim | possivel, mas alto risco | evitar agora |
| `Agenda principal remanescente` | comum/core transversal | sim | alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | medio | medio | sim | possivel, mas alto risco | evitar agora |
| `Procedimentos genéricos` | específico de area profissional | sim/parcial | alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | medio | medio | sim | possivel, mas alto risco | Fase 3 / estrutural |
| `Relatórios` | comum/core transversal | possivel | alto | alto | alto | possivel | sim | sim | sim | sim | alto | alto | baixo/medio | muito alto | alto | medio | medio | sim | baixo | Fase 3 / estrutural |
| Retomar `Preferências` | comum/core transversal | sim | baixo/medio | medio | medio | sim | nao | nao | nao | nao | baixo | baixo | alto (se reabrir demais) | medio | medio | claro | simples | sim | sim, mas pausado | pausar |
| Retomar `Prestadores` | específico de area profissional | sim | medio/alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | claro | medio | sim | sim, mas pausado | pausar |
| Retomar `Convênios e Planos` | comum/core transversal | sim | medio/alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | claro | medio | sim | sim, mas pausado | pausar |

## 5. Ranking de seguranca

### Mais adequados para proximo contrato profundo

- `Medicamentos`
- `Ficha pessoal`

### Possiveis, mas exigem cautela

- `Conta corrente`
- `Indices financeiros`

### Devem ser evitados por enquanto

- `Materiais`
- `Agenda principal remanescente`

### Devem ficar para Fase 3 ou etapa estrutural

- `Procedimentos genéricos`
- `Relatórios`

### Devem continuar pausados

- `Preferências`
- `Prestadores`
- `Convênios e Planos`

## 6. Recomendacao de proxima frente

- A frente recomendada para o proximo contrato profundo e `Medicamentos`.
- A classificacao fica como `comum/core transversal`.
- A escolha foi feita porque ainda ha ganho real de organizacao do `app.js`, com fronteiras documentais mais claras do que em `Materiais`, `Agenda`, `Relatórios` e nos modulos financeiros.
- `Preferências` deve continuar pausada por ja ter fechado dois recortes validos e por ainda existir risco de reentrada em `sysOpt*`, `Odontograma`, `requestJson`, payload ou salvamento.
- `Prestadores` deve continuar pausado por ja ter fechado um recorte validado e por poder encostar em modal, salvar, excluir, agenda, credenciamento, comissoes, permissoes e backend.
- `Convênios e Planos` deve continuar pausado por ja ter fechado um recorte validado e por poder encostar em calendario, modais, salvar, excluir, `requestJson`, payload, pacientes, agenda, financeiro, recebimentos, procedimentos, prestadores e permissoes.
- Os demais candidatos ficaram em segundo plano por maior risco funcional, maior impacto transversal ou menor clareza de fronteira.
- A proxima subetapa deve ser somente contrato profundo, sem implementacao.

## 7. Limites da proxima subetapa

- Nao implementar nada diretamente.
- Criar contrato profundo.
- Mapear funcoes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, permissoes e teste.
- Recomendar no maximo um recorte medio futuro.
- Manter blindagem textual/mojibake.

## 8. Registro para roadmap

- A consolidacao de `Convênios e Planos` foi registrada como concluida.
- A nova matriz comparativa apos a pausa de `Convênios e Planos` foi aberta.
- Os criterios adotados foram registrados.
- A frente recomendada foi `Medicamentos`.
- A proxima subetapa recomendada continua sendo apenas contrato profundo.
- Os limites da Fase 2B permanecem vigentes.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
