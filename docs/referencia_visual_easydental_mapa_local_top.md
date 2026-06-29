# Referencia visual EasyDental em mapa local top

## Objetivo

Este documento descreve onde fica a referencia privada/local do EasyDental usada apenas para auditoria visual, estrutural e funcional no Brana Cloude.

## Local da referencia privada

A pasta local de consulta fica em:

```text
_referencias_privadas/easydental_top/
```

A estrutura principal organizada para navegacao fica em:

```text
_referencias_privadas/easydental_top/top/
```

## Como consultar a estrutura

Use a pasta `top/` como mapa local inspirado na aba Sources do navegador. O material fica separado por dominio e caminho, o que facilita localizar areas do sistema por blocos de interface, recursos estaticos e dependencias externas.

## Areas uteis para auditoria

As areas abaixo sao especialmente uteis como referencia visual e estrutural:

- ficha clinica
- odontograma
- especialidades
- tratamento
- painel lateral
- CSS
- imagens

## Regra obrigatoria

Nao copiar codigo proprietario, CSS proprietario, JavaScript proprietario ou imagens proprietarias para o Brana Cloude.

## Forma correta de uso

Use essa referencia apenas para entender comportamento, nomenclatura visual, hierarquia de telas e organizacao de recursos. Toda implementacao real no Brana Cloude deve ser recriada com componentes proprios, React proprio quando aplicavel e CSS proprio.
