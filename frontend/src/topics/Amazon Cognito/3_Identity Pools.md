# **Identity Pools: acceso temporal a servicios de AWS**

Mientras que los **User Pools** se encargan de autenticar identidades (usuarios, contraseñas, tokens...), los **Identity Pools** están diseñados para **autorizar el acceso a recursos de AWS**. En otras palabras: no gestionan quién eres, sino **a qué puedes acceder una vez autenticado**.

Los Identity Pools forman parte de Amazon Cognito Federated Identities y permiten emitir **credenciales temporales de AWS** (mediante STS) a cualquier identidad autenticada. Estas identidades pueden venir de un User Pool de Cognito, pero también de Facebook, Google, Apple, SAML, o incluso ser completamente anónimas.

Es la pieza que permite, por ejemplo, que una app web autenticada con Cognito pueda acceder a un bucket de S3, una función Lambda o escribir en una tabla DynamoDB… sin necesidad de credenciales permanentes.



## **¿Cómo funciona un Identity Pool?**

1. El usuario se **autentica** con algún proveedor de identidad (por ejemplo, con un User Pool).
2. La aplicación **intercambia su ID Token o Access Token por credenciales temporales** de AWS (AccessKeyId, SecretAccessKey y SessionToken).
3. Estas credenciales permiten a la app **hacer llamadas firmadas a servicios AWS**, limitadas por los permisos del rol asignado.

Este proceso se realiza mediante la API `GetId` y `GetCredentialsForIdentity`, o con la ayuda de SDKs como AWS Amplify o directamente con `aws sts assume-role-with-web-identity`.

> **Importante:** el Identity Pool no emite tokens JWT, sino credenciales temporales de AWS (tipo IAM).



### **¿Qué puedes hacer con un Identity Pool?**

Una vez tienes credenciales temporales obtenidas desde un Identity Pool, puedes:

* Acceder a recursos de AWS como si fueras un usuario IAM temporal.
* Usar políticas diferentes según el grupo o rol del usuario autenticado.
* Delegar privilegios mínimos según el tipo de usuario (anónimo, autenticado, admin...).
* Aplicar reglas de control basadas en condiciones como el `cognito:username`, el `aud` del token o cualquier claim del JWT.



## **Tipos de identidades soportadas**

Un Identity Pool puede emitir credenciales a distintos tipos de usuarios:

* **Usuarios autenticados** desde:

  * Cognito User Pools
  * Redes sociales (Facebook, Google, Apple)
  * SAML (proveedores corporativos)
* **Usuarios no autenticados (anónimos)** si así se configura el pool

Esto lo convierte en una solución muy flexible cuando necesitas **dar acceso controlado a AWS desde frontend o dispositivos móviles** sin distribuir credenciales IAM estáticas.





## **Ejemplo práctico: obtener credenciales temporales desde la CLI**

A continuación se muestra un flujo completo desde un token de autenticación hasta la obtención de credenciales temporales.


#### **1. Obtener el `IdentityId`**

Primero necesitas un **ID Token válido** que haya sido emitido por un **User Pool**. Este token debe estar firmado correctamente y no expirado.

Una vez lo tengas, ejecutas:

```bash
aws cognito-identity get-id \
  --identity-pool-id us-east-1:abcd1234-5678-90ab-cdef-EXAMPLE \
  --logins 'cognito-idp.us-east-1.amazonaws.com/us-east-1_examplepool=eyJraWQiOiJLTzJuUX...'
```

##### **¿Cómo se forma el parámetro `--logins`?**

El parámetro `--logins` es un **mapa clave-valor** que asocia el proveedor de identidad con su token de autenticación.

En el caso de Cognito User Pools, el formato es:

```bash
cognito-idp.<REGION>.amazonaws.com/<USER_POOL_ID>=<ID_TOKEN>
```

* **`<REGION>`**: la región donde se creó el User Pool (ej. `us-east-1`)
* **`<USER_POOL_ID>`**: el ID de tu User Pool (ej. `us-east-1_examplepool`)
* **`<ID_TOKEN>`**: el token JWT del usuario, obtenido tras un login válido

> Importante: asegúrate de usar el **ID Token** y no el Access Token. Solo el ID Token se acepta como prueba de identidad en `get-id` y `get-credentials-for-identity`.

Esto devolverá algo como:

```json
{
  "IdentityId": "us-east-1:11f173ba-8b4d-4efb-beb1-1234567890ab"
}
```

#### **2. Obtener credenciales temporales de AWS**

Ahora que tienes el `IdentityId`, puedes pedir credenciales:

```bash
aws cognito-identity get-credentials-for-identity \
  --identity-id us-east-1:11f173ba-8b4d-4efb-beb1-1234567890ab \
  --logins 'cognito-idp.us-east-1.amazonaws.com/us-east-1_examplepool=eyJraWQiOiJLTzJuUX...'
```

Respuesta esperada:

```json
{
  "Credentials": {
    "AccessKeyId": "ASIA...",
    "SecretKey": "vXxXxXxX...",
    "SessionToken": "FwoGZXIvYXdzEP...",
    "Expiration": "2025-06-01T15:00:00Z"
  }
}
```

> Estas credenciales se pueden usar con cualquier cliente AWS (SDK, CLI) mientras duren.



## **Asignación de roles y políticas en Identity Pools**

Un aspecto fundamental de los Identity Pools es la **asignación dinámica de roles IAM** a los usuarios que obtienen credenciales. Puedes configurar:

* Un **rol para usuarios autenticados**.
* Un **rol para usuarios anónimos**.
* Reglas de asignación condicional con base en claims del token (`cognito:groups`, `custom:rol`, etc.).

Por ejemplo, puedes decir que:

* Si el usuario pertenece al grupo `"admins"`, se le asigna un rol con permisos de lectura y escritura.
* Si no, se le asigna un rol más restringido.

Esto se define dentro de la propiedad `RoleMappings` o en el propio Identity Pool desde la consola.



## **Diferencia con los User Pools**

| Funcionalidad        | User Pool                  | Identity Pool          |
| -------------------- | -------------------------- | ---------------------- |
| ¿Autentica usuarios? | ✅ Sí                       | ❌ No                   |
| ¿Emite tokens JWT?   | ✅ Sí (ID, Access, Refresh) | ❌ No                   |
| ¿Da acceso a AWS?    | ❌ No directamente          | ✅ Sí, vía STS          |
| ¿Requiere backend?   | ❌ Puede ser standalone     | ✅ Usualmente integrado |
| ¿Soporta anónimos?   | ❌ No                       | ✅ Sí (si se configura) |



