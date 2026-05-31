# Ficha pessoal - Anamnese - Auditoria da persistencia e contrato

## 1. Contexto

Esta etapa e somente documental.

Ela foi aberta para auditar a persistencia da aba `Anamnese` da `Ficha Pessoal`, comparar o que existe no Brana Cloud com o legado EasyDental e definir um contrato minimo de confirmacao de alteracao de dados antes de sair da ficha.

Para esta auditoria foram lidos documentos locais do proprio repositorio e feita leitura somente para inventario em duas shares legadas:

- `\\Sonyvaio\\c\\EDS70`
- `\\Dell_servidor\\c\\EDS70`

As duas shares foram acessiveis em leitura e os scripts SQL de descoberta mostraram a mesma estrutura de tabelas de anamnese. A consulta direta ao banco legada em execucao nao foi possivel nesta sessao, entao a auditoria de dados reais ficou baseada em schema, scripts e documentacao local.

## 2. Fontes inspecionadas

### 2.1 Documentos locais do Brana Cloud

- `docs/ficha_pessoal_anamnese_auditoria_fluxo_questionario_contrato.md`
- `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`
- `docs/ficha_pessoal_anamnese_implementacao_questionario_visual_sem_salvamento.md`
- `docs/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md`
- `docs/ficha_pessoal_anamnese_validacao_questionario_visual_sem_salvamento.md`
- `docs/ficha_pessoal_anamnese_validacao_ajuste_visual_sim_nao_vertical.md`
- `docs/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento.md`
- `docs/ficha_pessoal_anamnese_validacao_modularizacao_sem_mudar_comportamento.md`
- `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`
- `docs/ficha_pessoal_anamnese_limpeza_botao_quadros.md`
- `docs/ficha_pessoal_anamnese_correcao_botao_procura_reentrante.md`
- `docs/ficha_pessoal_validacao_botao_procura_reentrante.md`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/05_banco_dados.md`
- `docs/_historico_auditoria/04_funcionalidades.md`
- `docs/_historico_auditoria/05_banco_dados.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

