# Correcao backend-only do vinculo usuario -> prestador Clinica

## 1. Branch
`modularizacao-segura-fase-1`

## 2. Commit base
`7707f52 - Contrata correcao de vinculo ao prestador Clinica`

## 3. Objetivo
Aplicar a correção pequena e segura no backend para permitir o vínculo operacional de usuário ao prestador sistêmico `Clínica`, preservando a proteção estrutural desse prestador contra exclusão e alterações indevidas.

## 4. Arquivos analisados
- `backend/routes/user_admin_routes.py`
- `backend/routes/prestadores_routes.py`
- `backend/models/prestador_odonto.py`
- `backend/services/signup_service.py`
- `docs/contrato_correcao_usuario_vinculo_prestador_clinica.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 5. Contrato aplicado
Abordagem escolhida: `USER-PREST-CONTRATO-B`.

O contrato preserva o helper estrutural atual e separa o vínculo operacional de usuário para o prestador `Clínica` em um helper próprio.

## 6. O que foi alterado
- `backend/routes/user_admin_routes.py`
  - criado helper operacional específico para o vínculo de usuário ao prestador, com validação de mesma clínica;
  - `admin_create_user` passou a usar o helper operacional;
  - `admin_update_user` passou a usar o helper operacional;
  - o helper estrutural `_load_prestador_from_same_clinic()` foi preservado.

## 7. O que não foi alterado
- frontend;
- payload;
- seeds;
- migrations;
- schema;
- banco de dados;
- `backend/.env`;
- rotas de prestadores;
- proteção estrutural do prestador `Clínica`;
- `usuario_perfil_acesso`;
- signup;
- UI.

## 8. Proteção preservada
A proteção estrutural do prestador `Clínica` permanece no helper atual e nos fluxos de Prestadores. A correção aplicada atua apenas no vínculo operacional de usuário, sem abrir alteração estrutural do prestador.

## 9. Fluxos ajustados
- `admin_create_user`
- `admin_update_user`

## 10. Helpers envolvidos
- helper estrutural preservado: `_load_prestador_from_same_clinic()`
- helper operacional criado: `_load_prestador_for_user_link_from_same_clinic()`
- helper de vínculo já existente mantido: `_apply_user_links()`

## 11. Testes e validação
- `python -m py_compile backend/routes/user_admin_routes.py`

Validação manual futura recomendada:
- criar ou editar um usuário comum;
- selecionar o prestador `Clínica`;
- salvar com sucesso;
- confirmar que o prestador `Clínica` segue protegido estruturalmente;
- confirmar bloqueio para prestador de outra clínica;
- confirmar que o vínculo operacional do usuário foi mantido.

## 12. Escopo não alterado
- nenhuma escrita em banco foi feita nesta etapa;
- nenhum dado de produção foi alterado;
- nenhuma correção de texto, acento ou mojibake foi feita;
- nenhuma alteração de UI foi feita;
- nenhuma alteração em rotas/endpoints além do backend-alvo foi feita.

## 13. Próxima etapa recomendada
Fazer validação manual controlada do fluxo de cadastro/edição de usuário com o prestador `Clínica` e, se tudo estiver coerente, consolidar a trilha documental do contrato.
