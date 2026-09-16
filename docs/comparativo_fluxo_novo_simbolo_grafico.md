# Comparativo - Fluxo "Novo" de Simbolos Graficos

## Objetivo
Comparar o fluxo `Novo` do EasyDental, o legado atual do Brana Cloud, a base de backend e a situacao alvo do React.

## Matriz de evidencias
| Dimensao | EasyDental | Brana legado | Backend atual | Situacao final alvo |
|---|---|---|---|---|
| Titulo da janela | `Edita simbolo grafico` | `Edita símbolo gráfico` em `frontend/app.js` | nao aplicavel | deve ser preservado |
| Modal dedicado | sim | sim | n/a | sim |
| Nome do simbolo | sim | sim | `descricao` | sim |
| Especialidade | sim | sim | `especialidade` | sim |
| Forma de marcacao | sim | sim | `tipo_marca` / mapeamento | sim |
| Tipo do simbolo | sistema/usuario | sistema/usuario | `tipo_simbolo` | sim |
| Biblioteca visual | sim | sim | seed + catalogo | sim |
| Area de desenho | sim | sim | `imagem_custom` e bitmaps | sim |
| Preview | sim | sim | `imagem_url` / `imagem_custom` | sim |
| Botao confirmar | sim | `Ok` | `POST/PUT` | sim |
| Botao cancelar | sim | `Cancela` | n/a | sim |
| Editor embarcado | presumivel/visual | sim, via iframe | n/a | sim |
| `postMessage` | nao confirmado | sim | n/a | sim |
| Persistencia por clinica | nao validado | sim | sim | sim |

## Leitura consolidada
### EasyDental
- A tela e um modal grafico rico.
- O desenho participa do cadastro.
- A biblioteca visual faz parte da experiencia.

### Brana legado
- O fluxo ja existe no frontend legado.
- O modal e montado por `frontend/app.js`.
- O editor grafico e um iframe com comunicacao por mensagem.

### Backend atual
- O model e o seed ja carregam o catalogo.
- A API autentica e filtra por clinica.
- O cadastro suporta metadados de desenho e catalogo oficial.

### Situacao final alvo
- O React deve manter o contrato estrutural do modal.
- O React nao deve simplificar o fluxo para um formulario seco.
- O editor precisa continuar separado da tela principal.

## Divergencias que interessam para o contrato
- O Desktop sugere maior densidade visual.
- O legado ja estabilizou o contrato de dados.
- O futuro React precisa unir as duas coisas sem perder a fronteira do editor.

## Conclusao
O fluxo `Novo` nao e apenas cadastro textual. Ele e um modal de criacao de simbolo grafico com desenho, biblioteca, preview e semantica de sistema/usuario. Esse conjunto e o minimo a preservar no React.

## Fontes de apoio
- `docs/auditoria_fluxo_novo_simbolo_grafico_easydental.md`
- `docs/auditoria_fluxo_novo_simbolo_grafico_brana_legado.md`
- `docs/auditoria_editor_simbolo_grafico_postmessage.md`
- `docs/auditoria_simbolos_graficos_brana_cloud.md`
- `docs/comparativo_simbolos_graficos_easydental_brana_cloud.md`
