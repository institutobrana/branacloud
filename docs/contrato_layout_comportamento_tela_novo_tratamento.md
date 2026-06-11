# Contrato de layout e comportamento - tela Novo tratamento

## 1. Objetivo do contrato

Definir, em nivel documental, o layout e o comportamento esperado da tela `Novo tratamento`, tomando como referencia visual a janela do EasyDental enviada pelo usuario.

Este documento nao implementa nada.
Este documento nao altera frontend, backend, banco, seeds, migrations ou regras reais de tratamento.

## 2. Origem visual da referencia

Referencia principal:

- janela do EasyDental com titulo `Novo tratamento`;
- acionamento pelo menu `Tratamento -> Novo tratamento`;
- capturas enviadas pelo usuario como base visual primaria.

Referencia complementar:

- contrato tecnico preliminar existente em `docs/contrato_tecnico_modulo_tratamento.md`;
- rotas e model atuais do modulo Tratamentos no Brana Cloude;
- docs ja existentes sobre tratamento e odontograma quando relevantes para contextualizacao, sem misturar escopo.

## 3. Acionamento pelo menu

A tela deve ser aberta a partir do menu:

- `Tratamento -> Novo tratamento`

Regras documentais de acionamento:

- a janela deve abrir a partir do comando de menu correto;
- a janela nao deve substituir a tela principal odontologica;
- a janela nao deve ocupar a tela inteira;
- a janela deve manter o menu superior, a toolbar e o workspace do sistema visiveis;
- o acionamento por menu e o ponto de entrada de futura implementacao modular.

## 4. Escopo da tela

O escopo desta etapa documental cobre:

- janela principal `Novo tratamento`;
- aba `Principal`;
- aba `Convenio` como pendencia controlada de inventario/comparacao futura;
- campos de leitura e edicao visiveis na referencia;
- comportamento minimo dos botoes `Ok` e `Cancela`;
- comportamento visual de modal pequena, estilo desktop/Windows.

## 5. Fora do escopo desta primeira implementacao

Esta etapa nao inclui:

- implementacao visual real;
- ligacao ao frontend produtivo;
- alteracao de `frontend/app.js`;
- criacao de modal real;
- alteracao de backend;
- alteracao de banco;
- criacao de migration;
- criacao de seed;
- refatoracao de modulos ja existentes;
- integracao com odontograma, orcamento, financeiro ou execucao clinica;
- tratamento de permissao ou salvamento real;
- tentativa visual no navegador.

## 6. Estrutura visual geral da janela

Estrutura esperada da janela:

- titulo da janela: `Novo tratamento`;
- estilo pequeno, classico, desktop/Windows;
- duas abas principais:
  - `Principal`
  - `Convenio`
- area de conteudo contida;
- botoes inferiores alinhados ao rodape;
- divisores horizontais entre blocos principais;
- comportamento de janela modal ou semi-modal, a ser confirmado futuramente;
- nao substituir o shell principal do sistema.

## 7. Aba Principal - layout detalhado

### 7.1 Primeira linha

- `Inicio:`
  - campo de data;
  - valor padrao: data atual;
  - formato visual: `dd/mm/aaaa`.
- `Finalizacao:`
  - campo de data;
  - valor padrao vazio.
- `Situacao:`
  - combo;
  - valor padrao: `Aberto`.

### 7.2 Segunda linha

- `Tabela principal:`
  - combo;
  - valor padrao visual: `PARTICULAR`.
- `Indice:`
  - combo;
  - valor padrao visual: `R$`.
- `Cirurgiao responsavel:`
  - combo;
  - valor padrao deve vir do prestador/usuario atual quando houver fonte segura;
  - quando nao houver fonte segura, manter fallback visual documentado.

### 7.3 Terceira linha

- `Unidade de atendimento:`
  - combo largo;
  - valor padrao deve vir da clinica/unidade atual quando houver fonte segura;
  - quando nao houver fonte segura, manter fallback visual documentado.

