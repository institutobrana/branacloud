# Contrato tecnico - fluxo Novo tratamento com paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Fluxo: `Tratamento -> Novo tratamento`

Natureza deste documento: contrato tecnico e funcional do gatilho que depende de paciente aberto/em uso.

Status: documental apenas.

## 2. Objetivo do contrato

Este contrato registra o comportamento esperado para o fluxo de abertura do modal `Novo tratamento` quando existe, ou nao existe, paciente aberto/em uso no sistema.

O objetivo nao e implementar nada ainda.

O objetivo e consolidar:

- a regra funcional informada pelo usuario;
- o estado atual do Brana Cloude;
- as lacunas tecnicas;
- o fluxo futuro seguro e modular;
- os criterios para uma futura implementacao sem improviso.

## 3. Origem da regra funcional

A regra funcional veio diretamente da solicitacao do usuario, com referencia ao comportamento equivalente do EasyDental.

Regra informada:

- se houver paciente aberto/em uso no odontograma, `Tratamento -> Novo tratamento` deve abrir o modal `Novo tratamento` para esse paciente;
- se nao houver paciente aberto/em uso, o sistema deve abrir o `Menu de pacientes` ja existente no Brana Cloude;
- apos a selecao do paciente no menu, esse paciente deve ficar aberto/em uso no odontograma;
- so depois disso o fluxo de `Novo tratamento` deve prosseguir;
- o campo `Idade` deve futuramente vir do paciente aberto/em uso;
- o sistema pode existir sem paciente aberto, mas varias funcoes clinicas exigem paciente em uso.

## 4. Regra equivalente ao EasyDental

No fluxo equivalente do legado:

- `Novo tratamento` depende de paciente clinico em uso;
- se o paciente ja esta aberto, a tela de tratamento abre direto;
- se nao ha paciente em uso, o usuario e redirecionado primeiro para a escolha do paciente;
- a escolha do paciente nao e apenas visual: ela define o contexto clinico ativo;
- o campo `Idade` nao deve ser um valor solto; ele deve refletir o paciente ativo.

## 5. Estado atual do Brana Cloude

O Brana Cloude ja possui parte do suporte de contexto de paciente, mas nao existe ainda uma regra unica, publica e segura para dizer: "este paciente esta em uso e pode abrir Novo tratamento".

Hoje ha sinais distribuidores de contexto, mas nao ha fechamento completo do contrato:

- `fichaPacienteAtualId` em `frontend/app.js` representa o paciente atual em varios fluxos da ficha;
- `fichaMenuPac` em `frontend/app.js` representa o modal/painel do `Menu de pacientes`;
- o modulo de busca do odontograma usa `currentPatient` em `frontend/js/modules/odontograma-v1-paciente-search.js`;
- o fluxo `Tratamento -> Novo tratamento` hoje abre o modal diretamente, sem verificar paciente em uso;
- o modal `Novo tratamento` existe e e visualmente funcional, mas ainda nao depende de um helper formal de paciente ativo para decidir sua abertura.

Conclusao objetiva:

- o Brana ja tem estados de paciente;
- o Brana ainda nao tem, para este fluxo, um helper consolidado e isolado que una "paciente aberto", "paciente em uso" e "liberacao de novo tratamento".

## 6. Como o modal Novo tratamento abre atualmente

No estado atual do codigo:

- a acao `tratamento-novo` esta mapeada no menu principal;
- ao acionar essa acao, `frontend/app.js` chama diretamente `window.BranaNovoTratamentoModal.open()` quando o modulo esta disponivel;
- nao existe, neste ponto, checagem previa obrigatoria de paciente ativo;
- nao existe redirecionamento automatico para o `Menu de pacientes` antes da abertura;
- o fechamento do modal segue comportamento visual local, sem persistencia.

Isso significa que o comportamento atual ainda nao atende a regra funcional desejada.

## 7. Como o Brana representa, ou nao representa, paciente aberto/em uso

### 7.1 Representacoes existentes

- `fichaPacienteAtualId` em `frontend/app.js` e o sinal mais claro de paciente atualmente selecionado no contexto geral da ficha;
- `fichaAnamneseAba.temPacienteValido()` usa esse estado como referencia de validade;
- `editorTextosTemPacienteSelecionado()` tambem depende de `fichaPacienteAtualId`;
- o odontograma usa `state.currentPatient` no modulo de busca de paciente;
- o `Menu de pacientes` usa `fichaMenuPacAbrir`, `fichaMenuPacFechar`, `fichaMenuPacPesquisar` e `fichaMenuPacConfirmar`.

