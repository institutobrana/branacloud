# Fase 2 - Nova selecao documental de blocos leves apos consolidacao do Plano de Contas

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Realizar uma nova selecao documental de blocos leves apos a consolidacao do Plano de Contas, para escolher o proximo alvo conservador da Fase 2 sem alterar codigo.

## Contexto

O Plano de Contas acabou de ser pausado/consolidado por ora. A frente teve `montarPayloadGrupo` implementado, testado e consolidado, enquanto `montarPayloadCategoria` foi mantido como esta, sem nova implementacao.

## Frentes pausadas/consolidadas

- Agenda de contatos
- Agenda principal
- Prestadores
- Preferencias / Configuracoes comuns
- Plano de Contas

## Candidatos avaliados

- Cadastros auxiliares
- Medicamentos
- Etiquetas
- Convênios e Planos
- Relatorios
- CID

## Classificacao multi-area

| Candidato | Classificacao multi-area |
|---|---|
| Cadastros auxiliares | comum/core administrativo/transversal |
| Medicamentos | especifico de alguma area profissional |
| Etiquetas | comum/core administrativo/transversal |
| Convênios e Planos | misto/depende de contexto |
| Relatorios | misto/depende de contexto |
| CID | especifico de alguma area profissional |

## Estado atual conhecido

### Cadastros auxiliares

- Ja existe modulo em `frontend/js/modules/auxiliares.js`.
- Permanece passivo e com helpers/contratos documentados.
- Ainda compartilha scaffold com `Plano de Contas` por meio de `cadModalAbrir`, `planoEnsureUI`, `hideAllPanels` e `closeWorkspacePanel`.
- Ja teve etapas anteriores de modularizacao/refatoracao.
- Estado geral: parcialmente modularizado e passivo.

### Medicamentos

- Ja existe modulo em `frontend/js/modules/medicamentos.js`.
- Permanece passivo e com helpers puros textuais.
- Ja teve ciclo documental proprio e integracoes previas.
- Ainda depende de `frontend/app.js` para o fluxo funcional principal.
- Estado geral: parcialmente modularizado, mais CRUD e mais amplo que CID.

### Etiquetas

- Ja existe modulo em `frontend/js/modules/etiquetas.js`.
- Permanece passivo e com helpers puros ja validados.
- Ciclo de helpers foi avancado e encerrado documentalmente.
- O ganho adicional atual parece pequeno.
- Estado geral: avancado/consolidado, com pouco espaco para ganho imediato.

### Convênios e Planos

- Ja existe frente/modulo documentalmente iniciado.
- Ainda ha dependencia de scaffold compartilhado e de fluxos mais amplos.
- Estado geral: misto, com risco maior que os blocos leves.

### Relatorios

- Nao aparece como um bloco leve limpo.
- Ha documentos, permissoes e dependencia de fluxo de conteudo/dados.
- Sem indicacao clara de helper leve seguro neste momento.
- Estado geral: nao recomendado como proximo recorte leve.

### CID

- Ja existe modulo em `frontend/js/modules/cid.js`.
- Permanece passivo, com helpers puros e contrato de payload/validacao.
- `frontend/app.js` ainda concentra o fluxo funcional, mas o modulo ja oferece uma superficie pequena e clara.
- Ha um helper passivo remanescente com potencial de evolucao controlada.
- Estado geral: o bloco leve mais promissor desta rodada.

## Possiveis recortes leves

### Cadastros auxiliares

- helpers puros textuais e de normalizacao;
- validacoes locais sem DOM;
- possivel encapsulamento adicional de normalizacao ou montagem local;
- porém o ganho pode ser pequeno por causa do scaffold compartilhado.

### Medicamentos

- normalizacoes textuais;
- filtros puros;
- validacoes locais;
- algum ganho de frontend/app.js, mas com mais superficie de CRUD.

### Etiquetas

- helpers numericos/textuais puros;
- pequenas normalizacoes ou resolucao de layout;
- ganho possivel, porem modulo ja avancado e com pouco espaco novo.

### Convênios e Planos

- eventuais helpers de formatacao ou validacao local;
- risco de tocar em fluxo maior do que o desejavel;
- contrato documental mais exigente.

### Relatorios

- recorte leve nao ficou claramente isolado;
- qualquer alteracao tende a encostar em permissao, selecao ou saida de dados.

