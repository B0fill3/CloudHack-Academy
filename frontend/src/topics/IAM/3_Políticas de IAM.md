# **Políticas y Permisos de IAM**


Las **políticas y permisos de IAM** son el mecanismo principal mediante el cual se controla el acceso a los recursos de AWS. Una política es un documento JSON que define qué acciones están permitidas o denegadas para una identidad (usuario, grupo o rol) sobre determinados recursos. Estas políticas permiten aplicar el principio de mínimo privilegio, asegurando que cada entidad solo pueda realizar exactamente lo que necesita. Comprender cómo funcionan las políticas es esencial para diseñar entornos seguros, auditar configuraciones y evaluar posibles vectores de ataque en una arquitectura basada en la nube.

<p align="center">
  <img src="/images/iam/PolicyImage.png" alt="Imagen de políticas" width="60%" style="margin-top: 20px;margin-bottom: 50px;"/>
</p>


## **Políticas de IAM**
Las **políticas de IAM (Identity and Access Management)** son documentos en formato JSON que definen las reglas de acceso dentro de AWS. Específicamente, indican **qué acciones se pueden realizar**, **sobre qué recursos**, y **en qué condiciones**. Estas políticas se asocian a identidades (usuarios, grupos o roles) o a recursos directamente, y determinan si una solicitud debe ser **permitida** o **denegada**.

Una política está compuesta por una o más declaraciones (`Statement`), donde se especifican elementos clave como:

- `Effect`: si se permite (`Allow`) o se deniega (`Deny`) la acción.
- `Action`: la operación que se puede realizar (como `s3:GetObject` o `ec2:StartInstances`).
- `Resource`: los recursos específicos sobre los que se aplica (por ejemplo, un bucket de S3).
- `Condition` *(opcional)*: restricciones adicionales como el origen IP, el momento del día o etiquetas específicas.

AWS evalúa estas políticas para decidir si una identidad tiene autorización para realizar una acción. Es importante recordar que, **por defecto, todo está denegado**, y solo se permite lo que está explícitamente autorizado. Además, si hay un conflicto entre políticas, **un `Deny` explícito siempre prevalecerá sobre cualquier `Allow`**.


### **Estructura de una Política**

Cada política de IAM está escrita en formato JSON y tiene una estructura bien definida. El bloque más importante es `Statement`, que puede contener una o varias reglas de control de acceso. Cada uno de estos bloques representa una instrucción individual que AWS evaluará de forma independiente cuando alguien intente realizar una acción. Vamos a desglosar cada uno de sus componentes:

---

#### **Effect:**
Este campo indica el resultado de la evaluación de la política para la acción y recurso especificados. Solo puede tener dos valores:

- `"Allow"`: Permite explícitamente la acción si se cumplen las condiciones.
- `"Deny"`: Deniega explícitamente el acceso, **y siempre tiene prioridad** sobre cualquier otro `Allow`, incluso si viene de otra política.

Por defecto, si no existe un `Allow` explícito, la acción se deniega. Por lo tanto, no es necesario denegar todo, solo lo que quieras restringir de forma explícita.

---

#### **Action:**
Aquí se define la o las operaciones que se permiten o se deniegan. Cada servicio de AWS tiene su propio conjunto de acciones, como:

- `s3:GetObject` → Obtener un objeto de un bucket S3.
- `ec2:DescribeInstances` → Listar instancias de EC2.
- `iam:CreateUser` → Crear un nuevo usuario IAM.

Puedes especificar múltiples acciones como una lista, o usar comodines (`*`) para abarcar varias:

```json
"Action": [
  "s3:GetObject",
  "s3:PutObject"
]
```

O incluso:

```json
"Action": "s3:*"
```

---

#### **Resource:**
Especifica sobre qué recursos concretos se aplica la acción. En este campo debes indicar el ARN (Amazon Resource Name) del recurso objetivo. Por ejemplo:

```json
"Resource": "arn:aws:s3:::mi-bucket-confidencial/*"
```

También se pueden usar comodines (`*`) para abarcar múltiples recursos, aunque es recomendable ser específico siempre que sea posible para seguir el principio de mínimo privilegio.

Tienes razón, me faltó incluir el campo `Principal`, que es fundamental en ciertas políticas, especialmente en las asociadas a recursos como roles o buckets. Aquí tienes el párrafo correspondiente, en Markdown:

---

#### **Principal:**

