# Fase 2 - Subetapa 0 - Comparacao de frentes candidatas

## 1. Objetivo da subetapa
Esta etapa e documental e nao altera codigo.

O objetivo e comparar frentes candidatas da Fase 2 com base em prioridade de negocio e risco tecnico, para embasar a escolha da primeira refatoracao controlada sem decidir definitivamente sozinha.

## 2. Contexto da mudanca de fase
A Fase 1 da modularizacao segura foi encerrada estrategicamente no limite seguro.

A partir daqui, a Fase 2 deixa de procurar apenas partes faceis e passa a avaliar modulos importantes para o negocio que possam valer uma refatoracao controlada.

## 3. Regra central da Fase 2
Nenhum modulo medio ou importante deve ser refatorado antes de existir contrato funcional.

Esse contrato precisa mapear, no minimo:

- como funciona hoje;
- quais botoes existem;
- quais dados carrega;
- quais dados salva;
- quais endpoints usa;
- quais riscos existem;
- onde testar;
- o que nao pode mudar.

## 4. Critérios usados na comparação

### 4.1. Prioridade de negocio
Mede o quanto o modulo e importante para o uso real do sistema e para o fluxo das clinicas.

### 4.2. Frequencia de uso
Indica se o modulo e usado diariamente, ocasionalmente ou apenas em configuracao inicial.

### 4.3. Risco tecnico
Considera dependencia de `app.js`, backend, banco, seeds, permissões, autenticação, endpoints e dados sensiveis.

### 4.4. Risco funcional
Mede a chance de quebrar um fluxo critico do usuario se a refatoracao for mal feita.

### 4.5. Facilidade de teste manual
Avalia o quanto sera possivel testar o modulo depois em tela real, com passos claros.

### 4.6. Dependencia de backend/banco
Mede o quanto o modulo depende de leitura, gravacao, permissao, tabelas, seeds, migracoes ou endpoints.

### 4.7. Beneficio esperado da refatoracao
Indica o quanto modularizar aquele modulo pode reduzir acoplamento, clarear responsabilidades ou evitar crescimento adicional do `app.js`.

### 4.8. Risco de regressao
Mede o impacto de uma refatoracao mal sucedida em fluxo critico, dados ou experiencia do usuario.

### 4.9. Necessidade de contrato funcional antes de codigo
Para os modulos medios/importantes, a resposta e sempre sim.

### 4.10. Recomendacao preliminar
Indica se o modulo parece adequado para ser primeira frente da Fase 2:

- Sim;
- Nao;
- Talvez, com ressalvas.

## 5. Matriz comparativa dos modulos candidatos

| Modulo | Prioridade de negocio (1-5) | Frequencia de uso (1-5) | Risco tecnico (1-5) | Risco funcional (1-5) | Facilidade de teste (1-5) | Dependencia backend/banco (1-5) | Beneficio da refatoracao (1-5) | Risco de regressao (1-5) | Contrato funcional antes de codigo | Recomendacao preliminar |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Ficha pessoal | 5 | 5 | 5 | 5 | 2 | 5 | 4 | 5 | Sim | Talvez, com ressalvas |
| Agenda | 5 | 5 | 5 | 5 | 2 | 5 | 4 | 5 | Sim | Nao por enquanto |
| Editor de texto | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | Sim | Talvez, com ressalvas |
| Tabela de proteticos | 3 | 3 | 3 | 3 | 4 | 3 | 3 | 3 | Sim | Talvez, com ressalvas |
| Relatorios | 4 | 3 | 4 | 4 | 2 | 4 | 4 | 4 | Sim | Nao por enquanto |
| Conta corrente | 5 | 4 | 5 | 5 | 2 | 5 | 5 | 5 | Sim | Nao por enquanto |
| Usuarios/Login | 5 | 5 | 5 | 5 | 1 | 5 | 4 | 5 | Sim | Nao |
| Seeds/tabelas padrao | 4 | 1 | 5 | 5 | 2 | 5 | 3 | 5 | Sim | Nao |

## 6. Analise individual dos candidatos

### 6.1. Ficha pessoal
Prioridade de negocio: alta. E parte central do prontuario e do atendimento.

Frequencia de uso: alta. E uma tela de trabalho direto do fluxo clinico.

Risco tecnico: alto. Continua fortemente acoplada a `app.js`, paciente, abas, anamnese e dados persistidos.

Risco funcional: alto. Uma regressao pode bloquear o prontuario ou alterar dados sensiveis.

Facilidade de teste manual: media/baixa. Ha muitos caminhos e dependencias de contexto do paciente.