### CID

- `compararTextoCid(texto, termo)` como candidato passivo de busca/filtro;
- normalizacoes de codigo/texto;
- validacoes locais;
- montagens simples de payload ou contrato de leitura;
- recorte pequeno e testavel, com ganho real modesto na reducao de `frontend/app.js`.

## Riscos

| Candidato | DOM | renderizacao | modal | eventos | abas | preview | requestJson | payload | salvamento | permissoes | backend/banco | scaffold compartilhado | Risco classificado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cadastros auxiliares | baixo/médio | baixo/médio | médio | médio | baixo | baixo | medio | medio | medio | baixo | medio | sim | médio |
| Medicamentos | médio | médio | médio | alto | medio | baixo | medio | medio | alto | baixo | medio | nao critico | medio |
| Etiquetas | médio | medio | medio | medio | medio | alto | medio | medio | medio | medio | medio | baixo | baixo/médio |
| Convênios e Planos | medio-alto | medio-alto | medio-alto | medio-alto | medio | medio | alto | alto | alto | medio | alto | sim | medio-alto |
| Relatorios | alto | alto | alto | alto | alto | alto | alto | alto | alto | alto | alto | sim | alto |
| CID | baixo/medio | baixo/medio | baixo/medio | medio | baixo | baixo | medio | medio | medio | baixo | medio | baixo | baixo/medio |

## Ganho esperado

- `Cadastros auxiliares`: ganho pequeno/modesto; risco de scaffolding compartilhado reduz atratividade.
- `Medicamentos`: ganho moderado, mas com mais CRUD e maior superficie.
- `Etiquetas`: ganho pequeno porque o ciclo de helpers ja esta avancado.
- `Convênios e Planos`: ganho real possivel, mas o risco sobe junto.
- `Relatorios`: ganho incerto; superficie grande e pouco isolada.
- `CID`: ganho real modesto, porem com fronteira clara e risco baixo/medio.

## Comparacao final

- `Cadastros auxiliares` e `Medicamentos` sao candidatos viaveis, mas nao os mais leves nesta leitura.
- `Etiquetas` esta avancada e tende a ter ganho marginal.
- `Convênios e Planos` e `Relatorios` nao sao blocos leves o suficiente para esta rodada.
- `CID`, embora especifico de area clinica, e o bloco mais leve e mais bem encaixado para uma nova selecao conservadora depois de `Plano de Contas`.

## Recomendacao escolhida

**G. Encerrar selecao e criar contrato documental do candidato mais promissor.**

O candidato mais promissor identificado foi **CID**.

## Justificativa tecnica

- `CID` tem a melhor combinacao de superficie pequena, fronteira clara e helper passivo remanescente.
- A reducao de `frontend/app.js` pode ser pequena, mas e real e mais segura do que nos outros candidatos.
- `Cadastros auxiliares` e `Etiquetas` ja estao mais avancados e tendem a oferecer ganho adicional menor.
- `Medicamentos` e mais CRUD e, por isso, menos leve.
- `Convênios e Planos` e `Relatorios` sao mais sensiveis e nao devem ser priorizados agora.

## Proxima subetapa recomendada

`CID - Contrato documental do proximo helper leve ou transformacao segura`

## Onde testar futuramente se houver implementacao

Em `Tabelas > Doencas (CID)...`, validando:

- abrir o painel;
- validar lista;
- testar selecao de item;
- testar filtro/busca, se existir;
- testar abrir/alterar/excluir, se houver modal;
- confirmar que o console continua limpo;
- regressao rapida em `Medicamentos`, `Plano de Contas` e `Unidades` para garantir que o shell continua intacto.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Nenhum arquivo de codigo foi alterado nesta etapa. A etapa foi exclusivamente documental.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido.

## Commit seletivo obrigatorio

Seletivamente, esta etapa deve entrar apenas com:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_nova_selecao_blocos_leves_pos_plano_contas.md`

## Registro para roadmap

Registrar que foi realizada nova selecao documental de blocos leves apos a consolidacao do Plano de Contas, que os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convênios e Planos`, `Relatorios` e `CID`, que `CID` foi o candidato mais promissor, que a recomendacao e criar primeiro um contrato documental para CID e que nenhuma alteracao de codigo foi feita.