El campo `Principal` especifica **quién está autorizado a realizar la acción** definida en la política. Es obligatorio en **políticas basadas en recursos**, como las que se aplican a buckets S3, colas SQS o roles de IAM, pero **no se utiliza en políticas de identidad** (asociadas a usuarios, grupos o roles), ya que en ese caso la identidad es quien tiene la política adjunta.

Un `Principal` puede ser:

- Un usuario o rol IAM:  
  ```json
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:user/lab-student"
  }
  ```
- Una cuenta entera:  
  ```json
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:root"
  }
  ```
- Un servicio de AWS:  
  ```json
  "Principal": {
    "Service": "ec2.amazonaws.com"
  }
  ```


---

#### **Condition *(opcional)*:**
Este bloque permite añadir filtros avanzados que restringen el contexto en el cual se aplicará la política. Algunos ejemplos comunes de condiciones son:

- Dirección IP (`aws:SourceIp`)
- Tiempo (`aws:CurrentTime`)
- Si la solicitud se firma con MFA (`aws:MultiFactorAuthPresent`)
- Etiquetas del recurso o del usuario (`aws:RequestTag`, `aws:ResourceTag`, etc.)

Ejemplo de restricción por IP:

```json
"Condition": {
  "IpAddress": {
    "aws:SourceIp": "203.0.113.0/24"
  }
}
```

Las condiciones se escriben como operadores (`StringEquals`, `Bool`, `ArnLike`, etc.) y claves contextuales que AWS proporciona para cada tipo de entidad o servicio.

---

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
      "Sid": "DenyS3",
      "Effect": "Deny",
      "Action": "s3:GetObject",
      "Resource": "*"
    }
  ]
}

```

#### Dada la política anterior, responde a las siguientes pregunta:

<quiz question='Si el usuario "lab-student" intenta acceder al bucket "bucket-restringido" desde la IP "203.0.113.50", ¿tendrá acceso a los objetos del bucket?' correctAnswer='NO' snippet='Responde con SI o NO.' descAnswer='El acceso será denegado porque la segunda regla explícitamente niega el acceso al usuario asociado a ejecutar la acción s3:GetObject, independientemente de la IP, independientemente del recurso de s3. Siempre prevalece un "Deny" explícito ante un "Allow".'>
</quiz>


## **Tipos de Políticas en IAM**

En AWS, existen distintos tipos de políticas que puedes usar para gestionar los permisos dentro de tu cuenta. Todas ellas tienen el mismo formato (documentos JSON), pero se diferencian en **quién las gestiona**, **dónde se almacenan** y **cómo se aplican**. Comprender estas diferencias es esencial para aplicar buenas prácticas de seguridad y mantener un entorno controlado y flexible.

### 1. **Políticas Gestionadas por AWS**

Estas políticas son creadas y mantenidas por AWS. Están diseñadas para casos de uso comunes y se actualizan automáticamente cuando AWS introduce nuevos servicios o acciones relacionadas. Un ejemplo clásico es la política `AmazonS3ReadOnlyAccess`, que otorga permisos de solo lectura sobre S3.

- Ventajas: Son fáciles de usar, están auditadas por AWS y te ahorran tiempo.
- Limitación: No puedes modificarlas. Si necesitas un control más fino, tendrás que crear tu propia política gestionada.

Como pentester debes conocer que la política gestionada más poderosa de AWS es: **AdministratorAccess**, que otorga acceso completo a todos los recursos y servicios de AWS. 

### 2. **Políticas Gestionadas por el Cliente (Customer Managed Policies)**

Son políticas que tú mismo defines y administras. Se almacenan de forma independiente en tu cuenta y pueden aplicarse a múltiples usuarios, grupos o roles. Esto te permite construir permisos personalizados y reutilizables según las necesidades de tu organización o laboratorio.

- Ventajas: Son reutilizables, auditables y más fáciles de mantener que las políticas en línea.
- Ideal cuando necesitas controlar con precisión los permisos y mantener trazabilidad.

### 3. **Políticas en Línea (Inline Policies)**

Las políticas en línea se asocian **directamente a una única entidad** (usuario, grupo o rol) y no pueden compartirse con otras. Están "incrustadas" en esa identidad y desaparecen si se elimina.

- Ventajas: Permiten aplicar permisos específicos para un caso puntual.
- Desventaja: Son más difíciles de mantener a gran escala y no fomentan la reutilización.

