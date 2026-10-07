# P4A — preservação de símbolos nos writers de Procedimentos

Precedência vigente: [contrato canônico de Procedimentos/Genéricos](contrato_edicao_procedimentos_roundtrip.md). Disposições anteriores conflitantes são **SUPERSEDED**. A proteção P4A do par omitido permanece; escolha/limpeza explícita local não é reposta pelo Genérico. Os relatos de baseline/execução abaixo são históricos, não o estado deste fechamento.

Alteração de source em revisão, sem aplicação de dados, commit, push ou
reinício do runtime. Baseline: `a592703a3c008edda0c4ee77302547861605c9c6`.
Brana Cloude permanece autoridade para todos os campos não relacionados ao
símbolo. EasyDental é somente referência de símbolo, não sincronização.

## Contrato limitado desta rodada

- PUT continua sendo edição completa, **não** writer SYMBOL_ONLY. Omissão de
  `simbolo_grafico` e `simbolo_grafico_legacy_id` preserva exatamente o par atual,
  incluindo pares vazios/parciais. A herança genérica não o modifica nesse caso.
- Uma escolha nova explícita resolve código + legacy no catálogo ativo da
  própria clínica. O ID local do catálogo nunca é gravado como legacy.
  Código compartilhado por identidades diferentes exige desambiguação por
  legacy; não deduplicar 57/58 nem 18/81 por bitmap.
- Cliente antigo que retransmite código inalterado, omitindo legacy ou enviando
  legacy nulo, não apaga a identidade já presente. Null de legacy sozinho não
  limpa um código preenchido. Código explicitamente vazio + legacy vazio pode
  continuar limpando o par. Pelo [contrato definitivo R1.R3](contrato_edicao_procedimentos_roundtrip.md),
  edição/limpeza explícita não é reposta pelo Genérico. Omissão continua preservando
  o par exatamente. CREATE sem escolha não herda referência do Genérico; símbolo
  é local. "Mostrar símbolo" não existe como opção funcional: símbolo gráfico válido
  sempre é utilizado/exibido, independentemente do flag histórico. A coluna pode
  permanecer deprecated/interna, sem edição ou efeito de renderização. O ID local
  nunca é gravado como legacy.
- Cadastro sem símbolo continua permitido nesta regularização. Não há NOT NULL,
  constraint, validação obrigatória, restauração do símbolo 58 ou autorização C.
- Seed sanitizado de novas contas continua criando símbolos vazios, mas o upsert
  de registros existentes não escreve nenhum dos dois campos de símbolo.
- Cópia entre tabelas é **da mesma clínica**, conforme o chamador autenticado.
  Valida todos os pares antes das cópias e preserva ambas as referências. Não há
  clonagem entre clínicas nem seleção arbitrária em origem inválida/ambígua.
- Upsert PARTICULAR já existente continua sendo no-op. Novas referências do
  template são validadas localmente. A separação de tabelas não remove registros
  que possuam qualquer referência de símbolo, mesmo fora dos códigos do seed.
- Herança/backfill legado não preenche metade de um par já existente com outro
  símbolo. Em origem sem identidade local válida, não atribui nem substitui.

## Inventário classificado por alcance comprovado no código

