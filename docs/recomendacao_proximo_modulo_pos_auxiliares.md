# Recomendacao do Proximo Modulo - Pos Auxiliares

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. Commit base atual

- `1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos`

## 3. git status --short antes

```text
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
```

## 4. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`
- `frontend/js/modules/medicamentos.js`
- `frontend/js/modules/auxiliares.js`

## 5. Documentos consultados

- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/varredura_proximo_modulo_pos_cid.md`

## 6. Módulos candidatos encontrados

### Melhor próximo módulo recomendado

- `Etiquetas / Configuração de modelos de etiqueta`

### Possível, mas não ideal

- `Anamnese`

### Evitar por enquanto

- `Símbolos gráficos`
- `Prestadores`
- `Convênios e planos`
- `Materiais`
- `Procedimentos`
- `Procedimentos genéricos`
- `Índices financeiros`
- `Agenda`
- `Editor de textos`

## 7. Análise resumida de cada candidato

### Etiquetas / Configuração de modelos de etiqueta

- Tem cerca de 20 funções principais no `app.js`.
- As fronteiras estão bem delimitadas em torno de lista, seleção, preview, modal de edição e teste de impressão.
- Não depende de agenda, financeiro, procedimentos ou editor de textos.
- Usa `requestJson`, `ensureModalChrome` e um modal próprio, sem `cadModal`.
- Há helpers textuais/numéricos simples que parecem bons candidatos para futura extração.
- O acoplamento com outros módulos existe, mas é pequeno e previsível, principalmente via preferências.

### Anamnese

- Tem cerca de 26 funções, com duas camadas de código histórico no arquivo.
- É relativamente isolada, com painel, duas modais e CRUD próprio.
- O ponto de atenção é o acoplamento com a ficha/paciente, além de ser uma área clínica sensível.
- Ainda assim, o risco é moderado e muito menor do que em módulos financeiros, de agenda ou de procedimentos.

### Símbolos gráficos

- Tem cerca de 54 funções distribuídas entre lista, modal, biblioteca, editor externo e diálogos.
- Usa `window.postMessage`, iframe/editor externo e fluxo de imagem/customização.
- Também aparece ligado a procedimentos, o que aumenta o risco.
- Não é bom candidato agora.

### Prestadores

- O painel atual está mais próximo de placeholder/migração do que de um CRUD simples.
- Existe acoplamento com agenda, convênios, comissões e permissões.
- O risco de alterar efeitos colaterais é alto.
- Não recomendo agora.

### Convênios e planos

- Toca em fluxo de faturamento/calendário e em um scaffold compartilhado.
- O risco funcional é maior do que parece à primeira vista.
- Não recomendo agora.

### Materiais

- É um dos módulos mais densos do arquivo.
- Tem lista, tabelas, filtros, modal multiaba, combos auxiliares e valores numéricos.
- Também se acopla a procedimentos e unidades de medida.
- Alto risco.

### Procedimentos / Procedimentos genéricos

- É o bloco mais pesado e sensível.
- Toca materiais, símbolos, cálculos, tabela, editor, vínculos e regras financeiras.
- Não é candidato seguro para esta rodada.

### Índices financeiros

- Alto risco por natureza.
- Envolve cotações, validação de uso, migração e exclusão com impacto financeiro.
- Não tocar agora.

### Agenda

- Acoplamento operacional e efeitos colaterais amplos.
- Evitar.

### Editor de textos

- Superfície grande, mais sensível e com vários submodos.
- Evitar.

## 8. Módulo recomendado para o próximo ciclo

- `Etiquetas / Configuração de modelos de etiqueta`

## 9. Justificativa da escolha

- Tem fronteiras mais claras e menores do que os módulos de maior risco.
- Não está no grupo sensível de financeiro, agenda, procedimentos ou editor de textos.
- O módulo parece permitir uma Subetapa 0 documental segura, com mapeamento claro de lista, seleção, preview, modal e endpoints.
- Tem chance real de helpers puros simples, começando por formatação numérica e resolução de layout/padrão.
- O rollback tende a ser simples porque a abertura, o preview e o salvamento estão concentrados no próprio bloco.

## 10. Riscos do módulo escolhido

- O preview de etiquetas e a edição do padrão podem exigir cuidado para não mexer na renderização.
- Há uma integração indireta com preferências do usuário, que precisa ser preservada.
- A prévia de impressão deve continuar com o comportamento atual.
- A modal de edição não deve ser transformada cedo demais em wrapper funcional.

## 11. Proposta de Subetapa 0 para o módulo recomendado

- Mapear `etqEnsureUI()`, `etqRender()`, `etqSyncPreview()`, `etqAplicarPadraoSelecionado()`, `etqAbrirModal()`, `etqSalvarModal()`, `etqExcluirSelecionado()`, `etqCarregarDados()` e `etqAbrir()`.
- Documentar o estado/cache, a lista de modelos, a edição, os arquivos/padrões e o preview.
- Identificar helpers candidatos com calma, sem mover nada ainda.
- Confirmar dependências compartilhadas e o contrato dos endpoints de etiquetas.

## 12. Onde testar antes de começar o novo ciclo

1. Fazer `Ctrl+F5`.
2. Abrir `Configurações > Etiquetas...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista de modelos carrega.
5. Selecionar um modelo e conferir o destaque.
6. Testar `Novo modelo...`.
7. Testar `Altera...`.
8. Testar `Elimina`, se for seguro.
9. Testar a tela de teste/preview.
10. Fechar e reabrir o painel.
11. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.

## 13. Confirmação de que nenhum código funcional foi alterado

- Confirmado.
- Esta etapa foi apenas de análise e recomendação.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- Nenhum arquivo em `frontend/js/modules` foi alterado nesta etapa.

## 14. Confirmação sobre `docs/varredura_proximo_modulo_pos_medicamentos.md`

- O arquivo pendente foi ignorado nesta análise, como solicitado.
- Ele não foi alterado.
- Ele não foi usado como base obrigatória da decisão.

## 15. Conclusão

- O próximo ciclo mais seguro, neste momento, é `Etiquetas / Configuração de modelos de etiqueta`.
- `Anamnese` fica como alternativa possível, mas não como primeira escolha.
- Os demais módulos avaliados têm risco materialmente maior.

## 16. Sugestão de mensagem de commit futuro

- `feat(frontend): inicia modularizacao segura de etiquetas`
