# Fechamento da etapa funcional: Novo serviço - Serviços de protético

## 1. Objetivo
Implementar somente o fluxo funcional de cadastro de um novo serviço na tela **Tabelas -> Serviços de protético**, preservando o backend, o banco, o shell e as demais ações do módulo.

## 2. Escopo executado
- Abertura do modal de novo serviço a partir do botao `Novo servico...`.
- Formulario modular de inclusao.
- Validacao local antes do envio.
- Montagem do payload normalizado.
- Envio por `POST /proteticos/{protetico_id}/servicos`.
- Tratamento de erro e bloqueio de duplo submit.
- Fechamento do modal apos sucesso.
- Recarregamento da listagem.
- Manutencao do protetico selecionado.
- Selecionar o novo registro quando o backend retorna `id`.
- Testes e build do frontend React.

## 3. Restricoes respeitadas
- Nao houve alteracao de backend, banco, migration ou rota.
- Nao houve implementacao de Altera, Elimina, Imprime ou qualquer outra frente.
- Nao houve alteracao de rotas do shell.
- Nao houve commit nem push.
- Nao houve tentativa de limpar ou reverter o worktree.

## 4. Estado inicial do repositorio
- Diretorio usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch usada: `modularizacao-segura-fase-1`
- Remote origin: `https://github.com/institutobrana/branacloud.git`
- Status inicial observado antes desta etapa: worktree ja estava sujo com multiplas alteracoes preexistentes de outras frentes.
- Confirmacao operacional: nenhuma alteracao externa foi tocada fora do que foi necessario para esta etapa funcional e do documento final.

## 5. Documentos existentes encontrados
Durante a revisao do repositorio, havia documentacao ampla em `docs/`, incluindo contratos, auditorias e referencias historicas. Para esta etapa, o reaproveitamento relevante foi limitado ao padrao de shell e ao contrato funcional ja consolidado de módulos React semelhantes.

Arquivos de referencia usados como base de padrao:
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/contrato_implementacao_tabela_procedimentos_frontend_react.md`
- `docs/contrato_implementacao_especialidades_frontend_react.md`
- `docs/auditoria_tabela_procedimentos_frontend_react.md`

Reaproveitamentos concretos:
- padrao de toolbar via shell;
- uso de modal compacto com `BranaModal`;
- organizacao em feature modular com utils, hooks e components;
- padrao de chamada autenticada via `requestJson`.

## 6. Arquivos do frontend legado / feature React envolvidos
Arquivos efetivamente tocados nesta etapa:
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`
- `frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`
- `frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js`
- `frontend-react/src/app/App.jsx`
- `frontend-react/tests/servicosProtetico.test.js`

## 7. Fluxo de abertura do modulo
O modulo continua acessado pela rota `/app/tabelas/servicos-protetico`, com o shell ja existente em `frontend-react/src/app/App.jsx`.

Fluxo funcional novo:
1. A tela carrega proteticos e servicos do protetico selecionado.
2. O usuario escolhe um protetico no combo.
3. O botao `Novo servico...` fica habilitado apenas quando ha protetico selecionado e nao ha carregamento.
4. Ao acionar o botao, o shell emite um evento interno e a pagina abre o modal de cadastro.
5. O modal mostra o protetico atual e o formulario vazio.
6. Ao salvar, o formulario valida e envia o payload ao backend.
7. Em caso de sucesso, o modal fecha, a lista recarrega e o novo item pode ser selecionado.

## 8. Estrutura visual atual
A visao da tela principal permanece a mesma da listagem anterior:
- combo `Protetico` na barra horizontal;
- botao `Novo servico...`;
- botoes `Altera...`, `Elimina` e `Imprime...` permanecem desabilitados nesta etapa;
- tabela compacta;
- contador no rodape.

O novo modal e compacto e usa o mesmo padrao visual de outros modais da aplicacao.

## 9. Combo Protetico
Origem funcional:
- endpoint: `GET /proteticos`
- arquivo: `frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`
- normalizacao: `normalizeProtetico`