### 2.2 Codigo lido somente para auditar

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/anamnese.js`
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `backend/routes/anamnese_routes.py`
- `backend/scripts/migrar_anamnese_easy_para_saas.py`
- `backend/main.py`

### 2.3 Legado EasyDental / fonte externa somente leitura

- `\\Sonyvaio\\c\\EDS70`
- `\\Dell_servidor\\c\\EDS70`

Ambas as shares foram acessadas em modo somente leitura.
Os scripts `Dados\\eds70.sql` encontrados nas duas shares apresentaram a mesma estrutura de anamnese.

## 3. O que foi comprovado

- A aba `Anamnese` da `Ficha Pessoal` existe no `frontend/app.js`.
- O cabecalho da aba mostra o nome do paciente atual.
- Existe um combo visivel de `Questionario` na aba clinica.
- O combo usa a fonte existente da clinica por meio de `GET /anamnese/questionarios`.
- A aba possui bloqueio defensivo para nao abrir `Anamnese` e `Historico` sem paciente valido.
- O backend possui modelos e rotas dedicados para questionarios, perguntas e respostas.
- A persistencia atual continua textual, por meio de `PUT /anamnese/pacientes/{id}/respostas`.
- O namespace `frontend/js/modules/anamnese.js` existe, mas continua passivo nesta linha de analise.
- O namespace `frontend/js/modules/ficha-pessoal-aba-anamnese.js` existe e responde pela parte modular da aba.
- A area inferior da aba clinica foi organizada para a lista visual de perguntas, com rolagem e controles visuais.
- Na estrutura atual, nao houve implementacao de salvamento estruturado para `Sim`/`Nao` + complemento.

## 4. O que foi inferido

- O legado EasyDental usa um conjunto de questionarios-modelo, como `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saude` e `Anamnese pessoal`, com base nos artefatos de descoberta e documentacao legada.
- A tabela legada `ANAMNESE_RESP` armazena a resposta e o complemento, o que sugere o fluxo `Sim`/`Nao` + observacao por pergunta, mas a confirmacao da UI completa nao foi obtida diretamente nesta sessao.
- O fluxo historico do EasyDental parece exigir algum tipo de confirmacao de alteracao de dados antes de sair da ficha, mas o comportamento exato do prompt de saida nao foi comprovado por execucao direta.
- No Brana Cloud, a persistencia em texto puro ja existe para o contrato atual; portanto, para o escopo minimo, nao ha necessidade imediata de um novo banco.
- Para reproduzir com fidelidade o modelo legado de resposta estruturada por pergunta, a estrutura atual de texto puro e insuficiente e um contrato posterior de backend/banco pode ser necessario.

## 5. O que nao foi comprovado

- UI direta e completa do EasyDental para a aba `Anamnese` neste workspace.
- Equivalencia visual 1:1 com o legado na lista de perguntas.
- Fluxo Sim/Nao + complemento separado por pergunta como comportamento ja reproduzido de ponta a ponta em runtime.
- Motor de alertas clinicos por regra na mesma experiencia visual do EasyDental.
- Reacao exata do sistema legado ao sair da ficha com dados alterados.
- Separacao clara entre tela clinica e tela administrativa em componentes independentes.
- Maior parte da experiencia por questionario em um modulo passivo realmente consumido, sem depender do monolito principal.

## 6. Matriz comparativa EasyDental x Brana Cloud

| Item | EasyDental esperado | Brana Cloud atual | Status | Risco | Recomendacao |
| --- | --- | --- | --- | --- | --- |
| Combo de questionario | Combo visivel e claro com modelos/questionarios | Combo visivel existe e carrega da API da clinica | Parcialmente comprovado | Medio | Manter como base do fluxo |
| Lista de perguntas | Grid/lista por questionario, com leitura facil | A area inferior exibe perguntas, mas nao foi comprovada equivalencia 1:1 com o legado | Parcial | Medio | Manter separacao visual e testar antes de ampliar |
| Resposta por pergunta | Sim/Nao + complemento/observacao por item | Persistencia atual continua textual e a etapa visual nao salvou alteracoes | Incompleto | Alto | Tratar em contrato posterior, separado |
| Alertas clinicos | Regras e avisos por resposta | Nao comprovado como regra clinica real | Nao comprovado | Medio/alto | Diagnostico especifico antes de mudar |
| Persistencia | Respostas por paciente/questionario/pergunta | Existe tabela normalizada e PUT dedicado | Comprovado | Medio | Manter leitura de contrato atual |
| Backend | Rotas e modelos especificos | Existem rotas/modelos dedicados | Comprovado | Medio | Evitar mudancas sem novo contrato |
| Confirmacao de saida | Prompt/contrato claro antes de descartar alteracoes | Nao comprovado em runtime; deve ser contratada se houver persistencia real | Incompleto | Alto | Definir contrato antes de salvar |
| UI global | Fluxo estavel sem regressao de menus | O historico da aba `Anotacoes` mostrou que o boot global e sensivel | Comprovado como risco | Alto | Nao repetir integracao global sem isolamento |

## 7. Persistencia e contrato de alteracao

### 7.1 O que existe hoje no Brana Cloud

- A persistencia atual da anamnese e textual.
- O backend tem `resposta` como texto em `AnamneseResposta`.
- A API de respostas salva e remove linhas por paciente/questionario/pergunta.
- O modelo atual suporta gravacao do texto atual sem novo banco.

### 7.2 O que o legado sugere

- O schema legado guarda:
  - `ANAMNESE_RESP.RESPOSTA`
  - `ANAMNESE_RESP.COMPLEM`
  - chaves de vinculo por paciente/questionario/pergunta
- Isso sugere que o legado trata a resposta por pergunta de forma estruturada.
- O comportamento exato da confirmacao de saida com dados alterados nao foi observado diretamente nesta sessao.

### 7.3 Conclusao pratica

- Para o contrato atual de texto puro, o Brana Cloud suporta persistencia sem novo banco.
- Para equivalencia mais fiel com `Sim`/`Nao` + complemento por pergunta, a estrutura atual ainda nao prova suficiencia completa.
- Se a proxima etapa quiser salvar o estado visual da lista de perguntas, o contrato deve ser separado antes de tocar em backend, payload ou schema.

## 8. Decisao de fluxo

**FICHA-ANAM-PERSIST-A**

Motivo:

- a persistencia textual atual existe e e funcional para o contrato minimo;
- o legado aponta para resposta estruturada, mas a confirmacao 1:1 ainda nao foi obtida;
- o fluxo de `Anamnese` ja esta modularizado visualmente e pode ser tratado em contrato menor;
- a maior seguranca, neste momento, e separar o contrato de confirmacao de saida do contrato de salvamento estruturado.

Interpretacao pratica da decisao A:

- manter o contrato atual sem novo banco para o que ja existe;
- criar, se necessario, um contrato posterior especifico para salvar `Sim`/`Nao` e complemento de forma estruturada;
- nao misturar persistencia, confirmacao de saida e evolucao visual em uma unica rodada.

## 9. Proposta de contrato de confirmacao de alteracao

### 9.1 Mensagem base sugerida

**Titulo:** `Os dados foram alterados`

**Mensagem:** `Ha alteracoes nao salvas na Anamnese. Deseja gravar antes de sair?`

### 9.2 Acoes sugeridas

- `Gravar`
- `Descartar`
- `Cancelar`

### 9.3 Regras sugeridas

- Se o usuario clicar em `Gravar`, a tela deve persistir o estado atual antes de sair.
- Se clicar em `Descartar`, a tela deve abandonar as alteracoes locais.
- Se clicar em `Cancelar`, a saida deve ser interrompida.
- O contrato nao deve alterar backend, banco ou payload sem nova autorizacao.

### 9.4 Escopo da confirmacao

- idealmente ao sair da aba `Anamnese`;
- ao trocar de paciente;
- ao fechar a `Ficha Pessoal`;
- e, se necessario, ao trocar o questionario com alteracoes pendentes.

## 10. Caminhos futuros de modularizacao

### 10.1 Frente de frontend

Se a aba vier a exigir persistencia estruturada, o nome conceitual mais coerente continua sendo:

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

### 10.2 Frente de backend, se algum dia houver expansao

Somente se o contrato futuro exigir separar logica de negocio, os nomes podem seguir o padrao com underscore:

- `backend/routes/ficha_pessoal_anamnese_routes.py`
- `backend/models/ficha_pessoal_anamnese.py`
- `backend/schemas/ficha_pessoal_anamnese.py`

### 10.3 Estrategia de isolamento

- evitar integrar no boot global da aplicacao sem necessidade;
- manter a navegacao da `Ficha Pessoal` segura antes de mexer em persistencia;
- dividir visual, confirmacao de saida e persistencia em contratos menores;
- preservar o salvamento textual enquanto nao existir contrato mais profundo;
- nao repetir a falha de regressao global vista na tentativa da aba `Anotacoes`.

## 11. Proxima recomendacao

A proxima etapa segura, se houver continuidade, e definir primeiro o contrato de confirmacao de alteracao e, so depois, decidir se a persistencia permanece textual ou passa a ser estruturada por pergunta.

Nao misturar salvamento estruturado, confirmacao de saida e nova UI em uma so rodada sem contrato claro.

## 12. Registro para roadmap

Esta auditoria documenta:

- a leitura do estado atual da aba `Anamnese` no Brana Cloud;
- a leitura em somente leitura das shares legadas `\\Sonyvaio\\c\\EDS70` e `\\Dell_servidor\\c\\EDS70`;
- a confirmacao de que os scripts de descoberta de ambas as shares apresentam a mesma estrutura de anamnese;
- o que foi comprovado, inferido e nao comprovado;
- a relacao entre `ANAMNESE_QUEST`, `ANAMNESE_PERG` e `ANAMNESE_RESP`;
- a leitura do contrato atual do Brana Cloud para persistencia textual;
- a conclusao de que o contrato minimo nao exige novo banco, mas a equivalencia completa com o legado ainda nao foi provada;
- a proposta de confirmacao `Os dados foram alterados...` antes de sair da ficha;
- a decisao `FICHA-ANAM-PERSIST-A`;
- os caminhos futuros sugeridos de modularizacao;
- a confirmacao de que nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental;
- o respeito a blindagem textual/mojibake.
