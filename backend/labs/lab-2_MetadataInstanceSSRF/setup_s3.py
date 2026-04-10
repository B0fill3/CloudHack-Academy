import json
import boto3

# Configuración LocalStack
ENDPOINT_URL = "http://localstack:4566"
AWS_ACCESS_KEY_ID = "test2"
AWS_SECRET_ACCESS_KEY = "test2"
REGION_NAME = "us-east-1"

ROLE_NAME = "S3AccessRole"
POLICY_NAME = "S3BucketAccessPolicy"
BUCKET_NAME = "private-bucket"

# Configurar clientes de AWS en LocalStack
iam_client = boto3.client("iam", endpoint_url=ENDPOINT_URL, aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=REGION_NAME)
s3_client = boto3.client("s3", endpoint_url=ENDPOINT_URL, aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=REGION_NAME)

def create_iam_role(role_name=ROLE_NAME):
    """Crea un rol de IAM en LocalStack con una política de confianza."""
    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": { "Service": "s3.amazonaws.com" },
                "Action": "sts:AssumeRole"
            }
        ]
    }

    response = iam_client.create_role(
        RoleName=role_name,
        AssumeRolePolicyDocument=json.dumps(trust_policy),
    )

    role_arn = response["Role"]["Arn"]
    print(f"Rol IAM creado: {role_arn}")
    return role_arn


def attach_s3_policy_to_role(role_name=ROLE_NAME):
    """Asigna una política al rol para acceder a S3."""
    policy_document = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["s3:ListBucket", "s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{BUCKET_NAME}", f"arn:aws:s3:::{BUCKET_NAME}/*"]
            }
        ]
    }

    response = iam_client.put_role_policy(
        RoleName=role_name,
        PolicyName=POLICY_NAME,
        PolicyDocument=json.dumps(policy_document)
    )
    print(f"Política de acceso a S3 asignada al rol '{role_name}'.")


def create_and_configure_bucket(bucket_name=BUCKET_NAME, role_arn=None):
    """Crea un bucket en S3 y asigna una política que permite acceso solo al rol especificado."""
    s3_client.create_bucket(Bucket=bucket_name)
    print(f"Bucket '{bucket_name}' creado.")

    if role_arn:
        bucket_policy = bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [
                # 🚫 DENY: Bloquea todo acceso por defecto
                {
                    "Effect": "Deny",
                    "Principal": "*",
                    "Action": "s3:*",
                    "Resource": [
                        f"arn:aws:s3:::{bucket_name}",
                        f"arn:aws:s3:::{bucket_name}/*"
                    ],
                    "Condition": {
                        "StringNotEquals": {
                            "aws:PrincipalArn": role_arn
                        }
                    }
                },
                # ✅ ALLOW: Permitir solo al rol acceso al bucket
                {
                    "Effect": "Allow",
                    "Principal": { "AWS": role_arn },
                    "Action": ["s3:ListBucket", "s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
                    "Resource": [
                        f"arn:aws:s3:::{bucket_name}",
                        f"arn:aws:s3:::{bucket_name}/*"
                    ]
                }
            ]
        }

        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        print(f"Política aplicada: solo el rol '{role_arn}' puede acceder al bucket '{bucket_name}'.")


def assume_role(role_arn, session_name="UploadSession"):
    """Asume el rol IAM y devuelve credenciales temporales"""
    sts_client = boto3.client(
        "sts",
        endpoint_url=ENDPOINT_URL,  # Si usas LocalStack
        aws_access_key_id="test",
        aws_secret_access_key="test",
        region_name=REGION_NAME
    )

    response = sts_client.assume_role(
        RoleArn=role_arn,
        RoleSessionName=session_name,
        DurationSeconds=43200  # 12 horas
    )

    credentials = response["Credentials"]
    return {
        "AccessKeyId": credentials["AccessKeyId"],
        "SecretAccessKey": credentials["SecretAccessKey"],
        "SessionToken": credentials["SessionToken"]
    }

def upload_object(role_arn, bucket_name=BUCKET_NAME):
    """Sube un archivo a S3 usando las credenciales del rol IAM"""
    
    # 1️⃣ Obtener credenciales temporales asumiendo el rol
    temp_credentials = assume_role(role_arn)
    
    # 2️⃣ Crear un nuevo cliente S3 con las credenciales del rol
    s3_client2 = boto3.client(
        "s3",
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=temp_credentials["AccessKeyId"],
        aws_secret_access_key=temp_credentials["SecretAccessKey"],
        aws_session_token=temp_credentials["SessionToken"],
        region_name=REGION_NAME
    )

    # 3️⃣ Subir el archivo a S3
    # Subir archivo de credenciales
    s3_client2.upload_file(
        "app/static/credentials.txt",
        bucket_name,
        "credentials.txt"
    )
    
    print(f"Credentials subido a s3://{bucket_name} usando el rol {role_arn}")


def upload_credentials(bucket_name=BUCKET_NAME):


    # Subir archivo de credenciales
    s3_client.upload_file(
        "app/static/credentials.txt",
        bucket_name,
        "credentials.txt"
    )
    print(f"Subido credentials.txt a s3://{bucket_name}/")
    


if __name__ == "__main__":
    role_arn = create_iam_role()
    attach_s3_policy_to_role(role_name=ROLE_NAME)
    create_and_configure_bucket(role_arn=role_arn)
    upload_object(role_arn)


