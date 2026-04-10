# aws/routes.py
from flask import Blueprint, request, jsonify, Response
from .services import list_lab_resources,_session, _delete_s3_buckets, _delete_iam_entities, _delete_cloudformation_stacks
from .IAM_Environment.deploy_IAM_enviroment import deployIAMEnvironment, getEnvironmentStatus
import threading

aws_bp = Blueprint("aws", __name__)

@aws_bp.route("/lab-resources", methods=["POST"])
def lab_resources():
    """Endpoint que recibe access_key, secret_key y region y devuelve los recursos etiquetados."""
    data = request.get_json(force=True)
    access_key = data.get("access_key")
    secret_key = data.get("secret_key")
    region = data.get("region", "us-east-1")

    if not all([access_key, secret_key]):
        return jsonify({"error": "access_key y secret_key son obligatorios"}), 400

    resources, error = list_lab_resources(access_key, secret_key, region)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"resources": resources})

@aws_bp.route("/delete-all-resources", methods=["DELETE"])
def delete_lab_resources():
    data = request.get_json(silent=True) or request.values
    access_key = data.get("access_key")
    secret_key = data.get("secret_key")
    region = data.get("region", "us-east-1")

    if not (access_key and secret_key):
        return jsonify({"error": "access_key y secret_key son obligatorios"}), 400

    sess = _session(access_key, secret_key, region)
    summary = {"deleted": [], "failed": []}

    _delete_s3_buckets(sess, summary)
    _delete_cloudformation_stacks(sess, summary)
    #_delete_iam_entities(sess, summary)

    summary["total_deleted"] = len(summary["deleted"])
    summary["total_failed"] = len(summary["failed"])
    return jsonify(summary)

@aws_bp.route("/deploy-iam-environment", methods=["POST"])
def deploy_iam_environment():
    data = request.get_json(force=True)
    access_key = data.get("access_key")
    secret_key = data.get("secret_key")
    region = data.get("region", "us-east-1")

    if not all([access_key, secret_key]):
        return jsonify({"error": "access_key y secret_key son obligatorios"}), 400

    def run_deployment():
        try:
            deployIAMEnvironment(access_key, secret_key, region)
        except Exception as e:
            # Puedes guardar logs, enviar alertas, etc.
            print(f"❌ Error en despliegue IAM: {e}")

    # 🔁 Ejecutar en segundo plano
    threading.Thread(target=run_deployment).start()

    return jsonify({"message": "Despliegue iniciado en segundo plano"}), 202

@aws_bp.route("/iam-environment-status", methods=["POST"])
def get_iam_environment_status():
    data = request.get_json(force=True)
    access_key = data.get("access_key")
    secret_key = data.get("secret_key")
    region = data.get("region", "us-east-1")
    if not all([access_key, secret_key]):
        return jsonify({"error": "access_key y secret_key son obligatorios"}), 400
    try:
        status = getEnvironmentStatus(access_key, secret_key, region)
        if not status:
            return jsonify({"error": "No se encontró el stack o no tiene etiquetas"}), 404
        return jsonify(status)
    except Exception as e:
        print(f"❌ Error al obtener el estado del entorno IAM: {e}")
        return jsonify({"error": str(e)}), 500

