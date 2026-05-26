# Auditoria EasyDental virgem - Subetapa 8 - contrato atualizado de novas contas Brana

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 7 da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - atualizacao do contrato de nascimento de novas contas Brana".
- O objetivo agora e atualizar o contrato de nascimento de novas contas SaaS Brana.
- O EasyDental continua sendo a referencia estrutural para seeds, tabelas de nascimento e registros proprios do sistema, sem virar copia cega.
- O Brana mantem particularidades proprias, como SaaS, assinatura digital, fluxos proprios e seeds ja implementados.
- Nao ha implementacao nesta etapa.

## 2. Premissa central atualizada
- Novas contas Brana devem nascer prontas e abertas, sem depender da tela de setup para criar a estrutura minima obrigatoria.
- A tela de setup passa a ser candidata a dispensa, substituicao ou reducao futura.
- A remocao ou alteracao da tela de setup nao sera feita nesta etapa.
- O usuario podera configurar depois o que for configuravel.
- Registros estruturais devem nascer automaticamente.
- Contas existentes nao devem ser alteradas automaticamente.

## 3. Principios do contrato atualizado
- Novas contas seguem contrato novo.
- Contas existentes preservam contrato legado.
- PARTICULAR permanece em contas antigas.
- Brana e a tabela privada padrao de novas contas.
- Seeds estruturais devem nascer automaticamente.
- Dados comerciais e precos exigem cuidado.
- Registros proprios do sistema devem ser protegidos.
- O que for configuravel pode ser editado depois pelo usuario.
- O que for estrutural nao deve ser excluido.
- O Brana nao deve copiar o EasyDental cegamente, mas deve incorporar o que melhora a estrutura de nascimento.
- Funcionalidades proprias do Brana, como assinatura digital, devem ser preservadas.

## 4. Contrato atualizado - fluxo esperado de nascimento de nova conta
1. Usuario cria conta SaaS.
2. Clinica/tenant e criada.
3. Estrutura base e criada automaticamente.
4. Usuario admin inicial nasce.
5. Prestador sistemico/reservado nasce.
6. Unidade inicial ou estrutura equivalente nasce, se o contrato aprovar.
7. Perfis/permissoes nascem completos para o admin.
8. Tabela privada Brana nasce.
9. Seeds odontologicos nascem.
10. Sistema ja abre pronto para uso.
11. Usuario configura depois dados editaveis.
12. Tela de setup nao deve ser obrigatoria para completar estrutura minima.

## 5. Contrato atualizado - clinica/tenant
- A nova clinica Brana deve nascer com o cadastro minimo da conta e com identificacao clara do tenant.
- Campos minimos esperados incluem nome, email, tipo de conta, trial e flags basicas de ativo/configuracao.
- A clinica deve se relacionar com o usuario admin inicial desde o nascimento.
- A clinica deve preservar recursos proprios do Brana, incluindo assinatura digital.
- O que for estrutural deve ser automatico; o que for configuravel deve permanecer editavel pelo usuario.

## 6. Contrato atualizado - unidade inicial
- A nova conta deve nascer com unidade inicial ou estrutura equivalente, se o contrato final aprovar.
- O nome esperado pode ser o padrao do tenant, mas ainda depende de validacao futura.
- Se for a unica unidade, deve ser protegida contra exclusao.
- A unidade deve se relacionar com usuario admin e, se adotado, com o prestador sistemico.
- A unidade e a referencia estrutural do EasyDental que mais merece equivalencia contratual no nascimento.
- Pendencias antes de implementar permanecem abertas.

## 7. Contrato atualizado - usuario admin inicial
- O usuario admin inicial deve nascer automaticamente.
- O nome esperado e o contrato atual observado para o usuario estrutural/admin-like, mas isso pode ser refinado depois.
- O codigo esperado segue a regra atual observada no Brana.
- As permissoes esperadas devem ser amplas o bastante para nao bloquear a conta recem-criada.
- O usuario deve ficar ligado a clinica e, se o contrato decidir, tambem a unidade e prestador.
- Deve haver protecao contra exclusao total ou perda de acesso.
- A comparacao com o usuario estrutural/admin-like do EasyDental deve continuar sendo o norte de validacao.

