# Contrato tecnico - Tipo de atendimento (TISS) do modal `Novo tratamento`

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Tela: `Menu Tratamento -> Novo tratamento`

Area especifica: aba `Convenio`, combo `Tipo de atendimento (TISS)`

Natureza deste documento: contrato tecnico formal e plano de execucao segura

Status: documental apenas, sem implementacao autorizada por este texto

## 2. Objetivo

Este contrato define, de forma formal e rastreavel, como o combo `Tipo de atendimento (TISS)` da aba `Convenio` do modal `Novo tratamento` deve ser alinhado ao comportamento legado do EasyDental.

O foco deste contrato e corrigir a origem dos itens, preservar o padrao do legado e reduzir risco antes de qualquer mudanca no codigo.

Este documento nao implementa nada.

Este documento nao altera frontend, backend, banco, seeds, migrations ou regras de persistencia.

## 3. Referencias usadas

### 3.1 EasyDental

Fonte observada no legado:

- arquivo SQL: `Y:\EDS70\Dados\eds75_build_0809_2.sql`
- tabela legado: `_TISS_TIPO_ATENDIMENTO`

Itens observados no legado:

- `Tratamento Odontológico`
- `Exame Radiológico`
- `Ortodontia`
- `Urgênica/Emergência`
- `Auditoria`

### 3.2 Brana Cloude

Pontos atuais do Brana Cloude observados na base:

- `backend/routes/tratamentos_routes.py`
- `backend/models/tiss_tipo_tabela.py`
- `frontend/js/modules/novo-tratamento-modal.js`
- `backend/models/tratamento.py`

## 4. Diagnostico atual

### 4.1 O que o EasyDental faz

O combo da aba `Convenio` nao esta usando a tabela de tipo de tabela TISS.

No legado, o comportamento mapeado aponta para um catalogo proprio de `tipo de atendimento TISS`, com os cinco itens acima.

### 4.2 O que o Brana Cloude faz hoje

Hoje o Brana Cloude preenche esse combo a partir do catalogo de `tiss_tipo_tabela`, por meio da rota de filtros do tratamento.

Isso produz uma lista diferente da observada no EasyDental.

### 4.3 Conclusao do diagnostico

O problema nao e apenas de texto.

O problema e de origem de dados:

- EasyDental usa `_TISS_TIPO_ATENDIMENTO`
- Brana Cloude usa `tiss_tipo_tabela`

Esses catálogos representam coisas diferentes.

## 5. Escopo deste contrato

Este contrato cobre apenas:

- a origem dos itens do combo `Tipo de atendimento (TISS)`;
- o mapeamento semantico dos cinco valores do legado;
- a fronteira tecnica da mudanca no Brana Cloude;
- a ordem segura de execucao;
- a validacao final esperada.

Este contrato nao cobre:

- os outros combos da aba `Convenio`;
- os combos de `Cirurgiao contratado`, `Solicitante` e `Executante`;
- a aba `Principal`;
- alteracoes na toolbar;
- alteracoes em odontograma, financeiro ou agenda;
- qualquer alteracao de cadastro de convenios ou planos fora da necessidade do TISS.

## 6. Estado atual do Brana Cloude

### 6.1 Backend

O backend atual expõe a lista de combos do tratamento na rota de filtros.

Hoje o campo `tipos_tiss` vem de um catalogo equivalente ao tipo de tabela TISS, o que e insuficiente para reproduzir o legado no campo `Tipo de atendimento (TISS)`.

### 6.2 Frontend

O modal `Novo tratamento` consome `payload.tipos_tiss` e monta o combo da aba `Convenio`.

O frontend nao deve passar a decidir sozinho a origem dos itens.

### 6.3 Persistencia

O modelo de tratamento ja contem o campo:

- `tipo_atendimento_tiss_id`
- `tipo_atendimento_tiss_nome`

Isso e bom sinal: o dado de destino ja existe.

O que falta e alinhar a fonte de leitura e a semantica dos valores ao legado.

## 7. Requisitos funcionais do legado

O combo `Tipo de atendimento (TISS)` deve:

- mostrar exatamente os itens do catalogo legado `_TISS_TIPO_ATENDIMENTO`;
- preservar a ordem logica do legado;
- iniciar com o valor padrao correspondente ao tratamento odontologico quando a tela estiver criando um novo tratamento, salvo regra de edicao posterior;
- aceitar selecao manual de outro item;
- salvar o identificador correspondente sem perder a descricao amigavel;
- nao reutilizar a tabela de tipo de tabela TISS como origem de dados deste combo;
- manter comportamento previsivel ao reabrir o modal em edicao.

