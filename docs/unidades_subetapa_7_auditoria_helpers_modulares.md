# Unidades - Subetapa 7: auditoria final dos helpers modularizados

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da auditoria: limpo
- Arquivos analisados: `frontend/app.js`, `frontend/js/modules/unidades.js`, `frontend/index.html`
- Arquivos alterados: `docs/unidades_subetapa_7_auditoria_helpers_modulares.md`

## Carregamento no HTML

- `frontend/js/modules/unidades.js` está carregado no `frontend/index.html`
- O carregamento do módulo ocorre antes de `frontend/app.js`
- `frontend/app.js` continua carregado após o módulo
- Nenhum módulo antigo foi reativado indevidamente no `index.html`

## Namespace e contrato do módulo

- `window.BranaUnidadesModule` existe
- `window.BranaUnidadesModule.helpers.statusHtml` existe
- `window.BranaUnidadesModule.helpers.fmtCodigo` existe
- `window.BranaUnidadesModule.helpers.telefonePadrao` existe
- O módulo permanece passivo:
  - não registra eventos
  - não acessa DOM
  - não faz fetch/API
  - não altera endpoints
  - não sobrescreve funções globais funcionais

## Conferência dos wrappers no app.js

- `unidadeStatusHtml(ativo)` continua existindo
- `unidadeFmtCodigo(valor, idx)` continua existindo
- `unidadeTelefonePadrao(idx, tipos)` continua existindo
- Os 3 wrappers usam helpers modulares de forma opcional
- Os 3 wrappers preservam fallback local seguro
- Se `window.BranaUnidadesModule` não existir, o app.js continua funcional
- Se um helper modular lançar erro, o fallback local continua disponível

## Tabela de comparação

| Helper app.js | Helper modular | Wrapper opcional | Fallback local | Status |
|---|---|---|---|---|
| `unidadeStatusHtml(ativo)` | `window.BranaUnidadesModule.helpers.statusHtml` | Sim | Sim | OK |
| `unidadeFmtCodigo(valor, idx)` | `window.BranaUnidadesModule.helpers.fmtCodigo` | Sim | Sim | OK |
| `unidadeTelefonePadrao(idx, tipos)` | `window.BranaUnidadesModule.helpers.telefonePadrao` | Sim | Sim | OK |

## Confirmações funcionais

- Nenhum helper foi removido do `app.js`
- Nenhum comportamento funcional foi deslocado do `app.js`
- Renderização continua no `app.js`
- Eventos continuam no `app.js`
- Modal continua no `app.js`
- Salvar/excluir continuam no `app.js`
- O duplo clique corrigido não foi alterado
- Combos/selects/tipos de telefone/logradouro não foram alterados
- `unidadeSetOptions()` não foi alterada
- `unidadeCarregarTiposLogradouroV2()` não foi alterada
- `unidadeAbrirModal()` não foi alterada
- `unidadeRender()` não foi alterada

## Validações

- `node --check frontend/app.js`: sem erros
- `node --check frontend/js/modules/unidades.js`: sem erros

## Riscos residuais

- A auditoria confirma o contrato atual do módulo e os wrappers atuais do `app.js`, mas qualquer mudança futura no namespace do módulo exigirá nova conferência
- Como o módulo permanece passivo, o risco funcional segue baixo enquanto o `app.js` continuar como fonte oficial

## Teste manual recomendado

- Abrir `Cadastro > Unidades de atendimento`
- Fazer recarga limpa do navegador
- Confirmar que a grade abre normalmente
- Confirmar que o botão `Altera...` continua abrindo o modal
- Confirmar que o duplo clique continua abrindo o modal
- Abrir o modal de nova unidade e conferir que os telefones continuam com o mesmo comportamento

## Próxima subetapa recomendada

- Seguir para a próxima etapa apenas se houver outro helper puro realmente seguro para validação ou reaproveitamento
