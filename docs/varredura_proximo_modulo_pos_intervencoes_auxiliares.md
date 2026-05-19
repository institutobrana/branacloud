# Varredura do proximo modulo apos Intervencoes / Auxiliares

## 1. Objetivo da varredura

- Escolher, de forma somente documental, o proximo modulo mais seguro para continuar a modularizacao conservadora do frontend.
- Reavaliar candidatos conhecidos sem reiniciar ciclos ja consolidados.
- Evitar qualquer alteracao funcional, estrutural ou textual no codigo.

## 2. Branch e diretorio verificados

- Branch: `modularizacao-segura-fase-1`
- Diretorio real: `D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Checks iniciais executados

Checks de auditoria executados antes da escrita deste documento:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -14`
- `git diff --stat`
- `git diff --cached --stat`
- listagem de `docs/`
- listagem de `frontend/js/modules/`
- buscas textuais em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules/` e `docs/`

Resultado resumido:

- branch correta confirmada
- nenhum arquivo staged
- ha varios `??` antigos em `docs/` ja existentes no working tree
- nao havia diff tracked ativo antes da criacao deste documento

## 4. Ultimo commit consolidado

- `95a720f Documenta retomada de Auxiliares apos Intervencoes`

## 5. Modulos excluidos nesta rodada

### Excluidos por instrucao direta desta varredura

- `Intervencoes / Procedimentos` - acabou de ser pausado e nao deve ser retomado agora.
- `Auxiliares / Tabelas auxiliares` - ciclo ja consolidado ate Subetapa 5; nao deve ser reiniciado.
- `Procedimentos Genericos` - acoplamento com vinculos, custos e Intervencoes.
- `Materiais` - depende de vinculos, listas, indices e pode tocar custo/preco.
- `Convenios e Planos` - envolve cobranca e dependencias amplas.
- `Editor de Textos` - motor complexo e sensivel.
- `Agenda` - regras de data/atendimento e integracoes externas.
- `Indices financeiros` - risco de reajuste, custo, preco e calculo.
- `Cenario financeiro` - area financeira sensivel e acoplada a calculos.

### Justificativa curta

- Esses blocos sao mais sensiveis, mais amplos ou ja foram descartados/pausados recentemente.
- Nesta rodada, nao faz sentido reabrir `Auxiliares` nem retornar para `Intervencoes`.

## 6. Modulos candidatos avaliados

### 6.1 Prestadores

- Documentacao anterior existe:
  - `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
  - `docs/prestadores_subetapa_1_namespace_passivo.md`
  - `docs/prestadores_subetapa_2_fronteiras_contratos.md`
  - `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
  - `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
  - `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- Modulo JS existe:
  - `frontend/js/modules/prestadores.js`
- Estado aparente no `app.js`:
  - fluxo funcional ainda existe em `app.js`
  - wrapper local e fallback ja foram feitos
  - mini ciclo ja foi encerrado
- Risco principal:
  - o ciclo ja esta consolidado; nao e bom ponto de reentrada agora
- Proxima etapa documental possivel:
  - somente retomada/validacao se houvesse uma nova rodada especifica, nao como nova escolha de modulo
- Classificacao:
  - **descartado como novo alvo desta rodada**

### 6.2 Etiquetas

- Documentacao anterior existe:
  - `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
  - `docs/etiquetas_subetapa_1_namespace_passivo.md`
  - `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
  - `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
  - `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
  - `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
  - `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
  - `docs/etiquetas_subetapa_4_validacao_helpers.md`
  - `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- Modulo JS existe:
  - `frontend/js/modules/etiquetas.js`
- Estado aparente no `app.js`:
  - wrappers/minima integracao ja existem
  - ciclo de helpers esta encerrado
- Risco principal:
  - fronteira ja trabalhada e ciclo fechado; nao e o melhor alvo para reabrir agora
- Proxima etapa documental possivel:
  - apenas retomada especifica, nao nova escolha de modulo
- Classificacao:
  - **descartado como novo alvo desta rodada**

### 6.3 Anamnese

- Documentacao anterior existe:
  - `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
  - `docs/anamnese_subetapa_1_namespace_passivo.md`
  - `docs/anamnese_subetapa_2_fronteiras_contratos.md`
  - `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
  - `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
  - `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
  - `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
  - `docs/anamnese_correcao_duplo_clique_pergunta.md`
  - `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- Modulo JS existe:
  - `frontend/js/modules/anamnese.js`
- Estado aparente no `app.js`:
  - integrações minimas ja foram feitas
  - ciclo textual ficou encerrado
- Risco principal:
  - modulo ja consolidado e sensivel por fluxo clinico
- Proxima etapa documental possivel:
  - apenas retomada especifica, nao nova escolha de modulo
