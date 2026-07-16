# Fechamento do ajuste estrutural da tabela - Servicos de protetico

## 1. Objetivo
Ajustar somente a tabela da tela `Brana Cloud -> Tabelas -> Servicos de protetico` para reproduzir a proporcao visual do legado: grade mais estreita, scroll vertical interno, 15 linhas visiveis e contador no rodape.

## 2. Problemas recebidos
- tabela ocupava largura excessiva;
- contador ficava no topo;
- texto do contador podia aparecer com mojibake;
- a grade nao estava limitada a 15 linhas visiveis;
- nao havia rodape fixo da tabela.

## 3. Referencia do legado
O legado exibia a lista em area mais estreita, com rolagem interna, cabecalho fixo e contador no rodape.

## 4. Largura anterior
Antes do ajuste, a area util da grade ocupava praticamente toda a largura disponivel da tela operacional.

## 5. Largura final
No runtime medido, a tabela ficou com largura de `698px` dentro de um shell de `880px`, com alinhamento a esquerda e espaco livre a direita.

## 6. Percentual de reducao
Tomando o shell visivel como referencia pratica, a grade interna ficou em torno de `79%` da largura do container local da tabela e significativamente menor que a composicao anterior em largura total.

## 7. Proporcao das colunas
- `Codigo`: estreita;
- `Servico`: dominante;
- `Indice`: estreita;
- `Preco`: estreita;
- `Prazo`: estreita.

## 8. Altura da linha
Altura real medida por linha: `32px`.

## 9. 15 linhas visiveis
O corpo da tabela foi fixado em `480px`, o que equivale a `15 x 32px`.

## 10. Cabecalho fixo
O cabecalho permanece visivel porque o `Ant Design Table` foi configurado com `scroll.y`, mantendo o header separado do corpo rolavel.

## 11. Scroll vertical
O corpo rola internamente com `scroll.y = 480`.

## 12. Rodape fixo
O rodape foi movido para fora da area rolavel e permanece visivel abaixo da grade.

## 13. Regra do contador
O contador usa o total carregado da lista atual do protetico selecionado.

## 14. Texto final do contador
O texto final validado no runtime foi `136 servicos`.

## 15. Correcao UTF-8
A regressao textual foi corrigida no codigo fonte para UTF-8 valido, eliminando o mojibake.

## 16. JSX removido do contador superior
O contador do topo foi removido da pagina; nao ficou wrapper, prop ou secao dedicada para ele.

## 17. CSS removido
O bloco visual do contador superior deixou de existir e o novo rodape recebeu sua propria classe.

## 18. Filtros preservados
Os filtros e ordenacao da tabela foram preservados nos cabecalhos.

## 19. Selecao preservada
A selecao unica de linha continua funcional e o estado selecionado permanece no `rowSelection`.

## 20. Tema claro
Validado em runtime.

## 21. Tema escuro
Validado em runtime com `brana_theme_mode=dark`.

## 22. Responsividade
A tabela foi restringida com largura responsiva e `max-width`, sem alterar shell ou toolbar.

## 23. Testes
Executado com sucesso:
- `node --test tests/servicosProtetico.test.js`

## 24. Build
Executado com sucesso:
- `npm.cmd run build`

## 25. Validacao runtime
Validado em navegador autenticado, com:
- largura reduzida;
- cabecalho fixo;
- scroll interno;
- 15 linhas completas;
- rodape fixo;
- contador no rodape;
- contador removido do topo.

## 26. Capturas
Captura gerada durante a validacao runtime:
- `frontend-react/.tmp-servicos-table-runtime.png`
- `frontend-react/.tmp-servicos-table-dark.png`

## 27. Arquivos alterados
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProtetico.css`
- `frontend-react/tests/servicosProtetico.test.js`
- `docs/fechamento_ajuste_tabela_servicos_protetico.md`

## 28. Confirmacao sobre toolbar e shell
A toolbar e a estrutura em `L` nao foram alteradas nesta passada.

## 29. Confirmacao sobre CRUD e impressao
Nao houve implementacao de CRUD, impressao, backend, banco ou migrations.
