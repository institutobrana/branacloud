# Fase 2B - Prestadores remanescentes - Contrato profundo do primeiro recorte medio controlado

## 1. Identificacao da etapa
- Fase 2B.
- Prestadores remanescentes.
- Frente especifica de area profissional.
- Contrato profundo.
- Etapa exclusivamente documental.
- Sem implementacao.

## 2. Historico e contexto
- `Preferencias` foi pausada apos dois recortes medios controlados validados com sucesso.
- A nova matriz comparativa pos-Preferencias recomendou `Prestadores remanescentes` como proxima frente para contrato profundo.
- Esta frente deve ser tratada com cautela por ser especifica de area profissional e por manter fortes ligacoes com UI, lista, modal, agenda e fluxos sensiveis de apoio.
- Se houver futura implementacao minima, ela devera ser pequena, visual/local e obrigatoriamente precedida deste contrato.

## 3. Mapa das funcoes atuais no app.js

### Funcoes visuais/localmente seguras
- `prestSelecionado()`
- `prestStatusHtml(ativo)`
- `prestFmtCodigo(valor, idx=0)`

### Funcoes de renderizacao
- `prestFiltrarLista()`
- `prestRender()`

### Funcoes de selecao
- `prestSelecionarLinha(tr)`

### Funcoes de modal/painel
- `prestEnsureUI()`
- `prestAbrir()`

### Funcoes de listagem/carregamento
- `prestCarregar()`

### Funcoes de eventos
- listeners ligados em `prestEnsureUI()` para:
  - `change` em `#prest-cbo-especialidade`
  - `input` em `#prest-txt-nome`
  - `click` em `#prest-btn-novo`
  - `click` em `#prest-btn-editar`
  - `click` em `#prest-btn-excluir`
  - `click` em `#prest-btn-agenda`
  - `click` em `#prest-btn-convenios`
  - `click` em `#prest-btn-comissoes`
  - `click` em `#prest-btn-fechar`

### Funcoes que chamam requestJson
- `prestCarregar()` -> `GET /cadastros/prestadores`

### Funcoes que montam payload
- Nenhuma funcao de Prestadores mapeada em `app.js` monta payload de salvamento nesta leitura.

### Funcoes que salvam
- Nenhuma funcao de salvamento funcional consolidada foi identificada em `app.js` para o bloco principal de Prestadores nesta leitura.

### Funcoes que excluem
- Nenhuma exclusao funcional consolidada em `app.js` foi identificada como recorte seguro para esta etapa.

### Funcoes que dependem de backend/endpoints
- `prestCarregar()`
- os fluxos de agenda, convenios e comissoes acoplados ao painel, que dependem de dados ja carregados e podem acionar rotas de apoio em arquivos adjacentes

### Funcoes que dependem de permissoes
- Nenhuma permissao explicita foi reduzida a helper seguro nesta leitura.
- O fluxo continua sensivel ao contexto do menu/painel e aos caminhos de apoio ligados ao modulo.

### Areas proibidas para Fase 2B
- backend
- banco
- endpoints
- permissoes
- requestJson
- payload efetivo
- salvamento
- exclusao
- criacao/edicao real de prestador
- validacoes criticas
- vinculo com agenda
- vinculo com financeiro
- vinculo com usuarios/perfis
- correcoes textuais
- labels/placeholders/mensagens
- mojibake

## 4. Mapa de modulos existentes

### Modulo encontrado em `frontend/js/modules`
- `frontend/js/modules/prestadores.js`

### O que exporta
- `meta`
- `getInfo()`
- `getStatus()`
- `prestFmtCodigo()`
- `prestSelecionado()`
- `prestFiltrarLista()`
- `prestStatusHtml()`

### Natureza do modulo
- Passivo.
- Nao controla fluxo funcional nesta etapa.

### Uso no app.js
- Os wrappers de `prestFmtCodigo`, `prestSelecionado` e `prestStatusHtml` ja consultam o namespace passivo.
- `prestFiltrarLista()` tambem tenta usar o helper passivo quando disponivel.

