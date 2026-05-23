# Auditoria detalhada dos grupos B/C/D de untracked restantes

## 1. Objetivo
Classificar os arquivos untracked restantes dos grupos B, C e D, comparar com a documentacao ja versionada e recomendar o destino seguro de cada item sem alterar codigo, banco, README, indice, roadmap ou .gitignore.

## 2. Contexto
O projeto Brana Cloud ja passou pelas trilhas principais de correcao, validacao e documentacao:

- 5c8ef7a - Corrige login, senha interna e perfis de usuarios
- 8c1f7c5 - Corrige seed canonico Brana no signup
- cb20715 - Documenta exclusao segura da clinica 15
- 9c4df78 - Documenta exclusoes seguras de clinicas de teste
- 680749d - Documenta validacao final do signup com Brana
- 58c913d - Audita documentacao geral do Brana Cloud
- a513b67 - Atualiza indice e roadmap documental
- 0701705 - Atualiza READMEs do Brana Cloud
- 579a76d - Documenta triagem dos untracked restantes

Esta auditoria fecha o bloco B/C/D da triagem anterior e separa o que e contrato, regra, auditoria, historico, evidencia tecnica ou candidato a limpeza futura.

## 3. Branch e estado Git
- Branch atual: `modularizacao-segura-fase-1`
- Estado Git inicial: apenas arquivos untracked antigos e fora do fluxo principal; nenhum tracked modificado
- Git recente de referencia:
  - `579a76d Documenta triagem dos untracked restantes`
  - `0701705 Atualiza READMEs do Brana Cloud`
  - `a513b67 Atualiza indice e roadmap documental`
  - `58c913d Audita documentacao geral do Brana Cloud`
  - `680749d Documenta validacao final do signup com Brana`
  - `9c4df78 Documenta exclusoes seguras de clinicas de teste`
  - `cb20715 Documenta exclusao segura da clinica 15`
  - `8c1f7c5 Corrige seed canonico Brana no signup`
  - `5c8ef7a Corrige login, senha interna e perfis de usuarios`

## 4. Metodologia
Para cada arquivo do bloco B/C/D:

1. Ler o arquivo em modo somente leitura.
2. Comparar com documentos ja versionados e com o indice oficial.
3. Identificar se o conteudo e contrato, regra, auditoria, plano, evidencia tecnica ou historico.
4. Medir risco de ignorar e risco de commitar sem revisao.
5. Indicar destino seguro: commit futuro, consolidacao, historico, revisao humana ou limpeza futura.

Documentos versionados usados como base de comparacao:

- `README.md`
- `README_WEB.md`
- `backend/README.md`
- `docs/00_master_guide.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`
- `docs/triagem_untracked_restantes_pos_documentacao_principal.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- documentos ja commitados das trilhas Brana / usuarios / exclusoes seguras / materiais

## 5. Arquivos auditados
Foram auditados 10 arquivos principais:

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`
- `docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`

## 6. Auditoria arquivo por arquivo

### 6.1 `docs/contrato_exclusao_segura_contas_clinicas.md`
- Grupo: B
- Tipo: contrato / regra permanente
- Resumo: contrato completo de exclusao segura de contas e clinicas; exige identificacao por `clinica_id` + `expected_email`, backup, dry-run, `--execute`, transacao, rollback, validacao pos-exclusao e preservacao de outras clinicas e catalogos globais.
- Modulos envolvidos: exclusao segura, usuarios, prestadores, email_codes, multi-tenant, backup/restore.
- Comparacao com docs versionados: o indice oficial, README e backend/README ja citam este contrato como referencia obrigatoria; o conteudo nao esta duplicado por outra doc versionada. E um contrato novo e relevante, nao um mero historico.
- Risco de ignorar: futuros runners podem divergir do contrato seguro, criando risco de DELETE manual ou limpeza incompleta.
- Risco de commitar sem revisao: medio, porque precisa bater com os runners ja usados nas clinicas 8/9/10/15.
- Recomendacao: commit futuro separado como contrato/regra vigente.

