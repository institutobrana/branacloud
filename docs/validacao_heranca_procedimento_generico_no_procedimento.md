# Validacao da heranca do Procedimento generico no Procedimento

Data: 2026-07-14

Status: relato histórico **SUPERSEDED** pelo [contrato canônico](contrato_edicao_procedimentos_roundtrip.md) para herança/defaults cadastrais, aplicação em todo save e Mostrar símbolo. As conclusões abaixo registram o estado observado na data, não autorização para reativar o comportamento antigo.

Nota R1.R2: o relato abaixo é histórico. O [contrato definitivo](contrato_edicao_procedimentos_roundtrip.md) revoga herança/defaults e sincronização de TODOS os campos cadastrais, inclusive tempo/laboratório. Genérico governa somente materiais por união dinâmica e fases por substituição na associação/troca; save comum e desvinculação preservam fases. Fases próprias são evolução futura, sem migration nesta rodada.

## Conclusao

A heranca funcional do Procedimento generico nao e duplicada no React atual.

O fluxo observado foi:

- o React envia `procedimento_generico_id` no payload;
- o backend aplica a heranca ao salvar;
- a reabertura vem do GET de detalhe e das composicoes de materiais/fases;
- o dashboard usa os custos efetivos persistidos e os materiais vinculados;
- `valor_repasse` nao participa do dashboard financeiro.

## Campos auditados

- Especialidade
- Simbolo grafico
- Tempo de execucao
- Custo de laboratorio
- Observacoes
- Fases
- Materiais

## Regra vigente — R1.R2

- todos os campos cadastrais são locais, preenchidos ou vazios; não recebem defaults do Genérico e não propagam a ele/associados;
- materiais herdados são compostos no backend e deduplicados por `material_id`, com prioridade/quantidade próprias;
- fases são materializadas na associação/troca, não deduplicadas por material_id; desvinculação preserva todas as fases existentes;
- ao remover o vínculo, materiais herdados deixam a composição sem apagar valores locais/materializados/próprios; não existe sincronização cadastral ativa.

## Evidencia tecnica

- Procedimento tecnico usado: `66927`
- Codigo: `44`
- Nome: `TESTE CONTROLADO PROCEDIMENTO REACT`
- Backend: `backend/routes/procedimentos_routes.py`
- Servico de materiais: `backend/services/vinculos_materiais.py`

## Resultado prático

Nenhuma correcao adicional foi necessaria nesta etapa.
