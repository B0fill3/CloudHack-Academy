# CloudHack Academy

Academia de hacking ético enfocada en AWS. Aprende a detectar y explotar las vulnerabilidades más comunes en entornos cloud mediante laboratorios prácticos desplegables desde el navegador.

Proyecto de Fin de Grado — Alejandro Bofill

---

## Qué es esto

CloudHack Academy es una plataforma web con dos partes:

- **Teoría**: contenido estructurado por tópicos que cubre los servicios de AWS más relevantes desde el punto de vista ofensivo.
- **Laboratorios**: entornos vulnerables reales que el alumno despliega con un clic, ataca y destruye cuando termina.

Todo funciona desde el navegador. No hace falta configurar nada manualmente más allá de Docker y, para algunos labs, unas credenciales de AWS.

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

Para los laboratorios que despliegan infraestructura real en AWS (labs 3–9): una cuenta de AWS con la **capa gratuita** es suficiente. Todos los recursos utilizados en estos laboratorios están dentro del Free Tier de AWS.

---

## Arranque

```bash
git clone "https://github.com/B0fill3/CloudHack-Academy"
cd CloudHack-Academy
./start.sh
```

Abre el navegador en `http://localhost:3000`.

Para ejecutar en segundo plano:

```bash
./start.sh -d
```

Para detener:

```bash
docker compose down
```

---

## Contenido teórico

La academia incluye cuatro tópicos con sus secciones de teoría:

### S3 Buckets
- Introducción
- Permisos en S3
- Comandos CLI
- Presigned URLs

### IAM
- Introducción
- Fundamentos de IAM
- Entidades de IAM
- Políticas de IAM
- Otras Políticas
- Enumeración de Permisos
- Escalada de Privilegios

### EC2
- Introducción
- Servicio de Metadatos

### Amazon Cognito
- Introducción
- User Pools
- Malas prácticas con User Pools
- Identity Pools
- Malas prácticas con Identity Pools

---

## Laboratorios

| # | Nombre | Dificultad | Requiere AWS |
|---|--------|-----------|--------------|
| 1 | Bucket de S3 expuesto | Principiante | No |
| 2 | Exfiltración de credenciales desde EC2 mediante SSRF al servicio de metadatos | Intermedio | No |
| 3 | Bucket de S3 con integración incorrecta de URLs prefirmadas | Intermedio | Sí |
| 4 | Escalada de Privilegios mediante el permiso CreateAccessKey | Intermedio | Sí |
| 5 | Escalada de Privilegios a través de una nueva versión de una política | Intermedio | Sí |
| 6 | Escalada de Privilegios a través del permiso iam:PassRole | Avanzado | Sí |
| 7 | Acceso no autorizado y escalada de privilegios en Amazon Cognito | Intermedio | Sí |
| 8 | Ataque de colisión a Amazon Cognito | Intermedio | Sí |
| 9 | Identity Pool mal configurado en Amazon Cognito | Avanzado | Sí |

Los labs 1 y 2 emulan los servicios de AWS localmente mediante Python — no necesitan credenciales ni conexión a internet.

Los labs 3–9 despliegan infraestructura real en tu cuenta de AWS. Introduce tus credenciales desde la sección **Configuración AWS** de la web antes de lanzar el lab. Todos los recursos se etiquetan automáticamente y se pueden eliminar desde la propia interfaz cuando termines.

---

## Writeups

La solución detallada de cada laboratorio se encuentra en la memoria del proyecto:

```
doc/Memoria.pdf
```

---

## Créditos

Desarrollado por [Alejandro Bofill](https://www.linkedin.com/in/bofill3) como Trabajo de Fin de Grado.
