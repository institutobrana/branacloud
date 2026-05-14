# Recomendação do próximo módulo após Etiquetas

## 1. Contexto
O ciclo de Etiquetas / Configuracao de modelos de etiqueta foi encerrado no commit:

`18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas`

Esta analise e somente documental. Nao houve alteracao de codigo funcional, nem criacao de novo modulo JS, nem ajuste de backend, banco ou endpoints.

## 2. Comandos iniciais executados
Saidas registradas:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short

git diff --stat

git log --oneline -10
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do proximo modulo pos-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
```

## 3. Documentos lidos
Documentos encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`

Relatorios de ciclos anteriores encontrados e consultados:

- `docs/unidades_subetapa_0_mapeamento_monolitico.md`
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md`
- `docs/unidades_subetapa_2_comparacao_helpers.md`
- `docs/unidades_subetapa_3_carregamento_passivo.md`
- `docs/unidades_subetapa_4_wrapper_status_html.md`
- `docs/unidades_subetapa_5_wrapper_fmt_codigo.md`
- `docs/unidades_subetapa_6_wrapper_telefone_padrao.md`
- `docs/unidades_subetapa_7_auditoria_helpers_modulares.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- `docs/plano_contas_subetapa_3_helpers_puros.md`
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/cid_subetapa_1_estrutura_modular_passiva.md`
- `docs/cid_subetapa_2_fronteiras_contratos.md`
- `docs/cid_subetapa_3_helpers_puros.md`
- `docs/cid_subetapa_4_integracao_helpers_salvar.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_3_helpers_textuais_puros.md`
- `docs/medicamentos_subetapa_4_integracao_validacao_nome.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/auxiliares_subetapa_3_helpers_puros.md`
- `docs/auxiliares_subetapa_4_integracao_helpers_puros.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
- `docs/etiquetas_subetapa_4_validacao_helpers.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`

Documento obrigatorio ausente ja conhecido:

- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Estado atual da branch
- Branch atual: `modularizacao-segura-fase-1`
- HEAD atual: `18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas`
- Status antes desta analise: limpo
- Baseline funcional recente: `18b25aa`

## 5. Critérios de escolha
Usei criterios conservadores:

- fronteiras claras e previsiveis
- possibilidade de Subetapa 0 documental sem alteracao funcional
- namespace passivo possivel sem mexer no fluxo principal cedo demais
- helpers puros pequenos que possam ser extraidos depois
- baixo risco de afetar agenda, financeiro, procedimentos, editor de textos, autenticacao ou shell principal
- menor acoplamento com outros modulos e menor numero de fluxos criticos

## 6. Modulos avaliados

### Anamnese
- Tamanho: grande, com bloco espalhado por aproximadamente 13 mil linhas de span associadas ao prefixo `anamnese`.
- Funcionalidade: questionarios, perguntas, impressao e integracao com ficha/paciente.
- Risco: medio/alto, porque toca fluxo de paciente e imprime.
- Vantagem: tem painel proprio e fronteira visual clara.
- Conclusao: bom candidato, mas nao o mais seguro depois de Etiquetas.

### Simbolos graficos
- Tamanho: grande, com muitos helpers e uso de canvas/desenho.
- Funcionalidade: edicao visual, desenho e persistencia de simbolos.
- Risco: alto, por envolver interacao visual mais delicada e forte acoplamento com procedimentos.
- Vantagem: tem identidade propria.
- Conclusao: adiar.

### Prestadores
- Tamanho: relevante, mas a area encontrada no `app.js` parece ainda muito misturada com consultas relacionadas a usuarios, comissoes e agenda.
- Funcionalidade: cadastro e listas de prestadores, com portas para agendas e comissoes.
- Risco: medio, por dependencias cruzadas.
- Vantagem: dominio claro.
- Conclusao: possivel, mas nao a melhor primeira escolha agora.

### Convenios e planos
- Tamanho: medio/grande.
- Funcionalidade: convenios, planos e calendario de faturamento.
- Risco: alto, por ser area sensivel de faturamento/financeiro.
- Vantagem: fronteira de cadastro existe.
- Conclusao: adiar.

