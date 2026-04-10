# **Entidades de IAM**
En IAM, las entidades son los elementos principales que representan **identidades dentro de una cuenta de AWS**. Estas entidades pueden ser personas, aplicaciones o servicios que necesitan acceder a recursos. Las más comunes son los **usuarios**, los **grupos** y los **roles**. Cada una tiene un propósito específico y permite aplicar políticas de seguridad para controlar qué pueden hacer dentro de AWS. Entender cómo funcionan estas entidades es clave para poder evaluar la seguridad de un sistema en la nube de amazon.

<iamenv>
</iamenv>

## **Usuarios de IAM**
Los **usuarios de IAM** son entidades que representan a una persona o aplicación que necesita acceso a los recursos de AWS. Cada usuario tiene sus propias credenciales y permisos, y existen en una única cuenta de AWS. Estos usuarios pueden ser asignados a grupos o tener políticas de permisos directamente asociadas a ellos.

Los usuarios pueden tener varias formas de acceso a AWS, como acceso a la consola de administración (web de aws), acceso programático a través de la CLI o SDKs, y acceso a través de la API de AWS.

Puedes listar los usuarios en tu cuenta de AWS usando la CLI con el siguiente comando:

```bash
aws iam list-users
```

También puedes obtener información detallada sobre el usuario que estás usando actualmente con el siguiente comando:

```bash
aws iam get-user
# Si estás usando un perfil de CLI: 
aws iam get-user --profile <nombre_del_perfil>
```

Los usuarios de IAM son la forma más común en la que la mayoría de las cuentas de AWS se ven comprometidas. Esto se debe a la falta de cuidado con las Access Keys de los usuarios. A menudo se almacenan en archivos de configuración de manera insegura, se committean a repositorios de GitHub o se comparten de manera insegura. 

<quiz question='¿Cuál es el valor del campo "path" del usuario "Lab-Student"?' correctAnswer="/cloud-academy/students/" descAnswer='El campo "Path" en un usuario de IAM representa una ruta jerárquica opcional que permite organizar y agrupar usuarios lógicamente, como si fueran carpetas. En este caso, el usuario Lab-Student pertenece a la ruta /cloud-academy/students/.'>
</quiz>


## **Roles**

Un rol de IAM es un tipo de identidad dentro de AWS que no está asociada permanentemente a un usuario o recurso, sino que puede ser **asumida de forma temporal** por personas, servicios o recursos que necesiten permisos para realizar ciertas acciones. Por ejemplo, si una instancia EC2 necesita interactuar con un bucket S3, puede asumir un rol que tenga los permisos adecuados para acceder a ese recurso.

La **temporalidad** es una de las características clave de los roles: cuando una entidad asume un rol, obtiene un conjunto de credenciales temporales con una duración limitada. Esto reduce el riesgo de exposición prolongada y favorece prácticas de seguridad más estrictas.

Este mecanismo también es muy útil en entornos empresariales donde se utiliza un proveedor de identidad externo para conceder acceso a AWS sin necesidad de crear usuarios permanentes. Además, AWS utiliza roles internamente cuando necesita llevar a cabo tareas dentro de tu cuenta en tu nombre.

Puedes listar los roles en tu cuenta de AWS usando la CLI con el siguiente comando:

```bash
aws iam list-roles
```

También puedes obtener información detallada sobre el rol que estás usando actualmente con el siguiente comando:

```bash
aws iam get-role --role-name <nombre_del_rol>
```

#### **Política de confianza (AssumeRolePolicyDocument)**

El `AssumeRolePolicyDocument` es uno de los elementos más importantes dentro de un rol de IAM en AWS. Se trata de una política especial conocida como **"trust policy"**, cuya función es definir explícitamente **quién tiene permitido asumir ese rol**.

Es importante diferenciar esta política de las políticas tradicionales (`PolicyDocument`) que se asocian a roles o usuarios para especificar **qué acciones pueden realizar**. En cambio, el `AssumeRolePolicyDocument` **no otorga permisos sobre recursos**, sino que determina **qué identidades (usuarios, servicios, cuentas u otros roles)** están autorizadas a **asumir temporalmente ese rol** mediante la acción `sts:AssumeRole`.

Esta política actúa como una **puerta de entrada**: si no existe o no está correctamente configurada, **nadie podrá asumir el rol**, aunque existan permisos asignados al mismo. Es obligatoria y clave en cualquier escenario de delegación de acceso en AWS, ya sea entre usuarios internos, entre cuentas diferentes o entre servicios.

A continuación se muestra un ejemplo básico de un `AssumeRolePolicyDocument` que permite que un usuario específico asuma el rol:

```yaml
AssumeRolePolicyDocument:
  Version: "2012-10-17"
  Statement:
    - Effect: Allow
      Principal:
        AWS: "arn:aws:iam::123456789012:user/david"
      Action: "sts:AssumeRole"
```

