# Recomendacao do proximo modulo apos a pausa de Usuarios/Admin e Simbolos Graficos

## 1. Objetivo da etapa

Registrar, de forma somente documental, qual deve ser o proximo modulo mais seguro para continuar a modularizacao conservadora do frontend do Brana Cloud, excluindo temporariamente Usuarios/Admin e Simbolos Graficos.

## 2. Estado atual apos as pausas

O estado atual da trilha e:

- Usuarios/Admin continua pausado apos a Subetapa 4, com risco medio no proximo candidato `usersRenderAdvanced()`;
- Simbolos Graficos continua pausado apos a retomada documental da Subetapa 0, porque `validarTipoMarcaSimbolo(valor)` ja esta extraido no modulo passivo e a integracao real no fluxo de modal/payload elevaria o risco;
- a continuidade agora precisa seguir por outro bloco, com fronteira clara, recorte pequeno e risco menor do que os dois modulos pausados.

## 3. Confirmacao de exclusao temporaria de Usuarios/Admin

Confirmado. Usuarios/Admin fica excluido temporariamente da recomendacao desta rodada.

## 4. Confirmacao de exclusao temporaria de Simbolos Graficos

Confirmado. Simbolos Graficos fica excluido temporariamente da recomendacao desta rodada.

## 5. Documentos consultados

Documentos de base e de contexto geral lidos nesta avaliacao:

- README.md
- README_WEB.md
- backend/README.md
- docs/00_master_guide.md
- docs/indice_oficial_contratos_regras_vigentes.md
- docs/11_roadmap_desenvolvimento.md
- docs/regras_blindagem_correcoes_textuais_mojibake.md
- docs/usuarios_admin_modularizacao_subetapa_4_diagnostico_proximo_recorte.md
- docs/simbolos_graficos_retomada_subetapa_0_diagnostico_validar_tipo_marca.md
- docs/recomendacao_proximo_modulo_pos_pausa_usuarios_admin.md

Documentos recentes de modularizacao e recomendacao considerados como contexto:

- docs/recomendacao_proximo_modulo_pos_auxiliares.md
- docs/recomendacao_proximo_modulo_pos_etiquetas.md
- docs/recomendacao_proximo_modulo_pos_convenios_planos.md
- docs/recomendacao_proximo_modulo_pos_materiais.md
- docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md
- docs/recomendacao_proximo_modulo_pos_prestadores.md
- docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md
- docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md
- docs/varredura_proximo_modulo_pos_medicamentos.md
- docs/varredura_proximo_modulo_pos_cid.md
- docs/varredura_proximo_modulo_pos_plano_contas.md
- docs/varredura_proximo_modulo_pos_intervencoes_auxiliares.md
- docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md
- docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md
- docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md
- docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md
- docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md
- docs/preferencias_opcoes_sistema_subetapa_8_reavaliacao_continuidade.md
- docs/preferencias_opcoes_sistema_subetapa_9_fechamento_reavaliacao_modulo.md

## 6. Arquivos tecnicos lidos

- frontend/app.js
- frontend/index.html
- frontend/js/modules/preferencias-opcoes-sistema.js
- frontend/js/modules/

## 7. Mapear o que ainda fica concentrado em frontend/app.js

O bloco de Preferencias e Opcoes do Sistema continua em duas faixas grandes de `frontend/app.js`:

- `pref*` aproximadamente entre as linhas 2242 e 2865;
- `sysOpt*` aproximadamente entre as linhas 2867 e 3111.

Ainda permanecem ali:

- abertura e fechamento dos modais;
- renderizacao visual de abas, combos e previews;
- coleta de payload;
- carregamento via `requestJson`;
- salvamento via `requestJson`;
- integracao com `sessaoAtual`;
- regras de admin para Opcoes do Sistema;
- binds e montagem de UI em runtime.

## 8. Estado do modulo existente

O arquivo modular existente em `frontend/js/modules/preferencias-opcoes-sistema.js` ja esta carregado no HTML e expoe helpers puros de apoio.

O que ja existe no modulo:

- `prefOdontoNorm`;
- `prefValoresPadraoModelos`;
- `prefOdontoFindByLabel`.

O que continua no `app.js`:

- `prefValoresPadrao*` e `prefAmbEstiloPadrao` como zona de defaults e contexto;
- `prefColetarPayload*`;
- `prefCarregarDados`;
- `prefSalvar*`;
- `prefEnsureUI`;
- `prefAbrir`;
- `sysOptColetarPayload`;
- `sysOptCarregar`;
- `sysOptSalvar`;
- `sysOptAbrir`;
- `sysOptEnsureUI`.

## 9. Lista dos modulos avaliados

### Candidatos avaliados nesta rodada

