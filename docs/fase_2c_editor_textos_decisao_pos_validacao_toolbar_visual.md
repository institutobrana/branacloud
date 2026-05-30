# Fase 2C - Decisao pos-validacao da toolbar visual do Editor de Textos

## 1. Objetivo da decisao

Definir o proximo passo da Fase 2C apos a validacao manual da toolbar visual do Editor de Textos, consolidando a rodada atual antes de qualquer novo recorte.

## 2. Contexto da Fase 2C

- A Fase 2C segue focada em reducao controlada de monolitos com risco medio/medio-alto.
- O Editor de Textos ja passou por duas extracoes reais validadas:
  - bootstrap/shell visual;
  - toolbar visual.
- A toolbar visual foi validada sem problemas percebidos pelo usuario.
- A decisao desta etapa nao implementa nada e nao altera codigo.

## 3. Implementacao validada: toolbar visual do Editor de Textos

- Implementacao validada: extracao da atualizacao visual da toolbar do Editor de Textos.
- Fachada/wrapper preservada em `frontend/app.js`.
- Logica visual concentrada em `frontend/js/modules/editor_textos_bootstrap.js`.
- Namespace exposto: `window.BranaEditorTextosToolbarModule`.

## 4. Commit da implementacao validada

- `27e990d`

## 5. Commit da validacao manual

- `eb70773`

## 6. Relato do usuario

- `PASSOU SEM PROBLEMAS`

## 7. Estado consolidado do Editor de Textos apos as duas extracoes reais da Fase 2C

- O Editor de Textos continua funcional.
- `frontend/app.js` ficou mais fino de forma real.
- O bootstrap/shell visual ja foi deslocado parcialmente para o modulo passivo.
- A toolbar visual tambem foi deslocada para o modulo passivo.
- O editor segue sendo um monolito relevante, mas agora com duas reducoes reais ja aprovadas.

## 8. O que ja foi reduzido em `frontend/app.js`

- O bloco grande de bootstrap inicial foi enxugado.
- Os corpos de atualizacao visual da toolbar e do agendamento foram removidos do monolito.
- A fachada em `frontend/app.js` continua existindo e agora delega comportamento visual para o modulo passivo.

## 9. O que foi concentrado em `frontend/js/modules/editor_textos_bootstrap.js`

- Bootstrap/base visual inicial do Editor de Textos.
- Preparacao do shell.
- Estado base inicial.
- Helpers visuais da toolbar.
- Namespace passivo da toolbar: `window.BranaEditorTextosToolbarModule`.

## 10. O que continua fora do recorte

- Salvamento.
- PDF.
- Assinatura.
- Payload.
- `requestJson`.
- Backend.
- Banco.
- Permissoes.
- `frontend/index.html`.
- Anexos, impressao, fluxo funcional rico e qualquer handler sensivel de edicao que nao tenha contrato proprio.

## 11. Riscos remanescentes

- O Editor de Textos continua grande e sensivel.
- Novos recortes podem encostar em selecao/caret, model-first, reancoragem, TAB/Shift+Tab ou handlers de edicao.
- Qualquer proxima extracao ainda precisa de fronteira pequena e clara para manter a reducao real de `frontend/app.js`.

## 12. Avaliacao dos proximos candidatos

### CANDIDATO 1

- Continuar no Editor de Textos com contrato especifico para painel lateral/listagem visual, somente se houver fronteira clara e reducao real de `frontend/app.js`.
- Avaliacao: possivel, mas exige contrato forte e leitura cuidadosa para nao tocar em fluxos sensiveis.

### CANDIDATO 2

- Continuar no Editor de Textos com contrato especifico para outro bloco visual complementar, se houver bloco claro ainda no `app.js` e sem tocar salvamento, PDF, assinatura, payload, `requestJson`, backend ou banco.
- Avaliacao: possivel, mas a fronteira precisa ser demonstravelmente limpa.

### CANDIDATO 3

- Continuar no Editor de Textos com contrato especifico de acoes visuais simples, somente se nao tocar handlers de edicao sensiveis, model-first, reancoragem, TAB/Shift+Tab, salvamento, PDF, assinatura, payload ou backend.
- Avaliacao: util, mas alto risco de invadir comportamento alem do visual puro.

### CANDIDATO 4

- Pausar momentaneamente o Editor de Textos e voltar para matriz operacional da Fase 2C para escolher outro modulo com reducao real de monolito.
- Avaliacao: opcao conservadora, boa se a proxima fronteira nao ficar cristalina.

### CANDIDATO 5

- Fazer revisao documental curta da rodada do Editor de Textos antes de novo recorte, consolidando as duas extracoes reais ja validadas.
- Avaliacao: a melhor opcao imediata para estabilizar a rodada e evitar abrir um novo recorte sem consolidacao suficiente.

## 13. Decisao final

- Decisao final: `F2C-EDITOR-TOOLBAR-DEC-E`
- Interpretacao: fazer revisao documental curta da rodada do Editor de Textos antes de qualquer novo recorte.
- Justificativa:
  - ja existem duas extracoes reais validadas;
  - a toolbar visual foi aprovada sem problemas percebidos;
  - a rodada atual merece consolidacao documental antes de abrir uma nova fronteira;
  - isso preserva o ganho de reducao sem apressar outro recorte em area sensivel.

## 14. Proxima etapa recomendada

- Fazer revisao documental curta da rodada do Editor de Textos antes de novo recorte.
- Somente depois dessa consolidacao avaliar se a proxima extracao continua no Editor de Textos ou se a Fase 2C volta para a matriz operacional.

## 15. Commit seletivo obrigatorio

Arquivos alvo do commit seletivo desta etapa:

- `docs/fase_2c_editor_textos_decisao_pos_validacao_toolbar_visual.md`
- `docs/11_roadmap_desenvolvimento.md`

## 16. Registro para roadmap

Registrar no roadmap:

- decisao pos-validacao da toolbar visual do Editor de Textos;
- commit da implementacao validada: `27e990d`;
- commit da validacao manual: `eb70773`;
- relato do usuario: `PASSOU SEM PROBLEMAS`;
- decisao final `F2C-EDITOR-TOOLBAR-DEC-E`;
- proxima etapa recomendada;
- confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
