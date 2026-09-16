# Validacao da heranca do Procedimento generico no Procedimento

Data: 2026-07-14

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

## Regra confirmada

- prioridade local sobre o generico quando o campo local ja esta preenchido;
- heranca ocorre quando o campo local esta vazio;
- materiais e fases herdados sao compostos no backend e deduplicados por `material_id`;
- ao remover o vinculo, a composicao deixa de usar o generico.

## Evidencia tecnica

- Procedimento tecnico usado: `66927`
- Codigo: `44`
- Nome: `TESTE CONTROLADO PROCEDIMENTO REACT`
- Backend: `backend/routes/procedimentos_routes.py`
- Servico de materiais: `backend/services/vinculos_materiais.py`

## Resultado prático

Nenhuma correcao adicional foi necessaria nesta etapa.
