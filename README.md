# Nexo Commerce

MVP local de una plataforma e-commerce multiusuario y multitienda. La Etapa 1 implementa la base real de autenticación, aislamiento por comercio, roles, configuración de tiendas y panel administrativo. El proyecto no usa servicios pagos, no requiere Docker y no tiene ningún remoto configurado.

## Estado actual

Completado en Etapa 1:

- registro, inicio/cierre de sesión y sesiones seguras con Better Auth;
- recuperación de contraseña mediante buzón local persistido en SQLite;
- perfil y cambio de contraseña con revocación de otras sesiones;
- creación y administración de múltiples tiendas;
- roles `OWNER`, `ADMIN`, `EDITOR`, `SALES` y `VIEWER`;
- autorización del servidor y aislamiento por `storeId`/membresía;
- invitaciones locales, aceptación y alta directa de usuarios existentes;
- edición, activación y desactivación lógica de tiendas;
- dashboard, selector de tienda, sidebar responsive, menú móvil y modo oscuro;
- actividad auditada y vista pública inicial `/store/[slug]`;
- migración Prisma, seed idempotente y pruebas de autorización/validación.

Los productos, inventario, themes completos, carrito y pedidos corresponden a las Etapas 2–4 y todavía no se presentan como funcionales.

## Requisitos

- Node.js 20.19+ (verificado también con Node.js 24)
- npm 10+
- Git

Docker es opcional y no se utiliza en el entorno local actual.

## Instalación

```bash
npm install
```

Copiar `.env.example` como `.env` y reemplazar `BETTER_AUTH_SECRET` por un valor aleatorio de al menos 32 caracteres. El repositorio de desarrollo ya puede contener un `.env` local ignorado por Git.

```bash
npm run setup
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

En Windows con una política que bloquea scripts PowerShell se puede usar `npm.cmd` en lugar de `npm`.

## Credenciales de desarrollo

Solo para la base local generada por el seed:

- propietario: `admin@nexo.local` / `DemoLocal123!`
- editor: `editor@nexo.local` / `DemoLocal123!`

El seed crea `Casa Aurora` y `Mercado Norte`. Estas credenciales no deben usarse en producción.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run setup` | Genera Prisma, aplica migraciones, crea carpetas y ejecuta seed |
| `npm run dev` | Servidor local |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript estricto |
| `npm test` | Pruebas con Vitest |
| `npm run build` | Build de producción local |
| `npm run db:migrate` | Nueva migración de desarrollo |
| `npm run db:seed` | Seed idempotente |
| `npm run db:studio` | Interfaz local de Prisma |
| `npm run db:reset` | Recrea la base; operación destructiva |
| `npm run audit` | Auditoría de dependencias de producción |

## Estructura

```text
prisma/                 esquema, migraciones y seed
scripts/                setup reproducible
src/app/                rutas App Router y Route Handlers
src/components/         UI y layouts reutilizables
src/lib/                Prisma, Better Auth y utilidades
src/modules/auth/       formularios y flujos de autenticación
src/modules/users/      perfil de usuario
src/modules/stores/     validaciones, acciones y formularios de tiendas
src/modules/authorization/ permisos, scopes y guardas de servidor
tests/                  pruebas unitarias y de aislamiento
docs/                   decisiones técnicas y contrato futuro de themes
uploads/                almacenamiento local ignorado por Git
```

La arquitectura detallada está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Crear una tienda

1. Iniciar sesión.
2. Abrir **Crear tienda** desde el selector.
3. Completar identidad, contacto, ubicación, moneda, zona horaria, colores y theme inicial.
4. La tienda queda disponible en `/admin/[slug]` y la vista pública inicial en `/store/[slug]`.

El creador se agrega en la misma transacción como `OWNER`. Un slug es único globalmente para que la ruta local sea inequívoca.

## Invitaciones y correo local

Los usuarios ya registrados se agregan inmediatamente. Para emails nuevos se crea una invitación con token hasheado; el enlace sin hashear solo se guarda en la tabla `dev_email`, que simula un buzón local. No se imprime en logs. Se puede inspeccionar con `npm run db:studio`.

Antes de producción, `sendResetPassword` y las invitaciones deben conectarse a un proveedor de correo y nunca usar `DevEmail`.

## Seguridad y aislamiento

- Las contraseñas las gestiona Better Auth con hashing seguro.
- Las cookies son `httpOnly` y adoptan `secure` en producción.
- Las mutaciones se validan con Zod en servidor.
- `requireStoreAccess` exige sesión, membresía, tienda no eliminada y permiso del rol.
- Las operaciones de creación/edición e invitaciones registran actividad.
- `.env`, SQLite y `uploads` están ignorados por Git.
- No se registran contraseñas, tokens ni enlaces de recuperación en consola.

El control de interfaz no reemplaza la autorización del servidor.

## Base de datos y migración futura

SQLite usa `DATABASE_URL="file:./dev.db"`. Para PostgreSQL/MySQL:

1. crear una rama de migración;
2. cambiar `provider` en `prisma/schema.prisma` y `DATABASE_URL`;
3. revisar tipos JSON, índices y estrategia de IDs;
4. generar una migración inicial específica para el motor;
5. probar seed, autorización y concurrencia;
6. configurar backups y pool de conexiones.

No se recomienda reutilizar migraciones SQLite directamente en otro motor.

## Themes, importaciones y despliegue

El contrato previsto para themes está en [docs/THEMES.md](docs/THEMES.md). Los adaptadores de importación CSV/JSON/XLSX y los themes ejecutables se implementan en Etapas 2 y 3. El despliegue requerirá PostgreSQL/MySQL, almacenamiento de objetos, correo, secretos seguros, rate limiting distribuido, HTTPS y observabilidad.

## Pruebas

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

La Etapa 1 cubre la matriz de permisos, el scope multitienda y la validación de tiendas. Las pruebas de productos, inventario, carrito, pedidos e importación se incorporan junto con esos módulos.

## Limitaciones actuales y próximos pasos

1. Etapa 2: catálogo, categorías, marcas, variantes, inventario, media e importación/exportación.
2. Etapa 3: contrato Storefront, dos themes, editor por secciones y renderizador.
3. Etapa 4: carrito, clientes, checkout, pedidos, cupones y proveedores simulados.
4. Etapa 5: hardening, pruebas de integración/E2E, accesibilidad, seeds completos y documentación de producción.

No se ha hecho push ni se ha configurado GitHub.

