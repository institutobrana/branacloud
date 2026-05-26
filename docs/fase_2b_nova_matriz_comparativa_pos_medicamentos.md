# Fase 2B - Nova matriz comparativa apos pausa de Medicamentos

## 1. Identificacao da etapa

- Fase 2B.
- Nova matriz comparativa.
- Pos-contrato profundo de `Medicamentos`.
- Etapa exclusivamente documental.

## 2. Motivo da nova matriz

- `Preferências` ja entregou recortes validados e foi pausada.
- `Prestadores` ja entregou recorte validado e foi pausado.
- `Convênios e Planos` ja entregou recorte validado, teve anomalia pontual tratada e foi pausado.
- `Medicamentos` passou por contrato profundo e foi pausado sem implementacao, por acoplamento com Assistente de receitas, editor, documento gerado, receituario, `requestJson`, payload, salvamento, exclusao, endpoints, pacientes e atendimentos.
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
| `Ficha pessoal` | comum/core transversal | nao identifiquei modulo dedicado claro | alto | alto | alto | sim/provavel | sim/provavel | sim/provavel | sim/provavel | sim/provavel | alto | alto | medio | alto | alto | claro | medio | sim | sim, com cautela | nao agora |
| `Conta corrente` | comum/core transversal | nao identifiquei modulo dedicado claro | alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | baixo/medio | alto | medio | claro | simples | sim | possivel, mas cautela | evitar por enquanto |
| `Indices financeiros` | comum/core transversal | nao identifiquei modulo dedicado claro | medio/alto | medio/alto | medio | sim | sim | sim | sim | sim | alto | alto | baixo/medio | alto | medio | claro | simples | sim | possivel, mas cautela | evitar por enquanto |
| `Materiais` | comum/core transversal | sim | alto | alto | alto | sim | sim | sim | sim | sim | alto | medio/alto | medio | alto | alto | medio | medio | sim | possivel, mas alto risco | evitar por enquanto |
| `Agenda principal remanescente` | comum/core transversal | utilitarios existem, bloco nao e pequeno | muito alto | muito alto | muito alto | sim | sim | sim | sim | sim | alto | alto | medio | muito alto | alto | medio | dificil | sim | possivel, mas alto risco | Fase 3 / estrutural |
| `Procedimentos genéricos` | especifico de area profissional | sim | alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | medio | medio | sim | possivel, mas alto risco | Fase 3 / estrutural |
| `Relatórios` | comum/core transversal | nao evidente | alto | alto | alto | possivel | sim | sim | sim | sim | alto | alto | baixo/medio | muito alto | alto | medio | medio | sim | baixo | Fase 3 / estrutural |
| Retomar `Preferências` | comum/core transversal | sim | baixo/medio | medio | medio | sim | nao | nao | nao | nao | baixo | baixo | alto (se reabrir demais) | medio | medio | claro | simples | sim | sim, mas pausado | pausar |
| Retomar `Prestadores` | especifico de area profissional | sim | medio/alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | claro | medio | sim | sim, mas pausado | pausar |
| Retomar `Convênios e Planos` | comum/core transversal | sim | medio/alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | claro | medio | sim | sim, mas pausado | pausar |
| Retomar `Medicamentos` | comum/core transversal | sim | alto | alto | alto | sim | sim | sim | sim | sim | alto | alto | medio | alto | alto | claro, mas sensivel | dificil | sim | nao agora | pausar |

## 5. Ranking de seguranca

### Mais adequados para proximo contrato profundo

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
- `Medicamentos`

## 6. Recomendacao de proxima frente

- A frente recomendada para o proximo contrato profundo e `Ficha pessoal`.
- A classificacao fica como `comum/core transversal`.
- A escolha foi feita porque e a opcao restante com melhor equilibrio entre risco, ganho e fronteira documental, ainda que continue sensivel por envolver cadastro clinico.
- `Preferências` deve continuar pausada por ja ter fechado dois recortes validos.
- `Prestadores` deve continuar pausado por ja ter fechado um recorte validado e por poder encostar em modal, salvar, excluir, agenda, credenciamento, comissoes, permissoes e backend.
- `Convênios e Planos` deve continuar pausado por ja ter fechado um recorte validado e por poder encostar em calendario, modais, salvar, excluir, `requestJson`, payload, pacientes, agenda, financeiro, recebimentos, procedimentos, prestadores e permissoes.
- `Medicamentos` deve continuar pausado porque o contrato profundo concluiu que nao existe recorte medio suficientemente seguro agora.
- Os demais candidatos ficaram em segundo plano por maior risco funcional, maior impacto transversal ou menor clareza de teste.
- A proxima subetapa deve ser somente contrato profundo, sem implementacao.

## 7. Limites da proxima subetapa

- Nao implementar nada diretamente.
- Criar contrato profundo.
- Mapear funcoes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, permissoes e teste.
- Recomendar no maximo um recorte medio futuro.
- Manter blindagem textual/mojibake.

## 8. Registro para roadmap

- O contrato profundo de `Medicamentos` foi concluido sem implementacao.
- A nova matriz comparativa apos `Medicamentos` foi aberta.
- Os criterios adotados foram registrados.
- A frente recomendada foi `Ficha pessoal`.
- A proxima subetapa recomendada continua sendo apenas contrato profundo.
- Os limites da Fase 2B permanecem vigentes.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
