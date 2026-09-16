# Auditoria de exclusao - Unidades de atendimento

## 1. Escopo

Esta auditoria fecha o contrato tecnico da exclusao de `unidade_atendimento` no Brana Cloude, com leitura do backend, modelos, docs e verificacao somente leitura do banco local. Nao houve alteracao funcional, migrate, `DELETE` manual, limpeza de registros ou commit.

## 2. Fontes consultadas

- `backend/routes/unidades_atendimento_routes.py`
- `backend/models/unidade_atendimento.py`
- `backend/models/usuario.py`
- `backend/models/agenda_legado.py`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/tratamentos_routes.py`
- `backend/services/signup_service.py`
- `backend/services/tenant_provisioning/provisioner.py`
- `backend/services/tenant_provisioning/validation.py`
- `docs/auditoria_unidades_atendimento_brana_easydental.md`
- `docs/contrato_implementacao_unidades_atendimento_frontend_react.md`
- `docs/encerramento_unidades_atendimento_etapa_1_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`
- `Y:\EDS70\Dados\eds70.sql` e demais dumps textuais disponiveis, apenas leitura

## 3. Endpoint atual

### `DELETE /cadastros/unidades-atendimento/{row_id}`

Arquivo: `backend/routes/unidades_atendimento_routes.py`

Funcao:

```python
@router.delete("/{row_id}")
def excluir(...):
    item = _or_404(db, current_user.clinica_id, row_id)
    db.delete(item)
    db.commit()
    return {"detail": "Unidade excluida."}
