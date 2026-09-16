# Plano operacional de corte da migração integral

## Objetivo

Executar a virada do banco local para o RDS de homologação com snapshot prévio, transporte seguro do dump, restore controlado, validação e rollback previsível.

## Pré-corte

1. Confirmar Git e imagem.
2. Confirmar identidade IAM não-root.
3. Confirmar RDS sem tenant.
4. Confirmar serviço saudável.
5. Congelar novas gravações no sistema de origem.
6. Criar snapshot manual pré-importação.
7. Aguardar status `available`.

## Corte

1. Gerar dump final consistente com `pg_dump -Fc`.
2. Calcular checksum do dump.
3. Transportar o dump de forma temporária e criptografada.
4. Restaurar em destino vazio dentro da VPC.
5. Ajustar sequences.
6. Executar `ANALYZE`.
7. Validar contagens.
8. Validar checksums.
9. Validar integridade.
10. Validar login e `/me` com credenciais reais.
11. Validar isolamento entre clínicas.

## Critérios para liberar

- contagens iguais;
- checksums iguais;
- sem FKs órfãs;
- sequences consistentes;
- logins válidos;
- `/me` correto;
- isolamento por clínica correto;
- arquivos externos acessíveis no destino esperado.

## Critérios para rollback

- erro de restore;
- divergência de contagem;
- checksum divergente;
- FK órfã nova;
- sequence incorreta;
- login estruturalmente inválido;
- `/me` com clínica incorreta;
- isolamento entre tenants falhando;
- backend retornando 500 estrutural.
