# Plano de retomada da modularizacao segura pos reversao

## Estado atual

- Branch atual confirmada: `modularizacao-segura-fase-1`
- Working tree limpo: sim
- Commites seguros recentes:
  - `1dc8b18` - restaura frontend monolitico
  - `f3cab35` - correcao do duplo clique em Convenios e Planos
- Status atual do frontend:
  - `frontend/app.js` voltou para a base monolitica funcional.
  - `frontend/index.html` carrega o `app.js` monolitico e alguns helpers de compatibilidade em `frontend/js/`.
  - `frontend/js/modules/` esta vazia no estado atual.

## Historico resumido da reversao

1. A modularizacao anterior criou um estado hibrido: parte do shell em `app.js`, parte em modulos extraidos e parte em patches auxiliares.
2. Isso quebrou contratos globais, dispatcher de menu, binds e helpers esperados por varios fluxos.
3. A reversao controlada trouxe o sistema de volta para o `app.js` monolitico funcional do legado.
4. Depois disso, ajustes pequenos e localizados corrigiram contratos globais e o duplo clique em `Convenios e Planos`.

## Por que a modularizacao anterior quebrou o sistema

- O shell ficou dividido entre `app.js`, HTML e varios scripts auxiliares.
- Alguns modulos assumiam funcoes globais que nao estavam mais expostas.
- O dispatcher de menu passou por overrides parciais e perdeu rotas completas.
- Havia dependencias de carregamento e de cache do navegador.
- Alguns fluxos ficaram dependentes de arquivos que o HTML nao carregava mais.

Conclusao pratica:

- a modularizacao foi adiantada antes de fechar o contrato do shell;
- o resultado foi um sistema hibrido instavel;
- a retomada agora precisa ser conservadora e por contrato, nao por copia ampla.

## Papel dos arquivos antigos em `frontend/js/modules/`

### Situacao atual

- Nenhum arquivo foi encontrado em `frontend/js/modules/` no estado atual.
- A pasta existe, mas esta vazia.

### Interpretao operativa

- Nao existe, neste momento, um modulo antigo pronto para ser reativado diretamente dali.
- A referencia historica para modularizacao vem de:
  - `docs/`
  - `frontend/app.js`
  - o backup da modularizacao quebrada
  - comparacao com o legado

### Conclusao

- `frontend/js/modules/` deve ser tratado, por enquanto, como ausencia de modulo ativo.
- Se arquivos antigos reaparecerem em outra branch ou backup, eles devem ser auditados um a um antes de qualquer uso.

## Estrutura atual observada

