# Fase 2B - Nova matriz comparativa apos pausa de Ficha pessoal

## 1. Identificacao da etapa
- Fase 2B.
- Nova matriz comparativa.
- Pos-contrato profundo de `Ficha pessoal`.
- Etapa exclusivamente documental.

## 2. Auditoria leve inicial
- Branch atual: `modularizacao-segura-fase-1`.
- Status do working tree: havia apenas untracked antigos em `docs/`, sem alteracao de codigo nesta auditoria.
- Ultimos commits no topo do historico local: `09544fc`, `8b68db1`, `db5fc02`, `d7b6280`, `c004836`.
- O commit `09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` aparece no historico recente.
- `git show --name-only --stat --oneline 09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` confirmou exatamente dois arquivos no commit:
  - `docs/11_roadmap_desenvolvimento.md`
  - `docs/fase_2b_ficha_pessoal_contrato_profundo.md`
- A indicacao visual de “4 arquivos editados” parece duplicidade de interface/summary e nao bate com o conteudo real do commit.

## 3. Motivo da nova matriz
- `Preferências`, `Prestadores` e `Convênios e Planos` ja entregaram recortes validados e foram pausados.
- `Medicamentos` foi avaliado em contrato profundo e pausado sem implementacao.
- `Ficha pessoal` foi avaliada em contrato profundo e pausada sem implementacao.
- Continuar automaticamente em qualquer uma dessas frentes pode aumentar o risco.
- A proxima decisao precisa comparar as frentes restantes novamente.
- Nao deve haver implementacao direta.

## 4. Criterios de decisao
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

## 5. Matriz comparativa

| Candidato | Classificacao | Modulo em `frontend/js/modules` | Tamanho provavel no `app.js` | DOM / eventos / modal | `requestJson` / payload / save / delete | Backend / endpoints / permissoes | Risco textual / funcional | Ganho esperado | Teste / rollback | Contrato profundo | Implementacao futura | Decisao |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|
| `Conta corrente` | comum/core transversal | nao identifiquei modulo dedicado claro | alto | alto / alto / sim | sim / sim / sim / sim | alto / alto / alto | baixo / medio | medio-alto | claro / simples | sim | sim, com cautela | melhor opcao restante |
| `Indices financeiros` | comum/core transversal | nao identifiquei modulo dedicado claro | medio-alto | medio-alto / medio-alto / sim | sim / sim / sim / sim | alto / alto / alto | baixo / medio | medio | claro / simples | sim | sim, com cautela | possivel, mas depois |
| `Materiais` | comum/core transversal | sim | alto | alto / alto / sim | sim / sim / sim / sim | alto / medio-alto / medio | medio / alto | medio | claro / medio | sim | sim, mas com cautela | evitar por enquanto |
| `Agenda principal remanescente` | comum/core transversal | sim, utils relacionados | muito alto | muito alto / muito alto / sim | sim / sim / sim / sim | alto / muito alto / alto | medio / alto | alto | teste dificil / rollback caro | sim | sim, mas nao agora | Fase 3 / estrutural |
| `Procedimentos genericos` | comum/core transversal | sim | alto | alto / alto / sim | sim / sim / sim / sim | alto / alto / alto | medio / alto | medio | mais complexo / rollback medio | sim | sim, mas melhor esperar | evitar por enquanto |
| `Relatorios` | comum/core transversal | nao identifiquei modulo dedicado claro | muito alto | muito alto / muito alto / possivel | sim / possivel / possivel / possivel | alto / alto / alto | medio / muito alto | alto | amplo / rollback dificil | sim | sim, mas nao nesta fase | Fase 3 / estrutural |
| Retomar `Preferencias` | comum/core | sim | medio | medio / medio / sim | nao / nao / nao / nao | baixo / baixo / baixo | baixo | medio | claro / simples | nao agora | nao agora | pausado |
| Retomar `Prestadores` | especifico de area profissional | sim | medio-alto | alto / alto / sim | sim / sim / sim / sim | alto / alto / alto | medio | medio | claro / medio | nao agora | nao agora | pausado |
| Retomar `Convênios e Planos` | comum/core transversal | sim | alto | alto / alto / sim | sim / sim / sim / sim | alto / alto / alto | medio | medio | claro | nao agora | nao agora | pausado |
| Retomar `Medicamentos` | comum/core transversal | sim | alto | alto / alto / sim | sim / sim / sim / sim | alto / alto / alto | medio / alto | medio | claro, mas sensivel | nao agora | nao agora | pausado |
| Retomar `Ficha pessoal` | comum/core transversal | nao identifiquei modulo dedicado claro | alto | alto / alto / sim | sim / sim / sim / sim | muito alto / muito alto / muito alto | medio / alto | medio | claro, mas complexo | nao agora | nao agora | pausado |

## 6. Ranking de seguranca
- **Mais adequados para proximo contrato profundo**
  - `Conta corrente`
- **Possiveis, mas exigem cautela**
  - `Indices financeiros`
- **Devem ser evitados por enquanto**
  - `Materiais`
  - `Procedimentos genericos`
- **Devem ficar para Fase 3 ou etapa estrutural**
  - `Agenda principal remanescente`
  - `Relatorios`
- **Pausados e mantidos em espera**
  - `Preferencias`
  - `Prestadores`
  - `Convênios e Planos`
  - `Medicamentos`
  - `Ficha pessoal`

## 7. Recomendacao de proxima frente
- A frente recomendada e `Conta corrente`.
- Classificacao: `comum/core transversal`.
- Foi escolhida porque ainda apresenta ganho real de organizacao do `app.js`, com fronteira documental mais legivel do que `Materiais`, `Agenda`, `Relatorios` e os blocos financeiros mais amplos.
- `Preferencias` deve continuar pausada porque ja esgotou o ciclo seguro desta rodada.
- `Prestadores` deve continuar pausado porque ja fechou um recorte validado e possui conexoes sensiveis com agenda, convenios, comissoes, permissao e backend.
- `Convênios e Planos` deve continuar pausado porque ja foi validado e consolidado, e a fronteira restante encosta em calendario, modais, pacientes, financeiro e persistencia.
- `Medicamentos` deve continuar pausado porque o contrato profundo concluiu que nao ha recorte medio suficientemente seguro agora.
- `Ficha pessoal` deve continuar pausada porque o contrato profundo concluiu que nao ha recorte medio suficientemente seguro nesta rodada.
- Os demais candidatos ficaram em segundo plano por sensibilidade financeira, tamanho do bloco, risco funcional ou acoplamento estrutural.
- A proxima subetapa deve ser apenas um contrato profundo em `Conta corrente`, sem implementacao direta.

## 8. Limites da proxima subetapa
- Nao deve implementar nada diretamente.
- Deve criar contrato profundo.
- Deve mapear funcoes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, permissoes e teste.
- Deve recomendar no maximo um recorte medio futuro.
- Deve manter blindagem textual/mojibake.

## 9. Registro para roadmap
- O contrato profundo de `Ficha pessoal` foi concluido sem implementacao.
- A auditoria leve do commit anterior foi registrada e confirmou exatamente dois arquivos no commit `09544fc6`.
- A nova matriz comparativa apos `Ficha pessoal` foi aberta.
- Os criterios adotados foram os mesmos de prudencia da Fase 2B: menor contato com backend, `requestJson`, payload, salvamento, exclusao, permissoes, texto visivel e mojibake.
- A frente recomendada e `Conta corrente`.
- A proxima subetapa recomendada e apenas contrato profundo, sem implementacao.
- Os limites vigentes da Fase 2B permanecem.
- Nenhuma implementacao foi feita.
