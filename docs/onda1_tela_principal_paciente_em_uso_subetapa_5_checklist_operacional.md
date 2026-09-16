# Checklist operacional - Onda 1, Subetapa 5 da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: checklist operacional de execucao

Status: documental e preparatorio

## 2. Objetivo da Subetapa 5

Esta subetapa valida a integracao entre o paciente em uso e o fluxo `Tratamento -> Novo tratamento`.

A premissa e simples:

- com paciente em uso, o modal de `Novo tratamento` deve abrir com esse contexto;
- sem paciente em uso, o sistema deve cair no Menu de pacientes como fallback.

## 3. Escopo permitido

- aproveitar o paciente ja resolvido pela tela principal;
- manter o gate atual de `Novo tratamento`;
- manter o modal atual sem redesenho;
- manter o fallback para o Menu de pacientes;
- validar a consistencia entre tela principal, ficha e modal.

## 4. Escopo proibido

- criar novo backend para tratar o modal;
- criar nova fonte de paciente em uso;
- tocar em toolbar;
- tocar em editor de textos;
- tocar em odontograma;
- remover o fallback para o Menu de pacientes;
- misturar esta validação com persistencia real de tratamento.

## 5. Checklist de execucao

### 5.1 Caminho com paciente ativo

- selecionar ou localizar um paciente pela tela principal;
- confirmar que o paciente em uso continua visivel;
- abrir `Tratamento -> Novo tratamento`;
- confirmar que o modal abre usando o paciente ativo;
- confirmar que a carga inicial dos combos continua coerente.

Teste esperado:

- o modal abre com o contexto correto;
- o paciente em uso continua consistente;
- nenhuma regressao aparece ao abrir a janela.

### 5.2 Caminho sem paciente ativo

- limpar o paciente em uso;
- abrir `Tratamento -> Novo tratamento`;
- confirmar que o sistema cai para o Menu de pacientes;
- confirmar que o fallback continua funcional.

Teste esperado:

- o Menu de pacientes abre;
- o modal nao tenta seguir com paciente inexistente;
- nenhum erro novo aparece.

### 5.3 Fechamento e retorno

- abrir o modal;
- fechar o modal;
- verificar se o paciente em uso continua consistente;
- repetir o ciclo depois de trocar o paciente.

Teste esperado:

- abrir e fechar nao apaga o contexto errado;
- a tela principal continua sincronizada;
- o fluxo fica previsivel para a proxima etapa.

## 6. Criterio para liberar a proxima etapa

So avancar quando:

- o modal abrir com paciente ativo;
- o fallback abrir o Menu de pacientes sem paciente ativo;
- a tela principal continuar coerente;
- nenhum erro novo surgir no console;
- o comportamento de `Novo tratamento` continuar igual ao esperado.
