# Contrato de implementacao - `Grupo de medicamento`

## 1. Contexto

`Grupo de medicamento` e uma auxiliar especial do Brana Cloud, ligada ao dominio de medicamentos e ao assistente de prescricao/textos.

Ela ficou fora do lote padrao de tabelas simples porque:

- o modal nao segue o CRUD curto das auxiliares simples;
- o `Código` nao e digitado manualmente;
- a tabela tem dependencia funcional direta com o modulo de medicamentos;
- o editor/prescricao tambem consome essa fonte como lookup operacional.

## 2. Estrutura funcional confirmada

### Grade / listagem

A listagem observada e enxuta e trabalha com os campos visiveis basicos do legado:

- indice/ordem visual
- codigo
- descricao

### Modal

O modal desta frente e especifico e mais curto:

- pede apenas `Descrição`
- nao pede `Código` manualmente

### Codigo automatico

O comportamento observado no legado indica que o codigo e gerado automaticamente antes da gravacao.

## 3. Regra de geracao de codigo

Regra registrada a partir da implementacao legada observada em `frontend/app.js`:

1. considerar apenas codigos numericos ja existentes;
2. localizar o maior codigo numerico;
3. somar 1;
4. manter largura minima de 2 digitos;
5. aplicar zero a esquerda quando necessario.

Esta regra foi tratada como **confirmada pela implementacao legada observada**. Se surgir divergencia futura em banco real ou migracao, a regra deve ser revalidada antes da implementacao.

## 4. Reaproveitamento seguro no novo frontend React

Pode ser reaproveitado com seguranca:

- shell da tela;
- submenu lateral;
- grid base;
- cabeçalho compartilhado;
- menu de filtro;
- estrutura visual geral consolidada para auxiliares;
- padrao de modal ja usado nas tabelas simples, apenas ajustando o conteudo para esta frente.

## 5. Comportamento proprio desta frente

Precisam ser mantidos como especificos de `Grupo de medicamento`:

- modal mais curto;
- campo unico de descricao;
- codigo automatico;
- consumo pela area de medicamentos;
- consumo pelo editor/prescricao.

## 6. Dependencias a preservar

Dependencias confirmadas:

- `backend/routes/medicamentos_routes.py`
- `backend/routes/editor_textos_routes.py`
- `backend/services/signup_service.py`
- `frontend/app.js`
- `frontend/js/modules/medicamentos.js`

Dependencia de origem legada:

- `DEF_GRUPO`

## 7. Fora de escopo

Ficam fora desta frente:

- backend novo;
- alteracao de banco;
- migration;
- mudanca de regra de negocio;
- alteracao da origem do codigo;
- migracao de outras excecoes;
- qualquer tentativa de encaixar `Grupo de medicamento` no bloco padrao de tabelas simples.

## 8. Proxima etapa recomendada

Implementar `Grupo de medicamento` em frente propria no novo frontend React, reaproveitando o shell e os componentes visuais consolidados quando fizer sentido, mas sem forcar o modal no mesmo contrato das tabelas simples.

## 9. Conclusao

Este documento formaliza a separacao de `Grupo de medicamento` como frente especifica. Ele nao autoriza implementacao por si so; apenas define o contrato para a proxima etapa.