### Materiais
- Tamanho: medio/grande.
- Funcionalidade: cadastro de materiais, vinculos e custo.
- Risco: medio/alto, porque alimenta procedimentos e calculos de custo.
- Vantagem: catalogo relativamente claro.
- Conclusao: possivel depois, mas nao primeiro.

### Procedimentos
- Tamanho: muito grande e muito disperso.
- Funcionalidade: tabela principal, editor, vinculacao de materiais, simbolos e regras de cobranca.
- Risco: alto, por misturar varios fluxos criticos.
- Vantagem: nenhuma relevante para uma extracao segura imediata.
- Conclusao: evitar por enquanto.

### Procedimentos genericos
- Tamanho: relevante, mas bem mais concentrado que `procedimentos`.
- Funcionalidade: cadastro proprio de procedimentos genericos, com lista, editor e migracao.
- Risco: moderado, porque depende de buscas auxiliares de materiais e filtros de procedimentos, mas o fluxo central e catalogo separado.
- Vantagem: tem endpoints dedicados (`/cadastros/procedimentos-genericos`), painel proprio e fronteira mais clara.
- Conclusao: melhor equilibrio entre tamanho, isolamento e risco.

### Indices financeiros
- Tamanho: medio/grande, com risco de calculo e fluxo financeiro.
- Funcionalidade: operacoes de caixa/relatorios financeiros.
- Risco: alto.
- Conclusao: evitar por enquanto.

### Agenda
- Tamanho: muito grande, com muitos fluxos e estados.
- Funcionalidade: agenda de contatos, agenda legada e agenda semanal.
- Risco: muito alto, por ser fluxo central e com efeitos colaterais amplos.
- Conclusao: adiar fortemente.

### Editor de textos
- Tamanho: muito grande e o bloco mais espalhado entre os candidatos.
- Funcionalidade: editor complexo com assistentes, tabelas, imagens, anexos e modais.
- Risco: muito alto, por envolver UI rica, modais e multiplas dependencias.
- Conclusao: nao tocar ainda.

## 7. Modulos a evitar por enquanto
Evitar, nesta ordem, por risco e acoplamento:

- Editor de textos
- Agenda
- Procedimentos
- Indices financeiros
- Convenios e planos
- Simbolos graficos

Como candidatos secundarios, com risco moderado e melhor deixar para depois:

- Anamnese
- Materiais
- Prestadores

## 8. Modulo recomendado
Modulo recomendado como proximo passo:

- `Procedimentos genericos`

## 9. Justificativa curta
`Procedimentos genericos` venceu porque combina:

- fronteira visual clara
- painel proprio
- endpoints dedicados
- menor risco que agenda, financeiro, editor de textos e procedimentos completos
- possibilidade real de Subetapa 0 documental e de namespace passivo depois
- acoplamento menor que o bloco principal de `procedimentos`

## 10. Riscos do modulo escolhido
Riscos especificos do modulo recomendado:

- dependencias de lookup com `procedimentos/filtros`
- dependencia de listas de materiais para o editor
- uso de simbolos como apoio visual
- migracao de registros pode misturar o catalogo com outros fluxos se for tocada cedo demais
- potencial confusao entre `procedimentos genericos` e `procedimentos` principal

## 11. Recomendacao para a proxima Subetapa 0
Para iniciar a Subetapa 0 de `Procedimentos genericos`, seguir o mesmo padrao conservador usado nos ciclos anteriores:

- mapear somente o monolito atual em `frontend/app.js`
- identificar a funcao principal de abertura
- listar funcoes relacionadas, caches, estados e seletores
- mapear endpoints e dependencias
- registrar riscos e helpers puros candidatos
- nao alterar `frontend/app.js`
- nao alterar `frontend/index.html`
- nao criar namespace passivo ainda
- nao mover comportamento funcional

## 12. Checks finais
Estado final verificado antes de criar este relatorio:

```text
git status --short

git diff --stat
```

Resultado esperado para a proxima etapa:

```text
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
```

## 13. Confirmação final
- Nenhum codigo funcional foi alterado
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum commit foi feito
