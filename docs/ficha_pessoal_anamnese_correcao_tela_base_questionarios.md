# Ficha Pessoal â€” CorreÃ§Ã£o da tela base da Anamnese e combo de questionÃ¡rios

## 1. Contexto

A aba `Anamnese` da `Ficha Pessoal` jÃ¡ havia recebido uma primeira implementaÃ§Ã£o prÃ¡tica do contrato `FICHA-ANAM-CONTR-A`, com combo visÃ­vel de questionÃ¡rios e carregamento controlado.

ApÃ³s a nova validaÃ§Ã£o manual do usuÃ¡rio, ficou claro que a tela base ainda precisava de ajuste: o nome do paciente atual nÃ£o aparecia de forma clara dentro da prÃ³pria aba, a lista de perguntas precisava de rolagem e a abertura da aba sem paciente vÃ¡lido/salvo precisava ser bloqueada de forma mais segura.

TambÃ©m foi necessÃ¡rio confirmar novamente se havia material legado/virgem do EasyDental no workspace para servir de referÃªncia real. O que foi encontrado continuou sendo material documental e scripts legados, sem UI direta do EasyDental no workspace.

## 2. Prints e sintomas informados pelo usuÃ¡rio

### 2.1 Print do Brana Cloud

- a combo `QuestionÃ¡rio` aparece, mas o comportamento ainda nÃ£o corresponde ao esperado;
- antes a combo aparecia como `Sem questionÃ¡rios`;
- agora aparece `Principal`, mas a tela ainda nÃ£o reproduz o fluxo visual/fÃºncio nal esperado;
- a Ã¡rea inferior ainda nÃ£o reflete a lista de perguntas do questionÃ¡rio selecionado como deveria;
- a correÃ§Ã£o precisa comeÃ§ar pela tela base.

### 2.2 Print do EasyDental

- mostra o nome do paciente em campo/label destacado;
- mostra combo `QuestionÃ¡rio` preenchida;
- mostra perguntas listadas verticalmente;
- mostra rolagem vertical quando o questionÃ¡rio Ã© extenso;
- mostra respostas `Sim/NÃ£o` e campo complementar, mas isso Ã© apenas referÃªncia futura e nÃ£o faz parte desta etapa.

### 2.3 Print do EasyDental sem paciente salvo

- mostra a regra de bloqueio/aviso antes de abrir `Anamnese`/`HistÃ³rico`;
- a mensagem referÃªncia Ã© semelhante a: `Ã‰ necessÃ¡rio gravar o paciente antes. Deseja gravÃ¡-lo agora?`

## 3. ReferÃªncia visual/funcional do EasyDental

- nome do paciente em campo/label colorido;
- combo `QuestionÃ¡rio`;
- perguntas listadas verticalmente;
- barra de rolagem vertical;
- regra de paciente gravado antes de usar `Anamnese`/`HistÃ³rico`;
- `Sim/NÃ£o` e campo complementar apenas como referÃªncia futura, nÃ£o implementados agora.

## 4. SituaÃ§Ã£o observada no Brana Cloud

- a combo foi criada, mas ainda precisava de ajuste para refletir de forma segura a base de questionÃ¡rios da clÃ­nica;
- a tela ainda nÃ£o exibÃ­a com clareza o nome do paciente atual dentro da Ã¡rea de Anamnese;
- a lista de perguntas precisava de rolagem prÃ³pria para questionÃ¡rios maiores;
- a aba precisava ser impedida de abrir sem paciente vÃ¡lido/salvo;
- o botÃ£o `Procura` precisava continuar funcionando repetidamente sem quebrar o estado da ficha.

## 5. Commit causador / origem provÃ¡vel

- `e39d6a4` - Implementa combo de questionarios da anamnese.
- `58164d3` - Ajuste posterior com guarda de concorrÃªncia/carga.

## 6. Arquivos investigados

- `frontend/app.js`
- `backend/routes/anamnese_routes.py`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`
- `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`
- `docs/ficha_pessoal_anamnese_implementacao_combo_questionarios.md`
- `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

## 7. Fluxo verificado em ConfiguraÃ§Ãµes â†’ Anamnese

- o fluxo administrativo jÃ¡ lista questionÃ¡rios por clÃ­nica em `/anamnese/questionarios`;
- o cadastro/editaÃ§Ã£o de perguntas usa o mesmo namespace funcional de anamnese;
- a leitura de respostas por paciente Ã© feita por questionÃ¡rio ativo;
- a tela administrativa confirma que o contrato de anamnese jÃ¡ existe no backend.