### Reaproveitamento futuro
- O modulo existente pode receber helpers futuros sem criar novo modulo, desde que o recorte continue visual/local.
- Nao ha indicacao documental para criar novo modulo nesta etapa.

## 5. Mapa de DOM

### DOM visual/local
- `#prestadores-panel`
- `.prest-panel`
- `.prest-grid`
- `.prest-total`

### DOM de tabela/lista
- `#prest-tbody`
- `#prest-cbo-especialidade`
- `#prest-txt-nome`

### DOM de formulario/modal
- `#prest-modal-backdrop`
- `#prest-modal-title`
- `.prest-modal`
- `.prest-modal-body`
- `.prest-tabs`
- `.prest-tab`
- `.prest-pane`
- `#prest-modal-codigo`
- `#prest-modal-nome`
- `#prest-modal-apelido`
- `#prest-modal-tipo`
- `#prest-modal-inicio`
- `#prest-modal-termino`
- `#prest-modal-inativo`
- `#prest-modal-executa`
- `#prest-modal-cro`
- `#prest-modal-uf-cro`
- `#prest-modal-cpf`
- `#prest-modal-rg`
- `#prest-modal-inss`
- `#prest-modal-ccm`
- `#prest-modal-contrato`
- `#prest-modal-cnes`
- `#prest-modal-cbos`
- `#prest-modal-nascimento`
- `#prest-modal-sexo`
- `#prest-modal-estado-civil`
- `#prest-modal-prefixo`
- `#prest-modal-inclusao`
- `#prest-modal-alteracao`
- `#prest-modal-id-interno`
- `#prest-modal-fone-tipo-1`
- `#prest-modal-fone-1`
- `#prest-modal-fone-tipo-2`
- `#prest-modal-fone-2`
- `#prest-modal-email`
- `#prest-modal-homepage`
- `#prest-modal-logradouro-tipo`
- `#prest-modal-endereco`
- `#prest-modal-numero`
- `#prest-modal-complemento`
- `#prest-modal-bairro`
- `#prest-modal-cidade`
- `#prest-modal-cep`
- `#prest-modal-uf`
- `#prest-modal-banco`
- `#prest-modal-agencia`
- `#prest-modal-conta`
- `#prest-modal-nome-conta`
- `#prest-modal-modo-pagamento`
- `#prest-modal-faculdade`
- `#prest-modal-formatura`
- `#prest-modal-alerta`
- `#prest-modal-observacoes`
- `#prest-modal-ok`
- `#prest-modal-cancelar`

### DOM de filtros/busca
- `#prest-cbo-especialidade`
- `#prest-txt-nome`

### DOM de botoes
- `#prest-btn-novo`
- `#prest-btn-editar`
- `#prest-btn-excluir`
- `#prest-btn-agenda`
- `#prest-btn-convenios`
- `#prest-btn-comissoes`
- `#prest-btn-fechar`

### DOM que dispara eventos
- `#prest-cbo-especialidade`
- `#prest-txt-nome`
- `#prest-tbody`
- todos os botoes de acao do painel
- os botoes e abas do modal de prestador

### DOM que participa de requestJson
- `#prest-cbo-especialidade` e `#prest-txt-nome` afetam filtro local, nao request direto
- `#prest-tbody` e a selecao corrente influenciam quais dados sao exibidos depois do carregamento
- o modal de Prestadores e seus campos aparecem nos fluxos de apoio que usam requestJson nos arquivos adjacentes

### DOM que participa de payload/salvamento
- O fluxo de payload/salvamento nao e alvo de recorte nesta etapa.
- Os campos do modal e os botoes de acao permanecem sensiveis e fora do primeiro recorte medio futuro.

### DOM sensivel/proibido
- `#prest-modal-backdrop`
- botoes de agenda, convenios e comissoes
- campos do modal principal
- qualquer area que influencie persistencia, exclusao, agenda ou financeiro

## 6. Mapa de eventos

### Eventos apenas visuais
- destaque de linha selecionada em `prestRender()`
- atualizacao do contador `#prest-total`

### Eventos de selecao
- clique na linha da grade via `bindStandardGridActivation(...)`
- atualizacao de `prestadorSelId` em `prestSelecionarLinha(tr)`

