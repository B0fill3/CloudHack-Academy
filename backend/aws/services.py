import boto3
from botocore.exceptions import ClientError,NoCredentialsError, EndpointConnectionError, WaiterError

TAG_KEY = "cloud-hacking-labs"  # Se ignora el valor; basta con que exista la clave

# ──────────────────────────────────────────────────────────────
# Listar recursos
# ──────────────────────────────────────────────────────────────


def list_lab_resources(access_key: str, secret_key: str, region: str):
    """Devuelve todos los recursos con la etiqueta cloud-hacking-labs en la cuenta."""
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )
    tagging = session.client("resourcegroupstaggingapi", region_name=region)

    paginator = tagging.get_paginator("get_resources")
    resources = []

    try:
        for page in paginator.paginate(TagFilters=[{"Key": TAG_KEY}]):
            for mapping in page.get("ResourceTagMappingList", []):
                arn = mapping["ResourceARN"]
                tag_value = next(
                    (t["Value"] for t in mapping["Tags"] if t["Key"] == TAG_KEY),
                    None,
                )
                
                # Filtro específico para Cognito User Pools
                if ":cognito-idp:" in arn and ":userpool/" in arn:
                    # Extrae el user pool ID del ARN
                    user_pool_id = arn.split("/")[-1]
                    pool_region = arn.split(":")[3]

                    # Verifica si el pool sigue existiendo
                    if not verify_user_pool_exists(session,user_pool_id, pool_region):
                        continue  # saltar si fue eliminado

                resources.append({"arn": arn, "tagValue": tag_value})
                print(f"Resource ARN: {arn}")
                print(f"Tag Value: {tag_value}")
                print("-" * 40)
        return resources, None

    except (ClientError, NoCredentialsError, EndpointConnectionError) as e:
        return None, str(e)
    

#### Pequeño ajuste para los user-pool de Cognito que no aparecen correctamente eliminados:
#### Los user pools de Cognito no se eliminan inmediatamente, sino que quedan en un estado de "eliminación pendiente" durante un tiempo.
def verify_user_pool_exists(session,user_pool_id, region):
    client = session.client("cognito-idp", region_name=region)
    try:
        response = client.describe_user_pool(UserPoolId=user_pool_id)
        print(f"User Pool {user_pool_id} still exists.")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print(f"User Pool {user_pool_id} does not exist.")
            return False
        else:
            raise e



# ──────────────────────────────────────────────────────────────
# Utils
# ──────────────────────────────────────────────────────────────

def _session(access_key: str, secret_key: str, region: str):
    return boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )


# ──────────────────────────────────────────────────────────────
# Deleters
# ──────────────────────────────────────────────────────────────

def _delete_s3_buckets(sess, summary):
    s3 = sess.resource("s3")
    tagging = sess.client("resourcegroupstaggingapi")

    paginator = tagging.get_paginator("get_resources")
    for page in paginator.paginate(
        TagFilters=[{"Key": TAG_KEY}],  # ⇦ solo la clave
        ResourceTypeFilters=["s3"],
    ):
        for res in page["ResourceTagMappingList"]:
            arn = res["ResourceARN"]
            bucket_name = arn.split(":::")[-1]
            bucket = s3.Bucket(bucket_name)
            try:
                bucket.object_versions.delete()
                bucket.objects.delete()
                bucket.delete()
                summary["deleted"].append({"type": "s3:bucket", "id": bucket_name})
            except ClientError as e:
                summary["failed"].append({"type": "s3:bucket", "id": bucket_name, "error": str(e)})


def _delete_iam_entities(sess, summary):
    iam = sess.resource("iam")

    # Usuarios
    for user in iam.users.all():
        tag_keys = {t["Key"] for t in (user.tags or [])}
        if TAG_KEY in tag_keys:
            try:
                for key in user.access_keys.all():
                    key.delete()
                for pol in user.attached_policies.all():
                    pol.detach_user(UserName=user.user_name)
                user.delete()
                summary["deleted"].append({"type": "iam:user", "id": user.user_name})
            except ClientError as e:
                summary["failed"].append({"type": "iam:user", "id": user.user_name, "error": str(e)})

    # Políticas gestionadas
    for pol in iam.policies.all():
        tag_keys = {t["Key"] for t in (pol.tags or [])}
        if TAG_KEY in tag_keys:
            try:
                pol.delete()
                summary["deleted"].append({"type": "iam:policy", "id": pol.arn})
            except ClientError as e:
                summary["failed"].append({"type": "iam:policy", "id": pol.arn, "error": str(e)})


def _delete_cloudformation_stacks(sess, summary):
    cf = sess.client("cloudformation")
    paginator = cf.get_paginator("list_stacks")
    status_filter = [
        "CREATE_COMPLETE",
        "UPDATE_COMPLETE",
        "UPDATE_ROLLBACK_COMPLETE",
        "ROLLBACK_COMPLETE",
    ]

    for page in paginator.paginate(StackStatusFilter=status_filter):
        for stk in page.get("StackSummaries", []):
            name = stk["StackName"]
            detail = cf.describe_stacks(StackName=name)["Stacks"][0]
            tag_keys = {t["Key"] for t in detail.get("Tags", [])}
            if TAG_KEY in tag_keys:
                try:
                    cf.delete_stack(StackName=name)
                    waiter = cf.get_waiter("stack_delete_complete")
                    waiter.wait(StackName=name)
                    summary["deleted"].append({"type": "cloudformation:stack", "id": name})
                except (ClientError, WaiterError) as e:
                    summary["failed"].append({"type": "cloudformation:stack", "id": name, "error": str(e)})