### Frontend

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/`
  - `easy_font_dialog.js`
  - `mock_simbolo_editor.html`
  - `preferencias_ambiente_patch.js`
  - `prestadores_agenda_apresentacao_force.js`
  - `prestadores_agenda_apresentacao_patch.js`
  - `prestadores_agenda_fonte_color_patch.js`
  - `prestadores_agenda_hotfix.js`
  - `prestadores_agenda_refino.js`
  - `prestadores_agenda_utf_fix.js`
  - `prestadores_override.js`
- `frontend/js/modules/` vazio
- `frontend/js/utils/` vazio

### Scripts carregados no HTML

O `frontend/index.html` atual carrega:

- `frontend/app.js?v=20260512-convplan-plano2`
- `frontend/easy_font_dialog.js?v=20260330-pref-amb-font3`
- `frontend/prestadores_override.js?v=20260407-prest-agenda-persist2`
- `frontend/prestadores_agenda_hotfix.js?v=20260329-prest-agenda-hotfix-restore7`
- `frontend/prestadores_agenda_apresentacao_patch.js?v=20260407-prest-agenda-apres-sync16`
- `frontend/prestadores_agenda_refino.js?v=20260329-prest-agenda-refino25`
- `frontend/prestadores_agenda_fonte_color_patch.js?v=20260328-prest-agenda-fonte-color4`
- `frontend/prestadores_agenda_utf_fix.js?v=20260328-prest-agenda-utf-fix2`

Nao ha carregamento ativo de `frontend/js/modules/*.js`.

## Documentos consultados

Lidos com sucesso:

- `README.md`
- `docs/00_master_guide.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/reversao_controlada_modularizacao_frontend.md`
- `docs/comparacao_appjs_legado_vs_github_pos_reversao.md`
- `docs/auditoria_console_pos_reversao_erros_reais.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`

Nao encontrados no estado atual:

- `docs/frontend_modularizacao_fase_4_medicamentos.md`
- `docs/frontend_modularizacao_fase_6_unidades.md`
- `docs/frontend_modularizacao_fase_7_convenios.md`
- `docs/frontend_modularizacao_fase_13_materiais.md`
- `docs/modularizacao_subetapa_1_simbolos_graficos_painel_listagem.md`

## Matriz de reaproveitamento

Como nao ha arquivos ativos em `frontend/js/modules/`, a matriz de reaproveitamento direto fica vazia no estado atual.

### Matriz resumida de alvos futuros

| Alvo monolitico em `frontend/app.js` | Complexidade percebida | Dependencias globais | Status recomendado | Observacao |
|---|---:|---|---|---|
| `CID` | Baixa | Baixas | Reaproveitamento parcial possivel | Bom primeiro candidato para isolamento pequeno |
| `Medicamentos` | Baixa a media | Medias | Auditar antes de qualquer uso | Fluxo importante, mas um pouco maior que CID |
| `Unidades` | Media | Medias | Auditar antes de qualquer uso | Usa modal, lista e helpers de campo |
| `Convenios e planos` | Media a alta | Medias a altas | Auditar antes de qualquer uso | Duas grades, dois modais, calendario e binds sensiveis |
| `Materiais` | Media | Medias | Auditar antes de qualquer uso | Tem carga e edicao, mas e mais contido que agenda |
| `Simbolos graficos` | Alta | Altas | Alto risco, nao reativar direto | Depende de editor, biblioteca e helpers globais |
| `Agenda` | Muito alta | Muito altas | Alto risco, nao reativar direto | Cluster mais sensivel do sistema |
| `Auxiliares` | Media | Medias | Auditar antes de qualquer uso | Usa painel duplo e modal simples |
| `Plano de contas` | Media | Medias | Auditar antes de qualquer uso | Depende de arvores/listas e modais auxiliares |

## Nova estrategia segura

### Regra de ouro

Nao remover funcoes funcionais do `frontend/app.js` antes de o novo modulo estar validado em navegacao real, com fallback e sem regressao.

### Como usar os arquivos antigos

- Usar apenas como referencia historica.
- Nao carregar automaticamente no HTML.
- Nao substituir funcoes do `app.js` por copia direta.
- Reaproveitar somente blocos puros, helpers e contratos que passem por comparacao com o monolito atual.

### Como comparar cada modulo antigo com o `app.js`

1. Localizar o trecho correspondente no `app.js` funcional.
2. Mapear:
   - funcoes de abertura
   - renderizacao
   - binds/eventos
   - helpers puros
   - dependencias globais
   - chamadas a `requestJson`
3. Verificar se o modulo proposto depende de:
   - DOM ainda nao criado
   - `window.*`
   - estado global compartilhado
   - carregamento adicional no HTML
4. So entao decidir se existe algo seguro para mover.

### Estrategia de wrapper/fallback

- manter a funcao funcional no `app.js` como fonte principal;
- criar wrapper no modulo novo apenas quando o fluxo estiver estavel;
- expor em `window` apenas o minimo necessario para compatibilidade;
- preservar o caminho antigo ate a validacao final do novo caminho.

### Critarios para escolher o primeiro modulo

O primeiro modulo deve ter:

- menor dependencia global possivel;
- menor numero de binds;
- menor quantidade de telas internas;
- menor risco de interagir com outros modulos;
- teste manual simples;
- rollback facil.

### Ordem recomendada dos modulos

1. `CID`
2. `Medicamentos`
3. `Unidades`
4. `Materiais`
5. `Auxiliares`
6. `Convenios e planos`
7. `Plano de contas`
8. `Simbolos graficos`
9. `Agenda`

## Primeiro modulo recomendado

### Recomendacao

**CID** e o primeiro modulo recomendado.

### Justificativa tecnica

- superficie menor que `Medicamentos`;
- fluxo mais contido;
- menor chance de acoplar com outros modulos;
- menos dependencias de editor complexo, abas ou multiplas grades;
- se algo falhar, o raio de impacto tende a ser mais previsivel.

### Alternativa aceitavel

Se houver necessidade de um modulo com mais valor funcional imediato, `Medicamentos` e o segundo candidato natural, mas com risco um pouco maior que `CID`.

## Subetapas para o primeiro modulo recomendado

### Subetapa 0

- Mapear funcoes do modulo no `app.js` e comparar com a referencia historica.
- Nao alterar nada.

### Subetapa 1

- Criar arquivo/namespace vazio ou controlado.
- Nao ativar comportamento novo.

### Subetapa 2

- Mover apenas helpers puros.
- Sem DOM.
- Sem fetch.
- Sem estado global.
- Sem eventos.

### Subetapa 3

- Criar wrapper/fallback no `app.js`.
- Manter o comportamento original funcionando.

### Subetapa 4

- Mover renderizacao/listagem somente se a subetapa anterior estiver validada.

### Subetapa 5

- Mover binds/eventos somente depois de validar renderizacao.

### Subetapa 6

- Testar manualmente o modulo.
- Fazer checklist reduzido de regressao.

### Subetapa 7

- Commit pequeno e documentado.

## Checklist manual do primeiro modulo

Antes de cada subetapa e antes de commit:

- abrir o modulo pelo menu;
- confirmar que o painel abre;
- confirmar que a listagem carrega;
- confirmar que o modal abre;
- confirmar que salvar nao foi quebrado;
- confirmar que excluir nao foi quebrado, se existir;
- abrir o console e verificar ausencia de `ReferenceError`;
- testar logout/login rapido se o modulo for sensivel a sessao.

## Checklist de regressao geral reduzido

- login
- `/me`
- um modulo de cadastro
- um modulo operacional
- `Convênios e planos`
- `Agenda`
- `Unidades`
- console sem erros novos

## Comandos Git recomendados

### Para diagnostico

```powershell
git branch --show-current
git status --short
git diff --stat
```

### Para commit por subetapa

```powershell
git add <arquivos>
git commit -m "feat(frontend): modulariza cid com fallback seguro"
```

### Para revisao antes do commit

```powershell
git diff -- frontend/app.js
git diff -- frontend/index.html
```

## Comandos de rollback

### Para retornar um arquivo ao estado do ultimo commit

```powershell
git restore --source=HEAD -- frontend/app.js
```

### Para retirar um arquivo especifico da area de stage

```powershell
git restore --staged <arquivo>
```

### Para conferir o estado apos rollback

```powershell
git status --short
```

## Critarios para avançar

Avancar apenas se:

- o modulo novo abre;
- o fluxo antigo continua funcionando;
- o console nao mostra erro;
- o fallback continua disponivel;
- o teste manual foi repetido ao menos uma vez apos recarregar a pagina.

## Critarios para parar

Parar imediatamente se aparecer:

- `ReferenceError`;
- bind duplicado;
- modal que nao fecha;
- menu que para de abrir;
- dependencia nova em `window.*` sem justificativa;
- necessidade de mexer em backend ou banco antes de concluir o modulo;
- regressao em outro modulo ja validado.

## Conclusao

A retomada segura da modularizacao deve sair do monolito funcional atual sem reativar automaticamente `frontend/js/modules/`.

O caminho mais seguro agora e:

1. escolher `CID` como primeiro modulo;
2. auditar o trecho monolitico correspondente;
3. mover pouco;
4. manter wrapper/fallback;
5. validar no navegador;
6. so entao seguir para o proximo modulo.

