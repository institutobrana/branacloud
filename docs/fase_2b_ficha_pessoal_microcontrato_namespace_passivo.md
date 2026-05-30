# Ficha pessoal - microcontrato de namespace passivo

## Objetivo

Avaliacao documental extremamente pequena para verificar se, em etapa futura, e seguro criar apenas um arquivo/namespace passivo para `Ficha pessoal`, sem migrar comportamento funcional.

## Classificacao multiarea

- `Ficha pessoal` continua classificada como `modulo comum/core`.
- A origem desta avaliacao e o contrato profundo anterior `FICHA-CONTRATO-D`.

## Contexto

- A Fase 2B segue em postura conservadora.
- O contrato profundo anterior concluiu que `Ficha pessoal` e ampla e fortemente acoplada.
- Esta etapa nao implementa nada.
- Nao ha alteracao de `frontend/app.js`, `frontend/index.html`, backend, banco, schema, migrations, seeds, endpoints, `.env` ou scripts.

## Documentos consultados

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_ficha_pessoal_contrato_profundo_modulo_core.md`
- `docs/fase_2b_revisao_documental_geral_pos_matriz_conv_plan.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- Historico documental anterior de Ficha Pessoal, pacientes, anamnese e modulo core ja registrado no roadmap.

## Padrões de namespace passivo existentes

- `frontend/js/modules/convenios-planos.js` expõe `window.BranaConveniosPlanosModule`.
- `frontend/js/modules/prestadores.js` expõe `window.BranaPrestadoresModule`.
- `frontend/js/modules/anamnese.js` expõe `window.BranaAnamneseModule`.
- `frontend/js/modules/preferencias-opcoes-sistema.js` expõe `window.BranaPreferenciasOpcoesSistemaModule`.
- O carregamento atual do sistema usa `<script src="...">` no `frontend/index.html` para os modulos existentes.
- Nao foi identificado carregamento generico automatico para um novo namespace sem mudar o HTML em etapa posterior.

## Nome sugerido do futuro arquivo

- `frontend/js/modules/ficha-pessoal.js`

## Nome sugerido do futuro namespace

- `window.BranaFichaPessoalModule`

## Escopo permitido para um namespace passivo futuro

- Declaracao do namespace.
- Objeto `helpers` vazio.
- No maximo, metadados passivos.
- Sem chamada automatica.
- Sem wiring de eventos.
- Sem `requestJson`.
- Sem payload.
- Sem salvamento.
- Sem exclusao.
- Sem backend.
- Sem banco.
- Sem alteracao em `frontend/index.html`.

## Avaliacao de `frontend/index.html`

- `frontend/index.html` ja carrega os modulos existentes por script tags explicitas.
- Nao existe, nesta leitura, um loader generico que torne um novo arquivo passivo util sem algum passo posterior.
- Portanto, para uso real, um passo futuro provavelmente precisaria tocar `frontend/index.html`.
- Nesta etapa, nao e necessario alterar `frontend/index.html`.
- Alterar `frontend/index.html` agora aumentaria o risco sem ganho funcional imediato.

## Avaliacao de `frontend/app.js`

- `frontend/app.js` e a fonte funcional da verdade da ficha.
- Nao e necessario altera-lo para apenas criar um arquivo passivo vazio em etapa futura.
- Para consumir um namespace futuro de forma util, `frontend/app.js` provavelmente precisaria de um passo posterior.
- Nesta etapa, nao existe razao para tocar `frontend/app.js`.

## Separacao conceitual

- Criacao de arquivo passivo: possivel em etapa futura.
- Criacao de namespace passivo: possivel em etapa futura.
- Helpers puros: nao identificados como candidatos seguros nesta microavaliacao.
- Helpers visuais: nao identificados como candidatos seguros nesta microavaliacao.
- Consumo pelo `app.js`: somente em etapa posterior, se houver.
- Wiring/eventos: fora do escopo.
- Fluxos funcionais: fora do escopo.

## Fronteiras proibidas

- `fichaEnsureUI`
- `fichaCarregarCombos`
- `fichaAplicarPaciente`
- `fichaCarregarPacientePorId`
- `fichaAbrirPorCodigo`
- `fichaSalvarPaciente`
- `fichaExcluirPaciente`
- `fichaSetTab`
- `fichaLimparNovo`
- `fichaAbrirNovo`
- `fichaAbrirExistente`
- `fichaMenuPac*`
- wrappers de anamnese
- `requestJson`
- payload
- salvamento
- exclusao
- endpoints
- backend
- banco
- permissoes
- agenda
- financeiro
- convenios/planos
- anamnese funcional

## Comparacao dos micro-recortes

- **MICRO-FICHA-NS-1:** criar apenas arquivo `frontend/js/modules/ficha-pessoal.js` com namespace passivo vazio, sem tocar `app.js` e sem tocar `index.html`.
- **MICRO-FICHA-NS-2:** criar arquivo com namespace passivo e helpers vazios/placeholder, sem consumo pelo `app.js`.
- **MICRO-FICHA-NS-3:** criar namespace passivo com um helper puro isolado, somente se houver trecho claramente separado e sem efeito colateral.
- **MICRO-FICHA-NS-4:** nao criar namespace ainda; abrir microcontrato de helpers puros candidatos.
- **MICRO-FICHA-NS-5:** pausar Ficha Pessoal novamente por acoplamento excessivo.

## Analise dos micro-recortes

- `MICRO-FICHA-NS-1` e o menor risco porque produz apenas um artefato passivo.
- `MICRO-FICHA-NS-2` aumenta a superficie sem necessidade pratica nesta fase.
- `MICRO-FICHA-NS-3` nao encontra, nesta leitura, um helper puro claramente isolado em Ficha Pessoal.
- `MICRO-FICHA-NS-4` e mais conservador que os anteriores, mas posterga demais a definicao do namespace.
- `MICRO-FICHA-NS-5` e seguro, porém interrompe totalmente a trilha do namespace.

## Decisao final

- **FICHA-NS-A**

## Interpretação da decisao

- Em etapa futura, o primeiro movimento seguro pode ser a criacao apenas do arquivo passivo vazio `frontend/js/modules/ficha-pessoal.js`, sem consumo pelo `app.js`.
- Isso nao substitui o passo posterior de integracao real, caso venha a ser autorizado.
- O namespace futuro permanece apenas como artefato de preparacao, nao como funcionalidade.

## Proximo documento recomendado

- Se houver nova autorizacao, abrir um microcontrato ainda menor para decidir se o namespace vazio tera algum helper passivo minimo ou se permanecerá apenas como arquivo de preparacao.

## Onde o usuario devera testar futuramente, se houver implementacao

- Apenas em validacao posterior de carga de arquivo/namespace.
- Nao ha fluxo funcional para testar nesta etapa.

## Commit seletivo obrigatorio

Se e somente se as unicas alteracoes forem:

- `docs/fase_2b_ficha_pessoal_microcontrato_namespace_passivo.md`
- `docs/11_roadmap_desenvolvimento.md`

fazer commit seletivo apenas desses arquivos.

## Registro para roadmap

- Abertura do microcontrato de namespace passivo da Ficha Pessoal.
- Classificacao multiarea confirmada como `comum/core`.
- Origem na decisao `FICHA-CONTRATO-D`.
- Decisao final `FICHA-NS-A`.
- Confirmacao de que nenhum codigo ou banco foi alterado.
- Proximo passo recomendado: somente em etapa futura, avaliar a criacao do arquivo passivo vazio sem consumo imediato pelo `app.js`.
