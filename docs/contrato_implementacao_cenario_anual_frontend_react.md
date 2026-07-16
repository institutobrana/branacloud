# Contrato de Implementação - Cenário Anual no Frontend React

## 1. Objetivo

Este documento consolida o contrato funcional e técnico do módulo de **Cenário anual** do Brana Cloude no novo frontend React.

Ele existe para orientar a implementação futura sem nova descoberta básica de:

- campos;
- propriedades;
- fórmulas;
- payloads;
- ações;
- permissões;
- integrações;
- arquitetura;
- critérios de aceite.

Este documento não implementa o módulo.
Este documento não altera backend, banco, menu, rota, legado ou build.

## 2. Ambiente usado nesta complementação

- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `https://github.com/institutobrana/branacloud.git`

Status inicial resumido:

- worktree sujo com muitas alterações de outras frentes;
- não houve commit;
- não houve push;
- não houve reversão de arquivos fora do escopo.

## 3. Fontes relidas

Fontes reais relidas nesta etapa:

- `frontend/index.html`
- `frontend/app.js`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`
- `backend/security/permissions.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/services/api.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`
- `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js`
- `frontend-react/src/features/cenarioAnual/cenarioAnual.css`

Documentos de apoio relidos:

- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`

## 4. Contexto funcional comprovado

O cenário anual já existe no frontend legado, dentro de `frontend/index.html` e `frontend/app.js`, e também já possui uma primeira implementação React em `frontend-react/src/features/cenarioAnual/`.

O contrato abaixo descreve a paridade funcional esperada entre:

- tela legada;
- API existente;
- feature React modular.

## 5. Fluxo geral do módulo

Fluxo confirmado no código:

1. O usuário abre o painel/tela de cenário anual.
2. O frontend carrega o cenário salvo da clínica via `GET /cenario`.
3. A tela recalcula totais enquanto o usuário altera campos.
4. O usuário salva via `POST /cenario`.
5. O usuário calcula fixos anuais via `POST /cenario/calcular-fixos`.

## 6. Contratos de API

### 6.1 `GET /cenario`

Fonte:

- `backend/routes/cenario_routes.py`

Comportamento:

- exige autenticação;
- usa `get_current_user`;
- filtra por `current_user.clinica_id`;
- quando não encontra registro, retorna valores padrão do schema.

Propriedades retornadas pelo backend:

- `meses_trabalhados`
- `dias_uteis_mes`
- `dias_uteis_ano`
- `horas_atendimento_dia`
- `num_consultorios`
- `num_consultorios_flex`
- `horas_ano`
- `modo_horas`
- `gasto_anual_particular`
- `gasto_anual_empresa`
- `cartao`
- `ir`
- `cd`
- `custo_ano`
- `cfph`
- `cfpm`
- `total_horas_fixo`
- `total_minutos_fixo`
- `total_turnos_fixo`
- `total_horas_flex`
- `total_minutos_flex`
- `total_turnos_flex`
- `turnos_flex`

Exemplo de resposta válida:

```json
{
  "meses_trabalhados": 12,
  "dias_uteis_mes": 22,
  "dias_uteis_ano": 264,
  "horas_atendimento_dia": 8,
  "num_consultorios": 1,
  "num_consultorios_flex": 1,
  "horas_ano": 0,
  "modo_horas": "Perfil Fixo",
  "gasto_anual_particular": 0,
  "gasto_anual_empresa": 0,
  "cartao": 0,
  "ir": 0,
  "cd": 0,
  "custo_ano": 0,
  "cfph": 0,
  "cfpm": 0,
  "total_horas_fixo": 0,
  "total_minutos_fixo": 0,
  "total_turnos_fixo": 0,
  "total_horas_flex": 0,
  "total_minutos_flex": 0,
  "total_turnos_flex": 0,
  "turnos_flex": {
    "1": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "2": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "3": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "4": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "5": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "6": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 }
  }
}
```

### 6.2 `POST /cenario`

Fonte:

- `backend/routes/cenario_routes.py`

Comportamento:

- exige autenticação;
- usa `get_current_user`;
- filtra por `current_user.clinica_id`;
- faz upsert por clínica;
- grava `turnos_flex` serializado em JSON;
- não cria múltiplos cenários para a mesma clínica.

Exemplo de payload completo:

```json
{
  "meses_trabalhados": 12,
  "dias_uteis_mes": 22,
  "dias_uteis_ano": 264,
  "horas_atendimento_dia": 8,
  "num_consultorios": 1,
  "num_consultorios_flex": 1,
  "horas_ano": 264,
  "modo_horas": "Perfil Fixo",
  "gasto_anual_particular": 0,
  "gasto_anual_empresa": 0,
  "cartao": 0,
  "ir": 0,
  "cd": 0,
  "custo_ano": 0,
  "cfph": 0,
  "cfpm": 0,
  "total_horas_fixo": 2112,
  "total_minutos_fixo": 126720,
  "total_turnos_fixo": 528,
  "total_horas_flex": 0,
  "total_minutos_flex": 0,
  "total_turnos_flex": 0,
  "turnos_flex": {
    "1": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "2": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "3": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "4": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "5": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
    "6": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 }
  }
}
```

### 6.3 `POST /cenario/calcular-fixos`

Fonte:

- `backend/routes/cenario_routes.py`

Comportamento:

- exige autenticação;
- usa `get_current_user`;
- filtra por `current_user.clinica_id`;
- recebe `ano` como inteiro;
- transforma o ano em string e usa `LIKE "%{ano}%"` em `data_pagamento`;
- soma lançamentos de débito;
- separa total pessoal e total empresa;
- usa os grupos `Custo fixo pessoal` e `Custo fixo profissional`;
- usa as variantes de conta pessoais e clínicas existentes no código;
- retorna `fixo_pessoal`, `fixo_empresa`, `custo_anual`.

Resposta:

```json
{
  "fixo_pessoal": 0,
  "fixo_empresa": 0,
  "custo_anual": 0
}
```

## 7. Inventário completo do Perfil horÃ¡rio fixo

### 7.1 Tabela de campos

Fonte principal:

- `frontend/index.html`
- `frontend/app.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`

| Label visual | ID no legado | Propriedade da API | Tipo | Editável | Calculado | Persistido | Valor padrão | min | max | step | Formato | Regra |
|---|---|---|---|---|---|---|---|---:|---:|---:|---|---|
| Meses de trabalho no Ano | `txtMesestrabalhados` | `meses_trabalhados` | número | sim | não | sim | `12` no HTML legado; `12` no React | 0 | sem limite explícito | sem `step` explícito no legado; `1` no React | inteiro/decimal | define a base anual de meses |
| Dias úteis / Mês | `txtDiasUteisMes` | `dias_uteis_mes` | número | sim | não | sim | `22` no HTML legado; `22` no React | 0 | sem limite explícito | sem `step` explícito no legado; `1` no React | inteiro/decimal | multiplicado pelos meses de trabalho |
| Dias úteis / Ano | `lblDiasUteisAno` | `dias_uteis_ano` | número | não | sim | sim | `0` | 0 | sem limite explícito | sem `step` | inteiro/decimal | `meses_trabalhados × dias_uteis_mes` |
| Horas por dia | `txtHorasAtendimentoDia` | `horas_atendimento_dia` | número | sim | não | sim | `8` no HTML legado; `8` no React | 0 | sem limite explícito | no React `0,25`; no legado sem `step` explícito | decimal | entra no cálculo do total fixo |
| N° de Consultórios | `txtNumConsultorios` | `num_consultorios` | número | sim | não | sim | `1` | 1 no React; `min=1` no legado | sem limite explícito | `1` | inteiro | no legado é normalizado por `Math.max(1, parseInt(...))` |
| Horas por ano | `lblTotalHorasFixo` / `total_horas_fixo` | `total_horas_fixo` | número | não no legado; sim no React como leitura | sim | sim | `0` | 0 | sem limite explícito | sem `step` | decimal | resultado do perfil fixo |
| Minutos por ano | `lblTotalMinutosFixo` / `total_minutos_fixo` | `total_minutos_fixo` | número | não | sim | sim | `0` | 0 | sem limite explícito | sem `step` | decimal | `horas_ano × 60` |
| Turnos por ano | `lblTotalTurnosFixo` / `total_turnos_fixo` | `total_turnos_fixo` | número | não | sim | sim | `0` | 0 | sem limite explícito | sem `step` | decimal | `horas_ano ÷ 4` |

### 7.2 Fórmulas reais do perfil fixo

Origem legada:

- `frontend/app.js`, função `atualizarDiasAno`
- `frontend/app.js`, função `atualizarTotaisFixo`

Fórmulas:

```text
dias_uteis_ano = meses_trabalhados × dias_uteis_mes
horas_ano = horas_por_dia × dias_uteis_ano × Math.max(1, numero_consultorios)
minutos_ano = horas_ano × 60
turnos_ano = horas_ano ÷ 4
```

Comportamento de `Math.max(1, numero_consultorios)` no legado:

- se o valor for `0`, a fórmula usa `1`;
- se o valor for inválido e `parseInt` der `NaN`, o código cai para `1` por causa do fallback `parseInt(... || "1", 10)`;
- o valor visual do campo pode permanecer `0` ou vazio conforme a edição do usuário, mas o cálculo não usa `0`;
- o React atual reproduz essa proteção usando `Math.max(1, Math.trunc(... || 1))` nas normalizações.

