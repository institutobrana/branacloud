# Síntese documental da primeira separação real de usuários/admin

## Resumo executivo
A auditoria fina do domínio de usuários/admin fechou o suficiente para definir a primeira separação real com segurança. O recorte mais conservador e mais seguro é o núcleo visual do modal de usuários, centrado em `usersOptions()`, `usersPopularModalCombos()` e apenas nas partes estritamente visuais de `usersPreencherModal()`, incluindo a composição de `option`, `placeholder`, `default` e a leitura dos caches de combo.

Esse recorte não toca persistência, backend, auth, permissões, senha, exclusão, cadastro, edição estrutural ou qualquer contrato de rede. Ele separa somente a montagem visual dos selects e o preenchimento visual do modal, que é a menor fronteira estável já identificada.

Conclusão objetiva: a próxima etapa já pode ser a execução funcional da primeira separação real, desde que o escopo fique congelado nesse recorte visual estreito e nada seja ampliado para persistência ou backend.

## Escopo e Branch
- Branch: `modularizacao-segura-fase-1`
- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Natureza da etapa: documental, sem alteração de código.

## Base documental utilizada
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_contratos_auth_requestjson_me_security.md`
- `docs/auditoria_matriz_endpoints_autenticados_dependencias_seguranca.md`
- `docs/auditoria_requestjson_categorias_uso.md`
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`
- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/auditoria_fina_requestjson.md`
- `docs/auditoria_fina_requestjson_tipos_transporte.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_fina_user_admin_permissoes.md`
- `docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `docs/auditoria_fina_frontend_admin_usuarios.md`
- `docs/auditoria_fina_users_combos_vinculos.md`
- `docs/auditoria_fina_users_preenchimento_modal.md`
- `docs/auditoria_fina_users_options_placeholders.md`

## Primeiro recorte real proposto
O primeiro recorte real do domínio de usuários/admin deve ser um corte de apresentação de modal, não um corte de fluxo de negócio.

### Entra no 1º recorte
| Item | Entra no 1º recorte? | Motivo | Risco | Observação |
|---|---|---|---|---|
| `usersOptions()` | Sim | É o helper mais puro e isolável; só monta `<option>` e placeholder | Baixo | Menor ponto de extração |
| `usersPopularModalCombos()` | Sim | Só popula selects com caches já prontos | Baixo/médio | Mantém a fronteira visual do modal |
| Partes estritamente visuais de `usersPreencherModal()` | Sim | Limpa e reidrata campos do modal sem persistir nada | Médio | Apenas reset/preenchimento visual |
| Composição de `placeholder` / `default` | Sim | Faz parte do contrato visual dos selects | Baixo | Deve permanecer junto do render do modal |
| Leitura dos caches de combo | Sim | Já é dependência imediata do preenchimento visual | Médio | Não envolve backend novo |

### Fica fora do 1º recorte
| Item | Entra no 1º recorte? | Motivo | Risco | Observação |
|---|---|---|---|---|
| `usersSalvarEstrutural()` | Não | Mistura criação/edição/persistência | Alto | Não deve entrar ainda |
| `usersSalvarNovo()` | Não | Fluxo de gravação | Alto | Persistência fora do primeiro corte |
| `usersSalvarSenha()` | Não | Contrato sensível de senha | Crítico | Deve permanecer congelado |
| `usersSalvarPermissoes()` | Não | Contrato de permissões já auditado separadamente | Alto | Fora do recorte visual |
| `usersExcluirSelecionado()` | Não | Ação destrutiva | Crítico | Fora da primeira separação |
| `requestJson()` | Não | Contrato transversal crítico | Crítico | Congelado |
| Auth / grant / sessão | Não | Núcleo transversal | Crítico | Congelado |
| Backend | Não | Não faz parte do primeiro corte funcional | Crítico | Congelado |
| Persistência de usuário | Não | Excede o contrato visual | Alto | Fica para etapa posterior |

