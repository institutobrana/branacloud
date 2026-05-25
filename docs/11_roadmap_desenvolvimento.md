# COMO USAR ESTE ARQUIVO

Este documento representa o estado atual de desenvolvimento do sistema.

Sempre que um mÃ³dulo for alterado:

* Atualizar as fases
* Atualizar o prÃ³ximo passo
* Atualizar observaÃ§Ãµes

Nenhuma funcionalidade Ã© considerada concluÃ­da sem atualizaÃ§Ã£o deste arquivo.

Este arquivo deve ser consultado antes de iniciar qualquer nova tarefa.

---
# 11 - Roadmap de Desenvolvimento

## Objetivo

Este documento registra o estado atual dos modulos do Brana Cloude com base no codigo existente em `backend/` e `frontend/`. Ele nao substitui o codigo como fonte da verdade; serve como mapa operacional para desenvolvedores e IAs entenderem o que ja existe, o que esta pendente e qual deve ser o proximo passo.

## Legenda

- `CONCLUIDO`: fluxo implementado e sem pendencia critica conhecida nesta auditoria.
- `EM DESENVOLVIMENTO`: existe implementacao funcional, mas ha pendencias de teste, modularizacao, migration, hardening ou acabamento.
- `NAO INICIADO`: nao foi encontrada implementacao suficiente no codigo atual.

Observacao: pela ausencia de migrations formais e testes automatizados amplos, a maioria dos modulos deve ser tratada como `EM DESENVOLVIMENTO`, mesmo quando ja possui backend e frontend operantes.

## Estado validado recente

- Login, senha interna e perfis: validado manualmente.
- Signup com Brana: validado manualmente.
- Brana nasce com seed canonico proprio de 336 procedimentos.
- Tabela exemplo permanece separada.
- PARTICULAR fica restrito a contas antigas.
- Exclusoes seguras das clinicas de teste 8, 9, 10 e 15 foram documentadas e executadas.
- Auditoria documental geral concluida.

## Proximas prioridades sugeridas

- Atualizar `README.md`, `README_WEB.md` e `backend/README.md` em trilha separada.
- Consolidar a documentacao por modulo sem misturar contratos vigentes com historico.
- Decidir o destino dos untracked antigos fora da trilha principal.
- Tratar mojibake/UTF-8 em trilha propria, sem misturar com correcoes funcionais.
- Retomar modularizacao/refatoracao somente depois da documentacao base estar consolidada.
- Revisar anamnese/SQLServer/restauracao em trilha separada.

## Regras de conducao

- Nao misturar correcao funcional com mojibake.
- Nao misturar documentacao historica com contratos vigentes.
- Nao mexer em seeds sem respeitar os contratos.
- Comandos Git destrutivos continuam proibidos sem autorizacao explicita.
- Commits devem continuar separados por trilha.

---

## Modulo: Autenticacao

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Login por email e senha implementado em `POST /login`.
[Ã¢Å“â€] Fase 2 - JWT implementado em `backend/security/jwt_handler.py` usando `JWT_SECRET_KEY` obrigatoria.
[Ã¢Å“â€] Fase 3 - Endpoint `/me`, logout, setup inicial e validacao de usuario atual implementados.
[Ã¢Å“â€] Fase 4 - Cadastro com codigo, recuperacao de senha e Google OAuth presentes em `auth_routes.py`.
[ ] Fase 5 - Criar testes automatizados para login, token expirado, usuario inativo, setup pendente e erro de credenciais.

Proximo passo:

* Criar testes de smoke para `POST /login` e `GET /me`, incluindo validacao de que `JWT_SECRET_KEY` vem somente do ambiente.

Observacoes:

* `backend/main.py` carrega `backend/.env` automaticamente.
* `POST /login` usa `OAuth2PasswordRequestForm`, portanto recebe `application/x-www-form-urlencoded`.
* O frontend salva o token em `localStorage` como `brana_token`.
* Nao existe fallback seguro para JWT; se `JWT_SECRET_KEY` faltar, o sistema deve falhar.
* Estado funcional validado manualmente: login com senha de login, senha interna separada e perfis ajustados.

---

## Modulo: Usuarios, Perfis e Permissoes

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - CRUD administrativo de usuarios presente em `backend/routes/user_admin_routes.py`.
[Ã¢Å“â€] Fase 2 - Controle de perfis e vinculos presente em `access_profile.py` e `usuario_perfil_acesso.py`.
[Ã¢Å“â€] Fase 3 - Matriz de permissoes por modulo implementada em `backend/security/permissions.py`.
[Ã¢Å“â€] Fase 4 - Modulos protegidos com senha administrativa/grant temporario implementados em `dependencies.py`.
[ ] Fase 5 - Testar todos os niveis de acesso: habilitado, protegido e desabilitado.

Proximo passo:

* Criar bateria de testes para usuario comum, admin de clinica, modulo protegido e usuario sem permissao.

Observacoes:

* Rotas usam `require_module_access("usuarios")`.
* O controle de usuarios pode exigir senha administrativa quando habilitado nas opcoes da clinica.
* Mudancas neste modulo podem bloquear acesso ao sistema inteiro.
* Estado funcional validado manualmente no ciclo recente de login, senha interna e perfis.

---

## Modulo: Pacientes

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelo `Paciente` implementado em `backend/models/paciente.py`.
[Ã¢Å“â€] Fase 2 - Rotas de pacientes implementadas em `backend/routes/cadastros_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend chama endpoints de pacientes em `frontend/app.js`.
[Ã¢Å“â€] Fase 4 - Filtros por `clinica_id` aparecem nas consultas principais.
[ ] Fase 5 - Criar testes de tenant para impedir acesso a paciente de outra clinica.

Proximo passo:

* Testar criar, buscar, navegar, editar e excluir paciente com usuarios de clinicas diferentes.

Observacoes:

* Endpoints principais ficam sob `/cadastros/pacientes`.
* Paciente e usado por agenda, anamnese, tratamentos, documentos e financeiro.
* Qualquer alteracao deve preservar `current_user.clinica_id` como fonte de tenant.

---

## Modulo: Cadastros Gerais

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Auxiliares, grupos, categorias e simbolos graficos existem em `cadastros_routes.py`.
[Ã¢Å“â€] Fase 2 - Unidades de atendimento existem em `unidades_atendimento_routes.py`.
[Ã¢Å“â€] Fase 3 - CID existe em `cid_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para cadastros e menus auxiliares.
[ ] Fase 5 - Separar `cadastros_routes.py` em arquivos menores por dominio.

