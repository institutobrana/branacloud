# Contrato do Painel ADM -> Auditoria React

## 1. Propósito

Exibir eventos administrativos de forma read-only, segura e auditável.

## 2. Perfil de acesso

Somente usuário superadmin/autorizado da plataforma.

## 3. Rota

`/app/adm/auditoria`

## 4. Menu

Item `Auditoria` no menu ADM.

## 5. Guard

Usar o guard administrativo já existente no shell ADM e a mesma verificação de permissão da plataforma.

## 6. Shell

Reutilizar o shell global em `L`.

## 7. Toolbar

Toolbar da Fase 1 implementada:

`Atualizar | Exportar CSV | Buscar evento`

A fase inicial permanece read-only e não expõe ver detalhes ou navegação por alvo.

## 8. Tabela

Tabela read-only compacta.

## 9. Colunas

Colunas da Fase 1 implementada:

1. `ID`
2. `Data`
3. `Ação`
4. `Autor`
5. `Alvo`

## 10. Filtros

Filtros úteis:

- data;
- ação;
- autor;
- alvo.

## 11. Ordenação

Ordenação principal:

- `Data` descendente;
- `ID` descendente como desempate.

## 12. Seleção

Seleção de linha única.

## 13. Rodapé

Rodapé com total de eventos e, se aplicável, total filtrado.

## 14. Loading

Exibir estado de carregamento sem bloquear o shell inteiro.

## 15. Vazio

Quando não houver registros, manter cabeçalho e corpo vazio com mensagem amigável.

## 16. Erro

Exibir erro read-only com opção de atualizar novamente.

## 17. Detalhes

Não implementado nesta Fase 1.

## 18. Exportação

Não implementada nesta Fase 1.

## 19. Navegação para alvo

Não implementada nesta Fase 1.

## 20. Segurança

Obrigatório:

- autenticação;
- autorização;
- não confiar em dados do frontend;
- não expor credenciais;
- não expor `Authorization`;
- não expor senha;
- não expor token;
- não expor payload bruto sensível.

## 21. Campos proibidos

Proibidos na tabela principal:

- senha;
- token;
- `Authorization`;
- `before`;
- `after`;
- `user_agent`;
- `request_id`;
- payload bruto completo.

## 22. Tema

Preservar tema claro e escuro do sistema.

## 23. Responsividade

Desktop prioritário; mobile com empilhamento e sem overflow horizontal.

## 24. Acessibilidade

Botões com foco visível e tabela com leitura acessível.

## 25. Fase 1

Fase 1 implementada:

- leitura do endpoint atual;
- tabela com 5 colunas;
- toolbar read-only com `Atualizar` e `Buscar evento`;
- toolbar read-only com `Atualizar`, `Exportar CSV` e `Buscar evento`;
- filtros simples por coluna;
- seleção única;
- ordenação;
- controle de colunas;
- rodapé;
- loading;
- empty state;
- erro read-only.

## 26. Fases futuras

Possíveis evoluções futuras:

- exportação CSV;
- detalhes read-only com contrato seguro;
- `Ver alvo` navegável;
- filtros por módulo/resultado/IP;
- paginação server-side;
- modal com contextos mais ricos;
- antes/depois estruturado.

## 27. Critérios de aceite

- rota abre autenticada;
- dados reais aparecem;
- legenda do legado é respeitada;
- a tabela continua read-only;
- stage, commit e push seguem fora do escopo desta rodada.
