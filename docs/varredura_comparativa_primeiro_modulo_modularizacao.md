# Varredura Comparativa - Primeiro Modulo para Modularizacao

## Estado atual
- Branch atual: `modularizacao-segura-fase-1`
- Working tree antes da analise: limpo
- Ultimos commits relevantes:
  - `fd5129d` - Mapeia Medicamentos para modularizacao segura
  - `e5a04fc` - Mapeia CID para modularizacao segura
  - `46f49b9` - Cria plano de retomada da modularizacao segura
  - `f3cab35` - Corrige duplo clique em convenios e planos no monolitico
  - `1dc8b18` - Restaura frontend monolitico e corrige contratos globais pos-reversao

## Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`

## Documentos consultados
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`

## Resumo de CID e Medicamentos

### CID
- Nao apareceu helper puro seguro para extracao inicial.
- O bloco CID ficou fortemente acoplado a DOM, estado, eventos, fetch/API e shell.
- Conclusao: nao e candidato seguro para a primeira modularizacao real.

### Medicamentos
- Nao apareceu helper puro seguro para extracao inicial.
- O bloco Medicamentos tambem ficou fortemente acoplado a DOM, estado, eventos, fetch/API e shell.
- Conclusao: tambem nao e candidato seguro para a primeira modularizacao real.

## Tabela comparativa

| Módulo | Função de abertura | Qtde aprox. de funcoes relacionadas | Tem helper puro? | Acoplamento com DOM | Acoplamento com estado global | Acoplamento com fetch/API | Acoplamento com shell/menu | Risco | Recomendação |
|---|---|---:|---|---|---|---|---|---|---|
| Unidades | `unidadeAbrir()` | Media | Nao identificado | Alto | Medio | Alto | Medio | Medio | Melhor candidato entre os pedidos, mas ainda exige wrapper/fallback conservador |
| Plano de contas | `planoAbrir()` | Media | Nao identificado | Alto | Medio | Alto | Medio | Medio/Alto | Auditar antes; nao e o primeiro ideal |
| Indices financeiros | `indicesAbrir()` | Alta | Nao identificado | Alto | Alto | Alto | Medio | Alto | Nao recomendado como primeiro modulo |
| Cenarios financeiros | Nao isolado com clareza no bloco atual | Nao confiavel | Nao identificado | Alto | Alto | Alto | Medio | Alto | Nao recomendado agora |
| Tabelas auxiliares | `auxAbrir()` | Alta | Nao identificado | Alto | Alto | Alto | Medio | Alto | Auditar antes; ainda complexo demais para primeira extracao |
| Convenios e Planos | `convPlanAbrir()` | Muito alta | Nao identificado | Muito alto | Muito alto | Muito alto | Alto | Alto | Nao recomendado como primeiro modulo |

## Melhor candidato recomendado
- Melhor candidato para a primeira modularizacao real: `Unidades`

### Justificativa tecnica
- Tem um fluxo mais linear que os demais candidatos comparados.
- Tem uma unica tela principal com um modal de edicao, sem subfluxos como calendario ou multiplas grades cruzadas.
- Embora ainda dependa de DOM, estado e API, o escopo e menos explosivo que `Convênios e Planos`, `Indices financeiros` e `Tabelas auxiliares`.
- E mais facil de testar manualmente do que os outros candidatos listados.
- Para uma fase inicial de modularizacao segura, e o modulo com menor risco relativo dentre os avaliados.

## Modulos que nao devem ser mexidos agora
- `Convênios e Planos`
- `Indices financeiros`
- `Tabelas auxiliares`
- `Cenarios financeiros`
- `Plano de contas`, se a meta for primeira extracao real sem risco adicional
- `CID`
- `Medicamentos`

## Proposta de Subetapa 0 para `Unidades`
1. Mapear todas as funcoes de `Unidades` no `app.js` sem mover codigo.
2. Confirmar quais trechos sao puramente auxiliares e quais dependem de DOM, estado, fetch ou shell.
3. Comparar os helpers com qualquer bloco reutilizavel historico apenas como referencia.
4. Definir a fronteira do modulo sem alterar comportamento.
5. Registrar quais contratos globais o modulo consome.

## Proposta de Subetapa 1 sem risco
1. Criar um namespace controlado para `Unidades` sem ativar comportamento novo.
2. Manter `app.js` como fonte funcional da verdade.
3. Encapsular apenas estrutura de apoio, sem remover funcoes originais.
4. Adicionar wrapper/fallback no `app.js` para qualquer ponto de integracao.
5. Validar que a tela continua abrindo e salvando antes de mover qualquer comportamento.

## Checklist manual futuro para testar `Unidades`
- Abrir `Cadastro > Unidades de atendimento`
- Listar registros
- Selecionar linha
- Abrir modal de edicao
- Salvar alteracao
- Excluir registro
- Fechar modal
- Confirmar ausencia de erro no console

## Checklist reduzido de regressao geral
- Login continua funcionando
- `Medicamentos` continua abrindo
- `CID` continua abrindo
- `Convênios e Planos` continua abrindo
- `Tabelas auxiliares` continua abrindo
- `Indices financeiros` continua abrindo
- `Agenda` continua abrindo

## Critérios para parar antes de alterar codigo
- Se qualquer funcao do shell deixar de abrir tela existente
- Se surgir `ReferenceError` ou `TypeError` no console
- Se a extracao exigir mover DOM, eventos e fetch juntos
- Se o modulo depender de mais de um fluxo interno para funcionar
- Se o wrapper/fallback nao puder ser validado com seguranca

## Conclusao
- A primeira modularizacao real deve comecar por `Unidades`.
- `CID` e `Medicamentos` foram descartados como candidatos iniciais porque nao entregaram helper puro seguro.
- O proximo passo ainda e de preparo: desenhar a Subetapa 0 de `Unidades` sem alterar comportamento funcional.
