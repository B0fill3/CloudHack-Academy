# **Introducción a AWS Identity and Access Management (IAM)**

<p align="center">
  <img src="/images/iam/IAM.png" alt="Introducción a IAM" width="60%" style="margin-top: 20px;margin-bottom: 40px;"/>
</p>

Imagina por un momento que estás a cargo de un edificio enorme lleno de habitaciones: una para los servidores, otra para bases de datos, otra para el correo, otras tantas con información confidencial. Cada habitación tiene cerraduras distintas, algunas con llaves normales, otras con tarjetas magnéticas o incluso reconocimiento facial. No solo tienes que decidir **quién entra y quién no**, sino también **qué pueden hacer dentro**: ¿solo mirar?, ¿mover cosas?, ¿encender máquinas?, ¿crear copias?, ¿o incluso dar acceso a otras personas?

Ese sistema que lo regula todo: las puertas, las llaves, las reglas, los permisos y las excepciones. Eso es exactamente lo que hace **IAM (Identity and Access Management)** en AWS.

IAM es el servicio que responde a tres preguntas fundamentales cada vez que alguien (o algo) intenta hacer algo en la nube:

1. **¿Quién eres?**  
2. **¿Qué quieres hacer?**  
3. **¿Estás autorizado a hacerlo?**

Y lo hace con una precisión quirúrgica.

En un sistema como AWS, donde hay decenas o cientos de servicios funcionando al mismo tiempo, desde máquinas virtuales hasta buckets de almacenamiento, pasando por colas de mensajes, funciones sin servidor y bases de datos globales, **tener control sobre el acceso no es una opción, es una necesidad crítica**. Sin un control riguroso de permisos, tu infraestructura puede volverse un caos o, peor aún, una puerta abierta a atacantes.

IAM no es solo una capa de seguridad más. Es **la base de la seguridad en la nube de AWS**. Es el guardián silencioso que permite que un desarrollador suba código a una función Lambda pero no pueda acceder a bases de datos sensibles; que una aplicación tenga permisos limitados para consultar una cola de mensajes pero no pueda modificarla; o que una cuenta externa pueda asumir un rol para leer logs... pero solo durante 15 minutos y solo si viene de la IP correcta.

Desde el punto de vista de un **pentester**, IAM es un mapa del tesoro y un campo de minas al mismo tiempo. Si está mal configurado, puede ser una vía directa a la **escalada de privilegios**, a la **persistencia encubierta** o incluso al **secuestro completo de una cuenta**. Si está bien configurado, en cambio, es uno de los muros más difíciles de escalar.

Entender IAM es entender **cómo piensa AWS la seguridad**: no se trata solo de poner contraseñas o firewalls, sino de definir identidades, relacionarlas con permisos y aplicar reglas granulares que se adapten a cada caso. Y eso, aunque suene técnico, no es tan diferente de cómo funciona la seguridad en el mundo real: no es lo mismo darle una copia de la llave de tu casa a tu madre que al repartidor del supermercado.

En resumen, **si estás aprendiendo pentesting en la nube y no entiendes IAM, estás yendo a ciegas**. Porque lo que no puedas hacer, lo que sí puedas hacer, y sobre todo, lo que **no deberías poder hacer pero sí puedes**... todo eso pasa por IAM.

---

A medida que nos adentremos en IAM, veremos que está compuesto por **usuarios, grupos, roles y políticas**, cada uno con un propósito específico. Las **políticas** definen los permisos, es decir, lo que una identidad puede o no puede hacer, usando un lenguaje declarativo en JSON. Estas políticas se adjuntan a las identidades (usuarios o roles) o a recursos directamente, y se evalúan en tiempo real con cada petición.

También exploraremos cómo funciona **STS (Security Token Service)**, que permite generar credenciales temporales y asumir roles, lo cual es una herramienta poderosísima tanto para buenas prácticas de seguridad como para ataques si no se gestiona adecuadamente. En manos de un atacante, un rol mal configurado puede ser el equivalente a conseguir una copia maestra de todas las llaves del edificio, aunque solo dure unos minutos.

IAM no es un simple "permite o deniega". Es una arquitectura completa de identidades, evaluaciones de políticas, condiciones, sesiones temporales y delegaciones entre cuentas. Y si algo tiene este sistema, es que **una pequeña grieta puede ser todo lo que un atacante necesita**.

Prepárate, porque entender IAM no es solo necesario para defender una cuenta... también es esencial para aprender a **romperla**.
