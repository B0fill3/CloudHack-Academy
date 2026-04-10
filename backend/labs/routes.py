# labs/routes.py

from flask import Blueprint, request, jsonify, Response
from .services import create_lab_service, create_lab_service_on_AWS,list_labs_service, remove_lab_service, list_available_labs, get_info_lab_by_id, is_lab_active


# 1. Crear el Blueprint
#    El primer parámetro "labs" es el nombre interno del blueprint.
#    El segundo, __name__, es el nombre del módulo donde se declara.
labs_bp = Blueprint("labs", __name__)

# 2. Definir rutas usando el Blueprint en lugar de "app"
@labs_bp.route("/start-lab/<lab_id>", methods=["POST"])
def create_lab(lab_id):
    # Ejemplo: crear un laboratorio con un nombre pasado en JSON


    if not lab_id:
        return jsonify({"error": "Debes proporcionar 'lab_id'"}), 400
    
    # Llamamos a la lógica de negocio en services.py
    result, status_code = create_lab_service(lab_id)
    return jsonify(result), status_code

@labs_bp.route("/start-lab-on-aws/<lab_id>", methods=["POST"])
def create_lab_aws(lab_id):
    print("Creando lab en AWS")
    print(request.get_json())
    # Ejemplo: crear un laboratorio con un nombre pasado en JSON
    if not lab_id:
        return jsonify({"error": "Debes proporcionar 'lab_id'"}), 400
    
    # Obtener el JSON de la petición
    data = request.get_json()
    if not data:
        return jsonify({"error": "Debes enviar un JSON en el cuerpo de la petición"}),

    # Comprobar que el JSON tenga los campos necesarios
    required_fields = ["access_key", "secret_key", "region"]
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({"error": f"El campo '{field}' es requerido"}), 400
    
    # Llamamos a la lógica de negocio en services.py
    result, status_code = create_lab_service_on_AWS(lab_id, data)
    return jsonify(result), status_code


@labs_bp.route("/running-labs", methods=["GET"])
def list_labs():
    # Llama a la función que obtiene todos los labs
    labs = list_labs_service()
    return jsonify(labs), 200

@labs_bp.route("/available-labs", methods=["GET"])
def available_labs():
    # Llama a la función que obtiene todos los labs
    labs = list_available_labs()
    return jsonify(labs), 200


@labs_bp.route("/<lab_id>", methods=["DELETE"])
def remove_lab(lab_id):
    # Elimina un lab según su nombre
    result, status_code = remove_lab_service(lab_id)
    return jsonify(result), status_code


@labs_bp.route("/is-active/<lab_id>", methods=["GET"])
def lab_active(lab_id):
    # Verifica si un lab está activo
    active = is_lab_active(lab_id)
    return jsonify({"active": active}), 200


@labs_bp.route("/<int:lab_id>", methods=["GET"])
def get_lab_info(lab_id):
    # Obtiene la información de un lab por su ID
    lab_info = get_info_lab_by_id(lab_id)
    if lab_info:
        return jsonify(lab_info), 200
    else:
        return jsonify({"error": "Lab no encontrado"}), 404