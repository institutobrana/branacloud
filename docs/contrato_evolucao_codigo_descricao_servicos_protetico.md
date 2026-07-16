# Contrato de evolucao - Codigo e Descricao em Servicos de protetico

## 1. Objetivo
Registrar o contrato tecnico e funcional para a futura evolucao do modulo **Brana Cloud -> Tabelas -> Servicos de protetico** com inclusao persistida dos campos **Codigo** e **Descricao**, sem implementar agora migration, backend, frontend ou alteracoes no banco.

## 2. Contexto atual
O modulo de servicos de protetico ja existe e esta funcional no Brana Cloud:
- backend atual com CRUD de proteticos e servicos;
- frontend legado consolidado;
- frontend React com listagem, filtros, ordenacao, visibilidade de colunas, selecao e combo de protetico;
- documentacao anterior de auditoria e fechamento da listagem.

O ponto crucial desta evolucao e que a coluna visual **Codigo** usada hoje no React nao deriva de um campo de negocio proprio. O que existe no contrato atual e o identificador tecnico `id` do `ServicoProtetico`.

## 3. Print de referencia
O print de referencia mostra um modal de "Novo item de tabela de prothese" com:
- Tabela
- Codigo
- Nome do servico
- Valor
- Tempo medio (dias)
- Descricao
- botao Gravar item
- botao Cancelar

Leitura de contrato:
- o print e uma referencia funcional para evolucao do formulario;
- ele nao autoriza copiar cegamente rótulos ou significados sem validar o contrato do Brana Cloud;
- o campo **Tempo medio (dias)** confirma que `prazo` deve continuar existindo como duracao em dias;
- o campo **Descricao** confirma a necessidade de um campo multilinha persistido;
- o campo **Codigo** exige um campo real, nao apenas reutilizacao silenciosa do `id` tecnico.

## 4. Contrato atual
### Fato comprovado no backend atual
Arquivo: `backend/routes/proteticos_routes.py`

Schema atual do servico:
- `nome: str`
- `indice: str = "R$"`
- `preco: float = 0`
- `prazo: int = 0`

Contrato atual do retorno de servico:
- `id`
- `nome`
- `indice`
- `preco`
- `prazo`
- `protetico_id`

Arquivo de modelo:
- `backend/models/protetico.py`

Modelo atual `ServicoProtetico`:
- `id` int PK
- `protetico_id` FK obrigatoria
- `clinica_id` FK obrigatoria
- `nome` String(180) obrigatorio
- `indice` String(10) obrigatorio, default `R$`
- `preco` Float obrigatorio, default `0`
- `prazo` Integer obrigatorio, default `0`
- unicidade: `(protetico_id, nome)`

### Fato comprovado no frontend React
Arquivo: `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`

O React atual exibe cinco colunas:
- `Codigo`
- `Servico`
- `Indice`
- `Preco`
- `Prazo`

Mas a coluna `Codigo` ainda e derivada de `ServicoProtetico.id`, nao de um campo de negocio proprio.

## 5. Contrato futuro
O contrato futuro precisa introduzir dois campos persistidos:
- `codigo`
- `descricao`

E manter os campos atuais:
- `nome`
- `indice`
- `preco`
- `prazo`

### Diretriz de evolucao
- `id` continua sendo chave tecnica.
- `codigo` passa a ser a chave visual/funcional de negocio.
- `descricao` passa a ser um campo de observacao/explicacao do servico.
- `nome` continua como nome do servico.
- `indice`, `preco` e `prazo` permanecem no contrato.

## 6. Banco atual
### Estrutura comprovada
Tabela: `servico_protetico`

Colunas atuais:
- `id`
- `protetico_id`
- `clinica_id`
- `nome`
- `indice`
- `preco`
- `prazo`

### O que ainda nao existe
- nao existe coluna `codigo`;
- nao existe coluna `descricao`;
- nao existe constraint de unicidade para `codigo`;
- nao existe indice de banco para `codigo`.

### Relação com o print
O print de referencia pede explicitamente um codigo funcional. Logo, a evolucao precisa alterar a tabela real, e nao apenas a apresentação.

## 7. Novo campo Codigo
### 7.1 Fatos
- Nao existe hoje no banco ou no backend.
- Nao existe hoje no payload do React.
- Nao deve ser confundido com `id`.

### 7.2 Recomendacao tecnica
A opcao mais segura para o contrato futuro e:
- tipo: texto curto alfanumerico ou numerico curto, conforme decisao funcional final;
- trim: sim;
- caixa: normalizada no backend;
- obrigatoriedade: decidir com base no backfill e na compatibilidade;
- unicidade: preferencialmente por protetico e/ou clinica, a definir;
- edicao: decidir se sera mutavel ou imutavel apos criacao.

