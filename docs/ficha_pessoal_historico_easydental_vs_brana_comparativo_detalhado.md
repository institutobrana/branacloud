# Ficha Pessoal - Historico - Comparativo detalhado EasyDental x Brana Cloud

## 1. Objetivo

Comparar funcionalmente a aba `Historico` do EasyDental com o estado atual do Brana Cloud, usando como base:

- o contrato documental da auditoria comparativa;
- a engenharia reversa tecnica do EasyDental;
- o estado atual ja implementado no Brana Cloud.

Esta frente continua documental e comparativa. Ela nao altera frontend, backend, banco, schema, migration, seed ou endpoint.

## 2. Fontes usadas

### 2.1 Documentacao do Brana Cloud

- `docs/ficha_pessoal_historico_auditoria_comparativa_contrato.md`
- `docs/ficha_pessoal_historico_easydental_engenharia_reversa.md`
- `docs/ficha_pessoal_historico_etapa_7_integracao_grava.md`
- `docs/ficha_pessoal_historico_etapa_10_propriedades_linha.md`
- `docs/11_roadmap_desenvolvimento.md`

### 2.2 Codigo do Brana Cloud auditado

- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`

### 2.3 Base legada / EasyDental

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70.sql`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\auxiliares_easydental_seed.json`
- `\\Dell_servidor\c\EDS70\Textos`
- `\\Dell_servidor\c\EDS70\Reports`
- `\\Dell_servidor\c\EDS70\Objetos`

## 3. Resumo do estado atual do Brana

O Brana Cloud ja reproduz o esqueleto funcional conservador da aba `Historico`:

- modulo proprio em `frontend/js/modules/ficha-pessoal-aba-historico.js`;
- selecao de linha;
- inserir linha local;
- editar linha local;
- eliminar linha local;
- navegacao por `TAB` e `Shift+TAB`;
- confirmacao local com `ENTER`;
- cancelamento local com `ESC`;
- modal de `Propriedades da linha`;
- integracao com `Grava` via `extra.historico_aba`.

## 4. Comparacao por camadas

### 4.1 Camada visual

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Layout geral da aba | Janela historica classica do legado, com grade e acoes proprias | Aba modular moderna em `frontend/js/modules/ficha-pessoal-aba-historico.js` com toolbar, grade e textarea | O Brana ja reproduz a estrutura principal, mas com linguagem visual mais limpa e nao idêntica ao legado | medio | visual | EasyDental: confirmacao tecnica da tabela `HISTORICO`; Brana: codigo atual auditado | apenas documentar / sem acao agora |
| Posicao e nome dos botoes | Nao foi localizado o script visual original | `Inserir linha`, `Edita linha`, `Elimina linha`, `Propriedades da linha` | Brana esta funcional, mas os rótulos e a ordem sao uma interpretacao conservadora, nao uma copia literal confirmada | medio | visual | Brana confirmado por codigo; EasyDental nao encontrado | microajuste de frontend |
| Grade | Grade por paciente/data com base em `HISTORICO` | Grade local com linhas editaveis e selecao | Brana reproduz o conceito central da grade | baixo | visual | EasyDental: indice `(NROPAC, DATA)`; Brana: render local | apenas documentar / sem acao agora |
| Cabecalhos | `Data`, `Cirurgiao`, `Regiao`, `Descricao` sao os campos tecnicos mais provaveis | `Data`, `Cirurgiao`, `Regiao`, `Descricao do procedimento` | Pequena divergencia textual no ultimo cabecalho | baixo | visual | EasyDental: mapeamento tecnico forte; Brana: codigo atual auditado | microajuste de frontend |
| Rótulos | UI legivel original nao encontrada | `Descricao do procedimento` no campo de apoio | Brana faz um refinamento nominal e nao traz o nome do legado | baixo | visual | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Seleção visual | Provavelmente linha destacada; nao foi encontrado o script legivel | Linha selecionada com classe visual `is-selected` | Brana ja entrega destaque visual consistente | baixo | visual | Brana confirmado por codigo; EasyDental nao encontrado | apenas documentar / sem acao agora |
| Estados de edição | Campo de propriedades e edicao inline provaveis | Estados locais `rascunho`, `edicao`, `confirmada` | Brana explicita um estado interno mais claro do que foi documentado no legado | medio | visual | Brana confirmado por codigo; EasyDental parcialmente inferido | apenas documentar / sem acao agora |
| Modal/janela Propriedades da linha | Hipotese de janela formal com metadados | Modal local funcional com campos suportados e notas de pendencia | Brana ja possui a janela, mas sem prova direta de equivalencia total ao legado | medio | visual | Brana confirmado por codigo; EasyDental hipotese | microajuste de frontend |

### 4.2 Camada de interação

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Selecao de linha | Nao encontrado o fluxo exato | Clique seleciona linha e preserva foco | Brana cobre a interacao principal | baixo | interacao | Brana confirmado por codigo; EasyDental nao encontrado | apenas documentar / sem acao agora |
| Clique simples | Nao encontrado | Seleciona e foca a linha/celula | Brana reproduz o comportamento utilitario esperado | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Duplo clique | Nao encontrado | Nao ha evidencia de fluxo especial documentado | Lacuna aberta por falta de evidencia legivel do legado | baixo | interacao | EasyDental nao encontrado | apenas documentar / sem acao agora |
| Foco inicial | Nao encontrado | Foco vai para a primeira celula da linha/edicao | Brana ja tem fluxo deterministico | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Foco apos inserir | Nao encontrado | Nova linha nasce selecionada e com foco local | Brana vai alem da evidencia documental do legado | medio | interacao | Brana confirmado por codigo; EasyDental nao encontrado | microajuste de frontend |
| Foco apos editar | Nao encontrado | Edita a linha e retorna ao mesmo contexto | Brana atende a experiencia esperada de continuidade | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Foco apos excluir | Nao encontrado | Reencaixe para linha anterior/posterior ou limpa selecao | Brana ja trata o caso com suavidade | medio | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Foco apos aplicar propriedades | Nao encontrado | Retorna para a linha e reaplica foco | Brana possui comportamento utilitario consistente | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| `TAB` | Nao encontrado | Percorre `Data`, `Cirurgiao`, `Regiao`, `Descricao do procedimento` | Brana implementa a navegacao local sem prova do legado | medio | interacao | Brana confirmado por codigo; EasyDental nao encontrado | apenas documentar / sem acao agora |
| `Shift+TAB` | Nao encontrado | Navegacao reversa local suportada | Brana excede a evidencia legivel do legado | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| `ENTER` | Nao encontrado | Confirma linha localmente e pode abrir nova linha abaixo | Brana cobre o fluxo de confirmacao com baixo risco | medio | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| `ESC` | Nao encontrado | Cancela rascunho ou restaura snapshot local | Brana protege contra perda acidental na edicao local | medio | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Modal com teclado | Nao encontrado | `Escape` cancela, `Enter` aplica fora do `textarea` | Brana possui comportamento utilitario aceitavel | baixo | interacao | Brana confirmado por codigo | apenas documentar / sem acao agora |

### 4.3 Camada de regra funcional

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Inserir linha | Linha nova deve nascer dentro do historico do paciente | Cria linha local com data atual, sistema e texto base | Brana reproduz a intencao funcional principal, mas ainda usa preenchimento conservador provisório | medio | regra | Brana confirmado por codigo; EasyDental fortemente provavel | ajuste de regra local |
| Edita linha | Nao encontrado o fluxo exato | Abre a linha selecionada para edicao local | Brana entrega a funcao principal | baixo | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Elimina linha | Nao encontrado se pede confirmacao | Remove localmente e reencaixa selecao | Brana resolve o caso base sem dependencia nova | baixo | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Propriedades da linha | Metadados e possivel janela formal inferidos | Modal funcional com campos `Data`, `Cirurgiao`, `Regiao`, `Historico / Descricao` | Brana cobre o uso minimo, mas ainda nao prova a equivalencia integral do legado | medio | regra | Brana confirmado por codigo; EasyDental hipotese | ajuste de regra local |
| Sem selecao | Nao encontrado | Feedback simples e nao quebra a tela | Brana protege o uso incorreto de forma segura | baixo | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Confirmar | Linha confirmada localmente e gravada depois pelo fluxo da ficha | Atualiza estado local e serializa no envelope `extra` | Brana separa confirmacao local de persistencia final | medio | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Cancelar | Nao encontrado | Restaura snapshot ou remove rascunho | Brana adiciona mecanismo de reversao local | medio | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Ordem de insercao | Nao encontrado | Nova linha entra abaixo da linha ativa quando ha selecao | Brana define uma ordem pratica de trabalho | baixo | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Ordem de selecao remanescente | Nao encontrado | Prioriza linha anterior ou posterior apos exclusao | Brana tem comportamento previsivel e util | baixo | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |
| Regras locais de edicao | Nao encontrado | Snapshot local, estados `rascunho` e `edicao` | Brana implementa uma disciplina interna que nao foi observada como texto legivel no legado | medio | regra | Brana confirmado por codigo | apenas documentar / sem acao agora |

### 4.4 Camada de origem dos dados

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Data` | `HISTORICO.DATA` | Campo de coluna e do modal | Equivalencia boa | baixo | origem de dados | Confirmado nos dois lados | apenas documentar / sem acao agora |
| `Cirurgiao` | `HISTORICO.ID_PRESTADOR` -> `PRESTADOR` | Campo textual local, sem seletor de cadastro dedicado nesta etapa | Brana reproduz o dado, mas nao a origem estrutural do cadastro ligado | medio | origem de dados | EasyDental confirmado; Brana confirmado por codigo | ajuste de regra local |
| `Regiao` | `HISTORICO.NRODENTE` | Campo textual local | Brana representa o conceito, mas ainda nao prova lista/lookup do legado | medio | origem de dados | EasyDental fortemente provavel; Brana confirmado por codigo | ajuste de regra local |
| `Historico / Descricao` | `HISTORICO.DESCRICAO` | Campo texto local e textarea da ficha | Equivalencia boa | baixo | origem de dados | Confirmado nos dois lados | apenas documentar / sem acao agora |
| `Cor de fundo` | `HISTORICO.COR` existe, mas o uso visual nao foi fechado | Campo documentado como pendente na janela | Brana reconhece o metadado, mas nao o aplica de forma funcional | medio | origem de dados | EasyDental confirmado; Brana confirmado por codigo | ajuste de regra local |
| `Data de insercao` | `TIME_STAMP_INS` existe | Campo documentado como pendente | Brana nao expõe o metadado na UI funcional | baixo | origem de dados | EasyDental confirmado; Brana documentado | apenas documentar / sem acao agora |
| `Data de atualizacao` | `TIME_STAMP_UPD` existe | Campo documentado como pendente | Igual ao caso anterior | baixo | origem de dados | EasyDental confirmado; Brana documentado | apenas documentar / sem acao agora |

