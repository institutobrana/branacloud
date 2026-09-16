# Contrato tecnico formal - Toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Modulo: Shell principal / toolbar global

Referencia funcional externa: toolbar principal do EasyDental observada em `Y:\EDS70`.

Natureza deste documento: contrato tecnico documental e plano de transicao segura.

Status: documental apenas.

## 2. Objetivo

Formalizar, em nivel tecnico e documental, a substituicao segura da toolbar atual do Brana Cloude por uma nova toolbar baseada nos assets ja existentes no projeto, com comportamento semelhante ao legado EasyDental, sem quebrar fluxos sensiveis nem regredir o sistema.

Este documento nao implementa nada.

Este documento nao autoriza remocao imediata de codigo.

Este documento serve para:

- definir escopo e limites da troca;
- registrar dependencias e riscos;
- orientar uma execucao em etapas pequenas;
- preservar rollback simples;
- permitir validacao incremental antes de qualquer limpeza de codigo morto.

## 3. Premissas

1. O codigo atual e a fonte da verdade do Brana Cloude.
2. A documentacao oficial fica em `docs/`.
3. Nenhuma alteracao estrutural deve ser feita sem contrato previo.
4. A toolbar atual nao pode ser removida antes da nova toolbar estar funcional e validada.
5. Nao deve haver mistura de escopo com outras telas ou modulos.
6. A substituicao deve usar assets ja existentes no repositorio, preferencialmente em `assets/easy/`.
7. O objetivo e reproduzir a intencao funcional e visual da toolbar do Easy, nao importar o binario nem copiar logica proprietaria.

## 4. Fonte documental usada

### 4.1 Brana Cloude

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `frontend/js/modules/tela-principal-odontologica-assets.js`

### 4.2 EasyDental

- `Y:\EDS70\EDS70.exe`
- `Y:\EDS70\Icones\cmd_*.bmp`
- referencias visuais e estruturais da toolbar principal observadas durante a investigacao local

## 5. Escopo

O escopo deste contrato cobre:

- a toolbar global da tela principal do Brana Cloude;
- os botoes de acesso rapido exibidos no topo do sistema;
- os icones equivalentes ja existentes no repositorio;
- o comportamento de abrir modulos, areas ou telas associadas aos botoes;
- a manutencao do estado atual do usuario e do paciente em uso;
- a remocao posterior de codigo morto apenas apos validacao da nova estrutura;
- a documentacao de rollback, testes e criterios de aceite.

## 6. Fora de escopo

Ficam fora deste contrato:

- qualquer alteracao de backend sem necessidade direta da toolbar;
- qualquer migracao de banco;
- qualquer refatoracao ampla de `frontend/app.js` fora do ponto da toolbar;
- qualquer alteracao em login, JWT, permissao, tenant ou licenca;
- qualquer alteracao em tratamento, odontograma, conta corrente ou agenda que nao seja causada diretamente pela ativacao da toolbar;
- qualquer remocao de codigo antes da validacao da nova toolbar;
- qualquer importacao de binarios ou assets externos nao existentes no repositorio;
- qualquer troca de identidade visual que exija redesenho do produto inteiro.

## 7. Estado atual do Brana Cloude

### 7.1 O que ja existe

- uma toolbar atual no topo do sistema, montada em `frontend/index.html`;
- uma interface principal com menus e workspace central;
- assets prontos em `assets/` e `assets/easy/`;
- modulos auxiliares ja existentes para paciente em uso, novo tratamento, odontograma e preferencias;
- pontos de integracao para abrir telas e modais a partir da UI principal.

### 7.2 O que ainda nao existe como implementacao final

- uma toolbar global reconstruida com mapeamento completo dos icones do Easy;
- uma separacao formal entre "toolbar nova" e "toolbar antiga" com switch seguro;
- um inventario definitivo de cada botao com acao, dependencias e fallback;
- um criterio de remocao de codigo morto apos validacao;
- um pacote documental de rollback e criterios de aceite especificos para a toolbar.

## 8. Objetivo tecnico da nova toolbar

A nova toolbar deve:

- usar os icones ja disponiveis no repositorio, especialmente os equivalentes aos do Easy;
- manter os comandos principais do shell visiveis e acessiveis;
- preservar o fluxo do paciente em uso;
- preservar a abertura de Novo tratamento;
- preservar os acessos rapidos que ja existem no Brana Cloud;
- nao introduzir dependencias desnecessarias;
- nao afetar areas sensiveis como auth, tenant ou persistencia;
- permitir substituicao por etapas sem downtime local.

Regra de equivalencia funcional:

- alguns botoes da toolbar servirao apenas como placeholders visuais nesta fase;
- nesses casos, o icone pode existir no layout sem que a acao associada esteja funcional de ponta a ponta;
- o fato de o botao existir nao implica que o modulo equivalente ja esteja concluido no Brana Cloude;
- toda excecao desse tipo deve permanecer documentada na matriz de botoes alvo.

A matriz oficial fechada da toolbar contem 20 botoes e deve ser consultada em `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md` antes de qualquer alteracao de frontend.

## 9. Inventario funcional preliminar da toolbar

### 9.1 Grupo de comandos de acesso rapido

A toolbar nova deve contemplar, no minimo, os seguintes tipos de acao:

- novo paciente;
- menu de pacientes;
- novo tratamento;
- agenda;
- financeiro/conta corrente;
- backup;
- ajuda;
- preferencias;
- historico;
- anamnese;
- odontograma;
- orcamento;
- outras acoes equivalentes que o shell atual ja expõe ou que sejam confirmadas como parte do conjunto de 20 botoes.

