# Reversao seletiva da regressao do fluxo `Novo tratamento`

## 1. Objetivo da reversao

Retornar com seguranca ao estado funcional anterior ao commit regressivo `d895078`, revertendo apenas as mudancas introduzidas nessa etapa.

## 2. Commit regressivo afetado

- `d895078`
- Mensagem: `fix: corrige fluxo real de menu de pacientes para novo tratamento`

## 3. Sintoma reportado pelo usuario

- Apos a etapa regressiva, o login passou a falhar no ambiente real do usuario.
- Foi exibida a mensagem de senha incorreta.
- No backend apareceu o erro:
  - `POST /login HTTP/1.1" 400 Bad Request`

## 4. Arquivos auditados

- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/index.html`
- `docs/auditoria_runtime_fluxo_menu_pacientes_para_novo_tratamento.md`
- `docs/11_roadmap_desenvolvimento.md`
- Comparacao adicional com `516216e`

## 5. O que foi revertido

- O gate do `Novo tratamento` voltou ao comportamento anterior, sem a nova origem pendente e sem a tentativa de montar a tela principal odontologica ao selecionar paciente no menu.
- O `frontend/index.html` voltou a nao carregar os modulos `tela-principal-odontologica-*` adicionados na etapa regressiva.
- O roadmap foi ajustado para registrar que a etapa posterior foi detectada como regressiva e revertida seletivamente.
- O documento de auditoria runtime foi preservado como historico, mas marcado como etapa revertida.

## 6. O que foi preservado

- Alteracoes preexistentes fora do escopo desta regressao.
- O trabalho anterior de header de paciente em uso na tela principal.
- O modal `Novo tratamento` em si.
- Backend, banco, migrations e seeds.

## 7. Confirmacao de retorno ao estado funcional anterior

A reversao foi feita com base no commit funcional de referencia `516216e`, sem uso de reset destrutivo e sem descarte de trilhas preexistentes.

## 8. Confirmacao de nao alteracao de backend, banco e migrations

Confirmado.

- Nenhum arquivo de backend foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi criada.
- Nenhuma seed foi criada.

## 9. Riscos remanescentes

- O worktree continua com alteracoes preexistentes fora desta trilha.
- O comportamento do fluxo `Novo tratamento` deve ser revalidado em nova auditoria antes de qualquer nova mudanca.
- O documento de auditoria historica continua no repositório como referencia da etapa regressiva.

## 10. Proxima etapa recomendada

Executar uma nova auditoria de runtime antes de qualquer nova mudanca no fluxo `Tratamento -> Novo tratamento`.

