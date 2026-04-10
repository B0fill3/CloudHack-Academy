# **Abuso de malas prácticas en la integración de User Pools**

Aunque Amazon Cognito proporciona una infraestructura sólida para la gestión de usuarios, **una configuración incorrecta o una integración poco cuidadosa puede introducir vulnerabilidades graves** en la lógica de autenticación y autorización de una aplicación. En muchos casos, los problemas no provienen del servicio en sí, sino del modo en que se integran y utilizan los User Pools.

Errores comunes como **permitir la modificación arbitraria de atributos sensibles** (por ejemplo, `email`, `phone_number`, o `custom:role`) o **usar identificadores no verificados como el email sin normalización ni validación adecuada**, pueden abrir la puerta a ataques de suplantación, escalado de privilegios o colisión de identidades. Esta sección explora algunas de estas prácticas inseguras, cómo pueden ser abusadas por un atacante y qué medidas se pueden aplicar para mitigarlas eficazmente.

<p align="center">
  <img src="/images/cognito/HackerStealingAccounts.png" alt="Hacker robando cuentas" width="70%" style="margin-top: 40px;margin-bottom: 50px;"/>
</p>

## **Abusando de identificadores inseguros en Cognito**

Cuando se desarrolla una aplicación que utiliza Amazon Cognito como backend de autenticación, uno de los errores más comunes (y peligrosos) es elegir mal el atributo con el que se identifican a los usuarios internamente.

Cognito expone varios atributos por usuario: `username`, `email`, atributos personalizados como `custom:rol`… pero **el único atributo que debe usarse para identificar a un usuario de forma segura es `sub`**.

#### **¿Por qué `sub` y no cualquier otro?**

El campo `sub` (de "subject") es un identificador único generado por Cognito. Es inmutable, no puede ser modificado por el usuario ni por el administrador, y está garantizado por Cognito para ser único dentro de cada User Pool. Este atributo está presente en todos los tokens (ID Token y Access Token) y cumple con el estándar OpenID Connect.

En cambio, atributos como `email` o `username`:

* Pueden ser modificados.
* No tienen garantías de unicidad.
* Son sensibles a mayúsculas/minúsculas.
* Pueden no estar verificados (`email_verified=false`).

Si tu backend utiliza `email` para identificar internamente a un usuario, estás dejando abierta una puerta que un atacante puede aprovechar.

Este fue el caso real de la aplicación de **Flickr** unos años atrás. Un investigador de ciberseguridad descubrió un fallo crítico en el flujo de autenticación que permitía llevar a cabo un "**Account Takeover**" debido al mal uso de los identificadores implementado en la aplicación.

