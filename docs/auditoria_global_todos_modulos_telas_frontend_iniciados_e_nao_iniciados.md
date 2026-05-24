# Auditoria global ampliada de módulos e telas do frontend

## 1. Objetivo da auditoria global ampliada
Registrar, em uma visão única e conservadora, todos os módulos e telas identificáveis no frontend do Brana Cloud, separando o que já está iniciado em `frontend/js/modules/`, o que ainda está concentrado em `frontend/app.js`, o que aparece em `frontend/index.html`, o que está documentado e o que continua sem arquivo modular.

## 2. Motivo da auditoria
A trilha recente mostrou um problema recorrente: recomendações aparentemente seguras acabaram caindo em módulos já iniciados, muito avançados ou já pausados. Isso aconteceu com `Usuários/Admin`, `Símbolos Gráficos` e `Preferências e Opções do Sistema`. Esta auditoria existe para evitar nova falsa partida.

## 3. Estado atual após o commit `26691be`

- `26691be — Documenta auditoria global dos modulos frontend`
- não houve alteração de código nesta rodada;
- `frontend/app.js` e `frontend/index.html` seguem intactos;
- `frontend/js/modules/` segue intacto;
- backend, banco, seeds e roadmap seguem intactos;
- textos visíveis e mojibake foram preservados;
- continuam apenas os untracked antigos fora da trilha principal.

## 4. Lista real dos arquivos existentes em `frontend/js/modules/`

```text
anamnese.js
auxiliares.js
cid.js
convenios-planos.js
etiquetas.js
intervencoes-procedimentos.js
materiais.js
medicamentos.js
plano-contas.js
preferencias-opcoes-sistema.js
prestadores.js
procedimentos-genericos.js
simbolos-graficos.js
unidades.js
users-admin-modal-visual.js
```

## 5. Módulos e telas identificados em `frontend/app.js`

### 5.1. Áreas já claramente presentes no `app.js`

- `Usuários/Admin`
- `Superadmin`
- `Materiais`
- `Intervenções / Procedimentos`
- `Preferências e Opções do Sistema`
- `Símbolos Gráficos`
- `Anamnese`
- `Medicamentos`
- `Convênios e Planos`
- `Prestadores`
- `Unidades`
- `Procedimentos Genéricos`
- `CID`
- `Tabelas auxiliares`
- `Ficha pessoal / Paciente`
- `Agenda`
- `Conta corrente / Financeiro`
- `Relatórios`
- `Plano de contas`
- `Cenário anual / cenário financeiro`
- `Índices financeiros`
- `Editor de textos`
- `Licença`
- `Sobre`
- `Dashboard`
- `Cadastro / sessão / login / desconectar`
- `Tabela de protéticos / Controle de protéticos`
- `Ferramentas auxiliares` como `Editor MS Word`, `EasyCapture`, `Slide Show`, `Auditoria`, `Usuários conectados` e `Chat`

### 5.2. Blocos ainda concentrados em `app.js`

- `users*`
- `pref*`
- `sysOpt*`
- `simbolos*`
- `anamnese*`
- `materiais*`
- `procedimentos*` / `proc*`
- `prestadores*`
- `unidades*`
- `pgen*`
- `cid*`
- `aux*`
- `convPlan*`
- `plano*`
- `cc*`
- `fcx*`
- `dash*`
- `agenda*`
- `editorTextos*`
- `prot*`
- `ctrlProt*`
- `licenca*`
- `superadmin*`
- `ficha*`

## 6. Módulos e telas identificados em `frontend/index.html`

### 6.1. Menus e ações visíveis

