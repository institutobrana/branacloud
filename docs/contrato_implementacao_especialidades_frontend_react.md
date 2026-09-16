# Contrato de implementação - Especialidades

## Contexto
`Especialidades` é uma frente excepcional própria do Brana Cloud. Ela não deve ser tratada como tabela auxiliar simples.

O legado confirmou um modal específico com os campos:

- `Código`
- `Descrição`
- `Ordem`
- `Imagem`
- checkbox `Inativar especialidade`

## Reaproveitamento seguro
A futura implementação no novo frontend React pode reaproveitar com segurança:

- shell da tela de tabelas auxiliares
- submenu interno
- grid/listagem base
- cabeçalho compartilhado
- comportamento geral de seleção de linha
- base visual do modal
- botões e rodapé já consolidados no padrão do novo frontend
- estilos globais já consolidados para a área

## Comportamento próprio da exceção
`Especialidades` exige tratamento próprio e não deve herdar o fluxo das tabelas simples.

O contrato confirma como comportamento específico:

- modal próprio
- campo `Ordem`
- combo `Imagem`
- checkbox `Inativar especialidade`
- integração funcional própria com `imagem_indice`

## Campos da implementação
Os campos fechados para a futura implementação são:

- `Código`
- `Descrição`
- `Ordem`
- `Imagem`
- `Inativar especialidade`
- `status / inativo` apenas se a listagem usar esse indicador no padrão visual da frente

### Campo visual eventual
- `Nome` só pode aparecer como fallback visual se houver necessidade de aderência de layout
- este contrato não cria persistência nova para `Nome`

## Mapeamento legado / backend -> React
O mapeamento funcional registrado é:

- `codigo` -> `Código`
- `descricao` ou `nome` -> `Descrição` ou campo visual equivalente, conforme o comportamento real confirmado na implementação futura
- `ordem` -> `Ordem`
- `imagem_indice` -> combo `Imagem`
- `inativo` -> checkbox `Inativar especialidade` e/ou status visual na listagem

### Persistência e comportamento confirmados
- `ordem` já existe na persistência e deve ser enviada como número opcional
- `imagem_indice` já existe na persistência e deve ser preservado como índice
- o combo `Imagem` não deve ser tratado como upload livre
- o combo `Imagem` não deve inventar uma nova tabela de imagens sem confirmação funcional

## Catálogo fixo do combo `Imagem`
As 14 opções confirmadas para o combo são:

- Dentística
- Prótese
- Endodontia
- Periodontia
- Gerais
- Cirurgia
- Ortodontia
- Prevenção
- Odontopediatria
- Diagnóstico
- Radiologia
- Estética
- Implantodontia
- Genérica

### Regra de índice
O contrato registra que o valor persiste como `imagem_indice`.

Se a implementação futura precisar confirmar se o índice é zero-based ou one-based, essa validação deve ser feita com o comportamento real do legado antes de codificar. Este contrato não adivinha offset.

## Escopo da futura implementação
A implementação futura deve incluir:

- entrada da tabela no catálogo correto
- listagem própria coerente com a frente
- modal específico
- combo `Imagem` baseado em catálogo fixo
- integração com o tipo canônico correto no backend
- validação sem regressão nas outras exceções

## Fora de escopo
Não entram nesta frente:

- migration nova
- refatoração ampla
- upload real de imagem
- nova tabela de imagens
- novas regras de negócio além das confirmadas
- campos herdados de outras exceções
- qualquer funcionalidade não confirmada na auditoria

## Dependências a preservar
A frente deve preservar a integração com:

- módulo de cadastro/paciente
- contratos backend já existentes
- comportamento já auditado em `item_auxiliar`

## Próxima etapa recomendada
A próxima etapa deve ser a implementação isolada da frente `Especialidades` no novo frontend React, usando este contrato como escopo travado antes de qualquer alteração de interface.
