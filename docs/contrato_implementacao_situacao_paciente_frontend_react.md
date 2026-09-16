# Contrato de implementação - Situação do paciente

## Contexto
`Situação do paciente` é uma frente excepcional própria do Brana Cloud. Ela não deve ser tratada como tabela simples padrão do catálogo de tabelas auxiliares.

A auditoria funcional já confirmou que o legado usa modal específico e que a frente possui impacto funcional direto no cadastro/paciente.

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
`Situação do paciente` exige tratamento próprio e não deve herdar o fluxo das tabelas simples.

O contrato confirma como comportamento específico:

- modal próprio
- campo `Mensagem / alerta`
- checkbox `Desativar paciente no sistema`
- integração funcional própria com cadastro/paciente
- tratamento de persistência diferente do padrão simples

## Campos da implementação
Os campos fechados para a futura implementação são:

- `Código`
- `Descrição`
- `Mensagem / alerta`
- `Desativar paciente no sistema`
- `status / inativo` apenas se a listagem usar esse indicador no padrão visual da frente

### Campo visual eventual
- `Nome` só pode aparecer como fallback visual se houver necessidade de aderência de layout
- este contrato não cria persistência nova para `Nome`

## Mapeamento legado / backend -> React
O mapeamento funcional registrado é:

- `codigo` -> `Código`
- `descricao` -> `Descrição`
- `mensagem_alerta` -> `Mensagem / alerta`
- `desativar_paciente_sistema` -> checkbox `Desativar paciente no sistema`
- `inativo` -> status visual/listagem, se aplicável

### Persistência genérica existente que não deve ser inventada
Os campos `cor_apresentacao` e `exibir_anotacao_historico` existem na persistência genérica de `item_auxiliar`, mas não devem ser adicionados ao modal desta frente sem confirmação funcional específica.

O contrato trava a frente para evitar inclusão de campos apenas porque a estrutura genérica os suporta.

## Escopo da futura implementação
A implementação futura deve incluir:

- entrada da tabela no catálogo correto do React
- modal específico da frente
- listagem coerente com o comportamento confirmado
- integração com o tipo canônico correto no backend
- validação sem regressão nas demais exceções

## Fora de escopo
Não entram nesta frente:

- migration nova
- refatoração ampla
- novas regras de negócio além das confirmadas
- bloqueios extras não confirmados
- campos herdados de outras exceções
- funcionalidades não confirmadas na auditoria

## Dependências a preservar
A frente deve preservar a integração com:

- módulo de cadastro/paciente
- contratos backend já existentes
- comportamento já auditado em `item_auxiliar`

## Próxima etapa recomendada
A próxima etapa deve ser a implementação isolada da frente `Situação do paciente` no novo frontend React, usando este contrato como escopo travado antes de qualquer alteração de interface.
