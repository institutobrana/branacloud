# Ficha Pessoal - Auditoria do fluxo de questionario da Anamnese

## 1. Contexto

Esta etapa e somente documental.

Ela foi aberta depois da estabilizacao previa da navegacao da `Ficha Pessoal`, incluindo a validacao do botao `Procura...` reentrante, para responder uma pergunta mais ampla: o fluxo de questionario da aba `Anamnese` do Brana Cloud esta suficientemente claro, documentado e comparavel ao legado EasyDental?

Para esta auditoria foram lidos documentos locais do proprio repositório e foi feita tentativa de leitura em modo somente leitura do legado em `\\Sonyvaio\\c\\EDS70`. A share foi confirmada como acessivel, mas uma varredura ampla para extrair evidencias detalhadas excedeu o tempo disponivel, entao a comparacao direta com a UI do EasyDental ficou parcial e parte dela permaneceu inferida.

## 2. Fontes inspecionadas

### 2.1 Documentos locais do Brana Cloud

- `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`
- `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`
- `docs/ficha_pessoal_anamnese_implementacao_combo_questionarios.md`
- `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`
- `docs/ficha_pessoal_anamnese_limpeza_botao_quadros.md`
- `docs/ficha_pessoal_validacao_botao_procura_reentrante.md`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/05_banco_dados.md`
- `docs/_historico_auditoria/04_funcionalidades.md`
- `docs/_historico_auditoria/05_banco_dados.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

### 2.2 Codigo e backend lidos somente para auditar

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `backend/routes/anamnese_routes.py`
- `backend/main.py`

### 2.3 Legado EasyDental / fonte externa somente leitura

- `\\Sonyvaio\\c\\EDS70` foi confirmado como acessivel em leitura.
- A tentativa de varredura ampla da share para localizar artefatos de anamnese excedeu o tempo.
- Portanto, nesta etapa, nao foi possivel extrair uma UI direta completa do EasyDental para comparacao visual 1:1.

## 3. O que foi comprovado

- A aba `Anamnese` da `Ficha Pessoal` existe no `frontend/app.js`.
- O cabecalho da aba mostra o nome do paciente atual em campo readonly.
- Existe um combo visivel de `Questionario` na aba clinica.
- O combo usa a fonte existente da clinica por meio de `GET /anamnese/questionarios`.
- A aba possui bloqueio defensivo para nao abrir `Anamnese` e `Historico` sem paciente valido.
- O backend possui modelos e rotas dedicados para questionarios, perguntas e respostas.
- A persistencia atual continua textual, por meio de `PUT /anamnese/pacientes/{id}/respostas`.
- O namespace `frontend/js/modules/anamnese.js` existe, mas continua passivo nesta linha de analise.
- A area inferior da aba clinica foi simplificada em rodadas anteriores e nao reproduz sozinha o grid rico do EasyDental.

## 4. O que foi inferido

- O legado EasyDental usa um conjunto de questionarios-modelo, como `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saude` e `Anamnese pessoal`, com base nos artefatos de descoberta e documentacao legada.
- O fluxo historico do EasyDental parece apresentar uma lista de perguntas com resposta estruturada, algo que ainda nao foi comprovado como equivalencia visual completa no Brana Cloud.
- O acoplamento atual da aba com `frontend/app.js` sugere que qualquer evolucao mais rica deve ser feita em recortes pequenos.
- O fato de existir o backend normalizado nao garante, por si so, equivalencia visual com o legado.

## 5. O que nao foi comprovado

- UI direta e completa do EasyDental para a aba `Anamnese` neste workspace.
- Equivalencia visual 1:1 com o legado na lista de perguntas.
- Fluxo Sim/Nao + complemento separado por pergunta como comportamento ja reproduzido de ponta a ponta.
- Motor de alertas clinicos por regra na mesma experiencia visual do EasyDental.
- Separacao clara entre tela clinica e tela administrativa em componentes independentes.
- Maior parte da experiencia por questionario em um modulo passivo realmente consumido, sem depender do monolito principal.

## 6. Matriz comparativa EasyDental x Brana Cloud

