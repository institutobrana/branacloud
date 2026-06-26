# Analise inicial - modulo Tratamento

## 1. Objetivo da frente

O objetivo desta frente e reproduzir no Brana Cloude o modulo Tratamento do EasyDental, comecando por documentacao e contrato funcional antes de qualquer implementacao.

Esta etapa e somente documental.

Nao autoriza mudancas em backend, frontend, banco, migrations, seeds ou regras operacionais reais.

## 2. Escopo observado no video

Base observada nesta etapa:

- tela principal do paciente na aba Tratamento;
- grade/lista de procedimentos do tratamento;
- menu de acoes do tratamento;
- modal Novo tratamento;
- abas Dados principais e Dados de convenio;
- pesquisa de procedimento em Particular;
- modal Altera orcamento;
- modal Detalhes do tratamento;
- modal de execucao/finalizacao de procedimento/fase.

## 3. Tela principal da aba Tratamento

### 3.1 Onde a aba aparece

A aba Tratamento aparece dentro da tela odontologica do paciente, como area operacional ligada ao paciente em uso.

### 3.2 Relacao com o paciente em uso

A tela depende do paciente ativo na sessao.

Quando nao ha paciente em uso, o comportamento completo precisa de validacao adicional.

### 3.3 Relacao com a tela odontologica

A aba Tratamento faz parte do contexto odontologico e nao deve ser tratada como modulo isolado sem considerar o shell principal da tela do paciente.

### 3.4 O que aparece quando ha tratamento

Quando existe tratamento, a area principal exibe uma grade/lista com os procedimentos do tratamento e o menu de acoes associado ao contexto do tratamento.

### 3.5 O que aparece quando nao ha tratamento

Nao foi possivel confirmar de forma segura, a partir do material atual, todos os estados sem tratamento.

Pendente de validacao.

### 3.6 Componentes visiveis da grade/lista

Campos/colunas provaveis observados ou inferidos a confirmar:

- ordem ou linha;
- icone ou representacao visual;
- nome do procedimento;
- status textual;
- regiao, dente ou face;
- valor;
- acao de edicao;
- checkbox ou indicador lateral.

Qualquer coluna nao confirmada permanece como pendente de validacao.

## 4. Menu de acoes do tratamento

Opcoes observadas:

- Novo tratamento;
- Alterar tratamento;
- Alterar orcamento;
- Detalhes do tratamento;
- Finalizar tratamento;
- Reabrir tratamento;
- Interromper tratamento;
- Excluir tratamento.

### 4.1 Novo tratamento

- finalidade aparente: criar um novo tratamento para o paciente em uso;
- abre modal: sim;
- altera status: nao confirmado ainda;
- depende de tratamento existente: nao para abrir, mas pode depender de paciente em uso;
- depende de procedimento existente: nao para abrir, mas deve alimentar a grade depois;
- etapa de implementacao: frente futura apos validacao documental inicial;
- duvidas pendentes: combos, defaults, obrigatoriedade e regras de salvamento.

### 4.2 Alterar tratamento

- finalidade aparente: editar dados do tratamento atual;
- abre modal: provavelmente sim, mas precisa confirmacao;
- altera status: nao confirmado;
- depende de tratamento existente: sim;
- depende de procedimento existente: talvez, dependendo da edicao;
- etapa de implementacao: futura;
- duvidas pendentes: quais campos podem ser editados e quais regras bloqueiam a edicao.

### 4.3 Alterar orcamento

- finalidade aparente: editar valores e parcelas do tratamento;
- abre modal: sim;
- altera status: pode alterar estado financeiro e de aprovacao;
- depende de tratamento existente: sim;
- depende de procedimento existente: nao confirmado;
- etapa de implementacao: futura, separada;
- duvidas pendentes: regras financeiras, aprovacao, parcelas e integracoes.

### 4.4 Detalhes do tratamento

- finalidade aparente: consultar ou editar informacoes detalhadas do tratamento;
- abre modal: sim;
- altera status: nao confirmado;
- depende de tratamento existente: sim;
- depende de procedimento existente: nao confirmado;
- etapa de implementacao: futura;
- duvidas pendentes: quais campos sao apenas leitura e quais sao editaveis.

### 4.5 Finalizar tratamento

