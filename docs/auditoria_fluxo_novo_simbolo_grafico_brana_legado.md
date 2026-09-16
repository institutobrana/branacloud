# Auditoria - Fluxo "Novo" de Simbolos Graficos - Brana Cloud Legado

## Escopo
Auditoria do fluxo legado de criacao/edicao do simbolo grafico no Brana Cloud, com foco no caminho acionado por `Novo`.

## Evidencias diretas
- `frontend/app.js` possui `simbolosAbrirModal("novo")`.
- `frontend/app.js` cria o modal com titulo `Edita símbolo gráfico`.
- `frontend/app.js` preenche campos do formulario, biblioteca e preview.
- `frontend/app.js` controla abrir/fechar editor em iframe.
- `frontend/app.js` escuta mensagens `postMessage` do editor.
- `frontend/mock_simbolo_editor.html` reproduz o contrato visual do editor.
- `backend/routes/cadastros_routes.py` expõe rotas autenticadas para CRUD do catalogo.
- `backend/models/simbolo_grafico.py` modela o catalogo por clinica.
- `backend/services/simbolos_service.py` sustenta o seed e a mapearao do catalogo oficial.

## Fluxo funcional observado
### Abertura do modal
- O fluxo `Novo` abre um modal proprio.
- O modal nasce com campos vazios ou com defaults seguros.
- O titulo permanece o mesmo do fluxo de edicao.

### Estrutura da janela
- Nome do simbolo.
- Especialidade.
- Forma de marcacao no odontograma.
- Tipo do simbolo.
- Biblioteca de simbolos.
- Area de desenho.
- Botoes de limpar/editar desenho.
- `Ok` e `Cancela`.

### Comportamento do editor
- O editor grafico e aberto em iframe.
- O fechamento do editor e controlado por overlay/backdrop.
- O fluxo usa `postMessage` para troca de dados entre editor e pagina principal.

## Regras de persistencia
- O backend recebe o cadastro autenticado.
- O tenant e sempre filtrado por `current_user.clinica_id`.
- Simbolos de sistema e simbolos de usuario seguem regras distintas.
- O registro novo pode carregar imagem customizada e metadados de catalogo.
- O fluxo de salvamento atualiza a lista apos conclusao.

## Contrato funcional legado relevante para o React
- A futura tela React nao pode reduzir o fluxo a um formulario simples.
- O modulo precisa manter o editor visual como parte do contrato estrutural.
- A biblioteca e o preview sao parte da experiencia minima esperada.
- A especialidade continua sendo um campo funcional, nao decorativo.

## Pontos que permanecem como lacuna
- O layout visual exato do modal antigo fora da implementacao atual nao foi reconstruido por completo.
- Nao foi validado o comportamento de cada comando do editor no binario original.
- Nao foi validada a semantica fina do desenho no Desktop alem das evidencias visuais.

## Fontes de apoio
- `frontend/app.js`
- `frontend/mock_simbolo_editor.html`
- `frontend/index.html`
- `backend/routes/cadastros_routes.py`
- `backend/models/simbolo_grafico.py`
- `backend/services/simbolos_service.py`
