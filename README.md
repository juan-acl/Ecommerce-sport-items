# Sports Cart

Sistema de e-commerce de equipamiento deportivo. Incluye API REST serverless con Node.js + DynamoDB y SPA con React + Redux Toolkit.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Levantar los sevicios simulados](#levantar-el-proyecto-completo)
- [Servicios AWS simulados](#servicios-aws-simulados)
- [Documentación adicional](#documentación-adicional)

---
## Requisitos previos

- **Node.js** 20 o superior
- **pnpm** 8 o superior
- **Docker Desktop** o equivalente

Verificar versiones:

```bash
node --version    # >= v20.0.0
pnpm --version    # >= 8
docker --version  # cualquier versión moderna
```

---

## Levantar el proyecto

Instrucciones paso a paso para ejecutar el proyecto en local.

### 1. Clonar el repositorio

```bash
git clone https://github.com/juan-acl/Ecommerce-sport-items
cd sports-cart
```

### 1. Levantar los servicios simulados

Desde la **raíz del monorepo**:

```bash
docker compose up -d
```

Esto levanta 4 contenedores en background:

- DynamoDB Local
- DynamoDB Admin (UI)
- MinIO (almacenamiento S3-compatible)
- MailHog (servidor SMTP de desarrollo)

Verificar que están corriendo:

```bash
docker ps
```

Aparecera algo como: `dynamodb`, `dynamodb-admin`, `minio`, `mailhog`.

---

## Servicios AWS simulados

El proyecto simula los siguientes servicios AWS sin necesidad de credenciales reales ni costos.

### DynamoDB Local

Simulador oficial de Amazon que ejecuta DynamoDB en local. Los datos persisten en `docker-data/dynamodb/`.

| Acceso                       | URL                   |
| ---------------------------- | --------------------- |
| API DynamoDB                 | http://localhost:8000 |
| Panel de administración (UI) | http://localhost:8001 |

### MinIO (S3-compatible)

Servidor compatible con S3 que almacena las imágenes de productos. Persiste en `docker-data/minio/`.

| Acceso      | URL                   | Credenciales                                     |
| ----------- | --------------------- | ------------------------------------------------ |
| API S3      | http://localhost:9000 | —                                                |
| Consola web | http://localhost:9001 | usuario: `minioadmin` / contraseña: `minioadmin` |

Las imágenes de productos se sirven públicamente desde:

```
http://localhost:9000/sports-products/products/<id>.jpg
```

### MailHog

Servidor SMTP de desarrollo que **captura los emails sin enviarlos** a destinatarios reales. Es la herramienta estándar para probar el envío de correos en local.

| Acceso                  | URL                   |
| ----------------------- | --------------------- |
| SMTP                    | localhost:1025        |
| Bandeja de entrada (UI) | http://localhost:8025 |

**Cómo verificar que el envío de correos funciona:**

1. Realizar una compra completa desde el frontend
2. Abrir **http://localhost:8025** en el navegador
3. A contiuacion se mostrara el email de confirmación recibido.

---

## Colección de Postman

En la raíz del monorepo se incluye una colección de Postman con todos los endpoints del API ya configurados.

**Archivo:** [`./postman/SportsCart.postman_collection.json`](./postman/SportsCart.postman_collection.json)

### Cómo importar la colección

1. Abrir Postman
2. Click en **Import** (arriba a la izquierda)
3. Seleccionar el archivo `SportsCart.postman_collection.json`
4. La colección aparecerá en el panel izquierdo con todas las requests organizadas por módulo

## Documentación adicional

Cada parte del proyecto tiene su propia documentación detallada:

- [`backend/README.md`](./backend/README.md) — Arquitectura del backend, modelo de DynamoDB, API reference completa, decisiones de diseño.
- [`frontend/README.md`](./frontend/README.md) — Arquitectura del frontend, flujos de UI, capturas de pantalla.

---

## Autor

Juan Chuc