- finalidade aparente: encerrar o tratamento;
- abre modal: possivelmente sim;
- altera status: sim, esperado;
- depende de tratamento existente: sim;
- depende de procedimento existente: pode depender dos procedimentos abertos;
- etapa de implementacao: futura;
- duvidas pendentes: criterios de finalizacao e efeitos sobre financeiro e historico.

### 4.6 Reabrir tratamento

- finalidade aparente: reativar um tratamento encerrado;
- abre modal: nao confirmado;
- altera status: sim, esperado;
- depende de tratamento existente: sim, e provavelmente finalizado;
- depende de procedimento existente: nao confirmado;
- etapa de implementacao: futura;
- duvidas pendentes: quais status podem ser reabertos e quais validacoes se aplicam.

### 4.7 Interromper tratamento

- finalidade aparente: suspender temporariamente o tratamento;
- abre modal: nao confirmado;
- altera status: sim, esperado;
- depende de tratamento existente: sim;
- depende de procedimento existente: pode depender do estado dos procedimentos;
- etapa de implementacao: futura;
- duvidas pendentes: diferenca exata entre interromper, finalizar e reabrir.

### 4.8 Excluir tratamento

- finalidade aparente: remover o tratamento;
- abre modal: nao confirmado;
- altera status: nao confirmado;
- depende de tratamento existente: sim;
- depende de procedimento existente: sim, se houver dependencia de itens vinculados;
- etapa de implementacao: futura e de maior risco;
- duvidas pendentes: se a exclusao e fisica, logica ou bloqueada por integridade.

## 5. Modal Novo tratamento

### 5.1 Layout e comportamento

O modal Novo tratamento e um formulario classico em janela pequena, com abas, campos de dados principais e dados de convenio, e botoes de gravacao/cancelamento.

### 5.2 Abas observadas

- Dados principais;
- Dados de convenio.

### 5.3 Campos observados na aba Dados principais

- Data de abertura;
- Prestador responsavel;
- Unidade de atendimento;
- Paciente;
- Beneficio;
- Tabela ou moeda;
- Tipo de faturamento;
- Tipo de atendimento;
- Observacoes;
- Idade do paciente;
- Arcada predominante;
- checkbox `Copiar procedimentos nao realizados do ultimo tratamento`.

### 5.4 Botoes observados

- Gravar tratamento;
- Cancelar.

### 5.5 Contrato por campo

#### Data de abertura

- tipo: data;
- origem provavel: data atual do sistema;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado no video atual;
- comportamento esperado: abrir com valor coerente ao contexto do novo tratamento;
- pendencias: confirmar formato, calendario e regra de preenchimento.

#### Prestador responsavel

- tipo: combo;
- origem provavel: prestadores ativos da clinica e/ou prestador vinculado ao usuario;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: refletir a fonte real do usuario ou da clinica;
- pendencias: confirmar lista completa, default e dependencia de permissao.

#### Unidade de atendimento

- tipo: combo;
- origem provavel: unidades ativas da clinica;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: usar unidade ativa coerente com a sessao;
- pendencias: confirmar se respeita unidade do usuario ou da clinica.

#### Paciente

- tipo: campo de referencia/leitura;
- origem provavel: paciente em uso;
- obrigatorio: sim, por dependencia do fluxo;
- valor padrao observado: paciente corrente;
- comportamento esperado: nao permitir tratamento sem contexto de paciente;
- pendencias: confirmar bloqueio quando nao ha paciente em uso.

#### Beneficio

- tipo: combo;
- origem provavel: convenios/beneficios do paciente;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: trocar regras e possivelmente tabelas/dados de convenio;
- pendencias: confirmar dependencia do paciente, convenio e plano.

#### Tabela ou moeda

- tipo: combo;
- origem provavel: catalogo de tabelas vinculado a clinica e/ou convenio;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: influenciar a pesquisa de procedimentos;
- pendencias: confirmar se o video mostra troca de lista por tabela selecionada.

#### Tipo de faturamento

- tipo: combo;
- origem provavel: regra de faturamento do tratamento ou convenio;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: direcionar regras financeiras;
- pendencias: confirmar lista completa e impacto no orcamento.

#### Tipo de atendimento

- tipo: combo;
- origem provavel: catalogo de tipos de atendimento;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado;
- comportamento esperado: classificar o atendimento/guia;
- pendencias: confirmar lista completa e relacao com convenio.

