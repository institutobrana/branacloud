# Auditoria EasyDental virgem - Subetapa 6 - comparacao inicial com seeds atuais do Brana Cloud

## 1. Contexto
- Referencia as Subetapas 0, 1, 2, 3, 4 e 5 desta frente documental.
- Esta etapa inicia a comparacao documental com o Brana Cloud.
- A base EasyDental continua sendo tratada como referencia da forma virgem do sistema, mesmo com muitas tabelas populadas e muitos registros.
- O objetivo desta etapa e preparar decisoes futuras sobre novas contas/clinicas, seeds, protecoes estruturais e contrato de nascimento da conta.
- A etapa e somente leitura e nao traz implementacao.

## 2. Seguranca e limites
- Nenhum codigo foi alterado.
- Nenhuma seed foi alterada.
- Nenhuma migration foi alterada.
- Nenhum banco foi alterado.
- Nenhum script SQL foi executado.
- Nenhum arquivo do EasyDental foi alterado.
- A blindagem textual/mojibake foi respeitada; strings estranhas ou legadas foram registradas apenas como achado tecnico.

## 3. Fontes Brana verificadas

| Fonte | Caminho | Finalidade aparente |
| --- | --- | --- |
| Roadmap consolidado | `docs/11_roadmap_desenvolvimento.md` | Estado atual das frentes, subetapas e proximo passo. |
| Visao de banco | `docs/05_banco_dados.md` | Mapa das tabelas, relacoes e regras de multi-tenant. |
| Visao de funcionalidades | `docs/04_funcionalidades.md` | Rotas, contratos e regras de negocio por modulo. |
| Mapa de codigo | `docs/03_mapa_codigo.md` | Onde cada responsabilidade vive no backend/frontend. |
| Validacao manual final do signup | `docs/validacao_manual_final_signup_brana_pos_correcoes.md` | Prova documental de que o signup passou e o seed canônico foi validado. |
| README do backend | `backend/README.md` | Contrato resumido de seeds de novas contas e regras de birth. |
| Criacao de conta | `backend/services/signup_service.py` | Bootstrap de clinica, usuario inicial, prestador sistemico, profiles e seeds. |
| Signup/API | `backend/routes/auth_routes.py` | Entrada do cadastro e do login. |
| Usuarios/admin | `backend/routes/user_admin_routes.py` | CRUD administrativo de usuarios, vinculos e permissoes. |
| Superadmin | `backend/routes/superadmin_routes.py` | Gestao de clinicas e usuarios da plataforma. |
| Procedimentos | `backend/routes/procedimentos_routes.py` | Contrato atual de tabela privada e comportamento legado. |
| Bootstrap global | `backend/services/runtime_bootstrap_service.py` | Jobs globais de seed/normalizacao. |
| Perfis base | `backend/seeds/access_profiles_default.py` | Lista versionada dos 10 perfis funcionais base. |
| Bootstrap de perfis | `backend/seeds/access_profiles_bootstrap.py` | Materializacao dos perfis base por clinica. |
| Schema de permissao | `backend/security/permissions.py` | Matriz de modulos, funcoes e perfis no Brana. |
| Conta sistemica | `backend/security/system_accounts.py` | Reservas de usuario e prestador sistemicos. |
| Indices financeiros | `backend/services/indices_service.py` | Seeds de indices padrao por clinica. |
| Simbolos | `backend/services/simbolos_service.py` | Seeds de simbolos graficos e catalogo oficial. |
| Tabela de procedimentos | `backend/seeds/procedimentos_padrao.py` | Garante `Tabela Exemplo` e a tabela privada `Brana`. |
| Seed canônico Brana | `backend/seeds/procedimentos_brana.py` | Lista canônica de 336 procedimentos da Brana. |
| Procedimentos genericos | `backend/seeds/procedimentos_genericos.py` | Catalogo generico odontologico base. |
| Legado PARTICULAR | `backend/services/procedimentos_legado_service.py` | Leitura da PARTICULAR/Easy e harmonizacao segura. |
| Compatibilidade schema | `backend/scripts/aplicar_compatibilidade_schema.py` | Normalizacao de nomes e seeds de compatibilidade. |
| Clinica/tenant | `backend/models/clinica.py` | Estrutura do tenant e defaults de nascimento. |
| Usuario | `backend/models/usuario.py` | Estrutura do usuario inicial/admin e vinculacoes. |
| Prestador | `backend/models/prestador_odonto.py` | Estrutura do prestador sistemico e das relacoes. |
| Perfil de acesso | `backend/models/access_profile.py` | Seed reservado por clinica. |
| Tabela de procedimentos | `backend/models/procedimento_tabela.py` | Tabela codificada por clinica. |
| Procedimento | `backend/models/procedimento.py` | Estrutura do catalogo de procedimentos. |

