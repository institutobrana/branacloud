# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 3 - Isolamento tecnico dos blocos candidatos

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao preliminar
A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

A classificacao multiarea preliminar continua sendo `configuracao comum`.

Esta classificacao e coerente com a dependencia de permissao `configuracao`, com o uso de configuracoes por usuario e por clinica e com o fato de o modulo atravessar varios fluxos transversais da plataforma sem parecer especifico de uma area profissional isolada.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.
- Subetapa 2 concluida no commit `f7f9b22` - Mapeia tecnicamente preferencias e opcoes.

## 4. Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/fase_2_editor_texto_subetapa_7_consolidacao_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Backend
- `backend/routes/preferences_routes.py`
- `backend/routes/system_options_routes.py`
- `backend/models/clinica.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules`

## 5. Blocos candidatos identificados
Blocos candidatos mapeados por leitura:

- Shell visual de Preferencias
- Shell visual de Opcoes do Sistema
- Aba Geral de Preferencias
- Aba Modelos de Preferencias
- Aba Ambiente de Preferencias
- Aba Dados do Usuario
- Aba Odontograma
- Aba Relatorios/Impressos/report-config
- Carregamento de preferencias de usuario
- Salvamento de preferencias de usuario
- Carregamento de opcoes por clinica
- Salvamento de opcoes por clinica
- Aba clinica de Opcoes do Sistema
- Aba financeiro de Opcoes do Sistema
- Aba seguranca de Opcoes do Sistema
- Aba data de Opcoes do Sistema
- Aba avancado de Opcoes do Sistema
- Controle de permissao configuracao
- Fluxo de senha administrativa / protected grant
- Integracoes com relatorios
- Integracoes com odontograma
- Integracoes com modelos
- Integracoes com impressos