| Item | EasyDental esperado | Brana Cloud atual | Status | Risco | Recomendacao |
| --- | --- | --- | --- | --- | --- |
| Combo de questionario | Combo visivel e claro com modelos/questionarios | Combo visivel existe e carrega da API da clinica | Parcialmente comprovado | Medio | Manter como base do fluxo |
| Lista de perguntas | Grid/lista por questionario, com leitura facil | A area inferior nao reproduz a grade rica do legado | Incompleto | Medio | Separar contrato de renderizacao da lista |
| Resposta por pergunta | Sim/Nao + complemento/observacao por item | Persistencia atual e textual, centrada em uma resposta | Incompleto | Alto | Tratar em contrato posterior, separado |
| Alertas clinicos | Regras e avisos por resposta | Nao comprovado como regra clinica real | Nao comprovado | Medio/alto | Diagnostico especifico antes de mudar |
| Persistencia | Respostas por paciente/questionario/pergunta | Existe tabela normalizada e PUT dedicado | Comprovado | Medio | Manter leitura de contrato atual |
| Backend | Rotas e modelos especificos | Existem rotas/modelos dedicados | Comprovado | Medio | Evitar mudancas sem novo contrato |
| UI global | Fluxo estavel sem regressao de menus | O historico da aba `Anotacoes` mostrou que o boot global e sensivel | Comprovado como risco | Alto | Nao repetir integracao global sem isolamento |

## 7. Decisao de fluxo

**FICHA-ANAM-FLUXO-A**

Motivo:

- o fluxo minimo ja tem base tecnica para ser tratado de forma incremental;
- o combo de questionario e a persistencia textual existem;
- o que falta para equivalencia com o legado e principalmente visual/funcional, nao estrutural puro;
- a tentativa de chegar tudo de uma vez aumentaria o risco, sobretudo por acoplamento do frontend e risco de regressao global.

Interpretacao pratica da decisao A:

- seguir por recorte pequeno;
- manter o comportamento atual de texto puro;
- separar a proxima evolucao em uma subetapa que trate primeiro a listagem/selecion de questionario ou a renderizacao da area de perguntas, nunca as duas coisas ao mesmo tempo sem contrato adicional.

## 8. Caminhos futuros de modularizacao

### 8.1 Frente de frontend

Se a aba vier a ser modularizada, o nome conceitual mais coerente e:

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

Essa separacao so faz sentido se o modulo nascer ja consumido pela fachada da ficha, e nao como arquivo morto.

### 8.2 Frente de backend, se algum dia houver expansao

Somente se o contrato futuro exigir separar a logica de negocio, os nomes podem seguir o padrao com underscore:

- `backend/routes/ficha_pessoal_anamnese_routes.py`
- `backend/models/ficha_pessoal_anamnese.py`
- `backend/schemas/ficha_pessoal_anamnese.py`

Isto nao e recomendacao de implementacao imediata; e apenas o caminho de organizacao caso a evolucao precise sair do monolito atual.

### 8.3 Estrategia de isolacao

- evitar integrar no boot global da aplicacao sem necessidade;
- manter a navegaçao da `Ficha Pessoal` segura antes de mexer na aba;
- dividir visual, carregamento e persistencia em contratos menores;
- preservar o salvamento textual enquanto nao existir contrato mais profundo.

## 9. Proxima recomendacao

A proxima etapa segura, se houver continuidade, e manter o escopo pequeno e separado:

1. ou estabilizar a selecao/visualizacao do questionario;
2. ou preparar a area inferior para listar perguntas do questionario selecionado.

Nao misturar as duas evolucoes numa so rodada sem contrato claro.

## 10. Registro para roadmap

Esta auditoria documenta:

- a leitura do estado atual da aba `Anamnese` no Brana Cloud;
- a comparacao com o legado EasyDental com base em docs locais e na share somente leitura `\\Sonyvaio\\c\\EDS70`;
- o que foi comprovado, inferido e nao comprovado;
- a matriz comparativa EasyDental x Brana Cloud;
- a decisao `FICHA-ANAM-FLUXO-A`;
- os caminhos futuros sugeridos de modularizacao;
- a confirmacao de que nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental;
- o respeito a blindagem textual/mojibake.
