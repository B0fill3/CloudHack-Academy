# **Cómo funcionan los permisos en S3**

Al realizar pruebas de penetración, es fundamental comprender en profundidad las configuraciones de permisos de los buckets de Amazon S3, ya que las malas configuraciones son fallos de seguridad comunes que pueden provocar filtraciones de datos graves o accesos no autorizados.

Los buckets de Amazon S3 tienen permisos muy flexibles. Vamos a analizarlos paso a paso desde una perspectiva de pentesting:



### **1. Privado por defecto (Principio de seguridad por defecto)**

Por defecto, cuando se crea un bucket, tiene permisos **privados**. Esto significa que solo el propietario del bucket (la cuenta de AWS que lo creó) tiene permiso para subir, descargar, listar o eliminar objetos.

**Implicaciones de seguridad:**

* **Práctica segura:** AWS sigue aquí el principio de "seguridad por defecto", haciendo que el bucket sea inicialmente seguro.
* **Riesgos potenciales:** Durante una prueba de penetración, podrías encontrar escenarios en los que los desarrolladores hayan modificado estos permisos sin darse cuenta, creando oportunidades de explotación.



### **2. Acceso público (Vulnerabilidad común)**

AWS S3 permite a los usuarios configurar explícitamente sus buckets u objetos como **públicamente accesibles**, lo que significa que cualquiera con la URL puede ver o descargar el contenido sin autenticación.

**Caso de uso legítimo típico:**

* Alojar imágenes o archivos estáticos para sitios web públicos.

**Implicaciones de seguridad:**

* **Problema común:** Los desarrolladores o administradores suelen conceder por error acceso público a buckets sensibles, exponiendo involuntariamente información confidencial como credenciales, datos personales, código fuente, copias de seguridad de bases de datos, etc.
* **Qué buscar:**

  * Buckets con acceso anónimo.
  * URLs de buckets filtradas en código fuente o archivos de configuración.
  * Objetos sensibles accesibles sin autenticación.

**Escenario de ejemplo (vulnerabilidad común):**

* URL del bucket encontrada:

  ```bash
  https://company-backups.s3.amazonaws.com
  ```

* Riesgo si es públicamente accesible:

  * Los atacantes podrían descargar fácilmente las copias de seguridad y extraer datos confidenciales o credenciales.



### **3. Usuarios IAM, roles y políticas de bucket (Control detallado y posible vector de ataque)**

AWS proporciona potentes mecanismos de control de acceso a través de:

* **IAM (Identity and Access Management)**: Controla los permisos para usuarios o roles de AWS a nivel de cuenta.
* **Políticas de bucket**: Políticas basadas en JSON que definen explícitamente quién puede acceder al bucket y qué acciones específicas se permiten (por ejemplo: listar, subir, descargar, eliminar).

**Implicaciones de seguridad:**

* **Permisos IAM mal configurados:** Usuarios o roles con permisos excesivos o inapropiados pueden provocar escaladas de privilegios o accesos no autorizados a datos.
* **Políticas de bucket mal configuradas:** Políticas demasiado permisivas (como el comodín `'*'` en los permisos) podrían permitir que atacantes o usuarios no autorizados interactúen con los buckets.

**Ejemplos de políticas vulnerables:**

```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:*",
        "Resource": [
            "arn:aws:s3:::my-company-bucket/*",
            "arn:aws:s3:::my-company-bucket"
        ]
    }]
}
```

**¿Por qué es riesgoso?**

* El comodín `"Principal": "*"` significa que **cualquiera** puede realizar **cualquier acción** (`s3:*`) sobre el bucket, lo que supone una exposición crítica.



**Conclusión:**
Inspecciona siempre cuidadosamente los permisos de los buckets. Las malas configuraciones en AWS S3 son problemas de seguridad comunes y frecuentemente explotados en escenarios reales.