## 6. Quadro de isolamento por bloco candidato
| Bloco | Responsabilidade atual | Funcoes frontend relacionadas | Rotas/endpoints relacionados | DOM/IDs/eventos relacionados | Persistencia envolvida | Usuario ou clinica | Permissao configuracao | Senha administrativa | Dependencias com sessao/usuario/clinica/perfis | Integracoes externas ao modulo | Risco tecnico | Risco de regressao | Observacoes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Shell visual de Preferencias | Monta backdrop, tabs e campos da tela de preferencias | `prefEnsureUI`, `prefAbrir`, `prefSelecionarAba`, `prefAtualizarTitulo` | Indireto via endpoints de preferencias | `#config-preferencias-backdrop`, `#pref-*`, tabs e botoes | Nao escreve sozinho; prepara UI para JSON de usuario | Usuario | Sim | Nao direto, mas depende do acesso protegido geral | `sessaoAtual`, usuario alvo, perfil atual | Modelos, odontograma, relatorios, impressos | Medio | Medio | Bom candidato para isolamento visual, mas ainda amplo |
| Shell visual de Opcoes do Sistema | Monta backdrop, tabs e campos da tela de opcoes | `sysOptEnsureUI`, `sysOptAbrir`, `sysOptSelecionarAba`, `sysOptSyncUI` | `GET/PATCH /system-options` | `#config-opcoes-sistema-backdrop`, `#sysopt-*`, tabs e botoes | `clinica.opcoes_sistema_json`, `clinica.nome`, `clinica.cnpj` | Clinica | Sim | Sim, quando controle de usuarios esta habilitado | `sessaoAtual`, clinica atual, admin status, perfis protegidos | Relatorios, agenda, financeiro, configuracao global | Alto | Alto | Nao e bom primeiro recorte funcional por ser muito transversal |
| Aba Geral de Preferencias | Preferencias gerais do usuario | `prefRenderCombos`, `prefColetarPayload`, `prefSalvarGeral` | `GET/PATCH /preferences/general` | `#pref-geral-*`, tabs geral | `usuario.preferencias_usuario_json` | Usuario | Sim | Nao | sessao, usuario alvo, perfis | Odontograma, agenda, UI geral | Medio | Medio | Pode ser isolada por leitura ou shell sem escrita |
| Aba Modelos de Preferencias | Modelos padrao do usuario | `prefRenderCombosModelos`, `prefColetarPayloadModelos`, `prefSalvarModelos` | `GET/PATCH /preferences/models` | `#pref-modelo-*` | `usuario.preferencias_usuario_json` | Usuario | Sim | Nao | sessao, usuario alvo, catalogo de modelos | Modelos, impressos, relatorios | Medio | Medio/alto | Mistura catalogo e persistencia; precisa contrato claro |
| Aba Ambiente de Preferencias | Fonte/cor/tamanho do ambiente | `prefValoresPadraoAmbiente`, `prefAmbienteEstiloAtual`, `prefAbrirDialogoFonteAmbiente`, `prefColetarPayloadAmbiente`, `prefSalvarAmbiente` | `GET/PATCH /preferences/environment` | `#pref-amb-*`, dialogo de fonte | `usuario.preferencias_usuario_json` | Usuario | Sim | Nao | sessao, usuario alvo, UI global | Editor, modelos de tela, renderizacao de textos | Alto | Alto | Altamente acoplado ao comportamento visual do sistema |
| Aba Dados do Usuario | Dados cadastrais/preferenciais do usuario | `prefColetarPayloadDados`, `prefSalvarDados`, `prefRenderCombosDados` | `GET/PATCH /preferences/user-data` | `#pref-dados-*` | `usuario.preferencias_usuario_json` e atualizacao de dados do usuario | Usuario | Sim | Nao | sessao, usuario alvo, perfil | Usuarios/Login, cadastro, exibicao no shell | Alto | Alto | Pode alterar sessao e apelido exibido no sistema |
| Aba Odontograma | Preferencias do odontograma | `prefValoresPadraoOdontograma`, `prefColetarPayloadOdontograma`, `prefSalvarOdontograma` | `GET/PATCH /preferences/odontogram` | `#pref-odonto-*` | `usuario.preferencias_usuario_json` | Usuario | Sim | Nao | sessao, usuario alvo, especialidades | Odontograma, agenda, relatorios | Alto | Alto | Integra area clinica e futuras ligacoes com outros modulos |
| Aba Relatorios/Impressos/report-config | Configuracao de relatorios/impressos | `get_general_preferences`, `get_report_config`, `update_report_config` | `GET/PATCH /preferences/report-config` | UI de preferencias + dialogos de relatorio/impressora | `usuario.preferencias_impressora_json` e preferencias relacionadas | Usuario | Sim | Nao | sessao, usuario alvo | Relatorios, impressos, fluxo de impressao | Alto | Alto | Grande risco por tocar saida impressa e formatos globais |
| Carregamento de preferencias de usuario | Leitura sequencial de varias abas | `prefCarregarDados` | `GET /preferences/*` | Backdrop de preferencias, loading e mensagens | JSON de usuario | Usuario | Sim | Nao | sessao, usuario alvo | Relatorios, odontograma, modelos | Medio | Medio | Bom candidato para isolamento de leitura, sem escrita |
| Salvamento de preferencias de usuario | Escrita por aba | `prefSalvarGeral`, `prefSalvarModelos`, `prefSalvarAmbiente`, `prefSalvarDados`, `prefSalvarOdontograma` | `PATCH /preferences/*` | Botoes Ok e validacao por aba | JSON de usuario | Usuario | Sim | Nao | sessao, usuario alvo | Relatorios, odontograma, modelos | Alto | Alto | Nao recomendado para primeiro recorte funcional |
| Carregamento de opcoes por clinica | Leitura de opcoes sistêmicas da clinica | `sysOptCarregar` | `GET /system-options` | `#config-opcoes-sistema-backdrop`, tabs e campos `sysopt-*` | `clinica.opcoes_sistema_json` | Clinica | Sim | Sim, se controle de usuarios ativo | sessao, clinica atual, admin | Relatorios, financeiro, agenda, configuracao global | Alto | Alto | Boa leitura central, mas conecta muitos fluxos |
| Salvamento de opcoes por clinica | Escrita nas opcoes sistêmicas | `sysOptSalvar` | `PATCH /system-options` | `#sysopt-btn-ok` | `clinica.opcoes_sistema_json`, `clinica.nome`, `clinica.cnpj` | Clinica | Sim | Sim, se controle de usuarios ativo | sessao, clinica atual, admin | Relatorios, financeiro, agenda, configuracao global | Muito alto | Muito alto | Nao e candidato seguro para primeiro recorte funcional |
| Aba clinica de Opcoes do Sistema | Nome, endereco, CNPJ e afins | `sysOptRenderSelects`, `sysOptSyncUI`, `sysOptColetarPayload` | `GET/PATCH /system-options` | `#sysopt-clinica-*` | `clinica.opcoes_sistema_json` e campos da clinica | Clinica | Sim | Sim, quando aplicavel | clinica atual, admin | Cadastro global da clinica | Alto | Alto | Toca identidade da clinica e campos persistentes sensiveis |
| Aba financeiro de Opcoes do Sistema | Indices, moeda, cobranca e regras | `sysOptRenderSelects`, `sysOptColetarPayload` | `GET/PATCH /system-options` | `#sysopt-fin-*` | `clinica.opcoes_sistema_json` | Clinica | Sim | Sim, quando aplicavel | sessao, clinica, admin | Financeiro, relatorios, contas | Muito alto | Muito alto | Atravessa area financeira e pode ter regressao ampla |
| Aba seguranca de Opcoes do Sistema | Usuarios, auditoria e permissões | `sysOptRenderSelects`, `sysOptColetarPayload` | `GET/PATCH /system-options` | `#sysopt-seg-*`, `#sysopt-seg-permissoes` | `clinica.opcoes_sistema_json` | Clinica | Sim | Sim | sessao, usuarios, perfis, admin | Login, protecoes, painel de usuarios | Muito alto | Muito alto | Toca o coracao do controle de acesso |
| Aba data de Opcoes do Sistema | Formato de data, hora e calendario | `sysOptRenderSelects`, `sysOptColetarPayload` | `GET/PATCH /system-options` | `#sysopt-data-*` | `clinica.opcoes_sistema_json` | Clinica | Sim | Sim, se aplicavel | sessao, clinica | Agenda, exibicao geral, relatorios | Medio | Medio | Mais controlavel que financeiro/seguranca |
| Aba avancado de Opcoes do Sistema | Captura, Word, email, imagens e flags avancadas | `sysOptRenderSelects`, `sysOptColetarPayload` | `GET/PATCH /system-options` | `#sysopt-av-*` | `clinica.opcoes_sistema_json` | Clinica | Sim | Sim, se aplicavel | sessao, clinica | Impressao, agenda, orcamento, odontograma, email | Alto | Alto | Muitas flags de comportamento global |
| Controle de permissao configuracao | Garante acesso protegido ao modulo | `menuActionAccessLevel`, `menuEnsurePermission`, `ensureProtectedGrant` | Dependencia de autorizacao; nao e endpoint proprio | `menu-action`, dialogs de grant | Cache de grant protegido | Ambos, dependendo do contexto | Sim | Sim em varios fluxos | sessao, usuario, perfis, admin | Todos os modulos protegidos | Muito alto | Muito alto | Nao deve ser mexido sem contrato proprio |
| Fluxo de senha administrativa / protected grant | Desbloqueia areas protegidas | `ensureProtectedGrant`, `protectedPassDialog`, `unlockProtectedGrant` | Fluxos protegidos do backend | `protected-pass-backdrop` | Cache de grant | Ambos | Sim | Sim | sessao, usuario, admin | Usuarios, configuracao, relatorios protegidos | Muito alto | Muito alto | Um dos blocos mais sensiveis da aplicacao |
| Integracoes com relatorios | Faz preferencia influenciar relatorios e impressos | `prefValoresPadraoModelos`, `sysOptColetarPayload` | `GET/PATCH /preferences/report-config`, `PATCH /system-options` | IDs de modelo e opcoes de relatorio | JSON de usuario e clinica | Ambos | Sim | Sim em opcoes da clinica | sessao, usuario, clinica, perfis | Relatorios e impressos | Alto | Alto | Interface indireta, mas risco amplo |
| Integracoes com odontograma | Preferencias de exibicao e cores clinicas | `prefValoresPadraoOdontograma`, `prefSalvarOdontograma` | `GET/PATCH /preferences/odontogram` | `#pref-odonto-*` | JSON de usuario | Usuario | Sim | Nao | sessao, usuario, especialidades | Odontograma e agenda | Alto | Alto | Toca fluxo clinico visual importante |
| Integracoes com modelos | Preferencias de modelos padrao | `prefRenderCombosModelos`, `prefSalvarModelos` | `GET/PATCH /preferences/models` | `#pref-modelo-*` | JSON de usuario | Usuario | Sim | Nao | sessao, usuario, catalogo | Impressos e relatorios | Medio/alto | Medio/alto | Pode ser isolado por catalogo, mas nao deve misturar persistencia |
| Integracoes com impressos | Preferencias e formatos de impressao | `prefSalvarGeral`, `prefSalvarModelos`, `get_report_config`, `update_report_config` | `GET/PATCH /preferences/report-config` | Dialogos e campos de impressao | JSON de usuario | Usuario | Sim | Nao | sessao, usuario | Fluxos de impressao do navegador | Alto | Alto | Depende de varios fluxos de saida |

