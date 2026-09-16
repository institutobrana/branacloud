# Fase G.4C.0 - Auditoria do Altera e editor legado

## 1. Resultado
- AUDITORIA CONCLUÍDA

## 2. Defeitos reproduzidos
- especialidade: reproduzido em runtime com valor numérico no modal de edição
- preview: reproduzido em runtime com preview ausente/quebrado no Altera
- editor: reproduzido em runtime com editor React abrindo vazio para o símbolo selecionado

## 3. Especialidade
- backend: a listagem `/cadastros/simbolos-graficos?scope=catalogo` já entrega `especialidade`, `especialidadeCodigo`, `imagem_custom` e `imagem_url` em `backend/routes/cadastros_routes.py:728-805`
- mapper: `frontend-react/src/features/simbolosGraficos/simbolosGraficosMapper.js:46-70` mantém `especialidadeCodigo` e tenta resolver o texto via catálogo local
- modal: `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx:49-58` monta `especialidade` com `record?.especialidadeCodigo ?? record?.especialidade`
- causa: o modal de edição recebe e preserva o código numérico, mas o campo do combo depende da resolução para `value` textual do catálogo; quando a origem já chega numérica, a seleção pode ficar desalinhada com o texto visível
- fonte correta: o catálogo de especialidades vem de `frontend-react/src/features/simbolosGraficos/model/simboloGraficoEspecialidadesMapper.js:1-17` e é carregado por `frontend-react/src/features/simbolosGraficos/hooks/useSimboloGraficoCatalogs.js`

## 4. Imagem
- campos: a listagem entrega `imagem_custom`, `icone` e `imagem_url` em `backend/routes/cadastros_routes.py:788-803`
- formato: `imagem_url` é priorizada pelo backend; quando ausente, cai para `/desktop-assets/easy/<arquivo>` no legado
- preview: o preview do modal usa `currentPreviewItem` com `imageUrl` ou `selectedLibraryItem` em `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx:110-113`
- causa: a UI do modal depende de `imageUrl`; se o registro resumido não trouxer uma URL carregável, o preview fica sem renderização visível

## 5. Editor vazio
- initialImage: `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx:113` passa `values.imagemCustom || selectedLibraryItem?.imageUrl || record?.imagemCustom || record?.imagem_custom || ''`
- importação: `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoPixelEditor.jsx:14-18` só carrega matriz quando `initialImage` é string suportada; array é clonada, qualquer outra entrada cai em matriz vazia
- matriz: `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoPixelEditor.jsx:27-35` reinicializa a grade ao abrir
- causa: o editor React atual não converte automaticamente bitmap/URL não reconhecida em matriz 15x15; sem `initialImage` válida, a grade inicia vazia

## 6. Editor legado
- Dados do Simbolo: `frontend/mock_simbolo_editor.html` expõe Nome, Especialidade, Forma de marcação, ferramentas e paleta
- Ferramentas: Lápis, Borracha, Desfazer e Limpar existem no legado; no React atual apenas Lápis e Borracha permanecem em `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoPixelEditor.jsx:132-166`
- Paleta: o legado possui paleta explícita de 24 cores no HTML
- Área de edição: o legado usa grade 24x24 com prévias 1x e ampliada; o React usa grade 15x15 com prévia única
- Carregadores: o legado inclui Carregar X, Carregar Bracket e Tela vazia
- Prévias: o legado renderiza canvas 1x e ampliado; o React renderiza prévia PNG única
- Ações: o legado possui Salvar desenho, Salvar como e Cancela edição
- Comunicação: o legado usa `postMessage` para salvar/fechar, sem integração equivalente no editor React atual
- Persistência: o legado salva `image`/`codigo`/metadados via host; o React atual produz PNG no cliente e entrega ao modal pai

## 7. EasyDental
- Paint: evidência anterior indica o botão de lápis abre o editor externo/legado
- X: a exclusão do desenho possui confirmação específica e não grava diretamente o bitmap no fluxo de edição
- preview: a referência visual mostra preview com imagem carregada quando o campo existe
- persistência: a base oficial persiste bitmap/arquivo e metadados do símbolo; a tela React atual ainda depende do payload resumido e da conversão local

## 8. Comparativo
- EasyDental: comportamento de edição mais completo, com carregadores, paleta e prévias múltiplas
- legado: implementação web extensa em `frontend/mock_simbolo_editor.html` e `frontend/app.js`
- React atual: implementação parcial, focada em grade 15x15, preview PNG e confirmação local