## 4. Onde o Brana cria nova conta/clinica
- O caminho confirmado no sweep atual e `backend/routes/auth_routes.py` -> `/signup/confirm` -> `criar_conta_saas(...)` em `backend/services/signup_service.py`.
- O fluxo cria `Clinica` com `tipo_conta="DEMO 7 dias"`, `trial_ate`, `ativo=True` e faz o bootstrap dos diretorios e seeds da clinica.
- Nao foi confirmado, nesta leitura, um endpoint separado de criacao direta de clinica fora do signup; o que foi encontrado em `superadmin_routes.py` foi listagem, status, plano, trial extra e exclusao de clinicas existentes.
- Conclusao documental: o nascimento da nova conta hoje passa pelo signup, nao por uma rotina separada de "criar clinica" equivalente ao contrato futuro que ainda precisaremos fechar.

## 5. Onde o Brana cria usuario inicial/admin
- Em `backend/services/signup_service.py`, `criar_conta_saas(...)` cria o usuario inicial com `codigo=1`, `tipo_usuario="Clínica"`, `is_admin=True`, `setup_completed=False`, `is_system_user=False` e permissao inicial vazia sanitizada.
- Esse usuario e o equivalente funcional mais proximo do usuario inicial/admin do EasyDental, embora a estrategia de permissao seja diferente.
- O mesmo fluxo cria antes um usuario sistemico reservado (`codigo=255`) e depois o usuario 1 da nova clinica.
- Em `backend/routes/auth_routes.py`, o cadastro Google reaproveita `criar_conta_saas(...)`, entao a mesma regra de nascimento vale para esse caminho.
- Em `backend/routes/superadmin_routes.py`, existe criacao de usuario para clinica existente, mas nao e o nascimento da clinica.
- Comparacao preliminar com o EasyDental: o comportamento admin-like do usuario 1 do Brana e coerente com o usuario 1 muito privilegiado observado na base virgem do EasyDental.

## 6. Onde o Brana cria prestador inicial
- Em `backend/services/signup_service.py`, `_garantir_prestador_sistemico_clinica(...)` cria ou garante o prestador sistemico da clinica com `source_id=255`, `codigo="001"`, `tipo_prestador="Clínica odontológica"`, `is_system_prestador=True`, `executa_procedimento=True` e `inativo=False`.
- Em `backend/services/signup_service.py`, `_garantir_usuario_sistemico_clinica(...)` vincula esse prestador ao usuario sistemico da clinica.
- Em `backend/security/system_accounts.py`, a protecao e reforcada por `is_system_prestador(...)`.
- Em `backend/routes/user_admin_routes.py`, a conta base de prestador e tratada como reservada e nao pode ser usada como prestador editavel normal.
- Comparacao preliminar com o EasyDental: o Brana tem um prestador estrutural reservado, mas o contrato de exclusao/imutabilidade ainda depende mais da logica de aplicacao do que de um modelo persistido explicitamente igual ao legado.

## 7. Onde o Brana cria permissoes/perfis
- O Brana usa uma abordagem hibrida.
- Em `backend/seeds/access_profiles_default.py` + `backend/seeds/access_profiles_bootstrap.py`, novas clinicas nascem com 10 perfis funcionais base, reservados e versionados.
- Em `backend/security/permissions.py`, a matriz de modulos, funcoes e perfis e definida por codigo, com schema de niveis de permissao e hints de funcoes.
- Em `backend/routes/user_admin_routes.py`, os usuarios recebem `permissoes_json`, e o sistema tambem trabalha com `usuario_perfil_acesso` para vinculos por perfil/prestador.
- Em `backend/services/access_profiles_service.py`, o sistema pode carregar perfis de uma fonte Easy legada e materializa-los em `access_profile`.
- Comparacao preliminar com o EasyDental: existe semelhanca conceitual com `SIS_PERFIL` + `USUARIO_PERFIL` + `USUARIO_MODULO` + `USUARIO_FUNCAO`, mas no Brana a estrutura nao esta modelada do mesmo jeito em tabelas persistidas identicas; parte da matriz esta no codigo e parte em `access_profile` / JSON / vinculos.