### Eventos de abertura/fechamento
- `prestAbrir()`
- `#prest-btn-fechar`
- botao/acao de fechamento do painel e dos fluxos de apoio

### Eventos de filtros/busca
- `change` em `#prest-cbo-especialidade`
- `input` em `#prest-txt-nome`

### Eventos de carregamento/listagem
- `prestCarregar()`
- renderizacao apos carregamento

### Eventos que disparam requestJson
- abertura do painel principal leva a `prestCarregar()`
- os fluxos de apoio de agenda/credenciamento/comissoes dependem de arquivos adjacentes que ja usam requestJson

### Eventos que salvam
- nao ha evento de salvamento consolidado neste recorte documental do app.js

### Eventos que excluem
- o botao `Elimina` continua sendo um ponto sensivel e nao deve entrar no primeiro recorte medio

### Eventos proibidos para o primeiro recorte medio
- qualquer evento que grave, exclua, valide ou persista prestador
- qualquer evento que altere permissao, agenda, financeiro ou usuarios/perfis

## 7. Mapa de requestJson / payload / salvamento / exclusao

### Chamadas requestJson relacionadas
- `prestCarregar()` -> `GET /cadastros/prestadores`

### Chamadas requestJson em fluxos de apoio adjacentes
- `prestCarregarTiposPrestador()` -> `GET /cadastros/prestadores/tipos`
- `prestCarregarEspecialidadesAtivas()` -> `GET /cadastros/auxiliares/especialidades-ativas`
- `prestSalvarModal()` -> `PUT` ou `POST /cadastros/prestadores/{id}` ou `/cadastros/prestadores`
- `prestExcluirSelecionado()` -> `DELETE /cadastros/prestadores/{id}`
- `prestAgendaCarregarUnidadesAtendimento()` -> `GET /cadastros/unidades-atendimento/combos`
- `prestAgendaSalvar()` -> `PUT /cadastros/prestadores/{id}` com `agenda_config` e `alerta_agendamentos`
- `prestCredExcluirSelecionado()` -> `DELETE /cadastros/prestadores/credenciamentos/{id}`
- `prestCredSalvarModal()` -> `PUT` ou `POST /cadastros/prestadores/credenciamentos/{id}` ou `/cadastros/prestadores/credenciamentos`
- `prestComCarregarGenericos()` -> `GET /cadastros/procedimentos-genericos?q=`
- `prestComCarregarItens()` -> `GET /cadastros/prestadores/comissoes`
- `prestComSalvarModal()` -> `PUT` ou `POST /cadastros/prestadores/comissoes/{id}` ou `/cadastros/prestadores/comissoes`
- `prestComExcluirSelecionado()` -> `DELETE /cadastros/prestadores/comissoes/{id}`

### O que monta payload
- `prestSalvarModal()`
- `prestAgendaSalvar()`
- `prestCredSalvarModal()`
- `prestComSalvarModal()`

### O que salva
- `prestSalvarModal()`
- `prestAgendaSalvar()`
- `prestCredSalvarModal()`
- `prestComSalvarModal()`

### O que exclui
- `prestExcluirSelecionado()`
- `prestCredExcluirSelecionado()`
- `prestComExcluirSelecionado()`

### Risco
- alto para qualquer recorte que encoste nesses fluxos
- por isso eles devem ficar fora do primeiro recorte medio controlado futuro

## 8. Mapa de backend / endpoints / permissoes

### Conexoes identificadas por leitura
- Cadastro principal de prestadores: `/cadastros/prestadores`
- Tipos de prestador: `/cadastros/prestadores/tipos`
- Especialidades ativas: `/cadastros/auxiliares/especialidades-ativas`
- Unidades de atendimento: `/cadastros/unidades-atendimento/combos`
- Credenciamentos: `/cadastros/prestadores/credenciamentos`
- Comissoes: `/cadastros/prestadores/comissoes`
- Procedimentos genericos: `/cadastros/procedimentos-genericos`
- Agenda e apoio de agenda: fluxo em arquivos de agenda adjacentes e campos como `agenda_config` e `alerta_agendamentos`