### 7.2 O que ainda nao esta consolidado

- nao ha um helper unico e nomeado que declare "paciente em uso" para toda a aplicacao;
- nao ha prova, neste fluxo, de que o paciente selecionado no menu sempre vira o mesmo paciente ativo do odontograma;
- nao ha contrato formal dizendo que `Novo tratamento` deve ler um unico estado compartilhado antes de abrir;
- nao ha ainda integracao explicita entre o gatilho do menu de tratamento e o estado do odontograma.

## 8. Onde fica, ou parece ficar, o Menu de pacientes existente

O `Menu de pacientes` parece estar implementado no sistema compartilhado de modais de `frontend/app.js`.

Pontos auditados:

- existe o backdrop `ficha-menu-backdrop`;
- existe o titulo dinamico `Menu de pacientes`;
- existe o fluxo `fichaMenuPacAbrir(prefill, opts)`;
- existe o fechamento `fichaMenuPacFechar(reason)`;
- existe a confirmacao `fichaMenuPacConfirmar()`;
- existe pesquisa/listagem com filtros e retorno do item selecionado;
- o menu tambem e reutilizado em outros fluxos relacionados a paciente.

Conclusao:

- o menu ja existe;
- o contrato pendente e a amarracao dele com a decisao de abrir `Novo tratamento`.

## 9. Como o odontograma/tela principal odontologica participa do fluxo

O odontograma/tela principal odontologica e a regiao funcional onde o paciente em uso precisa estar ativo para que o tratamento tenha contexto clinico.

Hoje o codigo indica participacao do odontograma por:

- busca de paciente com `currentPatient`;
- manutencao do estado de paciente atual no ecossistema da ficha;
- dependencia indireta de paciente valido em outros fluxos clinicos;
- uso de helpers de contexto ligados a `fichaPacienteAtualId`.

Mas ainda falta o fechamento documental e tecnico de:

- qual estado unico define o paciente em uso;
- qual modulo e autoridade final para abrir esse paciente no odontograma;
- como esse estado deve ser consultado pelo gatilho `Tratamento -> Novo tratamento`.

## 10. Fluxo esperado quando ha paciente aberto

Fluxo futuro desejado:

1. o usuario aciona `Tratamento -> Novo tratamento`;
2. o sistema consulta um helper seguro de paciente em uso;
3. se houver paciente em uso, o modal `Novo tratamento` abre diretamente para esse contexto;
4. os campos calculados ou derivaveis, como `Idade`, devem refletir o paciente ativo;
5. o usuario segue para preencher a aba `Principal` ou `Convenio`;
6. a confirmacao futura por `Ok` deve acionar a persistencia real somente quando essa fase existir.

## 11. Fluxo esperado quando nao ha paciente aberto

Fluxo futuro desejado:

1. o usuario aciona `Tratamento -> Novo tratamento`;
2. o sistema consulta um helper seguro de paciente em uso;
3. se nao houver paciente em uso, o sistema abre o `Menu de pacientes`;
4. o usuario escolhe um paciente;
5. o paciente escolhido passa a ser aberto/em uso no odontograma;
6. somente depois disso o modal `Novo tratamento` pode prosseguir para aquele paciente.

## 12. Relacao com o campo Idade

O campo `Idade` nao deve ser tratado como valor arbitrario.

Estado atual:

- o modal visual existe;
- o campo foi deixado sem valor provisorio nesta trilha;
- nao ha, ainda, contrato de leitura do paciente ativo para preencher esse campo.

Fluxo futuro esperado:

- `Idade` deve ser calculada a partir do paciente em uso;
- a origem deve vir de cadastro/Ficha Pessoal, ou de um helper confiavel de paciente ativo;
- o campo deve permanecer somente leitura;
- se nao houver data de nascimento segura, o campo deve permanecer vazio e claramente derivado.

## 13. Relacao futura com o botao Ok

O botao `Ok` no modal visual atual ainda fecha o modal sem salvar.

No contrato futuro:

- `Ok` nao deve ignorar a regra de paciente em uso;
- `Ok` so deve confirmar um tratamento quando o fluxo de paciente ativo estiver fechado;
- o comportamento real de `Ok` deve ser definido em contrato proprio de persistencia;
- o `Ok` nao deve ser usado para resolver a falta de paciente em uso.

