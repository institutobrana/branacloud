# Inventario tecnico - Toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Referencia externa: toolbar principal do EasyDental observada em `Y:\EDS70`.

Natureza deste documento: inventario tecnico documental.

Status: documental apenas.

## 2. Objetivo

Registrar o estado atual da toolbar principal do Brana Cloude, mapear os comandos existentes, apontar os assets ja disponiveis e estruturar a base para a substituicao segura pela nova toolbar.

Este documento nao implementa nada.

Este documento nao remove nada.

Este documento serve como base para:

- substituicao da toolbar atual;
- remocao controlada de codigo morto;
- definicao de faseamento;
- validacao manual;
- rollback simples.

## 3. Fonte da verdade

- O codigo atual do Brana Cloude e a fonte da verdade operacional.
- A documentacao oficial fica em `docs/`.
- A referencia do EasyDental serve como orientacao funcional e visual, nao como copia binaria.

## 4. Estado atual da toolbar do Brana Cloude

A toolbar atual esta montada no topo da interface principal em `frontend/index.html`.

Os botoes visiveis hoje sao, no minimo:

- Cenário anual
- Tabela de materiais
- Procedimentos / tabela de preços
- Conta corrente
- Dashboard

A area direita exibe:

- dados do usuario logado;
- botao administrativo quando habilitado;
- botao de sair.

## 5. Acoes atualmente ligadas ao shell principal

O shell principal do Brana Cloude ja possui comandos e menus correlatos que, na pratica, representam parte da mesma experiencia de toolbar ampliada:

- novo paciente;
- abre paciente;
- fecha paciente;
- ficha pessoal;
- ficha rapida;
- ficha de anamnese;
- ficha de historico;
- novo tratamento;
- orcamento;
- imprime tratamento;
- conta corrente do paciente;
- conta corrente do cirurgiao;
- preferencias;
- opcoes do sistema;
- agenda;
- modulos administrativos e de configuracao.

Esses comandos nao estao todos em botoes da toolbar atual, mas compoem a carteira funcional que precisa ser considerada no inventario final.

## 6. Assets locais disponiveis

### 6.1 Assets genericos ja existentes

Em `assets/` existem imagens prontas como:

- `novo.png`
- `editar.png`
- `eliminar.png`
- `gravar.png`
- `cancela.png`
- `ok.png`
- `backup.png`
- `dashboard.png`
- `config.png`
- `configuracoes.png`
- `imprimir.png`
- `imprime.png`
- `pasta.png`
- `procedimentos.png`
- `relatorio.png`
- `restaura.png`
- `restaurar.png`
- `sair.png`
- `tabela.png`
- `CC.png`
- `chave.png`
- `calculadora.png`
- `whatsapp.png`

### 6.2 Assets EasyDental ja espelhados no projeto

Em `assets/easy/` existem diversos equivalentes diretos do EasyDental, incluindo:

- `cmd_novopac.bmp`
- `cmd_menupac.bmp`
- `cmd_novotra.bmp`
- `cmd_agepes.bmp`
- `cmd_imprime.bmp`
- `cmd_backup.bmp`
- `cmd_help.bmp`
- `cmd_preferencias.bmp`
- `cmd_historico.bmp`
- `cmd_anamnese.bmp`
- `cmd_odontograma.bmp`
- `cmd_orcamento.bmp`
- `cmd_ccpac.bmp`
- `cmd_cccir.bmp`
- `cmd_cnfindice.bmp`
- `cmd_config.bmp`
- `cmd_cancela.bmp`
- `cmd_ok.bmp`
- `cmd_tela.bmp`
- `cmd_insere.bmp`
- `cmd_remove.bmp`
- `cmd_copia.bmp`
- `cmd_filtra.bmp`
- `cmd_procura.bmp`
- `cmd_detalhes.bmp`
- `cmd_rapido.bmp`

## 7. Mapeamento preliminar de equivalencia

### 7.1 Comandos confirmados com alta confianca

| Funcao alvo | Asset candidato |
|---|---|
| Novo paciente | `cmd_novopac.bmp` |
| Menu de pacientes | `cmd_menupac.bmp` |
| Novo tratamento | `cmd_novotra.bmp` |
| Agenda | `cmd_agepes.bmp` |
| Imprimir / relatorio rapido | `cmd_imprime.bmp` |
| Backup | `cmd_backup.bmp` |
| Ajuda | `cmd_help.bmp` |
| Preferencias | `cmd_preferencias.bmp` |
| Historico | `cmd_historico.bmp` |
| Anamnese | `cmd_anamnese.bmp` |
| Odontograma | `cmd_odontograma.bmp` |
| Orcamento | `cmd_orcamento.bmp` |
| Conta corrente do paciente | `cmd_ccpac.bmp` |
| Conta corrente do cirurgiao | `cmd_cccir.bmp` |
| Indices financeiros | `cmd_cnfindice.bmp` |
| Configuracoes | `cmd_config.bmp` |
| Ok | `cmd_ok.bmp` |
| Cancela | `cmd_cancela.bmp` |

