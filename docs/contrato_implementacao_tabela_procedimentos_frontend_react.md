# Contrato de implementacao - Tabela de Procedimentos no frontend React

## 1. Objetivo

Definir o contrato funcional, visual e arquitetural da frente `Tabelas -> Tabela de procedimentos` no novo frontend React do Brana Cloude.

Este documento serve como base de implementacao segura e incremental. O backend, o banco e o frontend legado sao a fonte da verdade.

## 2. Escopo

### Dentro do escopo

- Tela principal da tabela de procedimentos.
- Editor de procedimento.
- CRUD de tabelas de procedimentos.
- Procedimento generico como dependencia visual e funcional.
- Materiais vinculados.
- Fases vinculadas, apenas se houver necessidade real e interface definida.
- Reajuste de tabela.
- Relatorio de tabela.
- Estados de selecao, carregamento, vazio, erro e sucesso.

### Fora do escopo

- Alterar backend.
- Alterar banco.
- Criar migration.
- Mudar regras de negocio.
- Inventar novos campos.
- Reescrever contratos de procedimento generico, materiais ou tabelas auxiliares.
- Criar fluxo de fases inexistente no legado.

## 3. Entrada e navegacao

- Menu lateral: `Tabelas`.
- Item de modulo: `Procedimentos`.
- Nao usar `Tabela de procedimentos` como nome do item lateral.
- Nao confundir com `Procedimentos genéricos`.
- Nao criar segunda entrada equivalente.
- Rota React recomendada: `/app/tabelas/procedimentos`.
- Titulo da pagina: `Tabela de procedimentos`.
- Permissao: `procedimentos`.
- Comportamento ao abrir:
  - carregar filtros;
  - carregar listagem;
  - selecionar a tabela corrente;
  - manter sem autenticacao qualquer tentativa de acesso sem sessao.

## 4. Shell visual

O modulo deve seguir o shell administrativo vigente:

- lateral e barra superior unidas visualmente;
- faixa horizontal unica;
- barra compacta no mesmo espirito visual de `Tabelas -> Materiais`;
- filtros incorporados a faixa principal;
- listagem ocupando a largura util completa;
- sem toolbar isolada;
- sem segunda faixa de filtros fora da barra principal;
- responsividade igual aos modulos administrativos ja consolidados.

Referencia de padrao:

- `docs/frontend_react_padrao_shell_modulos_administrativos.md`

## 5. Barra de acoes

### Acoes primarias

1. `Nova tabela`
2. `Altera tabela`
3. `Elimina tabela`
4. `Imprime`
5. `Nova intervenção...`
6. `Altera intervenção...`
7. `Elimina`
8. `% Reajusta tabela...`

### Classificacao funcional

- `Nova tabela`: abre modal.
- `Altera tabela`: depende de selecao de tabela.
- `Elimina tabela`: depende de selecao de tabela.
- `Imprime`: abre modal/fluxo de relatorio.
- `Nova intervenção...`: abre editor.
- `Altera intervenção...`: depende de linha selecionada.
- `Elimina`: depende de linha selecionada.
- `% Reajusta tabela...`: abre modal de reajuste.

### Prioridade de entrega

- Primeira entrega estrutural:
  - shell;
  - listagem;
  - filtros;
  - `Nova intervenção...`;
  - `Altera intervenção...`;
  - seleção da tabela corrente;`r`n  - estrutura modular inicial do modal.
- Subetapas posteriores:
  - `Nova tabela`;
  - `Altera tabela`;
  - `Elimina tabela`;
  - `Elimina`;
  - `Imprime`;
  - `Reajusta`.

## 6. Filtros

### Combo Tabelas

- Fonte: `GET /procedimentos/filtros`.
- Deve listar todas as tabelas da clinica.
- Deve ter selecao padrao da tabela corrente.
- Deve disparar recarga da listagem quando mudar.

### Combo Especialidade

- Fonte: `GET /procedimentos/filtros`.
- Deve conter opcao `Todas`.
- Deve filtrar a listagem quando mudar.