## 8. Onde o Brana cria unidade/configuracao inicial
- A criacao do tenant acontece em `backend/services/signup_service.py` via `Clinica(...)`.
- `backend/models/clinica.py` mostra que a clinica guarda `nome`, `email`, `tipo_conta`, `trial_ate`, `nome_tabela_procedimentos` e `opcoes_sistema_json`.
- `backend/routes/preferences_routes.py` e `backend/routes/system_options_routes.py` concentram as configuracoes padrao de odontograma, relatorios, ambiente, seguranca e preferencias por clinica.
- `backend/routes/unidades_atendimento_routes.py` provê CRUD de unidades de atendimento por clinica, e `backend/models/unidade_atendimento.py` define a entidade.
- Limite importante desta leitura: nao foi encontrado bootstrap automatico claro de uma `unidade` inicial unica equivalente ao registro estrutural `UNIDADE` do EasyDental.
- Comparacao preliminar com o EasyDental: o Brana tem clinica, preferencias e unidade como entidades, mas a unidade inicial nao aparece com a mesma centralidade estrutural observada no legado.

## 9. Onde o Brana cria procedimentos/tabelas clinicas
- O seed de nascimento passa por `backend/seeds/procedimentos_padrao.py`, `backend/services/signup_service.py`, `backend/seeds/procedimentos_genericos.py`, `backend/seeds/procedimentos_brana.py` e `backend/seeds/simbolos_graficos.py`.
- `backend/seeds/procedimentos_padrao.py` garante `Tabela Exemplo` como tabela 1 e garante a tabela privada `Brana` como codigo 4.
- `backend/services/signup_service.py` aplica `seed_simbolos_graficos(db, clinica.id)`, `seed_procedimentos_genericos(db, clinica.id)`, `seed_procedimentos(db, clinica.id)` e depois `garantir_procedimentos_padrao_clinica(db, clinica.id)`.
- O comentario do backend afirma que o seed canonico da Brana tem 336 itens sanitizados e sem dependencia runtime.
- `backend/routes/procedimentos_routes.py` ainda mantem `PRIVATE_TABLE_NAME = "PARTICULAR"`, o que mostra uma convivencia de nomes legados e novos contratos.
- `backend/services/procedimentos_legado_service.py` e `backend/scripts/migrar_particular_gleisson.py` deixam claro que a PARTICULAR do legado existe como fonte/migracao, mas a tabela privada da Brana nova deve ser tratada com cuidado.
- Comparacao preliminar com o EasyDental: o Brana ja possui catalogo tecnico de procedimentos, genericos, tabela base, simbolos e migracao segura; porem o nome da tabela privada ainda esta em transicao sem uma unica verdade textual em toda a base.

## 10. Tabela comparativa EasyDental x Brana

