# Ficha Pessoal - Historico - Priorizacao de diferencas e backlog conservador

## 1. Objetivo

Transformar a auditoria comparativa da aba `Historico` em um backlog priorizado, seguro e executavel, sem implementar correcoes nesta etapa.

Esta frente e documental. Nao altera codigo, frontend, backend, banco, schema, migration, seed ou endpoint.

## 2. Base usada para priorizacao

- [docs/ficha_pessoal_historico_auditoria_comparativa_contrato.md](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_auditoria_comparativa_contrato.md)
- [docs/ficha_pessoal_historico_easydental_engenharia_reversa.md](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_engenharia_reversa.md)
- [docs/ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md)
- [docs/ficha_pessoal_historico_etapa_7_integracao_grava.md](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_etapa_7_integracao_grava.md)
- [docs/ficha_pessoal_historico_etapa_10_propriedades_linha.md](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_etapa_10_propriedades_linha.md)
- [frontend/js/modules/ficha-pessoal-aba-historico.js](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\ficha-pessoal-aba-historico.js)
- [frontend/app.js](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js)

## 3. Resumo executivo

O Brana Cloud ja cobre o fluxo pratico principal da aba `Historico`. A priorizacao abaixo separa o que pode virar microajuste imediato do que deve permanecer apenas documentado, do que depende de mais observacao do EasyDental e do que e estrutural e deve ficar fora da trilha de ajuste fino.

### Leituras centrais da priorizacao

- O ganho mais rapido vem de harmonizacao visual e textual pequena.
- O ganho funcional mais seguro vem de refino de origem de dados e do modal de propriedades.
- O que envolve persistencia relacional e `INTERVENCAO` e estrutural e nao deve entrar agora como microajuste fino.
- O que depende do comportamento exato do EasyDental em uso ainda nao deve ser transformado em implementacao.

## 4. Categorias de priorizacao

### Categoria 1 - Microajuste imediato de baixo risco

Critérios:

- pode ser feito em subetapa pequena;
- tende a exigir so frontend local;
- nao depende de remodelagem estrutural;
- nao depende de observacao adicional critica.

#### Diferencas alocadas nesta categoria

| Diferenca | Origem no comparativo | Impacto | Risco | Tipo | Recomendacao | Forma de correcao |
| --- | --- | --- | --- | --- | --- | --- |
| Reduzir a divergencia textual do cabecalho final `Descricao do procedimento` | Camada visual / cabecalhos | baixo | baixo | visual | executar agora | frontend visual |
| Harmonizar pequenos rótulos da toolbar se necessario | Camada visual / posicao e nome dos botoes | medio | baixo | visual | executar agora | frontend visual |
| Refino do destaque visual da linha selecionada, caso algum detalhe de contraste precise ser ajustado | Camada visual / selecao visual | baixo | baixo | visual | executar agora | frontend visual |
| Ajustes finos de alinhamento, espacamento e leitura do modal de propriedades | Camada visual / modal da linha | medio | baixo | visual | executar agora | frontend visual |

#### Observacao

Esta categoria deve priorizar ganho real de equivalencia de uso, sem abrir mudanca de regra nem de persistencia.

### Categoria 2 - Ajuste funcional de medio risco

Critérios:

- mexe em regra local;
- ainda pode ser tratado sem mexer em backend/banco, ou com impacto controlado;
- precisa de subetapas pequenas proprias.

#### Diferencas alocadas nesta categoria

| Diferenca | Origem no comparativo | Impacto | Risco | Tipo | Recomendacao | Forma de correcao |
| --- | --- | --- | --- | --- | --- | --- |
| Amarrar melhor `Cirurgiao` a um seletor/lookup coerente com o legado | Origem de dados / dependencia cruzada | medio | medio | origem de dados | executar depois | frontend regra local |
| Definir melhor a origem de `Regiao` para aproximar o comportamento do legado | Origem de dados / dependencia cruzada | medio | medio | origem de dados | executar depois | frontend regra local |
| Expor `Cor de fundo` e timestamps de forma util na janela de propriedades, se houver valor funcional | Persistencia / origem de dados | medio | medio | persistencia | executar depois | persistencia com estrutura atual |
| Refinar a disciplina de confirmacao/cancelamento local para ficar mais coerente com o uso da linha | Regra funcional / interacao | medio | medio | regra | executar depois | frontend regra local |

#### Observacao

Esta categoria e boa para microetapas pequenas, mas nao deve ser aberta antes dos ajustes visuais mais simples e das evidencias praticas adicionais sobre o legado.

### Categoria 3 - Dependente de observacao pratica adicional

Critérios:

- nao deve ser corrigido agora sem ver melhor o EasyDental em uso;
- precisa de mais evidencia antes de virar implementacao.

#### Diferencas alocadas nesta categoria

