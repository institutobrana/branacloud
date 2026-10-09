# Brana Cloude — contrato canônico de Procedimentos, Genéricos, materiais e fases

Status: **CANÔNICO / VIGENTE / HOMOLOGADO**. Fonte documental única das regras de domínio abaixo, consolidando R1.R2/R1.R3. O arquivo existente foi promovido, em vez de criar outro contrato concorrente. Revoga sincronização/defaults de campos cadastrais entre Genérico e Procedimentos; não autoriza saneamento de dados, migration ou FC4. O código atual continua sendo a fonte da verdade técnica; divergência comprovada exige revisão autorizada, não mudança funcional implícita.

As regras deste contrato valem para TODAS as clínicas/tenants atuais e futuros, sem exceção ou hardcode de `clinic_id`. R1.R3 revoga a opção funcional "Mostrar símbolo" anteriormente descrita no R1.R2 e na seção 9 do documento principal.

## Precedência entre edição e associação

- O Genérico governa somente materiais (união dinâmica) e fases (substituição na associação/troca). Todos os demais campos cadastrais pertencem ao Procedimento concreto, inclusive nome/código, especialidade, cobrança, símbolo, tempo, laboratório, custo, preço, repasse, garantia, observações, inativo e preferido.
- Tempo e custo de laboratório são **locais**. Edição, zero e limpeza (zero no contrato numérico atual) alteram somente o Procedimento editado. Nunca propagam ao Genérico/associados, nem são repostos pelo Genérico. A decisão anterior de sincronização foi revogada; procedimentos do mesmo Genérico podem ter valores diferentes.
- Associação/troca não aplica defaults de campos cadastrais do Genérico, mesmo quando o campo concreto está vazio, zero ou false. CREATE e UPDATE usam somente dados/defaults próprios do cadastro; não existe herança cadastral ativa.
- Especialidade é local e obrigatória no cadastro/alteração; observações são opcionais e vazias persistem. Não há propagação ou reposição pelo Genérico.
- UPDATE distingue presença: omitido preserva quando o registro resultante é válido; texto opcional vazio/NULL limpa; numérico vazio na UI vira zero; boolean false persiste. Dinheiro inválido/não finito bloqueia o save. O React não retransmite campos não editados no UPDATE. Código continua sendo identidade técnica obrigatória.
- Inclusão/Alteração são exclusivamente do servidor. Custo persistido não exibido não é zerado por edição do nome. Resultados financeiros e custos derivados continuam read-only, sem novas fórmulas/entradas.

Inclusão = readonly; Alteração = readonly. Usuário não edita nem envia esses campos; o backend mantém autoridade sobre a auditoria.

## Obrigatórios e defaults — evolução R2

Regra global para TODAS as clínicas atuais e futuras, sem hardcode de tenant. Na criação e alteração, validar nesta ordem: **Nome > Procedimento genérico > Especialidade > Símbolo gráfico > Forma de cobrança**. Todos os demais campos cadastrais são opcionais, sem dispensar validações técnicas de identidade, permissão, tenant ou valores inválidos.

- Nome NULL/vazio/whitespace é ausente. Genérico NULL/0 é ausente; referência deve existir na própria clínica. Especialidade NULL/vazia/0/00 é ausente; código deve resolver no catálogo da clínica. Símbolo é ausente quando não há código nem legacy_id válido; referência completa ou parcial deve resolver univocamente no catálogo ativo da própria clínica. Cobrança vazia/NULL é ausente; valores vigentes são INTERVENCAO e ELEMENTO_FACE (aliases históricos normalizados). Zero não é considerado ausente nos campos numéricos opcionais.
- Gravar bloqueia no primeiro obrigatório ausente e abre o aviso oficial React: `Campo {NOME_DO_CAMPO} não pode ser nulo.`. OK fecha somente o aviso; o formulário e seu rascunho permanecem. Referências inválidas são rejeitadas, não corrigidas automaticamente.
- Backend valida os cinco campos do registro resultante em CREATE/UPDATE antes de bootstrap ou mutação. Omissão no UPDATE preserva o existente, mas não permite salvar um registro inválido. Não há saneamento automático dos registros existentes/órfãos.
- Novo cadastro inicia Genérico **vazio** e Forma de cobrança **INTERVENCAO / Intervenção**; edição mantém o valor existente. Primeiro item do combo não é default funcional. Usuário pode escolher outra cobrança válida.
- Inclusão/Alteração usam o padrão ciano existente `ficha-dados-readonly-cyan`, sem nova tonalidade. Permanecem readonly, fora do payload.
- Busca remota por nome mantém a semântica vigente e o dataset integral. Texto do input é local/imediato; somente consulta aguarda 200 ms, com Enter/limpeza imediatos. Nenhum limite de resultados é acrescentado.

