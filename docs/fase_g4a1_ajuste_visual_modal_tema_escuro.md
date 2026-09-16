# Fase G.4A.1 - Ajuste visual do modal e tema escuro

Data: 2026-08-04

## Escopo
- compactar `Ok` e `Cancela`;
- alinhar o rodape ao painel direito;
- trocar brancos fixos por tokens do tema;
- manter o editor 15x15 e a persistencia de `imagem_custom` intactos.

## Resultado
- modal e editor receberam superficies coerentes com `--brana-*`;
- rodape ficou contido no painel direito;
- botoes passaram a ter dimensoes compactas e estado desabilitado legivel;
- biblioteca e area de desenho passaram a responder ao tema escuro.

## Estado visual homologado
- estrutura final com duas colunas preservada;
- label `Especialidade` sem o sufixo `"(botão)"`;
- opcao `Sistema` visivel e desabilitada;
- opcao `Definido pelo usuario` selecionada;
- mensagem explicativa removida do modal;
- `Ok` e `Cancela` deslocados para o rodape geral do modal, fora do painel direito;
- rodape alinhado a direita, totalmente contido e sem atravessar divisores;
- tema claro aprovado;
- tema escuro aprovado;
- editor 15x15 preservado;
- `imagem_custom` preservada;
- fluxos `Novo` e `Altera` preservados;
- testes direcionados aprovados;
- build aprovado;
- capturas visuais registradas no runtime desta etapa.

### Checklist visual do modal
- [ ] titulo correto
- [ ] Especialidade sem `(botao)`
- [ ] Sistema desabilitado
- [ ] Definido pelo usuario selecionado
- [ ] mensagem explicativa removida
- [ ] biblioteca visivel
- [ ] area de desenho visivel
- [ ] Ok e Cancela fora do painel direito
- [ ] botoes totalmente contidos
- [ ] tema claro legivel
- [ ] tema escuro legivel
- [ ] editor 15x15 abre
- [ ] preview funciona
- [ ] imagem_custom nao regride

## Validacao
- testes estruturais ampliados;
- build do frontend previsto como validacao obrigatoria.

## Proxima etapa
- manter a G.4B bloqueada ate homologacao visual e runtime completa.
