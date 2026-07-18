# Contrato de themes (diseño para Etapa 3)

Los themes no importarán Prisma ni conocerán tablas. Recibirán datos normalizados a través de un SDK interno con tipos `StorefrontStore`, `StorefrontProduct`, `StorefrontCategory`, `StorefrontCart`, `StorefrontPage`, `StorefrontMenu`, `ThemeConfig` y `ThemeManifest`.

## Estructura prevista

```text
themes/modern-minimal/
  theme.json
  index.ts
  components/
  sections/
  styles/
  preview.png
```

`theme.json` declarará nombre, versión, versión del motor, autor, preview, capacidades y esquema de settings. El registro de themes validará el manifiesto con Zod antes de hacerlo seleccionable.

## Principios

- mismo contrato de datos para todas las plantillas;
- settings de cada tienda persistidos aparte de productos/pedidos;
- secciones ordenables con `{ type, enabled, order, settings }`;
- fallback seguro para componentes o settings desconocidos;
- sin ejecución arbitraria de código desde manifiestos JSON;
- soporte futuro para themes internos, paquetes instalables y frontends externos.

El campo `Store.themeKey` de la Etapa 1 ya permite seleccionar una clave sin acoplar la tienda al componente. En la Etapa 3 se reemplazará el storefront provisional por el registro y renderizador definitivos.
