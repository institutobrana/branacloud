# Intervenções / Procedimentos / Seeds — Subetapa 0 — Diagnóstico da tabela PARTICULAR/Brana em novas contas

## 1. Objetivo
Diagnosticar, somente em leitura, como nasce o bloco de Intervenções / Procedimentos / Seeds em novas contas, com foco na tabela PARTICULAR/Brana, no vínculo com a Tabela exemplo e na materialização dos 336 procedimentos esperados para a nova regra funcional.

## 2. Escopo desta subetapa
- Somente diagnóstico documental e técnico.
- Sem alterar código.
- Sem alterar banco.
- Sem alterar seed.
- Sem migration.
- Sem criação de clínica.
- Sem criação de nova conta.
- Sem popular procedimentos.
- Sem renomear dados de contas existentes.
- Sem avanço para Subetapa 1.
- Sem correção textual fora do escopo.

## 3. Contratos e regras consultados
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`

## 4. Documentos relacionados encontrados
- `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_procedimentos.md`
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/auditoria_alerta_tabela_procedimentos_nao_encontrada_vinculo_material.md`
- `docs/auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `docs/04_funcionalidades.md`
- `docs/05_banco_dados.md`
- `docs/03_mapa_codigo.md`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Arquivos técnicos consultados
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_tabela.py`
- `backend/routes/procedimentos_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/scripts/corrigir_tabela_exemplo_particular.py`
- `backend/scripts/recriar_particular_easydental.py`
- `backend/scripts/migrar_tabelas_procedimentos_easy.py`

## 6. Fluxo atual identificado para criação de tabelas de procedimentos em nova conta
O fluxo técnico atual identificado é:

1. `criar_conta_saas()` cria a clínica e aplica bootstrap de bases auxiliares.
2. O signup chama `seed_procedimentos_genericos(db, clinica.id)` e `seed_procedimentos(db, clinica.id)`.
3. `seed_procedimentos()` garante a tabela `Tabela Exemplo` com `codigo = 1`.
4. O mesmo seed também garante a tabela `PARTICULAR` com `codigo = 4`, mesmo que ela esteja vazia.
5. Em seguida, `garantir_procedimentos_padrao_clinica()` tenta materializar a Tabela exemplo e, se existir seed particular válido, também materializa a tabela privada separada.
6. O backend trabalha com `procedimento.tabela_id` como campo operacional da tabela do procedimento.
7. A leitura de detalhes e vínculos continua dependente de `tabela_id` e de `procedimento_generico_id`.

## 7. Origem da Tabela exemplo
A origem técnica da `Tabela exemplo` está no seed canônico de procedimentos:

- `backend/seeds/procedimentos_padrao.py` cria/garante a tabela com `codigo = 1` e nome `Tabela Exemplo`.
- `backend/services/signup_service.py` confirma que o signup de nova clínica consome esse seed canônico para a Tabela exemplo.
- A materialização dos procedimentos dessa tabela ocorre sobre `procedimento.tabela_id` apontando para o registro da `Tabela Exemplo`.

Conclusão documental:
- a Tabela exemplo é a tabela base canônica do seed de procedimentos para novas contas.

## 8. Origem da tabela PARTICULAR
A origem técnica da tabela `PARTICULAR` é a trilha legada e separada da Tabela exemplo:

- `backend/seeds/procedimentos_padrao.py` ainda garante um registro de tabela com nome `PARTICULAR` e `codigo = 4`.
- `backend/services/signup_service.py` possui um fluxo separado para a tabela privada, por meio de `_upsert_procedimentos_particular_na_clinica()`.
- Esse fluxo usa a base de 336 procedimentos localizada na trilha particular do signup, ligada ao snapshot/CSV da conta modelo.

Diagnóstico preliminar:
- a origem atual ainda está marcada com o nome legada `PARTICULAR`;
- a regra funcional nova deseja que essa origem passe a ser `Brana` apenas no nascimento de novas contas;
- contas existentes não devem ser renomeadas.

## 9. Diagnóstico preliminar sobre PARTICULAR nascer com 0 procedimentos
O diagnóstico preliminar mais provável é um descompasso entre:

- a trilha que garante a existência da tabela `PARTICULAR` como estrutura;
- a trilha que materializa os 336 procedimentos particulares;
- e a nova regra funcional que quer essa mesma tabela nascendo como `Brana` nas contas novas.

Em termos práticos, o comportamento que explica `PARTICULAR` nascer com 0 procedimentos é:

- a tabela ser criada/garantida como shell;
- o payload completo dos 336 procedimentos não ser materializado na mesma trilha esperada pela nova conta;
- ou o material ser aplicado sob a identidade legada `PARTICULAR`, enquanto a UI/regra funcional esperam a identidade `Brana`.

Leitura técnica adicional:
- o modelo usa `procedimento.tabela_id` como chave real;
- não há, no model lido, uma coluna operacional chamada `procedimento_tabela_id`;
- portanto, o problema não é só de nome visível, mas também de qual `tabela_id` está sendo preenchido e com qual seed ele é associado.

## 10. Local provável dos 336 procedimentos
Os 336 procedimentos esperados estão ou deveriam estar na trilha de seed particular usada pelo signup:

- `Dados/particular_336_procedimentos.csv`
- `scripts/easy_particular_atual_snapshot.json`
- o carregamento técnico feito por `backend/services/signup_service.py` em `_carregar_seed_procedimentos_particular()`
- a materialização feita por `_upsert_procedimentos_particular_na_clinica()`

Conclusão:
- os 336 procedimentos não parecem viver no seed da `Tabela exemplo`;
- eles pertencem à trilha da tabela privada separada;
- para novas contas, essa trilha é a que deve passar a nascer como `Brana`.

## 11. Relação técnica entre tabelas e colunas envolvidas
Tabelas e colunas centrais identificadas:

- `procedimento_tabela`
  - `id`
  - `clinica_id`
  - `codigo`
  - `nome`
  - `nro_indice`
  - `fonte_pagadora`
  - `nro_credenciamento`
  - `inativo`
  - `tipo_tiss_id`
- `procedimento`
  - `id`
  - `clinica_id`
  - `codigo`
  - `nome`
  - `tabela_id`
  - `procedimento_generico_id`
  - `tempo`
  - `preco`
  - `custo`
  - `custo_lab`
  - `lucro_hora`
  - `especialidade`
  - `simbolo_grafico`
  - `simbolo_grafico_legacy_id`
  - `mostrar_simbolo`
  - `garantia_meses`
  - `forma_cobranca`
  - `valor_repasse`
  - `preferido`
  - `inativo`
  - `observacoes`
  - `data_inclusao`
  - `data_alteracao`
- `procedimento_material`
  - `procedimento_id`
  - `material_id`
  - `quantidade`
  - `clinica_id`
- `procedimento_fase`
  - `procedimento_id`
  - `clinica_id`
  - `codigo`
  - `descricao`
  - `sequencia`
  - `tempo`
- `procedimento_generico`
  - `id`
  - `clinica_id`
  - `codigo`

Leitura técnica importante:
- o campo operacional usado pelo procedimento é `procedimento.tabela_id`;
- `procedimento_generico_id` é a ponte de herança entre genérico e procedimento;
- a UI/API de vínculos e leitura trabalha em cima desse par de chaves;
- a tabela lógica de origem é `procedimento_tabela`, mas o vínculo efetivo do procedimento é feito pelo `tabela_id`.

## 12. Risco de impacto em contas existentes
O risco de mexer nessa regra é alto para contas já existentes, porque:

- a base atual ainda reconhece o nome legada `PARTICULAR`;
- existem contas antigas que podem depender desse nome e desse `tabela_id`;
- uma renomeação automática pode quebrar vínculos, filtros e leitura histórica;
- a recomposição errada pode deixar tabelas duplicadas ou vazias;
- uma alteração ampla pode afetar materiais, fases e o relacionamento com `procedimento_generico_id`.

Portanto:
- qualquer correção futura deve ser restrita ao nascimento de novas contas;
- contas existentes devem manter `PARTICULAR` como estão;
- não deve haver migração retroativa por esta regra funcional.

## 13. Decisão funcional registrada para novas contas
Para novas contas/clínicas:
- deve nascer Tabela exemplo;
- deve nascer Brana;
- Brana substitui PARTICULAR apenas no nascimento de novas contas;
- Brana deve conter 336 procedimentos;
- contas existentes podem manter PARTICULAR;
- não deve haver renomeação automática em contas antigas.

## 14. Próxima subetapa recomendada
Subetapa 1 — Correção controlada do seed/nascimento da tabela Brana em novas contas, com foco em trocar PARTICULAR por Brana e garantir vínculo/população dos 336 procedimentos, sem afetar contas existentes.
