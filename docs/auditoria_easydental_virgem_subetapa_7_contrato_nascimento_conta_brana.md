# Auditoria EasyDental virgem - Subetapa 7 - contrato futuro de nascimento de nova conta Brana

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 6 da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - usuarios, prestadores, permissoes e seeds iniciais".
- O objetivo agora e consolidar um contrato documental futuro para o nascimento de nova conta/clinica Brana.
- Esta etapa nao traz implementacao.
- A finalidade e orientar futuras alteracoes de criacao de conta, seeds e protecao de registros estruturais.

## 2. Principios do contrato
- Novas contas podem receber novas regras.
- Contas existentes nao devem ser migradas automaticamente.
- Dados estruturais devem ser separados de dados configuraveis.
- Registros proprios do sistema devem ser protegidos contra exclusao.
- Seeds com preco exigem cuidado.
- A tabela Brana deve valer apenas para novas contas.
- Contas legadas podem manter PARTICULAR.
- Alteracoes futuras devem ser feitas em subetapas pequenas e testaveis.
- Qualquer implementacao futura deve ter rollback documental e testes manuais.

## 3. Mapa do nascimento atual do Brana
- Criacao de conta/clinica: `backend/routes/auth_routes.py` -> `backend/services/signup_service.py` -> `criar_conta_saas(...)`.
- Usuario inicial/admin: `backend/services/signup_service.py`, com `codigo=1`, `tipo_usuario="Clínica"`, `is_admin=True`, `setup_completed=False` e permissoes sanitizadas.
- Prestador sistemico: `backend/services/signup_service.py`, por `_garantir_prestador_sistemico_clinica(...)`.
- Perfis/permissoes: `backend/seeds/access_profiles_default.py`, `backend/seeds/access_profiles_bootstrap.py`, `backend/security/permissions.py`, `backend/models/access_profile.py`, `backend/models/usuario_perfil_acesso.py`.
- Procedimentos: `backend/seeds/procedimentos_padrao.py`, `backend/seeds/procedimentos_brana.py`, `backend/seeds/procedimentos_genericos.py`, `backend/services/procedimentos_legado_service.py`.
- Materiais: `backend/seeds/procedimentos_brana.py`, `backend/seeds/procedimentos_genericos.py`, `backend/services/signup_service.py` e modelos/camadas relacionadas ao catalogo de materiais.
- Unidade/configuracao: `backend/models/clinica.py`, `backend/models/unidade_atendimento.py`, `backend/routes/unidades_atendimento_routes.py`, `backend/routes/preferences_routes.py`, `backend/routes/system_options_routes.py`.
- Simbolos/anamnese: `backend/services/simbolos_service.py` e rotas/modelos de anamnese e catalogos correlatos.
- Tabela privada: `backend/routes/procedimentos_routes.py` ainda mostra `PRIVATE_TABLE_NAME = "PARTICULAR"` como convivencia legada.

## 4. Referencia EasyDental
- `UNIDADE` com 1 registro estrutural.
- `SISTEMA` com 1 registro estrutural.
- `USUARIO` e `PRESTADOR` como entidades centrais do nascimento.
- `SIS_*` como perfis, modulos e funcoes de sistema.
- `USUARIO_*` como matriz de acesso.
- `TAB_*` como catalogo clinico, precificacao e apoio.
- `INTERVENCAO`, `DENTE`, `ARCADA`, `FACE` e `HISTORICO` como ecossistema odontologico.
- `CUSTOMPAGE`, `CUSTOMCONTROL` e `CONFIG_REPORT` como seeds de interface e relatorios.
- tabelas com prefixo `_` como lookups/auxiliares estruturais.

## 5. Contrato futuro - clinica/tenant
- Nova clinica Brana deve nascer com cadastro minimo da conta e com identificacao clara do tenant.
- Campos que hoje aparecem como obrigatorios no contrato atual incluem nome, email, tipo de conta, trial, flags de ativo e configuracoes iniciais.
- Ainda depende de decisao se a conta deve carregar uma configuracao global persistida equivalente ao `SISTEMA` do EasyDental.
- Nao nascer completa pode gerar menu vazio, configuracao inconsistente, seeds ausentes e protecao fraca de registros estruturais.

