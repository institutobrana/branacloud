# Auditoria visual e funcional da tela principal odontologica do EasyDental

## 1. Objetivo
Registrar uma analise inicial da tela principal odontologica do EasyDental com base nos dois prints fornecidos pelo usuario e nas fontes locais indicadas para comparacao tecnica.

Esta etapa e somente documental.
Nao e implementacao.
Nao recria a tela inteira.
Nao copia assets, icones, imagens ou arquivos proprietarios do EasyDental para o Brana Cloud.

## 2. Blindagem textual e escopo
- Respeitar a regra de blindagem textual e mojibake indicada pelo usuario.
- Nao corrigir nomes, labels, menus ou textos legados fora do escopo desta auditoria.
- Se algum texto parecer suspeito ou inconsistente, registrar apenas como observacao.
- Nao alterar frontend, backend, banco, schema, migrations, seeds, endpoints ou assets.

## 3. Fontes consultadas

### 3.1 Prints fornecidos pelo usuario
- Print 1: tela principal livre, sem paciente aberto.
- Print 2: tela principal com paciente aberto.

Uso nesta auditoria:
- Referencia visual principal para decomposicao funcional.
- Base para comparar estados vazio e preenchido.
- Base para identificar regioes, comportamento de painel e dependencia visual do tratamento.

Observacao:
- Os prints foram usados apenas como referencia visual e documental.
- Nenhuma imagem do EasyDental foi copiada.

### 3.2 `D:\UTIL\EasyDental_7.6_BR`
- Acessibilidade no ambiente: acessivel em leitura.
- Papel provavel: pacote de instalacao / midia de distribuicao, nao a base viva principal.
- Itens visiveis no nivel raiz:
  - `CEP`
  - `CRACK`
  - `EDS75_Client`
  - `EDS75_Server`
  - `MSDE`
  - `Suporte`
  - `Update`
  - `Autorun.inf`
  - `Esy76win7 7.6.iso`
  - `Instalação.txt`
  - `Readme.doc`
  - `setup.exe`

Elementos que podem ajudar futuramente:
- `Readme.doc` e `Instalação.txt` para contexto operacional e de instalacao.
- Estrutura de cliente/servidor legada para entender a organizacao do pacote, se necessario.

Confirmacao de seguranca:
- Nenhuma escrita foi feita nesse diretorio.
- Nenhum arquivo foi movido, renomeado, apagado ou copiado.
- Nenhum instalador foi executado.

### 3.3 `Y:\EDS70`
- Acessibilidade no ambiente: acessivel em leitura.
- Papel provavel: instalacao viva/legado operacional para comparacao tecnica.
- Itens visiveis no nivel raiz:
  - Pastas: `Bitmaps`, `Dados`, `Fotos`, `Help`, `Icones`, `Import`, `MSDE`, `Objetos`, `Outbox`, `Reports`, `Safe`, `Slide`, `Temp`, `Textos`, `TISS`
  - Arquivos: `Alarme.wav`, `atwdll.dll`, `CKS.exe`, `crp32002.ngn`, `crp32dll.dll`, `Digital.fnt`, `EasyConduit.dll`, `EasyCtrl.dll`, `EasyPhLb.dll`, `ED.41s`, `ED.ckn`, `ED.ent`, `ED.key`, `ED.LIC`, `ED.rst`, `EDBKP.DLL`, `EDBKP70.exe`, `EDCAP70.DLL`, `EDCAP70.EXE`, `EDCAP70CTRL.DLL`, `EDCAP70MENU.dll`, `EDCAP70RES.DLL`, `EDCAP70RTL.DLL`, `EDCON.dll`, `EDIMP70.exe`, `EDIMP71.exe`, `EDIMP75.exe`, `eds70.dsn`, `EDS70.exe`, `EDSSH70.exe`, `EDUTL70.exe`, `firewall.reg`, `GeraArqHTML.dll`, `Jet.REG`, `LFAVI80N.DLL`, `LFAWD80N.DLL`, `LFBMP80N.DLL`, `LFCAL80N.DLL`, `LFCMP80n.DLL`, `LFEPS80N.DLL`, `LFFAX80N.DLL`, `lffpx7.dll`, `lffpx80n.dll`, `LFGIF80N.DLL`, `LFICA80N.DLL`, `LFIMG80N.DLL`, `lfkodak.dll`, `LFLMA80N.DLL`, `LFLMB80N.DLL`, `LFMAC80N.DLL`, `LFMSP80N.DLL`, `LFPCD80N.DLL`, `LFPCT80N.DLL`, `LFPCX80N.DLL`, `LFPNG80N.DLL`, `LFPSD80N.DLL`, `LFRAS80N.DLL`, `LFTGA80N.DLL`, `lftif80n.dll`, `LFWFX80N.DLL`, `LFWMF80N.DLL`, `LFWPG80N.DLL`, `Logo2.bmp`, `Logo3.bmp`, `ltefx80n.dll`, `Ltfil80N.dll`, `ltimg80n.dll`, `ltkrn80n.dll`, `lttwn80n.dll`, `LTWND80n.DLL`, `Mensagens.txt`, `MergeList.tmp`, `Mesclagem.txt`, `Microsoft.VC80.CRT.manifest`, `msvcr80.dll`, `msxml3sp2Setup.exe`, `SetupEx.exe`, `setupex.xco`, `splash_edc76.jpg`, `splash_eds76.jpg`, `Wait.avi`, `Xck16db.exe`, `ZLIB.DLL`

