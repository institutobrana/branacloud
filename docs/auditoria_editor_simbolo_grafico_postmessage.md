# Auditoria - Editor de Simbolo Grafico e Contrato `postMessage`

## Escopo
Auditoria especifica da interacao entre a tela principal e o editor grafico embutido.

## Evidencias tecnicas
- O frontend abre o editor por iframe.
- O editor usa comunicacao por `postMessage`.
- A pagina principal observa eventos de fechamento e salvamento vindos do iframe.
- O fluxo inclui validacao de origem da mensagem e verificacao de contexto do simbolo corrente.

## Eventos observados
### Fechamento do editor
- Mensagem de fechamento encerra o iframe e oculta o backdrop.
- O editor volta para `about:blank` ao fechar.

### Salvamento do editor
- Mensagem de salvamento entrega a imagem/dados editados.
- O fluxo principal aplica a imagem editada no preview.
- O registro pode ser persistido a partir do payload recebido.

### Tratamento de erro
- O frontend trata mensagens invalidas ou de origem nao esperada.
- O fluxo evita aplicar conteudo fora do contexto ativo.

## Estrutura contratual inferida
- O editor nao e um componente solto.
- Ele depende do modal principal para contexto, persistencia e encerramento.
- O payload precisa carregar identificacao suficiente para nao salvar em simbolo errado.

## Implicacoes para o React
- O React deve manter a separacao entre modal estrutural e editor interno.
- O editor precisa nascer com contrato de entrada/saida claro.
- O `postMessage` deve continuar sendo a fronteira entre pagina e desenhador.
- O salvamento precisa ser sincrono com o estado da tela principal.

## Riscos observados
- Sem validacao de origem, o iframe poderia enviar mensagem indevida.
- Sem contexto do simbolo atual, haveria risco de sobrescrita do item errado.
- Sem fechamento consistente, o overlay do editor poderia ficar preso.

## Fontes de apoio
- `frontend/app.js`
- `frontend/mock_simbolo_editor.html`
