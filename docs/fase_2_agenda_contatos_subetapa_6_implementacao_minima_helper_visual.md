# Fase 2 - Agenda de contatos - Subetapa 6 - Implementacao minima do helper visual puro

## 1. Contexto
Esta subetapa executa a primeira implementacao minima planejada para `Agenda de contatos`, mantendo o recorte conservador da trilha documental.

O unico helper extraido nesta etapa e `agendaContatosTelefonesTexto`, que agora passa a viver em um modulo proprio, com wrapper compatível preservado em `frontend/app.js`.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_contatos_subetapa_2_mapa_dependencias_tenant.md`
- `docs/fase_2_agenda_contatos_subetapa_3_mapa_fluxo_listagem_filtros.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/fase_2_agenda_contatos_subetapa_5_plano_primeiro_recorte_helper_visual.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Commit anterior confirmado:
- `acd34d3304384f5792f3ee30268bb40131d14df4` - `Planeja primeiro recorte de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Implementacao realizada
Arquivos alterados nesta subetapa:
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/app.js`
- `frontend/index.html`
- `docs/11_roadmap_desenvolvimento.md`

O helper novo foi criado como funcao pura, com namespace passivo em `window`.
O `app.js` manteve uma funcao compatível e passou a delegar para o helper novo, com fallback conservador.

## 6. Helper extraido
Funcao extraida:
- `agendaContatosTelefonesTexto`

Namespace exposto no modulo:
- `window.BranaAgendaContatosTelefonesModule`

API publica do modulo:
- `telefonesTexto(item)`
- `agendaContatosTelefonesTexto(item)`
- `helpers.telefonesTexto(item)`

## 7. Contrato preservado
### Entrada
- recebe um `item`
- le:
  - `tel1_tipo`
  - `tel1`
  - `tel2_tipo`
  - `tel2`
  - `tel3_tipo`
  - `tel3`
  - `tel4_tipo`
  - `tel4`

### Saida
- devolve uma string unica com os telefones encontrados
- separa os itens por ` / `
- quando ha tipo, retorna `tipo telefone`
- quando nao ha tipo, retorna apenas o numero
- quando nao ha telefone, retorna string vazia

### Preservacao do comportamento atual
- ordem dos telefones preservada
- omissao de campos vazios preservada
- compatibilidade visual com a grade preservada

## 8. Dependencias do helper
### DOM
- inexistente

### requestJson
- inexistente

### cache global
- inexistente

### estado global
- inexistente

### modal
- inexistente

### eventos
- inexistente

### selecao
- inexistente

## 9. Wrappers e fallback
O `frontend/app.js` permanece como wrapper fino e compatibilidade retroativa.

Estratégia aplicada:
- tentar o helper do modulo novo primeiro
- tentar a funcao direta exportada pelo modulo
- manter o fallback local com a logica atual preservada

## 10. Onde a nova estrutura e usada
O helper novo continua sendo consumido pela renderizacao da lista de `Agenda de contatos`, sem alterar o fluxo de abertura, filtro, modal, gravacao ou exclusao.

## 11. Riscos preservados
Permanecem fora desta implementacao:
- fluxo de agenda principal
- agenda legado
- modal
- salvar
- editar
- excluir
- payload
- filtros
- carregamento de apoio
- permissao
- tenant

## 12. Checks tecnicos executados / exigidos
### Executados nesta etapa
- verificacao de diffs somente em arquivos permitidos
- confirmacao de que `frontend/app.js`, `frontend/index.html`, `frontend/js/modules` e `backend` nao receberam alteracoes indevidas alem do recorte planejado

### Exigidos para validacao futura
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- `node --check frontend/app.js`
- abrir `Agenda de contatos` no navegador
- conferir a coluna de telefones
- validar contatos sem telefone e com multiplos telefones
- confirmar ausencia de erro no console

## 13. Onde testar
- abrir a tela `Agenda de contatos`
- conferir a lista e a coluna de telefones
- validar a preservacao dos textos exibidos
- checar a ausencia de regressao no filtro e na selecao

## 14. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 7 - Validacao documental da separacao do helper visual e do wrapper no app.js`

## 15. Blindagem textual/mojibake
Nao houve correcao de textos visiveis, acentos, labels, placeholders, strings de interface ou mojibake.

Qualquer texto estranho observado deve permanecer como pendencia futura, sem ajuste nesta etapa.

## 16. Registro para roadmap
- Implementacao minima da Subetapa 6 concluida documentalmente e em codigo
- Helper visual puro extraido para modulo proprio
- Wrapper compatível mantido em `frontend/app.js`
- Módulo segue como `core / comum`
- Nenhuma alteracao de backend, banco, endpoint ou permissao
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 7 - Validacao documental da separacao do helper visual e do wrapper no app.js`

## 17. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita aos arquivos desta subetapa:
- adicionar apenas o novo modulo, `frontend/app.js`, `frontend/index.html`, `docs/11_roadmap_desenvolvimento.md` e este documento
- nao usar `git add .`
- nao usar `git add docs/`
- depois executar `git commit -m "Extrai helper visual de agenda contatos"`
- em seguida executar `git push`