### Areas correlatas conectadas
- agenda
- usuarios/perfis
- procedimentos
- financeiro, por risco indireto em comissoes e configuracoes associadas
- clinica, por contexto de cadastro e estrutura do sistema

### Permissoes
- nao foi identificado neste contrato um helper seguro separado para permissao
- os fluxos de apoio devem ser tratados como sensiveis porque podem herdar bloqueios do painel/menu e de areas acopladas

## 9. Partes proibidas para Fase 2B
- backend
- banco
- endpoints
- permissoes
- requestJson
- payload efetivo
- salvamento
- exclusao
- criacao/edicao real de prestador
- regras de validacao critica
- vinculo com agenda
- vinculo com financeiro
- vinculo com usuarios/perfis
- correcoes textuais
- labels/placeholders/mensagens
- mojibake

## 10. Recortes medios possiveis

### Candidato 1: extracao da renderizacao visual/local da lista principal e do contador
- Descricao: mover a montagem da grade filtrada, da linha selecionada e do contador para um helper passivo do modulo existente.
- Funcoes envolvidas: `prestRender()`, `prestFiltrarLista()`, `prestSelecionarLinha()`, `prestSelecionado()`, `prestStatusHtml()`, `prestFmtCodigo()`.
- DOM envolvido: `#prest-tbody`, `#prest-total`, `#prest-cbo-especialidade`, `#prest-txt-nome`.
- Eventos envolvidos: `change` do filtro, `input` da busca, clique na linha da grade.
- Toca requestJson: nao, diretamente.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca exclusao: nao.
- Toca backend/endpoints: nao, diretamente.
- Toca permissoes: nao, diretamente.
- Risco: medio-baixo para o primeiro recorte, porque e visual/local e fica restrito ao painel principal.
- Ganho esperado: real, por retirar do `app.js` o bloco de montagem da lista e a logica de renderizacao local.
- Teste manual possivel: abrir Prestadores, filtrar por especialidade/nome, verificar a grade e o contador.
- Rollback mental: devolver a montagem da grade para `app.js` e manter o helper apenas como apoio.
- Decisao: recomendado.

### Candidato 2: extracao da composicao do feedback de acao e linha selecionada
- Descricao: mover a mensagem de `footerMsg` e a organizacao visual do estado selecionado para helper passivo.
- Funcoes envolvidas: `prestAcoesPlaceholder()`, `prestSelecionado()`, partes pequenas de `prestRender()`.
- DOM envolvido: `footerMsg`, grade e selecao corrente.
- Eventos envolvidos: clique em novo/editar/eliminar/agenda/convenios/comissoes.
- Toca requestJson: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca exclusao: nao.
- Toca backend/endpoints: nao.
- Toca permissoes: nao.
- Risco: baixo, mas o ganho e pequeno.
- Ganho esperado: reduzido.
- Teste manual possivel: clicar nos botoes do painel e observar a mensagem de rodape.
- Rollback mental: restaurar a funcao original em `app.js`.
- Decisao: rejeitado como primeiro recorte, por ganho pequeno.

### Candidato 3: extracao da montagem da moldura do painel e de estilos locais
- Descricao: mover parte do HTML/CSS inline de `prestEnsureUI()` para helper passivo.
- Funcoes envolvidas: `prestEnsureUI()`, `prestAbrir()`.
- DOM envolvido: `#prestadores-panel` e a estrutura principal do painel.
- Eventos envolvidos: abertura/fechamento do painel.
- Toca requestJson: indiretamente, porque `prestAbrir()` chama `prestCarregar()`.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca exclusao: nao.
- Toca backend/endpoints: sim, indiretamente por abrir e carregar.
- Toca permissoes: nao diretamente.
- Risco: medio-alto, por tocar montagem estrutural da tela.
- Ganho esperado: existe, mas o risco e maior do que o primeiro recorte desejado.
- Teste manual possivel: abrir/fechar Prestadores e verificar a moldura.
- Rollback mental: recolocar o HTML/CSS inline em `app.js`.
- Decisao: rejeitado por agora.

