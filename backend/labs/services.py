# labs/services.py
from docker.errors import DockerException, NotFound
import docker
import json
import os
import subprocess
import glob
import threading
from pathlib import Path
from collections import defaultdict

LOCALSTACK_IMAGE = "localstack/localstack"

def create_lab_service(lab_id):
    client = docker.from_env()
    try:
        existing = client.containers.list(all=True, filters={"label": "lab=true"})
        if existing:
            remove_all_labs_service()
            
        print("Creando laboratorio...")
        # 1. Construye el patrón de carpeta, ej: lab-5_* para ID=5
        pattern = f"labs/lab-{lab_id}_*"
        print(f"Buscando laboratorios con el patrón '{pattern}'...")
        
        # 2. Busca todas las carpetas que coincidan con lab-<id>_*
        matching_folders = glob.glob(pattern)
        
        if not matching_folders:
            print(f"No se encontró ninguna carpeta con el patrón '{pattern}'.")
            return {"error": f"No se encontró laboratorio con ID '{lab_id}'"}, 404

        # 3. Supondremos que tomamos la primera carpeta que coincida
        lab_folder = matching_folders[0]
        compose_file = os.path.join(lab_folder, "docker-compose.yml")

        # 4. Verificar si existe el archivo docker-compose.yml dentro de esa carpeta
        if not os.path.isfile(compose_file):
            print(f"No existe docker-compose.yml en '{lab_folder}'.")
            return {"error": f"No se encontró archivo 'docker-compose.yml' en '{lab_folder}'"}, 404

        # 5. Ejecutar docker-compose up --build usando subprocess
        try:
            subprocess.run([
                "docker-compose",
                "-f", compose_file,
                "up",
                "--build",
                "-d" # Detached mode para ejecutar en segundo plano
            ], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error al ejecutar docker-compose: {e}")
        else:
            print(f"Se ha ejecutado correctamente el docker-compose de '{lab_folder}'.")

        return {
            "message": f"Laboratorio '{lab_id}' creado.",
            "url": f"http://localhost:5001"
        }, 201

    except DockerException as e:
        return {"error": str(e)}, 500


def create_lab_service_on_AWS(
    lab_id,
    data
):
    client = docker.from_env()
    try:
        existing = client.containers.list(all=True, filters={"label": "lab=true"})
        if existing:
            remove_all_labs_service()

        print("Creando laboratorio...")
        pattern = f"labs/lab-{lab_id}_*"
        print(f"Buscando laboratorios con el patrón '{pattern}'...")

        matching_folders = glob.glob(pattern)

        if not matching_folders:
            print(f"No se encontró ninguna carpeta con el patrón '{pattern}'.")
            return {"error": f"No se encontró laboratorio con ID '{lab_id}'"}, 404

        lab_folder = matching_folders[0]
        compose_file = os.path.join(lab_folder, "docker-compose.yml")

        if not os.path.isfile(compose_file):
            print(f"No existe docker-compose.yml en '{lab_folder}'.")
            return {"error": f"No se encontró archivo 'docker-compose.yml' en '{lab_folder}'"}, 404

        # Construir entorno con herencia del actual + variables personalizadas
        env = os.environ.copy()
        env.update({
            "CLOUD_LAB_ACCESS_KEY": data["access_key"],
            "CLOUD_LAB_SECRET": data["secret_key"],
            "CLOUD_LAB_REGION": data["region"]
        })

        subprocess.Popen([
            "docker-compose",
            "-f", compose_file,
            "up",
            "--build",
            "-d"
        ], env=env)

        print(f"Se ha ejecutado correctamente el docker-compose de '{lab_folder}'.")

        return {
            "message": f"Laboratorio '{lab_id}' creado.",
            "url": "http://localhost:5001"
        }, 201

    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar docker-compose: {e}")
        return {"error": "Fallo al ejecutar docker-compose"}, 500



def list_labs_service():
    client = docker.from_env()
    
    # Obtener todos los contenedores en ejecución
    containers = client.containers.list()

    labs_info = []
    
    for c in containers:
        c.reload()

        # Filtrar solo contenedores que tengan el tag "lab" = true
        if not c.labels.get("lab") == "true":
            continue  # Solo considera contenedores con el tag "lab" = true

        # Obtener mapeo de puertos
        port_mapping = c.attrs["NetworkSettings"]["Ports"]
        ports = []

        # Recorrer todos los puertos expuestos
        for container_port, host_mapping in port_mapping.items():
            if host_mapping:
                for mapping in host_mapping:
                    ports.append(mapping["HostPort"])
        
        # Guardar la información del laboratorio
        labs_info.append({
            "name": c.name,
            "id": c.id,
            "ports": ports,  # Ahora contiene TODOS los puertos
            "lab_id": c.labels.get("lab_id")  # Guardar la información de la etiqueta lab_id
        })

    return labs_info


def remove_lab_service(lab_id):
    client = docker.from_env()
    try:
        containers = client.containers.list(all=True, filters={"label": f"lab_id={lab_id}"})
        if not containers:
            return {"error": f"No existe laboratorio con lab_id '{lab_id}'"}, 404

        def stop_and_remove(container):
            container.stop()
            container.remove()

        threads = []
        for container in containers:
            thread = threading.Thread(target=stop_and_remove, args=(container,))
            thread.start()
            threads.append(thread)


        return {"message": f"Laboratorio(s) con lab_id '{lab_id}' eliminado(s)"}, 200
    except DockerException as e:
        return {"error": str(e)}, 500
    
def is_lab_active(lab_id):
    client = docker.from_env()
    # Se listan todos los contenedores para poder comprobar estados intermedios
    containers = client.containers.list(all=True)
    
    for container in containers:
        if container.labels.get("lab_id") == lab_id:
            container.reload()  # Actualiza la información del contenedor
            state = container.attrs.get("State", {})
            status = state.get("Status")
            # Devuelve True si el contenedor está corriendo o en proceso de detenerse
            if status in ("running", "removing"):
                return True
    return False
    
def remove_all_labs_service():
    client = docker.from_env()
    try:
        containers = client.containers.list(all=True, filters={"label": "lab=true"})
        if not containers:
            return {"message": "No hay laboratorios para eliminar"}, 200

        for container in containers:
            container.stop()
            container.remove()

        return {"message": "Todos los laboratorios han sido eliminados"}, 200
    except DockerException as e:
        return {"error": str(e)}, 500
    

def list_available_labs():
    """
    Devuelve un diccionario agrupado por topics con todos los LabInfo.json
    encontrados en subdirectorios que comiencen por 'lab'.
    {
        "Amazon Cognito": [ {...}, {...} ],
        "IAM": [ {...}, {...} ],
        ...
    }
    """
    base_dir = Path(__file__).resolve().parent
    labs_by_topic = defaultdict(list)

    try:
        # 1. Buscar carpetas que empiecen por 'lab'
        for lab_dir in base_dir.iterdir():
            if lab_dir.is_dir() and lab_dir.name.lower().startswith("lab"):
                info_file = lab_dir / "LabInfo.json"
                if not info_file.exists():
                    continue  # ignorar carpetas sin LabInfo.json

                # 2. Leer LabInfo.json
                with info_file.open("r", encoding="utf-8") as f:
                    try:
                        lab_data = json.load(f)
                    except json.JSONDecodeError:
                        return {"error": f"Error al decodificar '{info_file}'"}, 500

                # 3. Extraer y eliminar 'topic', luego agrupar
                topic = lab_data.pop("topic", "Otros")
                labs_by_topic[topic].append(lab_data)

        # 4. Convertir defaultdict a dict normal y orden opcional por id
        result = {topic: sorted(labs, key=lambda x: x.get("id", 0))
                  for topic, labs in labs_by_topic.items()}

        return result if result else ({"error": "No se encontraron laboratorios"}, 404)

    except Exception as e:
        # Error inesperado
        return {"error": f"Excepción inesperada: {e}"}, 500


def get_info_lab_by_id(lab_id) :
    """
    Devuelve la información de un laboratorio concreto tomando el ID y
    leyendo el LabInfo.json dentro de la carpeta lab-<ID>.

    Parámetros
    ----------
    lab_id : int | str
        Identificador del laboratorio (p. ej. 7 → carpeta 'lab-7').

    Retorna
    -------
    tuple : (dict, int)
        - dict  → LabInfo.json o mensaje de error
        - int   → Código HTTP simulado (200, 404, 500)
    """
    base_dir = Path(__file__).resolve().parent
    prefix   = f"lab-{lab_id}"

    # 1. Encontrar directorios que empiecen por el prefijo
    matching_dirs = sorted(
        d for d in base_dir.iterdir()
        if d.is_dir() and d.name.startswith(prefix)
    )

    if not matching_dirs:
        return {"error": f"No se encontró ningún directorio que empiece por '{prefix}'"}, 404

    # Tomar el primero (o decide alguna otra política)
    lab_dir = matching_dirs[0]
    info_path = lab_dir / "LabInfo.json"

    # 2. Leer LabInfo.json
    try:
        with info_path.open("r", encoding="utf-8") as f:
            lab_info = json.load(f)
        return lab_info

    except FileNotFoundError:
        return {"error": f"No se encontró 'LabInfo.json' en '{lab_dir.name}'"}, 404
    except json.JSONDecodeError:
        return {"error": f"Error al decodificar '{info_path.name}'"}, 500
    except Exception as exc:
        return {"error": f"Excepción inesperada: {exc}"}, 500