Dependencia de backend/banco: alta. Usa dados persistidos, leitura e gravacao de informacoes clinicas.

Beneficio esperado da refatoracao: alto. Reduziria bastante o tamanho do `app.js`.

Risco de regressao: alto.

Contrato funcional antes de codigo: sim. Precisa mapear abas, campos, selecoes, acoplamento com anamnese e fluxos de paciente.

Recomendacao preliminar: talvez, com ressalvas.

### 6.2. Agenda
Prioridade de negocio: alta. Agenda organiza o atendimento diario e a operacao da clinica.

Frequencia de uso: alta. E tela de uso frequente.

Risco tecnico: alto. Ha dependencias de calendario, contatos, modos de exibição e scripts auxiliares.

Risco funcional: alto. Um erro afeta agendamentos, visao diaria e semanal e a experiencia operacional.

Facilidade de teste manual: media/baixa. Ha varios fluxos e janelas de navegacao.

Dependencia de backend/banco: alta. Consome e atualiza informacoes de agenda, contato e exibicao.

Beneficio esperado da refatoracao: alto. Tende a reduzir bastante o acoplamento do `app.js`.

Risco de regressao: alto.

Contrato funcional antes de codigo: sim. Precisa mapear vistas, filtros, interacoes, atalhos e persistencia visual.

Recomendacao preliminar: nao por enquanto.

### 6.3. Editor de texto
Prioridade de negocio: media/alta. E importante para documentos, modelos, PDF e assinaturas, mas nao e o nucleo diario de todo o sistema.

Frequencia de uso: media. Tende a ser usado por fluxos especificos.

Risco tecnico: medio/alto. E um bloco grande, com janela standalone e muitas funcoes internas, mas o dominio e mais delimitado do que agenda ou financeiro.

Risco funcional: medio/alto. Pode quebrar edicao, exportacao, PDF ou assinaturas.

Facilidade de teste manual: media. Ha fluxo claro para abrir, editar, salvar e validar saida.

Dependencia de backend/banco: media/alta. Depende de modelos, documentos, assinatura, e em alguns pontos de permissao e persistencia.

Beneficio esperado da refatoracao: alto. Reduziria um dos maiores blocos do `app.js`.

Risco de regressao: medio/alto.

Contrato funcional antes de codigo: sim. Precisa mapear abertura, edicao, salvamento, PDF, assinatura, imagens e modo standalone.

Recomendacao preliminar: talvez, com ressalvas.

### 6.4. Tabela de proteticos
Prioridade de negocio: media. E importante, mas nao parece ser o eixo mais critico do sistema.

Frequencia de uso: baixa/media.

Risco tecnico: medio. Ha tela propria, mas o escopo parece mais estreito que agenda, financeiro ou prontuario.

Risco funcional: medio. Um erro impacta um cadastro especifico, mas nao tende a travar o sistema inteiro.

Facilidade de teste manual: alta/media. A validacao pode ser feita por tela e lista.

Dependencia de backend/banco: media. Usa leitura/gravação, mas com dominio mais contido.

Beneficio esperado da refatoracao: medio. Pode aliviar o `app.js` sem entrar em superficies muito sensiveis.

Risco de regressao: medio.

Contrato funcional antes de codigo: sim. Precisa mapear tela, lista, cadastro, relacao com servicos e saidas.

Recomendacao preliminar: talvez, com ressalvas.

### 6.5. Relatorios
Prioridade de negocio: alta. Relatorios sao usados para acompanhamento, pesquisa e saidas operacionais.

Frequencia de uso: media.

Risco tecnico: alto. Ha muitos tipos de saida, filtros, modelos e caminhos de exibicao/exportacao.

Risco funcional: alto. Uma regressao pode quebrar consultas, impressão e exportação.

Facilidade de teste manual: media/baixa. Cada relatorio pode exigir um conjunto proprio de dados.

Dependencia de backend/banco: alta. Depende de consultas, formatos e possiveis exportacoes.

Beneficio esperado da refatoracao: alto. Pode reduzir acoplamento e separar responsabilidades.

Risco de regressao: alto.

Contrato funcional antes de codigo: sim. Precisa mapear filtros, templates, saidas e pontos de exportacao.

Recomendacao preliminar: nao por enquanto.

### 6.6. Conta corrente
Prioridade de negocio: alta. E eixo financeiro central.

Frequencia de uso: alta/media. Pode ser diaria em clinicas ativas.

Risco tecnico: alto. Concentra lancamentos, caixa, saldos, filtros e possivel integracao com relatorios.

Risco funcional: alto. Um erro pode afetar valores, saldos e confianca operacional.

Facilidade de teste manual: media/baixa. Exige dados e validacao de saldo/resultado.

