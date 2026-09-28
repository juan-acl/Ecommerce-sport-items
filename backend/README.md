# Sports Cart - Backend

API REST serverless para un carrito de compras de artículos deportivos.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Modelo de datos (Single Table Design)](#modelo-de-datos-single-table-design)
- [Estructura del proyecto](#estructura-del-proyecto)
---


## Requisitos previos

- **Node.js** 20 o superior
- **pnpm** 8+
- **Docker Desktop** (para los servicios simulados)

```bash
# Verificar versiones
node --version    # >= v20.0.0
pnpm --version    # >= 8
docker --version  # cualquier versión moderna
```

---

## Instalación y ejecución

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Las variables por defecto funcionan para desarrollo local. Solo el `JWT_SECRET` siempre tiene que tener al menos 32 caracteres.

### 3. Levantar los servicios AWS simulados

Verifica el - [`../README.md`](../README.md):

### 4. Inicializar tabla, bucket y datos de prueba

```bash
pnpm seeders
```

Este comando:

1. Crea la tabla `Ecommerce` en DynamoDB Local con 2 GSIs.
2. Crea el bucket `sports-products` en MinIO con política pública para el prefijo `products/*`.
3. Descarga 10 imágenes de productos de Unsplash, las sube a MinIO y crea los items en DynamoDB.

### 5. Levantar el servidor

```bash
pnpm dev
```

El API queda disponible en **http://localhost:3000**.

### 6. Verificar con servicio de prueba

```bash
curl http://localhost:3000/v1/auth/health
```

Respuesta esperada:

```json
{
  "success": true,
  "data": { "service": "auth", "status": "ok" },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Levanta serverless-offline en modo desarrollo |
| `pnpm build` | Compila TypeScript a JavaScript |
| `pnpm seeders` | Crea tabla + bucket + carga seed completo |
| `pnpm table:create` | Solo crea la tabla |
| `pnpm table:delete` | Elimina la tabla |
| `pnpm bucket:create` | Solo crea el bucket |
| `pnpm seed` | Solo carga productos |
| `pnpm test` | Corre tests con Jest |
| `pnpm lint` | Verifica reglas de ESLint |
| `pnpm format` | Formatea con Prettier |

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Runtime | Node.js 20 |
| Lenguaje | TypeScript (modo estricto) |
| Framework HTTP | Express |
| Serverless | Serverless Framework v3 + serverless-offline |
| Base de datos | DynamoDB Local (Single Table Design) |
| Almacenamiento | MinIO (S3-compatible) |
| Email | MailHog (SMTP de desarrollo) |
| Autenticación | JWT + bcryptjs |
| Validación | Zod |
| Inyección de dependencias | Awilix |
| Logging | Winston |
| Package manager | pnpm |

---

## Arquitectura

El proyecto sigue **Clean Architecture por módulos**, donde cada módulo (auth, users, products, carts, orders) tiene sus propias capas independientes:

```
┌──────────────────────────────────────────────────────────┐
│  PRESENTATION  (controllers, routes, middlewares)        │
│  Recibe HTTP, valida, delega al use case, devuelve HTTP  │
└──────────────────────────────────────────────────────────┘
                         depende de
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│  APPLICATION  (use cases, DTOs)                          │
│  Orquesta entidades del dominio. Lógica de aplicación.   │
└──────────────────────────────────────────────────────────┘
                         depende de
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│  DOMAIN  (entities, value-objects, repository ports)     │
│  Reglas de negocio puras. NO depende de tecnología.      │
└──────────────────────────────────────────────────────────┘
                            ▲
                         implementa
                            │
┌──────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE  (DynamoDB, S3, JWT, bcrypt, nodemailer) │
│  Implementaciones concretas de los puertos del dominio.  │
└──────────────────────────────────────────────────────────┘
```

### Regla de dependencias

Las dependencias **siempre apuntan hacia el dominio**. Esto significa:

- El **dominio** no importa nada externo (ni Express, ni AWS SDK, ni bcrypt).
- La **aplicación** depende solo del dominio (interfaces, no implementaciones).
- La **infraestructura** implementa las interfaces del dominio (con tecnología concreta).
- La **presentación** depende de la aplicación (use cases).

### Beneficios

- **Testabilidad**: los use cases se prueban con mocks de los repositorios sin levantar DynamoDB.
- **Portabilidad**: migrar de DynamoDB a Postgres es cambiar una implementación de repositorio sin tocar el dominio.
- **Mantenibilidad**: cambios en infraestructura no propagan al resto del código.

### Arquitectura serverless

La aplicación está dividida en **4 funciones Lambda independientes**:

```
                    ┌─────────────────────┐
                    │    API Gateway      │
                    │  (serverless-offline)│
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Lambda: auth │      │ Lambda: cart │      │Lambda: orders│
│ /v1/auth/*   │      │ /v1/cart/*   │      │ /v1/orders/* │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │              ┌──────────────┐             │
       │              │   Lambda:    │             │
       │              │   products   │             │
       │              │ /v1/products/*             │
       │              └──────┬───────┘             │
       │                     │                     │
       └──────────┬──────────┴──────────┬──────────┘
                  │                     │
                  ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │  DynamoDB    │      │   S3 (MinIO) │
          │ (Single      │      │  Imágenes    │
          │  Table)      │      │  productos   │
          └──────────────┘      └──────────────┘
                  │
                  ▼
          ┌──────────────┐
          │   MailHog    │
          │   (SMTP)     │
          └──────────────┘
```

Cada Lambda usa Express internamente (vía `serverless-http`) para enrutar dentro de su dominio.

---

## Modelo de datos (Single Table Design)

Toda la aplicación usa **una sola tabla de DynamoDB** con dos GSIs. Este patrón permite minimizar las consultas y aprovechar al máximo el modelo de DynamoDB.

### Tabla principal

| Atributo | Tipo | Descripción |
|---|---|---|
| `PK` | String | Partition Key |
| `SK` | String | Sort Key |
| `GSI1PK` | String | PK del GSI1 |
| `GSI1SK` | String | SK del GSI1 |
| `GSI2PK` | String | PK del GSI2 |
| `GSI2SK` | String | SK del GSI2 |

### Estructura por entidad

| Entidad | PK | SK | GSI1PK | GSI1SK | GSI2PK | GSI2SK |
|---|---|---|---|---|---|---|
| User | `USER#<id>` | `PROFILE` | `EMAIL#<email>` | `USER` | — | — |
| Product | `PRODUCT#<id>` | `METADATA` | `PRODUCT` | `<id>` | `CATEGORY#<cat>` | `PRODUCT#<id>` |
| Cart Item | `USER#<id>` | `CART#PRODUCT#<pid>` | — | — | — | — |
| Order | `USER#<id>` | `ORDER#<isoTs>#<orderId>` | — | — | — | — |


## Estructura del proyecto

```
backend/
├── docker-compose.yml          # Servicios AWS simulados
├── serverless.yml              # Configuración principal (orquesta YAMLs)
├── serverless/
│   ├── config/                 # provider, environment, custom, plugins
│   ├── functions/              # Definición de cada Lambda
├── scripts/
│   ├── create-table.ts         # Crea la tabla en DynamoDB Local
│   ├── delete-table.ts
│   ├── create-bucket.ts        # Crea el bucket en MinIO + política pública
│   └── seed-products.ts        # Carga productos + sube imágenes
├── src/
│   ├── handlers/               # Entry points de Lambda
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── carts/
│   │   └── orders/
│   │       ├── domain/         # Entidades, ports, repositorios (interfaces)
│   │       ├── application/    # Use cases, DTOs (Zod schemas)
│   │       ├── infrastructure/ # Implementaciones concretas
│   │       └── presentation/   # Controllers y rutas
│   └── shared/
│       ├── domain/             # Excepciones base, value objects compartidos
│       ├── application/        # Ports compartidos (LoggerPort, etc.)
│       └── infrastructure/
│           ├── config/         # Validación de env con Zod
│           ├── di/             # Container Awilix
│           ├── dynamodb/       # Cliente compartido + constantes single-table
│           ├── http/           # Factory Express, middlewares, response builder
│           ├── logging/        # Winston + adapter del puerto
│           └── s3/             # Cliente compartido
├── tests/
└── logs/                       # Logs generados por Winston (gitignored)
```

### Por qué esta estructura

- **Carpeta por módulo (auth, users, products, etc.)**: cada uno es una bounded context con sus 4 capas.
- **`shared/`**: código usado por más de un módulo (logger, config, etc.).
- **`handlers/`**: solo orquestan el container con el router. Sin lógica.
- **`scripts/`**: utilidades de operación.

---
