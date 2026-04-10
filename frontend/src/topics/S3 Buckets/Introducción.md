# **Introducción a S3 y riesgos de seguridad**

![S3 Buckets](https://locusit.se/wp-content/uploads/2024/08/Amazon-S3.png)



## **¿Qué es Amazon S3 (Simple Storage Service)?**

Imagina que tienes una enorme cantidad de archivos (como fotos, vídeos, documentos, copias de seguridad, etc.) y necesitas un lugar seguro y accesible para almacenarlos. Idealmente, querrías acceder a ellos desde cualquier parte del mundo, tener la certeza de que nunca se perderán y poder ampliar fácilmente el almacenamiento desde un solo archivo hasta millones.

**Amazon S3 (Simple Storage Service)** ofrece precisamente eso. Es un servicio de almacenamiento en la nube de Amazon Web Services (AWS), diseñado para almacenar y recuperar grandes volúmenes de datos de forma segura, eficiente y confiable.



## **¿Qué es un Bucket de S3?**

Un **bucket de S3** es como un contenedor o área de almacenamiento en internet donde guardas tus archivos.

Piensa en un bucket como una carpeta gigante basada en la nube con un nombre global único, diseñada para contener y organizar archivos (a los que Amazon llama "objetos") como imágenes, documentos, copias de seguridad y más.


Por supuesto, aquí tienes la traducción completa y precisa al español:



## **Características clave de un Bucket de S3:**

### **1. Nombre globalmente único**

Cada bucket debe tener un nombre que sea **único en todo el mundo**, no solo dentro de tu cuenta.

* **Ejemplo válido:** `mi-bucket-personal-2025`
* **Ejemplo no válido:** `archivos` (es demasiado común y probablemente ya esté en uso)

El nombre del bucket debe ser globalmente único porque Amazon lo utiliza para crear URLs que permiten acceder directamente a tu bucket.

**Ejemplo de URL:**

```bash
https://<nombre-del-bucket>.s3.<región>.amazonaws.com
```

Ten en cuenta que el nombre del bucket es único a nivel global, independientemente de la región, pero es necesario especificar la región en la URL para acceder al bucket.


### **2. Organización de archivos**

Dentro de tu bucket, puedes organizar los archivos en carpetas (Amazon S3 se refiere a estas carpetas como "prefijos"):

```bash
- Imágenes/
  - verano/
    - playa.jpg
    - viaje.png
  - invierno/
    - nieve.jpeg
- Documentos/
  - curriculum.pdf
  - presentación.pptx
```

>Aunque S3 no tiene carpetas reales como las de tu computadora, los prefijos simulan estructuras de carpetas, lo que facilita la organización y localización de tus archivos.


### **3. Objetos en S3**

En Amazon S3, cada archivo almacenado se conoce como un **objeto**, que se compone de tres partes principales:

* **Clave (nombre del objeto):** La ruta completa del archivo dentro del bucket.

  * Ejemplo: `Imágenes/verano/playa.jpg`
* **Valor (contenido del archivo):** El contenido real del archivo que has subido (por ejemplo, una foto, documento o vídeo).
* **Metadatos:** Información adicional sobre el objeto (por ejemplo, fecha de creación, permisos, tamaño, tipo de archivo).




## **Ejemplo práctico**

Veamos un escenario práctico:

Eres administrador de sistemas en una empresa llamada **TechCloudUEX**, y tu empresa necesita que almacenes documentos importantes de forma segura en Amazon S3.

#### **Paso 1: Crea tu bucket**

* Nombre del bucket elegido: `techcloud-documents-2025`
* Región seleccionada: Europa (`eu-west-1`)

Después de crearlo, tendrás una URL del bucket similar a:

```bash
https://techclouduex-documents-2025.s3.eu-west-1.amazonaws.com
```


#### **Paso 2: Sube archivos al bucket**

Subes estos documentos a tu bucket (a través de la consola de AWS, CLI, SDK o API):

* Contracts/employee-contract.pdf
* Contracts/client-contract.pdf
* Manuals/internal-guide.pdf

Puedes acceder a cualquier archivo directamente mediante su URL:

```bash
https://techcloud-documents-2025.s3.eu-west-1.amazonaws.com/Contracts/client-contract.pdf
```



## **Control de versiones y copia de seguridad de datos**

Los buckets de S3 te permiten habilitar el **control de versiones**. Esto significa que S3 conserva las versiones antiguas de los archivos cuando se sobrescriben o eliminan, permitiéndote restaurar versiones anteriores fácilmente.

* **Ejemplo:** Subes `datos.txt`. Si lo modificas y vuelves a subir `datos.txt`, S3 conserva la versión original como copia de seguridad por si la necesitas más adelante.

Esto resulta interesante desde el punto de vista de un atacante. Podría ser útil para recuperar una copia de seguridad de un archivo específico por alguna razón.



## **Conclusión**

Los buckets de Amazon S3 ofrecen una forma sencilla pero potente de almacenar y organizar archivos en la nube, proporcionando escalabilidad, seguridad, gestión sencilla y una durabilidad de datos sin igual.


