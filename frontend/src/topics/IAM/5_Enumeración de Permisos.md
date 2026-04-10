# **Enumeración de Permisos de IAM**
La enumeración de permisos en IAM es el proceso mediante el cual se investiga qué nivel de acceso tiene una identidad (como un usuario o un rol) dentro de una cuenta de AWS. Más allá de saber qué políticas están asociadas a una entidad, lo que se busca es entender con precisión qué acciones puede ejecutar y sobre qué recursos. Esta fase es clave tanto en auditorías de seguridad como en tareas de pentesting, ya que permite detectar configuraciones mal aplicadas, privilegios excesivos o caminos no evidentes para escalar permisos dentro del entorno.

<iamenv>
</iamenv>


## **Permisos necesarios para enumerar**

Antes de comenzar cualquier proceso de enumeración en IAM, es fundamental entender que **no es posible listar o inspeccionar políticas, usuarios, roles o recursos sin tener previamente permisos adecuados para hacerlo**. AWS aplica un modelo de seguridad estricto basado en permisos explícitos, por lo que una identidad solo podrá ver información si se le ha concedido acceso mediante políticas apropiadas.

Por ejemplo, para ejecutar comandos como `aws iam list-users` o `aws iam get-policy`, el usuario debe tener permisos como:

```json
{
  "Effect": "Allow",
  "Action": [
    "iam:ListUsers",
    "iam:GetPolicy",
    "iam:GetPolicyVersion"
  ],
  "Resource": "*"
}
```

Sin estos permisos, las operaciones de enumeración fallarán con errores de tipo `AccessDenied`.

Este principio se extiende también a la visualización de políticas de recurso (`s3:GetBucketPolicy`, `lambda:GetPolicy`, etc.) y a la inspección de SCPs (`organizations:ListPolicies`). Por ello, **los pasos de enumeración solo serán posibles si el usuario o rol ha sido autorizado explícitamente para llevarlos a cabo**, lo cual puede ser una pista muy útil en entornos donde se quiera restringir la visibilidad y minimizar la exposición de los permisos disponibles.


## **Inspección y Análisis de Políticas**

Los comandos `aws iam get-policy` y `aws iam get-policy-version` te permiten inspeccionar en detalle el contenido y las versiones de una política de IAM. El primero, `get-policy`, devuelve metadatos sobre una política gestionada, incluyendo su nombre, ARN, fecha de creación y cuál es su versión predeterminada (`DefaultVersionId`). Una vez conoces esa versión, puedes usar `get-policy-version` para obtener el **documento JSON completo** de permisos asociado a esa versión específica. Esto es útil tanto para auditar permisos como para entender exactamente qué acciones y recursos permite una política. Por ejemplo, puedes ejecutar:

