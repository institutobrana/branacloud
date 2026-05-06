# 01 - Visao de Produto

## O que e o Brana Cloude

Brana Cloude e um sistema web de gestao odontologica para clinicas. Ele centraliza cadastros, agenda, pacientes, procedimentos, financeiro, documentos, relatorios, controle de usuarios, configuracoes e recursos de plataforma.

## Problema que resolve

Clinicas odontologicas precisam organizar operacao diaria, agenda, pacientes, planos, prestadores, financeiro, documentos e permissoes sem depender de planilhas soltas ou sistemas legados dificeis de manter. O Brana Cloude consolida esses fluxos em uma aplicacao unica, com separacao por clinica.

## Publico-alvo

- Clinicas odontologicas.
- Administradores de clinica.
- Cirurgioes-dentistas e prestadores.
- Recepcao e agenda.
- Equipe financeira.
- Operadores de documentos e relatorios.
- Administrador da plataforma.

## Principais funcionalidades

- Login, logout, recuperacao de senha e cadastro com codigo.
- Controle de usuarios, perfis, permissoes e senha administrativa para modulos protegidos.
- Multi-clinica via `clinica_id`.
- Cadastro de pacientes, unidades, prestadores, convenios, planos, CID, medicamentos, materiais e proteticos.
- Agenda com eventos, bloqueios, horarios livres, avisos e Google Calendar.
- Financeiro com categorias, lancamentos, relatorio de conta corrente e fluxo de caixa.
- Procedimentos, tabelas, fases, materiais vinculados e simbolos graficos.
- Tratamentos por paciente.
- Editor de textos, modelos de documentos, exportacao PDF, assinatura digital e Acrobat/local bridge.
- Etiquetas e configuracoes de relatorio.
- Licenca, planos, cobrancas e webhooks de Mercado Pago.
- Superadmin para plataforma, clinicas, usuarios, cobrancas, auditoria e assinaturas.

## Principios do produto

- O usuario trabalha dentro da clinica correta.
- Frontend nao e barreira de seguranca.
- Toda informacao operacional deve respeitar autenticacao, permissao e `clinica_id`.
- Dados clinicos, financeiros e documentos sao sensiveis.
- Refatoracoes grandes devem vir depois de testes minimos.