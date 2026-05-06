# Banco de dados - Brana Cloude

## Tecnologia

Banco principal: PostgreSQL.

ORM: SQLAlchemy.

Configuracao: `saas/backend/database.py`, usando `DATABASE_URL`.

Nao ha migrations Alembic. O schema e mantido por uma combinacao de:

- Modelos SQLAlchemy.
- `Base.metadata.create_all` em ambiente local quando permitido.
- `saas/backend/scripts/aplicar_compatibilidade_schema.py`.
- Scripts especificos de modulo.
- Hotfixes pontuais em `main.py`.

## Tabelas por dominio

Clinica e conta:

- `clinicas`
- `usuarios`
- `planos`
- `assinaturas`
- `email_codes`
- `access_profile`
- `usuario_perfil_acesso`

Plataforma:

- `plataforma_assinaturas`
- `plataforma_cobrancas`
- `plataforma_auditoria`

Financeiro:

- `grupo_financeiro`
- `categoria_financeira`
- `lancamento`
- `item_auxiliar`
- `indice_financeiro`
- `indice_cotacao`
- `cenario`

Materiais e procedimentos:

- `lista_material`
- `material`
- `procedimento_tabela`
- `procedimento`
- `procedimento_material`
- `procedimento_fase`
- `procedimento_generico`
- `procedimento_generico_fase`
- `procedimento_generico_material`
- `simbolo_grafico_catalogo`
- `tiss_tipo_tabela`

Pacientes e tratamentos:

- `pacientes`
- `tratamento`

Agenda:

- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `contato`

Prestadores, unidades e convenios:

- `prestador`
- `prestador_credenciamento`
- `prestador_comissao`
- `prestador_odonto`
- `prestador_credenciamento_odonto`
- `prestador_comissao_odonto`
- `unidade_atendimento`
- `convenio_odonto`
- `plano_odonto`
- `calendario_faturamento_odonto`

Anamnese e clinico:

- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`
- `doenca_cid`
- `medicamento`
- `restricao_terapeutica`

Documentos e relatorios:

- `modelos_documento`
- `etiqueta_padrao`
- `etiqueta_modelo`
- `relatorio_config`

Proteticos:

- `protetico`
- `servico_protetico`
- `controle_protetico`

## Relacionamentos principais

- `clinicas` e a raiz de tenant. Quase todas as tabelas operacionais possuem `clinica_id`.
- `usuarios.clinica_id` define a clinica do usuario.
- `usuarios.prestador_id` pode vincular usuario a `prestador_odonto`.
- `usuarios.unidade_atendimento_id` pode vincular usuario a unidade.
- `pacientes.clinica_id` separa pacientes por clinica.
- `tratamento.paciente_id` referencia `pacientes`.
- `tratamento` guarda varios campos de cirurgiao por `usuarios.id`.
- `procedimento.tabela_id` aponta para tabela logica de procedimento.
- `procedimento_material` vincula `procedimento` a `material`.
- `procedimento_generico_material` vincula procedimento generico a material.
- `convenio_odonto`, `plano_odonto` e `calendario_faturamento_odonto` modelam operadoras/planos/faturamento.
- `prestador_credenciamento_odonto` vincula prestador, convenio e plano.
- `prestador_comissao_odonto` vincula prestador, convenio e procedimento generico.
- `anamnese_respostas` vincula paciente, questionario e pergunta.
- `controle_protetico` vincula protetico, servico, cirurgiao e paciente.

## Campos JSON/texto relevantes

- `clinicas.opcoes_sistema_json`: opcoes avancadas da clinica.
- `usuarios.preferencias_usuario_json`: preferencias gerais.
- `usuarios.preferencias_agenda_json`: preferencias de agenda.
- `usuarios.preferencias_impressora_json`: preferencias de impressao.
- `usuarios.preferencias_etiqueta_json`: preferencias de etiqueta.
- `usuarios.permissoes_json`: permissoes por modulo.
- `tratamento.source_payload`: payload legado em JSONB.

## Regras de seguranca de dados

- Toda query operacional deve filtrar por `clinica_id`.
- Rotas superadmin sao excecao e devem validar superadmin explicitamente.
- Dados em `storage/modelos/clinicas/<id>` tambem sao dados de tenant.
- Scripts de migracao devem receber clinica alvo e registrar o que alteraram.

## Riscos do schema atual

- Ausencia de migration tool formal.
- Tipos legados guardados como `String` em campos de data/codigo em alguns modelos.
- Muitos campos `source_id` e `legacy_*` exigem cuidado para nao duplicar dados migrados.
- Varios hotfixes de compatibilidade indicam que ambientes podem ter schemas diferentes.