## 8. Contrato atualizado - prestador sistemico/reservado
- O prestador sistemico/reservado deve nascer automaticamente.
- O nome esperado deve seguir o contrato atual observado no Brana, com possibilidade de ajuste posterior.
- O codigo esperado segue a regra observada no fluxo atual.
- `source_id=255` deve ser tratado como contrato observado.
- `is_system_prestador=True` deve ser tratado como contrato observado.
- `executa_procedimento=True`, se mantido, e parte do contrato atual observado.
- `inativo=False`, se mantido, e parte do contrato atual observado.
- Se ele aparece ou nao para o usuario final continua sendo decisao pendente, salvo definicao posterior.
- O prestador sistemico nao deve ser excluivel por engano.
- A comparacao com os registros estruturais do EasyDental, inclusive os identificados pelo usuario como Mestre e Clinica, deve continuar pendente de mapeamento preciso.

## 9. Contrato atualizado - registros Mestre e Clinica
- O usuario identificou registros chamados Mestre e Clinica como centrais no EasyDental.
- Um deles parece nao poder ser alterado.
- O outro parece permitir alteracao parcial.
- Esses registros precisam ser mapeados precisamente em subetapa futura.
- A equivalencia provavel no Brana envolve usuario admin/sistemico, prestador sistemico/reservado, clinica/tenant e possivel unidade estrutural.
- Nao se deve assumir conclusao sem validacao adicional.
- O contrato Brana deve possuir equivalentes protegidos desses papeis, mesmo com nomes e modelo proprios.

## 10. Contrato atualizado - perfis/permissoes
- Perfis base devem nascer.
- O admin deve nascer com cobertura completa.
- Menus principais devem abrir sem setup.
- Permissoes devem evitar conta recem-criada bloqueada.
- O modelo proprio do Brana deve ser preservado, sem obrigacao de copiar `SIS_*` literalmente se nao for necessario.
- O que for estrutural e protegido deve ser explicitamente documentado.

## 11. Contrato atualizado - tabela privada Brana
- Toda nova conta deve nascer com tabela privada chamada Brana.
- `PARTICULAR` deve permanecer apenas em contas existentes e legadas.
- Nao deve haver migracao automatica de contas antigas.
- Qualquer `PRIVATE_TABLE_NAME = "PARTICULAR"` deve ser tratado como contrato tecnico legado.
- A tabela Brana deve nascer com procedimentos obrigatorios conforme o contrato.
- A decisao final sobre preco e parte deste contrato e pode ser preco zero, sem preco ou outro arranjo, desde que documentado antes de implementar.
- Qualquer mudanca deve ser testada somente em nova conta.

## 12. Contrato atualizado - procedimentos e tabelas odontologicas
- Novas contas devem nascer com estrutura equivalente aos seeds odontologicos do EasyDental, respeitando o modelo Brana.
- Grupos obrigatorios ou de alta prioridade:
  - procedimentos canonicos;
  - procedimentos genericos;
  - tabela de CID;
  - especialidades;
  - fases de procedimento;
  - status de intervencao;
  - simbolos odontologicos;
  - simbolos/anomalias;
  - odontograma/dente/face/arcada, se houver equivalencia no Brana;
  - anamnese/questionarios/perguntas;
  - formularios clinicos;
  - materiais;
  - repasses, se decidido como estrutural;
  - TISS/regioes/tipo de tabela, se aplicavel.
- Cada grupo deve ser classificado futuramente como obrigatorio, opcional, pendente de decisao, nao copiar literalmente, ja existe no Brana, ou falta no Brana.

## 13. Contrato atualizado - materiais, custos, precos e repasses
- O EasyDental tem malha propria de materiais, custos e repasses.
- O Brana deve decidir o que nasce preenchido.
- Preco comercial nao deve ser seedado indevidamente.
- Catalogo estrutural deve ser separado de valor comercial.
- Pendencias devem continuar documentadas antes de qualquer implementacao.

## 14. Contrato atualizado - CID e tabela generica
- `CID_ITEM` no EasyDental nasce populado.
- A tabela generica de procedimentos existe no EasyDental como estrutura relevante.
- O Brana deve nascer com equivalente de CID e tabela generica, se ja existir estrutura ou se for criada futuramente.
- Onde ja existir equivalente no Brana, isso deve ser documentado no contrato tecnico futuro.
- As lacunas permanecem registradas para fechamento posterior.

