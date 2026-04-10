# **Introducción general a Amazon EC2**

Amazon EC2 (**Elastic Compute Cloud**) es un servicio fundamental en AWS que permite crear y gestionar servidores virtuales en la nube, conocidos como instancias. EC2 proporciona una plataforma sencilla, flexible y escalable para desplegar aplicaciones, sitios web, bases de datos y otras cargas de trabajo informáticas en un entorno cloud.

## **¿Qué es Amazon EC2 exactamente?**

Imagina EC2 como un ordenador virtual que puedes configurar con diferentes sistemas operativos (Linux, Windows, etc.), recursos (CPU, memoria, almacenamiento), y al que puedes acceder remotamente mediante SSH (Linux) o RDP (Windows). Las instancias EC2 ofrecen un control total sobre el sistema operativo y permiten instalar cualquier software requerido.

## **Conceptos clave de Amazon EC2 que deberías conocer**

### **Instancias y AMIs**

Una instancia EC2 es básicamente un servidor virtual en la nube que se crea a partir de una plantilla predefinida llamada Amazon Machine Image (AMI). Las AMIs contienen el sistema operativo, software preinstalado y configuraciones iniciales necesarias para lanzar la instancia. Existen AMIs públicas (proporcionadas por AWS o la comunidad), AMIs privadas (creadas por ti o tu organización) y AMIs compartidas (de terceros). Es importante comprender el uso de AMIs para configurar rápidamente un entorno, especialmente cuando necesitas reproducir escenarios específicos o vulnerabilidades en pentesting.

### **Tipos de instancias**

AWS ofrece diferentes tipos de instancias según las necesidades específicas de recursos computacionales. Las categorías principales son:

- **Uso general**: Balanceadas para uso general, ideales para prácticas de pentesting y tareas cotidianas.
- **Optimizadas para cómputo**: útiles para pruebas que requieren muchos recursos de CPU (por ejemplo, cracking de contraseñas).
- **Optimizadas para memoria o GPU**: para tareas especializadas como procesamiento intensivo o uso de herramientas avanzadas de análisis y machine learning.

Comprender estos tipos te permitirá elegir correctamente los recursos según la tarea específica que realices.

### **Redes, grupos de seguridad y firewall virtual**

Cada instancia EC2 se conecta a redes mediante interfaces de red virtuales. Los **grupos de seguridad** actúan como firewalls virtuales que permiten o bloquean tráfico entrante y saliente mediante reglas. Una configuración incorrecta puede exponer innecesariamente servicios sensibles como SSH o bases de datos al exterior, siendo un importante foco de vulnerabilidades. Identificar rápidamente configuraciones inseguras en estos grupos es crucial para realizar auditorías eficientes.

### **Pares de claves SSH (Key pairs)**

AWS utiliza claves SSH para autenticarse en instancias Linux, reemplazando contraseñas tradicionales por una forma más segura de acceso. Entender cómo generar, almacenar y proteger estas claves es importante, ya que la mala gestión o exposición accidental de estas claves puede permitir accesos no autorizados. En el contexto de pentesting, la gestión segura y la posible exposición de claves SSH es algo común y altamente relevante.

### **Direcciones IP elásticas (Elastic IP)**

Las direcciones IP elásticas son direcciones públicas estáticas asignadas por AWS. Son útiles cuando necesitas una dirección IP constante para una instancia, por ejemplo, durante auditorías externas o configuraciones persistentes. Es fundamental conocer este concepto para gestionar eficazmente escenarios donde se realizan pruebas constantes o auditorías externas.

### **Almacenamiento EBS en EC2**

EC2 usa EBS (Elastic Block Store), que actúan como discos duros virtuales. Comprender cómo funciona EBS es importante porque estos volúmenes pueden contener datos sensibles, logs o archivos de configuración. Además, los volúmenes pueden desmontarse y conectarse a otras instancias, facilitando el análisis forense en escenarios reales de pentesting o investigación.

### **Roles IAM en EC2**

Los roles IAM permiten que las instancias EC2 interactúen con otros servicios AWS sin almacenar credenciales directamente en la instancia. La incorrecta asignación o sobrepermisión de estos roles puede causar vulnerabilidades graves, permitiendo accesos no autorizados o movimientos laterales entre servicios AWS. Aprender a auditar y gestionar correctamente estos roles puede prevenir errores críticos en seguridad.

## **¿Por qué EC2 es importante para estudiantes de pentesting?**

Comprender EC2 es clave porque gran parte de las infraestructuras cloud que auditarás se basa en este servicio. EC2 es el entorno ideal para construir laboratorios realistas de pentesting donde practicar técnicas como reconocimiento, explotación, escalado de privilegios y post-explotación.

Tener una base sólida sobre los conceptos generales de EC2, desde creación hasta seguridad, te permitirá abordar auditorías reales identificando rápidamente puntos débiles o configuraciones inseguras en escenarios profesionales.

---

En resumen, entender EC2 no solo te permite manejar adecuadamente la infraestructura cloud, sino también desarrollar una mirada crítica para detectar configuraciones peligrosas y posibles vectores de ataque desde la perspectiva de un pentester.