### Busca por nome/codigo

- Campo textual com busca no frontend.
- Envia `q` para `GET /procedimentos`.
- O backend atual filtra por nome; o contrato visual deve manter o texto legado `Nome da intervenção / procedimento` e o placeholder de filtro por nome ou código.

### Regras de carga

- Ao abrir:
  - carregar filtros;
  - carregar listagem.
- Ao trocar tabela:
  - recarregar listagem;
  - manter especialidade atual quando possivel.
- Ao trocar especialidade:
  - recarregar listagem.
- Ao limpar busca:
  - recarregar listagem sem `q`.

## 7. Tabela principal

### Colunas confirmadas

1. `Código`
2. `Procedimento`
3. `Tempo`
4. `Preço`
5. `Custo Lab`

### Contrato de exibição

| Coluna | Chave backend | Tipo | Formatação | Alinhamento | Largura aprox. | Filtro | Ordenação | Nulo | Seleção |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | `codigo` | número | inteiro | centro ou esquerda compacta | 90px | nao na coluna | futura apenas se o componente do shell pedir | `-` ou vazio | click seleciona linha |
| Procedimento | `nome` | texto | string | esquerda | flexível | nao na coluna | futura apenas se o componente do shell pedir | `-` | click seleciona linha |
| Tempo | `tempo` | número | `min` | centro | 90px | nao na coluna | futura apenas se o componente do shell pedir | `0 min` | click seleciona linha |
| Preço | `preco` | moeda | moeda BRL | centro | 120px | nao na coluna | futura apenas se o componente do shell pedir | `0,00` | click seleciona linha |
| Custo Lab | `custo_lab` | moeda | moeda BRL | centro | 120px | nao na coluna | futura apenas se o componente do shell pedir | `0,00` | click seleciona linha |

### Observacoes

- A auditoria nao encontrou colunas visuais adicionais na tabela principal do legado.
- Nao ha coluna de status, preferido ou inatividade na grade principal.
- `rowSelection` e duplo clique devem continuar abertos para abrir o editor.

## 8. Editor de procedimento

### Forma de exibicao

- Deve abrir como modal proprio do modulo dentro da tela `Tabelas -> Procedimentos`.
- Nome lateral: `Procedimentos`.
- Agrupador lateral: `Tabelas`.
- Rota tecnica: `/app/tabelas/procedimentos`.
- Nao deve ser nova rota.
- Nao deve substituir toda a pagina.
- Nao deve usar `window.open`, `alert`, `confirm` ou qualquer interface nativa do navegador.
- Deve preservar filtros, tabela selecionada e linha selecionada ao fechar.
- Deve fechar e recarregar a listagem apos gravacao bem-sucedida.
- Estrutura do modal:
  - bloco de cadastro a esquerda;
  - bloco financeiro a direita;
  - grade de materiais vinculados abaixo.

### Titulo

- Novo: `Nova intervenção`
- Edicao: `Altera intervenção`

### Campos por bloco

#### Bloco de cadastro

- `nome`
- `procedimento_generico_id`
- `codigo`
- `especialidade`
- `simbolo_grafico`
- `garantia_meses`
- `forma_cobranca`
- `valor_repasse`
- `preco`
- `custo_lab`
- `tempo`
- `inativo`
- `preferido`
- `observacoes`
- `data_inclusao`
- `data_alteracao`

### Diferencas entre novo e alteracao

- Novo:
  - usa `GET /procedimentos/proximo-codigo`;
  - abre com campos vazios e tabela corrente;
  - pode herdar valores do procedimento generico se houver selecao.
- Alteracao:
  - usa `GET /procedimentos/{id}`;
  - hidrata o mesmo modal com os dados persistidos;
  - preserva materiais e fases retornados pelo backend;
  - nao deve zerar campos mantidos pelo legado sem confirmacao funcional.

#### Bloco financeiro

