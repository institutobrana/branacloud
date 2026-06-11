# Contrato tecnico - modulo Tratamento

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Origem de referencia funcional: janela `Menu Tratamento -> Novo tratamento` do EasyDental.

Natureza deste documento: inventario de lacunas e contrato tecnico preliminar.

Status: documental apenas.

## 2. Objetivo

Este contrato tecnico registra, de forma formal e rastreavel, o que o Brana Cloude ja possui para o modulo Tratamento e o que ainda falta para reproduzir a tela do EasyDental com fidelidade funcional e visual.

Este documento nao autoriza implementacao.

Este documento serve como base para:

- analise de escopo;
- comparacao entre legado e Brana Cloude;
- priorizacao de subetapas futuras;
- definicao de dependencias;
- reducao de risco antes de qualquer codificacao.

## 3. Escopo

O escopo cobre a tela de novo tratamento e seus blocos principais:

- abertura pelo menu `Tratamento -> Novo tratamento`;
- aba `Principal`;
- aba `Convenio`;
- campos de leitura, edicao e selecao;
- botoes de confirmacao e cancelamento;
- integracao com paciente, tabela, indice, prestador, unidade e convenio;
- copia de tratamento anterior;
- auditoria basica de criacao e atualizacao.

## 4. Fonte da verdade

Para o Brana Cloude:

- o codigo atual e a fonte da verdade;
- a documentacao oficial fica em `docs/`;
- o que estiver em historico deve ser usado com cautela e sempre conferido com o codigo.

Para este contrato:

- a analise estatica do frontend e do backend do Brana Cloude foi usada como base;
- a engenharia reversa do EasyDental foi usada apenas como referencia de comportamento legado;
- nenhum codigo foi alterado para produzir este documento.

## 5. Estado atual do Brana Cloude

### 5.1 Ja existente

- menu `Tratamento` no frontend;
- acao `tratamento-novo` no frontend;
- backend com rota dedicada para tratamentos;
- model persistente para tratamento;
- busca/listagem de tratamentos por paciente;
- endpoint para carregar combos do novo tratamento;
- endpoint para salvar novo tratamento;
- campos principais do tratamento ja modelados no banco e no backend;
- regras basicas de autenticacao e isolamento por clinica;
- uso de paciente como contexto principal;
- suporte a convenio e tipo TISS;
- suporte a copia de tratamento anterior;
- suporte a auditoria de criacao e atualizacao.

### 5.2 Ainda nao existente como replica fiel

- tela visual igual a do EasyDental;
- layout visual completo das abas;
- modal ou janela com mesmo comportamento visual do legado;
- fluxos finais de abrir, preencher, salvar e cancelar com aparencia igual;
- fechamento de lacunas de regra de negocio ainda ambigua;
- fechamento da semantica exata de alguns campos monetarios e de repasse;
- validacao manual em tempo de execucao da equivalencia visual.

## 6. Requisitos funcionais do legado mapeados

### 6.1 Aba Principal

A aba Principal contem os seguintes blocos:

- `Data Início`;
- `Data Finalização`;
- `Situação`;
- `Tabela principal`;
- `Índice`;
- `Cirurgião responsável`;
- `Unidade de atendimento`;
- `Observações`;
- `Inclusão`;
- `Alteração`;
- bloco `Novo tratamento`;
- `Idade`;
- `Arcada predominante`;
- checkbox de copia de intervencoes do tratamento anterior.

### 6.2 Aba Convenio

A aba Convenio contem os seguintes blocos:

- `Convênio`;
- `Plano`;
- `Nº da guia de tratamento`;
- `Senha de autorização`;
- `Data prevista de pagamento`;
- `Total de repasse previsto`;
- outros campos de apoio vinculados a autorizacao, tipo de atendimento e prestadores, conforme o fluxo legado.

## 7. Inventario de lacunas

### 7.1 Lacunas de interface

- falta reproduzir a janela completa com a mesma estrutura visual do EasyDental;
- falta reproduzir as abas com a mesma disposicao e hierarquia visual;
- falta reproduzir os separadores, linhas horizontais e margens do legado;
- falta reproduzir os estados visuais dos campos de leitura;
- falta reproduzir os botoes com mesma presenca visual e semantica;
- falta reproduzir a densidade visual e o comportamento de foco do formulário original.

### 7.2 Lacunas de comportamento

- falta definir o fluxo exato de abertura da tela quando o paciente nao esta carregado;
- falta definir o comportamento exato da tela ao abrir com paciente ja selecionado;
- falta fechar o comportamento da copia do tratamento anterior;
- falta explicitar o que exatamente o checkbox de copia herda;
- falta explicitar quando a situacao pode mudar e quais estados sao aceitos;
- falta explicitar em que momento `Data Finalização` pode ser preenchida;
- falta explicitar se `Tabela principal` redefine `Indice` automaticamente;
- falta explicitar a relacao real entre convenio, plano e valores previstos.

### 7.3 Lacunas de dados

- falta fechar o mapeamento visual de alguns campos monetarios;
- falta confirmar a fonte final de alguns combos em tempo de execucao;
- falta listar todos os valores possiveis de situacao;
- falta listar todos os valores possiveis de arcada predominante;
- falta confirmar o comportamento de valores default por paciente e por clinica;
- falta validar se campos de convenio sao gravados como id, nome ou ambos em todos os fluxos.

### 7.4 Lacunas de integracao

