# Fechamento da correção final da união em `L` - Serviços de protético

## 1. Objetivo
Corrigir a continuidade estrutural do shell da tela `Tabelas -> Serviços de protético`, eliminando o deslocamento percebido no encontro entre a barra lateral e a barra horizontal.

## 2. Evidência do defeito remanescente
Após a passada visual anterior, ainda havia:
- início da barra horizontal deslocado para a direita;
- faixa clara perceptível no canto superior esquerdo;
- leitura de duas peças separadas em vez de um único `L`.

## 3. Documentos do padrão em `L` encontrados
Documentos lidos e considerados:
- [docs/frontend_react_shell_topbar_fullwidth_layout.md](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_shell_topbar_fullwidth_layout.md)
- [docs/frontend_react_alinha_faixa_e_rail_mesmo_nivel.md](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_alinha_faixa_e_rail_mesmo_nivel.md)
- [docs/frontend_react_refino_quina_faixa_rail.md](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_refino_quina_faixa_rail.md)
- [docs/frontend_react_padrao_shell_modulos_administrativos.md](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_padrao_shell_modulos_administrativos.md)
- [docs/frontend_react_refino_visual_shell_operacional.md](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_refino_visual_shell_operacional.md)

## 4. Módulos de referência
Os módulos usados como referência estrutural foram:
- Doenças (CID)
- Materiais
- Procedimentos genéricos

Eles compartilham:
- shell global em `L`;
- barra operacional compacta;
- listagem abaixo da faixa;
- ausência de faixa extra de filtros fora do padrão do cabeçalho.

## 5. Comparação estrutural
A comparação mostrou que o shell geral já existia corretamente, mas a tela de serviços de protético ainda acrescentava um avanço lateral extra na própria banda do módulo.

## 6. Causa objetiva
A causa objetiva foi um `padding-left` adicional na banda específica da feature sobre um shell já deslocado pela grade global.

## 7. Seletor/componente causador
O seletor local responsável era:
- `.servicos-protetico-shell-band`

## 8. Propriedade/estrutura incorreta
Propriedade responsável:
- `padding-left`

Estrutura incorreta:
- banda da feature ainda recuava horizontalmente além do padrão do shell.

## 9. Correção aplicada
Foi aplicado ajuste mínimo e local:
- remoção do avanço lateral extra da banda de `Serviços de protético`;
- preservação da toolbar em linha única;
- preservação do label `Protético` ao lado do combo;
- preservação da ausência do bloco externo de filtros.

## 10. Justificativa da abordagem
A correção foi local porque:
- o shell global já era o padrão documentado;
- o desalinhamento vinha da feature;
- não havia motivo comprovado para alterar o comportamento global do shell.

## 11. Arquivos alterados
- [frontend-react/src/features/servicosProtetico/servicosProtetico.css](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [frontend-react/tests/servicosProtetico.test.js](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)

## 12. Medidas DOM antes e depois
Antes da correção final, a barra mostrava deslocamento visual perceptível à direita no início da faixa.

Depois da correção, o ajuste foi aplicado por CSS local na banda da feature, removendo o recuo lateral adicional. A validação geométrica completa no navegador autenticado ficou limitada pela sessão desta máquina ter redirecionado para `/login` durante a tentativa de rechecagem.

## 13. Tema claro
O tema claro já havia sido validado na etapa visual anterior. Nesta correção final, a estrutura foi preservada.

## 14. Tema escuro
O tema escuro já havia sido validado na etapa visual anterior. Nesta correção final, a estrutura foi preservada.

## 15. Desktop amplo
O ajuste foi feito sem introduzir variação específica de resolução.

## 16. Notebook
Não foi criado layout separado para notebook.

## 17. Regressão em módulos de referência
Não houve alteração global no shell nesta correção final, então não havia regressão estrutural a revalidar nesses módulos por mudança de código compartilhado.

## 18. Testes
Executado:
- `node --test tests/servicosProtetico.test.js`

Resultado:
- 13 testes aprovados
- 0 falhas

## 19. Build
Executado:
- `npm.cmd run build`

Resultado:
- build concluído com sucesso
- warning de chunk grande do Vite mantido

## 20. Console
Nenhum novo erro de console foi comprovado nesta correção final.

## 21. Caminhos das novas evidências
As capturas visuais anteriores permaneceram como referência do ciclo, mas a revalidação final ficou limitada pela sessão autenticada não ter sido recuperada durante esta execução.

## 22. Confirmação de que não foi usado remendo arbitrário
Não foi usado overlay, faixa extra, margem negativa, `position: absolute` improvisado ou pseudo-elemento novo. O ajuste foi local e estrutural.

## 23. CRUD e impressão
Não foram implementados CRUD nem impressão nesta etapa.