### 4.5 Camada de persistencia

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| O que persiste de verdade | Tabela `HISTORICO` com campos normalizados e FKs | Envelope JSON `extra.historico_aba` dentro de `source_payload` | A representacao e diferente; a persistencia do Brana e embutida no payload do paciente | alto | persistencia | EasyDental confirmado; Brana confirmado por codigo | ajuste de persistencia usando estrutura atual |
| Quando a linha passa a existir | No legado, a linha deve existir como registro de tabela | No Brana, a linha existe localmente e e serializada ao gravar a ficha | Brana adia a formalizacao ate o fluxo de `Grava` | medio | persistencia | Brana confirmado por codigo; EasyDental confirmado na tabela | apenas documentar / sem acao agora |
| Reabertura | Reabre por consulta ao historico do paciente/tratamento | Reaplica `extra.historico_aba` ao carregar o paciente | Diferenca apenas de implementacao | medio | persistencia | Brana confirmado por codigo; EasyDental confirmado por esquema | ajuste de persistencia usando estrutura atual |
| Datas sistemicas | Auditable timestamps persistidos na tabela | Timestamps nao aparecem como campos dedicados na serializacao atual | Falta exposicao explicita no envelope | baixo | persistencia | EasyDental confirmado; Brana hipotese | ajuste de regra local |
| Metadados por linha | `COR` e timestamps existem como colunas | Parte fica apenas documentada na etapa atual | Brana ainda nao espelha completamente os metadados do legado | medio | persistencia | EasyDental confirmado; Brana documentado | ajuste de persistencia usando estrutura atual |
| Diferença estrutural | Registro relacional em tabela propria | JSON dentro de payload de paciente | A diferenca estrutural existe, mas esta sendo tratada por envelope atual por enquanto | alto | persistencia | EasyDental confirmado; Brana confirmado por codigo | ajuste estrutural futuro |

