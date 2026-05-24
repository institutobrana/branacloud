# Fase 2 - Editor de texto - Subetapa 1 - Contrato funcional

## 1. Contexto
A frente Tabela de protéticos foi pausada/consolidada parcialmente e sua trilha documental já registrou esse fechamento parcial.

Depois houve uma correção de trilha após o commit `ae98032`, tratada em documento próprio, e a trilha correta voltou para o Editor de texto.

A etapa de reavaliação posterior à Tabela de protéticos recomendou o Editor de texto como a próxima frente da Fase 2.

Esta subetapa inicia a frente Editor de texto somente com contrato funcional.

Nenhuma alteração de código deve ser feita nesta etapa.

## 2. Classificação comum/core ou específica
Classificação preliminar: comum/core.

Justificativa: o Editor de texto tende a ser transversal e reutilizável por várias áreas profissionais.

Nesta etapa não será implementado controle multiárea.

Não serão alteradas permissões, perfis, áreas profissionais, seeds ou banco.

Qualquer mudança futura relacionada a multiárea exigirá decisão documental própria.

## 3. Objetivo do contrato funcional
Definir o comportamento esperado atual do Editor de texto para servir como base antes de qualquer modularização, recorte, extração ou isolamento técnico.

O contrato desta subetapa existe para preservar o que o Editor de texto faz hoje, sem alterar a regra funcional existente.

## 4. Escopo funcional a preservar
Por leitura, o Editor de texto aparenta preservar os seguintes comportamentos atuais:

- abertura e acesso ao editor pelo menu de ferramentas;
- abertura em aba única / modo standalone quando acionado dessa forma;
- listagem de modelos de texto;
- abertura de modelo existente;
- criação de novo texto ou novo modelo;
- edição de texto existente;
- salvamento do conteúdo atual;
- salvar como;
- renomeação de modelo;
- exclusão de modelo, quando permitida;
- carregamento de campos de mesclagem;
- mesclagem de conteúdo com variáveis;
- formatação de texto rica;
- inserção de imagens e apoio visual de edição, quando disponível;
- configuração de página e apoio a layout;
- impressão, exportação e pipeline de PDF, quando existente;
- assinatura e preparação de PDF, quando existente;
- uso em fluxos relacionados a prontuário, documentos, modelos e apoio clínico;
- integração com paciente, profissional, clínica ou usuário, quando prevista pelo fluxo atual;
- mensagens e comportamentos existentes, sem corrigir textos;
- dependências aparentes com sessão, clínica, permissões e estado global do frontend.

## 5. Pontos que não devem ser alterados nesta frente inicial
Esta etapa não altera:

- banco;
- seeds;
- endpoints;
- regras de negócio;
- textos visíveis;
- layout;
- permissões;
- autenticação/sessão;
- usuários/login;
- agenda;
- conta corrente;
- ficha pessoal;
- tabela de protéticos;
- backend.

## 6. Arquivos e áreas observadas

### 6.1. `frontend/app.js`
Arquivo consultado por leitura.

Indícios observados:

- o Editor de texto está concentrado em um bloco grande no `frontend/app.js`;
- existem estados globais específicos como `editorTextosCfg`, caches e timers auxiliares;
- há abertura do editor, carregamento de modelos, carregamento de campos e salvamento no mesmo arquivo;
- há apoio a modo standalone e lock de aba única;
- há lógica de formatação, conteúdo, mesclagem, impressão e PDF;
- há integração com menu e com o restante do shell do sistema.

### 6.2. `frontend/index.html`
Arquivo consultado por leitura.

Indícios observados:

- existe a ação de menu `ferr-editor-textos`;
- o HTML carrega o script do editor e também outras partes compartilhadas do frontend;
- o editor depende de elementos e botões específicos do HTML para abrir, operar e fechar seus fluxos;
- o menu posiciona o Editor de textos no eixo de ferramentas do sistema.

### 6.3. `frontend/js/modules`
Pasta consultada por leitura.

Indícios observados:

- não foi identificado módulo separado do Editor de texto nesta pasta;
- a pasta contém módulos de outras frentes do sistema;
- há helper separado para Tabela de protéticos, mas não para o Editor de texto nesta etapa;
- isso reforça que o Editor de texto segue concentrado no monólito do `frontend/app.js`.

### 6.4. `backend`
Área consultada por leitura.

Arquivos observados:

- `backend/routes/editor_textos_routes.py`;
- `backend/main.py`;
- `backend/security/permissions.py`.

