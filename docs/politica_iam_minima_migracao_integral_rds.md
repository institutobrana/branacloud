# Politica IAM minima para a migracao integral

## Identidade aprovada para a frente

- `arn:aws:iam::810204249111:user/tel-admin`

## Identidade a evitar

- `arn:aws:iam::810204249111:root`

## Situacao atual

- o usuario `tel-admin` esta autenticado via `AWS_PROFILE=tel-admin`;
- `sts get-caller-identity` retornou a conta `810204249111` e o ARN do usuario `tel-admin`;
- o usuario possui `AdministratorAccess`, portanto todas as permissoes pedidas estao efetivamente disponiveis.

## Permissoes confirmadas como disponiveis

- `rds:DescribeDBInstances`
- `rds:DescribeDBSnapshots`
- `rds:CreateDBSnapshot`
- `ecs:DescribeServices`
- `ecs:DescribeTaskDefinition`
- `ecs:RegisterTaskDefinition`
- `ecs:RunTask`
- `ecs:DescribeTasks`
- `ecs:StopTask`
- `logs:DescribeLogGroups`
- `logs:DescribeLogStreams`
- `logs:GetLogEvents`
- `logs:FilterLogEvents`
- `ecr:DescribeImages`
- `ecr:BatchGetImage`
- `secretsmanager:DescribeSecret`
- `secretsmanager:GetSecretValue`
- `iam:PassRole`
- `s3:PutObject`
- `s3:GetObject`
- `s3:DeleteObject`
- `s3:ListBucket`

## iam:PassRole

- permitido para o usuario atual por causa da policy `AdministratorAccess`;
- por seguranca operacional, o corte real ainda deve usar uma role de execucao dedicada, com restricao aos roles necessarios da tarefa de migracao;
- o acesso efetivo esta disponivel, mas a restricao fina ainda e uma recomendacao de endurecimento.

## Policies anexadas

- `AdministratorAccess`

## Resumo do gate IAM

- sem root;
- sem bloqueios de permissao para a frente de migracao;
- acesso ao S3 temporario futuro tambem esta disponivel;
- gate IAM: **APROVADO**.