## 15. Contrato atualizado - anamnese, formularios e interface clinica
- O EasyDental possui `ANAMNESE_QUEST`, `ANAMNESE_PERG`, `ANAMNESE_RESP`, `CUSTOMPAGE`, `CUSTOMCONTROL`.
- O Brana deve preservar seu modelo proprio.
- Se houver seeds equivalentes, novas contas devem nascer com eles.
- Se nao houver, a lacuna deve ser documentada para contrato tecnico futuro.
- O setup nao deve ser necessario para criar esses seeds minimos.

## 16. Contrato atualizado - assinatura digital e recursos proprios do Brana
- Assinatura digital e recurso proprio do Brana e nao existe no EasyDental.
- Esse recurso deve ser preservado.
- O novo contrato de nascimento nao deve remover, simplificar ou bloquear assinatura digital.
- Novas contas devem continuar compativeis com os recursos proprios do Brana.

## 17. Contrato atualizado - tela de setup
- A regra desejada pelo usuario e que a tela de setup tende a ser desnecessaria para novas contas.
- O sistema deve nascer aberto e pronto.
- O setup nao deve ser responsavel por criar a estrutura minima.
- Futuramente, a tela de setup pode ser removida, dispensada, reduzida ou transformada em tela opcional de preferencias.
- Nada disso sera implementado nesta etapa.
- Antes de remover ou reduzir setup, e necessario baseline e teste de criacao de conta atual.
- Os riscos de remover setup sem analise devem continuar documentados.

## 18. Contrato atualizado - protecao contra exclusao
Registros candidatos a protecao:
- usuario admin inicial;
- prestador sistemico/reservado;
- unidade inicial unica, se adotada;
- tabela privada Brana;
- perfis base;
- matriz de permissoes;
- procedimentos/seeds estruturais;
- CID;
- tabela generica;
- especialidades;
- simbolos;
- anamnese base;
- configuracoes globais;
- registros equivalentes a Mestre/Clinica.

## 19. Relatorio - como sera o nascimento de uma nova conta

