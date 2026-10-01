# Checkpoint documental — assinatura local Brana Cloude

**Data do checkpoint:** 2026-09-25
**Branch:** `modularizacao-segura-fase-1`
**HEAD inicial/final:** `5c808f60f7d0957ba203d86abb92290bd0ec66a8`
**Escopo desta atualização:** somente documentação; nenhum arquivo de código, dependência, ambiente ou processo foi alterado.

## 1. Estado comprovado

Foi produzida uma assinatura sintética pelo caminho operacional Windows Store-only, com aprovação WPF de pairing e operação, uma chamada a `/sign` e recuperação de `/result` antes do encerramento do bridge.

Artefato observado:

- caminho: `C:\Users\Tel\AppData\Local\Temp\brana-real-result\new-corrected-signed.pdf`;
- tamanho: `45.336` bytes;
- SHA-256: `e233e8045aea8e4d4c58f5ce6ec7689c4e21fd82f6265057f25e4944bb678853`;
- `/ByteRange`: validado localmente;
- `messageDigest`: corresponde aos bytes cobertos;
- signed attributes: assinatura RSA/SHA-256 verificada sobre o `SET OF` canônico;
- certificado embutido: corresponde ao certificado público selecionado;
- campo: somente `BranaSignature_1`, preenchido;
- policy: OID `2.16.76.1.7.1.11.1.3` e hash interno `23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60`.

Isso foi inicialmente registrado como prova local. Em 2026-09-25, foi conferido o relatório `C:\Users\Tel\AppData\Local\Temp\brana-real-result\Relatorio - new-corrected-signed.pdf`, que identifica `new-corrected-signed.pdf` e o SHA-256 acima. O Verificador de Conformidade registra assinatura `Aprovado`, atributos obrigatórios `Aprovados`, `IdAaEtsSigPolicyId: Valid` e `Nenhuma mensagem de alerta`. Esta conclusão vale somente para esse PDF e esse relatório; não constitui homologação do fluxo Oasis.

### Integração do botão Oasis

O cliente Oasis foi conectado ao contrato local em `frontend-react/src/features/editorTextos/oasis/OasisEditorPilot.jsx` e `frontend-react/src/features/editorTextos/api/localSignatureBridgeApi.js`: exportação/preparação, pairing autenticado, espera finita por aprovação, operação, uma única chamada `/sign`, recuperação autenticada de `/result` e download somente após validação mínima do PDF recuperado. A habilitação permanece explícita por `VITE_ENABLE_LOCAL_SIGNATURE=true` e desligada por padrão. A execução humana real pelo botão Oasis ainda não foi realizada nesta etapa.

### Artefato de homologação fake em desenvolvimento

Foi localizado `C:\Users\Tel\Downloads\oasis-dev-homologation-signed.pdf`, com 68 bytes e SHA-256 `3e134294c6407c73716807a4fbc8c8043eb2b56a011c1b6bdd1f12c16c609c03`. O arquivo contém apenas texto sintético e um marcador `/ByteRange`; não contém `/Contents`, `/SubFilter` ou CMS, portanto não possui assinatura criptográfica e não foi submetido nem aprovado pelo ITI. O trace codificado do harness registra `EXPORT_ONCE`, uma operação, `SIGN_FAKE_ONCE` e `RESULT_RECOVERED`; não existe log temporal preservado do clique no navegador, então a execução humana e os tempos não são comprovados por este artefato.

Em repetição assistida, o trace sanitizado exibido no Oasis registrou as sete etapas para a operação `dev-236a797d-621f-4e9a-bad9-85fa0520aa5f`, uma exportação, uma operação e uma chamada fake. O resultado e o download tiveram 233 bytes e SHA-256 `b2e4cc3f5503c4f0682bf950f8d6030f32401553712b54cb5f2001c2f9689c33`; a comparação local confirmou o mesmo hash. O arquivo `C:\Users\Tel\Downloads\oasis-dev-homologation-simulation.pdf` começa com `%PDF-1.4`, mas não contém CMS, `/Contents` ou `/SubFilter`; é simulação sem assinatura criptográfica e não é aprovação ITI.

## 2. Incidente da policy e correção