- `cadastro-conectar`
- `cadastro-desconectar`
- `cadastro-novo-paciente`
- `cadastro-abre-paciente`
- `cadastro-fecha-paciente`
- `cadastro-ficha-pessoal`
- `cadastro-ficha-rapida`
- `cadastro-ficha-anamnese`
- `cadastro-ficha-historico`
- `cadastro-dados-complementares`
- `cadastro-controle-retornos`
- `cadastro-restricoes-terapeuticas`
- `cadastro-medicamentos`
- `cadastro-convenios-planos`
- `cadastro-controle-estoque`
- `cadastro-controle-proteticos`
- `cadastro-prestadores`
- `cadastro-unidades-atendimento`
- `tratamento-novo`
- `tratamento-altera`
- `tratamento-elimina`
- `tratamento-finaliza`
- `tratamento-orcamento`
- `tratamento-imprime`
- `agenda-dia`
- `agenda-semana`
- `agenda-proximo`
- `agenda-contatos`
- `agenda-avisos`
- `relatorio-pacientes`
- `relatorio-contatos`
- `relatorio-mala-direta`
- `relatorio-tratamentos`
- `relatorio-financeiro-conta-corrente`
- `relatorio-estatistico-fluxo-caixa`
- `relatorio-agendas`
- `relatorio-estoque`
- `relatorio-proteticos`
- `relatorio-fichas-branco`
- `financeiro-cc-paciente`
- `financeiro-cc-cirurgiao`
- `financeiro-controle-recibos`
- `financeiro-mensalidades-ortodontia`
- `financeiro-contas-receber`
- `financeiro-parametros-custo-fixo`
- `financeiro-comissoes-internas`
- `tabelas-procedimentos`
- `tabelas-protetico`
- `materiais`
- `tabelas-cid`
- `tabelas-procedimentos-genericos`
- `config-simbolos-graficos`
- `config-anamnese`
- `config-indices-financeiros`
- `plano`
- `cenario`
- `usuarios`
- `config-agendas`
- `config-relatorios`
- `config-etiquetas`
- `config-preferencias`
- `config-opcoes-sistema`
- `config-alterar-senha`
- `aux`
- `ferr-editor-textos`
- `ferr-editor-msword`
- `ferr-easycapture`
- `ferr-slide-show`
- `ferr-auditoria`
- `ferr-usuarios-conectados`
- `ferr-chat`
- `superadmin`
- `licenca`
- `sobre`

### 6.2. Scripts frontend relevantes referenciados pelo HTML

- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`
- `frontend/js/modules/medicamentos.js`
- `frontend/js/modules/auxiliares.js`
- `frontend/js/modules/etiquetas.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend/js/modules/materiais.js`
- `frontend/js/modules/anamnese.js`
- `frontend/js/modules/prestadores.js`
- `frontend/js/modules/convenios-planos.js`
- `frontend/js/modules/simbolos-graficos.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/app.js`
- `frontend/easy_font_dialog.js`
- `frontend/prestadores_override.js`
- `frontend/prestadores_agenda_hotfix.js`
- `frontend/prestadores_agenda_apresentacao_patch.js`
- `frontend/prestadores_agenda_refino.js`
- `frontend/prestadores_agenda_fonte_color_patch.js`
- `frontend/prestadores_agenda_utf_fix.js`

## 7. Módulos/telas identificados apenas em documentação

Nenhum módulo relevante foi confirmado como “somente documental” sem aparecer também em `app.js` ou `index.html`. O que existe é documentação forte para áreas que já aparecem no frontend, principalmente:

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`
- `Anamnese`
- `Editor de textos`
- `Relatórios`
- `Plano de contas`
- `Materiais`
- `Convênios e Planos`
- `Prestadores`
- `Intervenções / Procedimentos`
- `Procedimentos Genéricos`

## 8. Tabela consolidada de módulos/telas encontrados