Indícios observados:

- o backend possui rota dedicada ao Editor de textos;
- o router usa contexto autenticado;
- há filtro por clínica no fluxo de modelos;
- há dependência de permissões do módulo de configuração;
- há endpoints para modelos, campos, mesclagem, exportação, assinatura e preparação de PDF.

### 6.5. Docs consultados
Documentos consultados por leitura:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`;
- `docs/11_roadmap_desenvolvimento.md`;
- `docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`;
- `docs/auditoria_fina_editor_textos_editor_puro.md`;
- `docs/auditoria_fina_editor_textos_resto_domino.md`;
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`;
- `docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`.

## 7. Indícios técnicos iniciais

- O Editor de texto parece concentrado em `frontend/app.js`.
- Não foi identificado módulo separado específico em `frontend/js/modules`.
- O Editor depende de HTML específico para menu, painéis, modais e ações.
- O Editor aparenta chamar backend por rotas dedicadas.
- O Editor aparenta depender de estado global no frontend.
- O Editor aparenta depender de sessão, clínica e permissões no backend.
- O Editor aparenta ter risco textual/mojibake alto, porque carrega muitos textos, labels e mensagens e já convive com documentação de blindagem textual.

## 8. Riscos técnicos

- funções misturadas em `frontend/app.js`;
- dependência de variáveis globais;
- dependência de DOM complexo;
- dependência de editor rico, área editável ou componentes visuais extensos;
- dependência de abas, lock local ou standalone;
- risco de quebrar formatação;
- risco de quebrar salvamento e carregamento;
- risco de quebrar mesclagem ou campos vinculados;
- risco de quebrar impressão, exportação ou PDF;
- risco de alterar textos visíveis;
- risco de mojibake;
- risco de afetar prontuário, documentos, modelos ou fluxos clínicos dependentes;
- risco de impactar sessão, clínica ou permissões por acoplamento indireto.

## 9. Critérios de aceite antes de qualquer modularização
Depois de qualquer futura alteração funcional no Editor de texto, o mínimo esperado para validação manual humana é:

- abrir o Editor de texto;
- carregar texto ou modelo existente;
- criar novo texto ou novo modelo de teste;
- editar conteúdo;
- aplicar formatação, se houver;
- salvar;
- recarregar e confirmar persistência;
- testar salvar como, se houver;
- testar renomear, se houver;
- testar excluir ou inativar, se houver;
- testar impressão ou exportação, se houver;
- testar o uso do editor no fluxo atual em que ele aparece;
- confirmar que não houve alteração textual visível;
- confirmar que outros módulos não foram afetados;
- confirmar que sessão, permissões e clínica continuam coerentes.

## 10. Plano conservador sugerido para próximas subetapas
Sequência segura sugerida, ainda sem executar:

- Subetapa 2: mapeamento técnico por leitura das funções, IDs, eventos e dependências;
- Subetapa 3: isolamento documental dos blocos candidatos;
- Subetapa 4: primeiro recorte mínimo, somente se houver helper ou bloco seguro;
- Subetapa 5: teste manual humano;
- Subetapa 6: documentação e commit seletivo.

## 11. Registro para roadmap
- a frente Tabela de protéticos está pausada/consolidada;
- o commit `ae98032` foi tratado como fora da sequência esperada por documento próprio;
- Editor de texto passa a ser a nova frente recomendada da Fase 2;
- esta etapa cria o contrato funcional do Editor de texto;
- Editor de texto é tratado preliminarmente como módulo comum/core;
- a próxima etapa deve continuar documental, com mapeamento técnico antes de qualquer código;
- commit seletivo e teste manual humano continuam obrigatórios;
- blindagem textual/mojibake continua obrigatória;
- Agenda, Conta corrente, Usuários/Login, Seeds/tabelas padrão e Ficha pessoal continuam fora desta frente.

## 12. Commit seletivo obrigatório
- único arquivo que deve entrar no commit desta etapa: `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`;
- não usar `git add .`;
- não usar `git add docs/`;
- não incluir untracked antigos;
- não incluir `frontend/app.js`;
- não incluir `frontend/index.html`;
- não incluir `frontend/js/modules`;
- não incluir `backend`;
- não incluir banco, schema, migrations, seeds ou endpoints;
- o commit deve ser seletivo e auditado.

## 13. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `backend` não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum `reset`, `revert`, `restore` ou `clean` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado ou modificado nesta etapa foi `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`.
