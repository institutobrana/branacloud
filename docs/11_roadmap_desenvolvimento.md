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

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 1

- A frente `Preferencias / Configuracoes comuns` foi iniciada documentalmente.
- A classificacao registrada e `core / comum`.
- A escolha veio da reavaliacao pos-`Agenda principal`.
- A `Agenda principal` fica temporariamente pausada apos as extraicoes ja validadas.
- A `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhum arquivo de frontend, backend, banco, endpoints, seeds ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Subetapa 2 - Mapeamento tecnico detalhado por leitura`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 2

- A Subetapa 2 foi concluida como etapa exclusivamente documental.
- O mapeamento tecnico detalhado foi realizado por leitura.
- Nenhum codigo foi alterado.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- A `Agenda principal` permanece pausada temporariamente.
- A `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o isolamento documental dos candidatos mais seguros.

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

## Atualizacao Agenda Principal - Subetapa 12

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 12 foi executada apenas como planejamento documental do quarto helper puro.
- O quarto candidato recomendado para futura implementacao foi `agendaLegadoFmtData`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtData` com validacao manual do impacto visual na tabela da agenda legado.

## Atualizacao Agenda Principal - Subetapa 13

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 13 concluiu a quarta extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtData`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtData` no impacto visual na tabela da agenda legado.

## Atualizacao Agenda Principal - Subetapa 14

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 14 foi executada como validacao e revisao de impacto visual na tabela/lista.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtData` permanece como a quarta extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do quinto helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 15

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 15 foi executada apenas como planejamento documental do quinto helper puro.
- O quinto candidato recomendado para futura implementacao foi `agendaLegadoRangeHoje`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoRangeHoje` com validacao manual do impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 16

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 16 foi executada como implementacao minima planejada do quinto helper puro.
- O helper extraido foi `agendaLegadoRangeHoje`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- `agendaLegadoFmtData` nao foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoRangeHoje` no impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 17

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 17 foi executada como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeHoje` permanece como a quinta extracao minima.
- O volume do diff da Subetapa 16 foi conferido e separado entre documentacao/roadmap e a extracao autorizada.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do sexto helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 18

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 18 foi executada apenas como planejamento documental do sexto helper puro.
- O sexto candidato recomendado para futura implementacao foi `agendaLegadoRangeSemana`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoRangeSemana` com validacao manual do impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 19

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 19 foi executada como implementacao minima do sexto helper puro.
- O helper extraido foi `agendaLegadoRangeSemana`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- `agendaLegadoFmtData` nao foi alterado.
- `agendaLegadoRangeHoje` nao foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoRangeSemana` no impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 20

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 20 foi executada como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeSemana` permanece como a sexta extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do setimo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 21

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 21 foi executada apenas como planejamento documental do setimo helper puro.
- O setimo candidato recomendado para futura implementacao foi `agendaSemanaIsStandaloneRequest`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaSemanaIsStandaloneRequest` em um modulo futuro proprio da agenda semana, com validacao manual da abertura standalone.

