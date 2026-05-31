# Ficha Pessoal - Contrato de confirmacao de alteracoes da aba Anamnese

## 1. Contexto

Esta etapa e somente documental / contratual.

Ela foi aberta depois da modularizacao visual da aba `Anamnese` e da auditoria de persistencia, para definir como o sistema deve reagir quando houver alteracoes locais e o usuario tentar sair da aba, trocar paciente, trocar de questionario ou fechar a `Ficha Pessoal`.

O objetivo e criar um contrato seguro de confirmacao de alteracoes antes de qualquer implementacao futura.

## 2. Estado visual validado

A aba `Anamnese` ja esta visualmente organizada com:

- nome do paciente no cabecalho;
- combo `Questionario`;
- lista visual de perguntas;
- controles `Sim` / `Nao` em coluna vertical;
- campo complementar/observacao visual;
- rolagem na area inferior;
- troca de questionario funcionando;
- sem salvamento ainda.

## 3. Base documental usada

### 3.1 Documentos de anamnese e persistencia

- `docs/ficha_pessoal_anamnese_auditoria_persistencia_contrato.md`
- `docs/ficha_pessoal_anamnese_validacao_ajuste_visual_sim_nao_vertical.md`
- `docs/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md`
- `docs/ficha_pessoal_anamnese_validacao_questionario_visual_sem_salvamento.md`
- `docs/ficha_pessoal_anamnese_implementacao_questionario_visual_sem_salvamento.md`
- `docs/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento.md`
- `docs/ficha_pessoal_anamnese_validacao_modularizacao_sem_mudar_comportamento.md`
- `docs/ficha_pessoal_correcao_botao_procura_reentrante.md`
- `docs/ficha_pessoal_validacao_botao_procura_reentrante.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### 3.2 Codigo lido somente para auditar

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/anamnese.js`
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `backend/routes/anamnese_routes.py`
- `backend/scripts/migrar_anamnese_easy_para_saas.py`
- `backend/main.py`

### 3.3 Legado EasyDental / fonte externa somente leitura

- `\\Sonyvaio\\c\\EDS70`
- `\\Dell_servidor\\c\\EDS70`

As duas shares foram acessadas em modo somente leitura. Os scripts SQL de descoberta das duas shares apresentaram a mesma estrutura de anamnese.

## 4. Achados da auditoria de persistencia

- O legado EasyDental exposto nos scripts SQL usa as tabelas `ANAMNESE_QUEST`, `ANAMNESE_PERG` e `ANAMNESE_RESP`.
- A tabela `ANAMNESE_RESP` armazena `RESPOSTA` e `COMPLEM`, sugerindo confirmacao por pergunta com complemento.
- O Brana Cloud atual continua com persistencia textual em `PUT /anamnese/pacientes/{id}/respostas`.
- O backend ja possui rotas e modelos dedicados para questionarios, perguntas e respostas.
- A interface atual da aba `Anamnese` ainda nao possui um mecanismo geral de "dados alterados" identificado na ficha inteira.
- O hook ja existente em `frontend/app.js` para a aba `Anamnese` bloqueia apenas a abertura sem paciente valido; ele nao faz controle de sujo/limpo.
- Nao foi encontrado um modal padrao unico e reutilizavel do sistema com botoes `Sim`, `Nao` e `Cancelar` para confirmacao de saida.
- O que existe como padrao generico no frontend e `window.confirm`, que nao cobre a semantica de tres botoes.

## 5. Escopo desta etapa documental

Esta etapa define apenas o contrato da confirmacao de alteracoes da aba `Anamnese`.

Nao implementa:

- backend;
- banco;
- migrations;
- seeds;
- endpoints;
- `.env`;
- `requestJson`;
- payload;
- formato de salvamento;
- exclusao;
- permissoes;
- validacao clinica nova;
- motor de alertas;
- alteracao em `Configuracoes -> Anamnese`;
- alteracao em `Anotacoes`;
- alteracao em `Historico`, salvo eventual bloqueio de navegacao se futuramente for inevitavel e documentado;
- alteracao em `Dados pessoais` ou `Dados complementares`, salvo hooks de navegacao;
- integracao global perigosa no boot;
- salvamento real de `Sim` / `Nao` / complemento.

## 6. Confirmacoes de nao alteracao

- nenhum codigo alterado;
- `frontend/app.js` nao alterado;
- `frontend/index.html` nao alterado;
- `frontend/js/modules` nao alterado;
- backend nao alterado;
- banco nao alterado;
- schema/migrations/seeds/endpoints nao alterados;
- `.env` nao alterado;
- `requestJson` nao alterado;
- payload nao alterado;
- formato de salvamento nao alterado;
- exclusao nao alterada;
- permissoes nao alteradas.

## 7. Eventos que devem marcar a Anamnese como alterada

Os eventos abaixo devem setar o estado local como alterado, quando houver dados locais realmente modificados:

- marcar `Sim`;
- marcar `Nao`;
- alterar o texto complementar;
- limpar uma resposta selecionada, se isso futuramente for permitido;
- trocar conteudo local ja preenchido;
- editar qualquer resposta visual da lista;
- qualquer acao local que mude o estado da aba sem ter sido gravada.