### 9.2 Regras de exibicao

- cada botao deve ter icone, titulo e acao bem definidos;
- botao sem acao segura nao deve entrar na primeira fase;
- botao com dependencia sensivel deve ter fallback documentado;
- botao que apenas abre modulo existente deve continuar fazendo isso sem alterar a regra do modulo;
- a toolbar nao deve duplicar comandos fora do shell principal.

### 9.3 Regras de estado

- se houver paciente ativo, os comandos que dependem desse contexto devem usar o estado atual;
- se nao houver paciente ativo, a toolbar nao deve forcar um estado falso;
- botoes que dependem de permissao devem respeitar o contexto atual do usuario;
- botoes administrativos podem permanecer ocultos ou condicionais quando for a regra atual do produto.

## 10. Mapeamento de icones

### 10.1 Diretriz

O conjunto de icones deve ser buscado dentro do proprio Brana Cloud, com prioridade para:

- `assets/easy/`
- `assets/`
- subpastas ja existentes com equivalentes visuais

### 10.2 Criterios de escolha

1. Preferir assets com nome equivalente ao legado.
2. Preferir bitmap ou imagem ja usada em telas similares.
3. Evitar criar novos assets enquanto existir equivalencia visual pronta.
4. Evitar reusar asset com semantica duvidosa.
5. Se houver mais de um asset possivel, registrar a escolha antes da implementacao.

## 11. Dependencias confirmadas

- autenticacao do usuario;
- estado do usuario logado;
- paciente em uso quando necessario;
- modulos ja existentes no frontend;
- assets visuais locais;
- menu principal da aplicacao;
- regras de permissao ja vigentes;
- fluxo de abertura de Novo tratamento;
- fluxo de exibicao do paciente em uso;
- areas operacionais como agenda, financeiro, odontograma, anamnese, historico e preferencias.

## 12. Dependencias de validacao

Antes de remover qualquer trecho da toolbar atual, a nova toolbar deve ser validada em:

- abertura da aplicacao;
- troca de modulo pela toolbar;
- abertura de Novo tratamento;
- manutencao do paciente em uso;
- retorno ao workspace vazio;
- saida do sistema;
- comportamento responsivo minimo;
- ausencia de erro no console;
- ausencia de regressao visual evidente.

## 13. Plano de execucao segura

### Etapa 1 - inventario

- mapear todos os botoes atuais;
- mapear todos os assets existentes;
- mapear quais botoes podem ser reproduzidos fielmente;
- mapear quais botoes exigem dependencia adicional;
- mapear quais botoes podem ser adiados.

### Etapa 2 - contrato de interface

- registrar a lista definitiva de botoes da toolbar nova;
- definir ordem, rotulo, icone e acao;
- definir quais botoes entram na primeira onda;
- definir quais botoes ficam para uma segunda onda.

### Etapa 3 - implementacao isolada

- criar a nova toolbar como componente isolado;
- preservar a toolbar antiga como fallback desativavel;
- conectar apenas os botoes essenciais;
- evitar limpeza agressiva nesta fase.

### Etapa 4 - validacao

- testar fluxos principais;
- testar comportamento com e sem paciente em uso;
- testar em tela aberta e tela vazia;
- testar permissao e logout;
- testar console do navegador.

### Etapa 5 - remocao controlada

- remover a toolbar antiga somente apos aprovacao;
- remover codigo morto apenas depois da validacao;
- registrar o que foi removido;
- manter rollback por commit.

## 14. Estrategia de rollback

O rollback deve ser possivel em qualquer ponto do processo por meio de:

- commits pequenos e separados;
- preservacao temporaria da toolbar antiga;
- inexistencia de alteracao destrutiva no mesmo passo da troca visual;
- documentacao do estado anterior e do estado novo;
- possibilidade de reverter apenas o componente da toolbar sem afetar o resto do frontend.

## 15. Criterios de aceite

A troca da toolbar so pode ser considerada aceita quando:

- a nova toolbar abrir no lugar da antiga;
- os botoes principais funcionarem;
- os assets corretos estiverem sendo usados;
- Novo tratamento continuar abrindo como esperado;
- paciente em uso continuar preservado;
- nao houver erro de console relevante;
- a toolbar antiga puder ser removida com seguranca;
- a documentacao de impacto e rollback estiver atualizada.

## 16. Riscos remanescentes

- `frontend/app.js` e monolitico e pode esconder dependencias indiretas;
- alguns botoes podem abrir modulos com comportamento legado sensivel;
- a lista final de 20 botoes pode exigir confirmacao fina de equivalencia;
- o layout pode precisar de ajuste visual apos troca dos assets;
- a remocao precoce de codigo morto pode gerar regressao dificil de rastrear;
- a toolbar pode depender de estados globais nao obvios em certos fluxos.

## 17. Entregaveis esperados da implementacao futura

Quando este contrato for executado, a entrega devera incluir:

- inventario final da toolbar atual;
- mapa de equivalencia entre botao e asset;
- componente da nova toolbar;
- registro de testes manuais;
- lista do que foi removido;
- lista do que ficou como fallback;
- commit(s) separados por etapa;
- documentacao atualizada no indice oficial.

## 18. Conclusao

Este contrato fixa a regra principal: a toolbar atual do Brana Cloude pode ser substituida, mas somente por etapas seguras, com inventario, validacao e rollback preservado.

Nenhuma remocao de codigo morto deve ocorrer antes da estabilidade da nova toolbar.

Nenhuma alteracao deve ampliar escopo para outras areas do sistema sem novo contrato.
