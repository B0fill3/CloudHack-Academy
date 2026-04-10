# **Otros tipos de Políticas a tener en cuenta**

Además de las políticas de IAM tradicionales (como las políticas gestionadas o en línea aplicadas a usuarios, roles o grupos), existen otros tipos de políticas que forman parte esencial del modelo de control de acceso de AWS. Aunque no se gestionan directamente desde IAM, influyen en el resultado final de cualquier intento de acceso.

En este apartado exploraremos dos mecanismos clave: las **políticas basadas en recursos (Resource Policies)** y las **Service Control Policies (SCPs)**. Ambos tipos comparten la misma estructura de documento JSON con campos como `Effect`, `Action`, `Resource` o `Condition`, pero se aplican en contextos muy distintos:


## **Políticas basadas en recursos (Resource Policies)**

Las políticas basadas en recursos son una categoría especial de políticas en AWS que se **adjuntan directamente a un recurso**, como un bucket de S3, una cola de SQS, una función Lambda o una clave de KMS. A diferencia de las políticas de IAM, que se asocian a identidades (usuarios, grupos o roles), estas políticas se definen dentro del propio recurso para controlar **quién puede acceder a él y cómo**.

Este tipo de políticas es fundamental para permitir acceso entre cuentas distintas (cross-account access), ya que permite definir permisos directamente desde el recurso hacia entidades externas. También permiten aplicar condiciones avanzadas como restricciones por IP, etiquetas obligatorias o identidad del solicitante.

Un ejemplo típico de Resource Policy se encuentra en un bucket de S3:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitirLecturaCuentaExterna",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket-publico/*"
    }
  ]
}
```

Este documento permite que cualquier entidad de la cuenta `111122223333` lea objetos del bucket especificado.

En cuanto a la evaluación de permisos, es importante tener en cuenta que las Resource Policies se combinan con las políticas de IAM que tenga la identidad que hace la solicitud. Es decir:

- Si ambas políticas permiten la acción, el acceso se concede.
- Si alguna de ellas la deniega explícitamente, el acceso se rechaza.
- Si ninguna la permite, se deniega por defecto.

Algunos de los servicios más comunes que utilizan Resource Policies son: S3, SNS, SQS, Lambda, API Gateway, KMS y Secrets Manager.


### **Ejercicio:**

Imagina el supuesto caso en el que te encuentras con la siguiente política asociada a tu usuario lab-student:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadFromSpecificIP",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-restringido/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.50/32"
        }
      }
    },
    {
      "Sid": "DenyLabStudent",
      "Effect": "Deny",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-restringido/*",
      "Condition": {
        "StringLike": {
          "aws:username": "lab-student"
        }
      }
    }
  ]
}
```

Imagina que, además de la política de identidad anterior, alguien añade la siguiente **bucket‑policy** al recurso `bucket‑restringido`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccountRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-restringido/*"
    }
  ]
}
```

<quiz  question='¿Podrá ahora el usuario "lab‑student" conectándose desde la ip 203.0.113.50 descargar objetos del bucket?'  correctAnswer='NO'  snippet='Responde SI o NO.'  descAnswer='Aunque la bucket‑policy concede `s3:GetObject` a todas las identidades de la cuenta, el **Deny explícito** que sigue existiendo en la política de identidad de lab‑student tiene prioridad y bloquea la operación.'  >
</quiz>


## **Service Control Policies (SCPs)**

Las Service Control Policies son políticas que **no se aplican a identidades individuales ni a recursos concretos**, sino a **cuentas completas o unidades organizativas** dentro de **AWS Organizations**. Su función no es otorgar permisos, sino **definir los límites máximos de lo que se puede permitir dentro de una cuenta**.

Esto significa que una SCP puede impedir que una acción se ejecute incluso si una política de IAM o una Resource Policy la permiten. Funcionan como una capa superior de restricción, un "techo" de permisos que ninguna otra política puede superar.

Por ejemplo, si una política IAM otorga permiso para lanzar instancias EC2, pero una SCP deniega esa acción, el resultado será que la acción será bloqueada.

Un ejemplo de SCP que impide el uso de EC2 y la eliminación de bases de datos en RDS sería:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "ec2:*",
        "rds:Delete*"
      ],
      "Resource": "*"
    }
  ]
}
```

Las SCPs se pueden aplicar a toda la organización, a unidades organizativas específicas o a cuentas individuales. Afectan a todos los usuarios, roles y servicios dentro del ámbito donde se apliquen, incluidos roles de servicio y tareas automatizadas.

Existen dos enfoques comunes de SCP: el modo "deny list", que bloquea ciertas acciones explícitamente, y el modo "allow list", que permite únicamente lo que esté definido y deniega todo lo demás de forma implícita.

A diferencia de las Resource Policies, las SCPs **no permiten acceso entre cuentas** y **no se adjuntan a recursos o identidades específicas**.

---

### **¿Son las Resource Policies y las SCPs políticas de IAM?**

Una pregunta que nos puede surgir fácilmente tras haber visto este tipo de políticas es, ¿son las Resource Policies y las SCPs políticas de IAM? La respuesta es **no**. Aunque comparten similitudes en su estructura y propósito, son conceptos distintos dentro del ecosistema de AWS.

Las **políticas de IAM** son documentos que se asocian a identidades (usuarios, grupos o roles) y determinan qué acciones pueden realizar sobre recursos específicos. En cambio, las **Resource Policies** y las **Service Control Policies (SCPs)** son mecanismos de control de acceso que se aplican a recursos o cuentas completas, respectivamente.

Aunque **Resource Policies** y **Service Control Policies (SCPs)** usan la misma estructura de documentos JSON que las políticas de IAM (con campos como `Effect`, `Action`, `Resource`, etc.), **no se consideran políticas de IAM en el sentido estricto**.

### **Diferencias clave:**

- **Políticas de IAM**:
  - Se definen y gestionan directamente en el servicio IAM.
  - Se **adjuntan a entidades de IAM** como usuarios, roles o grupos.
  - Se evalúan en el contexto de una identidad que hace una petición.

- **Resource Policies**:
  - Se definen en el recurso, no en IAM.
  - Se **evalúan como parte del recurso al que estás accediendo**.
  - Son independientes de si la entidad tiene una política de IAM o no.
  - Ej: una política adjunta a un bucket S3.

- **Service Control Policies (SCPs)**:
  - Se gestionan en **AWS Organizations**, no en IAM.
  - No otorgan permisos, solo **limitan los permisos máximos posibles**.
  - Afectan a todas las identidades de la cuenta o unidad organizativa.



Aunque todas comparten una estructura similar y participan en la **evaluación de permisos**, **solo las políticas gestionadas o en línea que se adjuntan a usuarios, roles o grupos son políticas IAM propiamente dichas**. Las Resource Policies y SCPs forman parte del modelo de control de acceso más amplio de AWS.