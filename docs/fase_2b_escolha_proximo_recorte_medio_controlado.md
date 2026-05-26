# Fase 2B - Escolha controlada do proximo recorte medio

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Commit de implementacao validado: `593a5b63669ad00d80609c2210e83bcc7dd88b89`
- Commit documental de validacao pos-teste: `5bf60619e29124a9e229b1454407100ac28ce0b1`
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
  - `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
  - `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
  - `docs/11_roadmap_desenvolvimento.md`

## 1. Contexto da escolha

- O primeiro recorte medio controlado da Fase 2B foi validado com sucesso em `Preferencias / Configuracoes remanescentes`.
- O teste manual foi aprovado pelo usuario.
- A proxima escolha precisa ser documental e comparativa porque o sucesso de um recorte nao autoriza ampliar risco automaticamente.
- A Fase 2B continua limitada a recortes medios controlados no frontend, sem backend, sem banco, sem endpoints, sem permissões, sem payload efetivo e sem salvamento.
- A blindagem textual/mojibake continua obrigatoria.

## 2. Criterios de decisao

- Menor contato com backend.
- Menor contato com payload.
- Menor contato com salvamento.
- Menor contato com permissoes.
- Menor risco textual/mojibake.
- Teste manual claro.
- Rollback mental simples.
- Ganho real de organizacao do `app.js`.
- Possibilidade de recorte pequeno dentro de um bloco medio controlado.

## 3. Matriz comparativa dos candidatos

| Candidato | Classificacao provavel | Modulo em `frontend/js/modules` | DOM / eventos / modal | requestJson / payload / salvamento / backend / permissoes | Risco textual/mojibake | Risco funcional | Ganho de organizacao no `app.js` | Teste manual claro | Rollback mental simples | Adequado para a proxima implementacao? | Precisa de contrato profundo antes? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Preferencias remanescentes | Comum/core | Sim, `preferencias-opcoes-sistema.js` | Alto / alto / sim | Sim / sim / sim / sim / sim | Medio | Medio | Alto | Sim | Sim | **Sim, como melhor opcao ativa** | Sim |
| Prestadores remanescentes | Comum/core administrativo/transversal | Sim, `prestadores.js` | Alto / alto / sim | Sim / sim / sim / sim / sim, com permissao `prestadores` e conexoes com agenda, convenios e usuarios | Baixo a medio | Medio | Medio/alto | Sim | Sim | Possivel, mas em segundo plano | Sim |
| Medicamentos | Especifico de area profissional | Sim, `medicamentos.js` | Alto / alto / sim, com editor e tabs mais sensiveis | Sim / sim / sim / sim / sim, com editor, receita e busca/listagem backend-driven | Medio | Alto | Medio | Parcial | Sim | Nao para este proximo passo | Sim, mas com cautela maior |
| Convenios e Planos | Comum/core transversal | Sim, `convenios-planos.js` | Alto / alto / sim | Sim / sim / sim / sim / sim, com impacto em pacientes, prestadores, agenda e financeiro | Baixo a medio | Alto | Medio | Parcial | Parcial | Nao agora | Sim |
| Ficha pessoal | Comum/core de cadastro paciente | Nao identifiquei modulo dedicado claro | Alto / alto / provavel modal e abas | Provavel sim / provavel sim / provavel sim / sim / sim | Medio | Alto | Medio | Parcial | Parcial | Nao agora | Sim |
| Conta corrente | Comum/core financeiro | Nao identifiquei modulo dedicado claro | Alto / alto / provavel painel/modal | Provavel sim / provavel sim / provavel sim / sim / sim | Baixo a medio | Alto | Medio | Parcial | Parcial | Nao agora | Sim |
| Indices financeiros | Comum/core financeiro | Nao identifiquei modulo dedicado claro | Alto / alto / provavel modal/painel | Provavel sim / provavel sim / provavel sim / sim / sim, com regras financeiras | Baixo a medio | Alto | Medio | Parcial | Parcial | Nao agora | Sim |
| Agenda principal remanescente | Comum/core operacional | Nao identifiquei modulo monolitico unico; ha utilitarios de agenda | Muito alto / alto / sim | Sim / sim / sim / sim / sim, com cruzamento com agenda legado, avisos e prestadores | Medio | Alto | Medio/alto | Parcial | Parcial | Nao agora | Sim |
| Relatorios | Comum/core transversal | Nao identifiquei modulo dedicado claro | Alto / alto / provavel modal ou fluxo de exportacao | Sim / sim / sim / sim / sim, sensivel a anexos e dados | Baixo a medio | Alto | Medio | Parcial | Parcial | Nao agora | Sim |
| Materiais | Especifico de area/procedimento | Sim, `materiais.js` | Alto / alto / sim, com submodais e listas | Sim / sim / sim / sim / sim, com indices, custos e vinculos | Medio | Alto | Medio/alto | Parcial | Parcial | Nao agora | Sim |
| Procedimentos genericos | Especifico de area profissional | Sim, `intervencoes-procedimentos.js` | Alto / alto / sim, com editor e vinculos | Sim / sim / sim / sim / sim, com editor, materiais e fases | Medio | Alto | Medio/alto | Parcial | Parcial | Nao agora | Sim |

## 4. Recomendacao

- A frente recomendada para a proxima subetapa e `Preferencias remanescentes`.
- A frente continua classificada como `comum/core`.
- Ela foi escolhida porque:
  - ja tem um recorte medio controlado implementado e validado;
  - possui contrato, teste manual e rollback mental claros;
  - o modulo passivo existe e suporta a separacao visual/local;
  - o ganho de organizacao em `app.js` e real sem precisar cruzar para backend ou permissões.
- `Prestadores remanescentes` ficou em segundo plano porque, apesar de tambem ser controlavel e classificado como administrativo/transversal, ja tem sua propria trilha consolidada e traz mais conexoes com agenda, convenios e usuarios.
- Os demais candidatos ficaram em segundo plano porque o risco funcional, a dependência de payload/salvamento ou a sensibilidade textual/operacional e maior.
- A proxima subetapa recomendada e somente um novo contrato profundo dentro de `Preferencias remanescentes`, ainda sem implementacao.
- O recorte que deve ser apenas investigado, sem implementar ainda, e o proximo bloco medio controlado restante da frente de Preferencias, mantendo fora `sysOpt*`, `Odontograma`, payload efetivo e salvamento.

## 5. Limites da proxima subetapa

- A proxima subetapa deve ser apenas documental, salvo se um novo contrato justificar explicitamente uma implementacao minima posterior.
- Nao deve haver implementacao direta sem novo contrato profundo.
- Nao devem ser tocados backend, banco, endpoints, permissoes, payload efetivo ou salvamento.
- Nao devem ser corrigidos textos visiveis, acentos, labels, placeholders ou mojibake.
- `sysOpt*` e `Odontograma` permanecem fora do proximo passo, salvo contrato especifico posterior.

## 6. Registro para roadmap

- A validacao anterior do commit `593a5b63669ad00d80609c2210e83bcc7dd88b89` foi confirmada.
- O teste manual passou e a validacao pos-teste foi registrada no commit documental `5bf60619e29124a9e229b1454407100ac28ce0b1`.
- A escolha controlada do proximo recorte medio da Fase 2B foi aberta com criterios comparativos explicitos.
- A frente recomendada e `Preferencias remanescentes`.
- A proxima subetapa recomendada e um novo contrato profundo dentro de `Preferencias remanescentes`.
- Os limites ainda vigentes da Fase 2B foram mantidos.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