- `CFPH`
- `Mat. Consumo`
- `Custo R$`
- `Imposto`
- `Comissão CD`
- `Taxa Cartão`
- `Valor Mínimo`
- `Lucro Bruto`
- `Lucro Líquido`
- `Rendimento %`
- `Bom 30 a 40%`
- `Bom 10 a 20%`
- `Lucro por hora`

### Tabela de campos

| Campo visual | Payload | Controle | Origem | Obrigatório | Padrão | Editável | Regra funcional | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | `codigo` | input texto/número | legado / backend | sim | próximo código do backend em novo | sim | valida unicidade por tabela | depende de tabela ativa |
| Nome | `nome` | input texto | usuario | sim | vazio | sim | não pode ficar vazio | título principal do editor |
| Tempo | `tempo` | input numérico | usuario / generico | nao | `0` | sim | usado no cálculo financeiro | pode herdar do genérico |
| Preço | `preco` | input moeda | usuario | nao | `0` | sim | usado em relatório e custo | BRL |
| Custo | `custo` | derived/backend | backend | nao | `0` | nao | não é editável no legado | campo existe no modelo |
| Custo Lab | `custo_lab` | input moeda | usuario / generico | nao | `0` | sim | entra no cálculo financeiro | pode herdar do genérico |
| Lucro hora | `lucro_hora` | derived/backend | backend | nao | `0` | nao | calculado | exibido no banco e painel financeiro |
| Tabela | `tabela_id` | combo | filtros/tabela corrente | sim | tabela selecionada | sim, mas controlado | valida tabela ativa | no legado o editor trava se tabela inativa |
| Especialidade | `especialidade` | combo | lookups de especialidade | nao | vazio | sim | filtra lista e influencia herança | combo reaproveita catálogo existente |
| Procedimento genérico | `procedimento_generico_id` | combo | `GET /cadastros/procedimentos-genericos?q=` | nao | vazio | sim | pode herdar fase/material/tempo/lab | o label é `codigo - descricao` |
| Símbolo gráfico | `simbolo_grafico` | combo | `GET /cadastros/simbolos-graficos?scope=procedimentos` | nao | vazio | sim | atualiza preview visual | usa catálogo de símbolos |
| Símbolo legacy | `simbolo_grafico_legacy_id` | derived | lookup de símbolo | nao | null | nao | existe para compatibilidade | deve ser preservado no payload se necessário |
| Mostrar símbolo | `mostrar_simbolo` | checkbox | derivado do símbolo | nao | false | sim | controla visual/herança | no legado pode ser autoajustado |
| Garantia (meses) | `garantia_meses` | input numérico | usuario | nao | `0` | sim | persistido sem derivação | sem regra extra encontrada |

### Procedimento genérico

- Combo de origem: `GET /cadastros/procedimentos-genericos?q=`.
- Chave enviada: `id`.
- Label exibido: `codigo - descricao`.
- Heranca confirmada pelo backend:
  - `especialidade`;
  - `simbolo_grafico`;
  - `tempo`;
  - `custo_lab`;
  - `observacoes`;
  - fases vinculadas;
  - materiais vinculados.
- Ao trocar o genérico, o backend e o ponto de verdade para aplicar a heranca.

### Símbolo gráfico

- Fonte de dados: `GET /cadastros/auxiliares?tipo=Símbolo gráfico` no legado web atual, e catalogo equivalente no novo React conforme a lista de simbolos ja usada por outros modulos.
- O preview deve refletir o simbolo selecionado.
- O valor persistido pode manter compatibilidade com `simbolo_grafico` e `simbolo_grafico_legacy_id`.
- Sem simbolo, o preview fica vazio.

### Forma de cobrança e valores

- Formas de cobrança normalizadas no backend:
  - `INTERVENCAO`
  - `ELEMENTO_FACE`
- `valor_repasse` e `preco` permanecem campos distintos.
- O backend normaliza a forma de cobranca no create/update.

### Painel financeiro