### 7.4 Area de observacoes

- label `Observacoes:`;
- campo de texto multilinha;
- aparencia classica estilo Windows/EasyDental;
- scrollbar vertical quando necessario.

### 7.5 Campos de auditoria visual

- `Inclusao:`
  - campo visual de data/hora;
  - fundo ciano/turquesa conforme referencia.
- `Alteracao:`
  - campo visual de data/hora;
  - fundo ciano/turquesa conforme referencia.

### 7.6 Secao Novo tratamento

- titulo de secao `Novo tratamento`;
- `Idade:`
  - campo visual pequeno;
  - fundo ciano/turquesa;
  - devera ser calculado futuramente pela data de nascimento do paciente;
  - se nao houver paciente selecionado, o comportamento fica pendente.
- `Arcada predominante:`
  - combo;
  - valor padrao visual: `Copiar do tratamento anterior`.
- checkbox:
  - `Copiar intervencoes a realizar do tratamento anterior`.

### 7.7 Rodape

- botoes:
  - `Ok`
  - `Cancela`
- os botoes devem ficar no rodape da janela, sem competir com o conteudo principal.

## 8. Aba Convenio - pendencia controlada

Esta aba deve ficar registrada como pendencia controlada de inventario/comparacao futura.

O que ja e seguro registrar agora:

- a referencia visual mostra a existencia da aba `Convenio`;
- a referencia visual mostra campos de convenio, tipo TISS, cirurgioes ligados a convenio, sinal clinico, alteracao de tecidos, guia, autorizacao e validade;
- o backend atual do Brana Cloude ja possui estrutura correlata para convenio, tipo TISS, guia, senha e datas de autorizacao.

O que ainda precisa de inventario fino antes de implementar:

- equivalencia visual exata de todos os campos;
- ordem e agrupamento definitivo dos campos;
- default visual de cada combo;
- semantica completa do campo monetario eventual de repasse;
- relacao final entre convenio, plano e autorizacao;
- regra de habilitacao/edicao por contexto de paciente e tratamento.

## 9. Campos, valores padrao e origem esperada dos dados

### 9.1 Origem esperada

- dados do paciente atual;
- dados da clinica/unidade atual;
- catalogo de usuarios/prestadores ativos;
- catalogo de tabelas e indices;
- catalogo de convenios e planos;
- tratamento anterior quando houver copia.

### 9.2 Campos da aba Principal

- `Inicio` -> data atual;
- `Finalizacao` -> vazio;
- `Situacao` -> `Aberto`;
- `Tabela principal` -> `PARTICULAR`;
- `Indice` -> `R$`;
- `Cirurgiao responsavel` -> usuario/prestador atual quando existir fonte segura;
- `Unidade de atendimento` -> unidade atual quando existir fonte segura;
- `Observacoes` -> vazio;
- `Inclusao` -> valor visual de auditoria;
- `Alteracao` -> valor visual de auditoria;
- `Idade` -> valor calculado futuramente;
- `Arcada predominante` -> `Copiar do tratamento anterior`;
- `Copiar intervencoes a realizar do tratamento anterior` -> desmarcado por padrao, salvo regra futura.

### 9.3 Campos da aba Convenio

- `Convenio` -> combo vinculado ao catalogo de convenio;
- `Plano` -> combo ou campo correlato, a confirmar;
- `Tipo de atendimento (TISS)` -> combo;
- `Cirurgiao contratado` -> combo;
- `Cirurgiao solicitante` -> combo;
- `Cirurgiao executante` -> combo;
- `Sinais clinicos doenca periodontal` -> combo;
- `Alteracao dos tecidos moles` -> combo;
- `N da guia de tratamento` -> campo de texto;
- `Data da autorizacao` -> campo de data;
- `Senha de autorizacao` -> campo de texto;
- `Validade da senha` -> campo de data.

## 10. Comportamento dos botoes

### 10.1 Ok

