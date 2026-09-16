# Inventario de arquivos externos

## Resumo de diret?rios

- storage/modelos/base: categoria=ESTATICO_VERSIONADO, arquivos=59, bytes=632818, runtime=Imagem Docker e repo, docker=Sim, persist=Nao, destino=Docker image + repo
- storage/modelos/clinicas: categoria=DOCUMENTO_CLINICO, arquivos=260, bytes=176214165, runtime=Persistente por clinica, docker=Nao, persist=Sim, destino=S3 ou EFS com isolamento por clinica
- assets: categoria=ESTATICO_VERSIONADO, arquivos=1519, bytes=7231009, runtime=Imagem Docker, docker=Sim, persist=Nao, destino=Docker image
- frontend-react/public/assets: categoria=ESTATICO_VERSIONADO, arquivos=424, bytes=1250820, runtime=Frontend build/public, docker=Sim, persist=Nao, destino=Frontend build/Docker image
- uploads: categoria=ARQUIVO_TEMPORARIO, arquivos=0, bytes=0, runtime=Efemero, docker=Nao, persist=Nao, destino=N/A

## Observa??es

- `storage/modelos/base` e `assets` s?o recursos est?ticos/versionados e podem seguir na imagem Docker.
- `storage/modelos/clinicas` cont?m conte?do por cl?nica e deve sair da imagem para armazenamento persistente.
- `frontend-react/public/assets` ? conte?do est?tico do frontend e n?o deve ser tratado como upload de usu?rio.
- `uploads` n?o existe localmente nesta ?rvore.
