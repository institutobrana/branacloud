# Fase 2 - Reavaliacao pos Agenda principal - Comparacao documental entre continuar Agenda principal ou migrar para outro modulo de menor risco

## 1. Objetivo
Reavaliar, de forma documental e sem implementar nada, se a melhor proxima frente da modularizacao conservadora deve continuar sendo `Agenda principal` ou se faz mais sentido migrar para outro modulo com menor risco operacional.

## 2. Escopo
Escopo desta etapa:

- revisar o ponto atual da `Agenda principal`;
- comparar `Agenda principal` com outros modulos relevantes do `frontend/app.js`;
- medir risco relativo, acoplamento, dependencia de backend e facilidade de teste;
- recomendar objetivamente a proxima frente;
- atualizar o roadmap com a conclusao.

## 3. Confirmacao de que nao houve implementacao
Nao houve alteracao de codigo nesta etapa.

## 4. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua sendo tratada como `core / comum`.

Ela nao e separada por area profissional e nao deve virar um modulo especifico de segmento.

## 5. Resumo do ponto atual da Agenda principal
A frente de `Agenda principal` ja avancou bastante na modularizacao conservadora:

- `agendaLegadoNumOrNull`
- `agendaLegadoFmtHora`
- `agendaLegadoFmtDataInput`
- `agendaLegadoFmtData`
- `agendaLegadoRangeHoje`
- `agendaLegadoRangeSemana`
- `agendaSemanaIsStandaloneRequest`
- `agendaSemanaStandaloneModeFromQuery`
- `agendaSemanaBuildStandaloneUrl`

Os tres helpers restantes ainda mapeados como candidatos mais sensiveis sao:

- `agendaLegadoParseDataInput`
- `agendaLegadoCoerceHoraTexto`
- `agendaLegadoNormalizarHexCor`

## 6. Riscos dos helpers restantes da Agenda principal
Os helpers restantes da `Agenda principal` sao mais delicados que os recortes ja concluidos porque mexem com:

- parse de data de entrada;
- normalizacao de hora;
- normalizacao visual/hex de cor.

Isso aumenta o risco de:

- regressao sutil em filtros e formularios;
- divergencia visual em campos de cor;
- erro de interpretacao de data/hora;
- efeito colateral em payloads e validacoes.

Ainda e possivel continuar a frente, mas a relacao risco/beneficio ficou menos favoravel que nos recortes anteriores.

## 7. Modulos e frentes comparados
Foram comparados os seguintes blocos:

- `Agenda principal`;
- `Ficha pessoal`;
- `Conta corrente`;
- `Relatorios`;
- `Indices financeiros`;
- `Preferencias / Configuracoes comuns`;
- outros cadastros auxiliares relevantes ja presentes no `frontend/js/modules`.

## 8. Tabela comparativa de risco