## 6. Contrato futuro - unidade inicial
- O contrato futuro deve decidir se uma unidade inicial e obrigatoria.
- Se existir, a unidade inicial deve ser protegida contra exclusao quando for a unica.
- A relacao esperada com o usuario admin e de vinculo funcional desde o nascimento.
- A relacao esperada com o prestador sistemico e de contexto operacional e de acesso.
- Pendencia principal: confirmar se a unidade inicial deve ser global por conta ou configuravel por etapa posterior.

## 7. Contrato futuro - usuario admin inicial
- O usuario admin inicial deve existir.
- Deve ter protecao contra exclusao total ou perda de acesso.
- Deve nascer com cobertura ampla de permissao.
- Deve estar ligado a clinica.
- A ligacao com unidade e prestador deve ser avaliada como parte do contrato final.
- O comportamento deve ser comparado com o usuario 1 admin-like do EasyDental.
- Testes futuros deverao confirmar login, menu, setup e cobertura de acesso.

## 8. Contrato futuro - prestador sistemico/reservado
- O prestador sistemico deve existir.
- Deve ser marcado como estrutural.
- Deve ter protecao contra exclusao indevida.
- `source_id=255` e `is_system_prestador=True` devem ser tratados como contrato atual observado.
- E preciso decidir se esse prestador aparece ou nao para o usuario final.
- E preciso decidir qual prestador pode ser excluido e qual nao pode.
- A relacao com o usuario admin e com permissao deve permanecer explicitamente documentada.

## 9. Contrato futuro - perfis, modulos e permissoes
- Perfis base devem nascer por nova conta.
- O admin inicial deve ter cobertura ampla.
- Menus vazios e bloqueios de acesso devem ser evitados.
- O modelo Brana precisa ser documentado em contraste com `SIS_*` do EasyDental.
- Permissoes globais, por perfil e por usuario devem ficar separadas conceitualmente.
- A matriz hibrida atual e um risco e deve ser tratada com contrato claro.

## 10. Contrato futuro - tabela privada de procedimentos
- Novas contas devem usar Brana como tabela privada padrao, se esta for a decisao consolidada.
- `PARTICULAR` deve permanecer para contas existentes.
- Nao deve haver renomeacao automatica de legado.
- Arquivos e rotinas que ainda expressem `PRIVATE_TABLE_NAME = "PARTICULAR"` precisam ser tratados como legado a ser isolado.
- Qualquer alteracao futura deve ser feita apenas para nova conta.
- Precos nao devem ser seedados indevidamente se essa nao for a regra final.

## 11. Contrato futuro - procedimentos e seeds odontologicos
- Os grupos de seeds que parecem obrigatorios incluem procedimentos canonicos, procedimentos genericos, simbolos graficos, odontograma, fases/status, especialidades, materiais, anamnese e tabelas clinicas auxiliares.
- A estrutura odontologica deve ser separada de dados comerciais e de preco.
- Seeds com dependencias de tabela de preco exigem cuidado.
- A existencia do ecossistema odontologico do EasyDental mostra que o Brana precisa decidir se deseja um arranque mais completo para novas contas.

## 12. Contrato futuro - materiais, custos e repasses
- O EasyDental possui tabelas e relacoes dedicadas a material, custo e repasse.
- O Brana possui estrutura relacionada, mas com modelagem diferente.
- Antes de seedar, e preciso decidir o que sera material estrutural e o que sera dado comercial.
- Valores, custos e repasses nao devem ser seedados de forma acidental.
- Este ponto pede contrato especifico antes de qualquer implementacao.

## 13. Contrato futuro - configuracoes globais, preferencias e sistema
- O Brana nao tem um `SISTEMA` literal confirmado como no legado.
- E preciso decidir se deve existir uma configuracao global persistida equivalente.
- A relacao atual com `preferences`, `system_options` e setup precisa ser considerada.
- Configuracao incompleta pode gerar instalacao incoerente, menus vazios ou defaults quebrados.

