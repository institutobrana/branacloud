# Recomendação de próximo módulo pós-Anamnese

## 1. Contexto

O mini ciclo de helpers textuais de Anamnese foi encerrado documentalmente.
A partir daqui, o objetivo passa a ser escolher o próximo módulo mais seguro para iniciar uma nova modularização conservadora.

## 2. Objetivo da modularização

O objetivo maior continua sendo reduzir progressivamente o tamanho de `frontend/app.js` e mover código para arquivos modulares próprios em `frontend/js/modules/`.

Esta é a primeira rodada conservadora:
- primeiro se cria uma base pequena e segura;
- depois se faz uma segunda rodada futura para extrair mais código dos módulos já iniciados.

## 3. Padrão usado até agora

O padrão consolidado nas modularizações anteriores foi:
- Subetapa 0 documental;
- namespace passivo;
- fronteiras e contratos;
- helpers puros;
- integração com fallback local;
- testes manuais;
- documentação em cada etapa;
- cuidado especial com tabelas dinâmicas, segundo clique rápido e `dblclick`.

## 4. Módulos já trabalhados

Os ciclos recentes já concluídos ou iniciados foram:
- Unidades
- Plano de Contas
- CID
- Medicamentos
- Auxiliares / Tabelas auxiliares
- Etiquetas
- Procedimentos Genéricos
- Anamnese

## 5. Candidatos analisados

Tabela comparativa dos candidatos ainda grandes ou relevantes no `frontend/app.js`.

| Módulo candidato | Tamanho aproximado no app.js | Fronteira clara? | Endpoints | DOM / modais | Eventos sensíveis | Dependências | Helpers puros candidatos | Risco | Recomendação |
|---|---:|---|---|---|---|---|---|---|---|
| `Prestadores` | Médio | Sim, mais contido que agenda/financeiro | `GET /cadastros/prestadores` e fluxos de apoio | painel de listagem, filtros, grade, botões de ação e subpanéis de credenciamento/comissão | clique simples e ativação de grade; uso de `bindStandardGridActivation` reduz fragilidade | usuários, convênios, agenda e futuras telas auxiliares | seleção local, formatação de código/status, filtros textuais | médio | **recomendado agora** |
| `Convênios e Planos` | Médio/alto | Sim, mas com duas grades e modais próprios | combos e CRUD de convênios/planos/calendário | duas grades, modais de convênio/plano, calendário de faturamento | histórico de duplo clique e seleção de linha | ficha do paciente, agenda e faturamento | seleção local e formatação simples de rótulos | médio/alto | segunda opção |
| `Símbolos Gráficos` | Médio | Sim, porém com editor embutido | catálogo e edição de símbolos | painel, modal, biblioteca e iframe/editor | clique em grade, biblioteca e modais | procedimentos, editor externo, imagem e preview | normalização de texto, resolução de especialidade, rótulos | médio/alto | terceira opção |
| `Materiais` | Alto | Parcial | várias rotas de listas, itens, índices e auxiliares | lista principal, filtros, modal principal e modal de tabela | muitos clicks, inputs, change, debounce e binds de modal | auxiliares, índices, numeração e cálculos | utilitários locais existem, mas o conjunto é amplo | alto | evitar por enquanto |
| `Agenda` | Alto | Parcial | agenda legado, contatos, bloqueios, horários e integrações | várias telas e modais de agenda | muitos binds, repetição, seleção de horários e integração externa | paciente, prestador, unidade, Google Calendar e WhatsApp | há utilitários, mas o fluxo é sensível | alto | evitar por enquanto |
| `Financeiro` / `Conta corrente` | Alto | Parcial | lançamentos, fluxo de caixa, índices e cenários | listas, relatórios, modais e cálculos | mutações financeiras e exclusões | dados financeiros e relatórios | há helpers, mas o fluxo é sensível | alto | evitar por enquanto |
| `Ficha pessoal / ficha clínica` | Muito alto | Parcial | combos, paciente, anamnese, vínculo com agenda e documentos | tela grande, muitos campos e subfluxos | vários eventos de formulário e integração de dados | paciente, convênios, planos, anamnese e documentos | há muitos utilitários, mas o risco é alto | alto | evitar por enquanto |
| `Editor de Textos` | Muito alto | Parcial | múltiplas rotas e ferramentas de edição | editor complexo, assistentes e modais | muitos binds e componentes auxiliares | documentos, prescrições, imagens e HTML | helpers existem, mas o editor é grande demais | alto | evitar por enquanto |
| `Procedimentos` | Muito alto | Parcial | tabelas, procedimentos, tratamentos e relatórios | telas extensas, módulos auxiliares e tabelas | muitos eventos e dependências cruzadas | materiais, símbolos, prestadores, pacientes | alguns helpers, mas o fluxo é amplo | alto | evitar por enquanto |