### 7.3 Analise das alternativas
#### A. Texto curto
Vantagens:
- mais flexivel;
- suporta codigos com prefixo.
Riscos:
- validação e ordenacao menos previsiveis;
- maior chance de entrada inconsistente.

#### B. Numero inteiro
Vantagens:
- simples para ordenacao e filtro;
- mais aderente ao print se o codigo for sequencial.
Riscos:
- perde flexibilidade;
- pode conflitar com a expectativa de um codigo de negocio legivel.

#### C. Alfanumerico
Vantagens:
- combina sequencia e prefixo;
- permite alinhamento com pratica historica de negocio.
Riscos:
- precisa de regra clara de geracao e normalizacao.

#### D. Geracao automatica
Vantagens:
- reduz erro humano;
- facilita backfill.
Riscos:
- concorrencia, sequencia e reuso precisam de regra forte.

#### E. Preenchimento manual
Vantagens:
- controle humano direto.
Riscos:
- maior chance de duplicidade, inconsistência e erro de digitacao.

### 7.4 Recomendacao sobre escopo de unicidade
Factualmente, o sistema atual garante unicidade apenas de `nome` por `protetico`.

Para `codigo`, a recomendacao tecnica preliminar e:
- usar unicidade por `protetico` enquanto o modulo for indexado na tabela de protetico;
- considerar `clinica_id + protetico_id + codigo` se houver risco de reaproveitamento entre clinicas;
- nao fixar uma constraint definitiva antes de decidir o formato do codigo e o backfill.

### 7.5 Decisao pendente
O usuario precisa decidir:
- se `codigo` sera numerico, textual ou alfanumerico;
- se sera manual ou automatico;
- se sera obrigatorio;
- se sera imutavel depois de criado;
- se a unicidade sera por protetico, por clinica ou global.

## 8. Novo campo Descricao
### 8.1 Fatos
- Nao existe hoje no banco ou no backend.
- Nao existe hoje no modal React.

### 8.2 Recomendacao tecnica
- tipo de banco: `TEXT` ou `VARCHAR` longo;
- obrigatoriedade: opcional por transicao;
- trim: sim;
- preservacao de quebra de linha: sim;
- componente React futuro: textarea / input multilinha;
- payload: texto puro;
- resposta: texto puro;
- relatórios: opcionalmente exibido conforme decisao final.

### 8.3 Decisao pendente
Definir:
- limite maximo;
- se sera opcional ou obrigatoria;
- se sera exibida na listagem ou apenas no modal/relatorio.

## 9. Campo Prazo como spin
### Fato atual
No backend atual, `prazo` e `Integer` com default `0`.

### Contrato futuro recomendado
- label: `Prazo (Tempo medio em dias)` ou equivalente aprovado;
- componente: `InputNumber` ou spin equivalente;
- incremento/decremento visiveis;
- valor inteiro;
- passo `1`;
- minimo `0`, salvo regra comprovada diferente;
- sem texto livre;
- sem casas decimais;
- unidade "dias" apenas no label;
- payload numerico puro.

### Impacto
- o backend atual ja aceita inteiro;
- o React atual ainda precisa evoluir para spin;
- o legado precisa continuar compativel com o contrato antigo enquanto a transicao ocorrer.

## 10. Labels finais
Contrato visual proposto:
- `Protético`
- `Codigo`
- `Nome do servico`
- `Indice`
- `Preco`
- `Prazo (Tempo medio em dias)`
- `Descricao`

### Justificativa
- `Protético` permanece somente leitura no modal e vem do combo da toolbar.
- `Codigo` substitui o uso improprio do `id` na UI.
- `Nome do servico` deixa claro que o campo atual `nome` representa o servico.
- `Indice` preserva o contrato real existente.
- `Preco` nao deve ser renomeado silenciosamente para `Valor` sem decisao formal.
- `Prazo` deve explicitar a unidade de dias.
- `Descricao` e o novo campo multilinha.

## 11. Registros existentes
### Fato
O banco atual ja possui registros sem `codigo` e sem `descricao`.

### Impacto
Qualquer evolucao com `NOT NULL` exigira:
- backfill;
- estrategia de transicao;
- validacao de unicidade;
- risco de quebra do legado se o campo passar a ser obrigatorio cedo demais.

## 12. Estrategias de backfill
### 12.1 Usar temporariamente o id
Vantagens:
- simples;
- imediato.
Riscos:
- perpetua a confusao entre `id` tecnico e `codigo` de negocio;
- dificulta a transicao para um codigo real.

