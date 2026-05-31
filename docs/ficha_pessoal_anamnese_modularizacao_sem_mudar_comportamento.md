# Ficha Pessoal - Modularizacao inicial da aba Anamnese sem mudanca de comportamento

## 1. Contexto

Esta subetapa foi conduzida de forma documental e tecnica, com foco em separar a aba `Anamnese` da `Ficha Pessoal` em um modulo proprio, sem mudar o comportamento visual ou funcional que ja estava validado.

A base documental utilizada foi:

- `docs/ficha_pessoal_anamnese_auditoria_fluxo_questionario_contrato.md`
- `docs/ficha_pessoal_anamnese_limpeza_botao_quadros.md`
- `docs/ficha_pessoal_correcao_botao_procura_reentrante.md`
- `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`
- `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

A decisao base utilizada foi `FICHA-ANAM-FLUXO-A`.

## 2. Objetivo desta subetapa

Criar um modulo frontend dedicado para a aba `Anamnese` da `Ficha Pessoal`, mantendo `frontend/app.js` como fachada fina e sem alterar o comportamento atual.

O objetivo nao era implementar a lista visual de perguntas ainda.
O objetivo era apenas modularizar a estrutura ja existente e validada.

## 3. Estado visual esperado apos a subetapa

A aba `Anamnese` deve continuar exatamente como antes:

- nome do paciente atual no topo;
- combo `Questionario` visivel;
- area inferior vazia/preparada;
- sem lista visual de perguntas;
- sem Sim/Nao;
- sem campo complementar;
- sem mensagens clinicas novas;
- sem mudanca no salvamento atual.

## 4. Backup criado

Antes da alteracao foi criado backup manual em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento/`

Arquivos incluídos no backup:

- `frontend/app.js`
- `frontend/index.html`

O `frontend/index.html` foi incluido no backup porque precisou receber um script adicional para carregar o novo modulo.

## 5. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/index.html`
- `docs/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. O que foi movido para `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

Foi movida a logica valida e ja existente da aba `Anamnese` da `Ficha Pessoal`, incluindo:

- obtencao do nome do paciente atual;
- atualizacao do cabecalho da aba;
- carregamento de questionarios;
- renderizacao do combo `Questionario`;
- selecao de questionario;
- bloqueio defensivo para abrir a aba sem paciente valido;
- controle de concorrencia para carregamento.

O modulo nasceu consumido pelo sistema, com namespace proprio:

- `window.BranaFichaPessoalAbaAnamnese`

## 7. O que permaneceu em `frontend/app.js`

O `frontend/app.js` ficou como fachada fina, preservando apenas:

- chamadas para o modulo quando ele esta disponivel;
- fallback defensivo caso o modulo nao carregue;
- a integracao com a UI da ficha;
- os hooks de aplicacao do paciente, limpeza de novo paciente e troca de aba.

O monolito nao continuou concentrando a logica principal da aba.

## 8. Como `frontend/app.js` ficou como fachada fina

`frontend/app.js` passou a:

- consultar o namespace `window.BranaFichaPessoalAbaAnamnese`;
- delegar o trabalho da aba ao modulo;
- manter uma camada de fallback defensiva;
- nao executar integracao global perigosa no boot;
- nao alterar menus, `Sair` ou `Procura`.

## 9. Como foi evitada integracao global perigosa

A estrategia adotada foi:

- carregar o modulo por script dedicado, junto dos demais modulos do projeto;
- nao criar preloader global novo;
- nao executar logica por efeito colateral no boot;
- manter a integracao restrita a `Ficha Pessoal`;
- preservar a navegacao geral do sistema.

## 10. Como foi preservado o comportamento atual

Foi preservado:

- o topo da aba com nome do paciente;
- o combo `Questionario` existente;
- a area inferior vazia/preparada;
- o bloqueio sem paciente valido;
- o comportamento reentrante do botao `Procura...`;
- o salvamento textual atual;
- o restante da `Ficha Pessoal`.

Nao foi implementado nesta subetapa:

- lista visual de perguntas;
- Sim/Nao;
- campo complementar;
- mensagens clinicas;
- pergunta critica;
- salvamento novo;
- backend novo;
- banco novo;
- payload novo;
- `requestJson` novo.

## 11. Confirmacoes de escopo

- `frontend/app.js` alterado somente para fachada/integracao da aba Anamnese;
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js` criado e consumido;
- `frontend/index.html` alterado para carregar o novo modulo, por necessidade tecnica indispensavel;
- backend nao alterado;
- banco nao alterado;
- schema/migrations/seeds/endpoints nao alterados;
- `.env` nao alterado;
- `requestJson` nao alterado;
- payload nao alterado;
- formato de salvamento nao alterado;
- exclusao nao alterada;
- permissoes nao alteradas;
- `Procura` nao alterado;
- `Anotacoes` nao alterada;
- `Historico` nao alterado;
- combo `Questionario` nao corrigida nesta etapa;
- lista visual de perguntas nao implementada;
- Sim/Nao nao implementado;
- campo complementar nao implementado;
- mensagens clinicas nao implementadas.

## 12. Riscos remanescentes

- a aba `Anamnese` continua sensivel a mudancas globais do frontend;
- a proxima evolucao ainda precisa ser pequena e separada;
- a lista visual de perguntas e o fluxo por pergunta continuam como proxima fronteira;
- a comparacao com o legado EasyDental permaneceu parcial, pois a extracao direta de UI completa nao foi possivel nesta rodada.

## 13. Plano de retorno manual usando backup

Se surgir qualquer regressao, o retorno deve ser feito usando o backup manual criado antes da alteracao:

- restaurar `frontend/app.js` a partir de `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento/`
- restaurar `frontend/index.html` a partir do mesmo backup, se necessario

Nao usar `git reset`, `git restore`, `git clean` ou `git revert`.

## 14. Como testar manualmente

1. Abrir o sistema.
2. Fazer login.
3. Confirmar que menus principais respondem.
4. Testar o botao `Sair`.
5. Entrar novamente.
6. Abrir `Ficha Pessoal`.
7. Clicar em `Procura...`.
8. Selecionar um paciente existente.
9. Confirmar que a ficha carregou.
10. Clicar novamente em `Procura...` e confirmar que continua funcionando.
11. Entrar na aba `Anamnese`.
12. Confirmar que o nome do paciente aparece.
13. Confirmar que a combo `Questionario` aparece.
14. Confirmar que a area inferior continua vazia/preparada, como antes.
15. Confirmar que nao foi implementada lista de perguntas ainda.
16. Testar `Dados pessoais`.
17. Testar `Dados complementares`.
18. Testar `Anotacoes`.
19. Testar `Historico`.
20. Testar `Sair`.
21. Entrar novamente e confirmar que menus continuam funcionando.

## 15. Registro para roadmap

Esta subetapa registra que a aba `Anamnese` da `Ficha Pessoal` iniciou modularizacao propria, com criacao de `frontend/js/modules/ficha-pessoal-aba-anamnese.js`, sem mudar comportamento visual/funcional.

O objetivo da separacao e preparar a proxima subetapa de lista visual de perguntas com menos risco e melhor isolamento.

Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental/estrutural.