## Atualizacao Agenda Principal - Subetapa 22

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 22 foi executada como implementacao minima do setimo helper puro.
- O helper extraido foi `agendaSemanaIsStandaloneRequest`.
- Foi criado o modulo proprio `frontend/js/modules/agenda-principal-semana-utils.js`.
- Os arquivos de codigo alterados foram `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` foi alterado apenas para carregar o novo modulo antes de `frontend/app.js`.
- `agenda-principal-legado-utils.js` nao foi usado como destino desta extracao.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 23

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 23 foi executada apenas como validacao documental da abertura standalone da agenda semana.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaIsStandaloneRequest` permanece como a setima extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do oitavo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 24

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 24 foi executada apenas como planejamento documental do oitavo helper puro.
- O oitavo candidato recomendado para futura implementacao foi `agendaSemanaStandaloneModeFromQuery`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual direto de querystring standalone da Subetapa 23 ficou limitado porque o usuario nao sabia a rota exata.
- A proxima subetapa recomendada e a implementacao minima de `agendaSemanaStandaloneModeFromQuery` em `frontend/js/modules/agenda-principal-semana-utils.js`, com validacao manual da agenda semana standalone.

## Atualizacao Agenda Principal - Subetapa 25

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 25 foi executada como implementacao minima do oitavo helper puro.
- O helper extraido foi `agendaSemanaStandaloneModeFromQuery`.
- A extracao foi feita no modulo `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` nao precisou ser alterado.
- `agendaSemanaIsStandaloneRequest` nao foi alterado.
- `agendaSemanaBuildStandaloneUrl` nao foi alterado.
- `agenda-principal-legado-utils.js` nao foi alterado.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario informou que testou posteriormente o modo URL/standalone e a agenda abriu corretamente.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaSemanaStandaloneModeFromQuery` e do modo standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 26

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 26 foi executada apenas como validacao documental do modo standalone da agenda semana.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaStandaloneModeFromQuery` permanece como a oitava extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O usuario informou que ja conseguiu testar modo URL/standalone.
- O proximo passo recomendado e o planejamento documental do nono helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 27

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 27 foi executada apenas como planejamento documental do nono helper puro.
- O nono candidato recomendado para futura implementacao foi `agendaSemanaBuildStandaloneUrl`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario validou a abertura URL/standalone e `agenda_modo=dia`, `agenda_modo=clinica` e sem `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a implementacao minima de `agendaSemanaBuildStandaloneUrl` em `frontend/js/modules/agenda-principal-semana-utils.js`, com validacao manual da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 28

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 28 foi executada como a nona extracao minima de helper puro.
- O helper extraido foi `agendaSemanaBuildStandaloneUrl`.
- A extracao foi feita em `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` nao foi alterado.
- `agendaSemanaIsStandaloneRequest` nao foi alterado.
- `agendaSemanaStandaloneModeFromQuery` nao foi alterado.
- `agenda-principal-legado-utils.js` nao foi alterado.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A auditoria pos-Subetapa 27 confirmou commit documental limpo.
- O usuario ja testou URL/standalone e os modos `agenda_modo=dia`, `agenda_modo=clinica` e sem `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 29

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 29 foi executada apenas como validacao documental da URL standalone da agenda semana.
- O helper `agendaSemanaBuildStandaloneUrl` permanece como a nona extracao minima.
- Nenhum codigo foi alterado.
- Nao houve alteracao de frontend, backend, banco, schema, migrations, seeds, endpoints ou permissões.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario ja havia testado URL/standalone e `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## Reavaliacao Documental - Pos Agenda Principal

