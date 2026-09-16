# Auditoria do botao X - Desenho do simbolo grafico

## 1. Resultado
- BLOQUEADA PARA ITENS NATIVOS.
- A auditoria funcional foi fechada para o contrato visual, mas a exclusao real da biblioteca nativa nao sera implementada nesta frente.

## 2. Tela
- caminho: `Configuracoes -> Simbolos graficos -> Novo`
- titulo: `Novo simbolo grafico`
- foco desta frente: contrato do botao X no quadro `Desenho`

## 3. Contrato observado no EasyDental Desktop
- sem simbolo selecionado: o botao X fica desabilitado
- com simbolo selecionado: o botao X fica habilitado
- acao esperada: abrir confirmacao de exclusao do arquivo BMP da biblioteca
- texto de confirmacao: `Deseja eliminar o arquivo <nome>.bmp do disco?`
- ao confirmar: o arquivo e removido do disco e a biblioteca reflete a exclusao
- ao cancelar: o arquivo permanece no disco e a selecao nao e alterada

## 4. Evidencia de catalogo
- biblioteca base do editor: 56 arquivos BMP em `frontend-react/public/assets/Icones`
- fonte de renderizacao da biblioteca base: `frontend-react/src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js`
- persistencia do catalogo: `backend/models/simbolo_grafico.py`
- seed e compatibilidade de catalogo: `backend/services/simbolos_service.py`

## 5. Classificacao tecnica dos 56 BMPs
- origem A: biblioteca base do editor, servida pelo frontend em `public/assets/Icones`
- origem B: catalogo persistido por tenant em `simbolo_grafico_catalogo`
- origem C: snapshot e seed de compatibilidade em `backend/scripts/easy_simbolos_catalogo_atual_snapshot.json`
- origem D: respaldo legado do fluxo EasyDental em `Dados/Dist/_SIMBOLO_ODONTO.raw`
- classificacao funcional: simbolos de sistema do catalogo oficial, com heranca visual do legado

## 6. Camadas envolvidas
- frontend: modal de criacao/edicao em React
- backend: catalogo multitenant em PostgreSQL
- storage: arquivos BMP da biblioteca base no frontend e origem legada no conjunto de dados do legado
- banco: tabela `simbolo_grafico_catalogo`

## 7. Estado atual no Brana Cloude
- o botao X permanece visivel e desabilitado para os 56 itens nativos
- nao existe fluxo de confirmacao nem exclusao persistente para esses itens
- o endpoint DELETE existente nao se aplica aos simbolos oficiais do sistema
- nao foi aplicada politica de exclusao fisica do BMP

## 8. Risco e bloqueio
- a exclusao de arquivo BMP impacta disco, biblioteca visual e eventual sincronizacao de seed
- sem contrato de storage e sem definicao de rollback, a implementacao destrutiva deve permanecer bloqueada
- se a unica opcao de exclusao futura recair sobre `public` ou `dist`, o caso deve ser tratado como bloqueado ate existir contrato tecnico de armazenamento

## 9. Decisao de auditoria
- contrato visual correto: sim
- contrato operacional de exclusao: bloqueado para itens nativos
- limpeza de selecao pelo X: nao
- acao permissiva sem selecao: nao

## 10. Resumo executivo
- O comportamento correto do EasyDental Desktop para o botao X e habilitar apenas com simbolo selecionado, pedir confirmacao e excluir o BMP da biblioteca.
- O Brana Cloude ainda esta na fase de auditoria e contrato tecnico; a exclusao real fica para implementacao posterior.
