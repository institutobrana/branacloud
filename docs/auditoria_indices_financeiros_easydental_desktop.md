# Auditoria Funcional e Técnica - Índices Financeiros no EasyDental Desktop

## 1. Objetivo

Mapear o comportamento do módulo `Configurações -> Índices financeiros` no EasyDental Desktop a partir de artefatos legíveis em `Y:\EDS70`, sem alterar qualquer arquivo, banco ou configuração.

## 2. Escopo

Esta etapa cobre:

- inventário de `Y:\EDS70`;
- busca textual e técnica em textos, ajuda, relatórios, dumps e scripts legíveis;
- análise de estrutura de dados e persistência quando possível;
- comparação preliminar com o comportamento já documentado no Brana Cloud apenas como referência.

## 3. Limites

- Não foi executado o aplicativo desktop em modo interativo nesta etapa.
- Não foram realizados salvamentos, exclusões, importações, reparos ou conversões.
- Não foi feita descompilação agressiva nem modificação de binários.
- Não foi alterado o documento do Brana Cloud.

## 4. Regras de segurança

- Trabalho em modo read-only.
- Nenhum arquivo de `Y:\EDS70` foi modificado.
- Nenhum arquivo do repositório Brana Cloud foi alterado além deste documento autorizado.
- Não houve `git add`, commit, push ou deploy.

## 5. Fontes auditadas