```bash
aws iam get-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

y luego:

```bash
aws iam get-policy-version --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess --version-id v1
```

Esto te mostrará el contenido completo de esa política en formato JSON. Ideal para evaluar qué permisos se están concediendo o detectar excesos de privilegios en un entorno.

<quiz question='¿Cuál es la fecha de creación de la versión 1 de la política "AdministratorAccess"?' correctAnswer='2015-02-06T18:39:46+00:00' snippet='Devuelve la fecha de creación de la política "AdministratorAccess" en el mismo formato que aparece al enumerar esta política.'>
</quiz>


## **Políticas Asociadas a Entidades**

Es fundamental saber **qué políticas están asociadas a cada identidad de IAM** en la nube de AWS. Esto permite auditar con precisión los permisos que una entidad tiene en el sistema. AWS proporciona distintos comandos en su CLI para inspeccionar estas asociaciones.



Para ver las políticas **en línea** asociadas a un usuario específico, el comando:

```bash
aws iam list-user-policies --user-name <usuario>
```

Este comando muestra aquellas políticas definidas directamente dentro del recurso del usuario. A diferencia de las políticas gestionadas, estas políticas no pueden compartirse ni reutilizarse, y están ligadas exclusivamente a ese usuario en particular. Es común encontrar permisos muy específicos o puntuales en políticas en línea.


<quiz question='Lista las políticas en línea asociadas a tu usuario. Observa la salida. ¿Tiene tu usuario algún tipo de permiso para ejecutar acciones en la nube de AWS?' snippet='Responde con SI o NO' correctAnswer='SI' descAnswer='Que una entidad de IAM no tenga políticas <b>en línea</b> asociadas directamente <b>no significa que no tenga permisos</b>. Recuerda que los permisos se pueden brindar de muchas maneras, como por ejemplo a través de políticas gestionadas asociadas, o herencia de permisos a través de grupos. Este concepto es algo confuso, pero es importante tenerlo en cuenta. El simple hecho de que puedas listar tus permisos significa que, de alguna manera, tienes al menos alguna acción permitida.'>
</quiz>


Para mostrar todas las políticas **gestionadas** que han sido directamente asignadas a un usuario, puedes usar el siguiente comando:

```bash
aws iam list-attached-user-policies --user-name <usuario>
```

Las políticas gestionadas pueden ser creadas por AWS o por el cliente, y se reutilizan entre múltiples usuarios, grupos o roles. Este comando solo muestra aquellas políticas que están asociadas al usuario de forma explícita y no las heredadas.


<quiz question='¿Cuál es el nombre de la política gestionada asociada a tu usuario de estudiante?' correctAnswer='lab-student-read-only'>
</quiz>


De igual manera los siguientes comandos permiten consultar las políticas gestionadas y en línea asignadas a un grupo de IAM.:

```bash
# Listar políticas gestionadas asociadas a un grupo
aws iam list-attached-group-policies --group-name <grupo>
# Listar políticas en línea asociadas a un grupo
aws iam list-group-policies --group-name <grupo>
```

Esto es relevante porque si un usuario pertenece a ese grupo, automáticamente **hereda los permisos** definidos por esas políticas. Revisar las políticas a nivel de grupo es una parte esencial para entender el contexto completo de acceso de un usuario dentro de un entorno de IAM bien organizado.




Para inspeccionar las políticas asociadas a un rol de IAM, AWS también proporciona comandos específicos que permiten ver tanto las políticas gestionadas como las políticas en línea aplicadas a ese rol. Puedes utilizar el siguiente comando para listar las políticas gestionadas directamente adjuntas a un rol:

```bash
aws iam list-attached-role-policies --role-name <nombre-del-rol>
```

Este comando mostrará todas las políticas reutilizables (ya sean de AWS o creadas por el cliente) que están asignadas al rol. Si además quieres ver las políticas en línea definidas directamente dentro del rol (no reutilizables), puedes usar:

```bash
aws iam list-role-policies --role-name <nombre-del-rol>
```

Esto será realmente útil a la hora de realizar una escalada de privilegios, ya que los roles suelen tener permisos más amplios que los usuarios individuales. Por lo tanto, entender qué políticas están asociadas a un rol específico puede abrir puertas a nuevas acciones o recursos que antes no estaban disponibles. Ya veremos como aprovechar esto con más detalle en la sección de **Escalada de privilegios**.

<quiz question='¿Qué acción de s3 está permitida sobre todos los recursos según la política en línea asociada al rol "lab-student-role"?' correctAnswer='ListAllMyBuckets' snippet='Deberás investigar sobre cómo poder ver el contenido de estas políticas...'>
</quiz>


## **Políticas Asociadas a Recursos**

En AWS, cada recurso que admite políticas basadas en recursos tiene un comando específico para inspeccionarlas, no existe un comando general que se pueda utilizar para este propósito independientemente del recurso. A continuación, se muestran tres ejemplos esenciales:

- **Buckets S3**:

```bash
aws s3api get-bucket-policy --bucket <nombre-del-bucket>
```

- **Instancias EC2** *(a través de los roles asociados a la instancia)*:

```bash
aws iam list-attached-role-policies --role-name <nombre-del-rol-asociado>
```

- **Funciones Lambda**:

```bash
aws lambda get-policy --function-name <nombre-o-ARN-de-la-funcion>
```

<quiz  question='¿Cuál es el nombre del usuario que tiene permitido invocar la función lambda llamada "Hello-world" según la política asociada al recurso?'  correctAnswer='Lab-Admin'>
</quiz>



## **Inspección de Service Control Policies (SCPs)**

Las **Service Control Policies (SCPs)** se gestionan desde el servicio de AWS Organizations y permiten definir los límites máximos de permisos que se pueden otorgar en una cuenta u OU (unidad organizativa). Para inspeccionarlas desde la línea de comandos puedes utilizar los siguientes comandos:

- Listar todas las SCPs de la organización:

```bash
aws organizations list-policies --filter SERVICE_CONTROL_POLICY
```

- Ver el contenido de una SCP específica:

```bash
aws organizations describe-policy --policy-id <id-de-la-politica>
```

Esto permite auditar qué acciones están explícitamente permitidas o denegadas en una cuenta, independientemente de lo que otorguen las políticas de IAM o resource policies.


# **Enumeración automatizada con Pacu**


Hasta ahora hemos visto cómo enumerar permisos de IAM de manera manual usando la CLI. Todo esto es necesario para entender el funcionamiento del servicio de IAM. Sin embargo, en un entorno real, la enumeración de permisos puede ser tediosa y llevar mucho tiempo. Por eso, existen herramientas que facilitan este proceso.

<p align="center">
  <img src="/images/iam/pacu_bg_web.jpg" alt="Logo Pacu" width="80%" style="margin-top: 40px;margin-bottom: 40px;"/>
</p>

**Pacu** es una herramienta de código abierto desarrollada por [**Rhino Security Labs**](https://rhinosecuritylabs.com/) para realizar **pentesting en entornos de AWS**. Diseñada como un *framework modular*, permite automatizar tareas comunes durante una auditoría, como la **enumeración de permisos, usuarios, políticas y servicios habilitados** en una cuenta. Digamos que es como un **"Metasploit" para AWS**.


### **Instalación con pipx**

La forma recomendada de instalar Pacu es mediante `pipx`, lo que permite aislarlo en su propio entorno:

```bash
pipx install pacu
```

Una vez instalado, puedes iniciarlo con:

```bash
pacu
```

### **Configurar una sesión con un perfil del CLI**

Si ya tienes configurado un perfil en el AWS CLI (`~/.aws/credentials`), puedes importarlo directamente a Pacu con:

```bash
import_keys <nombre_del_perfil>
```

Esto te permitirá utilizar las credenciales existentes sin copiarlas manualmente, ideal para trabajar rápidamente con múltiples cuentas o roles.

---

### **Buscar módulos con search**

El comando search en Pacu se utiliza para encontrar módulos relacionados con una palabra clave. Por ejemplo:

```bash
search iam
```

Este comando mostrará todos los módulos disponibles en Pacu que contienen "iam" en su nombre o descripción, facilitando la identificación de funcionalidades específicas como enumeración de roles, políticas, usuarios o escaladas de privilegios en IAM. Es especialmente útil para explorar lo que puedes hacer dentro del framework sin tener que revisar la documentación completa.

---

### **Enumerar permisos de IAM automáticamente**

Después de configurar las credenciales en Pacu, puedes lanzar módulos de enumeración para descubrir qué permisos tiene la identidad autenticada. Por ejemplo:

```bash
run iam__enum_permissions
```

Este módulo intentará **ejecutar acciones de IAM comunes, como las que hemos tratado en esta sección, y registrar cuáles están permitidas**, proporcionando una rápida del alcance real de los permisos disponibles.


<quiz question='¿Cuántas acciones de IAM están permitidas para el usuario "Lab-Student"?' correctAnswer='70' snippet='Ejecuta el módulo iam__enum_permissions y observa la salida.'>
</quiz>

Tras ejecutar el módulo, podemos usar el siguiente comando para ver todas las acciones permitidas para nuestras credenciales actuales:

```bash
whoami
```

Si ejecutas este comando en Pacu con el usuario "Lab-Student", verás una larga lista de permisos permitidos, pues, entre otros permisos, este usuario tiene acceso de lectura completo a todo IAM.

