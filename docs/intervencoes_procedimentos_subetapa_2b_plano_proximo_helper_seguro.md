# Intervencoes / Procedimentos - Subetapa 2B (Documental)

Data: 2026-05-18

## 1) Resumo Executivo

- A Subetapa 2A foi concluida, testada e enviada ao GitHub no commit `0b16d07`.
- `procParse` e `procFmtBr` ja foram extraidos para `frontend/js/modules/intervencoes-procedimentos.js`.
- Esta etapa escolhe o proximo helper seguro para uma futura extracao.
- Nenhum novo codigo foi movido nesta subetapa.

## 2) Estado Atual

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit (oneline): `0b16d07 Subetapa 2A: extrai procParse procFmtBr para modulo de Intervencoes`
- `git status --short` no momento da analise:
  - `M frontend/app.js`
  - `M frontend/js/modules/intervencoes-procedimentos.js`
  - muitos arquivos `??` untracked antigos, ja existentes e fora do escopo desta etapa
- `git diff --stat` inicial: sem diff tracked antes da criacao deste documento
- `git diff --cached --stat` inicial: vazio

## 3) Mapa Resumido dos Candidatos Encontrados no app.js

### Helpers pequenos

- `procParse` - ja extraido
- `procFmtBr` - ja extraido
- `procFmtAuxLabel` - formatador de rotulo simples
- `procFmtSimboloLabel` - formatador de rotulo simples
- `procNormalizarFormaCobranca` / `procNormalizarFormaCobrancaV2` - normalizacao simples, mas com uso mais amplo

### Helpers e funcoes medias

- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherEspecialidadesEditor`
- `procVinculaMaterialSelecionado`
- `procVinculaAtualizarCustoTotal`

### Funcoes sensiveis

- `procAplicarDadosEditor`
- `procRecarregarLinks`
- `procAtualizarMateriaisEditorVisualizacao`
- `procSalvar`
- `procReajustePreview`
- `procReajusteAplicar`
- `procAbrirEditor`
- `procAtualizarFinanceiro`

### Funcoes proibidas para agora

- Qualquer logica de materiais, vinculos, heranca, `procedimento_generico_id`, salvamento, exclusao, duplicidade, duplo clique, reajuste de tabela, backend/endpoints.

## 4) Bloco Recomendado Para a Proxima Extracao

### Recomendacao objetiva

O proximo helper seguro recomendado e:

- `procFmtAuxLabel`

### Localizacao aproximada

- `frontend/app.js`, na regiao dos helpers de rotulo e preenchimento de combos, por volta da area onde ja existem `procFmtBr` e `procFmtSimboloLabel`.

### Por que e seguro

- E pequeno e puro.
- Nao faz `fetch`.
- Nao grava dados.
- Nao abre modal.
- Nao altera DOM sozinho.
- Nao toca em materiais, vinculos, genericos, custos ou reajuste.
- E usado para montar texto de opcoes de combo.

### Por que nao mexe em dados

- Apenas concatena/normaliza strings para exibir rotulos.
- Nao altera payloads, ids, tabela ou estado persistido.

### Por que nao mexe em vinculos/material/generico/reajuste

- Nao usa `procEditorSnapshot`, `procedimentoLinks`, `procMateriaisGenerico*` nem `procReajuste*`.
- Nao chama backend.
- Nao altera `procedimento_generico_id`.

## 5) Blocos Descartados Por Risco

- `procAtualizarMateriaisEditorVisualizacao`
- `procRecarregarLinks`
- `procAplicarDadosEditor`
- `procSalvar`
- `procExcluirSelecionado`
- `procEditarVinculoSelecionado`
- `procConfirmarVinculo`
- `procReajustePreview`
- `procReajusteAplicar`
- `procAtualizarFinanceiro`

Motivo: todos estes blocos cruzam materiais, vinculos, genericos, custos, salvamento ou reajuste.

## 6) Plano da Proxima Subetapa Funcional

- Mover somente `procFmtAuxLabel`.
- Manter wrapper no `frontend/app.js` se necessario para compatibilidade.
- Preservar assinatura e comportamento.
- Nao alterar textos visiveis.
- Nao alterar backend.
- Nao mexer em vinculos, materiais, genericos, custos ou reajuste.

## 7) Checks Obrigatorios da Proxima Subetapa

- `node --check frontend/app.js`
- `node --check frontend/js/modules/intervencoes-procedimentos.js`

## 8) Onde Testar na Proxima Subetapa

1. Ctrl+F5.
2. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
3. Abrir listagem.
4. Abrir procedimento existente.
5. Abrir procedimento com generico.
6. Abrir procedimento sem generico.
7. Conferir campos visuais relacionados ao helper de rotulo.
8. Conferir materiais proprios/herdados visualmente.
9. Abrir `% Reajusta tabela...` apenas ate `Preview`.
10. Nao aplicar reajuste em tabela real.
11. Conferir console.

## 9) Recomendacao Objetiva

- Se a proxima extracao seguir o criterio de menor risco, mover primeiro `procFmtAuxLabel`.
- Arquivos que seriam alterados na proxima subetapa:
  - `frontend/app.js`
  - `frontend/js/modules/intervencoes-procedimentos.js`
  - novo documento da proxima subetapa
- Arquivos que nao devem ser alterados:
  - `frontend/index.html`
  - backend
  - materiais, vinculos, genericos, custos, reajuste, endpoints