## 14. Contrato futuro - relatorios/interface/formularios
- O EasyDental possui `CONFIG_REPORT`, `CUSTOMPAGE` e `CUSTOMCONTROL`.
- O Brana pode ter estrutura diferente, mais distribuida em modelo de configuracao e preferencia.
- Antes de criar equivalencia literal, e preciso avaliar o que e estrutural e o que e apenas visual.
- Nao ha implementacao nesta etapa.

## 15. Contrato futuro - protecao contra exclusao
Registros/categorias candidatos a protecao:
- usuario admin inicial;
- prestador sistemico/reservado;
- unidade inicial unica, se adotada;
- perfis base;
- matriz de acesso;
- tabela privada padrao;
- seeds odontologicos estruturais;
- simbolos;
- especialidades;
- configuracoes globais;
- qualquer registro marcado como sistema.

## 16. Separacao obrigatoria - novas contas x contas existentes
- Toda nova regra deve valer primeiro para novas contas.
- Contas existentes nao devem ser alteradas automaticamente.
- `PARTICULAR` pode permanecer em contas existentes.
- Qualquer migracao futura deve ter contrato proprio.
- Nenhuma rotina deve "corrigir" o legado sem autorizacao.

## 17. Decisoes futuras pendentes
- Brana deve nascer sempre com unidade inicial?
- A unidade inicial pode ser excluida?
- O admin inicial pode ser excluido?
- O admin inicial deve estar vinculado a prestador?
- O prestador sistemico aparece na interface?
- Quais perfis sao obrigatorios?
- A tabela Brana tera preco zero, sem preco ou preco padrao?
- Materiais nascem preenchidos?
- Repasses nascem vazios ou com estrutura?
- Especialidades nascem preenchidas?
- Anamnese nasce preenchida?
- Odontograma/simbolos nascem globais ou por clinica?
- Quais registros sao globais do sistema e quais sao por clinica?

## 18. Ordem recomendada para implementacao futura
- Contrato final de nova conta.
- Teste de criacao de conta atual como baseline.
- Ajuste isolado de tabela Brana apenas para novas contas.
- Protecao de prestador sistemico.
- Unidade inicial.
- Permissoes admin.
- Seeds odontologicos.
- Testes manuais.
- Documentacao e roadmap.

## 19. Testes futuros obrigatorios
- Criar nova conta.
- Login admin inicial.
- Setup inicial.
- Abrir agenda.
- Abrir procedimentos.
- Abrir prestadores.
- Tentar excluir prestador sistemico.
- Criar prestador comum.
- Excluir prestador comum.
- Verificar tabela Brana.
- Verificar que conta antiga mantem PARTICULAR.
- Verificar permissoes/menus.
- Verificar unidade inicial.

## 20. Fora de escopo
- Implementacao.
- Alteracao de codigo.
- Alteracao de seed.
- Migracao de contas existentes.
- Alteracao do EasyDental.
- Correcao textual/mojibake.

## 21. Conclusao
- Este contrato documental consolida o que deve ser discutido antes de qualquer implementacao futura para nascimento de nova conta Brana.
- A proxima etapa deve continuar sendo incremental e preferencialmente focada em documentacao e baseline de nova conta, sem alterar contas existentes.

## 22. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8 - plano incremental de implementacao futura para nascimento de nova conta Brana, sem alterar codigo`

## 23. Plano de verificacao
- Confirmar que somente o documento novo e o roadmap foram alterados.
- Confirmar que nenhum codigo foi alterado.
- Confirmar que `frontend/app.js` nao foi alterado.
- Confirmar que `frontend/index.html` nao foi alterado.
- Confirmar que `frontend/js/modules` nao foi alterado.
- Confirmar que `backend` nao foi alterado.
- Confirmar que `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Confirmar que nenhum arquivo do EasyDental foi alterado.
- Confirmar que nenhum script SQL foi executado.
- Confirmar que a blindagem textual/mojibake foi respeitada.
