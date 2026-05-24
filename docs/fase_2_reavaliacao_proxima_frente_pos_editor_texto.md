# Fase 2 - Reavaliacao da proxima frente apos consolidacao do Editor de texto

## 1. Contexto da Fase 2
A Fase 2 segue em evolucao com modularizacao e consolidacao documental por frente.

A frente Editor de texto foi trabalhada ate o recorte Bootstrap/abertura e teve seu ciclo recente consolidado documentalmente no commit `3f2b255`.

## 2. Editor de texto consolidado
A frente Editor de texto foi consolidada do ponto de vista documental e funcional imediato.

O recorte Bootstrap/abertura foi realizado, corrigido apos regressao e validado pelo usuario em fluxo real.

## 3. Estado atual do Editor de texto
- abertura standalone corrigida;
- assistente de receitas corrigido;
- ordem visual Paciente > Medicamento validada;
- cor do texto selecionado validada;
- residuo/mojibake da toolbar de cor corrigido;
- cor do sublinhado ainda pendente, por decisao do usuario;
- TAB permanece como problema pre-existente;
- `RECEITA_TEL_BRANA` permanece como restauracao manual opcional;
- a frente permanece pausada/consolidada ate nova decisao explicita.

## 4. Pendencias congeladas do Editor de texto
- cor do sublinhado nao acompanha a cor do texto;
- TAB continua como problema pre-existente;
- `RECEITA_TEL_BRANA` pode ser restaurado manualmente pelo usuario quando desejar.

## 5. Arquivo modificado fora do commit
O arquivo abaixo permanece modificado no worktree por teste humano e deve continuar fora de qualquer commit desta etapa:

- `storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod.editor.json`

## 6. Linha do tempo consolidada do Editor de texto
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas
- `ace1fbe` - Restaura tela de receitas do editor
- `bd6c6e0` - Corrige cor do texto selecionado no editor
- `af8c823` - Corrige cor selecionada e residuo da toolbar
- `221e8c3` - Corrige cor do sublinhado no editor
- `b64edf5` - Ajusta sublinhado e ordem de receitas no editor
- `9d14c83` - Registra fechamento pos teste do editor
- `3f2b255` - Consolida recorte bootstrap do editor

## 7. Frentes candidatas reavaliadas
Frentes candidatas consideradas nesta reavaliacao:

- Editor de texto;
- Agenda;
- Conta corrente;
- Usuarios/Login;
- Seeds/tabelas padrao;
- Ficha pessoal;
- Relatorios;
- Indices financeiros;
- Conta/Configuracoes;
- Etiquetas e Relatorios;
- Licenca, Planos e Pagamentos;
- Superadmin da Plataforma;
- Frontend Web;
- Banco, Schema e Bootstrap.

## 8. Classificacao multiarea preliminar
Classificacao preliminar das frentes candidatas:

- Editor de texto: core/comum;
- Agenda: clinico comum;
- Conta corrente: financeiro comum;
- Usuarios/Login: core/comum;
- Seeds/tabelas padrao: configuracao comum;
- Ficha pessoal: clinico comum;
- Relatorios: multiarea/configuravel;
- Indices financeiros: financeiro comum;
- Conta/Configuracoes: configuracao comum;
- Etiquetas e Relatorios: multiarea/configuravel;
- Licenca, Planos e Pagamentos: outro modulo especifico / plataforma;
- Superadmin da Plataforma: outro modulo especifico / plataforma;
- Frontend Web: core/comum;
- Banco, Schema e Bootstrap: configuracao comum / infraestrutura.

## 9. Risco tecnico e valor de negocio
### Editor de texto
- Valor de negocio: alto;
- Risco tecnico: medio, mas a frente ja foi consolidada e os ajustes pendentes estao congelados.

### Agenda
- Valor de negocio: muito alto;
- Risco tecnico: alto, por envolver fluxo diario, paciente, horarios, bloqueios e integracoes externas.

### Conta corrente
- Valor de negocio: alto;
- Risco tecnico: alto, por ser area financeira sensivel.

### Usuarios/Login
- Valor de negocio: muito alto;
- Risco tecnico: muito alto, pois afeta autenticacao, sessao e permissao de todo o sistema.

### Seeds/tabelas padrao
- Valor de negocio: alto;
- Risco tecnico: alto, porque pode afetar bootstrap do ambiente inteiro.

### Ficha pessoal
- Valor de negocio: alto;
- Risco tecnico: alto, por ser fluxos de prontuario e registro clinico.

### Relatorios
- Valor de negocio: medio/alto;
- Risco tecnico: medio, com risco adicional em anexos, email e formatos de exportacao.