| Area | EasyDental virgem | Brana Cloud atual encontrado | Equivalente | Risco | Observacao |
| --- | --- | --- | --- | --- | --- |
| Unidade inicial | `UNIDADE` com 1 registro estrutural e relacao com usuario | `clinicas` + `unidade_atendimento`, mas sem seed automatico confirmado para uma unidade unica | parcial | nova conta pode nascer sem unidade estrutural clara | unidade existe como CRUD, nao como seed unico comprovado |
| Configuracao global | `SISTEMA` com 1 registro | `Clinica.opcoes_sistema_json`, `preferences_routes.py`, `system_options_routes.py` | parcial | configuracao global dispersa | nao foi encontrado um `SISTEMA` persistido equivalente |
| Usuario admin inicial | `USUARIO` 1 com comportamento admin-like | `codigo=1`, `is_admin=True`, `setup_completed=False` | sim | baixa, se o bootstrap falhar | o usuario inicial do signup e coerente com o legado |
| Prestador inicial | `PRESTADOR` estrutural no contexto da base | prestador sistemico reservado (`source_id=255`, `codigo="001"`) | parcial | exclusao indevida do prestador base | o contrato de reserva existe e deve ser protegido |
| Perfis | `SIS_PERFIL` com 10 perfis | `access_profile` com 10 perfis base reservados | sim/parcial | listas vazias quebram a UI de acesso | o numero bate, a modelagem muda |
| Modulos | `SIS_MODULO` com 52 modulos | `MODULE_PERMISSION_SCHEMA` em codigo; nao foi localizado um `SIS_MODULO` persistido equivalente | parcial | matriz fica menos auditavel no banco | controle atual e mais por schema de codigo |
| Funcoes | `SIS_FUNCAO` com 127 funcoes | `MODULE_FUNCTION_HINTS` em codigo; nao foi localizado um `SIS_FUNCAO` persistido equivalente | parcial | risco de permissao menos granular no banco | funcoes existem como contrato de codigo |
| Matriz de permissoes | `USUARIO_PERFIL`, `USUARIO_MODULO`, `USUARIO_FUNCAO` | `access_profile`, `usuario_perfil_acesso`, `permissoes_json` e schema de permissao | parcial | dupla verdade entre JSON, profiles e vinculos | precisa de contrato unico no futuro |
| Tabelas auxiliares / lookup | `_BANCO`, `_CIDADE`, `_ESTADO_CIVIL`, `_TIPO_*` etc. | `item_auxiliar`, `lista_material`, `indice_financeiro`, `tiss_tipo_tabela`, `convenio_odonto`, `plano_odonto` | parcial | alguns lookups viram regra de codigo | nao ha clone literal das tabelas `_` do legado |
| Tabela de procedimentos / preco | `TAB_PRC`, `TAB_PRC_ITEM`, `PARTICULAR`, `EASY - Particular`, outras tabelas | `procedimento_tabela`, `procedimento`, seed canônico de 336, `Tabela Exemplo`, `Brana`; `PARTICULAR` ainda aparece em rotas/scripts legados | sim/parcial | nome privado dividido entre legado e novo contrato | aqui esta a principal decisao futura |
| Materiais | `TAB_MAT`, `TAB_MAT_ITEM`, relacoes com procedimentos | `lista_material`, `material`, `procedimento_material` | parcial | estrutura e nomenclatura diferentes | o conceito existe, a modelagem e nova |
| Repasses | `TAB_REPASSE` | `prestador_comissao_odonto`, `prestador_credenciamento_odonto`, `valor_repasse` em `procedimento` | parcial | repasse pode ficar espalhado | nao ha tabela literal identica localizada |
| Especialidades | `PREST_ESP`, `_ESPECIALIDADE` | `ItemAuxiliar` tipo especialidade, hints de especialidade e seeds auxiliares | parcial | taxonomia pode divergir | existe o conceito, mas nao o mesmo desenho |
| Odontograma | `DENTE`, `ARCADA`, `FACE`, simbolos odontologicos | `simbolo_grafico_catalogo`, preferencias de odontograma, procedimentos e genericos | parcial | seeds odontologicos podem ficar incompletos | o Brana tem base, mas nao a mesma estrutura literal |
| Simbolos | `_SIMBOLO_ODONTO`, `_SIMBOLO_ANOMALIA` | `simbolo_grafico_catalogo` + `seed_simbolos_graficos` + snapshots legados | sim/parcial | risco baixo, mas depende de catalogo versionado | o seed e versionado e ja usado no signup |
| Anamnese | `ANAMNESE_*` | `anamnese_questionarios`, `anamnese_perguntas`, `anamnese_respostas` | sim | risco baixo | area bem alinhada conceitualmente |
| Relatorios / interface | `CONFIG_REPORT`, `CUSTOMPAGE`, `CUSTOMCONTROL` | `relatorio_config`, `modelo_documento`, `etiqueta_*`, preferencias de relatorio e interface | parcial | configuracao dispersa | falta um par literal de paginas/controles persistidos |
| Protecao contra exclusao estrutural | seeds e registros proprios que nao devem ser removidos | `is_system_user`, `is_system_prestador`, perfis reservados e scripts de exclusao segura | parcial | exclusao acidental ainda e um risco de contrato | a protecao existe, mas precisa de contrato mais claro |

## 11. Lacunas iniciais encontradas
- Nao foi localizado um `SISTEMA` persistido equivalente ao legado; a configuracao global do Brana esta mais distribuida.
- Nao foi localizado um seed automatico confirmado de uma `unidade` inicial unica equivalente ao registro estrutural do EasyDental.
- A equivalencia de `SIS_MODULO` e `SIS_FUNCAO` ainda e mais contratual/codigo do que persistida em tabelas com o mesmo nome.
- A modelagem de permissao combina `access_profile`, `usuario_perfil_acesso`, `permissoes_json` e schema de codigo, enquanto o EasyDental trabalha com uma matriz mais literal de tabelas.
- A tabela privada do procedimento ainda convive com `PARTICULAR` em partes do codigo, mesmo com o novo contrato `Brana` para novas contas.
- O conjunto de seeds odontologicos do Brana e forte, mas a protecao de registros estruturais ainda depende muito de rotina e contrato, nao apenas de banco.

