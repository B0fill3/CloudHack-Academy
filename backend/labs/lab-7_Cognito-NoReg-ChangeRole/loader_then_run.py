import subprocess
import time
import signal
import os

# 1. Lanza la pantalla de carga
loader_proc = subprocess.Popen(["python", "loading_screen.py"])
time.sleep(2)  # da tiempo a que el servidor arranque

# 2. Ejecuta el despliegue de la infraestructura
try:
    subprocess.run(["python", "CloudFormation-Deploy.py"], check=True)
except subprocess.CalledProcessError as e:
    print("❌ Error en el despliegue:", e)
    loader_proc.terminate()
    exit(1)

# 3. Inicializa la base de datos
try:
    subprocess.run(["python", "-m", "app.db_init"], check=True)
except subprocess.CalledProcessError as e:
    print("❌ Error al inicializar la BD:", e)
    loader_proc.terminate()
    exit(1)

# 4. Cierra el loader
loader_proc.send_signal(signal.SIGINT)
loader_proc.wait()
time.sleep(2)

# 5. Lanza la app real
subprocess.run(["python", "run.py"])
