# Subetapa 2E - Extracao de `procFmtSimboloLabel`

## 1. Estado inicial

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `5a8853b Documenta proximo helper apos procFmtAuxLabel`
- Status resumido: ha muitos `untracked` antigos em `docs/`; nao havia diff tracked novo para esta etapa antes da extracao.

## 2. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `docs/intervencoes_procedimentos_subetapa_2e_helper_procFmtSimboloLabel.md`

## 3. O que foi movido

- `procFmtSimboloLabel`

## 4. O que permaneceu no app.js

- wrapper compativel para `procFmtSimboloLabel`;
- fallback seguro para a logica original;
- chamadas atuais preservadas.

## 5. O que nao foi alterado

- materiais;
- vinculos;
- `procedimento_generico_id`;
- Procedimentos Genéricos;
- custos;
- reajuste de tabela;
- backend;
- `index.html`.

## 6. Blindagem textual / mojibake

- nenhum texto visivel foi corrigido;
- nenhum label foi alterado;
- nenhuma string visual foi alterada.

## 7. Riscos

- helper de label/simbolo pode afetar exibicao visual;
- teste visual obrigatorio.

## 8. Onde testar

- Ctrl+F5;
- abrir `Configurações > Tabelas > Intervenções / Procedimentos...`;
- abrir listagem;
- abrir procedimento existente;
- verificar onde o label/simbolo aparece;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir materiais proprios e herdados visualmente;
- abrir `% Reajusta tabela...`;
- fazer `Preview` apenas;
- nao aplicar reajuste em tabela real;
- conferir console.