Comportamento observado:
- usa lista vinda do backend autenticado;
- exibe `nome` do protetico;
- impede troca de protetico enquanto o modal de novo servico esta aberto;
- o carregamento da lista e do conjunto de servicos continua separado.

## 10. Tabela e colunas
Esta etapa nao alterou a tabela nem suas colunas.

Colunas atuais mantidas:
- `codigo`
- `nome`
- `indice`
- `preco`
- `prazo`

O cadastro novo nao inventa novo campo de codigo. O `codigo` continua vindo do contrato existente da listagem e do mapeamento do frontend, sem mexer em banco ou backend.

## 11. Formulario de inclusao e alteracao
Foi criado apenas o formulario de inclusao reutilizavel do novo modal:
- `ServicoProteticoForm`
- `ServicoProteticoModal`

Campos do formulario:
- `nome`
- `indice`
- `preco`
- `prazo`

Regras:
- `nome` obrigatorio;
- `indice` obrigatorio;
- `preco` aceita valor vazio, mas valida formato quando preenchido;
- `prazo` aceita valor vazio, mas valida formato quando preenchido.

## 12. Ação Novo servico
Implementacao funcional concluida.

Detalhes:
- botao habilitado apenas com protetico selecionado;
- modal abre com o protetico congelado no contexto do cadastro;
- formulario limpa ao abrir;
- submit bloqueia duplo envio via estado `saving`;
- erro de API exibe `message.error`;
- sucesso fecha o modal;
- sucesso dispara recarga da listagem;
- protetico selecionado permanece o mesmo;
- se o backend retornar `id`, a linha criada passa a ser selecionada.

## 13. Ação Altera
Nao implementada nesta etapa.

## 14. Ação Elimina
Nao implementada nesta etapa.

## 15. Ação Imprime
Nao implementada nesta etapa.

## 16. Ação Fecha
Nao houve alteracao funcional na logica de fechar a tela.
O shell continua responsavel pela navegacao global; o modal de novo servico fecha independentemente do restante da pagina.

## 17. Backend e endpoints
Endpoint usado pelo novo fluxo:
- `POST /proteticos/{protetico_id}/servicos`

Leituras de apoio:
- `GET /proteticos`
- `GET /proteticos/{protetico_id}/servicos`

Contrato confirmado no backend:
- payload com `nome`, `indice`, `preco`, `prazo`;
- backend normaliza nome e indice;
- valida duplicidade por protetico e nome;
- valida protetico inexistente com `404`.

## 18. Banco e relacionamentos
Nao houve leitura direta de banco nesta etapa. O fluxo foi sustentado pelo contrato do backend ja existente.

Modelo funcional observado pelo backend:
- servico pertence a um protetico;
- unicidade por `protetico_id` + `nome`;
- sem alteracao estrutural do banco.

## 19. EasyDental Desktop
Nao foi necessario alterar nada no desktop para o cadastro novo desta etapa.
A referencia desktop permanece util como comparativo funcional para as proximas fases, mas nao foi reimplementada aqui.

## 20. Campos e regras
- `nome`: texto trimado antes do envio.
- `indice`: trimado; default visual e de payload preserva `R$` quando vazio.
- `preco`: parse pt-BR para numero.
- `prazo`: parse inteiro a partir de entrada textual.

## 21. Codigo do servico
O `codigo` nao foi inventado nesta etapa.
O que existe hoje e:
- o `codigo` ja aparece na listagem e nos mapeamentos do frontend;
- o cadastro novo usa o contrato existente do backend;
- nao houve criacao de novo campo em banco ou novo endpoint para codificar servico.

## 22. Indice
O `indice` foi tratado como campo textual no formulario, mas validado e normalizado antes do envio.
O backend atual converte o valor conforme o contrato vigente.

## 23. Preco
- entrada aceita formato pt-BR;
- conversao para numero ocorre antes do envio;
- o valor e mantido como numero no payload.

