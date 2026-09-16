# Auditoria - Fluxo "Novo" de Simbolos Graficos - EasyDental

## Escopo
Auditoria focada exclusivamente no que o fluxo `Configuracoes -> Simbolos graficos -> Novo` sugere no EasyDental Desktop, usando as imagens fornecidas e o acervo documental ja consolidado para o modulo.

## Evidencias observadas
- A janela original e uma tela de edicao/criacao de simbolo grafico.
- O titulo visivel e `Edita simbolo grafico`.
- Ha campos de nome, especialidade, forma de marcacao e tipo do simbolo.
- Ha uma biblioteca visual de simbolos com miniaturas.
- Ha area de desenho/preview.
- Ha botoes de acao para limpar/apagar desenho, editar desenho, confirmar e cancelar.
- O fluxo sugere uso de modal com desenho embarcado, nao apenas um formulario simples.

## Leitura funcional do fluxo "Novo"
### Campos provaveis do cadastro
- Nome do simbolo.
- Especialidade.
- Forma de marcacao no odontograma.
- Tipo do simbolo.
- Desenho.

### Controles visiveis
- Radio buttons para `Sistema` e `Definido pelo usuario`.
- Combo de especialidade.
- Combo de forma de marcacao.
- Biblioteca de simbolos com selecao visual.
- Area de desenho com preview.
- Botoes `Ok` e `Cancela`.

## Interpretacao tecnica controlada
- O desktop trata o fluxo como uma janela modal rica, com mistura de formulario, biblioteca e editor grafico.
- O simbolo parece ser persistido com base em nome, especialidade, tipo e imagem/dado grafico.
- A interface indica que o desenho nao e acessorio opcional; ele faz parte da identidade do simbolo.
- A existencia de biblioteca visual sugere apoio a selecao de catalogo e reutilizacao de simbolos padrao.

## O que nao foi confirmado aqui
- Estrutura interna do armazenamento no Delphi original.
- Regras exatas de validacao na gravacao do simbolo.
- Se o editor grafico era nativo, embutido ou um componente auxiliar.
- Se havia persistencia separada entre imagem, meta e catalogo.

## Conclusao da auditoria
O fluxo `Novo` do EasyDental indica que a futura tela React deve preservar:
- modal dedicado;
- nome + especialidade + forma + tipo;
- biblioteca visual;
- area de desenho/preview;
- botoes de confirmar e cancelar;
- separacao clara entre simbolo de sistema e simbolo do usuario.

## Fontes de apoio
- Imagens fornecidas pelo usuario.
- `docs/auditoria_simbolos_graficos_easydental.md`
- `docs/comparativo_simbolos_graficos_easydental_brana_cloud.md`
