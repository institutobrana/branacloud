# Fase 2B - Nova matriz comparativa apos pausa de Preferencias

## 1. Identificacao da etapa

- Fase 2B.
- Nova matriz comparativa.
- Pos-consolidacao parcial de `Preferencias`.
- Etapa exclusivamente documental.

## 2. Auditoria leve inicial

- Branch atual: `modularizacao-segura-fase-1`.
- Status resumido: ha untracked antigos em `docs/` fora do escopo desta etapa; nao ha alteracao de codigo nesta auditoria.
- HEAD atual: `68334a57c850460a829b1e3f0abe68da9e1ea6a5`.
- Ultimos commits relevantes:
  - `68334a5` - consolidacao parcial de Preferencias apos dois recortes validados.
  - `e4c51a4` - criacao do documento de consolidacao parcial.
  - `4d7d0e6` - validacao dos combos de Preferencias.
  - `05e54e6` - implementacao minima dos combos de Preferencias.
  - `37bafa0` - segundo contrato profundo de Preferencias.
- Confirmacao sobre `68334a5` e `e4c51a4`:
  - os dois aparecem no historico recente;
  - os hashes completos correspondentes sao `68334a57c850460a829b1e3f0abe68da9e1ea6a5` e `e4c51a45b462cf6699e38a894694c02ecad6f615`.
- Confirmacao desta auditoria: nao houve alteracao de arquivos; esta etapa ficou apenas em leitura e analise.

## 3. Motivo da nova matriz

- `Preferencias` ja passou por dois recortes medios controlados validados com sucesso.
- A consolidacao parcial documentou que o modulo ja teve ganho real, mas tambem que a continuacao imediata pode aumentar o risco de encostar em `prefEnsureUI()` amplo, `sysOpt*`, `Odontograma`, `requestJson`, payload ou salvamento.
- A proxima decisao precisa comparar novamente as frentes da Fase 2B para evitar ampliacao automatica de escopo.
- Nesta etapa nao deve haver implementacao direta.

## 4. Criterios de decisao

- menor contato com backend;
- menor contato com `requestJson`;
- menor contato com payload;
- menor contato com salvamento;
- menor contato com permissoes;
- menor risco textual/mojibake;
- teste manual claro;
- rollback mental simples;
- ganho real de organizacao do `app.js`;
- possibilidade de contrato profundo objetivo;
- possibilidade de recorte medio pequeno.

## 5. Matriz comparativa

| Candidato | Classificacao | Modulo em `frontend/js/modules` | Tamanho provavel em `app.js` | DOM | Eventos | Modal | `requestJson` | Payload | Salvamento | Backend / endpoints | Permissoes | Risco textual/mojibake | Risco funcional | Ganho esperado | Teste manual | Rollback mental | Contrato profundo | Implementacao futura | Evitar por enquanto |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Prestadores remanescentes | Especifica de area, mas ainda potencialmente controlavel | Possivel apoio parcial, a confirmar por leitura | Medio | Alto | Alto | Possivel | Sim, provavel | Sim, provavel | Sim, provavel | Provavel | Provavel | Medio | Medio-alto | Bom se focar em visual/local | Claro, se recorte for local | Simples se ficar em delegacao visual | Sim | Sim, com cautela | Nao, se tocar cadastro/salvamento |
| Medicamentos | Especifica de area com alto acoplamento historico | Pode existir apoio, mas nao garante isolamento | Alto | Alto | Alto | Possivel | Alto | Alto | Alto | Alto | Alto | Medio | Alto | Alto, mas arriscado | Mais dificil por fluxo rico | Mediano | Sim, mas muito restritivo | Apenas partes visuais/localizadas | Sim, por enquanto |
| Convenios e Planos | Especifica de area com impacto cruzado | Nao confirmado | Alto | Alto | Alto | Possivel | Alto | Alto | Alto | Alto | Alto | Medio | Alto | Alto | Medio | Mediano | Sim, mas com contrato forte | So se o contrato for muito restrito | Sim, por enquanto |
| Ficha pessoal | Especifica, com dados sensiveis de paciente | Nao confirmado | Medio-alto | Alto | Alto | Possivel | Medio-alto | Medio-alto | Medio-alto | Medio-alto | Medio-alto | Baixo-medio | Medio-alto | Medio | Medio | Mediano | Sim | So se recorte for bem pequeno | Sim, por enquanto |
| Conta corrente | Especifica com forte sensibilidade financeira | Nao confirmado | Medio-alto | Medio | Medio | Possivel | Medio-alto | Medio-alto | Alto | Medio-alto | Medio-alto | Baixo | Alto | Medio | Medio | Mediano | Sim, mas risco elevado | Evitar por enquanto | Sim |
| Indices financeiros | Especifica, financeiro | Nao confirmado | Medio-alto | Medio | Medio | Possivel | Medio-alto | Medio-alto | Alto | Medio-alto | Medio-alto | Baixo | Alto | Medio | Medio | Mediano | Sim, mas risco elevado | Evitar por enquanto | Sim |
| Agenda principal remanescente | Especifica, operacional e com impacto amplo | Nao confirmado | Alto | Alto | Alto | Possivel | Alto | Alto | Alto | Alto | Alto | Medio | Alto | Alto | Medio | Mediano | Sim, mas complexo | Evitar por enquanto | Sim |
| Relatorios | Especifica, alto risco | Nao confirmado | Alto | Alto | Alto | Possivel | Alto | Alto | Alto | Alto | Alto | Medio | Alto | Alto | Medio | Mediano | Sim, mas muito restrito | Evitar por enquanto | Sim |
| Materiais | Especifica, alto risco | Nao confirmado | Medio-alto | Alto | Alto | Possivel | Medio-alto | Medio-alto | Alto | Alto | Alto | Medio | Alto | Medio | Medio | Mediano | Sim, mas arriscado | Evitar por enquanto | Sim |
| Procedimentos genericos | Especifica, alto risco | Nao confirmado | Medio-alto | Alto | Alto | Possivel | Medio-alto | Medio-alto | Alto | Alto | Alto | Medio | Alto | Medio | Medio | Mediano | Sim, mas arriscado | Evitar por enquanto | Sim |
| Retomar Preferencias | Comum/core | Sim, ja existe modulo passivo | Medio, mas com limites mais estreitos | Alto | Alto | Sim | Sim, mas proibido para proximo passo | Sim, mas proibido para proximo passo | Sim, mas proibido para proximo passo | Sim, mas fora de escopo | Sim, mas fora de escopo | Baixo para visual/local, alto para areas remanescentes | Medio | Ainda ha ganho, mas menor | Claro, se ficar visual/local | Simples para recortes visuais, nao para areas sensiveis | Sim, mas com novo contrato e escopo muito restrito | Sim, apenas como comparacao pausing | Evitar por enquanto como proximo passo imediato |

