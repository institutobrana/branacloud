# Auditoria EasyDental virgem — Subetapa 3 — permissões, perfis, módulos e funções

## 1. Contexto

- Referencia as Subetapas 0, 1 e 2 da frente documental `Auditoria comparativa EasyDental virgem x Brana Cloud — usuários, prestadores, permissões e seeds iniciais`.
- A base analisada é tratada aqui como referencia da forma virgem do sistema, conforme definido pelo usuário.
- Mesmo com muitas tabelas populadas e muitos registros, isso pode representar seeds estruturais do proprio EasyDental.
- A divergencia documental entre o DSN externo `SONYVAIO\EDS70` e a leitura local em `INSPIRON-15\SQLEXPRESS` ja foi registrada na Subetapa 2.
- Esta etapa e somente leitura.

## 2. Segurança e limites

- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nao houve alteracao no EasyDental.
- Nao houve alteracao no Brana Cloud.
- Nenhum dado sensivel foi exposto indevidamente.
- A blindagem textual/mojibake foi respeitada.
- Amostras foram limitadas a campos estruturais e a identificadores tecnicos.

## 3. Tabelas analisadas

- `SIS_FUNCAO`
- `SIS_MODULO`
- `SIS_PERFIL`
- `USUARIO_FUNCAO`
- `USUARIO_MODULO`
- `USUARIO_PERFIL`
- `USUARIO`
- `_TIPO_USUARIO`
- `PRESTADOR`
- `UNIDADE`

## 4. Contagens

| tabela | quantidade de registros | status | observação preliminar |
| --- | ---: | --- | --- |
| `SIS_FUNCAO` | 127 | populada | funcoes operacionais ligadas a modulos |
| `SIS_MODULO` | 52 | populada | modulos funcionais do sistema |
| `SIS_PERFIL` | 10 | populada | perfis de acesso por area funcional |
| `USUARIO_FUNCAO` | 740 | populada | matriz de funcoes por usuario |
| `USUARIO_MODULO` | 312 | populada | matriz de modulos por usuario |
| `USUARIO_PERFIL` | 184 | populada | matriz de perfis por usuario e prestador |
| `USUARIO` | 7 | populada | usuarios estruturais e operacionais |
| `_TIPO_USUARIO` | 10 | populada | classificacao auxiliar de tipo de usuario |
| `PRESTADOR` | 5 | populada | prestadores/profissionais estruturais |
| `UNIDADE` | 1 | populada | unidade estrutural do sistema |

## 5. Estrutura de `SIS_PERFIL`

- Colunas principais: `ID_PERFIL int` e `NOME_PERFIL varchar(100)`.
- Chave primaria: `PK_SIS_PERFIL` em `ID_PERFIL`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Amostra controlada: perfis estruturais identificados com nomes funcionais como `Pacientes`, `Intervenções`, `Agenda de horários`, `Créditos na conta corrente`, `Débitos na conta corrente`, `Controle de estoque`, `Controle de protético`, `Controle de recibos`, `Relatórios estatísticos` e `Relatórios financeiros`.
- Perfil administrador: nao ha perfil nomeado explicitamente como administrador.
- Interpretacao cautelosa: os perfis parecem ser seeds de dominio/area funcional, nao perfis livres de cadastro do usuario final.

## 6. Estrutura de `SIS_MODULO`

- Colunas principais: `ID_MODULO int`, `NOME_MODULO varchar(100)` e `PERMITE_SENHA int`.
- Chave primaria: `PK_SIS_MODULO` em `ID_MODULO`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Módulos identificados na amostra: `Odontograma`, `Cadastro - Medicamentos`, `Cadastro - Controle de estoque`, `Cadastro - Controle de protéticos`, `Cadastro - Ficha de anamnese`, `Cadastro - Ficha de histórico`, `Cadastro - Dados pessoais`, `Cadastro - Dados complementares`, `Cadastro - Anotações do paciente`, `Tratamento`, `Agenda - Agenda de horários`, `Agenda - Agenda de contatos`, `Relatório - Pesquisa pacientes`, `Relatório - Pesquisa contatos`, `Relatório - Tratamentos`, `Relatório - Financeiros`, `Relatório - Estatísticos`, `Relatório - Agendas`, `Relatório - Estoques`, `Relatório - Protéticos`.
- O campo `PERMITE_SENHA` aparece com valor 1 na maior parte dos modulos consultados; `Odontograma` aparece com 0.
- Interpretacao cautelosa: o modulo e uma unidade funcional de alto nivel e parece ser seed estrutural do sistema.

## 7. Estrutura de `SIS_FUNCAO`