- O painel financeiro do legado atual e uma visualização calculada no modal.
- A fonte oficial do calculo e o backend em `_calcular_financeiro_dashboard()`.
- Itens calculados:
  - `CFPH`
  - `Mat. Consumo`
  - `Custo R$`
  - `Imposto`
  - `Comissao CD`
  - `Taxa Cartao`
  - `Valor Minimo`
  - `Lucro Bruto`
  - `Lucro Liquido`
  - `Rendimento %`
  - `Bom 30 a 40%`
- `Bom 10 a 20%`
  - `Lucro por hora`
- O frontend deve evitar duplicar formula se o backend ja expuser o calculo.
- O contrato detalhado do painel financeiro foi fechado em `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`.
- O consumo preferencial no React deve reutilizar o endpoint oficial `GET /procedimentos/dashboard` e tratar a resposta como dado derivado do backend, sem recriar formulas no cliente.
- Quando o painel nao tiver dado oficial ainda, o estado visual deve permanecer neutro, com placeholders compactos e sem calculos locais inventados.

### Materiais vinculados

- Tabela inferior com 7 colunas confirmadas no HTML legado:
  - `Código`
  - `Material vinculado ao procedimento`
  - `Relação`
  - `Preço R$`
  - `Custo / UND`
  - `Quantidade`
  - `Custo R$`
- Totalizadores e recarga devem continuar sob controle da mesma tela.
- O fluxo de vinculo depende de procedimento ja gravado.

### Arquitetura React modular

- O modal nao deve ser um componente monolitico.
- Recomendacao de divisao:
  - `ProcedimentoEditorModal.jsx`
  - `ProcedimentoCadastroPanel.jsx`
  - `ProcedimentoFinanceiroPanel.jsx`
  - `ProcedimentoMateriaisTable.jsx`
  - `ProcedimentoMaterialVinculoModal.jsx`
  - `ProcedimentoEditorActions.jsx`
  - hooks de editor, financeiro e materiais
  - `procedimentosApi.js`
  - `procedimentosMappers.js`
  - `procedimentosValidators.js`
  - `procedimentosConstants.js`

### Estrutura ja implementada

- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorActions.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisTable.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoEditor.js`
- `frontend-react/src/features/procedimentos/procedimentosEditorConstants.js`
- `frontend-react/src/features/procedimentos/procedimentosEditorMappers.js`

### Ordem segura de implementacao

1. Estrutura do modal.
2. Bloco de cadastro.
3. Painel financeiro.
4. Materiais vinculados.
5. Refinamento visual e validacao no navegador.

### Dúvidas bloqueantes

Nao ha duvida bloqueante neste recorte. O contrato para o novo frontend esta fechado para:

- acesso em `Tabelas -> Procedimentos`;
- editor em modal proprio;
- inclusao/alteracao no mesmo modal;
- cancelamento retornando para a tabela.
| Forma de cobrança | `forma_cobranca` | combo | auxiliar local/backend | nao | vazio | sim | normaliza para `INTERVENCAO` ou `ELEMENTO_FACE` quando aplicavel | contrato existente no backend |
| Valor repasse | `valor_repasse` | input moeda | usuario | nao | `0` | sim | usado em consulta/relatorio | BRL |
| Preferido | `preferido` | checkbox | usuario | nao | false | sim | marca item preferencial | sem regra adicional encontrada |
| Inativo | `inativo` | checkbox | usuario | nao | false | sim | bloqueia algumas acoes ao salvar quando a tabela estiver inativa | legado trata tabela inativa como bloqueio |
| Observações | `observacoes` | textarea | usuario / generico | nao | vazio | sim | texto livre | herda do generico quando vazio |
| Inclusão | `data_inclusao` | readonly | backend | nao | vazio | nao | preenchido ao salvar | formato legado `DD/MM/AAAA HH:MM` |
| Alteração | `data_alteracao` | readonly | backend | nao | vazio | nao | preenchido ao atualizar | formato legado `DD/MM/AAAA HH:MM` |

### Validacoes reais do legado

- nome obrigatorio;
- codigo inteiro e unico por tabela;
- valores numericos invalidos bloqueiam salvamento;
- tabela inativa bloqueia alteracao e gravação de procedimento;
- procedimento genérico inexistente para a clinica deve gerar erro;
- tabela inexistente deve gerar erro;
- vinculacao de material exige quantidade valida.

### Gravar

- Novo: `POST /procedimentos`
- Editar: `PUT /procedimentos/{procedimento_id}`
- Sucesso: fechar o modal, recarregar a listagem e manter tabela/filtros selecionados.
- Erro: exibir mensagem funcional retornada pelo backend.

### Voltar/Cancelar

- Fecha o modal e retorna para a listagem.
- Nao deve salvar nada.

## 9. Procedimento generico

### Contrato

- Endpoint de opcoes: `GET /cadastros/procedimentos-genericos?q=`.
- Exibicao do combo: `codigo - descricao`.
- Se um procedimento generico for selecionado, o editor pode herdar:
  - especialidade;
  - símbolo grafico;
  - tempo;
  - custo_lab;
  - observações;
  - fases;
  - materiais vinculados, quando aplicavel no backend.
- A selecao continua editavel depois da heranca.
- Alterar a selecao no legado pode atualizar preview e reavaliar materiais visuais.
- No carregamento de um procedimento existente, o valor salvo e reidratado.

### Regras do backend confirmadas

- `_aplicar_heranca_procedimento_generico()` preenche campos vazios do procedimento e replica fases.
- Se houver sobrescrita de vinculos, materiais do generico tambem podem ser copiados.
- `_sincronizar_generico_com_procedimento()` atualiza tempo e custo lab no generico e em procedimentos vinculados.

## 10. Materiais vinculados

### Grade

- Fica dentro do editor, abaixo do bloco financeiro.
- Colunas:
  - `Código`
  - `Material vinculado ao procedimento`
  - `Relação`
  - `Preço R$`
  - `Custo / UND`
  - `Quantidade`
  - `Custo R$`

### Ações

- `Vincular material`
- `Desvincular material`

### Modal de vínculo

- Seleção de classificação.
- Busca por material.
- Seleção de material.
- Quantidade.
- Custo unitário e custo total em leitura.
- Botões `Ok` e `Cancela`.

### Payload e endpoints

- Inclusão:
  - `POST /procedimentos/{procedimento_id}/materiais-vinculados`
  - payload: `material_id`, `quantidade`
- Alteração:
  - `PUT /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`
  - payload: `quantidade`
- Remoção:
  - `DELETE /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`

### Confirmacoes e comportamento

- Remocao exige confirmacao antes da exclusao.
- Quantidade e editavel.
- O fluxo depende de procedimento persistido.
- A grade deve ser recarregada apos vinculo, alteracao ou remocao.

## 11. Fases vinculadas

### Resultado da investigacao

- O backend confirma `fases_vinculadas` no detalhe do procedimento.
- Nao foi encontrada interface de fases no painel principal desta frente no legado.
- Os dados de fase existem para heranca e persistencia, mas nao para uso visual direto na tabela de procedimentos.

### Contrato de implementacao

- Fases nao devem entrar na primeira entrega estrutural como tela visivel separada nesta frente.
- Se a equipe decidir expor fases depois, isso deve vir como subetapa propria, com contrato novo ou reaproveitado do procedimento generico.

## 12. CRUD de tabelas

### Modal

- Tipo: modal proprio do React.
- Titulo:
  - novo: `Insere nova tabela`
  - edicao: `Altera dados da tabela`

### Campos

- `nome`
- `fonte_pagadora`
- `nro_indice`
- `nro_credenciamento`
- `tipo_tiss_id`
- `inativo`
- `copiar_de_tabela_id`

### Regras

- nome obrigatorio;
- nome unico por clinica;
- indice monetario obrigatorio no fluxo atual;
- credenciamento somente para `convenio`;
- tabela unica nao pode ser excluida;
- a tabela `Tabela Exemplo` / privada especial merece tratamento preservado;
- excluir tabela apaga os procedimentos da tabela no backend atual.

### Endpoints

- `GET /procedimentos/tabelas`
- `POST /procedimentos/tabelas`
- `PATCH /procedimentos/tabelas/{codigo}`
- `DELETE /procedimentos/tabelas/{codigo}`

### Mensagens

- o contrato visual deve mostrar as mensagens reais do backend:
  - `Informe o nome da tabela.`
  - `Ja existe uma tabela com esse nome.`
  - `Nao e possivel excluir a unica tabela existente.`
  - `Tabela excluida com sucesso.`

## 13. Reajuste

### Modal

- Titulo: `Reajustar tabela`
- Campos:
  - tabela selecionada
  - percentual
  - modo aumentar/diminuir
  - preview

### Endpoint de preview

- `GET /procedimentos/tabelas/reajuste-preview?tabela_id=...&modo=...&percentual=...&limit=...`

### Endpoint de aplicacao

- `POST /procedimentos/tabelas/reajuste-aplicar`

### Regras

- percentual deve ser positivo;
- o backend arredonda para 2 casas decimais;
- nao aplica se houver valores negativos na tabela;
- preview deve mostrar amostra antes/depois;
- aplicar exige confirmacao;
- a listagem deve ser recarregada apos sucesso.

## 14. Relatorio

### Modal

- Titulo: `Tabela de intervenções`
- Campos:
  - tabela
  - especialidade opcional
  - dados disponiveis
  - dados selecionados
  - ordem de impressao
  - saida do relatorio
  - modo de impressao
  - nome do relatorio

### Endpoint

- `GET /procedimentos/relatorio-tabela?tabela_id=...&especialidade=...&ordem=...`

### Uso

- O contrato deve suportar tela, arquivo ou impressora conforme o legado.
- O formato retornado deve ser preservado como dado de relatorio, nao como lista simples.

## 15. Estados, erros e confirmacoes

### Estados obrigatorios

- carregamento inicial;
- tabela vazia;
- erro de rede;
- erro funcional;
- registro selecionado;
- registro nao selecionado;
- sucesso de CRUD;
- bloqueio por tabela inativa;
- bloqueio por item inexistente;
- confirmacao de exclusao.

### Padrao de UI

- Nao usar `window.alert`, `window.confirm` ou `prompt`.
- Usar modal proprio e mensagens controladas pelo React.

## 16. Arquitetura modular proposta

### Estrutura sugerida

- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentosToolbar.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentosFilters.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentosTable.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoEditor.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisGrid.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoTabelaModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoReajusteModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoRelatorioModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoConfirmModal.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosMappers.js`
- `frontend-react/src/features/procedimentos/procedimentosConstants.js`
- `frontend-react/src/features/procedimentos/procedimentosUtils.js`