Dependencia de backend/banco: alta. E fortemente apoiado em persistencia e calculos.

Beneficio esperado da refatoracao: alto. Melhoraria clareza do `app.js`, mas o risco e alto.

Risco de regressao: alto.

Contrato funcional antes de codigo: sim. Precisa mapear entradas, saidas, filtros, saldos, fluxo de caixa e telas correlatas.

Recomendacao preliminar: nao por enquanto.

### 6.7. Usuarios/Login
Prioridade de negocio: alta. Autenticacao e permissao sao base do acesso ao sistema.

Frequencia de uso: alta.

Risco tecnico: muito alto. O fluxo envolve login, sessao, senha interna, permissao, protecao e bootstrap da aplicacao.

Risco funcional: muito alto. Um erro pode travar acesso ou expor privilegios.

Facilidade de teste manual: baixa. O teste precisa cobrir varios perfis, senhas e estados.

Dependencia de backend/banco: alta. Conecta autenticacao, perfis, tabela de usuarios e possiveis seeds.

Beneficio esperado da refatoracao: alto, mas o risco e muito maior.

Risco de regressao: muito alto.

Contrato funcional antes de codigo: sim. Precisa mapear login, cadastro, recuperacao, permissoes, senha interna e estados de erro.

Recomendacao preliminar: nao.

### 6.8. Seeds/tabelas padrao
Prioridade de negocio: media/alta. E critico para novas contas e novos ambientes.

Frequencia de uso: baixa na operacao diaria, alta na implantacao inicial e em recuperacao.

Risco tecnico: muito alto. Envolve criacao de dados iniciais, tabelas padrao e risco de alterar base de clientes novos e existentes.

Risco funcional: muito alto. Um erro pode afetar bootstrap de novas clinicas e o padrao "PARTICULAR" para novas contas.

Facilidade de teste manual: baixa. Exige ambiente controlado e cuidado com dados reais.

Dependencia de backend/banco: muito alta. E a area mais sensivel para seeds, tabelas e migracao de padroes.

Beneficio esperado da refatoracao: medio. Ha valor em organizar, mas nao e uma frente boa para iniciar a Fase 2.

Risco de regressao: muito alto.

Contrato funcional antes de codigo: sim. Precisa mapear quais seeds existem, quais sao obrigatorios, o que nasce em novas contas e o que nao pode mudar nas contas existentes.

Recomendacao preliminar: nao.

## 7. Classificacao preliminar

### 7.1. Bons candidatos para primeira frente

- Tabela de proteticos
- Editor de texto

### 7.2. Candidatos importantes, mas com risco maior

- Ficha pessoal
- Agenda
- Relatorios
- Conta corrente

### 7.3. Candidatos que exigem diagnostico adicional

- Editor de texto
- Tabela de proteticos
- Ficha pessoal

### 7.4. Candidatos que devem aguardar

- Usuarios/Login
- Seeds/tabelas padrao
- Agenda
- Conta corrente
- Relatorios

## 8. Recomendacao preliminar
Para a primeira frente da Fase 2, os melhores candidatos preliminares, sem decisao final, sao:

1. Tabela de proteticos
2. Editor de texto
3. Ficha pessoal

Leitura conservadora:

- `Tabela de proteticos` oferece melhor equilibrio entre impacto e risco.
- `Editor de texto` oferece alto beneficio, mas precisa de contrato funcional detalhado.
- `Ficha pessoal` tem grande impacto, mas o risco e o acoplamento sao maiores.

Esta recomendacao e base para decisao humana, nao uma ordem de execucao.

## 9. Riscos da escolha errada
Escolher um modulo muito critico sem contrato funcional suficiente pode:

- quebrar fluxo de atendimento;
- afetar dados persistidos;
- alterar permissões ou autenticação;
- gerar regressao silenciosa;
- exigir retrabalho caro;
- e atrasar a propria Fase 2.

## 10. Próximo passo recomendado
Fase 2 - Subetapa 1 - Contrato funcional do modulo escolhido.

Essa proxima etapa tambem deve ser documental antes de qualquer codigo.

## 11. Onde testar esta etapa
Esta etapa e documental e nao possui teste funcional de tela.

Checks obrigatorios desta subetapa:

- `git status --short`
- `git diff -- docs/fase_2_subetapa_0_comparacao_frentes_refatoracao_controlada.md`
- confirmar que somente este documento foi criado/modificado.

## 12. Consideracoes finais
Esta comparacao nao escolhe o modulo definitivo.

Ela organiza a decisao para que a Fase 2 comece por uma frente importante, com risco controlado e contrato funcional previo.
