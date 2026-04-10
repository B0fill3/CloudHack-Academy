import time
from pathlib import Path
import boto3
from botocore.exceptions import ClientError, WaiterError
from typing import Dict, List
import os 

def deployLabEnvironment(access_key: str, secret_key: str, region:str="us-east-1"):
    """
    Despliega el stack CloudFormation 'iam-lab' usando credenciales
    y una plantilla que primero se sube a S3.
    """

    # ──────────────────────────────────────────────────────────────
    # 1. Comprobar parámetros
    # ──────────────────────────────────────────────────────────────
    if not access_key or not secret_key:
        raise SystemExit("❌  Debes proporcionar access_key y secret_key")

    # ──────────────────────────────────────────────────────────────
    # 2. Sesión boto3
    # ──────────────────────────────────────────────────────────────
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )

    s3  = session.client("s3")
    cf  = session.client("cloudformation")
    sts = session.client("sts")

    # ──────────────────────────────────────────────────────────────
    # 3. Datos del stack/plantilla
    # ──────────────────────────────────────────────────────────────
    STACK_NAME    = "iam-privilege-scalation-passrole"
    TEMPLATE_FILE = Path("./CloudFormation-Template.yml")

    account_id = sts.get_caller_identity()["Account"]
    bucket_name = f"cloudformation-lab-templates-{account_id}-{region}"
    object_key  = f"{STACK_NAME}/{int(time.time())}.yml"

    # ──────────────────────────────────────────────────────────────
    # 4. Asegurar bucket S3 (si no existe, crearlo)
    # ──────────────────────────────────────────────────────────────
    try:
        s3.head_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} ya existe.")
    except ClientError:
        print(f"Creando bucket {bucket_name}…")
        # 1. Crear el bucket
        create_kwargs = {"Bucket": bucket_name}
        if region != "us-east-1":
            create_kwargs["CreateBucketConfiguration"] = {"LocationConstraint": region}

        s3.create_bucket(**create_kwargs)

        # 2. Añadir los tags
        s3.put_bucket_tagging(
            Bucket=bucket_name,
            Tagging={
                "TagSet": [
                    {"Key": "cloud-hacking-labs", "Value": "IAM-Privilege-Scalation-Lab-AccessKey"},
                ]
            }
        )

        # 3. Bloquear acceso público
        s3.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
        )


    # ──────────────────────────────────────────────────────────────
    # 5. Subir plantilla
    # ──────────────────────────────────────────────────────────────
    print("Subiendo plantilla a S3…")
    s3.upload_file(
        Filename=str(TEMPLATE_FILE),
        Bucket=bucket_name,
        Key=object_key,
    )

    template_url = (
        f"https://{bucket_name}.s3.{region}.amazonaws.com/{object_key}"
        if region != "us-east-1"
        else f"https://{bucket_name}.s3.amazonaws.com/{object_key}"
    )
    print("TemplateURL:", template_url)

    # ──────────────────────────────────────────────────────────────
    # 6. Crear el stack con esa TemplateURL
    # ──────────────────────────────────────────────────────────────
    try:
        print(f"Creando stack {STACK_NAME}…")
        cf.create_stack(
            StackName   = STACK_NAME,
            TemplateURL = template_url,
            Parameters  = [
                {"ParameterKey": "AccountId", "ParameterValue": account_id}
            ],
            Capabilities= ["CAPABILITY_NAMED_IAM"],
            Tags        = [{"Key": "cloud-hacking-labs", "Value": "IAM-Privilege-Scalation-Lab-AccessKey"}],
        )

        waiter = cf.get_waiter("stack_create_complete")
        waiter.wait(StackName=STACK_NAME)
        print("✅  Stack creado con éxito")

    except ClientError as e:
        if e.response["Error"]["Code"] == "AlreadyExistsException":
            print(f"El stack {STACK_NAME} ya existe.")
        else:
            raise
    except WaiterError as w:
        raise SystemExit(f"❌  Error al crear el stack: {w}")

    # ──────────────────────────────────────────────────────────────
    # 7. Mostrar salidas útiles
    # ──────────────────────────────────────────────────────────────
    stack   = cf.describe_stacks(StackName=STACK_NAME)["Stacks"][0]
    outputs = {o["OutputKey"]: o["OutputValue"] for o in stack.get("Outputs", [])}

    if outputs:
        print("\n📤  Outputs del stack")
        for k, v in outputs.items():
            print(f"  {k}: {v}")
    else:
        print("\nℹ️  El stack no tiene salidas definidas.")

    # ──────────────────────────────────────────────────────────────
    # 8. Subir credenciales sensibles del usuario admin al bucket creado por la plantilla
    # ──────────────────────────────────────────────────────────────
    env_bucket = outputs.get("StoreFilesBucketName")
    if not env_bucket:
        raise SystemExit("❌ No se encontró el nombre del bucket en los Outputs del stack.")
    
    credentials_file = "./credentials.txt"
    object_key = "credentials.txt"
    try:
        print(f"Subiendo {credentials_file} a s3://{env_bucket}/{object_key} …")
        s3.upload_file(
            Filename=credentials_file,
            Bucket=env_bucket,
            Key=object_key
        )
        print("✅ Archivo de credenciales subido con éxito.")
    except ClientError as e:
        raise SystemExit(f"❌ Error al subir credenciales: {e}")
    
    # ──────────────────────────────────────────────────────────────
    # 9. Almacenar el accesk key y secret key del usuario de david en un archivo para filtrarlo en el código del lab
    # ──────────────────────────────────────────────────────────────

    # Obtener el access key y secret key del usuario de David de los outputs del stack
    access_key = outputs.get("DavidAccessKeyId")
    secret_key = outputs.get("DavidSecretAccessKey")
    
    if not access_key or not secret_key:
        raise SystemExit("❌ No se encontró el access key y secret key del usuario de David en los Outputs del stack.")
    # Guardar el access key y secret key en un archivo
    credentials_file = "./app/static/aws-credentials.json"
    with open(credentials_file, "w") as f:
        f.write(f'{"{"}\n"AccessKeyId":"{access_key}",\n')
        f.write(f'"SecretAccessKey":"{secret_key}"\n{"}"}')
    print(f"✅ Credenciales de David guardadas en {credentials_file}.")



