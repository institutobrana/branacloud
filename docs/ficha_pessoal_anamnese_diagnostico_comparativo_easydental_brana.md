# Ficha Pessoal — Diagnóstico comparativo da aba Anamnese — EasyDental x Brana Cloud

## 1. Contexto

A aba `Anamnese` da `Ficha Pessoal` passou por uma análise documental após a pausa da Fase 2C ampla pela decisão `F2C-CURTA3-E`.

A aba `Anotações` já havia sido diagnosticada, recebeu tentativa de integração de toolbar, gerou regressão global e foi restaurada pelo commit emergencial `8090f21`. A validação posterior confirmou que o sistema voltou a funcionar e que a toolbar de `Anotações` deve permanecer pausada/desativada.

Esta etapa inicia uma análise separada para a aba `Anamnese`, sem reutilizar automaticamente a estratégia da aba `Anotações`.

## 2. Escopo desta etapa

Esta etapa é somente documental / diagnóstica.

Não implementa nada. Não altera código. Não altera banco. Não altera `frontend/app.js`. Não altera `frontend/index.html`. Não altera `frontend/js/modules`. Não altera backend. Não altera schema/migrations/seeds/endpoints. Não altera `.env`. Não altera `requestJson`. Não altera payload. Não altera salvamento. Não altera exclusão. Não altera permissões.

O objetivo é comparar o comportamento atual do Brana Cloud com o comportamento esperado inspirado no EasyDental virgem/legado, para decidir com segurança a próxima fronteira.

## 3. Relação com a regressão anterior da aba Anotações

A regressão anterior mostrou que integrar uma aba sensível direto no boot global da aplicação pode quebrar menus inteiros.

Por isso, esta análise trata `Anamnese` como frente separada, com cautela reforçada:

- sem integração global automática;
- sem módulo consumido por efeito colateral nesta etapa;
- sem tentar “corrigir” a UI antes do diagnóstico;
- sem assumir que o padrão de `Anotações` sirva como modelo.

## 4. Confirmações de não alteração

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

## 5. Mapeamento Brana Cloud atual

### 5.1 Onde a aba está implementada

A UI da aba `Anamnese` da `Ficha Pessoal` está em `frontend/app.js`.

A estrutura visual é montada por HTML direto inserido pelo próprio arquivo, com:

- título da área de perguntas;
- tabela de perguntas;
- textarea de resposta / observação clínica;
- alerta textual da anamnese;
- botão `Atualizar anamnese`.

### 5.2 Arquivos relacionados

- `frontend/app.js` — contém a aba da Ficha Pessoal, a lógica clínica da anamnese, a tela de configuração de questionários e os overrides que conectam tudo.
- `frontend/js/modules/anamnese.js` — namespace passivo, com helpers de validação e metadados, mas sem controlar o fluxo funcional nesta etapa.
- `frontend/index.html` — não contém a UI da aba; apenas carrega scripts e oferece ações do sistema.

### 5.3 Funções que montam a aba

Na Ficha Pessoal:

- `fichaAnamneseRender()`;
- `fichaAnamneseSelecionar()`;
- `fichaAnamneseCarregar()`;
- `fichaAnamneseSalvarSelecionada()`;
- `fichaAnamneseImprimir()`;
- `fichaEnsureUI()` com override para bind da aba.

Na configuração de anamnese:

- `anamneseEnsureUI()`;
- `anamneseRender()`;
- `anamneseCarregarQuestionarios()`;
- `anamneseCarregarPerguntas()`;
- `anamneseAbrirModalQuestionario()`;
- `anamneseAbrirModalPergunta()`;
- `anamneseSalvarQuestionario()`;
- `anamneseSalvarPergunta()`;
- `anamneseExcluirQuestionario()`;
- `anamneseExcluirPergunta()`;
- `anamneseRenumeraPerguntas()`;
- `anamneseVincularEventos()`;
- `anamneseAbrir()`.

### 5.4 Como a aba carrega perguntas e respostas

A lógica da Ficha Pessoal usa:

- `fichaAnamneseCarregar()` para ler respostas do paciente;
- `requestJson("GET", "/anamnese/pacientes/{id}/respostas")` com `questionario_id` opcional;
- `fichaAnamneseRender()` para montar a lista de perguntas e destacar a pergunta selecionada;
- `fichaAnamneseSelecionar()` para carregar a resposta da linha clicada no textarea;
- `fichaAnamneseSalvarSelecionada()` para gravar a resposta selecionada.

A configuração de questionários usa:

- `anamneseCarregarQuestionarios()` para ler questionários;
- `anamneseCarregarPerguntas()` para ler perguntas do questionário ativo;
- `anamneseRenderQuestionarios()` para popular o combo interno de configuração;
- `anamneseAbrirModalQuestionario()` e `anamneseAbrirModalPergunta()` para edição;
- `anamneseSalvarQuestionario()` e `anamneseSalvarPergunta()` para persistência;
- `anamneseExcluirQuestionario()` e `anamneseExcluirPergunta()` para exclusão;
- `anamneseRenumeraPerguntas()` para reordenar perguntas.

### 5.5 O que faz o botão Atualizar anamnese

O botão `Atualizar anamnese` chama:

1. `fichaAnamneseSalvarSelecionada()`;
2. `fichaAnamneseCarregar()`;
3. `fichaAnamneseImprimir()` se o usuário atual puder imprimir.

Na prática, ele salva a resposta da pergunta selecionada, recarrega o conjunto clínico e, para a conta autorizada, imprime a anamnese.

### 5.6 Existe combo de questionário ou equivalente?

Na configuração de anamnese, sim: existe o combo `anamneseCfg.cboQuestionario` na tela de administração de questionários.

Na aba clínica da `Ficha Pessoal`, não há um combo visível equivalente no trecho analisado; a seleção do questionário é controlada por estado interno (`fichaAnamneseQuestionarioId`) e pela API, que aceita `questionario_id` opcional.

### 5.7 Existe módulo separado de Anamneses?

Existe o namespace passivo `frontend/js/modules/anamnese.js`, mas ele não assume o fluxo funcional nesta etapa.

Ele expõe apenas helpers de validação e metadados, enquanto `frontend/app.js` continua sendo a fonte funcional da verdade.

### 5.8 Existem telas/cadastros de questionários de anamnese?

Sim.

A própria `frontend/app.js` contém a tela de configuração de questionários/perguntas de anamnese, com:

- lista de questionários;
- modal de questionário;
- modal de pergunta;
- renumeração;
- exclusão;
- cópia de perguntas de questionário base.

### 5.9 A aba conversa com backend, banco, endpoints, requestJson, payload ou salvamento?

Sim.

A aba da Ficha Pessoal conversa com backend e banco por meio de:

- `requestJson`;
- `GET /anamnese/pacientes/{paciente_id}/respostas`;
- `PUT /anamnese/pacientes/{paciente_id}/respostas`.

A tela de configuração conversa com:

- `GET /anamnese/questionarios`;
- `POST /anamnese/questionarios`;
- `PUT /anamnese/questionarios/{id}`;
- `DELETE /anamnese/questionarios/{id}`;
- `GET /anamnese/questionarios/{id}/perguntas`;
- `POST /anamnese/questionarios/{id}/perguntas`;
- `PUT /anamnese/perguntas/{id}`;
- `DELETE /anamnese/perguntas/{id}`;
- `POST /anamnese/questionarios/{id}/renumerar`.

### 5.10 Há acoplamento com outros módulos?

Sim.

Há acoplamento com:

- `Ficha Pessoal`;
- `Pacientes`;
- `Anotações` apenas como outra aba da ficha, mas sem dependência direta identificada nesta etapa;
- `Histórico` apenas como outra aba da mesma ficha;
- `Editor de Textos` apenas na infraestrutura geral da aplicação, não como dependência da aba;
- `Agenda` e demais módulos somente como contexto global da aplicação, não como dependência direta comprovada.

### 5.11 Há namespace passivo ou módulo já existente relacionado?

Sim: `frontend/js/modules/anamnese.js`.

Porém ele está marcado como passivo e não controla o fluxo funcional nesta etapa.

### 5.12 Há funções antigas ou parcialmente implementadas não consumidas?