O PDF anterior `a70799feff882f0a14a797b31dc65791f3d4253068d0f87b9b27b00d976ab4f5` foi reprovado pelo ITI em `IdAaEtsSigPolicyId`.

São valores diferentes e têm funções diferentes:

- SHA-256 do DER oficial completo: `23da544aef71f7a75dc85fa6e17a83875741e4baef41ec178258a5c86ace54dd`;
- hash interno da Política de Assinatura usado em `sigPolicyHash`: `23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60`.

O ajuste está em `local_bridge/pdf_signing.py`: o código extrai estruturalmente o hash interno do DER oficial, valida OID, algoritmo, tamanho e integridade do arquivo, e usa o valor interno na construção de `CAdESSignedAttrSpec`. Os testes relacionados estão em `local_bridge/tests/`, especialmente os testes de policy, PDF real sintético e prova HTTP/pyHanko. A correção passou na suíte local registrada com 259 testes; isso não equivale a aprovação ITI.

## 3. Contratos executáveis e referências

| Contrato | Implementação/testes de referência | Estado |
|---|---|---|
| PDF preparado, campo existente e hash imutável | `local_bridge/security/http_protocol.py`, `local_bridge/security/windows_prepared_signer.py`, `local_bridge/tests/test_signing_transition.py` | comprovado em testes e no artefato real |
| `BranaSignature_1`, `use_existing_field=True`, sem campo novo | `local_bridge/pdf_signing.py`, `local_bridge/tests/test_windows_prepared_signer.py` | comprovado |
| Bridge v1, TLS, Host/Origin, ECDH/HMAC e nonces | `local_bridge/security/protocol.py`, `local_bridge/security/http_auth.py`, `local_bridge/security/http_protocol.py`, `local_bridge/tests/test_http_protocol.py` | comprovado em ASGI/HTTPS; não é contrato público para dados de chave |
| Aprovação WPF/named pipe, uma decisão por pedido, negação e expiração | `local_bridge/security/approval_adapter.py`, `local_bridge/windows_approval/`, `local_bridge/tests/test_ui_protocol.py` | pairing/operação reais aprovados; expiração/X testados sem aprovação |
| Helper Store-only, RSA/SHA-256/PKCS#1, identidade DER | `local_bridge/security/dotnet_sha256_signer.py`, `local_bridge/native_sha256_helper/`, `local_bridge/tests/test_dotnet_http_real_process.py` | caminho real exercitado; nova máquina ainda não homologada |
| Policy offline AD-RB 1.3 | `local_bridge/pdf_signing.py`, `local_bridge/policy_provisioner.py` | hash interno corrigido; DER provisionado explicitamente antes da operação |
| Transição única `APPROVED -> SIGNING` e estado terminal | `local_bridge/security/http_protocol.py`, `local_bridge/tests/test_signing_transition.py` | comprovado |
| `COMPLETED -> /result` antes do encerramento | `local_bridge/smoke_runner.py`, `local_bridge/tests/test_smoke_runner_recovery_e2e.py` | comprovado nos testes e na execução real |
| Limpeza e flags seguras | `local_bridge/secure_bridge_app.py`, `local_bridge/launch_secure_bridge.py`, `local_bridge/tests/` | default de assinatura desativado |

O browser não fornece PDF, CMS, policy, certificado ou input criptográfico. A rota recebe bytes preparados e metadados validados; o input criptográfico é determinado pelo pyHanko e chega ao helper somente após a aprovação e a transição atômica.

## 4. Fronteiras ainda não homologadas