| Modulo | Risco | Justificativa resumida | Situacao |
|---|---|---|---|
| Preferencias e Opcoes do Sistema | Medio | Ja tem arquivo modular iniciado, helpers puros claros e um mapeamento documental proprio; ainda assim, a faixa de payload/salvamento e sistema global eleva o cuidado necessario. | **Recomendado** |
| Prestadores | Medio | Ha painel proprio, mas o bloco conversa com agenda, convenios, comissoes e perfis; o risco de efeito colateral e maior. | Nao recomendado agora |
| Convenios e Planos | Medio/alto | Depende de pacientes, prestadores, agenda e fluxo de exclusao segura. | Nao recomendado agora |
| Anamnese | Medio/alto | Area clinica sensivel, com duplicidade historica de blocos e dependencia da ficha/paciente. | Nao recomendado agora |
| Materiais | Alto | Lista, modais, tabelas, valores e vinculos cruzados. | Nao recomendado agora |
| Procedimentos Genericos | Alto | Toca materiais, editor, tabela e payloads sensiveis. | Nao recomendado agora |
| Intervencoes / Procedimentos | Alto | E o bloco mais pesado, com custos, reajuste, vinculos e material. | Nao recomendado agora |

### Modulos ja encerrados ou fora da rodada

| Modulo | Situacao | Motivo |
|---|---|---|
| CID | Encerrado | Ciclo seguro ja consolidado em rodada anterior. |
| Medicamentos | Encerrado | Ciclo seguro ja consolidado em rodada anterior. |
| Auxiliares / Tabelas auxiliares | Encerrado | Ciclo seguro ja consolidado em rodada anterior. |
| Etiquetas | Encerrado | Ciclo seguro ja consolidado em rodada anterior. |
| Plano de Contas | Encerrado | Ciclo seguro ja consolidado em rodada anterior. |

## 10. Justificativa do proximo modulo recomendado

O modulo recomendado e **Preferencias e Opcoes do Sistema**.

Justificativa:

- tem arquivo modular proprio ja iniciado em `frontend/js/modules/preferencias-opcoes-sistema.js`;
- ja possui helpers puros identificados e documentados;
- a Subetapa 0 documental ja existe e mapeou fronteiras, estados e riscos;
- ha recorte de helper/defaults que pode ser tratado com cautela antes de mexer em payload ou salvamento;
- comparado aos demais candidatos ainda abertos, e o que oferece a melhor combinacao entre fronteira conhecida e possibilidade de continuar de forma conservadora;
- os demais candidatos restantes ou sao mais sensiveis, ou mais amplos, ou mais acoplados a agenda, financeiro, procedimentos ou ficha clinica.

## 11. Primeira subetapa recomendada para esse modulo

Primeira subetapa recomendada:

- Subetapa 0 documental de Preferencias e Opcoes do Sistema, focada apenas em mapear helpers puros, zonas de defaults e fronteiras de `pref*` / `sysOpt*`.

## 12. O que deve ficar fora da primeira subetapa

Ficam fora desta primeira subetapa:

- `prefColetarPayload*`;
- `prefCarregarDados`;
- `prefSalvar*`;
- `prefEnsureUI`;
- `prefAbrir`;
- `sysOptColetarPayload`;
- `sysOptCarregar`;
- `sysOptSalvar`;
- `sysOptAbrir`;
- `sysOptEnsureUI`;
- qualquer regra de permissao ou admin ligada a Opcoes do Sistema;
- qualquer alteracao em `sessaoAtual`;
- qualquer mudanca em backend, banco, seeds, HTML ou textos visiveis;
- qualquer correcao textual ou de mojibake;
- qualquer tentativa de integrar agora o bloco visual inteiro.

## 13. O que deve entrar em commit depois desta etapa documental

Se esta recomendacao for seguida por uma nova trilha, o commit futuro deve conter apenas o pacote minimo da nova subetapa:

- o codigo realmente extraido;
- o wrapper fino, se necessario;
- o documento da subetapa correspondente;
- sem incluir backend, banco, seeds, roadmap ou outros modulos.

## 14. O que deve entrar no roadmap se o novo modulo for iniciado

Se Preferencias e Opcoes do Sistema for iniciado de fato, o roadmap deve registrar apenas:

- qual helper ou fronteira foi escolhida;
- que o recorte inicial foi documental e conservador;
- que nao houve impacto em Usuarios/Admin, Simbolos Graficos, backend, banco, seeds ou permissao;
- onde validar manualmente depois de uma alteracao futura.

## 15. Onde testar depois de uma futura alteracao de codigo

Depois de qualquer alteracao futura neste modulo, testar:

1. Abrir `Preferencias...`.
2. Abrir `Opcoes do sistema...`.
3. Trocar abas e confirmar renderizacao.
4. Conferir os helpers de defaults e normalizacao.
5. Verificar fechamento e reabertura do modal.
6. Confirmar que o console continua sem erros novos.
7. Confirmar que o caminho de abertura pelo painel de usuarios continua coerente.

## 16. Blindagem textual e mojibake

A blindagem textual foi respeitada.

- nenhum texto visivel foi corrigido;
- nenhum acento foi reescrito;
- nenhum placeholder foi alterado;
- qualquer mojibake observado foi mantido sem alteracao.

## 17. Confirmacoes finais

- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend, banco e seeds nao foram alterados.
- `docs/11_roadmap_desenvolvimento.md` nao foi alterado.
- Usuarios/Admin ficou temporariamente excluido da recomendacao.
- Simbolos Graficos ficou temporariamente excluido da recomendacao.
- Esta etapa e apenas documental.
