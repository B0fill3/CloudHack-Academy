import boto3
import os
from flask import current_app
from botocore.config import Config
from app import app



def generate_presigned_url_s3(key, method='get_object'):
    """
    Genera una URL prefirmada para un objeto en S3.
    Por defecto, crea una URL para realizar GET (descarga) del objeto.
    Si se especifica method='put_object', se crea una URL para subir/añadir el objeto.

    :param key: Clave (ruta) dentro del bucket, p.ej. "images/zapatilla1.jpg"
    :param method: Acción de S3 a prefirmar ('get_object' o 'put_object'). 
                   Por defecto, 'get_object'.
    :return: La URL prefirmada (str) o None si ocurre un error
    """

    # Configuración de S3
    bucket_name = current_app.config['S3_BUCKET_NAME']  # configurado en app/__init__.py
    aws_access_key_id = os.environ.get("CLOUD_LAB_ACCESS_KEY")
    aws_secret_access_key = os.environ.get("CLOUD_LAB_SECRET")
    region_name = os.environ.get("CLOUD_LAB_REGION", "us-east-1")
  

    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name,
        config=Config(
            signature_version='s3v4',
            s3={'addressing_style': 'path'}
        )
    )

    try:
        presigned_url = s3_client.generate_presigned_url(
            method,
            Params={'Bucket': bucket_name, 'Key': key},
            ExpiresIn=3600  # 1 hora
        )
        current_app.logger.info(f"URL generada ({method}): {presigned_url}")
        return presigned_url

    except Exception as e:
        current_app.logger.error(f"Error generando presigned URL: {e}")
        return None