#### Observacoes

- tipo: texto multilinha;
- origem provavel: entrada livre do usuario;
- obrigatorio: nao confirmado;
- valor padrao observado: vazio, provavelmente;
- comportamento esperado: aceitar texto livre;
- pendencias: confirmar limites de tamanho e se grava automaticamente.

#### Idade do paciente

- tipo: campo somente leitura;
- origem provavel: calculo a partir da data de nascimento do paciente;
- obrigatorio: nao se aplica como entrada;
- valor padrao observado: nao confirmado;
- comportamento esperado: calculado, nao digitado;
- pendencias: confirmar formato e atualizacao em tempo real.

#### Arcada predominante

- tipo: combo;
- origem provavel: regra de tratamento anterior ou classificacao do paciente;
- obrigatorio: pendente de validacao;
- valor padrao observado: nao confirmado no video analisado;
- comportamento esperado: refletir opcoes de arcada;
- pendencias: ver lista completa de opcoes.

#### Copiar procedimentos nao realizados do ultimo tratamento

- tipo: checkbox;
- origem provavel: regra de copia do tratamento anterior;
- obrigatorio: nao;
- valor padrao observado: nao confirmado;
- comportamento esperado: copiar procedimentos pendentes do ultimo tratamento;
- pendencias: confirmar efeito exato da copia.

### 5.6 Combo Arcada predominante

Opcoes observadas:

- Copiar do tratamento anterior;
- Decidua;
- Mista;
- Permanente.

Outras opcoes nao puderam ser confirmadas.

Pendente de validacao.

## 6. Aba Dados de convenio

### 6.1 Campos observados

- Beneficiario;
- Prestador credenciado;
- Prestador solicitante;
- Prestador executante;
- Data da autorizacao;
- N da guia;
- Senha ou validade;
- Sinais de doenca periodontal;
- Alteracao dos tecidos moles.

### 6.2 Contrato por campo

#### Beneficiario

- tipo: combo ou referencia;
- origem provavel: convenio do paciente;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar se e leitura ou edicao.

#### Prestador credenciado

- tipo: combo;
- origem provavel: catalogo de prestadores credenciados;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar relacao com credenciamento.

#### Prestador solicitante

- tipo: combo;
- origem provavel: catalogo de prestadores;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar regra de preenchimento e visibilidade.

#### Prestador executante

- tipo: combo;
- origem provavel: catalogo de prestadores;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar regra de preenchimento e visibilidade.

#### Data da autorizacao

- tipo: data;
- origem provavel: data informada na guia;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar formato e validacao.

#### N da guia

- tipo: texto;
- origem provavel: numero da guia de autorizacao;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar mascara ou tamanho.

#### Senha ou validade

- tipo: texto e/ou data, conforme subcampo;
- origem provavel: dados da autorizacao;
- depende de convenio/beneficio: sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar se sao dois campos separados ou um grupo.

#### Sinais de doenca periodontal

- tipo: combo ou marcador;
- origem provavel: avaliacao clinica;
- depende de convenio/beneficio: possivelmente sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar valores e impacto clinico.

#### Alteracao dos tecidos moles

- tipo: combo ou marcador;
- origem provavel: avaliacao clinica;
- depende de convenio/beneficio: possivelmente sim;
- deve ficar vazio no Particular: pendente de validacao;
- obrigatorio: pendente;
- pendencias: confirmar valores e impacto clinico.

## 7. Pesquisa de procedimento

### 7.1 Janela observada

Titulo aproximado:

- `Pesquisar procedimento em Particular`

### 7.2 Elementos

- campo de pesquisa por nome, codigo ou especialidade;
- tabela de resultados;
- botao OK;
- botao Cancela.

### 7.3 Colunas observadas

- Nome do procedimento;
- Codigo;
- Especialidade.

### 7.4 Exemplos vistos

- Alveoloplastia;
- Apicectomia;
- Biopsia de boca;
- Biopsia de glandula salivar;
- Biopsia de labio;
- Bridotomia.

### 7.5 Regra importante

A lista deve vir da tabela ou moeda selecionada, e nao de uma lista fixa no frontend.

## 8. Modal Altera orcamento

Titulo observado:

- `Altera orcamento | 000009 (Pendente)`

### 8.1 Abas