| Módulo/tela | Arquivo modular | Presença em `app.js` | Presença em `index.html` | Documentos encontrados | Status | Risco | Justificativa | Recomendação individual |
|---|---|---|---|---|---|---|---|---|
| `Usuários/Admin` | `users-admin-modal-visual.js` | Sim | Sim | `usuarios_admin_*`, `users_admin_*`, `auditoria_fina_users_*`, `recomendacao_proximo_modulo_pos_pausa_usuarios_admin*.md` | Iniciado e pausado | Médio | Próximo recorte foi `usersRenderAdvanced()` e já subia risco | Manter pausado |
| `Símbolos Gráficos` | `simbolos-graficos.js` | Sim | Sim | `simbolos_graficos_*`, `recomendacao_proximo_modulo_pos_simbolos_graficos.md` | Iniciado e pausado | Baixo no helper; baixo/médio na integração | O helper `validarTipoMarcaSimbolo` já saiu, e o fluxo real sobe risco | Manter pausado |
| `Preferências e Opções do Sistema` | `preferencias-opcoes-sistema.js` | Sim | Sim | `preferencias_opcoes_sistema_*`, `recomendacao_proximo_modulo_pos_pausa_usuarios_admin*.md` | Iniciado e pausado | Médio / médio-alto / alto | Helpers seguros já extraídos; remanescentes sobem risco | Manter pausado |
| `Anamnese` | `anamnese.js` | Sim | Sim | `anamnese_*`, `recomendacao_proximo_modulo_pos_anamnese*.md` | Iniciado e muito sensível | Alto | Paciente/clínico, importação, dados legados e fluxo ativo | Evitar agora |
| `Auxiliares / Tabelas auxiliares` | `auxiliares.js` | Sim | Sim | `auxiliares_*`, `recomendacao_proximo_modulo_pos_auxiliares.md` | Iniciado e praticamente consolidado | Baixo a médio | Helpers puros e ciclo bem avançado | Não é próximo módulo |
| `CID` | `cid.js` | Sim | Sim | `cid_*`, `varredura_proximo_modulo_pos_cid.md` | Iniciado e aparentemente encerrado | Baixo a médio | Helpers puros e trilha madura | Não é próximo módulo |
| `Convênios e Planos` | `convenios-planos.js` | Sim | Sim | `convenios_planos_*`, `recomendacao_proximo_modulo_pos_convenios_planos.md` | Iniciado e muito documentado | Médio | Já teve mini ciclo amplo, ainda com calendário/seleção/salvar | Não iniciar agora |
| `Etiquetas` | `etiquetas.js` | Sim | Sim | `etiquetas_*`, `recomendacao_proximo_modulo_pos_etiquetas.md` | Iniciado e avançado | Médio | Layout e helpers já estudados, sem recorte novo óbvio | Evitar agora |
| `Intervenções / Procedimentos` | `intervencoes-procedimentos.js` | Sim | Sim | `intervencoes_procedimentos_*`, `recomendacao_proximo_modulo_pos_intervencoes_*.md` | Iniciado e sensível | Médio/alto | Reajuste, materiais vinculados, tabela e payload | Evitar agora |
| `Materiais` | `materiais.js` | Sim | Sim | `materiais_*`, `recomendacao_proximo_modulo_pos_materiais.md` | Iniciado e ativo | Médio | Vínculos, tabelas e integração com procedimento | Evitar por enquanto |
| `Medicamentos` | `medicamentos.js` | Sim | Sim | `medicamentos_*`, `medicamentos_fechamento_reavaliacao_proximo_modulo.md` | Iniciado e aparentemente encerrado | Baixo a médio | Helpers textuais e ciclo bem fechado | Não é prioridade |
| `Plano de contas` | `plano-contas.js` | Sim | Sim | `plano_contas_*`, `varredura_proximo_modulo_pos_plano_contas.md` | Iniciado e avançado | Médio | Montagem de payload e diálogos ainda presentes | Evitar agora |
| `Prestadores` | `prestadores.js` | Sim | Sim | `prestadores_*`, `recomendacao_proximo_modulo_pos_prestadores*.md` | Iniciado e reavaliado | Médio | Existem helpers bons, mas o fluxo ainda é amplo | Não é candidato limpo |
| `Procedimentos genéricos` | `procedimentos-genericos.js` | Sim | Sim | `procedimentos_genericos_*`, `recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | Iniciado e sensível | Médio/alto | Payload, seleção e vínculos com materiais | Evitar agora |
| `Unidades` | `unidades.js` | Sim | Sim | `unidades_*`, `recomendacao_proximo_modulo_pos_*` correlatos | Iniciado e avançado | Baixo a médio | Helpers e telas já maduras, recortes restantes parecem pequenos | Não é novo |
| `Ficha pessoal / Paciente` | Inexistente | Sim | Sim | Correlatos em `anamnese_*`, `relatorio_fichas_branco`, `usuarios_perfis_acesso_*` | Sem arquivo modular | Alto | Fluxo clínico, navegação, abas, pacientes e dados persistidos | Evitar agora |
| `Agenda` | Inexistente | Sim | Sim | Correlatos em `prestadores_agenda_*` referenciados pelo HTML; docs diretos não confirmados | Sem arquivo modular | Alto | Várias visões, calendário, contatos e persistência visual | Evitar agora |
| `Editor de textos` | Inexistente | Sim | Sim | `auditoria_fina_editor_textos_*` | Sem arquivo modular | Médio/alto | Janela standalone, integração com documentos e saída externa | Evitar agora |
| `Controle de protéticos / Serviços de protético` | Inexistente | Sim | Sim | Docs diretos não confirmados; aparece em menu e app | Sem arquivo modular | Médio/alto | Área funcional própria, sem trilha modular segura confirmada | Evitar agora |
| `Conta corrente / Financeiro` | Inexistente | Sim | Sim | `plano_contas_*`, `relatorio_campos_mesclagem_*`, `contrato_seeds_novas_contas_minimos_nome_codigo.md` | Sem arquivo modular | Médio/alto | Fluxos monetários, contas, caixa, comissões e recibos | Evitar agora |
| `Relatórios` | Inexistente | Sim | Sim | `relatorio_*` variados | Sem arquivo modular | Médio/alto | Múltiplas saídas, exportação e dependências de visão | Evitar agora |
| `Índices financeiros` | Inexistente | Sim | Sim | Correlatos indiretos em `plano_contas_*`; docs específicos não confirmados | Sem arquivo modular | Médio | Fica no eixo financeiro e ainda depende de contexto | Evitar agora |
| `Cenário anual / cenário financeiro` | Inexistente | Sim | Sim | Docs diretos não confirmados | Sem arquivo modular | Médio | Usa parâmetros e cálculo do contexto financeiro | Evitar agora |
| `Licença` | Inexistente | Sim | Sim | Docs diretos não confirmados | Sem arquivo modular | Alto | Checkout, status, conta e integração externa | Evitar agora |
| `Sobre` | Inexistente | Sim | Sim | Docs diretos não confirmados | Sem arquivo modular | Baixo | Apenas modal informativo, mas não é recorte principal | Não recomendado como módulo |
| `Superadmin` | Inexistente | Sim | Sim | `auditoria_complementar_usuarios_permissoes_licenca_easydental.md`, `auditoria_fechamento_easydental_brana_contrato_usuarios.md` | Sem arquivo modular | Alto | Painel administrativo amplo, clientes, cobrança e auditoria | Evitar agora |
| `Cadastro / sessão / login / desconectar` | Inexistente | Sim | Sim | `contrato_funcional_usuarios_novas_contas.md`, `pre_contrato_funcional_usuarios_novas_contas.md`, `contrato_exclusao_segura_contas_clinicas.md` | Sem arquivo modular | Alto | Autenticação, sessão e bootstrap do sistema | Evitar agora |
| `Ferramentas auxiliares` | Inexistente | Sim | Sim | Docs diretos não confirmados | Sem arquivo modular | Médio | Concentra utilitários e janelas externas | Evitar agora |

## 9. Lista de módulos já iniciados

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`
- `Anamnese`
- `Auxiliares`
- `CID`
- `Convênios e Planos`
- `Etiquetas`
- `Intervenções / Procedimentos`
- `Materiais`
- `Medicamentos`
- `Plano de contas`
- `Prestadores`
- `Procedimentos genéricos`
- `Unidades`