Arredondamento e casas decimais:

- o legado usa `formatScenarioNum` para renderização;
- o React atual usa `InputNumber` e `toLocaleString` / `Number`;
- o cálculo em si não aplica arredondamento especial além da divisão;
- não há regra explícita de truncamento no backend.

Campos vazios ou inválidos:

- no legado, a conversão usa `toFloat(...)` e cai para `0`;
- para consultórios, o mínimo efetivo é `1`;
- no React atual, `parseNumber` converte inválidos em `0` e o `Math.max(1, ...)` preserva o mínimo.

### 7.3 Inventário completo do Perfil horÃ¡rio flexível

Fonte principal:

- `frontend/index.html`
- `frontend/app.js`

| Dia | Índice em `turnos_flex` | Manhã | Tarde | Noite | Total diário | Dias no ano | Horas por ano |
|---|---:|---|---|---|---|---|---|
| Segunda | `1` | `txtManha1` | `txtTarde1` | `txtNoite1` | `lblTotalDia1` | `txtDiasAno1` | `lblHorasAnoDia1` |
| Terça | `2` | `txtManha2` | `txtTarde2` | `txtNoite2` | `lblTotalDia2` | `txtDiasAno2` | `lblHorasAnoDia2` |
| Quarta | `3` | `txtManha3` | `txtTarde3` | `txtNoite3` | `lblTotalDia3` | `txtDiasAno3` | `lblHorasAnoDia3` |
| Quinta | `4` | `txtManha4` | `txtTarde4` | `txtNoite4` | `lblTotalDia4` | `txtDiasAno4` | `lblHorasAnoDia4` |
| Sexta | `5` | `txtManha5` | `txtTarde5` | `txtNoite5` | `lblTotalDia5` | `txtDiasAno5` | `lblHorasAnoDia5` |
| Sábado | `6` | `txtManha6` | `txtTarde6` | `txtNoite6` | `lblTotalDia6` | `txtDiasAno6` | `lblHorasAnoDia6` |

Domingo:

- não existe no HTML legado;
- não possui índice próprio em `turnos_flex`;
- não é exibido nem persistido no modelo atual;
- portanto, a correspondência comprovada cobre apenas 1 a 6.

Pendência não comprovada:

- não há prova explícita de que os índices 1 a 6 sejam rotulados no legado como Segunda a Sábado no texto do HTML; a correspondência foi inferida pela ordenação semanal e pela ausência de Domingo. Essa inferência deve ser tratada como pendência até validação adicional.

### 7.4 Estrutura completa de `turnos_flex`

Fonte:

- `backend/routes/cenario_routes.py`
- `frontend/app.js`
- `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js`

Estrutura real:

```json
{
  "1": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
  "2": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
  "3": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
  "4": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
  "5": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 },
  "6": { "manha": 0, "tarde": 0, "noite": 0, "dias": 0 }
}
```

Comportamento comprovado:

- os valores são tratados como números no React atual;
- o legado converte com `toFloat(...)`;
- o backend serializa com `json.dumps(...)` ao salvar;
- o backend desserializa com `json.loads(...)` ao carregar;
- quando faltam chaves, o frontend legado e o React atual normalizam para `0`;
- `null` vira `0` pela normalização;
- dados antigos com estrutura parcial são completados com zeros no React atual;
- o payload do React atual sempre envia as 6 chaves.

### 7.5 Fórmulas do perfil flexível

Origem legada:

- `frontend/app.js`, funções `atualizarTotalDiaIndex` e `atualizarTotaisFlex`

Fórmulas:

```text
total_dia = manha + tarde + noite
horas_ano_dia = total_dia × dias_no_ano
horas_ano_total = soma(horas_ano_dia) × numero_consultorios
minutos_ano_total = horas_ano_total × 60
turnos_ano_total = horas_ano_total ÷ 4
```

Campos editáveis:

- manhã;
- tarde;
- noite;
- dias;
- número de consultórios flexíveis.

Campos derivados:

- total diário;
- horas anuais do dia;
- horas totais do perfil;
- minutos totais;
- turnos totais.

Casas decimais e arredondamento:

- o legado permite valores decimais via `toFloat`;
- o React atual usa `InputNumber` com `step=0,25` para manhã/tarde/noite;
- não existe arredondamento especial além da conversão numérica.

Comportamento com zero:

- zero é aceito como entrada;
- zero produz total zero.

Comportamento com vazio:

- vazio vira zero.

Atualização em tempo real:

- no legado, os totais recalculam em `input`;
- no React, `onValuesChange` recalcula `buildSummary(...)` em tempo real.

Valores enviados no payload:

- `turnos_flex`;
- `num_consultorios_flex`;
- `total_horas_flex`;
- `total_minutos_flex`;
- `total_turnos_flex`.

## 8. Cenário financeiro

### 8.1 Inventário completo

Fonte principal:

- `frontend/index.html`
- `frontend/app.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`

| Bloco | Label visual | ID no legado | Propriedade da API | Tipo | Editável | Calculado | Persistido | Máscara | Origem |
|---|---|---|---|---|---|---|---|---|---|
| Ano-base e cálculo | Digite o ano-base de cálculo desejado | `box_Ano` | `ano_calculo` no React; `ano` no endpoint de cálculo | número | sim | não no campo; sim no resultado do endpoint | não | inteiro | legado e React |
| Ano-base e cálculo | botão Calcular | `btn-calcular-fixos` | aciona `POST /cenario/calcular-fixos` | ação | sim | sim | não | botão | legado |
| Resultado | Custo Fixo Anual do Cirurgião | `lblFixo_pessoal` | `fixo_pessoal` | moeda | não | sim | não | moeda BRL | resultado do endpoint |
| Resultado | Custo Fixo Anual Profissional | `lblFixo_empresa` | `fixo_empresa` | moeda | não | sim | não | moeda BRL | resultado do endpoint |
| Resultado | Custo Anual | `lblCusto_Anual` | `custo_anual` | moeda | não | sim | não | moeda BRL | resultado do endpoint |
| Gastos informados | Gasto Anual Particular | `txtGastoAnualParticular` | `gasto_anual_particular` | moeda | sim | não | sim | moeda BRL | usuário |
| Gastos informados | Gasto Anual da Clínica | `txtGastoAnualEmpresa` | `gasto_anual_empresa` | moeda | sim | não | sim | moeda BRL | usuário |
| Perfil e custos por tempo | Escolha o perfil de horário | `cboHorasAno` | `modo_horas` | combo | sim | não | sim | valor interno | seleção |
| Perfil e custos por tempo | Horas por Ano | `txtHorasAno` | `horas_ano` | número/moeda de horas | sim no legado; no React pode ser campo de entrada ou derivado conforme formulário | sim, por seleção | sim | decimal | perfil selecionado |
| Perfil e custos por tempo | Custo Anual | `lblCustoAno` | `custo_ano` | moeda | não | sim | sim | moeda BRL | soma dos gastos |
| Perfil e custos por tempo | Custo Fixo por Hora | `lblCFPH` | `cfph` | número/moeda | não | sim | sim | decimal | cálculo local |
| Perfil e custos por tempo | Custo Fixo por Minuto | `lblCFPM` | `cfpm` | número/moeda | não | sim | sim | decimal | cálculo local |
| Percentuais | Imposto de Renda (%) | `txtIR` | `ir` | percentual | sim | não | sim | percentual | usuário |
| Percentuais | Comissão Dentista (%) | `txtCD` | `cd` | percentual | sim | não | sim | percentual | usuário |
| Percentuais | Taxa Cartão (%) | `txtCartao` | `cartao` | percentual | sim | não | sim | percentual | usuário |

Divergências de nomenclatura observadas:

- o legado usa `empresa` em campos e labels, enquanto o React já exibe `clínica` em alguns pontos;
- o retorno do cálculo usa `fixo_pessoal`, `fixo_empresa`, `custo_anual`;
- a UI exibe “Custo Fixo Anual do Cirurgião” e “Custo Fixo Anual Profissional”, mas o backend não expõe essa nomenclatura como nomes de colunas;
- o cálculo anual da tela mistura custo informado manualmente e custo calculado pelo endpoint;
- a palavra “Custo Anual” aparece em mais de um contexto, então precisa ser tratada por origem e finalidade.

### 8.2 Combo de perfil

Fonte:

- `frontend/app.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`

Labels visuais e values internos:

| Label visual | Value interno | Origem |
|---|---|---|
| Perfil Fixo | `Perfil Fixo` | legado e React |
| Perfil Flexível | `Perfil Flexível` | legado e React |

Comportamento comprovado:

- o value salvo em `modo_horas` é o texto do perfil;
- o valor padrão do backend é `Perfil Fixo`;
- o frontend legado recria o combo ao recalcular totais;
- o React atual usa `Segmented` com os dois perfis;
- ao trocar a opção, o valor de horas muda para o perfil selecionado;
- se o valor vier inválido, o React normaliza para `Perfil Fixo`.

Relação com horas do perfil fixo e flexível:

- `Perfil Fixo` usa `lblTotalHorasFixo` / `total_horas_fixo`;
- `Perfil Flexível` usa `lblTotalHorasAnoFlex` / `total_horas_flex`;
- a troca da opção altera o campo de horas usado no cálculo de custo por hora.

