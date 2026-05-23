# Usuários / Perfis de acesso — Subetapa 1C — Validação manual funcional e visual

## 1. Contexto

- A Subetapa 0 diagnosticou um problema provável de UI/estado.
- As clínicas 1 e 4 têm 10 `access_profile`.
- A Subetapa 1 corrigiu o carregamento/exibição da aba `Perfis`.
- A Subetapa 1B ajustou o layout visual ao padrão EasyDental.
- O usuário testou manualmente e informou que está tudo ok.

## 2. Objetivo

Documentar a validação manual da tela `Perfis de acesso` após a correção funcional e o ajuste visual.

## 3. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`

## 4. Arquivos alterados nas subetapas anteriores

- `frontend/app.js` foi alterado na Subetapa 1.
- `frontend/index.html` foi alterado na Subetapa 1B.
- Nesta Subetapa 1C nenhum código foi alterado.

## 5. Validação manual informada pelo usuário

- O usuário informou: `tudo ok`.
- `Perfis` aparecem.
- `Prestadores` aparecem.
- O layout ficou empilhado verticalmente.
- `Perfis` em cima.
- `Prestadores` abaixo.
- O carregamento permaneceu funcionando.
- Não houve falha relatada.

## 6. Regras preservadas

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
- modelos de permissão/grant/protected preservados.

## 7. Estado funcional atual

- A tela `Perfis de acesso` está funcional em contas existentes.
- O layout está alinhado ao padrão visual desejado.
- O teste foi feito antes de criar nova conta manual.
- O fluxo de signup manual com `institutobrana@gmail.com` continua pausado até fechamento documental desta UI.

## 8. Onde testar novamente se necessário

1. Entrar com conta existente da clínica 1 ou 4.
2. Abrir módulo Usuários.
3. Selecionar usuário comum.
4. Abrir `Perfis de acesso`.
5. Confirmar 10 perfis.
6. Confirmar `Perfis` em cima.
7. Confirmar `Prestadores` abaixo.
8. Alternar abas.
9. Fechar e reabrir modal.
10. Confirmar persistência visual e carregamento.

## 9. Pendências

- Não há pendência funcional relatada pelo usuário nesta validação.
- Carregamento e layout foram validados.
- Salvamento/vínculo só deve virar nova subetapa se o usuário reportar falha específica.

## 10. Próxima etapa recomendada

- Fechar documentalmente a tela `Perfis de acesso`.
- Ou seguir para teste manual real de nova conta com `institutobrana@gmail.com`, validando que a nova clínica nasce com os 10 `access_profile` e que a UI corrigida funciona também na conta recém-criada.

## 11. Confirmações da etapa

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
