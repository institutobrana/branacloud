# Recomendação do próximo módulo após Convênios e Planos

## 1. Contexto
O mini ciclo conservador de Convênios e Planos foi encerrado documentalmente e validado no navegador.

O encerramento consolidou:
- namespace passivo;
- helpers puros;
- integração mínima com fallback;
- correções pontuais validadas;
- regra de blindagem textual criada;
- ciclo versionado manualmente.

Referências principais:
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 2. Critérios de escolha do próximo módulo
A escolha do próximo módulo deve priorizar:
- menor risco de DOM e eventos;
- menor dependência de `requestJson` e endpoints;
- menor dependência de payloads sensíveis;
- fronteiras claras e previsíveis;
- baixo acoplamento com Agenda, Financeiro, Ficha Clínica, Procedimentos e Editor de Textos;
- menor risco de tabelas dinâmicas com rerender;
- menor risco de `dblclick` e segundo clique rápido;
- menor risco de modais complexos;
- menor risco de texto/mojibake;
- possibilidade de começar por Subetapa 0 documental e Subetapa 1 namespace passivo.

## 3. Candidatos avaliados
### Símbolos Gráficos
- Tem fronteira relativamente clara dentro de `frontend/app.js`.
- Normalmente concentra painel, grade/biblioteca e modal/editor.
- Possui dependência moderada de procedimentos, mas ainda é mais contido do que agenda, financeiro, ficha clínica e editor de textos.
- É um bom candidato para começar por documentação e namespace passivo, com cautela especial na parte visual.

### Materiais
- Tem fronteira identificável, mas é maior e mais espalhado.
- Envolve lista principal, filtros, modal principal, modal de tabela e vários binds.
- O risco de DOM, eventos e rerender é mais alto do que em Símbolos Gráficos.

### Índices financeiros
- Pode ter fronteira menor que Materiais, mas o acoplamento financeiro torna a rodada mais sensível.
- É um candidato possível, porém menos seguro do que Símbolos Gráficos para iniciar a próxima rodada.

### Agenda
- Muito grande e sensível.
- Alto acoplamento com paciente, prestador, unidade e integrações externas.

### Editor de Textos
- Muito grande, com múltiplas ferramentas e alto risco de comportamento colateral.

### Procedimentos
- Muito amplo, com muitas dependências cruzadas e fluxo complexo.

### Ficha pessoal / ficha clínica / paciente
- Muito alto risco por ser a área clínica central e muito integrada ao restante do sistema.

### Financeiro / Conta corrente
- Alto risco por envolver lançamentos, relatórios, exclusões e payloads sensíveis.

### Cenário financeiro
- Alto risco por estar acoplado ao ecossistema financeiro e a cálculos/resumos.

## 4. Módulos a evitar por enquanto
Classificação de alto risco nesta rodada:
- Agenda;
- Financeiro / Conta corrente;
- Ficha pessoal / ficha clínica / paciente;
- Editor de Textos;
- Procedimentos;
- Cenário financeiro;
- qualquer módulo com muito DOM, eventos, `requestJson`, payloads sensíveis, modais complexos ou consumidores externos.

## 5. Recomendação principal
**Recomendação principal: `Símbolos Gráficos`**

Motivo curto:
- é o próximo módulo com fronteira mais clara e risco menor do que Agenda, Financeiro, Ficha Clínica, Editor de Textos e Procedimentos;
- permite manter o mesmo padrão conservador já consolidado;
- tem chance real de começar com Subetapa 0 documental e Subetapa 1 namespace passivo sem tocar em fluxo sensível.

## 6. Candidatos secundários
### Materiais
- Segunda opção se houver necessidade de avançar com um módulo mais amplo, mas ainda viável.
- Justificativa: fronteira conhecida, porém com risco mais alto de DOM, eventos e rerender.

### Índices financeiros
- Terceira opção.
- Justificativa: pode ser mais contido, mas o acoplamento financeiro aumenta o cuidado necessário.

### Procedimentos
- Apenas como referência documental, não como recomendação prática imediata.
- Justificativa: apesar de conhecido, o risco funcional e o acoplamento são altos demais para a próxima rodada.

## 7. Módulos descartados por risco nesta rodada
Descartados por risco elevado:
- Agenda;
- Financeiro / Conta corrente;
- Ficha pessoal / ficha clínica / paciente;
- Editor de Textos;
- Procedimentos;
- Cenário financeiro.

Motivo geral:
- acoplamento elevado;
- muitas dependências cruzadas;
- maior chance de regressão em eventos, modais, payloads e consumidores externos.

## 8. Estratégia recomendada para o próximo módulo
O próximo ciclo deve seguir o mesmo padrão conservador:
- Subetapa 0 documental;
- Subetapa 1 namespace passivo;
- Subetapa 2 fronteiras e contratos;
- Subetapa 3 helpers puros somente se forem realmente seguros;
- Subetapa 4 integração com fallback somente se houver equivalência clara;
- Subetapa 5 encerramento documental;
- Git manual apenas após testes e encerramento.

## 9. Regra especial
Qualquer correção textual, acentuação, mojibake, label, título, botão, ícone ou símbolo deve seguir obrigatoriamente:
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 10. Próximo prompt sugerido
**“Subetapa 0 documental do módulo Símbolos Gráficos”**

Sem executar essa etapa agora.

## 11. Confirmações finais
- Esta é uma recomendação documental, não uma execução de modularização.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- Backend, banco e endpoints não foram alterados.
- Nada foi salvo em:
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
