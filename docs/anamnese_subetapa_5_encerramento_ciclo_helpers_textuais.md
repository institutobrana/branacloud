# Anamnese - Subetapa 5 - Encerramento do ciclo de helpers textuais

## 1. Contexto

Este documento encerra o mini ciclo de helpers textuais de Anamnese.
O ciclo foi conduzido de forma conservadora, com namespace passivo, helpers puros e integrações mínimas com fallback local.

## 2. Etapas incluídas

- Subetapa 0 revisada
- Subetapa 1 namespace passivo
- Subetapa 2 fronteiras e contratos
- Subetapa 3A helper validar nome de questionário
- Subetapa 3B helper validar texto de pergunta
- Subetapa 4A integração validar nome de questionário
- Subetapa 4B integração validar texto de pergunta
- correção de segundo clique rápido/duplo clique

## 3. Arquivos funcionais envolvidos

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/anamnese.js`

## 4. Documentos criados no ciclo

- `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
- `docs/anamnese_correcao_duplo_clique_pergunta.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`

## 5. Estado do namespace

`window.BranaAnamneseModule` existe e continua com:
- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`

Helpers disponíveis:
- `anamneseValidarNomeQuestionario`
- `anamneseValidarTextoPergunta`

## 6. Helpers integrados

- `anamneseValidarNomeQuestionario` foi integrado em `anamneseSalvarQuestionario`.
- `anamneseValidarTextoPergunta` foi integrado em `anamneseSalvarPergunta`.
- Ambos usam fallback local seguro.

## 7. O que não foi movido

Continuam no `app.js`:
- `anamneseAbrir`
- `anamneseEnsureUI`
- `anamneseCarregarQuestionarios`
- `anamneseRenderQuestionarios`
- `anamneseCarregarPerguntas`
- `anamneseRender`
- `anamneseSalvarQuestionario`, com integração mínima
- `anamneseSalvarPergunta`, com integração mínima
- `anamneseExcluirQuestionario`
- `anamneseExcluirPergunta`
- `anamneseRenumeraPerguntas`
- `anamneseVincularEventos`
- `fichaAnamneseCarregar`
- `fichaAnamneseSalvarSelecionada`
- `fichaAnamneseImprimir`
- modais
- respostas

## 8. O que foi preservado

Preservado nesta fase:
- backend
- banco
- endpoints
- payloads
- respostas
- seed obrigatório
- ficha do paciente
- renderização
- exclusão
- renumeração

## 9. Correção recorrente de duplo clique / segundo clique rápido

O problema apareceu durante este ciclo.
A primeira tentativa não resolveu.
Foi consultada documentação anterior.
O padrão final adotado foi:
- clique simples seleciona
- segundo clique rápido na mesma linha abre edição

Esse padrão deve ser observado em futuras modularizações com tabelas dinâmicas.

## 10. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`

## 11. Como testar no console

Após `Ctrl+F5`:

```js
window.BranaAnamneseModule?.getStatus()

window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("")
window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("Implante")

window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta("")
window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta("Você tem alergia?")
```

Atenção:
- O nome correto do helper é `anamneseValidarTextoPergunta`.
- Não usar `anamnaseValidarTextoPergunta`.

## 12. Onde testar no sistema

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar os 5 questionários:
   - `Principal`
   - `Implante`
   - `Ficha complementar`
   - `Anamnese de Saúde`
   - `Anamnese pessoal`
5. Abrir `Novo questionário`.
6. Tentar salvar com nome vazio.
7. Confirmar `Informe o nome do questionário.`
8. Abrir `Nova pergunta`.
9. Tentar salvar com texto vazio.
10. Confirmar `Informe o texto da pergunta.`
11. Selecionar uma pergunta.
12. Segundo clique rápido/duplo clique deve abrir `Altera pergunta de anamnese`.
13. Testar botão `Altera`.
14. Abrir ficha de paciente.
15. Validar fluxo de Anamnese/respostas.
16. Confirmar console sem `ReferenceError` ou `TypeError`.

## 13. Recomendação para próxima fase

- Encerrar este mini ciclo aqui.
- Não extrair mais helpers agora.
- Testar manualmente.
- Depois decidir se o próximo ciclo será:
  - novos helpers puros;
  - outra área mais segura;
  - ou pausa para estabilização.
