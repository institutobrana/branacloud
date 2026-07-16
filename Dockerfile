FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app/backend

# Dependencias Python primeiro para aproveitar cache de camadas.
COPY backend/requirements.txt /app/backend/requirements.txt
RUN python -m pip install --upgrade pip \
    && pip install -r /app/backend/requirements.txt

# Runtime do backend depende do frontend legado, assets e arquivos de apoio.
COPY backend /app/backend
COPY frontend /app/frontend
COPY assets /app/assets
COPY storage/modelos/base /app/storage/modelos/base
COPY backend/scripts /app/scripts

# Diretórios efêmeros necessários para execuções locais em Linux.
RUN mkdir -p /app/backend/tmp/editor_textos \
    /app/storage/modelos/clinicas \
    /app/backups \
    && chmod -R u+rwX /app/backend/tmp \
    && useradd --create-home --shell /bin/sh brana \
    && chown -R brana:brana /app

USER brana

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