## 14. Relacao futura com persistencia real do tratamento

Persistencia real nao faz parte desta etapa.

Porem, o fluxo futuro deve considerar que:

- nenhum tratamento deve ser gravado sem paciente ativo;
- o paciente em uso deve ser a base da persistencia;
- o contrato de salvamento deve ser separado do contrato de abertura;
- o contrato de abertura deve primeiro resolver o contexto clinico.

## 15. Arquivos auditados

Arquivos e pontos auditados nesta etapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/novo-tratamento-modal.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `docs/contrato_tecnico_modulo_tratamento.md`
- `docs/contrato_layout_comportamento_tela_novo_tratamento.md`
- `docs/implementacao_visual_modal_novo_tratamento.md`
- `docs/validacao_visual_modal_novo_tratamento.md`
- `docs/contrato_funcional_campos_modal_novo_tratamento.md`
- `docs/correcao_funcional_leve_campos_modal_novo_tratamento.md`
- `docs/11_roadmap_desenvolvimento.md`

## 16. Lacunas encontradas

- falta um helper unico e formal de paciente em uso;
- falta ligar o gatilho `Tratamento -> Novo tratamento` a esse helper;
- falta definir a regra de fallback para quando nao ha paciente ativo;
- falta garantir que a selecao no `Menu de pacientes` abra o paciente no odontograma de forma unica e rastreavel;
- falta fechar a origem de `Idade` a partir do paciente ativo;
- falta contrato de persistencia real do tratamento;
- falta validacao manual do fluxo completo em runtime.

## 17. Riscos

- abrir `Novo tratamento` sem paciente em uso pode gerar inconsistencia clinica;
- usar estados paralelos de paciente sem helper unico pode causar divergencia entre telas;
- misturar abertura de paciente, abertura de modal e persistencia em um mesmo passo aumenta o risco de regressao;
- preencher `Idade` sem origem segura pode produzir dado enganoso;
- acoplar persistencia cedo demais pode tornar a trilha mais dificil de modularizar.

## 18. Fora do escopo

Esta etapa nao inclui:

- implementar qualquer helper novo;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules/novo-tratamento-modal.js`;
- alterar backend;
- alterar banco;
- criar migration;
- criar seed;
- mudar layout do modal;
- mudar o `Menu de pacientes`;
- mudar o odontograma;
- mudar a Ficha Pessoal;
- gravar tratamento real;
- corrigir o campo `Idade` agora;
- refatorar outras trilhas.

## 19. Criterios de aceite para futura implementacao

A futura implementacao so deve ser considerada segura quando houver:

- helper unico para paciente em uso;
- acionamento do menu de tratamento com gate por paciente ativo;
- fallback claro para o `Menu de pacientes`;
- selecao do paciente refletida no odontograma;
- leitura segura da origem de `Idade`;
- abertura do modal condicionada ao contexto clinico;
- teste manual do caminho com e sem paciente ativo;
- ausencia de regressao em outros fluxos de paciente.

## 20. Estrategia de implementacao modular futura

### Subetapa A

Criar ou identificar um helper seguro para obter paciente em uso, sem persistencia nova.

### Subetapa B

Alterar somente o acionamento `Tratamento -> Novo tratamento`:

- se paciente em uso existir, abre o modal;
- se nao existir, abre o `Menu de pacientes`.

### Subetapa C

Apos selecao no `Menu de pacientes`, garantir paciente aberto no odontograma e so entao permitir `Novo tratamento`.

### Subetapa D

Preencher `Idade` a partir do paciente em uso, se houver data de nascimento segura.

### Subetapa E

Somente depois, preparar o contrato de persistencia real do tratamento.

## 21. Conclusao

O Brana Cloude ja possui partes relevantes da base de paciente e do modal `Novo tratamento`.

O que falta para reproduzir o comportamento esperado nao e apenas um ajuste de interface, mas um contrato claro de contexto clinico:

- quem define o paciente em uso;
- quem pode abrir `Novo tratamento`;
- o que fazer quando nao ha paciente ativo;
- como a tela conversa com o odontograma;
- como `Idade` nasce desse contexto;
- e em que momento a persistencia real deve ser autorizada.

Este documento registra a lacuna e define a sequencia segura para a trilha futura.