### 8.3 Fórmulas do cenário financeiro

Origem:

- `frontend/app.js`, função `atualizarCustos`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`, função `buildSummary`
- `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js`

Fórmulas:

```text
custo_anual_informado = gasto_anual_particular + gasto_anual_empresa
custo_fixo_hora = custo_anual_informado ÷ horas_ano
custo_fixo_minuto = custo_fixo_hora ÷ 60
```

Esclarecimento das ocorrências de “Custo Anual”:

- `custo_ano` na UI do React corresponde à soma dos gastos informados localmente;
- `custo_anual` no retorno do endpoint `POST /cenario/calcular-fixos` corresponde ao custo anual consolidado calculado no backend;
- `lblCusto_Anual` no legado mostra o retorno do cálculo anual;
- `lblCustoAno` no legado mostra a soma dos gastos informados localmente;
- o consumo por procedimentos usa `cfph` e `cfpm`, não o label de exibição em si.

Divisão por zero e valores ausentes:

- se `horas_ano` for zero, o custo por hora e por minuto ficam zero;
- o backend atual não lança erro, apenas retorna zero na prática do cálculo da UI;
- valores ausentes são tratados como zero.

## 9. Comportamento das ações

| Ação | Função no legado | Valida | Endpoint | Altera estado | Fecha tela | Mensagem |
|---|---|---|---|---|---|---|
| Salvar | `salvarCenario()` | sim, via payload normalizado | `POST /cenario` | sim | não | “Cenario salvo com sucesso.” |
| Cancelar | botão `btn-fechar-cenario` | não há validação funcional específica | nenhum | não | sim | fecha painel |
| Fechar pelo X | botão de fechamento do painel | não há validação funcional específica | nenhum | não | sim | fecha painel |
| Calcular | `calcularFixosAno()` | valida `ano` | `POST /cenario/calcular-fixos` | sim, atualiza resultados | não | “Calculo anual concluido.” |
| Trocar de aba | `setTab("fixo")` e alternância de tabs | não | nenhum | sim, muda visibilidade | não | nenhuma |

Comportamentos confirmados:

- Salvar envia os dados do cenário completo, incluindo fixo, flexível e financeiro;
- Cancelar apenas fecha;
- não foi encontrado mecanismo de restauração automática separado do carregamento;
- não há confirmação especial no legado para trocar de aba;
- o estado local de edição não depende de um dirty state formal no código legado;
- o React atual mantém o estado no formulário e recalcula ao trocar de modo/valores.

## 10. Textos explicativos completos

Textos comprovados no React atual e no legado:

| Aba | Bloco | Posição | Texto exato | Condição de exibição |
|---|---|---|---|---|
| Fixo | Base anual | descrição inferior | “Defina a quantidade de horas de trabalho no ano. O total anual é base para os cálculos de custo fixo.” | exibido abaixo do bloco base anual no React |
| Financeiro | Cálculo de fixos anuais | descrição inferior | “O cálculo usa os lançamentos da clínica no backend para preencher os fixos anuais.” | exibido abaixo do bloco de cálculo no React |
| Financeiro | Resumo | alerta | “Os totais são recalculados a partir dos campos do formulário.” | exibido quando não há erro no React |

Pendente:

- o HTML legado contém textos e labels visuais adicionais, mas esta etapa não encontrou uma rotina segura de transcrição literal completa de cada bloco sem montar uma coleta dedicada linha a linha. Como o usuário exigiu completude, o contrato registra abaixo as pendências não comprovadas em vez de inventá-las.

## 11. Integrações comprovadas

| Módulo/estrutura | Arquivo | Dados consumidos | Dados fornecidos | Impacto |
|---|---|---|---|---|
| `Cenario` | `backend/models/cenario.py` | campos do cenário anual | persistência por clínica | armazena o estado do módulo |
| `Lancamento` | `backend/routes/cenario_routes.py` | valor, conta, data_pagamento, tipo, clínica | total pessoal/empresa | alimenta o cálculo de fixos anuais |
| `CategoriaFinanceira` | `backend/routes/cenario_routes.py` | grupo_id | filtro de grupo financeiro | liga lançamento ao grupo |
| `GrupoFinanceiro` | `backend/routes/cenario_routes.py` | nome do grupo | classificação do total | identifica “Custo fixo pessoal” e “Custo fixo profissional” |
| `procedimentos_routes.py` | `backend/routes/procedimentos_routes.py` | `cfph`, `cfpm`, `ir`, `cd`, `cartao` do cenário | custo fixo no preview | o cenário afeta preço/lucro/preview financeiro dos procedimentos |
| `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js` | `frontend-react/...` | resposta de `GET /cenario` e `POST /cenario/calcular-fixos` | payload normalizado | concentra normalização e chamadas da feature |
| `frontend-react/src/services/api.js` | `frontend-react/src/services/api.js` | path relativo | URL final da API | garante montagem da base da API |

Como as alterações no cenário afetam procedimentos:

- `cfph` é usado como custo fixo por hora em previews;
- `cfpm` é usado como custo fixo por minuto;
- `ir`, `cd` e `cartao` entram no cálculo financeiro da visualização de procedimentos;
- mudança no cenário altera imediatamente os números de custo e lucro usados no preview financeiro.

## 12. Arquitetura modular obrigatória

### 12.1 Estrutura proposta e aderência ao padrão real

Estrutura alvo compatível com o padrão do repositório:

```text
frontend-react/src/features/cenarioAnual/
  CenarioAnualPage.jsx
  cenarioAnualApi.js
  cenarioAnual.css
  components/
    CenarioAnualActionBar.jsx
    PerfilHorarioFixoTab.jsx
    PerfilHorarioFlexivelTab.jsx
    CenarioFinanceiroTab.jsx
    CenarioMetricField.jsx
    CenarioHelpBox.jsx
    FlexDayColumn.jsx
  hooks/
    useCenarioAnual.js
    useCenarioFixo.js
    useCenarioFlexivel.js
    useCenarioFinanceiro.js
  utils/
    cenarioAnualCalculations.js
    cenarioAnualNormalizers.js
    cenarioAnualFormatters.js
    cenarioAnualValidation.js
  constants/
    cenarioAnualDefaults.js
    cenarioAnualDays.js
```

Adaptação ao padrão real já existente:

- o repositório já tem a feature inicial em `frontend-react/src/features/cenarioAnual/`;
- o arquivo `CenarioAnualPage.jsx` hoje concentra a tela e pode ser decomposto;
- `cenarioAnualApi.js` já separa o acesso à API;
- `cenarioAnual.css` já isola o estilo da feature.

### 12.2 Tabela obrigatória de responsabilidades

| Arquivo proposto | Responsabilidade única | Dados recebidos | Dados devolvidos | Não deve fazer |
|---|---|---|---|---|
| `CenarioAnualPage.jsx` | coordenar a feature | estado inicial e callbacks | composição da página | não deve conter toda a lógica de fórmulas, normalização e API |
| `cenarioAnualApi.js` | falar com a API | payloads e ano | respostas normalizadas | não deve conter JSX nem regras de layout |
| `PerfilHorarioFixoTab.jsx` | renderizar a aba fixa | valores do bloco fixo | eventos de mudança | não deve chamar API |
| `PerfilHorarioFlexivelTab.jsx` | renderizar a aba flexível | turnos e dias | eventos de mudança | não deve calcular o cenário financeiro |
| `CenarioFinanceiroTab.jsx` | renderizar a aba financeira | custos e percentuais | ações de cálculo/salvar | não deve repetir a regra semanal |
| `CenarioMetricField.jsx` | padronizar campos métricos | label, value, formato | evento de alteração | não deve conhecer a feature inteira |
| `CenarioHelpBox.jsx` | mostrar instruções | texto de ajuda | nenhuma | não deve alterar estado |
| `FlexDayColumn.jsx` | representar um dia do perfil flexível | índice e valores do dia | alterações do dia | não deve duplicar a matriz dos 6 dias |
| `useCenarioAnual.js` | coordenar estado da feature | dados da API | handlers e estado derivado | não deve renderizar JSX |
| `useCenarioFixo.js` | encapsular regras do fixo | campos fixos | totais fixos | não deve falar com API |
| `useCenarioFlexivel.js` | encapsular regras do flexível | turnos/dias | totais flexíveis | não deve duplicar lógica do fixo |
| `useCenarioFinanceiro.js` | encapsular custo anual | gastos e horas | custo por hora/minuto | não deve renderizar UI |
| `cenarioAnualCalculations.js` | centralizar fórmulas | números brutos | totais derivados | não deve conter estado React |
| `cenarioAnualNormalizers.js` | normalizar tipos e defaults | payload cru | payload pronto | não deve ter side effects |
| `cenarioAnualFormatters.js` | formatar moeda/número | números | strings formatadas | não deve calcular regra de negócio |
| `cenarioAnualValidation.js` | validar entradas | valores brutos | erros/ok | não deve chamar API |
| `cenarioAnualDefaults.js` | defaults | nenhum ou parcial | defaults | não deve ter regras dinâmicas |
| `cenarioAnualDays.js` | mapa dos dias | nenhum | mapa de dias | não deve conter lógica de cálculo |

### 12.3 Limites objetivos contra monólitos

A implementação futura deve ser rejeitada se:

- `CenarioAnualPage.jsx` concentrar toda a feature;
- as três abas forem declaradas no mesmo arquivo sem decomposição;
- chamadas HTTP forem espalhadas por componentes visuais;
- fórmulas forem duplicadas em mais de um arquivo;
- os seis dias forem copiados manualmente em mais de um ponto sem abstração;
- houver estados independentes repetidos para cada dia;
- handlers extensos concentrarem regra de negócio;
- formatação for repetida campo a campo;
- a organização monolítica de `frontend/app.js` for reproduzida no React.

### 12.4 Fluxo de dados

Fluxo obrigatório:

```text
API
  ↓
