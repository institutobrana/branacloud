# Plano de Implementacao - Simbolos Graficos - Novo

## Objetivo
Implementar o modal `Novo` de simbolos graficos no React de forma segura, sem inventar comportamento e sem alterar backend nesta rodada.

## Regra de bloqueio
Se qualquer um dos pontos abaixo continuar sem prova suficiente, a implementacao deve parar:
- opcoes completas de forma de marcacao
- semantica final de Sistema versus Definido pelo usuario
- persistencia do desenho
- biblioteca de simbolos
- efeito no odontograma
- validacoes finais do OK

## Plano tecnico em micropassos

### Fase 0 - encerramento da auditoria
1. Consolidar evidencias do EasyDental Desktop.
2. Consolidar evidencias do Brana Cloud legado.
3. Consolidar evidencias do backend atual.
4. Consolidar lacunas de contrato.

### Fase 1 - infraestrutura visual do modal
1. Criar componente dedicado de modal.
2. Preservar shell atual do React.
3. Manter toolbar e tabela sem regredir o fluxo atual.
4. Abrir o modal apenas quando existir contrato aprovado.

### Fase 2 - formulario basico
1. Renderizar `descricao`.
2. Renderizar `tipo_simbolo`.
3. Renderizar `especialidade`.
4. Renderizar `tipo_marca`.
5. Renderizar preview da imagem base.
6. Aplicar validacoes locais confirmadas.

### Fase 3 - biblioteca e preview
1. Consumir o catalogo ja existente.
2. Exibir grade ou lista da biblioteca.
3. Permitir selecao de simbolo base.
4. Atualizar preview e estado local.

### Fase 4 - editor de desenho
1. Integrar editor separado, se o contrato final comprovar necessidade.
2. Manter limpeza e edicao isoladas.
3. Nao misturar editor com toolbar da pagina.

### Fase 5 - integracao com API
1. Consumir `POST /cadastros/simbolos-graficos`.
2. Enviar apenas campos aceitos pelo backend.
3. Impedir submissao duplicada.
4. Tratar erros sem fechar o modal.

### Fase 6 - pos-sucesso
1. Fechar o modal.
2. Recarregar a tabela.
3. Selecionar a linha criada.
4. Atualizar rodape e estado visual.

### Fase 7 - testes
1. Testar abertura e fechamento.
2. Testar validacoes.
3. Testar payload.
4. Testar sucesso e erro.
5. Testar selecao da linha criada.
6. Testar tema claro e escuro.

## Arquitetura sugerida
- Componente dedicado para o modal.
- Hook dedicado para mutacao/criacao.
- Servico isolado para `createSimboloGrafico`.
- Reuso do mapper e da tabela existentes.
- Nenhuma chamada HTTP direta na toolbar.

## Dependencias ja existentes que podem ser reaproveitadas
- pagina atual do modulo
- tabela compacta
- toolbar atual
- hook de carregamento
- mapa de especialidades
- contrato de leitura do backend

## Dependencias ainda nao confirmadas
- editor grafico real para desenho
- payload final de `imagem_custom`
- mapeamento completo da biblioteca por forma e especialidade

## Riscos
- Reproduzir apenas o visual sem a regra funcional.
- Capturar um contrato incompleto da biblioteca.
- Tratar `tipo_simbolo` como simples booleano sem validar o catalogo oficial.
- Usar fallback visual sem prova de desktop.

## Decisao de escopo
- Esta rodada nao implementa nada.
- O plano acima serve apenas como sequencia segura para a proxima etapa.
