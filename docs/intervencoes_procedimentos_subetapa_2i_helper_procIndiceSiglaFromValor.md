# Subetapa 2I - Extracao de `procIndiceSiglaFromValor`

## 1. Estado inicial

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `46f6e32 Documenta varredura de helpers passivos de Intervencoes`
- Status resumido: ha muitos `untracked` antigos em `docs/`; nao havia diff tracked inicial nesta etapa.

## 2. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `docs/intervencoes_procedimentos_subetapa_2i_helper_procIndiceSiglaFromValor.md`

## 3. O que foi movido

- `procIndiceSiglaFromValor`

## 4. O que permaneceu no app.js

- wrapper compativel para `procIndiceSiglaFromValor`;
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
- `index.html`;
- payload;
- salvamento;
- normalizacao de forma de cobranca.

## 6. Blindagem textual / mojibake

- nenhum texto visivel foi corrigido;
- nenhum label foi alterado;
- nenhuma string visual foi alterada.

## 7. Riscos

- helper pode afetar exibicao visual de sigla / indice;
- teste visual obrigatorio;
- apos esta etapa, recomendada pausa conservadora para reavaliacao.

## 8. Onde testar

- Ctrl+F5;
- abrir `Configurações > Tabelas > Intervenções / Procedimentos...`;
- abrir listagem;
- abrir procedimento existente;
- verificar visualmente onde sigla / indice aparece;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir materiais proprios e herdados visualmente;
- abrir `% Reajusta tabela...`;
- fazer `Preview` apenas;
- nao aplicar reajuste em tabela real;
- conferir console.

## 9. Recomendacao objetiva

Depois da extracao de `procIndiceSiglaFromValor`, a recomendacao e fazer uma pausa conservadora e reavaliar o proximo bloco com cautela, porque os helpers restantes tendem a ficar mais ligados a DOM ou a fluxos mais amplos.