Proximo passo:

* Mapear quais endpoints de `cadastros_routes.py` podem ser extraidos sem alterar comportamento.

Observacoes:

* `cadastros_routes.py` e grande e mistura varios dominios.
* Ha referencias historicas a fontes legadas em alguns pontos.
* Modulos usam permissoes como `procedimentos`, `financeiro` e `configuracao`.

---

## Modulo: Agenda

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Eventos e bloqueios de agenda existem em `agenda_legado.py`.
[Ã¢Å“â€] Fase 2 - Rotas principais implementadas em `agenda_legado_routes.py`.
[Ã¢Å“â€] Fase 3 - Contatos de agenda implementados em `agenda_contatos_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui tela e chamadas para agenda, repeticao, combos e filtros.
[Ã¢Å“â€] Fase 5 - Integracao Google Calendar presente em rotas e servicos.
[ ] Fase 6 - Criar testes de repeticao, horarios livres e tenant.

Proximo passo:

* Testar fluxo completo de agenda: criar evento, repetir, editar, excluir, buscar horarios livres e exportar para Google quando configurado.

Observacoes:

* Modulo protegido por permissao `agenda`.
* Usa `clinica_id`, paciente, prestador e unidade.
* Google Calendar depende de variaveis externas.
* Arquivo `agenda_legado_routes.py` e grande e sensivel.

---

## Modulo: Financeiro

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos financeiros existem em `backend/models/financeiro.py`.
[Ã¢Å“â€] Fase 2 - Lancamentos, categorias, formas de pagamento e situacoes existem em `financeiro_routes.py`.
[Ã¢Å“â€] Fase 3 - Relatorio de conta corrente e fluxo de caixa existem no backend e frontend.
[Ã¢Å“â€] Fase 4 - Indices financeiros e cotacoes existem em `indices_financeiros_routes.py`.
[Ã¢Å“â€] Fase 5 - Cenario financeiro existe em `cenario_routes.py`.
[ ] Fase 6 - Criar testes para exclusao/migracao de categorias em uso e relatorios.

Proximo passo:

* Validar lancamentos por clinica e criar testes para relatorios financeiros principais.

Observacoes:

* Modulo usa permissao `financeiro`.
* Dados financeiros sao sensiveis.
* Categorias em uso exigem cuidado antes de excluir.

---

## Modulo: Procedimentos e Tabelas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de procedimento, fases, materiais e tabelas existem.
[Ã¢Å“â€] Fase 2 - CRUD de tabelas e procedimentos existe em `procedimentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Procedimentos genericos existem em `cadastros_routes.py`.
[Ã¢Å“â€] Fase 4 - Dashboard e relatorio de tabela existem no backend/frontend.
[Ã¢Å“â€] Fase 5 - Vinculo de materiais a procedimentos existe.
[ ] Fase 6 - Criar testes complementares para materiais vinculados, filtros por clinica e modularizacao posterior.

Proximo passo:

* Concentrar a proxima evolucao em modularizacao/refatoracao e testes complementares de materiais/vinculos; o seed canonico Brana e o signup ja foram validados.

Observacoes:

* Modulo usa permissao `procedimentos`.
* Tem relacao com materiais, prestadores, tratamentos e agenda.
* `procedimentos_routes.py` e grande e deve ser refatorado com cuidado.
* Nova conta nasce com Brana de 336 procedimentos, Tabela exemplo separada e PARTICULAR restrito a contas antigas.

---

## Modulo: Tratamentos

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelo `Tratamento` existe em `backend/models/tratamento.py`.
[Ã¢Å“â€] Fase 2 - Rotas existem em `backend/routes/tratamentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Combos de novo tratamento existem no backend.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas vinculadas ao contexto de paciente/procedimentos.
[ ] Fase 5 - Testar ciclo completo de tratamento por paciente e isolamento por clinica.

Proximo passo:

* Validar criacao de tratamento a partir de paciente real e confirmar vinculos com cirurgioes/prestadores.

Observacoes:

* Modulo depende de paciente, procedimentos e usuarios/prestadores.
* Usa permissao `procedimentos`.
* Deve manter filtro por `clinica_id` em todos os acessos.

---

## Modulo: Prestadores

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de prestadores existem em `prestador.py` e `prestador_odonto.py`.
[Ã¢Å“â€] Fase 2 - Rotas de prestadores existem em `prestadores_routes.py`.
[Ã¢Å“â€] Fase 3 - Credenciamentos e comissoes existem no backend.
[Ã¢Å“â€] Fase 4 - Frontend possui tela/chamadas para prestadores.
[ ] Fase 5 - Testar credenciamentos, comissoes e vinculo com usuarios.

Proximo passo:

* Validar fluxo completo de prestador: criar, editar, vincular usuario, credenciamento e comissao.

Observacoes:

* Modulo usa permissao `prestadores`.
* Prestadores se conectam com agenda, procedimentos, convenios e usuarios.
* Existem arquivos frontend auxiliares `prestadores_*`.

---

## Modulo: Convenios, Planos e Faturamento

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `ConvenioOdonto`, `PlanoOdonto` e `CalendarioFaturamentoOdonto` existem.
[Ã¢Å“â€] Fase 2 - Rotas existem em `convenios_planos_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para convenios, planos e calendario.
[Ã¢Å“â€] Fase 4 - Combos sao usados por pacientes/prestadores/agenda.
[ ] Fase 5 - Testar exclusao segura e dependencias com prestadores/pacientes.

Proximo passo:

* Mapear dependencias antes de permitir exclusoes em cenarios reais.

Observacoes:

* Modulo usa permissao `configuracao`.
* Tem impacto em pacientes, prestadores, agenda e financeiro.

---

