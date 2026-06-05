# Contrato tecnico de entrada isolada da tela principal odontologica

## 1. Objetivo

Este documento define o contrato tecnico de entrada isolada da futura tela principal odontologica do Brana Cloud.

A origem atual desta entrada e o botao `Odontograma` dentro de `Ficha pessoal > Historico`.
Esta etapa e somente documental.
Nenhuma alteracao funcional foi feita.

## 2. Problema tecnico atual

A auditoria anterior mostrou que a trilha atual ainda esta acoplada ao fluxo da Ficha Pessoal.

Problemas observados:

- clique interceptado globalmente;
- acoplamento com o shell da Ficha Pessoal;
- acoplamento com a aba Historico;
- dependencia de `hideAllPanels`;
- dependencia de `closeWorkspacePanel`;
- dependencia de `fichaAplicarPaciente`;
- dependencia de `fichaLimparNovo`;
- corredor funcional compartilhado com o modal de propriedades da linha;
- risco real de quebrar Ficha Pessoal, Historico e navegacao geral.

Leitura tecnica:

- a entrada antiga nao e isolada;
- o painel odontologico nao nasce de um contrato proprio;
- o fluxo ainda depende de wrappers globais compartilhados;
- a migracao precisa começar pela fronteira de entrada, nao pelo layout inteiro.

## 3. Objetivo do novo contrato de entrada

O objetivo futuro e transformar a abertura do odontograma em uma entrada clara, pequena e controlada.

Diretrizes:

- o botao `Odontograma` deve continuar existindo onde o usuario ja acessa;
- o clique deve chamar uma entrada clara e isolada;
- a futura tela odontologica deve receber contexto minimo e controlado;
- nao deve depender de interceptacao global;
- nao deve misturar renderizacao da tela odontologica com logica da Ficha Pessoal;
- nao deve chamar backend ainda;
- nao deve alterar dados reais;
- nao deve aumentar `frontend/app.js`.

## 4. Contrato proposto para entrada futura

Assinatura futura sugerida, somente como contrato:

```js
abrirTelaPrincipalOdontologicaPorPaciente({
  pacienteId,
  pacienteCodigo,
  pacienteNome,
  origem,
  modo,
  container
})
```

### 4.1 Campos obrigatorios

- `origem`
- `modo`

### 4.2 Campos condicionais ou de contexto

- `pacienteId`: obrigatorio quando houver paciente ativo;
- `pacienteCodigo`: obrigatorio quando houver paciente ativo e codigo conhecido;
- `pacienteNome`: obrigatorio quando houver paciente ativo e nome conhecido;
- `container`: obrigatorio quando a tela precisar renderizar dentro de um host especifico;
- o contrato pode aceitar um objeto vazio apenas para abrir em estado neutro, se isso for explicitamente previsto na fase futura.

### 4.3 Campos opcionais

- `container` quando o host puder ser resolvido internamente;
- `pacienteCodigo` quando a fonte de contexto ainda nao tiver codigo;
- `pacienteNome` quando a fonte de contexto ainda nao tiver nome final;
- outros metadados podem ser adicionados depois, desde que o contrato continue pequeno.

### 4.4 Origem esperada

- `ficha-pessoal-historico`

### 4.5 Modo inicial permitido

- `visual-estatico`
- `leitura`

### 4.6 Comportamento quando nao houver paciente ativo

- abrir em estado neutro, se o contrato permitir;
- exibir mensagem ou placeholder de selecao;
- nao tentar carregar dados reais;
- nao executar chamada de backend;
- nao quebrar a tela de origem.

### 4.7 Comportamento quando paciente estiver incompleto

- validar o contexto recebido;
- aceitar apenas o que for suficiente para abrir a tela em leitura ou estado neutro;
- registrar observacao tecnica;
- nao improvisar preenchimento;
- nao consultar backend para completar automaticamente nesta etapa.

### 4.8 Comportamento quando o container nao existir

