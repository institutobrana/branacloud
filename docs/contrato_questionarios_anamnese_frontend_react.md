# Contrato funcional futuro - Questionarios de Anamnese no frontend React

## 1. Rota e menu

- Rota futura sugerida: `Configuracoes > Questionarios de anamnese`
- O menu deve seguir o shell atual do React com barra lateral e barra superior em formato de L unico.
- O modulo deve aparecer como feature isolada, sem componente monolitico.

## 2. Objetivo funcional

Permitir administracao de:

- questionarios de anamnese;
- perguntas de cada questionario;
- renumeracao de perguntas;
- leitura e gravacao de respostas de paciente;
- impressao futura do questionario.

## 3. Estrutura visual

### Shell

- manter o padrao visual dos modulos administrativos atuais;
- respeitar tema claro e escuro;
- usar a linguagem visual ja adotada em modulos como Materiais, Medicamentos, CID e Unidades de atendimento;
- nao criar shell proprio.

### Toolbar

Grupo de questionario:

- Novo questionario;
- Altera;
- Elimina;
- Imprime.

Grupo de perguntas:

- Nova pergunta;
- Altera;
- Elimina;
- 1,2... Renumera perguntas.

Lado direito:

- label `Questionario:`;
- combo com os questionarios da clinica.

## 4. Estados da tela

- carregando questionarios;
- sem questionarios;
- questionario selecionado com perguntas;
- questionario selecionado sem perguntas;
- editando questionario;
- editando pergunta;
- confirmando exclusao;
- renumerando perguntas;
- erro de API;
- sessao expirada;
- permissao negada.

## 5. Contrato de API existente

O backend atual ja oferece:

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{questionario_id}`
- `DELETE /anamnese/questionarios/{questionario_id}`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `POST /anamnese/questionarios/{questionario_id}/perguntas`
- `PUT /anamnese/perguntas/{pergunta_id}`
- `DELETE /anamnese/perguntas/{pergunta_id}`
- `POST /anamnese/questionarios/{questionario_id}/renumerar`
- `GET /anamnese/pacientes/{paciente_id}/respostas`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

## 6. Contrato funcional confirmado para reutilizacao

### Questionario

- nome obrigatorio;
- nome unico por clinica;
- status ativo/inativo disponivel no modelo;
- ordenacao por `ordem`;
- exclusao bloqueada se houver perguntas.

### Pergunta

- texto obrigatorio;
- numero pode ser informado ou calculado;
- numeros nao podem colidir dentro do mesmo questionario;
- tipos de pergunta e resposta sao numericos e aceitam `1, 2, 3`;
- mensagem de alerta e opcional.

### Resposta

- resposta e vinculada a paciente, questionario e pergunta;
- resposta vazia apaga o registro;
- leitura deve respeitar `clinica_id`.

## 7. Proposta modular

Separar em ao menos:

- pagina orquestradora;
- toolbar;
- seletor de questionario;
- tabela de perguntas;
- modal de questionario;
- modal de pergunta;
- dialogo de confirmacao de exclusao;
- servico de API;
- hooks de consulta;
- hooks de mutacao;
- utilitarios de validacao;
- tipos/contratos;
- testes.

## 8. Estado atual da tabela no React

Na implementacao atual do React, a tabela de perguntas de anamnese usa:

- selecao unica com radio;
- colunas `Nº` e `Texto da pergunta`;
- sem filtros nos cabecalhos;
- rodape com o total completo de perguntas do questionario;
- botao `1,2... Renumera perguntas` reaproveitado apenas para levar a selecao ao primeiro item da lista completa e rolar o corpo ao topo, sem chamada de API de renumeracao.

## 9. Regras de interacao

- o combo deve carregar questionarios da clinica autenticada;
- ao trocar o combo, a tabela de perguntas deve ser recarregada;
- a tabela deve preservar a selecao quando possivel;
- ao abrir a tela, se houver questionarios, selecionar o primeiro ou a ultima selecao valida;
- ao salvar questionario ou pergunta, atualizar lista e manter contexto sempre que possivel;
- ao excluir questionario, reavaliar o combo e a tabela;
- ao excluir pergunta, recarregar sem perder o questionario selecionado.

## 10. Regras de permissao

- todas as chamadas devem ser autenticadas;
- o frontend nao deve confiar em `clinica_id` fornecido manualmente;
- a rota deve seguir o modulo de permissao `anamnese`;
- o contrato deve prever `403` ou bloqueio visual quando a permissao nao existir.

## 11. Estados de erro

- `400`: validacao de nome, texto, numero ou tipo;
- `401`: sessao expirada;
- `403`: acesso negado;
- `404`: questionario, pergunta ou paciente nao localizado;
- `409`: conflito, principalmente exclusao de questionario com perguntas;
- `500`: erro inesperado ou falha de persistencia.

## 12. Pontos ainda dependentes de decisao

- contrato visual da impressao;
- se a impressao mostrara apenas questionario ou tambem respostas;
- o botao `1,2... Renumera perguntas` mantem o rotulo historico, mas no React atual apenas reposiciona a selecao para o primeiro item da lista completa;
- nao ha chamada ao endpoint de renumeracao neste fluxo do frontend;
- nao ha filtros de coluna na implementacao atual;
- se o combo exibira somente questionarios ativos ou todos;
- se a exclusao de pergunta precisara de bloqueio quando houver respostas historicas;
- se o novo modulo mostrara flag de ativo/inativo em tela.
- se o texto de uma pergunta ja respondida podera ser alterado sem bloqueio;
- se a exclusao de uma pergunta ja respondida sera bloqueada;
- como os tipos `1`, `2` e `3` devem ser apresentados visualmente;
- se a selecao do ultimo questionario deve ser preservada apos reload.

## 13. Critérios de aceite

- a tela abre com os questionarios da clinica autenticada;
- a selecao do questionario atual e preservada sempre que possivel;
- a tabela carrega as perguntas corretas do questionario selecionado;
- criar, editar, excluir e renumerar operam com feedback claro;
- respostas de paciente podem ser lidas e salvas;
- erros de API sao exibidos de forma compreensivel;
- nao ha vazamento de dados entre clinicas;
- o modulo funciona no shell atual sem quebrar outros modulos.

## 14. Componentes existentes que podem ser reaproveitados

Confirmado por padrao de outros modulos:

- shell e layout base do React;
- padrao de toolbar ja usado em features administrativas;
- componentes de loading e error state usados em outros modulos;
- padrao de tabelas e dialogos ja existentes;
- cliente de API autenticado ja usado em outras features.

## 15. Lacunas do contrato atual

- nao existe ainda componente React funcional para Anamnese;
- nao existe implementacao de impressao;
- nao existe contrato visual especifico aprovado para a tela futura;
- nao existe matriz de testes dedicada ao modulo no React.
