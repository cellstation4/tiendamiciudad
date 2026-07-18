# Arquitectura técnica

## Límites principales

- `app`: transporte HTTP, composición de páginas y boundaries de Next.js.
- `modules`: reglas de negocio, esquemas Zod, permisos y acciones.
- `lib`: infraestructura compartida (Prisma, Better Auth).
- `components`: presentación reutilizable sin acceso directo a la base.
- `prisma`: persistencia, relaciones, índices y migraciones.

Las páginas no deciden permisos. Toda operación sensible llama a `requireUser` o `requireStoreAccess` en el servidor.

## Flujo de una mutación administrativa

1. Server Action recibe `FormData`.
2. La guarda obtiene la sesión desde headers y Better Auth.
3. Se consulta la membresía usando usuario + slug + `deletedAt: null`.
4. La matriz de rol verifica el permiso requerido.
5. Zod valida y normaliza la entrada.
6. Prisma ejecuta la mutación y el log de actividad, preferentemente en transacción.
7. Next.js invalida la ruta afectada.

## Autenticación

Better Auth expone `/api/auth/[...all]`. Prisma persiste `User`, `Session`, `Account` y `Verification`. Los formularios usan su cliente React; la protección real ocurre en Server Components y Server Actions. El adaptador puede conservarse al migrar el datasource de Prisma.

## Multitenancy

`StoreMember` es el vínculo de acceso. El propietario también es un miembro con rol `OWNER`. Una tienda no se selecciona confiando en un ID enviado por el cliente: se resuelve desde un slug y una membresía del usuario autenticado. Las entidades comerciales futuras tendrán `storeId`, índices compuestos y constraints únicos con alcance de tienda.

## Roles

La matriz tipada vive en `modules/authorization/permissions.ts`. `OWNER` es el único rol que puede desactivar o eliminar lógicamente una tienda. `ADMIN` administra miembros y contenido; los roles restantes tienen permisos reducidos.

## Estrategia API

- Operaciones del panel: Server Actions y servicios internos.
- Autenticación: Route Handler de Better Auth.
- Storefront interno: Server Components llamando a un SDK de dominio (Etapa 3).
- Storefronts externos: REST versionada bajo `/api/public/v1` (Etapa 3), separada de acciones administrativas.

## Persistencia y borrado

SQLite es el motor local. `Store` usa `deletedAt` y `status`; desactivar no destruye datos. Membresías e invitaciones usan cascada porque no tienen sentido sin la tienda. Los logs conservan el actor como nullable para tolerar eliminación futura de usuarios.