- Colunas principais: `ID_FUNCAO int`, `ID_MODULO int`, `NOME_FUNCAO varchar(255)` e `PERMITE_SENHA int`.
- Chave primaria: `PK_SIS_FUNCAO` em `ID_FUNCAO`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign key formal: `ID_MODULO -> SIS_MODULO.ID_MODULO`.
- Funcoes/permissoes identificadas na amostra: `Inserir intervenções`, `Alterar intervenções`, `Eliminar intervenções`, `Inserir medicamento`, `Alterar medicamento`, `Eliminar medicamento`, `Inserir item`, `Alterar item`, `Eliminar item`, `Inserir movimentação`, `Alterar movimentação`, `Eliminar movimentação`, `Inserir serviço`, `Alterar serviço`, `Eliminar serviço`, `Alterar resposta`, `Alterar linha`, `Inserir paciente`, `Alterar paciente`, `Eliminar paciente / dados do paciente`.
- O campo `PERMITE_SENHA` tambem aparece aqui e reforça que determinadas operacoes exigem senha adicional.
- Interpretacao cautelosa: `SIS_FUNCAO` parece a camada de permissao fina ligada a cada modulo.

## 8. Estrutura de `USUARIO_PERFIL`

- Colunas principais: `ID_USUARIO int`, `ID_PRESTADOR int` e `ID_PERFIL int`.
- Chave primaria: composta por `ID_USUARIO`, `ID_PRESTADOR` e `ID_PERFIL` (`PK_USUARIO_PERFIL`).
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign keys formais:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
  - `ID_PERFIL -> SIS_PERFIL.ID_PERFIL`
- Quantidade de vínculos: 184.
- Amostra controlada: o usuario `1` aparece associado a varios perfis em mais de um prestador, incluindo os perfis 1 a 10; outros usuarios tambem aparecem com combinacoes de prestador e perfil.
- Interpretacao cautelosa: o perfil nao parece ser apenas global; ele pode variar por prestador, o que e importante para o futuro nascimento de novas contas/clinicas.

## 9. Estrutura de `USUARIO_MODULO`

- Colunas principais: `ID_USUARIO int`, `ID_MODULO int` e `NIVEL int`.
- Chave primaria: composta por `ID_USUARIO` e `ID_MODULO` (`PK_USUARIO_MODULO`).
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign keys formais:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_MODULO -> SIS_MODULO.ID_MODULO`
- Quantidade de vínculos: 312.
- Amostra controlada: seis usuarios aparecem com cobertura muito ampla de modulos; o usuario `1` recebe todos os 52 modulos, e outros usuarios tambem recebem a matriz completa ou quase completa.
- O campo `NIVEL` varia entre 1 e 3 na amostra, sugerindo profundidade ou sensibilidade da autorizacao, mas isso ainda e interpretacao cautelosa.
- Interpretacao cautelosa: a tabela funciona como ponte direta entre usuario e modulo.

## 10. Estrutura de `USUARIO_FUNCAO`

- Colunas principais: `ID_USUARIO int`, `ID_FUNCAO int` e `NIVEL int`.
- Chave primaria: composta por `ID_USUARIO` e `ID_FUNCAO` (`PK_USUARIO_FUNCAO`).
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign keys formais:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_FUNCAO -> SIS_FUNCAO.ID_FUNCAO`
- Quantidade de vínculos: 740.
- Amostra controlada: o usuario `1` aparece com as 127 funcoes; outros usuarios aparecem com cobertura completa ou quase completa, enquanto um usuario apresenta cobertura menor.
- Interpretacao cautelosa: a tabela e a ponte fina de permissao entre usuario e funcao, e por consequencia entre usuario e modulo via `SIS_FUNCAO.ID_MODULO`.

## 11. Relação com `USUARIO`, `_TIPO_USUARIO`, `PRESTADOR` e `UNIDADE`

- `USUARIO` e a tabela central de identidade de acesso.
- `USUARIO.TIPO` referencia `_TIPO_USUARIO`, o que sugere uma classificacao padrao de tipo/funcao de usuario.
- `USUARIO.ID_PRESTADOR` referencia `PRESTADOR`, mostrando que a permissao pode ser amarrada a um prestador.
- `USUARIO.ID_UNIDADE` referencia `UNIDADE`, mostrando dependencia de unidade para o cadastro do usuario.
- `USUARIO.PERMISSOES` e um campo textual adicional que pode carregar configuracoes auxiliares ou overrides, mas nao foi interpretado de forma definitiva.
- `PRESTADOR` e `UNIDADE` aparecem como dimensoes estruturais do sistema, nao apenas como tabelas de apoio.
- O usuario `1` aparece com cobertura muito ampla em modulos, funcoes e perfis; isso sugere um usuario inicial/admin de fato comportamental.
- Nao existe, nas tabelas analisadas, um perfil `Administrador` nomeado de forma explicita.

## 12. Relacionamentos formais encontrados