## 8. Requisito tecnico principal

O Brana Cloude deve passar a carregar esse combo a partir de uma fonte especifica de `tipo de atendimento TISS`, separada da fonte de `tipo de tabela TISS`.

Em termos de arquitetura, isso significa:

- `tiss_tipo_tabela` continua existindo para o que ja usa tipo de tabela;
- o combo `Tipo de atendimento (TISS)` passa a usar um catalogo proprio;
- o campo de tratamento continua gravando em `tipo_atendimento_tiss_id` e `tipo_atendimento_tiss_nome`.

## 9. Plano seguro de execucao

### Etapa 1 - Inventario de fronteira

Confirmar, sem implementar:

- onde o backend monta `tipos_tiss`;
- onde o frontend consome `tipos_tiss`;
- onde o tratamento persiste o id e o nome do tipo de atendimento;
- se existe algum seed, migration ou compatibilidade previa que ja represente o catalogo legado.

### Etapa 2 - Criacao da fonte correta

Criar no Brana Cloude uma fonte propria para `tipo de atendimento TISS`, com os cinco itens do legado:

1. `Tratamento Odontológico`
2. `Exame Radiológico`
3. `Ortodontia`
4. `Urgênica/Emergência`
5. `Auditoria`

Preferencia tecnica:

- manter a fonte em backend;
- manter a selecao em frontend como consumidora passiva;
- evitar hardcode duplicado em mais de um lugar.

### Etapa 3 - Troca localizada do provedor

Substituir apenas o provedor de `tipos_tiss` da rota do tratamento para apontar para a nova fonte.

Critério de risco minimo:

- nao alterar outros combos;
- nao alterar a estrutura geral do payload do modal;
- nao alterar o contrato de persistencia do tratamento.

### Etapa 4 - Ajuste de persistencia

Garantir que:

- o id selecionado continue sendo salvo;
- o nome exibido continue acompanhando o id;
- a leitura em edicao recupere corretamente o valor salvo;
- o comportamento ao salvar nao afete convenio, plano ou outros campos TISS.

### Etapa 5 - Validacao manual

Validar em ambiente local:

- lista exibida no combo;
- ordem da lista;
- item padrao ao abrir o modal;
- selecao manual de outro item;
- salvamento e reabertura;
- nenhuma regressao nos outros campos da aba `Convenio`.

## 10. Fronteira tecnica da mudanca

Arquivos com maior chance de impacto:

- `backend/routes/tratamentos_routes.py`
- `backend/models/tratamento.py` somente se houver ajuste de compatibilidade real
- `frontend/js/modules/novo-tratamento-modal.js`
- possiveis seeds ou scripts aditivos, se a nova fonte precisar existir no banco

Arquivos que nao devem ser tocados por este contrato:

- toolbar principal;
- modulo de pacientes;
- rota de procedimento;
- catalogo de tipo de tabela TISS.

## 11. Critérios de aceite

O contrato so pode ser considerado atendido quando:

- o combo mostrar os cinco itens do legado;
- o combo nao mostrar a lista errada de `tiss_tipo_tabela`;
- a tela continuar abrindo normalmente;
- o dado selecionado continuar salvo no tratamento;
- o valor salvo continuar reaparecendo corretamente na edicao;
- nenhuma outra lista da tela mudar sem necessidade;
- os testes manuais mostrarem equivalencia funcional com o legado para este campo.

## 12. Riscos remanescentes

- confundir tipo de atendimento TISS com tipo de tabela TISS;
- duplicar a origem dos itens em mais de um lugar;
- quebrar compatibilidade de edicao ao trocar a fonte;
- alterar o payload do frontend de forma ampla;
- introduzir regressao em outros combos da aba `Convenio`.

## 13. Fora de escopo

Este contrato nao autoriza:

- implementar ainda;
- alterar a toolbar;
- alterar a aba `Principal`;
- alterar o fluxo de abertura do modal;
- criar novo comportamento de convenio fora do combo TISS;
- mexer em outros catálogos TISS sem contrato proprio.

## 14. Proximo passo recomendado

Depois deste contrato, o proximo passo seguro e:

1. confirmar se a nova fonte deve ser uma tabela de banco propria, uma seed controlada ou um service de catalogo;
2. fechar o nome tecnico final da fonte;
3. aplicar a mudanca primeiro no backend;
4. testar localmente o payload;
5. ajustar o frontend apenas se necessario;
6. validar o modal em sessao autenticada;
7. registrar o resultado em documentacao de continuidade.
