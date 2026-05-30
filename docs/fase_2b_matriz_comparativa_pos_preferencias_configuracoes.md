# Matriz comparativa - Proxima frente apos Preferencias / Configuracoes

## Contexto
- `Preferencias / Configuracoes` foi consolidada como frente estavel.
- A crise de banco/cluster foi encerrada operacionalmente e o PostgreSQL 17 segue oficial.
- O objetivo desta etapa e comparar as frentes candidatas e escolher a proxima trilha mais segura.
- Esta etapa e somente documental e nao altera codigo, banco ou servicos.

## Estado do monolito
- `frontend/app.js` tem cerca de `24.256` linhas e `1.778.966` bytes.
- O arquivo segue concentrando a orquestracao global da aplicacao, com login, permissões, menus, modais, fallback visual e varios blocos funcionais ainda centralizados.
- Blocos grandes remanescentes relevantes no `app.js`:
  - `users/admin` e painel de superadmin;
  - `materiais`;
  - `procedimentos` e `procedimentos genericos`;
  - `convênios e planos`;
  - `prestadores`;
  - `plano de contas`;
  - `auxiliares`;
  - `conta corrente` e fluxo financeiro;
  - `agenda` principal/legado/contatos/semana;
  - `simbolos graficos`;
  - `anamnese`;
  - `editor de textos`;
  - `indices financeiros`;
  - `tabela de proteticos`;
  - `relatorios`;
  - `ficha pessoal`.
- Modulos ja extraidos em `frontend/js/modules` incluem, entre outros:
  - `preferencias-opcoes-sistema.js`
  - `prestadores.js`
  - `medicamentos.js`
  - `convenios-planos.js`
  - `plano-contas.js`
  - `auxiliares.js`
  - `etiquetas.js`
  - `simbolos-graficos.js`
  - `editor_textos_bootstrap.js`
  - `anamnese.js`
  - `cid.js`
  - `unidades.js`
  - `users-admin-modal-visual.js`
  - `tabela-proteticos-helpers.js`
  - `agenda-contatos-listagem.js`
  - `agenda-contatos-telefones.js`
  - `agenda-principal-legado-utils.js`
  - `agenda-principal-semana-utils.js`

## Frentes comparadas

| Frente | Classificacao multiarea | Estado atual | Risco | Beneficio | Facilidade de teste | Recomendacao |
|---|---|---|---|---|---|---|
| Cadastros auxiliares | comum/core | modulo parcial ja existente em `auxiliares.js`, com scaffold compartilhado com Plano de Contas | baixo-medio | medio | media | documentar apenas, sem priorizar agora |
| Prestadores | especifica de area profissional | modulo parcial ja existente em `prestadores.js`, com fluxo ainda sensivel de lista, selecao e acoes | medio | alto | alta | **candidato principal** |
| Medicamentos | especifica de area profissional | modulo parcial ja existente em `medicamentos.js`, com lista, filtros, modal e exclusao | medio-alto | medio | media | pausar por enquanto |
| Ficha pessoal | mista | bloco ainda centralizado no `app.js`, sem fronteira pequena e limpa nesta leitura | alto | medio | media-baixa | pausar por enquanto |
| Conta corrente | mista / financeira | bloco financeiro ainda concentrado no monolito | alto | medio | media-baixa | pausar por enquanto |
| Convenios e Planos | mista | modulo parcial ja existe em `convenios-planos.js`, mas o restante segue sensivel | medio-alto | medio-alto | media | pausar por enquanto |
| Relatorios | plataforma/admin | superficie ampla e sensivel, com acoplamento cruzado | critico | alto | baixa | evitar por enquanto |
| Indices financeiros | mista / financeira | area sensivel de cotacoes e migracoes | alto | medio | baixa-media | evitar por enquanto |
| Agenda principal | mista | blocos grandes e espalhados no `app.js` | critico | alto | baixa | evitar por enquanto |
| Tabela de proteticos | especifica de area profissional | frente parcial e sensivel, com controles e servicos de protese | medio-alto | medio | media | pausar por enquanto |
| Usuarios/Admin | plataforma/admin | area critica de seguranca e permissao, muito centralizada | critico | alto | media-baixa | evitar por enquanto |
| Editor de texto | mista | superficie rica, com iframe, preview e interacoes complexas | alto | medio | baixa | evitar por enquanto |
| Etiquetas | comum/core | modulo parcial ja existe, mas a rodada ja esta consolidada | medio | medio | media | documentar apenas |
| Plano de contas | mista / financeira | modulo parcial ja existe, mas a rodada ja esta consolidada | medio-alto | medio | media | documentar apenas |
| Preferencias / Configuracoes | comum/core | frente consolidada e estavel; usada apenas como referencia | baixo | alto | alta | referencia, nao candidata principal |

## Frentes evitadas no momento
- `Relatorios`
- `Agenda principal`
- `Usuarios/Admin`
- `Conta corrente`
- `Indices financeiros`
- `Editor de texto`
- `Tabela de proteticos`
- `Medicamentos`
- `Convenios e Planos`
- `Ficha pessoal`
- `Materiais`
- `Procedimentos genericos`

Motivos principais:
- risco funcional alto;
- dependencia forte de backend/payload/salvamento;
- acoplamento com financeiro, agenda, editor ou seguranca;
- superficie de regressao maior do que o ganho imediato.

## Decisao da matriz
- Decisao final: `MATRIZ-B`.
- Existe uma proxima frente adequada para abrir contrato profundo com subetapas muito pequenas.
- A frente escolhida e `Prestadores remanescentes`.

## Proxima frente recomendada
- Frente: `Prestadores remanescentes`.
- Por que foi escolhida:
  - existe modulo parcial dedicado;
  - a fronteira e mais legivel do que agenda, financeiro e usuarios/admin;
  - o risco e menor que o de modulos mais pesados;
  - o ganho para reduzir `app.js` e real sem ampliar risco em areas sensiveis.
- Recorte inicial sugerido:
  - abrir contrato profundo para o restante de `Prestadores`;
  - mapear primeiro o bloco de lista, selecao, acoes e carregamento visual;
  - manter o corte fora de agenda, convenios, comissoes e qualquer mutacao imediata.
- Deve comecar por contrato profundo? Sim.
- Fronteiras proibidas iniciais:
  - `requestJson`;
  - payload e salvamento;
  - agenda;
  - convenios e comissoes;
  - permissões;
  - backend;
  - banco;
  - `frontend/index.html`;
  - `sysOpt*`;
  - qualquer mutacao funcional.

## Onde testar futuramente
- Tela `Cadastro de prestadores`.
- Lista e selecao de prestadores.
- Filtros e abertura/fechamento do painel.
- Acoes de agenda, convenios e comissoes apenas como nao-regressao visual futura, sem ampliar escopo no primeiro recorte.

## Observacao sobre Simbolos Graficos
- `Simbolos graficos` foi lido como apoio documental, mas nao entrou como frente principal desta matriz porque o editor, o `iframe` e o `postMessage` deixam a superficie mais sensivel do que `Prestadores` nesta rodada.

## Confirmações de escopo
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend nao foi alterado.
- `.env` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- PostgreSQL 18 nao foi excluido/desativado.
- Backups foram preservados.
- A blindagem textual/mojibake foi respeitada.

## Registro para roadmap
- Matriz comparativa pos-Preferencias / Configuracoes executada.
- Frentes comparadas e classificadas.
- Decisao `MATRIZ-B`.
- Proxima frente recomendada: `Prestadores remanescentes`.
- Nenhuma alteracao de codigo ou banco.
- Documento criado para registrar a escolha conservadora.