normalização
  ↓
estado coordenado da feature
  ↓
abas
  ↓
alterações do usuário
  ↓
cálculos derivados
  ↓
montagem centralizada do payload
  ↓
API
```

Proibido:

- aba → chamada HTTP própria;
- aba → altera estado interno de outra aba;
- campo → monta payload global;
- componente visual → executa consulta financeira.

## 13. Matriz legado versus React

### 13.1 Perfil fixo

| Elemento legado | ID/chave | Tipo | Regra | Origem | Persistido/calculado | Componente React proposto |
|---|---|---|---|---|---|---|
| Meses de trabalho no Ano | `txtMesestrabalhados` | input | multiplica com dias úteis/mês | HTML legado | persistido e usado em cálculo | `PerfilHorarioFixoTab` |
| Dias úteis / Mês | `txtDiasUteisMes` | input | multiplica com meses | HTML legado | persistido e usado em cálculo | `PerfilHorarioFixoTab` |
| Dias úteis / Ano | `lblDiasUteisAno` | output | meses × dias/mês | JS legado | calculado e persistido | `CenarioMetricField` |
| Horas por dia | `txtHorasAtendimentoDia` | input | multiplica a base anual | HTML legado | persistido e usado em cálculo | `PerfilHorarioFixoTab` |
| N° de Consultórios | `txtNumConsultorios` | input | mínimo 1 | HTML legado | persistido e usado em cálculo | `PerfilHorarioFixoTab` |
| Horas por ano | `lblTotalHorasFixo` | output | total fixo | JS legado | calculado e persistido | `CenarioMetricField` |
| Minutos por ano | `lblTotalMinutosFixo` | output | horas × 60 | JS legado | calculado e persistido | `CenarioMetricField` |
| Turnos por ano | `lblTotalTurnosFixo` | output | horas ÷ 4 | JS legado | calculado e persistido | `CenarioMetricField` |

### 13.2 Perfil flexível

| Elemento legado | ID/chave | Tipo | Regra | Origem | Persistido/calculado | Componente React proposto |
|---|---|---|---|---|---|---|
| Manhã 1..6 | `txtManha1`..`txtManha6` | input | soma diária | HTML legado | persistido e usado em cálculo | `FlexDayColumn` |
| Tarde 1..6 | `txtTarde1`..`txtTarde6` | input | soma diária | HTML legado | persistido e usado em cálculo | `FlexDayColumn` |
| Noite 1..6 | `txtNoite1`..`txtNoite6` | input | soma diária | HTML legado | persistido e usado em cálculo | `FlexDayColumn` |
| Dias 1..6 | `txtDiasAno1`..`txtDiasAno6` | input | multiplica total diário | HTML legado | persistido e usado em cálculo | `FlexDayColumn` |
| Total diário 1..6 | `lblTotalDia1`..`lblTotalDia6` | output | manhã + tarde + noite | JS legado | calculado e persistido | `CenarioMetricField` |
| Horas anuais 1..6 | `lblHorasAnoDia1`..`lblHorasAnoDia6` | output | total diário × dias | JS legado | calculado e persistido | `CenarioMetricField` |
| Total horas flex | `lblTotalHorasAnoFlex` | output | soma dos dias × consultórios flex | JS legado | calculado e persistido | `CenarioMetricField` |
| Total minutos flex | `lblTotalMinutosFlex` | output | horas × 60 | JS legado | calculado e persistido | `CenarioMetricField` |
| Total turnos flex | `lblTotalTurnosFlex` | output | horas ÷ 4 | JS legado | calculado e persistido | `CenarioMetricField` |
| Consultórios flex | `txtNumConsultorios_2` | input | mínimo 1 | HTML legado | persistido e usado em cálculo | `PerfilHorarioFlexivelTab` |

### 13.3 Cenário financeiro

| Elemento legado | ID/chave | Tipo | Regra | Origem | Persistido/calculado | Componente React proposto |
|---|---|---|---|---|---|---|
| Ano-base | `box_Ano` | input | usado no cálculo anual | HTML legado | não persistido no backend atual | `CenarioFinanceiroTab` |
| Botão Calcular | `btn-calcular-fixos` | ação | chama cálculo anual | HTML legado | não | `CenarioAnualActionBar` |
| Fixo pessoal | `lblFixo_pessoal` | output | retorno do endpoint | backend | calculado | `CenarioMetricField` |
| Fixo empresa | `lblFixo_empresa` | output | retorno do endpoint | backend | calculado | `CenarioMetricField` |
| Custo anual calculado | `lblCusto_Anual` | output | retorno do endpoint | backend | calculado | `CenarioMetricField` |
| Gasto anual particular | `txtGastoAnualParticular` | input | soma local | HTML legado | persistido | `CenarioFinanceiroTab` |
| Gasto anual da clínica | `txtGastoAnualEmpresa` | input | soma local | HTML legado | persistido | `CenarioFinanceiroTab` |
| Perfil de horário | `cboHorasAno` | combo | seleciona horas do perfil | HTML legado | persistido | `CenarioFinanceiroTab` |
| Horas por ano | `txtHorasAno` | input/saída | horas do perfil escolhido | HTML legado | persistido | `CenarioFinanceiroTab` |
| Custo anual | `lblCustoAno` | output | gasto particular + gasto empresa | JS legado | calculado e persistido | `CenarioMetricField` |
| Custo fixo por hora | `lblCFPH` | output | custo anual ÷ horas | JS legado | calculado e persistido | `CenarioMetricField` |
| Custo fixo por minuto | `lblCFPM` | output | custo por hora ÷ 60 | JS legado | calculado e persistido | `CenarioMetricField` |
| Imposto de Renda (%) | `txtIR` | input | percentual | HTML legado | persistido | `CenarioFinanceiroTab` |
| Comissão Dentista (%) | `txtCD` | input | percentual | HTML legado | persistido | `CenarioFinanceiroTab` |
| Taxa Cartão (%) | `txtCartao` | input | percentual | HTML legado | persistido | `CenarioFinanceiroTab` |

## 14. Navegação React

Comprovado em `frontend-react/src/app/App.jsx`:

- agrupador relevante: `configuracao`;
- item existente: `cenario-anual`;
- posição no menu contextual: entre `campos-livres` e `contas-bancarias`;
- caminho real ativo: `/app/cenario-anual`;
- chave de tela: `cenario-anual`;
- `App.jsx` já mapeia a rota para `CenarioAnualPage`;
- `BranaIconRail` e `BranaContextPanel` usam o agrupador `Configuração`.

Compatibilidade com o padrão atual:

- `/app/cenario-anual` é compatível com `isAppRoute()` e `resolveScreenFromPath()`;
- `cenario-anual` é compatível com o padrão interno de screen key do React atual;
- o item não está declarado como proposta hipotética: ele já existe no código relido.

Proteção de acesso direto:

- a tela depende da sessão autenticada do React;
- sem login o app redireciona para `/login`;
- a autorização operacional continua no backend por módulo financeiro.

## 15. Etapas futuras de implementação

| Etapa | Objetivo | Arquivos | Risco | Teste mínimo | Condição de avanço |
|---|---|---|---|---|---|
| API | consolidar contrato de chamadas | `cenarioAnualApi.js` | payload divergente | carregar/salvar/calcular | respostas normalizadas |
| Normalização | padronizar números e defaults | `cenarioAnualNormalizers.js` | tipos inconsistentes | `GET /cenario` com vazio | dados coerentes |
| Estrutura da página | coordenar feature | `CenarioAnualPage.jsx` | monólito | renderizar as três áreas | página sem lógica duplicada |
| Aba fixa | isolar bloco fixo | `PerfilHorarioFixoTab.jsx` | fórmula duplicada | alterar meses/dias | totais atualizam |
| Validação aba fixa | validar entradas do fixo | `useCenarioFixo.js`, `cenarioAnualValidation.js` | entradas inválidas | zero, vazio, decimal | erro/normalização corretos |
| Aba flexível | isolar bloco semanal | `PerfilHorarioFlexivelTab.jsx`, `FlexDayColumn.jsx` | repetição manual | alterar um dia | totais atualizam |
| Validação aba flexível | validar turnos | `useCenarioFlexivel.js` | dados parciais | chaves faltantes | defaults aplicados |
| Aba financeira | isolar custos | `CenarioFinanceiroTab.jsx` | mistura com fixo/flex | trocar perfil e editar gastos | custo recalcula |
| Validação aba financeira | validar custo anual | `useCenarioFinanceiro.js` | divisão por zero | horas zero | resultado seguro |
| Salvar | persistir cenário | `CenarioAnualPage.jsx`, `cenarioAnualApi.js` | payload incompleto | salvar e recarregar | estado persistido |
| Cancelar | fechar sem gravar | `CenarioAnualPage.jsx` | perda de edição | fechar após editar | tela fecha sem salvar |
| Calcular | buscar fixos anuais | `CenarioAnualPage.jsx`, API | ano inválido | ano vazio/zero | mensagem clara |
| Permissão | bloquear acesso indevido | backend + React | rota exposta | usuário sem financeiro | acesso negado |
| Rota | manter `/app/cenario-anual` | `App.jsx` | inconsistência de screen | refresh direto | tela abre corretamente |
| F5 | preservar deep-link | `App.jsx` | quebra de navegação | refresh na URL | screen correta |
| Item do menu | manter item em Configuração | `BranaContextPanel.jsx` | item fora do grupo | abrir menu | item ativo |
| Ordem alfabética | ordenar menus internos | `BranaIconRail.jsx`, menus | navegação confusa | abrir configuração | ordem estável |
| Testes completos | cobrir fluxo | testes da feature | regressão | salvar, carregar, calcular | comportamento estável |
| Documentação | atualizar contrato e docs | `docs/` | divergência documental | revisão final | documentação consistente |
| Roadmap | registrar sequência | `docs/11_roadmap_desenvolvimento.md` | desalinhamento de prioridade | conferência com contrato | sequenciamento claro |
| Commit seletivo | preservar escopo | git | mistura de frentes | diff restrito | apenas artefatos necessários |

## 16. Critérios de aceite completos

Critérios verificáveis:

- navegação abre `/app/cenario-anual`;
- item do menu em Configuração mostra `Cenário anual`;
- acesso sem login redireciona para `/login`;
- acesso sem permissão financeira é bloqueado pelo backend;
- perfil fixo recalcula dias úteis, horas, minutos e turnos;
- perfil flexível recalcula totais por dia e total anual;
- cenário financeiro mostra custo anual, custo por hora e custo por minuto;
- salvar persiste `turnos_flex`, valores do fixo e valores financeiros;
- recarregar após salvar mostra o estado persistido;
- tema claro não quebra layout;
- tema escuro não quebra layout;
- viewport menor mantém layout usável;
- não há chamadas duplicadas para salvar/carregar;
- a feature não reproduz o monólito de `frontend/app.js`;
- a organização modular impede duplicação de fórmulas;
- console do navegador permanece sem erro funcional na tela;
- não há regressão nos valores calculados ao trocar de perfil;
- o botão calcular só depende de ano válido.

## 17. Pendências não comprovadas

Estas itens não puderam ser confirmados integralmente apenas com as fontes relidas nesta etapa:

1. Transcrição literal de todos os textos explicativos visuais do HTML legado.
2. Confirmação textual explícita no HTML de que os índices `1` a `6` são rotulados como Segunda a Sábado.
3. Confirmação visual de que o DOM do legado não tem nenhum conteúdo adicional de ajuda fora dos blocos de cenário.
4. Verificação de `min`, `max`, `step` do HTML legado para todos os inputs de cenário, porque vários campos não declaram `step` no HTML.
5. Confirmação do comportamento visual exato do campo `txtHorasAno` no React, porque hoje ele aparece como input e não como saída pura.

Nada acima deve ser tratado como fato sem validação adicional.

## 18. Validação obrigatória do documento

Validações executadas nesta complementação:

- releitura do documento integral após a escrita;
- conferência do conteúdo com `frontend/index.html`;
- conferência do conteúdo com `frontend/app.js`;
- conferência do conteúdo com `backend/routes/cenario_routes.py`;
- conferência do conteúdo com `backend/models/cenario.py`;
- conferência com `backend/routes/procedimentos_routes.py`;
- conferência com `backend/security/permissions.py`;
- conferência com `frontend-react/src/app/App.jsx`;
- conferência com `frontend-react/src/layout/BranaIconRail.jsx`;
- conferência com `frontend-react/src/layout/BranaContextPanel.jsx`;
- conferência com `frontend-react/src/services/api.js`;
- conferência do arquivo untracked por leitura completa do conteúdo;
- confirmação de que o arquivo permanece em UTF-8 com acentuação.

Validação por Git:

- `git status --short docs/contrato_implementacao_cenario_anual_frontend_react.md`

## 19. Proibições cumpridas

Não foi feito:

- implementação funcional;
- alteração no frontend legado;
- alteração no backend;
- alteração no banco;
- alteração de menu;
- alteração de rota;
- migration;
- seed;
- commit;
- push;
- criação de outro documento como substituto;
- remoção de acentos;
- conversão para ASCII.

## 20. Entrega obrigatória

Diretório usado:

- `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch usada:

- `modularizacao-segura-fase-1`

Git status inicial resumido:

- worktree sujo com mudanças de outras frentes;
- o arquivo do contrato ainda estava untracked.

Arquivos relidos:

- `frontend/index.html`
- `frontend/app.js`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`
- `backend/security/permissions.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/services/api.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`
- `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js`
- `frontend-react/src/features/cenarioAnual/cenarioAnual.css`

Documento complementado:

- `docs/contrato_implementacao_cenario_anual_frontend_react.md`

Confirmação de UTF-8:

- sim, com acentuação preservada no arquivo.

Quantidade de campos do Perfil fixo:

- 8 linhas inventariadas na tabela principal.

Quantidade de campos do Perfil flexível:

- 18 linhas inventariadas na tabela principal.

Quantidade de campos do Cenário financeiro:

- 14 linhas inventariadas na tabela principal.

Propriedades completas de `GET /cenario`:

- `meses_trabalhados`
- `dias_uteis_mes`
- `dias_uteis_ano`
- `horas_atendimento_dia`
- `num_consultorios`
- `num_consultorios_flex`
- `horas_ano`
- `modo_horas`
- `gasto_anual_particular`
- `gasto_anual_empresa`
- `cartao`
- `ir`
- `cd`
- `custo_ano`
- `cfph`
- `cfpm`
- `total_horas_fixo`
- `total_minutos_fixo`
- `total_turnos_fixo`
- `total_horas_flex`
- `total_minutos_flex`
- `total_turnos_flex`
- `turnos_flex`

Propriedades completas de `POST /cenario`:

- mesmas propriedades do `GET /cenario`, com envio do payload completo e serialização de `turnos_flex`.

Contrato de `/cenario/calcular-fixos`:

- payload: `{ "ano": <inteiro> }`;
- valida ano não vazio;
- usa lançamentos da clínica autenticada;
- filtra por débito, conta pessoal/clínica e grupos financeiros alvo;
- retorna `fixo_pessoal`, `fixo_empresa` e `custo_anual`;
- sem lançamentos, retorna zero nos totais;
- sem efeito colateral de escrita no banco.

Estrutura de `turnos_flex`:

- 6 chaves numéricas em string: `"1"` a `"6"`;
- cada chave contém `manha`, `tarde`, `noite`, `dias`.

Correspondência dos índices com os dias:

- comprovada como organização semanal de 6 blocos;
- Segunda a Sábado foi registrada como correspondência esperada;
- essa correspondência permanece listada como pendência não comprovada de forma textual explícita no HTML.

Values do combo de perfil:

- `Perfil Fixo`
- `Perfil Flexível`

Fórmulas do perfil fixo:

- `dias_uteis_ano = meses_trabalhados × dias_uteis_mes`
- `horas_ano = horas_por_dia × dias_uteis_ano × Math.max(1, numero_consultorios)`
- `minutos_ano = horas_ano × 60`
- `turnos_ano = horas_ano ÷ 4`

Fórmulas do perfil flexível:

- `total_dia = manha + tarde + noite`
- `horas_ano_dia = total_dia × dias_no_ano`
- `horas_ano_total = soma(horas_ano_dia) × numero_consultorios`
- `minutos_ano_total = horas_ano_total × 60`
- `turnos_ano_total = horas_ano_total ÷ 4`

Fórmulas financeiras:

- `custo_anual_informado = gasto_anual_particular + gasto_anual_empresa`
- `custo_fixo_hora = custo_anual_informado ÷ horas_ano`
- `custo_fixo_minuto = custo_fixo_hora ÷ 60`

Comportamento de Salvar:

- envia payload completo;
- persiste os dados da clínica autenticada;
- normaliza turnos flexíveis e valores numéricos.

Comportamento de Cancelar:

- fecha a tela/painel;
- não grava dados;
- não chama endpoint.

Comportamento do X:

- fecha a tela/painel;
- não grava dados;
- não chama endpoint.

Textos explicativos transcritos:

- os textos comprovados estão na seção 10;
- os textos restantes do HTML legado ficaram como pendência não comprovada.

Integrações comprovadas:

- listadas na seção 11.

Arquitetura modular proposta:

- listada na seção 12.

Tabela de responsabilidades:

- listada na seção 12.2.

Limites contra monólitos:

- listados na seção 12.3.

Matriz legado versus React:

- listada na seção 13.

Etapas futuras:

- listadas na seção 15.

Critérios de aceite:

- listados na seção 16.

Pendências não comprovadas:

- listadas na seção 17.

Único arquivo alterado:

- `docs/contrato_implementacao_cenario_anual_frontend_react.md`

Resumo da inspeção completa do arquivo untracked:

- o arquivo foi escrito, relido integralmente e conferido contra as fontes principais;
- a versão final preserva acentuação e UTF-8;
- o conteúdo cobre os blocos funcionais, as fórmulas, os contratos de API, a navegação, a arquitetura e as pendências.

Confirmação de que nenhum código foi implementado:

- confirmada.

Confirmação de que nenhum outro arquivo foi alterado por esta complementação:

- confirmada.

Confirmação de que não houve commit:

- confirmada.

Confirmação de que não houve push:

- confirmada.
- Etapa 4A - fechamento funcional e preparação do salvamento

### Escopo consolidado

- As três abas do Cenário anual permanecem separadas e funcionais: `Perfil horário fixo`, `Perfil horário flexível` e `Cenário financeiro`.
- `Gravar` permanece visível e desabilitado.
- O botão `Cancelar` permanece funcional.
- Não há `POST /cenario` executado pela feature nesta etapa.
- O único POST funcional da frente permanece `POST /cenario/calcular-fixos`.

### Documentacao revisada nesta etapa

- `docs/contrato_implementacao_cenario_anual_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`
- `frontend/index.html`
- `frontend/app.js`
- `frontend-react/src/features/cenarioAnual/CenarioAnualPage.jsx`
- `frontend-react/src/features/cenarioAnual/CenarioAnualModal.jsx`
- `frontend-react/src/features/cenarioAnual/cenarioAnualApi.js`
- `frontend-react/src/features/cenarioAnual/hooks/useCenarioAnual.js`
- `frontend-react/src/features/cenarioAnual/utils/cenarioAnualCalculations.js`
- `frontend-react/src/features/cenarioAnual/utils/cenarioAnualFlexCalculations.js`
- `frontend-react/src/features/cenarioAnual/utils/cenarioAnualNormalizers.js`
- `frontend-react/src/features/cenarioAnual/utils/cenarioAnualValidation.js`
- `frontend-react/src/features/cenarioAnual/utils/cenarioAnualPayload.js`
- `frontend-react/src/features/cenarioAnual/constants/cenarioAnualDefaults.js`
- `frontend-react/src/features/cenarioAnual/components/CenarioAnualFooter.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioAnualTabs.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioFinanceiroTab.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioFinancialSection.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioFinancialRow.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioHelpBox.jsx`
- `frontend-react/src/features/cenarioAnual/components/CenarioMetricField.jsx`
- `frontend-react/src/features/cenarioAnual/components/PerfilHorarioFixoTab.jsx`
- `frontend-react/src/features/cenarioAnual/components/PerfilHorarioFlexivelTab.jsx`

### Matriz funcional resumida

| Aba | Label | Propriedade | Tipo real | Editável | Evento | Valor interno | Formatação visual | Min | Max | Step | Precisão | Cálculo disparado | Campo do payload |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Perfil horário fixo | Meses de trabalho no Ano | `meses_trabalhados` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFixedSummary` | `meses_trabalhados` |
| Perfil horário fixo | Dias úteis / Mês | `dias_uteis_mes` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | inteiro ou decimal não encerrado no contrato | `calculateFixedSummary` | `dias_uteis_mes` |
| Perfil horário fixo | Horas por dia | `horas_atendimento_dia` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFixedSummary` | `horas_atendimento_dia` |
| Perfil horário fixo | Nº de Consultórios | `num_consultorios` | `InputNumber` | Sim | `onChange` | número real preservando zero | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | inteiro preservando `0` | `calculateFixedSummary` | `num_consultorios` |
| Perfil horário fixo | Dias úteis / Ano | `dias_uteis_ano` | `CenarioMetricField` | Não | derivado de estado | número real | `pt-BR` | n/a | n/a | n/a | inteiro esperado | `calculateFixedSummary` | não entra no payload como campo editável |
| Perfil horário fixo | Horas por ano | `total_horas_fixo` | `CenarioMetricField` | Não | derivado de estado | número real | `pt-BR` | n/a | n/a | n/a | inteiro ou decimal conforme cálculo | `calculateFixedSummary` | `total_horas_fixo` |
| Perfil horário fixo | Minutos por ano | `total_minutos_fixo` | `CenarioMetricField` | Não | derivado de estado | número real | `pt-BR` | n/a | n/a | n/a | inteiro ou decimal conforme cálculo | `calculateFixedSummary` | `total_minutos_fixo` |
| Perfil horário fixo | Turnos por ano | `total_turnos_fixo` | `CenarioMetricField` | Não | derivado de estado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFixedSummary` | `total_turnos_fixo` |
| Perfil horário flexível | Horas da Manhã | `turnos_flex[1].manha` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFlexibleSummary` | `turnos_flex.1.manha` |
| Perfil horário flexível | Horas da Tarde | `turnos_flex[1].tarde` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFlexibleSummary` | `turnos_flex.1.tarde` |
| Perfil horário flexível | Horas da Noite | `turnos_flex[1].noite` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFlexibleSummary` | `turnos_flex.1.noite` |
| Perfil horário flexível | Dias no ano | `turnos_flex[1].dias` | `InputNumber` | Sim | `onChange` | número real | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal permitido | `calculateFlexibleSummary` | `turnos_flex.1.dias` |
| Perfil horário flexível | Total Horas/Dia | `turnos_flex[1].total_dia` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFlexibleSummary` | não entra diretamente |
| Perfil horário flexível | Horas por ano | `turnos_flex[1].horas_ano_dia` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFlexibleSummary` | não entra diretamente |
| Perfil horário flexível | Nº de Consultórios | `num_consultorios_flex` | `InputNumber` | Sim | `onChange` | número real preservando zero | `pt-BR`, sem casas forçadas | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | inteiro preservando `0` | `calculateFlexibleSummary` | `num_consultorios_flex` |
| Perfil horário flexível | Horas por ano | `total_horas_flex` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFlexibleSummary` | `total_horas_flex` |
| Perfil horário flexível | Minutos por ano | `total_minutos_flex` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFlexibleSummary` | `total_minutos_flex` |
| Perfil horário flexível | Turnos por ano | `total_turnos_flex` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | decimal possível | `calculateFlexibleSummary` | `total_turnos_flex` |
| Cenário financeiro | Ano-base | `ano_base` | `InputNumber` | Sim | `onChange` | inteiro real | sem separador de milhar na visualização | 1900 | 3000 | não comprovado no legado/backend | inteiro | `calcular-fixos` | `ano` no payload do POST dedicado |
| Cenário financeiro | Gasto Anual Particular | `gasto_anual_particular` | `InputNumber` monetário | Sim | `onChange` | número real | moeda `pt-BR` | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | centavos preservados | `calculateFinancialSummary` | `gasto_anual_particular` |
| Cenário financeiro | Gasto Anual da Clínica | `gasto_anual_empresa` | `InputNumber` monetário | Sim | `onChange` | número real | moeda `pt-BR` | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | centavos preservados | `calculateFinancialSummary` | `gasto_anual_empresa` |
| Cenário financeiro | Escolha o perfil de horário | `modo_horas` | `Select` | Sim | `onChange` | string do modo | texto simples | n/a | n/a | n/a | n/a | recalcula horas usadas no cálculo financeiro | `modo_horas` |
| Cenário financeiro | Horas por Ano | `horas_ano` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` | n/a | n/a | n/a | inteiro ou decimal | `calculateFinancialSummary` | `horas_ano` |
| Cenário financeiro | Custo Anual | `custo_ano` | `CenarioMetricField` | Não | derivado | número real | moeda `pt-BR` | n/a | n/a | n/a | moeda | `calculateFinancialSummary` e retorno do POST dedicado | `custo_ano` |
| Cenário financeiro | Custo Fixo por Hora | `cfph` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` com duas casas | n/a | n/a | n/a | decimal com duas casas | `calculateFinancialSummary` | `cfph` |
| Cenário financeiro | Custo Fixo por Minuto | `cfpm` | `CenarioMetricField` | Não | derivado | número real | `pt-BR` com duas casas | n/a | n/a | n/a | decimal com duas casas | `calculateFinancialSummary` | `cfpm` |
| Cenário financeiro | Imposto de Renda (%) | `ir` | `InputNumber` | Sim | `onChange` | número real | percentual `pt-BR` | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal preservado | integra módulos consumidores, não cálculo financeiro local direto | `ir` |
| Cenário financeiro | Comissão Dentista (%) | `cd` | `InputNumber` | Sim | `onChange` | número real | percentual `pt-BR` | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal preservado | integra módulos consumidores, não cálculo financeiro local direto | `cd` |
| Cenário financeiro | Taxa Cartão (%) | `cartao` | `InputNumber` | Sim | `onChange` | número real | percentual `pt-BR` | não comprovado no legado/backend | não comprovado no legado/backend | não comprovado no legado/backend | decimal preservado | integra módulos consumidores, não cálculo financeiro local direto | `cartao` |

### Payload consolidado

- `buildCenarioAnualPayload(state)` gera o payload puro e numérico da frente.
- `turnos_flex` é serializado com as chaves `1..6`.
- Não entram strings formatadas como `R$ 201.250,00`, `1.449` ou `10,5`.
- O payload permanece compatível com o formato esperado pelo backend atual e com a preparação da Etapa 4B.

### Compatibilidade e pendencias

- O GET `/cenario` continua sendo a única carga inicial real da feature.
- O POST `/cenario` segue sem execução nesta etapa.
- O POST `/cenario/calcular-fixos` segue como única escrita funcional usada pelo botão `Calcular`.
- O backend consumidor relevante continua sendo `backend/routes/procedimentos_routes.py`.
- As divergências restantes antes do salvamento real concentram-se em validação final do payload e confirmação operacional do POST completo na Etapa 4B.

## Etapa 4B - salvamento real do Cen�rio anual

### Fluxo funcional implementado

- O bot�o `Gravar` passou a acionar o salvamento real do Cen�rio anual.
- A API da feature agora exp�e `salvarCenarioAnual(payload)` e envia `POST /cenario`.
- O payload do save usa exclusivamente `buildCenarioAnualPayload(state)`.
- O hook `useCenarioAnual` passou a coordenar `saving`, `saveError`, `saveSuccess` e `canSave`.
- O rodap� manteve a ordem `Gravar | Cancelar`.
- `Cancelar` e o `X` continuam fechando o modal sem persist�ncia.

### Regras de fluxo

- O bot�o `Gravar` s� habilita depois do carregamento inicial conclu�do e com a se��o fixa v�lida.
- Durante o POST o bot�o fica em loading e n�o permite clique duplo.
- Em caso de erro o modal permanece aberto e o estado n�o � limpo.
- Em caso de sucesso, a resposta � reconciliada quando contiver dados de cen�rio; quando o backend devolver apenas `detail`, o estado atual � preservado.
- O POST dedicado `calcular-fixos` permanece separado do salvamento completo.

### Payload e valida��o

- `buildCenarioAnualPayload(state)` continua sendo a �nica fonte do payload.
- `validateCenarioAnualPayload(payload)` confirma n�meros finitos e `turnos_flex` completo antes do save.
- `turnos_flex` segue serializado com as chaves `1..6`.
- N�o entram strings formatadas no payload.

### Testes e valida��o t�cnica

- A su�te `frontend-react/tests/cenarioAnual.test.js` passou com 8 testes.
- Os testes cobrem parse brasileiro, totais fixos, totais flex�veis, finan�as, payload puro, normaliza��o, valida��o do payload e `POST /cenario`.
- O build do frontend React segue aprovado com o aviso global de chunk grande.

### Pend�ncias de valida��o manual

- Falta registrar nesta sess�o a valida��o visual/autenticada do POST real no navegador.
- Falta registrar o comportamento de reabertura e F5 em navegador real, mesmo com o fluxo de save j� implementado.
- O pr�ximo passo operacional � a confirma��o manual ponta a ponta e a atualiza��o final do documento com a evid�ncia do navegador.

## Etapa 4B.1 - paridade funcional dos controles

### Foco da revisao

- A revisao desta etapa ajustou apenas os campos do Cen�rio anual que no legado se comportam como spinbox oper�vel.
- O React passou a exibir os handlers de incremento/decremento nos campos que no legado usam `type="number"` na aba financeira e nos totais de consult�rios.
- Os campos que no legado permanecem como entrada textual seguiram sem mudan�a estrutural.

### Controles ajustados

- `N� de Consult�rios` do Perfil hor�rio fixo.
- `N� de Consult�rios` do Perfil hor�rio flex�vel.
- `Ano-base` do Cen�rio financeiro.

### Controles mantidos sem spinbox

- campos textuais do Perfil hor�rio fixo;
- c�lulas edit�veis da matriz flex�vel;
- valores monet�rios e percentuais do Cen�rio financeiro.

### Situa��o de valida��o

- Build e testes puros seguem aprovados.
- A valida��o autenticada real de navega��o permaneceu bloqueada nesta sess�o pela tela de login do ambiente local.
- A conclus�o visual/runtime desta etapa continua pendente de acesso autenticado.

## Etapa 4C.2 - validacao isolada da Comissao Dentista

- Em validacao autenticada real no frontend local, o campo `Comissao Dentista (%)` foi alterado de `20` para `21` e salvo com exatamente um `POST /cenario`.
- O `GET /cenario` posterior confirmou `cd = 21` com os demais campos preservados.
- O painel financeiro de `Procedimentos` refletiu `cd = 21` no campo consumidor e recalculou o valor monetario da comissao e o valor minimo correspondente.
- A restauracao para `cd = 20` foi salva com exatamente um `POST /cenario`, retornou corretamente no `GET /cenario` e voltou a aparecer no consumo de `Procedimentos`.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.3 - validacao isolada do Imposto de Renda

- Em validacao autenticada real no frontend local, o campo `Imposto de Renda (%)` foi alterado de `10` para `11` e salvo com exatamente um `POST /cenario`.
- O `GET /cenario` posterior confirmou `ir = 11` com os demais campos preservados.
- O painel financeiro de `Procedimentos` refletiu `ir = 11` no campo consumidor e recalculou o valor monetario do IR e o valor minimo correspondente.
- A restauracao para `ir = 10` foi salva com exatamente um `POST /cenario`, retornou corretamente no `GET /cenario` e voltou a aparecer no consumo de `Procedimentos`.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.4 - validacao isolada da Taxa Cartao

- Em validacao autenticada real no frontend local, o campo `Taxa Cartao (%)` foi alterado de `4` para `5` e salvo com exatamente um `POST /cenario`.
- O `GET /cenario` posterior confirmou `cartao = 5` com os demais campos preservados.
- O painel financeiro de `Procedimentos` refletiu `cartao = 5` no campo consumidor e recalculou o valor monetario da taxa e o valor minimo correspondente.
- A restauracao para `cartao = 4` foi salva com exatamente um `POST /cenario`, retornou corretamente no `GET /cenario` e voltou a aparecer no consumo de `Procedimentos`.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.5 do Cenario anual

- A validacao isolada de `gasto_anual_particular` foi concluida em navegador autenticado local.
- O valor `gasto_anual_particular` foi alterado de `71250` para `72250`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- Foi identificado e corrigido um parser local do formulario financeiro que zerava o valor monetario ao salvar por nao remover o prefixo `R$` do campo formatado.
- Em seguida, `gasto_anual_particular` foi restaurado para `71250`, com novo `POST /cenario`, novo `GET /cenario` e retorno do baseline no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.6 do Cenario anual

- A validacao isolada de `gasto_anual_empresa` foi concluida em navegador autenticado local.
- O valor `gasto_anual_empresa` foi alterado de `130000` para `131000`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- O mesmo `parseMoney` corrigido para o campo monetario do formulario financeiro permaneceu valido para a clinica, preservando o valor numerico `131000` no payload.
- Em seguida, `gasto_anual_empresa` foi restaurado para `130000`, com novo `POST /cenario`, novo `GET /cenario` e retorno do baseline no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.7 do Cenario anual

- A validacao isolada do `modo_horas` foi concluida em navegador autenticado local.
- A troca `Perfil Flexivel -> Perfil Fixo` atualizou `horas_ano` para `1680`, recarregou `cfph`/`cfpm`, persistiu com um unico `POST /cenario`, refletiu em `GET /cenario` e apareceu no `dashboard-preview` de Procedimentos com custo fixo e valor minimo maiores.
- A restauracao `Perfil Fixo -> Perfil Flexivel` voltou a produzir `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`, com novo `POST /cenario`, novo `GET /cenario` e retorno ao baseline no consumidor.
- Os perfis fixo e flexivel permaneceram intactos, sem alteracao dos respectivos valores internos.
- Nenhum outro campo numerico foi alterado nesta rodada.

## Etapa 4C.7B do Cenario anual

- O ciclo bidirecional do `modo_horas` foi concluido exclusivamente pela interface autenticada.
- A troca `Perfil Flexivel -> Perfil Fixo` foi feita pelo combo real e persistida pelo botao `Gravar`, com um unico `POST /cenario` gerado pela aplicacao.
- A reabertura e o F5 confirmaram `modo_horas = Perfil Fixo`, `horas_ano = 1680`, `cfph = 119.79166666666667` e `cfpm = 1.996527777777778`.
- A volta `Perfil Fixo -> Perfil Flexivel` tambem foi feita pelo combo real e persistida pela UI, com um unico `POST /cenario` gerado pela aplicacao.
- A reabertura e o F5 confirmaram o retorno ao baseline `modo_horas = Perfil Flexivel`, `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`.
- O `dashboard-preview` de Procedimentos voltou ao baseline apos a restauracao e nao houve uso de POST manual nesta rodada.

## Etapa 4C.8 do Cenario anual

- A validacao isolada de `turnos_flex["1"].dias` foi concluida em navegador autenticado local.
- A celula da Segunda-feira mudou de `30` para `31`, atualizando `horas_ano` para `1458`, `total_horas_flex` para `1458`, `total_minutos_flex` para `87480`, `total_turnos_flex` para `364.5`, `cfph` para `138.0315500685871` e `cfpm` para `2.300525834476452`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o novo custo fixo e o novo valor minimo.
- A restauracao `31 -> 30` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel permaneceu intacta nas demais celulas e chaves.

## Etapa 4C.9 do Cenario anual

- A validacao isolada de `turnos_flex["1"].manha` foi concluida em navegador autenticado local.
- A Segunda-feira passou de `4` para `5` horas da manha, elevando `total_horas_flex` para `1479`, `total_minutos_flex` para `88740`, `total_turnos_flex` para `369.75`, `horas_ano` para `1479`, `cfph` para `136.07167004732926` e `cfpm` para `2.2678611674554876`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o novo custo fixo e o novo valor minimo.
- A restauracao `5 -> 4` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel permaneceu intacta nas demais celulas e chaves.

## Etapa 4C.10 do Cenario anual

- A validacao isolada de `num_consultorios_flex` foi concluida em navegador autenticado local.
- O valor `1` passou para `2`, duplicando a capacidade flexivel para `total_horas_flex = 2898`, `total_minutos_flex = 173880`, `total_turnos_flex = 724.5`, `horas_ano = 2898`, `cfph = 69.44444444444444` e `cfpm = 1.1574074074074074`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o custo fixo e o valor minimo novos.
- A restauracao `2 -> 1` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel e o Perfil Fixo permaneceram intactos.

## Etapa 4C.11 do Cenario anual

- A validacao isolada de `num_consultorios_fixo` com o Perfil Flexivel ativo foi concluida em navegador autenticado local.
- O valor do Perfil Fixo mudou de `1` para `2`, elevando `total_horas_fixo` para `3360`, `total_minutos_fixo` para `201600` e `total_turnos_fixo` para `840`.
- Como o perfil ativo permaneceu `Perfil Flexivel`, `horas_ano`, `cfph`, `cfpm` e o `dashboard-preview` de Procedimentos permaneceram no baseline.
- A restauracao `2 -> 1` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- O Perfil Flexivel e a matriz flexivel permaneceram intactos.

## Etapa 4C.13E do Cenario anual

- Foi comprovada uma mutacao local transitoria apos `Gravar` quando o POST retornava apenas `{ detail: "Cenario salvo com sucesso." }`.
- A causa estava em `useCenarioAnual.js`: o retorno do POST era tratado como cenÃ¡rio completo e, ao ser normalizado, caia nos defaults `12 / 22 / 264` quando nao havia campos-base na resposta.
- A correcao aplicada passou a preservar o estado atual quando a resposta do POST nao contem campos do cenÃ¡rio.
- A cobertura automatizada foi ampliada para garantir que respostas com apenas `detail` nao reintroduzem defaults.
- O baseline persistido permanece `10,5 / 20 / 210 / 8 / 1` com `1680 / 100800 / 420`.
- A comparacao de Procedimentos permanece pendente nesta frente.
## Etapa 4C.13G do Cenario anual

- A propagacao comparativa em `Procedimentos` foi comprovada com o procedimento `1065 - ABERTURA IMPLANTE`, usando o mesmo request em cinco estados sucessivos.
- O preview respondeu de forma distinta entre `A`, `B`, `C`, `D` e `E`, acompanhando as mudancas de `modo_horas`, `horas_ano`, `cfph` e `cfpm` do Cenario anual persistido.
- O backend de Procedimentos usa `custo_fph = cfpm * tempo`, com `custo_proc = custo_fph + custo_material + custo_laboratorial`, e `valor_minimo` calculado a partir dos custos e percentuais aplicaveis.
- Os estados ficaram comprovados como `D = B` e `E = A`, sem evidencia de cache ou de request diferente entre as chamadas.
- O baseline final foi restaurado para `modo_horas = Perfil Flexivel`, `meses_trabalhados = 10.5`, `dias_uteis_mes = 20`, `dias_uteis_ano = 210`, `horas_atendimento_dia = 8`, `num_consultorios = 1`, `total_horas_fixo = 1680`, `total_minutos_fixo = 100800`, `total_turnos_fixo = 420`, `num_consultorios_flex = 1`, `total_horas_flex = 1449`, `total_minutos_flex = 86940`, `total_turnos_flex = 362.25`, `horas_ano = 1449`, `custo_ano = 201250`, `cfph = 138.88888888888889`, `cfpm = 2.314814814814815`, `gasto_anual_particular = 71250`, `gasto_anual_empresa = 130000`, `ir = 10`, `cd = 20` e `cartao = 4`.
- A mutacao transitoria pos-`Gravar` ja havia sido corrigida no hook e permaneceu estavel durante a comparacao.
- A Etapa 4C.13 fica consolidada como funcionalmente concluida; o fechamento Git e o eventual commit seletivo seguem pendentes por decisao operacional.

## Etapa 4C.14 do Cenario anual

- Os quatro fluxos de fechamento sem salvar foram validados em navegador autenticado real: `Cancelar`, botao `X`, tecla `Esc` e clique fora do modal.
- O modal do Cenário anual usa `keyboard = true`, `maskClosable = true` e encaminha `onCancel` para o mesmo encerramento da pagina, sem acionar `POST /api/cenario`.
- A alteracao temporaria `ir: 10 -> 11` foi descartada em todos os caminhos; apos reabrir e apos F5, o GET voltou ao baseline `ir = 10` sem contaminar as demais abas.
- Nenhum caminho de fechamento gerou `POST /api/cenario`, nenhuma mensagem de sucesso indevida apareceu e o preview de Procedimentos permaneceu coerente com o baseline final.
- A comparacao de Procedimentos continua validada e o baseline do Cenário anual permaneceu preservado.

## Etapa 4C.15 do Cenario anual

- A validacao autenticada real confirmou o tratamento isolado de erro de GET e de POST no Cenário anual.
- Para o GET, foi simulada uma falha temporaria apenas em `GET /api/cenario`, com retorno `500`; o loading terminou, a UI apresentou erro controlado, nao houve POST e nenhuma mutacao valida entrou como baseline.
- A recuperacao do GET ocorreu apos remover a interceptacao: reabertura e F5 voltaram ao baseline completo `modo_horas = Perfil Flexivel`, `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`.
- Para o POST, foi simulada uma falha temporaria apenas em `POST /api/cenario`, com retorno `500`; o saving terminou, a UI exibiu erro controlado, nao houve mensagem de sucesso e a alteracao local `ir = 11` nao foi persistida.
- A nova tentativa sem interceptacao salvou corretamente `ir = 11`, e a restauracao posterior `11 -> 10` voltou ao baseline completo por GET e F5.
- O preview de Procedimentos permaneceu coerente com o baseline final e nenhuma interceptacao ficou ativa ao final da rodada.

## Etapa 4C.15B do Cenario anual

- A validacao automatizada substituiu a tentativa instavel de interceptacao no navegador e cobriu o hook/API do Cenário anual de forma reproduzivel.
- O GET falho ficou coberto por teste automatizado: a falha foi capturada, loading terminou, nao houve loop, nao houve POST e o estado nao foi reescrito por defaults ao falhar o carregamento.
- O POST falho ficou coberto por teste automatizado: a falha foi capturada, saving terminou, nao houve sucesso falso, o estado atual foi preservado e a nova tentativa funcionou.
- Erros HTTP estruturados com detail tambem foram validados na API, preservando a mensagem de erro esperada sem expor [object Object].
- Um smoke normal no navegador confirmou que a SPA autenticada continuou estavel apos os testes, com GET e POST reais preservando o baseline final.

## Etapa 4C.16 do Cenario anual

- A validacao de concorrencia no salvamento ficou coberta por testes automatizados controlados e por smoke normal no navegador.
- O helper de salvamento ganhou guarda sincronica em voo e bloqueio por assinatura do payload, impedindo POST duplicado no duplo clique rapido.
- Os testes confirmaram um unico POST enquanto o salvamento estava pendente, sem sucesso falso, com liberacao correta da guarda apos sucesso e apos erro.
- O smoke autenticado confirmou o duplo clique com um unico POST, confirmou reabertura e F5, e o baseline foi restaurado ao final com `ir = 10`.
- Nao houve alteracao de backend, banco ou Procedimentos.

## 2026-07-16 - Cenario anual: validacao de campos invalidos e bloqueio de persistencia

- A Etapa 4C.17 foi validada em navegador autenticado com foco em bloqueio de salvamento para campos invalidos.
- O campo `horas_atendimento_dia` foi alterado temporariamente para `0`, exibiu a mensagem `Informe um valor maior que zero.` e nao gerou `POST /api/cenario`.
- A correcao do campo para `8` permitiu um salvamento valido com um unico `POST /api/cenario`, sem erros de `NaN` ou `Infinity`.
- A reabertura do modal confirmou o baseline restaurado `modo_horas = Perfil Flexivel`, `meses_trabalhados = 10.5`, `dias_uteis_mes = 20`, `dias_uteis_ano = 210`, `horas_atendimento_dia = 8`, `num_consultorios = 1`, `total_horas_fixo = 1680`, `total_minutos_fixo = 100800`, `total_turnos_fixo = 420`, `total_horas_flex = 1449`, `total_minutos_flex = 86940`, `total_turnos_flex = 362.25`, `horas_ano = 1449`, `custo_ano = 201250`, `cfph = 138.88888888888889`, `cfpm = 2.314814814814815`, `gasto_anual_particular = 71250`, `gasto_anual_empresa = 130000`, `ir = 10`, `cd = 20` e `cartao = 4`.
- A cobertura automatizada da feature permaneceu em 17 testes aprovados, com build aprovado e apenas o warning conhecido de chunk grande do Vite.
- Nenhuma alteracao foi realizada em backend, banco ou Procedimentos.