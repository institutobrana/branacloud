# Auditoria da implementacao antiga do Odontograma

## 1. Objetivo

Este documento registra a auditoria da implementacao antiga do odontograma no Brana Cloud, com foco no caminho atual de acoplamento entre `Ficha pessoal > Historico` e o botao `Odontograma`.

Esta e uma etapa somente documental.
Nao houve alteracao de codigo, backend, banco, assets, migracoes, seeds ou telas legadas.

## 2. Escopo auditado

O objetivo foi mapear:

- onde o botao `Odontograma` nasce;
- como ele abre a tela antiga do odontograma V1;
- quais funcoes globais sao interceptadas;
- como a aba `Historico` participa do fluxo;
- quais modulos ja ficaram acoplados na trilha antiga;
- quais riscos tecnicos a implementacao atual carrega.

## 3. Fluxo atual observado

### 3.1 Entrada visual

O botao do odontograma vive no shell da ficha pessoal, dentro de `frontend/app.js`.

Referencia observada:

- `frontend/app.js:4992`

Trecho principal:

- o botao tem `id="ficha-btn-odontograma"`;
- o texto visivel e `Odontograma`;
- o icone usado e o mesmo recurso local do shell atual;
- o botao fica junto do conjunto de comandos da ficha.

### 3.2 Carregamento dos modulos

O HTML principal carrega, na mesma pagina, os modulos da ficha e os modulos do odontograma V1.

Referencia observada:

- `frontend/index.html:3942-3957`

Sequencia relevante:

- `ficha-pessoal-aba-historico-propriedades-da-linha.js`;
- `ficha-pessoal-aba-historico.js`;
- `odontograma-v1-layout.js`;
- `odontograma-v1-shell.js`;
- `odontograma-v1-paciente-search.js`;
- `odontograma-v1-arcada-render.js`;
- `odontograma-v1-history-grid.js`;
- `odontograma-v1.js`.

### 3.3 Interceptacao do clique

O modulo antigo do odontograma nao parece depender de um fluxo local simples. Ele intercepta o clique globalmente e abre o painel por conta propria.

Referencia observada:

- `frontend/js/modules/odontograma-v1.js:683-695`

Comportamento:

- escuta `document.addEventListener("click", ..., true)`;
- procura o alvo `#ficha-btn-odontograma`;
- chama `openPanel()` ao detectar o botao;
- bloqueia a propagacao do evento.

### 3.4 Acoplamento com funcoes globais

O odontograma V1 tambem envolve wrappers de funcoes globais do shell.

Referencia observada:

- `frontend/js/modules/odontograma-v1.js:698-752`

Funcoes afetadas:

- `closeWorkspacePanel`;
- `hideAllPanels`;
- `fichaAplicarPaciente`;
- `fichaLimparNovo`.

Leitura funcional:

- ao abrir/fechar telas, o odontograma participa do controle global de painel;
- ao aplicar paciente, o modulo atualiza seu proprio estado interno;
- ao limpar uma ficha, o odontograma volta para estado vazio;
- isso cria dependencia de ordem de carregamento e de hooks globais compartilhados.

## 4. Papel da aba Historico

A aba `Historico` nao chama o odontograma diretamente, mas faz parte do mesmo corredor funcional da ficha pessoal.

Referencia observada:

- `frontend/js/modules/ficha-pessoal-aba-historico.js:736-742`
- `frontend/js/modules/ficha-pessoal-aba-historico.js:1045-1071`

Comportamentos importantes:

- existe `historicoAbrirPropriedadesLinhaSelecionada()`;
- o botao `confirmar` da barra da aba abre as propriedades da linha;
- a aba mantem bloqueios quando ha rascunho ativo;
- a tela usa um catalogo de prestadores para o campo `Cirurgiao`;
- a aba e responsavel por manter o fluxo da grade e o modal de propriedades da linha.

### 4.1 Modal de propriedades da linha

O modal da linha historica e um modulo proprio e separado, mas continua ligado a mesma trilha da ficha.

