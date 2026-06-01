# Ficha Pessoal - Historico - Etapa 1 - modularizacao passiva

## Objetivo
Registrar a etapa 1 da frente Ficha Pessoal / Historico, criando uma ponte passiva e conservadora para a aba Historico sem alterar o comportamento funcional atual.

## Escopo aplicado
- Criado `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- Mantida a inclusao do modulo no carregamento do frontend.
- Ajustado `frontend/app.js` apenas para delegar os pontos locais da aba ao novo modulo.
- Atualizado `docs/11_roadmap_desenvolvimento.md` com o estado da etapa.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`
- `frontend/index.html`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes e trechos preparados
- `bind()`
- `adicionarLinhaPadrao()`
- `removerPrimeiraLinha()`
- `limparTela()`
- `onLimparNovo()`
- `onPacienteAplicado()`
- `beforeAbandonar()`
- `beforeSetTab()`
- No `frontend/app.js`, os handlers locais da aba Historico foram delegados para o novo modulo e os wrappers compatíveis foram mantidos.

## Confirmacao funcional
- Nao houve mudanca funcional pretendida nesta etapa.
- A tela continua com os mesmos botoes, a mesma grade e o mesmo comportamento local anterior.
- Nao foi adicionada persistencia nova.
- Nao foi criado backend novo.
- Nao foi criado endpoint novo.
- Nao foi criado model novo.
- Nao foi alterado schema, migration ou seed.

## Riscos observados
- A aba Historico ainda depende do monolito para o contexto global da Ficha Pessoal.
- O novo modulo e uma ponte passiva; qualquer futura expansao deve continuar pequena e separada.
- O carregamento do script precisa permanecer antes de `frontend/app.js` para manter a compatibilidade esperada.

## Como testar
1. Abrir a Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Confirmar que a tela abre como antes.
5. Confirmar que a grade atual continua aparecendo.
6. Confirmar que os botoes `Novo historico`, `Altera historico`, `Elimina historico` e `Confirma` continuam com o mesmo comportamento anterior.
7. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: ajuste visual e revisao dos botoes ou selecao/linha ativa, conforme o resultado tecnico encontrado.

## Blindagem textual
A blindagem textual/mojibake foi respeitada: nao houve correcao de acentos, nomes visiveis ou textos de interface fora do necessario para esta extracao passiva.