- A reavaliacao foi feita apos a Subetapa 29 da `Agenda principal`.
- Nenhum codigo foi alterado.
- A `Agenda principal` ja tem nove helpers extraidos e validados.
- Os helpers restantes da `Agenda principal` foram considerados mais sensiveis.
- As frentes comparadas foram `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Preferencias / Configuracoes comuns` e outros cadastros auxiliares ja modularizados.
- A frente recomendada como proxima e `Preferencias / Configuracoes comuns`.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 3

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 3 foi executada apenas como isolamento documental dos candidatos mais seguros.
- Nenhum codigo foi alterado.
- Os candidatos de menor risco foram reavaliados por leitura: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- O primeiro candidato recomendado para futura implementacao foi `prefAmbEstiloPadrao`.
- A ordem conservadora de extracao futura foi documentada antes de qualquer alteracao funcional.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum arquivo de frontend, backend, banco, schema, migrations, seeds, endpoints, permissões, `package.json` ou configuracao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima do helper puro mais seguro, com validacao manual do fluxo de ambiente.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 4

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 4 foi concluida com implementacao minima do helper puro `prefAmbEstiloPadrao`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_4_implementacao_pref_amb_estilo_padrao.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de estilo padrao.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbEstiloPadrao` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Ambiente` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoDados`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 4B

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 4B foi concluida como validacao documental pos-teste da Subetapa 4.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefAmbEstiloPadrao` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoDados`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 5

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 5 foi concluida com implementacao minima do helper puro `prefValoresPadraoDados`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_5_implementacao_pref_valores_padrao_dados.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de dados.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefValoresPadraoDados` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Dados` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 5B

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 5B foi concluida como validacao documental pos-teste da Subetapa 5.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefValoresPadraoDados` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 6

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 6 foi concluida com implementacao minima do helper puro `prefValoresPadraoOdontograma`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_6_implementacao_pref_valores_padrao_odontograma.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de odontograma.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefValoresPadraoOdontograma` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Odontograma` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 7

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 7 foi concluida como validacao documental pos-teste da Subetapa 6.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefValoresPadraoOdontograma` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada foi registrada para a fila seguinte apos o odontograma.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 8

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 8 foi concluida como etapa exclusivamente documental.
- Os tres helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados` e `prefValoresPadraoOdontograma`.
- A fila restante de helpers seguros foi reavaliada por leitura.
- O candidato recomendado para proxima implementacao foi `prefAmbienteTextoExemplo`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteTextoExemplo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 9

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 9 foi concluida com implementacao minima do helper puro `prefAmbienteTextoExemplo`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_9_implementacao_pref_ambiente_texto_exemplo.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de texto exemplo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteTextoExemplo` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteTextoExemplo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 10

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 10 foi concluida como validacao documental pos-teste da Subetapa 9.
- O teste manual da Subetapa 9 nao encontrou erros.
- `prefAmbienteTextoExemplo` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteDialogoValor`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 11

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 11 foi concluida com implementacao minima do helper `prefAmbienteDialogoValor`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_11_implementacao_pref_ambiente_dialogo_valor.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper do dialogo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteDialogoValor` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente deve ser indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteDialogoValor`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 12

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 12 foi concluida como validacao documental pos-teste da Subetapa 11.
- O teste manual da Subetapa 11 passou.
- `prefAmbienteDialogoValor` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado nesta validacao.
- A proxima subetapa recomendada e a reavaliacao documental da fila restante apos o dialogo de fonte.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 13

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 13 foi concluida como etapa exclusivamente documental.
- Os helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo` e `prefAmbienteDialogoValor`.
- A fila restante do ambiente foi reavaliada por leitura.
- O candidato recomendado para a proxima implementacao foi `prefAmbienteEstiloDeDialogo`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissoes, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e a implementacao minima do helper `prefAmbienteEstiloDeDialogo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 14

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 14 foi concluida com implementacao minima do helper `prefAmbienteEstiloDeDialogo`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_14_implementacao_pref_ambiente_estilo_de_dialogo.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper do estilo do dialogo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteEstiloDeDialogo` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente deve ser indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteEstiloDeDialogo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 15

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 15 foi concluida como validacao documental pos-teste da Subetapa 14.
- O teste manual da Subetapa 14 passou.
- `prefAmbienteEstiloDeDialogo` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado nesta validacao.
- A proxima subetapa recomendada e a reavaliacao documental da fila restante apos o dialogo de estilo.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 16

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 16 foi concluida como etapa exclusivamente documental.
- Os helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- A fila restante apos o dialogo de estilo foi reavaliada por leitura.
- Nao foi identificado candidato pequeno e seguro suficiente para nova implementacao minima imediata.
- A recomendacao de continuidade registrada foi de pausa documental da frente, sem nova extracao nesta rodada.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissoes, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e o fechamento documental da frente e a consolidacao da pausa.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 17

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 17 foi concluida como fechamento documental da frente.
- A frente `Preferencias / Configuracoes comuns` foi consolidada como pausada nesta rodada.
- Os helpers extraidos e validados continuam: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo permanece passivo e parcial.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A recomendacao registrada e de nova etapa documental comparativa entre modulos core/comum, sem codigo, para escolher a proxima frente de menor risco.

## Reavaliacao Comparativa - Pos Pausa de Preferencias / Configuracoes Comuns

- A reavaliacao comparativa foi concluida sem alteracao de codigo.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada nesta rodada.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- Foram comparados `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Cadastros auxiliares`, `Convênios e Planos`, `Plano de Contas`, `Medicamentos`, `Materiais`, `Procedimentos genericos`, `Tabela de servicos de protese / Tabela de proteticos`, `Etiquetas`, `Simbolos graficos` e outras frentes core/comum registradas no roadmap.
- A comparacao por risco concluiu que os blocos maiores e mais sensiveis permanecem acima do patamar ideal para uma nova extração minima controlada.
- A frente recomendada como proxima e `Prestadores`, por ser o menor candidato parcial ainda plausivelmente retomavel.
- A proxima subetapa recomendada e `Prestadores - Subetapa 0 de retomada documental / mapeamento tecnico complementar`.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado nesta etapa.

## Prestadores - Subetapa 0

- A frente `Prestadores` foi retomada documentalmente como aproximadamente `core / comum` administrativa/transversal.
- A Subetapa 0 foi executada apenas como retomada documental e mapeamento tecnico complementar.
- Nenhum codigo foi alterado.
- O modulo `frontend/js/modules/prestadores.js` existe e permanece passivo.
- `window.BranaPrestadoresModule` continua exposto.
- `prestFmtCodigo` e `prestStatusHtml` permanecem como helpers extraidos e validados.
- `frontend/index.html` carrega o modulo de Prestadores antes de `frontend/app.js`.
- `frontend/app.js` continua concentrando o fluxo funcional, com wrapper/fallback local para os helpers ja delegados.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## Prestadores - Subetapa 1

- A frente `Prestadores` teve a Subetapa 1 concluida como etapa documental de fronteiras e contrato do helper `prestSelecionado`.
- O helper `prestSelecionado` foi analisado sem alteracao de codigo.
- O helper continua dependente de `prestadoresCache` e `prestadorSelId`, com recomendacao de contrato explicito caso venha a ser extraido futuramente.
- Nenhuma alteracao de codigo foi feita nesta subetapa.
- O modulo `frontend/js/modules/prestadores.js` continua passivo e com namespace global `window.BranaPrestadoresModule`.
- `frontend/app.js` segue concentrando o fluxo funcional e o wrapper local dos helpers ja delegados.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a Subetapa 2 documental ou funcional de `prestSelecionado` com contrato explicito de cache e selecao, caso a frente siga com uma extracao minima segura.

## Prestadores - Subetapa 2

- A frente `Prestadores` teve a Subetapa 2 concluida com implementacao minima do helper `prestSelecionado`.
- O helper agora possui contrato explicito `cache/selId`.
- `frontend/js/modules/prestadores.js` passou a exportar `prestSelecionado(cache, selId)` no namespace passivo `window.BranaPrestadoresModule`.
- `frontend/app.js` passou a consultar primeiro o helper do modulo passivo e manteve fallback local equivalente.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a reavaliacao documental do bloco restante apos a extracao minima de `prestSelecionado`.

## Prestadores - Subetapa 2B

- A frente `Prestadores` teve a Subetapa 2B concluida como validacao documental pos-teste do helper `prestSelecionado`.
- O teste manual informado pelo usuario passou.
- O helper `prestSelecionado` foi validado sem alteracao de codigo nesta rodada.
- `Prestadores` segue como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada permanece a Reavaliacao documental do bloco restante apos a extracao minima de `prestSelecionado`.

## Prestadores - Subetapa 3

- A frente `Prestadores` teve a Subetapa 3 concluida como etapa exclusivamente documental.
- `prestSelecionado` permanece validado.
- O bloco restante foi reavaliado por leitura.
- Nenhum novo candidato pequeno e seguro foi identificado para implementacao minima imediata.
- A recomendacao registrada e pausar/consolidar a frente nesta rodada.
- `Prestadores` segue como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o fechamento documental da frente e a consolidacao da pausa, ou nova comparacao documental antes de qualquer implementacao futura.

## Prestadores - Subetapa 4

- A frente `Prestadores` teve a Subetapa 4 concluida como fechamento documental.
- A frente `Prestadores` foi pausada/consolidada nesta rodada.
- Os helpers extraidos e validados permanecem `prestFmtCodigo`, `prestStatusHtml` e `prestSelecionado`.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo `frontend/js/modules/prestadores.js` permanece passivo e parcial.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima recomendacao e a fase documental de transicao para recortes de risco medio controlado.

## Transicao para recortes de risco medio controlado

- A Fase 2 entra em transicao documental para recortes de risco medio controlado.
- Nenhum codigo foi alterado nesta etapa.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Os criterios de aceitacao de risco medio foram definidos documentalmente.
- A matriz de decisao inicial foi registrada para comparar candidatos futuros.
- A proxima etapa recomendada e a selecao documental do primeiro recorte de risco medio controlado.
- A blindagem textual/mojibake foi respeitada.

## Selecao do primeiro recorte medio controlado

- A selecao documental do primeiro recorte de risco medio controlado foi concluida.
- Nenhum codigo foi alterado nesta etapa.
- Os candidatos comparados foram `Prestadores/prestFiltrarLista`, `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, blocos de `Cadastros auxiliares`, `Convênios e Planos`, `Relatorios`, `Agenda principal`, `Preferencias / Configuracoes comuns` e outros candidatos core/comum registrados no roadmap.
- A recomendacao escolhida foi `Prestadores / prestFiltrarLista` como primeiro recorte medio controlado, mas apenas com contrato documental anterior a qualquer implementacao futura.
- As frentes pausadas/consolidadas permanecem mantidas.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Contrato detalhado de prestFiltrarLista como recorte medio controlado`.

## Prestadores - Contrato detalhado de prestFiltrarLista

- O contrato detalhado de `prestFiltrarLista` como recorte medio controlado foi definido documentalmente.
- Nenhum codigo foi alterado nesta etapa.
- O contrato observado ainda parte de leitura local de `prestCfg` e `prestadoresCache` em `frontend/app.js`.
- O contrato futuro recomendado separa filtragem pura de leitura de DOM e de renderizacao.
- `Prestadores` continua classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A decisao registrada e que `Prestadores / prestFiltrarLista` segue como candidato para implementacao futura, apenas depois deste contrato.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Implementacao minima de prestFiltrarLista com contrato explicito lista/filtros`.

