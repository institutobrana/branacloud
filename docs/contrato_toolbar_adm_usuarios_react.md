# Contrato - Toolbar ADM Usuarios React

Data: 2026-07-21

## 1. Objetivo

Definir a toolbar futura de `ADM -> Usuarios` no frontend React, a partir da auditoria historica do legado local/global e dos endpoints atuais.

Este contrato nao implementa botoes. Ele define a ordem segura para fases futuras.

## 2. Superficie visual obrigatoria

A tela deve preservar:

- shell global ADM em L;
- barra horizontal unica montada em `App.jsx`;
- nenhuma faixa local duplicada;
- tabela compacta imediatamente abaixo;
- selecao unica;
- filtros por coluna;
- rodape integrado;
- tema claro/escuro.

Acoes devem ficar preferencialmente na barra horizontal global, condicionadas a selecao quando necessario.

## 3. Toolbar atual da Fase 1

Ja implementado:

- `Atualizar`
- `Buscar usuario`

Sem acoes mutaveis.

## 4. Toolbar alvo recomendada

Ordem:

1. `Atualizar`
2. `Exportar CSV`
3. `Novo usuario`
4. `Ativar` / `Inativar`
5. `Tornar administrador` / `Remover administrador`
6. `Redefinir senha de login`
7. `Buscar usuario` no grupo direito

## 5. Classificacao dos botoes

| Botao | Classificacao | Rotulo final | Fase | Condicao |
|---|---|---|---|---|
| Atualizar | A | Atualizar | Atual | Sempre habilitado |
| Exportar CSV | A | Exportar CSV | Proxima read-only | Sempre habilitado, com confirmacao por PII |
| Novo usuario | B | Novo usuario | Mutavel 1 | Exige conta ativa alvo explicita |
| Alterar | C | - | Fora | Nao ha endpoint global amplo |
| Ativar/Inativar | B | Ativar/Inativar | Mutavel 2 | Exige selecao e protecoes adicionais |
| Tornar/Remover administrador | B | Tornar administrador/Remover administrador | Mutavel 3 | Exige selecao e protecao de ultimo admin |
| Redefinir senha | B | Redefinir senha de login | Mutavel 4 | Exige selecao, modal e contrato de sessao |
| Perfis | B | Perfis | Fase futura | Depende de contrato global por tenant |
| Excluir | C | - | Fora | Nao existe delete global |
| Fechar | C | - | Fora | Shell React substitui painel flutuante |
| Filtrar | C | - | Fora | Busca/filtros por coluna substituem botao legado |

## 6. Regras de rotulo

- Usar `Novo usuario` conforme `docs/contrato_novo_usuario_adm_react.md`; o backend deve derivar `is_admin` pelo tipo oficial e nao aceitar `is_admin` arbitrario do frontend.
- Usar `Redefinir senha de login`, nao apenas `Reset senha`, para nao confundir com senha interna/protegida.
- Usar botao contextual unico para admin:
  - selecionado comum: `Tornar administrador`;
  - selecionado admin: `Remover administrador`.
- Usar botao contextual unico para status:
  - selecionado ativo: `Inativar`;
  - selecionado inativo: `Ativar`.

## 7. Regras de habilitacao futura

| Estado da selecao | Atualizar | Exportar CSV | Novo usuario | Ativar/Inativar | Admin/Usuario | Senha login | Perfis | Excluir |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Sem selecao | Sim | Sim | Sim, com conta ativa alvo explicita | Nao | Nao | Nao | Nao | Nao |
| Usuario comum ativo | Sim | Sim | Sim | Inativar | Tornar administrador | Sim | Futuro | Nao |
| Usuario comum inativo | Sim | Sim | Sim | Ativar | Tornar administrador | Sim | Futuro | Nao |
| Administrador | Sim | Sim | Sim | Inativar se permitido | Remover administrador se permitido | Sim | Futuro | Nao |
| Usuario sistemico | Sim | Sim | Sim | Nao | Nao | Nao | Nao | Nao |
| Owner | Sim | Sim | Sim se operador autorizado | Nao | Nao | Nao | Nao | Nao |
| Operador atual | Sim | Sim | Sim | Nao | Nao ate contrato | Futuro controlado | Futuro | Nao |

## 8. Contratos antes de implementar mutacoes

Antes de `Novo usuario`:

- decidir se `ativar_clinica` sera permitido, proibido ou confirmado;
- decidir se o usuario deve nascer com `setup_completed=True` ou passar por primeiro acesso;
- decidir se Super Admin nao Owner pode criar admin em clinica MASTER/Owner;
- trocar prompts por modal controlado.

Antes de `Ativar/Inativar`:

- bloquear propria conta;
- bloquear Owner;
- bloquear usuario sistemico;
- proteger ultimo administrador da clinica;
- documentar efeito em sessoes/tokens.

Antes de `Tornar/Remover administrador`:

- bloquear Owner;
- bloquear usuario sistemico;
- proteger ultimo administrador;
- definir se Super Admin global pode rebaixar admin de qualquer tenant.

Antes de `Redefinir senha de login`:

- deixar explicito que altera `senha_hash`;
- nao alterar `senha_interna_hash`;
- decidir geracao automatica ou senha informada pelo operador;
- decidir invalidacao de sessoes;
- registrar auditoria.