### 4.6 Camada de dependencias cruzadas

| Item | EasyDental | Brana Cloud | Diferenca encontrada | Impacto | Tipo | Evidencia | Tratamento futuro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paciente | `HISTORICO.NROPAC` | Historico segue o paciente na ficha e no payload | Equivalencia boa | baixo | dependencia cruzada | EasyDental confirmado; Brana confirmado por codigo | apenas documentar / sem acao agora |
| Prestador / cirurgiao | `ID_PRESTADOR` -> `PRESTADOR` | Campo textual e conceito local na linha | Brana ainda nao amarra diretamente a um seletor de prestador do modulo | medio | dependencia cruzada | EasyDental confirmado; Brana confirmado por codigo | ajuste de regra local |
| Intervencao | `NROINTPAC` referencia `INTERVENCAO` | Nao ha dependencia direta visivel na UI atual | Diferenca estrutural relevante, embora a operacao cotidiana possa seguir sem ela | alto | dependencia cruzada | EasyDental confirmado; Brana nao encontrado | ajuste estrutural futuro |
| Regiao / dente | `NRODENTE` e relacao clinica/odontologica | Campo local de regiao sem prova de lookup clinico formal | Brana representa a informacao, mas nao a dependencia legada completa | medio | dependencia cruzada | EasyDental fortemente provavel; Brana confirmado por codigo | ajuste de regra local |
| Outros modulos | Aba Historico dialoga com fluxo de ficha e tratamento | Integra com `Grava` e reaplica ao abrir paciente | Brana cobre a dependencia essencial da ficha atual | baixo | dependencia cruzada | Brana confirmado por codigo | apenas documentar / sem acao agora |

