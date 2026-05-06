# Funcionalidades e regras - Brana Cloude

## Autenticacao e conta

- Login por email e senha em `/login`.
- Cadastro por codigo de email em `/signup/request-code` e `/signup/confirm`.
- Recuperacao de senha por codigo em `/password/forgot` e `/password/reset`.
- Login Google e callback OAuth existem no backend.
- Primeiro acesso pode exigir setup de senha interna via `/auth/setup/complete`.
- `/me` retorna dados da sessao atual e orienta o frontend.
- `/logout` encerra sessao logica.

## Licenca, trial e pagamento

- `TrialMiddleware` bloqueia rotas protegidas quando a clinica esta inativa ou com licenca/trial expirado.
- Rotas de licenca permitem consultar status, iniciar checkout, confirmar pagamento e sincronizar.
- Ha integracao prevista com Mercado Pago por variaveis de ambiente.
- Contas owner/superadmin podem bypassar trial/licenca conforme regras em `security/superadmin.py`.

## Multi-clinica

- A maior parte das tabelas possui `clinica_id`.
- O usuario autenticado define a clinica operacional.
- Novas consultas devem sempre filtrar por `current_user.clinica_id`, exceto rotas superadmin.
- Dados base podem ser replicados para clinicas por scripts e servicos de bootstrap.

## Permissoes

Modulos internos:

- `usuarios`
- `prestadores`
- `agenda`
- `financeiro`
- `materiais`
- `procedimentos`
- `anamnese`
- `relatorios`
- `configuracao`

Niveis:

- `desabilitado`: bloqueia.
- `protegido`: exige senha protegida ou grant temporario.
- `habilitado`: permite.

As permissoes sao guardadas em `usuarios.permissoes_json` e podem ser derivadas de permissoes EasyDental por mapeamento em `security/permissions.py`.

## Cadastros

O modulo de cadastros cobre:

- Pacientes.
- Procedimentos genericos.
- Simbolos graficos.
- Tabelas auxiliares.
- Grupos e categorias financeiras.
- Convenios, planos e calendario de faturamento.
- Prestadores, credenciamentos e comissoes.
- Unidades de atendimento.
- Proteticos e servicos.
- CID e medicamentos.

## Agenda

Ha duas areas:

- Agenda legado em `/agenda-legado`, com eventos, bloqueios, repeticao, horarios livres, prestadores, unidades, pacientes, status, assuntos e avisos.
- Contatos de agenda em `/agenda-contatos`.

Tambem existem recursos de Google Agenda:

- Status de integracao.
- Inicio OAuth.
- Preview.
- Exportacao.

## Financeiro

Inclui:

- Grupos e categorias.
- Lancamentos.
- Situacoes e formas de pagamento.
- Relatorio de conta corrente.
- Fluxo de caixa.
- Indices financeiros e cotacoes.
- Cenario/custos fixos e calculos de precificacao.

## Materiais e procedimentos

Materiais:

- Listas de materiais.
- Cadastro de materiais.
- Indices auxiliares.

Procedimentos:

- Tabelas de procedimentos.
- Procedimentos com preco, custo, tempo, tabela, especialidade, simbolo, repasse, garantia e status.
- Materiais vinculados ao procedimento.
- Fases do procedimento.
- Dashboard e relatorio de tabela.
- Procedimentos genericos migrados do EasyDental.

## Tratamentos

Tratamentos sao vinculados a paciente e clinica. Guardam situacao, tabela, indice, cirurgioes, unidade, convenio, dados TISS e payload legado. A rota atual cobre consulta por paciente e criacao de novo tratamento.

## Anamnese, CID e medicamentos

- Questionarios e perguntas de anamnese.
- Respostas por paciente.
- Cadastro de doencas CID.
- Medicamentos, grupos, apresentacoes, usos e restricoes terapeuticas.

## Editor de textos, modelos e PDF

O editor de textos gerencia:

- Modelos por tipo: atestados, receitas, recibos, etiquetas, orcamentos, email de agenda, WhatsApp de agenda e outros.
- Mesclagem de campos.
- Assistente de receitas e atestados.
- Exportacao PDF.
- Preparacao para Acrobat.
- Assinatura PDF e registro de assinatura local.

Arquivos ficam em `saas/storage/modelos/base` e `saas/storage/modelos/clinicas/<id>`.

## Etiquetas e relatorios

- Configuracao de modelos de etiqueta.
- Padroes/arquivos de etiqueta.
- Configuracao de impressos e relatorios no frontend.
- Envio de relatorio por email.

## Administracao

Admin de clinica:

- Usuarios.
- Senhas.
- Permissoes.
- Perfis.
- Status/ativacao.
- Vinculo com prestador/unidade.

Superadmin:

- Overview da plataforma.
- Clinicas.
- Usuarios.
- Cobrancas.
- Auditoria.
- Assinaturas.
- Status/plano/trial extra de clinicas.