- O relatório VALIDAR/ITI do novo PDF foi conferido e registra aprovação para o hash exato; isso não homologa o fluxo Oasis.
- O fluxo Oasis no navegador até o bridge e o PDF assinado real ainda não está homologado de ponta a ponta.
- A prova ASGI/fake e a prova sintética com host .NET não substituem a prova HTTPS/WPF nem a assinatura com certificado real; a prova real do artefato acima é separada e não equivale à homologação externa.
- Uma checagem recente encontrou o Vite HTTPS `5173` sem listener. O estado atual deve ser verificado read-only; não iniciar nem alterar o Vite como parte deste checkpoint.
- Instalador, outra máquina, clone limpo e deploy SaaS ainda não estão concluídos.
- O DER não é redistribuído pelo repositório. O provisionamento explícito está em `local_bridge/policy_provisioner.py`: recebe um caminho local ou URL fornecido pelo operador, valida 4.716 bytes e SHA-256 `23da544aef71f7a75dc85fa6e17a83875741e4baef41ec178258a5c86ace54dd`, grava atomicamente em `%LOCALAPPDATA%\BranaCloude\policy\official-policy-v1_3.der` (ou `BRANA_POLICY_DATA_DIR`) e somente então o signer pode operar offline.
- Comando de provisionamento: `python -m local_bridge.policy_provisioner --source http://politicas.icpbrasil.gov.br/PA_PAdES_AD_RB_v1_3.der`; uma máquina sem acesso à rede deve fornecer um arquivo local previamente obtido da mesma publicação e validado pelo mesmo tamanho/hash. O comando é explícito, não é chamado pelo `/sign`.
- Fonte pública registrada: página ITI “Assinatura digital com Referência Básica (AD-RB)”, https://www.gov.br/iti/pt-br/assuntos/repositorio/assinatura-digital-com-referencia-basica-ad-rb; URL do artefato PAdES 1.3: `http://politicas.icpbrasil.gov.br/PA_PAdES_AD_RB_v1_3.der`. Verificação local do tamanho/hash: 2026-09-25. A página informa licença do site, mas os termos específicos de redistribuição do DER não foram presumidos; por isso o DER não é versionado. O provisionador é pré-operação e nunca é chamado durante `/sign`.

## 5. Roadmap e gates de retomada

### Gate 1 — relatório externo do artefato

Entrada: o PDF acima preservado e o SHA-256 confirmado.
Ação: obter e conferir o relatório VALIDAR/ITI para esse hash.
Estado atual: PASS; relatório `Relatorio - new-corrected-signed.pdf` identifica o arquivo e registra `Aprovado`, `IdAaEtsSigPolicyId: Valid` e nenhum alerta.
Saída PASS: relatório aprovado e atributos/policy correspondentes ao arquivo.
Saída FAIL: preservar PDF e relatório, localizar o atributo reprovado e corrigir antes de qualquer nova assinatura.

### Gate 2 — Oasis -> bridge -> PDF

Entrada: Gate 1 PASS, assinatura real local já documentada e frontend/bridge sem flags persistentes.
Saída PASS: fluxo Oasis autentica, WPF aprova o mesmo pedido, `/sign` único produz `/result` e a validação independente repete o hash do artefato.
Falha: não chamar novamente `/sign` automaticamente.

### Gate 3 — documento de teste

Entrada: Gate 2 PASS.
Saída PASS: documento sintético/teste aprovado no caminho operacional, sem documento clínico.
Bloqueio: qualquer divergência de bytes, campo, policy, identidade ou estado.

### Gate 4 — empacotamento e outra máquina

Entrada: Gate 3 PASS.
Saída PASS: binários, DER, TLS dedicado e configuração são reproduzíveis em clone limpo/outra máquina, com Store e WPF locais.
Não iniciar distribuição SaaS antes deste gate.

### Gate 5 — ativação/distribuição

Somente após Gates 1–4, revisão de segurança, runbook de rollback e decisão operacional explícita. `enable_real_signing=False` continua sendo o default.

## 6. Runbook read-only de recuperação

Executar no clone, sem stage e sem iniciar serviços:

```powershell
git branch --show-current
git rev-parse HEAD
git status --short
Get-NetTCPConnection -LocalPort 8000,5173,8765 -ErrorAction SilentlyContinue
Test-Path .\.venv\Scripts\python.exe
& .\.venv\Scripts\python.exe -m unittest discover -s local_bridge/tests -p 'test_*.py'
& .\.venv\Scripts\python.exe -m pip check
git diff --check
Get-ChildItem local_bridge/windows_approval/bin -Recurse -File -Include *.exe,*.dll
Get-ChildItem local_bridge/native_sha256_helper/bin -Recurse -File -Filter *.exe
Get-FileHash .runtime_tmp\digital_signature_ds3_g_b_poc\official-policy-v1_3.der -Algorithm SHA256
```

