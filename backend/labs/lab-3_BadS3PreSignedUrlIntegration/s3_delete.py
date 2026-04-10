import os
import glob
import uuid
import boto3
from botocore.exceptions import ClientError




def delete_all_cloud_hacking_labs_resources():
    """
    Busca todos los buckets que tengan la etiqueta 'cloud-hacking-labs' y los elimina:
    1. Elimina todos los objetos y versiones dentro del bucket.
    2. Elimina el bucket en sí.
    """
    access_key = os.environ.get("CLOUD_LAB_ACCESS_KEY")
    secret_key = os.environ.get("CLOUD_LAB_SECRET")
    session_token = os.environ.get("CLOUD_LAB_TOKEN", None)
    region = os.environ.get("CLOUD_LAB_REGION", "us-east-1")

    if not access_key or not secret_key:
        raise ValueError("Las variables de entorno para las credenciales no están definidas.")

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token,
        region_name=region
    )

    try:
        # 1. Obtener la lista de todos los buckets
        buckets_response = s3_client.list_buckets()
        buckets = buckets_response.get("Buckets", [])

        for bucket in buckets:
            bucket_name = bucket["Name"]

            # 2. Intentar obtener las etiquetas del bucket
            try:
                tagging_response = s3_client.get_bucket_tagging(Bucket=bucket_name)
                tag_set = tagging_response.get("TagSet", [])
            except ClientError as e:
                # Si el bucket no tiene tags, 404, etc., lo ignoramos
                if e.response["Error"]["Code"] in ["NoSuchTagSet", "NoSuchBucket"]:
                    continue
                else:
                    raise

            # 3. Verificar si tiene la etiqueta "cloud-hacking-labs"
            has_lab_tag = any(t["Key"] == "cloud-hacking-labs" for t in tag_set)

            if has_lab_tag:
                print(f"Encontrado bucket con etiqueta 'cloud-hacking-labs': {bucket_name}")
                # 4. Eliminar objetos y versiones (en caso de que tenga versioning)
                delete_bucket_contents(s3_client, bucket_name)

                # 5. Eliminar el bucket
                s3_client.delete_bucket(Bucket=bucket_name)
                print(f"Bucket eliminado: {bucket_name}")

    except ClientError as e:
        print(f"Error al eliminar buckets etiquetados con 'cloud-hacking-labs': {e}")
        raise


def delete_bucket_contents(s3_client, bucket_name):
    """
    Elimina todos los objetos de un bucket. Maneja también versiones si el bucket tiene versioning.
    """
    # 1. Revisar si el bucket tiene versioning
    try:
        versioning = s3_client.get_bucket_versioning(Bucket=bucket_name)
        is_versioned = versioning.get("Status") == "Enabled"
    except ClientError:
        is_versioned = False

    if is_versioned:
        # Eliminar versiones
        paginator = s3_client.get_paginator("list_object_versions")
        for page in paginator.paginate(Bucket=bucket_name):
            versions = page.get("Versions", [])
            delete_markers = page.get("DeleteMarkers", [])

            # Crear lista para delete_objects
            objects_to_delete = []
            for version_info in versions + delete_markers:
                objects_to_delete.append(
                    {
                        "Key": version_info["Key"],
                        "VersionId": version_info["VersionId"]
                    }
                )

            if objects_to_delete:
                s3_client.delete_objects(
                    Bucket=bucket_name,
                    Delete={"Objects": objects_to_delete}
                )
        print(f"Se eliminaron todas las versiones y marcadores de borrado en {bucket_name}")
    else:
        # Eliminar objetos no versionados
        paginator = s3_client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket_name):
            objects = page.get("Contents", [])
            if objects:
                keys = [{"Key": obj["Key"]} for obj in objects]
                s3_client.delete_objects(Bucket=bucket_name, Delete={"Objects": keys})
        print(f"Se eliminaron todos los objetos en {bucket_name}")


if __name__ == "__main__":
    # Ejemplo de uso: crear un bucket y luego borrarlo.
    #create_private_s3_bucket_and_upload_images()
    delete_all_cloud_hacking_labs_resources()
