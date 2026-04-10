import os
import glob
import boto3
import uuid
from botocore.exceptions import ClientError


def create_private_s3_bucket_and_upload_images():
    """
    Crea un bucket S3 con un nombre aleatorio, lo etiqueta con 'cloud-hacking-labs',
    lo hace privado y sube todos los archivos de static/images/ con ACL privada.
    """
    # 1. Leer variables de entorno
    access_key = os.environ.get("CLOUD_LAB_ACCESS_KEY")
    secret_key = os.environ.get("CLOUD_LAB_SECRET")
    region = os.environ.get("CLOUD_LAB_REGION", "us-east-1")
    #session_token = os.environ.get("CLOUD_LAB_TOKEN", None)

    if not access_key or not secret_key:
        raise ValueError("Las variables de entorno para las credenciales no están definidas.")

    # 2. Crear cliente S3 con boto3
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        #aws_session_token=session_token,
        region_name=region
    )

    # 3. Generar nombre de bucket único (sufijo UUID)
    bucket_name = f"cloud-lab-bucket-{str(uuid.uuid4())}"

    try:
        # 4. Crear el bucket. us-east-1 no usa CreateBucketConfiguration
        if region == "us-east-1":
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={"LocationConstraint": region}
            )
        print(f"Se ha creado el bucket: {bucket_name}")

        # 5. Hacerlo privado (bloquear ACLs/políticas públicas)
        s3_client.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True
            }
        )

        # 6. Agregar etiqueta 'cloud-hacking-labs'
        s3_client.put_bucket_tagging(
            Bucket=bucket_name,
            Tagging={
                "TagSet": [
                    {
                        "Key": "cloud-hacking-labs",
                        "Value": "true"
                    }
                ]
            }
        )
        print(f"Se ha asignado la etiqueta 'cloud-hacking-labs' al bucket '{bucket_name}'")

        # 7. Subir imágenes de static/images con ACL privada
        images = glob.glob("app/static/images/*")
        if not images:
            print("No se encontraron imágenes en 'static/images/'. Subida omitida.")
        else:
            for image_path in images:
                object_name = "images/" + os.path.basename(image_path)
                print(f"Subiendo: {image_path} -> s3://{bucket_name}/{object_name}")
                s3_client.upload_file(
                    image_path,
                    bucket_name,
                    object_name,
                    ExtraArgs={"ACL": "private"}
                )

        print(f"¡Bucket '{bucket_name}' creado y archivos subidos correctamente!")

        # 8. Crear y subir el archivo credentials.txt
        credentials_content = "admin:OrYoFTersIsA"
        credentials_filename = "credentials.txt"

        # Guardar el archivo temporalmente en el sistema de archivos
        with open(credentials_filename, "w") as f:
            f.write(credentials_content)

        # Subirlo al bucket
        print(f"Subiendo {credentials_filename} a s3://{bucket_name}/{credentials_filename}")
        s3_client.upload_file(
            credentials_filename,
            bucket_name,
            credentials_filename,
            ExtraArgs={"ACL": "private"}
        )

        # (Opcional) Eliminar el archivo local temporal
        os.remove(credentials_filename)

        return bucket_name

    except ClientError as e:
        print(f"Ocurrió un error al crear o configurar el bucket: {e}")
        raise
    


if __name__ == "__main__":
    bucket_name = create_private_s3_bucket_and_upload_images()

    if bucket_name:
        # Guardar archivo con el nombre del bucket
        with open("bucket_name.txt", "w") as f:
            f.write(bucket_name)
        print(f"Nombre del bucket guardado en 'bucket_name.txt'")
    else:
        print("No se pudo crear el bucket. Ver errores anteriores.")
