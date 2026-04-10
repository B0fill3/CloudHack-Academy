# **User Pools: el corazón de la autenticación en Cognito**

Los **User Pools** son el componente de Cognito encargado de gestionar **usuarios, contraseñas, atributos, verificación de identidad y emisión de tokens**. Son, básicamente, una base de datos gestionada de usuarios con lógica de autenticación incorporada.

Cuando registras un usuario en un User Pool, Cognito se encarga de todo: guardar su contraseña de forma segura, enviar correos de verificación, gestionar la recuperación de cuenta, aplicar políticas de seguridad, etc. Y lo mejor es que todo esto lo hace sin que tengas que mantener tú mismo ninguna infraestructura de login.

### **¿Qué se puede hacer con un User Pool?**

Conociendo únicamente el `ClientId`, una aplicación puede:

* **Registrar usuarios** (`SignUp`)
* **Confirmar registros** (por código de email o SMS)
* **Autenticar usuarios** (`InitiateAuth`)
* **Renovar sesiones** usando `Refresh Tokens`
* **Modificar atributos del usuario**, como su email, nombre, grupo, etc.
* **Recuperar contraseñas**
* **Cambiar contraseñas**

Todos estos flujos están documentados públicamente y pueden ejecutarse desde cualquier cliente (CLI, Postman, SDKs, etc.), siempre y cuando el User Pool no tenga restricciones adicionales aplicadas.

Como te puedes estar imaginando, los desarrolladores en bastantes ocasiones asumen de manera incorrecta que estos flujos no se pueden invocar libremente desde el exterior. Creen que, por el simple hecho de que el ClientId no es secreto (porque está embebido en el frontend), Cognito se encargará automáticamente de "proteger" los endpoints sensibles. Pero no es así.

En realidad, el ClientId actúa como una especie de identificador público, similar a un "nombre de usuario" para la app, y cualquiera que lo conozca puede empezar a interactuar con el User Pool de forma legítima.

Si además no hay restricciones adicionales como validación del origen (AllowedOAuthFlows), flujos desactivados, validación explícita del correo, o filtros sobre qué atributos pueden modificarse… entonces estás dejando expuesta una interfaz bastante potente que puede ser abusada en escenarios reales.

> **Ejemplo:** Imagina una aplicación que esté diseñada únicamente para usuarios específicos de una compañía, en la que no hay panel de registro. Si supieras el clientId podrías intentar registrar tu propio usuario interactuando directamente con el User Pool, pudiendo así loguearte en la aplicación de acceso restringido.


## **Tokens que emite Cognito**

Tras un inicio de sesión exitoso (por ejemplo, mediante `InitiateAuth` con `AuthFlow=USER_PASSWORD_AUTH`), Cognito emite tres tipos de **tokens JWT** que representan la sesión del usuario y su identidad:

* **ID Token:** contiene información del usuario como `email`, `name`, `sub`, etc. Es el token que típicamente se utiliza en el frontend para mostrar el perfil del usuario o transmitir su identidad a otros servicios.

* **Access Token:** define los permisos del usuario dentro del User Pool. Incluye claims como los grupos a los que pertenece (`cognito:groups`) y los scopes autorizados. Este token se usa para proteger endpoints, validar autorizaciones y controlar el acceso a funcionalidades.

* **Refresh Token:** permite renovar el ID Token y el Access Token sin volver a introducir usuario y contraseña. Es esencial para mantener sesiones largas en apps móviles o SPAs.

Todos estos tokens son **firmados digitalmente por Cognito** y pueden validarse localmente utilizando su clave pública (`JWKS`), que está disponible en:

```bash
https://cognito-idp.<REGIÓN>.amazonaws.com/<USER_POOL_ID>/.well-known/jwks.json
```


### **Ejemplo práctico de login desde la CLI**

A continuación se muestra cómo iniciar sesión en Cognito usando el flujo `USER_PASSWORD_AUTH` desde la CLI de AWS:

```bash
aws cognito-idp initiate-auth \
  --region eu-west-1 \
  --client-id 4vexample1s2example3example \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=john.doe@example.com,PASSWORD=S3cretPassw0rd!
```

**Respuesta esperada:**

```json
{
  "AuthenticationResult": {
    "AccessToken": "eyJraWQiOiJLTzJuUX...<recortado>",
    "ExpiresIn": 3600,
    "TokenType": "Bearer",
    "RefreshToken": "eyJjdHkiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...<recortado>",
    "IdToken": "eyJraWQiOiJLTzJuUX...<recortado>"
  }
}
```

Cada uno de estos tokens tiene un propósito específico en la arquitectura de autenticación de Cognito:

* El **Access Token** se usará para modificar atributos del usuario, hacer llamadas autenticadas al backend o validar permisos.
* El **ID Token** contiene los atributos del usuario y se puede decodificar fácilmente para obtener su perfil.
* El **Refresh Token** permite obtener nuevos tokens sin necesidad de repetir el login.



## **Atributos de los usuarios en Cognito**

Cada usuario en un User Pool de Cognito tiene asociados **atributos**, que funcionan como campos de información personal: nombre, email, número de teléfono, género, fecha de nacimiento, etc. Algunos son **obligatorios** (como el `email`, si así lo define la configuración del User Pool), y otros son **opcionales o personalizados**.

### **Atributos estándar y custom**

Cognito diferencia entre:

* **Atributos estándar** (`email`, `name`, `phone_number`, `birthdate`, etc.)
* **Atributos personalizados**, definidos por los desarrolladores de la aplicación concreta, y que siempre empiezan por el prefijo `custom:` (por ejemplo, `custom:rol`, `custom:tipoUsuario`, etc.)

Esto permite adaptar el modelo de usuario a las necesidades de la aplicación sin tener que montar una base de datos adicional.

### **¿Dónde aparecen estos atributos?**

Muchos de estos atributos se incluyen **directamente dentro del ID Token** que se devuelve tras el login. Esto significa que cualquier cliente que tenga acceso al token puede leer esos valores.

Ejemplo de claims típicos en un `ID Token`:

```json
{
  "email": "usuario@example.com",
  "email_verified": true,
  "name": "Usuario de Prueba",
  "custom:rol": "admin",
  "sub": "c12d2d34-56fa-4b7a-99af-xxxxxxxxxxxx"
}
```

>**Importante:** si se permite que el usuario modifique ciertos atributos sin una validación adecuada, podría acontecerse una **escalada de privilegios encubierta**.

### **Modificación de atributos**

Cualquier usuario autenticado puede modificar algunos de sus atributos **siempre que tenga habilitado el flujo `UpdateUserAttributes` y el atributo en cuestión esté marcado como modificable**.

Esto puede hacerse desde el frontend, desde un cliente externo, o incluso desde la CLI:

```bash
aws cognito-idp update-user-attributes \
  --access-token <ACCESS_TOKEN> \
  --user-attributes Name="custom:rol",Value="admin"
```

Si tu aplicación no valida correctamente qué atributos deben poder cambiarse y cuáles no, estás exponiendo una puerta para abusos.

<quiz question="¿Qué prefijo tienen los atributos personalizados de usuario en Cognito?" correctAnswer="custom:" descAnswer="Cognito requiere que todos los atributos personalizados comiencen con 'custom:', por ejemplo: 'custom:rol'.">
</quiz>






