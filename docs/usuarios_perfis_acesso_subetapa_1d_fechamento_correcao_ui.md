# Usuários / Perfis de acesso — Subetapa 1D — Fechamento da correção da UI

## 1. Objetivo

Fechar documentalmente a correção funcional e visual da aba `Perfis de acesso`.

## 2. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- `docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md`

## 3. Linha do tempo da correção

- Subetapa 0: diagnóstico da UI em contas existentes.
- Subetapa 1: correção funcional de carregamento/exibição da aba `Perfis`.
- Subetapa 1B: ajuste visual do layout.
- Subetapa 1C: validação manual positiva informada pelo usuário.

## 4. Arquivos alterados

- `frontend/app.js`
- `frontend/index.html`

Papel de cada alteração:

- `frontend/app.js`: ajuste funcional mínimo para restaurar a visibilidade da aba/painel `Perfis` na abertura das permissões, preservando o fluxo de carregamento já existente.
- `frontend/index.html`: ajuste visual mínimo da classe de layout da aba `Perfis` para empilhar `Perfis` acima de `Prestadores`, sem mexer em IDs, classes de controle ou eventos.

## 5. Resultado funcional

- A aba `Perfis de acesso` abre corretamente.
- Os 10 perfis aparecem.
- O carregamento funciona.
- A alternância de abas e a reabertura do modal não apresentaram falha relatada.

## 6. Resultado visual

- `Perfis` aparecem em cima.
- `Prestadores` aparecem abaixo.
- O layout ficou alinhado ao padrão desejado inspirado no EasyDental.
- IDs, classes e eventos foram preservados.

## 7. Regras preservadas

- backend não alterado;
- banco não alterado;
- signup não alterado;
- seeds não alterados;
- bootstrap não alterado;
- `access_profile` não alterado;
- `usuario_perfil_acesso` não alterado;
- textos/mojibake não corrigidos;
- nomes dos 10 perfis não alterados;
- admin/dono/protegido preservados;
- protected/grant preservados.

## 8. Escopo não validado além do informado

- A validação manual informou `tudo ok` para carregamento e layout.
- Se não houve teste específico de salvamento/vínculo, ele não deve ser declarado como profundamente validado.
- Se salvamento falhar futuramente, isso deve virar uma subetapa específica.

## 9. Onde testar novamente em regressão

1. Entrar com clínica 1 ou 4.
2. Abrir Usuários.
3. Selecionar usuário comum.
4. Abrir `Perfis de acesso`.
5. Confirmar 10 perfis.
6. Confirmar `Perfis` em cima.
7. Confirmar `Prestadores` abaixo.
8. Alternar abas.
9. Fechar e reabrir modal.
10. Confirmar carregamento e layout.

## 10. Preparação para commit seletivo

Se o usuário autorizar um commit futuro, o conjunto seletivo deve incluir somente:

- `frontend/app.js`
- `frontend/index.html`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- `docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md`
- `docs/usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md`

Não incluir untracked preexistentes do ambiente.

Mensagem de commit futura sugerida:

- `Corrige aba Perfis de acesso no módulo Usuários`

## 11. Próxima etapa recomendada

- Opção A: commit seletivo da correção da UI `Perfis de acesso`, se o usuário autorizar.
- Opção B: retomar teste manual real de nova conta com `institutobrana@gmail.com`, validando que a UI corrigida também funciona em clínica recém-criada.

## 12. Confirmações da etapa

- somente este documento foi criado;
- nenhum código foi alterado nesta etapa;
- banco não foi alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT`;
- nenhum arquivo foi renomeado;
- nenhum documento foi movido;
- nenhum documento foi apagado;
- `signup`, `seeds`, `bootstrap` e `access_profile` não foram alterados;
- `usuario_perfil_acesso` não foi alterado;
- `frontend` e `backend` não foram alterados nesta etapa;
- a clínica 9 não foi recriada;
- `institutobrana@gmail.com` não foi usado nesta etapa;
- pastas proibidas não foram tocadas;
- blindagem textual/mojibake respeitada;
- sem `git add`, `git commit` ou `git push`.