def getEnvironmentStatus(access_key: str, secret_key: str, region:str="us-east-1"):
    """
    Busca un stack que tenga la etiqueta cloud‑hacking‑labs = IAM-Privilege-Scalation-Lab-AccessKey.
    Devuelve:
      {
        "stackName": "iam-lab",
        "status":    "CREATE_COMPLETE" | "...",
        "outputs":   [ {OutputKey, OutputValue, Description?}, ... ]  # solo si *_COMPLETE
      }
    Si no hay stacks que cumplan, devuelve None.
    """
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )
    cf = session.client("cloudformation")

    # 1️⃣  Recorre TODOS los stacks, sin filtro de estado
    paginator = cf.get_paginator("list_stacks")
    for page in paginator.paginate():
        for summary in page["StackSummaries"]:
            stack_name = summary["StackName"]
            status = summary["StackStatus"]
            # ⚠️ Ignora stacks eliminados o en eliminación
            if status in ("DELETE_COMPLETE", "DELETE_IN_PROGRESS"):
                continue

            try:
                details = cf.describe_stacks(StackName=stack_name)["Stacks"][0]
                tags = {t["Key"]: t["Value"] for t in details.get("Tags", [])}

                if tags.get("cloud-hacking-labs") == "IAM-Privilege-Scalation-Lab-AccessKey":
                    outputs = details.get("Outputs", []) if status.endswith("_COMPLETE") else []
                    return {
                        "stackName": stack_name,
                        "status": status,
                        "outputs": outputs,
                    }
            except cf.exceptions.ClientError as e:
                print(f"❌ Error describiendo el stack {stack_name}: {e}")
    # No se encontró ningún stack con la etiqueta buscada
    return None
   

if __name__ == "__main__":
    # Obtener variables del sistema
    access_key = os.environ.get("CLOUD_LAB_ACCESS_KEY")
    secret_key = os.environ.get("CLOUD_LAB_SECRET")
    region     = os.environ.get("CLOUD_LAB_REGION", "us-east-1")


    # Desplegar el entorno del lab
    deployLabEnvironment(access_key, secret_key, region)