Esta evolução funcional/visual R2 aguarda homologação manual; a homologação registrada ao final é a do fechamento anterior.

## Símbolos

- Combo vigente: `GET /cadastros/simbolos-graficos?scope=procedimentos-combo`; 63 identidades homologadas (`ESPECIAL` histórico <> 10). O relato de 141 itens/scope amplo no documento anterior é histórico e superado. Catálogo compartilhado/Genéricos não são truncados.
- P4A continua protegendo o par omitido exatamente, inclusive parcial/fora do combo, desde que resolva uma referência válida. UPDATE não normaliza automaticamente o par omitido. Escolha explícita válida prevalece; limpeza é bloqueada pela obrigatoriedade R2. CREATE sem escolha é bloqueado, nunca herda símbolo do Genérico; associação/troca e bootstrap não copiam campos do Genérico para o concreto.
- Manter validação da própria clínica e distinção 57/58 e 18/81; não deduplicar por bitmap/resource.
- Todo procedimento que possui símbolo gráfico válido utiliza/exibe esse símbolo no odontograma. Não existe opção do usuário para ocultá-lo: a renderização não depende de `mostrar_simbolo`, mesmo quando o valor histórico é false.
- `mostrar_simbolo` é **DEPRECATED_INTERNAL_FIELD** em Procedimento e Genérico: coluna/DTO/cópia histórica podem permanecer por compatibilidade, sem edição ou efeito no domínio. Clientes antigos que enviam esse campo são ignorados pelos schemas cadastrais; o React não o hidrata nem o envia. Parsers/seeds/importadores históricos podem conservar o metadado, nunca decidir renderização por ele. Não remover colunas ou executar migration nesta fase.
- A obrigatoriedade anteriormente planejada passa a valer no cadastro/alteração R2 junto aos cinco campos acima. A existência de símbolo não dispensa validação de catálogo/clínica nem as regras gráficas restantes; esta rodada não implementa/retoma FC4 e não modifica órfãos nem bootstrap.

## Materiais

- Efetivos = próprios UNION materiais do Genérico atual que não existem nos próprios, por material_id. São usados na grade e nos cálculos. Vínculos próprios persistem; herdados não são copiados permanentemente por associação/troca.
- Dashboard, preview e relatório usam esse mesmo custo efetivo atual, sem substituir a composição por custo canônico de snapshot legado. As demais fórmulas financeiras e correspondência de preço entre tabelas permanecem inalteradas.
- Em colisão, vínculo e **quantidade próprios prevalecem**, conforme contrato de materiais 6.9/9.19/11.8. Genérico com menos materiais nunca reduz próprios. Material exclusivo do Genérico anterior sai da composição.
- Editar materiais próprios altera somente sua lista, sem alterar Genérico/associados. Editar a lista do Genérico modifica somente a parcela complementar dos atualmente associados; nunca materializa herdados como próprios.
- PUT por código continua limitado à quantidade, sem substituir material_id. Troca de material usa remover vínculo + adicionar novo. Alteração própria pertence apenas ao Procedimento; não muda o Genérico. Remover um próprio em colisão pode revelar novamente a ocorrência herdada, sem recriação de próprio, conforme evidência histórica de recomposição.

## Fases e desvinculação

- Associação inicial/troca substitui **todas** as fases pelas do novo Genérico. Genérico sem fases produz lista vazia. Save comum sem troca não recompõe fases.
- Não há suporte operacional a fases próprias nesta frente; é evolução futura. Não criar coluna/tabela de origem, heurística ou migration.
- Desvinculação por cadastro/alteração não é permitida a partir do R2: Genérico é obrigatório, e a tentativa é bloqueada antes de alterar valores, fases ou materiais. A decisão histórica de preservar valores concretos e fases ao desvincular fica SUPERSEDED para esse fluxo. A composição dinâmica continua sem copiar materiais; nenhuma migração ou limpeza de vínculos antigos é autorizada.

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

