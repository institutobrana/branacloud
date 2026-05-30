# Fase 2C - Matriz operacional de reducao de monolitos

## 1. Contexto

- A Fase 2B foi concluida como trilha conservadora de modularizacao segura.
- A Fase 2C inicia uma estrategia diferente: reducao real de monolitos, com risco controlado medio / medio-alto.
- O objetivo deixa de ser apenas isolar pontos baixos de risco e passa a ser reduzir blocos grandes do `frontend/app.js` com contrato claro, backup e ponto de retorno.
- Esta matriz nao altera codigo, banco, HTML, backend, migrations, seeds ou endpoints.

## 2. Diferenca entre Fase 2B e Fase 2C

- Fase 2B: priorizou somente recortes de baixo risco e validacoes conservadoras.
- Fase 2C: aceita recortes de risco medio e medio-alto, desde que exista:
  - fronteira clara;
  - backup antes da alteracao;
  - retorno definido;
  - validacao manual posterior;
  - commit seletivo e rastreavel.

## 3. Regras operacionais da Fase 2C

- Nao alterar banco diretamente nesta etapa de matriz.
- Nao alterar backend funcional antes do contrato estar fechado.
- Nao alterar `frontend/index.html` nesta fase de matriz.
- Toda futura implementacao deve nascer de um recorte pequeno e reversivel.
- Cada recorte precisa indicar:
  - arquivo alvo;
  - helper passivo existente ou a criar;
  - risco;
  - fronteira proibida;
  - teste manual esperado;
  - documento de validacao posterior.

## 4. Ponto de retorno e backup

- O ponto de retorno da Fase 2C e documental:
  - roadmap atualizado;
  - commit seletivo;
  - doc de matriz;
  - doc de implementacao;
  - doc de validacao manual.
- Antes de qualquer implementacao da Fase 2C, deve existir backup/teste comparavel do estado atual do codigo.
- A regra pratica e: alterar menos, medir mais, e manter um caminho claro de volta.

## 5. Matriz operacional de candidatos

### 5.1 Editor de Textos

- Estado: monolito grande, com blocos extensos em `frontend/app.js`.
- Mapeamento tecnico:
  - existe `frontend/js/modules/editor_textos_bootstrap.js`;
  - o `app.js` continua concentrando logica de documento, modelagem, salvar, abrir, modelo standalone e integracoes diversas;
  - o bootstrap passivo ja oferece uma base para separacao gradual.
- Risco: medio-alto.
- Ganho: muito alto.
- Observacao: e o melhor primeiro candidato para reducao real de monolito, porque ja existe uma fronteira passiva inicial.

### 5.2 Agenda principal

- Estado: grande, sensivel e com varios helpers passivos ja existentes.
- Risco: alto.
- Ganho: alto.
- Observacao: bom candidato futuro, mas menos seguro como primeira incursao da Fase 2C.

### 5.3 Ficha pessoal

- Estado: modulo comum/core, mas fortemente acoplado.
- Risco: alto.
- Ganho: alto.
- Observacao: ja foi mapeada em contrato profundo anterior, mas nao e o melhor primeiro passo da Fase 2C.

### 5.4 Convenios e Planos

- Estado: parcialmente modularizado e parcialmente validado.
- Risco: medio-alto.
- Ganho: medio.
- Observacao: util como referencia, mas nao como primeira frente da Fase 2C.

### 5.5 Prestadores

- Estado: parcialmente modularizado e parcialmente validado.
- Risco: medio-alto.
- Ganho: medio.
- Observacao: ja passou pela trilha conservadora; nao e a melhor primeira reducao real agora.

### 5.6 Preferencias / Configuracoes

- Estado: consolidada e estavel.
- Risco: baixo.
- Ganho: baixo para Fase 2C, pois ja foi tratada como referencia.
- Observacao: permanece como baseline funcional, nao como alvo inicial da nova estrategia.

## 6. Ranking de primeira frente segura para reducao real

1. Editor de Textos
2. Agenda principal
3. Ficha pessoal
4. Convenios e Planos
5. Prestadores
6. Demais modulos comuns/core

## 7. Decisao da matriz

- Decisao registrada: `F2C-MATRIZ-D`
- Interpretacao: a Fase 2C deve iniciar com um primeiro fluxo real de reducao de monolito, e nao mais apenas com ajuste de fronteiras seguras de baixa complexidade.
- A primeira escolha deve mirar o maior monolito com fronteira passiva ja existente.

## 8. Primeiro fluxo recomendado

- Primeiro fluxo recomendado: `Editor de Textos - separacao inicial de bootstrap/shell visual`
- Motivo:
  - e o maior bloco concentrado em `frontend/app.js`;
  - ja existe `frontend/js/modules/editor_textos_bootstrap.js`;
  - a separacao pode começar pela montagem visual e pelo bootstrap de UI;
  - permite reduzir o monolito sem exigir reescrita imediata do fluxo de salvar ou do modelo completo.
- Escopo permitido para a primeira implementacao futura:
  - extrair a montagem visual/bootstrap;
  - manter fallback local;
  - preservar os contratos de abrir/salvar;
  - preservar o comportamento funcional existente.
- Escopo proibido:
  - reescrever o modelo de documento;
  - alterar backend;
  - alterar banco;
  - alterar `frontend/index.html`;
  - alterar permissões, seeds ou endpoints;
  - expandir para agenda, ficha pessoal ou financeiro nesta primeira implantacao.

## 9. Fronteiras proibidas gerais

- Banco.
- Backend funcional.
- `frontend/index.html`.
- Endpoints.
- Migrations.
- Seeds.
- Permissoes.
- Scripts de restauracao.
- Mudancas em massa sem contrato.

## 10. Manual de teste esperado

- Abrir o modulo alvo.
- Confirmar que a UI continua carregando.
- Confirmar abertura/fechamento do painel ou tela.
- Confirmar que a renderizacao visual permanece igual antes e depois.
- Confirmar que nenhum fluxo sensivel foi tocado sem contrato.
- Registrar validacao manual posterior antes de qualquer novo recorte.

## 11. Proximo documento necessario

- Documento de implementacao do primeiro fluxo real de Fase 2C.
- Documento de validacao manual do primeiro fluxo real.
- Se o recorte ficar muito amplo, voltar para nova matriz antes de codar.

## 12. Registro para roadmap

- A Fase 2C foi aberta como estrategia de reducao real de monolitos.
- A decisao da matriz foi `F2C-MATRIZ-D`.
- O primeiro fluxo recomendado e `Editor de Textos - separacao inicial de bootstrap/shell visual`.
- A Fase 2C aceita risco controlado medio / medio-alto, desde que exista ponto de retorno e validacao.
- Nenhum codigo foi alterado nesta etapa.
- Nenhum dado de banco foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.