## 9. Funções candidatas à migração
- obrigatórias: resolução do preview em Altera, carregamento da imagem inicial no editor, resolução correta da especialidade para texto
- melhorias: paleta, desfazer, limpar, prévias múltiplas, carregadores X/Bracket
- incompatíveis: iframe, `postMessage`, abertura externa
- fora do escopo: integração com odontograma e intervenções

## 10. Decisões que dependem do usuário
- dados repetidos: decidir se o editor deve repetir os Dados do Símbolo ou manter apenas no modal principal
- paleta: decidir se a paleta do legado entra no React
- desfazer: decidir se vira requisito funcional
- limpar: decidir se volta ao React
- carregar X: decidir se vira atalho suportado no editor React
- carregar bracket: decidir se vira atalho suportado no editor React
- salvar como: decidir se o React deve suportar duplicação explícita
- prévia ampliada: decidir se volta ao contrato visual

## 11. Micropassos propostos
- G.4C.1: corrigir a resolução da Especialidade no Altera
- G.4C.2: corrigir o carregamento do preview no Altera
- G.4C.3: carregar o desenho atual no editor React
- G.4D.0: fechar o contrato do editor completo depois das três correções

## 12. Código e banco
- código alterado: nenhum
- testes alterados: nenhum
- banco alterado: nenhum
- scripts executados: nenhum

## 13. Causa-raiz consolidada

### Especialidade numérica
- causa: o modal de edição preserva `especialidadeCodigo` numérico e o catálogo do combo depende da resolução para texto
- arquivo: `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx:49-58`
- campo: `especialidadeCodigo`
- fonte correta: `useSimboloGraficoCatalogs` + `mapSimboloGraficoEspecialidadesCatalog`
- menor correção futura: resolver `especialidadeCodigo` para `value` do combo antes de renderizar o modal de edição

### Preview quebrado
- causa: o preview depende de `imageUrl`, mas a origem pode chegar sem bitmap renderizável no caminho do Altera
- valor atual: `imageUrl`, `imagem_custom` e `imagemUrl` competem no record
- formato: URL/asset; o React atual mostra somente o que consegue resolver como `src`
- fonte correta: resposta do GET do catálogo + normalização do mapper
- menor correção futura: fornecer ao modal uma URL carregável e coerente com o catálogo

### Editor vazio
- causa: `initialImage` não é convertido em matriz quando não é array nem string suportada pelo importador
- prop: `initialImage`
- importador: `matrixFromInitialImage` + `dataUrlToPixelMatrix`
- dependência da correção do preview: alta, porque o editor recebe a mesma origem visual do preview
- menor correção futura: converter a imagem de entrada para matriz 15x15 antes de abrir o editor

## 14. Matriz de resolução de imagem
| Fonte | Formato | Preview possível | Editor possível | Conversão necessária |
|---|---|---:|---:|---|
| biblioteca | `imageUrl`/asset `bmp` | sim, se a URL for carregável | só se converter para matriz | provável, se o editor exigir PNG/data URL |
| oficial persistido | `imagem_custom`/`imagem_url` | sim, se vier como data URL ou URL válida | sim, se virar array/data URL compatível | pode exigir normalização para PNG |
| usuário customizado | data URL PNG | sim | sim | não, quando já vier como data URL |
| legado | BMP/asset do sistema | depende do navegador e do servidor | não diretamente | sim, para importar no editor React |

## 15. Próxima ação sugerida
- somente G.4C.1, após aprovação explícita do usuário

## 16. Encerramento parcial
- G.4C.1 foi concluida com normalizacao da especialidade no modal `Altera`;
- G.4C.2 foi concluida com normalizacao da URL do desenho e do preview no modal `Altera`;
- o preview depende agora de `resolvedPreviewImageUrl` no modal compartilhado;
- o editor 15x15 foi preservado;
- a proxima intervencao funcional continua em `G.4C.3`, sem alterar a topologia do editor.

## 17. Atualizacao posterior
- a Especialidade permaneceu estabilizada e sem regressao nesta prova;
- o preview foi homologado visualmente no runtime autenticado para `Aplicação de flúor`;
- a causa anterior do preview quebrado ficou consolidada como URL incoerente antes da normalização aplicada em `G.4C.2F`.
