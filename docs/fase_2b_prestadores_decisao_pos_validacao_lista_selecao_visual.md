# Decisao - Prestadores apos validacao da lista e selecao visual

## 1. Contexto

- A matriz comparativa escolheu `Prestadores remanescentes`.
- O contrato profundo foi aberto para a frente.
- A implementacao minima de lista e selecao visual foi feita.
- A validacao manual foi aprovada.

## 2. Estado consolidado

- lista visual validada;
- selecao visual validada;
- `prestSelecionarLinhaVisual` validado;
- modulo passivo em uso conservador;
- areas sensiveis preservadas.

## 3. Candidatos restantes avaliados

| Candidato | Area/Função | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- |
| filtros locais simples | `prestFiltrarLista` / filtros de tela | médio | médio | pode virar novo contrato pequeno apenas se houver necessidade clara |
| shell visual / abertura e fechamento | `prestEnsureUI` / `prestAbrir` | baixo-médio | médio | pode entrar em contrato futuro, mas nao agora |
| pequenos helpers visuais ja existentes | `prestRenderLista`, `prestStatusHtml`, `prestFmtCodigo` | baixo | alto | ja consolidados como suporte visual |
| acoes/botoes de placeholder | `prestAcoesPlaceholder`, Agenda, Convenios, Comissoes | medio-alto | baixo | bloqueado por sensibilidade |
| carregamento remoto | `prestCarregar`, `requestJson` | alto | alto | bloqueado nesta rodada |
| payload / salvamento | fluxos de mutacao | alto | alto | bloqueado nesta rodada |
| permissões | escopo de acesso | alto | medio | bloqueado nesta rodada |

## 4. Caminhos comparados

### Caminho A
- continuar em `Prestadores` com novo contrato pequeno;
- beneficio: continuidade da frente escolhida pela matriz;
- risco: candidatos podem encostar em filtros, estado, shell ou areas sensiveis;
- exigencia: contrato profundo especifico antes de qualquer codigo.

### Caminho B
- pausar `Prestadores` e voltar a matriz comparativa;
- beneficio: evita aprofundar demais em frente mista;
- risco: troca de contexto;
- indicado se os proximos candidatos forem todos de risco medio/alto.

### Caminho C
- consolidar `Prestadores` como parcialmente validado e exigir novo contrato profundo antes de qualquer novo avanco;
- beneficio: preserva o que ja foi validado sem continuidade automatica;
- risco controlado;
- indicado quando ainda ha candidatos pequenos, mas o contexto ja chegou em areas sensiveis.

## 5. Decisao conservadora

**Decisao:** `PREST-DEC-C`

## 6. Justificativa

- O recorte visual ja foi validado e consolidado.
- A frente `Prestadores` e mista, entao a proximidade com filtros, shell, acoes e carregamento remoto exige cautela.
- Os proximos candidatos nao devem ser implementados automaticamente sem um novo contrato explicito.
- A decisao conserva o ganho obtido e evita ampliar risco sem necessidade.

## 7. Proxima etapa recomendada

- consolidar `Prestadores` como parcialmente validado;
- exigir nova auditoria/contrato profundo antes de qualquer novo avanco;
- nao iniciar novo recorte automaticamente.

## 8. Onde testar futuramente

- painel de Prestadores;
- lista principal;
- selecao visual;
- filtros;
- abertura/fechamento;
- Agenda/Convenios/Comissoes apenas como nao-regressao, salvo se forem alvo futuro especifico.

## 9. Confirmacoes de escopo

- nenhum codigo alterado;
- nenhum dado de banco alterado;
- frontend/app.js nao alterado;
- frontend/index.html nao alterado;
- frontend/js/modules nao alterado;
- backend nao alterado;
- `.env` nao alterado;
- banco/schema/migrations/seeds/endpoints nao alterados;
- PostgreSQL 18 nao excluido/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 10. Registro para roadmap

Prestadores ficou consolidado como parcialmente validado apos a lista e selecao visual, com decisao `PREST-DEC-C` e nova auditoria/contrato exigidos antes de qualquer avanco adicional.