| Etapa do nascimento | O que nasce | Nome esperado | Origem/referencia | Tabela/modelo provavel no Brana | Editavel pelo usuario? | Excluivel? | Protegido? | Observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinica/tenant | Conta SaaS e estrutura basica | Nome da clinica/tenant | Signup atual + contrato EasyDental | `Clinica` | Parcial | Nao | Sim | Base da nova conta |
| Usuario admin inicial | Admin funcional da nova conta | Usuario inicial/admin | Brana atual + usuario 1 do EasyDental | `Usuario` | Parcial | Nao | Sim | Acesso amplo e sem bloqueio |
| Prestador sistemico | Prestador base reservado | Prestador sistemico | Brana atual + registros estruturais do EasyDental | `PrestadorOdonto` | Parcial | Nao | Sim | Protegido contra exclusao indevida |
| Unidade inicial | Unidade/estrutura equivalente | Unidade inicial | EasyDental `UNIDADE` | `UnidadeAtendimento` ou equivalente | Parcial | Nao se unica | Sim | Se o contrato aprovar |
| Perfis base | Perfis funcionais da conta | Perfis base | EasyDental `SIS_PERFIL` | `AccessProfile` | Sim | Nao | Sim | Deve nascer pronto |
| Permissoes admin | Cobertura ampla de acesso | Permissao ampla | EasyDental `USUARIO_*` + Brana atual | `permissoes_json` + vinculos | Parcial | Nao | Sim | Sem menu vazio |
| Tabela Brana | Tabela privada padrao | Brana | EasyDental `PARTICULAR`/`TAB_PRC` | `procedimento_tabela` | Sim | Nao em legado | Sim | Apenas novas contas |
| Procedimentos canonicos | Catalogo principal | Procedimentos canonicos | EasyDental `INTERVENCAO`/`TAB_PRC_ITEM` | `Procedimento` | Sim | Nao | Sim | Seed estrutural |
| Procedimentos genericos | Catalogo base | Procedimentos genericos | EasyDental `TAB_GEN_ITEM` | `ProcedimentoGenerico` | Sim | Nao | Sim | Seed estrutural |
| CID | Tabela de CID | CID | EasyDental `CID_ITEM` | `CidItem` | Sim | Nao | Sim | Seed clinico |
| Especialidades | Taxonomia clinica | Especialidades | EasyDental `_ESPECIALIDADE` | `ItemAuxiliar`/equivalente | Sim | Nao | Sim | Seed estrutural |
| Fases/status | Fluxo clinico | Fases/status | EasyDental `_FASE_PROCEDIMENTO` e `_STATUS_INTERV` | Catalogos auxiliares | Sim | Nao | Sim | Relevante para fluxo |
| Simbolos odontologicos | Catalogo grafico | Simbolos | EasyDental `_SIMBOLO_ODONTO` e `_SIMBOLO_ANOMALIA` | Catalogo de simbolos | Sim | Nao | Sim | Seed odontologico |
| Odontograma | Estrutura clinica | Dente/face/arcada | EasyDental `DENTE`/`ARCADA`/`FACE` | Modelo odontografico | Parcial | Nao | Sim | Se houver equivalencia |
| Anamnese | Questionarios e respostas | Anamnese | EasyDental `ANAMNESE_*` | Formulario/anamnese | Sim | Nao | Sim | Deve nascer preenchido se estruturante |
| Materiais | Catalogo de material | Materiais | EasyDental `TAB_MAT`/`TAB_MAT_ITEM` | Catalogo material | Sim | Depende | Parcial | Cuidado com preco/custo |
| Repasses | Regras de repasse | Repasses | EasyDental `TAB_REPASSE` | Regra de repasse | Sim | Depende | Parcial | Se for estrutural, precisa seed |
| Assinatura digital | Recurso proprio do Brana | Assinatura digital | Brana proprio | Recursos digitais proprios | Sim | Nao | Sim | Nao existe no EasyDental |
| Setup | Tela de setup | Setup opcional/reduzido | Brana atual | Fluxo de setup | Nao para estrutural | Nao | Nao | Nao deve criar estrutura minima |

## 20. Lacunas a resolver antes do teste
- Confirmar Mestre e Clinica no banco EasyDental com IDs, tabelas e regras.
- Confirmar equivalencia exata no Brana.
- Confirmar se unidade inicial sera obrigatoria.
- Decidir preco na tabela Brana.
- Decidir materiais e repasses.
- Decidir destino da tela de setup.
- Confirmar quais seeds Brana ja existem e quais faltam.
- Confirmar quais registros devem ser protegidos no backend.

## 21. Fora de escopo
- Implementacao.
- Alteracao de codigo.
- Alteracao de seed.
- Migracao de contas existentes.
- Alteracao do EasyDental.
- Correcao textual/mojibake.

## 22. Conclusao
- O contrato de nascimento de novas contas Brana foi atualizado para refletir a decisao atual do usuario: nova conta deve nascer pronta, com estrutura minima automaticamente criada.
- A tela de setup passa a ser candidata a dispensa ou reducao futura, mas nao sera alterada nesta etapa.
- O proximo passo deve continuar sendo documental e preparatorio, com foco em validar Mestre/Clinica e fechar o contrato tecnico antes de qualquer implementacao.

## 23. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8A - validacao documental dos registros Mestre e Clinica e fechamento do contrato de nova conta, sem implementacao`

## 24. Plano de verificacao
- Confirmar que somente o documento novo e o roadmap foram alterados.
- Confirmar que nenhum codigo foi alterado.
- Confirmar que `frontend/app.js` nao foi alterado.
- Confirmar que `frontend/index.html` nao foi alterado.
- Confirmar que `frontend/js/modules` nao foi alterado.
- Confirmar que `backend` nao foi alterado.
- Confirmar que `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Confirmar que nenhum arquivo do EasyDental foi alterado.
- Confirmar que nenhum script SQL foi executado.
- Confirmar que nenhuma conta foi criada.
- Confirmar que nenhuma conta existente foi alterada.
- Confirmar que a tela de setup nao foi alterada.
- Confirmar que a blindagem textual/mojibake foi respeitada.