Há sinais de acoplamento histórico e reuso parcial:

- o módulo passivo mapeia funções monolíticas antigas;
- `frontend/app.js` ainda concentra a lógica funcional;
- a aba da Ficha Pessoal usa overrides e estado interno próprio;
- o carregamento da resposta do paciente e a configuração de questionários vivem em fluxos distintos dentro do mesmo arquivo.

## 6. Mapeamento backend/banco atual, somente leitura

### 6.1 Modelos e tabelas relacionados

- `backend/models/anamnese.py`
  - `AnamneseQuestionario` -> `anamnese_questionarios`
  - `AnamnesePergunta` -> `anamnese_perguntas`
- `backend/models/anamnese_resposta.py`
  - `AnamneseResposta` -> `anamnese_respostas`
- `backend/models/paciente.py`
  - `Paciente.anotacoes` existe, mas não é a estrutura da anamnese; a anamnese usa tabela própria de respostas.

### 6.2 Rotas/endpoints existentes

`backend/routes/anamnese_routes.py` expõe rotas para:

- listar questionários;
- criar, editar e excluir questionários;
- listar, criar, editar, excluir e renumerar perguntas;
- listar respostas por paciente;
- salvar resposta do paciente.

### 6.3 Campos e schemas relevantes

- `AnamneseQuestionario`: `id`, `clinica_id`, `nome`, `ativo`, `ordem`.
- `AnamnesePergunta`: `id`, `clinica_id`, `questionario_id`, `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta`, `ativo`.
- `AnamneseResposta`: `id`, `clinica_id`, `paciente_id`, `questionario_id`, `pergunta_id`, `resposta`.

### 6.4 Se respostas são por paciente

Sim.

O backend usa `paciente_id` em `anamnese_respostas` e o endpoint `/anamnese/pacientes/{paciente_id}/respostas`.

### 6.5 Se perguntas vêm de questionários/modelos

Sim.

As perguntas pertencem a um `questionario_id` e são listadas por questionário.

### 6.6 Se há conceito de questionário/tabela de anamnese

Sim.

O próprio modelo e as rotas confirmam o conceito de questionário com perguntas associadas e respostas por paciente.

### 6.7 Se há alertas derivados das respostas

Há campo `mensagem_alerta` em `anamnese_perguntas`, mas nesta etapa não foi identificado mecanismo clínico complexo de alerta por regra.

Na Ficha Pessoal atual, o alerta visual exibido é um texto-resumo baseado na quantidade de respostas preenchidas, não um alerta clínico derivado de regra específica.

### 6.8 Hotfix de startup encontrado

`backend/main.py` contém hotfix de compatibilidade para `anamnese_perguntas`, adicionando/normalizando colunas críticas como `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`.

Isso confirma que a área ainda carrega dívida técnica e compatibilidade com bancos antigos.

## 7. Mapeamento EasyDental virgem/legado, se possível

Não foi localizada UI direta do EasyDental para a aba `Anamnese` neste workspace.

A comparação possível veio de material de descoberta legado e de documentação histórica, sobretudo:

- `docs/sqlserver_anamnese_descoberta_eds70.sql`;
- `docs/_historico_auditoria/05_banco_dados.md`;
- `docs/_historico_auditoria/04_funcionalidades.md`;
- `frontend/js/modules/anamnese.js` como referência de questionários recuperados da clínica 1.

### 7.1 Tabelas/campos que parecem armazenar questionários

- `anamnese_questionarios`
- campo `nome`
- campo `ordem`
- vínculo por `clinica_id`

### 7.2 Tabelas/campos que parecem armazenar perguntas

- `anamnese_perguntas`
- campo `questionario_id`
- campo `numero`
- campo `texto`
- campo `tipo_pergunta`
- campo `tipo_resposta`
- campo `mensagem_alerta`

### 7.3 Tabelas/campos que parecem armazenar respostas do paciente

- `anamnese_respostas`
- `paciente_id`
- `questionario_id`
- `pergunta_id`
- `resposta`

### 7.4 Vínculo entre paciente, questionário, pergunta e resposta

Sim.

O modelo é coerente com a cadeia:

- paciente;
- questionário;
- perguntas do questionário;
- respostas por paciente/pergunta.

### 7.5 Respostas Sim/Não e campo complementar

O workspace confirma apenas que `resposta` é textual no banco.

Não foi encontrado, nesta análise, um campo separado e explícito de complemento de resposta na tabela `anamnese_respostas`.

### 7.6 O questionário selecionado vem de um módulo de cadastro de Anamneses?

Sim, em termos de arquitetura, o cadastro de questionários acontece no próprio módulo de anamnese do Brana Cloud.

No legado, os nomes recuperados sugerem o mesmo conceito de questionários-modelo como `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saúde` e `Anamnese pessoal`.

### 7.7 Nomes observados nos artefatos de descoberta

- `Principal`
- `Implante`
- `Ficha complementar`
- `Anamnese de Saúde`
- `Anamnese pessoal`

Esses nomes aparecem em `docs/sqlserver_anamnese_descoberta_eds70.sql` e no namespace passivo de anamnese como lista de questionários recuperados para a clínica 1.

## 8. Matriz comparativa EasyDental x Brana Cloud

| Item | EasyDental esperado | Brana Cloud atual | Diferença encontrada | Risco da correção | Recomendação futura |
| --- | --- | --- | --- | --- | --- |
| Seleção de questionário | Combo visível com modelos/questionários | Questionário existe no fluxo de configuração e a Ficha usa estado interno/API, sem combo visível na aba clínica | Falta um equivalente visual explícito na aba clínica | Médio | Contrato específico para questionário visível, se realmente necessário |
| Lista de perguntas | Perguntas carregadas conforme o questionário | Perguntas vêm de `/anamnese/questionarios/{id}/perguntas` e são listadas em tabela | Estrutura existe, mas o layout é minimalista | Médio | Contrato específico para renderização e navegação da lista |
| Respostas por pergunta | Sim/Não + observação/complemento por item | Resposta é um textarea único da pergunta selecionada | Falta estrutura explícita por pergunta e campos separados | Alto | Contrato específico de carregamento/salvamento antes de qualquer mudança |
| Alertas clínicos | Regras e avisos por resposta | A tela mostra alerta textual genérico baseado em contagem de respostas | Falta regra clínica real de alerta | Médio/alto | Diagnóstico funcional antes de mexer em alertas |
| Persistência | Respostas por paciente e questionário | Existe PUT em `/anamnese/pacientes/{id}/respostas` | Persistência está presente, mas textual e simples | Médio | Revisão do contrato de payload e comportamento |
| Backend | Serviço de questionários, perguntas e respostas | Existe e está ativo | Compatível em estrutura | Médio | Manter leitura somente até novo contrato |
| Banco | Tabelas normalizadas por questionário/pergunta/resposta | Tabelas existem | Compatível, com dívida técnica | Médio | Evitar mudanças sem migration formal |
| UI global | Painel estável e específico da aba | Aaba da ficha e a área de configuração convivem no mesmo `app.js` | Alto acoplamento no frontend | Alto | Evitar boot global novo; usar recorte pequeno e isolado |
| Regressões | Não quebrar menus globais | A regressão anterior de `Anotações` mostrou risco real | Risco confirmado | Alto | Não repetir integração global sem contrato mais forte |

## 9. Lista dos recursos ausentes ou incompletos na aba Anamnese do Brana Cloud

- combo visível de questionário na aba clínica da ficha;
- resposta estruturada em Sim/Não por pergunta;
- complemento/observação separado por pergunta;
- alerta clínico derivado de regra explícita;
- módulo passivo com consumo real da aba;
- separação clara entre UI clínica e UI administrativa;
- isolamento de carregamento para evitar regressão global no boot.

## 10. Avaliação do conceito de questionários/modelos de anamnese

O conceito existe e está estruturado no backend: questionários contêm perguntas e respostas pertencem ao paciente e ao questionário.

No Brana Cloud, porém, a aba clínica atual não reproduz de forma visível o padrão do EasyDental com combo explícito e fluxo por pergunta do mesmo jeito que o usuário descreveu.

Conclusão: o conceito é suportado, mas a representação visual/funcional da aba clínica ainda é mais simples e menos explícita do que o legado esperado.