### 6.2 `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- Grupo: B
- Tipo: inventario / indice organizacional
- Resumo: inventario grande da documentacao, com classificacao por familias de documentos, fontes de verdade, historico e mapa de modulos.
- Modulos envolvidos: docs gerais, usuarios, seeds, exclusao segura, materiais, intervencoes, anamnese, SQLServer, restauracao.
- Comparacao com docs versionados: o indice oficial ja cobre a estrutura macro; este inventario adiciona visao mais detalhada e ampla. Ha sobreposicao, mas nao duplicacao exata.
- Risco de ignorar: perde-se um mapa documental mais rico para organizacao futura.
- Risco de commitar sem revisao: medio, porque mistura inventario vigente com bastante material historico.
- Recomendacao: consolidar antes de commit, ou separar em commit futuro de inventario organizado.

### 6.3 `docs/indice_usuarios_access_profile_perfis_acesso.md`
- Grupo: B
- Tipo: indice / guia de modulo
- Resumo: indice especifico do modulo Usuarios/access_profile/Perfis de acesso, com regras consolidadas e trilha de apoio.
- Modulos envolvidos: usuarios, access_profile, perfis, signup, bootstrap, UI.
- Comparacao com docs versionados: o documento complementa o indice oficial e o plano tecnico de access_profile; parte do conteudo e apoiada por `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`, `README.md` e `backend/README.md`, mas este indice especifico ainda nao esta coberto por um documento versionado equivalente.
- Risco de ignorar: a trilha do modulo pode perder um mapa pratico de leitura.
- Risco de commitar sem revisao: medio, pois ha sobreposicao com o plano tecnico e com o indice oficial.
- Recomendacao: consolidar antes de commit; se versionado, que seja em trilha separada de organizacao documental do modulo.

### 6.4 `docs/frontend_correcao_mojibake_textos_interface.md`
- Grupo: B
- Tipo: auditoria/fechamento historico de UI textual
- Resumo: registra a correcao textual de strings quebradas por mojibake no frontend, com lista de ocorrencias corrigidas e o que foi deixado intencionalmente fora.
- Modulos envolvidos: frontend, textos visiveis, menus e rotulos.
- Comparacao com docs versionados: a regra permanente de blindagem ja existe em `docs/regras_blindagem_correcoes_textuais_mojibake.md`; este arquivo e o historico da correcao realizada, nao a regra.
- Risco de ignorar: perde-se a memoria da correcao textual feita na interface.
- Risco de commitar sem revisao: baixo a medio, porque nao altera comportamento, mas nao deve ser tratado como contrato.
- Recomendacao: virar historico, nao contrato; se versionado, manter em trilha separada de validação textual.

### 6.5 `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`
- Grupo: C
- Tipo: auditoria Git / organizacao
- Resumo: fotografia do Git antes do teste manual combinado dos Problemas 1 e 2, com 8 tracked modificados e varios untracked.
- Modulos envolvidos: login/senha interna/perfis e seed Brana/signup.
- Comparacao com docs versionados: o conteudo e historico organizacional. O commit history hoje ja mostra as trilhas separadas, mas a auditoria preserva a classificacao previa e o risco de mistura.
- Risco de ignorar: perde-se a trilha de como a organizacao de commits foi definida.
- Risco de commitar sem revisao: baixo, porque nao muda comportamento, mas e historico importante.
- Recomendacao: commit futuro separado como auditoria/historico.

### 6.6 `docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md`
- Grupo: C
- Tipo: auditoria Git / organizacao
- Resumo: fotografia do estado Git apos a exclusao segura da clinica 15, antes da organizacao seletiva dos commits.
- Modulos envolvidos: organizacao documental, exclusao segura, login, seed Brana, auditoria.
- Comparacao com docs versionados: complementa a trilha de commits seletivos e nao existe substituto equivalente ja versionado.
- Risco de ignorar: perde-se o historico do momento em que a base ficou pronta para commit seletivo.
- Risco de commitar sem revisao: baixo a medio, historico importante.
- Recomendacao: commit futuro separado como auditoria/historico.

### 6.7 `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- Grupo: D
- Tipo: auditoria / validacao de modulo
- Resumo: roteiro manual dos fluxos sensiveis de Intervencoes / Procedimentos antes de extracao passiva ou refatoracao.
- Modulos envolvidos: Materiais, Procedimentos Genericos, Intervencoes, frontend, console/rede.
- Comparacao com docs versionados: o contrato funcional de Materiais/Procedimentos Genericos/Intervencoes ja esta versionado; esta subetapa registra criterios de validacao manual e bloqueios, mas nao e a fonte principal da regra.
- Risco de ignorar: perde-se o roteiro de validacao manual de fluxos sensiveis.
- Risco de commitar sem revisao: baixo, historico e apoio funcional.
- Recomendacao: manter como auditoria/historico importante; commit futuro separado se houver trilha documental do modulo.