Elementos que podem ajudar futuramente:
- `eds70.dsn` para entendimento de conexao e configuracao.
- `Bitmaps`, `Objetos`, `Textos`, `Reports`, `Help`, `Icones` para inventario tecnico visual e documental.
- `Dados` para pistas de estrutura de persistencia e dados auxiliares.
- `ED.LIC`, `ED.key`, `ED.rst`, `ED.ent` para contexto de licenciamento/instalacao.
- `EDS70.exe` e utilitarios para entender o arranjo operacional, sem executar nada nesta etapa.

Confirmacao de seguranca:
- Nenhuma escrita foi feita nesse diretorio.
- Nenhum arquivo foi movido, renomeado, apagado ou copiado.
- Nenhum binario, instalador ou rotina do EasyDental foi executado.

### 3.4 Referencias atuais do Brana Cloud para consulta futura
- `frontend/index.html`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/odontograma-v1-arcada-render.js`
- `frontend/js/modules/odontograma-v1-history-grid.js`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `backend/routes/cadastros_routes.py`
- `backend/routes/tratamentos_routes.py`
- `backend/routes/odontograma_routes.py`
- `backend/routes/agenda_legado_routes.py`
- `backend/services/odontograma_service.py`
- `backend/contracts/odontograma_contract.py`
- `backend/models/odontograma_model.py`
- `backend/schemas/odontograma_schema.py`
- `backend/repositories/odontograma_repository.py`

## 4. Decomposicao por regioes visuais

### 4.1 Barra superior, toolbar e shell global
O que aparece no EasyDental:
- Faixa superior com menus globais do sistema.
- Toolbar com varios icones de atalho logo abaixo.

Funcao provavel:
- Navegacao global.
- Acesso rapido a rotinas frequentes.
- Encadeamento da tela principal com o resto do sistema.

Indicios no EasyDental:
- A estrutura viva `Y:\EDS70` inclui `EDS70.exe`, `Icones`, `Bitmaps`, `Textos`, `Reports` e `Help`, o que reforca a existencia de uma shell ampla e separada do odontograma em si.

Equivalente no Brana Cloud:
- `frontend/index.html`
- `frontend/js/modules/odontograma-v1-shell.js`
- menu global ja existente em `frontend/index.html`

Arquivos provaveis a consultar futuramente:
- `frontend/index.html`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`

Classificacao:
- Core/comum.

Risco de implementacao:
- Medio.

Dependencias provaveis:
- Sessao do usuario.
- Estado global da tela.
- Configuracao de menus, atalhos e permissao visual.

O que nao deve ser implementado ainda:
- Nao duplicar a shell inteira dentro do odontograma.
- Nao concentrar essa camada em `frontend/app.js`.
- Nao copiar icones do EasyDental.