## 11. Avaliação do carregamento de perguntas

Existe carregamento real por API.

Pontos positivos:

- questionário carregado por backend;
- perguntas carregadas a partir do questionário selecionado;
- tabela de perguntas é renderizada na ficha.

Pontos de atenção:

- a seleção do questionário na aba clínica não está visualmente clara neste trecho;
- o fluxo depende de estado interno;
- a relação entre pergunta selecionada e resposta é simples demais para uma comparação rica com o EasyDental.

## 12. Avaliação do salvamento de respostas

Existe salvamento real.

- `fichaAnamneseSalvarSelecionada()` faz `PUT` em `/anamnese/pacientes/{paciente_id}/respostas`;
- o payload contém `pergunta_id` e `resposta`;
- a persistência é textual.

Ponto de atenção: não há, nesta etapa, prova de que o sistema salva uma resposta estruturada Sim/Não + complemento separado por pergunta.

## 13. Avaliação de alertas de anamnese

Há um alerta visual simples: a ficha mostra texto indicando que há ou não respostas registradas.

Não foi identificado, nesta etapa, um mecanismo de alerta clínico baseado em regras de pergunta/resposta como um motor de alerta real.

## 14. Avaliação de acoplamentos

Acoplamentos encontrados:

- `Ficha Pessoal` concentra a UI clínica e a configuração administrativa;
- `frontend/app.js` concentra o fluxo funcional;
- `frontend/js/modules/anamnese.js` é passivo e não governa a tela clínica;
- `requestJson` conecta a aba diretamente ao backend;
- `backend/main.py` possui hotfix de compatibilidade para anamnese;
- `anamnese_respostas` é a tabela de persistência principal.

Acoplamentos não comprovados nesta etapa:

- dependência direta com `Anotações`;
- dependência direta com `Histórico`;
- dependência direta com `Editor de Textos`;
- dependência direta com `Agenda`.

## 15. Riscos identificados

- risco visual/local: médio;
- risco de carregamento de questionários: médio;
- risco de carregamento de perguntas: médio/alto;
- risco de salvamento de respostas: alto;
- risco de payload/requestJson: alto;
- risco backend: alto;
- risco banco: alto;
- risco de perda de dados: alto;
- risco de regressão global do frontend: médio/alto;
- risco de regressão em outras abas da Ficha Pessoal: médio.

## 16. Recomendação da próxima etapa

A próxima etapa recomendada é um contrato específico para a aba `Anamnese` com foco em carregamento de questionários/perguntas e persistência de respostas, **sem** implementação imediata.

Se a prioridade for máxima segurança, a frente deve ficar pausada até existir um contrato mais profundo que separe claramente:

- visual da aba clínica;
- carregamento de questionários;
- carregamento de perguntas;
- salvamento de respostas;
- alertas derivados.

## 17. Onde testar futuramente no sistema, quando houver implementação

- login;
- menus principais;
- botão `Sair`;
- `Ficha Pessoal`;
- abertura de paciente;
- aba `Anamnese`;
- alternância entre `Dados pessoais`, `Dados complementares`, `Anotações`, `Anamnese` e `Histórico`;
- carregamento do questionário;
- carregamento das perguntas;
- salvamento simples de resposta;
- reabertura do paciente para confirmar persistência.

## 18. Registro para roadmap

Este diagnóstico registra a análise comparativa da aba `Anamnese` da `Ficha Pessoal` no Brana Cloud em relação ao comportamento esperado inspirado no EasyDental virgem/legado.

- O Brana Cloud já possui estrutura funcional para questionários, perguntas e respostas.
- A aba clínica usa `requestJson`, tabelas e textarea de resposta/observação clínica.
- O backend possui modelos e rotas dedicados, além de hotfix de startup para compatibilidade.
- O legado disponível no workspace confirma os nomes de questionários `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saúde` e `Anamnese pessoal`.
- Não foi localizada UI direta do EasyDental neste workspace.
- O maior risco está no salvamento, no payload, no acoplamento do frontend e em possível regressão global.
- O novo documento é `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`.
- Nenhum backend, banco, payload, `requestJson` ou persistência foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.