# Ficha Pessoal — Validação da correção emergencial da regressão global da aba Anotações

## 1. Contexto

Após a tentativa de integração da toolbar da aba `Anotações` da `Ficha Pessoal`, registrada no commit `721d9e7dd9d8d2341705dcb1b7a541f29a468d52`, o sistema passou a fazer login normalmente, mas os menus e botões deixaram de responder, inclusive o botão `Sair`.

A correção emergencial foi registrada no commit `8090f21`, com restauração manual de `frontend/app.js` a partir do backup controlado.

## 2. Commit que causou a regressão provável

- `721d9e7dd9d8d2341705dcb1b7a541f29a468d52`

## 3. Commit da correção emergencial

- `8090f21`

## 4. Sintoma original

- login funcionava;
- menus não respondiam;
- botões não respondiam;
- botão `Sair` não funcionava.

## 5. Correção aplicada

- restauração manual de `frontend/app.js` a partir do backup controlado;
- módulo `frontend/js/modules/ficha_pessoal_anotacoes.js` permaneceu no disco, mas sem consumo prático;
- toolbar de `Anotações` ficou pausada.

## 6. Resultado da validação manual

- sistema voltou a funcionar como estava antes;
- menus voltaram a responder;
- botão `Sair` voltou a funcionar;
- fluxo global voltou ao comportamento anterior.

## 7. Decisão pós-validação

A toolbar da aba `Anotações` deve permanecer pausada/desativada.

Não fazer nova tentativa imediata.

Qualquer nova tentativa deve exigir novo diagnóstico/contrato com isolamento maior, preferencialmente sem integração global no boot da aplicação.

## 8. Confirmações de não alteração

- nenhum código alterado;
- `frontend/app.js` não alterado nesta validação;
- `frontend/index.html` não alterado;
- `frontend/js/modules` não alterado;
- backend não alterado;
- banco não alterado;
- schema/migrations/seeds/endpoints não alterados;
- `.env` não alterado;
- `requestJson` não alterado;
- payload não alterado;
- formato de salvamento não alterado;
- exclusão não alterada;
- permissões não alteradas.

## 9. Risco remanescente

- `frontend/js/modules/ficha_pessoal_anotacoes.js` permanece no disco sem consumo prático;
- não deve ser reativado sem novo contrato;
- `Ficha Pessoal` continua sensível e deve ser tratada por recortes pequenos.

## 10. Próxima recomendação

Pausar a toolbar de `Anotações`.

Antes de avançar para `Anamnese` ou `Histórico`, abrir diagnóstico documental específico da próxima aba, sem reutilizar automaticamente a estratégia que causou regressão global.

## 11. Onde testar antes de prosseguir

- login;
- menus principais;
- botão `Sair`;
- `Ficha Pessoal`;
- abertura de paciente;
- abas `Dados pessoais`, `Dados complementares`, `Anotações`, `Anamnese` e `Histórico`;
- gravação simples em `Anotações`, se desejado, apenas no comportamento original.

## 12. Registro para roadmap

Esta validação documental confirma a correção emergencial da regressão global causada pela tentativa de integração da toolbar da aba `Anotações`.

- O sistema voltou a funcionar como estava antes.
- O login funciona.
- Os menus voltaram a responder.
- O botão `Sair` voltou a funcionar.
- A navegação geral voltou ao comportamento anterior.
- A toolbar de `Anotações` deve permanecer pausada/desativada por enquanto.
- O novo documento é `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`.
- Nenhum backend, banco, payload, `requestJson` ou persistência foi alterado nesta validação.
- A blindagem textual/mojibake foi respeitada.