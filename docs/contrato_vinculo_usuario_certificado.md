# Contrato de vínculo usuário–certificado

## Escopo

Este contrato cadastra somente a identidade pública do certificado: o SHA-256
do DER. Ele não prova posse da chave privada e não altera o fluxo Oasis,
bridge, WPF ou `/sign`.

## Estados e autoridade

- `PENDING`: criado por administrador ativo da mesma clínica para um titular
  ativo da clínica.
- `ACTIVE`: o próprio titular autentica novamente com `Usuario.senha_hash`.
- `REVOKED`: revogado pelo titular ou por administrador da mesma clínica; não
  retorna a `ACTIVE`. Um novo cadastro cria outro registro.

Rotas: `POST /usuario-certificados`,
`POST /usuario-certificados/{id}/confirm`,
`POST /usuario-certificados/{id}/revoke` e `GET /usuario-certificados`.
Todas exigem sessão Brana e filtram pela clínica da sessão. A senha interna
ou administrativa nunca ativa um vínculo.

## Proteções

A confirmação persiste cinco falhas em uma janela de 15 minutos e bloqueia por
15 minutos. O índice parcial impede dois vínculos `ACTIVE` para o mesmo
titular, clínica e hash DER. Auditorias registram ação, ator, alvo, status e
hash público; nunca registram senha, corpo bruto ou headers sensíveis.

A migration aditiva reproduzível está em
`backend/scripts/migrar_usuarios_certificados.py`. A integração com seleção de
certificado, bridge e `/sign` permanece deliberadamente fora deste contrato.