## Prestadores - Implementacao minima de prestFiltrarLista

- A implementacao minima de `prestFiltrarLista` foi concluida como primeiro recorte de risco medio controlado.
- O contrato explicito `lista/filtros` foi aplicado em `frontend/js/modules/prestadores.js`.
- `frontend/app.js` passou a montar os filtros localmente e a chamar o helper do modulo com fallback equivalente.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado nesta etapa.
- `Prestadores` continua classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A blindagem textual/mojibake foi respeitada.
- A validacao manual segue indicada antes de qualquer novo passo.
- A proxima subetapa recomendada e a validacao documental pos-teste da implementacao de `prestFiltrarLista`.

## Prestadores - Validacao pos-teste de prestFiltrarLista

- A validacao pos-teste de `prestFiltrarLista` foi concluida documentalmente.
- O teste manual informado pelo usuario passou.
- `prestFiltrarLista` permanece validado como primeiro recorte de risco medio controlado.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Nenhum novo codigo foi alterado nesta rodada de validacao documental.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Consolidacao documental da frente apos validacao de prestFiltrarLista`.

## Prestadores - Consolidacao documental apos prestFiltrarLista

- A frente Prestadores foi consolidada documentalmente apos a validacao de `prestFiltrarLista`.
- O primeiro recorte de risco medio controlado permanece validado.
- Nenhum codigo foi alterado nesta etapa.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- O modulo `frontend/js/modules/prestadores.js` permanece passivo e parcial, com os helpers extraidos e validados.
- O restante do fluxo visual segue em `frontend/app.js`.
- A blindagem textual/mojibake foi respeitada.
- A recomendacao registrada e pausar/consolidar novamente a frente e fazer nova selecao documental entre modulos/blocos antes de qualquer novo recorte.
- A proxima subetapa recomendada e `Fase 2 - Nova selecao documental entre modulos/blocos antes de qualquer novo recorte em Prestadores`.

## Nova selecao documental apos Prestadores

- A nova selecao documental foi realizada apos a consolidacao de `Prestadores`.
- Nenhum codigo foi alterado nesta etapa.
- `Prestadores` permanece consolidado apos a validacao de `prestFiltrarLista`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Os candidatos comparados incluem `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, `Preferencias / Configuracoes comuns` remanescente, `Convênios e Planos`, `Relatorios`, `Etiquetas`, `Medicamentos`, `Plano de Contas`, `Materiais`, `Procedimentos genericos` e `Agenda principal` remanescente.
- A recomendacao escolhida foi seguir com um novo contrato documental em `Preferencias / Configuracoes comuns`.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Contrato funcional e fronteiras para o proximo recorte medio controlado`.

## Preferencias / Configuracoes comuns - Contrato do proximo recorte medio

- `Preferencias / Configuracoes comuns` foi retomada documentalmente para avaliar o proximo recorte medio controlado.
- Nenhum codigo foi alterado nesta etapa.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, parcial e com helpers validados.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Prestadores` e `Preferencias / Configuracoes comuns`.
- A recomendacao escolhida foi detalhar `prefAmbienteSecoesAtuais` como proximo recorte medio controlado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Contrato detalhado de prefAmbienteSecoesAtuais como recorte medio controlado`.

## Preferencias / Configuracoes comuns - Contrato detalhado de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- Nenhum codigo foi alterado nesta etapa.
- O helper `prefAmbienteSecoesAtuais` foi confirmado como recorte medio controlado com contrato explicito de `baseSecoes` e `atuais`.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, com fallback/duplicidade controlada em `frontend/app.js`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos` e `Prestadores`.
- A recomendacao escolhida foi seguir com a implementacao futura minima de `prefAmbienteSecoesAtuais` com parametros explicitos.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Implementacao minima de prefAmbienteSecoesAtuais com contrato explicito baseSecoes/atuais`.

## Preferencias / Configuracoes comuns - Implementacao minima de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- A implementacao minima de `prefAmbienteSecoesAtuais(baseSecoes, atuais)` foi concluida como recorte medio controlado.
- O helper foi exposto no modulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js` continua lendo a base e o estado atual, e preserva fallback local equivalente.
- Nenhum backend, banco, permissao ou payload foi alterado nesta subetapa.
- A blindagem textual/mojibake foi respeitada.
- O teste manual indicado antes de prosseguir deve ocorrer na aba `Ambiente`.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Validacao pos-teste de prefAmbienteSecoesAtuais`.

## Preferencias / Configuracoes comuns - Validacao pos-teste de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- A validacao pos-teste de `prefAmbienteSecoesAtuais` foi concluida como recorte de risco medio controlado.
- O teste manual passou e nao houve regressao no fluxo da aba `Ambiente`.
- `frontend/app.js` e o modulo passivo continuam com contrato explicito `baseSecoes/atuais` e fallback local equivalente.
- `Prestadores` permanece consolidado apos `prestFiltrarLista`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Consolidacao documental apos validacao de prefAmbienteSecoesAtuais`.

