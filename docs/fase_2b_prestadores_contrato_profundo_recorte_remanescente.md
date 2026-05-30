# Contrato profundo - Prestadores remanescentes

## 1. Contexto

- A frente `Preferencias / Configuracoes` foi consolidada como estavel.
- A matriz comparativa pos-Preferencias recomendou `Prestadores remanescentes` como proxima frente.
- Este documento e somente documental e nao altera codigo nem banco.
- O objetivo e definir o menor recorte seguro possivel para uma futura retomada em `Prestadores`.

## 2. Estado atual de Prestadores

### 2.1. `frontend/app.js`

O bloco de Prestadores permanece concentrado em `frontend/app.js`, com estes pontos principais:

- `prestStatusHtml`
- `prestFmtCodigo`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`

### 2.2. `frontend/js/modules/prestadores.js`

O modulo existe e continua passivo, com namespace global `window.BranaPrestadoresModule`.

Helpers atualmente exportados no modulo:

- `meta`
- `getInfo()`
- `getStatus()`
- `prestFmtCodigo()`
- `prestSelecionado()`
- `prestFiltrarLista()`
- `prestStatusHtml()`
- `prestRenderLista()`

### 2.3. Superficie funcional visivel

- O painel de Prestadores possui lista, filtros, selecao de linha e botoes de acao.
- Os botoes `Agenda...`, `Convênios...` e `Comissões...` existem, mas representam fronteiras mais sensiveis.
- `prestCarregar` usa `requestJson("GET", "/cadastros/prestadores", ...)` e possui fallback local.
- A renderizacao da lista pode delegar para `window.BranaPrestadoresModule.prestRenderLista`.
- Acoes de `prestAcoesPlaceholder` sao apenas marcadores e nao devem ser encostadas no proximo recorte.

## 3. Matriz de risco

| Area | Avaliacao | Motivo |
| --- | --- | --- |
| Lista/render visual | Baixo | E a fronteira mais local e observavel. |
| Selecao de linha | Baixo | Opera sobre estado da tela e destaque visual. |
| Panel chrome / abrir/fechar | Baixo | Impacta apenas UX local. |
| Filtros simples | Baixo-medio | Ainda ficam na camada de interface, mas podem encostar em estado de lista. |
| Acoes de botoes | Medio-alto | Podem acionar futuras mutacoes ou caminhos adicionais. |
| `requestJson` / carregamento remoto | Alto | Encosta em backend e persistencia. |
| Payload / salvamento | Alto | Pode gerar mutacao real. |
| Agenda | Alto | Area sensivel e transversal. |
| Convenios | Alto | Area sensivel e transversal. |
| Comissoes | Alto | Area sensivel e transversal. |
| Permissoes / perfis | Alto | Pode afetar escopo e seguranca. |
| Backend / banco | Critico | Fora do contrato e fora do recorte minimo. |

## 4. Candidatos avaliados

| Candidato | Area | Tipo | Risco | Beneficio | Decisao |
| --- | --- | --- | --- | --- | --- |
| `prestRenderLista` | Lista visual | Local / DOM | Baixo | Alto | Candidato principal |
| `prestSelecionarLinha` | Selecao visual | Local / estado da tela | Baixo | Medio | Candidato de apoio |
| `prestEnsureUI` | Shell do painel | DOM estrutural | Baixo-medio | Medio | Candidato de apoio |
| `prestFiltrarLista` | Filtro local | Local / estado | Medio | Medio | Pode entrar apenas como suporte |
| `prestCarregar` | Carregamento remoto | Request / dados | Alto | Alto | Fora do recorte |
| `prestAcoesPlaceholder` | Acoes de negocio | Botao / fluxo futuro | Medio-alto | Baixo | Fora do recorte |
| Agenda / Convenios / Comissoes | Fluxos transversais | Negocio | Alto | Baixo | Fora do recorte |

## 5. Decisao

**Decisao:** `PREST-CONTRATO-A`

### Justificativa

- Existe um recorte local pequeno e claramente observavel em `Prestadores`.
- O melhor ponto de entrada e a composicao visual da lista e da selecao.
- O contrato precisa manter fora `requestJson`, payload, salvamento, agenda, convenios, comissoes, permissao, backend e banco.
- O modulo passivo ja fornece helpers suficientes para suportar um recorte minimo sem abrir areas sensiveis.

## 6. Recorte recomendado

### 6.1. Nome do recorte

`Prestadores - contrato minimo de lista e selecao visual`

### 6.2. Objetivo

- Consolidar a listagem visual de prestadores.
- Manter a selecao visual da linha.
- Preservar o shell do painel e o fechamento/abertura.
- Evitar qualquer dependencia nova com mutacao remota.

### 6.3. Fronteira permitida

- `prestRenderLista`
- `prestSelecionarLinha`
- `prestEnsureUI`
- filtros locais apenas como suporte visual
- exibicao do status e do codigo
- abertura e fechamento do painel

### 6.4. Fronteira proibida

- `prestCarregar`
- `requestJson`
- payload
- salvamento
- `prestAcoesPlaceholder`
- `Agenda...`
- `Convênios...`
- `Comissões...`
- permissões
- backend
- banco
- seeds
- schema
- `frontend/index.html`

### 6.5. Arquivos futuros permitidos

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/11_roadmap_desenvolvimento.md`
- documento de implementacao futura, se houver

### 6.6. Arquivos futuros proibidos

- `frontend/index.html`
- backend funcional
- banco/schema/migrations/seeds/endpoints
- `.env`
- scripts de migracao
- dumps e backups

## 7. Onde testar futuramente

- Abrir o painel de Prestadores.
- Conferir a lista principal.
- Conferir o destaque da linha selecionada.
- Abrir e fechar o painel.
- Recarregar a tela sem salvar nada.
- Verificar apenas como nao-regressao que Agenda / Convenios / Comissoes continuam fora do recorte.

## 8. Conclusao

- `Prestadores` tem um recorte local pequeno e seguro para a proxima etapa.
- O recorte recomendado e visual/local, sem tocar em carregamento remoto ou fluxos de negocio sensiveis.
- O contrato profundo foi fechado como base documental para uma futura implementacao minima.

## 9. Confirmacoes de escopo

- nenhum codigo alterado;
- nenhum dado de banco alterado;
- frontend/app.js nao alterado nesta etapa;
- frontend/index.html nao alterado nesta etapa;
- frontend/js/modules nao alterado nesta etapa;
- backend nao alterado nesta etapa;
- banco/schema/migrations/seeds/endpoints nao alterados nesta etapa;
- permissões/seeds nao alteradas nesta etapa;
- blindagem textual/mojibake respeitada.

## 10. Registro para roadmap

Prestadores remanescentes entrou em contrato profundo documental, com recorte minimo recomendado em lista/selecao visual, mantendo fora requestJson, payload, salvamento, agenda, convenios, comissoes, backend e banco.
