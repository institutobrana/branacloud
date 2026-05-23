# Intervenções / Procedimentos / Seeds — Subetapa 3G — Contrato do seed canonico da Brana

## 1. Objetivo
Consolidar documentalmente a regra segura para o seed de novas contas/clinicas no modulo Intervencoes / Procedimentos, formalizando a Brana como seed canonico proprio, sanitizado e independente de dependencia runtime da clinica 1/tabela 18.

## 2. Contexto
A Subetapa 3E diagnosticou a nova conta com `Tabela exemplo = 681` e `Brana = 0`, sem mistura entre clinicas e sem duplicidade real por chave unica. A Subetapa 3F corrigiu o roteamento da Brana, mas a fonte usada em runtime ainda veio de fallback no banco. Esta subetapa nao altera codigo; ela registra o contrato seguro antes de uma futura geracao canonica do seed.

## 3. Escopo
Esta etapa cobre somente:
- seeds de novas contas;
- Procedimentos / Intervencoes;
- Material, Procedimento Generico e seus vinculos;
- Tabela exemplo e Brana;
- blindagem textual/mojibake;
- integracao entre os modulos afetados.

## 4. Fora de escopo
Ficam fora desta etapa:
- alterar banco;
- criar conta;
- executar signup;
- limpar clinica;
- limpar `email_codes`;
- corrigir mojibake;
- alterar login, senha interna ou perfis;
- alterar frontend;
- alterar rotas ou endpoints;
- mexer em contas existentes;
- renomear `PARTICULAR` retroativamente;
- gerar seed canonico agora;
- organizar Git.

## 5. Documentos consultados
Contratos e indices:
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Seeds e novas contas:
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`

Intervencoes / Procedimentos / Brana:
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md`

Materiais / Genéricos / vínculos:
- `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `docs/refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `docs/refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `docs/refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `docs/materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `docs/retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `docs/auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `docs/auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `docs/auditoria_ampla_generico_selecione_materiais_residuais.md`
- `docs/decisao_tecnica_saneamento_vinculos_legados_materiais.md`
- `docs/fechamento_modularizacao_segura_parcial_materiais.md`

## 6. Classificacao dos documentos encontrados
Fontes fortes para contrato:
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`

Fontes fortes para trilha Brana/Procedimentos:
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md`

