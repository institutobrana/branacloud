# Aceite Temporario de Risco da Imagem Base AWS

## 1. Identificacao

- Projeto: Brana Cloud
- Imagem: `brana-backend:aws-schema-guard-candidate1`
- Tag ECR local de referencia: `810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:aws-schema-guard-3eab70f3-bookworm1`
- Digest: `sha256:b420d3e6ad44893472355c3974592cc2ef67a3be4da037389211ea8c9efe4faa`
- Data da analise: 2026-07-16
- Distribuicao: Debian GNU/Linux 12 Bookworm
- Python: 3.10.20
- Regiao/repositorio: `sa-east-1`, `brana-cloud/backend`

## 2. Resultado do scan

- CRITICAL: 3
- HIGH: 5
- MEDIUM: 5

Achados CRITICAL e HIGH conhecidos associados ao pacote-fonte Perl:

- CVE-2026-7017 | HIGH | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-57433 | CRITICAL | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-48962 | HIGH | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-12087 | CRITICAL | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-48961 | HIGH | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-57432 | HIGH | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-48959 | HIGH | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner
- CVE-2026-13221 | CRITICAL | pacote-fonte: perl | versao instalada: 5.36.0-7+deb12u3 | versao corrigida: nao informada pelo scanner

## 3. Origem

- os pacotes vieram da imagem oficial `python:3.10-slim-bookworm` e da base Debian Bookworm;
- o Dockerfile do Brana Cloud nao instala Perl;
- nao foi identificado uso direto de Perl pela aplicacao em runtime;
- o scanner associa os achados ao pacote-fonte Perl;
- `perl-base` fornece `/usr/bin/perl`;
- `perl-base` e pacote essencial do Debian.

## 4. Tentativas avaliadas

- migracao de Trixie para Bookworm foi mantida como base local de referencia por reduzir parte dos achados;
- a mudanca reduziu a superficie de `4 CRITICAL/8 HIGH/3 MEDIUM` para `3 CRITICAL/5 HIGH/5 MEDIUM`;
- foi tentada a avaliacao de remocao de Perl;
- a simulacao de purge indicou remocao de `perl-base` e alertou que o pacote e essencial;
- o purge foi rejeitado porque quebraria a imagem base do Debian;
- `apt upgrade` nao foi usado porque introduziria alteracao indiscriminada fora do escopo de aceite local;
- Alpine nao foi adotado nesta fase porque mudaria a plataforma, exigiria revalidacao ampla e nao resolveria a necessidade imediata de aceitacao temporaria.

## 5. Exposicao pratica

- a aplicacao nao chama Perl diretamente;
- nao foi identificado subprocesso com Perl no fluxo principal;
- os endpoints expostos nao liberam execucao remota de comandos;
- uploads nao chegam a um interpretador Perl na imagem;
- o pacote fica acessivel apenas internamente no contenedor;
- o processo roda como usuario nao root;
- nao existe shell exposto remotamente como funcionalidade da aplicacao;
- ha ferramentas auxiliares no sistema base, mas nao foi identificada exposicao funcional desnecessaria por Perl.

## 6. Mitigacoes existentes

- conteiner nao root;
- imagem imutavel;
- manifesto simples;
- scan no ECR;
- frontend React fora da imagem do backend;
- dados clinicos fora da imagem;
- banco futuro privado;
- DDL automatico bloqueado;
- bootstrap desabilitado;
- secrets fora da imagem;
- health check sem acesso ao banco;
- ausencia de credenciais AWS no conteiner;
- logs sanitizados;
- rollback por tag/digest.

## 7. Risco residual

ACEITO TEMPORARIAMENTE SOMENTE PARA HOMOLOGACAO CONTROLADA

O aceite nao elimina o risco, nao equivale a aprovacao definitiva para producao e deve ser reavaliado antes da virada final.

## 8. Criterios de reavaliacao

A revisao e obrigatoria quando ocorrer qualquer um destes eventos:

- nova versao de `python:3.10-slim-bookworm`;
- atualizacao de pacote Perl no Debian;
- scanner indicar `fixed_version`;
- novo CVE critico;
- mudanca do Dockerfile;
- mudanca da versao Python;
- mudanca de distribuicao;
- antes da publicacao definitiva;
- no maximo a cada 30 dias durante a preparacao.

## 9. Politica para novas imagens

1. usar tag baseada no commit;
2. usar tag imutavel;
3. ser `linux/amd64`;
4. ser construida sem provenance/SBOM quando necessario ao scan basico;
5. passar por build;
6. passar por smoke test;
7. responder `/health`, `/app` e `/frontend/`;
8. executar como nao root;
9. ter DDL automatico bloqueado;
10. ser escaneada;
11. comparar achados com a imagem anterior;
12. bloquear regressao de novos CRITICAL, salvo aceite documentado;
13. manter digest registrado;
14. permitir rollback.

## 10. Criterios para avancar

A infraestrutura de homologacao pode avancar desde que:

- RDS nao seja exposto publicamente;
- credenciais fiquem em Secrets Manager ou mecanismo equivalente;
- App Runner use imagem por digest/tag imutavel;
- dominio de producao nao seja apontado ainda;
- dados reais nao sejam migrados;
- homologacao use banco separado ou copia sanitizada;
- logs e custos sejam monitorados.

## 11. Criterios que ainda bloqueiam producao

- ausencia de infraestrutura homologada;
- ausencia de RDS testado;
- ausencia de S3 para persistencia;
- ausencia de CORS e dominio definitivos;
- ausencia de validacao de backup/restauracao;
- ausencia de automacao GitHub;
- risco residual de CVEs da base;
- necessidade de revisao final de seguranca.

## 12. Responsabilidade e prazo

- o aceite e temporario;
- nao elimina o risco;
- nao dispensa atualizacao futura;
- deve ser reavaliado antes da producao;
- a decisao final pertence ao proprietario do projeto.