### Candidato 4: extracao da navegacao visual do modulo principal sem tocar persistencia
- Descricao: centralizar a selecao visual e a contagem de linha corrente em helper passivo, deixando o carregamento e a acao principal no `app.js`.
- Funcoes envolvidas: `prestSelecionarLinha()`, `prestSelecionado()`, parte de `prestRender()`.
- DOM envolvido: `#prest-tbody` e o estado visual da linha selecionada.
- Eventos envolvidos: clique em linha.
- Toca requestJson: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca exclusao: nao.
- Toca backend/endpoints: nao.
- Toca permissoes: nao.
- Risco: medio-baixo.
- Ganho esperado: moderado.
- Teste manual possivel: clicar em linhas diferentes e verificar selecao.
- Rollback mental: restaurar a logica no `app.js`.
- Decisao: possivelmente util, mas fica abaixo do candidato 1 por ser um ganho menor.

## 11. Recomendacao de UM unico recorte
- Recomendacao: extrair a renderizacao visual/local da lista principal e do contador de Prestadores para o modulo passivo existente.
- Justificativa:
  - nao toca backend, banco, endpoints, permissoes, requestJson, payload, salvamento ou exclusao;
  - entrega ganho real de organizacao do `app.js`;
  - tem teste manual claro;
  - tem rollback mental simples;
  - conserva a classificacao de frente especifica de area profissional;
  - aproveita o modulo passivo ja existente sem criar novo modulo.
- O que deve ficar para depois:
  - agenda
  - credenciamento
  - comissoes
  - qualquer fluxo de persistencia
  - qualquer expansao para validacao critica

## 12. Teste manual previsto
- Menu/tela: abrir `Cadastro > Prestadores`.
- Acoes:
  - filtrar por especialidade;
  - digitar nome no filtro;
  - clicar em linhas diferentes da grade;
  - abrir e fechar o painel.
- Comportamento esperado:
  - lista continua populada;
  - filtro continua funcionando;
  - selecao visual continua coerente;
  - contador continua correto;
  - mensagem de rodape continua no mesmo padrao.
- O que nao pode quebrar:
  - abertura do painel;
  - fechamento do painel;
  - carregamento inicial da lista;
  - selecao de linha;
  - filtros visuais;
  - qualquer fluxo de agenda/convenios/comissoes.
- Deve testar salvar?: nao, neste recorte recomendado nao deve haver salvamento.
- Deve testar exclusao?: nao.
- Deve testar fechamento/reabertura?: sim.
- Deve comparar listagem antes/depois?: sim, especialmente a ordem, a quantidade e o destaque da linha selecionada.

## 13. Risco residual e rollback mental
- Riscos principais:
  - quebra da selecao visual;
  - divergencia do contador;
  - lista vazia por erro de renderizacao;
  - regressao em filtro simples por especialidade ou nome.
- Como perceber quebra:
  - grade sem linhas;
  - contador incorreto;
  - linha selecionada errada;
  - filtros sem efeito visivel.
- Como comparar com comportamento anterior:
  - abrir Prestadores antes/depois;
  - aplicar os mesmos filtros;
  - alternar linhas e observar destaque/contador.
- Como reverter mentalmente:
  - devolver a montagem da grade e do contador para `app.js`;
  - manter o modulo passivo apenas com helpers puros ja seguros.
- Por que o recorte e aceitavel:
  - concentra o maior bloco visual local ainda presente;
  - nao toca persistencia;
  - permite recuo simples se algo falhar.

## 14. Registro para roadmap
- O contrato profundo de `Prestadores remanescentes` foi criado como etapa exclusivamente documental.
- A frente foi classificada como especifica de area profissional.
- O historico de `Preferencias` ficou registrado como pausado apos consolidacao parcial.
- Os recortes avaliados foram listados, com recomendacao futura para a extracao da renderizacao visual/local da lista principal e do contador.
- Os limites da Fase 2B continuam vigentes.
- O teste manual previsto foi documentado.
- Foi reforcado que `requestJson`, payload, salvamento, exclusao, backend e permissoes seguem fora do escopo.
- Nenhuma implementacao direta foi escolhida nesta etapa.
- A blindagem textual/mojibake foi respeitada.