- `SIS_FUNCAO.ID_MODULO -> SIS_MODULO.ID_MODULO`
- `USUARIO_PERFIL.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_PERFIL.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO_PERFIL.ID_PERFIL -> SIS_PERFIL.ID_PERFIL`
- `USUARIO_MODULO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_MODULO.ID_MODULO -> SIS_MODULO.ID_MODULO`
- `USUARIO_FUNCAO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_FUNCAO.ID_FUNCAO -> SIS_FUNCAO.ID_FUNCAO`
- `USUARIO.TIPO -> _TIPO_USUARIO.REGISTRO`
- `USUARIO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO.ID_UNIDADE -> UNIDADE.ID_UNIDADE`

## 13. Relacionamentos inferidos

- `SIS_FUNCAO` e `SIS_MODULO` formam uma hierarquia funcional: modulo acima, funcao abaixo.
- `USUARIO_FUNCAO` e `USUARIO_MODULO` parecem implementar niveis distintos da matriz de acesso.
- `USUARIO_PERFIL` parece combinar usuario, prestador e perfil para configurar visao/permissão por contexto.
- O campo `NIVEL` em `USUARIO_FUNCAO` e `USUARIO_MODULO` sugere graduacao de acesso, mas o significado exato nao foi comprovado.
- A cobertura ampla do usuario `1` sugere um seed administrativo ou usuario inicial com acesso total, mas isso ainda e hipotese comportamental.

## 14. Achados importantes

- `SIS_PERFIL` nasce com 10 perfis funcionais, sem perfil administrativo explicito.
- `SIS_MODULO` nasce com 52 modulos funcionais.
- `SIS_FUNCAO` nasce com 127 funcoes, ligadas a modulos, em grande parte com `PERMITE_SENHA = 1`.
- `USUARIO_PERFIL`, `USUARIO_MODULO` e `USUARIO_FUNCAO` nascem populadas e implementam a matriz de acesso.
- O usuario `1` e o principal candidato a usuario inicial/admin por comportamento de permissao.
- Nao foi identificado um perfil administrador nomeado, mas o comportamento do usuario `1` sugere permissao ampla equivalente.
- As permissões parecem estar separadas em nivel de perfil, modulo e funcao.
- Existem registros estruturais que provavelmente nao devem ser excluidos, especialmente seeds de `SIS_*`, `USUARIO` com permissao ampla e os vinculos `USUARIO_*`.
- A tabela `USUARIO_PERFIL` mostra que o contexto do prestador faz parte da autorizacao.

## 15. Impacto futuro provavel no Brana Cloud

- Novas contas no Brana Cloud provavelmente precisam nascer com perfis padrao e a matriz de modulo/funcao ja prevista.
- Um usuario admin inicial deve existir com cobertura ampla, ou o sistema pode nascer bloqueado.
- Perfis, modulos e funcoes parecem ser seeds de sistema e nao simples configuracoes opcionais.
- O Brana Cloud provavelmente precisara separar com cuidado o que e estrutural do que e configuravel pelo usuario.
- Se esses seeds nao nascerem corretamente, ha risco de acesso incompleto, menus vazios, bloqueio de cadastro inicial e inconsistencias de permissao.

## 16. Limitacoes

- A identidade fisica da base ainda nao foi comprovada de forma plena como a pasta externa original.
- Algumas relacoes sao formais e outras apenas inferidas por nomenclatura ou comportamento.
- Dados pessoais e campos livres com conteudo sensivel foram mascarados ou omitidos.
- A conclusao definitiva sobre nascimento de conta/clínica no Brana Cloud ainda depende de comparacao posterior com a propria estrutura do Brana.

## 17. Conclusao cautelosa

- O que ja pode ser afirmado:
  - `SIS_PERFIL`, `SIS_MODULO` e `SIS_FUNCAO` sao seeds estruturais de acesso.
  - `USUARIO_PERFIL`, `USUARIO_MODULO` e `USUARIO_FUNCAO` formam a matriz de permissao.
  - `USUARIO` e a porta de entrada da identidade de acesso.
  - O usuario `1` funciona como forte candidato a usuario inicial/admin.

- O que ainda precisa ser investigado:
  - como esses seeds se comportam na criacao de uma nova conta/clínica;
  - se ha regras adicionais em `PERMISSOES` dentro de `USUARIO`;
  - quais registros sao indispensaveis e quais sao apenas complementares.

- Como esta subetapa ajuda o Brana Cloud:
  - fornece um mapa preliminar do que provavelmente deve nascer junto com a conta/clínica;
  - separa perfis, modulos e funcoes como camadas distintas de permissao;
  - indica que o admin inicial precisa de acesso amplo e previsivel.

## 18. Próxima subetapa recomendada

- `EasyDental virgem — Subetapa 4 — análise somente leitura de clínica, unidade, configuração inicial e registros próprios do sistema`

## 19. Plano de testes e verificacao

- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nenhum dado sensivel foi exposto indevidamente.
- A blindagem textual/mojibake foi respeitada.
