# Regras de Blindagem para Correções Textuais e Mojibake

## 1. Objetivo da blindagem
Correções de acentuação, mojibake e textos de interface no Brana Cloud devem ser tratadas com segurança máxima. O `frontend/app.js` contém funções globais compartilhadas por vários módulos, e uma alteração textual aparentemente simples pode afetar comportamentos, botões, modais e símbolos usados em mais de um ponto do sistema.

Esta regra existe para impedir que uma correção textual isolada se transforme em mudança estrutural, funcional ou global sem autorização explícita.

## 2. Regra principal
Nenhuma correção textual pode ser feita diretamente sem antes identificar claramente:
- arquivo;
- função;
- linha aproximada ou trecho;
- string atual;
- string proposta;
- impacto esperado;
- se o trecho é local do módulo ou função global.

Se qualquer um desses itens estiver indefinido, a correção não deve ser aplicada.

## 3. Fluxo obrigatório em duas fases

### Fase A - Auditoria sem alteração
Antes de corrigir qualquer texto:
- procurar ocorrências;
- listar antes/depois proposto;
- classificar risco;
- não salvar alterações em código.

### Fase B - Correção aprovada
Depois de autorização explícita:
- corrigir somente as strings aprovadas;
- não ampliar escopo;
- não corrigir ocorrências semelhantes sem autorização;
- não mexer em comportamento.

## 4. Áreas protegidas
As áreas abaixo são protegidas e não podem ser alteradas em correções textuais sem autorização explícita:
- `ensurePanelChrome`;
- `ensureModalChrome`;
- botões globais de fechar;
- botões de ajuda;
- ícones/símbolos globais;
- eventos;
- clique;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- seleção de linha;
- renderização estrutural;
- modais;
- `requestJson`;
- `fetch`;
- endpoints;
- payloads;
- backend;
- banco;
- wrappers de helpers;
- namespaces passivos;
- `frontend/index.html`, salvo autorização explícita.

## 5. Regra para símbolos especiais
Não substituir automaticamente símbolos como:
- `×`;
- `?`;
- `??`;
- `✓`;
- `✕`;
- ícones Unicode;
- emojis;
- caracteres especiais.

Se algum símbolo estiver corrompido, primeiro documentar onde ele está e qual função exerce. Somente trocar por texto simples, como `X` ou `?`, quando autorizado.

## 6. Regra para correção de mojibake
Correções como as abaixo podem ser propostas:
- `convÃªnio` -> `convênio`
- `convÃªnios` -> `convênios`
- `ConfiguraÃ§Ã£o` -> `Configuração`
- `calendÃ¡rio` -> `calendário`
- `nÃ£o` -> `não`
- `descriÃ§Ã£o` -> `descrição`

Mas nunca aplicar automaticamente no arquivo inteiro. Cada correção deve estar em string literal de interface claramente identificada.

## 7. Proibição de limpeza global
É proibido:
- substituição global cega;
- replace em massa;
- alteração de arquivo inteiro;
- regravação completa de `frontend/app.js`;
- correção de textos fora do módulo solicitado;
- correção simultânea em múltiplos módulos sem autorização.

## 8. Regra para funções globais
Se a ocorrência estiver em função global compartilhada, o Codex deve parar e informar:
- qual função global seria afetada;
- quais módulos podem ser impactados;
- qual alteração mínima seria necessária;
- aguardar autorização antes de alterar.

## 9. Documentação obrigatória em qualquer correção textual futura
Toda correção textual futura deve criar documento registrando:
- motivo;
- escopo autorizado;
- arquivos pesquisados;
- strings encontradas;
- strings corrigidas;
- ocorrências não corrigidas;
- confirmação de que não alterou lógica;
- confirmação de que não mexeu em eventos, endpoints, payloads ou backend;
- onde testar.

## 10. Checklist antes de finalizar uma correção textual
Antes de finalizar qualquer correção textual futura, confirmar:
- `node --check` nos arquivos JS alterados;
- que `frontend/index.html` não foi alterado sem autorização;
- que módulos JS não foram alterados sem autorização;
- que as pastas legadas não foram mexidas;
- onde exatamente testar no navegador;
- se uma função global foi tocada, testar pelo menos dois módulos que usam essa função.

## 11. Como usar este documento
Todo prompt futuro relacionado a texto, acentuação, mojibake, labels, títulos, botões, ícones ou símbolos deve incluir obrigatoriamente:

`Seguir obrigatoriamente docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Confirmações finais
- Este documento não corrige bugs por si só.
- Este documento é uma regra de proteção.
- Qualquer correção textual futura deve obedecer a ele.
