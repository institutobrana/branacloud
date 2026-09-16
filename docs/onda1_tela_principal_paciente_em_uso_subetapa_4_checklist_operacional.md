# Checklist operacional - Onda 1, Subetapa 4 da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: checklist operacional de execucao

Status: documental e preparatorio

## 2. Objetivo da Subetapa 4

Esta subetapa liga o lookup por codigo de paciente com acao de teclado.

O comportamento esperado e:

- digitar o codigo;
- pressionar `Enter` ou `Tab`;
- tentar localizar o paciente pelo endpoint existente;
- se nao encontrar, abrir o Menu de pacientes como fallback.

## 3. Escopo permitido

- usar `GET /cadastros/pacientes/por-codigo/{codigo}`;
- manter o Menu de pacientes como fallback;
- manter a faixa de paciente sincronizada;
- manter a leitura do paciente em uso da Subetapa 3;
- nao criar backend novo;
- nao mudar banco.

## 4. Escopo proibido

- criar nova regra de persistencia;
- alterar o cadastro de pacientes;
- tocar em toolbar;
- tocar em editor de textos;
- tocar em odontograma;
- alterar o modal de `Novo tratamento`;
- remover o fallback para o Menu de pacientes.

## 5. Checklist de execucao

### 5.1 Campo de codigo

- confirmar que o campo de codigo aparece na entrada da tela principal;
- confirmar que ele aceita somente a busca operativa do paciente;
- confirmar que o nome do paciente continua como leitura do contexto atual;
- manter o visual simples e discreto.

Teste esperado:

- o campo aparece na tela;
- o valor do paciente atual pode ser visto no carregamento;
- o layout nao quebra.

### 5.2 Lookup por teclado

- pressionar `Enter` no campo de codigo deve disparar a busca;
- pressionar `Tab` no campo de codigo deve disparar a busca;
- se o paciente existir, ele deve virar o paciente em uso;
- se o paciente nao existir, o sistema deve abrir o Menu de pacientes.

Teste esperado:

- codigo valido localiza o paciente;
- codigo invalido cai no Menu de pacientes;
- sem codigo, o Menu de pacientes continua disponivel.

### 5.3 Sincronizacao apos selecao

- apos localizar ou selecionar paciente, a tela principal deve refletir o novo estado;
- o cabeçalho de paciente em uso deve continuar sincronizado;
- o Menu de pacientes nao deve perder sua funcao original.

Teste esperado:

- a faixa mostra codigo e nome corretos apos a selecao;
- o fluxo `Tratamento -> Novo tratamento` continua recebendo o paciente ativo;
- nenhum erro novo surge no console.

## 6. Criterio para liberar a proxima etapa

So avancar quando:

- a busca por codigo estiver funcionando;
- o fallback para o Menu de pacientes estiver intacto;
- a faixa e o contexto atual estiverem sincronizados;
- o comportamento do navegador estiver previsivel;
- a tela principal continuar abrindo normalmente.
