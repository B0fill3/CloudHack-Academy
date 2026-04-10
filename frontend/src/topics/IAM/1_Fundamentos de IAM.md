# **Fundamentos de IAM**

En esta sección aprenderás sobre los aspectos fundamentales del servicio de IAM, en el que se encuentran conceptos como las diferencias entre usuarios, grupos y roles, o el funcionamiento de las políticas IAM asociadas a cada recurso.

<p align="center">
  <img src="/images/iam/iamSchema.png" alt="Introducción a IAM" width="80%" style="margin-top: 20px;margin-bottom: 10px;"/>
</p>



### **Cuenta de AWS, Usuarios, Grupos y Roles en IAM**

Es importante entender la diferencia entre una **cuenta de AWS** y los **usuarios, grupos y roles de IAM**. La cuenta de AWS es la entidad principal que gestiona todos los recursos y servicios en la nube, mientras que los usuarios, grupos y roles son componentes dentro de esa cuenta que permiten gestionar el acceso y los permisos.

Una cuenta de AWS puede tener múltiples usuarios, grupos y roles, cada uno con diferentes permisos y niveles de acceso. Esto permite una gestión granular de los recursos y la seguridad dentro de la cuenta.

La terminología puede llegar a ser confusa, cuando escuchas decir a alguien que "creó un usuario en AWS", puede referirse a un usuario de IAM o a una cuenta de AWS. En este contexto, nos referimos a **usuarios de IAM** como entidades dentro de una cuenta de AWS que tienen permisos específicos para interactuar con los recursos de esa cuenta.

#### **Usuario raíz en AWS**

- Al crear una cuenta de Amazon Web Services (AWS) por primera vez, se genera una única identidad con privilegios totales sobre todos los servicios y recursos de la cuenta. Esta identidad se conoce como el **usuario raíz** y se accede a ella utilizando el correo electrónico y la contraseña empleados durante el registro de la cuenta.

#### **Usuarios de IAM**

- Son **entidades individuales dentro de una cuenta de AWS**, que representan a una persona o una aplicación que necesita interactuar con los servicios de AWS.
- **No deben confundirse con una cuenta de AWS**, que es la entidad principal para facturación y administración general de los recursos. Una cuenta puede tener múltiples usuarios de IAM, cada uno con sus propios permisos y credenciales.
- Cada usuario puede tener sus propias **credenciales de acceso** (como una contraseña o claves de acceso).
- Pueden tener políticas de permisos **directamente asignadas** o **heredarlas a través de un grupo**.
- **Ejemplo de uso**: Un usuario llamado _ana_dev_ dentro de una cuenta de empresa, con permisos para acceder a S3 y Lambda.


#### **Grupos de IAM**

- Son **conjuntos de usuarios de IAM** que comparten los mismos permisos.
- Permiten asignar políticas a varios usuarios sin tener que configurarlas individualmente.
- Los usuarios **heredan** los permisos del grupo.
- **Ejemplo de uso**: Un grupo llamado _Desarrolladores_ con permisos para acceder a S3 y EC2, donde todos los desarrolladores de la empresa están añadidos.

#### **Roles de IAM**

- Son **identidades temporales** con permisos definidos, que pueden ser asumidas por **usuarios, servicios de AWS u otras cuentas**.
- No están asociados a usuarios específicos, sino que cualquier entidad con los permisos adecuados puede **asumir** un rol.
- Se utilizan para **delegación de permisos** y **acceso entre servicios** sin necesidad de credenciales permanentes.
- **Ejemplo de uso**: Un rol que permite a una aplicación en un servidor EC2 acceder a una base de datos RDS sin almacenar credenciales en el código.


### **Resumen Comparativo: Usuarios vs Grupos vs Roles en IAM**

| Característica         | Usuarios de IAM                      | Grupos de IAM                                 | Roles de IAM                                    |
|------------------------|--------------------------------------|-----------------------------------------------|-------------------------------------------------|
| ¿Qué representa?       | Una persona o aplicación             | Un conjunto de usuarios                       | Una identidad con permisos asumible             |
| ¿Tiene credenciales?   | Sí (clave de acceso, contraseña)     | No                                             | No                                              |
| ¿Asigna permisos?      | Sí, directamente o mediante grupos   | Sí, mediante políticas asociadas              | Sí, mediante políticas                           |
| ¿Permite herencia?     | No                                   | Sí (los usuarios heredan permisos del grupo)  | No aplica (se asume, no se hereda)              |
| ¿Duración del acceso?  | Permanente (hasta ser revocado)      | Permanente (mientras pertenezca al grupo)     | Temporal (duración definida al asumir el rol)   |
| ¿Uso común?            | Acceso humano o programático         | Gestión colectiva de permisos                 | Acceso temporal o delegación entre servicios    |

