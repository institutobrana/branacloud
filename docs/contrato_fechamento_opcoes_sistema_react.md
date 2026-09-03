# Contrato de fechamento — Opções do sistema (React)

Status: **ENCERRADO FUNCIONALMENTE**
`SYSTEM_OPTIONS_FINAL_AUDIT = COMPLETE`
`SYSTEM_OPTIONS_MODULE_FINAL = COMPLETE`
`FUNCTIONAL = COMPLETE`
`RUNTIME = PASS`
`FINAL_BLOCKERS = 0`
`OPEN_CRITICAL_QUESTIONS = 0`

Este é o registro atual do contrato de `Configuração → Opções do sistema`. A fonte de verdade de implementação permanece o código em `frontend-react/` e `backend/`.

## Entrada, proteção e abas

- Entrada React: `Configuração → Opções do sistema`, na rota `/app/configuracoes/opcoes-sistema`.
- Módulo protegido: a decisão de solicitar senha pertence à infraestrutura de permissões; a apresentação usa exclusivamente `frontend-react/src/components/ProtectedModulePasswordModal.jsx`.
- Senha válida libera o alvo; senha inválida mantém o modal; Cancelar e X abandonam a tentativa e fecham o modal de senha.
- O modal principal tem dimensão congelada de `690 × 443.375px`, superfície `#f5f0e6` e cinco abas: Clínica, Financeiro, Segurança, Data e Avançado.

## Contrato dos comandos do modal

- **Ok**: sem alteração real, não executa PATCH e mantém o modal aberto. Com alteração, usa `buildSystemOptionsPayload()` e `patchOpcoesSistema()`, aguarda sucesso, atualiza o baseline, limpa o dirty e mantém o modal aberto.
- **Cancelar**: não executa PATCH, restaura o último baseline confirmado, descarta alterações locais pendentes, limpa o dirty e mantém o modal aberto.
- **X**: é o único controle que fecha o modal; descarta alterações locais não salvas e não executa PATCH.
- Falha de save mantém modal, baseline e edições locais, com mensagem amigável.

## Persistência preservadora

O pipeline oficial é:

```text
GET  getOpcoesSistema()
UI   estado local + dirty tracking
PAYLOAD buildSystemOptionsPayload()
PATCH patchOpcoesSistema() → PATCH /system-options
```

A persistência principal é `clinicas.opcoes_sistema_json`. O backend aplica sanitização somente aos campos recebidos e faz merge preservador com o objeto existente. Chaves omitidas, desconhecidas, objetos aninhados, `false`, `0`, `null` e string vazia não editados são preservados. Arrays enviados explicitamente seguem o contrato do backend.

`clinicas.nome` e `clinicas.cnpj` também possuem colunas diretas. Elas só são sincronizadas quando o campo correspondente é efetivamente recebido; omissão não substitui valores existentes.

## Contratos financeiros

### FIN-001 — Tipo de cobrança

- Controle: `select` alimentado pelo catálogo `tipos_cobranca`.
- Storage: `financeiro.tipo_cobranca_padrao`.
- Storage vazio permanece vazio; `BOLETO` é opção real do catálogo, não default automático.
- Sem edição explícita, o fallback visual não é autopersistido. Seleção explícita persiste o código selecionado.

### FIN-002 — Índice do relatório

- Storage: `financeiro.indice_relatorios_id`.
- `255` = Moeda corrente; `0` = Índice padrão.
- Índice padrão significa ausência de override/uso do índice padrão.
- Fallback visual legado não se transforma em alteração persistida sem edição explícita.

## Segurança e integrações compartilhadas

- `seguranca.ativar_auditoria` é um booleano preservado no JSON e controlado por checkbox. O contrato comprovado é de persistência; consumidor moderno ativo não foi comprovado. Classificação: `PROVEN_NON_BLOCKER` / `LEGACY_NO_MODERN_CONSUMER`.
- Em Segurança, “Definir permissões de acesso para os usuários...” reutiliza a feature oficial `Configuração → Usuários → Permissões`; não abre Painel ADM → Usuários e não duplica editor.
- Usuários e Relatórios permanecem módulos congelados e seus contratos não são reabertos por este fechamento.

## Campos históricos e preservação

As chaves históricas/ocultas abaixo permanecem preservadas mesmo quando não são exibidas na UI:

- `habilitar_mensagens_debug`;
- `ignorar_copias_driver`;
- `salvar_arquivos_myeasy`;
- `habilitar_dente_3d`.

O contrato não afirma que essas chaves sejam todas visíveis. O requisito é round-trip preservador.

## Evidências de fechamento

- Auditoria final das cinco abas: Clínica `8/8`, Financeiro `11/11`, Segurança `3/3`, Data `5/5`, Avançado `10/10`; divergências funcionais: `0`.
- `SYSTEM_OPTIONS_MODAL_ACTIONS_V9 = COMPLETE`, com homologação manual do usuário: Ok salva e permanece aberto; Cancelar restaura e permanece aberto; X fecha.
- Backend lossless merge, caller autenticado e contratos financeiros foram previamente homologados.
- Sem alteração de schema, sem deploy, sem AWS e sem alterações nos módulos Usuários, Relatórios, Permissões ou no modal compartilhado nesta etapa documental.
