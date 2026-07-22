# 04 - Funcionalidades

## Autenticacao e conta

Codigo: `backend/routes/auth_routes.py`, `backend/security/jwt_handler.py`, `backend/security/hash.py`, `frontend/app.js`.

Inclui login, logout, `/me`, Google OAuth, cadastro com codigo, recuperacao de senha e conclusao de setup. O login normaliza email, bloqueia usuario inexistente/inativo, impede login de conta sistemica, valida senha e gera JWT com `user_id`, `clinica_id` e `is_admin`.

Regras: `JWT_SECRET_KEY` e obrigatoria; usuario sem `setup_completed` acessa apenas caminhos permitidos; token invalido retorna 401. No frontend React, usuario autenticado com `setup_completed === false` e direcionado para `/app/primeiro-acesso`, onde define a senha interna por `POST /auth/setup/complete` antes de acessar o shell. A tela informa que esta senha interna nao substitui a senha de login; a senha de login continua sendo usada para acessar a conta.

Presenca online: a fundacao backend registra atividade autenticada em `usuarios.last_seen_at` com timestamp UTC e throttle de 60 segundos. O registro ocorre em login, Google OAuth, setup complete e requests autenticadas validas. Falhas nesse registro sao auxiliares e nao derrubam autenticacao valida. O endpoint ADM de usuarios retorna `last_seen_at` e `is_online`, calculado por janela de 3 minutos.

## Usuarios, perfis e permissoes

Codigo: `backend/routes/user_admin_routes.py`, `backend/security/dependencies.py`, `backend/security/permissions.py`, `backend/models/access_profile.py`, `backend/models/usuario_perfil_acesso.py`.

Permite listar, criar e alterar usuarios, resetar senha, alterar status, trocar senha, vincular perfis e editar permissoes. Modulos podem estar habilitados, protegidos ou desabilitados.

Regras: rotas usam `require_module_access("usuarios")`; modulos protegidos exigem senha administrativa ou grant temporario.

## Superadmin e plataforma

Codigo: `backend/routes/superadmin_routes.py`, `backend/services/platform_admin_service.py`, `backend/models/plataforma.py`.

Permite visao geral da plataforma, gestao de clinicas, usuarios, cobrancas, auditoria e assinaturas.

Regras: superadmin nao e o mesmo que admin de clinica; estas rotas podem atravessar clinicas e exigem revisao extra.

## Cadastros operacionais

Codigo: `backend/routes/cadastros_routes.py`, `backend/routes/unidades_atendimento_routes.py`, `backend/routes/cid_routes.py`, `backend/routes/materiais_routes.py`, `backend/routes/medicamentos_routes.py`, `backend/routes/proteticos_routes.py`.

Cobre pacientes, unidades, auxiliares, CID, materiais, listas de materiais, medicamentos, restricoes terapeuticas, proteticos e servicos.

Regras: toda busca, detalhe, edicao e exclusao deve filtrar por `current_user.clinica_id`. Codigos sequenciais sao calculados por clinica/modulo.

## Prestadores, convenios e planos

Codigo: `backend/routes/prestadores_routes.py`, `backend/routes/convenios_planos_routes.py`, modelos `prestador_odonto.py`, `convenio_odonto.py`.

Gerencia prestadores odontologicos, tipos, credenciamentos, comissoes, convenios, planos e calendarios de faturamento.

Regras: prestadores podem se relacionar com usuarios; comissoes e credenciamentos dependem de convenios, planos e procedimentos; filtros por clinica sao obrigatorios.

## Agenda

Codigo: `backend/routes/agenda_legado_routes.py`, `backend/routes/agenda_contatos_routes.py`, `backend/services/google_calendar_service.py`.

Cobre eventos, bloqueios, horarios livres, combos, status, prestadores, unidades, pacientes, contatos de agenda, avisos e Google Calendar.

Regras: agenda usa `clinica_id`; eventos podem ter repeticao; avisos dependem de modelos de documentos e dados do paciente/prestador; Google/WhatsApp dependem de variaveis externas.

## Financeiro

Codigo: `backend/routes/financeiro_routes.py`, `backend/routes/indices_financeiros_routes.py`, `backend/routes/cenario_routes.py`, modelos `financeiro.py`, `indice_financeiro.py`, `cenario.py`.

Inclui grupos, categorias, lancamentos, formas de pagamento, situacoes, relatorio de conta corrente, fluxo de caixa, indices financeiros e simulacao de cenario.

Regras: lancamentos usam categorias e grupos por clinica; exclusao de categorias em uso deve ser bloqueada ou migrada; indices podem ter cotacoes.

## Procedimentos e tratamentos

Codigo: `backend/routes/procedimentos_routes.py`, `backend/routes/tratamentos_routes.py`, modelos `procedimento.py`, `procedimento_generico.py`, `procedimento_tabela.py`, `tratamento.py`.

Gerencia tabelas de procedimentos, procedimentos, fases, materiais vinculados, dashboard, relatorios, procedimentos genericos e tratamentos por paciente.

