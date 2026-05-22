# Subetapa 6H - Decisao para Demais Clinicas Existentes

## Branch
`modularizacao-segura-fase-1`

## Commit base
`6c99dc5 - Documenta execucao e validacao da clinica 1`

## Objetivo da decisao
Definir o proximo passo para as demais clinicas existentes apos a validacao da clinica 1, sem executar qualquer correcao nesta etapa.

## Estado atual da clinica 1
- `10/10` em `access_profile`
- `usuario_perfil_acesso = 0`
- banco foi alterado somente em `access_profile` da clinica 1

## Estado atual da clinica 4
- permanece `0/10`
- ainda nao foi corrigida

## Estado atual da clinica 8
- permanece `3/10`
- perfis existentes:
  - Pacientes
  - Controle de estoque
  - Controle de recibos
- ainda faltam `7` perfis

## Arquivos analisados
- `backend/seeds/access_profiles_existing_clinics_runner.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/models/access_profile.py`
- `backend/models/clinica.py`
- `backend/database.py`
- `backend/.env`
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6d_decisao_plano_correcao_clinicas_existentes.md`
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md`
- `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Opcoes comparadas

### Opcao A - corrigir clinica 4 agora como proximo caso simples
Riscos:
- ainda altera o banco principal;
- exige execucao real controlada;
- mas e o caso mais parecido com a clinica 1.

Beneficios:
- clinica 4 esta `0/10`, como a clinica 1 antes;
- menor complexidade;
- valida novamente o runner em um caso simples;
- evita misturar o caso parcial da clinica 8 neste momento.

### Opcao B - corrigir clinica 8 agora como caso parcial
Riscos:
- clinica 8 ja tem 3 perfis;
- precisa preservar perfis existentes;
- maior risco de duplicidade se houver divergencia de `source_id` ou nome;
- deve ser tratada depois de mais uma validacao simples.

### Opcao C - corrigir clinica 4 e clinica 8 em sequencia
Riscos:
- duas correcoes reais proximas;
- menos isolamento;
- maior dificuldade de rastreabilidade se algo falhar.

### Opcao D - parar correcoes e partir para UI
Riscos:
- a UI ainda pode falhar ou ficar incompleta para clinicas existentes;
- o problema da clinica 4 e da clinica 8 permaneceria parcialmente aberto.

## Opcao recomendada
Recomendar a opcao mais segura:
- 6I: executar runner somente para clinica 4;
- 6J: validar clinica 4 por leitura/dry-run;
- 6K: decidir tratamento especifico da clinica 8;
- somente depois avaliar UI.

## Justificativa da recomendacao
- clinica 4 e o proximo caso mais simples;
- clinica 1 ja validou o fluxo;
- clinica 4 permite segunda confirmacao em caso `0/10`;
- clinica 8 deve ficar para uma etapa propria por ser parcial `3/10`.

## Criterios para a futura 6I
- autorizacao explicita;
- `clinica_id = 4`;
- `current_database = brana_saas`;
- dry-run previo confirmando `0/10`;
- execucao com `--execute` somente para clinica 4;
- alteracao somente em `access_profile` da clinica 4;
- `usuario_perfil_acesso` nao deve ser alterado;
- clinica 8 nao deve ser alterada;
- UI nao deve ser alterada.

## Relacao com a UI
- Nao corrigir UI ainda;
- primeiro estabilizar a base `access_profile` das clinicas existentes;
- depois testar a aba `Perfis de acesso` em uma clinica corrigida;
- so entao tratar comportamento e layout da aba.

## Confirmacoes de escopo
- nenhum codigo alterado;
- nenhum banco alterado;
- runner nao executado;
- `--execute` nao usado;
- clinica 4 nao corrigida;
- clinica 8 nao corrigida;
- `usuario_perfil_acesso` nao alterado;
- `frontend`, `UI` e rotas/endpoints nao alterados.

## Ponto de decisao
PONTO DE DECISÃO — após validação da clínica 1, a próxima correção recomendada é a clínica 4, mantendo a clínica 8 para etapa própria.

## Proxima etapa recomendada
- Subetapa 6I: executar o runner somente para a clinica 4, com autorizacao explicita.