## 8. Fluxo verificado no EasyDental virgem/legado

Foi reapresentada a revisÃ£o dos materiais legados/documentais disponÃ­veis no workspace.

Resultado:

- nÃ£o foi localizada UI direta do EasyDental para a aba `Anamnese` no workspace;
- o que existe Ã© evidÃªncia documental/legada e scripts de descoberta;
- os nomes de questionÃ¡rios recuperados/esperados continuam sendo `Principal`, `Implante`, `Ficha complementar`, `Anamnese de SaÃºde` e `Anamnese pessoal`;
- a relaÃ§Ã£o paciente/questionÃ¡rio/pergunta/resposta Ã© confirmada por backend e scripts legados;
- o bloqueio de paciente salvo Ã© consistente com a referÃªncia visual do EasyDental, mas sem UI direta comprovada neste workspace.

## 9. Causa encontrada para a combo nÃ£o listar corretamente todos os questionÃ¡rios

- a combo jÃ¡ vinha da rota correta, mas a tela ainda precisava de cabeÃ§alho/estado mais claro para evitar interpretaÃ§Ã£o errada do questionÃ¡rio ativo;
- havia risco de resposta antiga de carregamento sobrescrever seleÃ§Ã£o recente;
- a falta de uma guarda simples de concorrÃªncia podia deixar alerta/estado desatualizados;
- o contexto do paciente nÃ£o estava exposto de forma clara na prÃ³pria aba;
- a experiÃªncia visual ainda ficava aquÃ©m do que o usuÃ¡rio esperava do fluxo base.

## 10. Causa encontrada para a lista de perguntas nÃ£o carregar como esperado

- a aba dependia de carregamento assÃ­ncrono da anamnese sem um bloqueio forte por paciente vÃ¡lido;
- a troca de paciente/aba podia causar leituras fora de ordem;
- sem rolagem prÃ³pria, questionÃ¡rios longos nÃ£o tinham apresentaÃ§Ã£o adequada;
- o visual ainda era mais simples que o esperado na referÃªncia do EasyDental.

## 11. AvaliaÃ§Ã£o sobre identificaÃ§Ã£o visual do paciente atual

- a identificaÃ§Ã£o do paciente atual precisava ficar clara dentro da prÃ³pria Ã¡rea de Anamnese;
- o nome do paciente jÃ¡ existia na ficha, mas nÃ£o estava exibido de forma funcional no cabeÃ§alho da aba;
- foi considerado seguro exibir o nome atual em campo readonly, desde que sem alterar persistÃªncia nem causar duplicidade confusa;
- a identificaÃ§Ã£o visual atual passou a ser tratada como requisito da tela base.

## 12. AvaliaÃ§Ã£o sobre regra de paciente salvo antes de Anamnese/HistÃ³rico

- a regra do EasyDental tem equivalente funcional desejÃ¡vel no Brana Cloud;
- se nÃ£o houver paciente vÃ¡lido/salvo, a aba nÃ£o deve iniciar carregamentos perigosos;
- a correÃ§Ã£o adotada foi bloqueio defensivo de abertura, sem criar novo fluxo automÃ¡tico de salvamento;
- `Anamnese` e `HistÃ³rico` passaram a depender de paciente vÃ¡lido para abrir;
- a mensagem de aviso Ã© conservadora e sem auto-save.

## 13. CorreÃ§Ã£o aplicada

Foi aplicada a menor correÃ§Ã£o segura possÃ­vel para a tela base da `Anamnese`:

- exibiÃ§Ã£o do nome do paciente atual em campo readonly na Ã¡rea superior;
- combo `Questionario` mantida como fonte da clÃ­nica/conta via `/anamnese/questionarios`;
- preservaÃ§Ã£o do fallback para questionÃ¡rio padrÃ£o do fluxo atual;
- rolagem prÃ³pria na lista de perguntas;
- bloqueio de abertura de `Anamnese`/`HistÃ³rico` sem paciente vÃ¡lido;
- guarda de concorrÃªncia para evitar que resposta antiga sobrescreva a tela;
- preservaÃ§Ã£o do salvamento textual atual;
- nenhuma alteraÃ§Ã£o de backend, banco, payload ou formato de salvamento.