Este ejemplo permite que el usuario `david`, perteneciente a la cuenta con ID `123456789012`, pueda asumir el rol a través de la consola, la CLI o un SDK, obteniendo así los permisos temporales definidos en ese rol.

<quiz question="¿Cuál es el valor del campo 'version' del AssumeRolePolicyDocument correspondiente al rol 'lab-student-role'?" correctAnswer="2012-10-17" snippet="xxxx-xx-xx" descAnswer="2012-10-17 es la única versión válida de documentos de políticas reconocida por el motor de políticas IAM.">
</quiz>


Para asumir un rol en AWS desde la línea de comandos, puedes usar el comando `aws sts assume-role`. Este comando solicita credenciales temporales basadas en el rol que quieres asumir. Por ejemplo:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/NombreDelRol \
  --role-session-name mi-sesion-lab \
  --profile mi-perfil-de-usuario
```

La salida incluirá un `AccessKeyId`, `SecretAccessKey` y `SessionToken`, que puedes exportar temporalmente como variables de entorno:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
```

A partir de ese momento, cualquier comando que ejecutes usará los permisos del rol asumido. También puedes configurar un perfil en `~/.aws/config` que asuma el rol automáticamente cada vez que lo uses:

```ini
[profile rol-asumido]
role_arn = arn:aws:iam::123456789012:role/NombreDelRol
source_profile = mi-perfil-de-usuario
region = us-east-1
```

Luego puedes usarlo así:

```bash
aws s3 ls --profile rol-asumido
```

<quiz question='Asume el rol "lab-student-role" para poder listar los buckets disponibles. ¿Cuál es la palabra con la que comienza el nombre del bucket terminado en "...-onlyroleaccess"? (Rellena solamente hasta antes de llegar al primer "-")' correctAnswer="h4ckthecl0ud" snippet="Una vez asumido el rol, puedes listar los buckets con el siguiente comando: aws s3 ls">
</quiz>


## **Grupos de IAM**

Los **grupos de IAM** en AWS son una forma de **agrupar varios usuarios IAM bajo una misma entidad lógica** para facilitar la gestión de permisos. En lugar de asignar políticas individualmente a cada usuario, puedes asignar una política al grupo, y todos los usuarios dentro de él heredarán esos permisos automáticamente. Es una herramienta muy útil para aplicar reglas comunes a perfiles similares, como por ejemplo "desarrolladores" o "estudiantes".


Para ver todos los grupos de IAM de tu cuenta:

```bash
aws iam list-groups
```

Y si estás usando un perfil específico:

```bash
aws iam list-groups --profile nombre-del-perfil
```

Para listar los grupos a los que pertenece un usuario específico:

```bash
aws iam list-groups-for-user --user-name nombre-del-usuario
```

<quiz question="¿Cuál es el nombre del grupo al que pertenece tu usuario de estudiante?" correctAnswer="Lab-IAM-Group">
</quiz>


## **El usuario root y root ARN**

El **usuario root** es la identidad principal de una cuenta de AWS y tiene acceso completo a todos los recursos y servicios dentro de esa cuenta. Este usuario se crea automáticamente al crear una nueva cuenta de AWS y está asociado a la dirección de correo electrónico utilizada durante el registro.

####  **¿Qué es `arn:aws:iam::<account-id>:root`?**

Este ARN representa a la **cuenta raíz (root account)** de una cuenta de AWS. Es decir, se refiere al **usuario raíz** que se creó cuando se abrió esa cuenta de AWS. Por ejemplo:

```json
"Principal": {
   "AWS": "arn:aws:iam::123456789012:root"
 }
```

**NO se refiere únicamente al "usuario root"** de AWS. Aunque el nombre lo sugiere, en realidad representa a toda la cuenta, y se utiliza para decir:

“**Estoy permitiendo el acceso a cualquier identidad que pertenezca a la cuenta 123456789012** (incluyendo el usuario root, IAM roles, IAM users, etc.)”

> **CUIDADO:** Esto no solo da acceso al usuario root. Significa “**cualquiera de esa cuenta**”.


## **¿Por qué entender las Entidades de IAM es importante?**

Dominar los fundamentos de IAM no es solo una cuestión de gestión, es la base para entender y auditar la seguridad de cualquier entorno en AWS. Desde la perspectiva del pentesting, estas entidades representan la superficie de ataque principal: los **usuarios de IAM** suelen ser la entrada más frecuente para comprometer una cuenta; los **roles** son vectores clave de escalada de privilegios; y los **grupos** pueden exponer permisos colectivos mal configurados.

Este conocimiento es la base sobre la que se construyen técnicas más avanzadas como **enumeración de privilegios**, **búsqueda de escalada lateral**, **abuso de políticas de confianza** o **persistencia a través de roles**. En resumen, **si no entiendes IAM, no puedes realizar pentesting sobre AWS con eficacia**.