Referencia observada:

- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js:163-214`
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js:224-345`

Pontos relevantes:

- o modal contem `Data`, `Cirurgião responsavel`, `Região`, `Cor de fundo` e `Histórico`;
- o combo de cirurgiao usa catalogo de prestadores;
- o modal aplica de volta os valores para a linha da grade;
- os campos de auditoria `Data de insercao` e `Data de atualizacao` sao preservados;
- o fluxo continua focado na ficha pessoal, nao no odontograma em si.

## 5. Como a implementacao antiga do odontograma se comporta

### 5.1 Estrutura principal

O odontograma V1 se apresenta como um painel propria, mas depende de estado global compartilhado.

Referencia observada:

- `frontend/js/modules/odontograma-v1.js:782-782`
- `frontend/js/modules/odontograma-v1-shell.js`

Leitura funcional:

- existe um `window.BranaOdontogramaV1Module`;
- o painel e montado e controlado pelo proprio modulo;
- a shell contem arcada, historico, procedimentos, area lateral e contexto de paciente;
- a tela esta pronta para leitura do contexto, mas nao para uma modularizacao limpa.

### 5.2 Dependencia de paciente

O modulo tenta manter o paciente sincronizado ao vivo.

Referencia observada:

- `frontend/js/modules/odontograma-v1.js:188-189`
- `frontend/js/modules/odontograma-v1.js:722-752`
- `frontend/js/modules/odontograma-v1-paciente-search.js`

Leitura funcional:

- quando `fichaAplicarPaciente` roda, o odontograma atualiza seu estado;
- quando `fichaLimparNovo` roda, o odontograma limpa tudo;
- o campo de busca de paciente dentro do odontograma tambem conversa com o contexto da ficha;
- isso confirma que o painel nao e isolado: ele depende da ficha e reaproveita seu fluxo.

### 5.3 Renderizacao e estado

O painel antigo funciona como uma tela de leitura com estados basicos.

Leitura funcional consolidada:

- carrega paciente e tratamentos;
- busca status e resumo;
- desenha arcada;
- mostra historico;
- mostra area de procedimentos;
- abre vazio quando nao ha paciente;
- depende de refresh do proprio modulo.

## 6. Mapa de modulos e risco de acoplamento

### 6.1 `frontend/app.js`

- papel: shell global da aplicacao;
- risco: muito alto;
- observacao: abriga o botao `Odontograma`, a ficha, o controle global de painel e os hooks compartilhados;
- impacto se alterado sem cuidado: pode quebrar varios modulos fora do odontograma.

### 6.2 `frontend/js/modules/odontograma-v1.js`

- papel: coordenador do odontograma V1;
- risco: muito alto;
- observacao: faz interceptacao global de clique e wrappers de funcoes globais;
- impacto se alterado: pode afetar a navegacao geral da aplicacao.

### 6.3 `frontend/js/modules/odontograma-v1-shell.js`

- papel: shell visual do painel odontologico;
- risco: alto;
- observacao: concentra a estrutura da tela antiga e a geografia do layout;
- impacto se alterado: pode exigir refino visual e estrutural em cadeia.

### 6.4 `frontend/js/modules/odontograma-v1-paciente-search.js`

- papel: busca de paciente do odontograma;
- risco: alto;
- observacao: dialoga com o contexto da ficha pessoal e com o estado do odontograma;
- impacto se alterado: pode afetar a entrada de contexto do painel.

### 6.5 `frontend/js/modules/odontograma-v1-history-grid.js`

- papel: helper de grade historica;
- risco: medio/alto;
- observacao: e um auxiliar de renderizacao, mas faz parte da experiencia antiga;
- impacto se alterado: pode afetar a leitura do historico do painel.

### 6.6 `frontend/js/modules/ficha-pessoal-aba-historico.js`

