# Clínica 8 — Exclusão segura — Etapa 8B — Auditoria somente leitura de etiqueta_modelo

## 1. Contexto
A Etapa 8 tentou a execução real controlada da exclusão da clínica 8, mas foi bloqueada antes de qualquer DELETE por causa de vínculo inesperado em `etiqueta_modelo`. Nada foi excluído e o banco não foi alterado.

## 2. Objetivo da auditoria
Mapear somente leitura a tabela `etiqueta_modelo` para decidir se os 8 registros da clínica 8 são exclusivos, se dependem de catálogos globais e se devem entrar no runner antes de nova tentativa real.

## 3. Consultas e inspeção somente leitura usadas
- `inspect(engine)` para estrutura, colunas, índices e FKs.
- `select current_database()`.
- `select * from etiqueta_modelo where clinica_id = 8 order by id`.
- `select clinica_id, count(*) from etiqueta_modelo group by clinica_id order by clinica_id`.
- `select * from modelos_documento where id in (...)`.
- `select * from etiqueta_padrao order by id`.
- varredura de FKs em todas as tabelas para verificar se existe dependência filha apontando para `etiqueta_modelo`.

## 4. A tabela `etiqueta_modelo` existe?
Sim. A tabela existe no banco atual `brana_saas`.

## 5. Estrutura da tabela `etiqueta_modelo`
Colunas encontradas:
- `id`
- `clinica_id`
- `padrao_id`
- `nome`
- `reservado`
- `margem_esq`
- `margem_sup`
- `esp_horizontal`
- `esp_vertical`
- `nro_colunas`
- `nro_linhas`
- `modelo_documento_id`
- `ativo`
- `criado_em`
- `atualizado_em`

Índices encontrados:
- `ix_etiqueta_modelo_clinica_id`
- `ix_etiqueta_modelo_documento_id`
- `ix_etiqueta_modelo_id`
- `ix_etiqueta_modelo_padrao_id`

## 6. FKs e constraints encontradas
FKs diretas da tabela:
- `etiqueta_modelo_clinica_id_fkey` -> `clinicas.id`
- `etiqueta_modelo_modelo_documento_id_fkey` -> `modelos_documento.id`
- `etiqueta_modelo_padrao_id_fkey` -> `etiqueta_padrao.id`

Não foram encontradas FKs de outras tabelas apontando para `etiqueta_modelo`.

## 7. Registros encontrados com `clinica_id = 8`
Foram encontrados 8 registros:
- `id = 75`
- `id = 76`
- `id = 77`
- `id = 78`
- `id = 79`
- `id = 80`
- `id = 81`
- `id = 82`

Os nomes e vínculos observados foram:
- `Envelope1`
- `Envelope2`
- `Envelope3`
- `Pimaco completo (6080)`
- `Pimaco completo (6081)`
- `Pimaco completo (A4254)`
- `Pimaco completo (A4255)`
- `Pimaco completo (A4256)`

Todos os 8 registros possuem:
- `clinica_id = 8`
- `ativo = true`
- `reservado = false`
- `modelo_documento_id` apontando para modelos já existentes
- `padrao_id` apontando para padrões reservados

## 8. Contagem por `clinica_id`
- `clinica_id = 1` -> 9 registros
- `clinica_id = 4` -> 8 registros
- `clinica_id = 8` -> 8 registros

## 9. Vínculos diretos e indiretos
Vínculos diretos:
- `clinica_id` -> clínica 8
- `padrao_id` -> `etiqueta_padrao`
- `modelo_documento_id` -> `modelos_documento`

Vínculos indiretos observados:
- Os modelos apontados em `modelos_documento` são globais ou clonados por clínica:
  - `id 3` a `8` são modelos base globais em `origem = base`
  - `id 65` a `72` são clones da clínica 1 em `origem = clinica`
- Não houve indicação de vínculo por `usuario_id`, `prestador_id` ou outras tabelas dependentes.

## 10. Relação com `modelos_documento` e `etiqueta_padrao`
### `modelos_documento`
Os 8 registros da clínica 8 apontam para modelos globais `id 3` a `8`.
Esses modelos possuem `clinica_id = null`, `tipo_modelo = etiquetas` e `origem = base`.
Isso indica dependência funcional de catálogo global, mas a linha de `etiqueta_modelo` em si é clínica-específica.

### `etiqueta_padrao`
Os 8 registros da clínica 8 apontam para padrões globais reservados:
- `id 1` a `8`

Esses padrões são catálogos globais e compartilhados; não devem ser apagados.

## 11. Registros equivalentes nas clínicas 1 e 4
Sim, existem registros equivalentes nas clínicas 1 e 4:
- clínica 1 tem 9 registros, incluindo `ETIQUETA PRONTUÁRIO`
- clínica 4 tem 8 registros com o mesmo padrão de base

Os nomes e padrões se repetem, mas os IDs e os `modelo_documento_id` da clínica 8 são próprios dela.

## 12. Avaliação de risco
- **Exclusivo da clínica 8:** sim, no nível de linha da tabela `etiqueta_modelo`, porque os 8 registros têm `clinica_id = 8`.
- **Compartilhado:** os catálogos referenciados são compartilhados (`modelos_documento` base e `etiqueta_padrao`).
- **Incerto:** não há incerteza forte de FK; a tabela é bem mapeada e não possui dependências filhas encontradas.

## 13. Recomendação
Incluir `etiqueta_modelo` no runner de exclusão futura, porque os 8 registros são exclusivos da clínica 8 e o runner já bloqueou exatamente por essa tabela.

### Posição sugerida na ordem de exclusão
Colocar `etiqueta_modelo` entre os cadastros auxiliares/configurações e antes da remoção da assinatura/prestador/usuários, por exemplo:
- depois de `access_profile` e antes de `plataforma_assinaturas`

Motivo:
- não há dependentes filhos;
- a linha é clínica-específica;
- a remoção deve ocorrer antes da remoção do prestador e dos usuários, para reduzir chance de FK residual no fluxo final.

### Backup adicional
Sim, é recomendável gerar backup específico dos 8 registros de `etiqueta_modelo` da clínica 8 antes de nova tentativa real.

## 14. Confirmações
- Nada foi excluído.
- O banco não foi alterado.
- O runner não foi executado.
- `--execute` não foi usado nesta auditoria.
- `frontend`, `seeds`, `signup` e `access_profile` não foram alterados.
- Pastas proibidas não foram tocadas.

## 15. Próxima etapa recomendada
Etapa 8C — ajustar runner e backup para incluir `etiqueta_modelo`, sem executar `--execute`.