## 8. Eventos que devem tentar sair da Anamnese

A confirmacao deve ser avaliada quando houver alteracao local e o usuario tentar:

- trocar para outra aba da `Ficha Pessoal`;
- clicar em `Fechar` na `Ficha Pessoal`;
- clicar em `Procura...` para trocar paciente;
- navegar para outro paciente pelos botoes de navegacao;
- clicar em `Novo`;
- clicar em `Sair`, se isso implicar abandonar a ficha com alteracao pendente;
- trocar de questionario na combo, se houver alteracao visual pendente;
- qualquer fluxo que abandone a `Anamnese` com dados alterados.

## 9. Regra da mensagem

Mensagem fiel ao EasyDental, a ser usada como texto base do contrato:

> Os dados foram alterados. Deseja grava-los?

Se o ambiente futuro exigir melhor fidelidade visual, a frase pode ser mantida com acentuacao exata no momento da implementacao. Nesta etapa documental, o importante e preservar a semantica da pergunta.

## 10. Regra do botao Sim

Decisao contratual recomendada: **FICHA-ANAM-CONFIRM-A**

Regra:

- primeira implementacao apenas detecta alteracao e mostra confirmacao;
- `Sim` nao deve fingir persistencia que nao existe;
- se ainda nao houver persistencia segura para `Sim` / `Nao` + complemento, o botao pode apenas bloquear a saida, avisar a limitacao ou encaminhar para contrato posterior;
- nenhuma chamada real de salvamento deve ser criada nesta etapa.

## 11. Regra do botao Nao

Regra:

- descarta as alteracoes locais da aba;
- segue a acao pendente que motivou a saida;
- nao grava nada;
- nao altera backend, banco ou payload;
- mantem o contrato simples e previsivel.

## 12. Regra do botao Cancelar

Regra:

- cancela a acao de saida;
- mantem o usuario na aba `Anamnese`;
- mantem as alteracoes locais visuais;
- nao grava nada;
- nao limpa o estado local.

## 13. Como tratar troca de aba

- se houver alteracao local, ao trocar de aba o sistema deve exibir a confirmacao;
- se `Cancelar` for escolhido, o usuario permanece em `Anamnese`;
- se `Nao` for escolhido, a troca pode prosseguir descartando alteracoes locais;
- se `Sim` for escolhido, esta primeira implementacao nao deve inventar salvamento real; a regra deve ficar contratada explicitamente para evolucao posterior.

## 14. Como tratar Procura / troca de paciente

- se houver alteracao local, clicar em `Procura...` deve disparar a confirmacao;
- o ajuste do botao `Procura...` deve permanecer reentrante;
- a confirmacao nao pode quebrar o fluxo de busca de pacientes;
- `Cancelar` deve manter o paciente atual;
- `Nao` deve permitir a troca descartando a alteracao local;
- `Sim` deve seguir o contrato de persistencia futura, se definido, sem improviso.

## 15. Como tratar Fechar ficha

- se houver alteracao local, `Fechar` deve acionar a confirmacao;
- `Cancelar` mantém a `Ficha Pessoal` aberta;
- `Nao` fecha descartando as alteracoes locais;
- `Sim` depende do contrato de persistencia futura e nao deve ser simulado sem seguranca.

## 16. Como tratar Sair do sistema

- se houver alteracao local e a saida implicar perda de contexto, a confirmacao deve aparecer;
- o contrato deve preservar a seguranca do usuario e nao perder dados sem aviso;
- `Cancelar` interrompe a saida;
- `Nao` descarta a alteracao local e segue o fluxo de saida;
- `Sim` permanece condicionado ao contrato posterior de persistencia real.

## 17. Como tratar troca de questionario

- a troca de questionario pode disparar confirmacao se houver alteracao visual pendente;
- isso evita perder a edicao local ao navegar entre questionarios;
- `Cancelar` retorna ao questionario atual;
- `Nao` pode seguir para o novo questionario descartando alteracoes locais;
- `Sim` nao deve ser associado a salvamento real ainda sem contrato posterior.

## 18. Como evitar regressao no botao Procura

- o contrato nao deve restaurar o bug do botao `Procura...` reentrante;
- a confirmacao deve ser colocada como camada de navegacao, nao como bloqueio da busca em si;
- o fluxo de pesquisa deve continuar abrindo sempre que o usuario confirmar ou quando nao houver alteracao local;
- a saida da aba e o fluxo de busca nao podem se acoplar de forma a travar a pesquisa novamente.

## 19. Como evitar regressao global do frontend

- nao integrar essa confirmacao no boot global de forma ampla;
- manter o contrato ligado ao modulo da `Anamnese` e, se indispensavel, a hooks minimos de `frontend/app.js`;
- nao tocar em outras abas com logica nova sem necessidade;
- nao reutilizar modal genérico sem revisar impacto;
- preservar menus, Sair, Procura e demais fluxos da ficha fora do escopo.

## 20. Caminhos avaliados

### Opcao A - Mais segura

