# **Credenciales Temporales y el Servicio de Metadatos en AWS**

En AWS, las credenciales temporales son tokens de seguridad que otorgan acceso limitado y temporal a los recursos AWS. Estas credenciales están compuestas por un Access Key ID, Secret Access Key y un token de sesión adicional que generalmente tienen una vida útil corta, por ejemplo, algunas horas. Esto proporciona una mayor seguridad, evitando la necesidad de manejar credenciales permanentes.

Las credenciales temporales suelen generarse utilizando roles IAM que se asignan directamente a las instancias EC2 o servicios específicos dentro de AWS. Las aplicaciones o procesos en la instancia EC2 pueden entonces usar estas credenciales para interactuar con otros servicios AWS sin almacenar explícitamente claves secretas.

## **¿Qué es el Servicio de Metadatos de AWS?**

El **Servicio de Metadatos de Instancia (IMDS)** es un mecanismo que proporciona información esencial y contextual sobre una instancia EC2 en ejecución. El servicio de metadatos permite a las aplicaciones y scripts que corren en la instancia consultar datos importantes, tales como:

- Dirección IP privada y pública
- ID de la instancia y nombre del host
- Detalles sobre la red
- Credenciales temporales generadas por el rol IAM asociado
- Configuración y atributos del sistema operativo

El servicio está accesible exclusivamente desde dentro de la instancia, en la dirección:

```bash
http://169.254.169.254/
```

## **Obtener versiones disponibles de los metadatos de la instancia**

Pueden existir distintar versiones de los metadatos de una misma instancia. Cada versión hace referencia a una compilación de metadatos de instancia correspondiente al momento en que se publicaron nuevas categorías de metadatos de instancia. No existe una correlación entre las versiones de compilación de metadatos de instancia y las versiones de la API de Amazon EC2.

Para obtener las versiones disponibles basta con realizar una petición al path raíz del servicio de metadatos:

```bash
curl http://169.254.169.254/
```

La versión más relevante para un atacante casi siempre va a ser la actual. Esta versión se encuentra en la ruta `/latest`.

```bash
curl http://169.254.169.254/latest/
```

Aquí tienes la información organizada en formato markdown con el apartado solicitado, claro y estructurado:

## **¿Qué son los metadatos de la instancia?**

Cuando lanzas una instancia de Amazon EC2, esta proporciona automáticamente información sobre sí misma a través de un servicio conocido como **servicio de metadatos de instancia**. Este servicio se encuentra disponible únicamente desde la propia instancia EC2 y responde en la dirección IP reservada `169.254.169.254`.

Al realizar una petición desde la instancia a:

```bash
http://169.254.169.254/latest
```

La respuesta es un listado con tres categorías principales:

```bash
dynamic
meta-data
user-data
```

### **Categorías principales disponibles en los metadatos:**

A continuación se detallan claramente qué representa cada categoría:

### **1. Propiedades de metadatos de la instancia (`meta-data`)**

Son datos asociados a la instancia, organizados en categorías específicas. Algunos ejemplos comunes son:

- **ami-id**: Identificador de la Amazon Machine Image usada para lanzar la instancia.
- **instance-id**: Identificador único de la instancia.
- **hostname**: Nombre de host asignado automáticamente.
- **security-groups**: Grupos de seguridad asociados a la instancia.
- **network**: Información sobre interfaces de red.
- **placement**: Información sobre la ubicación física (disponibilidad, región).
- **iam**: Información sobre los roles IAM asociados a la instancia, incluyendo credenciales temporales.

