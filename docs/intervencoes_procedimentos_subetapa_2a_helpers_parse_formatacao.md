# Intervencoes / Procedimentos - Subetapa 2A (Funcional Minima)

Data: 2026-05-18

## 1) Estado Inicial (somente leitura)

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit (oneline): `eb3d803 Documenta plano da primeira extracao segura de Intervencoes`
- Observacao: existem muitos arquivos untracked antigos no repositorio (pendencias fora do escopo desta subetapa).

## 2) Arquivos Alterados Nesta Subetapa

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `docs/intervencoes_procedimentos_subetapa_2a_helpers_parse_formatacao.md` (este documento)

## 3) O Que Foi Movido Para o Modulo

Foram extraidos para `frontend/js/modules/intervencoes-procedimentos.js` como helpers puros:

- `procParse`
- `procFmtBr`

Esses helpers foram expostos via:

- `window.BranaIntervencoesProcedimentosModule.helpers.procParse`
- `window.BranaIntervencoesProcedimentosModule.helpers.procFmtBr`

## 4) O Que Permaneceu no app.js (Compatibilidade)

No `frontend/app.js`:

- `procParse` e `procFmtBr` permaneceram existindo com os mesmos nomes e assinaturas.
- Eles agora atuam como **wrappers**:
  - tentam chamar `window.BranaIntervencoesProcedimentosModule.helpers.*`;
  - se o modulo nao estiver disponivel por qualquer motivo, aplicam **fallback** para a logica original (mesmo comportamento).

## 5) O Que Nao Foi Alterado (Garantias de Escopo)

Nao foi alterado nesta subetapa:

- `frontend/index.html`
- backend
- banco/schema/migrations/endpoints
- materiais e vinculos de materiais
- `procedimento_generico_id` e Procedimentos Genericos
- custos / calculo financeiro
- reajuste de tabela (B1/B2A)

Nao houve `UPDATE/DELETE/INSERT` e nao foi executado reajuste real.

## 6) Blindagem Textual / Mojibake

- Nenhum texto visivel foi corrigido.
- Nenhuma label/mensagem/placeholder de interface foi alterado nesta subetapa.

## 7) Riscos e Observacoes

- `procParse` e `procFmtBr` podem ser usados em pontos amplos do `frontend/app.js`.
- Por isso os wrappers com fallback no `app.js` sao obrigatorios e foram mantidos.

## 8) Onde Testar (antes de qualquer commit)

1. Ctrl+F5.
2. Abrir: Configuracoes > Tabelas > Intervencoes / Procedimentos...
3. Abrir listagem e abrir procedimento existente.
4. Verificar campos numericos (preco/lab/repasse):
   - digitar com virgula e ponto;
   - sair do campo e confirmar formatacao.
5. Abrir procedimento com generico e sem generico (somente observacao).
6. Conferir materiais proprios e herdados visualmente (sem salvar).
7. Testar "Selecione..." sem salvar.
8. Abrir `% Reajusta tabela...`:
   - fazer Preview apenas;
   - nao aplicar reajuste em tabela real.
9. Conferir console do navegador.