### 6.8 `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- Grupo: D
- Tipo: plano de execucao / especificacao futura
- Resumo: plano para a aplicacao real do reajuste de tabela, com endpoint `POST`, confirmacao forte, transacao, rollback, preview hash opcional, amostra before/after e escopo restrito a `preco` e `valor_repasse`.
- Modulos envolvidos: Procedimentos, backend, frontend, reajuste em massa, auditoria.
- Comparacao com docs versionados: a fase B1 de preview ja foi consolidada; este doc define a futura B2 funcional. Ele vai alem de um simples historico e deveria ser absorvido em um contrato/plano oficial antes de qualquer commit funcional.
- Risco de ignorar: a futura implementacao pode perder a restricao de seguranca e o plano de rollback.
- Risco de commitar sem revisao: medio a alto, pois define comportamento futuro sensivel de alteracao em massa.
- Recomendacao: consolidar antes de commit ou virar documento oficial separado da futura B2 funcional.

### 6.9 `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- Grupo: D
- Tipo: CSV tecnico / evidencia bruta
- Resumo: detalhe linha a linha dos vinculos de materiais do caso 5000 / PARTICULAR versus o footprint do genérico 00205 - Botox.
- Modulos envolvidos: Materiais, Procedimentos Genericos, Intervencoes / Procedimentos.
- Comparacao com docs versionados: o conteudo narrativo principal ja esta em `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.md`, que e versionado. O CSV e a materia prima da evidência.
- Risco de ignorar: perde-se a evidência bruta do caso, mas o markdown versionado preserva o resumo tecnico.
- Risco de commitar sem revisao: alto, porque e dado bruto, grande e sujeito a drift entre snapshots.
- Recomendacao: candidato a limpeza futura ou mantido apenas como anexo tecnico fora do fluxo principal; nao precisa entrar no commit documental agora.

### 6.10 `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`
- Grupo: D
- Tipo: CSV tecnico / relatorio bruto
- Resumo: lista 224 procedimentos com `procedimento_generico_id` nulo/vazio e materiais vinculados, com classificacao `seguro provavel`, `revisao manual` e `nao saneavel automaticamente`.
- Modulos envolvidos: Materiais, Procedimentos Genericos, Intervencoes / Procedimentos.
- Comparacao com docs versionados: a versao narrativa principal esta em `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.md`, que ja esta versionado. O CSV e evidencia bruta auxiliar.
- Risco de ignorar: perde-se a base tabular do relatorio.
- Risco de commitar sem revisao: alto, porque e um extrato tecnico grande que ja tem contraparte em markdown.
- Recomendacao: candidato a limpeza futura ou anexo tecnico; manter fora do commit principal.

## 7. Comparacao com a documentacao ja versionada

### Cobertura ja existente
- `docs/contrato_exclusao_segura_contas_clinicas.md` e citado no indice oficial, README e backend/README.
- `docs/regras_blindagem_correcoes_textuais_mojibake.md` ja cobre a regra permanente de nao corrigir mojibake fora de trilha.
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md` ja e a fonte funcional principal para Materiais / Procedimentos Genericos / Intervencoes.
- `docs/indice_oficial_contratos_regras_vigentes.md` ja organiza a base geral e cita `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`.
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md` e a base versionada mais proxima do bloco de access_profile/perfis.
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.md` e `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.md` ja preservam, em Markdown, o conteudo principal dos CSVs brutos.

### Lacunas identificadas
- Falta um documento versionado separado e claro para o contrato de exclusao segura como artefato standalone.
- Falta consolidacao final do inventario organizacional em formato mais enxuto.
- Falta um indice de modulo mais curado para usuarios/access_profile/perfis.
- Falta decisao formal sobre o plano B2 de reajuste de tabela.

## 8. Contratos e regras encontrados
Documentos do bloco B/C/D que carregam regra ou contrato importante:

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/frontend_correcao_mojibake_textos_interface.md` (historico da correcao, nao regra)