- Principal;
- Financeiro.

### 8.2 Campos e elementos observados

- Tratamento;
- Valor total;
- `% desconto`;
- Valor corrigido;
- Numero de parcelas;
- Primeiro vencimento;
- Total ja pago;
- Saldo a pagar;
- Diferenca;
- grade ou lista de parcelas.

### 8.3 Botoes observados

- Gravar e sair;
- Gravar e enviar;
- Aprovar;
- Desaprovar;
- Checkout;
- Serasa;
- Cancelar.

### 8.4 Contrato de fase futura

Este fluxo deve ser tratado como etapa futura separada, pois envolve regras financeiras, aprovacao, parcelas e integracao com pagamento.

## 9. Modal Finaliza fase/procedimento

### 9.1 Campos observados

- Procedimento;
- Execucao:
  - Finalizar procedimento;
  - Executar fase do procedimento;
- Fase executada;
- Data;
- Executante;
- Historico;
- Duracao da fase;
- Duracao total;
- Tempo de execucao;
- Check-in;
- Atendimento;
- Check-out;
- Solicitar assinatura eletronica.

### 9.2 Botoes

- Confirmar execucao;
- Cancelar.

### 9.3 Possiveis efeitos

- muda status do procedimento;
- cria historico;
- registra executante e data;
- pode impactar timeline;
- pode impactar financeiro;
- pendente de validacao.

## 10. Modal Detalhes do tratamento

### 10.1 Abas observadas

- Dados principais;
- Dados de convenio;
- Dados complementares.

### 10.2 Campos observados na aba convenio

- Operadora;
- Beneficiario;
- Prestador credenciado;
- Prestador solicitante;
- Prestador executante;
- Data de autorizacao;
- N da guia;
- Senha de autorizacao;
- Validade da senha;
- Status da guia;
- Sinais de doenca periodontal;
- Alteracao dos tecidos moles.

### 10.3 Botoes

- Alterar;
- Fechar.

## 11. Dependencias de dados provaveis

Mapeamento inicial de origem dos dados:

- paciente em uso;
- prestadores ativos;
- unidades de atendimento;
- beneficios ou convenios;
- tabelas de procedimentos;
- procedimentos da tabela selecionada;
- tratamentos anteriores do paciente;
- orcamento e financeiro;
- status do tratamento;
- status dos procedimentos;
- historico ou timeline.

Nao implementar nada nesta etapa; apenas mapear.

## 12. Proposta de fases futuras de implementacao

- Fase T1 - contrato documental inicial do modulo Tratamento;
- Fase T2 - modal Novo tratamento visual, sem persistencia definitiva;
- Fase T3 - combos reais e integracao com paciente em uso;
- Fase T4 - persistencia backend de tratamento;
- Fase T5 - listagem de tratamentos e procedimentos na aba Tratamento;
- Fase T6 - inclusao de procedimento no tratamento;
- Fase T7 - alterar tratamento e detalhes do tratamento;
- Fase T8 - finalizar procedimento ou fase;
- Fase T9 - orcamento e financeiro;
- Fase T10 - reabrir, interromper e excluir tratamento.

## 13. Pendencias para novo video ou validacao direta

Pontos que precisam de resposta antes de implementar:

- quais opcoes completas existem em cada combo do Novo tratamento;
- quais campos sao obrigatorios;
- o que acontece se tentar gravar vazio;
- o que muda ao trocar Beneficio;
- o que muda ao trocar Tabela ou moeda;
- como o sistema se comporta sem paciente em uso;
- como o sistema se comporta quando ja existe tratamento aberto;
- pode haver mais de um tratamento aberto;
- o tratamento tem status Aberto, Finalizado e Interrompido;
- como a inclusao de procedimento define dente, regiao e faces;
- como o procedimento entra na grade;
- qual status inicial do procedimento;
- quando o orcamento e criado;
- o orcamento nasce automaticamente junto com o tratamento;
- aprovar orcamento muda status do tratamento;
- finalizar procedimento gera financeiro;
- finalizar procedimento gera timeline ou historico.

## 14. Conclusao

Este documento registra o contrato funcional inicial da frente Tratamento no Brana Cloude.

A etapa atual e apenas documental.

A proxima validacao recomendada e confirmar combos, obrigatoriedade e regras do Novo tratamento antes de qualquer codigo.
