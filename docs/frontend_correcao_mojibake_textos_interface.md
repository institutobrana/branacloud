# Correção de Mojibake de Textos de Interface

## 1. Motivo da correção

Foram observados textos quebrados por mojibake no frontend do Brana Cloud, com impacto visível na interface. O caso mais evidente continuava aparecendo em Convênios e Planos, por exemplo `10 convÃªnios`, e a varredura mostrou outros textos corrompidos em áreas de menu e rótulos do frontend.

## 2. Situação anterior

A correção anterior em Convênios e Planos havia sido aplicada de forma parcial. Depois disso, o navegador ainda mostrava textos corrompidos em partes da interface. Esta rodada fez uma auditoria textual do frontend e corrigiu apenas strings literais quebradas, sem alterar comportamento.

## 3. Arquivos pesquisados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- Verificação de referência nos módulos passivos já existentes:
  - `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js`
  - `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js`
  - `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\anamnese.js`

## 4. Ocorrências encontradas antes da correção

Foram encontradas múltiplas ocorrências de mojibake de interface, principalmente em `frontend/app.js` e `frontend/index.html`.

Ocorrências diretamente confirmadas nesta auditoria:

- `ConfiguraÃ§Ã£o de calendÃ¡rio de faturamento`
- `ConvÃªnios e planos`
- `ConvÃªnio`
- `ConvÃªnios`
- `calendÃ¡rio`
- `CÃ³digo`
- `NÂº`
- `NÃƒO`
- `ParÃ¢metros`
- `GestÃ£o OdontolÃ³gica`
- `10 convÃªnios`
- `CRÃ‰DITO`
- `DÃ‰BITO`

## 5. Strings corrigidas

### Convênios e Planos

- `ConfiguraÃ§Ã£o de calendÃ¡rio de faturamento` -> `Configuração de calendário de faturamento`
- `ConvÃªnios e planos` -> `Convênios e planos`
- `ConvÃªnio` -> `Convênio`
- `ConvÃªnios` -> `Convênios`
- `calendÃ¡rio` -> `calendário`
- `10 convÃªnios` -> `10 convênios`
- `Ã—` -> `X` nos botões de fechar

### Interface geral do frontend

- `GestÃ£o OdontolÃ³gica` -> `Gestão Odontológica`
- `NÃƒO` -> `NÃO`
- `ParÃ¢metros` -> `Parâmetros`
- `CRÃ‰DITO` -> `CRÉDITO`
- `DÃ‰BITO` -> `DÉBITO`
- `CÃ³digo` -> `Código`
- `NÂº` -> `Nº`

### Outros rótulos textuais corrigidos em `app.js` e `index.html`

- `PreÃ§o` -> `Preço`
- `RelaÃ§Ã£o` -> `Relação`
- `ClassificaÃ§Ã£o` -> `Classificação`
- `IntervenÃ§Ã£o` -> `Intervenção`
- `Procedimentos genÃ©ricos` -> `Procedimentos genéricos`
- `SÃ­mbolos` -> `Símbolos`
- `GrÃ¡ficos` -> `Gráficos`
- `UsuÃ¡rios` -> `Usuários`
- `PreferÃªncias` -> `Preferências`
- `OpÃ§Ãµes` -> `Opções`
- `RelatÃ³rio` -> `Relatório`
- `RelatÃ³rios` -> `Relatórios`
- `EstatÃ­sticos` -> `Estatísticos`
- `ProtÃ©ticos` / `ProtÃ©tico` -> `Protéticos` / `Protético`
- `CenÃ¡rio` -> `Cenário`
- `VocÃª` -> `Você`
- `estÃ¡` -> `está`
- `nÃ£o` -> `não`
- `serÃ¡` -> `será`
- `poderÃ¡` -> `poderá`
- `aÃ§Ã£o` / `aÃ§Ãµes` -> `ação` / `ações`
- `descriÃ§Ã£o` -> `descrição`
- `exclusÃ£o` -> `exclusão`
- `alteraÃ§Ã£o` -> `alteração`
- `validaÃ§Ã£o` -> `validação`
- `atenÃ§Ã£o` -> `atenção`
- `opÃ§Ã£o` -> `opção`
- `prÃ³ximo` -> `próximo`
- `mÃ³dulo` -> `módulo`
- `CÃ¢mera` -> `Câmera`
- `às`/`à` correspondentes em trechos visíveis que estavam corrompidos

## 6. Ocorrências restantes

Após a correção, os hits restantes de `Ã`, `Â` e `â` no `frontend/app.js` ficaram restritos principalmente a:

- mapas de correção runtime já existentes em `procCorrigirRotulosEditor`
- validações técnicas de normalização textual
- alguns ícones/textos simbólicos ainda usados como placeholders de interface

Esses trechos foram deixados intencionalmente porque alterá-los mexeria em lógica de correção, normalização ou em símbolos técnicos já utilizados pelo sistema.

Em `frontend/index.html`, após a segunda passada, não restaram textos de interface quebrados que exigissem correção adicional nesta auditoria.

## 7. Tipo de correção

A correção foi somente textual.

## 8. O que não foi feito

- Não houve nova modularização.
- Não foram criados helpers.
- Não foram alterados eventos.
- Não foram alterados clique, duplo clique, segundo clique rápido ou `bindStandardGridActivation`.
- Não foram alterados endpoints.
- Não foram alterados backend, banco, SQL, `requestJson` ou payloads.
- Não foi alterado fluxo de salvar, excluir, seleção, renderização estrutural ou layout amplo.

## 9. Pastas legadas

Nada foi salvo em:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`

## 10. Onde testar no navegador

1. Abrir o Brana Cloud.
2. Entrar em `Convênios e Planos`.
3. Abrir o `Calendário de faturamento`.
4. Confirmar que o cabeçalho mostra `Configuração de calendário de faturamento`.
5. Confirmar que a contagem aparece como `10 convênios` quando aplicável.
6. Abrir outros módulos principais e verificar que rótulos visíveis como `Gestão`, `Você`, `Relatório`, `Código` e `Crédito/Débito` aparecem corretamente.

