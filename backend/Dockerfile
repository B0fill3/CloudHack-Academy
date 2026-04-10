FROM python:3.11-slim

# Instalar curl para descargar docker-compose
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar docker-compose v2 (mismo nombre que v1 para compatibilidad con el código)
RUN ARCH=$(uname -m) && \
    curl -fsSL "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-${ARCH}" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5005

CMD ["python", "app.py"]
