# Matriz curta - Proxima frente apos Prestadores lista/selecao visual

## 1. Contexto

- `Preferencias / Configuracoes` foi consolidada como frente estavel.
- `Prestadores` foi parcialmente validado com lista e selecao visual.
- A correcao usuario -> prestador Clinica foi encerrada e validada.
- PostgreSQL 17 segue estavel como cluster oficial.
- A Fase 2B segue em risco medio controlado.

## 2. Estado atual

- O que esta consolidado:
  - `Preferencias / Configuracoes` consolidada;
  - `Prestadores` lista e selecao visual validado;
  - `prestSelecionarLinhaVisual` validado;
  - correlacao usuario -> prestador Clinica validada e encerrada;
  - PostgreSQL 17 oficial e estavel.
- O que permanece sensivel:
  - filtros locais de `Prestadores`;
  - shell visual / abertura e fechamento;
  - acoes de placeholder;
  - carregamento remoto;
  - payload e salvamento;
  - agenda, convenios e comissoes;
  - areas financeiras e criticas do monolito.

## 3. Caminhos comparados

### Caminho A
- Continuar em `Prestadores` com novo contrato profundo.
- Beneficio: continuidade na frente ja aberta.
- Risco: os proximos pontos ja encostam em filtros, estado, shell e areas sensiveis.
- Observacao: aceitavel apenas com novo contrato muito explicito.

### Caminho B
- Voltar a matriz ampla e escolher outra frente antes de novo codigo.
- Beneficio: evita aprofundar demais em frente mista.
- Risco: troca de contexto.
- Observacao: util se o limite conservador de `Prestadores` for considerado atingido.

### Caminho C
- Avancar em outra frente de risco medio controlado.
- Beneficio: distribui a reducao do monolito e evita forcar mais `Prestadores`.
- Risco: exige novo contrato profundo, mas com melhor equilibrio entre beneficio, controle e testabilidade.

### Caminho D
- Pausar modularizacao por pendencia funcional.
- Beneficio: estabiliza o produto.
- Risco: nao reduz o monolito.
- Observacao: nao e o caso agora.

## 4. Candidatos avaliados

| Candidato | Classificacao multiarea | Risco | Beneficio | Teste manual | Modulo passivo | Recomendacao |
| --- | --- | --- | --- | --- | --- | --- |
| `Prestadores` - filtros/shell/helpers | misto | RISCO-MEDIO-ALTO | medio | alta | sim | bloquear por ora; ja chegou no limite conservador |
| `Cadastros auxiliares` | comum/core | RISCO-MEDIO | medio | media | sim | possivel, mas abaixo do escolhido nesta rodada |
| `Etiquetas` | comum/core | RISCO-BAIXO-MEDIO | medio | media | sim | possivel, mas nao prioritario agora |
| `Convenios e Planos` | comum/core transversal | RISCO-MEDIO | alto | alta | sim | **recomendado** |
| `Plano de contas` | mista/financeira | RISCO-MEDIO-ALTO | medio | media | sim | pausar por enquanto |
| `Medicamentos` | especifica de area profissional / mista | RISCO-MEDIO-ALTO | medio | media | sim | pausar por enquanto |
| `Conta corrente` | misto / financeira | RISCO-ALTO | medio | media-baixa | nao evidente | evitar por enquanto |
| `Preferencias / Configuracoes` | comum/core | RISCO-BAIXO | alto | alta | sim | referencia consolidada, nao candidata principal |
| `Usuarios/Admin` | plataforma/admin | RISCO-CRITICO | alto | media-baixa | sim | evitar; ja tratado parcialmente por correcao funcional |
| `Relatorios` / `Agenda principal` | plataforma/admin / misto critico | RISCO-CRITICO | alto | baixa | parcial | evitar por enquanto |

## 5. Decisao da matriz

**Decisao:** `MATRIZ-POS-PREST-C`

## 6. Justificativa

- `Prestadores` ja chegou a um ponto conservador valido e os proximos passos ali sobem para risco medio-alto.
- O melhor equilibrio entre beneficio, controle e testabilidade agora esta em `Convenios e Planos`.
- Existe modulo passivo para `Convenios e Planos`, o que ajuda a manter o recorte sob controle.
- A frente e transversal e entregue a monolito, mas ainda oferece fronteira documental mais clara do que `Conta corrente`, `Plano de contas` ou `Medicamentos`.
- `Cadastros auxiliares` e `Etiquetas` sao alternativas viaveis, mas a relacao beneficio/alcance de reducao do monolito favorece `Convenios e Planos` nesta rodada.

## 7. Proxima frente recomendada

- Frente: `Convenios e Planos`.
- Recorte inicial sugerido:
  - contrato profundo do bloco restante de lista/shell/selecao visual;
  - mapeamento de filtros e helpers puros;
  - separacao clara de modal/lista/acao de tela;
  - sem tocar em payload, salvamento, exclusao, calendario de faturamento ou integracoes com paciente/financeiro.
- Fronteiras proibidas iniciais:
  - `requestJson`;
  - payload;
  - salvamento;
  - exclusao;
  - agenda/faturamento/calendario;
  - backend;
  - banco;
  - permissões;
  - `frontend/index.html`;
  - qualquer mutacao funcional direta.
- A proxima etapa deve ser contrato profundo, nao implementacao imediata.

## 8. Onde testar futuramente

- tela de `Convenios e Planos`;
- lista principal;
- selecao;
- filtros;
- abertura/fechamento;
- modais internos apenas como nao-regressao futura.

## 9. Confirmacoes de escopo

- nenhum codigo alterado;
- nenhum dado de banco alterado;
- frontend/app.js nao alterado;
- frontend/index.html nao alterado;
- frontend/js/modules nao alterado;
- backend nao alterado;
- `.env` nao alterado;
- banco/schema/migrations/seeds/endpoints nao alterados;
- PostgreSQL 18 nao excluido/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 10. Registro para roadmap

Matriz curta pos-Prestadores registrou `MATRIZ-POS-PREST-C`, com recomendacao de `Convenios e Planos` como proxima frente de contrato profundo.