- Classificacao:
  - **descartado como novo alvo desta rodada**

### 6.4 Medicamentos

- Documentacao anterior existe:
  - `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
  - `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
  - `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
  - `docs/medicamentos_subetapa_3_helpers_textuais_puros.md`
  - `docs/medicamentos_subetapa_4_integracao_validacao_nome.md`
  - `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- Modulo JS existe:
  - `frontend/js/modules/medicamentos.js`
- Estado aparente no `app.js`:
  - fluxo principal ja tem integracao minima e o ciclo foi fechado
- Risco principal:
  - ciclo ja consolidado; nao vale reabrir como proximo alvo
- Proxima etapa documental possivel:
  - apenas retomada especifica
- Classificacao:
  - **descartado como novo alvo desta rodada**

### 6.5 Plano de Contas

- Documentacao anterior existe:
  - `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
  - `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
  - `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
  - `docs/plano_contas_subetapa_3_helpers_puros.md`
  - `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
  - `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- Modulo JS existe:
  - `frontend/js/modules/plano-contas.js`
- Estado aparente no `app.js`:
  - wrappers/fallbacks e fluxo funcional ja ficaram estabilizados
- Risco principal:
  - ciclo fechado; nao e ponto natural de reentrada agora
- Proxima etapa documental possivel:
  - apenas retomada especifica
- Classificacao:
  - **descartado como novo alvo desta rodada**

### 6.6 Simbolos Graficos

- Documentacao anterior existe:
  - `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
  - `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
  - `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
  - `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
  - `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
  - `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
  - `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
  - `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- Modulo JS existe:
  - `frontend/js/modules/simbolos-graficos.js`
- Estado aparente no `app.js`:
  - bloco grande, com biblioteca visual, modal, editor embutido e integracao rica
- Risco principal:
  - editor/iframe/mensageria e fluxo visual fragil
- Proxima etapa documental possivel:
  - possivel retomada especifica, mas nao como escolha mais segura desta rodada
- Classificacao:
  - **cautela / descartado para esta rodada**

### 6.7 Preferencias e Opcoes do Sistema

- Documentacao modular anterior especifica nao foi encontrada.
- Existem referencias gerais em:
  - `docs/04_funcionalidades.md`
  - `docs/11_roadmap_desenvolvimento.md`
  - `docs/02_arquitetura.md`
  - `docs/frontend_auditoria_appjs.md`
- Modulo JS modularizado em `frontend/js/modules` nao foi encontrado.
- Estado aparente no `app.js`:
  - ha um bloco proprio para preferencias do usuario e opcoes do sistema
  - funcoes identificadas incluem `prefEnsureUI()`, `prefAbrir()`, `prefCarregarDados()`, `prefSalvarGeral()`, `prefSalvarModelos()`, `prefSalvarAmbiente()`, `prefSalvarDados()`, `prefSalvarOdontograma()`, `sysOptEnsureUI()`, `sysOptAbrir()`, `sysOptCarregar()`, `sysOptSalvar()` e correlatas
  - ha menu dedicado em `frontend/index.html` para `Preferencias...` e `Opcoes do sistema...`
- Risco principal:
  - o painel abrange varias abas, payloads de configuracao e opcoes que podem afetar comportamento do sistema
- Proxima etapa documental possivel:
  - sim, permite Subetapa 0 documental sem mexer em codigo
- Classificacao:
  - **recomendado**

### 6.8 Usuarios, perfis e permissoes

- Documentacao de modularizacao especifica nao foi encontrada.
- Estado aparente no `app.js`:
  - bloco grande, com modal, permissao, grant protegido, senha e perfis
- Risco principal:
  - acesso ao sistema, permissoes e fluxo protegido
- Proxima etapa documental possivel:
  - sim, mas o risco e maior que o de Preferencias
- Classificacao:
  - **descartado por risco**

### 6.9 Superadmin da plataforma

- Documentacao modular especifica nao foi encontrada.
- Estado aparente no `app.js`:
  - area de administracao de plataforma e atravessa clinicas
- Risco principal:
  - altissimo impacto e atravesse clinicas
- Proxima etapa documental possivel:
  - possivel, mas nao recomendado como proximo passo seguro
- Classificacao:
  - **descartado por risco**

### 6.10 Licenca

- Documentacao modular especifica nao foi encontrada.
- Estado aparente no `app.js`:
  - fluxo de licenca, checkout e sincronizacao
- Risco principal:
  - integracao externa e pagamento
- Proxima etapa documental possivel:
  - possivel, mas nao recomendado agora
- Classificacao:
  - **descartado por risco**

## 7. Mapa comparativo resumido

| Candidato | Documentacao modular anterior | Modulo JS existe | Estado aparente no app.js | Risco principal | Nova etapa documental | Classificacao |
|---|---|---|---|---|---|---|
| Prestadores | sim | sim | ciclo encerrado | reentrada desnecessaria | nao como novo alvo | descartado |
| Etiquetas | sim | sim | ciclo encerrado | reentrada desnecessaria | nao como novo alvo | descartado |
| Anamnese | sim | sim | ciclo encerrado | fluxo clinico sensivel | nao como novo alvo | descartado |
| Medicamentos | sim | sim | ciclo encerrado | ciclo ja consolidado | nao como novo alvo | descartado |
| Plano de Contas | sim | sim | ciclo encerrado | ciclo ja consolidado | nao como novo alvo | descartado |
| Simbolos Graficos | sim | sim | editor visual rico | iframe/editor | possivel, mas com cautela | cautela |
| Preferencias e Opcoes do Sistema | nao especifica modularizacao anterior | nao encontrado | bloco proprio com varias funcoes e menus | opcoes que podem afetar comportamento do sistema | sim | recomendado |
| Usuarios, perfis e permissoes | nao especifica modularizacao anterior | nao encontrado | bloco grande e protegido | acesso/permissoes | sim, mas com risco maior | descartado |
| Superadmin | nao especifica modularizacao anterior | nao encontrado | administracao de plataforma | atravessa clinicas | sim, mas com alto risco | descartado |
| Licenca | nao especifica modularizacao anterior | nao encontrado | checkout/sincronizacao | pagamento/integracao externa | sim, mas com alto risco | descartado |

## 8. Modulo recomendado como proximo

- `Preferencias e Opcoes do Sistema`

## 9. Justificativa objetiva da recomendacao

- Existe fronteira de menu e painel proprio no frontend.
- Ha bloco dedicado no `app.js` com nomes de funcoes concentrados em `pref*` e `sysOpt*`.
- Nao ha modulo JS modularizado em `frontend/js/modules` para esse bloco.
- Nao ha documentacao modular anterior especifica para esse dominio.
- A area parece menor e mais isolavel do que usuarios, superadmin, licenca, agenda, editor e financeiro.
- Permite uma primeira etapa somente documental sem tocar em backend, banco, endpoints ou payloads.

## 10. Riscos conhecidos do modulo recomendado

- O bloco abrange varias abas e varias familias de configuracao.
- Algumas opcoes podem alterar comportamento do sistema e controles de seguranca.
- Existe risco de regressao visual se layout/telas forem mexidos cedo demais.
- Ha payloads variados para preferencias gerais, modelos, ambiente, dados do usuario e odontograma.
- A area de opcoes do sistema pode afetar controle de usuarios, entao nao deve ser tratada como simples demais.

## 11. Primeira etapa recomendada para o modulo escolhido

- Como nao foi encontrado historico modular especifico, a primeira etapa recomendada e **Subetapa 0 documental**.
- Sem codigo.
- Sem HTML.
- Sem backend.
- Sem banco.
- Sem endpoints.
- Sem payload.
- Sem salvamento.

## 12. O que nao fazer na proxima etapa

- nao criar modulo JS novo agora
- nao mover codigo funcional
- nao alterar `frontend/app.js`
- nao alterar `frontend/index.html`
- nao alterar `frontend/js/modules`
- nao alterar backend
- nao alterar banco/schema/migrations
- nao alterar endpoints
- nao alterar payload
- nao alterar salvamento
- nao alterar custos, reajuste ou integracoes externas
- nao corrigir textos, labels ou mojibake

## 13. Checks recomendados para a proxima etapa

Se a decisao for seguir com `Preferencias e Opcoes do Sistema`, os checks iniciais recomendados sao:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -14`
- `git diff --stat`
- `git diff --cached --stat`
- localizar as funcoes `pref*` e `sysOpt*` no `frontend/app.js`
- confirmar o carregamento dos menus em `frontend/index.html`
- confirmar ausencia de modulo JS em `frontend/js/modules`
- mapear DOM, eventos, payloads e riscos sem alterar nada

## 14. Confirmacao de que nenhuma alteracao funcional foi feita

- Nenhuma alteracao funcional foi feita nesta etapa.
- Nenhum arquivo JS foi modificado.
- Nenhum HTML foi modificado.
- Nenhum backend foi modificado.
- Nenhum banco/schema/migration foi modificado.
- Nenhum endpoint foi modificado.
- Nenhum payload foi modificado.
- Nenhum salvamento foi modificado.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum reajuste real foi executado.
- Nenhum comando `git add`, `git commit`, `git push`, `git clean`, `git reset` ou `git restore` foi executado.
- Nada foi criado, editado, salvo, documentado, copiado, movido, renomeado ou apagado nas pastas proibidas.
- A blindagem textual/mojibake foi respeitada.