## Justificativa técnica da escolha
1. `usersOptions()` já é o menor helper com responsabilidade bem delimitada.
2. `usersPopularModalCombos()` não decide negócio; apenas materializa os combos no modal.
3. `usersPreencherModal()` ainda mistura estado visual com alguma lógica de modal, mas a parte estritamente visual já é segura para um primeiro isolamento futuro.
4. O risco de regressão nesse recorte é baixo porque não toca rotas, payloads, auth, grant, permissões ou gravação.
5. O benefício é alto porque esse núcleo é reutilizado em novo e edição e concentra a maior parte da montagem visual dos selects.

## Dependências provisórias ainda mantidas
- `usersTypesCache`
- `usersPrestadoresLookup`
- `usersUnidadesLookup`
- `usersModalTipo`
- `usersModalPrestador`
- `usersModalUnidade`
- `usersPreencherModal()`
- `usersPopularModalCombos()`

Essas dependências devem permanecer na mesma fronteira durante a primeira separação real para evitar quebra de seleção, placeholder e reidratação do modal.

## Funções/blocos que entram
- `usersOptions()`
- `usersPopularModalCombos()`
- Partes estritamente visuais de `usersPreencherModal()`

## Funções/blocos que ficam explicitamente fora
- `usersSalvarEstrutural()`
- `usersSalvarNovo()`
- `usersSalvarSenha()`
- `usersSalvarPermissoes()`
- `usersExcluirSelecionado()`
- `usersAbrirPermissoes()`
- `usersAbrirSenhaSessaoAtual()`
- `usersCarregarCombos()` como fluxo próprio
- `requestJson()`
- `carregamento de usuários`
- `cadastro/edição`
- `auth/sessão`
- `permissions`
- `backend`
- `senha`
- `exclusão`

## Riscos críticos
- Expandir o primeiro recorte para persistência sem necessidade.
- Misturar renderização visual com gravação de dados.
- Quebrar o comportamento de placeholder quando o dataset vem vazio.
- Perder a seleção visual quando o valor salvo não existir mais no combo.
- Encostar em auth, grant ou permissões antes da hora.

## Pré-condições já satisfeitas
- O domínio de usuários/admin já foi auditado em profundidade.
- A fronteira entre cadastro, vínculo, senha e permissões já foi delimitada.
- O contrato visual do modal já foi documentado.
- `usersOptions()` já foi entendido como helper puro e isolável.
- O nível de risco da parte visual está suficientemente conhecido para um primeiro corte funcional conservador.

## Lacunas residuais toleráveis
- Auditoria visual complementar de estados vazios do modal.
- Verificação final de placeholders em cenários raros de dataset ausente.
- Observação de regressão visual após a primeira extração funcional.

Essas lacunas não impedem o início da separação real, desde que o corte permaneça estreito.

## Testes manuais obrigatórios para a etapa funcional seguinte
1. Abrir modal de novo usuário.
2. Abrir modal de edição de usuário.
3. Verificar `tipo`, `prestador` e `unidade` com dataset preenchido.
4. Verificar os mesmos selects com dataset vazio.
5. Verificar comportamento quando o valor persistido não existe mais no combo.
6. Verificar placeholder e `default` em novo e edição.
7. Verificar que nenhum fluxo de persistência foi afetado.
8. Verificar que senha, permissões e exclusão continuam inalterados.

## Sequência proposta da execução funcional futura
1. Extrair o contrato de geração de `<option>` do helper visual.
2. Isolar a população dos selects do modal.
3. Separar a reidratação visual do modal da lógica de negócio.
4. Rodar os testes manuais do modal novo/edição.
5. Só depois avaliar se o restante do admin de usuários pode ser fatiado em seguida.

## Lista clara do que deve permanecer congelado
- `requestJson()`
- auth / sessão / grant protegido
- permissões
- senha
- exclusão
- persistência de usuário
- backend
- cadastro e edição estrutural
- vínculo cadastral
- qualquer contrato de rede

## Conclusão explícita
A próxima etapa já pode ser a execução funcional da primeira separação real, mas somente no recorte visual mais estreito descrito acima: `usersOptions()`, `usersPopularModalCombos()` e as partes estritamente visuais de `usersPreencherModal()`.

Não há necessidade de mais uma microetapa documental antes desse primeiro corte, desde que a implementação futura não ultrapasse esse limite.
