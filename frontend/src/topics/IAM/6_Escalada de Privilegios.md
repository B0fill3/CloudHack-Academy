# **Escalada de Privilegios en AWS**


Una vez hemos comprometido un primer punto de acceso en una cuenta de AWS, ya sea a través de un usuario IAM, un rol con sesión activa o incluso credenciales filtrada, nuestro siguiente objetivo como atacante será claro: **aumentar nuestro nivel de acceso**.

En la mayoría de escenarios reales, las credenciales iniciales no tendrán privilegios elevados. Por eso, necesitaremos **escalar privilegios** para poder realizar acciones más críticas: crear o eliminar recursos, acceder a datos sensibles, modificar roles, o incluso pivotar hacia otros servicios dentro del entorno cloud.

Este proceso no siempre es directo. Muchas veces, para alcanzar un rol más privilegiado, será necesario realizar lo que se conoce como **movimiento lateral**, es decir, ir encadenando permisos entre distintos servicios, usuarios, políticas o roles dentro de la misma cuenta. Este enfoque aprovecha las relaciones implícitas o explícitas entre identidades para navegar poco a poco hacia niveles más altos de control.

AWS, al ser un entorno extremadamente granular en cuanto a control de acceso, expone una superficie muy amplia para este tipo de ataques. Existen **decenas de técnicas distintas** que permiten escalar privilegios, muchas de las cuales implican:
- el abuso de permisos aparentemente inofensivos como `iam:PassRole` o `iam:CreateAccessKey`.
- la creación o modificación de políticas,
- el uso de servicios como Lambda, EC2 o CloudFormation para ejecutar código con permisos elevados,

En este apartado exploraremos algunas de las técnicas más representativas de escalada de privilegios en AWS, acompañadas de ejemplos prácticos y explicaciones claras sobre su funcionamiento y su impacto.



## **Escalada mediante `iam:CreateAccessKey`**

Una de las técnicas más directas para escalar privilegios en AWS consiste en el abuso del permiso `iam:CreateAccessKey`. Si un atacante compromete un usuario IAM que tiene este permiso **sobre otra identidad** dentro de la cuenta, puede generar nuevas claves de acceso (Access Key ID y Secret Access Key) para ese usuario objetivo, y así autenticarse directamente como él.

Este tipo de acceso permite evadir medidas como MFA (en consola) y moverse lateralmente entre identidades con permisos diferentes.

### **Ejemplo práctico**

Supongamos que el usuario `lab-student` tiene la siguiente política asociada:

```json
{
  "Effect": "Allow",
  "Action": "iam:CreateAccessKey",
  "Resource": "arn:aws:iam::123456789012:user/dev-admin"
}
```

Con esta configuración, `lab-student` puede ejecutar:

```bash
aws iam create-access-key --user-name dev-admin
```

Y obtener un nuevo par de credenciales válidas para el usuario `dev-admin`, el cual podría tener permisos mucho más elevados.

Esta técnica es sencilla de automatizar y pasa desapercibida si no hay monitoreo activo sobre `CreateAccessKey` en CloudTrail.



## **Escalada modificando políticas de un usuario IAM**

Otra vía efectiva de escalada ocurre cuando un atacante tiene permisos para **editar políticas asociadas a un usuario IAM**, ya sean políticas inline (`iam:PutUserPolicy`) o versiones de políticas gestionadas (`iam:CreatePolicyVersion`).

Esto le permite **inyectar permisos nuevos** al usuario comprometido o a cualquier otro objetivo bajo su control, sin necesidad de crear nuevas entidades.

### **Escenario común**

Un atacante con este permiso puede ejecutar:

```bash
aws iam put-user-policy \
  --user-name lab-student \
  --policy-name InjectAdmin \
  --policy-document file://admin-permissions.json
```

Donde `admin-permissions.json` puede contener:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
  }]
}
```

Este tipo de escalada suele pasar desapercibido si las políticas inline no están auditadas regularmente.



## **Escalada mediante instancias EC2 y el rol de metadatos**

Una técnica más sofisticada, pero extremadamente poderosa, implica el uso de **instancias EC2 para escalar privilegios** mediante el **servicio de metadatos de instancia**. El escenario típico es el siguiente:

<p align="center">
  <img src="/images/iam/EsquemaWriteup.png" alt="Esquema de Ataque" width="80%" style="margin-top: 40px;margin-bottom: 50px;"/>
</p>

1. Se encuentran unas credenciales filtradas de alguna manera, ya sea en el código u en otro lugar.
2. El atacante usando dichas credenciales tiene permisos limitados, pero sí puede lanzar instancias EC2 (EC2 es un ejemplo típico, pero se puede realizar una escalada utilizando otros servicios distintos) y **pasarles un rol IAM** usando `iam:PassRole`.
3. Aprovechando esos permisos, lanza una nueva instancia EC2 y le asigna un rol con mayores privilegios.
4. Una vez desplegada la instancia, accede a ella (por ejemplo, mediante un script de `user-data` o conexión SSH) y solicita los **tokens temporales del rol asignado** accediendo al endpoint de metadatos:

```bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/<RoleName>
```

5. Usa esas credenciales temporales para autenticarse con los permisos del rol elevado.

### **Ejemplo de permisos necesarios**

```json
{
  "Effect": "Allow",
  "Action": [
    "iam:PassRole",
    "ec2:RunInstances"
  ],
  "Resource": "*"
}
```

Esta técnica no requiere modificar ninguna política IAM ni acceder a la consola, lo que la hace difícil de detectar si no se monitorean las acciones relacionadas con EC2 y STS.


#### **Lectura recomendada**

Para profundizar más en esta técnica de escalada de privilegios mediante el uso indebido del permiso `iam:PassRole`, se recomienda revisar el excelente análisis realizado por el equipo de Unit 42 (Palo Alto Networks). En su informe describen casos reales en los que actores maliciosos han explotado este tipo de configuración para comprometer entornos en la nube:  🔗 [Ver el artículo completo de Unit 42](https://unit42.paloaltonetworks.com/iam-roles-compromised-workloads/)

## **Otras técnicas de escalada de privilegios**

Existen numerosas técnicas de escalada de privilegios en AWS, muchas más de las que cubrimos aquí. Si quieres profundizar en el tema, te recomendamos consultar los siguientes recursos:

- 🔗 [AWS IAM Privilege Escalation – Methods and Mitigation](https://rhinosecuritylabs.com/aws/aws-privilege-escalation-methods-mitigation/) por RhinoSecurityLabs.
- 🔗 [AWS IAM Privilege Escalation Techniques](https://hackingthe.cloud/aws/exploitation/iam_privilege_escalation/) por HackingTheCloud. 