- papel: aba Historico da ficha pessoal;
- risco: alto;
- observacao: controla grade, selecao, bloqueios de rascunho e abertura do modal de propriedades;
- impacto se alterado: pode mexer na ficha inteira.

### 6.7 `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`

- papel: modal de propriedades da linha;
- risco: alto;
- observacao: edita campos sensiveis da linha de historico e usa o catalogo de prestadores;
- impacto se alterado: pode alterar a forma como a ficha grava e reaplica a linha.

## 7. Conclusoes objetivas da auditoria

- o botao `Odontograma` atual e parte do shell da ficha pessoal, nao um ponto de entrada isolado;
- o odontograma V1 abre por interceptacao global e nao por uma integracao local simples;
- o modulo antigo depende de `hideAllPanels`, `closeWorkspacePanel`, `fichaAplicarPaciente` e `fichaLimparNovo`;
- a aba `Historico` participa da mesma trilha de contexto da ficha e compartilha o catalogo de prestadores;
- o modal de propriedades da linha mostra que a ficha ja tem sua propria estrutura de edicao e de auditoria, separada do odontograma, mas ainda no mesmo corredor funcional;
- a implementacao atual e funcional, porem altamente acoplada;
- a migracao futura precisa ser modular e progressiva, sem reescrever o shell global de uma vez.

## 8. Comparacao com o desenho tecnico estatico ja registrado

Este audit esta alinhado com o documento de layout estatico, mas aprofunda o caminho antigo real.

Documento base:

- `docs/easydental_tela_principal_odontologica_desenho_tecnico_layout_estatico.md`

Comparacao:

- o desenho tecnico previa uma nova tela odontologica propria;
- esta auditoria mostra que a tela antiga ainda esta presa a `Ficha pessoal`;
- o desenho tecnico separa layout, estado e contratos;
- a implementacao antiga mistura entrada, estado global, shell e hooks compartilhados;
- portanto, a futura correção deve seguir o desenho tecnico e nao a forma atual da V1.

## 9. Pendencias tecnicas registradas

- separar a entrada do odontograma da ficha pessoal em um contrato proprio;
- reduzir a dependencia de wrappers globais;
- impedir que o painel novo dependa de `hideAllPanels` como regra estrutural;
- evitar que a ficha pessoal continue sendo a porta unica do fluxo odontologico;
- evitar que a aba Historico fique como dependencia indireta do painel odontologico;
- registrar a fronteira entre leitura visual e escrita clinica antes de qualquer refatoracao;
- manter a regra de nao copiar assets do EasyDental;
- manter a regra de nao mexer em banco, backend ou migrations nesta trilha.

## 10. Trilhas futuras sugeridas

Se esta auditoria virar proxima etapa de trabalho, a sequencia minima segura e:

1. definir um contrato de entrada para o odontograma sem depender de clique global;
2. isolar o estado visual do painel antigo em modulo proprio de coordenacao;
3. separar o estado de paciente da ficha pessoal e do odontograma;
4. reduzir o uso de wrappers globais para um adaptador minimo;
5. manter a aba Historico fora do fluxo de abertura da tela odontologica;
6. validar a experiencia sem paciente e com paciente em ambiente local;
7. so depois pensar em persistencia ou integracao funcional nova.

## 11. Onde testar futuramente

Quando houver evolucao funcional nesta trilha, o teste deve acontecer:

- no frontend local do Brana Cloud;
- abrindo a ficha pessoal;
- clicando no botao `Odontograma`;
- testando a tela com paciente vazio;
- testando a tela com paciente ativo;
- testando o retorno para a ficha pessoal;
- validando que a aba Historico continua funcionando;
- validando que o modal de propriedades da linha continua independente.

## 12. Registro para roadmap

- auditoria da implementacao antiga do odontograma registrada;
- caminho de entrada atual documentado;
- acoplamentos globais documentados;
- dependencia da aba Historico documentada;
- risco tecnico da trilha antiga documentado;
- proximo passo recomendado: definir contrato de entrada mais isolado antes de qualquer mudanca funcional.
