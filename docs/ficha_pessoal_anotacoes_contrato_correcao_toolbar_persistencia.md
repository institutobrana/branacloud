# Ficha Pessoal — Contrato de correção da aba Anotações — toolbar e persistência

## 1. Contexto

Este contrato documental abre a próxima etapa segura para a aba `Anotações` da `Ficha pessoal` no Brana Cloud.

A análise anterior concluiu que:

- o Brana Cloud usa atualmente um `textarea` simples em `#ficha-anotacoes`;
- a toolbar visível existe, mas os botões ainda só exibem mensagens de planejamento;
- o valor é carregado e salvo como texto puro;
- o backend persiste `paciente.anotacoes` como campo textual simples;
- não houve evidência local de UI direta do EasyDental para esta aba, apenas o mapeamento indireto `ANOTAC -> anotacoes`.

Este contrato trata a aba `Anotações` como bloco contínuo de observações do paciente, e não como um editor de documentos separado.

## 2. Base documental usada

- `docs/ficha_pessoal_anotacoes_diagnostico_comparativo_easydental_brana.md`

## 3. Escopo desta etapa documental

Esta etapa é exclusivamente documental e contratual.

Ela:

- não implementa nada;
- não altera código;
- não altera banco;
- não altera frontend/app.js;
- não altera frontend/index.html;
- não altera frontend/js/modules;
- não altera backend;
- não altera schema/migrations/seeds/endpoints;
- não altera `.env`;
- não altera `requestJson`;
- não altera payload;
- não altera salvamento;
- não altera exclusão;
- não altera permissões.

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

## 5. Objetivo funcional da futura correção

Definir a menor correção segura para a aba `Anotações`, preservando o comportamento de bloco contínuo de texto do paciente e evitando aumento desnecessário de monólito.

O objetivo funcional mínimo recomendado é:

- melhorar a experiência visual da toolbar sem mudar a persistência na primeira implementação;
- manter a escrita como texto puro;
- substituir as mensagens de planejamento por comportamento real apenas se isso puder ser feito sem quebrar a persistência existente;
- preservar a continuidade das anotações do paciente.

## 6. Decisão recomendada para a primeira implementação

Decisão recomendada: `FICHA-ANOT-CONTR-A`

Interpretação:

- implementar de forma futura e controlada apenas a camada visual/local da aba, mantendo texto puro;
- não alterar backend, banco, payload ou salvamento nesta primeira implementação;
- se houver necessidade de comportamento rico real, isso deve ser tratado em um contrato posterior mais profundo.

## 7. Formato de persistência recomendado

Recomendação para a primeira implementação:

- manter texto puro;
- não alterar a persistência nesta rodada;
- preservar compatibilidade com o campo atual `anotacoes` e com a limpeza atual do backend.

Opções analisadas para persistência:

- manter texto puro: recomendado para a primeira implementação;
- salvar HTML simples: adiar;
- salvar texto com marcações limitadas: adiar;
- não alterar persistência nesta primeira implementação: recomendado.

## 8. Escopo permitido da futura implementação

A futura implementação, se autorizada, pode:

- criar um módulo JS dedicado para a aba `Anotações`;
- mover a lógica visual/local da aba para esse módulo;
- manter `textarea` e texto puro;
- substituir mensagens de planejamento por comportamento real mínimo e seguro;
- manter `frontend/app.js` como fachada fina;
- atualizar documentação e roadmap.

## 9. Escopo proibido da futura implementação

A futura implementação deve evitar:

- backend;
- banco;
- migrations;
- seeds;
- endpoints;
- `.env`;
- `requestJson`;
- payload;
- salvamento com novo formato;
- exclusão;
- permissões;
- Anamnese;
- Histórico;
- Editor de Textos;
- Agenda;
- Financeiro;
- demais abas da `Ficha Pessoal`.

## 10. Estratégia de modularização futura

Se um módulo novo vier a existir, a recomendação é que ele já nasça consumido pela fachada e não como arquivo morto.

Nome conceitual sugerido:

- `frontend/js/modules/ficha_pessoal_anotacoes.js`

Condições:

- não criar o arquivo nesta etapa;
- não criar helper sem consumo;
- não criar namespace vazio sem uso;
- a extração só deve existir se `frontend/app.js` consumir a fachada na etapa futura.

## 11. Estratégia de fachada/wrapper no frontend/app.js

Na futura implementação, `frontend/app.js` deve permanecer como fachada fina, chamando um namespace futuro específico, por exemplo:

- `window.BranaFichaPessoalAnotacoesModule`

Nesta etapa documental, nada disso é implementado.

## 12. Riscos

- risco visual: médio;
- risco de persistência: médio/alto;
- risco de regressão na `Ficha pessoal`: médio;
- risco de tentativa precoce de comportamento rico sem base suficiente: alto.

## 13. Plano de backup obrigatório antes de implementação

Antes de qualquer implementação futura, deve existir backup manual em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/`

Esse backup:

- não substitui commit;
- não autoriza `git reset`;
- não autoriza `git restore`;
- não autoriza `git clean`;
- não autoriza `git revert`.

## 14. Plano de retorno manual

Se houver implementação futura, o retorno manual deve validar:

- abertura de `Ficha pessoal`;
- acesso à aba `Anotações`;
- escrita de texto simples;
- uso dos botões disponíveis;
- gravação;
- fechamento e reabertura da ficha;
- persistência dos dados;
- manutenção de `Dados pessoais`, `Dados complementares`, `Anamnese` e `Histórico`;
- funcionamento normal de salvar paciente.

## 15. Testes manuais futuros

- abrir `Ficha pessoal`;
- acessar aba `Anotações`;
- escrever texto simples;
- usar botões disponíveis;
- gravar;
- fechar e abrir novamente;
- confirmar persistência;
- confirmar que dados antigos continuam aparecendo;
- confirmar que `Dados pessoais`, `Dados complementares`, `Anamnese` e `Histórico` não quebraram;
- confirmar que salvar paciente continua funcionando.

## 16. Onde testar no sistema antes de prosseguir

- abrir `Ficha pessoal`;
- entrar em `Anotações`;
- testar edição simples;
- observar a toolbar;
- validar persistência após salvar e recarregar;
- conferir que o restante da ficha permanece estável.

## 17. Registro para roadmap

Este contrato fica registrado como base para a futura correção da aba `Anotações` da `Ficha pessoal`, sem alterar código, banco ou configuração.
