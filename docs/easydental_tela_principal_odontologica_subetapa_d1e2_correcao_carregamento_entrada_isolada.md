## Subetapa D1-E2 - Correção do carregamento da entrada isolada do botao Odontograma

### Objetivo
- Corrigir de forma minima por que o clique real no botao `Odontograma` estava caindo no fluxo antigo.
- Garantir que a nova entrada isolada seja carregada e acionada no clique real.
- Preservar o fallback antigo e a implementacao legada sem remoção.

### Resultado do teste do usuario
- Ao abrir `Ficha Pessoal > Historico` e clicar em `Odontograma`, abriu a tela antiga do Odontograma V1.
- A nova tela principal odontologica isolada nao abriu no fluxo real.
- O fallback antigo funcionou.

### Causa encontrada
- Os modulos novos da tela principal odontologica nao estavam sendo carregados no fluxo real da pagina.
- O `frontend/index.html` nao inclui os scripts novos da tela isolada.
- Assim, `window.abrirTelaPrincipalOdontologicaPorPaciente` nao estava disponivel no momento do clique real e o fluxo caiu no fallback legado.

### Correção aplicada
- O modulo legado `frontend/js/modules/odontograma-v1.js` passou a carregar dinamicamente os scripts da tela principal odontologica antes de chamar a entrada isolada.
- A carga foi feita em ordem controlada para:
  - `tela-principal-odontologica-contratos.js`
  - `tela-principal-odontologica-estado.js`
  - `tela-principal-odontologica-layout.js`
  - `tela-principal-odontologica-entrada.js`
- Depois da carga, o clique chama `abrirTelaPrincipalOdontologicaPorPaciente(contexto)`.
- Se a carga falhar, a funcao nao existir ou a entrada retornar erro, o fluxo volta para `openPanel()` do odontograma V1.

### Arquivos alterados
- `frontend/js/modules/odontograma-v1.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1e2_correcao_carregamento_entrada_isolada.md`
- `docs/11_roadmap_desenvolvimento.md`

### Como a entrada nova passou a ser carregada/acessada
- O clique no botao continua sendo interceptado no modulo legado.
- Antes de abrir a entrada, o modulo legado garante o carregamento dinâmico dos scripts novos.
- A entrada isolada continua sendo acessada por `window.abrirTelaPrincipalOdontologicaPorPaciente(contexto)`.

### Como o fallback antigo foi preservado
- O fallback antigo continua como rota segura se qualquer etapa nova falhar.
- Se a funcao nao existir, a carga falhar ou a renderizacao nova devolver `ok: false`, o modulo chama `openPanel()`.
- O fallback nao foi removido.

### Confirmacoes
- A implementacao antiga do odontograma nao foi removida.
- A interceptacao global antiga nao foi removida.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- backend nao foi alterado.
- banco, schema, migrations, seeds e endpoints nao foram alterados.
- nenhum asset foi alterado.
- nenhum arquivo do EasyDental foi alterado.
- nenhum arquivo do EasyDental foi copiado para o Brana Cloud.
- a blindagem textual/mojibake foi respeitada.

### Como testar manualmente
- Abrir o Brana Cloud.
- Ir em `Ficha Pessoal > Historico`.
- Clicar em `Odontograma`.
- Confirmar que a entrada isolada nova abre quando os scripts novos estao disponiveis.
- Confirmar que o fallback antigo continua funcionando se a entrada nova falhar.

### Riscos remanescentes
- Se o navegador bloquear o carregamento dinamico dos scripts, o fallback antigo continuara sendo usado.
- Se houver cache antigo, a validacao visual pode exigir recarga dura.
- O host isolado precisa continuar sendo verificado para evitar conflito com o fluxo legado.

### Proxima etapa recomendada
- Validar visualmente o clique real no navegador com recarga limpa e, se necessario, refinar apenas o host isolado sem tocar no backend ou em `app.js`.
