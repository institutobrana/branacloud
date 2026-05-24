# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 9 - Consolidacao, pausa tecnica e recomendacao da proxima frente

## Contexto
A Fase 2 continua em evolucao com consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

O recorte historico desta frente foi suficientemente mapeado, refinado e fechado documentalmente ate o momento, mas ainda nao deve avançar para codigo agora.

## Classificacao multiarea
Classificacao confirmada: `configuracao comum`.

Nao implementar controle multiarea nesta etapa.

## Linha de commits da frente Preferencias e Opcoes do Sistema
- `7764e9b` - Documenta contrato funcional de preferencias
- `f7f9b22` - Mapeia tecnicamente preferencias e opcoes
- `db2d646` - Isola blocos candidatos de preferencias
- `a6ddf57` - Refina blocos seguros de preferencias
- `7ad78c8` - Planeja recorte de leitura de preferencias
- `8f2838a` - Fecha plano cirurgico de leitura de preferencias
- `b0870cf` - Aprova plano cirurgico de preferencias
- `5e50737` - Planeja implementacao minima de preferencias

## Decisao consolidada da frente atual
A frente `Preferencias e Opcoes do Sistema` fica pausada/consolidada neste momento.

## Motivo tecnico da pausa
Mesmo depois da Subetapa 8, o fluxo ainda esta concentrado em `frontend/app.js`, com varias abas, estados, sincronizacoes e fluxos compartilhados. O menor patch futuro continua nao seguro o bastante para liberacao funcional sem risco de escrita acidental, mistura usuario/clinica ou acoplamento com permissao e senha administrativa.

## O que fica preservado para retomada futura
- leitura isolada de preferencias de usuario sem escrita;
- mapeamento tecnico ja produzido;
- contrato funcional ja produzido;
- mapa de blocos candidatos e de risco;
- plano cirurgico minimo por linha/trecho;
- decisao de pausa tecnica sem autorizacao de codigo.

## Itens expressamente proibidos em retomada futura sem nova autorizacao
- sem PATCH;
- sem salvamento;
- sem backend;
- sem banco;
- sem endpoints;
- sem permissoes;
- sem senha administrativa;
- sem opcoes por clinica;
- sem mistura usuario/clinica;
- sem relatorios/impressos;
- sem odontograma;
- sem modelos;
- sem financeiro;
- sem seguranca;
- sem correcao textual/mojibake.

## Onde testar se a frente for retomada futuramente
`Preferencias e Opcoes do Sistema`

Validar:
- abertura da tela;
- carregamento das abas;
- carregamento das preferencias do usuario;
- carregamento das opcoes por clinica apenas para garantir que nada quebrou;
- ausencia de salvamento acidental;
- ausencia de PATCH;
- permissao `configuracao`;
- senha administrativa quando aplicavel apenas para garantir que nada foi afetado;
- relatorios;
- odontograma;
- modelos;
- impressos;
- console sem erros.

## Recomendacao da proxima frente da Fase 2
A recomendacao conservadora para continuidade da Fase 2 e `Cadastros Gerais`.

Justificativa:
- o roadmap ja indica que `cadastros_routes.py` e grande e pode ser dividido por dominio;
- ha uma oportunidade clara de primeira etapa documental focada em mapeamento de endpoints sem tocar comportamento;
- o acoplamento funcional tende a ser menor do que em `Usuarios, Perfis e Permissoes`, `Agenda`, `Financeiro` ou `Licenca, Planos e Pagamentos`;
- a frente permite uma abordagem documental e conservadora, antes de qualquer recorte funcional;
- e uma continuidade mais segura do que abrir agora uma frente que atravesse senha administrativa, fluxo financeiro ou integracoes externas.

Riscos da frente recomendada:
- `cadastros_routes.py` e grande e mistura dominios;
- ha referencias historicas a fontes legadas em alguns pontos;
- alguns caminhos usam permissoes como `procedimentos`, `financeiro` e `configuracao`;
- a separacao por dominio exige leitura tecnica cuidadosa.

## Proxima subetapa recomendada
Fase 2 - Cadastros Gerais - Subetapa 1 - Contrato funcional e classificacao multiarea

## Blindagem textual/mojibake
Respeitar integralmente:

`docs/regras_blindagem_correcoes_textuais_mojibake.md`

Nenhuma correcao textual foi feita nesta etapa.

## Checks tecnicos executados
Checks de leitura e validacao executados:

- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git log --oneline -10`

Resultado sintetico:

- os diffs de `frontend/app.js`, `frontend/index.html`, `frontend/js/modules` e `backend` permaneceram vazios;
- o roadmap recebeu apenas uma atualizacao documental;
- nenhum codigo foi alterado;
- nenhum PATCH ou salvamento foi feito;
- a blindagem textual/mojibake foi respeitada.

## Registro para roadmap
- A frente atual continua sendo `Preferencias e Opcoes do Sistema`.
- Esta Subetapa 9 foi documental.
- A frente `Preferencias e Opcoes do Sistema` fica pausada/consolidada.
- A classificacao multiarea continua sendo `configuracao comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- Nenhum PATCH ou salvamento foi feito.
- A blindagem textual/mojibake foi respeitada.
- A proxima frente recomendada e `Cadastros Gerais`.
- A proxima subetapa recomendada e `Cadastros Gerais - Subetapa 1 - Contrato funcional e classificacao multiarea`.

## Commit seletivo obrigatorio
- Somente este arquivo e `docs/11_roadmap_desenvolvimento.md` devem entrar no commit desta etapa.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar git add seletivo somente para estes arquivos.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