### Responsabilidade

- pagina: orquestra estado e navegação;
- toolbar: acoes e controles;
- filtros: tabela, especialidade e busca;
- table: listagem com header filtravel;
- editor: formulario principal;
- finance panel: bloco calculado;
- materials grid: vinculos;
- modais: tabela, reajuste, relatorio e confirmacoes;
- hook: integra estado, carregamento e selecao;
- api: chamadas HTTP;
- mappers: payload e hidratação;
- constants/utils: helpers puros.

## 17. Ordem recomendada de implementacao

1. Rota/menu e shell.
   - Objetivo: abrir a tela com a rota correta.
   - Dependencias: shell administrativo vigente.
   - Aceite: pagina abre e navega sem quebrar outras telas.
2. Servico de leitura e filtros.
   - Objetivo: carregar tabelas, especialidades e busca.
   - Dependencias: API e permissao `procedimentos`.
   - Aceite: filtros e listagem carregam.
3. Listagem principal.
   - Objetivo: exibir a grade com selecao.
   - Aceite: clicar seleciona e duplo clique abre editor.
4. Editor base.
   - Objetivo: abrir, carregar e salvar procedimento.
   - Aceite: novo, editar e validar campos obrigatorios.
5. Integracao com procedimento generico.
   - Objetivo: heranca e lookup.
   - Aceite: campos herdados e editaveis.
