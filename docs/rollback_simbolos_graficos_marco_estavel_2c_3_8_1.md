# Segundo rollback controlado - marco estavel 2C.3.8.1

## Resultado
- BLOQUEADO no runtime atual ate nova homologacao visual do marco simples.

## Marco
- Fase de referencia: 2C.3.8.1
- Evidencia historica: lista de 56 BMPs com URLs corretas e modal funcional confirmado pelo responsavel em runtime
- Motivo da escolha: regressao persistente na estabilidade do modal depois da acumulacao posterior de validacao, submit e editor

## Removido
- validacao avancada
- hook do formulario
- mapper de criacao
- POST do modal
- submit
- editor
- imagem_custom

## Preservado
- modal
- Especialidade
- Forma
- Biblioteca
- preview-base
- Limpar
- tabela

## Estado do modal
- Fonte unica: `bibliotecaSelecionada`
- Reset: apenas ao abrir, cancelar ou fechar
- Seleção: local e simples
- Preview: derivado diretamente da selecao atual

## Especialidade
- GETs: mantido
- Default: Dentistica
- Valor apos 20s: pendente de comprovacao visual nesta rodada
- Flicker: pendente de comprovacao visual nesta rodada

## Biblioteca
- Quantidade: 56
- Clique: seleciona item
- Permanencia: deve persistir ate trocar ou limpar
- Troca: deve substituir a selecao
- Assets: `/app/assets/Icones/`

## Preview
- Src: mesma URL do item selecionado
- Status: pendente de comprovacao visual nesta rodada
- naturalWidth: pendente de comprovacao visual nesta rodada
- Visivel: pendente de comprovacao visual nesta rodada

## Runtime dev
- Resultado: runtime nao revalidado nesta rodada
- Console: nao validado nesta rodada
- Network: nao validado nesta rodada

## Testes
- Executados: `frontend-react/tests/simboloGraficoCreateModal.test.js`, `frontend-react/tests/simbolosGraficosMapper.test.js`, `frontend-react/tests/simbolosGraficosApi.test.js`, `frontend-react/tests/simbolosGraficosRouting.test.js`
- Total: 24
- Aprovados: 24
- Falhas: 0

## Build e preview
- Build: aprovado
- Dist: gerado
- Preview visual: nao revalidado nesta rodada
- Assets: 56 BMPs publicados

## Arquivos orfaos
- Hooks: `useSimboloGraficoCreateForm.js`, `useCreateSimboloGrafico.js`, `useSimboloGraficoEditor.js`
- Mapper: `simboloGraficoCreateMapper.js`
- POST: mantido fora do fluxo ativo
- Editor: mantido fora do fluxo ativo
- Decisao: manter orfao temporariamente ate nova etapa de reintroducao

## Documentacao
- Criada: sim
- Fases suspensas: posteriores ao marco simples
- Observacao: a validacao simples do campo Nome foi reintroduzida isoladamente, sem reativar submit, POST ou editor
- Observacao: a validade completa do formulario e a habilitacao local do botao Ok foram reintroduzidas sem POST
- Observacao: o mapper puro do payload basico foi restaurado sem API e o clique no Ok apenas gera payload em memoria
- Observacao: o `POST` basico foi reintroduzido com fechamento do modal, reset, erro acessivel e reload por callback, sem reativar editor ou campos avancados

## Proxima etapa
- Congelar o fluxo Novo no marco simples e reintroduzir somente validacoes basicas em microetapas futuras