Regras: tabela PARTICULAR tem comportamento especial; materiais/fases devem pertencer a clinica; tratamentos vinculam paciente e cirurgioes/prestadores.

## Anamnese

Codigo: `backend/routes/anamnese_routes.py`, modelos `anamnese.py`, `anamnese_resposta.py`.

Permite gerenciar questionarios, perguntas, renumeracao e respostas por paciente.

Regras: questionario, pergunta, resposta e paciente devem pertencer a mesma clinica.

## Editor de textos, documentos e PDFs

Codigo: `backend/routes/editor_textos_routes.py`, `backend/services/editor_pdf_service.py`, `backend/services/receituario_pdf_template_service.py`, `backend/services/digital_signature_service.py`, `backend/models/modelo_documento.py`.

Cobre modelos de documentos, mesclagem de campos, assistentes de receita/atestado, exportacao PDF, assinatura digital, registro de assinatura local e abertura/preparacao para Acrobat.

Regras: modelos podem ser base ou por clinica; storage real fica em `D:\BRANA ARQUIVOS\BRANA CLOUD\storage\modelos\`. Para modelos clinicos, a resolucao atual tenta primeiro o caminho registrado no banco, depois busca recursiva em `storage/modelos/clinicas/{clinica_id}`, depois fallback base compativel. Documentos gerados sao sensiveis.

Limitação conhecida: arquivos legados `.rtf`, `.mod`, `.doc` e `.docx` podem abrir com o conteudo recuperado, mas sem preservar integralmente a formatacao original. Modelos importantes devem ser revisados e reformatados no editor novo ou tratados por conversao dedicada em etapa futura.

## Etiquetas e relatorios

Codigo: `backend/routes/etiquetas_routes.py`, `backend/routes/relatorios_routes.py`, `backend/services/etiquetas_service.py`, modelos `etiqueta_modelo.py`, `etiqueta_padrao.py`, `relatorio_config.py`.

Gerencia padroes, arquivos e modelos de etiquetas, configuracoes de relatorio e envio por email.

Regras: email depende de SMTP/Resend; anexos respeitam `EMAIL_ATTACHMENT_MAX_MB`.

## Preferencias e opcoes do sistema

Codigo: `backend/routes/preferences_routes.py`, `backend/routes/system_options_routes.py`.

Controla preferencias gerais, modelos, ambiente, dados do usuario, odontograma, relatorio e opcoes do sistema.

Regras: configuracoes pertencem a clinica; opcoes de seguranca podem exigir senha administrativa.

## Licenca e pagamentos

Codigo: `backend/routes/licenca_routes.py`, modelos `plano.py`, `assinatura.py`, `plataforma.py`.

Gerencia informacoes de licenca, checkout, confirmacao, sincronizacao e webhook Mercado Pago.

Regras: Mercado Pago exige `MERCADOPAGO_ACCESS_TOKEN` para checkout real; webhook precisa protecao quando publicado.

## Painel ADM - Usuarios

Codigo React: `frontend-react/src/features/admin/users/`.

Fase atual: leitura administrativa em `/app/adm/usuarios`, usando `GET /superadmin/usuarios`.

Exportacao CSV read-only disponivel em `/app/adm/usuarios` pela toolbar global, usando `GET /superadmin/usuarios/export.csv` com token Bearer no header. A exportacao respeita a busca server-side atual (`q`) e preserva os estados locais da tabela.

Funcionalidades entregues nesta fase:

- toolbar global com `Atualizar`, `Exportar CSV`, `Ver detalhes` e `Buscar usuario`;
- toolbar visualmente padronizada com `auxiliary-shell-button`, sem botoes caixados do Ant Design nos controles de acao;
- tabela compacta com selecao unica;
- filtros por coluna;
- ordenacao por coluna;
- controle de colunas visiveis;
- rodape de contagem;
- estados de carregamento, erro e vazio;
- modal `Detalhes do usuario` somente leitura, baseado no usuario selecionado;
- modal `Detalhes do usuario` em padrao compacto denso, com respiro discreto entre blocos, sem scroll interno no desktop normal, largura horizontal ajustada, grade interna comum de seis trilhas e fallback responsivo;
- acao read-only `Ver conta`, que navega para `ADM -> Clinicas` por `clinica_id` e seleciona a conta vinculada;
- dados ausentes no detalhe exibidos como `Nao disponivel`;
- indicacao de usuario de sistema e conta proprietaria.

Fora do escopo desta fase: ver conta, criar usuario, alterar usuario, ativar/inativar, alternar perfil administrativo, resetar senha e excluir.

Presenca online: `/app/adm/usuarios` exibe a coluna `Online` imediatamente apos `Status`, com `Online`, `Offline`, `Nunca acessou` e `Nao aplicavel` para usuario sistemico. A coluna visual independente `Protecao` nao fica mais na tabela principal, mas a protecao permanece no subtitulo do nome, no modal de detalhes, no badge e nas regras internas.