| Diferenca | Origem no comparativo | Impacto | Risco | Tipo | Recomendacao | Forma de correcao |
| --- | --- | --- | --- | --- | --- | --- |
| Fluxo exato de `TAB` / `Shift+TAB` no legado | Interacao | medio | medio | interacao | aguardar observacao pratica | apenas documentar |
| Fluxo exato de `ENTER` / `ESC` no legado | Interacao | medio | medio | interacao | aguardar observacao pratica | apenas documentar |
| Comportamento de duplo clique, se existir | Interacao | baixo | baixo | interacao | aguardar observacao pratica | apenas documentar |
| Se `Elimina linha` pede confirmacao no EasyDental | Regra funcional | baixo | baixo | regra | aguardar observacao pratica | apenas documentar |
| Se `COR` muda cor da linha ou apenas guarda contexto | Origem de dados / persistencia | medio | medio | origem de dados | aguardar observacao pratica | apenas documentar |
| Se a janela de propriedades do legado expunha campos como readonly ou editaveis | Regra funcional | medio | medio | regra | aguardar observacao pratica | apenas documentar |

#### Observacao

Essas diferencas nao devem ser forçadas como implementacao agora, porque ainda faltam provas suficientes do comportamento real do EasyDental.

### Categoria 4 - Estrutural / futura

Critérios:

- envolve diferenca de modelo de dados, vinculo formal, persistencia relacional ou dependencia entre modulos;
- nao deve entrar agora como microajuste fino;
- deve permanecer registrada como frente futura, se ainda fizer sentido.

#### Diferencas alocadas nesta categoria

| Diferenca | Origem no comparativo | Impacto | Risco | Tipo | Recomendacao | Forma de correcao |
| --- | --- | --- | --- | --- | --- | --- |
| Persistencia relacional completa do legado versus `extra.historico_aba` no Brana | Persistencia | alto | alto | persistencia | manter somente documentado | discussao estrutural futura |
| Dependencia formal com `INTERVENCAO` no legado | Dependencia cruzada | alto | alto | dependencia cruzada | manter somente documentado | discussao estrutural futura |
| Estrutura de metadados e vinculos formais mais rica no legado | Persistencia / origem de dados | alto | alto | persistencia | manter somente documentado | discussao estrutural futura |

#### Observacao

Estas diferencas devem ficar fora da trilha de ajuste fino desta fase. Se um dia virarem backlog, precisam de frente propria.

## 5. Backlog recomendado de microajustes

### Prioridade 1 - primeiro lote de execucao

1. Harmonizar o cabecalho final da grade para reduzir a divergencia textual mais simples.
2. Ajustar pequenos rótulos da toolbar, se a analise visual final mostrar ganho real.
3. Refino fino do modal de `Propriedades da linha` em layout e leitura.

### Prioridade 2 - segundo lote de execucao

4. Melhorar a origem de `Cirurgiao` para ficar mais perto do modelo do legado.
5. Melhorar a origem de `Regiao` para ficar mais perto do modelo do legado.
6. Expor, se fizer sentido, metadados de linha no modal sem criar estrutura nova.

### Prioridade 3 - somente depois de nova evidencia

7. Avaliar se a confirmacao/cancelamento local precisa de ajuste fino.
8. Avaliar se o destaque visual da selecao precisa de refinamento adicional.

## 6. O que nao deve entrar agora

- redesenho estrutural da persistencia;
- migracao da aba para tabela relacional nova;
- acoplamento formal com `INTERVENCAO`;
- mudanca de backend;
- mudanca de banco;
- mudanca de schema;
- mudanca de migrations;
- mudanca de endpoints;
- qualquer tentativa de fechar o contrato visual do EasyDental sem observacao pratica adicional.

## 7. O que depende de observacao pratica do EasyDental

- fluxo exato de teclado;
- confirmacao de exclusao;
- comportamento real de `COR`;
- leitura da janela de propriedades;
- natureza de `Cirurgiao` e `Regiao` como combo, texto ou lookup;
- qualquer detalhe de duplo clique.

## 8. Primeira microetapa de correcao real recomendada

**Primeira microetapa recomendada:** harmonizacao textual visual da grade, começando pelo cabecalho final `Descricao do procedimento` e pelos rótulos da toolbar, porque:

- e o ajuste de menor risco percebido;
- tem alto retorno visual para o usuario;
- nao mexe em persistencia nem em regra estrutural;
- prepara a base para validar se a linha visual final do Historico deve seguir mais perto do legado ou permanecer como interpretacao funcional conservadora.

## 9. Conclusao

O backlog conservador aponta que o Brana ja esta bem posicionado no uso pratico, entao a proxima frente de execucao deve começar por ajustes de baixo risco e alto valor visual, deixando as diferencas estruturais e as dependencias nao confirmadas para uma frente futura ou para uma nova observacao pratica do EasyDental.
