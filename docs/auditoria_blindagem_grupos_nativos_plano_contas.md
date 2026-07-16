# Auditoria de Blindagem dos Grupos Nativos do Plano de Contas

## 1. Contexto

Esta auditoria foi realizada para definir o contrato correto de blindagem de seis grupos nativos do Plano de contas e, nesta etapa seguinte, registrar a protecao backend minima ja implementada.

Os grupos alvo sao:

1. Custo fixo pessoal
2. Custo fixo profissional
3. Custo variavel pessoal
4. Custo variavel profissional
5. Investimento - empresa
6. Investimento - pessoal

## 2. Documentacao reaproveitada

Documentos lidos e reaproveitados como base:

- [docs/00_master_guide.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/00_master_guide.md)
- [docs/02_arquitetura.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/02_arquitetura.md)
- [docs/03_mapa_codigo.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/03_mapa_codigo.md)
- [docs/06_seguranca.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/06_seguranca.md)
- [docs/10_continuidade.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/10_continuidade.md)
- [docs/contrato_exclusao_migracao_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_exclusao_migracao_plano_de_contas.md)
- [docs/auditoria_regra_exclusao_migracao_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_regra_exclusao_migracao_plano_de_contas.md)
- [docs/contrato_implementacao_cenario_anual_frontend_react.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_implementacao_cenario_anual_frontend_react.md)
- [docs/contrato_visual_plano_de_contas_frontend_react.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_visual_plano_de_contas_frontend_react.md)
- [docs/auditoria_padroes_react_plano_de_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_padroes_react_plano_de_contas.md)
- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)

## 3. Estado atual

- O Plano de contas ja existe no backend e no frontend React.
- O CRUD de grupos e categorias ja existe.
- A exclusao de categoria ja possui bloqueio por uso e fluxo de migracao.
- A exclusao de grupo ja existe no backend e agora possui blindagem minima para os seis grupos nativos.
- Nao encontrei campo estrutural dedicado para marcar grupo como nativo, sistema, protegido ou equivalente.
- Nao encontrei soft delete para grupo financeiro.

## 4. Identidade dos seis grupos

### Como a identidade funciona hoje

- A identidade operacional hoje depende principalmente do nome do grupo.
- O backend do Cenário anual compara `GrupoFinanceiro.nome`.
- O signup repovoa grupos e categorias por nome, com idempotencia por `nome.lower()`.
- Nao foi encontrado `system_key`, `protegido_sistema`, `nativo` ou coluna equivalente em `GrupoFinanceiro`.

### Evidencias de banco e modelos

- [backend/models/financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/financeiro.py)
- `GrupoFinanceiro`: `id`, `clinica_id`, `nome`, `tipo`
- `CategoriaFinanceira`: `id`, `clinica_id`, `grupo_id`, `nome`, `tipo`, `tributavel`

### Respostas objetivas

1. Identificador estavel hoje: nao encontrado.
2. Campo de sistema: nao encontrado.
3. Identificacao apenas por nome: sim, na pratica atual.
4. Nome unico por clinica: o backend tenta garantir.
5. Renomeacao: sim, hoje e possivel.
6. IDs por clinica: sim, variam.
7. Seis grupos em toda clinica: nao validado em banco nesta etapa.
8. Variacao de grafia/caixa/acento/hifen: risco real, porque o Cenário anual depende do nome.
9. Duplicidade: o backend reduz risco, mas a ausencia de chave estrutural ainda deixa a regra fragil.
10. Clinicas antigas sem algum grupo: possivel, nao validado aqui.
11. Nomes equivalentes com IDs diferentes: possivel por desenho atual.
12. Soft delete: nao encontrado.
13. Reutilizacao de nomes: ha risco se a regra depender apenas de texto.

## 5. Fluxo atual de exclusao

### Backend

- Rota de listar, criar, editar e excluir grupos: [backend/routes/cadastros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/cadastros_routes.py)
- Exclusao de grupo: `DELETE /cadastros/grupos/{grupo_id}`
- Validacao atual: bloqueia quando o grupo possui categorias vinculadas
- Resposta atual:
  - `409` para grupo blindado do sistema
  - `400` para grupo com categorias
  - `404` para grupo inexistente
  - `200` para exclusao bem-sucedida

### Frontend React

- API client: [frontend-react/src/features/planoContas/planoContasApi.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/planoContas/planoContasApi.js)
- Hook: [frontend-react/src/features/planoContas/hooks/usePlanoContas.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/planoContas/hooks/usePlanoContas.js)
- Acoes de categoria ja tratam exclusao e migracao.
- Nao encontrei blindagem final de grupo nativo nesta frente.

