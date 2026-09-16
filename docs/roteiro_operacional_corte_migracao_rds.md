# Roteiro operacional de corte para migra??o integral

## Pr?-corte

- confirmar Git e imagem
- confirmar IAM n?o-root
- confirmar RDS sem tenant
- confirmar servi?o saud?vel
- congelar novas grava??es
- tirar snapshot pr?-importa??o
- aguardar snapshot `available`

## Corte

- gerar dump final
- calcular checksum
- transportar dump por mecanismo tempor?rio seguro
- restaurar em destino vazio
- ajustar sequences
- executar ANALYZE
- validar contagens e checksums
- validar login e `/me`
- validar isolamento

## Rollback

- se houver erro de restore, diverg?ncia, FK ?rf?, sequence incorreta ou login estruturalmente inv?lido, restaurar snapshot pr?-importa??o em nova inst?ncia e redirecionar a aplica??o
