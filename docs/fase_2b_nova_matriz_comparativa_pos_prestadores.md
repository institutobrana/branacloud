# Fase 2B - Nova matriz comparativa apos pausa de Prestadores

## 1. Identificacao da etapa
- Fase 2B.
- Nova matriz comparativa.
- Pos-consolidacao parcial de Prestadores.
- Etapa exclusivamente documental.

## 2. Motivo da nova matriz
- `Preferencias` ja entregou dois recortes validados e foi pausada.
- `Prestadores` entregou um recorte validado e foi pausado.
- Continuar automaticamente em qualquer uma dessas frentes aumenta o risco de encostar em areas sensiveis ou de persistencia.
- A proxima decisao precisa comparar frentes novamente.
- Nao deve haver implementacao direta nesta etapa.

## 3. Criterios de decisao
- menor contato com backend;
- menor contato com `requestJson`;
- menor contato com payload;
- menor contato com salvamento;
- menor contato com exclusao;
- menor contato com permissoes;
- menor risco textual/mojibake;
- teste manual claro;
- rollback mental simples;
- ganho real de organizacao do `app.js`;
- possibilidade de contrato profundo objetivo;
- possibilidade de recorte medio pequeno.

## 4. Matriz comparativa

| Candidato | Classe | Modulo em `frontend/js/modules` | Tamanho/DOM/eventos | `requestJson` / payload / save / delete | backend / permissoes | texto/mojibake | risco funcional | ganho esperado | teste / rollback | Contrato profundo? | Implementacao futura? | Evitar por enquanto? | Fase 3/estrutural? | Decisao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Ficha pessoal | especifica, mas transversal | nao | bloco grande; muitos campos, modal e eventos de formulario | alto; existe carga, salvamento e exclusao | alto; cadastro e possiveis relacoes com backend | medio | medio-alto | medio | teste claro, rollback simples, mas com muitos campos | sim, se muito bem recortado | sim, mas com cautela | sim | nao | possivel, mas nao a mais segura |
| Conta corrente | comum/core transversal | nao | grande; painel, modal, filtros e grid | alto; salva e exclui lancamentos | alto; financeiro e backend | medio | alto | medio | teste claro, rollback simples | sim | sim, com cautela | sim | nao | evitar por enquanto se houver opcao mais segura |
| Indices financeiros | comum/core transversal | nao | medio; modal e duas grades | alto; cria/altera/exclui/migra | alto; financeiro e exclusoes | medio | alto | medio | teste claro, rollback simples | sim | sim, mas com cautela | sim | possivelmente | evitar por enquanto |
| Medicamentos | especifica/mixta | sim | grande; lista, modal, editor e abas | alto; carrega opcoes, salva e exclui | alto; endpoints variados e busca backend-driven | alto | alto | medio | teste claro, rollback simples, mas muita superficie | sim, mas com cuidado | sim, mas com cautela | sim | nao | possivel, mas abaixo de Convênios |
| Convenios e Planos | comum/core transversal | sim | medio-grande; listas, modais e calendario | alto; carrega combos, salva e exclui | alto; cruza pacientes, agenda e financeiro | medio | medio-alto | alto | teste claro, rollback simples | sim | sim, com cuidado | sim | nao | **recomendado** |
| Agenda principal remanescente | comum/core transversal | sim (utils) | muito grande; eventos, drag/drop, modais e vistas | alto; agenda e bloqueios usam varias rotas | muito alto; agenda, prestador, unidade, tenant | medio | muito alto | alto, mas com risco demais | teste complexo, rollback possivel mas caro | sim, mas nao agora | sim, mas deve esperar | sim | sim | evitar por enquanto |
| Relatorios | comum/core transversal | nao evidente | muito grande; preview, templates e exportacoes | alto; geralmente persiste configuracoes | alto; backend e possiveis acessos amplos | medio | muito alto | alto | teste mais amplo; rollback dificil | sim, mas nao agora | possivel, mas nao nesta fase | sim | sim | ficar para Fase 3 / estrutural |
| Materiais | comum/core transversal | sim | grande; lista, filtros, modal principal e modal de tabela | alto; carrega, salva, exclui e abre modais | alto; materiais, procedimentos e tabelas | medio | alto | medio-alto | teste claro, rollback medio | sim | sim, com cautela | sim | possivelmente | evitar por enquanto |
| Procedimentos genericos | comum/core transversal | sim | grande; painel, editor e vinculos | alto; payload e persistencia sensiveis | alto; materiais, fases, agenda e procedimentos | medio | muito alto | alto | teste mais complexo, rollback mais chato | sim, mas com cautela extrema | sim, mas melhor esperar | sim | sim | evitar por enquanto |
| Retomar Preferencias | comum/core transversal | sim | medio; parte do visual ja saiu, mas sobrou fluxo sensivel | alto; `requestJson`, payload e save continuam fora | alto; backend, permissoes e configs | medio | medio-alto | medio | teste ja conhecido, rollback simples | sim, mas nao agora | sim, mas continuar agora encosta em proibidos | sim | nao | continuar pausado |
| Retomar Prestadores | especifica de area profissional | sim | medio; parte da lista saiu, mas sobrou modal e fluxos adjacentes | alto; save, delete, agenda, credenciamento e comissoes proximos | alto; backend, permissoes e fluxos sensiveis | medio | medio-alto | medio | teste ja conhecido, rollback simples | sim, mas nao agora | sim, mas continuar agora encosta em proibidos | sim | nao | continuar pausado |

