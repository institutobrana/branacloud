# FC4 P2.R2 — integração de criação (worktree isolado)

Procedimentos é a única fonte cadastral. O resolver central
`fc4_procedure_resolver.resolve_procedure_target` lê procedimento por ID/tenant,
resolve código + legacy_id (NROSIM) no catálogo local ativo e usa somente
`tipo_marca` (TIPMARCA). IDs legados, descrições, cobrança, Genérico e bitmaps
não escolhem alvo. Catálogo/procedimento ficam bloqueados para leitura até commit.

POST /odontograma/comandos, no router existente: autenticação e módulo oficiais,
função inserir_intervencoes e OWNER pelo guard existente, tenant do usuário.
Função omitida herda módulo conforme PermissionMatrix; desabilitada recusa,
protegida exige a senha/grant oficial scoped. Nenhum RBAC/token novo.
Admin não dispensa tenant nem negação explícita de função.

Payload: command_id, mode GRAVA_ESTA/GRAVA_TODAS, paciente/tratamento/procedimento,
prestador opcional (default vínculo do autor), unidades targets normalizadas
com type/slots/faces. Slots são PKs estáveis, nunca FDI. Faces são exclusivamente
áreas M,D,CENTRAL,V,INTERNA, sem duplicação: I/O e P/L são labels anatômicos
da apresentação, não valores desta API. Desconhecidos recusados. Nenhum preset
é inferido de nome/bitmap; catálogo atual não possui campo comprovado de máscara.
FACE exige um slot e faces efetivas; DENTE um slot; GRUPO contíguo numa arcada;
ARCADA 16 slots; SEGMENTO subconjunto não vazio numa arcada, mantendo lacunas;
GERAL zero slots/faces (null normalizado a []), mas com paciente/tratamento.

Grava esta exige uma unidade, um comando/commit independente. Grava todas usa
um procedimento x N unidades x um comando/commit ALL_OR_NOTHING. Foundation
mantém savepoint e recibo durável. Mesmo comando/payload normalizado retorna
IDs sem repricing; modo/payload/autor divergente retorna 409; novo comando permite
repetição legítima. Resposta inclui versao_inicial=1, não versão de edição futura.

Nova ocorrência com procedimento inativo é recusada conforme foundation R1;
catálogo inativado posteriormente não invalida recibo/retry nem altera histórico.
Prestador e autor separados; nenhum requisito extra de unidade/atividade inferido.
Valores próprios são strings decimais exatas de duas casas; nenhum preço float
de catálogo é copiado. Sem materiais/fases clínicas, orçamento automático,
pagamentos, estoque ou alteração visual.

Limites fail-closed: somente criação Observada/Realizar. Realizada/conclusão exige
histórico automático de P2.B/P4 e não é exposta por esta API. Novo comando em
contexto com orçamento aprovado retorna FC4_BUDGET_REVISION_ADAPTER_REQUIRED
até adapter durável de revisão P2.B/P5; replay válido permanece possível.
Não é nova regra comercial nem autorização para editar orçamento. Funções
de projeção/leitura orçamentária ainda precisam de certificação pelo adapter;
esta rodada não homologa valores de orçamento ou financeiro.
As funções
EDIT/CORRECT/DELETE/EXECUTE/HISTORY e CAS dessas ações permanecem posteriores.
Read model/lista/renderer e presets visuais pertencem a P3; não implementados.

Nenhuma migration adicional: usa schema P2.R1 explícito. Não aplicar produção,
não atualizar checkout monitorado: bootstrap automático continua risco conhecido.