## 14. Backup criado

Backup manual criado em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_correcao_tela_base_questionarios/frontend/app.js`

## 15. ConfirmaÃ§Ãµes de escopo

- `frontend/app.js` alterado somente nos trechos necessÃ¡rios;
- `frontend/index.html` nÃ£o alterado;
- `frontend/js/modules` nÃ£o alterado;
- backend nÃ£o alterado;
- banco nÃ£o alterado;
- schema/migrations/seeds/endpoints nÃ£o alterados;
- `.env` nÃ£o alterado;
- `requestJson` nÃ£o alterado;
- payload nÃ£o alterado;
- formato de salvamento nÃ£o alterado;
- exclusÃ£o nÃ£o alterada;
- permissÃµes nÃ£o alteradas;
- `AnotaÃ§Ãµes` nÃ£o alterada;
- `HistÃ³rico` nÃ£o recebeu redesenho completo;
- layout completo da `Anamnese` nÃ£o foi redesenhado;
- `Sim/NÃ£o` estruturado nÃ£o foi implementado;
- campo complementar separado nÃ£o foi implementado;
- motor de alertas clÃ­nicos nÃ£o foi implementado;
- integraÃ§Ã£o global no boot nÃ£o foi adicionada;
- nÃ£o foi criado mÃ³dulo novo.

## 16. Como testar manualmente

1. Abrir o sistema.
2. Fazer login.
3. Confirmar que menus principais respondem.
4. Testar botÃ£o `Sair`.
5. Entrar novamente.
6. Abrir `Ficha Pessoal`.
7. Clicar em `Procura`.
8. Selecionar um paciente existente.
9. Entrar na aba `Anamnese`.
10. Confirmar se o nome do paciente atual aparece de forma clara.
11. Confirmar se a combo `Questionario` lista os questionÃ¡rios cadastrados em `ConfiguraÃ§Ãµes â†’ Anamnese`.
12. Selecionar cada questionÃ¡rio disponÃ­vel.
13. Confirmar se a lista de perguntas muda conforme o questionÃ¡rio.
14. Confirmar se hÃ¡ rolagem quando o questionÃ¡rio for extenso.
15. Confirmar que nÃ£o aparece `Falha ao carregar anamnese` quando hÃ¡ dados vÃ¡lidos.
16. Voltar em `Procura`.
17. Selecionar outro paciente.
18. Confirmar que o botÃ£o `Procura` abriu novamente.
19. Confirmar que a ficha atualizou para o segundo paciente.
20. Entrar novamente em `Anamnese`.
21. Confirmar que o paciente atual e o questionÃ¡rio continuam coerentes.
22. Testar `Dados pessoais`.
23. Testar `Dados complementares`.
24. Testar `AnotaÃ§Ãµes`.
25. Testar `HistÃ³rico`.
26. Testar botÃ£o `Sair`.
27. Entrar novamente e confirmar que menus continuam funcionando.

## 17. Riscos remanescentes

- a aba `Anamnese` continua sensÃ­vel por compartilhar a `Ficha Pessoal` extensa;
- `frontend/app.js` ainda concentra bastante lÃ³gica funcional;
- a persistÃªncia textual atual continua simples e pode nÃ£o cobrir tudo que o EasyDental mostra visualmente;
- a prÃ³xima etapa ainda deve ser tratada com contrato especÃ­fico, sem subir risco para backend/banco.

## 18. Plano de retorno manual usando backup

Se houver qualquer regressÃ£o, o retorno deve partir do backup manual criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_correcao_tela_base_questionarios/`, com prioridade para restaurar `frontend/app.js` ao estado salvo antes desta correÃ§Ã£o.

## 19. Registro para roadmap

- A tela base da `Anamnese` recebeu a correÃ§Ã£o conservadora para exibir melhor o paciente atual.
- O combo de questionÃ¡rios continua usando a fonte da clÃ­nica via backend jÃ¡ existente.
- A lista de perguntas passou a ter rolagem prÃ³pria.
- Foi aplicado bloqueio defensivo para impedir abertura de `Anamnese`/`HistÃ³rico` sem paciente vÃ¡lido.
- Foi adicionada guarda simples de concorrÃªncia.
- O salvamento textual atual foi preservado.
- Backend, banco, payload e `requestJson` permaneceram inalterados.
- O backup obrigatÃ³rio foi criado.
- O novo documento Ã© `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.
