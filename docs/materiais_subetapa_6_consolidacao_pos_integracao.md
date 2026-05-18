# Materiais - Subetapa 6 - Consolidacao documental pos integracao minima

## 1. Objetivo da Subetapa 6

Esta etapa e exclusivamente documental.

Confirmacoes centrais:

- nenhum codigo foi alterado nesta etapa;
- o objetivo e consolidar a integracao minima feita na Subetapa 5;
- `frontend/app.js` continua como fonte funcional da verdade;
- o namespace passivo de Materiais continua apenas como apoio documental e de encapsulamento.

## 2. Estado atual do modulo Materiais

Estado consolidado apos as subetapas anteriores:

- namespace passivo existente em `window.BranaMateriaisModule`;
- helper passivo existente: `materiaisUniqueAuxDescricoes(arr)`;
- integracao minima ja feita no `app.js` na Subetapa 5;
- `ativo: false`;
- `controlaFluxo: false`;
- `app.js` continua como fonte funcional da verdade;
- fallback local continua preservado no proprio `app.js`.

## 3. Revisao documental do ponto alterado

O ponto local alterado no `app.js` permanece restrito a uma unica funcao:

- `materiaisUniqueAuxDescricoes(arr)` em `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`

Leitura documental do trecho atual:

- a funcao local tenta acessar `window.BranaMateriaisModule`;
- se o namespace existir e expuser `materiaisUniqueAuxDescricoes` como funcao, ha tentativa de delegacao;
- se houver excecao inesperada, o fallback local continua no proprio `app.js`;
- a funcao original continua existindo;
- nao houve alteracao de chamadas espalhadas;
- nao houve alteracao em DOM, eventos, endpoints, payloads ou calculos.

Referencia de localizacao observada:

- `frontend/app.js:647-649`

## 4. Inventario atual do namespace

Conteudo publico atual de `window.BranaMateriaisModule`:

- `meta`;
- `nome`;
- `modulo`;
- `versaoSubetapa`;
- `status`;
- `ativo`;
- `controlaFluxo`;
- `descricao`;
- `riscosPreservados`;
- `dependenciasDocumentais`;
- `helpersCandidatosFuturos`;
- `materiaisUniqueAuxDescricoes(arr)`;
- `helpers`;
- `getInfo()`;
- `info()`.

Confirmacoes:

- o namespace continua passivo;
- `ativo` permanece `false`;
- `controlaFluxo` permanece `false`.

## 5. Avaliacao de risco pos-integração

Riscos ainda presentes:

- regressao nos combos auxiliares;
- duplicidade indevida ou mudanca de ordenacao;
- comportamento com entrada invalida;
- falha caso o namespace nao carregue;
- falha caso o helper lance erro;
- dependencia indireta com strings visiveis e com o estado de mojibake, sem qualquer correcao textual nesta etapa.

Leitura conservadora:

- a integracao e pequena e localizada;
- o risco tecnico imediato e baixo, mas o risco funcional acumulado continua relevante porque a saida do helper alimenta listas auxiliares usadas pela tela de Materiais.

## 6. Checklist manual obrigatorio antes de qualquer nova subetapa

### Materiais

- abrir o sistema;
- fazer `Ctrl+F5`;
- abrir a tela de Materiais;
- confirmar que a listagem carrega;
- confirmar que os combos auxiliares carregam;
- confirmar que nao ha duplicidades indevidas nos combos;
- confirmar que filtros funcionam;
- confirmar troca de tabela/lista;
- confirmar selecao de linha;
- confirmar duplo clique;
- confirmar que o modal principal abre e fecha;
- confirmar que Novo Material abre;
- confirmar que Alterar Material abre;
- confirmar que salvar material nao altera valores indevidamente;
- conferir preco;
- conferir relacao;
- conferir custo;
- conferir virgula/ponto decimal;
- confirmar que o modal de tabela/lista abre e fecha;
- confirmar que nao apareceu erro novo no console.

### Procedimentos

- abrir Procedimentos, se possivel;
- verificar se listas/materiais vinculados continuam aparecendo;
- verificar se custos derivados de materiais nao mudaram indevidamente.

### Procedimentos Genericos

- abrir Procedimentos Genericos, se possivel;
- verificar se listas/materiais vinculados continuam aparecendo;
- verificar se persistencia/visualizacao de materiais vinculados nao foi impactada.

## 7. Criterios para avancar ou parar

### Pode avancar somente se

- todos os testes manuais passarem;
- nao houver erro novo no console;
- combos auxiliares nao apresentarem duplicidade indevida;
- Materiais abrir, listar e filtrar normalmente;
- Procedimentos e Procedimentos Genericos nao forem impactados;
- preco, relacao e custo permanecerem corretos.

### Deve parar ou reverter se

- houver erro no console;
- combos auxiliares quebrarem;
- houver duplicidade indevida;
- Materiais deixar de abrir;
- o modal quebrar;
- preco, relacao ou custo mudarem;
- Procedimentos ou Procedimentos Genericos forem impactados.

## 8. Riscos preservados

Continuam fora da modularizacao:

- DOM;
- eventos;
- modais;
- renderizacao;
- selecao;
- duplo clique;
- `requestJson`/`fetch`;
- endpoints;
- payloads;
- calculo de preco/relacao/custo;
- parse numerico;
- formatacao monetaria;
- integracao com Procedimentos;
- integracao com Procedimentos Genericos;
- textos/mojibake.

## 9. Recomendacao objetiva para a proxima etapa

Recomendacao conservadora:

- **Opcao A**: pausa e testes manuais antes de qualquer nova subetapa.

Justificativa:

- a integracao minima ja foi feita;
- o proximo risco real esta no comportamento acumulado da tela e das dependencias cruzadas;
- ainda nao ha justificativa forte para mover mais logicamente em Materiais sem validar em navegador o que ja foi consolidado.

## 10. Documentos analisados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_3_helper_unique_aux_descricoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_4_consolidacao_pos_helper.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_5_integracao_helper_unique_aux_descricoes.md`

## 11. Checks executados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

Resultado:

- ambos passaram sem erro.

## 12. Onde testar no navegador

Esta etapa e documental, mas como a Subetapa 5 ja alterou o `app.js`, a validacao manual acumulada deve ser executada antes de qualquer proxima integracao.

Checklist pratico:

- abrir o sistema no navegador;
- fazer `Ctrl+F5`;
- abrir Materiais;
- validar a lista;
- validar filtros;
- validar troca de lista/tabela;
- validar selecao de linha;
- validar duplo clique;
- validar modal principal;
- validar modal de tabela/lista;
- validar Novo Material e Alterar Material;
- conferir preco, relacao, custo e separador decimal;
- confirmar ausencia de erro novo no console;
- se possivel, abrir Procedimentos e Procedimentos Genericos para conferir ausencia de impacto.

