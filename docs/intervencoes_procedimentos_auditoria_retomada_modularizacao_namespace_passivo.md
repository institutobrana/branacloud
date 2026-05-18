# Auditoria Documental - Retomada da Modularizacao (Intervencoes / Procedimentos) - Namespace Passivo

Data: 2026-05-18

## 1) Resumo Executivo

- A modularizacao de Intervencoes / Procedimentos foi iniciada na Subetapa 1 com a criacao do arquivo `frontend/js/modules/intervencoes-procedimentos.js`.
- Esse arquivo permaneceu **untracked** e nao deve ser apagado sem analise, pois `frontend/index.html` ja o carrega.
- Apos as subetapas sensiveis (Materiais, heranca/vinculos, caso 5000, correcao do "Selecione...", e ciclo do Reajuste de Tabela), esta auditoria verificou se o namespace passivo ainda e valido e seguro.
- Resultado: o arquivo continua **passivo e seguro** (somente `manifest`), e o `frontend/app.js` nao consome esse namespace ainda.

## 2) Estado Atual do Git (somente leitura)

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Commits recentes:

```
a205870 Documenta fechamento do ciclo de reajuste de tabela
5e96bdd Subetapa B2A: aplicar reajuste de tabela com confirmacao
0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao
```

- `git diff --stat`: (vazio)
- `git diff --cached --stat`: (vazio)

Status (resumo):

- Existem muitos arquivos `??` untracked antigos (pendencias preexistentes, fora desta retomada).
- O arquivo `frontend/js/modules/intervencoes-procedimentos.js` aparece como `??` (untracked).

## 3) Analise do Arquivo Passivo (frontend/js/modules/intervencoes-procedimentos.js)

### 3.1 Existencia

- Existe: `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\intervencoes-procedimentos.js`

### 3.2 Conteudo e export

O arquivo define um IIFE com:

- `MODULE_NAME = "BranaIntervencoesProcedimentosModule"`
- `MODULE_VERSION = "0.1.0-passive"`
- `contracts` (freeze) com flags:
  - `alteraFluxoProc: false`
  - `alteraMateriais: false`
  - `alteraProcedimentosGenericos: false`
  - `alteraBackend: false`
- `manifest` (freeze)
- Export global (freeze):

- `window.BranaIntervencoesProcedimentosModule = Object.freeze({ manifest })`

### 3.3 Verificacao de "passividade" (criterios)

Confirmado no arquivo:

- nao registra eventos (`addEventListener` nao aparece);
- nao faz chamadas de rede (`fetch` nao aparece);
- nao altera DOM automaticamente;
- nao sobrescreve funcoes globais do `app.js`;
- nao altera estado global sensivel (apenas cria o namespace global com manifest);
- nao referencia materiais, vinculos, genericos, custos ou reajuste como logica (apenas flags no manifest).

Conclusao: o arquivo e um **namespace passivo** de baixo risco.

## 4) Relacao com frontend/index.html e frontend/app.js

### 4.1 index.html

- `frontend/index.html` ja carrega o script:
  - `<script src="/frontend/js/modules/intervencoes-procedimentos.js"></script>`

Risco associado:

- Como o arquivo esta untracked, em um deploy que use apenas arquivos tracked, essa tag pode causar 404/erro de carregamento.
- Na pratica, os testes locais podem passar porque o arquivo existe no filesystem.

### 4.2 app.js

- Nao ha chamadas/uso de `window.BranaIntervencoesProcedimentosModule` dentro do `frontend/app.js`.
- Portanto, o namespace passivo esta atualmente **nao utilizado** (nenhuma delegacao/consumo), o que e coerente com a Subetapa 1 conservadora.

### 4.3 Conflitos

- Nao foi observado conflito direto entre o namespace e o `app.js` atual.
- O namespace apenas define um objeto global com nome unico.

## 5) Relacao com Materiais / Vinculos / Contratos

A retomada da modularizacao de Intervencoes / Procedimentos deve preservar o contrato ja consolidado:

- Procedimento Generico e modelo/base.
- Intervencao/Procedimento e caso especifico.
- Materiais do Procedimento Generico sao herdados.
- Materiais adicionados diretamente na Intervencao sao proprios/locais.
- Material proprio nao entra no Procedimento Generico.
- Material proprio nao aparece em outra Intervencao.
- Lista final = proprios reais da Intervencao atual + herdados do Generico atual.
- Deduplicacao por `material_id`.
- Proprio vence herdado.
- Ao trocar Generico:
  - herdados antigos saem;
  - herdados do novo generico entram;
  - proprios permanecem;
  - generico sem materiais gera lista herdada vazia;
  - se nao houver proprios, a grade fica vazia.
- Combo "Selecione...":
  - `procedimento_generico_id` = null/vazio;
  - sem herdados;
  - manter apenas proprios reais;
  - lista vazia e valida.

Esta auditoria nao encontrou nada no namespace passivo que viole esses contratos.

## 6) Relacao com Procedimentos Genericos

- O namespace passivo nao toca em heranca nem em `procedimento_generico_id`.
- A modularizacao futura deve continuar evitando mover funcoes sensiveis de recomposicao/renderizacao de materiais sem testes manuais especificos.

## 7) Relacao com Reajuste de Tabela (B1/B2A)

- O ciclo do reajuste (Preview + Aplicacao com confirmacao) foi concluido e fechado documentalmente.
- Esta retomada de modularizacao nao deve misturar alteracoes no reajuste.
- O namespace passivo atual nao interfere no reajuste.

## 8) Recomendacao Objetiva

Alternativa recomendada (A):

- O arquivo `frontend/js/modules/intervencoes-procedimentos.js` esta correto e passivo.
- Recomenda-se um **commit separado** (feito pelo usuario) para:
  - incluir esse arquivo passivo (e, se aplicavel, o documento original da Subetapa 1), de forma a alinhar com o fato de que `index.html` ja carrega o script.

Observacoes:

- Como o arquivo e puramente passivo, o commit separado tende a ser de baixo risco.
- Nao mover funcoes nem introduzir delegacao de comportamento nesta proxima etapa.

## 9) Proxima Subetapa Recomendada

- Subetapa pequena e passiva: consolidar o namespace passivo (commit separado do arquivo passivo e documentacao relacionada), sem qualquer mudanca funcional.
- Somente depois disso, avaliar uma "Subetapa 2" para candidatos de modularizacao (helpers puros), sempre com testes manuais focados em:
  - editor;
  - materiais proprios/herdados;
  - troca de generico/"Selecione...";
  - duplo clique em material;
  - reajuste (apenas abrir/preview; sem aplicar em tabela real).

## 10) Onde Testar (se futuramente o namespace for consolidado/commitado)

1. Ctrl+F5.
2. Abrir Intervencoes / Procedimentos.
3. Abrir procedimento com generico e com materiais herdados.
4. Trocar generico e validar recomposicao (herdados trocam; proprios permanecem).
5. Selecionar "Selecione..." e validar remocao de herdados + preservacao de proprios.
6. Duplo clique em material vinculado.
7. `% Reajusta tabela...`:
   - abrir modal;
   - executar Preview;
   - nao aplicar em tabela real fora de ambiente seguro.

## 11) Notas / Limitacoes

- O arquivo citado em algumas instrucoes como `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace no momento desta auditoria.
