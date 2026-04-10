FROM python:3.9-slim

# Instalar dependencias del sistema (incluyendo wkhtmltopdf) y limpiar caché
RUN apt-get update && apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar el archivo de requerimientos y instalar las dependencias de Python
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación
COPY . .

EXPOSE 5001

# Comando para inicializar la BD y lanzar la aplicación Flask
CMD ["sh", "-c", "python -m app.db_init && python run.py"]