## Preferencias / Configuracoes comuns - Consolidacao documental apos validacao de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` segue como frente core / comum.
- `prefAmbienteSecoesAtuais` foi validado como recorte de risco medio controlado.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, com fallback/duplicidade controlada em `frontend/app.js`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos` e `Prestadores`.
- A recomendacao escolhida e pausar/consolidar novamente a frente e fazer nova selecao documental entre modulos/blocos antes de qualquer novo recorte.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias`.

## Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias

- `Preferencias / Configuracoes comuns` permanece consolidada apos `prefAmbienteSecoesAtuais`.
- `Prestadores` permanece consolidado apos `prestFiltrarLista`.
- Nenhum codigo foi alterado nesta etapa.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A recomendacao escolhida foi fazer nova comparacao documental restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` antes de qualquer novo recorte.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas`.

## Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas

- A comparacao documental restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` foi realizada.
- O candidato recomendado foi `Plano de Contas`, mas apenas para receber antes um contrato documental funcional.
- A proxima etapa nao deve ser implementacao imediata; deve ser contrato documental.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Plano de Contas - Contrato documental do proximo helper ou transformacao segura`.

## Plano de Contas - Contrato documental do proximo helper ou transformacao segura

- `Plano de Contas` foi tratado como modulo comum/core administrativo/transversal.
- O contrato documental do proximo helper/transformacao segura foi definido.
- O candidato mais promissor ficou sendo `montarPayloadGrupo(nome, tipo)`, com `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)` como secundario imediato.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a avaliacao documental da implementacao minima de `montarPayloadGrupo`.

