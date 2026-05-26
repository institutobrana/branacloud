# Auditoria EasyDental virgem - Subetapa 8D - contrato tecnico da unidade inicial e matriz de perfis/permissoes para novas contas

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8C da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - contrato tecnico de unidade inicial e matriz de perfis/permissoes para novas contas".
- A trilha documental ja foi corrigida nas Subetapas 8B e 8C.
- Esta etapa e somente documental e nao implementa nada.
- O objetivo e fechar o contrato tecnico das duas lacunas estruturais mais importantes do baseline da conta 16: unidade inicial formal e matriz formal de perfis/permissoes.

## 2. Segurança e limites
- Nenhum código foi alterado.
- Nenhum seed ou migration foi alterado.
- Nenhum banco foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## 3. Premissas finais do contrato
- Novas contas Brana devem nascer prontas e abertas.
- O setup nao deve ser responsavel por criar a estrutura minima.
- Contas existentes preservam legado.
- PARTICULAR permanece em contas existentes.
- Brana e a tabela privada padrao para novas contas.
- O Brana nao deve duplicar o que ja existe.
- EasyDental e referencia forte de estrutura, mas nao copia cega.
- Registros estruturais devem ser protegidos.
- Assinatura digital e recursos proprios do Brana devem ser preservados.
- A unidade inicial e a matriz formal de perfis/permissoes sao as duas lacunas estruturais mais importantes remanescentes no baseline da conta 16.

## 4. Unidade inicial: decisao tecnica

### 4.1 Decisao documental
- A nova conta Brana deve nascer com unidade inicial formal.
- O nome de referencia contratual deve ser `Principal`.
- O codigo de referencia contratual deve ser `0001`.
- Essa unidade inicial deve existir sem depender da tela de setup.

### 4.2 Relacao com o EasyDental
- No EasyDental virgem, a unidade de atendimento exibida ao usuario chama-se `Principal` e possui codigo `0001`.
- Isso funciona como referencia estrutural forte para o contrato Brana.
- A equivalencia nao exige copia literal de todos os campos internos do EasyDental, mas exige o mesmo papel estrutural de unidade base da conta.

### 4.3 Relacao com a conta e com os papeis estruturais
- A unidade inicial deve vincular a clinica/tenant.
- O admin inicial deve ficar associado a essa unidade por padrao, ou por equivalencia estrutural aceitavel.
- O usuario estrutural/system e o prestador sistemico/reservado devem poder ser associados a essa unidade.
- A unidade inicial funciona como ponto de partida para menus, agenda, cadastro e contexto operativo da nova conta.

### 4.4 Protecao e edicao
- Se a unidade for a unica da conta, ela deve ser protegida contra exclusao.
- Alteracoes de nome, codigo ou metadados devem ser restritas e reguladas por contrato tecnico.
- A exclusao ou substituicao da unidade unica nao deve ocorrer sem regra explicita.
- O contrato tecnico futuro pode permitir edicao parcial, mas nao a perda da estrutura minima.

### 4.5 Pendencias
- Confirmar se a unidade inicial sera obrigatoria em todos os cenarios SaaS.
- Confirmar quais campos serao editaveis pela UI.
- Confirmar se o nome `Principal` sera padrao fixo ou referencia parametrizavel.
- Confirmar se o codigo `0001` sera fixo ou apenas referencia de compatibilidade.

## 5. Matriz formal de perfis/permissoes: decisao tecnica

### 5.1 Problema observado
- O Brana atual usa `permissoes_json` como estrutura de acesso operacional.
- No baseline 16, nao apareceu `usuario_perfil_acesso` formal.
- O EasyDental, por outro lado, apresenta `USUARIO_PERFIL`, `USUARIO_MODULO` e `USUARIO_FUNCAO` como matriz formal de acesso.
- A divergencia entre JSON operacional e matriz formal precisa ser tratada como contrato tecnico.

### 5.2 Decisao documental
- O modelo atual de `permissoes_json` nao e considerado suficiente sozinho para o contrato de novas contas.
- Deve existir uma matriz formal equivalente a `usuario_perfil_acesso` ou uma estrutura Brana equivalente que expresse perfil, usuario e vinculos formais.
- O contrato tecnico deve evitar divergencia entre:
  - `permissoes_json`;
  - perfis reservados;
  - vinculos formais de acesso;
  - permissao efetiva do usuario admin inicial.
- A nova conta nao deve nascer bloqueada nem depender de setup para ganhar acesso basico.

### 5.3 Papel do admin inicial
- O admin inicial deve nascer com cobertura ampla.
- O admin inicial deve estar vinculado a uma matriz formal de acesso ou equivalente confiavel.
- O admin inicial nao pode depender apenas de JSON ad hoc para garantir acesso.
- O admin inicial nao deve perder acesso total por falha de seed ou ausencia de vinculo formal.

### 5.4 Relacao com o EasyDental
- No EasyDental virgem, `SIS_PERFIL`, `SIS_MODULO`, `SIS_FUNCAO` e `USUARIO_*` formam a estrutura formal de acesso.
- O usuario `1` aparece com cobertura ampla e comportamento admin-like.
- O contrato Brana deve preservar a ideia de base formal protegida, ainda que com modelo proprio.

