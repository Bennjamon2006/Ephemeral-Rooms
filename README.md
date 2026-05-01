# Ephemeral Rooms

> Salas de chat que desaparecen cuando te vas. Sin registro necesario.

Una aplicación de chat en tiempo real donde los usuarios pueden crear salas temporales que se borran cuando todos se desconectan. Perfecto para conversaciones rápidas y privadas sin complicarte con cuentas.

![Status](https://img.shields.io/badge/status-complete-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🔗 **Compartir enlace** - Envia el enlace de la sala a tus amigos
- 🔢 **Unirse con código** - Unite con un código simple
- 👤 **Sin registro** - Elegí un nombre y empezá a chatear
- 🗑️ **Efímero** - Las salas se borran cuando todos se van
- ⏱️ **Auto-limpieza** - Salas inactivas se eliminan después de 1 minuto
- 💬 **Tiempo real** - Mensajes instantáneos via WebSocket

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar Redis (necesario)
docker-compose up -d

# Ejecutar desarrollo
npm run dev
```

Esto inicia:

- **Web:** http://localhost:3000
- **WebSocket:** ws://localhost:3001

## 📋 Requisitos

- Node.js 18+
- Docker (para Redis)

## 🏗️ Arquitectura

Es un **monorepo** con 5 paquetes siguiendo clean architecture:

| Paquete       | Propósito                  |
| ------------- | -------------------------- |
| `shared`      | Tipos, modelos, interfaces |
| `application` | Lógica de negocio          |
| `infra`       | Redis, clientes WebSocket  |
| `server`      | Servidor WebSocket         |
| `web`         | Frontend Next.js           |

Mira [docs/PACKAGES.md](docs/PACKAGES.md) para documentación detallada.

## 🐳 Docker

```bash
# Iniciar Redis
docker-compose up -d

# Detener Redis
docker-compose down
```

## Mejoras futuras:

- Agregar versionado de mensajes para evitar condiciones de carrera
- Implementar subida de archivos efímeros
- Mejorar UI/UX con animaciones y temas

## 📝 Licencia

MIT © Benjamin Rivas
