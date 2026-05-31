# Ficha pessoal - Anamnese - Contrato de persistencia real de Sim/Nao + complemento

## 1. Objetivo

Definir um contrato seguro para a persistencia real da aba `Anamnese` da `Ficha Pessoal`, cobrindo a gravacao e a recuperacao de `Sim` / `Nao` + complemento por pergunta, sem misturar esta evolucao com backend, banco ou migracao nesta etapa documental.

## 2. Contexto

Esta etapa e somente documental.

Ela nasce depois da validacao da camada local de confirmacao sem salvamento e da organizacao visual da aba `Anamnese`.

O ponto central agora e decidir como guardar de forma real o estado da resposta por pergunta, incluindo o complemento, sem quebrar a estrutura atual da `Ficha Pessoal`.

## 3. Estado atual do Brana Cloud

- A aba `Anamnese` existe na `Ficha Pessoal`.
- O cabecalho mostra o nome do paciente atual.
- Existe combo visivel de `Questionario`.
- A area inferior ja exibe a lista visual de perguntas do questionario selecionado.
- Os controles `Sim` / `Nao` e o campo de complemento estao organizados visualmente.
- A camada local de confirmacao de saida ja existe e foi validada.
- Nao existe salvamento real consolidado para `Sim` / `Nao` + complemento nesta etapa.
- A persistencia atual continua textual em `PUT /anamnese/pacientes/{id}/respostas`.

## 4. O que o legado EasyDental sugere

As shares legadas `\\Sonyvaio\\c\\EDS70` e `\\Dell_servidor\\c\\EDS70` foram lidas em modo somente leitura em etapas anteriores.

Os scripts SQL de descoberta mostraram a estrutura:

- `ANAMNESE_QUEST`
- `ANAMNESE_PERG`
- `ANAMNESE_RESP`

Na tabela legada `ANAMNESE_RESP` aparecem os campos:

- `RESPOSTA`
- `COMPLEM`

Isso sugere um fluxo por pergunta com resposta e complemento, muito provavelmente no padrao `Sim` / `Nao` + observacao.

## 5. Estrutura atual do Brana Cloud

### 5.1 Frontend

- `frontend/app.js` segue como fachada principal da `Ficha Pessoal`.
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js` responde pela parte modular da aba.
- `frontend/js/modules/anamnese.js` existe, mas permanece passivo nesta linha de analise.

### 5.2 Backend

- `backend/routes/anamnese_routes.py`
  - `GET /anamnese/questionarios`
  - `GET /anamnese/questionarios/{questionario_id}/perguntas`
  - `GET /anamnese/pacientes/{paciente_id}/respostas`
  - `PUT /anamnese/pacientes/{paciente_id}/respostas`
  - `POST /anamnese/questionarios/{questionario_id}/renumerar`
- `backend/models/anamnese.py`
  - `AnamnesePergunta`
  - campos principais: `questionario_id`, `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta`, `clinica_id`
- `backend/models/anamnese_resposta.py`
  - `AnamneseResposta`
  - campos principais: `paciente_id`, `questionario_id`, `pergunta_id`, `resposta`, `clinica_id`

### 5.3 Conclusao tecnica da estrutura atual

A estrutura atual suporta persistencia textual real.

Ela nao expoe, hoje, um campo separado para complemento em nivel de schema, entao qualquer fidelidade maior ao legado precisara ser decidida em contrato.

## 6. Analise das opcoes

| Opcao | Ideia | Precisa backend/db/migracao? | Risco | Vantagem | Limite |
| --- | --- | --- | --- | --- | --- |
| B1 | Persistencia textual minima usando o campo textual atual | Nao | Baixo/medio | Mais simples e mais segura | Perde fidelidade semantica do legado |
| B2 | Persistencia estruturada em envelope textual no estado atual | Nao | Medio | Guarda `Sim` / `Nao` + complemento de forma organizada sem mudar schema | Continua dependente de serializacao textual |
| B3 | Persistencia estruturada com evolucao de backend/schema | Sim | Alto | Mais fiel ao legado e mais queryavel | Exige migracao, ajustes de API e maior risco |
| B4 | Pausar a persistencia real por enquanto | Nao | Muito baixo | Evita risco imediato | Nao atende o objetivo funcional |

## 7. Resposta objetiva as perguntas de contrato

### 7.1 O que se pretende?

Persistir de forma real o estado da resposta por pergunta na aba `Anamnese`, incluindo `Sim` / `Nao` e complemento.

### 7.2 Qual e o contexto?

A aba ja esta organizada visualmente e possui confirmacao local sem salvamento; falta decidir a forma real de persistencia.

### 7.3 Qual e o estado atual?

O estado atual e textual, com API pronta para salvar/resgatar respostas por paciente/questionario/pergunta.

### 7.4 O que o legado mostra?

O legado mostra separacao entre resposta e complemento em `ANAMNESE_RESP`, o que reforca a necessidade de contrato claro.

### 7.5 Qual e a estrutura atual do Brana Cloud?

O Brana Cloud atual tem tabela e rotas de anamnese, mas a resposta guardada continua textual.

### 7.6 Quais endpoints e modelos existem?

Os endpoints e modelos listados na secao 5 ja existem e devem ser respeitados nesta etapa contratual.

### 7.7 Qual opcao e a mais segura agora?

**B2** e a melhor opcao de equilibrio entre seguranca e persistencia real, porque permite salvar `Sim` / `Nao` + complemento como envelope textual sem mudar backend, banco ou migracao nesta rodada.

### 7.8 E B1?

B1 e o caminho mais simples, mas perde mais informacao semantica e fica mais distante do legado.

### 7.9 E B3?

B3 e a opcao mais fiel ao legado, porem exige evolucao de backend/schema e maior risco.

### 7.10 E B4?

B4 so faz sentido se o objetivo for adiar a persistencia real.

### 7.11 Qual e o risco?

O risco de B2 e medio, porque ainda depende de serializacao textual e de um contrato rigoroso de encode/decode.

### 7.12 E necessario backend, banco ou migracao?

Para B2, nao.

Para B3, sim.

### 7.13 E necessario novo endpoint?

Para B2, nao.

Para B3, provavelmente sim, ou ao menos extensao clara do contrato atual.

### 7.14 Qual e o impacto em frontend, payload e salvamento?

No B2, o frontend precisa codificar e decodificar o envelope, mas o payload e o salvamento continuam usando o contrato textual existente.

### 7.15 Quais sao os subpassos?

1. Definir o formato textual/envelope de persistencia.
2. Definir leitura e escrita do estado por pergunta.
3. Definir o gatilho de salvamento.
4. Definir o comportamento de saida com alteracoes pendentes.
5. Validar com um questionario pequeno antes de expandir.

### 7.16 Qual e a conclusao?

A persistencia real pode ser iniciada sem backend novo, desde que o contrato use um envelope textual consistente e fique claro que a fidelidade 1:1 ao legado ainda nao foi concluida.

## 8. Decisao recomendada

**FICHA-ANAM-PERSIST-B2**

Motivos:

- o Brana Cloud ja possui rota e modelo textual suficientes para guardar dados reais;
- a estrutura atual ainda nao prova necessidade imediata de migracao;
- o legado pede persistencia mais rica, mas isso pode ser tratado em envelope textual primeiro;
- a camada visual ja esta pronta para receber um contrato de persistencia real;
- B2 reduz risco em relacao a B3 e entrega salvamento real antes de uma eventual evolucao de schema.

## 9. Escopo permitido

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/app.js`, apenas se houver hook necessario e pequeno para integrar salvamento
- leitura e escrita textual pelo endpoint existente
- documentacao e roadmap
- validacao manual posterior

