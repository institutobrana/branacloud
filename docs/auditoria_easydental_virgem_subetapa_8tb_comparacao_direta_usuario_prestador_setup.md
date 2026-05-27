# Auditoria EasyDental virgem - Subetapa 8T-B - comparacao direta de usuario, prestador, unidade e setup

## 1. Contexto

- A Subetapa 8T documentou a validacao manual e o contrato preliminar para o usuario ADM e para o setup.
- A 8T fechou a regra funcional, mas nao fez uma nova consulta direta no EasyDental virgem nesta frente.
- Esta 8T-B complementa a 8T antes da implementacao isolada da 8U.
- Nao ha implementacao nesta etapa.
- O objetivo aqui e comparar, de forma documental e somente leitura, o EasyDental virgem com o Brana atual para confirmar a regra de usuario, prestador, unidade, tipo e setup.

## 2. Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum banco Brana foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada ou excluida.
- O setup nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O caminho `\\Sonyvaio\c\EDS70` nao estava acessivel nesta sessao, entao a leitura direta foi complementada com o mirror local somente leitura e com os documentos historicos ja produzidos.

## 3. Fonte EasyDental verificada

- Caminho principal solicitado: `\\Sonyvaio\c\EDS70`
- Resultado da verificacao nesta sessao: nao acessivel.
- Metodo de leitura usado: inspeção somente leitura do mirror local `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70`, sobretudo dos arquivos `Dados\Dist\*.raw`, da estrutura SQL registrada em `eds70.sql` e dos documentos historicos desta trilha.
- Tabelas consultadas por metadados, estrutura e contratos historicos:
  - `USUARIO`
  - `LOGON`
  - `PRESTADOR`
  - `CCCIRURGIAO`
  - `PESSOAL`
  - `UNIDADE`
  - `_TIPO_USUARIO`
  - `SIS_PERFIL`
  - `SIS_MODULO`
  - `SIS_FUNCAO`
  - `USUARIO_PERFIL`
  - `USUARIO_MODULO`
  - `USUARIO_FUNCAO`
  - `SISTEMA`
- Limitacoes:
  - nao houve conexao viva ao share UNC nesta sessao;
  - nao houve query de escrita;
  - nao houve abertura de telas do EasyDental;
  - a conclusao direta sobre alguns pontos depende de combinacao entre mirror local, estrutura SQL e docs anteriores.

## 4. Achados EasyDental - Mestre

- Registros/indicios encontrados:
  - `USUARIO.raw` contem a string `Mestre`.
  - `PRESTADOR.raw` tambem contem a string `Mestre`.
  - Os documentos historicos desta trilha ja tratavam `Mestre` como o papel funcional do usuario de maior privilegio.
- Usuario/prestador:
  - o contrato historico aponta `Mestre` como usuario funcional inicial, nao como simples prestador isolado;
  - o prestador associado ao papel administrativo funcional existe no contrato legado.
- ID/codigo:
  - os documentos anteriores desta trilha usam `NROUSR=1` e `PRESTADOR ID=1` como melhor equivalente funcional do `Mestre`.
- Tipo/categoria:
  - o papel administrativo funcional nao se apresentou aqui como um novo tipo literal separado;
  - o tipo de usuario legado relevante continua ancorado na tabela `_TIPO_USUARIO`.
- Unidade:
  - a unidade inicial do legado aparece vinculada ao registro estrutural de unidade, com `0001` / `Principal` como referencia de base.
- Permissoes/vinculos:
  - `USUARIO` possui FKs para prestador e unidade;
  - `USUARIO_PERFIL`, `USUARIO_MODULO` e `USUARIO_FUNCAO` formam a matriz de acesso;
  - `SIS_MODULO` e `SIS_FUNCAO` sustentam o controle de senha e permissao.
- Observacoes:
  - a leitura confirma o papel funcional do `Mestre`, mas nao justificaria renomear todo o Brana para esse termo;
  - o Brana deve continuar usando o contrato de conta/ADM funcional, com o nome do prestador vindo do cadastro.

## 5. Achados EasyDental - Clinica

- Registros/indicios encontrados:
  - `PRESTADOR.raw` contem a string `Clínica`.
  - `USUARIO.raw` tambem contem a string `Clínica`.
  - Os documentos historicos desta trilha ja fixaram `Clínica` como o prestador sistêmico literal do legado.
- Usuario/prestador:
  - `Clínica` aparece como parte da base estrutural, preservada para a conta;
  - no contrato historico, ela corresponde ao prestador sistêmico.
- ID/codigo:
  - os documentos anteriores desta trilha apontam `USUARIO 255` / `PRESTADOR 255` como referencia estrutural da `Clínica` no legado.
- Tipo/categoria:
  - o tipo legado relacionado a `Clínica` continua ligado ao seed de `_TIPO_USUARIO`, sem exigir a troca do nome funcional no Brana.
- Unidade:
  - `UNIDADE.raw` traz `0001` e `Principal`, reforcando a unidade base do legado.
- Permissoes/vinculos:
  - a estrutura de `USUARIO` guarda o vinculo com prestador e unidade;
  - o prestador sistemico nao nasce como algo separado da identidade da conta.
- Observacoes:
  - `Clínica` deve continuar sendo tratada como prestador sistêmico;
  - o Brana nao precisa renomear tudo para `Clínica` ou `Mestre`, apenas manter a equivalencia funcional.

## 6. Achados EasyDental - controle de usuarios/senhas, auditoria e setup

- Checkbox controle usuarios/senhas:
  - `SISTEMA.raw` traz a string `ControleUsuarios=0`.
  - O contrato historico ja registrava o nascimento com o controle desativado.
