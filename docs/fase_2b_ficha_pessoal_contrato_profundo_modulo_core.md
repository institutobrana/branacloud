# Ficha pessoal - contrato profundo do modulo core

## Contexto

- A Fase 2B continua pausada em termos de implementacao funcional.
- O usuario autorizou explicitamente a analise de `Ficha pessoal`.
- Esta frente deve ser tratada como `modulo comum/core`.
- Esta etapa e somente documental, sem alteracao de codigo, banco, backend, HTML, seed, migration ou permissao.

## Escopo

- Mapear o bloco funcional de `Ficha pessoal` por leitura.
- Registrar o grau de acoplamento com `requestJson`, payload, salvamento, exclusao, anamnese, agenda, financeiro e permissoes.
- Identificar se existe uma superficie segura para contrato pequeno futuro.
- Registrar a decisao de continuidade ou pausa com base no mapa real do codigo.

## Arquivos mapeados

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- `backend/routes/cadastros_routes.py`
- `backend/routes/anamnese_routes.py`
- `frontend/index.html` apenas como ponto de entrada do menu `Ficha pessoal...`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes principais em `frontend/app.js`

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
- `fichaAtalhoCodigoBlur`
- `fichaProcurarPaciente`

## Menu de pacientes e acoplamentos proximos

- `fichaMenuPacEnsureUI`
- `fichaMenuPacCarregarPreferencias`
- `fichaMenuPacSalvarPreferencias`
- `fichaMenuPacCarregarOptions`
- `fichaMenuPacAplicarLayout`
- `fichaMenuPacSelecionarLinha`
- `fichaMenuPacRender`
- `fichaMenuPacPesquisar`
- `fichaMenuPacLimpar`
- `fichaMenuPacFechar`
- `fichaMenuPacConfirmar`
- `fichaMenuPacAbrir`

## Anamnese acoplada a ficha

- `fichaAnamneseCarregar`
- `fichaAnamneseSalvarSelecionada`
- `fichaAnamneseImprimir`
- wrappers de `fichaEnsureUI`, `fichaAplicarPaciente`, `fichaLimparNovo` e `fichaSetTab`

## Endpoints mapeados

- `GET /cadastros/pacientes/{id}`
- `GET /cadastros/pacientes/por-codigo/{codigo}`
- `POST /cadastros/pacientes`
- `PUT /cadastros/pacientes/{id}`
- `DELETE /cadastros/pacientes/{id}`
- `GET /cadastros/pacientes/proximo-codigo`
- `GET /cadastros/pacientes/menu-preferences`
- `PATCH /cadastros/pacientes/menu-preferences`
- `GET /cadastros/pacientes/menu-options`
- `GET /cadastros/pacientes/menu`
- `GET /cadastros/pacientes/navegar`
- `GET /anamnese/pacientes/{paciente_id}/respostas`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

## Superficie de acoplamento

- `fichaEnsureUI` cria o shell visual, injeta estilos e registra eventos.
- `fichaCarregarCombos` usa `requestJson` para unidades, prestadores e convenios/planos.
- `fichaSalvarPaciente` usa `requestJson` para `POST`/`PUT` de paciente.
- `fichaExcluirPaciente` depende de `requestJson` para exclusao.
- `fichaMenuPac*` depende de `requestJson` para preferencias, opcoes e busca.
- `fichaAnamnese*` depende de `requestJson` para carregar e salvar respostas.
- `fichaSetTab("anamnese")` carrega anamnese automaticamente.
- `fichaAplicarPaciente` e `fichaLimparNovo` sao wrappers que forcam estados correlatos.
- O menu de pacientes influencia a abertura da ficha, a selecao de linha e a troca entre paciente, contato e indicado.

## Modulacao passiva adjacente

- `frontend/js/modules/anamnese.js` existe como namespace passivo, mas apenas para validacoes e metadados de anamnese.
- Nao existe, nesta leitura, um namespace passivo proprio e consolidado para o shell de `Ficha pessoal`.
- Portanto, a frente continua ancorada principalmente em `frontend/app.js`.

## Risco por area

- Shell visual e montagem inicial: medio-alto
- Busca e menu de pacientes: alto
- Salvamento de paciente: critico
- Exclusao de paciente: critico
- Menu preferences e opcoes do menu: alto
- Anamnese: alto
- Conexao com agenda/contatos/indicado: alto
- Conexao com convenios/planos/unidades/prestadores: alto
- Conexao com financeiro/documentos/historico: alto a critico
- Backend e banco: critico

## Candidatos de contrato analisados

- Apenas shell visual/abrir-fechar da ficha
- Apenas montagem dos combos da aba `Dados`
- Apenas menu de pacientes
- Apenas anamnese
- Apenas foto/telefones
- Apenas salvar/excluir

## Resultado da analise

- A superficie de `Ficha pessoal` e extensa e transversal.
- O bloco mistura cadastro de paciente, busca, menu, foto, telefones, convenios, planos, anamnese, historico e indicacoes.
- Os pontos de salvamento e exclusao permanecem fortemente acoplados a `requestJson` e a varias dependencias do estado global.
- A anamnese tem wrappers proximos, mas nao cria uma separacao segura para o shell principal.
- Nao foi identificado, nesta leitura, um recorte medio claramente seguro para implementacao imediata.

## Decisao

- **FICHA-CONTRATO-D**

## Interpretacao da decisao

- `Ficha pessoal` deve continuar tratada como `comum/core transversal`.
- A frente permanece pausada para implementacao.
- Antes de qualquer novo passo funcional, e necessario abrir nova matriz comparativa ou novo contrato especifico ainda mais pequeno.

## Proxima etapa recomendada

- Manter a pausa da frente `Ficha pessoal`.
- Se houver interesse futuro, voltar com novo contrato extremamente pequeno.
- Se nao houver nova autorizacao, seguir para outra frente ou para revisao documental geral.

## Limites reforcados

- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum backend foi alterado.
- Nenhum HTML foi alterado.
- Nenhuma migration, seed, endpoint ou permissao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## Registro para roadmap

- Registrar a abertura do contrato profundo documental de `Ficha pessoal` como modulo core.
- Registrar o mapeamento de `frontend/app.js`, `frontend/js/modules/anamnese.js`, `backend/routes/cadastros_routes.py` e `backend/routes/anamnese_routes.py` apenas por leitura.
- Registrar a decisao `FICHA-CONTRATO-D`.
- Registrar a recomendacao de pausa e retorno apenas com novo contrato ou nova matriz comparativa.