Fontes de apoio:
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `docs/auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `docs/auditoria_ampla_generico_selecione_materiais_residuais.md`
- `docs/decisao_tecnica_saneamento_vinculos_legados_materiais.md`
- `docs/fechamento_modularizacao_segura_parcial_materiais.md`

## 7. Regra vigente de seeds mínimos
Novos procedimentos e entidades de nascimento devem nascer com o minimo funcional, preservando apenas:
- `codigo`, se existir;
- `nome` ou `descricao`, conforme o tipo;
- `clinica_id`;
- `tabela_id` quando aplicavel;
- campos tecnicos obrigatorios do schema.

Nao devem nascer com dados sensiveis ou prontos como:
- preco;
- custo;
- custo de material;
- custo de laboratorio;
- lucro;
- margem;
- tempo;
- garantia;
- valor de repasse;
- observacoes;
- especialidade nao obrigatoria;
- simbolo grafico nao obrigatorio;
- `procedimento_generico_id`;
- materiais vinculados;
- fases;
- composicoes;
- heranca automatica pronta;
- vinculos legados materializados.

## 8. Adendo PARTICULAR -> Brana
Regra consolidada para novas contas:
- contratos antigos podem continuar mencionando `PARTICULAR`;
- `Brana` substitui `PARTICULAR` apenas no nascimento de novas contas;
- contas existentes podem manter `PARTICULAR` sem renomeacao retroativa;
- o nome interno legada de rotinas antigas pode permanecer, se isso reduzir risco;
- a identidade funcional visivel para novas contas deve ser `Brana`.

## 9. Contrato da Brana 336
A Brana deve existir como seed canonico proprio, com:
- `336` procedimentos;
- fonte auditada conhecida;
- versionamento dentro do projeto;
- uso no nascimento de novas contas/clinicas;
- independencia de dependencia runtime da clinica 1/tabela 18.

## 10. Campos permitidos
Para a Brana, no nascimento de novas contas, o contrato permite somente:
- `codigo`;
- `nome`;
- `clinica_id`;
- `tabela_id`;
- campos tecnicos obrigatorios do schema;
- eventualmente campos tecnicos neutros estritamente exigidos pela persistencia.

## 11. Campos proibidos
A Brana nao deve nascer com:
- materiais vinculados;
- `procedimento_generico_id`;
- fases;
- composicoes;
- preco;
- custo;
- custo_lab;
- tempo;
- garantia;
- repasse;
- observacoes;
- heranca pronta;
- qualquer campo financeiro nao obrigatorio.

## 12. Regra de vinculos, fases e composicoes vazias
No nascimento de novas contas:
- `procedimento_material` deve nascer vazio;
- `procedimento_fase` deve nascer vazio;
- `procedimento_generico_material` deve nascer vazio;
- `procedimento_generico_fase` deve nascer vazio;
- tabelas equivalentes, se existirem, tambem devem nascer vazias.

Se alguma ligacao for obrigatoria por schema, isso deve ser tratado como excecao tecnica documentada, nunca como heranca silenciosa.

## 13. Regra sobre nao usar clinica 1/tabela 18 como dependencia runtime
A clinica 1/tabela 18 pode ser usada como referencia historica para auditoria e geracao do seed canonico, mas nao deve ser dependência de runtime para o nascimento de novas contas.

Isso significa:
- o signup nao deve depender de fallback permanente para a clinica 1/tabela 18;
- o seed de novas contas deve vir de artefato proprio do projeto;
- a nova conta nao deve mudar de comportamento conforme a existencia da clinica auditada.

## 14. Regra sobre poder usar clinica 1/tabela 18 apenas como fonte auditada
A clinica 1/tabela 18 pode servir apenas como:
- fonte auditada para reconstruir a lista de 336 procedimentos;
- referencia de comparacao documental;
- base para gerar um seed canonico versionado no projeto.

Ela nao deve ser usada como fonte de producao em tempo de signup.

## 15. Protecao contra materiais vinculados
O seed canonico da Brana nao deve carregar os 33 vinculos de materiais da fonte auditada. Esses vinculos nao devem nascer em novas contas.

Se houver necessidade futura de relacionar materiais, isso deve ser tratado em etapa separada, com contrato proprio.

## 16. Protecao contra `procedimento_generico_id`
A Brana nao deve nascer com `procedimento_generico_id` preenchido.

O `procedimento_generico_id` permanece relevante para Intervencoes / Procedimentos e para a regra de heranca em outros fluxos, mas nao faz parte do nascimento sanitizado da Brana.

## 17. Integracao com Materiais
A evolucao futura do seed da Brana nao pode quebrar:
- a origem dos materiais;
- o contrato de origem/herdado;
- a deduplicacao por `material_id`;
- a recomposicao ao trocar Procedimento Generico;
- os modulos de leitura e edicao do backend e do frontend.

O seed da Brana deve evitar contaminacao com materiais e nao deve tentar reproduzir a estrutura de vinculos herdados dos modulos de materiais.

## 18. Integracao com Procedimentos Genericos
A Brana nao deve herdar automaticamente genéricos, fases ou vinculos de genericos.

A regra de Procedimentos Genericos continua separada:
- procedimentos genericos podem ter materiais proprios;
- a composicao de materiais pertence ao contrato de materiais e intervencoes;
- a Brana nao deve carregar essa composicao no nascimento.

## 19. Integracao com Intervencoes / Procedimentos
A lista visual de Intervencoes / Procedimentos deve continuar funcional, mas a fonte da verdade do nascimento das novas contas passa a ser:
- seed canonico da Tabela exemplo;
- seed canonico da Brana.

A mudanca futura do seed nao pode:
- remover `origem`;
- remover `herdado`;
- voltar a depender apenas de heuristica visual;
- usar lista anterior como fonte da verdade;
- manter herdados antigos quando o generico mudar;
- misturar correcoes textuais com regra funcional.

## 20. Riscos de quebrar origem/herdado
O principal risco de uma futura mudanca no seed da Brana e contaminar a integracao com materiais e genericos ao:
- copiar campos demais;
- carregar materiais vinculados por engano;
- inferir heranca por heuristica incompleta;
- transformar dado auditado em dependencia runtime.

Por isso, o seed canonico da Brana deve permanecer sanitizado e sem dependencias de leitura indireta em runtime.

## 21. Blindagem textual/mojibake
Esta etapa respeita `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao ha autorizacao para:
- corrigir acentos;
- corrigir labels;
- corrigir strings visiveis;
- corrigir nomes de procedimentos;
- corrigir mojibake;
- corrigir UTF-8 quebrado.

Qualquer texto quebrado encontrado deve ser apenas registrado em etapa futura, sem alteracao nesta trilha.

## 22. Checklist futuro de teste
Quando o seed canonico da Brana for alterado futuramente, o teste minimo deve confirmar:

Seeds nova conta:
- criar nova conta sem erro 500;
- validar nascimento de `Tabela exemplo`;
- validar nascimento de `Brana`;
- validar ausencia de `PARTICULAR`;
- validar `Brana` com 336 procedimentos;
- validar `Brana` somente com codigo, nome e campos tecnicos obrigatorios;
- validar ausencia de preco, custo, tempo, garantia, repasse e observacoes;
- validar ausencia de `procedimento_generico_id`;
- validar ausencia de `procedimento_material`;
- validar ausencia de `procedimento_fase`;
- validar ausencia de vinculos/fases/composicoes automaticas.

Regressao entre modulos:
- abrir Materiais;
- abrir Procedimentos Genericos;
- abrir Intervencoes / Procedimentos;
- testar troca de Generico A para B;
- testar troca para Generico sem materiais;
- testar nao contaminacao entre Intervencoes;
- testar duplo clique e modal;
- testar console sem erro novo;
- repetir o checklist dos documentos de consolidacao manual, se aplicavel.

## 23. Proxima subetapa recomendada
Subetapa 3H — geracao controlada do seed canonico proprio da Brana no repositorio, a partir da fonte auditada, sem dependencia runtime da clinica 1/tabela 18.

## 24. Confirmacao final
Nada foi alterado alem deste documento nesta subetapa documental.