## 10. Escopo proibido

- backend novo
- banco novo
- migracao nova
- seeds novas
- endpoints novos, salvo contrato futuro separado
- `.env`
- `requestJson`
- payload de rede fora do contrato textual atual
- alteracao de formato de salvamento sem contrato
- alteracao em `Anotacoes`
- alteracao em `Procura`
- alteracao em `Historico`
- alteracao em outras abas da `Ficha Pessoal` sem contrato separado

## 11. Necessidade de backend, banco, migracao e novo endpoint

Para B2:

- backend novo: nao
- banco novo: nao
- migracao: nao
- novo endpoint: nao

Para B3:

- backend novo: sim ou extensao formal das rotas
- banco novo: sim ou alteracao do schema
- migracao: sim
- novo endpoint: provavel

## 12. Impacto em frontend, payload e formato de salvamento

### 12.1 Frontend

O frontend precisa guardar o estado por pergunta e serializar/deserializar o envelope no momento de salvar e carregar.

### 12.2 Payload

No B2, o payload continua textual no contrato atual; o conteudo interno e que passa a carregar um envelope estruturado.

### 12.3 Formato de salvamento

O formato de salvamento deixa de ser apenas texto livre e passa a ser um texto estruturado, compativel com o campo atual.

### 12.4 Registro de complemento

O complemento nao precisa virar coluna nova no B2; ele pode viajar junto no envelope textual.

## 13. Subpassos sugeridos

1. Definir o formato do envelope textual.
2. Definir como o `Sim` / `Nao` e o complemento serao codificados.
3. Definir como cada pergunta sera identificada no envelope.
4. Definir leitura inicial ao abrir a aba.
5. Definir escrita minima quando o usuario confirmar salvamento.
6. Definir comportamento de troca de questionario com alteracao pendente.
7. Definir comportamento de saida da ficha com alteracao pendente.
8. Validar com um questionario simples e depois com um questionario maior.

## 14. Testes futuros

- abrir `Ficha Pessoal`;
- entrar em `Anamnese`;
- selecionar questionario;
- marcar `Sim` / `Nao`;
- preencher complemento;
- salvar;
- sair e voltar para confirmar restauracao do estado;
- trocar de questionario e verificar isolamento;
- trocar de paciente e confirmar persistencia por paciente/questionario/pergunta;
- validar `Procura...`, `Novo`, `Fechar` e `Sair` com alteracoes pendentes;
- confirmar que `Anotacoes`, `Historico` e as demais abas seguem estaveis.

## 15. Conclusao

B2 e a recomendacao equilibrada para iniciar a persistencia real da aba `Anamnese` sem criar novo backend, novo banco ou novo endpoint nesta rodada.

B1 continua como fallback caso seja necessario simplificar ainda mais.

B3 deve ficar reservado para uma evolucao posterior, mais fiel ao legado, quando houver contrato proprio para schema e API.

B4 so faz sentido se o projeto decidir pausar esta frente.

## 16. Registro para roadmap

Este contrato documenta:

- a analise das opcoes B1, B2, B3 e B4 para a persistencia real da `Anamnese`;
- a leitura do legado EasyDental como referencia de resposta + complemento;
- a confirmacao da estrutura atual do Brana Cloud com persistencia textual e rotas/modelos dedicados;
- a recomendacao **FICHA-ANAM-PERSIST-B2**;
- a conclusao de que nao ha necessidade imediata de backend novo, banco novo, migracao ou novo endpoint para iniciar a persistencia real nesta rodada;
- a decisao de manter o salvamento por envelope textual na estrutura atual, preservando o contrato existente;
- a confirmacao de que nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental;
- o respeito a blindagem textual/mojibake.
