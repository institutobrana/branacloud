# Fase 2 - Agenda de contatos - Subetapa 6b - Correcao da regressao visual do icone de telefone

## 1. Contexto
Esta subetapa corrige uma regressao visual observada apos a Subetapa 6 de `Agenda de contatos`.

A tela voltou a apresentar o icone de telefone ao lado dos campos de telefone como texto quebrado/mojibake, em vez do simbolo visual esperado.

## 2. Commit anterior relacionado
- `fcee577630936809c65d95bb53928a8816e3e988` - `Extrai helper visual de agenda contatos`

## 3. Regressao observada
O usuario relatou que, em `Agenda de contatos`, o botao/icone de telefone ao lado dos campos de telefone passou a aparecer como texto quebrado, algo semelhante a `ã...`, em vez do icone visual correto.

O restante da tela continuou funcionando:
- coluna de telefones
- formatacao dos telefones
- separador `/`
- filtros
- selecao de linha
- abertura e fechamento do modal
- salvar e excluir

## 4. Causa encontrada
A causa foi localizada no trecho de construcao da linha de telefones de `Agenda de contatos` em `frontend/app.js`.

O componente `agendaContatosBuildPhoneRow` estava usando um texto corrompido para o icone:
- string atual observada: `â˜Ž`

Essa string era usada apenas como icone visual na interface, mas foi mantida com mojibake no trecho da tela afetada.

## 5. Correcao minima aplicada
Foi aplicada a menor correcao possivel:
- substituicao do texto corrompido do icone de telefone por `☎` no trecho exato de `agendaContatosBuildPhoneRow`

Nenhuma outra parte da interface foi alterada.

## 6. Arquivos alterados
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md)
- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)

## 7. Confirmacao de que nao houve correcao textual ampla/mojibake geral
Esta etapa nao fez correcao textual ampla.

Nao foram alterados:
- labels
- placeholders
- textos visiveis fora do icone
- strings de interface fora do ponto exato
- backend
- endpoints
- permissões
- fluxo principal da agenda

## 8. Confirmacao de que Agenda de contatos continua core/comum
`Agenda de contatos` permanece tratada como `core / comum`.

## 9. Checks tecnicos executados
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- `git status --short`
- `git log --oneline -10`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/agenda-contatos-telefones.js`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git diff -- docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`

## 10. Onde testar no sistema antes de prosseguir
O usuario deve testar:
1. Abrir `Agenda de contatos`.
2. Conferir os campos de telefone.
3. Confirmar que o icone de telefone voltou ao normal.
4. Confirmar que nao aparece mais `ã...` ou caractere quebrado no botao/icone.
5. Conferir contato sem telefone.
6. Conferir contato com um telefone.
7. Conferir contato com multiplos telefones.
8. Confirmar que a coluna/lista de telefones continua igual.
9. Confirmar que filtro e selecao continuam funcionando.
10. Abrir e fechar modal de contato sem salvar.
11. Confirmar console sem `ReferenceError` ou `TypeError`.

## 11. Resultado esperado do teste manual
- o icone de telefone deve ser exibido como simbolo visual correto
- a coluna de telefones deve permanecer inalterada
- os filtros devem continuar funcionando
- a selecao de linha deve continuar funcionando
- modal, salvar e excluir devem continuar sem regressao

## 12. Blindagem textual/mojibake
Esta correcao e uma excecao controlada e restrita ao ponto exato do icone quebrado.

Nao foi feita correcao textual ampla.
Nao foram corrigidos acentos, labels, placeholders, strings visiveis ou mojibake geral do sistema.

## 13. Registro para roadmap
- Correcao da regressao visual do icone de telefone em `Agenda de contatos` registrada
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita
- Nenhuma nova modularizacao foi criada
- Teste manual obrigatorio antes de prosseguir

## 14. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita aos arquivos permitidos:
- usar apenas `git add frontend/app.js`
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- se houver alteracao no roadmap, usar apenas `git add docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Corrige icone de telefone em agenda contatos"`
- em seguida executar `git push`