| Writer | Classe | Situação P4A |
| --- | --- | --- |
| React e legado → POST/PUT `/procedimentos` | ACTIVE_PRODUCTION_WRITER | Proteção no servidor compartilhada; UI/payload não alterados |
| `criar_procedimento`, `atualizar_procedimento` | ACTIVE_PRODUCTION_WRITER | Omissão preservada; escolha explícita local e coerente |
| `_copiar_procedimentos_entre_tabelas` | ACTIVE_PRODUCTION_WRITER | Usado por criação autenticada de tabela; par local completo |
| `_aplicar_fases_procedimento_generico` | ACTIVE_PRODUCTION_WRITER, fases somente | Não escreve símbolo ou outro campo cadastral; substitui fases na associação/troca |
| `seed_procedimentos` / `_garantir_tabelas_procedimentos_iniciais` | SEED/BOOTSTRAP | Chamado pelo signup; par existente protegido |
| Signup/provisionamento de conta nova | SEED/BOOTSTRAP | Usa seed protegido; não executado nesta rodada |
| `_upsert_procedimentos_particular_na_clinica` | SEED/BOOTSTRAP | Registro existente não sobrescrito; criação validada localmente |
| `_upsert_procedimentos_na_clinica` | DEAD/UNUSED no fluxo atual | Sem chamador atual encontrado; branch existente não escreve símbolo |
| `separar_tabela_exemplo_particular_todas_clinicas` | SEED/BOOTSTRAP | Registrado nos jobs de runtime e CLI específico; DELETE exclui símbolo preenchido |
| `garantir_metadados_tabela_particular` | SEED/BOOTSTRAP | Referências históricas locais preservadas/resolvidas em conjunto; não herda campos do Genérico atual |
| `_backfill_campos_procedimentos_por_generico` | REMOVED R1.R2 | Reposição cadastral pelo Genérico revogada, inclusive em bootstrap |
| `garantir_catalogo_simbolos`, `seed_simbolos_graficos` | SEED/BOOTSTRAP, outra entidade | Não escrevem par do procedimento; manutenção/deduplicação do catálogo fora do diff |
| `backfill_procedimento_simbolo_legacy.py`, `migrar_simbolos_particular.py` | MIGRATION/HISTORICAL | Escrita direta manual; sem chamada produtiva encontrada; não executados/reativados |
| `migrar_tabelas_procedimentos_easy.py`, `recriar_particular_easydental.py`, `migrar_particular_gleisson.py` | MIGRATION/HISTORICAL | Importação/recriação explícita one-shot; não executar sobre dados regularizados sem fase própria |
| `corrigir_vinculos_particular_harmonizacao.py` | MIGRATION/HISTORICAL | Herança histórica isolada; não reativar como writer operacional |
| `export_seed_modelo.py` | MIGRATION/HISTORICAL, geração de source | Pode regenerar seed e perder proteções; não executar/regenerar nesta rodada |
| Correções de nomes/mojibake e rollback correspondentes | MIGRATION/HISTORICAL | Não alteram os dois campos de referência; fora do diff |
| Fixtures e doubles de testes | TEST_ONLY | Sem acesso a banco/runtime oficial |
| Uso manual futuro dos one-shot acima | UNPROVEN | A disponibilidade do arquivo não prova uso operacional atual |

Bootstrap é acessível condicionalmente por política/runtime ou comando manual;
não se afirma que tenha sido executado agora. SQL direto histórico não é
interceptado por esta proteção do source ativo: reativação exige auditoria e
autorização próprias, nunca uma regularização implícita.

## Validação e limites

Testes novos exercitam as funções reais extraídas por AST com ORM doubles,
sem importar bootstrap, abrir banco ou usar SQLite. Incluem omissão, edição de
outro campo, seed/upsert, cópia, escolha explícita, catálogo local, pares
parciais, campos vazios e bitmap compartilhado. A condição de exclusão de
registros com símbolo na separação é validada estruturalmente no SQL.

A conferência de dados oficial é SELECT em transação read-only: dez snapshots
e xmin contra P3.R2, contagens 1048/9805 e fingerprints das demais tabelas.
As 10853 linhas de procedimentos e os alvos locais do catálogo permanecem
iguais ao P3.R2. O fingerprint global variou durante a rodada; comparação com
o P3.R2 delimitou diferenças em `agenda_legado_evento`,
`authenticated_session_instance` e `usuarios`. Não se atribui autoria/causa
dessas diferenças sem prova, nem se afirma imobilidade global do banco. Esta
fase não executou escrita: consultas oficiais foram read-only; testes mutáveis
usaram somente doubles.
Não se testa gravação de API nem bootstrap no banco oficial. Não há mudança
visual nem homologação visual reclamada.

Riscos deliberadamente restantes: limpeza **explícita** pelo contrato normal,
payload completo desatualizado que retransmita clear explícito, scripts
históricos e manutenção do catálogo. Obrigatoriedade, integridade de schema,
concorrência do writer de regularização e rollout do backend permanecem em
fases próprias. Não aplicar A1, restaurar catálogo ou retomar FC4 nesta rodada.