## Modulo: Materiais

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `ListaMaterial` e `Material` existem.
[Ã¢Å“â€] Fase 2 - Rotas CRUD existem em `materiais_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para listas, materiais e indices.
[Ã¢Å“â€] Fase 4 - Materiais vinculam com procedimentos.
[ ] Fase 5 - Testar vinculos antes de excluir materiais/listas.

Proximo passo:

* Criar validacao/teste para impedir quebra de procedimentos ao remover material em uso.

Observacoes:

* Modulo usa permissao `materiais`.
* Relaciona-se diretamente com procedimentos.

---

## Modulo: Medicamentos e Restricoes Terapeuticas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `Medicamento` e `RestricaoTerapeutica` existem.
[Ã¢Å“â€] Fase 2 - Rotas CRUD e opcoes existem em `medicamentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para medicamentos, grupos, apresentacoes e usos.
[Ã¢Å“â€] Fase 4 - Editor de textos consulta medicamentos para assistente de receitas.
[ ] Fase 5 - Testar integracao com receitas e filtros por clinica.

Proximo passo:

* Validar fluxo: cadastrar medicamento, listar no assistente de receitas e gerar documento.

Observacoes:

* Modulo usa permissao `anamnese` no router atual.
* Tem relacao com editor de textos e receitas.

---

## Modulo: Proteticos e Controle Protetico

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `Protetico`, `ServicoProtetico` e `ControleProtetico` existem.
[Ã¢Å“â€] Fase 2 - Rotas de proteticos existem em `proteticos_routes.py`.
[Ã¢Å“â€] Fase 3 - Rotas de controle existem em `controle_proteticos_routes.py`.
[Ã¢Å“â€] Fase 4 - Agenda contatos pode criar/usar proteticos.
[ ] Fase 5 - Testar ciclo completo com paciente, servico e controle.

Proximo passo:

* Validar cadastro de protetico, servicos e controle protetico por clinica.

Observacoes:

* Modulo usa permissao `procedimentos`.
* Relaciona protetico, paciente, cirurgiao e servico.

---