- nao quebrar o fluxo de origem;
- retornar falha controlada;
- opcionalmente abrir em fallback visual ou registrar erro interno;
- nao alterar a Ficha Pessoal;
- nao tentar criar DOM global por conta propria sem contrato.

### 4.9 Comportamento quando a tela ja estiver aberta

- reutilizar a instancia existente quando isso for seguro;
- atualizar contexto apenas se o contrato prever essa operacao;
- evitar duplicacao de tela;
- evitar abrir dois paines concorrentes;
- evitar reentrancia sem controle.

### 4.10 Comportamento de retorno/fechamento

- o contrato futuro deve prever fechamento seguro;
- o retorno para a Ficha Pessoal deve ser preservado;
- o fechamento nao deve depender de uma limpeza agressiva do shell global;
- o estado antigo nao deve ser descartado de forma destrutiva sem validacao.

## 5. Responsabilidades separadas

### A. Ficha Pessoal / aba Historico

- apenas disparar a intencao de abrir odontograma;
- passar contexto minimo do paciente;
- nao renderizar a tela odontologica;
- nao conhecer detalhes internos da tela odontologica.

### B. Modulo de entrada odontologica

- validar contexto;
- decidir estado sem paciente / com paciente;
- localizar ou receber container;
- chamar renderizacao isolada;
- manter fallback seguro.

### C. Modulo de layout odontologico

- montar interface visual;
- nao conhecer Ficha Pessoal;
- nao consultar backend;
- nao gravar dados.

### D. Estado / mock

- fornecer dados ficticios somente quando autorizado;
- nao misturar com paciente real.

## 6. Arquivos futuros planejados para esse contrato

### 6.1 `frontend/js/modules/tela-principal-odontologica.js`
- Responsabilidade: coordenar a tela principal odontologica futura.
- Status: novo planejado.
- Especifico de Odontologia: sim.
- Dependencias permitidas: contrato de entrada, layout, estado, paciente de contexto, shell isolado.
- Dependencias proibidas: backend direto, banco, escrita, `frontend/app.js` como orquestrador principal.
- Risco: alto.

### 6.2 `frontend/js/modules/tela-principal-odontologica-entrada.js`
- Responsabilidade: validar contexto e abrir a tela por contrato.
- Status: novo planejado.
- Especifico de Odontologia: sim.
- Dependencias permitidas: contrato de entrada, estado minimo, container recebido.
- Dependencias proibidas: interceptacao global, escrita, backend, logica de ficha pessoal.
- Risco: alto.

### 6.3 `frontend/js/modules/tela-principal-odontologica-layout.js`
- Responsabilidade: estruturar a composicao visual em regioes.
- Status: novo planejado.
- Especifico de Odontologia: sim.
- Dependencias permitidas: contrato funcional, shell, estados visuais.
- Dependencias proibidas: fetch, gravacao, regras clinicas, dados reais.
- Risco: medio.

### 6.4 `frontend/js/modules/tela-principal-odontologica-estado.js`
- Responsabilidade: controlar estados sem paciente, com paciente mockado e erro visual.
- Status: novo planejado.
- Especifico de Odontologia: sim, com uso core/comum.
- Dependencias permitidas: layout, simuladores locais, contrato de estado.
- Dependencias proibidas: persistencia, backend, banco, agenda real.
- Risco: medio.

### 6.5 `frontend/js/modules/tela-principal-odontologica-contratos.js`
- Responsabilidade: centralizar contratos de fronteira e regras de entrada.
- Status: novo planejado.
- Especifico de Odontologia: sim, com uso core/comum.
- Dependencias permitidas: documentos de contrato, estado e entrada.
- Dependencias proibidas: renderizacao, fetch, banco, logica de negocio real.
- Risco: medio.

## 7. Arquivos existentes que podem precisar de alteracao futura minima

