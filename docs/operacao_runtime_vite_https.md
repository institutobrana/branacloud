# Runtime local Vite

Para testes do frontend React, verificar antes a porta `5173` com `netstat -ano | findstr :5173`.

O Vite local deve usar HTTPS e reutilizar um listener HTTPS válido; não iniciar uma segunda instância nem encerrar `node.exe` genericamente. Com a porta livre, `npm run dev` resolve automaticamente os certificados em `%LOCALAPPDATA%\BranaCloude\https\localhost-lan.pem` e `%LOCALAPPDATA%\BranaCloude\https\localhost-lan-key.pem`. Se houver um listener HTTP inválido, identificar o PID e encerrar somente esse processo.
