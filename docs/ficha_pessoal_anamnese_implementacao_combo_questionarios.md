# Ficha Pessoal — Implementação do combo de questionários da aba Anamnese

## 1. Contexto

A aba `Anamnese` da `Ficha Pessoal` já havia sido diagnosticada no documento comparativo EasyDental x Brana Cloud e o contrato seguro para a próxima fronteira foi fechado em `FICHA-ANAM-CONTR-A`.

Após a validação da correção emergencial da regressão global causada pela tentativa anterior de integração da toolbar de `Anotações`, esta etapa implementa apenas o recorte seguro definido para `Anamnese`: combo visível de questionários e carregamento controlado, sem tocar em backend, banco, payload ou formato de salvamento.

## 2. Base documental usada

- `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`
- `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`
- `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

## 3. Decisão aplicada

`FICHA-ANAM-CONTR-A`

## 4. Escopo implementado

A implementação foi pequena e conservadora, limitada à aba `Anamnese` da `Ficha Pessoal`.

Foi adicionado um combo visível de questionários na aba clínica e a troca desse combo passa a recarregar perguntas/respostas usando a estrutura já existente.

O campo textual de resposta/observação clínica foi preservado.

O salvamento textual atual em `anamnese_respostas.resposta` foi preservado.

## 5. Arquivos alterados

- `frontend/app.js`
- `docs/ficha_pessoal_anamnese_implementacao_combo_questionarios.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. Backup criado

Backup manual criado em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_combo_questionarios/frontend/app.js`

## 7. Confirmações

- `frontend/app.js` alterado somente no trecho da aba Anamnese;
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
- permissões não alteradas;
- Anotações não alterada;
- Histórico não alterado.

## 8. Como o combo foi alimentado

O combo foi alimentado pela API já existente de anamnese, por meio de leitura de questionários da clínica atual.

A lista é carregada a partir de `/anamnese/questionarios` e renderizada na própria aba clínica.

Se não houver questionários, a aba mantém comportamento seguro e o combo fica sem opção útil, sem quebrar a tela.

## 9. Como a troca de questionário recarrega perguntas/respostas

A troca do combo atualiza o questionário ativo da aba e chama novamente o fluxo de carga da anamnese.

Esse fluxo usa a API já existente de respostas do paciente e preserva o carregamento das perguntas/respostas do questionário escolhido.

## 10. Como o salvamento textual atual foi preservado

O salvamento continua baseado no texto puro já existente em `anamnese_respostas.resposta`.

Não houve mudança de contrato de persistência, nem alteração de payload, nem alteração de backend/banco.

## 11. Como foi evitada regressão global

- não foi criado preloader global;
- não foi criado módulo novo;
- não houve integração por efeito colateral no boot;
- a lógica ficou restrita ao contexto da aba `Anamnese` da `Ficha Pessoal`;
- o `frontend/app.js` permaneceu como fachada e ponto de integração local da aba;
- a validação da regressão anterior da aba `Anotações` foi usada como limite de segurança.

## 12. Fallbacks defensivos implementados

- se não houver paciente aberto, a carga não executa fluxo perigoso;
- se a API falhar ao listar questionários, a aba não quebra;
- se não houver questionários, o combo fica sem conteúdo útil e a aba continua funcional;
- se faltar elemento DOM, a lógica não lança erro global;
- se a troca do combo não produzir seleção válida, o fluxo preserva o comportamento seguro.

## 13. Como testar manualmente

1. Abrir o sistema.
2. Fazer login.
3. Confirmar que os menus principais respondem.
4. Testar o botão `Sair`.
5. Entrar novamente.
6. Abrir `Ficha Pessoal`.
7. Abrir um paciente existente.
8. Entrar na aba `Anamnese`.
9. Confirmar se aparece o combo de questionários.
10. Trocar o questionário no combo.
11. Confirmar se perguntas/respostas carregam.
12. Registrar ou editar uma resposta textual simples, se o fluxo atual permitir.
13. Gravar usando o comportamento atual.
14. Sair da ficha ou trocar de paciente.
15. Voltar ao mesmo paciente e conferir persistência.
16. Alternar entre `Dados pessoais`, `Dados complementares`, `Anotações`, `Anamnese` e `Histórico`.
17. Confirmar que `Anotações` continua como antes.
18. Confirmar que `Histórico` continua como antes.
19. Confirmar que menus globais e botão `Sair` continuam funcionando.

## 14. Riscos remanescentes

- a aba `Anamnese` continua sensível por compartilhar a `Ficha Pessoal` extensa;
- `frontend/app.js` ainda concentra bastante lógica funcional;
- a persistência textual atual continua simples e pode não cobrir tudo que o EasyDental exibe visualmente;
- a próxima etapa ainda deve ser tratada com contrato específico, sem subir risco para backend/banco.

## 15. Plano de retorno manual usando backup

Se houver qualquer regressão, o retorno deve partir do backup manual criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_combo_questionarios/`, com prioridade para restaurar `frontend/app.js` ao estado salvo antes desta alteração.

## 16. Registro para roadmap

- A aba `Anamnese` recebeu a primeira implementação prática segura do contrato `FICHA-ANAM-CONTR-A`.
- O combo visível de questionários foi adicionado.
- O carregamento controlado de perguntas/respostas passou a usar a estrutura já existente.
- O salvamento textual atual foi preservado.
- Backend, banco, payload e `requestJson` permaneceram inalterados.
- O backup obrigatório foi criado.
- O novo documento é `docs/ficha_pessoal_anamnese_implementacao_combo_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.