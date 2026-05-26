# Fase 2B - Preferencias remanescentes - Consolidacao parcial apos dois recortes validados

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Modulo comum/core: `Preferencias / Configuracoes remanescentes`
- Etapa: exclusivamente documental
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
  - `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
  - `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
  - `docs/fase_2b_escolha_proximo_recorte_medio_controlado.md`
  - `docs/fase_2b_preferencias_segundo_contrato_profundo.md`
  - `docs/fase_2b_preferencias_combos_geral_modelos_dados_implementacao_minima.md`
  - `docs/fase_2b_preferencias_combos_geral_modelos_dados_validacao_pos_teste.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
  - `docs/11_roadmap_desenvolvimento.md`

## 1. Identificacao da etapa

- Esta etapa consolida parcialmente o estado de `Preferencias remanescentes` apos dois recortes medios controlados validados.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhum helper foi criado, movido ou renomeado nesta etapa.
- Nenhuma fronteira funcional foi alterada nesta etapa.
- O foco e apenas documental, para registrar o estado atual e orientar o proximo caminho seguro da Fase 2B.

## 2. Recortes ja concluidos

### 2A. Preview visual da aba Ambiente

- O que foi extraido parcialmente do `app.js`:
  - montagem visual da lista lateral da aba `Ambiente`;
  - aplicacao visual dos estilos no preview;
  - injeccao do CSS auxiliar do preview;
  - construcao do preview interno da area de exemplo.
- O que permaneceu no `app.js`:
  - abertura da modal;
  - carregamento;
  - salvamento;
  - roteamento;
  - fechamento de modal;
  - `prefAbrirDialogoFonteAmbiente()`;
  - `prefSincronizarUI()`;
  - `prefCarregarDados()` / `prefSalvar*()`;
  - `sysOpt*`.
- Commit de implementacao:
  - `593a5b63669ad00d80609c2210e83bcc7dd88b89`
- Commit de validacao pos-teste:
  - `5bf60619e29124a9e229b1454407100ac28ce0b1`
- Resultado do teste:
  - o usuario informou que o teste manual passou.

### 2B. Combos das abas Geral, Modelos e Dados

- O que foi extraido parcialmente do `app.js`:
  - montagem visual dos combos da aba `Geral`;
  - montagem visual dos combos da aba `Modelos`;
  - montagem visual do select de UF da aba `Dados do usuario`.
- O que permaneceu no `app.js`:
  - abertura da modal;
  - carregamento;
  - salvamento;
  - `requestJson`;
  - payload;
  - roteamento entre abas;
  - fechamento da modal;
  - `prefSincronizarUI()` como orquestrador;
  - `prefAbrirDialogoFonteAmbiente()`;
  - preview de `Ambiente` ja validado;
  - `sysOpt*`;
  - `Odontograma`.
- Helpers criados/ajustados no modulo passivo:
  - `prefEscHtml()`;
  - `prefRenderSelectOptions(select, items, config)`;
  - `prefRenderUfOptions(select, ufs, currentValue)`.
- Commit de implementacao:
  - `05e54e6761b3867b6b594106c3f2459961e7095c`
- Commit de validacao pos-teste:
  - `4d7d0e609897c9bb22a16498181f2b592160afd8`
- Resultado do teste:
  - o usuario informou que os testes passaram.

## 3. Estado atual do modulo Preferencias

- Ja saiu parcialmente do `app.js`:
  - preview visual da aba `Ambiente`;
  - renderizacao dos combos de `Geral`, `Modelos` e `Dados`.
- Permanece no `app.js`:
  - abertura da modal;
  - carregamento;
  - salvamento;
  - `requestJson`;
  - payload;
  - roteamento entre abas;
  - fechamento da modal;
  - `prefSincronizarUI()` como orquestrador;
  - `prefAbrirDialogoFonteAmbiente()`;
  - fluxo `prefCarregarDados()` / `prefSalvar*()`;
  - `sysOpt*`;
  - `Odontograma`.
- Areas ainda sensiveis:
  - `prefEnsureUI()` continua grande e com mistura de montagem estrutural e inicializacao;
  - `prefCarregarDados()` e `prefSalvar*()` continuam atravessando toda a modal;
  - `sysOpt*` continua separado e sensivel;
  - `Odontograma` continua em zona proibida para a Fase 2B sem novo contrato;
  - o restante de `Preferencias` vai ficando mais perto das fronteiras de abertura, sincronizacao e estado global.
- Areas que continuam proibidas para a Fase 2B sem novo contrato:
  - backend;
  - banco;
  - endpoints;
  - permissões;
  - requestJson;
  - payload efetivo;
  - salvamento;
  - `sysOpt*`;
  - `Odontograma`.
- Ainda existe ganho seguro em continuar em Preferencias?
  - sim, mas o ganho marginal agora e menor do que nos dois primeiros recortes;
  - os recortes remanescentes tendem a ficar mais curtos, mais próximos de orquestração e mais perto de áreas sensiveis;
  - por isso a continuidade precisa de nova cautela comparativa antes de qualquer proximo contrato.

## 4. Areas que continuam proibidas

- Backend.
- Banco.
- Endpoints.
- Permissoes.
- `requestJson`.
- Payload efetivo.
- Salvamento.
- `sysOpt*`.
- Odontograma.
- Financeiro.
- Seguranca.
- Debug.
- Correcoes textuais.
- Correcoes de acento.
- Labels, placeholders e mensagens de interface.
- Mojibake.

## 5. Risco de continuar em Preferencias

- Continuar em Preferencias ainda pode produzir recortes medios pequenos e seguros, mas o patamar de ganho ja esta diminuindo.
- A chance de encostar em areas sensiveis aumenta se o proximo passo tentar ampliar `prefEnsureUI()` ou entrar em qualquer fluxo de `sysOpt*` ou `Odontograma`.
- O risco de tocar em payload, salvamento ou `requestJson` continua alto o bastante para justificar uma pausa comparativa.
- O sucesso dos dois recortes validados nao autoriza ampliar escopo automaticamente.

## 6. Opcoes de proximo caminho

### Opcao A - Encerrar Preferencias por enquanto e escolher outra frente da Fase 2B

- Risco:
  - baixo
- Ganho esperado:
  - medio, porque evita esgotar cedo a fronteira segura de Preferencias
- Clareza de teste:
  - alta
- Rollback mental:
  - muito simples
- Chance de tocar areas proibidas:
  - muito baixa
- Recomendacao:
  - forte candidata se a prioridade for preservar margem de seguranca

### Opcao B - Fazer um terceiro contrato profundo ainda em Preferencias

- Risco:
  - medio
- Ganho esperado:
  - medio, mas menor que os dois primeiros recortes
- Clareza de teste:
  - media a alta, dependendo do recorte escolhido
- Rollback mental:
  - simples se o recorte continuar visual/local
- Chance de tocar areas proibidas:
  - crescente, porque `Preferencias` ja ficou mais proxima das fronteiras sensiveis
- Recomendacao:
  - possivel, mas deve ser feito apenas se houver um recorte muito claro e pequeno

### Opcao C - Fazer nova matriz comparativa da Fase 2B entre varios modulos

- Risco:
  - baixo
- Ganho esperado:
  - medio, porque reordena a decisao sem forcar implementacao
- Clareza de teste:
  - alta em nivel documental
- Rollback mental:
  - muito simples
- Chance de tocar areas proibidas:
  - muito baixa, por ser documental
- Recomendacao:
  - a melhor opcao para o proximo passo imediato

## 7. Recomendacao

- A recomendacao e pausar `Preferencias remanescentes` por enquanto e seguir com uma nova matriz comparativa da Fase 2B antes de qualquer terceiro contrato.
- Isso nao encerra `Preferencias`, mas evita ampliar risco automaticamente apos dois recortes bem-sucedidos.
- A proxima etapa deve ser documental, nao implementativa.
- Nao deve haver implementacao direta sem contrato.
- O sucesso dos dois recortes nao autoriza ampliar escopo para `sysOpt*`, `Odontograma`, payload, salvamento ou `requestJson`.

## 8. Registro para roadmap

- A consolidacao parcial dos dois recortes medios validados em Preferencias foi registrada.
- Ambos os testes manuais passaram.
- O estado atual de `Preferencias` na Fase 2B foi documentado como parcialmente consolidado e ainda com fronteiras sensiveis ativas.
- Os limites ainda vigentes foram reforcados.
- A proxima subetapa recomendada e uma nova matriz comparativa da Fase 2B antes de qualquer terceiro contrato em Preferencias.
- Esta etapa nao escolheu implementacao direta.
- A blindagem textual/mojibake foi respeitada.