6. Materiais vinculados.
   - Objetivo: grade e modal de vinculo.
   - Aceite: incluir, alterar e excluir vinculo.
7. CRUD de tabelas.
   - Objetivo: modal de tabela e exclusao.
   - Aceite: criar, alterar, excluir com regras do backend.
8. Reajuste.
   - Objetivo: preview e aplicacao.
   - Aceite: preview confiavel e aplicacao recarrega listagem.
9. Relatorio.
   - Objetivo: criterios e saida.
   - Aceite: formato e parametros equivalentes ao legado.
10. Fases, somente se o contrato futuro confirmar interface separada.
   - Objetivo: nao inventar UI sem prova.
   - Aceite: apenas se houver subfluxo validado.
11. Refinamento visual e acessibilidade.
   - Objetivo: fechar densidade e responsividade.
   - Aceite: shell coerente com os modulos referencia.
12. Validacao e encerramento.
   - Objetivo: documentar resultados finais.
   - Aceite: smoke tests manuais e docs atualizados.

## 18. Dvidas remanescentes

- Se fases merecem tela propria nesta frente ou permanecem apenas como dependencia tecnica.
- Se o relatorio entra na primeira entrega ou em subetapa posterior.
- O contrato de entrada lateral ja esta fechado como `Tabelas -> Procedimentos`.

## 19. Conclusao

O contrato esta suficientemente fechado para iniciar a implementacao React sem inventar regra.

Os pontos em aberto sao apenas de prioridade de entrega e nao de comportamento essencial.

## 20. Estado da frente

- A frente continua aberta.
- O alinhamento visual com `Materiais` foi ajustado na barra, nos filtros e na largura da tabela.
- O modal completo do procedimento e os subfluxos funcionais permanecem pendentes de implementacao.

## 21. Fechamento documental do Painel de Cadastro

### 21.1 Estado do Painel de Cadastro

- O Painel de Cadastro esta concluido funcionalmente e documentado.
- A criacao real, a alteracao real, a hidratacao do modal e as validacoes locais ja foram executadas e validadas.
- A persistencia validada usa os contratos reais de `POST /procedimentos` e `PUT /procedimentos/{id}`.
- O modal proprio permanece dentro da tela `Tabelas -> Procedimentos`, sem nova rota.

### 21.2 Arquitetura modular confirmada

- `ProcedimentoEditorModal.jsx`
- `ProcedimentoCadastroPanel.jsx`
- `ProcedimentoEditorActions.jsx`
- `useProcedimentoEditor.js`
- `useProcedimentoCadastroForm.js`
- `procedimentosEditorMappers.js`
- `procedimentosApi.js`
- `procedimentosEditorValidators.js`
- `procedimentos.css`

### 21.3 Contrato de dados

- O payload real de `POST` e `PUT` manteve somente os campos aceitos pelo backend.
- `tabela_id` deve permanecer como `string` no contrato do frontend, conforme o backend real ja espera no fluxo atual.
- IDs internos de catalogo de simbolo nao devem ser inventados ou enviados como campos paralelos sem respaldo do backend.
- O frontend nao deve reconverter `tabela_id` para `number` antes de enviar.

### 21.4 Simbolos graficos

- Endpoint oficial utilizado: `GET /cadastros/simbolos-graficos?scope=procedimentos`.
- O catalogo confirmado no escopo de procedimentos possui `141` itens observados.
- O valor interno do select usa o ID fisico do catalogo.
- O label usa a descricao do catalogo.
- O preview segue o item selecionado.
- A colisao historica de `sim_30.bmp` permanece resolvida por ID.
- Nenhum campo inventado e enviado ao backend.

### 21.5 Forma de cobranca

- Opcoes oficiais: `INTERVENCAO` -> `Intervenção`; `ELEMENTO_FACE` -> `Elemento / Face`.
- Nao existe opcao `BOLETO` nesta frente.
- Nao existe tabela auxiliar para esse campo.
- As opcoes sao locais e canonicas.

