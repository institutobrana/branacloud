# Canal mTLS isolado do Brana Cloude

`backend/isolated_mtls_service.py` é um entrypoint separado e não é carregado
por `backend/main.py`. Ele expõe somente `bind-installation` e `consume` em
um listener TLS dedicado. O cliente deve apresentar certificado no handshake;
headers não são usados como identidade.

Configuração obrigatória, fornecida apenas ao processo local protegido:

```text
BRANA_MTLS_DATABASE_URL=postgresql+psycopg2://...
BRANA_MTLS_CA_CERT=C:\ProgramData\BranaCloude\mtls\server\ca-trust.crt
BRANA_MTLS_SERVER_CERT=C:\segredo\server.crt
BRANA_MTLS_SERVER_KEY=C:\segredo\server.key
BRANA_MTLS_BIND=0.0.0.0:8766
```

## Contratos de topologia

Na máquina atual, o PostgreSQL permanece no listener `5432` e o backend em
`8000`. O bridge local escuta apenas `127.0.0.1:8765`; para alcançar o
serviço mTLS local, o launcher deve receber `BRANA_MTLS_ENDPOINT` apontando
para o nome/IP local do serviço e a porta dedicada configurada no processo
(por exemplo, `https://127.0.0.1:8766`). O certificado do servidor deve ter
SAN para o nome/IP usado no endpoint; `localhost` só é válido quando o
endpoint realmente usa `localhost`.

Para outra máquina Windows, o bridge deve usar um nome DNS interno ou IP
privado alcançável, por exemplo `https://brana-mtls.interno:8766`, e o
certificado do servidor deve conter esse DNS/IP no SAN. O cliente instala a
CA confiável localmente e apresenta seu próprio certificado mTLS e chave
protegida; o fingerprint DER desse certificado é registrado no PostgreSQL
como uma instalação `ACTIVE`. O endpoint não deve ser publicado na internet:
firewall deve permitir somente o endereço do bridge e a porta dedicada.
Ainda não foi comprovada nesta máquina a rota de rede entre uma segunda
máquina Windows e esse listener, nem a regra de firewall correspondente.

O launcher obtém `BRANA_MTLS_ENDPOINT` por parâmetro/configuração local e
recusa endpoint que não seja `https://`. `httpx` usa o contexto TLS com CA e
certificado cliente; não há `verify=False`, fallback por header ou identidade
em JSON. O serviço deriva a instalação do certificado efetivamente apresentado
no handshake e consulta o PostgreSQL em cada chamada.

O PostgreSQL é a única fonte de verdade para `installation_id`, fingerprint
SHA-256 do DER apresentado no TLS, geração, validade e eventos. `registry.json`
não é consultado pelo entrypoint e headers HTTP nunca são autoridade.

Antes de abrir o listener, o serviço valida conectividade, as duas tabelas,
as colunas obrigatórias e a existência de uma instalação `ACTIVE`.

Pré-voo somente leitura:

```powershell
$env:PYTHONPATH='backend'
& '.venv\Scripts\python.exe' backend\scripts\mtls_preflight.py --database-url $env:BRANA_MTLS_DATABASE_URL
```

O comando não executa DDL/DML nem `create_all`. Ele falha fechado para schema
ausente/incompatível, duplicidades ou ausência de instalação ativa.

Provisionamento futuro deve criar CA, certificado do servidor e certificado
da instalação em armazenamento protegido separado do certificado/chave de
assinatura; registrar somente o fingerprint público no PostgreSQL; aplicar
ACL mínima ao processo; e registrar eventos de cadastro, rotação e revogação.
Após revogação, a chamada seguinte deve consultar novamente o PostgreSQL.
Rotação incrementa `generation` e rejeita o DER anterior sem janela implícita.

Teste descartável:

```powershell
$env:PYTHONPATH='backend'
$env:BRANA_MTLS_*='...'
python -m backend.isolated_mtls_service
```

O listener 8000 não é alterado. A ativação futura exige ambiente dedicado
para `requirements-mtls.txt`, endpoint TLS distinto e restrito ao bridge,
firewall/rede interna, ACLs verificadas e provisionamento protegido desses
arquivos. Nenhuma credencial efêmera dos testes serve como credencial
operacional.

`backend/requirements-mtls.txt` fixa as dependências diretas do canal, mas
herda `backend/requirements.txt`, que ainda contém `cryptography>=41.0.0` e
dependências transitivas de `uvicorn[standard]` sem lock/hash completo.
Portanto o empacotamento operacional ainda não é reprodutível no sentido
estrito; é necessário gerar e revisar um lock com hashes em ambiente de
build antes da instalação permanente.

## Bootstrap do serviço Windows

O processo Python não é, sozinho, um host do Service Control Manager. O
bootstrap preparado usa um wrapper WinSW fornecido pelo administrador; ele
instala o serviço `BranaCloudeMtls` inicialmente desabilitado e não inicia o
processo. O wrapper deve ser obtido e verificado fora do repositório. O
script não recebe URL, senha, certificado ou chave como argumento e não gera
material criptográfico.

A chave privada da CA permanece em `ca`, acessível somente à administração de
provisionamento. O certificado público da CA usado para validar clientes deve
ser copiado pelo administrador para `server\ca-trust.crt`; ele não é segredo e
herda a ACL do diretório do servidor. Assim o processo valida a cadeia sem
receber acesso à chave de emissão.

Inspeção sem escrita (PowerShell):

```powershell
& .\backend\scripts\bootstrap_mtls_service.ps1 -PackageRoot C:\Admin\BranaCloude\mtls-staging
& .\backend\scripts\verify_mtls_service.ps1
```

Aplicação única, somente em PowerShell elevado, após conferir a saída de
inspeção:

```powershell
& .\backend\scripts\bootstrap_mtls_service.ps1 -Apply `
  -PythonPath 'C:\Program Files\BranaCloude\runtime\Scripts\python.exe' `
  -PythonRoot 'C:\Program Files\BranaCloude\runtime' `
  -PackageRoot C:\Admin\BranaCloude\mtls-staging `
  -ApplicationRoot 'C:\Program Files\BranaCloude\app'
```

O pacote deve conter `WinSW-x64.exe`,
`requirements-mtls-windows-py310.lock`, o diretório `wheels` e um manifesto
com hashes. O bootstrap cria `C:\Program Files\BranaCloude\runtime` com
`py -3.10 -m venv` e instala exclusivamente desse pacote com
`--no-index --require-hashes`; ele não copia um ambiente virtual existente.

O modo `-Apply` exige administrador, Python e wrapper existentes, identidade
resolvível e serviço ausente; cria apenas os diretórios `ca`, `server` e
`client`, registra o snapshot ACL em `bootstrap-state.json`, aplica ACLs
mínimas e chama o SCM com `start= disabled`. Ele falha se encontrar estado
parcial ou um serviço pré-existente, em vez de sobrescrevê-los. A aplicação
é, portanto, idempotente por verificação: uma segunda execução não modifica
um bootstrap completo e deve ser tratada como estado já aplicado pelo
operador.

Reversão somente do bootstrap, sem apagar material preexistente:

```powershell
sc.exe stop BranaCloudeMtls
sc.exe delete BranaCloudeMtls
```

Depois, remova apenas o wrapper, XML e `bootstrap-state.json` criados nesta
operação, preservando `ca`, `server`, `client` e qualquer arquivo que não
tenha sido criado pelo bootstrap. O verificador é somente leitura e mostra
conta, estado, diretórios, proprietário, herança e ACEs; não expõe segredos.