> [Account Takeover en Flickr](https://security.lauritz-holtmann.de/advisories/flickr-account-takeover/)




### **Comportamientos engañosos de Amazon Cognito**

Cuando un usuario está **confirmado** en Amazon Cognito (`UserConfirmed = true`), significa que ha completado con éxito el proceso de registro y su cuenta está activa. Este estado es un requisito indispensable para que pueda **iniciar sesión** y obtener tokens válidos de acceso y de identidad. La confirmación puede ocurrir automáticamente (tras verificar un código enviado al correo o teléfono) o ser forzada manualmente por un administrador. Una vez confirmado, el usuario tiene acceso completo a los flujos de autenticación del user pool, independientemente de si sus atributos, como el correo electrónico, han sido verificados o actualizados posteriormente.


Un aspecto engañoso del funcionamiento interno de Cognito es cómo gestiona la confirmación de usuarios y la verificación de correos electrónicos. En Cognito, **confirmar al usuario no es lo mismo que verificar su email**. Cuando un usuario se registra y verifica su dirección de correo por primera vez, Cognito marca tanto el atributo `email_verified` como el estado general `UserConfirmed` como `true`. A partir de ese momento, **el usuario permanece confirmado para siempre**, incluso si más adelante **cambia su dirección de correo electrónico**. Sin embargo, el nuevo correo deberá verificarse nuevamente para que `email_verified` vuelva a ser `true`, pero esto no afecta al estado `UserConfirmed`.

Además, Cognito trata el campo `email` como **sensible a mayúsculas y minúsculas**, lo que significa que `victim@example.com` y `Victim@Example.com` son considerados **dos valores distintos**. Esto puede generar ambigüedades si el backend de la aplicación normaliza los emails (por ejemplo, convirtiéndolos a minúsculas) y Cognito no lo hace, lo que puede derivar en **colisiones lógicas** o inconsistencias en los flujos de autenticación, recuperación de cuenta o asignación de privilegios. 

Estos dos sutiles detalles del funcionamiento de Amazon Cognito pueden acabar generando problemas serios si no se gestionan con cuidado. Por un lado, una vez que un usuario confirma su cuenta (generalmente verificando su correo inicial), Cognito le permite iniciar sesión indefinidamente, incluso si más adelante cambia su dirección de correo y nunca la verifica. Sí, el atributo email_verified quedará en false, pero eso no impide el acceso. Por otro lado, el hecho de que Cognito distinga entre mayúsculas y minúsculas en el campo email puede parecer inofensivo, pero en la práctica abre la puerta a duplicaciones, confusiones y posibles colisiones si tu backend no aplica una normalización estricta. Combinados, estos comportamientos pueden ser especialmente delicados si estás utilizando el email como identificador principal. No es que estén mal diseñados, pero definitivamente requieren atención para no convertir un sistema de autenticación robusto en un nido de inconsistencias.

#### **Cómo explotar esta mala práctica**

Si la aplicación utiliza `email` como clave de identificación del usuario, y no comprueba si ese email ha sido verificado, como atacante puedes hacer lo siguiente:

1. Registrarte con un email cualquiera (por ejemplo `attacker@example.com`).
2. Confirmar la nueva cuenta a través del código de verificación enviado a tu email de atacante.
3. Iniciar sesión para obtener un Access Token.
4. Usar `update-user-attributes` para cambiar tu propio email al de la víctima (por ejemplo `Victim@flickr.com`).
5. Cognito cambiará el campo `email_verified` a `false`, pero si el backend **no valida este campo** y además normaliza el campo de `email`, entonces ahora eres tratado como si fueras la víctima.

Todo esto sin necesidad de robar contraseñas, tokens ni realizar phishing.


<quiz question="¿Cuál es el atributo que nunca debe usarse como identificador sin validación adicional?" correctAnswer="email" descAnswer="El campo 'email' es modificable por el usuario y puede estar sin verificar. Solo 'sub' es un identificador seguro e inmutable.">
</quiz>




## **“Si no tengo un formulario de registro, nadie puede registrarse”**

Otro error extremadamente común en aplicaciones que integran Amazon Cognito es asumir que, **si el frontend no expone un formulario de registro**, entonces ya nadie podrá registrarse. Esta suposición lleva a pensar que no hay riesgo de que usuarios no deseados acaben dentro del sistema, lo cual es **falso**.

Lo que ocurre es que muchos desarrolladores olvidan que **los User Pools de Cognito, por defecto, están abiertos al público**. Si el atributo `ClientId` de la aplicación se puede obtener (por ejemplo, inspeccionando el frontend o extrayéndolo del tráfico), **cualquier persona puede invocar el flujo `SignUp` directamente desde herramientas como la AWS CLI, Postman o un script en Python**, sin necesidad de que exista un frontend que lo permita.

Esto se vuelve especialmente peligroso en aplicaciones corporativas o privadas donde se espera que **solo personal interno acceda al sistema**. Si no se han configurado restricciones explícitas en el User Pool (por ejemplo, cerrar el flujo `ALLOW_USER_SIGN_UP`, exigir validación del dominio del correo, o usar Lambda triggers que bloqueen registros externos), un atacante puede registrar cuentas falsas y utilizar Cognito con total normalidad.

#### **Ejemplo práctico del error**

Imagina una aplicación interna de una empresa. El equipo de desarrollo integra Cognito para la autenticación, y como no necesitan que el público se registre, **no colocan un botón de "Registrarse" en el frontend**. Y listo, problema resuelto... ¿no?

Lo que olvidan es que basta con ejecutar:

```bash
aws cognito-idp sign-up \
  --client-id <CLIENT_ID> \
  --username atacante@externo.com \
  --password Test1234! \
  --user-attributes Name=email,Value=atacante@externo.com
```

Y el usuario ya ha quedado registrado. Recibirá un email con el código de verificación, lo confirmará y podrá **iniciar sesión como cualquier otro usuario legítimo**, aunque la aplicación **nunca tuvo intención de permitir registros externos**.

Este comportamiento ha sido observado en múltiples entornos reales, donde los desarrolladores confiaban en que "si no lo expongo en el frontend, nadie lo puede usar". La realidad es que **los endpoints de Cognito están públicos por defecto, y sin restricciones, cualquier cliente puede interactuar con ellos**.



## **Modificación de atributos: una puerta abierta al abuso si no se controla**

Amazon Cognito permite a los usuarios autenticados modificar ciertos atributos de su perfil, como `name`, `phone_number`, `email`, o incluso atributos personalizados como `custom:role`, siempre que esos atributos estén marcados como **mutables** en la configuración del User Pool.

Esta capacidad, aunque útil desde el punto de vista de la experiencia de usuario, **puede convertirse en un vector de ataque silencioso y extremadamente potente** si se combina con una integración negligente por parte del equipo de desarrollo.

### **Sí, puedes cambiar tus atributos… y sí, eso puede romperlo todo**

Como ya se ha comentado anteriormente, si el User Pool permite el uso del flujo `update-user-attributes` y el cliente (el frontend o cualquier cliente que tenga un token válido) puede invocar este endpoint, entonces **el usuario puede cambiar sus propios atributos sin necesidad de privilegios elevados**.

Esto por sí solo no es un fallo. El problema surge cuando:

* El backend **confía en esos atributos para aplicar lógica sensible**, como por ejemplo asignar roles, restringir acceso a recursos, construir rutas, o gestionar pertenencia a grupos.
* No se valida en el servidor **quién solicita el cambio** ni **qué atributo está siendo modificado**.
* Se asumen como inmutables atributos que Cognito permite cambiar.

En este contexto, un atacante podría:

* Cambiar su propio `email` para intentar suplantar a otro usuario (como ya hemos visto).
* Establecer un `custom:rol` a `"admin"` y esperar que el backend le otorgue privilegios administrativos sin verificación adicional.
* Manipular atributos como `email_verified` si el backend usa ese valor como base para flujos de autorización.
* Alterar valores como `name` o `locale` para atacar sistemas de renderizado o explotación de XSS si no hay escaping adecuado.



### **Ejemplo de abuso: escalada de privilegios silenciosa**

Imagina una aplicación que, tras el login, construye un menú de navegación basado en el atributo `custom:rol` que viene en el ID Token. Si ese token contiene `"custom:rol": "admin"`, se muestra una sección extra en la UI y se activan llamadas a endpoints más privilegiados.

Ahora piensa que el atacante ejecuta lo siguiente:

```bash
aws cognito-idp update-user-attributes \
  --access-token <ACCESS_TOKEN> \
  --user-attributes Name="custom:rol",Value="admin"
```

Después de eso, si la aplicación no valida el origen de ese valor y simplemente se fía del contenido del token, **el atacante puede pasar de ser un usuario normal a ser tratado como administrador**, sin haber explotado ninguna vulnerabilidad técnica tradicional. Solo ha abusado de una configuración permisiva.

