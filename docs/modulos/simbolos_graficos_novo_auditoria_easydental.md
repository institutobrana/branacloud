# Auditoria Funcional - Simbolos Graficos - Novo - EasyDental e Brana Cloud

## Objetivo
Auditar o fluxo de `Configuracoes > Simbolos graficos > Novo` com ordem de autoridade funcional:

1. EasyDental Desktop
2. Brana Cloud legado
3. Backend atual e React atual

Esta auditoria nao implementa o modal. Ela consolida evidencias para contrato futuro.

## Resumo executivo
- O EasyDental Desktop existe como fonte estrutural do catalogo simbolico, dos bitmaps e da relacao com odontograma/intervencoes.
- O Brana Cloud legado ja tem um fluxo operacional de listagem, CRUD e editor visual proprio para simbolos graficos.
- O backend atual expoe o catalogo em `GET /cadastros/simbolos-graficos` e suporta criacao, edicao e exclusao.
- O React atual apenas lista e seleciona simbolos; nao ha modal operacional do Novo.
- Existem evidencias fortes para `tipo_simbolo`, `tipo_marca`, `especialidade`, `bitmap*`, `icone`, `imagem_custom` e `sobreposicao`.
- Nao foi comprovado, nesta rodada, o comportamento completo de persistencia visual no desktop original sem o fonte Delphi.

## Fontes consultadas

