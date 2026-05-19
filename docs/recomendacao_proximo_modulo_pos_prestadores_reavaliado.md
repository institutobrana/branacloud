# Recomendação do próximo módulo após Prestadores - Reavaliação conservadora

## Objetivo

Reavaliar, de forma exclusivamente documental, qual deve ser o próximo módulo mais seguro após o encerramento e pausa de Prestadores.

## Escopo

Esta etapa nao altera codigo, nao cria modulo JS, nao mexe em backend, banco, endpoints, schema, migrations, payload, salvamento, materiais, custos, reajustes ou textos visiveis.

Foram considerados apenas os candidatos remanescentes ja citados nas varreduras anteriores e nos documentos de Prestadores.

## Arquivos inspecionados

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_procedimentos.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/prestadores.js`

## Checks iniciais

- branch atual: `modularizacao-segura-fase-1`
- `git status --short` apresentava apenas pendencias nao relacionadas ja existentes no worktree
- `git log --oneline -8` mostrava `45b797d Reavalia Prestadores apos prestStatusHtml` no topo
- `git diff --stat` estava vazio antes das alteracoes desta etapa
- `git diff --cached --stat` estava vazio antes das alteracoes desta etapa
- `node --check frontend/app.js` executado com sucesso

## Contexto da pausa de Prestadores

Prestadores foi pausado depois da Subetapa 8 porque os helpers pequenos e seguros ja foram delegados e o restante do bloco ficou concentrado em UI, renderizacao, selecao, cache e fluxo sensivel.

Estado consolidado de Prestadores:

- `frontend/js/modules/prestadores.js` existe
- helpers delegados:
  - `prestFmtCodigo`
  - `prestStatusHtml`
- funcoes remanescentes ainda concentradas no `app.js`:
  - `prestSelecionado`
  - `prestFiltrarLista`
  - `prestRender`
  - `prestSelecionarLinha`
  - `prestCarregar`
  - `prestAcoesPlaceholder`
  - `prestEnsureUI`
  - `prestAbrir`
  - `prestCfg`
  - `prestadoresCache`
  - `prestadorSelId`

Conclusao da pausa:

- nao apareceu mais nenhum helper pequeno com seguranca suficiente para extracao literal imediata
- o melhor proximo passo para Prestadores e pausar

## Módulos avaliados

- Intervencoes / Procedimentos
- Prestadores
- Convênios e Planos
- Materiais
- Símbolos Gráficos
- Anamnese
- Medicamentos
- Plano de Contas
- Etiquetas
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares

## Critérios de segurança

Foram considerados:

- fronteira clara
- menor dependencia de payload/salvamento
- menor risco de backend/banco
- menor risco de materiais/custos/reajustes
- menor risco de UI complexa
- existencia de helpers puros pequenos
- possibilidade de subetapa 0 documental antes de qualquer codigo

## Módulos descartados por risco

- `Materiais`
  - superficie ampla
  - acoplamento com listas, modais, indices e fluxos sensiveis
- `Procedimentos Genéricos`
  - muito acoplado a materiais e a regras de negocio
- `Anamnese`
  - fluxo API-driven, clinico e sensivel
- `Medicamentos`
  - embora mais contido, ainda e CRUD com persistencia e fluxo funcional consolidado
- `Plano de Contas`
  - ciclo ja consolidado em documentação anterior
- `Etiquetas`
  - ciclo ja consolidado em documentação anterior
- `Prestadores`
  - pausado apos Subetapa 8
- `Preferências e Opções do Sistema`
  - fechado/pausado nesta rodada

## Módulos com cautela

- `Símbolos Gráficos`
  - fronteira existe e ha material documental
  - porem o editor/preview visual aumenta a fragilidade
  - nao deve ser tratado como primeira escolha automatica
- `Anamnese`
  - ha helpers e mapas, mas o fluxo clinico e API-driven continua sensivel
- `Intervencoes / Procedimentos`
  - ja possui mapeamento forte e fronteira clara
  - porem carrega dependencia de materiais, custos e vinculacoes, exigindo cautela

## Candidatos secundários

- `Símbolos Gráficos`
- `Anamnese`

Ambos podem ser documentados no futuro, mas nao superam o equilibrio atual de `Intervencoes / Procedimentos` entre fronteira, documentação existente e previsibilidade.

## Próximo módulo recomendado

**Intervencoes / Procedimentos**

## Justificativa da recomendação

`Intervencoes / Procedimentos` e o melhor proximo modulo para uma retomada documental conservadora porque:

- tem fronteira funcional clara no `app.js`
- possui prefixo consistente (`proc*`)
- ja existe documentação extensa de mapeamento, helpers, fronteiras e fechamento
- e o modulo ainda mais claramente concentrado entre os candidatos remanescentes que nao estao encerrados
- permite iniciar por Subetapa 0 documental sem tocar em comportamento

A recomendacao e somente documental. Nao se trata de retomada funcional agora.

## Riscos conhecidos do módulo recomendado

- dependencia com materiais
- dependencia com procedimentos genericos
- dependencia com custos, preco, repasse e reajuste
- muitos eventos e binds
- tabela principal grande
- modais e snapshots visuais
- risco de tocar cedo em comportamento clinico e financeiro

## Primeira etapa recomendada

**Subetapa 0 documental**

Objetivo da primeira etapa:

- mapear o monolito
- registrar fronteiras
- localizar helpers puros
- classificar riscos
- nao mover codigo

## Limites obrigatórios da próxima etapa

- nao alterar `frontend/app.js`
- nao alterar `frontend/index.html`
- nao alterar `frontend/js/modules`
- nao alterar backend, banco, schema, migrations ou endpoints
- nao alterar payload ou salvamento
- nao alterar materiais, custos, reajustes, convenios ou comissoes
- nao corrigir texto, acento ou mojibake
- nao criar namespace novo sem mapeamento documental

## Confirmação de não alteração funcional

Esta e uma recomendacao documental.

Nenhum codigo foi alterado, nenhum arquivo funcional foi modificado e nenhuma acao de backend, banco ou salvamento foi executada.
