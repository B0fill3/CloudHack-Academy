# **Abusando de malas prácticas en la configuración de Identity Pools**

Los **Identity Pools** permiten intercambiar un token de identidad (por ejemplo, un ID Token de un User Pool) por **credenciales temporales de AWS**. Recordemos que unas credenciales temporales de AWS sirven para acceder a servicios como S3, DynamoDB o Lambda. El problema surge cuando esta funcionalidad **se configura de forma laxa, sin restricciones adecuadas**, dejando la puerta abierta a accesos no autorizados, escaladas de privilegios o incluso compromisos completos de recursos internos.

Esta sección explora cómo errores comunes aparentemente inocentes, como confiar ciegamente en los atributos del ID Token, permitir usuarios no autenticados, o no validar dominios, pueden desembocar en vulnerabilidades con un alto impacto.

<p align="center">
  <img src="/images/cognito/HackerStealingRoles.png" alt="Hacker robando roles" width="70%" style="margin-top: 40px;margin-bottom: 50px;"/>
</p>

## **Registro libre + Identity Pool = acceso AWS para cualquiera**

Una de las combinaciones más peligrosas (y frecuentes) es la siguiente:

1. Un User Pool de Cognito permite **registro libre** (`SignUp` sin restricciones).
2. Un Identity Pool acepta **cualquier token válido de ese User Pool** como prueba de autenticación.
3. El rol IAM por defecto (para “usuarios autenticados”) tiene permisos de acceso a recursos internos.

El resultado: **cualquier persona puede registrarse, iniciar sesión y conseguir credenciales de AWS**, que luego puede usar para interactuar con servicios como S3, DynamoDB, SNS, Lambda, etc.

> **Ejemplo:** un atacante inspecciona el frontend de una app, encuentra el `ClientId` del User Pool, se registra con `attacker@example.com`, obtiene un ID Token y luego usa ese token para obtener credenciales AWS a través del Identity Pool.



## **Asignación de roles IAM basada en atributos manipulables**

Cognito permite asignar roles diferentes a través del Identity Pool según ciertos claims del token JWT, como `email`, `custom:rol` o `cognito:groups`.

El problema es que **muchos de estos claims pueden ser manipulados por el propio usuario si no hay controles adicionales**.

#### **Ejemplo 1: role mapping por `email`**

```json
{
  "claim": "email",
  "matchType": "EndsWith",
  "value": "admin.com",
  "roleARN": "arn:aws:iam::123456789012:role/AdminRole"
}
```

Si el Identity Pool asigna el rol de admin a cualquier usuario cuyo email termine en `admin.com`, **un atacante solo necesita cambiar su email a `hacker@admin.com`** (vía `update-user-attributes`) y luego obtener un nuevo token. Si el backend no valida que `email_verified=true`, el token sigue siendo válido… y el rol elevado se asigna.

#### **Ejemplo 2: role mapping por `custom:rol`**

```json
{
  "claim": "custom:rol",
  "matchType": "Equals",
  "value": "admin",
  "roleARN": "arn:aws:iam::123456789012:role/AdminRole"
}
```

Si el usuario puede modificar libremente atributos como `custom:rol`, puede simplemente cambiarlo a `admin` y obtener acceso completo a los servicios protegidos por ese rol. En este caso no basta con proteger el Identity Pool: **debes proteger el User Pool también**, impidiendo que el atributo `custom:rol` se pueda editar.

<quiz question="¿Cuál sería un claim seguro como base para asignar roles IAM desde un Identity Pool?" correctAnswer="sub" descAnswer="El claim 'sub' es un identificador único, inmutable y generado por Cognito. No puede ser manipulado por el usuario, a diferencia de 'email' o 'custom:rol'.">
</quiz>

## **Permitir acceso no autenticado sin revisar permisos**

En algunos entornos, el Identity Pool permite credenciales incluso a **usuarios no autenticados** (sin login). Esto se habilita explícitamente en la configuración del pool, pero es fácil olvidarse de limitar los permisos.

Si el rol por defecto de usuarios no autenticados tiene permisos como `s3:ListBucket` o `lambda:InvokeFunction`, cualquier atacante puede:

```bash
aws cognito-identity get-id \
  --identity-pool-id <POOL_ID>
```

```bash
aws cognito-identity get-credentials-for-identity \
  --identity-id <ID>  # sin necesidad de token
```

Y luego usar esas credenciales temporales para interactuar con AWS.



## **Exposición de IDs y roles en el frontend**

Por último, otra mala práctica muy común es exponer en el frontend:

* El `IdentityPoolId`
* El ARN de los roles utilizados
* El `UserPoolId` y el `ClientId`

Esta información, aunque no es confidencial por sí sola, **ayuda enormemente a un atacante a montar su ataque**. Si además los roles tienen políticas de confianza demasiado amplias (`Principal: "*"` o `Condition` poco estrictas), un atacante puede incluso asumir directamente esos roles desde fuera.




