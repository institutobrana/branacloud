# Ficha Pessoal - Anamnese - Implementacao do respeito a tipo_resposta conforme manual EasyDental

## Objetivo

Implementar, de forma pequena e segura, o respeito ao campo `tipo_resposta` na aba clinica da Anamnese da `Ficha Pessoal`, mantendo a persistencia B2 por envelope textual e sem alterar backend, banco ou endpoints.

## Decisao contratual

`FICHA-ANAM-MANUAL-B`

## Base documental

- pontos funcionais fornecidos pelo usuario a partir do manual EasyDental;
- arquivos locais do projeto relacionados a Anamnese;
- confirmacao do backend de que `tipo_resposta` e numerico e aceitam os valores `1`, `2` e `3`;
- material de descoberta EDS70 existente no repositório.

## Valores reais encontrados para `tipo_resposta`

Valores reais confirmados no codigo e nos artefatos de descoberta:

- `1`
- `2`
- `3`

Semântica observada nos artefatos EDS70 e no contrato funcional informado:

- `1` = `Sim/Não`
- `2` = `Sim/Não/Texto`
- `3` = `Texto`

## Arquivos alterados

- [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)
- [`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\docs\ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md)
- [`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\docs\11_roadmap_desenvolvimento.md)

## Backup criado

- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\ficha_pessoal_anamnese_tipo_resposta_manual_b\`
- arquivo copiado para backup:
  - [`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)

## Regras implementadas

### Sim/Não

- exibe apenas as opcoes `Sim` e `Nao`;
- nao exibe campo complementar editavel;
- preserva complemento antigo salvo de forma compatibilizada no envelope B2 sem apagar silenciosamente;
- salva resposta como `Sim` ou `Nao` no envelope B2 compatível;
- recarrega resposta como `Sim` ou `Nao`.

### Sim/Não/Texto

- exibe `Sim` e `Nao`;
- exibe campo de texto/complemento;
- salva `Sim`/`Nao` e texto no envelope B2 compatível;
- recarrega `Sim`/`Nao` e o texto no retorno da aba.

### Texto

- nao exibe `Sim`/`Nao`;
- exibe apenas campo de texto;
- salva o texto principal dentro do envelope B2 compatível;
- recarrega o texto ao reabrir a aba ou trocar de questionario.

## Como o envelope B2 foi preservado

- o fluxo continua usando JSON stringificado armazenado no campo textual da resposta;
- o envelope passou a carregar `tipo_resposta` para manter contexto;
- o campo `resposta` continua sendo usado para `Sim`/`Nao` e, no caso de perguntas do tipo `Texto`, para a resposta textual principal;
- o campo `complemento` continua sendo usado nas perguntas que pedem complemento;
- nenhum backend novo foi criado;
- nenhum banco novo foi criado;
- nenhum endpoint novo foi criado.

## Como respostas antigas foram preservadas

- respostas antigas em texto simples continuam sendo lidas;
- respostas antigas em JSON envelope continuam sendo lidas;
- respostas de `Sim/Não` com complemento continuam recarregando `Sim`/`Nao` e complemento;
- respostas antigas de tipo `Texto` que vierem no campo complementar/legado continuam sendo convertidas para o texto principal na recarga;
- complemento antigo de pergunta `Sim/Não` não é apagado silenciosamente.

## Comportamento do botao Grava

- o botao geral `Grava` continua salvando a Anamnese;
- a Anamnese ainda participa do fluxo de gravação da `Ficha Pessoal`;
- se houver alterações pendentes, o salvamento é executado antes do paciente seguir o fluxo normal;
- sem alterações pendentes, o fluxo continua normalmente.

## Comportamento do modal

- `Sim` salva e prossegue;
- `Nao` descarta alterações locais e prossegue;
- `Cancelar` permanece na aba Anamnese;
- o modal continua protegendo saidas por troca de aba, `Procura...`, `Novo`, `Fechar`, `Sair`, navegação entre pacientes e troca de questionário.

## Confirmacoes de nao implementacao

- `tipo_pergunta` crítica não foi implementado;
- `mensagem_alerta` não foi implementada;
- alertas no odontograma não foram alterados;
- ícones de alerta não foram alterados;
- preferências de alerta não foram alteradas;
- impressão de questionário em branco não foi alterada;
- seed `Principal` não foi alterado;
- comparação ou correção das 17 perguntas atuais não foi alterada;
- cópia de questionário não foi alterada;
- módulo de configuração de Anamnese não foi alterado;
- `frontend/index.html` não foi alterado;
- backend, banco, schema, migrations, seeds e endpoints não foram alterados.

## Riscos residuais

- perguntas do tipo `Texto` exigem atenção para não misturar resposta textual com complemento legado;
- respostas antigas sem envelope estruturado podem depender de compatibilização defensiva;
- se o módulo de configuração mudar o tipo de resposta, a aba clínica precisa recarregar para refletir a alteração;
- a evolução para `tipo_pergunta` crítica e `mensagem_alerta` deve ser tratada em contrato separado.

## Onde testar no sistema

1. Abrir o sistema.
2. Fazer login.
3. Abrir `Configuracao -> Anamnese`.
4. Confirmar ou criar um questionário de teste com três perguntas:
   - uma tipo `Sim/Não`;
   - uma tipo `Sim/Não/Texto`;
   - uma tipo `Texto`.
5. Abrir `Ficha Pessoal`.
6. Selecionar um paciente salvo.
7. Entrar na aba `Anamnese`.
8. Selecionar o questionário de teste.
9. Confirmar que a pergunta `Sim/Não` mostra apenas `Sim` e `Nao`, sem campo de texto editável.
10. Confirmar que a pergunta `Sim/Não/Texto` mostra `Sim`, `Nao` e campo de texto.
11. Confirmar que a pergunta `Texto` mostra apenas campo de texto, sem `Sim`/`Nao` aplicável.
12. Responder as três perguntas.
13. Clicar no botao geral `Grava`.
14. Sair da aba e voltar.
15. Confirmar que as três respostas recarregaram corretamente.
16. Alterar respostas e tentar trocar de aba.
17. Testar o modal:
   - `Cancelar` mantém alteração;
   - `Sim` salva e prossegue;
   - `Nao` descarta e prossegue.
18. Trocar de questionário e confirmar que não mistura respostas.
19. Trocar de paciente e confirmar que não mistura respostas.
20. Testar `Procura...`, `Novo`, `Fechar`, `Sair` e navegação entre pacientes.
21. Confirmar que menus e botões continuam respondendo.
22. Confirmar que não houve regressão global.

## Observacao final

O PDF do manual EasyDental nao estava acessivel localmente nesta sessao. O contrato foi montado com os pontos funcionais fornecidos pelo usuario, com os artefatos locais do projeto e com a leitura real do backend/seed EDS70, sem inventar comprovacao que nao foi encontrada no workspace.
