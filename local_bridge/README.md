# Brana Local Bridge

PoC da ponte local Windows para assinatura digital com certificado instalado na maquina.

## Objetivo da fase atual

Esta versao da ponte local ja consegue:

1. subir corretamente em `localhost`
2. listar os certificados instalados no repositorio `CurrentUser\\My` do Windows
3. assinar PDF usando o certificado instalado no Windows, sem enviar o PFX ao backend do SaaS

## Endpoints disponiveis

- `GET /health`
- `GET /certificados`
- `POST /assinar-pdf`

## Como executar

No Windows, a partir da pasta `saas/local_bridge`:

```powershell
..\venv_saas\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8765
```

## O que validar nesta fase

- A rota `http://127.0.0.1:8765/health` responde `ok`
- A rota `http://127.0.0.1:8765/certificados` lista o certificado instalado do usuario atual
- O fluxo do editor de textos consegue assinar PDF usando o certificado instalado no Windows
- O certificado correto aparece com:
  - `subject`
  - `issuer`
  - `thumbprint`
  - `has_private_key`
