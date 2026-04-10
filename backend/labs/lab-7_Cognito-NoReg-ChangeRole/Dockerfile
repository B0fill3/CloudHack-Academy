FROM python:3.9

# Crea el directorio de trabajo
WORKDIR /app

# Copia el contenido del proyecto
COPY . /app

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto 5000
EXPOSE 5001

# Inicializa la BD y arranca la app
CMD ["sh", "-c", "python loader_then_run.py"]