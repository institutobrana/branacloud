# Ficha Pessoal - Historico - Contrato de refatoracao da tela Propriedades da linha

## Objetivo da etapa
Definir o contrato da separacao da tela `Propriedades da linha` em um modulo proprio no frontend e registrar a menor separacao equivalente no backend, sem alterar ainda o comportamento funcional.

Esta etapa e exclusivamente documental/contratual. Nao altera frontend funcionalmente, nao altera backend funcionalmente, nao cria migration, nao cria schema novo e nao cria endpoint novo sem necessidade comprovada.

## Contrato funcional preservado da tela Propriedades da linha

- Data
- Cirurgiao responsavel
- Regiao
- Cor de fundo
- Historico
- Data de insercao
- Data de atualizacao

## Mapa de responsabilidades atuais

### O modulo principal da aba Historico hoje faz

- Exibe a grade da aba Historico.
- Mantem selecao de linha.
- Gerencia insercao, edicao, exclusao e confirmacao da linha.
- Mantem a navegacao por teclado.
- Serializa e reaplica o envelope `extra.historico_aba`.
- Abre a tela de Propriedades da linha como parte do fluxo atual.
- Mantem a integracao com o contexto de sessao e com o catalogo de prestadores.

### A tela Propriedades da linha hoje concentra

- Montagem do modal.
- Preenchimento dos campos da linha selecionada.
- Resolucao do campo Cirurgiao responsavel.
- Lista/sugestoes de prestadores.
- Aplicacao e cancelamento dos valores do modal.
- Reconciliacao visual do nome do prestador na linha.

## Proposta de responsabilidades apos a extracao no frontend

### Arquivo novo

- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`

### O que deve sair do modulo principal

- HTML do modal da tela Propriedades da linha.
- Renderizacao do datalist de prestadores.
- Preenchimento dos inputs do modal.
- Leitura e normalizacao dos campos do modal.
- Aplicacao dos valores da linha editada.
- Fechamento do modal.
- Tratamento local de `Enter`, `Escape`, botao aplicar e botao cancelar dentro do proprio modal.
- Regras de resolucao visual do Cirurgiao responsavel.

### O que deve permanecer no modulo principal da aba Historico

- Grade da aba.
- Selecao de linha.
- Insercao, edicao e exclusao da linha.
- Navegacao por teclado na grade.
- Serializacao e reaplicacao do envelope.
- Orquestracao para abrir o novo modulo de Propriedades da linha.
- Sincronizacao com `sessaoAtual.prestador_id` e com o catalogo de prestadores ja existente.

## Como manter a integracao com a grade, selecao e serializacao

- O modulo principal continua dono da linha selecionada.
- O novo modulo recebe a linha ativa e devolve os valores aplicados.
- A grade continua renderizada pelo modulo principal.
- O modal apenas edita os campos da linha recebida.
- A serializacao continua sendo feita no envelope atual da aba Historico.
- A reaplicacao continua sendo feita pelo fluxo atual ao reabrir o paciente.

## Menor separacao correspondente no backend

### O que significa a mesma separacao no backend neste estado

No estado atual do sistema, a menor separacao equivalente no backend nao e criar uma rota nova nem um modelo novo para a tela. A menor separacao util e extrair a normalizacao e a montagem do envelope do Historico para um helper ou service pequeno, mantendo a persistencia atual em `source_payload` / `extra`.

### Alternativa A - helper/service minimo compartilhado

- Extrair para um modulo pequeno da camada de backend a normalizacao de `historico_aba`.
- Manter a rota atual responsavel apenas por chamar esse helper/service.
- Reaproveitar o mesmo envelope de persistencia ja existente.

Vantagem:

- Mantem o backend simples e coerente com o modelo atual.
- Evita novo endpoint e evita remodelagem de persistencia.

Risco:

- Exige disciplina para nao espalhar a logica de historico por varias rotas.

### Alternativa B - rota dedicada para historico

- Criar uma rota propria apenas se houver prova de necessidade funcional futura.
- Somente consideraria isso se o Historico passar a precisar de semantica independente do envelope atual.

Vantagem:

- Separa completamente a API.

Risco:

- Superengenharia nesta fase.
- Pode duplicar regras que hoje ja sao atendidas pelo envelope atual.

### Recomendacao final

- Adotar a **Alternativa A**.
- Manter o backend em separacao minima, com helper/service pequeno e sem endpoint novo.
- Nao quebrar o fluxo de `source_payload` / `extra.historico_aba`.

## O que continua provisoriamente no fluxo atual

- A tela continua funcionando dentro do mesmo fluxo da aba Historico ate a extracao ocorrer.
- A integracao com Cirurgiao responsavel continua apoiada no catalogo de prestadores e no contexto de sessao.
- Regiao continua como texto comum.
- Cor de fundo, datas de auditoria e demais campos especiais permanecem sem nova separacao nesta primeira fase.

## O que fica fora da primeira refatoracao

- Mudanca funcional da tela.
- Novo endpoint.
- Nova migration.
- Novo schema.
- Novo modelo de persistencia.
- Separacao de Regiao.
- Separacao de Cor de fundo.
- Separacao de datas de auditoria.
- Separacao de regra de tratamento/intervencao.

## Riscos observados

- Se o novo modulo assumir regra demais, a separacao vira refatoracao funcional disfarçada.
- Se o backend for separado em rota dedicada cedo demais, o projeto pode perder a simplicidade atual do envelope.
- Se a linha nao for passada por contrato claro entre os modulos, a integracao com a grade pode quebrar.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Abrir Propriedades da linha.
5. Conferir se todos os campos continuam presentes.
6. Alterar um campo e aplicar.
7. Confirmar se a grade reflete a alteracao.
8. Clicar em Grava.
9. Fechar e reabrir o paciente.
10. Confirmar se os valores continuam reaparecendo.

## Proxima subetapa recomendada

- Extrair primeiro a tela Propriedades da linha para o novo modulo de frontend, mantendo o modulo principal apenas como orquestrador da grade e da linha selecionada.