### 5.5 Protecao e edicao
- Perfis base devem ser protegidos contra exclusao indevida.
- Vinculos formais de acesso do admin inicial devem ser protegidos.
- O usuario comum pode ter perfis ajustaveis, mas o baseline de nascimento deve permanecer seguro.
- A matriz formal deve evitar inconsistencias entre UI e backoffice.

### 5.6 Pendencias
- Definir se a matriz formal sera `usuario_perfil_acesso` ou modelo equivalente proprio.
- Definir se a matriz formal convivera com `permissoes_json` ou se um dos dois sera apenas derivado.
- Definir se a UI de administracao mostrara perfis e vinculos como entidade separada.
- Definir como garantir consistencia entre seed inicial e edicoes futuras.

## 6. Baseline da conta 16: implicacao para o contrato
- O baseline da conta 16 mostrou ausencia de unidade formal.
- O baseline da conta 16 mostrou ausencia de `usuario_perfil_acesso` formal.
- O baseline da conta 16 mostrou usuario estrutural/system, admin inicial, prestador sistemico e tabela Brana funcionando mesmo assim.
- Portanto, a conta 16 confirma que o sistema atual nasce quase pronto, mas ainda com lacunas formais de unidade e matriz de acesso.
- A leitura documental reforca que essas duas lacunas devem ser tratadas por contrato tecnico, nao por setup.

## 7. O que deve nascer
- Unidade inicial formal `Principal` / `0001`, ou equivalente tecnicamente justificado.
- Admin inicial com acesso amplo.
- Usuario estrutural/system protegido.
- Prestador sistemico/reservado protegido.
- Perfis base reservados.
- Matriz formal de permissao equivalente a `usuario_perfil_acesso` ou modelo confiavel equivalente.

## 8. O que pode ser configuravel
- Nome de exibicao de alguns metadados, se o contrato permitir.
- Permissoes finas de usuarios comuns.
- Vinculos adicionais por perfil, modulo ou usuario, desde que nao quebrem a base estrutural.
- Rotulo de interface da unidade, se nao violar o contrato de `Principal`.

## 9. O que fica protegido
- Unidade inicial unica.
- Admin inicial.
- Usuario estrutural/system.
- Prestador sistemico/reservado.
- Perfis base reservados.
- Matriz formal de acesso do nascimento.
- Tabela Brana.
- Seeds odontologicos estruturais.

## 10. O que fica pendente
- Definir se a matriz formal sera exatamente `usuario_perfil_acesso` ou equivalente.
- Definir se a unidade inicial tera exclusao proibida absoluta ou apenas restrita.
- Definir se `Principal` e `0001` sao fixos ou apenas referencia padrao.
- Definir quais campos da unidade sao editaveis.
- Definir como sincronizar `permissoes_json` com a matriz formal.

## 11. Fluxo tecnico esperado

| Ordem | Entidade/regra | Nome esperado | Referencia EasyDental | Contrato Brana | Protegido? | Depende de setup? | Observação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Unidade inicial | `Principal` / `0001` | `UNIDADE` / `Principal 0001` | unidade formal da nova conta | sim | nao | ponto de partida da conta |
| 2 | Usuario admin inicial | codigo `1` | `USUARIO 1` / Mestre inferido | admin inicial com acesso amplo | sim | nao | nao pode perder acesso total |
| 3 | Usuario estrutural/system | codigo `255` | `USUARIO 255` / Clínica | papel estrutural base | sim | nao | vinculo com prestador e unidade |
| 4 | Prestador sistemico/reservado | `ID 255` | `PRESTADOR 255` / Clínica | prestador estrutural | sim | nao | nao excluir por usuario comum |
| 5 | Perfis reservados | baseline inicial | `SIS_PERFIL` | perfis base do Brana | sim | nao | evitar menu vazio |
| 6 | Matriz formal de acesso | `usuario_perfil_acesso` ou equivalente | `USUARIO_PERFIL` / `USUARIO_MODULO` / `USUARIO_FUNCAO` | matriz formal da nova conta | sim | nao | nao depender de JSON sozinho |
| 7 | Permissoes operacionais | `permissoes_json` | referencia parcial | suporte operacional | parcial | nao | nao e suficiente sozinho |

## 12. Critérios de pronto para baseline/teste
- Unidade inicial formal decidida.
- Nome/codigo da unidade definidos.
- Matriz formal de acesso definida.
- Relação entre `permissoes_json` e matriz formal definida.
- Admin inicial protegido.
- Prestador sistemico protegido.
- Contrato da unidade sem dependência de setup.
- Contrato de perfis sem divergencia estrutural.

## 13. Próxima subetapa recomendada
`EasyDental virgem - Subetapa 8E - baseline documental e teste manual da unidade inicial e matriz formal de perfis/permissoes na conta atual, sem alteracao de codigo`

### Justificativa
- A unidade inicial e a matriz formal de acesso sao as lacunas mais objetivas e diretamente observaveis no baseline da conta 16.
- O contrato ja recebeu a referencia `Principal 0001`, `Mestre 1` e `Clínica 255`, entao a proxima etapa natural e validar o que o Brana atual faz com isso na pratica.
- Essa sequencia reduz o risco de mexer em seeds, setup ou estrutura estrutural sem baseline adicional.

## 14. Plano de verificacao
- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- Dados sensiveis nao foram expostos.
- A blindagem textual/mojibake foi respeitada.