### 21.6 Persistencia validada

- `POST` executado com sucesso.
- `PUT` executado com sucesso no `id 66928`.
- Rehidratacao confirmada apos persistencia.
- `GET /me` validado com clinica confirmada.

### 21.7 Registros de teste

- `66927`, codigo `44`
- `66928`, codigo `45`
- `66928` usado no `PUT`

- Os registros foram criados em validacao real.
- Nenhuma exclusao foi executada nesta etapa.
- A limpeza futura deve usar fluxo funcional seguro.

### 21.8 Validacoes executadas e pendentes

Executadas:

- nome vazio;
- `POST` real;
- `PUT` real;
- hidratacao;
- simbolo;
- forma de cobranca;
- `tabela_id` como string;
- build.

Pendentes ou nao comprovadas isoladamente:

- valor numerico invalido;
- codigo duplicado;
- exclusao funcional segura dos registros de teste.

### 21.9 Mojibake

- Tabela 5: `54` registros corrigidos, com banco, API, navegador e build validados.
- Tabela 11: `114` registros corrigidos, com banco, API, navegador e build validados.
- Tabela 10: bloqueada e nao corrigida automaticamente.
- Tabela 4: fora do escopo e preservada.
- O importador foi corrigido para `cp850`.
- Os scripts de preview, backup, apply e rollback permanecem preparados.
- Os backups reais permanecem ignorados pelo Git.
- Nenhuma correcao de runtime foi adicionada ao React para os nomes dos procedimentos.

### 21.10 Estado atual dos paineis

- Painel de Cadastro: concluido funcionalmente, documentado e com persistencia validada.
- Painel Financeiro: pendente.
- Materiais: pendente.

### 21.11 Proxima etapa

- Proxima implementacao funcional: integracao do Painel Financeiro do modal de Procedimentos.
- A funcao oficial do backend a ser consumida e `_calcular_financeiro_dashboard()`.
- O React deve consumir os resultados oficiais e nao recriar formulas no frontend.

## 22. Estado do painel financeiro

- O Painel Financeiro ja foi integrado ao React usando `GET /procedimentos/dashboard`.
- O componente permanece read-only e nao calcula formulas no cliente.
- O estado vazio do modal novo continua neutro.
- Materiais vinculados foram implementados no React com `useProcedimentoMateriais`, `procedimentosMateriaisApi.js`, `procedimentosMateriaisMappers.js`, `ProcedimentoMateriaisTable.jsx` e `ProcedimentoMaterialModal.jsx`, respeitando o contrato real de `POST`, `PUT` e `DELETE` por codigo.

## 23. Contrato complementar de materiais vinculados

- O vinculo persistido usa `procedimento_material`, com `procedimento_id`, `material_id`, `quantidade` e `clinica_id`.
- Os campos `custo_und`, `preco`, `relacao` e `custo_total` sao derivados na leitura a partir da tabela `material`.
- O detalhe do procedimento pode devolver `materiais_vinculados` ja composto por itens proprios e herdados do generico.
- O resumo financeiro do modal usa o mesmo agregado de materiais, sem mock local.
- O fluxo de edicao de quantidade por duplo clique deve reutilizar o mesmo modal de vinculo.
- O fluxo de desvinculo deve usar confirmacao controlada pelo React e nao deve usar prompt nativo.

## 16. Ajuste visual do submodal Vincular material

- O submodal `Vincular material` foi consolidado em layout vertical compacto.
- A ordem final confirmada ficou: `Classifica��o`, `Material`, `Nome do material`, `Valor de custo unit�rio`, `Quantidade m�dia utilizada`, `Valor de custo total`, `Ok` e `Cancela`.
- `Rela��o` e `Pre�o R$` deixaram de aparecer na apresenta��o deste submodal.
- Os campos read-only de custo passaram a usar destaque ciano.
- A l�gica funcional de v�nculo permaneceu intacta.
