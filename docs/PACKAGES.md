# Paquetes

Ephemeral Rooms es un monorepo con 5 paquetes, siguiendo un patrón de clean architecture.

---

## 📦 shared

**Propósito:** Utilidades compartidas, tipos e interfaces usados en todos los paquetes.

```
src/
├── messaging/     # Tipos de mensajes y serialización
├── models/        # Modelos de dominio (User, Room, Message)
└── repositories/  # Interfaces de repositorios
```

### Exports

| Ruta             | Descripción                 |
| ---------------- | --------------------------- |
| `./messaging`    | Tipos y helpers de mensajes |
| `./models`       | Modelos de dominio          |
| `./repositories` | Interfaces de repositorios  |

---

## 🏗️ application

**Propósito:** Capa de lógica de negocio - use cases y servicios de aplicación.

```
src/
├── helpers/       # Funciones helper
└── lib/           # Lógica exportable (use cases, clases de servicio)
```

### Exports

| Ruta           | Descripción                                          |
| -------------- | ---------------------------------------------------- |
| `./use-cases`  | Lógica de negocio                                    |
| `./messaging`  | Encapsulación de enrutamiento de mensaje entre capas |
| `./classes`    | Clases de servicio reutilizables                     |
| `./interfaces` | Interfaces de servicios (e.g. RoomContextFactory)    |

---

## 🔧 infra

**Propósito:** Implementaciones de infraestructura - Redis, clientes WebSocket, servicios externos.

```
src/
├── redis/   # Cliente y operaciones de Redis
└── ws/      # Utilidades de cliente WebSocket
```

### Exports

| Ruta      | Descripción                                |
| --------- | ------------------------------------------ |
| `./redis` | Conexión y operaciones de Redis            |
| `./ws`    | Utilidades de cliente y servidor WebSocket |

---

## 🔌 server

**Propósito:** Servidor WebSocket que maneja comunicación en tiempo real.

```
src/
├── Client.ts           # Conexión de cliente individual
├── ClientController.ts # Manejadores de eventos del cliente
├── ClientFactory.ts    # Factory de clientes
├── ClientsHub.ts      # Maneja todos los clientes conectados
├── Server.ts           # Lógica principal del servidor
├── container.ts       # Inyección de dependencias
└── index.ts           # Punto de entrada
```

### Detalles

- **Puerto:** 3001
- **Protocolo:** WebSocket (nativo)
- **Sin Socket.IO** - implementación liviana personalizada

### Comandos

```bash
npm run dev   # Desarrollo con hot reload
npm run start # Producción
npm run build # Compilación TypeScript
```

---

## 🌐 web

**Propósito:** Aplicación frontend de Next.js.

```
app/
├── api/           # Rutas API
├── components/    # Componentes React
├── container/     # Contenedor DI
├── contexts/       # Contextos React
├── hooks/         # Custom hooks
├── room/          # Páginas de sala
│   └── [code]/    # Ruta dinámica de sala
├── services/      # Servicios del frontend
├── layout.tsx     # Layout raíz
├── page.tsx       # Página home
└── globals.css    # Estilos globales
```

### Componentes Principales

| Componente     | Descripción                       |
| -------------- | --------------------------------- |
| `RoomClient`   | Componente principal de chat      |
| `MessagesList` | Lista de mensajes con auto-scroll |
| `MessageInput` | Input para enviar mensajes        |
| `UsersList`    | Muestra usuarios online           |
| `JoinClient`   | Formulario para unirse            |

### Rutas

| Ruta                | Descripción                |
| ------------------- | -------------------------- |
| `/`                 | Home - crear/unirse a sala |
| `/room/[code]`      | Página de sala             |
| `/room/[code]/join` | Formulario para unirse     |

### Comandos

```bash
npm run dev   # Servidor dev de Next.js
npm run build # Build de producción
npm run start # Servidor de producción
```

---

## 🏃‍♂️ Ejecutando el Proyecto

### Desarrollo

```bash
# Todos los paquetes a la vez
npm run dev

# O por separado
npm run dev:libs    # shared, application, infra
npm run dev:runtime # web, server
```

### Producción

```bash
npm run build
npm run start
```

---

## 🐳 Docker

Redis es necesario para persistencia de mensajes/estado:

```bash
docker-compose up -d
```

Esto inicia un contenedor de Redis en el puerto 6379.
