# Unidades - Subetapa 6: wrapper de `telefonePadrao`

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da alteração: **não limpo**; havia `frontend/app.js` modificado no momento em que esta subetapa foi iniciada
- Arquivos analisados: `frontend/app.js`, `frontend/js/modules/unidades.js`, `frontend/index.html`
- Arquivos alterados: `frontend/app.js`, `docs/unidades_subetapa_6_wrapper_telefone_padrao.md`

## Contrato real encontrado no módulo

- `window.BranaUnidadesModule`
- `window.BranaUnidadesModule.helpers`
- Helper real usado nesta etapa: `window.BranaUnidadesModule.helpers.telefonePadrao`

## Função alterada no app.js

- `unidadeTelefonePadrao(idx, tipos)` na definição ativa de `frontend/app.js`

## Lógica aplicada

- A função continua existindo no `app.js`
- O wrapper tenta usar o helper modular carregado em `window.BranaUnidadesModule.helpers.telefonePadrao`
- Se o helper modular existir e executar com sucesso, o retorno dele é usado
- Se o helper modular não existir, lançar erro ou estiver indisponível, o wrapper cai no fallback local
- O fallback local foi preservado como `FICHA_TIPOS_FONE_PADRAO[idx - 1] || ""`
- Quando `tipos` não é informado pelo fluxo atual, o wrapper usa `FICHA_TIPOS_FONE_PADRAO` como lista base para manter o comportamento e ainda permitir a delegação opcional ao módulo

## Confirmações

- `unidadeTelefonePadrao` continua existindo no `app.js`: sim
- Nenhuma função foi removida do `app.js`: confirmado
- `frontend/js/modules/unidades.js` foi alterado nesta etapa: não
- `frontend/index.html` foi alterado nesta etapa: não
- Nenhum comportamento funcional foi deslocado do `app.js`: confirmado
- O módulo continua sem eventos, DOM, fetch/API ou endpoint: confirmado
- O duplo clique de Unidades não foi alterado: confirmado
- `unidadeStatusHtml` não foi alterado nesta etapa: confirmado
- `unidadeFmtCodigo` não foi alterado nesta etapa: confirmado
- Combos/selects não foram alterados: confirmado
- `unidadeSetOptions` não foi alterada: confirmado
- `unidadeCarregarTiposLogradouroV2` não foi alterada: confirmado
- `unidadeAbrirModal` não foi alterada: confirmado
- `unidadeRender` não foi alterada: confirmado
- Modal, campos de telefone e payload não foram alterados: confirmado

## Validações

- `node --check frontend/app.js`: sem erros
- `node --check frontend/js/modules/unidades.js`: sem erros

## Riscos residuais

- A delegação para o helper modular depende de `window.BranaUnidadesModule.helpers.telefonePadrao` permanecer estável
- Se o contrato do módulo mudar no futuro, o fallback local continua cobrindo a exibição dos telefones

## Teste manual recomendado

- Abrir `Cadastro > Unidades de atendimento`
- Fazer recarga limpa do navegador
- Abrir o modal de nova unidade e confirmar que os telefones continuam preenchidos como antes
- Confirmar que o botão `Altera...` e o duplo-clique continuam funcionando como já estavam

## Próxima subetapa recomendada

- Seguir com a próxima wrapper controlada apenas se houver outro helper puro realmente seguro para reaproveitar
