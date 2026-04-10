# **Funcionamiento de las Presigned URLs en S3**



### **¿Qué es una Presigned URL?**

Una **Presigned URL** (URL prefirmada) es un enlace temporal que permite acceder a un **objeto privado en un bucket S3** sin autenticación directa mediante credenciales de AWS.  
Se utiliza para permitir operaciones como:

- **GET**: descargar objetos  
- **PUT**: subir objetos  
- **DELETE**: eliminar objetos (menos común)

La URL incluye una **firma criptográfica** que autentica la solicitud, y una fecha de expiración tras la cual queda inutilizable.



###  **¿Cómo funciona?**

Cuando se genera una Presigned URL, se incluye:

- El nombre del bucket y el objeto (`/bucket/objeto.pdf`)
- Parámetros como:
  - `X-Amz-Algorithm`, `X-Amz-Credential`, `X-Amz-Date`, `X-Amz-Expires`
  - `X-Amz-Signature`: la firma HMAC-SHA256 que autentica todo

Esta URL permite acceder directamente al objeto desde el navegador o cliente HTTP, **sin exponer claves de AWS**.

**Ejemplo**

```bash
https://mi-bucket-s3.s3.amazonaws.com/documentos/secreto.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250401%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250401T121500Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=9c8a7e99e91cd11c569e5d6d49c741d4b3f4b682fa94e7b52490bbbe0c716d85
```



### **Expiración**

La duración de validez (`ExpiresIn`) puede ser desde segundos hasta un máximo de 7 días.  
Una vez expirada, AWS rechaza la solicitud con `403 Forbidden`.



#### **Ejemplo de generación de Presigned Url (Python - Boto3)**

```python
import boto3

s3 = boto3.client('s3')
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': 'mi-bucket', 'Key': 'privado.pdf'},
    ExpiresIn=300  # 5 minutos
)
print(url)
```



### **¿Por qué usar Presigned URLs en lugar de servir archivos desde el servidor backend?**

Esta es una **decisión arquitectónica clave** y tiene implicaciones directas en ciberseguridad, rendimiento y escalabilidad:

### **Ventajas de usar Presigned URLs**

| Ventaja | Explicación |
|--------|-------------|
| **Reducción de carga en el backend** | El tráfico pesado (descargas de vídeos, imágenes, etc.) va directamente a S3, liberando los servidores de aplicación. |
| **Mejor escalabilidad** | S3 está optimizado para servir archivos a gran escala con alta disponibilidad y throughput. |
| **Menor latencia** | Evita el paso intermedio por el backend; ideal en entornos distribuidos o móviles. |
| **Control granular y temporal del acceso** | Puedes limitar quién accede, cuándo, y por cuánto tiempo. |
| **Menor superficie de ataque en la app** | Al no tener que gestionar archivos ni tokens en tu backend, reduces vectores de ataque como path traversal o injections relacionadas con rutas de archivos. |

### **Consideraciones de seguridad**

- La presigned URL **otorga acceso directo al objeto**: si se filtra, se puede usar sin restricciones adicionales (a menos que esté muy bien controlada).
- Las URLs deben tratarse como **secretos temporales**.
- Si se reutilizan o se exponen en logs, correos, o apps, se puede comprometer información sensible.



## **Malas prácticas comunes**

Estas malas integraciones aparecen frecuentemente:

- **URLs con expiraciones excesivamente largas**: aumentan la ventana de riesgo en caso de filtración.
- **Incluir presigned URLs en código frontend o logs**: pueden ser vistas fácilmente por atacantes.
- **Permitir PUT sin validar el contenido**: puede dar lugar a uploads de malware o ataques de contenido (como XSS en HTML).
- **Compartir URLs entre usuarios**: lleva a exposición de recursos a usuarios no autorizados.

Estas malas prácticas **rompen el modelo de control de acceso basado en identidad** y convierten el recurso en algo pseudo-público, aunque el bucket sea privado.



###  **Generación de Presigned URLs con claves arbitrarias**

Uno de los fallos más comunes y peligrosos al implementar presigned URLs es permitir que el cliente (usuario final o frontend) **controle el parámetro `Key`** al solicitar una URL prefirmada.


### **¿Qué es una key arbitraria?**

La **key** en S3 es el identificador único del objeto dentro de un bucket.  
Si un atacante puede manipular libremente el valor de esa key en la generación de una presigned URL, entonces puede obtener acceso a **cualquier objeto** en el bucket, incluso aquellos que no debería poder ver.

Como atacantes es importante que tengamos en cuenta que las keys de S3 **no son rutas de archivos**, aunque visualmente lo parezcan. S3 es un sistema de almacenamiento plano: no tiene directorios reales, solo nombres de objetos que pueden contener / como parte del nombre. Esto significa que no aplican técnicas tradicionales como path traversal (../) o escapes de carpeta, pero sí podemos intentar enumerar keys predecibles o mal protegidas si la aplicación genera presigned URLs basándose en nombres controlados por el usuario. Además, debemos tener presente que S3 no impone ningún control jerárquico por defecto, por lo que una mala validación del prefijo puede permitir acceder a objetos fuera del ámbito esperado (por ejemplo, archivos de otros usuarios o backups internos). Sin embargo siempre cabe la posibilidad de encontrarnos con un sistema que normalice las rutas antes de generar la URL prefirmada...

### **Ejemplo de código vulnerable (Node.js con AWS SDK)**

```js
// ❌ ¡Inseguro! El cliente controla la key
app.get('/api/get-url', (req, res) => {
  const key = req.query.file; // ← control total por el usuario
  const url = s3.getSignedUrl('getObject', {
    Bucket: 'mi-bucket',
    Key: key,
    Expires: 300
  });
  res.send({ url });
});
```



### **Consecuencias**

Si no hay validación del `Key`, un atacante puede hacer cosas como:

```bash
curl "https://miapp.com/api/get-url?file=config/db-backup.sql"
```

Y recibir una URL válida para descargar archivos internos, sensibles o reservados, como:

- Backups de base de datos
- PDFs de otros usuarios
- Documentación interna
- Archivos `.env`, logs, etc.

Este patrón rompe por completo el modelo de seguridad del sistema.
Por esta razón, siempre se debe **mantener el control de la lógica que genera las presigned URLs en el backend**, y nunca confiar en valores como el `Key` si vienen directamente del frontend o del usuario.

## Caso Real 

A continuación se muestra un caso especialmente ilustrativo de esta clase de fallos, reportado por el investigador de ciberseguridad **Grzegorz Niedziela**. Descubrió una vulnerabilidad en la implementación de URLs prefirmadas en un bucket S3 perteneciente a una compañía anónima (por restricciones del programa de bug bounty en el que participaba). La aplicación permitía modificar el parámetro correspondiente al nombre del archivo para obtener enlaces válidos a documentos privados de otros usuarios.

Este hallazgo fue recompensado con **20.000 dólares**, lo que pone de relieve la gravedad y el impacto real de este tipo de errores de diseño. El caso fue documentado por el propio investigador en su vídeo titulado **"My $20,000 S3 bug that leaked everyone’s attachments"** publicado en YouTube.

<iframe className="w-full aspect-video my-20 rounded-xl shadow-2xl shadow-white/10" src="https://www.youtube.com/embed/MBQJJ3jfJ8k?si=_pQAXorzu8CF9Vxx" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>