- falta integrar a tela com o frontend real do Brana Cloude;
- falta integrar a tela com o estado de paciente ativo;
- falta integrar a tela com o resumo de tratamentos anteriores;
- falta integrar a tela com o fluxo de salvamento visual;
- falta integrar a tela com o cancelamento sem persistencia;
- falta integrar a tela com dependencias de odontograma e/ou orçamento, se aplicavel;
- falta confirmar se a janela sera modal, painel lateral ou outra estrutura na UI do Brana Cloude.

### 7.5 Lacunas de documentacao

- falta um contrato tecnico com nome explicito de modulo tratamento;
- falta uma matriz formal de campos x origem x persistencia;
- falta um mapa formal de dependencias por campo;
- falta um checklist de aceite visual e funcional;
- falta separar o que veio do legado do que e inferencia do Brana Cloude;
- falta consolidar o que ja esta pronto e o que continua como pendencia.

## 8. Mapeamento tecnico preliminar

### 8.1 Campos ja suportados no Brana Cloude

- `Data Início` -> tratamento persistido como data de inicio;
- `Data Finalização` -> tratamento persistido como data de finalizacao;
- `Situação` -> situacao do tratamento;
- `Tabela principal` -> codigo de tabela do tratamento;
- `Índice` -> indice do tratamento;
- `Cirurgião responsável` -> usuario responsavel vinculado ao tratamento;
- `Unidade de atendimento` -> unidade/descricao de atendimento;
- `Observações` -> texto livre do tratamento;
- `Inclusão` -> auditoria de criacao;
- `Alteração` -> auditoria de atualizacao;
- `Novo tratamento` -> contexto de criacao;
- `Idade` -> dado calculado a partir do paciente;
- `Arcada predominante` -> campo de classificacao da arcada;
- `Copiar intervenção a realizar do tratamento anterior` -> flag de copia;
- `Convênio` -> convenio do tratamento;
- `Plano` -> plano associado ao contexto do paciente/convenio;
- `Nº da guia de tratamento` -> numero da guia;
- `Senha de autorização` -> senha do tratamento;
- `Data prevista de pagamento` -> data prevista do fluxo do convenio;
- `Total de repasse previsto` -> valor previsto ligado ao fluxo financeiro/convênio.

### 8.2 Pontos que exigem confirmacao fina

- se `Total de repasse previsto` corresponde a um unico campo ou a um calculo derivado;
- se `Plano` e apenas exibicao ou tambem filtro e persistencia;
- se `Unidade de atendimento` deve ser texto livre, combo ou referencia direta;
- se `Arcada predominante` altera regras posteriores do tratamento;
- se `Copiar intervenções` deve importar apenas estado visual ou tambem itens clinicos;
- se `Inclusão` e `Alteração` sao sempre somente leitura;
- se o tratamento pode existir sem convenio em todos os fluxos;
- se a gravação inicial ja deve criar historico ou apenas o registro base.

## 9. Dependencias confirmadas

- autenticacao do usuario;
- `clinica_id` da sessao;
- paciente ativo;
- tabela de procedimentos/tabelas principais;
- indice odontologico;
- usuarios/prestadores ativos;
- unidades de atendimento;
- convenios odontologicos;
- tipos TISS;
- historico de tratamentos anteriores;
- auditoria basica de criacao e atualizacao.

## 10. Dependencias provaveis

- fluxo de odontograma;
- fluxo de orçamento;
- fluxo de autorizacao de convenio;
- fluxo de impressao do tratamento;
- fluxo de finalizacao;
- eventual relacionamento com procedimento/intervencao;
- regras de permissao por modulo.

## 11. Pendencias criticas

- nao existe replica visual fiel da tela no Brana Cloude;
- nao existe contrato tecnico especifico com o nome solicitado ate este momento;
- nao existe validacao manual da equivalencia com o EasyDental em ambiente real;
- nao existe fechamento definitivo de todos os campos monetarios e derivacoes;
- nao existe especificacao final para os estados vazios e para a abertura sem paciente;
- nao existe criterio de aceite visual para declarar a replica concluida.

## 12. Riscos remanescentes

- divergencia entre comportamento do legado e do Brana Cloude;
- regressao visual caso a tela seja implementada sem contrato de layout;
- ambiguidades em campos derivados;
- dependencias escondidas com outras rotas do modulo odontologico;
- mistura de exibicao com persistencia;
- risco de introduzir comportamento incompleto se a tela for feita sem fechar o mapa de lacunas.

## 13. Critérios minimos para fechar o contrato

Para considerar este contrato suficientemente fechado antes da implementacao, o modulo deve ter:

- mapa final de campos;
- mapa final de dependencias;
- mapa final de origem de dados;
- regra clara de abertura da tela;
- regra clara de salvamento;
- regra clara de cancelamento;
- regra clara de copia de tratamento anterior;
- criterio claro para o campo monetario previsto;
- criterio claro para os campos de leitura;
- criterio claro para os combos principais;
- criterio claro de comportamento sem paciente.

## 14. Proposta de proxima subetapa

Antes de implementar, recomenda-se produzir um contrato complementar de layout e comportamento com os seguintes blocos:

- layout da aba Principal;
- layout da aba Convenio;
- matriz de campos por origem;
- matriz de eventos por campo;
- estados da janela;
- validacao manual comparativa;
- checklist final de aceite.

## 15. Conclusao

O Brana Cloude ja possui a base tecnica do modulo Tratamento.

O que falta para reproduzir a tela do EasyDental nao e apenas codigo de interface, mas tambem o fechamento documental de:

- layout;
- comportamento;
- dependencias;
- semantica de alguns campos;
- criterios de aceite.

Este documento registra o inventario de lacunas e deve ser usado como contrato tecnico preliminar para as proximas decisoes.