## 12. Riscos atuais
- Criar novas contas sem uma unidade inicial claramente protegida.
- Permitir que o nome privado fique ambíguo entre `PARTICULAR` e `Brana`.
- Perder o usuario admin inicial ou o prestador sistemico por exclusao indevida.
- Separar permissao em tres fontes sem um contrato unico pode gerar divergencia entre JSON, access_profile e vinculos.
- Seedar procedimentos com preco ou com dependencia material/fase indevida pode contaminar novas contas.
- Levar seeds estruturais para contas existentes automaticamente pode alterar historico de forma nao desejada.

## 13. Decisoes futuras pendentes
- A nova conta Brana deve nascer com prestador estrutural fixo?
- Qual prestador pode ou nao ser excluido?
- O usuario admin inicial deve ficar vinculado a prestador e unidade de forma obrigatoria?
- Quais permissoes sao obrigatorias na nova conta?
- Quais seeds sao globais e quais sao por clinica?
- A tabela privada deve ser `Brana` apenas para novas contas e `PARTICULAR` so para legadas?
- Procedimentos devem nascer com preco ou sem preco?
- Quais seeds odontologicos precisam existir por contrato minimo?
- Quais registros devem ter protecao formal contra exclusao?
- Como evitar migracao automatica em contas existentes?

## 14. Recomendacoes preliminares sem implementacao
- Manter a separacao entre contrato de nascimento de nova conta e comportamento legado.
- Tratar `Brana` como tabela privada padrao para novas contas, sem auto-renomear contas antigas.
- Formalizar uma matriz "global x por clinica" para todos os seeds relevantes.
- Proteger explicitamente usuario sistemico, prestador sistemico e perfis reservados.
- Evitar qualquer migracao automatica em contas existentes sem contrato especifico.
- Separar o que e estrutura obrigatoria do que e dado configuravel pelo usuario.

## 15. Registros/arquivos que parecem estruturalmente protegiveis
- `clinicas`
- `usuarios`
- `prestador_odonto` com `is_system_prestador=True`
- `access_profile` com `reservado=True`
- `usuario_perfil_acesso`
- `procedimento_tabela` codigo 1 `Tabela Exemplo`
- `procedimento_tabela` codigo 4 `Brana`
- `procedimento_generico`
- `procedimento`
- `simbolo_grafico_catalogo`
- `relatorio_config`
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`
- `lista_material`
- `material`
- `indice_financeiro`
- `tiss_tipo_tabela`

## 16. Conclusao cautelosa
- O Brana ja possui um caminho claro para nova conta, com clinica, usuario inicial, prestador sistemico, perfis reservados e seeds odontologicos canônicos.
- O ponto mais sensivel da comparacao e a tabela privada de procedimentos: o legado usa `PARTICULAR`, enquanto o contrato novo do Brana empurra `Brana` para novas contas.
- A parte de permissao e mais contratual no Brana do que no EasyDental, entao nao e seguro assumir equivalencia literal entre tabelas.
- Ainda falta decidir como representar de forma final e unica a unidade inicial, a configuracao global e a protecao de registros estruturais.
- Esta subetapa ajuda a futura regra de nascimento porque separa claramente o que ja e seed de nascimento do que ainda precisa de contrato.

## 17. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 7 - contrato documental para regra futura de nascimento de nova conta Brana, sem implementacao`

## 18. Plano de testes/verificacao
- Confirmar que somente este documento novo e o roadmap foram alterados.
- Confirmar que nenhum codigo foi alterado.
- Confirmar que `frontend/app.js` nao foi alterado.
- Confirmar que `frontend/index.html` nao foi alterado.
- Confirmar que `frontend/js/modules` nao foi alterado.
- Confirmar que `backend` nao foi alterado.
- Confirmar que `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Confirmar que nenhum arquivo do EasyDental foi alterado.
- Confirmar que nenhum script SQL foi executado.
- Confirmar que a blindagem textual/mojibake foi respeitada.