### 4.2 Campo `Paciente` e filtro de intervencoes
O que aparece no EasyDental:
- Campo `Paciente:` com codigo e nome.
- Combobox `Todas intervencoes no tratamento`.

Funcao provavel:
- Localizar paciente.
- Abrir o contexto do paciente.
- Filtrar o escopo da leitura do tratamento.

Indicios no EasyDental:
- O print mostra dois estados claros:
  - sem paciente, o campo esta vazio;
  - com paciente, o codigo e o nome aparecem preenchidos.

Equivalente no Brana Cloud:
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`
- backend de pacientes em `backend/routes/cadastros_routes.py`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`
- `backend/routes/cadastros_routes.py`

Classificacao:
- Parte core/comum com uso odontologico.

Risco de implementacao:
- Medio.

Dependencias provaveis:
- Consulta de pacientes.
- Resolucao de paciente ativo.
- Vinculo com tratamento atual.

O que nao deve ser implementado ainda:
- Nao amarrar busca a escrita definitiva sem contrato funcional.
- Nao transformar o filtro em dependencia rigida sem entender o ciclo do tratamento.

### 4.3 Odontograma, arcadas e numeracao dental
O que aparece no EasyDental:
- Arcada superior e inferior.
- Dentes com estados visuais diferentes.
- Numeracao dental logo abaixo/entre as arcadas.

Funcao provavel:
- Mostrar estado odontologico do paciente/tratamento.
- Permitir leitura visual de dentes, regioes e intervencoes.

Indicios no EasyDental:
- O print com paciente aberto mostra marcacoes adicionais, realces e dentes com estados diferentes do estado vazio.
- A base `Y:\EDS70` mostra `Bitmaps`, `Objetos` e `Dados`, que sao coerentes com assets e estruturas do odontograma.

Equivalente no Brana Cloud:
- `frontend/js/modules/odontograma-v1-arcada-render.js`
- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/odontograma-v1.js`
- backend `backend/routes/odontograma_routes.py`
- backend `backend/services/odontograma_service.py`
- backend `backend/contracts/odontograma_contract.py`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1-arcada-render.js`
- `frontend/js/modules/odontograma-v1-layout.js`
- `backend/routes/odontograma_routes.py`
- `backend/services/odontograma_service.py`

Classificacao:
- Especifico de Odontologia.

Risco de implementacao:
- Alto.

Dependencias provaveis:
- Tratamento ativo.
- Estrutura de arcada e dentes.
- Resumo clinico.
- Persistencia de estados visuais.

O que nao deve ser implementado ainda:
- Nao tentar reproduzir toda a semantica do legado em uma unica etapa.
- Nao importar assets do EasyDental.
- Nao misturar desenho da arcada com escrita clinica completa.

### 4.4 Datas e atalhos do tratamento
O que aparece no EasyDental:
- Datas de tratamento em forma de pequenos atalhos.
- Quando ha paciente, aparecem mais marcacoes temporais e referenciais do historico do tratamento.

Funcao provavel:
- Navegar entre momentos do tratamento.
- Registrar marcos de evolucao.
- Permitir seletor temporal/contextual.

Indicios no EasyDental:
- No estado com paciente, ha datas visiveis acima do painel de procedimentos.

Equivalente no Brana Cloud:
- `frontend/js/modules/odontograma-v1.js`
- backend de tratamentos em `backend/routes/tratamentos_routes.py`
- modelo `backend/models/tratamento.py`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1.js`
- `backend/routes/tratamentos_routes.py`
- `backend/models/tratamento.py`

Classificacao:
- Especifico de Odontologia, com dependencias de core.

Risco de implementacao:
- Medio a alto.

Dependencias provaveis:
- Tratamento persistido.
- Contexto temporal do paciente.

O que nao deve ser implementado ainda:
- Nao criar uma linha temporal complexa sem o contrato do tratamento.
- Nao acoplar a agenda diretamente a esse seletor sem mediacao.

### 4.5 Lista de procedimentos e faixa de icones laterais
O que aparece no EasyDental:
- Lista de procedimentos disponiveis.
- Faixa de pequenos icones abaixo da lista.
- Botao/atalho lateral entre o bloco do odontograma e a area central.

Funcao provavel:
- Selecionar procedimento.
- Navegar por familias de procedimento.
- Acionar acoes curtas do contexto odontologico.

Indicios no EasyDental:
- No estado com paciente, a lista de procedimentos e os icones ficam mais contextuais.
- A area sugere interacao direta com o tratamento, nao apenas leitura.

Equivalente no Brana Cloud:
- Parte ainda em evolucao no fluxo do odontograma V1.
- Historico e painel de procedimentos ja existem como referencia modular em:
  - `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - `frontend/js/modules/odontograma-v1.js`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

