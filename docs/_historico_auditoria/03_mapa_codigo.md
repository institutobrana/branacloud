# Mapa do codigo - Brana Cloude

## Raiz do workspace

- `saas/`: produto web atual.
- `docs/`: levantamentos, migracoes e decisoes historicas.
- `docs_v2/`: documentacao consolidada atual.
- `app/`, `ui/`, `main.py`: desktop legado.
- `Dados/`: SQLs e sementes extraidas do EasyDental.
- `scripts/`: scripts auxiliares do legado/levantamento.
- `assets/`: imagens e icones usados pelo desktop e migrados para web.
- `requirements.txt`: dependencias do desktop/analises locais.

## `saas/`

- `.git/`: repositorio Git real do produto web.
- `README.md`: instrucao basica de runtime, ainda com nome antigo.
- `render.yaml`: deploy Render.
- `.env.example`: variaveis esperadas.
- `backend/`: API.
- `frontend/`: UI estatica.
- `storage/`: modelos e documentos por clinica.
- `local_bridge/`: ponte local para assinatura/Acrobat.
- `backups/`: snapshots e backups operacionais.

## Backend ativo

- `saas/backend/main.py`: entrada da API, registro de rotas, middlewares, estaticos, healthcheck.
- `saas/backend/database.py`: conexao SQLAlchemy.
- `saas/backend/models/`: modelos e tabelas.
- `saas/backend/routes/`: endpoints HTTP.
- `saas/backend/security/`: JWT, senha, usuario atual, permissoes, tenant, trial.
- `saas/backend/services/`: servicos de negocio e infraestrutura.
- `saas/backend/scripts/`: migracoes, compatibilidade, backups, auditorias, seeds.
- `saas/backend/data/`: snapshots/templates usados por scripts e documentos.
- `saas/backend/tmp/`: arquivos temporarios, especialmente editor de textos.

## Rotas principais

- `auth_routes.py`: login, Google OAuth, signup por codigo, reset de senha, setup inicial, logout, `/me`, unlock protegido.
- `cadastros_routes.py`: simbolos graficos, grupos/categorias financeiras, auxiliares, pacientes, procedimentos genericos.
- `financeiro_routes.py`: categorias, formas de pagamento, lancamentos, relatorio de conta corrente, fluxo de caixa.
- `procedimentos_routes.py`: tabelas, procedimentos, dashboard, relatorio de tabela, materiais vinculados.
- `materiais_routes.py`: listas e materiais.
- `agenda_legado_routes.py`: agenda, avisos, Google Agenda, horarios livres, prestadores, unidades, pacientes e repeticao.
- `agenda_contatos_routes.py`: contatos de agenda.
- `prestadores_routes.py`: prestadores odontologicos, credenciamentos, comissoes e configuracoes de agenda.
- `unidades_atendimento_routes.py`: unidades/locais de atendimento.
- `convenios_planos_routes.py`: convenios, planos e calendario de faturamento.
- `tratamentos_routes.py`: tratamentos por paciente e criacao de tratamento.
- `anamnese_routes.py`: questionarios, perguntas e respostas.
- `medicamentos_routes.py`: medicamentos e opcoes auxiliares.
- `cid_routes.py`: doencas CID.
- `proteticos_routes.py`: proteticos e servicos.
- `controle_proteticos_routes.py`: controle de trabalhos proteticos.
- `preferences_routes.py`: preferencias gerais, modelos, ambiente, dados do usuario, odontograma e configuracao de relatorios.
- `system_options_routes.py`: opcoes avancadas do sistema.
- `etiquetas_routes.py`: padroes, arquivos e modelos de etiqueta.
- `editor_textos_routes.py`: modelos de texto, mesclagem, campos, assistentes de receita/atestado, PDF e assinatura.
- `relatorios_routes.py`: envio de relatorio por email.
- `licenca_routes.py`: info, checkout, confirmacao e sincronizacao de licenca.
- `user_admin_routes.py`: administracao de usuarios, permissoes, perfis, senha e status.
- `superadmin_routes.py`: painel da plataforma, clinicas, usuarios, cobrancas, auditoria e assinaturas.

## Servicos importantes

- `signup_service.py`: criacao de conta/clinica e dados iniciais.
- `runtime_profile_service.py`: politica de startup por ambiente.
- `runtime_bootstrap_service.py`: bootstrap global manual/auditavel.
- `procedimentos_legado_service.py`: regras de procedimentos migradas do EasyDental.
- `simbolos_service.py`: catalogo de simbolos graficos.
- `modelos_service.py`: armazenamento e manipulacao de modelos.
- `editor_pdf_service.py`: exportacao PDF do editor.
- `digital_signature_service.py`: assinatura digital PDF.
- `receituario_pdf_template_service.py`: PDF de receituario por template.
- `email_service.py`: envio de email.
- `google_calendar_service.py`: integracao Google Agenda.
- `indices_service.py`: indices financeiros.
- `access_profiles_service.py`: perfis de acesso.
- `platform_admin_service.py`: operacoes de administracao da plataforma.

## Frontend ativo

- `saas/frontend/index.html`: tela principal, login, modais e paineis.
- `saas/frontend/app.js`: aplicacao inteira em JavaScript puro.
- `saas/frontend/easy_font_dialog.js`: dialogo de fontes no padrao EasyDental.
- `saas/frontend/prestadores_override.js`: extensoes de prestadores/agenda.
- `saas/frontend/*patch*.js`: patches historicos; revisar antes de considerar parte ativa.
- `saas/frontend/prototipos/editor-textos-next/`: prototipo separado em Next.js.

## Arquivos que pedem cuidado

- `saas/backend/.env`: contem configuracao local sensivel.
- `saas/backend/.env.render`: contem DATABASE_URL real e deve ser removido/rotacionado.
- `saas/frontend/app.js.bak_*`, `routes/*.bak_*`, `tmp_*`, `backups/`: historico/artefatos, nao fonte principal.
- `saas/storage/modelos/clinicas/*`: dados de clinica e modelos, nao apenas codigo.