### EasyDental Desktop
- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Dados\Dist\_SIMBOLO_ODONTO.raw`
- `Y:\EDS70\Bitmaps\`
- `Y:\EDS70\Icones\`
- `Y:\EDS70\Mensagens.txt`
- `backend\estrutura_eds70.txt`
- `backend\estrutura_util.txt`

### Brana Cloud legado
- `frontend\index.html`
- `frontend\app.js`
- `frontend\mock_simbolo_editor.html`
- `frontend\js\modules\simbolos-graficos.js`

### Backend e React atuais
- `backend\routes\cadastros_routes.py`
- `backend\models\simbolo_grafico.py`
- `backend\services\simbolos_service.py`
- `backend\main.py`
- `frontend-react\src\features\simbolosGraficos\SimbolosGraficosPage.jsx`
- `frontend-react\src\features\simbolosGraficos\components\SimbolosGraficosToolbar.jsx`
- `frontend-react\src\features\simbolosGraficos\components\SimbolosGraficosTable.js`
- `frontend-react\src\features\simbolosGraficos\hooks\useSimbolosGraficosTableState.js`
- `frontend-react\src\features\simbolosGraficos\simbolosGraficosApi.js`
- `frontend-react\src\features\simbolosGraficos\simbolosGraficosMapper.js`

## Evidencias do EasyDental Desktop

### Arquivos e catalogos
- `Y:\EDS70\Dados\eds70.sql` define `_SIMBOLO_ODONTO` e relacoes com tabelas de intervencao.
- `Y:\EDS70\Dados\Dist\_SIMBOLO_ODONTO.raw` e a base bruta do catalogo simbolico.
- `Y:\EDS70\Bitmaps\` contem familias `int_*.bmp`, `sim_*.bmp`, `esp_*.bmp` e `arc_*.bmp`.
- `Y:\EDS70\Icones\cmd_grafico.bmp` sugere acao grafica associada ao modulo.

### O que foi comprovado
- Existe catalogo simbolico em base SQL e em RAW.
- Existe relacao direta com especialidades.
- Existe relacao com odontograma e intervencoes.
- Existem bitmaps com nomes coerentes com a biblioteca visual.

### O que nao foi comprovado aqui
- Nome da unit Delphi original do modal.
- Ordem exata dos eventos do form desktop.
- Atalhos e foco inicial do formulário real.
- Regras de persistencia visual do desenho diretamente no Delphi.

## Evidencias do Brana Cloud legado

### Frontend legado
- `frontend\index.html` carrega `frontend/js/modules/simbolos-graficos.js` e expõe o menu de simbolos graficos.
- `frontend/app.js` opera o CRUD por `GET`, `POST`, `PUT` e `DELETE` em `/cadastros/simbolos-graficos`.
- `frontend/mock_simbolo_editor.html` possui a janela `Edita simbolo grafico`.

### Editor visual legado
O mock local confirma a estrutura visual do editor:
- Nome do simbolo
- Especialidade
- Forma de marcacao no odontograma
- Ferramentas de desenho
- Paleta
- Area de desenho pixel a pixel
- Previa 1x e ampliada
- Salvar desenho
- Salvar como
- Cancela edicao

### O que o legado comprova
- O Brana Cloud legado nao se limita a uma listagem; ele tem CRUD e editor visual.
- O campo `tipo_marca` ja existe no contrato funcional do frontend legado.
- `tipo_simbolo` diferencia catalogo oficial e simbolos do usuario.

### O que continua sem prova forte
- Se o editor legado reproduz exatamente o desktop.
- Se a biblioteca de simbolos no modal Novo do desktop usa a mesma grade do legado.
- Se o fluxo `Salvar como` tem comportamento identico ao desktop.

## Backend atual

### Model
Arquivo:
- `backend\models\simbolo_grafico.py`

Campos observados:
- `id`
- `clinica_id`
- `legacy_id`
- `codigo`
- `descricao`
- `especialidade`
- `tipo_marca`
- `tipo_simbolo`
- `bitmap1`
- `bitmap2`
- `bitmap3`
- `icone`
- `imagem_custom`
- `sobreposicao`
- `ativo`

### Rota
Arquivo:
- `backend\routes\cadastros_routes.py`

Contrato confirmado:
- `GET /cadastros/simbolos-graficos`
- `POST /cadastros/simbolos-graficos`
- `PUT /cadastros/simbolos-graficos/{simbolo_id}`
- `DELETE /cadastros/simbolos-graficos/{simbolo_id}`

Protecao e tenant:
- usa `get_current_user`
- usa `require_module_access("procedimentos")`
- filtra por `current_user.clinica_id`

### Regras funcionais comprovadas
- Simbolos oficiais sao identificados por `legacy_id` e/ou `tipo_simbolo == 1`.
- Simbolos de sistema nao podem ser excluidos.
- Simbolos oficiais aceitam alteracao limitada.
- `imagem_custom` pode prevalecer sobre a imagem original.

## React atual

### Estado atual do modulo
- Existe pagina, tabela, toolbar, mapper, API e hook.
- O modulo ainda e apenas de leitura.
- `Novo`, `Altera` e `Elimina` na toolbar sao estruturais, sem modal operacional.

### Campos exibidos hoje
- `Nome`
- `Especialidade`

### Lacunas do React
- Nao existe modal `Novo`.
- Nao existe editor grafico integrado.
- Nao existe CRUD conectado para criacao de simbolo.
- Nao existe selecao da biblioteca de simbolos.

## Campos e comportamentos comprovados

| Campo visual | Evidencia | Status |
|---|---|---|
| Nome do simbolo | mock legado, backend `descricao` | comprovado |
| Tipo do simbolo | backend `tipo_simbolo`, seed oficial vs usuario | comprovado |
| Especialidade | backend, snapshot, mapper, mock | comprovado |
| Forma de marcacao no odontograma | backend `tipo_marca`, snapshot `tipmarca`, mock | comprovado |
| Desenho | `bitmap1/2/3`, `icone`, `imagem_custom`, mock editor | comprovado |
| Biblioteca de simbolos | `Y:\EDS70\Bitmaps`, snapshots e assets | comprovado |
| Limpar desenho | mock visual e fluxo de editor | inferencia forte |
| Editar/criar desenho | mock visual e fluxo de editor | inferencia forte |

## Tipo simbolo: Sistema vs Usuario

### Evidencia forte
- O snapshot oficial do EasyDental e convertido para `tipo_simbolo = 1`.
- Seeds de arquivo BMP extraido do acervo passam a `tipo_simbolo = 2`.
- A rota bloqueia exclusao de simbolo de sistema.

### Interpretação funcional
- `tipo_simbolo == 1` representa catalogo oficial/sistema.
- `tipo_simbolo == 2` representa simbolo criado para a clinica/usuario.

### Ponto ainda nao comprovado
- Se o desktop original permitia criar simbolo do tipo sistema manualmente. A evidencia do Brana Cloud sugere que nao deve ser permitido no fluxo moderno.

## Tipo de marca

### Evidencia no snapshot
O snapshot `backend/scripts/easy_simbolos_catalogo_atual_snapshot.json` mostra `tipmarca` com estes valores observados:
- `1`
- `2`
- `3`
- `4`
- `5`
- `6`

### Label atual no backend
`backend/routes/cadastros_routes.py` expõe:
- `1: Face (ex: Restauração)`
- `2: Dente (ex: Coroa)`
- `3: Grupo (ex: Prótese-fixa)`
- `4: Arcada (ex: Prótese-total)`
- `5: Geral (ex: Profilaxia)`
- `6: Segmento [ex: Bracket]`

### Observacao importante
- Essas labels existem no backend atual e nao devem ser tratadas como mera aparência.
- A forma de marcacao afeta a aplicacao do simbolo no odontograma.

## Biblioteca de simbolos

### Evidencia de fonte
- `Y:\EDS70\Bitmaps\`
- `backend\estrutura_eds70.txt`
- `backend\scripts\easy_simbolos_catalogo_atual_snapshot.json`

### Regra observada
- A biblioteca nao e apenas uma lista arbitraria; ela deriva de um catalogo oficial mais assets bitmap.
- O Brana Cloud atual mescla catalogo oficial e imagens extras derivadas de BMPs encontrados.

### Limitação
- Nao foi possivel validar ordem visual exata, tooltip e duplo clique do desktop original.

## Conclusao da auditoria
- O modal Novo nao deve ser reconstruido por print.
- O contrato minimo seguro precisa respeitar:
  - catalogo oficial
  - diferenca sistema/usuario
  - forma de marcacao
  - especialidade
  - desenho/biblioteca
  - persistencia por clinica
  - bloqueio de exclusao de sistema
- O que ainda nao esta fechado para implementacao React:
  - semantica exata do editor de desenho no desktop
  - comportamento de limpar/excluir imagem quando aplicavel
  - validacao final da biblioteca por forma e por especialidade