### 12.2 Gerar sequencia por protetico
Vantagens:
- separa melhor o codigo funcional do id;
- ajuda ordenacao por tabela.
Riscos:
- precisa de controle de concorrencia;
- exige definicao de regra de incremento.

### 12.3 Gerar sequencia por clinica
Vantagens:
- util se o codigo for compartilhado entre proteticos de uma clinica.
Riscos:
- mais complexo;
- pode conflitar com a leitura da tabela por protetico.

### 12.4 Deixar nulo inicialmente
Vantagens:
- maior seguranca na migracao.
Riscos:
- deixa o contrato incompleto por mais tempo;
- exige front tolerante a vazio.

### 12.5 Codigo textual prefixado
Vantagens:
- facilita padronizacao visual.
Riscos:
- precisa de regra clara de prefixo e ordenacao.

### 12.6 Preenchimento manual posterior
Vantagens:
- permite curadoria.
Riscos:
- alto risco operacional;
- dificulta automacao e auditoria.

### Recomendacao preliminar
Backfill progressivo com valor temporario calculado, seguido de endurecimento posterior, e a estrategia mais segura. A forma exata ainda depende da decisao do usuario sobre formato e unicidade.

## 13. Unicidade
### Fatos
- hoje a unicidade de servico e `(protetico_id, nome)`;
- nao existe unicidade de `codigo`.

### Analise
Perguntas que precisam ficar fechadas antes da migration:
- dois proteticos podem compartilhar o mesmo codigo?
- o codigo identifica um item local da tabela do protetico ou um servico global?
- registros inativos devem bloquear reutilizacao?

### Recomendacao
Se o `codigo` for de negocio local da tabela do protetico, a constraint mais plausivel e `(clinica_id, protetico_id, codigo)`.
Se houver reutilizacao global dentro da clinica, a constraint pode ser `(clinica_id, codigo)`.
Nenhuma dessas opcoes deve ser fixada sem validacao adicional.

## 14. Model
O model atual de `ServicoProtetico` esta em:
- `backend/models/protetico.py`

Impacto futuro:
- adicionar colunas `codigo` e `descricao`;
- revisar `__table_args__` para constraint de unicidade;
- atualizar relacionamento e serializacao;
- manter `id` como chave tecnica.

## 15. Schemas
O schema atual do backend e simples e ainda nao inclui `codigo` ou `descricao`.

Impacto futuro:
- `ServicoPayload` deve aceitar `codigo` e `descricao`;
- retorno do endpoint de servico deve serializar ambos;
- validacao deve separar obrigatorios de opcionais durante transicao.

## 16. Endpoints
### Contrato atual
- `GET /proteticos`
- `GET /proteticos/{protetico_id}/servicos`
- `POST /proteticos/{protetico_id}/servicos`
- `PUT /proteticos/servicos/{servico_id}`
- `DELETE /proteticos/servicos/{servico_id}`

### Impacto futuro
Todos os endpoints de servico passam a precisar suportar:
- `codigo`
- `descricao`

### Compatibilidade
Durante a transicao:
- o backend deve aceitar os campos novos sem quebrar o contrato antigo;
- o frontend legado nao pode ser obrigado a enviar campos que ainda nao conhece;
- o React pode adotar os campos com comportamento compativel.

## 17. Compatibilidade de API
### Estrategia A - Mudanca direta
Impor `codigo` e `descricao` como obrigatorios de imediato.

Riscos:
- quebra frontend legado;
- quebra scripts e integracoes;
- quebra dados existentes;
- aumenta risco de indisponibilidade funcional.

### Estrategia B - Evolucao compativel
Aceitar os novos campos primeiro, manter compatibilidade retroativa e endurecer a obrigatoriedade depois.

Vantagens:
- protege o legado;
- permite migracao gradual;
- reduz risco operacional.

### Recomendacao
A estrategia B e a mais segura para o Brana Cloud.

## 18. Frontend legado
### Fato
O legado atual nao possui campos `codigo` nem `descricao` no modal de servico.

### Impacto futuro
- se o backend exigir os campos de forma brusca, o legado quebra;
- se os campos forem opcionais na transicao, o legado continua funcionando;
- o legado precisara ser atualizado em etapa futura para consumir os campos novos se a tela continuar sendo mantida.

### Recomendacao
Fazer a evolucao do backend de forma compativel e manter o legado operacional ate a janela de compatibilizacao.