## Plano de Contas - Implementacao minima de montarPayloadGrupo

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A implementacao minima de `montarPayloadGrupo(nome, tipo)` foi realizada de forma passiva e conservadora.
- O modulo `frontend/js/modules/plano-contas.js` passou a expor o helper diretamente, mantendo fallback/compatibilidade com `frontend/app.js`.
- `frontend/app.js` passou a delegar o payload de grupo ao helper do modulo, com fallback local equivalente.
- O payload final, o salvamento, `requestJson` e os endpoints nao foram alterados.
- DOM, renderizacao, modal, scaffold e selecao visual nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario e obrigatorio antes de qualquer proxima etapa documental.
- A proxima subetapa e apenas teste manual pelo usuario antes de qualquer nova validacao documental.

## Plano de Contas - Validacao pos-teste de montarPayloadGrupo

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A implementacao minima de `montarPayloadGrupo(nome, tipo)` foi validada pelo usuario em `Cadastros > Plano de contas`.
- O teste manual passou.
- A implementacao minima fica consolidada.
- O payload final, o salvamento e o comportamento visual foram preservados.
- As categorias continuaram funcionando normalmente.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima decisao deve ser documental e conservadora antes de qualquer novo recorte em Plano de Contas.

## Plano de Contas - Contrato documental de montarPayloadCategoria

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- O contrato documental de `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)` foi criado.
- O helper existe de forma passiva em `frontend/js/modules/plano-contas.js`, mas a recomendacao conservadora foi pedir mais auditoria antes de implementar.
- A superficie de categoria e maior que a de grupo e depende de `grupo_id` e `tributavel`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e uma nova auditoria documental de `montarPayloadCategoria` antes de qualquer implementacao.

## Plano de Contas - Auditoria documental de montarPayloadCategoria

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A auditoria documental concluiu que `montarPayloadCategoria` deve permanecer como esta, sem implementacao nova.
- O helper segue passivo em `ns.helpers` e o `app.js` ja delega parcialmente com fallback equivalente.
- A mudanca proposta teria ganho real pequeno e risco desnecessario para um fluxo ja funcional.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e consolidar documentalmente a permanencia do fluxo atual, sem implementacao.

## Plano de Contas - Consolidacao documental de manter montarPayloadCategoria como esta

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- `montarPayloadCategoria` foi consolidado sem alteracao.
- O uso atual via `ns.helpers` sera mantido.
- `montarPayloadGrupo` segue implementado, testado e consolidado.
- `Plano de Contas` fica pausado/consolidado por ora.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e voltar para nova selecao documental de blocos leves.

## Fase 2 - Nova selecao documental de blocos leves apos consolidacao do Plano de Contas

- `Plano de Contas` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de blocos leves.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convênios e Planos`, `Relatorios` e `CID`.
- A classificacao multiarea resumida mostrou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` e `CID` como especificos de area profissional e `Convênios e Planos`/`Relatorios` como mistos ou de risco maior.
- A recomendacao escolhida foi criar primeiro um contrato documental para `CID`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `CID - Contrato documental do proximo helper leve ou transformacao segura`.

## CID - Contrato documental do proximo helper leve ou transformacao segura

