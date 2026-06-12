# Implementacao - Header de Paciente em Uso na Tela Principal

## Objetivo

Adicionar, na tela principal do odontograma, uma faixa visual fixa e discreta logo abaixo da barra superior e antes da area de trabalho, exibindo o paciente ativo em uso.

## Escopo funcional

- Exibir o numero do paciente ativo.
- Exibir o nome do paciente ativo.
- Atualizar a faixa quando o paciente mudar pela busca do odontograma ou pelo fluxo legado da ficha.
- Mostrar estado neutro quando nao houver paciente selecionado.
- Manter o comportamento do restante da tela inalterado.

## Origem dos dados

O cabeçalho de paciente em uso deve montar o conteudo a partir desta ordem de prioridade:

1. Estado do modulo de odontograma V1.
2. Estado global da ficha pessoal legado.
3. Estado vazio, quando nao houver paciente ativo.

Campos observados:

- `BranaOdontoV1Module.state.paciente`
- `fichaPacienteAtualId`
- `fichaCodigoUltimoResolvido`
- `ficha.titulo.textContent`
- `ficha.nome.value`

## Implementacao tecnica adotada

- Criacao de modulo isolado em `frontend/js/modules/paciente-em-uso-header.js`.
- Montagem dinamica do header dentro do shell do odontograma.
- Sincronizacao automatica do cabeçalho nas transicoes de paciente.
- Integracao minima com o bootstrap do odontograma e com o fluxo legado da ficha.

## Comportamento visual

- Faixa horizontal compacta, acima do contexto do odontograma.
- Rótulo fixo `Paciente:`.
- Duas areas de leitura:
  - numero do paciente.
  - nome do paciente.
- Quando vazio, exibir marcador neutro.

## Dependencias observadas

- O shell do odontograma precisa estar renderizado para o header ser montado.
- O paciente precisa ser aplicado por algum dos fluxos existentes para o cabeçalho receber atualizacao.
- O modulo de busca do odontograma e o fluxo legado da ficha continuam sendo as principais fontes de atualizacao.

## Nao foi alterado

- Backend.
- Banco de dados.
- Migracoes.
- Seeds.
- Persistencia.
- Regras de permissao.
- Fluxo principal de abertura do odontograma.

## Validacao esperada

- Abrir a tela principal sem paciente deve mostrar estado neutro.
- Selecionar um paciente deve atualizar a faixa imediatamente.
- Trocar o paciente pelo fluxo legado da ficha deve refletir no cabeçalho.
- Fechar e reabrir a tela nao deve quebrar a montagem.

## Pendencias

- Nao ha pendencia funcional conhecida para esta entrega.
- Caso exista outra tela principal que tambem precise do mesmo header, ela deve reutilizar o mesmo modulo.