Saúde deve distinguir listener ausente, listener sem resposta e URL/protocolo incorreto. Não reiniciar backend/Vite para satisfazer o runbook. Não executar `CryptAcquireCertificatePrivateKey`, `GetRSAPrivateKey`, signer, `/sign` ou bridge durante a auditoria read-only.

Artefatos temporários são os diretórios `%TEMP%\brana-*`, PDFs de resultado temporários, logs de smoke e `bin/obj`. Em clone limpo, só considerar necessários os arquivos rastreados, o DER cuja proveniência esteja comprovada e binários reconstruídos. Pairing, clique WPF, acesso ao Store, PIN e qualquer chamada real exigem novo consentimento humano específico.

## 7. Mapa do worktree deste checkpoint

O status inicial contém alterações preexistentes do Editor de Textos, assinatura, backend, frontend React, `local_bridge`, storage e testes. Elas foram preservadas sem stash, reset, clean ou stage.

Itens explicitamente não classificados e não incluir em commit:

- arquivo literal `` `r`nexit ``;
- diretório `tmp/`.

Artefatos a excluir de commits:

- `bin/` e `obj/`;
- PDFs assinados e temporários;
- logs de execução;
- materiais TLS, ambientes virtuais, Store, certificados e chaves.

Os arquivos `local_bridge/` e seus testes já estavam no worktree antes deste checkpoint; este documento não os transforma em arquivos prontos para commit. O DER em `.runtime_tmp` deve ser tratado como gate de reprodutibilidade, não como dependência silenciosa.

## Revisão e encerramento

Revisão cruzada realizada contra `README.md`, `docs/00_master_guide.md`, `docs/02_arquitetura.md`, `docs/03_mapa_codigo.md`, `docs/06_seguranca.md`, `docs/10_continuidade.md`, o índice oficial, o código `local_bridge/` e os testes existentes. Contradições foram registradas como limites documentais; nenhum código foi corrigido nesta etapa.

`COMMIT/PUSH=NÃO`

## Reconciliação seletiva da etapa 4 — 2026-10-01

