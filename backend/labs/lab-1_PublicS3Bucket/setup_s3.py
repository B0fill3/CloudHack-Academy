import boto3
import os
import json

# Variables de entorno (valores por defecto para LocalStack)
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID", "test")
SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "test")
REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
ENDPOINT_URL = os.getenv("LOCALSTACK_ENDPOINT", "http://localstack:4566")

BUCKET_NAME = "my-public-bucket"

s3_client = boto3.client(
    "s3",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name=REGION,
    endpoint_url=ENDPOINT_URL
)

def create_and_configure_bucket(bucket_name=BUCKET_NAME):
    # 1. Crear el bucket (si ya existe, podría lanzar excepción; maneja según tu caso)
    s3_client.create_bucket(Bucket=bucket_name)
    print(f"Bucket '{bucket_name}' creado.")

    # 2. Definir política pública
    policy = {
        "Version": "2008-10-17",
        "Statement": [
            {
                "Sid": "PublicReadForObjectsOnly",
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
            }
        ]
    }

    # 3. Asignar la política al bucket para simular que es público
    s3_client.put_bucket_policy(
        Bucket=bucket_name,
        Policy=json.dumps(policy)
    )
    print(f"Política pública aplicada al bucket '{bucket_name}'.")

def upload_images(bucket_name=BUCKET_NAME):
    # Ejemplo: sube varios archivos de la carpeta 'images/' a S3
    # Ajusta la ruta según tu estructura
    local_images = [
        "nikeairmax.webp",
        "adidasultraboost.jpg",
        "pumarsx.webp",
        "reebokclassic.jpg",
        "newbalance574.jpg",
        "conversechucktaylor.jpg",
        "vansoldskool.jpg",
        "asicsgelkayano.jpg",
        "jordan1retro.jpg",
        "underarmourhovr.jpg"
    ]
    for img in local_images:
        local_path = os.path.join("app/static/images", img)  # ruta local
        s3_key = "images/" + img  # nombre de archivo en el bucket

        # Verificar que el archivo existe localmente
        if not os.path.exists(local_path):
            print(f"Archivo {local_path} no encontrado. Skipping.")
            continue

        s3_client.upload_file(local_path, bucket_name, s3_key)
        print(f"Subido {img} a s3://{bucket_name}/{s3_key}")

    # Subir archivo de credenciales
    s3_client.upload_file(
        "app/static/credentials.txt",
        bucket_name,
        "credentials.txt"
    )
    print(f"Subido credentials.txt a s3://{bucket_name}/")
    
if __name__ == "__main__":
    print("Comenzando configuración de S3 en LocalStack...")
    create_and_configure_bucket()
    upload_images()
    print("¡Setup de S3 completado con éxito!")
