# Ficha Pessoal — Contrato da aba Anamnese — combo de questionários e carregamento controlado

## 1. Contexto

A aba `Anamnese` da `Ficha Pessoal` já foi diagnosticada no documento `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md` e a regressão global da aba `Anotações` já foi validada como corrigida no documento `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`.

Esta nova etapa abre o contrato seguro para a próxima fronteira da aba `Anamnese`, sem implementar nada nesta rodada.

## 2. Base documental usada

- `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`
- `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`

## 3. Escopo desta etapa documental

Esta etapa é somente documental / contratual.

Não implementa nada. Não altera código. Não altera banco. Não altera `frontend/app.js`. Não altera `frontend/index.html`. Não altera `frontend/js/modules`. Não altera backend. Não altera schema/migrations/seeds/endpoints. Não altera `.env`. Não altera `requestJson`. Não altera payload. Não altera salvamento. Não altera exclusão. Não altera permissões.

## 4. Relação com a regressão anterior da aba Anotações

A regressão da aba `Anotações` mostrou que integração global no boot da aplicação pode quebrar menus inteiros.

Por isso, este contrato para `Anamnese` exige cautela reforçada:

- nada de integração global automática;
- nada de carregamento por efeito colateral no boot;
- nada de módulo novo sem consumo real e sem contrato;
- nada de repetir a estratégia que causou regressão global.

## 5. Confirmações de não alteração

- nenhum código alterado;
- `frontend/app.js` não alterado;
- `frontend/index.html` não alterado;
- `frontend/js/modules` não alterado;
- backend não alterado;
- banco não alterado;
- schema/migrations/seeds/endpoints não alterados;
- `.env` não alterado;
- `requestJson` não alterado;
- payload não alterado;
- salvamento não alterado;
- exclusão não alterada;
- permissões não alteradas.

## 6. Caminhos avaliados

### Caminho A
Primeira implementação futura limitada ao combo visível de questionários e carregamento controlado usando a estrutura já existente, sem alterar backend, banco, payload ou formato de salvamento.

### Caminho B
Implementação futura com reorganização visual maior da aba, ainda sem backend/banco, mas com risco médio/alto.

### Caminho C
Pausa da implementação por risco alto.

### Caminho D
Contrato profundo envolvendo backend/banco/payload antes de qualquer UI.

## 7. Decisão final recomendada

**FICHA-ANAM-CONTR-A**

A decisão recomendada é permitir uma primeira implementação futura limitada ao combo visível de questionários e ao carregamento controlado com a estrutura já existente, sem alterar backend, banco, payload ou formato de salvamento.

## 8. Objetivo funcional mínimo da futura implementação

Exibir na aba clínica da `Ficha Pessoal` um combo visível de questionários e, ao trocar o questionário, carregar perguntas/respostas usando os endpoints já existentes, preservando o salvamento textual atual.

## 9. Escopo permitido da futura implementação

- adicionar combo visível de questionários na aba clínica;
- usar endpoints já existentes, se confirmados;
- carregar perguntas/respostas do questionário selecionado;
- preservar o textarea/campo textual de resposta atual;
- preservar o formato textual atual;
- manter o salvamento atual;
- manter fallback para questionário padrão;
- manter `app.js` defensivo;
- evitar preloader global;
- documentar onde testar.

## 10. Escopo proibido da futura implementação

- backend;
- banco;
- migrations;
- seeds;
- endpoints;
- `.env`;
- alteração de `requestJson`;
- alteração de payload;
- alteração de formato de salvamento;
- exclusão;
- permissões;
- `Anotações`;
- `Histórico`;
- `Editor de Textos`;
- `Agenda`;
- `Financeiro`;
- demais abas da `Ficha Pessoal`;
- Sim/Não estruturado com novo formato;
- campo complementar separado com novo formato;
- motor novo de alertas clínicos;
- integração global no boot;
- conversão de dados existentes.

## 11. Estratégia para combo de questionários

O combo visível deve ser alimentado pelos questionários já existentes na API de anamnese.

Se o backend retornar questionários da clínica atual, a UI da ficha deve apenas apresentar a lista e permitir a troca de seleção, sem alterar a estrutura de dados persistida.

## 12. Estratégia para carregamento de perguntas/respostas

