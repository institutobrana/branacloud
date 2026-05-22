# Access Profile - Subetapa 6B: estrategia documental para clinicas existentes

## Branch
`modularizacao-segura-fase-1`

## Commit base
`eefd96e - Consolida trilha validada de perfis de acesso`

## Objetivo da estrategia
Definir uma estrategia documental segura para tratar clinicas existentes que estao sem `access_profile` ou com `access_profile` incompleto, sem corrigir nada nesta etapa.

## Estado atual conhecido das clinicas existentes
- Clinica 1: `0/10`
- Clinica 4: `0/10`
- Clinica 8: `3/10`
- Perfis existentes encontrados na clinica 8:
  - Pacientes
  - Controle de estoque
  - Controle de recibos

## Por que essas clinicas nao foram corrigidas automaticamente
As clinicas existentes nao foram corrigidas automaticamente porque a trilha validada foi desenhada para novas clinicas no signup. O caso das clinicas antigas exige tratamento especifico, com leitura previa do estado atual, comparacao por nome/source_id e confirmacao de que nao havera sobrescrita nem duplicacao.

## Por que nao e seguro corrigir dados existentes sem etapa propria
Nao e seguro corrigir dados existentes sem etapa propria porque:
- ha clinicas com base parcial;
- ha clinicas com base ausente;
- pode haver diferenca de `source_id` legado em relacao ao mapeamento versionado;
- uma correcao direta pode sobrescrever ou duplicar perfis;
- `usuario_perfil_acesso` nao deve ser alterado por acidente;
- a UI pode depender de uma base consistente antes de qualquer reabertura da aba `Perfis de acesso`.

## Diferenca entre os tres cenarios
- Nova clinica via signup: deve nascer com os 10 `access_profile` base a partir do bootstrap oficial.
- Clinica existente sem `access_profile`: requer estrategia de backfill controlado, com dry-run atualizado e autorizacao explicita.
- Clinica existente com `access_profile` parcial: requer comparacao fina para preservar o que ja existe e criar apenas o que falta.

## Estrategia recomendada para clinicas existentes
1. Nao corrigir automaticamente agora.
2. Produzir um dry-run atualizado, somente leitura, para todas as clinicas existentes.
3. Registrar por clinica o que existe, o que falta e o que seria criado.
4. Somente depois, se autorizado, criar uma rotina controlada de bootstrap para clinicas existentes.
5. Se necessario, corrigir clinica especifica por autorizacao explicita.

## Opcoes possiveis
### A. Apenas documentar e nao corrigir agora
- Risco: a UI pode continuar vazia ou incompleta em clinicas antigas.
- Vantagem: nao altera dados existentes.

### B. Executar dry-run atualizado, somente leitura, para todas as clinicas
- Risco: nenhum em dados, mas exige leitura cuidadosa do resultado.
- Vantagem: produz mapa exato do que falta antes de qualquer correcao.

### C. Criar rotina controlada de bootstrap para clinicas existentes, com autorizacao explicita
- Risco: pode criar dados em massa se o dry-run estiver incorreto.
- Vantagem: permite backfill consistente e auditavel.

### D. Corrigir apenas clinica especifica por autorizacao explicita
- Risco: solucao parcial, precisa ser repetida clinica a clinica.
- Vantagem: reduz alcance e facilita validação.

## Ordem segura recomendada
1. Dry-run atualizado, somente leitura, para todas as clinicas.
2. Relatorio por clinica.
3. Validacao de source_id e nomes existentes.
4. Confirmacao de que nao havera sobrescrita.
5. Confirmacao de que `usuario_perfil_acesso` nao sera alterado.
6. Autorizacao explicita do usuario.
7. Apenas depois, rotina controlada ou correcao pontual.

## Condicoes minimas antes de qualquer correcao real
- dry-run atualizado;
- relatorio por clinica;
- confirmacao de source_id e nomes existentes;
- confirmacao de que nao havera sobrescrita;
- confirmacao de que `usuario_perfil_acesso` nao sera alterado;
- autorizacao explicita do usuario.

## Estrategia sugerida para a clinica 8
- respeitar os perfis existentes por nome;
- nao duplicar Pacientes, Controle de estoque e Controle de recibos;
- criar apenas os 7 faltantes, se autorizado em etapa futura.

## Estrategia sugerida para as clinicas 1 e 4
- criar os 10 perfis base, se autorizado em etapa futura.

## Confirmação sobre a UI da aba Perfis de acesso
A UI da aba `Perfis de acesso` deve aguardar a estrategia de dados existentes. Primeiro a base de dados das clinicas antigas precisa ser definida; depois a UI pode ser estabilizada com seguranca.

## Proxima etapa recomendada
Subetapa 6C: dry-run atualizado pos-correcao do bootstrap, somente leitura, para clinicas existentes.

## Confirmacoes de escopo
- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhum signup foi executado.
- Nenhuma conta foi criada.
- Frontend e UI nao foram alterados.
- Clinicas existentes nao foram alteradas.
- `usuario_perfil_acesso` nao foi alterado.