## 6. Ranking de seguranca

### Mais adequados para proximo contrato profundo

- `Prestadores remanescentes`, desde que o contrato fique restrito a recorte visual/local e nao toque salvamento ou backend.
- `Retomar Preferencias`, apenas como comparacao, mas com recomendacao inicial de pausa.

### Possiveis, mas exigem cautela

- `Ficha pessoal`.
- `Conta corrente`.
- `Indices financeiros`.

### Devem ser evitados por enquanto

- `Medicamentos`.
- `Convenios e Planos`.
- `Agenda principal remanescente`.
- `Materiais`.
- `Procedimentos genericos`.

### Devem ficar para Fase 3 ou etapa estrutural

- `Relatorios`.

## 7. Recomendacao de proxima frente

- Frente recomendada: `Prestadores remanescentes`.
- Classificacao: frente especifica de area profissional, com potencial controlavel, mas sem o perfil comum/core de `Preferencias`.
- Motivo da escolha: depois da pausa de `Preferencias`, `Prestadores` oferece um caminho mais provavel de recorte medio controlado sem depender imediatamente de `sysOpt*`, `Odontograma` ou do fluxo ja consolidado de Preferencias; ainda assim precisa de contrato profundo antes de qualquer implementacao.
- Por que `Preferencias` deve ficar pausada: o modulo ja teve dois recortes validados e a proximidade com areas sensiveis ficou maior; continuar agora pode aumentar o risco desnecessariamente.
- Por que os demais ficaram em segundo plano: `Medicamentos`, `Convenios e Planos`, `Agenda`, `Relatorios`, `Materiais` e `Procedimentos` concentram maior acoplamento funcional; `Conta corrente` e `Indices financeiros` carregam sensibilidade financeira; `Ficha pessoal` possui sensibilidade de cadastro/paciente.
- Proxima subetapa: novo contrato profundo em `Prestadores remanescentes`.
- O que deve ser apenas investigado, sem implementar ainda: mapa de funcoes, DOM, eventos, `requestJson`, payload, salvamento, backend, permissoes e teste manual de `Prestadores`.

## 8. Limites da proxima subetapa

- Nao implementar nada diretamente.
- Criar contrato profundo antes de qualquer recorte medio.
- Mapear funcoes, DOM, eventos, `requestJson`, payload, salvamento, backend, permissoes e teste.
- Recomendar no maximo um recorte medio futuro.
- Manter blindagem textual/mojibake.

## 9. Registro para roadmap

- A consolidacao de `Preferencias` ja foi registrada e permanece concluida.
- Esta etapa abre uma nova matriz comparativa para a Fase 2B apos a pausa de `Preferencias`.
- Os criterios adotados ficaram documentados para priorizacao segura.
- A frente recomendada e `Prestadores remanescentes`.
- A proxima subetapa recomendada e somente contrato profundo, sem implementacao.
- Os limites da Fase 2B permanecem vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, `sysOpt*`, `Odontograma` e sem correcao textual/mojibake.
- Nenhuma implementacao foi feita.
- A blindagem textual/mojibake foi respeitada.