- Publicado anteriormente: `e79de047` (fechamento documental), `349f3041` (contratos/backend de identidade) e `8dab07e9` (fontes e testes do bridge/PKCS#12). Nenhum commit novo foi criado nesta reconciliação.
- `backend/main.py` permanece fora do commit porque o registro das rotas de certificado compartilha hunk com uma alteração independente de CORS; `routes/editor_textos_routes.py`, `editor_signature_anchor_service.py` e seus testes também permanecem fora até a separação dos hunks e a validação conjunta.
- Frontend Oasis permanece somente no PC: `package.json`/lock apontam para `vendor/oasis-editor-v0.0.191-source`, cujo contrato de pacote referencia `dist`; os artefatos de distribuição autorizados ainda não foram fechados com proveniência. `node_modules`, vendor bruto e gerados não foram incluídos.
- Scripts/diagnósticos mTLS não foram publicados nesta rodada: o bootstrap depende do pacote/runtime operacional e de ACLs protegidas que ainda não estão no Git; os testes locais dependem do mesmo ambiente descartável. Nenhum segredo, chave, certificado, dump, log ou staging foi incluído.
- O estado permanece **ETAPA 4 = PAUSADA / PARCIAL**. Retomada: separar os hunks de `main.py`, fechar a proveniência do `dist` Oasis, validar o pacote/runtime mTLS e somente então preparar novos commits seletivos.

## Smoke Oasis → WPF sem assinatura — 2026-09-26

- **PAIRING:** `PAIRING_REQUEST`, ID abreviado `nfWYT4jp…`, nonce abreviado `AXL7B67S…`; `ApproveClick`; POST `200`; GET autenticado `200`.
- **OPERAÇÃO:** `SIGNATURE_REQUEST`, ID abreviado `N0gIUUmT…`; `ApproveClick`; POST `200`; GET autenticado `200`, com o mesmo `operation_id` observado no frame e na rota.
- **SEGURANÇA:** `SIGN_ROUTE_CALLS=0`; nenhuma aquisição de Store, chave ou PIN; bridge/WPF temporários encerrados; porta 8765 livre.
- **APRESENTAÇÃO:** sucesso WPF passou a `role=status`, enquanto falhas permanecem em `role=alert`. Build React temporário não concluiu nesta execução: permaneceu em `transforming` e foi interrompido.

## Validação do build React — 2026-09-26

- **CAUSA DO APARENTE TRAVAMENTO:** não foi defeito reproduzido no código; o build estava processando o grafo real de 3.829 módulos, com uso elevado de memória durante Rollup/Vite. A execução anterior foi interrompida antes de concluir.
- **RESULTADO:** build temporário fora de `dist` concluído com sucesso em 2m13s, após `transforming`, `rendering chunks` e `computing gzip size`. Houve apenas o warning de chunks maiores que 500 kB.
- **TESTES:** os quatro testes Oasis pertinentes passaram (4/4); `git diff --check` passou. Backend 8000 e Vite HTTPS 5173 permaneceram preservados.

## Ligação operacional Oasis → Store-only — 2026-09-26

- **IMPLEMENTAÇÃO:** a ação `Assinar com certificado Windows` foi separada do formulário PFX/P12 e permanece condicionada a `VITE_ENABLE_LOCAL_SIGNATURE === 'true'`. O handler existente encadeia exportação do editor ativo, `prepareLocalPdf()`, pairing/aprovação WPF, operação/aprovação WPF, uma chamada `/sign`, recuperação de `/result`, validação e download.
- **PROVA:** testes sintéticos do contrato passaram; não houve assinatura real, bridge/WPF real, Store, chave ou PIN nesta etapa. O build React temporário passou.
- **PENDÊNCIA:** a flag não está ativa no Vite existente; a homologação no navegador e a assinatura real pelo botão continuam pendentes de ativação explícita e autorização separada.

## Diagnóstico e correção do mapa de geometria — 2026-09-26

- **DOCUMENTO REAL:** a aba atual concluiu `Preparação dev concluída`, sem pairing, operação ou `/sign`; o mapa coincidiu com `BranaSignature_1`.
- **CAUSA:** o coletor de `signatureBoxes` omitia `cursorY`, espaçamento e inset de borda; registrava `y=0` enquanto o desenho PDF estava em `y=377.745...`.
- **CORREÇÃO:** `frontend-react/vendor/oasis-editor-v0.0.191-source/src/export/pdf/exportEditorDocumentToPdf.ts` agora reproduz a posição usada por `drawBlockList` e `drawFragmentText`.
- **PROVA OFFLINE:** posições distintas, segunda página, terceira página após repaginação e alinhamento à direita produziram campo único, vazio, coincidente e sem token técnico.
- **CONTROLE NEGATIVO:** mapa que intersecta conteúdo externo continua rejeitado com `SIGNATURE_BOX_OVERLAPS_CONTENT`.
- **LIMITES:** multipágina/repaginação foram provas sintéticas offline; não houve assinatura nem acesso a Store/chave/PIN.

## Auditoria geométrica da tentativa Oasis aprovada — 2026-09-27

- **PDF final:** `C:\Users\Tel\Downloads\RECEITA_TEL_BRANA-assinado.pdf`, 234758 bytes, SHA-256 `ac95bf5be5a6c532496d0ac4abb45b07d0ab7f8ef371c803cb2699ba7d0c8623`.
- **Campo final:** `BranaSignature_1`, página 0, origem top-left `[346.846466, 300.535400, 566.846497, 372.535370]`; equivalente PDF bottom-left `[346.84648, 469.35466, 566.84650, 541.35460]`.
- **Artefatos disponíveis:** manifesto `C:\Users\Tel\Downloads\RECEITA_TEL_BRANA-geometry-diagnostic.json`, SHA-256 `ed9dbd387f193dd56d12d131526a3b6b76fe54950ed616b3ec689a1a0ddd397b`, ligado a PDF de SHA-256 `18af5d0ba836f2d6a8876eb6843b192c3ec71a103a691606d535b286fd212bfa`; esse PDF não contém `BranaSignature_1`.
- **Limite:** não foram localizados `signatureBoxes`, PDF preparado pré-assinatura ou trace ligados ao hash final. A preparação dev `[346.84647525, 377.74501037, 566.846475, 449.74501037]` pertence a outra execução; o primeiro ponto da mudança não é comprovável.
- Nenhuma nova exportação/preparação ou alteração de código/runtime foi feita.
