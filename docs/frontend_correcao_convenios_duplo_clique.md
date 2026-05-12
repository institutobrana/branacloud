# Correção do duplo clique - Convênios e Planos

## 1. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_correcao_convenios_duplo_clique.md`

## 2. O que foi corrigido no duplo clique
- A correção ficou restrita ao binding final das duas grades do módulo `Convênios e Planos`.
- O clique simples continua apenas selecionando a linha.
- Foi adicionada detecção local de segundo clique rápido na mesma linha, separadamente para:
  - grade de convênios
  - grade de planos
- Quando o segundo clique rápido acontece na mesma linha, o módulo reaproveita exatamente o fluxo do botão existente:
  - `btnEditarConvenio.click()` para convênios
  - `btnEditarPlano.click()` para planos
- Não foi criada lógica paralela de abertura, preenchimento ou salvamento.

## 3. Situação de `app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` permaneceu intacto.

## 4. Situação de `index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html` permaneceu intacto.

## 5. Módulos já extraídos mantidos intactos
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\cid.js` permaneceu intacto.
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\medicamentos.js` permaneceu intacto.
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js` permaneceu intacto.
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\unidades.js` permaneceu intacto.

## 6. Resultado do `node --check`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios.js`: `OK`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`: `OK`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\cid.js`: `OK`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\medicamentos.js`: `OK`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js`: `OK`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\unidades.js`: `OK`

## 7. Escopo da correção
- A correção ficou restrita ao módulo `Convênios e Planos`.
- Não houve alteração de endpoint, payload, nome público ou assinatura pública.

## 8. Áreas críticas preservadas
- `Editor de Textos` permaneceu intocado.
- `Símbolos Gráficos` permaneceu intocado.

## 9. Onde testar no sistema antes de prosseguir
1. Abrir `Cadastro > Convênios e Planos...`
2. Na grade superior:
   - clicar uma vez em um convênio e confirmar que apenas seleciona
   - clicar em `Altera...` e confirmar abertura com dados preenchidos
   - dar duplo clique no mesmo convênio e confirmar abertura do mesmo fluxo de alteração
3. Na grade inferior:
   - selecionar um plano com clique simples
   - clicar em `Altera plano...` e confirmar abertura com dados preenchidos
   - dar duplo clique no mesmo plano e confirmar abertura do mesmo fluxo de alteração
4. Testar `Novo convênio...` e `Novo plano...`, abrindo e cancelando
5. Testar `Fecha`
6. Observar o console:
   - sem `ReferenceError`
   - sem erro de sintaxe
   - sem erro no clique simples
   - sem erro no duplo clique
   - sem erro ao abrir ou fechar modal
