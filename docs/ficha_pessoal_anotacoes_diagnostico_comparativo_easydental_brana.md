# Ficha pessoal - Anotacoes - Diagnostico comparativo EasyDental x Brana Cloud

## Contexto

Este documento registra um diagnostico documental e comparativo da aba `Anotacoes` da `Ficha pessoal` no Brana Cloud, confrontando o que foi encontrado no codigo atual com o que o workspace conseguiu mostrar sobre o legado EasyDental.

## Brana Cloud: estado atual encontrado

- A aba `Anotacoes` existe dentro de `frontend/app.js` como parte do shell da `Ficha pessoal`.
- O conteudo da aba e um `textarea` simples: `#ficha-anotacoes`.
- A toolbar visivel contem botoes `Negrito`, `Italico`, `Sublinhado` e `Lista`, mas os handlers atuais apenas exibem mensagens de planejamento.
- O estado da ficha salva e carregado como texto puro:
  - leitura: `item.anotacoes || ""`
  - gravacao: `anotacoes: txt(ficha.anotacoes)`
- O backend confirma o mesmo modelo textual:
  - `backend/models/paciente.py` define `anotacoes = Column(Text, nullable=True)`
  - `backend/routes/cadastros_routes.py` aplica `_clean_text(payload.anotacoes)`
- Nao foi encontrado namespace passivo dedicado para essa aba em `frontend/js/modules/`.

## EasyDental: evidencia localizada no workspace

- Nao foi localizado material de UI direta do EasyDental para a aba `Anotacoes` neste workspace.
- A evidencia encontrada e indireta e vem de scripts de migracao e mapeamento legados.
- O mapeamento encontrado aponta o campo legado `ANOTAC` para o destino `anotacoes`:
  - `backend/scripts/migrar_pacientes_gleisson.py` mapeia `ANOTAC -> anotacoes`
- Portanto, o que o workspace confirma sobre o legado e apenas que havia um campo textual de anotacoes por paciente; o comportamento visual do EasyDental nao foi comprovado aqui com fonte primaria direta.

## Comparacao objetiva

| Aspecto | Brana Cloud atual | EasyDental no workspace |
|---|---|---|
| Tipo de entrada | `textarea` simples | campo legado textual `ANOTAC` |
| Persistencia | texto puro via `Text` + `_clean_text` | campo textual mapeado na migracao |
| Toolbar | visivel, mas com acoes de planejamento | sem evidencia de UI direta localizada |
| Formato rico | nao implementado | nao confirmado pelo material encontrado |
| Namespace passivo | nao encontrado para esta aba | nao localizado |

## Diagnostico

- A aba `Anotacoes` do Brana Cloud esta estruturada como texto puro, nao como editor rico.
- A toolbar existe apenas como superficie visual/pedagogica e nao como funcionalidade consolidada.
- O legado EasyDental, neste workspace, so permitiu confirmar a existencia de um campo textual de origem.
- Com a evidencia disponivel, a comparacao mais segura e: Brana Cloud possui uma implementacao minima de anotacoes, ainda sem equivalencia funcional rica comprovada com o EasyDental.

## Risco e impacto

- Risco visual: medio.
- Risco de persistencia: medio/alto, porque qualquer tentativa de aproximar a aba ao comportamento legado pode envolver semantica de salvamento, limpeza de texto e compatibilidade de dados.
- Risco de regressao em `Ficha pessoal`: medio, porque a aba convive com dados, anamnese, historico, convenios/planos e navegacao da ficha.

## Recursos ausentes ou nao comprovados

- Nenhum UI do EasyDental para `Anotacoes` foi localizado de forma direta.
- Nenhum contrato de editor rico foi identificado no frontend atual.
- Nenhuma persistencia de formataçao rica foi confirmada no backend atual.

## Recomendacao

Se houver interesse em aproximar `Anotacoes` do comportamento esperado no EasyDental, o proximo passo recomendado e abrir um contrato especifico que inclua:

- formato visual desejado;
- semantica de salvamento;
- compatibilidade com o campo `anotacoes`;
- preservacao de texto simples como fallback;
- validacao manual antes de qualquer implementacao mais ampla.

## Onde testar depois, se houver implementacao futura

- Abrir `Ficha pessoal`.
- Entrar na aba `Anotacoes`.
- Verificar o campo de texto.
- Verificar a toolbar e os botoes visiveis.
- Confirmar salvamento e recarga da ficha, se a evolucao futura exigir persistencia nova.

## Registro para roadmap

Este diagnostico fica registrado para orientar futuras decisoes sobre a aba `Anotacoes` da `Ficha pessoal`, sem alterar codigo, banco ou migrações.