### Frontend legado

- O legado do Plano de contas ainda contem a frente antiga, mas a blindagem nativa de grupo nao foi encontrada como regra centralizada.

### Outros caminhos

- Nao foram encontrados scripts aditivos desta etapa para exclusao de grupo nativo.
- Nao houve evidencias de cascata de banco para remover grupos.

## 6. Dependencias com Cenário anual

### Mapa encontrado

- Arquivo principal: [backend/routes/cenario_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/cenario_routes.py)
- Funcao: `calcular_fixos_por_ano`
- A consulta soma lancamentos de debito e cruza:
  - `Lancamento.categoria_id`
  - `CategoriaFinanceira.grupo_id`
  - `GrupoFinanceiro.nome`
- O filtro de grupo usa:
  - `Custo fixo pessoal`
  - `Custo fixo profissional`

### Efeitos observados

- Se o grupo for removido, a consulta perde o caminho de classificacao e pode retornar zero ou deixar o resultado incoerente.
- Se o grupo for renomeado, a dependencia quebra porque usa nome textual.
- Se houver duplicidade de nome, a classificacao pode ficar ambigua ou inconsistente.

### Conclusao

- O Cenário anual depende de nome textual hoje.
- A blindagem dos seis grupos e produto e precisa proteger a identidade, nao apenas a grafia atual.

## 7. Riscos

- Dependencia por nome em vez de chave estrutural.
- Renomeacao quebrando o Cenário anual.
- Duplicidade textual em clinicas antigas ou futuras.
- Exclusao direta por API sem uma regra nativa de blindagem.
- Ausencia de coluna dedicada para persistir a protecao.

## 8. Alternativas avaliadas

### A. Protecao por nome normalizado

- Vantagem: nao exige migration imediata.
- Risco: renomeacao, acentos, caixa e espacos podem gerar falhas.

### B. Protecao por IDs fixos

- Vantagem: simples de checar.
- Risco: IDs nao sao estaveis entre clinicas.

### C. Coluna estrutural como `sistema` ou `nativo`

- Vantagem: protege a identidade.
- Risco: exige migration e backfill.

### D. Catalogo de chaves estruturais

- Vantagem: separa identidade de exibicao.
- Risco: tambem exige evolucao estrutural.

### E. Protecao imediata sem migration + evolucao futura

- Vantagem: permite bloquear ja e preparar a solucao definitiva.
- Risco: precisa disciplina para nao ficar dependente apenas de nome por muito tempo.

## 9. Estrategia recomendada

### Solucao minima e segura para agora

- Centralizar no backend uma regra de protecao para os seis nomes nativos.
- Normalizar nome para comparacao.
- Bloquear exclusao com `HTTP 409`.
- Exibir mensagem fixa ao usuario.
- Reforcar a UI do React apenas como defesa extra.

### Solucao estrutural futura

- Criar chave estrutural persistida, como `system_key`.
- Adicionar coluna booleana de protecao de sistema.
- Popular as clinicas existentes por migration/backfill controlado.
- Manter o Cenário anual consumindo chave estavel, nao nome textual.

## 10. Contrato backend

- Ponto de validacao: dentro da rota de exclusao de grupo, antes de qualquer `delete`.
- Regra reutilizavel: helper centralizado para verificar se o grupo e nativo.
- Resposta recomendada:
  - `HTTP 409`
  - `detail: "GRUPO BLINDADO DO SISTEMA, NÃO PODE SER EXCLUIDO!"`
  - `code: "SYSTEM_GROUP_PROTECTED"`
- Grupo inexistente: `404`
- Grupo nativo: `409`
- Grupo comum elegivel: pode excluir se nao tiver categorias vinculadas
- Garantia contra chamada direta: a rota backend precisa ser a barreira real, nao o frontend
- Garantia contra cascata indevida: a exclusao continua manual e condicionada, sem cascade automatico

## 11. Contrato frontend React

- Botao Eliminar:
  - desabilitado para grupo nativo
  - habilitado apenas para grupo comum elegivel
- Deve haver explicacao visual curta para o bloqueio.
- Mesmo desabilitado, a tela deve tratar erro 409 do backend.
- A selecao do grupo precisa ser preservada apos erro.
- Acoes duplicadas precisam continuar bloqueadas por loading/guard.
- Nesta rodada, o contrato visual do React foi reforcado com tooltip de bloqueio, confirmacao separada para exclusao de grupo comum e mensagem imediata quando o grupo nativo ou um grupo com categorias vinculadas tenta acionar a exclusao.
- A validacao em navegador autenticado confirmou que os seis grupos nativos mantem o botao `Eliminar` desabilitado, sem abrir confirmacao e sem disparar DELETE.
- A alternancia de tema claro e escuro nao introduziu regressao visivel no shell nem no bloco do Plano de contas.