Classificacao:
- Especifico de Odontologia.

Risco de implementacao:
- Alto.

Dependencias provaveis:
- Catalogo de procedimentos.
- Regras de exibicao por tratamento.
- Semantica visual dos simbolos.

O que nao deve ser implementado ainda:
- Nao copiar a iconografia do EasyDental.
- Nao converter a lista em atalho de escrita sem contrato.

### 4.6 Painel direito, abas e agenda do dia
O que aparece no EasyDental:
- Faixa superior direita com rotulos:
  - `Paciente`
  - `Tratamento`
  - `Observacoes`
  - `Imagens`
  - `Documentos`
  - `Agenda`
- Painel de agenda com linhas de horario.

Funcao provavel:
- Navegacao por contexto clinico.
- Concentrar informacao de paciente, tratamento e apoio documental.
- Exibir agenda resumida do dia.

Indicios no EasyDental:
- O painel esta visivel nos dois estados.
- A agenda continua presente tanto sem paciente quanto com paciente.

Equivalente no Brana Cloud:
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `backend/routes/agenda_legado_routes.py`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/agenda_contatos_routes.py`

Classificacao:
- Core/comum com uso odontologico.

Risco de implementacao:
- Medio.

Dependencias provaveis:
- Agenda do dia.
- Painel de contexto.
- Estado de paciente/tratamento.

O que nao deve ser implementado ainda:
- Nao transformar as abas em replicas monoliticas.
- Nao misturar agenda com leitura do odontograma em um unico bloco.

### 4.7 Grade inferior de historico e procedimentos
O que aparece no EasyDental:
- Grade inferior com colunas como `Data`, `Cirurgiao`, `Regiao` e `Descricao do procedimento`.
- Quando ha paciente aberto, a grade fica preenchida.
- Quando nao ha paciente, a grade fica vazia.

Funcao provavel:
- Registrar a narrativa clinica do atendimento.
- Exibir eventos, procedimentos e evolucao do paciente.

Indicios no EasyDental:
- O print com paciente aberto mostra varias linhas preenchidas.
- O print sem paciente mostra a grade vazia, mas o cabecalho permanece presente.

Equivalente no Brana Cloud:
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- `frontend/js/modules/odontograma-v1-history-grid.js`
- `frontend/js/modules/odontograma-v1.js`

Arquivos provaveis a consultar futuramente:
- `frontend/js/modules/odontograma-v1-history-grid.js`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`

Classificacao:
- Especifico de Odontologia.

Risco de implementacao:
- Medio a alto.

Dependencias provaveis:
- Historico clinico.
- Tratamento.
- Procedimentos.
- Prestador/cirurgiao.

O que nao deve ser implementado ainda:
- Nao acoplar a grade ao comportamento de escrita completa antes do contrato.
- Nao misturar esta grade com o monolito principal.

## 5. Comparacao entre tela sem paciente e tela com paciente

### 5.1 Sem paciente aberto
- Campo `Paciente` vazio.
- Odontograma sem marcacoes relevantes.
- Lista inferior sem historico preenchido.
- Agenda do dia continua visivel.
- A tela funciona como shell pronta para selecao.

### 5.2 Com paciente aberto
- Campo `Paciente` preenchido com codigo e nome.
- Odontograma com marcacoes, realces e estados visuais adicionais.
- Historia inferior preenchida com varias linhas.
- Datas e atalhos do tratamento aparecem com mais contexto.
- A tela ganha densidade clinica e narrativa operacional.

### 5.3 Diferencas observaveis consolidadas
- Campo vazio versus codigo/nome preenchidos.
- Arcada neutra versus arcada com marcacoes.
- Grade vazia versus grade populada.
- Maior contexto temporal e de tratamento no estado com paciente.
- Agenda do dia permanece visivel em ambos os estados.