| Frente | Core/comum? | Tam. aprox. no `app.js` | Modulo em `frontend/js/modules`? | DOM/estado global | Backend / payload sensivel | Permissoes / tenant | Salvar/editar/excluir | Impressao/relatorio/financeiro/calculo | Risco | Teste manual | Doc inicial seguro | Helper puro inicial | Recomendacao |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| Agenda principal | Sim | Alto, cerca de 3.4k linhas no miolo principal e chamadas no menu | Sim, com `agenda-principal-legado-utils.js` e `agenda-principal-semana-utils.js` | Alto | Sim, em partes da agenda legado/semana | Baixo-medio | Sim | Sim, na parte de abertura/impressoes da agenda | Medio-alto nos helpers restantes | Bom, ja validado em varios pontos | Sim | Sim, mas agora mais sensiveis | Pode continuar, mas com menor prioridade de implementacao |
| Ficha pessoal | Nao | Muito alto, cerca de 1.6k linhas no bloco central, sem contar pontos auxiliares | Nao ha modulo dedicado | Muito alto | Sim, CRUD de paciente, foto, anamnese e combos | Possivel sensibilidade de acesso, alto impacto clinico | Sim | Nao e o foco principal, mas integra dados clinicos | Muito alto | Medio, exige varios fluxos para confiar | Sim, mas seria um front grande de contrato | Ha candidatos puros, mas o bloco e muito acoplado | Nao recomendo como proxima frente |
| Conta corrente | Nao | Medio, cerca de 0.6k linhas somando conta corrente e fluxo de caixa | Nao ha modulo dedicado | Alto | Sim, financeiro, filtros, lancamentos, exclusao | Sensivel, tipicamente ligado a `financeiro` e clinica | Sim | Sim, financeiro e impressao/exportacao | Alto | Medio, mas com dados sensiveis | Sim, possivel contrato documental | Pode existir helper puro de formato, mas o miolo e sensivel | Nao recomendo como proxima frente |
| Relatorios | Nao | Medio, bloco disperso com preview/export e acoes de menu | Nao ha modulo amplo dedicado; ha apenas pecas relacionadas como `etiquetas.js` | Alto | Sim, exports, endpoints e payloads de relatorio | Geralmente ligado a `relatorios` | Sim/indireto | Sim, forte dependencia de impressao e exportacao | Medio-alto | Medio, pois a saida precisa bater visualmente | Sim, especialmente contrato de telas e saidas | Pode haver helpers puros de formato/export, mas com maior cuidado | Nao recomendo como primeira opcao |
| Indices financeiros | Nao | Medio-baixo, cerca de 0.1k-0.2k linhas do miolo UI, mas com acoes sensiveis | Nao ha modulo dedicado | Alto | Sim, cotações, migracao e exclusao | Sensivel, normalmente ligado a `financeiro` | Sim, inclusive migracao/exclusao | Sim, valores financeiros e cotacoes | Alto | Medio, mas com risco de exclusao/migracao | Sim, contrato documental e matriz de regras | Os helpers puros parecem poucos; o fluxo e mais transacional | Nao recomendo como proxima frente |
| Preferencias / Configuracoes comuns | Sim, mais comum que especifica | Medio, cerca de 0.6k linhas no bloco de preferencias | Sim, existe `preferencias-opcoes-sistema.js` para parte do dominio | Alto, mas bem compartimentado por abas | Sim, via GET/PATCH de preferencias | Baixo-medio; tipicamente escopo por usuario/sessao | Sim, mas em contexto de preferencia e nao de negocio critico | Nao e foco principal | Medio-baixo | Bom, por abas e por contexto de usuario | Sim, e o melhor candidato para contrato documental inicial | Sim, ha helpers puros e um modulo parcial ja existente | **Recomendado como proxima frente** |
| Cadastros auxiliares diversos | Variavel | Distribuido, mas muitos ja estao fora do monolito principal | Sim, varios modulos ja existem (`materiais`, `prestadores`, `convenios-planos`, `unidades`, `medicamentos`, `cid`, `procedimentos-genericos`, `simbolos-graficos`, `tabela-proteticos-helpers`, `anamnese`, `auxiliares`) | Variavel | Variavel | Variavel | Variavel | Variavel | Menor prioridade, pois muitos ja estao modularizados | Variavel | Nao se destacou como hotspot unico | Variavel | Nao e o melhor alvo imediato |

## 9. Analise especifica de Ficha pessoal
O bloco de `Ficha pessoal` em `frontend/app.js` e muito grande, com cerca de 1.6k linhas no miolo principal.

Caracteristicas observadas:

- nao existe modulo dedicado em `frontend/js/modules`;
- concentra muita UI e muito estado global;
- depende de carregamento de combos, busca, foto/captura, menu do paciente e anamnese;
- envolve cadastro, alteracao e exclusao de paciente;
- conversa com backend e payloads sensiveis;
- tem mais de um fluxo visivel e nao e um recorte pequeno.

Conclusao:
- e um modulo possivel de modularizar no futuro;
- nao parece ser a melhor proxima frente depois da Agenda principal;
- um primeiro passo seguro seria apenas um contrato funcional documental, mas nao a implementacao imediata.

## 10. Analise de Conta corrente
`Conta corrente` aparece em blocos menores que `Ficha pessoal`, mas e bastante sensivel.

Caracteristicas observadas:

- nao existe modulo dedicado;
- trabalha com lancamentos, saldos, filtros, exclusao e impressao;
- depende de backend financeiro e payloads sensiveis;
- tem calculos e formacao de totais;
- inclui fluxo de caixa relacionado em outro bloco do `app.js`.

Conclusao:
- apesar de menor que `Ficha pessoal`, ainda e um dominio de alto risco;
- nao e o melhor candidato para ser a proxima frente.

## 11. Analise de Relatorios
`Relatorios` e um caso intermediario: nao e tao grande quanto `Ficha pessoal`, mas e transversal a varios dominios.

Caracteristicas observadas:

- nao ha modulo amplo dedicado ao fluxo principal de relatorios;
- ha blocos de preview, exportacao e impressao;
- os dados costumam vir de outros dominios e podem misturar varias fontes;
- ha saida visual e arquivo exportado, o que aumenta o custo de regressao;
- parte do ecossistema de etiquetas e relatorios ja possui arquivos separados, mas nao resolve o fluxo inteiro.

Conclusao:
- e mais modularizavel que um CRUD clinico enorme, mas ainda e delicado;
- nao e a melhor primeira escolha diante de `Preferencias / Configuracoes comuns`.

## 12. Analise de Indices financeiros
`Indices financeiros` e menor em tamanho do que `Ficha pessoal` ou `Conta corrente`, mas possui risco de negocio alto.

Caracteristicas observadas:

- nao ha modulo dedicado;
- envolve cotacoes, alteracao, exclusao e migracao de dados em uso;
- toca em regras de `financeiro`;
- a parte visual e pequena, mas a parte funcional e sensivel;
- um erro aqui pode ter impacto financeiro ou de integridade.

Conclusao:
- o bloco e menor, mas nao e de baixo risco;
- nao e minha recomendacao como proxima frente.

## 13. Analise de Preferencias / Configuracoes comuns
`Preferencias / Configuracoes comuns` e o bloco mais equilibrado entre os comparados.

Caracteristicas observadas:

- e uma frente comum, nao profissional-especifica;
- ja existe um modulo parcial em `frontend/js/modules/preferencias-opcoes-sistema.js`;
- o bloco no `app.js` e grande, mas bem segmentado por abas;
- ha definicoes padrao e helpers puros isolaveis;
- o risco de negocio e menor que em `Ficha pessoal`, `Conta corrente`, `Relatorios` e `Indices financeiros`;
- o teste manual e mais previsivel, por abas e por usuario.

Conclusao:
- e o melhor candidato para uma nova frente apos esta reavaliacao;
- e possivel comecar por contrato documental sem mexer em comportamento;
- e a melhor combinacao de menor risco, reaproveitamento e modularizacao ja iniciada.

## 14. Recomendacao objetiva
Recomendacao: **pausar temporariamente novas extracoes de codigo da `Agenda principal` e iniciar `Preferencias / Configuracoes comuns` como proxima frente documental/estrategica**.

Justificativa:

- os helpers restantes da `Agenda principal` estao mais sensiveis que os ja extraidos;
- `Ficha pessoal`, `Conta corrente`, `Relatorios` e `Indices financeiros` apresentam maior acoplamento funcional ou maior risco de negocio;
- `Preferencias / Configuracoes comuns` ja possui um modulo parcial e e uma frente comum, o que reduz o risco comparativo;
- a modularizacao conservadora ganha mais com uma frente que permita pequenos recortes puros e previsiveis.

## 15. Proxima subetapa recomendada
`Preferencias / Configuracoes comuns - Subetapa 1 - Contrato funcional e fronteiras documentais`

## 16. Itens explicitamente fora do escopo
- alterar qualquer arquivo de codigo;
- criar helper;
- criar modulo JS;
- implementar recorte funcional;
- reabrir `Agenda de contatos`;
- corrigir textos visiveis;
- corrigir mojibake;
- alterar backend, banco, schema, migrations, seeds, endpoints ou permissões.

## 17. Blindagem textual/mojibake
Nao houve correcoes textuais nesta etapa.
Se forem encontrados textos quebrados ou mojibake em qualquer frente comparada, isso deve ser apenas registrado para etapa futura, sem correcao aqui.

## 18. Registro para roadmap
- A reavaliacao foi feita apos a Subetapa 29 da `Agenda principal`.
- Nenhum codigo foi alterado.
- A `Agenda principal` ja tem nove helpers extraidos e validados.
- Os helpers restantes da `Agenda principal` foram considerados mais sensiveis.
- As frentes comparadas foram `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Preferencias / Configuracoes comuns` e outros cadastros auxiliares ja modularizados.
- A frente recomendada como proxima e `Preferencias / Configuracoes comuns`.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## 19. Commit seletivo obrigatorio
Arquivos autorizados para o commit seletivo desta etapa:
- `docs/fase_2_reavaliacao_pos_agenda_principal_comparacao_modulos.md`
- `docs/11_roadmap_desenvolvimento.md`

Mensagem sugerida:
`Reavalia proximos modulos apos agenda principal`