## 7. Separacao por nivel de risco
### Baixo risco
- Nao foi identificado um bloco realmente baixo risco para recorte funcional direto nesta frente.

### Medio risco
- Shell visual de Preferencias
- Aba Geral de Preferencias
- Carregamento de preferencias de usuario
- Aba data de Opcoes do Sistema

### Alto risco
- Shell visual de Opcoes do Sistema
- Aba Modelos de Preferencias
- Aba Ambiente de Preferencias
- Aba Dados do Usuario
- Aba Odontograma
- Aba Relatorios/Impressos/report-config
- Carregamento de opcoes por clinica
- Aba clinica de Opcoes do Sistema
- Aba avancado de Opcoes do Sistema
- Integracoes com relatorios
- Integracoes com odontograma
- Integracoes com impressos

### Muito alto risco
- Salvamento de preferencias de usuario
- Salvamento de opcoes por clinica
- Aba financeiro de Opcoes do Sistema
- Aba seguranca de Opcoes do Sistema
- Controle de permissao configuracao
- Fluxo de senha administrativa / protected grant

## 8. Blocos que nao devem ser o primeiro recorte real
Nao devem ser o primeiro recorte funcional:

- Tela inteira de Opcoes do Sistema de uma vez;
- Tela inteira de Preferencias de uma vez;
- Fluxo de permissao/senha administrativa;
- Bloco de relatorios/impressos;
- Bloco de odontograma;
- Qualquer recorte que misture usuario e clinica sem contrato granular;
- Qualquer recorte que atravesse frontend central, backend e permissao global ao mesmo tempo;
- Qualquer bloco de salvamento ainda sem leitura isolada validada.