---


### **¿Qué es un ARN en AWS?**

Un **ARN (Amazon Resource Name)** es una cadena única que identifica de forma global un recurso dentro de AWS. Los ARN se utilizan en políticas de IAM, comandos de la CLI y otras configuraciones para referirse a recursos específicos como usuarios, roles, buckets de S3, funciones Lambda, etc. La estructura general de un ARN es:

```bash
arn:partition:service:region:account-id:resource
```

Por ejemplo, un ARN de un bucket de S3 podría verse así:

```bash
arn:aws:s3:::mi-bucket-personal
```

Este identificador permite a AWS saber exactamente **a qué recurso te estás refiriendo**, incluso si estás trabajando desde otra región o cuenta.

---

### **Políticas de IAM**

Las **políticas de IAM** son documentos que definen los permisos que se pueden asignar a usuarios, grupos o roles dentro de AWS. Estas políticas están escritas en un formato JSON y especifican qué acciones están permitidas o denegadas sobre qué recursos.
Las políticas pueden ser **administradas** (predefinidas por AWS) o **en línea** (creadas y asociadas directamente a un usuario, grupo o rol). Las políticas administradas son reutilizables y pueden aplicarse a múltiples entidades, mientras que las políticas en línea son específicas para una sola entidad y se eliminan cuando se elimina la entidad.
### **Estructura de una política de IAM**
Una política de IAM se compone de varios elementos clave:
- **Version**: Indica la versión del lenguaje de políticas de IAM.
- **Statement**: Contiene una o más declaraciones que definen los permisos.
- **Effect**: Especifica si la política permite o deniega el acceso (Allow o Deny).
- **Action**: Define las acciones permitidas o denegadas (por ejemplo, `s3:ListBucket`).
- **Resource**: Especifica los recursos a los que se aplican las acciones (por ejemplo, un bucket de S3 específico).
- **Condition**: (opcional) Define condiciones adicionales bajo las cuales se aplican los permisos.
- **Principal**: (opcional) Define la entidad a la que se aplica la política (en el caso de políticas de recursos).
- **Sid**: (opcional) Un identificador único para la declaración dentro de la política.
### **Ejemplo de política de IAM**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mi-bucket-personal"
    },
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket-personal/*"
    }
  ]
}
```
En este ejemplo, la política permite listar el contenido de un bucket de S3 específico y obtener objetos dentro de ese bucket. La primera declaración permite la acción `s3:ListBucket` en el recurso `arn:aws:s3:::mi-bucket-personal`, mientras que la segunda declaración permite la acción `s3:GetObject` en todos los objetos dentro del bucket (`arn:aws:s3:::mi-bucket-personal/*`).

Este ejemplo de política podría ir asociada a un usuario o rol de IAM, permitiendo que esa entidad tenga acceso a los recursos especificados en la política.

### **Orden de prioridad en las políticas de IAM**

Cuando AWS evalúa si una acción está permitida o denegada, sigue un orden de prioridad muy claro. Primero, **se asume que todo está denegado por defecto**. Luego, si una política otorga explícitamente un permiso (`"Effect": "Allow"`), ese permiso se concede **solo si no hay ninguna denegación explícita**. Y aquí es donde entra la regla clave: **una política con `"Effect": "Deny"` siempre tiene prioridad sobre una que permite**. Es decir, si una acción está permitida por una política, pero otra política (en el mismo usuario, grupo o rol) la deniega explícitamente, entonces la acción será bloqueada. En resumen: **el `Deny` gana siempre al `Allow`**, y no se puede anular. Esta lógica garantiza que se pueda aplicar un control de seguridad más estricto cuando sea necesario.


### **Ejemplo: Conflicto entre Allow y Deny**

Imagina que tienes un **usuario de IAM** que hereda dos políticas distintas:

#### **Política 1 (permite leer objetos de un bucket)**

```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::mi-bucket-confidencial/*"
}
```

#### **Política 2 (deniega acceso a ese mismo bucket)**

```json
{
  "Effect": "Deny",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::mi-bucket-confidencial/*"
}
```



### **Ejercicio**:


<quiz question="Imagina un usuario de IAM con estas políticas asociadas. ¿Podrá acceder a un objeto en el bucket `mi-bucket-confidencial`?" correctAnswer="NO" snippet="Responde con 'SI' o 'NO'" descanswer="Aunque la primera política permite al usuario leer objetos del bucket, la segunda <b>deniega explícitamente</b> esa misma acción sobre el mismo recurso. <b>Como `Deny` tiene prioridad sobre `Allow`, el acceso será bloqueado.</b>">
</quiz>