- `CID` foi tratado como modulo especifico de area profissional.
- O estado atual de `CID` continua concentrado em `frontend/app.js` e no modulo passivo `frontend/js/modules/cid.js`.
- O candidato documental mais seguro identificado foi `compararTextoCid(texto, termo)`.
- A recomendacao ficou em manter a abordagem conservadora: contrato antes de qualquer implementacao futura.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e seguir com contrato documental antes de qualquer delegacao adicional em `CID`.

## CID - Contrato funcional especifico de compararTextoCid antes de implementacao

- Foi criado contrato funcional especifico de `compararTextoCid(texto, termo)`.
- `CID` continua classificado como modulo especifico de area profissional.
- A decisao conservadora foi aprovar o helper para futura implementacao minima, mantendo fallback equivalente.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de uso de `compararTextoCid` no filtro local de `CID`.

## CID - Implementacao minima de uso de compararTextoCid no filtro local

- A implementacao minima de uso de `compararTextoCid(texto, termo)` no filtro local de `CID` foi realizada.
- `CID` continua classificado como modulo especifico de area profissional.
- Os arquivos alterados foram `frontend/app.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_cid_implementacao_comparar_texto_cid.md`.
- O helper permanece passivo em `frontend/js/modules/cid.js`.
- DOM/renderizacao/modal/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario passa a ser obrigatorio antes da proxima etapa documental.

## CID - Validacao pos-teste de compararTextoCid no filtro local

- A validacao pos-teste de `compararTextoCid` no filtro local de CID foi concluida.
- O teste manual passou em `Tabelas > Doencas (CID)`.
- A implementacao minima ficou consolidada.
- `CID` continua classificado como modulo especifico de area profissional.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- `frontend/js/modules/cid.js` nao foi alterado porque o helper ja existia.
- O ganho foi principalmente arquitetural/de delegacao segura, e nao necessariamente de reducao visivel de linhas.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e uma nova decisao documental antes de qualquer novo recorte em `CID`.

## CID - Consolidacao documental pos-validacao de compararTextoCid

- `compararTextoCid` foi consolidado no filtro local de CID.
- O teste manual passou em `Tabelas > Doencas (CID)`.
- `CID` continua como modulo especifico de area profissional.
- O ganho foi arquitetural/de delegacao segura.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- `CID` fica pausado/consolidado por ora.
- A proxima subetapa recomendada e nova decisao documental antes de qualquer novo recorte.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de CID

- `CID` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de proximo bloco leve.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convênios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` como especifico de area profissional e `Convênios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Etiquetas` como proxima frente documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Etiquetas - Contrato documental do proximo helper leve ou transformacao segura`.

## Etiquetas - Contrato documental do proximo helper leve ou transformacao segura

- `Etiquetas` foi tratado como modulo comum/core administrativo/transversal.
- A auditoria operacional dos dois commits anteriores de CID foi aceita sem necessidade de correcao.
- O helper mais seguro identificado foi `etqArquivosOrdenados(lista)`.
- A recomendacao para futura implementacao minima e manter um helper passivo com fallback equivalente.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de `etqArquivosOrdenados(lista)` com teste manual em `Etiquetas / Configuracao de modelos de etiqueta`.

## Etiquetas - Implementacao minima de etqArquivosOrdenados(lista)

- `etqArquivosOrdenados(lista)` foi implementado de forma minima.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/etiquetas.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_etiquetas_implementacao_etq_arquivos_ordenados.md`.
- O helper ficou passivo e puro, com fallback equivalente mantido em `frontend/app.js`.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario deve ocorrer antes de qualquer nova validacao documental.

## Etiquetas - Validacao pos-teste de etqArquivosOrdenados(lista)

- A validacao pos-teste de `etqArquivosOrdenados(lista)` foi concluida.
- O teste manual passou em `Etiquetas / Configuracao de modelos de etiqueta`.
- A implementacao minima ficou consolidada.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- DOM/renderizacao/modal/preview/eventos foram preservados.
- `requestJson`/payload/salvamento/endpoints foram preservados.
- backend/banco/permissoes foram preservados.
- A blindagem textual/mojibake foi respeitada.
- A proxima decisao documental recomendada e consolidar/pausar Etiquetas por ora antes de qualquer novo recorte.

## Etiquetas - Consolidacao documental pos-validacao de etqArquivosOrdenados(lista)

- `etqArquivosOrdenados(lista)` foi consolidado em Etiquetas.
- O teste manual passou.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- O ganho foi arquitetural/de delegacao segura.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A auditoria confirmou que o problema anterior foi apenas erro de relatorio, sem alteracao indevida de codigo.
- A blindagem textual/mojibake foi respeitada.
- `Etiquetas` fica pausado/consolidado por ora.
- A proxima subetapa recomendada e nova decisao documental antes de qualquer novo recorte.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de Etiquetas

- `Etiquetas` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de proximo bloco leve.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Convênios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` como comum/core administrativo/transversal, `Medicamentos` como especifico de area profissional e `Convênios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Cadastros auxiliares` como proxima frente documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Cadastros auxiliares - Contrato documental do proximo helper leve ou transformacao segura`.

## Fase 2 - Normalizacao documental da selecao pos-Etiquetas e contrato de Cadastros auxiliares

- A normalizacao documental apos a consolidacao de Etiquetas foi registrada.
- O commit `2054745349bdc88f8bf7f2d6cb0e3af710da6bd6` foi auditado.
- O commit alterou somente documentacao.
- A inconsistenca operacional/documental foi registrada sem risco funcional.
- Cadastros auxiliares foi aceito como proxima frente documental.
- O contrato documental ja criado sera o ponto de continuidade.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Cadastros auxiliares - Conferencia do contrato documental existente antes de qualquer implementacao`.