### 7.2 Comandos provaveis, mas que pedem confirmacao fina

| Funcao possivel | Asset candidato | Observacao |
|---|---|---|
| Tela / exibir painel | `cmd_tela.bmp` | semantica precisa confirmar |
| Inserir | `cmd_insere.bmp` | pode servir para novo registro |
| Remover | `cmd_remove.bmp` / `cmd_lixo.bmp` | semantica de exclusao precisa confirmar |
| Copiar | `cmd_copia.bmp` | depende da acao pretendida |
| Filtrar | `cmd_filtra.bmp` / `cmd_filtra2.bmp` | depende do contexto da tela |
| Procurar | `cmd_procura.bmp` | depende do fluxo de busca |
| Detalhes | `cmd_detalhes.bmp` / `cmd_detalhes2.bmp` | depende do modulo |
| Rapido | `cmd_rapido.bmp` | semantica precisa confirmar |

### 7.3 Comandos ainda nao alocados

O inventario do EasyDental mostrou ainda assets e comandos que podem ou nao entrar na toolbar nova, dependendo da decisao funcional:

- `cmd_aviso.bmp`
- `cmd_avisos.bmp`
- `cmd_calendario.bmp`
- `cmd_senha.bmp`
- `cmd_falar.bmp`
- `cmd_contato.bmp`
- `cmd_grafico.bmp`
- `cmd_valores.bmp`
- `cmd_reajusta.bmp`
- `cmd_distribui.bmp`
- `cmd_restaurabkp.bmp`
- `cmd_verificabkp.bmp`
- `cmd_lixo.bmp`
- `cmd_padrao.bmp`
- `cmd_novo.bmp`

Esses itens ficam documentados como candidatos, nao como decisao final.

## 8. Diferenca entre toolbar atual e toolbar alvo

### 8.1 Toolbar atual

A toolbar atual do Brana Cloude e curta e funcionalmente enxuta.

Ela cobre apenas comandos principais de alta visibilidade e nao replica a densidade do EasyDental.

### 8.2 Toolbar alvo

A toolbar alvo deve se aproximar da experiencia do EasyDental, com:

- mais comandos visuais;
- icones locais equivalentes;
- botao para novo paciente;
- botao para menu de pacientes;
- botao para novo tratamento;
- botao para agenda;
- botao para financeiro/conta corrente;
- botao para preferencia/configuracao;
- botao para historico/anamnese/odontograma/orcamento;
- botao para ajuda e backup.

## 9. Dependencias tecnicas

### 9.1 Dependencias ja confirmadas

- `frontend/index.html`
- `frontend/app.js`
- modulos de paciente em uso
- gate de novo tratamento
- menus de paciente e tratamento
- assets em `assets/` e `assets/easy/`

### 9.2 Dependencias sensiveis

- estado global do usuario logado;
- estado do paciente em uso;
- permissao de usuario;
- modulos de configuracao e administracao;
- rotas que podem ser chamadas pelos botoes;
- comportamento da saida do sistema.

## 10. Regras de remocao de codigo morto

1. Nao remover nada antes da nova toolbar estar visivel e funcional.
2. Nao apagar handlers antigos sem confirmar a equivalencia do novo fluxo.
3. Nao trocar um asset sem validar o significado funcional.
4. Nao limpar trechos compartilhados que possam ser usados por menus ou atalhos.
5. Quando houver duvida, manter fallback ate a validacao final.

## 11. Inventario de risco

- `frontend/app.js` continua sendo o arquivo mais sensivel.
- Uma troca visual pode alterar bindings ou atalhos indiretamente.
- Alguns comandos podem abrir modais que ja tem comportamento legado estabilizado.
- A toolbar pode depender de estados de paciente ou permissao nao obvios.
- A limpeza agressiva pode esconder regressao se for feita antes da validacao.

## 12. Inventario de validacao

Antes de qualquer corte definitivo, validar:

- abertura da aplicacao;
- abertura e fechamento da nova toolbar;
- novo paciente;
- menu de pacientes;
- novo tratamento;
- conta corrente;
- preferencias;
- historico;
- logout;
- ausencia de erro no console;
- ausencia de regressao visual evidente.

## 13. Conclusao

O inventario indica que o Brana Cloude ja possui a maior parte dos assets necessarios para reproduzir a experiencia visual da toolbar do EasyDental.

A etapa correta agora e:

1. fechar a lista definitiva de botões da toolbar alvo;
2. mapear ação por ação;
3. implementar por componente isolado;
4. validar;
5. remover o antigo apenas no final.