Evolução R2B: consultar a seção vigente de alinhamento no contrato de seeds.
Listagens/GET de Procedimentos são sem DML, inclusive resolução de índices;
não executam bootstrap/repair implícito. `nome_tabela_procedimentos` é legado
interno inerte, sem escolha/default/runtime ou auto-recriação de tabela.
Cadastro explícito e bootstrap de nascimento continuam separados do alinhamento
autorizado por manifesto. Todas as regras homologadas de edição, materiais,
fases, símbolos e campos locais acima permanecem inalteradas.

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
- `frontend-react/tests/procedimentosShowSymbolDeprecated.test.mjs`: ausência da opção/payload, símbolo com flag histórico false e contrato global; obrigatoriedade agora regida pela evolução R2 acima.
- `backend/tests/test_procedimento_symbol_preservation.py`, `backend/tests/test_procedimentos_symbol_combo_scope.py` e testes frontend de combo/preview: P4A, scope 63, identidades distintas 57/58/81 e clínica autenticada.
- Testes Actions/API/Shell/TableScroll e Genéricos preservam Plano A, Plan B e fluxos já homologados.

Testes mutáveis usam mocks/ORM doubles, sem importar bootstrap nem acessar banco produtivo. O fechamento anterior não implementou símbolo obrigatório; a evolução R2 acima substitui esse adiamento exclusivamente no cadastro/alteração. Não retomar clínica 1/órfãos/FC4 nesta rodada. A retomada da revisão manual é fase posterior à homologação/gate Git/runtime.

## Recuperação histórica dedicada — ID4 / R3B

Exceção operacional explicitamente autorizada, não regra de cadastro, bootstrap ou
alinhamento padrão. O operador `recuperar_historico_procedimentos_clinica4.py`
aceita somente a ID4. Conteúdo de outra clínica não participa da construção nem
da decisão de reparo; snapshots externos são exclusivamente guards de exclusão.

- Criar uma tabela própria ativa, **Histórico recuperado**, com código público
  livre calculado no namespace da própria ID4 (max + 1; preflight atual: 5).
  O ID físico é gerado pelo PostgreSQL, não copiado/restaurado de outro tenant.
- Reparar apenas o `tabela_id` dos 56 procedimentos históricos quebrados;
  preservar seus IDs, códigos, nomes, campos locais, auditoria, status e todos
  os 1530 vínculos próprios de materiais, incluindo IDs/quantidades/metadados.
  Nenhuma fusão, exclusão, recodificação ou alteração das duas tabelas anteriores.
- Criar na própria ID4 `0207 — Sem classificação clínica histórica`, vazio de
  materiais/fases, e trocar somente os 443 vínculos provisórios ao Genérico
  `623 / 00200`. O Genérico 623 e os demais vínculos válidos permanecem intactos.
- A neutralidade permanente é protegida pelo CRUD (erro 400) e por três triggers
  revisados que recusam composição por INSERT/reapontamento UPDATE, alteração
  de identidade e DELETE do ID físico gerado. Código/nome iguais em outro tenant
  não recebem essa proteção. Os outros Genéricos continuam editáveis.
- O scoped guard revisa definições, corpos das funções, parâmetros, estado ativo
  e associação exatos dos triggers; não permite triggers desconhecidos/alterados.
  A alteração de schema revisada pertence semanticamente somente à ID4. Campos
  de negócio/auditoria continuam protegidos; somente `usuarios.last_seen_at`
  permanece excluído. Administração privilegiada capaz de remover triggers/DDL
  não é uma barreira coberta pelo CRUD; remoção/alteração exige revisão explícita.
- Listagem e detalhe/editor usam normalmente a nova tabela, sem efeito colateral
  de GET. Contextos clínicos continuam respeitando seleção de tabela e filtros
  existentes; a recuperação não injeta seleção automática nem retoma FC4.
- Produção exige snapshot/backup individual novo, checksums, restauração e
  rollback atômico provados em PostgreSQL descartável, suíte pertinente PASS e
  hashes do source iguais à prova. O manifesto permite somente dois INSERTs,
  as alterações de vínculo especificadas e cinco DDLs de proteção. Qualquer
  alteração adicional aborta; segunda passagem é exclusivamente leitura/zero DML.

Os nomes/códigos dessa estrutura histórica são decisões autorizadas de recuperação
da própria ID4, não evidência de uma tabela original de outra clínica. Não há
proteção especial nem default clínico global para `00200`, `0200` ou `0207`.

## Apresentação do seletor de tabelas — R5

O seletor ativo de Procedimentos, em `App.jsx` / `procedimentosTopBar`, exibe
somente `nome`, sem prefixo de código. `value` continua sendo `item.id` (código
público tenant-scoped já resolvido pela API), nunca o nome. Código, ID físico,
payload, filtros e persistência permanecem inalterados; nomes iguais não fundem
identidades. A regra vale para todas as clínicas, inclusive **Histórico
recuperado** da ID4. Esta alteração de apresentação aguarda homologação visual
manual e não autoriza alteração de dados, seeds ou limpeza técnica.