Antes de `Perfis`:

- definir se ADM global pode gerenciar perfis por tenant;
- resolver clinica/prestador/perfil alvo;
- nao misturar com `is_admin`.

Antes de `Excluir`:

- criar contrato especifico;
- nao reutilizar `DELETE /admin/users/{id}` como global;
- avaliar hard delete, dependencias, auditoria e rollback.

## 9. Ordem de implementacao contratada

1. `Exportar CSV`.
2. `Novo usuario`.
3. `Ativar/Inativar`.
4. `Tornar administrador/Remover administrador`.
5. `Redefinir senha de login`.
6. `Alterar`, somente se surgir endpoint global.
7. `Perfis`, somente com contrato de tenant/perfil.
8. `Excluir`, somente com contrato adicional.

## 10. Fora do contrato atual

- `Alterar` amplo;
- `Excluir`;
- `Fechar`;
- `Filtrar` separado;
- `Perfis` na primeira leva;
- reset de senha interna;
- acoes por linha dentro da tabela React.

## 11. Validacao de nao implementacao

Este documento e contratual. A aplicacao React deve continuar com apenas:

- `Atualizar`;
- `Buscar usuario`;
- listagem real de leitura.

Qualquer botao adicional deve ser implementado em fase propria, com testes e validacao runtime autenticada.

## 12. Atualizacao - Exportar CSV implementado

Em 2026-07-21, `Exportar CSV` foi implementado como acao read-only na toolbar global de `ADM -> Usuarios`.

Toolbar React atual:

1. `Atualizar`
2. `Exportar CSV`
3. `Buscar usuario`

A acao usa `GET /superadmin/usuarios/export.csv` com token Bearer no header, download por blob, validacao de Content-Type CSV, rejeicao de arquivo vazio e nome de arquivo sanitizado. A busca server-side atual (`q`) e enviada ao endpoint; filtros locais por coluna, ordenacao e selecao permanecem preservados na tabela e nao sao convertidos em parametros nesta subetapa.

As demais acoes continuam fora do escopo desta implementacao: `Novo usuario`, `Alterar`, `Ativar/Inativar`, `Tornar/Remover administrador`, `Redefinir senha`, `Perfis` e `Excluir`.

## 13. Atualizacao - Novo usuario auditado

Em 2026-07-21, a proxima acao mutavel foi recontratada como `Novo usuario`.

Documentos especificos:

- `docs/auditoria_novo_usuario_adm_tipos_contas.md`
- `docs/contrato_novo_usuario_adm_react.md`

Estado: auditado e contratado, ainda nao implementado.

## 14. Atualizacao - Ver detalhes implementado

Em 2026-07-21, `Ver detalhes` foi implementado como acao read-only na toolbar global de `ADM -> Usuarios`.

Toolbar React atual:

1. `Atualizar`
2. `Exportar CSV`
3. `Ver detalhes`
4. `Buscar usuario`

O botao e contextual a linha selecionada, fica desabilitado sem selecao ou durante o carregamento inicial e abre somente o modal `Detalhes do usuario`. O modal reutiliza os dados normalizados da listagem, exibe campos ausentes como `Nao disponivel`, mostra badge `Protegido` quando `is_system_user` ou indicador proprietario confiavel estiver presente e possui apenas a acao `Fechar`.

Nao foi criado endpoint de detalhe, nao houve metodo mutavel e nao foram iniciados `Novo usuario`, `Ver conta`, `Excluir`, alteracao de perfil, ativacao/inativacao ou reset de senha.

## 15. Atualizacao - padrao visual da toolbar aplicado

Em 2026-07-22, a toolbar de `ADM -> Usuarios` foi corrigida para seguir o padrao visual Brana dos modulos de tabelas.

Contrato visual vigente:

- controles de acao usam `button type="button"` com `auxiliary-shell-button`;
- o grupo de acoes reutiliza `materiais-estoque-toolbar-actions`;
- nao usar `Button` do Ant Design nem icones nos botoes de acao desta toolbar;
- busca permanece no grupo direito;
- estados `disabled`, `aria-busy` e `focus-visible` devem permanecer acessiveis;
- `Ver detalhes` continua read-only, contextual a selecao e sem endpoint adicional.

Documento complementar: `docs/correcao_toolbar_adm_usuarios_padrao_visual.md`.

## 16. Atualizacao - Ver conta implementado

Em 2026-07-22, `Ver conta` foi implementado como acao read-only na toolbar global de `ADM -> Usuarios`.

Toolbar React atual:

1. `Atualizar`
2. `Exportar CSV`
3. `Ver detalhes`
4. `Ver conta`
5. `Buscar usuario`

O botao e contextual a selecao unica, fica desabilitado sem usuario selecionado, durante refresh ou quando o usuario selecionado nao possui `clinica_id` valido. A navegacao usa `clinica_id` via estado transitorio controlado por `App.jsx` para abrir `/app/adm/clinicas` e selecionar a conta vinculada por ID exato.

Nao foi criada acao mutavel, endpoint novo, modal de escrita, `POST`, `PUT`, `PATCH` ou `DELETE`.

Documento complementar: `docs/implementacao_adm_usuarios_ver_conta.md`.