- [Y:\EDS70](file:///Y:/EDS70)
- [Y:\EDS70\Dados\eds70.sql](file:///Y:/EDS70/Dados/eds70.sql)
- [Y:\EDS70\Dados\Dist\_INDICE.raw](file:///Y:/EDS70/Dados/Dist/_INDICE.raw)
- [Y:\EDS70\Mensagens.txt](file:///Y:/EDS70/Mensagens.txt)
- [Y:\EDS70\Help\Manual_EDS70_Completo.pdf](file:///Y:/EDS70/Help/Manual_EDS70_Completo.pdf)
- [Y:\EDS70\Textos](file:///Y:/EDS70/Textos)
- [Y:\EDS70\Reports](file:///Y:/EDS70/Reports)
- [D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_indices_financeiros_brana_cloud.md](file:///D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_brana_cloud.md)

## 6. Estado do repositório Brana Cloud

- diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- branch: `modularizacao-segura-fase-1`
- remote: `https://github.com/institutobrana/branacloud.git`
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- status inicial: worktree já sujo por alterações preexistentes
- status final: inalterado
- stage inicial: vazio
- stage final: vazio

### Status do arquivo autorizado

- `docs/auditoria_indices_financeiros_easydental_desktop.md` estava não rastreado no momento da criação.
- não havia diff preexistente no arquivo antes desta etapa.
- o único arquivo alterado nesta execução é este documento.

## 7. Estado de acesso a Y:\EDS70

- `Y:\EDS70` está acessível.
- executável principal observado: `Y:\EDS70\EDS70.exe`
- nome visível do produto: `EasyDental`
- versão visível do executável: `7.6.0.1001`
- data do arquivo: `17/05/2011 15:42:47`
- processo observado ao abrir: `EDS70.exe`
- há mais de um executável auxiliar no diretório, mas `EDS70.exe` foi o binário principal identificado nesta execução.
- Estrutura principal confirmada: `Bitmaps`, `Dados`, `Fotos`, `Help`, `Icones`, `Import`, `MSDE`, `Objetos`, `Outbox`, `Reports`, `Safe`, `Slide`, `Temp`, `Textos`, `TISS`.
- Arquivo de dados principal encontrado: `Y:\EDS70\Dados\EDS70dat.mdf`.
- Arquivo de log principal encontrado: `Y:\EDS70\Dados\EDS70log.ldf`.
- Banco/dump legível encontrado: `Y:\EDS70\Dados\eds70.sql`.

## 8. Inventário de diretórios

### Diretórios com maior relevância

| Caminho | Tipo | Data | Relevância | Observação |
| --- | --- | --- | --- | --- |
| `Y:\EDS70\Dados` | dados / scripts SQL | 01/08/2026 a 30/07/2026 | diretamente relacionado | contém `eds70.sql`, `EDS70dat.mdf`, `EDS70log.ldf`, `.raw` |
| `Y:\EDS70\Dados\Dist` | dumps/artefatos distribuídos | 11/12/2006 a 09/01/2007 | diretamente relacionado | contém `_INDICE.raw` e outros básicos do sistema |
| `Y:\EDS70\Help` | ajuda PDF | 14/12/2005 | possivelmente relacionado | manuais CAP do EasyDental |
| `Y:\EDS70\Textos` | textos/modelos | 2001 a 2026 | possivelmente relacionado | templates e mensagens; não localizei módulo de índice específico |
| `Y:\EDS70\Reports` | relatórios FastReport | 2008 | possivelmente relacionado | TISS; sem confirmação de índice financeiro |
| `Y:\EDS70\Bitmaps` | recursos gráficos | 2000 | relacionado a outros módulos | majoritariamente odontograma e símbolos |
| `Y:\EDS70\Icones` | ícones | não inspecionado em detalhe | possivelmente relacionado | sem confirmação específica do módulo |
| `Y:\EDS70\Import` | importação | não inspecionado em detalhe | não confirmado | sem evidência do módulo |

## 9. Inventário de artefatos relevantes

### Confirmados como relevantes

| Caminho | Tamanho | Modificação | Finalidade provável | Classificação |
| --- | --- | --- | --- | --- |
| `Y:\EDS70\Dados\eds70.sql` | 106.681 bytes | 09/01/2007 | script SQL com schema e rotinas | diretamente relacionado |
| `Y:\EDS70\Dados\Dist\_INDICE.raw` | 122 bytes | 11/12/2006 | dicionário/lookup de índices | diretamente relacionado |
| `Y:\EDS70\Dados\Dist\PLANO.raw` | 540 bytes | 11/12/2006 | plano / tabela correlata | possivelmente relacionado |
| `Y:\EDS70\Mensagens.txt` | 15.256 bytes | 17/12/2005 | mensagens do sistema | diretamente relacionado |
| `Y:\EDS70\Dados\eds70_build_*.sql` | vários | 2006-2010 | histórico de build/migrations | possivelmente relacionado |
| `Y:\EDS70\Help\Manual_EDS70_Completo.pdf` | 2.411.742 bytes | 14/12/2005 | manual geral | possivelmente relacionado |

### Não confirmados para esta frente

- `Y:\EDS70\Reports\TISS_*.fr3` - relatórios TISS, sem evidência do módulo de índices financeiros.
- `Y:\EDS70\Textos\*.rtf/.doc/.txt` - muitos textos clínicos e operacionais, sem confirmação do módulo.
- `Y:\EDS70\Bitmaps\*.bmp` - recursos gráficos diversos, sem confirmação específica.

## 10. Caminho no menu

### Confirmado por documentação técnica do próprio banco legado

- mensagem `IN001` em `Y:\EDS70\Mensagens.txt`:
  - `Índices financeiros`
  - `Não existe nenhum índice financeiro cadastrado. Deseja criar um novo índice agora ?`
  - referência: módulo `Configura - Índices financeiros`

### Confirmação visual

- não foi realizada nesta etapa.

## 11. Janela principal

### O que foi confirmado

- o módulo existe no banco legado e está ligado a uma entidade própria de índice;
- há tabela `COTACAO` com histórico de valores por índice;
- há stored procedure `sp_GetValorIndice` que calcula o valor do índice conforme data;
- o comportamento do Brana Cloud já documentado mostra duas grades e botões equivalentes.

### O que não foi confirmado visualmente no desktop

- posição exata da janela;
- tamanho aproximado;
- modal ou não modal;
- redimensionamento;
- foco inicial;
- linha inicialmente selecionada;
- ordem visual dos controles;
- bordas, separadores, contador, status bar e tooltips.

## 12. Tabela Índices financeiros

### Evidências de estrutura

- `Y:\EDS70\Dados\Dist\_INDICE.raw` contém os registros nativos:
  - `USO` -> `Unid. Serviço`
  - `UHO` -> `Unid. Honorário`
  - `R$` -> `Reais`
- `Y:\EDS70\Dados\eds70.sql` cria a tabela `_INDICE` e a usa como chave estrangeira para vários módulos.

### Confirmações

- existe um cadastro base de índices;
- a existência de `R$`, `UHO`, `UPO`, `USO` é compatível com o que o Brana Cloud documenta;
- o arquivo `IN001` indica o módulo de índices financeiros.

### Não localizados por leitura direta

- cabeçalho exato da grade;
- colunas visuais;
- ordenação de clique;
- colunas técnicas ocultas.

## 13. Tabela Cotações para reais

### Evidências de estrutura

- `Y:\EDS70\Dados\eds70.sql` define `COTACAO` com:
  - `NROIND int not null`
  - `DATA datetime not null`
  - `VALOR float null`
- a PK é composta por `(NROIND, DATA)`.

### Confirmações

- existe tabela de cotação por índice;
- a data é parte da chave primária;
- isso sugere unicidade por índice e data;
- o valor é numérico em `float`.

### Não confirmados visualmente

- texto exato do título da grade;
- formato de exibição da data;
- precisão de exibição;
- comportamento de dados futuros/retroativos na UI.

## 14. Relação mestre/detalhe

### Confirmado por artefato técnico

- `COTACAO` referencia `_INDICE` via FK `FK_COTACAO__INDICE`.
- `sp_GetValorIndice` consulta `COTACAO` por data.

### Inferência controlada

- o índice é a entidade mestre;
- as cotações são o detalhe temporal.

### Não localizado

- reação visual ao selecionar linha;
- carregamento automático da segunda grade;
- preservação de seleção após edição;
- recálculo imediato na tela após inclusão/edição/exclusão.

## 15. Novo índice

### Confirmado

- a mensagem `IN001` pede criação de novo índice quando não há cadastro;
- `CN007` informa que nome e sigla da moeda corrente não podem ser nulos.

### Não localizado

- modal de inclusão;
- labels;
- tipo dos campos;
- valor padrão;
- geração automática de identificador;
- validação de duplicidade;
- criação automática de primeira cotação.

## 16. Altera índice

### Confirmado

- `CN025`: `% não pode ser % pois é reservado do sistema.`
- `CN005`: `% não pode ser % pois é reservada do sistema.`
- isso indica proteção de registros nativos/reservados.

### Não localizado

- campos editáveis;
- se o valor atual muda no modal;
- comportamento específico de Reais, UHO, UPO e USO.

## 17. Elimina índice

### Confirmado

- `GR008`: `% não pode ser eliminado pois já está sendo utilizado em outro(s) módulo(s) do EasyDental.`
- `CN001`: `Lançamentos do sistema não podem ser eliminados ou modificados.`
- `CN025` e `CN005` indicam proteção de reservados.

### Confirmado por banco

- vários módulos apontam FK para `_INDICE`;
- exclusão de índice pode afetar procedimentos, materiais, tratamento, protético e conta corrente.

### Não localizado

- texto exato de confirmação da exclusão de índice;
- seletor de destino para migração;
- regra de cascata visual.

## 18. Fecha

### Não localizado visualmente

- não houve abertura interativa do módulo.

### Confirmado por documentação do Brana Cloud, como referência

- o módulo possui botão `Fecha` no legado novo documentado em Brana Cloud.

## 19. Novo valor

### Confirmado por artefato técnico

- `sp_GetValorIndice` busca a cotação mais recente `<= @data`.
- se nada for encontrado, o valor padrão é `1.00`.

### Confirmado pelo banco

- `COTACAO` usa `VALOR float`.

### Não localizado visualmente

- calendário, spin ou máscara;
- valor padrão do campo na UI;
- mensagens de validação da janela do desktop.

## 20. Altera valor

### Confirmado por artefato técnico

- a PK de `COTACAO` é composta por `(NROIND, DATA)`, o que sugere controle por data do índice.
- `sp_GetValorIndice` usa cotação por data, não por ordem manual de cadastro.

### Não localizado

- se a UI permite editar data e valor;
- se há bloqueio de datas duplicadas;
- se existe validação de precisão decimal.

## 21. Elimina valor

### Confirmado por artefato técnico

- a última cotação não tem proteção explícita encontrada no script analisado.
- o valor atual é recalculado por `sp_GetValorIndice` usando a maior data menor/igual à data pedida.

### Inferência

- se a cotação mais recente for excluída, o valor atual passa a refletir a próxima cotação anterior existente.
- se a última cotações for excluída e não houver anterior, o valor cai para `1.00`.

### Não localizado

- texto de confirmação;
- proteção específica para última cotação na UI.

## 22. Modais

### Não localizados visualmente nesta etapa

- novo índice;
- altera índice;
- elimina índice;
- novo valor;
- altera valor;
- elimina valor.

### Observação

- os modais acima são descritos no Brana Cloud e no legado do modo de referência, mas não houve navegação segura da interface desktop para confirmação visual.

## 23. Campos

### Confirmados por artefato

- `_INDICE`: `NROIND`, `NOMIND`, `SIGIND`
- `COTACAO`: `NROIND`, `DATA`, `VALOR`

### Não localizados

- max length visual;
- tabindex;
- bloqueios dinâmicos;
- campos ocultos técnicos.

## 24. Controles

### Confirmado apenas em nível estrutural

- controle de cadastro de índice existe;
- controle de cotação por data existe;
- há mensagem de criação de novo índice.

### Não localizado

- combo;
- spin;
- calendário;
- máscaras;
- botão padrão de confirmação.

## 25. Ordem de tabulação

- não confirmada visualmente.

## 26. Atalhos

- não confirmados visualmente.
- nenhuma referência textual segura localizada para atalhos específicos do módulo.

## 27. Validações

### Confirmadas por mensagens ou SQL

- nome/sigla da moeda corrente não podem ser nulos;
- registros reservados do sistema não podem ser alterados da mesma forma que registros comuns;
- exclusão de item em uso é bloqueada.

### Não localizadas

- validação de duplicidade de data na UI;
- precisão decimal mínima/máxima;
- datas futuras;
- valores negativos ou zero;
- trim/uppercase no desktop.

## 28. Mensagens

### Mensagens diretamente relevantes

- `IN001`: `Não existe nenhum índice financeiro cadastrado. Deseja criar um novo índice agora ?`
- `CN007`: `Nome e sigla da moeda corrente não podem ser nulos.`
- `GR008`: `% não pode ser eliminado pois já está sendo utilizado em outro(s) módulo(s) do EasyDental.`
- `GR009`: `% não pode ser eliminada pois já está sendo utilizada em outro(s) módulo(s) do EasyDental.`
- `CN025`: `% não pode ser % pois é reservado do sistema.`
- `CN005`: `% não pode ser % pois é reservada do sistema.`
- `OR006`: `Todos os valores referentes ao orçamento serão convertidos para o novo índice.`
- `OR006` também recomenda verificar cotações do índice.

## 29. Confirmações

### Confirmado por artefato técnico

- existe um índice nativo `R$ / Reais`;
- existem `UHO`, `UPO` e `USO`;
- há cotação por data;
- há cálculo do valor atual por cotação mais recente ou fallback.

### Parcialmente confirmado

- a combinação exata de teclas e foco não foi observada visualmente;
- a navegação da janela não foi comprovada em runtime.

## 30. Formatação de datas

### Confirmado por código SQL

- `COTACAO.DATA` é `datetime`.
- `sp_GetValorIndice` compara `DATA <= @data`.

### Inferência

- o desktop trabalha com data cronológica do índice.

### Não localizado

- formato de entrada exibido ao usuário;
- máscara de data;
- calendário de seleção.

## 31. Formatação decimal

### Confirmado por artefato técnico

- `COTACAO.VALOR` é `float`.
- `sp_GetValorIndice` devolve `MONEY`.

### Inferência

- a precisão de exibição depende da tela/controle do aplicativo.

### Não localizado

- número de casas decimais da UI;
- separador decimal configurado na janela;
- regras de arredondamento.

## 32. Regra de valor atual

### Confirmado por artefato técnico

- stored procedure `sp_GetValorIndice`:
  - busca `VALOR_US` em `CREDENCIAMENTO`;
  - se não encontrar, busca `VALOR` em `COTACAO` com `DATA <= @data`;
  - se ainda assim não encontrar, retorna `1.00`.

### Consequências observadas

- o valor atual não é uma coluna persistida específica;
- depende da cotação mais recente compatível com a data consultada;
- é possível existir valor por convenção mesmo sem cotação explícita.

## 33. Registros nativos

### Confirmados

- `255` -> `Reais` / `R$`
- `2` -> `Unid. Honorário` / `UHO`
- `1` -> `Unid. Serviço` / `USO`

### Parcialmente confirmado

- `UPO` aparece no Brana Cloud como registro reservado, mas no trecho lido do `_INDICE.raw` não apareceu explicitamente na amostra exibida; portanto fica pendente de conferência adicional em artefato completo.

### Proteções observadas

- mensagem `CN025` indica que registro reservado do sistema não pode ser alterado na mesma lógica dos demais;
- mensagem `CN005` reforça a proteção de reservados;
- `GR008/GR009` sugerem proteção contra exclusão de itens em uso.

## 34. Persistência

### Artefatos persistentes localizados

- `Y:\EDS70\Dados\EDS70dat.mdf`
- `Y:\EDS70\Dados\EDS70log.ldf`
- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Dados\eds70_build_*.sql`
- `Y:\EDS70\Dados\Dist\_INDICE.raw`
- `Y:\EDS70\Dados\Dist\PLANO.raw`

### Estrutura técnica confirmada

- `_INDICE` é uma tabela de lookup de índices.
- `COTACAO` armazena valores por índice e data.
- outros módulos referenciam `_INDICE` por FK.

### Não localizado

- arquivo raw dedicado a `COTACAO` na amostra consultada;
- script isolado de manutenção do módulo de índices financeiros;
- documentação de migração específica para esta frente.

## 35. Estrutura de dados

### Tabelas e chaves confirmadas

- `_INDICE`
  - PK em `NROIND`
- `COTACAO`
  - PK composta em `(NROIND, DATA)`
  - FK para `_INDICE(NROIND)`

### Campos confirmados

- `_INDICE.NROIND`
- `_INDICE.NOMIND`
- `_INDICE.SIGIND`
- `COTACAO.NROIND`
- `COTACAO.DATA`
- `COTACAO.VALOR`

### Outras dependências de banco

- `CCCIRURGIAO.NROIND`
- `CCPACIENTE.NROIND`
- `CTRLPROTETICO.NROIND`
- `ESTOQUE_MOV.NROIND`
- `TAB_MAT.NROIND`
- `TAB_PRC.NROIND`
- `TAB_PRT_ITEM.NROIND`
- `TRATAMENTO.ORTO_ID_INDICE`
- `TRATAMENTO.NROIND`

## 36. Dependências

### Matriz resumida

| Módulo | Artefato | Campo ou referência | Tipo de dependência | Leitura | Escrita | Cálculo | Risco de exclusão | Evidência | Nível |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Procedimentos | `TAB_PRC`, `TAB_PRT_ITEM` | `NROIND` | FK/uso lógico | sim | sim | sim | alto | `eds70.sql` | confirmado por artefato técnico |
| Materiais | `TAB_MAT` | `NROIND` | FK/uso lógico | sim | sim | sim | alto | `eds70.sql` | confirmado por artefato técnico |
| Tratamentos | `TRATAMENTO` | `NROIND`, `ORTO_ID_INDICE` | FK/uso lógico | sim | sim | sim | alto | `eds70.sql` | confirmado por artefato técnico |
| Protético | `CTRLPROTETICO` | `NROIND` | FK | sim | sim | sim | alto | `eds70.sql` | confirmado por artefato técnico |
| Conta corrente / honorários | `CCCIRURGIAO` / `CCPACIENTE` | `NROIND` | FK | sim | sim | sim | alto | `eds70.sql` | confirmado por artefato técnico |
| Orçamento | `OR006` | `novo índice` | regra de conversão | sim | sim | sim | alto | `Mensagens.txt` | confirmado por artefato técnico |

## 37. Help, textos, relatórios e logs

### Help

- `Y:\EDS70\Help\Manual_EDS70_Completo.pdf`
- `Y:\EDS70\Help\Manual_EDS70_CAP_01.pdf` a `CAP_13.pdf`

### Textos

- `Y:\EDS70\Textos\*.rtf`, `.doc`, `.txt`, `.mod`
- mensagens locais relevantes:
  - `IN001`
  - `CN007`
  - `OR006`
  - `GR008`
  - `GR009`
  - `CN025`
  - `CN005`

### Relatórios

- `Y:\EDS70\Reports\TISS_COB.fr3`
- `Y:\EDS70\Reports\TISS_GTO.fr3`
- `Y:\EDS70\Reports\TISS_SIT.fr3`

### Logs

- não foram localizados logs específicos do módulo nesta amostra.

### Confiabilidade

- código/estrutura ativa: alta;
- recurso da aplicação: média;
- help: média;
- relatório: média/baixa para esta frente;
- log: baixa nesta amostra;
- inferência: separada e marcada.

## 38. Evidências visuais

- não houve captura visual do desktop nesta etapa.
- o executável `Y:\EDS70\EDS70.exe` foi aberto com segurança e permaneceu em execução no ambiente.
- motivo da limitação: não havia ferramenta segura de inspeção/interação visual disponível nesta conversa para observar a janela ativa, o menu e os modais sem risco de gravação indevida.
- por isso, a validação visual comportamental ficou bloqueada e foi documentada como não confirmada visualmente.

## 39. Pontos confirmados

- `Y:\EDS70` está acessível.
- O banco legado possui `_INDICE` e `COTACAO`.
- Existe procedimento `sp_GetValorIndice`.
- Índices nativos incluem `Reais`, `UHO` e `USO`.
- O módulo de índices financeiros é citado em `Mensagens.txt` como funcionalidade própria.
- Há fortes dependências com `TAB_MAT`, `TAB_PRC`, `TAB_PRT_ITEM`, `TRATAMENTO`, `CTRLPROTETICO`, `CCCIRURGIAO` e `CCPACIENTE`.

## 40. Pontos parcialmente confirmados

- `UPO` como registro nativo específico no recorte lido.
- comportamento visual da janela.
- ordem de tabulação.
- atalhos.
- estado inicial de foco.
- comportamento visual de exclusão/migração.

## 41. Inferências

- `_INDICE` funciona como o cadastro mestre de índices do EasyDental.
- `COTACAO` é o histórico temporal dos valores.
- `sp_GetValorIndice` implementa a regra de valor atual por data de consulta.
- o valor `1.00` é fallback funcional quando não existe cotação válida.

## 42. Pontos não localizados

- navegação visual do menu no runtime;
- título exato da janela;
- tamanho/posição da janela;
- modalidade visual da janela;
- labels e controles exatos dos modais;
- precisão decimal exibida na UI;
- comportamento de datas futuras/retroativas no desktop;
- proteção visual explícita da última cotação;
- menu de contexto, tooltips e scrolls;
- documentação de migrar/excluir equivalente ao endpoint moderno.

## 43. Questões para confronto com o Brana Cloud

- o Brana Cloud mostra duas tabelas e botões claramente. O desktop tem a mesma estrutura visual ou apenas a mesma semântica funcional?
- o desktop realmente exibe `Cotações para reais` como título da grade inferior?
- existe confirmação visual de que `UPO` é um índice nativo ativo no desktop, ou só no banco/mensagens?
- o desktop permite editar o valor atual apenas por cotação, sem edição direta do índice?
- a exclusão no desktop faz migração automática semelhante ao endpoint moderno, ou bloqueia e exige outro fluxo?
- a regra de valor atual usa sempre a data do sistema/consulta, ou existe contexto de tela diferente?

## 44. Riscos

- confundir artefatos de outros módulos com o módulo de índices financeiros;
- usar nome de arquivo como prova funcional;
- extrapolar da estrutura SQL para comportamento visual;
- misturar regra do desktop com a do Brana Cloud;
- inferir o fluxo da janela sem runtime visual;
- tratar relatório ou help como comportamento atual sem confirmação adicional.

## 45. Conclusão

O EasyDental Desktop possui um núcleo técnico claro para índices financeiros:

- cadastro base `_INDICE`;
- histórico temporal `COTACAO`;
- cálculo de valor por data via `sp_GetValorIndice`;
- mensagens e regras que confirmam proteção de reservados, uso em outros módulos e criação guiada do módulo.

A estrutura técnica é suficientemente forte para sustentar a próxima comparação funcional, mas a parte visual da janela ainda não foi confirmada em runtime nesta etapa.

## 46. Próxima etapa recomendada

1. Se for autorizado, fazer a navegação visual do EasyDental Desktop para confirmar o layout e os sete botões.
2. Consolidar depois um comparativo final entre EasyDental e Brana Cloud.
3. Só então decidir o comportamento-alvo para o React.

## 47. Fechamento de referencia

Esta auditoria continua apenas como referencia historica para a frente de `Indices financeiros`.

Pontos consolidados:

- os nativos confirmados seguem como `255 / Reais`, `2 / UHO`, `3 / UPO` e `1 / USO`;
- o backend atual do Brana Cloud continua sendo a referencia operacional do contrato final;
- o desktop permanece como referencia comparativa, nao como substituto do contrato já homologado no runtime do React.