## 10. Lista de módulos pausados

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`

## 11. Lista de módulos aparentemente encerrados ou esgotados

- `Auxiliares`
- `CID`
- `Medicamentos`
- `Unidades`
- `Plano de contas`
- `Etiquetas`
- parte relevante de `Prestadores`
- parte relevante de `Convênios e Planos`

## 12. Lista de módulos/telas ainda sem arquivo modular

- `Ficha pessoal / Paciente`
- `Agenda`
- `Editor de textos`
- `Controle de protéticos / Serviços de protético`
- `Conta corrente / Financeiro`
- `Relatórios`
- `Índices financeiros`
- `Cenário anual / cenário financeiro`
- `Licença`
- `Sobre`
- `Superadmin`
- `Cadastro / sessão / login / desconectar`
- `Ferramentas auxiliares`

## 13. Lista de módulos/telas sem documentação suficiente

- `Ficha pessoal / Paciente`
- `Agenda`
- `Controle de protéticos / Serviços de protético`
- `Índices financeiros`
- `Cenário anual / cenário financeiro`
- `Licença`
- `Sobre`
- `Ferramentas auxiliares`

## 14. Lista de candidatos possíveis a Subetapa 0 documental

Nenhum candidato novo realmente seguro foi confirmado. Os únicos eixos que ainda poderiam receber uma Subetapa 0 documental, se a estratégia fosse reaberta, seriam:

- `Agenda`
- `Ficha pessoal / Paciente`
- `Editor de textos`
- `Controle de protéticos / Serviços de protético`
- `Conta corrente / Financeiro`

Mesmo assim, todos já aparecem com risco médio ou alto nesta auditoria.

## 15. Lista de módulos/telas que devem ser evitados agora por risco médio/alto

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`
- `Anamnese`
- `Intervenções / Procedimentos`
- `Procedimentos genéricos`
- `Materiais`
- `Convênios e Planos`
- `Plano de contas`
- `Licença`
- `Superadmin`
- `Cadastro / sessão / login / desconectar`
- `Ficha pessoal / Paciente`
- `Agenda`
- `Editor de textos`
- `Controle de protéticos / Serviços de protético`
- `Conta corrente / Financeiro`
- `Relatórios`
- `Índices financeiros`