## 9. Blocos candidatos mais seguros para primeiro recorte futuro
Se houver futura modularizacao funcional, os candidatos mais seguros continuam sendo:

- leitura isolada de preferencias de usuario sem escrita;
- leitura isolada de opcoes da clinica sem escrita;
- shell visual de uma aba especifica sem alterar persistencia;
- montagem de UI auxiliar sem mudar comportamento.

Mesmo esses candidatos devem ser tratados como futuros e nao como autorizacao imediata.

## 10. Justificativa tecnica da ordem sugerida
A ordem sugerida prioriza blocos com menor impacto sistêmico:

1. leitura antes de escrita;
2. shell visual antes de persistencia;
3. usuario antes de clinica quando houver separacao clara de dados;
4. abas de menor acoplamento antes das abas de financeiro e seguranca;
5. blocos transversais de relatorios, odontograma e impressos somente depois de contrato mais forte;
6. permissao e senha administrativa por ultimo, por serem os pontos mais sensiveis.

## 11. Critérios mínimos para permitir uma futura primeira alteração de código
Antes de qualquer primeira alteracao funcional futura, sera necessario:

- definir o bloco exato;
- definir se o dado pertence ao usuario ou a clinica;
- confirmar a rota de leitura e a rota de escrita;
- confirmar se ha dependencia de permissao `configuracao`;
- confirmar se ha dependencia de senha administrativa;
- confirmar o impacto em relatorios, odontograma, modelos e impressos;
- confirmar a classificacao multiarea do bloco escolhido;
- validar o comportamento no sistema antes e depois da mudanca;
- manter o escopo pequeno e auditavel;
- evitar mistura de shell visual, persistencia e autorizacao no mesmo primeiro recorte.

## 12. Critérios de teste humano obrigatório por bloco
### Shell visual de Preferencias
- abrir a tela;
- alternar abas;
- confirmar que o modal nao quebra;
- validar que os campos aparecem e somem conforme a aba.

### Shell visual de Opcoes do Sistema
- abrir a tela;
- alternar abas;
- confirmar que os blocos clinica/financeiro/seguranca/data/avancado continuam no lugar certo;
- confirmar que o modal nao quebra.

### Aba Geral de Preferencias
- carregar valores;
- editar valores;
- validar retorno visual;
- apenas depois considerar escrita futura.

### Aba Modelos de Preferencias
- carregar o catalogo de modelos;
- validar populacao dos selects;
- conferir se o catalogo corresponde ao usuario atual.

