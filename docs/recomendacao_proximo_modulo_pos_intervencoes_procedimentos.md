# Recomendacao do proximo modulo mais seguro apos Intervencoes / Procedimentos

## 1. Objetivo da recomendacao
Registrar, de forma somente documental e conservadora, qual deve ser o proximo modulo mais seguro para continuar a modularizacao do frontend depois do fechamento da rodada de **Intervencoes / Procedimentos**.

## 2. Branch e diretorio verificados
- Branch: `modularizacao-segura-fase-1`
- Diretorio real: `D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Checks iniciais executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -12`
- `git diff --stat`
- `git diff --cached --stat`
- consulta de modulos em `frontend/js/modules`
- mapeamento textual em `frontend/app.js` e `frontend/js/modules/intervencoes-procedimentos.js`

Resultado resumido:
- branch correta
- nenhum arquivo staged
- muitos `??` antigos em `docs/`
- nenhum diff tracked ativo antes da criacao deste documento

## 4. Estado atual apos Intervencoes / Procedimentos
A rodada de Intervencoes / Procedimentos foi encerrada documentalmente em:
- `docs/intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md`

Resultado do fechamento:
- helpers seguros ja extraidos:
  - `procParse`
  - `procFmtBr`
  - `procFmtAuxLabel`
  - `procFmtSimboloLabel`
  - `procIndiceSiglaFromValor`
- helpers de select classificados como cautela:
  - `procSetSelectValue`
  - `procGarantirOpcaoSelect`
  - `procPreencherSelect`
- blocos proibidos nesta fase:
  - `procNormalizarFormaCobranca`
  - `procNormalizarFormaCobrancaV2`
  - payload
  - salvamento
  - materiais
  - vínculos
  - Procedimentos Genéricos
  - herança de materiais
  - `procedimento_generico_id`
  - custos
  - preco
  - repasse
  - reajuste

Conclusao da rodada:
- pausar Intervencoes / Procedimentos nesta rodada
- escolher outro modulo mais isolado para continuar a modularizacao

## 5. Modulos e candidatos avaliados
Os candidatos considerados foram:
- Anamnese
- Materiais
- Prestadores
- Convênios e Planos
- Símbolos Gráficos
- Auxiliares / Tabelas auxiliares
- Procedimentos Genéricos
- Medicamentos
- Plano de Contas
- Etiquetas
- Editor de Textos
- Agenda
- Índices financeiros
- Cenário financeiro
- outros blocos identificados no `frontend/app.js`

## 6. Critérios usados
Foram considerados:
- fronteiras visuais claras
- baixa dependência de payload sensível
- baixa dependência de salvamento complexo
- baixa dependência de materiais/vínculos/genéricos
- baixa dependência de custos, preco, repasse e reajuste
- baixa dependência de editor rico ou motor complexo
- possibilidade de subetapa 0 somente documental
- possibilidade de namespace passivo
- quantidade de funções autocontidas
- risco de regressão visual
- risco de alteração textual/mojibake
- relação com módulos já modularizados
- presença de documentação anterior
- área menos sensível do sistema

## 7. Modulos descartados por risco
- **Intervenções / Procedimentos**: acabou de ser pausado; os proximos passos exigiriam nova fase de análise
- **Procedimentos Genéricos**: acoplamento sensível com materiais e Intervenções
- **Materiais**: risco de vínculo, custo e preço
- **Convênios e Planos**: pode tocar regras de cobrança e dependências amplas
- **Agenda**: tende a ter regras de data/atendimento e fluxo mais acoplado
- **Índices financeiros**: pode impactar reajuste e precificação
- **Cenário financeiro**: envolve custos, preço e cálculo
- **Editor de Textos**: tende a ter motor mais complexo de paginação/quebra
- **Anamnese**: fluxo API-driven com salvamento e estrutura de respostas
- **Medicamentos**: embora separado, ainda envolve CRUD e persistência
- **Prestadores**: fronteira boa, mas ainda com CRUD e salvar/editar/excluir

## 8. Modulo recomendado como proximo
Modulo recomendado: **Auxiliares / Tabelas auxiliares**

## 9. Justificativa objetiva da recomendacao
`Auxiliares / Tabelas auxiliares` e o melhor proximo passo conservador porque, entre os candidatos avaliados, ele apresenta a fronteira mais propicia para modularizacao segura:
- o proprio modulo ja aparece no codigo como estrutura de helpers puros e passivos;
- a area tende a ter funcoes pequenas, autocontidas e visualmente isoladas;
- ha menor risco de tocar em salvamento complexo, materiais, vinculos, genéricos ou reajuste;
- ha menor acoplamento clinico e menor impacto em regras de negocio sensiveis do que em modulos CRUD principais;
- o tipo de trabalho combina bem com uma nova **Subetapa 0 documental** antes de qualquer extracao funcional.

Como segunda opcao conservadora, `Etiquetas` tambem parece promissor por ser visual e controlado, mas `Auxiliares / Tabelas auxiliares` foi o mais forte na leitura atual por indicar helpers puros/passivos com menor superficie de risco.

## 10. Riscos conhecidos do modulo recomendado
Mesmo sendo o candidato mais seguro, ainda existem riscos a observar:
- qualquer helper que toque combo/select pode afetar o que o usuario ve
- funcoes auxiliares podem ser usadas por varios fluxos e exigem mapeamento fino
- labels e textos podem refletir mojibake herdado; nao corrigir nesta fase
- se houver dependencia indireta de filtros ou configuracoes globais, a extracao precisa manter wrappers/fallbacks

## 11. Primeira etapa recomendada para o modulo escolhido
Primeira etapa recomendada:
- **Subetapa 0 documental**
- sem codigo
- sem HTML
- sem backend
- sem banco

Objetivo da Subetapa 0:
- mapear o modulo
- identificar fronteiras
- localizar helpers puros
- registrar riscos
- definir a futura extracao minima segura

## 12. O que NAO fazer na proxima etapa
- nao mover helper
- nao criar namespace novo
- nao alterar HTML
- nao alterar backend
- nao alterar banco
- nao alterar endpoints
- nao alterar payload
- nao alterar salvamento
- nao alterar materiais
- nao alterar vínculos
- nao alterar genéricos
- nao alterar custos
- nao alterar reajuste

## 13. Checks recomendados para a proxima etapa
Se a recomendacao for seguida, os checks iniciais da nova etapa devem incluir:
- `git branch --show-current`
- `git status --short`
- `git log --oneline -12`
- `git diff --stat`
- `git diff --cached --stat`
- consulta de nomes e funcoes em `frontend/app.js`
- consulta do modulo escolhido em `frontend/js/modules`

## 14. Confirmacao de que nenhuma alteracao funcional foi feita nesta recomendacao
- Nenhum codigo foi alterado
- Nenhum helper foi movido
- Nenhum HTML foi alterado
- Nenhum backend foi alterado
- Nenhum banco/schema/migration foi alterado
- Nenhum payload/salvamento/material/vinculo/genérico/custo/reajuste foi tocado
- Blindagem textual/mojibake foi respeitada

