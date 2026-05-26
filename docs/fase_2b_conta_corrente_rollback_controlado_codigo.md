# Fase 2B - Conta corrente - Rollback controlado ao ponto funcional anterior

## 1. Objetivo da etapa
- Executar um rollback controlado do codigo para o ultimo ponto funcional antes da tentativa de modularizacao/implementacao de `Conta corrente`.
- Etapa apenas documental e operacional, sem apagar historico.

## 2. Ponto funcional restaurado
- O ponto funcional confirmado pela auditoria foi `eb437dfad95f004f43a06d1db071438203ede90a`.
- Esse commit corresponde a `Documenta contrato profundo de conta corrente na fase 2B`.

## 3. Commit que iniciou a regressao
- A tentativa de modularizacao/implementacao comecou em `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647`.
- Mensagem: `Extrai tabela de conta corrente na fase 2B`.

## 4. Motivo do rollback
- Os commits posteriores nao resolveram totalmente a abertura dos modulos.
- O usuario confirmou que os problemas continuaram.
- Foi aprovado retornar o codigo ao ultimo ponto funcional anterior a `Conta corrente`.

## 5. Arquivos de codigo restaurados/removidos
- `frontend/app.js` foi restaurado ao estado exato de `eb437dfad95f004f43a06d1db071438203ede90a`.
- `frontend/js/modules/conta-corrente.js` foi removido, pois nao existia no ponto funcional `eb437df`.

## 6. Confirmacoes da correcao
- `frontend/app.js` foi restaurado ao estado de `eb437df`.
- `frontend/js/modules/conta-corrente.js` foi removido por nao existir em `eb437df`.
- A documentacao posterior foi preservada.
- `backend`, banco, endpoints e permissoes nao foram alterados.
- `requestJson`, payload, salvamento e exclusao nao foram alterados manualmente.
- Blindagem textual/mojibake foi respeitada.

## 7. Riscos residuais
- Pode existir dependencia de outros overlays ou fluxos centrais fora do recorte desta restauracao.
- O retorno do codigo ao estado funcional reduz o risco do modulo de `Conta corrente`, mas os documentos posteriores permanecem como historico explicativo.

## 8. Teste manual obrigatorio pos-rollback
- Abrir o sistema.
- Abrir `Sobre > Painel ADM`.
- Abrir alguns modulos que nao estavam abrindo.
- Abrir `Financeiro > Conta corrente`.
- Abrir `Configuração > Preferências`.
- Abrir `Cadastro > Prestadores`.
- Abrir `Cadastro > Convênios e Planos`.
- Confirmar que os paineis voltaram a abrir.
- Nao testar salvar.
- Nao testar exclusao.