## Modulo: Anamnese

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Questionarios e perguntas existem em `anamnese.py`.
[Ã¢Å“â€] Fase 2 - Respostas existem em `anamnese_resposta.py`.
[Ã¢Å“â€] Fase 3 - Rotas CRUD e respostas por paciente existem em `anamnese_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para questionarios, perguntas e respostas.
[ ] Fase 5 - Testar renumeracao, resposta por paciente e tenant.

Proximo passo:

* Criar teste/manual checklist para questionario completo: criar, inserir perguntas, responder para paciente e editar resposta.

Observacoes:

* Modulo usa permissao `anamnese`.
* Paciente, questionario, pergunta e resposta devem pertencer a mesma clinica.

---

## Modulo: Editor de Textos, Modelos, PDF e Assinatura

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de documentos existem em `modelo_documento.py`.
[Ã¢Å“â€] Fase 2 - Rotas de editor/modelos/mesclagem existem em `editor_textos_routes.py`.
[Ã¢Å“â€] Fase 3 - Exportacao PDF existe em `editor_pdf_service.py`.
[Ã¢Å“â€] Fase 4 - Assinatura digital/local e preparacao para Acrobat existem.
[Ã¢Å“â€] Fase 5 - Assistentes de receita e atestado existem.
[ ] Fase 6 - Testar storage por clinica, PDF, assinatura e local bridge em ambiente limpo.

Proximo passo:

* Validar geracao de PDF e modelos por clinica sem gravar dados sensiveis no repositorio.

Observacoes:

* Modulo usa permissao `configuracao` no router atual.
* `storage/modelos/clinicas/` nao deve ser versionado.
* Arquivo `editor_textos_routes.py` e um dos mais sensiveis do backend.
* FASE 6 do editor: captura de Tab agora usa `editorTextosCalcularOffsetLinear` com `selection.focusNode/focusOffset` no `keydown`, antes de render/rebuild, e a reancoragem usa `posDepois.textOffset`.
* Logs de diagnostico adicionados/ajustados: `SELECTION RAW`, `OFFSET LINEAR CALCULADO` e `REANCORAGEM ALVO`.
* FASE 6.1: adicionada protecao curta de cursor durante Tab (`editorTextosProtegendoCursor`), bloqueando `editorTextosDocumentoModelAtualizar` ate o proximo frame apos a reancoragem para impedir rebuild assÃ­ncrono que recriava a selecao em offset `0`.
* FASE 6: `posDepois.cursorXPx`, `posDepois.indentXPx` e `posDepois.xPx` sao sincronizados com a indentacao do modelo, com log `CURSOR XPX SINCRONIZADO`, evitando `cursorXPx=0` quando `textOffset` ja esta correto.
* FASE 6: aplicacao visual do Tab corrigida em `editorTextosAplicarTabOperationsNoDOM`; o bloco recebe `paddingLeft` baseado no `tabStateKey` ativo e o log `TAB DOM TARGET` mostra alvo, estilo antes/depois e computed style.
* FASE 6: reforcada aplicacao CSS real do Tab com `padding-left` inline/important, `data-tab-indent-px`, log `TAB DOM STYLE CONFIRMADO` e reaplicacao apos render/update do modelo.
* FASE 6: Tab agora diferencia `paragraph-indent` e `inline-tab`; quando o cursor esta apos texto, renderiza marcador inline no ponto do cursor e evita recuar o paragrafo inteiro.
* FASE 6: marcador `inline-tab` reforcado com `data-et-tab-inline`, `data-et-tab-width`, logs `INLINE TAB INSERINDO`/`INLINE TAB DOM APOS INSERIR` e preservacao explicita no sanitizador HTML.
* FASE 6: `cursorXPx`/`modelCursorPx` de `inline-tab` passam a usar a soma `inlineTabPx` da `tabStateKey`, nao apenas a largura da ultima operacao.
* FASE 6 validada tecnicamente para Tab/Shift+Tab basico (`paragraph-indent`, `inline-tab`, preservacao de texto apos Tab e bloqueio do marcador legado); logs de diagnostico agora ficam atras da flag `EDITOR_TEXTOS_DEBUG`/`window.EDITOR_TEXTOS_DEBUG`/`brana_editor_textos_debug`. Proximo passo: validacao manual visual limpa antes da Fase 7.
* FASE 6.2 aberta: robustez do editor em conteudo rico/importado. O foco atual passa a ser estabilizar Tab/Shift+Tab em paragrafos com spans existentes, `&nbsp;`, campos `<<...>>`, imagens e marcadores legados, sem quebrar os casos simples ja aprovados.
* FASE 6.2: cleanup do render semantico foi restringido aos marcadores do motor novo (`data-et-tab-*`); spans ricos/importados e marcadores legados devem ser preservados e apenas registrados em debug quando encontrados.
* FASE 6.2: cada `inline-tab` passa a carregar `data-et-tab-offset-logico`, permitindo reinsercao no mesmo ponto logico mesmo com `\u200B`, `&nbsp;` e multiplos spans misturados no paragrafo.
* FASE 6.2: ferramenta basica de cor entrou como pendencia de formatacao. O objetivo imediato e aplicar cor em selecao sem perder `strong/em/span`, manter persistencia no HTML salvo e reabrir com a cor preservada.
* FASE 6.2: editor agora mostra mudanca visual de pagina em layout continuo. A paginacao foi implementada no frontend por quebras visuais calculadas entre blocos do `contenteditable`, com gap visivel entre paginas e preservacao do fluxo de edicao/cursor sem reescrever o editor.
* FASE 6.2: a visualizacao paginada usa a configuracao atual de papel/margens para estimar a altura util da pagina e inserir separadores visuais entre blocos quando o conteudo ultrapassa a pagina atual. Ainda e uma paginacao visual baseada no render do DOM, nao uma composicao tipografica perfeita.
* FASE 6.2: repaginacao visual estabilizada para navegacao. Setas, clique, `selectionchange`, `mouseup`, `keyup` e foco nao devem mais repaginar de forma destrutiva quando o conteudo nao mudou; a rotina agora usa assinatura do conteudo, short-circuit e tolerancia de alguns pixels para evitar oscillacao na quebra.
* FASE 6.2: refluxo bidirecional da paginacao visual refinado. Quando o conteudo cresce, blocos podem descer para a pagina seguinte; quando o conteudo diminui, os primeiros blocos da pagina seguinte devem voltar para a anterior se couberem. A distribuicao passou a ser recalculada por blocos paginaveis reais do DOM, e nao apenas por filhos diretos da raiz.
* FASE 6.2: direcao do reflow ajustada para remocao. Eventos de `Delete`/`Backspace` agora sinalizam explicitamente reflow para cima, com prioridade de refluxo e tolerancia de overflow mais favoravel para puxar conteudo da pagina seguinte quando ele voltar a caber.
* FASE 6.2: Fase 7 continua bloqueada ate que Tab em conteudo rico e cor basica estejam validados manualmente.
* FASE 6.2 continua em ajuste: conteudo rico/importado agora deve usar o modo conservador `TAB_RICH_SAFE`, inserindo apenas espaco visual seguro no ponto do cursor.
* FASE 6.2: o motor `inline-tab` model-first fica restrito a paragrafos simples; paragrafos com campos `<<...>>`, `&nbsp;`, spans legados, imagens, estilos/classes, elementos `contenteditable=false`, multiplos nodes significativos ou HTML complexo nao devem criar `span[data-et-tab-inline]` nem `\u200B` novo.
* FASE 6.2: `Shift+Tab` em conteudo rico so remove uma unidade segura inserida pelo `TAB_RICH_SAFE`; nao deve executar cleanup `INLINE TAB SHIFT CLEANUP`, remover spans, imagens ou campos.
* FASE 6.2: cor do texto continua pendente para validacao separada; esta correcao prioriza estabilidade de Tab/Shift+Tab em conteudo rico.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual real de Tab/Shift+Tab em texto simples, modelo rico com Whatsapp, campos e imagens/cabecalho.
* FASE 6.2 segue em estabilizacao: o `inline-tab` antigo com `span[data-et-tab-inline]` + `\u200B` foi desativado temporariamente para novas tabulacoes inline.
* FASE 6.2: Tab seguro passa a ser o padrao para qualquer Tab apos texto; o motor de recuo de paragrafo fica reservado para inicio absoluto de paragrafo/linha ou bloco vazio.
* FASE 6.2: marcadores proprios antigos (`span[data-et-tab-inline]`, `span[data-et-tab-pad]`, `editor-textos-sem-tab-pad`) devem ser convertidos de forma conservadora para espacos visuais seguros no carregamento/persistencia.
* FASE 6.2: cor de texto passa a ser correcao obrigatoria antes da Fase 7; a aplicacao deve preservar spans/strong/em e persistir `style="color: ..."`.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual completa de Tab seguro, Shift+Tab, modelos reais e cor de texto salva/reaberta.
* FASE 6.2: Tab SAFE esta praticamente estabilizado nos testes recentes; a prioridade ativa passou a ser a preservacao/restauracao da selecao real para cor de texto.
* FASE 6.2: cor de texto agora usa snapshot de selecao do editor antes do dropdown roubar foco; validacao recente indicou aplicacao correta e persistencia.
* FASE 6.2: Fase 7 continua bloqueada; a pendencia ativa agora e validar insercao de campo de mesclagem respeitando cursor/selecao reais.
* FASE 6.2: cor de texto passou nos testes recentes com snapshot/restauracao de selecao antes do dropdown roubar foco.
* FASE 6.2: pendencia ativa aberta para insercao de campo de mesclagem respeitar cursor/selecao reais; o fluxo deve usar snapshot especifico antes do modal/dropdown roubar foco e restaurar o Range antes de inserir `<<...>>`.
* FASE 6.2: Fase 7 continua bloqueada ate validar insercao de campo em documento simples, modelo `.MOD` real, proximo de campos existentes e proximo de texto colorido/formatado.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: regressao de abertura corrigida no projeto ativo `D:\BRANA ARQUIVOS\BRANA CLOUD`. O backend agora resolve modelos nesta ordem: caminho clinico registrado, busca recursiva em `storage/modelos/clinicas/{clinica_id}`, fallback base compativel e vazio apenas se nada existir.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: validacao da clinica `1` resultou em `126` modelos analisados, `110` resolvidos por fallback recursivo, `10` por fallback base e `6` sem arquivo util, todos auxiliares/nao textuais. Ver `docs/relatorio_modelos_clinica_1_mapeamento_arquivos.md`.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: o conteudo volta a abrir no navegador, mas a formatacao legada de `.rtf`/`.mod`/`.doc`/`.docx` ainda nao e preservada integralmente. Modelos importantes devem ser reformatados no editor novo ou passar por conversao futura.
* FASE 6.2: regressao da lista de campos de mesclagem diagnosticada; a rota `GET /editor-textos/campos` caia em `MERGE_FIELDS_LEGACY` porque `backend/data/editor_textos_mesclagem_snapshot.json` nao existia, reduzindo a lista para 9 campos.
* FASE 6.2: fonte completa restaurada a partir de `storage/modelos/clinicas/1/MergeList.tmp`; snapshot `backend/data/editor_textos_mesclagem_snapshot.json` criado com 107 campos e 9 grupos (`Atestado`, `Data`, `Clinica`, `Cirurgiao`, `Paciente`, `Contato`, `Receita`, `Recibo`, `Etiqueta`).
* FASE 6.2: `_load_merge_fields_payload()` agora prioriza `snapshot_json`, depois fallback direto para `merge_list_tmp` e somente por ultimo `legacy_fallback`; a rota validada usa `snapshot_json` e preserva o campo adicional de assinatura digital existente.
* FASE 6.2: Fase 7 continua bloqueada; esta restauracao nao iniciou Fase 7 e nao alterou Tab SAFE, cor do texto, insercao de campo, banco ou backend de modelos.
* FASE 6.2: persistencia de fonte e tamanho corrigida no editor. Fonte/tamanho deixam de usar `execCommand("fontName"/"fontSize")` como caminho principal e passam a envolver selecao real em `span style="font-family: ..."` e/ou `span style="font-size: ..."` com snapshot/restauracao de selecao.
* FASE 6.2: salvamento passa a detectar formatacao rica (`font-family`, `font-size`, `color`, negrito/italico/sublinhado etc.) e persistir HTML mesmo em texto branco `.txt`, evitando perda de estilos ao salvar/reabrir.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual real de fonte/tamanho em documento simples, modelo real e combinacao com cor.
* FASE 6.2: pendencia de fonte/tamanho isolada em selecao multi-bloco. O editor agora detecta selecoes atravessando multiplos paragrafos/blocos, divide a aplicacao por bloco e so declara sucesso quando ao menos um span real de fonte/tamanho e criado no DOM.
* FASE 6.2: dropdowns de fonte/tamanho passam a usar estado neutro em selecao multi-bloco com estilos mistos, evitando exibir valor unico enganoso.
* FASE 6.2: corrigida pendencia especifica de merge de estilos inline entre `font-family` e `font-size`; ao aplicar fonte ou tamanho, o editor preserva os estilos existentes relevantes (`color`, `font-family`, `font-size`) em selecoes simples e multi-bloco.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual de fonte/tamanho em selecao curta, multi-bloco, alternancia entre dropdowns e selecao envolvendo campos de mesclagem.
* FASE 6.2: modal de campos de mesclagem refinado com deduplicacao visual por alias historico (ex.: `Data.MêsExtenso` oculto em favor de `Data.MêsExt`), mantendo token principal de insercao e sem alterar a fonte primaria restaurada.
* FASE 6.2: coluna de descricao do modal passa a exibir rótulos amigaveis na categoria Data (`Ano atual`, `Data atual`, `Dia atual`, `Dia da semana`, `Mês atual`, `Mês por extenso`) e renderizacao visual da grade foi ajustada para melhorar leitura de Campo/Descricao.
* FASE 6.2: Fase 7 continua bloqueada ate validacao visual final do modal de mesclagem, incluindo deduplicacao, descricoes amigaveis e insercao real no editor.
* FASE 6.2: sincronizacao do dropdown de tamanho corrigida para priorizar leitura do `font-size` CSS efetivo da selecao (em vez da escala legada de `queryCommandValue("fontSize")`), evitando salto/desalinhamento entre 8/9/10/11 e mantendo estado neutro em selecao multi-bloco mista.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual final da barra de tamanho (8, 9, 10, 11, 12 e transicoes alternadas) em selecao simples e multi-bloco.
* FASE 6.2: implementado estilo pendente de digitacao no editor (`pendingInlineStyle`) para cor/fonte/tamanho com cursor colapsado; escolhas feitas antes de digitar passam a ser aplicadas no texto novo via `beforeinput`, sem depender de selecao expandida.
* FASE 6.2: toolbar agora sincroniza estado pendente vs estilo efetivo do cursor com logs de diagnostico (`EDITOR PENDING STYLE SET/APPLY/CLEARED` e `EDITOR CURRENT INLINE STYLE SYNC`), mantendo Fase 7 bloqueada ate validacao manual final desse fluxo.
* FASE 6.2: causa raiz da dessintonia do dropdown de tamanho confirmada como conflito entre `cssFontSizeRaw/cssMapped` e escala legada de `queryCommandValue("fontSize")` (`cmdRaw/cmdMapped`); a toolbar passa a decidir o tamanho final apenas por CSS real, mantendo `cmdRaw/cmdMapped` apenas para log diagnostico.
* FASE 6.2: `pendingInlineStyle` estabilizado com assinatura por bloco (`pendingInlineStyleBlockSignature`) e decisoes explicitas de manter/limpar (`EDITOR PENDING STYLE KEEP` / `EDITOR PENDING STYLE CLEAR DECISION`), evitando limpeza precoce em `selectionchange` da propria digitacao.
* FASE 6.2: corrigida perda de pending style no reentry/focus do editor antes da digitacao; toolbar agora preserva cor/fonte/tamanho pendentes ao voltar para o mesmo contexto e registra decisoes de reentry (`EDITOR PENDING STYLE REENTRY KEEP/CLEAR`) e de sync (`EDITOR TOOLBAR SYNC SKIPPED_FOR_PENDING` / `EDITOR TOOLBAR SYNC APPLIED`).
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual final de tamanho 8/9/10/11/12 e fluxo de digitacao com estilo pendente (cor/fonte/tamanho).
* CHECKPOINT - FASE 6.2 / PAGINACAO VISUAL: correcao estrutural da quebra de pagina do Editor de Textos validada no projeto ativo `D:\BRANA ARQUIVOS\BRANA CLOUD`. O fluxo real da quebra passou a fechar com `breakCount: 1`, `effectiveCount: 1`, `persistedTransitionCount: 1`, `beforeSampleCountReal: 3`, `afterSampleCountReal: 3`, `VISUAL_SPACING_AUDIT_RESULT stable: true`, `POST_COMMIT_SPACING_STABLE stable: true` e `LINE_SPACING_PRESERVED`.
* CHECKPOINT - FASE 6.2 / REFLOW-UP MANUAL: validado visualmente no modelo `ATESTADO_TEL_BRANA`. No cenario manual correto, com cursor no primeiro conteudo real da pagina 2 e `Backspace` em ciclo limpo, o console registrou `EDITOR PAGE BLOCK MOVED_PREV`, `EDITOR PAGE REFLOW UP RESULT` com `movedPrevCount: 1`, retorno para `breakCount: 0`, `POST_COMMIT_SPACING_STABLE stable: true`, `LINE_SPACING_PRESERVED` e `POST_COMMIT_LINEHEIGHT_CHECK preserved: true`.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: Fase 7 ainda nao iniciada.

---

## Modulo: Etiquetas e Relatorios

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de etiqueta existem.
[Ã¢Å“â€] Fase 2 - Rotas de etiquetas existem em `etiquetas_routes.py`.
[Ã¢Å“â€] Fase 3 - Configuracao de relatorio existe em `relatorio_config.py` e `preferences_routes.py`.
[Ã¢Å“â€] Fase 4 - Envio de relatorio por email existe em `relatorios_routes.py`.
[ ] Fase 5 - Testar email, anexos e limites de tamanho.

Proximo passo:

* Validar envio de email em ambiente de teste com SMTP/Resend configurado.

Observacoes:

* Etiquetas usam permissao `relatorios`.
* Relatorios e anexos podem conter dados sensiveis.
* `EMAIL_ATTACHMENT_MAX_MB` controla limite de anexo.

---

## Modulo: Preferencias e Opcoes do Sistema

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Preferencias gerais, modelos, ambiente, dados do usuario, odontograma e relatorio existem.
[Ã¢Å“â€] Fase 2 - Rotas de preferencias existem em `preferences_routes.py`.
[Ã¢Å“â€] Fase 3 - Opcoes do sistema existem em `system_options_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para salvar preferencias.
[ ] Fase 5 - Testar impacto das opcoes de seguranca sobre permissoes e senha administrativa.

