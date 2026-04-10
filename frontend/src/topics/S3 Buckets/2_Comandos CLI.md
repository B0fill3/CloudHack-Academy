# **Cómo usar AWS CLI para interactuar con buckets de Amazon S3**

En este artículo aprenderás paso a paso cómo utilizar la línea de comandos (AWS CLI) para gestionar (y atacar) buckets de Amazon S3, incluyendo cómo crear buckets, subir archivos, gestionar permisos y más.

Se recomienda probar todos los siguientes comandos para adquirir soltura con el funcionamiento de AWS CLI.


## **Instalar y configurar AWS CLI**

Primero, debes instalar AWS CLI en tu sistema. Después, configura tus credenciales:

```bash
aws configure
```

Te solicitará:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ej: us-east-1)
- Output format (puedes usar JSON o dejar en blanco)



## **Crear un bucket en S3**

Para crear un bucket:

```bash
aws s3 mb s3://mi-nuevo-bucket-2025 --region eu-west-1
```

Esto crea un nuevo bucket llamado `mi-nuevo-bucket-2025` en la región de Europa (eu-west-1).



## **Subir archivos al bucket**

Subir un único archivo

```bash
aws s3 cp archivo-local.txt s3://mi-nuevo-bucket-2025/
```

Para copiar todo un directorio completo:

```bash
aws s3 cp mi-carpeta s3://mi-nuevo-bucket-2025/mi-carpeta --recursive
```



## **Listar contenido del bucket**

Listar archivos de tu bucket:

```bash
aws s3 ls s3://mi-nuevo-bucket-2025/
```

Para listar todos los archivos recursivamente:

```bash
aws s3 ls s3://mi-nuevo-bucket-2025 --recursive
```



## **Descargar archivos**

Descarga un archivo específico:

```bash
aws s3 cp s3://mi-nuevo-bucket-2025/archivo.txt ./archivo-local.txt
```

Descargar toda una carpeta desde el bucket:

```bash
aws s3 cp s3://mi-nuevo-bucket-2025/carpeta-remota ./carpeta-local --recursive
```



## **Eliminar objetos**

Eliminar un archivo:

```bash
aws s3 rm s3://mi-nuevo-bucket-2025/archivo-local.txt
```

Eliminar todos los archivos dentro de un bucket:

```bash
aws s3 rm s3://mi-nuevo-bucket-2025 --recursive
```

Eliminar un bucket vacío:

```bash
aws s3 rb s3://mi-nuevo-bucket-2025
```

Eliminar un bucket con todos sus objetos:

```bash
aws s3 rb s3://mi-nuevo-bucket-2025 --force
```



## **Gestionar permisos (ACL)**

Ver la configuración ACL actual del bucket:

```bash
aws s3api get-bucket-acl --bucket mi-nuevo-bucket-2025
```
Hacer un objeto públicamente accesible:

```bash
aws s3api put-object-acl --bucket mi-nuevo-bucket-2025 --key imagen.jpg --acl public-read
```
Establecer ACL del bucket como privado nuevamente:

```bash
aws s3api put-bucket-acl --bucket mi-nuevo-bucket-2025 --acl private
```



## **Sincronizar contenido**

Para sincronizar una carpeta local hacia un bucket de S3 (útil para backups o sitios estáticos):

```bash
aws s3 sync ./mi-carpeta s3://mi-nuevo-bucket-2025
```

Esto copia solo archivos nuevos o modificados.



## **Parámetros útiles en AWS CLI**

`--no-sign-request` : Realiza solicitudes sin firmar (sin autenticación). Muy útil cuando quieres acceder a un bucket o objeto S3 que tiene acceso público, pero no tienes credenciales configuradas localmente.

```bash
aws s3 ls s3://bucket-publico --no-sign-request
```

`--profile` : Permite especificar un perfil particular que tengas configurado en AWS CLI. Esto es útil si tienes múltiples credenciales (por ejemplo, para diferentes cuentas AWS).

```bash
aws s3 ls s3://mi-bucket --profile mi-perfil
```

Algunas veces, ciertos buckets están disponibles para todos los usuarios de AWS. Si identificas un bucket expuesto (por ejemplo, durante pentesting o auditorías), podrías necesitar establecer un perfil para aprovechar estas situaciones.