Puedes consultar todas las categorías en la siguiente [referencia](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/ec2-instance-metadata.html#instancedata-data-categories).

**Ejemplo para obtener estos metadatos:**

```bash
curl http://169.254.169.254/latest/meta-data/
```

#### **Roles de IAM asignados a Instancias**

De estos datos asociados los más interesantes para un atacante pueden ser las **credenciales temporales de los roles** asignados a la instancia mediante políticas de IAM. Para acceder a ellos basta con realizar una petición a la siguiente ruta:

```bash
http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

En la respuesta aparecerán los distintos roles asignados a la instancia de EC2. Para obtener dichas credenciales se debe realizar una petición al endpoint anterior añadiendole el nombre del rol al final del path:

```bash
http://169.254.169.254/latest/meta-data/iam/security-credentials/<rol-name>
```

### **2. Datos dinámicos (`dynamic`)**

Los datos dinámicos son generados en tiempo de ejecución cuando la instancia se inicia. Incluyen información sensible al contexto o variables temporales específicas del entorno de ejecución, como el documento de identidad (instance-identity document), que incluye información sobre región, disponibilidad, tipo de instancia, etc.

**Ejemplo para obtener el documento de identidad dinámico:**

```bash
curl http://169.254.169.254/latest/dynamic/instance-identity/document
```

### **3. Datos de usuario (`user-data`)**

Los datos de usuario son parámetros o scripts proporcionados por el usuario en el momento del lanzamiento de la instancia. Permiten personalizar instancias genéricas mediante scripts de configuración o información específica, evitando así la necesidad de crear múltiples AMIs específicas para cada escenario.






## **IMDS versión 1 (IMDSv1) vs IMDS versión 2 (IMDSv2)**

AWS proporciona dos versiones del servicio IMDS:

### **IMDSv1**
IMDSv1 es la versión original del servicio y permite realizar solicitudes simples y directas a través de peticiones HTTP estándar, sin ningún paso previo de autenticación o validación. Cualquier proceso ejecutándose dentro de la instancia puede acceder directamente a los metadatos simplemente realizando una solicitud HTTP.

Por ejemplo, para obtener metadatos generales como el ID de instancia o las credenciales temporales asociadas al rol IAM:

```bash
curl http://169.254.169.254/latest/meta-data/
```

La simplicidad de IMDSv1 implica un riesgo significativo, ya que si una aplicación tiene una vulnerabilidad como Server-Side Request Forgery (SSRF), un atacante podría aprovechar esta vulnerabilidad para acceder directamente a información sensible y obtener credenciales temporales, lo que podría llevar al compromiso de la infraestructura AWS.

### **IMDSv2**

## **Uso de IMDSv2 para solicitar metadatos de instancia**

IMDSv2 mejora significativamente la seguridad al requerir un token temporal generado previamente antes de permitir el acceso a los metadatos de instancia. Este proceso protege las instancias EC2 frente a ataques comunes como Server-Side Request Forgery (SSRF), presentes en IMDSv1.

### **Procedimiento para utilizar IMDSv2**

Para acceder a los metadatos mediante IMDSv2 se requiere seguir dos pasos principales:

 **1\. Obtención de un token temporal**:

Se debe realizar una solicitud **PUT** al servicio de metadatos con un encabezado que especifique el tiempo de vida (**TTL**) del token, en segundos, con un máximo de seis horas (21,600 segundos). Este token representa una sesión lógica que solo es válida dentro de la instancia donde se generó.

```bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
```

- El token generado es específico para cada instancia y no es válido en otras instancias EC2.
- Puede reutilizarse múltiples veces hasta que expire o bien generarse un nuevo token por cada solicitud si la cantidad de peticiones es reducida.

**2\. Consulta de metadatos usando el token obtenido**:

Cada solicitud posterior al servicio de metadatos debe incluir este token en un encabezado específico llamado `X-aws-ec2-metadata-token`.

```bash
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
```

Cuando el uso del token se establece en `required`, cualquier solicitud GET o HEAD sin un token válido o con un token caducado recibirá un código de error HTTP `401 Unauthorized`.

### **Métodos HTTP permitidos y restricciones**

- Los métodos HTTP **GET** y **HEAD** están permitidos para realizar solicitudes al servicio de metadatos IMDSv2.
- Las solicitudes **PUT** se rechazan automáticamente si contienen un encabezado `X-Forwarded-For`.

---

Utilizar IMDSv2 de manera adecuada es una práctica fundamental de seguridad recomendada por AWS para proteger la infraestructura cloud contra posibles ataques o abusos derivados de vulnerabilidades en la configuración o aplicaciones desplegadas en las instancias EC2.

## **Riesgos de seguridad asociados a IMDSv1**

El principal problema de IMDSv1 radica en que permite consultas directas desde cualquier proceso dentro de la instancia sin autenticación adicional, haciendo posible explotar vulnerabilidades como el **Server-Side Request Forgery (SSRF)**.

Si una aplicación en una instancia EC2 tiene una vulnerabilidad de tipo SSRF y la instancia utiliza IMDSv1, un atacante podría:

- Forzar a la aplicación vulnerable a realizar una petición interna al servicio de metadatos.
- Obtener las credenciales temporales del rol IAM asignado a la instancia.
- Usar esas credenciales para acceder y comprometer otros recursos de AWS.

Ejemplo típico de explotación:

```bash
http://aplicacion-vulnerable.com?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

Esto expondría credenciales sensibles y permitiría comprometer potencialmente toda la infraestructura AWS.

La versión 2 soluciona bastante de estos problemas. Aunque es posible que se de el caso, es muy raro que a través de una vulnerabilidad SSRF el atacante pueda controlar el método de la petición o sus cabeceras. Para conseguir filtrar los metadatos de una instancia que use IMDSv2 a través de una vulnerabilidad SSRF, esta vulnerabilidad tendría que ser muy potente, permitiendo escoger entre los métodos `GET` y `PUT` para realizar la petición y además poder añadir cabeceras arbitrarias.

## **Buenas prácticas y mitigaciones**

Para reducir estos riesgos, AWS recomienda utilizar exclusivamente IMDSv2 y desactivar IMDSv1 en instancias sensibles.

### **Cómo desactivar IMDSv1**

Desde la CLI de AWS puedes obligar a una instancia a usar exclusivamente IMDSv2 así:

```bash
aws ec2 modify-instance-metadata-options --instance-id i-1234567890abcdef0 --http-tokens required --http-endpoint enabled
```

Esto requiere que todas las solicitudes al servicio de metadatos incluyan un token válido.

---

En conclusión, el uso adecuado de credenciales temporales y la migración a IMDSv2 constituyen medidas fundamentales para proteger eficazmente las instancias EC2 y evitar la explotación de vulnerabilidades críticas relacionadas con el acceso no autorizado a recursos AWS.

