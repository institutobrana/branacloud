# Odontograma V1 - Reorganizacao do layout clinico

## 1. Objetivo

Reorganizar o layout visual da V1 do odontograma para que a arcada passe a ser o foco principal da leitura clinica, reduzindo a aparencia de painel administrativo sem criar escrita ou dependencias do legado visual.

## 2. Escopo

- Somente leitura.
- Sem escrita.
- Sem migration.
- Sem tela nova.
- Sem endpoint novo.
- Sem alteracao de banco.
- Sem bitmap legado.
- Sem paridade completa com EasyDental.

## 3. Confirmacao de etapa somente documental e de leitura

- A subetapa foi tratada como reorganizacao visual de frontend.
- Nenhum `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `CREATE` ou `TRUNCATE` foi executado.
- Nenhuma nova regra clinica foi criada.
- Nenhum fluxo de edicao foi introduzido.

## 4. Arquivos alterados

- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/odontograma-v1-arcada-render.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/index.html`

## 5. Backend e ambiente usados na validacao

- Projeto: Brana Cloud
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Backend local: `http://127.0.0.1:8000`
- Usuario de teste: `user_id = 1`
- JWT local gerado a partir do segredo do ambiente
- Validacao em DOM simulado com `jsdom`

## 6. Resultado da validacao com backend real

- O painel do odontograma V1 abriu sem erro.
- O shell clinico foi renderizado com hero, barra de contexto, arcada central e rail de suporte.
- O footer permaneceu em modo de leitura.
- A arcada continuou preservando o fallback vazio quando nao havia slots no recorte real testado.
- A legenda permaneceu com 3 itens.
- A area de intervencoes continuou vazia nesse recorte real sem quebrar a interface.

## 7. Resultado da validacao visual com payload sintetico

- O shell clinico apareceu como estrutura principal.
- A arcada ficou no eixo visual dominante do painel.
- A zona de suporte ficou relegada ao rail lateral.
- O render sintetico confirmou:
  - shell clinico presente
  - hero presente
  - stage principal presente
  - 2 blocos de arcada
  - 2 cards de intervencao
  - rótulos de arcada superior e inferior visiveis
  - estados `Realizada` e `Observada` visiveis

## 8. Estrutura visual resultante

- `frontend/js/modules/odontograma-v1-layout.js` passou a concentrar o layout clinico do shell.
- `frontend/js/modules/odontograma-v1-arcada-render.js` continuou responsavel pelo desenho da arcada.
- `frontend/js/modules/odontograma-v1.js` ficou como orquestrador de leitura e montagem do painel.
- `frontend/index.html` recebeu apenas a inclusao do novo modulo de layout.
- `frontend/app.js` nao foi tocado.

## 9. Confirmacao de ausencia de escrita

- Nenhuma escrita foi executada nesta subetapa.
- Nenhum dado do banco foi alterado.
- Nenhuma migration nova foi criada.

## 10. Confirmacao de nao impacto em frontend global

- `frontend/app.js` nao foi alterado.
- A modularizacao foi preservada.
- A inclusao ocorreu por modulo novo e por script dedicado.

## 11. Problemas ou limitacoes encontradas

- O banco local continua sem dados reais suficientes para demonstrar a arcada clinica completa nessa instancia.
- Por isso, a validacao visual da nova hierarquia precisou de um payload sintetico compativel com o contrato.
- O layout foi aproximado ao contexto clinico, mas ainda nao tenta reproduzir toda a complexidade do EasyDental.

## 12. Onde conferir antes da proxima subetapa

- Abrir a ficha de paciente no sistema.
- Clicar no botao do odontograma.
- Conferir se o shell clinico aparece com arcada em destaque.
- Conferir se o rail lateral ficou claramente secundario.
- Conferir se o fallback vazio continua funcionando quando nao houver slots.
- Conferir que `frontend/app.js` permanece intacto.

## 13. Registro para roadmap

- Reorganizacao do layout clinico da V1 documentada.
- Protagonismo visual da arcada consolidado.
- Proxima etapa futura sugerida: leitura anatomica mais rica ou refinamento adicional de intervencoes, ainda sem escrita.