## 14.5. Papel de `App.jsx`

- A mudanca em `App.jsx` ficou restrita a repassar o estado e a acao do toolbar do Plano de contas ao shell ja existente.
- Nao houve regra de dominio nova em `App.jsx`.
- A pagina continua sendo a origem das decisoes de negocio; o shell apenas encaminha props e eventos.
- A alteracao foi mantida por ser necessaria para conectar a barra de acoes do Plano de contas ao shell atual sem criar acoplamento adicional.

## 14.6. Equivalencia de normalizacao

- O frontend React foi alinhado ao helper backend para:
  - remover acentos;
  - converter para maiusculas;
  - remover espacos externos;
  - colapsar espacos internos;
  - normalizar espacos ao redor do hifen;
  - comparar por igualdade exata.
- A lista canonica ficou idêntica entre as duas camadas para os seis grupos protegidos.

## 12. Contrato frontend legado

- Se houver fluxo de exclusao de grupo no legado, deve aplicar a mesma regra visual.
- O backend continua sendo a fonte final de verdade.
- Nenhum bloqueio apenas visual pode ser tratado como seguranca.

## 13. Matriz de testes

### Backend

- bloquear exclusao de cada um dos seis grupos
- bloquear exclusao por chamada direta
- permitir exclusao de grupo comum elegivel
- grupo inexistente retorna `404`
- comparacao por nome normalizado nao falha com caixa/espacos
- isolamento por clinica preservado
- nenhum efeito colateral em categorias
- erro estruturado no formato esperado
- helper centralizado validado isoladamente

### Frontend React

- botao desabilitado para grupo nativo
- botao habilitado para grupo comum
- nenhuma chamada `DELETE` para grupo nativo
- tratamento do `409`
- selecao preservada
- prevençao de requests duplicados

### Legado

- bloqueio visual
- nenhuma chamada indevida ao backend para grupo nativo
- tratamento do erro retornado pela API

## 14. Arquivos provaveis da futura implementacao

- [backend/routes/cadastros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/cadastros_routes.py)
- [backend/models/financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/financeiro.py)
- [backend/services/signup_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/signup_service.py)
- [frontend-react/src/features/planoContas/hooks/usePlanoContas.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/planoContas/hooks/usePlanoContas.js)
- [frontend-react/src/features/planoContas/PlanoContasPage.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/planoContas/PlanoContasPage.jsx)
- [frontend-react/src/features/planoContas/planoContasApi.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/planoContas/planoContasApi.js)

## 15. Itens fora de escopo

- Alterar banco, migration ou seed.
- Reestruturar o Cenário anual nesta etapa.
- Mudar o contrato de renomeacao nesta etapa.

## 18. Implementacao realizada nesta etapa

- Politica centralizada criada em [backend/services/plano_contas_system_groups.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/plano_contas_system_groups.py)
- Normalizacao adotada:
  - remove acentos
  - cola espacos multiplos
  - normaliza espacos ao redor do hifen
  - compara em maiusculas por igualdade exata
- Endpoint protegido:
  - `DELETE /cadastros/grupos/{grupo_id}`
- Contrato do erro:
  - `HTTP 409`
  - `detail: "GRUPO BLINDADO DO SISTEMA, NÃO PODE SER EXCLUIDO!"`
  - `code: "SYSTEM_GROUP_PROTECTED"`
- Testes adicionados:
  - helper de normalizacao e reconhecimento
  - exclusao de cada grupo protegido
  - exclusao de grupo comum sem categorias
  - isolamento por clinica
- Frontend React:
  - blindagem defensiva adicionada no hook e no shell do Plano de contas para reconhecer os seis grupos protegidos e bloquear o evento de exclusao de grupo protegido sem afetar o fluxo de categorias
- Frontend legado:
  - pendente
- Solucao estrutural com migration:
  - futura

## 16. Critérios de aceite

- Documento de auditoria criado.
- Roadmap atualizado.
- Nenhum codigo produtivo alterado.
- Nenhum banco alterado.
- Nenhuma migration executada.
- Nenhum commit realizado.
- Nenhum push realizado.

## 17. Proximo passo recomendado

- Implementar primeiro a protecao minima no backend, com erro estruturado e helper reutilizavel, e depois reforcar o bloqueio no frontend React e no legado.