## Cadastros auxiliares - Conferencia do contrato documental existente antes de qualquer implementacao

- O contrato documental existente de Cadastros auxiliares foi conferido.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- A avaliacao conservadora concluiu que o contrato esta apto para continuidade documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de `auxNormalizarHexCor(value)` com teste manual obrigatorio.

## Cadastros auxiliares - Implementacao minima de auxNormalizarHexCor(value)

- A implementacao minima de `auxNormalizarHexCor(value)` foi registrada como ja presente e consolidada no modulo real `frontend/js/modules/auxiliares.js`.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- Os arquivos alterados foram `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_cadastros_auxiliares_implementacao_aux_normalizar_hex_cor.md`.
- O nome real do modulo usado foi `frontend/js/modules/auxiliares.js` com namespace `window.BranaAuxiliaresModule`.
- O helper ficou passivo.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario permanece obrigatorio antes da proxima etapa documental.

## Cadastros auxiliares - Validacao e consolidacao pos-teste de auxNormalizarHexCor(value)

- A validacao pos-teste de `auxNormalizarHexCor(value)` foi registrada e consolidada.
- O teste manual passou.
- Nenhuma alteracao de codigo foi necessaria nesta etapa anterior porque o helper e a delegacao ja existiam.
- O modulo real validado e `frontend/js/modules/auxiliares.js`.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- `auxNormalizarHexCor(value)` fica consolidado.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- Qualquer proximo recorte em Cadastros auxiliares precisa de nova decisao documental.

## Cadastros auxiliares - Consolidacao pos-validacao de auxNormalizarHexCor(value)

- `auxNormalizarHexCor(value)` foi consolidado em Cadastros auxiliares.
- O teste manual passou.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- O modulo real permanece `frontend/js/modules/auxiliares.js`.
- O namespace real permanece `window.BranaAuxiliaresModule`.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa deve ser definida por nova decisao documental antes de qualquer implementacao futura.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de Cadastros auxiliares

- `Cadastros auxiliares` foi consolidado/pausado por ora.
- Foi realizada nova selecao documental de blocos leves.
- Os candidatos avaliados foram `Medicamentos` e `Convenios e Planos`.
- A classificacao multiarea resumida apontou `Medicamentos` como especifico de area profissional e `Convenios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Medicamentos` como proxima frente documental.
- A proxima subetapa recomendada e `Medicamentos - Contrato documental do proximo helper leve ou transformacao segura`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Medicamentos - Contrato documental do proximo helper leve ou transformacao segura

- `Medicamentos` foi escolhido para contrato documental.
- `Medicamentos` e um modulo especifico de area profissional.
- O candidato recomendado foi `compararTextoMedicamento(texto, termo)`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa deve ser definida por contrato documental antes de qualquer implementacao futura.

## Medicamentos - Conferencia do contrato de compararTextoMedicamento antes de implementacao

- A conferencia do contrato de `compararTextoMedicamento(texto, termo)` foi realizada.
- `Medicamentos` segue como modulo especifico de area profissional.
- O contrato precisa de complemento documental antes de qualquer implementacao.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e um complemento documental com consumidor local claramente definido antes de implementar.

## Fase 2B - Organizacao da transicao para recortes medios controlados

- O encerramento pratico da busca por helpers leves foi registrado.
- A Fase 2B foi aberta e organizada para recortes medios controlados.
- A diferenca entre Fase 2B e a futura Fase 3 foi registrada: Fase 2B fica no frontend sem backend/banco/payload/salvamento; Fase 3 e para mudancas estruturais maiores.
- O protocolo obrigatorio de recortes medios controlados foi definido.
- A primeira frente recomendada foi `Preferencias remanescentes`.
- A proxima subetapa recomendada e `Preferencias remanescentes - Contrato profundo de recorte medio controlado`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.




