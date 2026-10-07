# Brana Cloude — contrato canônico de Procedimentos, Genéricos, materiais e fases

Status: **CANÔNICO / VIGENTE / HOMOLOGADO**. Fonte documental única das regras de domínio abaixo, consolidando R1.R2/R1.R3. O arquivo existente foi promovido, em vez de criar outro contrato concorrente. Revoga sincronização/defaults de campos cadastrais entre Genérico e Procedimentos; não autoriza saneamento de dados, migration ou FC4. O código atual continua sendo a fonte da verdade técnica; divergência comprovada exige revisão autorizada, não mudança funcional implícita.

As regras deste contrato valem para TODAS as clínicas/tenants atuais e futuros, sem exceção ou hardcode de `clinic_id`. R1.R3 revoga a opção funcional "Mostrar símbolo" anteriormente descrita no R1.R2 e na seção 9 do documento principal.

## Precedência entre edição e associação

- O Genérico governa somente materiais (união dinâmica) e fases (substituição na associação/troca). Todos os demais campos cadastrais pertencem ao Procedimento concreto, inclusive nome/código, especialidade, cobrança, símbolo, tempo, laboratório, custo, preço, repasse, garantia, observações, inativo e preferido.
- Tempo e custo de laboratório são **locais**. Edição, zero e limpeza (zero no contrato numérico atual) alteram somente o Procedimento editado. Nunca propagam ao Genérico/associados, nem são repostos pelo Genérico. A decisão anterior de sincronização foi revogada; procedimentos do mesmo Genérico podem ter valores diferentes.
- Associação/troca não aplica defaults de campos cadastrais do Genérico, mesmo quando o campo concreto está vazio, zero ou false. CREATE e UPDATE usam somente dados/defaults próprios do cadastro; não existe herança cadastral ativa.
- Especialidade é opcional e pode ser limpa; observações vazias persistem. Essas regras são locais, sem propagação ou reposição pelo Genérico.
- UPDATE distingue presença: omitido preserva; texto opcional vazio/NULL limpa; numérico vazio na UI vira zero; boolean false persiste. Nome/código continuam obrigatórios. Dinheiro inválido/não finito bloqueia o save. O React não retransmite campos não editados no UPDATE.
- Inclusão/Alteração são exclusivamente do servidor. Custo persistido não exibido não é zerado por edição do nome. Resultados financeiros e custos derivados continuam read-only, sem novas fórmulas/entradas.

Inclusão = readonly; Alteração = readonly. Usuário não edita nem envia esses campos; o backend mantém autoridade sobre a auditoria.

## Símbolos

- Combo vigente: `GET /cadastros/simbolos-graficos?scope=procedimentos-combo`; 63 identidades homologadas (`ESPECIAL` histórico <> 10). O relato de 141 itens/scope amplo no documento anterior é histórico e superado. Catálogo compartilhado/Genéricos não são truncados.
- P4A continua protegendo o par omitido exatamente, inclusive parcial/fora do combo. Escolha/limpeza explícita prevalece. CREATE sem escolha não herda símbolo do Genérico; associação/troca e bootstrap não copiam campos do Genérico para o concreto.
- Manter validação da própria clínica e distinção 57/58 e 18/81; não deduplicar por bitmap/resource. Nenhuma obrigatoriedade nova.
- Todo procedimento que possui símbolo gráfico válido utiliza/exibe esse símbolo no odontograma. Não existe opção do usuário para ocultá-lo: a renderização não depende de `mostrar_simbolo`, mesmo quando o valor histórico é false.
- `mostrar_simbolo` é **DEPRECATED_INTERNAL_FIELD** em Procedimento e Genérico: coluna/DTO/cópia histórica podem permanecer por compatibilidade, sem edição ou efeito no domínio. Clientes antigos que enviam esse campo são ignorados pelos schemas cadastrais; o React não o hidrata nem o envia. Parsers/seeds/importadores históricos podem conservar o metadado, nunca decidir renderização por ele. Não remover colunas ou executar migration nesta fase.
- Regra futura: símbolo gráfico será obrigatório ao salvar/criar/alterar Procedimento, junto aos demais obrigatórios definidos. **Não implementar agora**: depende do saneamento e de fase própria. A existência de símbolo não dispensa validação de catálogo/clínica nem as regras gráficas restantes; esta rodada não implementa/retoma FC4.