- primeira implementacao apenas detecta alteracao e mostra confirmacao;
- `Sim` nao grava ainda;
- `Nao` descarta alteracoes locais;
- `Cancelar` mantem o usuario na aba.

### Opcao B - Intermediaria

- primeira implementacao detecta alteracao e usa o endpoint textual existente para gravar uma representacao temporaria;
- exige definir formato textual;
- aumenta risco e nao e recomendada sem contrato de persistencia.

### Opcao C - Pausar confirmacao ate fechar contrato de persistencia

- evita botao `Sim` sem gravacao;
- mantem visual sem salvamento;
- e a postura mais conservadora, mas nao entrega o contrato de confirmacao agora.

## 21. Decisao recomendada

**FICHA-ANAM-CONFIRM-A**

Motivo:

- prioriza seguranca;
- separa confirmacao de persistencia real;
- evita fingir salvamento;
- permite criar primeiro o mecanismo de alteracao e confirmacao, deixando o salvamento estruturado para contrato posterior;
- nao quebra o fluxo atual da aba.

## 22. Contrato da proxima implementacao futura

A proxima implementacao futura, se autorizada, deve limitar-se a:

- detectar estado alterado na aba `Anamnese`;
- disparar a confirmacao de saida;
- respeitar `Sim`, `Nao` e `Cancelar` conforme o contrato acima;
- manter o comportamento do botao `Procura...`;
- manter a navegacao da `Ficha Pessoal` estavel;
- nao introduzir persistencia real ainda, salvo nova autorizacao.

## 23. Escopo permitido da proxima implementacao

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`;
- `frontend/app.js` somente se indispensavel para hooks de navegacao/fechamento;
- nenhum backend;
- nenhum banco;
- nenhum payload novo;
- nenhum salvamento real ainda, salvo contrato posterior;
- nenhuma mudanca em `Configuracoes -> Anamnese`.

## 24. Escopo proibido da proxima implementacao

- backend;
- banco;
- migrations;
- seeds;
- endpoints;
- `.env`;
- alteracao de `requestJson`;
- alteracao de payload;
- alteracao de formato de salvamento;
- salvamento real de `Sim` / `Nao`;
- salvamento real de complemento;
- mensagens clinicas;
- pergunta critica;
- alteracao em `Anotacoes`;
- alteracao em `Historico`, salvo bloqueio de navegacao se inevitavel e documentado;
- integracao global perigosa no boot.

## 25. Backup obrigatorio antes da proxima implementacao

Se a implementacao futura for autorizada, o backup obrigatorio deve ser criado antes de qualquer codigo em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_confirmacao_alteracoes/`

Arquivos a preservar, no minimo:

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/app.js` se ele for tocado

## 26. Plano de retorno manual

Se a futura implementacao precisar ser revertida manualmente, o retorno deve:

1. restaurar os arquivos do backup;
2. validar `node --check` nos JS tocados;
3. reabrir `Ficha Pessoal`;
4. testar `Procura...`;
5. testar troca de aba;
6. testar `Fechar`;
7. testar `Sair`;
8. testar troca de questionario;
9. confirmar que nao houve regressao global.

## 27. Testes manuais futuros

- abrir o sistema;
- fazer login;
- abrir `Ficha Pessoal`;
- selecionar paciente;
- entrar na aba `Anamnese`;
- alterar `Sim`, `Nao` ou complemento;
- tentar trocar de aba;
- tentar clicar em `Procura...`;
- tentar clicar em `Fechar`;
- tentar clicar em `Sair`;
- tentar trocar de questionario;
- confirmar a mensagem `Os dados foram alterados. Deseja grava-los?`;
- confirmar os efeitos de `Sim`, `Nao` e `Cancelar`.

## 28. Riscos remanescentes

- a persistencia real ainda nao foi implementada para `Sim` / `Nao` + complemento;
- o contrato de saida pode ser aplicado em uma aba ja sensivel, exigindo isolamento cuidadoso;
- `Procura...` precisa continuar reentrante;
- a `Ficha Pessoal` possui historico de sensibilidade a acoplamento global;
- qualquer integracao ampla no boot pode reabrir regressao geral;
- a semantica exata de `Sim` ainda depende de um contrato futuro de persistencia.

## 29. Registro para roadmap

Esta etapa documenta:

- a leitura do estado atual da aba `Anamnese` no Brana Cloud;
- a leitura em somente leitura das shares legadas `\\Sonyvaio\\c\\EDS70` e `\\Dell_servidor\\c\\EDS70`;
- a observacao de que o legado sugere resposta estruturada com `RESPOSTA` e `COMPLEM`;
- a conclusao de que nao existe mecanismo geral de dados alterados comprovado na `Ficha Pessoal` atual;
- a ausencia de modal padrao unico com `Sim` / `Nao` / `Cancelar`;
- a decisao `FICHA-ANAM-CONFIRM-A`;
- o contrato proposto para confirmacao `Os dados foram alterados. Deseja grava-los?`;
- os caminhos futuros de modularizacao;
- a confirmacao de que nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental;
- o respeito a blindagem textual/mojibake.