### Indices financeiros
- Valor de negocio: medio/alto;
- Risco tecnico: medio/alto, por tocar informacoes financeiras e consultas agregadas.

### Conta/Configuracoes
- Valor de negocio: alto;
- Risco tecnico: medio, pois influencia comportamento global mas tende a ser mais controlavel que agenda/financeiro/autenticacao.

### Etiquetas e Relatorios
- Valor de negocio: medio;
- Risco tecnico: medio/alto, por depender de email, anexos e configuracao de relatorios.

### Licenca, Planos e Pagamentos
- Valor de negocio: alto;
- Risco tecnico: muito alto, por envolver checkout, webhook e sandbox externo.

### Superadmin da Plataforma
- Valor de negocio: alto para operacao interna;
- Risco tecnico: muito alto, por atravessar clinicas e permissoes de plataforma.

### Frontend Web
- Valor de negocio: transversal;
- Risco tecnico: medio/alto, pois qualquer modularizacao de `frontend/app.js` pode tocar varias areas ao mesmo tempo.

### Banco, Schema e Bootstrap
- Valor de negocio: estrutural;
- Risco tecnico: muito alto, por envolver schema, migrations e bootstrap do sistema.

## 10. Comparacao entre continuar Editor de texto e seguir outra frente
Continuar no Editor de texto agora nao parece o caminho mais util.

O recorte Bootstrap/abertura ja foi consolidado, as correcoes principais foram validas e as pendencias restantes foram congeladas por decisao do usuario.

Retomar Editor de texto exigiria reabrir uma frente ja estabilizada, sem ganho proporcional imediato.

Seguir para outra frente e mais util neste momento, desde que a frente escolhida tenha classificacao preliminar clara e permita recorte conservador.

## 11. Recomendacao principal de proxima frente
Recomenda-se como proxima frente: `Preferencias e Opcoes do Sistema`.

## 12. Justificativa da recomendacao
A frente `Preferencias e Opcoes do Sistema` e uma candidata mais conservadora do que Agenda, Conta corrente, Usuarios/Login, Ficha pessoal, Licenca ou Superadmin.

Ela tem classificacao preliminar de configuracao comum, valor de negocio relevante e risco tecnico mais controlavel.

Tambem e um bom ponto de continuacao da Fase 2 porque trata configuracoes de comportamento do sistema sem entrar imediatamente em fluxo clinico pesado, financeiro sensivel ou autenticacao global.

## 13. Proxima subetapa recomendada
A proxima subetapa deve ser documental:

- contrato funcional de `Preferencias e Opcoes do Sistema`;
- mapeamento tecnico inicial das rotas `preferences_routes.py` e `system_options_routes.py`;
- definicao do recorte minimo seguro antes de qualquer alteracao funcional.

## 14. Tipo da proxima etapa
A proxima etapa deve ser documental, salvo decisao explicita futura do usuario para iniciar recorte funcional.

## 15. Decisao pendente antes da proxima modularizacao
Antes de iniciar qualquer nova modularizacao funcional, o usuario deve confirmar explicitamente:

- a classificacao multiarea do modulo escolhido;
- se o modulo sera tratado como core/comum ou como modulo especifico de alguma area profissional.

## 16. Riscos remanescentes
- retomar Editor de texto sem necessidade imediata;
- escolher um modulo muito sensivel sem contrato funcional previo;
- misturar classificacao multiarea com recorte funcional;
- abrir nova frente sem nova validacao humana do escopo.

## 17. Confirmacoes
- Nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ampla ou de mojibake foi feita;
- o arquivo de storage modificado no worktree permaneceu fora do commit.

## 18. Registro para roadmap
- A frente Editor de texto foi consolidada no commit `3f2b255`.
- O recorte Bootstrap/abertura do Editor de texto esta pausado/consolidado.
- A cor do sublinhado permanece pendencia futura.
- TAB permanece problema pre-existente.
- `RECEITA_TEL_BRANA` permanece restauracao manual opcional.
- O arquivo `storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod.editor.json` permanece fora do commit.
- Esta etapa reavalia a proxima frente da Fase 2.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- Nenhuma correcao textual ampla ou de mojibake foi feita.
- A proxima frente recomendada deve ser confirmada pelo usuario antes de iniciar nova modularizacao.
- Antes de iniciar nova modularizacao, o usuario deve confirmar a classificacao multiarea do modulo escolhido.

## 19. Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Nao adicionar `storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod.editor.json`.
- Usar `git add` seletivo somente para o documento criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas alem do arquivo de storage ja conhecido.
- Confirmar depois do commit quais arquivos entraram.