## Materiais

- Efetivos = próprios UNION materiais do Genérico atual que não existem nos próprios, por material_id. São usados na grade e nos cálculos. Vínculos próprios persistem; herdados não são copiados permanentemente por associação/troca.
- Dashboard, preview e relatório usam esse mesmo custo efetivo atual, sem substituir a composição por custo canônico de snapshot legado. As demais fórmulas financeiras e correspondência de preço entre tabelas permanecem inalteradas.
- Em colisão, vínculo e **quantidade próprios prevalecem**, conforme contrato de materiais 6.9/9.19/11.8. Genérico com menos materiais nunca reduz próprios. Material exclusivo do Genérico anterior sai da composição.
- Editar materiais próprios altera somente sua lista, sem alterar Genérico/associados. Editar a lista do Genérico modifica somente a parcela complementar dos atualmente associados; nunca materializa herdados como próprios.
- PUT por código continua limitado à quantidade, sem substituir material_id. Troca de material usa remover vínculo + adicionar novo. Alteração própria pertence apenas ao Procedimento; não muda o Genérico. Remover um próprio em colisão pode revelar novamente a ocorrência herdada, sem recriação de próprio, conforme evidência histórica de recomposição.

## Fases e desvinculação

- Associação inicial/troca substitui **todas** as fases pelas do novo Genérico. Genérico sem fases produz lista vazia. Save comum sem troca não recompõe fases.
- Não há suporte operacional a fases próprias nesta frente; é evolução futura. Não criar coluna/tabela de origem, heurística ou migration.
- Desvinculação é permitida pelo vínculo opcional. Pela decisão 3B/6 anterior do usuário, preservar valores concretos e **todas as fases materializadas**, sem seleção por origem. Não existe sincronização cadastral com nenhum Genérico. Próprios permanecem; materiais herdados deixam a composição.

## Precedência documental

Este contrato substitui trechos anteriores sobre sincronização/defaults cadastrais do Genérico (inclusive tempo/laboratório), herança em todo save, reposição de zero/limpeza, cópia permanente de materiais e preservação de fases próprias na troca. Relatos/checkpoints de comportamentos anteriores são históricos, não autorizam reativar propagação. Demais contratos e proteções homologadas permanecem. O documento principal foi mantido byte a byte por conter codificação inválida para edição UTF-8; sua precedência é registrada aqui e no índice oficial, sem limpeza textual global.

Também substitui qualquer afirmação anterior de que "Mostrar símbolo" é editável ou controla exibição (incluindo a linha correspondente da seção 9 e relatos históricos de seeds/legado). A conservação de uma coluna/metadado histórico não conserva essa opção funcional.

| Documento anterior | Situação atual no domínio deste contrato |
| --- | --- |
| `contrato_implementacao_tabela_procedimentos_frontend_react.md` e `auditoria_tabela_procedimentos_frontend_react.md` | **SUPERSEDED** quanto a herança/propagação, materiais/fases, edição/round-trip, scope amplo do combo e opção Mostrar símbolo, inclusive seção 9. Arquitetura, shell, ações e fórmulas não conflitantes permanecem. |
| `contrato_implementacao_procedimentos_genericos_frontend_react.md` e checkpoint PG-S7 | **SUPERSEDED** somente se atribuírem ao Genérico campos do concreto ou poder funcional ao flag legado. CRUD próprio do Genérico, shell e homologação visual permanecem. |
| `validacao_heranca_procedimento_generico_no_procedimento.md` | Evidência histórica, **SUPERSEDED** para defaults/herança de campos cadastrais e aplicação em todo save. |
| `contrato_funcional_regras_materiais_genericos_intervencoes.md` | Detalhamento complementar da união dinâmica; “receber/herdar” significa composição, nunca cópia própria permanente. Precedência deste canônico em qualquer conflito sobre Procedimentos. |
| `contrato_funcional_campos_procedimentos.md`, `contrato_combo_simbolos_procedimentos.md` e `contrato_preservacao_simbolos_procedimentos_p4a.md` | Complementares e vigentes onde compatíveis; disposições anteriores conflitantes são **SUPERSEDED**. P4A preserva par omitido, não restaura escolha/limpeza explícita pelo Genérico. |

