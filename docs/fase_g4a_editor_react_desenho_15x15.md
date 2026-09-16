# Fase G.4A - Editor React de desenho 15x15

Data: 2026-08-04

## Objetivo
Implementar a primeira versao funcional do editor grafico do modulo `Configuracoes -> Simbolos graficos`, sem reabrir backfill, manifesto, apply ou `scope=grade`.

## Arquitetura
- componente isolado `SimboloGraficoPixelEditor`;
- estado local da matriz 15x15;
- integracao com o modal compartilhado de Novo/Altera;
- confirmacao devolve PNG ao modal pai;
- o modal principal continua responsavel por POST e PUT.

## Grade
- 15 colunas;
- 15 linhas;
- 225 celulas;
- matriz booleana deterministica.

## Ferramentas
- Lapis;
- Borracha;
- Limpar;
- Confirmar;
- Cancelar.

## Interacao
- pointer events para clique e arraste;
- pointerup, pointerleave e pointercancel encerram o desenho;
- sem iframe;
- sem postMessage.

## PNG
- exportacao em PNG 15x15;
- fundo transparente;
- preview atualizado com pixelizacao.

## Importacao
- a imagem vigente pode ser reaberta no editor;
- a matriz e reconstruida por leitura do canvas;
- a imagem custom continua opcional.

## Integracao Novo/Altera
- Novo pode abrir o editor vazio;
- Altera preserva a imagem atual;
- Confirmar atualiza o preview do modal;
- Cancelar descarta as alteracoes do editor.

## Testes
- helpers puros da matriz cobertos;
- contrato textual do modal coberto;
- build do frontend aprovado.

## Runtime
- fluxo funcional validado em runtime com persistencia de `imagem_custom`;
- o desenho customizado voltou no `Altera`;
- a fase seguinte ficou focada em ajuste visual do modal e do tema escuro.

## Estado visual homologado
- estrutura final com duas colunas preservada;
- label `Especialidade` sem o sufixo `"(botão)"`;
- opção `Sistema` visível e desabilitada;
- opção `Definido pelo usuário` selecionada;
- mensagem explicativa removida do modal;
- painel esquerdo com `Nome`, `Especialidade`, `Forma de marcação` e `Biblioteca-base`;
- painel direito com `Tipo do símbolo` e `Desenho`;
- `Ok` e `Cancela` fora do painel direito, no rodapé geral do modal, alinhados à direita e contidos;
- tema claro aprovado;
- tema escuro aprovado;
- editor 15x15 preservado;
- `imagem_custom` preservada;
- fluxos `Novo` e `Altera` preservados;
- testes direcionados aprovados;
- build aprovado;
- capturas visuais registradas no runtime desta etapa.

### Checklist visual do modal
- [ ] título correto
- [ ] Especialidade sem “(botão)”
- [ ] Sistema desabilitado
- [ ] Definido pelo usuário selecionado
- [ ] mensagem explicativa removida
- [ ] biblioteca visível
- [ ] área de desenho visível
- [ ] Ok e Cancela fora do painel direito
- [ ] botões totalmente contidos
- [ ] tema claro legível
- [ ] tema escuro legível
- [ ] editor 15x15 abre
- [ ] preview funciona
- [ ] imagem_custom não regride

## Limitacoes
- biblioteca completa nao foi implementada;
- ferramentas geometricas e undo/redo continuam fora de escopo;
- backend nao foi alterado.

## Proxima etapa
Executar `G.4A.1` para ajuste visual do modal e do tema escuro antes de qualquer avance para `G.4B`.