- em etapa futura, devera validar os campos necessarios;
- em etapa futura, devera criar ou salvar o tratamento;
- nesta etapa, o comportamento real nao sera implementado.

### 10.2 Cancela

- deve fechar a janela sem salvar;
- nao deve persistir alteracoes;
- nao deve disparar regra clinica ou financeira.

### 10.3 ESC

- pode fechar a janela se o sistema ja adotar esse padrao;
- se nao houver padrao definido, fica como pendencia documentada.

## 11. Regras de nao gravacao para a primeira etapa visual

Esta primeira etapa futura de implementacao visual deve respeitar:

- nenhuma gravacao real no banco;
- nenhuma criacao de tratamento real;
- nenhum update de paciente real;
- nenhum efeito colateral em odontograma, financeiro ou orcamento;
- apenas abertura, visualizacao e fechamento da janela.

## 12. Dependencias futuras

- paciente selecionado;
- fonte segura para cirurgiao responsavel;
- fonte segura para unidade de atendimento;
- catalogo de tabelas e indices;
- catalogo de convenios e planos;
- regra de idade;
- regra de copia do tratamento anterior;
- regra de autorizacao e senha;
- possivel integracao com odontograma e orcamento.

## 13. Riscos de implementacao

- divergencia entre o layout legado e a replica do Brana Cloude;
- ambiguidade de campos monetarios e de convenio;
- mistura indevida com odontograma ou financeiro;
- regressao visual ao tentar acomodar a tela dentro do monolito;
- dependencia escondida de estado de paciente ou clinica;
- confusao entre campo apenas visual e campo persistente.

## 14. Criterios minimos de aceite visual

- a janela abre com titulo `Novo tratamento`;
- as abas `Principal` e `Convenio` aparecem;
- a aba Principal exibe os campos na ordem esperada;
- os separadores horizontais aparecem;
- os campos de auditoria ficam com destaque visual ciano/turquesa;
- os botoes `Ok` e `Cancela` ficam no rodape;
- a janela nao ocupa a tela inteira;
- a janela nao quebra o workspace principal.

## 15. Criterios minimos de aceite funcional

- o menu `Tratamento -> Novo tratamento` aciona a janela;
- `Cancela` fecha sem salvar;
- `Ok` permanece sem gravacao nesta primeira etapa visual;
- a aba Convenio permanece controlada como pendencia documental;
- a tela nao altera outros modulos;
- a tela nao gera escrita em banco;
- a tela nao exige implementacao de odontograma para existir.

## 16. Estrategia futura de implementacao modular

Recomendacao futura:

- criar um modulo isolado para a janela;
- manter a logica fora de `frontend/app.js` sempre que possivel;
- separar visual, estado e contratos de dados;
- abrir a modal por ponto de entrada especifico do menu Tratamento;
- preservar o shell principal e os modulos ja existentes.

## 17. Arquivos candidatos para etapa futura

Arquivos candidatos, apenas como referencia de planejamento:

- `frontend/js/modules/tratamentos-novo.js`;
- `frontend/js/modules/tratamento-modal-layout.js`;
- `frontend/js/modules/tratamento-modal-state.js`;
- `frontend/js/modules/tratamento-modal-entrada.js`;
- possivel ajuste localizado em `frontend/app.js` apenas para ponte de chamada, se necessario.

## 18. Relacao com o contrato tecnico ja criado

Este documento complementa o contrato tecnico preliminar do modulo Tratamento em:

- `docs/contrato_tecnico_modulo_tratamento.md`

Relacao entre os dois:

- o contrato tecnico preliminar define o inventario de lacunas do modulo;
- este contrato define o layout e o comportamento da tela `Novo tratamento`;
- ambos permanecem documentais;
- nenhum deles autoriza implementacao imediata.

## 19. Proxima etapa recomendada

Proxima etapa recomendada:

- implementacao visual isolada do modal `Novo tratamento`, acionado por `Tratamento -> Novo tratamento`, sem alterar o comportamento clinico real nesta fase inicial.

