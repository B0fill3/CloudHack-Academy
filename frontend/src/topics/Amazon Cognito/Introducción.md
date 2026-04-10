# **¿Qué es Amazon Cognito?**

Amazon Cognito es el servicio de AWS que se encarga de **gestionar usuarios, autenticación y control de acceso** en tus aplicaciones. Básicamente, si tu app necesita que los usuarios se registren, inicien sesión o mantengan sesiones activas, Cognito puede hacerlo por ti… y bastante bien.

Cognito permite que las aplicaciones móviles o web se integren fácilmente con flujos de autenticación típicos sin tener que montar un servidor OAuth desde cero. Además, se integra de forma nativa con otros servicios de AWS, lo que lo convierte en una opción cómoda para desarrolladores que quieren centrarse en su lógica de negocio y no complicarse con toda la parte de login, tokens, sesiones, etc.

Dentro de Cognito existen **dos componentes principales**:

* **User Pools:** se encargan de la **autenticación de usuarios**. Aquí es donde los usuarios se registran, validan emails o teléfonos, cambian contraseñas, y donde se generan los famosos **tokens JWT** (`ID token`, `Access token` y `Refresh token`).

* **Identity Pools (o Federated Identities):** permiten que los usuarios autenticados (o incluso usuarios anónimos) puedan obtener **credenciales temporales de AWS** para acceder directamente a recursos como S3, DynamoDB, etc. Todo esto ocurre por detrás usando STS.

<p align="center">
  <img src="/images/cognito/CognitoDiagramArrows.png" alt="Arquitectura de Cognito" width="80%" style="margin-top: 40px;margin-bottom: 50px;"/>
</p>

### **¿Dónde está el problema?**

El problema es que Cognito da por hecho que tú, como desarrollador, vas a entender bien cómo funciona todo el sistema de autenticación y control de acceso. Pero muchas veces no es así. Hay situaciones muy comunes donde se subestima el impacto de ciertos elementos.

Por ejemplo, el **Client ID** de un User Pool. A simple vista, parece algo inofensivo. De hecho, muchos desarrolladores lo incrustan directamente en el frontend sin pensárselo dos veces. Pero lo que no siempre se entiende es que **con solo conocer ese `ClientId`, ya puedes interactuar con el User Pool**: registrarte como usuario, iniciar sesión, confirmar un email, solicitar cambios de atributos, etc.

Esto **no es un bug**, es el comportamiento normal de Cognito. Pero si no hay protecciones adicionales configuradas (como validaciones del lado del servidor, restricciones de flujos de OAuth, control sobre los atributos modificables, o verificación de origen), ese `ClientId` se convierte en una llave de entrada bastante potente.

En otras palabras: Cognito no se rompe solo, pero si no lo configuras bien, **puede permitir acciones inesperadas desde el exterior**, incluso sin haber autenticado a ningún usuario todavía.

En las siguientes secciones vamos a profundizar en cómo funciona Cognito por dentro, qué flujos están disponibles y cuáles son los puntos clave donde deberías prestar atención para evitar sustos.