## 16. Avaliação específica solicitada

### 16.1. Ficha pessoal
Não possui arquivo modular. Está fortemente presente em `app.js` e `index.html` como parte do fluxo do paciente. Risco alto porque cruza navegação clínica, dados persistidos, anamnese e abas do prontuário. Não é recorte baixo risco.

### 16.2. Agenda
Não possui arquivo modular. Existe no `app.js`, no `index.html` e há scripts auxiliares de agenda de prestadores carregados pelo HTML. Risco alto pela mistura de calendário, contatos, janelas standalone e persistência visual. Não é recomendada agora.

### 16.3. Editor de texto
Não possui arquivo modular. Há documentação específica (`auditoria_fina_editor_textos_*`) e o `app.js` concentra o estado e a abertura da janela standalone. Risco médio/alto por envolver janela própria, conteúdo textual, PDFs e integrações externas. Não iniciar agora.

### 16.4. Tabela de protéticos / Tabelas de prótese
Não possui arquivo modular. Aparece no `index.html` e em blocos do `app.js` como `prot*` / `ctrlProt*`. A documentação direta é fraca. Risco médio/alto por tocar catálogo e serviços especializados. Não é candidato limpo.

### 16.5. Conta corrente
Não possui arquivo modular. O `app.js` concentra `cc*`, `fcx*` e partes financeiras associadas. Há forte ligação com saldo, lançamentos, caixa, comissões e relatórios. Risco alto para qualquer primeiro recorte. Não iniciar agora.

### 16.6. Relatórios
Não possui arquivo modular. Há documentação abundante de relatórios específicos, mas o frontend ainda concentra a navegação e o disparo de múltiplas telas/saídas. Risco médio/alto. Não iniciar agora.

### 16.7. Índices financeiros
Não possui arquivo modular. Está ligado ao eixo financeiro e aparece no menu e em blocos de cenário/conta/plano. Documentação específica foi insuficiente. Risco médio. Não é prioridade.

## 17. Próximo módulo/tela recomendado
Não há, nesta auditoria, um próximo módulo/tela realmente novo e seguro para iniciar.

## 18. Risco do próximo módulo/tela recomendado
Não se aplica, porque a recomendação segura nesta rodada é não escolher um novo módulo ainda.

## 19. Primeira subetapa recomendada
Não iniciar novo módulo. A melhor próxima ação é uma pausa estratégica ou uma auditoria estrutural do `frontend/app.js` por blocos, com recorte por eixo funcional.

## 20. O que deve ficar fora da primeira subetapa

- payload;
- salvamento;
- backend;
- banco;
- seeds;
- permissões;
- login;
- senha interna;
- dados persistidos;
- janelas standalone;
- relatórios;
- fluxo financeiro;
- agenda;
- prontuário/paciente;
- e qualquer integração que já tenha histórico de risco.

## 21. O que deve entrar em commit depois desta etapa documental
Se esta etapa for versionada, o commit deve conter apenas este documento documental.

## 22. O que deve entrar no roadmap se uma nova trilha for iniciada

- nome exato do módulo/tela;
- recorte inicial;
- helper ou bloco a ser estudado;
- fronteiras proibidas;
- documentos existentes e riscos já conhecidos;
- ponto de teste manual futuro;
- confirmação explícita de que backend, banco, seeds e permissões não serão tocados na primeira subetapa.

## 23. Onde testar depois de uma futura alteração de código

- abrir a tela ou modal correspondente;
- validar alternância de abas e navegação;
- verificar console;
- confirmar que nada do fluxo de salvamento foi quebrado;
- e testar a integração manual apenas depois que a nova subetapa documental autorizar o recorte.

## 24. Conclusão
O frontend do Brana Cloud está amplamente modularizado em algumas áreas, mas a maior parte das telas ainda sem arquivo modular pertence a eixos sensíveis ou já avançados. Nesta rodada, não houve confirmação de um módulo realmente novo e baixo risco. A conclusão mais segura é **mudar de estratégia** e não iniciar um novo módulo imediatamente.
