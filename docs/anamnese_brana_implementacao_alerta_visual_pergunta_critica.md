# Anamnese Brana - Implementacao do alerta visual por pergunta critica

## Objetivo da etapa
Implementar somente o gatilho visual do icone de alerta na aba clinica da Anamnese da Ficha Pessoal, conforme a criticidade da pergunta e a resposta marcada pelo usuario.

## Decisao ANAM-ALERTA-VISUAL-A
A etapa foi implementada seguindo `ANAM-ALERTA-VISUAL-A`.
O alerta visual aparece apenas como icone por pergunta critica satisfeita, sem exibir `mensagem_alerta` nesta primeira etapa.

## Backup criado
Antes da alteracao, foi criado backup manual em:
- `backups_modularizacao/fase_2c/anamnese_alerta_visual_icone_pergunta_critica/`

Arquivos salvos no backup:
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/app.js`

## Arquivo(s) alterado(s)
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `docs/11_roadmap_desenvolvimento.md`

`frontend/app.js` nao foi alterado nesta etapa.

## Como a criticidade foi avaliada
A avaliacao foi feita em leitura do item da pergunta e da resposta atual do rascunho local:
- `TIPPER = 1` nao gera alerta visual.
- `TIPPER = 2` gera alerta quando a resposta atual e `sim`.
- `TIPPER = 3` gera alerta quando a resposta atual e `nao`.
- `tipo_resposta = 3` nao dispara alerta visual nesta etapa.
- O calculo e local por pergunta, sem afetar o questionario inteiro.

## Como o icone foi renderizado
- O icone foi inserido por pergunta dentro do render da aba clinica.
- O recurso visual prioritario usado foi `assets/easy/ico_dedo.bmp`.
- O render mostra ou oculta o icone conforme a condicao critica satisfeita.
- A atualizacao ocorre em tempo real quando o usuario altera a resposta da pergunta.
- Ao recarregar a aba, o estado salvo e refeito e o icone reaparece nas perguntas criticas mantidas.

## Comportamento para TIPPER=1
- Nunca exibe icone de alerta.
- Mantem o comportamento normal da pergunta nao critica.
- Nao altera `mensagem_alerta`.

## Comportamento para TIPPER=2
- Exibe icone somente quando a resposta atual e `sim`.
- Oculta o icone quando a resposta passa a ser `nao`, vazia ou incompativel.
- A reacao e imediata ao mudar a resposta.

## Comportamento para TIPPER=3
- Exibe icone somente quando a resposta atual e `nao`.
- Oculta o icone quando a resposta passa a ser `sim`, vazia ou incompativel.
- A reacao e imediata ao mudar a resposta.

## Comportamento com tipo_resposta
- `tipo_resposta` continua definindo o modo de resposta da pergunta.
- Perguntas de resposta `sim/nao` e `sim/nao/texto` participam da regra critica.
- Perguntas de resposta `texto` puro nao disparam alerta visual nesta etapa.
- O envelope B2 foi preservado sem mudanca de formato.

## Confirmacoes de nao alteracao funcional
- `mensagem_alerta` nao foi exibida visualmente.
- O envelope B2 nao foi alterado.
- Backend, banco, schema, migrations, seeds e endpoints nao foram alterados.
- A configuracao de Anamnese nao foi alterada.
- Odontograma, Preferencias, Historico, Anotacoes e outras abas nao foram alterados.
- O botao Grava continua preservado.
- A confirmacao local continua preservada.

## Riscos residuais
- O navegador pode tratar BMP de forma diferente em alguns ambientes; isso deve ser verificado visualmente no sistema.
- A regra visual foi implementada na aba clinica, mas a validacao manual ainda precisa confirmar a aparencia exata do icone em todas as respostas criticas.
- Perguntas de tipo texto puro permanecem sem alerta visual por decisao conservadora desta etapa.

## Onde testar no sistema
1. Abrir o sistema.
2. Fazer login.
3. Ir em Configuracao -> Anamnese.
4. Confirmar uma pergunta com `TIPPER=2` e `tipo_resposta` sim/nao ou sim/nao/texto.
5. Abrir Ficha Pessoal.
6. Selecionar um paciente.
7. Entrar na aba Anamnese.
8. Selecionar o questionario da pergunta critica.
9. Marcar a resposta critica e confirmar que o icone aparece.
10. Trocar para resposta nao critica e confirmar que o icone desaparece.
11. Repetir para `TIPPER=3`, validando que o icone aparece quando a resposta e `nao`.
12. Confirmar que perguntas nao criticas nao mostram icone.
13. Confirmar que perguntas tipo texto nao disparam alerta visual nesta etapa.
14. Salvar, sair da aba e voltar.
15. Confirmar que perguntas criticas salvas reaparecem com o icone corretamente.
16. Confirmar que o botao Grava continua funcionando.
17. Confirmar que nao houve regressao visual/global.
