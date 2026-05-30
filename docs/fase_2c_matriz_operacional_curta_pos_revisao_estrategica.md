# Matriz operacional curta - Fase 2C apos revisao estrategica

## 1. Objetivo

Escolher o proximo recorte real da Fase 2C com base na consolidacao da rodada do Editor de Textos, priorizando reducao real de `frontend/app.js`, fronteira clara, teste manual simples e risco controlado.

## 2. Contexto da revisao estrategica

- A Fase 2C segue como estrategia de reducao controlada de monolitos com risco medio/medio-alto.
- O Editor de Textos passou por tres extracoes reais validadas e agora esta consolidado.
- A decisao de origem desta matriz e `F2C-ESTRAT-D`.

## 3. Estado consolidado do Editor de Textos

- Bootstrap/shell visual validado.
- Toolbar visual validado.
- Painel lateral/listagem visual validado.
- `frontend/app.js` foi reduzido de forma real nas tres extracoes.
- `frontend/js/modules/editor_textos_bootstrap.js` concentrou as logicas passivas extraidas.
- O Editor de Textos ficou consolidado como frente comprovada, nao como novo recorte automatico.

## 4. Critérios da Fase 2C

- Reducao real de `frontend/app.js`.
- Fronteira clara e pequena.
- Backup antes da alteracao.
- Fachada/wrapper quando possivel.
- Teste manual claro.
- Commit seletivo.
- Roadmap.
- Blindagem textual/mojibake.

## 5. Candidatos avaliados

| Candidato | Potencial de reduzir app.js | Risco | Modulo passivo | Historico de extracoes | Teste manual | Contrato especifico | Acao |
|---|---|---|---|---|---|---|---|
| Editor de Textos | Alto, mas ja consolidado | Medio | Sim | Sim, tres extracoes reais | Sim | Sim | Pausar / consolidado |
| Ficha Pessoal | Medio/alto | Alto | Parcial | Nao nesta rodada | Dificil | Sim | Pausar |
| Prestadores | Medio | Medio/alto | Sim | Sim, lista e selecao visual | Sim | Sim | Avancar |
| Convênios e Planos | Medio | Medio/alto | Sim | Sim, listas, shell e validacoes documentais | Sim | Sim | Observar |
| Preferencias / Configuracoes | Baixo | Baixo | Sim | Consolidado | Sim | Apenas se novo recorte | Referencia |
| Usuarios / Seguranca | Medio | Alto | Parcial | Nao | Sim, mas sensivel | Sim | Pausar |
| Agenda principal | Alto | Alto/critico | Nao consolidado | Nao | Complexo | Sim | Pausar |
| Conta Corrente | Medio | Alto | Nao consolidado | Nao | Possivel, mas sensivel | Sim | Pausar |
| Relatorios | Medio | Alto/critico | Nao consolidado | Nao | Amplo | Sim | Pausar |
| Indices Financeiros | Medio | Alto | Nao consolidado | Nao | Limitado | Sim | Pausar |
| Proteticos / Tabela de Servicos de Protese | Medio | Medio/alto | Nao consolidado | Nao | Possivel | Sim | Observar |
| Anamnese | Medio | Alto | Parcial | Nao nesta rodada | Dificil | Sim | Pausar |
| Medicamentos | Medio | Medio/alto | Parcial | Nao nesta rodada | Sim | Sim | Observar |
| Cadastros Gerais / Tabelas auxiliares | Medio | Medio | Variavel | Nao | Sim | Sim | Observar |

## 6. Ranking dos melhores proximos recortes

1. Prestadores
2. Convênios e Planos
3. Medicamentos
4. Cadastros Gerais / Tabelas auxiliares
5. Proteticos / Tabela de Servicos de Protese

## 7. Decisao final

`F2C-CURTA2-B`

## 8. Motivo da decisao

- O Editor de Textos ja foi consolidado e nao deve continuar automaticamente sem novo contrato muito claro.
- `Prestadores` e o melhor candidato seguinte porque ja possui module passivo, historico de extracoes e teste manual viavel, com risco ainda controlavel.
- `Convênios e Planos` continua como alternativa observavel, mas nao supera `Prestadores` neste momento.
- `Ficha Pessoal` segue ampla e sensivel demais para ser priorizada agora.

## 9. Módulo recomendado

`Prestadores`

## 10. Fluxo recomendado

Bloco visual complementar da listagem/painel de Prestadores, com foco em filtros locais simples e apoio visual, sem tocar fluxos sensiveis.

## 11. Risco classificado

`medio-alto controlado`

## 12. Proximo documento obrigatorio

Contrato especifico de Prestadores para o proximo recorte real, com fronteira pequena e reducao real de `frontend/app.js`.

## 13. Arquivos provaveis

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/fase_2c_prestadores_contrato_*.md`
- `docs/11_roadmap_desenvolvimento.md`
- pasta de backup controlada da nova implementacao

## 14. Arquivos proibidos

- `frontend/index.html`
- backend
- banco
- migrations
- seeds
- endpoints
- `.env`
- `requestJson`
- payload
- salvamento
- exclusao
- PDF
- assinatura
- permissões
- autenticação
- cargas remotas
- selecao funcional
- PostgreSQL

## 15. Backup futuro necessario

- Backup controlado de `frontend/app.js`.
- Backup controlado do arquivo passivo afetado em `frontend/js/modules/`.
- Pasta separada de backup para a nova implementacao de Prestadores.

## 16. Teste manual esperado

1. Abrir o sistema normalmente.
2. Entrar no fluxo de Prestadores.
3. Verificar a listagem ou bloco visual alvo.
4. Conferir se o comportamento visual permanece como esperado.
5. Recarregar a tela e testar novamente.
6. Nao focar em salvamento, backend ou banco como objetivo principal.

## 17. Commit seletivo obrigatorio

Se esta matriz for confirmada, o commit deve incluir apenas:

- `docs/fase_2c_matriz_operacional_curta_pos_revisao_estrategica.md`
- `docs/11_roadmap_desenvolvimento.md`

## 18. Registro para roadmap

- Abertura da nova matriz operacional curta pos-revisao estrategica.
- Origem na decisao `F2C-ESTRAT-D`.
- Consolidacao da rodada do Editor de Textos.
- Decisao final: `F2C-CURTA2-B`.
- Modulo recomendado: `Prestadores`.
- Fluxo recomendado: bloco visual complementar da listagem/painel com filtros locais simples.
- Confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