## 6. Riscos identificados

Os maiores riscos observados foram:
- módulos com dados clínicos sensíveis;
- módulos com financeiro;
- módulos com agenda e integrações externas;
- módulos com editores complexos;
- módulos com muitas tabelas dinâmicas;
- módulos com múltiplos modais e subfluxos;
- risco de repetir regressão de seleção, `dblclick` e rerender;
- risco de mexer cedo em respostas clínicas ou em ficha do paciente.

## 7. Próximo módulo recomendado

**Recomendação principal: `Prestadores`**

### Por que ele foi escolhido

- O bloco de `Prestadores` em `frontend/app.js` é menor que `Agenda`, `Financeiro`, `Materiais`, `Ficha pessoal` e `Procedimentos`.
- A parte visível e mais direta do fluxo usa uma grade simples com seleção e ações.
- O `bindStandardGridActivation` já aparece no fluxo, o que ajuda a manter a mesma linha conservadora adotada nos módulos anteriores.
- O módulo tem menor risco imediato do que os módulos mais sensíveis e mais extensos.

### O que pode ser extraído primeiro

Na primeira rodada, os candidatos mais seguros tendem a ser:
- seleção e consulta da linha atual;
- formatação do código do prestador;
- filtro textual da lista;
- status visual simples;
- pequenos utilitários de normalização e rótulos.

### O que não deve ser movido cedo

- credenciamento;
- comissão;
- ligação com agenda;
- lógica de exclusão;
- qualquer fluxo que dependa de subpainéis ou mutações mais complexas;
- qualquer integração com ficha do paciente ou financeiro.

## 8. Segunda e terceira opções

**Segunda opção: `Convênios e Planos`**
- Tem fronteiras conhecidas e documentação de duplo clique já registrada.
- Porém possui duas grades, modais de convênio/plano e calendário de faturamento, então exige mais cautela que `Prestadores`.

**Terceira opção: `Símbolos Gráficos`**
- Possui helpers interessantes de normalização e resolução de rótulos.
- Mas o editor embutido e o fluxo de imagem/preview aumentam o risco.

## 9. Módulos a evitar por enquanto

Evitar nesta rodada:
- `Agenda`
- `Financeiro` / `Conta corrente`
- `Materiais`
- `Ficha pessoal / ficha clínica`
- `Editor de Textos`
- `Procedimentos`

Justificativa:
- têm maior superfície funcional;
- dependem de vários módulos/fluxos;
- usam muitos modais e eventos;
- possuem maior chance de regressão em dados críticos ou sensíveis.

## 10. Proposta de Subetapa 0 do próximo módulo

O próximo prompt recomendado para `Prestadores` deve começar com uma Subetapa 0 documental:

- mapear o bloco monolítico de `Prestadores` em `frontend/app.js`;
- identificar a função principal de abertura;
- identificar funções relacionadas;
- mapear estado/cache;
- mapear DOM;
- mapear eventos/binds;
- mapear endpoints/API;
- mapear dependências compartilhadas;
- mapear helpers puros candidatos;
- registrar o que não deve ser movido nas próximas subetapas;
- indicar onde testar antes de avançar.

## 11. Confirmação final

Confirmo que:
- nenhum código funcional foi alterado nesta auditoria;
- `frontend/app.js` não foi alterado;
- `frontend/index.html` não foi alterado;
- backend não foi alterado;
- banco não foi alterado;
- endpoints não foram alterados.

## 12. Checks executados

Checks permitidos e revisados nesta auditoria:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`

## 13. Onde testar antes de avançar

Se a recomendação for aceita, o próximo ciclo deve começar com:
1. `Ctrl+F5`.
2. Abrir o painel de `Prestadores`.
3. Confirmar carregamento da lista.
4. Selecionar um prestador.
5. Testar a ação de alteração/edição planejada.
6. Testar os botões de ação sem salvar nada no primeiro teste.
7. Confirmar console sem `ReferenceError` ou `TypeError`.