A troca de questionário deve recarregar as perguntas e as respostas da ficha com os endpoints já existentes:

- `GET /anamnese/pacientes/{id}/respostas`;
- com `questionario_id` quando necessário;
- mantendo a leitura e gravação em texto puro.

A primeira implementação futura não deve introduzir Sim/Não estruturado nem um complemento separado por pergunta.

## 13. Estratégia para preservação do salvamento atual

O salvamento atual deve continuar usando o formato textual existente em `anamnese_respostas.resposta`.

A primeira implementação futura deve apenas preservar a persistência atual e, no máximo, organizar a seleção visual e o carregamento controlado, sem alterar contrato de gravação.

## 14. Estratégia para evitar alteração de backend/banco/payload

- não criar novos campos;
- não alterar schema;
- não criar migration;
- não criar seed;
- não mudar payload;
- não mudar formato de resposta;
- não mudar contrato do endpoint atual;
- não introduzir nova entidade persistente para a primeira implementação.

## 15. Estratégia para evitar regressão global

- não carregar a lógica por efeito colateral no boot da aplicação;
- não integrar a aba por script global que execute em todo o sistema;
- manter o recorte apenas na aba `Anamnese` da `Ficha Pessoal`;
- usar ponto de entrada bem definido, com fallback defensivo;
- validar manualmente menus e navegação geral antes de reabrir a aba.

## 16. Estratégia de modularização futura, se aplicável

Se for criado um módulo dedicado no futuro, ele deve nascer para a aba `Anamnese` da `Ficha Pessoal` e ser consumido apenas nesse contexto, sem integração global no boot.

Sugestão conceitual futura: `frontend/js/modules/ficha_pessoal_anamnese.js`.

Nesta etapa, porém, não criar o arquivo e não criar namespace.

## 17. Estratégia de fachada/wrapper, se aplicável

`frontend/app.js` deve permanecer como fachada fina e defensiva.

Se houver módulo futuro, `app.js` deve apenas chamar a integração local da aba, sem assumir toda a lógica funcional.

## 18. Backup obrigatório antes de futura implementação

Definir backup manual obrigatório em:

`backups_modularizacao/fase_2c/ficha_pessoal_anamnese_combo_questionarios/`

O backup futuro deve incluir no mínimo:

- `frontend/app.js`

E, se houver alteração futura:

- `frontend/js/modules/ficha_pessoal_anamnese.js`
- `frontend/js/modules/anamnese.js`

Backup não substitui commit.
Backup não autoriza `git reset`, `git restore`, `git clean` ou `git revert`.

## 19. Plano de retorno manual

Se a implementação futura falhar, o retorno deve priorizar a restauração do comportamento global da aplicação antes de qualquer nova tentativa na aba `Anamnese`.

## 20. Testes manuais futuros

- login;
- menus principais;
- botão `Sair`;
- `Ficha Pessoal`;
- abertura de paciente;
- aba `Anamnese`;
- seleção de questionário;
- carregamento de perguntas/respostas;
- gravação simples;
- alternância entre `Dados pessoais`, `Dados complementares`, `Anotações`, `Anamnese` e `Histórico`;
- reabertura para validar persistência.

## 21. Riscos remanescentes

- `frontend/js/modules/anamnese.js` permanece passivo e sem consumo funcional nesta etapa;
- a aba `Anamnese` continua sensível por estar junto de uma ficha extensa e acoplada;
- a persistência textual atual ainda é simples e pode não reproduzir toda a experiência do EasyDental;
- uma integração mais profunda ainda pode exigir novo contrato.

## 22. Próxima etapa recomendada

A próxima etapa recomendada é uma primeira implementação futura limitada ao **Caminho A**.

Se o projeto precisar de algo além disso, deve-se abrir novo contrato antes de tocar em payload, backend ou banco.

## 23. Registro para roadmap

Este contrato registra a trilha segura para a aba `Anamnese` da `Ficha Pessoal`.

- A decisão recomendada é `FICHA-ANAM-CONTR-A`.
- O foco da primeira implementação futura deve ser o combo visível de questionários e o carregamento controlado.
- O salvamento textual atual deve ser preservado.
- Backend, banco, payload e `requestJson` não devem ser alterados nesta fase.
- O novo documento é `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.