# Conta corrente do cirurgião

## 1. Objetivo

Registrar o contrato alvo da frente de conta corrente do cirurgião no Brana Cloude.

O módulo já existe no legado e está sendo migrado para o novo frontend React de forma incremental, preservando compatibilidade com a base atual.

## 2. Escopo inicial

- A primeira entrega deve cobrir apenas a tela principal.
- Modais serão tratados em etapas posteriores.
- `rcc-panel` e `rview-panel` não fazem parte da primeira implementação.
- Backend e banco já existem para a conta corrente, mas a identidade do profissional ainda precisa evoluir.

## 3. Tela principal

### Toolbar futura

- Novo débito
- Novo crédito
- Altera
- Elimina
- Imprime
- Mês
- Ano
- Cirurgião
- Visualização

### Tabela

- Data
- Lançamento
- Histórico
- Débito
- Crédito

### Rodapé

- Entradas do mês
- Despesas do mês
- Saldo do mês

## 4. Divergência EasyDental × Brana atual

No EasyDental, `CCCIRURGIAO` pertence a um profissional individual e referencia `PRESTADOR`.

No Brana atual, `Lancamento.conta = CIRURGIAO` representa apenas uma categoria agregada, sem vínculo com um profissional individual.

Essas duas coisas não devem ser tratadas como equivalentes.

## 5. Entidade profissional

`PrestadorOdonto` é a entidade profissional oficial no Brana Cloude.

O contrato alvo aprovado para a evolução futura é:

`Lancamento.prestador_id -> PrestadorOdonto.id`

## 6. Regras do contrato alvo

### CLINICA

- `prestador_id = NULL`

### CIRURGIAO legado

- `prestador_id` pode permanecer `NULL`

### CIRURGIAO novo

- deverá exigir prestador válido pela aplicação

### Tenant

- o prestador deve pertencer à mesma `clinica_id`

## 7. Compatibilidade legada

- O campo `conta` continuará existindo.
- O backend deverá continuar aceitando contratos antigos durante a transição.
- O frontend legado não deve ser quebrado abruptamente.
- O novo React usará prestador individual.

## 8. Dados históricos

Lançamentos antigos de `CIRURGIAO` não devem ser migrados automaticamente para um profissional específico sem evidência confiável.

Valores históricos sem dono devem permanecer identificáveis como legado.

## 9. Contrato GET futuro

O contrato conceitual futuro de consulta deve manter:

- `mes`
- `ano`
- `conta`
- `filtro`

E adicionar futuramente:

- `prestador_id`

### Regras

- `CLINICA`: sem prestador
- `CIRURGIAO`: pode filtrar por prestador individual

## 10. Contrato POST futuro

- Novos lançamentos de `CIRURGIAO` deverão carregar `prestador_id`.
- O backend validará o tenant.
- O vínculo não deve ser derivado obrigatoriamente do usuário logado.
- Administradores e secretarias podem operar a conta de outro profissional conforme permissões futuras.

## 11. PUT futuro

- O prestador faz parte da identidade financeira do lançamento.
- A alteração precisa ser controlada.
- O comportamento definitivo poderá ser fechado quando o modal `Altera` for auditado.

## 12. DELETE futuro

- Não há alteração estrutural relevante.
- A exclusão continua respeitando tenant e permissão.

## 13. Totais

- `total_entrada`
- `total_saida`
- `saldo`

Os totais devem ser calculados apenas sobre os lançamentos do profissional selecionado.

## 14. Combo Cirurgião

### Fonte futura

`GET /cadastros/prestadores`

### Valor

`PrestadorOdonto.id`

### Texto

`nome`

### Filtro

somente profissionais da clínica atual

### Default

Não assumir default definitivo nesta etapa.

## 15. Arquitetura React futura

A feature deve ser modular.

Proposta conceitual:

- Page
- Toolbar
- Filters
- Table
- Totals
- API
- Hooks
- Modals em fases futuras

## 16. Padrão visual

O React futuro deve usar o shell existente:

- barra lateral + barra horizontal em L
- `BranaActionTopbar`
- `auxiliary-shell-button`
- classes do shell global

Referência principal: `Configurações -> Plano de contas`

## 17. Dependências secundárias

- `cc-panel` = tela principal legado
- `cc-modal-backdrop` = criação/edição
- `rcc-panel` = relatório/pesquisa
- `rview-panel` = visualização/impressão

A primeira implementação React cobre apenas a tela principal.

## 18. Riscos

- tenant
- legado sem prestador
- inconsistência conta/prestador
- permissões
- integração futura com comissão/repasse
- compatibilidade com frontend legado