### 7.1 `frontend/app.js`
- Motivo provavel: hoje ele abriga o botao, o shell global e os wrappers compartilhados.
- Tipo de alteracao permitida: no futuro, apenas adaptacao minima de entrada se nao houver alternativa segura.
- Tipo de alteracao proibida: reescrita, expansao do monolito, migracao de toda a logica odontologica para la.
- Risco: muito alto.
- Validacao necessaria: teste manual do fluxo Ficha Pessoal > Historico > Odontograma e verificacao de que nenhuma outra tela foi afetada.
- Protecao: este arquivo permanece protegido; qualquer mexida futura exige subetapa propria e justificativa explicita.

### 7.2 `frontend/index.html`
- Motivo provavel: inclui os scripts do fluxo atual e define a ordem de carregamento.
- Tipo de alteracao permitida: apenas ajuste minimo de inclusao, se necessario e justificado.
- Tipo de alteracao proibida: reorganizacao ampla do shell, remocao de includes legados sem substituicao testada.
- Risco: alto.
- Validacao necessaria: conferencia de ordem de carregamento e teste no navegador.

### 7.3 `frontend/js/modules/odontograma-v1.js`
- Motivo provavel: e o coordenador antigo que hoje intercepta o clique e controla o painel.
- Tipo de alteracao permitida: adaptacao pequena de delegacao ou compatibilidade.
- Tipo de alteracao proibida: reescrita total ou mistura com o novo contrato.
- Risco: muito alto.
- Validacao necessaria: testar abertura, fechamento e aplicacao/limpeza de paciente.

### 7.4 `frontend/js/modules/odontograma-v1-shell.js`
- Motivo provavel: concentra a moldura visual antiga.
- Tipo de alteracao permitida: ajustes de encaixe ou host, se o novo contrato exigir.
- Tipo de alteracao proibida: refatoracao ampla ou duplicacao da tela.
- Risco: alto.
- Validacao necessaria: testar layout sem paciente e com paciente.

### 7.5 `frontend/js/modules/odontograma-v1-paciente-search.js`
- Motivo provavel: e a porta de contexto de paciente do odontograma.
- Tipo de alteracao permitida: adaptacao para a nova entrada, se necessario.
- Tipo de alteracao proibida: acoplamento direto a escrita ou ao backend novo sem contrato.
- Risco: medio/alto.
- Validacao necessaria: testar busca, selecao e retorno de contexto.

### 7.6 `frontend/js/modules/odontograma-v1-history-grid.js`
- Motivo provavel: renderiza a grade historica do painel.
- Tipo de alteracao permitida: pequenos ajustes para encaixe visual.
- Tipo de alteracao proibida: reescrita de negocio ou dependencia da ficha pessoal.
- Risco: medio.
- Validacao necessaria: testar historico vazio e historico populado.

### 7.7 `frontend/js/modules/ficha-pessoal-aba-historico.js`
- Motivo provavel: e onde o botao esta contextualizado no fluxo atual.
- Tipo de alteracao permitida: apenas delegacao minima futura.
- Tipo de alteracao proibida: reorganizacao funcional da aba ou quebra da grade existente.
- Risco: alto.
- Validacao necessaria: testar selecao de linha, bloqueios e botao `Confirmar`.

### 7.8 `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- Motivo provavel: faz parte do mesmo corredor funcional e compartilha contexto de prestador.
- Tipo de alteracao permitida: nenhuma nesta etapa; futura apenas se a fronteira exigir.
- Tipo de alteracao proibida: mistura com a tela odontologica nova.
- Risco: alto.
- Validacao necessaria: testar modal, campos e persistencia da linha.

### 7.9 `frontend/js/modules/odontograma-v1-layout.js`
- Motivo provavel: base de composicao visual ja existente e candidata a reaproveitamento.
- Tipo de alteracao permitida: ajuste de encaixe, se o novo contrato precisar.
- Tipo de alteracao proibida: acoplamento com backend ou negocio da Ficha Pessoal.
- Risco: medio.
- Validacao necessaria: comparar layout sem paciente e com paciente.

## 8. Estrategia para substituir a interceptacao global

Estrategia futura proposta:

- manter o botao visual atual;
- criar um handler especifico e pequeno para a abertura isolada;
- remover a dependencia de interceptacao global somente depois que a entrada isolada estiver testada;
- preservar fallback antigo temporariamente, se necessario;
- validar antes e depois;
- remover lixo tecnico apenas em etapa posterior.

Principio:

- primeiro criar o caminho novo;
- depois apontar o botao para o caminho novo;
- por ultimo desligar a interceptacao global antiga.

## 9. Estrategia de preservacao do fluxo atual

Este contrato nao deve quebrar:

- abertura da Ficha Pessoal;
- aba Historico;
- modal de propriedades da linha;
- paciente ativo;
- retorno / navegacao;
- agenda;
- procedimentos;
- historico real;
- banco;
- permissoes.

Regra de preservacao:

- o fluxo atual continua funcionando enquanto a entrada isolada nao estiver totalmente testada;
- a trilha nova nao pode substituir a antiga sem confirmacao;
- nenhum dado real deve ser alterado nessa fase;
- nada deve depender de backend novo.

## 10. Plano de correcao por subetapas futuras

- D1-B atual: contrato de entrada isolada, sem codigo.
- D1-C: criar modulo de contrato / entrada isolada minimo, sem ligar ao botao.
- D1-D: adaptar botao `Odontograma` para chamar a entrada isolada, preservando fallback antigo.
- D1-E: criar esqueleto visual estatico isolado ou reaproveitar o planejado, sem backend.
- D1-F: validar fluxo `Ficha Pessoal > Historico > Odontograma`.
- D1-G: remover interceptacao global antiga somente se comprovadamente substituida.
- D1-H: remover lixo tecnico orfao, um item por vez, com validacao.

## 11. Critérios de aceite futuros

- botao `Odontograma` continua aparecendo;
- clique abre tela odontologica sem erro;
- paciente ativo continua correto;
- aba Historico continua funcionando;
- modal de propriedades continua funcionando;
- retorno / navegacao funciona;
- nenhuma chamada backend nova;
- nenhum dado real alterado;
- `app.js` nao cresce;
- modulos novos permanecem isolados;
- fallback antigo documentado, se mantido temporariamente.

## 12. Onde testar futuramente

Quando esta trilha for implementada, o teste deve ocorrer:

- abrir o Brana Cloud;
- abrir Ficha Pessoal;
- selecionar ou abrir um paciente;
- entrar na aba Historico;
- clicar em `Odontograma`;
- verificar se a tela odontologica abre;
- voltar para a Ficha Pessoal, se houver retorno;
- verificar se Historico continua funcional;
- abrir o modal de propriedades da linha, se aplicavel;
- conferir que agenda e demais telas nao foram afetadas;
- confirmar que nenhum dado real foi gravado.

## 13. Riscos

- risco de quebrar Ficha Pessoal;
- risco de quebrar Historico;
- risco de quebrar o modal de propriedades;
- risco de duplicar tela odontologica;
- risco de manter duas trilhas concorrentes;
- risco de remover interceptacao global antes da hora;
- risco de aumentar `app.js`;
- risco de misturar dados reais com mock;
- risco de backend / banco entrarem antes do contrato;
- risco de correcoes textuais / mojibake indevidas.

## 14. Proxima etapa recomendada

Recomendo a Subetapa D1-C: criacao do modulo de contrato / entrada isolada minimo, ainda sem ligar ao botao `Odontograma`.

Justificativa:

- o contrato de entrada ja define a fronteira tecnica;
- a proxima menor entrega segura e criar o modulo de entrada sem acoplar a UI antiga;
- isso permite testar a entrada isolada antes de tocar no botao e antes de desligar a interceptacao global;
- o risco de quebra fica menor porque a trilha nova ganha uma superficie propria antes da migracao do click.

## 15. Registro para roadmap

- criacao do contrato tecnico de entrada isolada do botao `Odontograma`;
- confirmacao de que nenhuma alteracao funcional foi feita;
- registro do risco da interceptacao global antiga;
- proxima etapa recomendada: Subetapa D1-C, modulo de contrato / entrada isolada minimo.