### Aba Ambiente de Preferencias
- validar dialogo de fonte;
- validar preview;
- validar restauracao de estilo padrao;
- verificar se o comportamento do editor/ambiente nao se altera indevidamente.

### Aba Dados do Usuario
- conferir campos cadastrais;
- validar persistencia futura somente depois de contrato;
- confirmar reflexo no usuario logado.

### Aba Odontograma
- carregar preferencias;
- validar campos e cores;
- confirmar efeito em telas relacionadas.

### Aba Relatorios/Impressos/report-config
- carregar configuracao;
- conferir impacto em relatorios e impressos;
- validar consistencia de formatos.

### Carregamento e salvamento de preferencias de usuario
- testar leitura isolada antes de qualquer PATCH;
- validar que a leitura nao altera sessao nem perfil;
- testar escrita apenas em ambiente de teste e com contrato previo.

### Carregamento e salvamento de opcoes por clinica
- validar leitura com clinica correta;
- confirmar se a UI respeita admin/senha;
- testar escrita apenas depois de contrato proprio.

### Aba clinica de Opcoes do Sistema
- validar nome, endereco e CNPJ;
- conferir impacto sobre identidade da clinica.

### Aba financeiro de Opcoes do Sistema
- validar indices e regras financeiras;
- verificar se nao afeta fluxos de contas sem contrato.

### Aba seguranca de Opcoes do Sistema
- validar exibicao e protecoes;
- confirmar bloqueios e senha administrativa;
- nunca recortar sem acordo previo.

### Aba data de Opcoes do Sistema
- validar formatos e campos de tempo;
- confirmar que agenda e relatorios continuam coerentes.

### Aba avancado de Opcoes do Sistema
- validar flags e dependencias externas;
- testar integracoes antes de qualquer escrita.

### Controle de permissao configuracao
- testar abertura de telas protegidas;
- validar exibicao do grant correto;
- confirmar o impacto em perfis e usuarios.

### Fluxo de senha administrativa / protected grant
- testar acesso protegido;
- validar cancelamento;
- validar armazenamento de grant apenas em memoria/cache.

### Integracoes com relatorios
- validar leitura e consistencia visual;
- testar impressos e relatorios correlatos.

### Integracoes com odontograma
- validar carregamento e cores;
- testar telas que consumam as preferencias.

### Integracoes com modelos
- validar catalogo e selecao;
- confirmar correspondencia com usuario e clinica.

### Integracoes com impressos
- validar comportamento de impressao;
- checar se a preferencia afeta apenas o fluxo previsto.

## 13. Onde testar futuramente
Antes de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferencias e Opcoes do Sistema`

E validar, conforme o bloco:
- abertura da tela;
- carregamento das abas;
- preferencias do usuario;
- opcoes por clinica;
- salvamento das preferencias;
- salvamento das opcoes;
- permissao configuracao;
- senha administrativa quando aplicavel;
- relatorios;
- odontograma;
- modelos;
- impressos.

## 14. Recomendacao conservadora da proxima subetapa
A recomendacao conservadora e continuar documentalmente com um recorte ainda mais fino dos blocos considerados seguros, sem iniciar escrita no frontend ou backend.

Se houver necessidade de escolha futura, o recorte mais prudente tende a ser apenas leitura isolada de um bloco visual ou de um conjunto pequeno de campos, nunca envolvendo permissao, senha administrativa ou gravação no primeiro passo.

## 15. Confirmacoes
- Editor de texto permanece pausado/consolidado;
- a frente atual continua sendo Preferencias e Opcoes do Sistema;
- a classificacao preliminar continua sendo configuracao comum;
- nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ampla ou de mojibake foi feita.

## Registro para roadmap
- A frente atual continua sendo Preferencias e Opcoes do Sistema.
- Editor de texto permanece pausado/consolidado.
- A Subetapa 1 foi concluida no commit `7764e9b`.
- A Subetapa 2 foi concluida no commit `f7f9b22`.
- Esta Subetapa 3 cria o isolamento tecnico dos blocos candidatos.
- A classificacao preliminar continua sendo configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A proxima subetapa recomendada deve ser escolhida com base no risco dos blocos isolados.
- Antes de iniciar qualquer recorte funcional futuro, o usuario devera confirmar novamente a classificacao multiarea do bloco escolhido, se houver duvida.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_3_isolamento_blocos_candidatos.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