## 24. Prazo
- entrada aceita valor textual numerico;
- conversao para inteiro ocorre antes do envio;
- valor vazio cai para `0` no payload normalizado.

## 25. Permissoes
Nao foram alteradas permissoes.
O endpoint existente continua dependendo da autenticacao e da permissao ja aplicadas no backend.

## 26. Tratamento de erros
Erros tratados no novo fluxo:
- sessao expirada;
- protetico invalido;
- validacao local;
- erro de duplicidade;
- erro de rede ou resposta inesperada.

O modal nao fecha em caso de erro.

## 27. Dependencias
Dependencias reutilizadas:
- `antd`
- `BranaModal`
- `requestJson`
- `normalizeServico`
- hooks e utils da feature `servicosProtetico`

## 28. Diferencas entre as implementacoes
Comparado ao legado anterior da tela:
- o novo fluxo de cadastro agora esta modulardo em React;
- a persistencia usa o contrato autenticado ja existente;
- o modal foi separado da pagina;
- a validacao foi isolada em util;
- o payload foi normalizado antes da chamada.

## 29. Referencias do frontend React
Padrões que podem ser reutilizados nas proximas etapas:
- pagina feature + hook de carga;
- toolbar recebendo estado via shell;
- modal separado;
- util para payload;
- util para validacao;
- API dedicada por feature.

## 30. Proposta modular futura
Estrutura sugerida para evolucao da feature:
- `features/servicosProtetico/ServicosProteticoPage.jsx`
- `features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `features/servicosProtetico/components/ServicoProteticoModal.jsx`
- `features/servicosProtetico/components/ServicoProteticoForm.jsx`
- `features/servicosProtetico/hooks/useServicosProtetico.js`
- `features/servicosProtetico/hooks/useServicoProteticoCreate.js`
- `features/servicosProtetico/servicosProteticoApi.js`
- `features/servicosProtetico/utils/servicosProteticoCreatePayload.js`
- `features/servicosProtetico/utils/servicosProteticoValidators.js`

## 31. Lacunas
- Altera, Elimina e Imprime continuam pendentes.
- O desktop EasyDental ainda precisa ser confrontado para o contrato completo.
- A coluna `codigo` segue sem fonte nova de banco; o contrato atual precisa continuar sendo respeitado nas proximas etapas.

## 32. Riscos
- risco de regressao se o protetico mudar enquanto o cadastro esta aberto;
- risco de duplicidade se o backend rejeitar nome repetido;
- risco de interpretacao errada do campo `indice`;
- risco de mudar contrato visual da tabela sem base de dados nova;
- risco de duplicar regra de negocio no componente visual.

## 33. Decisoes pendentes
- definir se a lista apos cadastro deve manter filtro vazio ou restaurar o ultimo filtro;
- confirmar se o novo item deve ser sempre selecionado apos criar;
- confirmar se `indice` deve continuar textual no formulario ou virar componente mais especializado na proxima fase.

## 34. Criterios de aceite da futura implementacao
- salvar novo servico com sucesso via API real;
- fechar modal apos sucesso;
- impedir duplo submit;
- recarregar lista;
- manter o protetico selecionado;
- selecionar o novo registro quando houver `id`;
- nao alterar backend, banco ou rotas.

## 35. Lista completa dos arquivos lidos
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/components/BranaModal.jsx`
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`
- `frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`
- `frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js`
- `frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js`
- `frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js`
- `frontend-react/tests/servicosProtetico.test.js`

## 36. Conclusao
O fluxo funcional de **Novo servico** foi implementado e validado com sucesso em teste automatizado e build do frontend React.

Confirmacoes finais:
- nenhum banco foi modificado;
- nenhuma migration foi criada;
- nenhum commit foi feito;
- nenhum push foi feito;
- nenhum arquivo externo ao necessario foi alterado por esta etapa;
- a coluna `codigo` foi tratada como contrato existente, nao como invencao;
- a impressao continua fora do escopo desta etapa;
- o EasyDental Desktop permanece como referencia para fase posterior.
