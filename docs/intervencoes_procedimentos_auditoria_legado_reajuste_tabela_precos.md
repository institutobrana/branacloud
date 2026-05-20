# Auditoria somente leitura - resgate do botao "% Reajusta tabela..."

## Resumo executivo

Esta auditoria confirmou que o botao `% Reajusta tabela...` existe no web atual e tambem aparece no legado local, mas o comportamento encontrado nas fontes analisadas e o mesmo: o handler esta como stub e nao foi localizado um modal funcional nem uma rota backend dedicada para reajuste de tabela de precos.

No legado consultado, foi localizada apenas a referencia funcional/administrativa do nome `Reajustar tabela` em arquivos de permissao e a presenca do botao na interface, mas nao foi encontrado o formulario completo "Reajusta tabela de precos" com execucao real da regra. Assim, o resgate documental identifica a intencao da feature, mas nao recupera a regra operacional completa a partir das fontes acessiveis.

## Diagnostico do web atual

### Botao

O botao existe em `frontend/index.html` com o id `proc-btn-reajuste` e o texto `% Reajusta tabela...`.

### Bind

Em `frontend/app.js`, o botao esta ligado ao handler `procReajustarTabela` por `addEventListener("click", ...)`.

### Stub

A funcao `procReajustarTabela` existe, mas apenas escreve uma mensagem de planejamento no rodape da tela. Nao abre modal, nao faz preview e nao aplica reajuste.

### Modal

Nao foi localizado modal web funcional para reajuste de tabela nas fontes consultadas.

### Endpoint

Nao foi localizada rota backend especifica para este fluxo.

## Diagnostico do legado

### Fontes encontradas

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\backup_estavel_saas_20260409_220613\saas\frontend\app.js`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\backup_estavel_saas_20260409_220613\saas\frontend\index.html`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\sis_funcao.csv`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\permissoes_eds70.csv`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\permissoes_eds70.xlsx`

### Funcao / evento encontrado

No legado consultado, o mesmo padrao foi encontrado:

- o botao `% Reajusta tabela...` esta presente;
- o bind aponta para `procReajustarTabela`;
- a funcao `procReajustarTabela` tambem e um stub;
- nao foi localizado formulario legado funcional correspondente dentro dos arquivos de frontend e backend analisados.

### Regra de calculo

Nao foi possivel resgatar, a partir das fontes acessiveis nesta auditoria, a formula efetiva do reajuste de precos, nem os detalhes de arredondamento, confirmacao, rollback ou aplicacao em massa.

### Tabela / campos alterados

Nao foi localizado no codigo consultado um endpoint ou rotina capaz de confirmar quais campos eram alterados no legado. A intencao funcional sugerida pelo nome e reajuste da tabela de precos atual, mas a regra precisa de fonte adicional para ser reconstruida com seguranca.

### Confirmacao / rollback / log

Nao foram encontrados elementos de confirmacao, preview, rollback ou log operacional no fluxo estudado.

## Comparacao legado x web

O que foi visto no legado e no web atual e estruturalmente o mesmo:

- botao presente;
- bind presente;
- stub presente;
- modal ausente nas fontes consultadas;
- endpoint especifico ausente nas fontes consultadas.

Ou seja, o legado acessivel nao trouxe uma implementacao completa que possa ser portada com confianca para o web.

## Riscos de implementacao

- alteracao em massa de precos sem preview adequado;
- arredondamento divergente entre desktop e web;
- tratamento incorreto de preco nulo, zero ou vazio;
- aplicacao na tabela errada;
- ausencia de rollback ou confirmacao explicita;
- impacto em calculo financeiro e listas derivadas;
- risco de introduzir comportamento novo sem base documental suficiente.

## Recomendacao objetiva

Nao implementar ainda. A base acessivel mostra apenas a intencao da funcionalidade, nao a regra completa.

A proxima etapa segura e separar uma investigacao complementar para localizar a regra real do reajuste em outra fonte legada, ou definir primeiro um fluxo de preview/confirmacao antes de qualquer aplicacao de preco.

## Proposta de proxima etapa, sem executar

1. Recolher mais evidencias do legado sobre a formula de reajuste, se existirem.
2. Definir um modal web com preview antes de aplicar.
3. Exigir confirmacao explicita do usuario.
4. Criar endpoint backend apenas quando a regra estiver fechada.
5. Cobrir com testes manuais para:
   - tabela selecionada;
   - aumento percentual;
   - diminuicao percentual;
   - valores nulos/zero;
   - cancelamento sem persistencia;
   - reload da lista apos aplicacao.

## Onde testar futuramente

Quando houver implementacao segura, testar em:

`Configuracoes > Tabelas > Intervencoes / Procedimentos...`

Validações recomendadas:

- abrir o modal de reajuste;
- cancelar sem efeito;
- aplicar em tabela selecionada;
- conferir recarga da lista;
- revisar console e rede;
- comparar antes/depois com preview.

## Observacoes finais

Esta auditoria foi somente leitura.
Nao houve alteracao de codigo, banco, schema, migrations ou endpoints.
Nao houve saneamento, reajuste real, nem operacao destrutiva.
