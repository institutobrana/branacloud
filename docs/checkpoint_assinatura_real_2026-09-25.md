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

Isso é prova local, não aprovação externa. `ITI_APPROVED = AGUARDANDO_RELATÓRIO`; o relatório ITI deve referir-se exatamente ao SHA-256 acima. O relatório do PDF anterior não pode ser transferido para este arquivo.

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

- O novo PDF aguarda o relatório VALIDAR/ITI para o hash exato; nenhuma aprovação ITI deve ser inferida da validação local.
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
Ação: obter relatório VALIDAR/ITI para esse hash.
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