```

Conclusao:

- exclusao fisica direta;
- sem checagem de vincululos;
- sem protecao para unidade principal;
- sem protecao para unica unidade;
- sem regra especifica para inativo;
- sem tratamento especial para agenda, bloqueios, usuarios ou tratamentos.

## 4. Autenticacao, autorizacao e isolamento

- Autenticacao obrigatoria via `get_current_user`.
- Autorizacao por modulo via `require_module_access("configuracao")`.
- Isolamento por clinica no helper `_or_404(db, clinica_id, row_id)`.
- O helper garante `id + clinica_id`, mas nao protege contra exclusao de registro valido da propria clinica.

## 5. Tipo atual de exclusao

| Aspecto | Comportamento atual | Evidencia |
| ------- | ------------------- | --------- |
| Tipo de exclusao | Fisica | `db.delete(item)` + `db.commit()` no router |
| Filtro por clinica | Sim | `_or_404(db, current_user.clinica_id, row_id)` |
| Verificacao de vincululos | Nao | nenhum `count`, `exists` ou bloqueio antes do delete |
| Unidade principal | Nao | nenhum teste contra `source_id=1`, `codigo=0001` ou `nome=Principal` |
| Unica unidade | Nao | nenhum teste por quantidade de unidades na clinica |
| Mensagem de sucesso | Sim, generica | `Unidade excluida.` |
| Mensagem de bloqueio | Nao | inexistente no router atual |

## 6. Modelo e banco

### `backend/models/unidade_atendimento.py`

- Tabela: `unidade_atendimento`
- `clinica_id` tem FK para `clinicas.id`
- `source_id` e `clinica_id` formam unicidade logica via `UniqueConstraint("clinica_id", "source_id")`
- `codigo`, `nome`, endereco, telefones, `qtd_sala`, `inativo`, `data_inclusao`, `data_alteracao`, `criado_em`, `atualizado_em`

Pontos importantes:

- `qtd_sala` e obrigatorio no banco, default `0`
- `inativo` e booleano, default `False`
- nao ha FK formal declarada no model para dependentes de unidade

### FK e `ON DELETE`

- `unidade_atendimento.clinica_id -> clinicas.id` nao declara `ondelete`
- `usuarios.unidade_atendimento_id -> unidade_atendimento.id` existe no model, mas o banco local nao retornou FK formal nessa coluna
- `agenda_legado_evento.id_unidade` e `agenda_legado_bloqueio.id_unidade` sao colunas inteiras sem FK formal declarada no model
- `agenda_legado_evento.clinica_id` e `agenda_legado_bloqueio.clinica_id` possuem FK com `ON DELETE CASCADE` para `clinicas.id`

## 7. Referencias inversas encontradas

| Tabela / modulo | Campo | FK formal? | Pode haver registros? | Impacto da exclusao |
| --------------- | ----- | ----------: | --------------------: | ------------------- |
| `usuarios` | `unidade_atendimento_id` | Nao confirmada no banco local; existe no model | Sim | usuarios perdem referencia funcional de unidade; login/sessao e combos podem ficar inconsistentes |
| `agenda_legado_evento` | `id_unidade` | Nao | Sim, em grande volume | eventos historicos e futuros ficam apontando para uma unidade removida |
| `agenda_legado_bloqueio` | `id_unidade` | Nao | Sim possivelmente | bloqueios podem ficar orfaos e incompreensiveis |
| `tratamento` | `unidade_atendimento` | Nao | Sim | historico de tratamento preserva texto da unidade; nao quebra FK, mas perde referencia consistente com o cadastro |
| `user_admin_routes.py` | `unidade_row_id` | Nao | Sim | administracao de usuarios pode exibir unidade inexistente se o cadastro for removido |
| `signup_service.py` / `tenant_provisioning` | `source_id=1`, `codigo=0001`, `nome=Principal` | Nao | Sim, como unidade estrutural | perda da unidade principal pode quebrar bootstrap, admin inicial e padroes de tenant |

## 8. Usuarios vinculados

Evidencias:

- `backend/models/usuario.py`: `unidade_atendimento_id = Column(Integer, ForeignKey("unidade_atendimento.id"), nullable=True)`
- `backend/routes/user_admin_routes.py:460` atribui `usuario.unidade_atendimento_id = int(unidade.id) if unidade else None`
- `backend/routes/user_admin_routes.py:505` expõe `unidade_row_id`
- `backend/services/tenant_provisioning/validation.py:43` exige `user.unidade_atendimento_id == unit.id`

Conclusao:

- usuarios podem ficar sem unidade, porque a coluna e nullable;
- o sistema usa a unidade em login/provisionamento/administracao;
- excluir uma unidade vinculada a usuarios hoje pode deixar referencias sem correspondencia funcional.

## 9. Agenda e bloqueios

Evidencias:

- `backend/models/agenda_legado.py:13` e `:50` definem `id_unidade` sem FK formal
- `backend/routes/agenda_legado_routes.py` filtra por `AgendaLegadoEvento.id_unidade` e `AgendaLegadoBloqueio.id_unidade`
- eventos e bloqueios usam `id_unidade` para listagem, conflito e criacao

Conclusao:

- agenda depende da unidade para leitura e criacao;
- a exclusao fisica de uma unidade usada por agenda deixa registros historicos e futuros sem cadastro alvo;
- nao existe bloqueio atual para agenda, nem por futuros, nem por historicos.

## 10. Tratamentos

Evidencias:

- `backend/models/tratamento.py` guarda `unidade_atendimento` como texto, nao FK
- `backend/routes/tratamentos_routes.py` usa a unidade do usuario para sugerir contexto e listar unidades ativas

Conclusao:

- tratamentos nao quebram por FK, mas perdem consistencia de contexto se a unidade exibida ou selecionada deixar de existir;
- a exclusao nao apaga o historico textual do tratamento, mas prejudica combos e relacoes com a unidade cadastrada.

## 11. Unidade principal `Principal / 0001`

Evidencias:

- `backend/services/signup_service.py` cria/garante a unidade com `source_id=1`, `codigo="0001"`, `nome="Principal"`
- o admin inicial recebe `unidade_atendimento_id = unit.id`
- `backend/services/tenant_provisioning/provisioner.py` tambem garante a unidade inicial com `source_id=1`
- `backend/services/tenant_provisioning/validation.py` espera que o usuario admin esteja vinculado a essa unidade

Conclusao:

- existe identificacao suficientemente forte para tratamento como unidade estrutural;
- a forma mais segura de identificacao e `clinica_id + source_id = 1`;
- `codigo` e `nome` ajudam, mas nao devem ser os unicos identificadores, porque o bootstrap tambem aceita normalizacoes historicas.

## 12. Unica unidade da clinica

Resultados do banco local:

- clinicas com uma unica unidade: `13` e `15`
- clinica `1` possui `4` unidades
- registros de teste locais confirmados: `11`, `12`, `13`

Conclusao:

- o sistema pode ter clinicas com apenas uma unidade;
- excluir a ultima unidade deixaria a clinica sem referencia operacional para combos, administracao e agenda;
- a regra segura e impedir exclusao da ultima unidade.

## 13. Inativar versus excluir

Conclusao:

- o sistema ja tem `inativo` e os combos de unidade usam apenas unidades ativas;
- inativar preserva historico e permite ocultar do uso corrente;
- excluir remove o cadastro e rompe a referencia para usuarios, agenda e bootstrap;
- a exclusao fisica nao e equivalente a inativacao e nao deve ser a alternativa padrao para operacao cotidiana.

## 14. EasyDental Desktop

Evidencia direta encontrada:

- os dumps e textos locais de `Y:\EDS70` nao trouxeram uma ocorrencia legivel e confiavel de `Unidades de atendimento`, `Principal / 0001` ou regra de exclusao protegida para este modulo;
- as buscas textuais em `Y:\EDS70\Dados\eds70.sql`, `Y:\EDS70\Textos` e `Y:\EDS70\Help` nao retornaram evidencias confiaveis do comportamento de exclusao deste cadastro.

Classificacao:

- evidencia direta: ausente nesta passagem;
- inferencia: nao usar para definir regra de exclusao;
- pendencia: comportamento real do EasyDental para `Elimina` nesta tela permanece nao comprovado neste ambiente.

## 15. Modulos de referencia

Modulos com protecao nativa ou padrao util:

- Plano de contas: protecao de grupos nativos ja usada como padrao arquitetural de bloqueio;
- Cadastro de usuarios: tratamento de dependencias e desvinculos antes de remover;
- Agenda: uso de `id_unidade` em diversas rotinas evidencia a sensibilidade da unidade.

## 16. Consultas SELECT nao destrutivas

Consultas executadas com sucesso no banco local:

- quantidade de unidades por clinica;
- registros `id=11,12,13`;
- unidades com usuarios vinculados;
- referencias em agenda;
- clinicas com apenas uma unidade;
- verificacao de FKs em agenda.

### Resumo obtido

- `unidade_atendimento`: clinica 1 = 4 unidades, clinica 13 = 1, clinica 15 = 1
- registros de teste:
  - `id=11`, `clinica_id=1`, `codigo=0002`, `nome=Unidade Codex Teste`
  - `id=12`, `clinica_id=1`, `codigo=0003`, `nome=Unidade Codex Teste Ajustada`
  - `id=13`, `clinica_id=1`, `codigo=0004`, `nome=Unidade Codex Teste Criacao`
- usuarios com unidade:
  - `unidade_atendimento_id=1` com 5 usuarios
  - `unidade_atendimento_id=10` com 2 usuarios
- agenda:
  - `agenda_legado_evento.id_unidade=1` com 14044 linhas
  - `agenda_legado_bloqueio` sem linhas encontradas na amostragem

## 17. Matriz de regras possiveis

| Situacao | Excluir? | Justificativa | Regra recomendada |
| -------- | -------: | ------------- | ----------------- |
| Unidade inexistente | Nao | deve retornar 404 | nao excluir |
| Unidade de outra clinica | Nao | isolamento por tenant | nao excluir |
| Unica unidade da clinica | Nao | a clinica fica sem referencia operacional | bloquear |
| Principal / 0001 | Nao | unidade estrutural do bootstrap | bloquear |
| Com usuarios vinculados | Nao | usuario pode ficar sem referencia operacional | bloquear |
| Com agenda futura | Nao | agenda ativa ficaria inconsistente | bloquear |
| Com agenda historica | Nao | historico ficaria sem cadastro alvo | bloquear |
| Com bloqueios | Nao | bloqueios perdem contexto | bloquear |
| Com tratamentos | Nao | historico e combos perdem referencia | bloquear |
| Sem vinculos | Sim, apenas como opcao futura | e o unico caso com menor risco | permitir depois de contrato de protecao |
| Unidade inativa | Nao por si so | inatividade nao equivale a liberacao de exclusao | seguir mesmas protecoes |

## 18. Riscos

- perda de historico de agenda;
- usuarios vinculados sem unidade;
- remoção da unidade principal do tenant;
- clinica sem nenhuma unidade;
- inconsistencias com listas e combos que dependem de unidades ativas;
- possivel quebra de fluxos de provisionamento e validação.

## 19. Lacunas

- ausencia de evidencia legivel no EasyDental para a regra de exclusao da tela;
- ausencia de FK formal no banco local para `usuarios.unidade_atendimento_id` e para `agenda_legado_evento.id_unidade` / `agenda_legado_bloqueio.id_unidade`;
- ausencia de bloqueio server-side atual no endpoint DELETE;
- registros de teste locais continuam presentes e nao foram removidos nesta etapa.

## 20. Conclusao

A exclusao atual de unidades de atendimento e fisica, sem protecao suficiente para a operacao real do sistema. O contrato tecnico recomendado e bloquear exclusao sempre que houver qualquer dependencia relevante, proteger a unidade principal `source_id=1` e impedir exclusao da ultima unidade da clinica.

## 21. Atualizacao de fechamento

- A recomendacao desta auditoria passou a ser a base do backend e do frontend implementados no fechamento tecnico posterior.
- O documento permanece valido como rastreabilidade da descoberta e das regras adotadas.
