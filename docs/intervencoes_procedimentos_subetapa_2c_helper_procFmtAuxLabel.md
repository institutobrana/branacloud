# Intervencoes / Procedimentos - Subetapa 2C (Funcional Minima)

Data: 2026-05-18

## 1) Estado Inicial

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit (oneline): `3271692 Documenta proximo helper seguro de Intervencoes`
- Status resumido inicial:
  - muitos `untracked` antigos ja existentes no workspace;
  - ausencia de diff tracked inicial antes da criacao deste documento.

## 2) Arquivos Alterados

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `docs/intervencoes_procedimentos_subetapa_2c_helper_procFmtAuxLabel.md`

## 3) O Que Foi Movido

Foi movido para o namespace do modulo:

- `procFmtAuxLabel`

Exposicao atual:

- `window.BranaIntervencoesProcedimentosModule.helpers.procFmtAuxLabel`

## 4) O Que Permaneceu no app.js

- `procFmtAuxLabel` continua existindo com a mesma assinatura.
- O `app.js` agora usa wrapper compativel.
- Existe fallback seguro com a logica original caso o namespace nao esteja disponivel.
- Chamadas atuais permanecem preservadas.

## 5) O Que Nao Foi Alterado

Nao foram alterados:

- materiais
- vinculos
- `procedimento_generico_id`
- Procedimentos Genericos
- custos
- reajuste de tabela
- backend
- `frontend/index.html`

Nao houve `UPDATE/DELETE/INSERT` e nao houve reajuste real.

## 6) Blindagem Textual / Mojibake

- Nenhum texto visivel foi corrigido.
- Nenhum label foi alterado.
- Nenhuma string visual foi alterada.

## 7) Riscos

- `procFmtAuxLabel` afeta exibicao textual de combos e rotulos.
- Por isso o teste visual e obrigatorio antes de qualquer commit.

## 8) Onde Testar

1. Ctrl+F5.
2. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
3. Abrir listagem.
4. Abrir procedimento existente.
5. Verificar onde o label auxiliar aparece.
6. Abrir procedimento com generico.
7. Abrir procedimento sem generico.
8. Conferir materiais proprios e herdados visualmente.
9. Abrir `% Reajusta tabela...`.
10. Fazer `Preview` apenas.
11. Nao aplicar reajuste em tabela real.
12. Conferir console.