## 19. Frontend React
### Pontos que precisarao mudar
- modal de criacao;
- futuro modal de alteracao;
- payload;
- normalizadores;
- tabela;
- coluna Codigo;
- filtros;
- ordenacao;
- visibilidade;
- selecao;
- testes;
- contador;
- impressao futura.

### Regra da tabela
A tabela deve continuar com cinco colunas:
1. `Codigo` -> `codigo`
2. `Servico` -> `nome`
3. `Indice` -> `indice`
4. `Preco` -> `preco`
5. `Prazo` -> `prazo`

### Descricao na tabela
`Descricao` nao entra na tabela nesta primeira evolucao, salvo nova decisao.

## 20. Tabela e coluna Codigo
### Impacto real
Hoje a coluna visual `Codigo` usa `ServicoProtetico.id`.

### Evolucao desejada
- criar campo real `codigo`;
- a tabela passa a exibir `codigo`;
- `id` permanece como chave tecnica para selecionar, editar e excluir;
- filtros da coluna Codigo devem operar sobre `codigo`;
- o modal futuro deve exibir o campo `Codigo`;
- o `id` nao pode ser confundido com codigo de negocio.

### Pontos atualmente dependentes de `id`
- selecao de linha no React;
- refresh apos gravação;
- POST/PUT/DELETE atuais;
- normalizacao do payload/retorno;
- comparacao de selecao e recarga;
- possivel uso visual da coluna Codigo.

## 21. Modal futuro
Proposta documental de layout:
- cabeçalho compacto;
- protetico somente leitura;
- Codigo;
- Nome do servico;
- Indice e Preco equilibrados;
- Prazo como spin;
- Descricao multilinha;
- Cancelar;
- Salvar.

### Requisitos
- largura responsiva;
- altura compatível com o shell;
- foco inicial previsivel;
- tabulação linear;
- compatibilidade com tema claro/escuro;
- nao copiar cegamente o layout do print.

## 22. Validacoes
### Codigo
- tipo definido ainda pendente;
- trim e normalizacao devem existir;
- obrigatoriedade e unicidade dependem da decisao funcional;
- duplicidade precisa de mensagem clara.

### Descricao
- opcional por transicao;
- multilinha;
- aceitar quebra de linha;
- limitar comprimento com criterio tecnico.

### Prazo
- spin numerico;
- inteiro;
- minimo `0`;
- sem texto livre.

## 23. Relatorios
### Impacto esperado
Relatorios e impressao podem precisar refletir:
- `Codigo`;
- `Descricao`;
- mantendo `Servico`, `Indice`, `Preco` e `Prazo`.

### Recomendacao
O relatorio futuro deve considerar a largura do layout e o risco de estourar templates existentes. A decisao de incluir `Descricao` no resumo principal deve ser tratada separadamente.

## 24. Impressao
### Fato atual
O legacy ja faz impressao/exportacao em front.

### Impacto futuro
- se `Codigo` for introduzido como campo real, a impressao precisara decidir se o exibe;
- `Descricao` provavelmente precisa de area propria ou de detalhamento secundario;
- o formato atual pode exigir ajuste de largura.

### Recomendações
- nao forçar `Descricao` em toda saida caso o layout fique apertado;
- manter compatibilidade com PDF/HTML/TXT/CSV quando possivel;
- validar se a impressao pode continuar no frontend ou se precisara de ajuste posterior no backend.

## 25. Migration proposta
### Nome sugerido
`add_codigo_descricao_to_servico_protetico`

### Ordem segura das operacoes
1. adicionar `codigo` e `descricao` como colunas opcionais;
2. backfill dos registros existentes;
3. validar duplicidade;
4. criar indice de apoio;
5. endurecer `NOT NULL` somente se a transicao estiver validada;
6. adicionar constraint definitiva somente ao final.

### Proteção para registros existentes
- nao quebrar leitura antiga;
- nao exigir preenchimento imediato;
- nao bloquear o frontend legado na transicao.

### Rollback
- remover constraint nova;
- remover indice novo;
- manter colunas se a reversao precisar preservar dados;
- caso necessario, reverter com cautela para nao perder `descricao` preenchida.

## 26. Rollback
Rollback tecnico deve preservar o maximo de informacao possivel.

### Estrategia
- rollback sem perda de dados enquanto os campos estiverem apenas opcionais;
- rollback mais caro se o endurecimento com `NOT NULL` ja tiver sido aplicado;
- migracao reversa precisa documentar o destino de `codigo` e `descricao`.

