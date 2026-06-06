# Odontograma Brana - Subetapa D2-B: bootstrap real da area principal

## Objetivo
- Ligar a tela odontologica ao bootstrap real da area principal do Brana Cloud.
- Fazer a tela abrir automaticamente abaixo da toolbar/menu ao entrar no sistema.
- Corrigir a entrada secundaria da Ficha Pessoal > Historico > Odontograma para reutilizar a mesma area principal.

## Problema validado pelo usuario
- A tela odontologica nao abriu automaticamente na area principal apos entrar no sistema.
- A entrada secundaria pelo botao Odontograma ainda cobria a tela e escondia menus/toolbar.
- A infraestrutura da D2-A existia, mas ainda nao estava ligada ao fluxo real de bootstrap.

## Fluxo real de bootstrap encontrado
- O ponto real de bootstrap do workspace foi identificado em `frontend/app.js`.
- A funcao responsavel pela validacao de sessao e por expor a area principal apos login e `carregarSessao()`.
- Depois da validacao em `/me`, o shell fica visivel, os menus permanecem disponiveis e a area central `workspace-empty` e o ponto certo para montar a tela odontologica.

## Container principal efetivamente usado
- `section#workspace-empty`
- Quando esse container nao esta disponivel, o fluxo mantem o fallback tecnico para `main.workspace`.
- A montagem principal agora usa esse container como host do odontograma, sem criar overlay fixo em `body`.

## O que foi alterado
- `frontend/app.js`
- `frontend/js/modules/tela-principal-odontologica-contratos.js`
- `frontend/js/modules/tela-principal-odontologica-entrada.js`
- `frontend/js/modules/odontograma-v1.js`
- `docs/11_roadmap_desenvolvimento.md`

## Como a abertura principal passou a acontecer automaticamente
- Depois que `carregarSessao()` confirma uma sessao valida, o frontend chama automaticamente `abrirTelaPrincipalOdontologicaNoWorkspace({ origem: "workspace-principal", modo: "visual-estatico" })`.
- Se a abertura principal falhar, o fluxo preserva fallback seguro para a implementacao legada.
- Nenhuma dependencia de paciente real, backend novo ou persistencia foi adicionada.

## Como a entrada secundaria foi corrigida
- O clique no botao `Odontograma` deixou de abrir um overlay em `body`.
- A entrada secundaria agora redireciona para `abrirTelaPrincipalOdontologicaNoWorkspace(...)`.
- O resultado final e a mesma area principal abaixo da toolbar/menu, sem ocultar a interface superior.
- O contexto de origem da Ficha Pessoal e preservado via `origemSecundaria`.

## Confirmacoes
- Menus e toolbar foram preservados.
- O botao Odontograma nao foi quebrado.
- O fallback antigo nao foi removido.
- A implementacao antiga nao foi removida.
- `frontend/index.html` nao foi alterado.
- Backend, banco, schema, migrations, seeds e endpoints nao foram alterados.
- Nenhum asset foi alterado.
- Nenhum asset do EasyDental foi copiado.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum arquivo do EasyDental foi copiado para o Brana Cloud.
- A blindagem textual/mojibake foi respeitada.

## Validacao tecnica
- `node --check` passou para:
  - `frontend/app.js`
  - `frontend/js/modules/tela-principal-odontologica-contratos.js`
  - `frontend/js/modules/tela-principal-odontologica-entrada.js`
  - `frontend/js/modules/odontograma-v1.js`
- Simulacao em DOM fake confirmou:
  - entrada principal com `ok: true`
  - entrada secundaria com `ok: true`
  - host montado dentro de `#workspace-empty`
  - nenhum overlay em `body`
  - origem secundaria preservada como `ficha-pessoal-historico`

## Limitacoes remanescentes
- A tela ainda e um esqueleto visual mockado.
- Nao ha backend, agenda real, historico real ou persistencia nova nesta etapa.
- O refinamento visual fino do odontograma continua para etapa futura.

## Onde testar
### Teste A - entrada principal
- Abrir o Brana Cloud e entrar no sistema.
- Verificar se a tela odontologica aparece automaticamente abaixo da toolbar/menu.
- Verificar se menus e toolbar continuam visiveis.
- Verificar se a area cinza principal foi ocupada corretamente.

### Teste B - entrada secundaria
- Abrir Ficha Pessoal.
- Abrir um paciente.
- Entrar na aba Historico.
- Clicar em Odontograma.
- Verificar se a tela abre na mesma area principal abaixo da toolbar.
- Verificar se menus e toolbar nao somem.
- Verificar se Ficha Pessoal/Historico nao quebraram.

## Proxima etapa recomendada
- D2-C: refino de encaixe/layout da tela odontologica ja no workspace principal.
- Se ainda faltar comportamento inicial de produto, deixar para uma etapa futura de integracao com avisos/prioridades de abertura.
