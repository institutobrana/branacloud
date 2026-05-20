# Recomendação do próximo módulo após Símbolos Gráficos

## 1. Escopo

Esta etapa é somente documental e nenhum código funcional foi alterado.

## 2. Contexto

Símbolos Gráficos foi consolidado.

Os testes manuais foram informados como OK.

O commit `2ee1e94` foi enviado ao GitHub.

O próximo passo deve escolher o módulo mais seguro, e não o mais complexo.

## 3. Documentos analisados

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/varredura_proximo_modulo_pos_cid.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/03_mapa_codigo.md`

## 4. Critérios de escolha

Os critérios usados foram:

- segurança;
- fronteira clara;
- baixo acoplamento;
- baixo risco de DOM e eventos;
- ausência de editor, iframe, canvas ou postMessage;
- baixo risco de payload;
- possibilidade de começar por Subetapa 0 documental;
- aderência ao padrão conservador.

## 5. Candidatos avaliados

### 5.1 Materiais

- Função principal provável: `abrirMateriais()`
- Região aproximada no `app.js`: bloco principal de materiais e funções de apoio na faixa baixa/mediana do arquivo, com listas, modal principal e modal de tabela
- Dependências principais: `requestJson`, filtros, combos auxiliares, índices, listas, tabelas e modal próprio
- Riscos: muitos binds, duas camadas de modal, volume alto de DOM, dependência de números e de tabelas auxiliares
- Vantagem: fronteira funcional real e relativamente separável de agenda, editor e financeiro
- Desvantagem: superficie ampla e comportamento visual sensível
- Classificação: **recomendado**

### 5.2 Usuários / permissões

- Função principal provável: `abrirPainelUsuariosConfig()` e o fluxo de `carregarUsuarios()`
- Região aproximada no `app.js`: bloco de usuários, permissões e painel superadmin espalhado pelo meio e pela parte final do arquivo
- Dependências principais: sessão, grant protegido, permissões, painel de usuários, modal de senha, modal de permissões e rotas administrativas
- Riscos: pode bloquear acesso ao sistema, envolve proteção administrativa e muitos estados compartilhados
- Vantagem: existe como painel próprio e tem contrato funcional identificável
- Desvantagem: risco sistêmico maior do que um cadastro de negócio comum
- Classificação: **descartado por risco neste momento**

### 5.3 Agenda

- Função principal provável: `agendaContatosAbrir()`, `agendaLegadoAbrir()` e `agendaSemanaAbrir()`
- Região aproximada no `app.js`: blocos grandes e muito espalhados
- Dependências principais: paciente, prestador, unidade, bloqueios, horários, Google Calendar e vários eventos
- Riscos: muito DOM, muitos binds, estado visual amplo, integrações externas
- Vantagem: nenhuma relevante para iniciar esta rodada
- Desvantagem: alto risco de regressão
- Classificação: **descartado por risco neste momento**

### 5.4 Editor de Textos

- Função principal provável: `editorTextosAbrir()`
- Região aproximada no `app.js`: maior subsistema isolado do arquivo, muito espalhado
- Dependências principais: DOM rico, toolbar, imagens, PDF, assinatura, paginação, estados de edição e muitos listeners
- Riscos: muito alto, com risco de regressão visual e comportamental
- Vantagem: módulo próprio bem definido
- Desvantagem: complexidade e superfície maiores do que o aceitável para o próximo passo
- Classificação: **descartado por risco neste momento**

### 5.5 Financeiro / Conta corrente

- Função principal provável: `fcxAbrir()` / `abrirContaCorrente()` e fluxos correlatos
- Região aproximada no `app.js`: bloco financeiro e conta corrente
- Dependências principais: lançamentos, relatórios, fluxo de caixa e regras monetárias
- Riscos: payload financeiro sensível, exclusões e mutações críticas
- Vantagem: fronteira de negócio existe
- Desvantagem: risco de impacto financeiro direto
- Classificação: **descartado por risco neste momento**

### 5.6 Índices financeiros

- Função principal provável: `indicesAbrir()`
- Região aproximada no `app.js`: bloco dedicado de índices e cotações
- Dependências principais: cotações, validação de uso, migração e exclusão
- Riscos: financeiro sensível e dependência de regras de uso
- Vantagem: módulo dedicado
- Desvantagem: risco financeiro e de mutação
- Classificação: **descartado por risco neste momento**

### 5.7 Cenário financeiro

- Função principal provável: `abrirCenario()` / `carregarCenario()`
- Região aproximada no `app.js`: bloco financeiro/procedimental correlato ao cenário
- Dependências principais: procedimentos, cálculos e parâmetros financeiros
- Riscos: cálculo sensível e acoplamento com procedimentos
- Vantagem: área própria
- Desvantagem: risco alto para uma primeira retomada
- Classificação: **descartado por risco neste momento**

### 5.8 Procedimentos / Intervenções

- Função principal provável: `procAbrir()` / `procAbrirEditor()`
- Região aproximada no `app.js`: bloco grande e muito espalhado
- Dependências principais: materiais, símbolos, cobrança, tabela, editor e muitos eventos
- Riscos: é um dos blocos mais amplos e sensíveis do arquivo
- Vantagem: possui fronteira de domínio clara
- Desvantagem: risco alto demais para o próximo ciclo
- Classificação: **descartado por risco neste momento**

## 6. Módulo recomendado

O módulo recomendado como próximo passo é `Materiais`.

### Justificativa objetiva

- é mais seguro que Agenda, Editor de Textos, Financeiro, Índices financeiros, Cenário financeiro e Procedimentos;
- não mexe com editor visual, iframe ou postMessage;
- não interfere em controle de acesso do sistema como o bloco de Usuários / permissões;
- tem fronteira de negócio clara e um ciclo documental inicial viável;
- pode começar por Subetapa 0 documental sem alterar comportamento.

### Riscos conhecidos

- volume de DOM e de eventos;
- duas camadas de modal;
- dependência de números e índices;
- dependência de listas auxiliares;
- risco de alterar visualização da tabela e do modal se movido cedo demais.

### Cuidados especiais

- mapear primeiro o bloco monolítico completo;
- não mover listas, modal ou tabelas cedo demais;
- não mexer em `requestJson`, `fetch`, payload ou endpoints na Subetapa 0;
- manter o `app.js` como fonte funcional da verdade.

## 7. Módulos descartados por risco neste momento

- Usuários / permissões
- Agenda
- Editor de Textos
- Financeiro / Conta corrente
- Índices financeiros
- Cenário financeiro
- Procedimentos / Intervenções

### Motivos principais

- payload financeiro sensível;
- dependência de procedimentos;
- dependência de agenda;
- dependência de editor;
- dependência de eventos complexos;
- dependência de DOM muito dinâmico;
- risco de alteração visual;
- risco de backend sensível;
- risco sistêmico de acesso no caso de Usuários / permissões.

## 8. Recomendação de Subetapa 0 do próximo módulo

A próxima Subetapa 0 de `Materiais` deve:

- mapear apenas o bloco de `Materiais` no `app.js`;
- não alterar código;
- não alterar `index.html`;
- não criar módulo novo;
- não mover função;
- não criar helper;
- não corrigir texto ou mojibake;
- registrar função principal;
- registrar endpoints;
- registrar DOM;
- registrar eventos;
- registrar estado global;
- registrar payload;
- registrar riscos;
- sugerir helpers puros apenas no papel.

## 9. Blindagem textual aplicada

Foi respeitado o documento:

`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirma-se que:

- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 10. Conclusão

O próximo módulo recomendado é `Materiais`.

O motivo é ser o melhor equilíbrio, neste momento, entre fronteira funcional clara e risco menor que as áreas de agenda, editor, financeiro, índices, cenário e usuários/permissões.

Os próximos cuidados são:

- iniciar apenas por Subetapa 0 documental;
- manter o padrão conservador;
- evitar qualquer integração funcional precoce.

A próxima etapa deve ser apenas Subetapa 0 documental.