## 27. Testes
### Necessarios
- GET com campos novos e antigos;
- POST com payload antigo e novo durante a transicao;
- PUT com edicao de `codigo` e `descricao`;
- DELETE sem regressao;
- listagem React com a nova coluna;
- filtros na coluna Codigo;
- modal com spin de Prazo;
- compatibilidade do legado.

### Critérios
- nao quebrar o que ja funciona;
- nao perder selecao;
- nao perder ordenacao;
- nao perder o contador;
- nao perder o contexto do protetico.

## 28. Etapas de implementacao
### Etapa A
Migration aditiva compativel:
- campos inicialmente opcionais;
- backfill;
- indice seguro.

### Etapa B
Backend:
- model;
- schemas;
- GET;
- POST;
- PUT;
- validacoes;
- testes.

### Etapa C
Frontend React:
- modal;
- Codigo;
- Descricao;
- Prazo spin;
- payload;
- listagem usando `codigo`;
- filtros e testes.

### Etapa D
Frontend legado:
- ajuste apenas se necessario.

### Etapa E
Relatorios e impressao.

### Etapa F
Endurecimento de constraint:
- `NOT NULL`;
- unicidade definitiva;
- somente depois da transicao validada.

## 29. Riscos
- quebra do frontend legado;
- codigo duplicado;
- backfill incorreto;
- uso indevido do `id`;
- mudanca de tipo;
- registros antigos sem codigo;
- relatorios incompatíveis;
- impressao cortada;
- payload antigo;
- rollback complexo;
- filtros da tabela React;
- ordenacao inconsistente;
- importacoes antigas;
- multi-clinica;
- multi-protetico;
- concorrencia na geracao automatica;
- prazo divergente;
- descricao longa demais.

## 30. Decisoes pendentes
1. Codigo sera textual, numerico ou alfanumerico?
2. Codigo sera manual ou automatico?
3. Codigo sera obrigatorio?
4. Qual sera o tamanho maximo?
5. A unicidade sera por protetico, clinica ou global?
6. Como preencher os registros existentes?
7. Descricao sera opcional?
8. Qual limite da Descricao?
9. Codigo podera ser alterado depois?
10. Codigo e Descricao entrarao na impressao?
11. O frontend legado devera ser atualizado na mesma fase?
12. O label final sera `Preco` ou `Valor`?
13. O label final do prazo sera exatamente `Prazo (Tempo medio em dias)`?

## 31. Recomendacao tecnica
### Codigo
Recomendacao preliminar:
- tipo: texto curto ou alfanumerico curto;
- obrigatoriedade: opcional durante transicao, depois reavaliar;
- unicidade: por protetico ou por clinica, a confirmar;
- geracao: preferencialmente automatica para backfill, com edicao controlada depois;
- exibicao: substituir o uso do `id` na UI por `codigo` assim que existir o campo real.

### Descricao
Recomendacao preliminar:
- tipo: `TEXT` ou `VARCHAR` longo;
- obrigatoria: nao na primeira transicao;
- componente: textarea multilinha;
- preservacao de quebra de linha: sim.

### Prazo
Recomendacao preliminar:
- manter inteiro;
- usar spin no React;
- minimo `0`;
- sem texto livre.

## 32. Critérios de aceite
- existe um campo real `codigo`;
- existe um campo real `descricao`;
- `codigo` nao e confundido com `id`;
- `prazo` vira spin no modal futuro;
- o backend permanece compativel durante a transicao;
- o frontend legado nao quebra;
- a listagem React continua funcional;
- a migracao e reversivel;
- os registros existentes sao preservados.

## 33. Lista de arquivos lidos
### Documentação
- `docs/auditoria_servicos_protetico_frontend_legado.md`
- `docs/contrato_implementacao_servicos_protetico_frontend_react.md`
- `docs/fechamento_base_listagem_servicos_protetico_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/00_master_guide.md`
- `docs/03_mapa_codigo.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`

### Backend
- `backend/routes/proteticos_routes.py`
- `backend/models/protetico.py`

### Frontend React
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`
- `frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js`

## 34. Conclusao
O modulo atual de servicos de protetico no Brana Cloud nao possui ainda um `codigo` funcional proprio nem `descricao`.

O caminho seguro para a evolucao e:
- manter o contrato atual compativel;
- adicionar `codigo` e `descricao` de forma aditiva;
- usar `id` apenas como chave tecnica;
- transformar `Prazo` em spin no modal futuro;
- fechar as decisoes de formato, unicidade, backfill e impressao antes da migration.

### Validacao final
- nenhum codigo foi alterado nesta etapa de contrato;
- nenhum banco foi alterado;
- nenhuma migration foi criada;
- nenhum commit foi feito;
- nenhum push foi feito.