## 9. Riscos de ignorar
- `contrato_exclusao_segura_contas_clinicas.md`: risco de runners futuros divergirem do protocolo seguro.
- `inventario_organizacional_contratos_regras_seeds_usuarios.md`: risco de perder um mapa amplo da documentacao.
- `indice_usuarios_access_profile_perfis_acesso.md`: risco de deixar o modulo Usuarios sem um mapa documental dedicado.
- `frontend_correcao_mojibake_textos_interface.md`: risco de perder o historico da correcao textual do frontend.
- `auditoria_git_*`: risco de perder a trilha de organizacao dos commits seletivos.
- `intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`: risco de esquecer os bloqueios e fluxos sensiveis ja observados.
- `intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`: risco de a futura implementacao de reajuste de tabela perder os freios de seguranca.
- CSVs: risco de perder a evidencia bruta, embora os MDs versionados preservem o resumo principal.

## 10. Riscos de commitar sem revisao
- contratos podem ser versionados com sobreposicao ou duplicidade desnecessaria;
- inventarios podem ficar grandes demais e misturar historico com fonte de verdade;
- documentos de apoio podem ser tratados como regra sem serem regra;
- CSVs podem poluir o historico com dados brutos que ja estao resumidos em Markdown;
- o plano B2 de reajuste de tabela pode entrar como se fosse regra final sem ser.

## 11. Matriz de decisao

| arquivo | grupo | tipo | importancia | ja coberto por docs versionados? | contem regra/contrato? | acao recomendada | prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `docs/contrato_exclusao_segura_contas_clinicas.md` | B | contrato / regra permanente | alta | parcial | sim | commit futuro separado | alta |
| `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md` | B | inventario / indice | media-alta | parcial | nao | consolidar antes de commit | media-alta |
| `docs/indice_usuarios_access_profile_perfis_acesso.md` | B | indice / guia de modulo | media-alta | parcial | nao | consolidar antes de commit | media |
| `docs/frontend_correcao_mojibake_textos_interface.md` | B | auditoria/historico textual | media | sim, pela regra de blindagem | nao | virar historico / commit futuro separado | baixa-media |
| `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md` | C | auditoria Git | media | nao | nao | commit futuro separado | media |
| `docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md` | C | auditoria Git | media | nao | nao | commit futuro separado | media |
| `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md` | D | auditoria / validacao | media | parcial | nao | manter como historico importante | media |
| `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md` | D | plano de execucao futura | alta | parcial | sim | consolidar antes de commit | alta |
| `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv` | D | CSV tecnico / evidencia bruta | media | sim, pelo MD versionado | nao | candidato a limpeza futura | baixa |
| `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv` | D | CSV tecnico / relatorio bruto | media | sim, pelo MD versionado | nao | candidato a limpeza futura | baixa |

## 12. Proximos commits recomendados
1. Commit futuro separado do contrato de exclusao segura, caso o objetivo seja elevar o arquivo a contrato standalone versionado.
2. Commit futuro separado da organizacao documental de usuarios/access_profile, se o indice de modulo for mantido.
3. Commit futuro separado das auditorias Git, por rastreabilidade historica.
4. Commit futuro separado do plano B2 de reajuste de tabela, apenas apos consolidacao com o contrato funcional apropriado.
5. Nao commitar os CSVs brutos sem necessidade clara; eles podem ficar como evidencia auxiliar ou candidatos a limpeza futura.

## 13. Arquivos que exigem decisao humana
Exigem revisao humana antes de qualquer commit:

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`

## 14. Conclusao
- O bloco B/C/D nao e lixo; ele mistura contratos, indices, auditorias, validacoes, planos e evidencias tecnicas.
- O contrato de exclusao segura e o plano B2 de reajuste de tabela merecem tratamento cuidadoso.
- Os audios Git sao historicos importantes.
- Os CSVs sao evidencia bruta e podem permanecer fora do commit principal porque ja existem relatorios Markdown versionados.
- O documento de mojibake e historico da correcao textual, nao contrato.

## 15. Confirmacao final
Nesta etapa, nada foi alterado alem deste documento novo. Nenhum codigo, banco, README, contrato, indice, roadmap ou .gitignore foi modificado.