Proximo passo:

* Validar opcoes de seguranca por clinica e confirmar que nao abrem acesso indevido.

Observacoes:

* Modulo usa permissao `configuracao`.
* Opcoes podem alterar comportamento de controle de usuarios.

---

## Modulo: Licenca, Planos e Pagamentos

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de planos, assinaturas e plataforma existem.
[Ã¢Å“â€] Fase 2 - Rotas de licenca existem em `licenca_routes.py`.
[Ã¢Å“â€] Fase 3 - Checkout, confirmacao, sincronizacao e webhook Mercado Pago existem no codigo.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para licenca e checkout.
[ ] Fase 5 - Testar fluxo completo com Mercado Pago em sandbox e validar webhook.

Proximo passo:

* Configurar ambiente sandbox e validar checkout, retorno, sincronizacao e webhook sem dados reais.

Observacoes:

* Depende de `MERCADOPAGO_ACCESS_TOKEN` e URLs publicas quando usado fora do local.
* Webhook precisa de hardening antes de exposicao publica.

---

## Modulo: Superadmin da Plataforma

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Rotas de overview, clinicas, usuarios, cobrancas, auditoria e assinaturas existem.
[Ã¢Å“â€] Fase 2 - Servico de administracao de plataforma existe em `platform_admin_service.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para `/superadmin/*`.
[Ã¢Å“â€] Fase 4 - Alteracoes de status/plano/trial e reset de senha existem no codigo.
[ ] Fase 5 - Testar autorizacao de superadmin e impedir acesso por admin comum.

Proximo passo:

* Criar teste de acesso: superadmin permitido, admin de clinica negado, usuario comum negado.

Observacoes:

* Modulo atravessa clinicas e e altamente sensivel.
* Nao alterar sem revisar regras em `security/superadmin.py` e `superadmin_routes.py`.

---

## Modulo: Frontend Web

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Frontend estatico servido por `backend/main.py` em `/app` e `/frontend`.
[Ã¢Å“â€] Fase 2 - Login, token, chamadas autenticadas e varias telas operacionais existem em `frontend/app.js`.
[Ã¢Å“â€] Fase 3 - Arquivos auxiliares de prestadores, agenda, preferencias e dialogo de fonte existem.
[ ] Fase 4 - Modularizar `frontend/app.js` por dominio.
[ ] Fase 5 - Criar testes/smoke de interface para fluxos principais.

Proximo passo:

* Iniciar modularizacao pelo menor dominio seguro, mantendo `requestJson`, auth e estado compartilhado intactos.

Observacoes:

* `frontend/app.js` tem mais de 23 mil linhas.
* Mudancas devem ser pequenas e testadas manualmente no navegador.
* Frontend nao e barreira de seguranca.
* Subetapa 1 de Usuarios/Admin concluida: helpers visuais de senha foram extraidos para `frontend/js/modules/users-admin-modal-visual.js`, mantendo o comportamento funcional e os fluxos sensiveis fora do recorte.
* Usuarios/Admin - Subetapa 3 concluida: `usersAtualizarAcoesToolbar()` extraida para `frontend/js/modules/users-admin-modal-visual.js`, mantendo wrapper fino em `frontend/app.js` e sem alterar salvar, senha interna, permissoes, perfis, backend, banco, seeds ou textos visiveis.

---

## Modulo: Banco, Schema e Bootstrap

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Conexao PostgreSQL implementada em `backend/database.py`.
[Ã¢Å“â€] Fase 2 - Modelos SQLAlchemy implementados em `backend/models/`.
[Ã¢Å“â€] Fase 3 - `Base.metadata.create_all` e hotfixes aditivos existem no startup.
[Ã¢Å“â€] Fase 4 - Bootstrap runtime existe em `runtime_bootstrap_service.py`.
[ ] Fase 5 - Criar migrations formais versionadas.

Proximo passo:

* Implantar Alembic ou ferramenta equivalente e transformar hotfixes de schema em migrations controladas.

Observacoes:

* `DATABASE_URL` e obrigatoria.
* Nao ha migrations formais hoje.
* Nao executar alteracoes destrutivas sem backup e aprovacao.

---

## Modulo: Integracoes Externas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Email SMTP/Resend existe em `email_service.py`.
[Ã¢Å“â€] Fase 2 - Google OAuth/Calendar existe em `auth_routes.py` e `google_calendar_service.py`.
[Ã¢Å“â€] Fase 3 - Mercado Pago existe em `licenca_routes.py`.
[Ã¢Å“â€] Fase 4 - WhatsApp aparece no fluxo de avisos da agenda.
[Ã¢Å“â€] Fase 5 - Assinatura PDF possui variaveis e servico dedicados.
[ ] Fase 6 - Criar checklist de configuracao e teste para cada integracao.

Proximo passo:

* Documentar e testar cada integracao em ambiente sandbox/local sem credenciais reais versionadas.

Observacoes:

* Variaveis sensiveis nunca devem entrar no Git.
* Integracoes podem falhar sem impedir todo o sistema, mas devem gerar erro claro ao usuario.

---

## Modulo: Testes Automatizados

Status: NAO INICIADO

Fases:

[ ] Fase 1 - Definir ferramenta de testes backend.
[ ] Fase 2 - Criar teste de startup/import com `.env`.
[ ] Fase 3 - Criar testes de login e `/me`.
[ ] Fase 4 - Criar testes de tenant para pacientes, agenda e financeiro.
[ ] Fase 5 - Criar smoke test de frontend.

Proximo passo:

* Escolher estrategia minima de testes e iniciar por login, `/me` e isolamento por `clinica_id`.

Observacoes:

* A ausencia de testes automatizados aumenta risco de regressao.
* Antes de refatorar frontend ou rotas grandes, criar pelo menos smoke tests.

---

## Prioridade Recomendada

1. Testes de autenticacao e multi-tenant.
2. Migrations formais.
3. Testes de pacientes, agenda e financeiro.
4. Modularizacao gradual do frontend.
5. Refatoracao de rotas grandes para servicos menores.
6. Hardening de webhooks e integracoes externas.

---

## Atualizacao Editor de Textos - Salvar como

- Modal proprio de "Salvar como" implementado no frontend (sem prompt nativo).
- Fluxo agora coleta nome do arquivo/modelo e tipo: `.MOD`, `.RTF`, `.TXT`, `PDF`.
- `PDF` tratado como exportacao nao editavel (nao simula salvamento editavel de modelo).
- Fluxo de salvar documento existente permanece inalterado para `Salvar`.
- Fase 7 continua bloqueada.

## Atualizacao Preferencias e Opcoes do Sistema - Subetapa 8

- Subetapa 8 concluida documentalmente: plano minimo por linha/trecho.
- Candidato mantido: leitura isolada de preferencias de usuario sem escrita.
- Nenhuma autorizacao de codigo concedida ainda.
- A frente continua em refinamento documental antes de qualquer patch.

## Atualizacao Preferencias e Opcoes do Sistema - Subetapa 9

- Subetapa 9 documental concluida: consolidacao e pausa tecnica da frente.
- Frente pausada/consolidada neste momento.
- Nenhum codigo foi alterado.
- Proxima frente recomendada: Cadastros Gerais.
- Proxima subetapa recomendada: Cadastros Gerais - Subetapa 1 - Contrato funcional e classificacao multiarea.

## Atualizacao Cadastros Gerais - Subetapa 1

- Subetapa 1 iniciada documentalmente para a frente `Cadastros Gerais`.
- Frente aberta sem alteracao de codigo.
- Classificacao multiarea registrada: `mista`.
- Contrato funcional inicial documentado.
- Nao houve alteracao em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, backend, banco, schema, migrations, seeds ou endpoints.
- Nenhum controle multiarea foi implementado.
- Proxima subetapa recomendada: `Cadastros Gerais - Subetapa 2 - Mapa documental de fronteiras por dominio e dependencias de permissao`.
- A frente `Preferencias e Opcoes do Sistema` permanece pausada/consolidada.

## Atualizacao Cadastros Gerais - Subetapa 2

- Subetapa 2 criada documentalmente para a frente `Cadastros Gerais`.
- Mapa de fronteiras por dominio e dependencias de permissao concluido.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- A classificacao multiárea herdada permanece `mista`.
- Proxima subetapa recomendada: continuidade documental em `Auxiliares / Tabelas auxiliares`.
- O primeiro recorte funcional segue proibido nesta etapa.

## Atualizacao Reavaliacao Modulos Frontend Sem Modularizacao

- Reavaliacao documental dos modulos frontend sem modularizacao real concluida.
- A decisao do usuario de tratar todos os modulos como `core / comum` foi registrada.
- `Cadastros Gerais / Auxiliares` nao foi continuado nesta etapa.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Modulo recomendado para a proxima etapa documental: `Agenda de contatos`.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 1 - Contrato funcional e fronteiras documentais`.

## Atualizacao Agenda de Contatos

- Inicio documental do modulo `Agenda de contatos` registrado.
- `Agenda de contatos` foi tratada como `core / comum`.
- A Subetapa 1 foi criada sem alteracao de codigo.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 2 - Mapa documental de dependencias com agenda principal, agenda legado e tenant`.

## Atualizacao Agenda de Contatos - Subetapa 2

- Subetapa 2 de `Agenda de contatos` criada documentalmente.
- Mapa de dependencias com agenda principal, agenda legado e tenant concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 3 - Mapa documental do fluxo de listagem, filtros e carregamento de apoio`.

## Atualizacao Agenda de Contatos - Subetapa 3

- Subetapa 3 de `Agenda de contatos` criada documentalmente.
- Mapa do fluxo de listagem, filtros e carregamento de apoio concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- O menor recorte futuro possivel foi registrado como hipotese documental.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 4 - Mapa documental do carregamento de apoio visual e fronteiras de UI`.

## Atualizacao Agenda de Contatos - Subetapa 4

- Subetapa 4 de `Agenda de contatos` criada documentalmente.
- Mapa de apoio visual/UI concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- O primeiro recorte funcional minimo foi mantido apenas como plano documental.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 5 - Plano documental do primeiro recorte funcional minimo com helper visual puro`.

## Atualizacao Agenda de Contatos - Subetapa 5

- Subetapa 5 de `Agenda de contatos` criada documentalmente.
- Plano do primeiro recorte funcional minimo com helper visual puro registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 6 - Implementacao minima do helper visual puro`.

## Atualizacao Agenda de Contatos - Subetapa 6

- Subetapa 6 de `Agenda de contatos` concluida com implementacao minima.
- Helper visual puro `agendaContatosTelefonesTexto` extraido para modulo proprio.
- Wrapper compatível preservado em `frontend/app.js`.
- `Agenda de contatos` continua tratada como `core / comum`.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 7 - Validacao documental da separacao do helper visual e do wrapper no app.js`.

## Atualizacao Agenda de Contatos - Subetapa 6b

- Correcao da regressao visual do icone de telefone em `Agenda de contatos` registrada.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Nenhuma nova modularizacao foi criada.
- Teste manual obrigatorio antes de prosseguir.

## Atualizacao Agenda de Contatos - Subetapa 7

- Validacao manual da correcao 6B registrada como bem-sucedida.
- Subetapa 7 criada documentalmente.
- Plano do segundo recorte funcional minimo registrado.
- `Agenda de contatos` continua tratada como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 8 - Plano documental da separacao da logica pura de filtragem e da coleta de contexto da UI`.

## Atualizacao Agenda de Contatos - Subetapa 8

- Subetapa 8 criada documentalmente.
- Separacao planejada entre logica pura de filtragem e coleta de contexto da UI registrada.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 9 - Implementacao minima da logica pura de filtragem`.

## Atualizacao Agenda de Contatos - Subetapa 9

- Subetapa 9 implementada com extracao minima da logica pura de filtragem.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 10

- Validacao manual da Subetapa 9 registrada como bem-sucedida.
- Subetapa 10 criada documentalmente.
- Plano do terceiro recorte funcional minimo registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 11 - Implementacao minima da geracao pura de opcoes de filtro de tipos`.

## Atualizacao Agenda de Contatos - Subetapa 11

- Subetapa 11 implementada com extracao minima da geracao pura de opcoes de filtro de tipos.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao precisou ser alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 12

- Validacao manual da Subetapa 11 registrada como bem-sucedida.
- Subetapa 12 criada documentalmente.
- Plano de fronteiras da renderizacao da lista registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 13 - Plano documental da montagem da linha da lista`.

## Atualizacao Agenda de Contatos - Subetapa 13

- Subetapa 13 criada documentalmente.
- Plano de montagem da linha da lista registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 14 - Implementacao minima da montagem pura da linha da lista`.

## Atualizacao Agenda de Contatos - Subetapa 14

- Subetapa 14 implementada com extracao minima da montagem pura da linha da lista.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao foi alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 15

- Validacao manual da Subetapa 14 registrada como bem-sucedida.
- Subetapa 15 criada documentalmente.
- Consolidacao dos recortes de `Agenda de contatos` registrada.
- A frente foi considerada pausada/consolidada.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proxima frente recomendada: `Agenda principal`.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 1 - Contrato funcional e fronteiras documentais`.

## Atualizacao Agenda Principal - Subetapa 1

- Inicio documental da frente `Agenda principal` registrado.
- `Agenda de contatos` permanece pausada/consolidada.
- Subetapa 1 criada documentalmente.
- A frente continua tratada como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum controle multiarea foi implementado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 2 - Mapa documental dos fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteiras com agenda legado`.

## Atualizacao Agenda Principal - Subetapa 2

- Subetapa 2 criada documentalmente para `Agenda principal`.
- O mapa de abertura, modos dia/semana, proximo agendado, avisos e fronteira com agenda legado foi registrado.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi escolhido.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 3 - Plano documental do primeiro helper puro candidato, com avaliacao de risco e fronteira de extracao`.

## Atualizacao Agenda Principal - Subetapa 3

- Subetapa 3 criada documentalmente para `Agenda principal`.
- Os candidatos a helper puro foram reavaliados.
- O primeiro helper recomendado para futura implementacao foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 4 - Implementacao minima do helper puro agendaLegadoNumOrNull e validacao manual do fluxo de agenda legado`.

## Atualizacao Agenda Principal - Subetapa 4

- Primeira extracao minima de helper puro concluida.
- O helper extraido foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Os arquivos de codigo alterados foram `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 5 - Validacao manual da extracao do helper agendaLegadoNumOrNull e revisao do primeiro impacto funcional`.

## Atualizacao Agenda Principal - Subetapa 5

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 5 foi executada como validacao e revisao de impacto da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoNumOrNull` permanece como a primeira extracao minima da frente.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do segundo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 6

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 6 foi executada apenas como planejamento documental do segundo helper puro.
- O segundo candidato recomendado para futura implementacao foi `agendaLegadoFmtHora`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtHora` com validacao manual do impacto visual.

## Atualizacao Agenda Principal - Subetapa 7

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 7 concluiu a segunda extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtHora`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtHora` no impacto visual da agenda legado.

## Atualizacao Agenda Principal - Subetapa 8

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 8 foi executada como validacao e revisao de impacto visual da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtHora` permanece como a segunda extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do terceiro helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 9

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 9 foi executada apenas como planejamento documental do terceiro helper puro.
- O terceiro candidato recomendado para futura implementacao foi `agendaLegadoFmtDataInput`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtDataInput` com validacao manual do impacto visual no modal da agenda legado.

## Atualizacao Agenda Principal - Subetapa 10

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 10 concluiu a terceira extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtDataInput`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtDataInput` no impacto visual do modal da agenda legado.

## Atualizacao Agenda Principal - Subetapa 11

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 11 foi executada como validacao e revisao de impacto visual no modal.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtDataInput` permanece como a terceira extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do quarto helper puro de menor risco.