A mesma precedência aplica-se aos demais relatos, checkpoints e contratos antigos sobre estes temas, independentemente da clínica. Não há duas regras vigentes: este documento prevalece no domínio delimitado; não redefine outros módulos nem bootstrap.

## Provisionamento — contrato separado

Novas clínicas não devem nascer com todas as tabelas da clínica ID 1. Cadastro/edição e provisão são contratos separados: consultar [seeds de novas contas](contrato_seeds_novas_contas_minimos_nome_codigo.md) e a evolução [signup com seed canônico Brana — 3I](intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md). O relato 3I registra Brana com seed versionado próprio e Tabela exemplo separada, sem dependência runtime da clínica 1/tabela 18 para a Brana.

Fontes técnicas separadas: `backend/services/signup_service.py` (`_carregar_seed_procedimentos_particular`) e `backend/seeds/procedimentos_padrao.py` (`TABELAS_PROCEDIMENTOS_INICIAIS`, `_garantir_tabelas_procedimentos_iniciais`). A lista exata de tabelas por caminho/política de provisionamento exige auditoria documental própria: o contrato antigo menciona PARTICULAR, o relato 3I restringe-a a contas antigas e o registry atual tem evolução posterior. Não fixar uma lista neste contrato nem deduzir bootstrap a partir da regra global. Esta rodada não executa signup, altera seeds ou dados existentes.

## Homologação e cobertura do fechamento

Declaração explícita do usuário neste fechamento, não teste mutável desta rodada:

- `MANUAL_HOMOLOGATION = PASS`; `USER_FOUND_ERRORS = NÃO`.
- `USER_CONFIRMED_EDIT_ROUNDTRIP = PASS`; `USER_CONFIRMED_GENERIC_CHANGE = PASS`.
- `USER_CONFIRMED_MATERIALS = PASS`; `USER_CONFIRMED_PHASES = PASS`.
- `USER_CONFIRMED_NO_SHOW_SYMBOL_OPTION = PASS`; `PLAN_READY_FOR_CLOSE = SIM`.

Cobertura executável de regressão:

- `backend/tests/test_procedimentos_edit_roundtrip.py`: campos locais/omitido/clear/zero/false, isolamento, união dinâmica/precedência/não materialização, troca/substituição de fases, save comum, auditoria readonly e fixtures de tenants novos sem dependência de IDs produtivos.
- `frontend-react/tests/procedimentosEditRoundtrip.test.mjs`: controles, normalização, payloads e bloqueio de valores inválidos.
- `frontend-react/tests/procedimentosShowSymbolDeprecated.test.mjs`: ausência da opção/payload, símbolo com flag histórico false, contrato global e adiamento da obrigatoriedade.
- `backend/tests/test_procedimento_symbol_preservation.py`, `backend/tests/test_procedimentos_symbol_combo_scope.py` e testes frontend de combo/preview: P4A, scope 63, identidades distintas 57/58/81 e clínica autenticada.
- Testes Actions/API/Shell/TableScroll e Genéricos preservam Plano A, Plan B e fluxos já homologados.

Testes mutáveis usam mocks/ORM doubles, sem importar bootstrap nem acessar banco produtivo. O fechamento não altera comportamento homologado, não implementa símbolo obrigatório e não retoma clínica 1/órfãos/FC4. A retomada da revisão manual é fase posterior ao gate Git/runtime.