## 5. Ranking de seguranca

### Mais adequados para proximo contrato profundo
- `Convenios e Planos`
- `Medicamentos`, apenas como segunda leitura e com mais cautela que `Convenios e Planos`

### Possiveis, mas exigem cautela
- `Ficha pessoal`
- `Conta corrente`
- `Indices financeiros`
- `Materiais`

### Devem ser evitados por enquanto
- `Agenda principal remanescente`
- `Procedimentos genericos`
- `Medicamentos`, se a leitura priorizar o editor/receitas como bloco dominante

### Devem ficar para Fase 3 ou etapa estrutural
- `Relatorios`

### Devem continuar pausados
- `Preferencias`
- `Prestadores`

## 6. Recomendacao de proxima frente
- Frente recomendada: `Convenios e Planos`.
- Classificacao: comum/core transversal.
- Motivos:
  - ja existe modulo em `frontend/js/modules/convenios-planos.js`;
  - a fronteira funcional e mais legivel do que Agenda, Relatorios, Procedimentos ou Financeiro puro;
  - e transversal, mas ainda tem contorno documental mais previsivel do que Ficha pessoal ou Conta corrente;
  - permite manter `Preferencias` e `Prestadores` pausados sem ampliar risco neles.
- Por que `Preferencias` deve continuar pausada:
  - os dois recortes ja foram validados;
  - continuar agora encosta em `sysOpt*`, `Odontograma`, `requestJson`, payload e salvamento.
- Por que `Prestadores` deve continuar pausado:
  - o primeiro recorte ja foi validado;
  - continuar agora encosta em modal, salvar, excluir, agenda, credenciamento, comissoes, permissoes e backend.
- Por que os demais candidatos ficaram em segundo plano:
  - `Ficha pessoal` e `Conta corrente` encostam rapido em persistencia e dados sensiveis;
  - `Indices financeiros` e `Relatorios` aumentam risco operacional e estrutural;
  - `Materiais` e `Procedimentos genericos` sao amplos e altamente acoplados;
  - `Agenda principal remanescente` e grande demais para o proximo passo;
  - `Medicamentos` e viavel, mas a superficie de editor/receitas e mais sensivel.
- Proxima subetapa recomendada: somente contrato profundo em `Convenios e Planos`, sem implementacao direta.

## 7. Limites da proxima subetapa
- Nao deve implementar nada diretamente;
- deve criar contrato profundo;
- deve mapear funcoes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, permissoes e teste;
- deve recomendar no maximo um recorte medio futuro;
- deve manter blindagem textual/mojibake.

## 8. Registro para roadmap
- A consolidacao de `Prestadores` ja foi concluida.
- A nova matriz comparativa apos `Prestadores` foi aberta.
- Os criterios adotados foram registrados.
- A frente recomendada ficou em `Convenios e Planos`.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao.
- Os limites da Fase 2B continuam vigentes.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