## 5. Matriz consolidada de diferencas

### 5.1 Diferenças de impacto alto

- Persistencia relacional completa do legado versus envelope JSON atual em `extra.historico_aba`.
- Dependencia direta com `INTERVENCAO` no legado versus ausencia de prova funcional equivalente na camada atual.
- Estrutura de metadados e relacoes do legado versus representacao ainda simplificada no Brana.

### 5.2 Diferenças de impacto medio

- Origem de `Cirurgiao` e `Regiao` ainda esta mais textual no Brana do que estrutural no legado.
- Modal de propriedades existe no Brana, mas a equivalencia visual e de contrato do legado ainda nao foi fechada.
- `ENTER`, `ESC`, `TAB` e `Shift+TAB` estao implementados no Brana, mas sem evidencias legiveis do comportamento original para validacao literal.

### 5.3 Diferenças de impacto baixo

- Pequenas divergencias de rotulo.
- Pequenas divergencias de linguagem visual.
- Diferencas de estado interno que nao afetam o uso cotidiano.

## 6. O que o Brana ja reproduz corretamente

- Layout basico com grade, toolbar e campo de descricao.
- Seleção de linha.
- Inserção local de linha.
- Edição local de linha.
- Eliminação local de linha.
- Navegação por `TAB` e `Shift+TAB`.
- Confirmação com `ENTER`.
- Cancelamento com `ESC`.
- Modal de propriedades da linha.
- Persistência por `extra.historico_aba` no fluxo atual de `Grava`.

## 7. O que o Brana reproduz parcialmente

- A origem de `Cirurgiao` e `Regiao` ainda e textualmente simples, sem prova documental de combo/lookup legada.
- A equivalencia visual da janela de propriedades ainda e conservadora e não fechou todos os campos do legado.
- Os metadados de auditoria existem como conceito no legado, mas ainda aparecem apenas documentados no Brana.

## 8. O que ainda diverge com impacto alto

- A estrutura de persistencia final.
- A dependencia relacional com `INTERVENCAO`.
- A evidencia de um contrato visual legivel do EasyDental para a janela e para os atalhos.

## 9. O que diverge com impacto medio

- A forma como `Cirurgiao` e `Regiao` sao representados na UI.
- A cobertura da janela de propriedades.
- A forma de formalizacao dos metadados de linha.

## 10. O que diverge com impacto baixo

- Textos de botao e rótulos.
- Ajustes finos de linguagem visual.
- Sequencias internas de foco que nao alteram a funcao principal.

## 11. O que provavelmente pode ser ajustado so no frontend

- Rótulos e pequenas harmonizacoes visuais.
- Ordem e forma de apresentacao da toolbar.
- Detalhes do modal de propriedades.
- Destaque visual da linha e foco apos acoes locais.

## 12. O que exigiria ajuste de regra

- Relacao mais formal de `Cirurgiao` e `Regiao` com cadastros/lookup.
- Comportamento de confirmacao/cancelamento caso se deseje aproximacao mais literal do legado.
- Exposicao de metadados na janela de propriedades.

## 13. O que exigiria discutir estrutura futura

- Persistencia relacional completa de historico em tabela dedicada.
- Integracao estrutural com `INTERVENCAO`.
- Eventual migracao de `extra.historico_aba` para um modelo proprio, se a complexidade aumentar.

## 14. Lacunas que ainda dependem de observacao pratica do EasyDental

- Se `Cirurgiao` e um combo real ou texto assistido.
- Se `Regiao` vem de lista fixa, lookup odontologico ou texto livre.
- Se o legado mostra `Propriedades da linha` como janela formal.
- Se o legado pede confirmacao ao eliminar.
- Se `COR` muda realmente a cor da linha ou apenas guarda contexto interno.
- Se `TAB`, `ENTER` e `ESC` seguem exatamente a mesma semantica observada no Brana.

## 15. Conclusao

O Brana Cloud ja entrega a maior parte do fluxo pratico da aba `Historico` e resolve o uso cotidiano com baixo risco. A principal distancia para o EasyDental esta na estrutura de persistencia e na dependencia relacional mais rica do legado, nao na capacidade funcional imediata da tela.

## 16. Proxima etapa recomendada

Priorizacao das diferencas.