## 6. Inventario conservador das fontes EasyDental

### 6.1 `D:\UTIL\EasyDental_7.6_BR`
Inventario visto:
- Estrutura de instalacao e distribuicao.
- Sem acervo visual completo de runtime como no Y:.
- Pasta/itens uteis para estudo futuro:
  - `Readme.doc`
  - `Instalação.txt`
  - `EDS75_Client`
  - `EDS75_Server`
  - `MSDE`
  - `setup.exe`

Leitura conservadora:
- Bom para entender empacotamento e instalacao.
- Nao e fonte preferencial para extracao de UI viva.

### 6.2 `Y:\EDS70`
Inventario visto:
- Estrutura viva mais rica e util para auditoria funcional.
- Pastas fortes para futura leitura somente documental:
  - `Bitmaps`
  - `Dados`
  - `Fotos`
  - `Help`
  - `Icones`
  - `Import`
  - `Objetos`
  - `Reports`
  - `Textos`
  - `TISS`
- Arquivos de contexto:
  - `eds70.dsn`
  - `EDS70.exe`
  - arquivos de licenca/configuracao `ED.*`
  - utilitarios e DLLs de suporte

Leitura conservadora:
- Pode sustentar inventario de telas, relatorios, textos, conexao e acervo visual.
- Continua proibido copiar, migrar ou executar qualquer rotina nesta etapa.

### 6.3 Tipos de material identificados de forma inicial
- Imagens e icones: provaveis em `Bitmaps` e `Icones`.
- Relatorios: provaveis em `Reports`.
- Textos e mensagens: provaveis em `Textos` e `Mensagens.txt`.
- Banco e conexao: indicios em `Dados`, `eds70.dsn` e arquivos de licenca/configuracao.
- Arquivos de suporte e instalacao: `MSDE`, `setup.exe`, `ED*.exe`, DLLs.

## 7. Plano futuro de implementacao por subetapas

- Subetapa A: contrato funcional da tela principal odontologica.
- Subetapa B: inventario do que ja existe no Brana Cloud.
- Subetapa C: inventario tecnico somente leitura das fontes EasyDental.
- Subetapa D: layout estatico inicial sem dados reais.
- Subetapa E: estado sem paciente e estado com paciente ativo.
- Subetapa F: odontograma apenas visual.
- Subetapa G: historico inferior somente leitura.
- Subetapa H: integracao controlada com procedimentos.
- Subetapa I: integracao controlada com agenda.
- Subetapa J: toolbar e atalhos.
- Subetapa K: persistencia, validacao e testes reais.

## 8. Regras de seguranca para a evolucao futura
- Nao recriar tudo de uma vez.
- Nao colocar novo codigo no monolitico `frontend/app.js`.
- Criar modulos JS especificos para cada bloco.
- Preservar wrappers e fallbacks quando necessario.
- Nao alterar banco antes de existir contrato funcional.
- Nao alterar seeds antes de mapear dependencias.
- Nao mexer em permissoes sem subetapa propria.
- Nao misturar correcao visual com correcao textual/mojibake.
- Nao copiar arquivos proprietarios do EasyDental para o Brana Cloud.
- Usar os diretorios do EasyDental apenas como referencia de leitura.

## 9. Registro para roadmap
- Criada a analise inicial da tela principal odontologica baseada nos dois prints do EasyDental e nas fontes locais `D:\UTIL\EasyDental_7.6_BR` e `Y:\EDS70`.
- A implementacao ainda nao comecou.
- A tela foi classificada como especifica de Odontologia com subpartes core/comum.
- A proxima etapa recomendada e contrato funcional e inventario do Brana Cloud atual.

## 10. Conclusao
A tela principal do EasyDental deve ser lida como uma shell odontologica integrada, com o odontograma como centro e varios blocos de contexto ao redor.

Conclusao pratica desta auditoria:
- o modulo e especifico de Odontologia;
- algumas subpartes sao core/comum;
- o risco de implementacao e alto se tudo for feito de uma vez;
- o caminho seguro e modular, conservador e incremental.
