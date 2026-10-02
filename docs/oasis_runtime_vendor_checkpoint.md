# Oasis runtime vendor — checkpoint do Editor

O pacote runtime `frontend-react/vendor/oasis-editor-v0.0.191-runtime` é um
recorte verificável do Oasis Editor `0.0.191`, originário de
`celsowm/oasis-editor` no commit `51dea54da8a4a2310332a9f824a7adf726a6df99`.

Ele contém somente metadados/licença e os arquivos `dist` necessários ao
consumo atual do Editor: bundle ESM, chunks internos `index` e
`OasisEditorApp`, CSS, tipos, entrada CommonJS compatível e worker DOCX.
`node_modules`, fontes, demos e caches permanecem fora do pacote.

O `dist` é incluído neste checkpoint porque o checkout principal consome uma
dependência local `file:` e não pode depender de acesso ao registry durante a
instalação. A proveniência e os hashes dos arquivos devem ser verificados antes
de qualquer publicação.

Validação isolada:

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Se `npm ci` falhar por cache/registry ou por erro de filesystem, o resultado é
`DEPENDENCY_FETCH_BLOCKED`; isso não constitui aprovação do build. O vendor
fonte original é preservado separadamente e não é substituído por este recorte.