- Checkbox auditoria:
  - `SISTEMA.raw` traz a string `Auditoria=0`.
  - O contrato historico tambem ja registrava auditoria desativada no nascimento.
- Menu alterar senha:
  - o contrato historico desta trilha mostra que o menu de alteracao de senha depende do estado do controle interno.
- Comportamento esperado para usuario novo:
  - nao foi encontrado aqui um setup generico para todo usuario novo;
  - o que o legado documentado mostra e um primeiro acesso do usuario inicial / admin funcional, com seguranca e liberação do sistema.
- Exige reiniciar sistema:
  - nao houve leitura que confirme necessidade de reinicio nesta etapa;
  - esta subetapa nao executou alterações nem abertura de telas.
- Limitacoes:
  - a parte de setup foi confirmada de forma documental e estrutural, nao por interacao ativa com o EasyDental nesta sessao.

## 7. Comparativo EasyDental x Brana

| Item | EasyDental virgem | Brana atual | Regra proposta | Confiança | Pendência |
| --- | --- | --- | --- | --- | --- |
| Mestre como usuario | Papel funcional inicial de maior privilegio, com `Mestre` presente nos indícios lidos e contratos historicos | O Brana já tem o prestador ADM/Mestre funcional, mas o modulo Usuários ainda não nasce totalmente alinhado | Manter Mestre como equivalencia funcional, sem renomear todo o produto | Media | Ajustar o nascimento do usuario ADM |
| Mestre como prestador | Existe como equivalente funcional no legado | Existe como prestador ADM/Mestre funcional | Manter o prestador ADM funcional como equivalente | Alta | Validar refletindo o vinculo no modulo Usuários |
| Clínica como prestador | Prestador sistêmico literal preservado na base | Prestador sistêmico Clínica preservado | Manter como prestador sistêmico da conta | Alta | Nenhuma estrutural nesta frente |
| Clínica como tipo/categoria | Aparece como referencia estrutural legada | Continua como contrato historico/funcional no Brana | Não renomear a conta inteira para Clínica | Media | Definir apenas a equivalência funcional |
| Tipo do usuario ADM | O legado aponta para um tipo de usuario próprio do admin funcional, ligado à tabela `_TIPO_USUARIO` | Hoje o nascimento do ADM ainda nao ficou fechado no modulo Usuários | O ADM deve nascer como Dentista (CD) | Media | Ajuste de signup/usuario |
| Associacao ao prestador | O usuario inicial funcional se liga ao prestador funcional | O prestador ADM já existe no nascimento de novas contas | O usuario ADM deve ligar ao prestador ADM/Mestre funcional | Alta | Garantir reflexo no módulo Usuários |
| Unidade | `0001` / `Principal` aparece como unidade base do legado | A unidade Principal / 0001 já foi implementada | O usuario ADM deve herdar `Principal / 0001` | Alta | Garantir preenchimento no nascimento do usuario |
| Controle usuarios/senhas | `ControleUsuarios=0` no nascimento | Brana ainda usa default mais fechado no contrato atual de seguranca | Nas novas contas, nascer desativado ou separado do setup | Alta | Manter contrato separado de setup |
| Auditoria | `Auditoria=0` no nascimento | Brana ainda nasce com default diferente no contrato atual | Manter pendente ou desativado ate contrato proprio | Media | Decisao futura isolada |
| Setup para usuario novo | Nao apareceu como setup genérico para todo novo usuario; o que existe e primeiro acesso do usuario inicial | Hoje o gate de setup ainda pode atingir usuarios posteriores | Setup so para ADM inicial da nova conta | Alta | Impedir abertura do setup para novos usuarios |
| Opcoes do Sistema > Seguranca | Interfere no comportamento do sistema e na liberacao de senha interna | A area existe e ja foi auditada no Brana | Nao mexer ainda; tratar em contrato posterior | Media | Frente futura separada |

## 8. Contrato revisado para Brana

- O usuario ADM deve nascer como `Dentista (CD)`.
- O usuario ADM deve vincular ao prestador ADM/Mestre funcional.
- O usuario ADM deve vincular a unidade `Principal / 0001`.
- O setup deve aparecer apenas para o ADM inicial da nova conta.
- O setup deve ser bloqueado para usuarios criados posteriormente.
- O login SaaS continua obrigatorio.
- O setup continua sendo etapa da conta/ADM inicial, nao de todo usuario novo.
- O contrato nao altera contas existentes.

## 9. Impacto nas proximas subetapas

- A leitura direta nao contradisse o contrato fechado na 8T; ela o reforcou.
- A implementacao pode seguir para a 8U, desde que respeite o contrato revisado do usuario ADM.
- A 8V deve continuar depois da 8U, para isolar o comportamento do setup para usuarios posteriores.
- Se uma nova consulta viva ao EasyDental vier a ser exigida mais tarde, ela deve ser usada apenas como confirmacao adicional, nao como desculpa para misturar escopo com implementacao.

## 10. Fora de escopo

- Implementacao.
- Alterar setup agora.
- Alterar Opcoes do Sistema agora.
- Alterar senha interna agora.
- Alterar tabelas/procedimentos.
- Alterar unidade.
- Alterar frontend.
- Alterar backend.
- Alterar contas existentes.
- Alterar EasyDental.
- Corrigir texto da tela de setup.

## 11. Plano de verificacao

- Somente este documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- Backend nao foi alterado.
- Banco/schema/migrations/seeds/endpoints nao foram alterados.
- EasyDental nao foi alterado.
- Nenhuma conta foi criada ou excluida.
- O setup nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
