# Arquitectura y Buenas Prácticas del Proyecto

Este documento describe la arquitectura y las buenas prácticas empleadas en este proyecto web, con el fin de servir como guía para su mantenimiento y para la creación de proyectos futuros con una estructura similar.

## 1. Tecnologías Principales

- **Framework:** [Astro](https://astro.build/) - Elegido por su enfoque en el rendimiento (cero JavaScript por defecto) y su excelente experiencia de desarrollo para sitios orientados a contenido.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Para añadir seguridad de tipos al código JavaScript, mejorando la mantenibilidad y reduciendo errores.
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Un framework de CSS "utility-first" que permite construir diseños directamente en el markup de forma rápida y consistente.

## 2. Estructura de Directorios

El proyecto sigue una estructura clara y modular, separando las responsabilidades en directorios específicos.

```
/
├── public/             # Activos estáticos (imágenes, iconos, fuentes)
│   ├── backgrounds/
│   ├── icons/
│   └── images/
├── src/                # Código fuente de la aplicación
│   ├── components/     # Componentes reutilizables (arquitectura atómica)
│   │   ├── atoms/      # Componentes más pequeños e indivisibles
│   │   ├── cards/      # Componentes de tarjetas especificos
│   │   ├── molecules/  # Combinaciones de átomos
│   │   └── templates/  # Secciones de página compuestas por moléculas y átomos
│   ├── global/         # Ficheros globales (constantes, etc.)
│   ├── layouts/        # Plantillas principales de la página (esqueleto HTML)
│   └── pages/          # Páginas del sitio (corresponden a las rutas)
├── astro.config.mjs    # Configuración de Astro
├── tailwind.config.mjs # Configuración de Tailwind CSS
└── tsconfig.json       # Configuración de TypeScript
```

## 3. Arquitectura de Componentes: Diseño Atómico

La práctica más importante de este proyecto es la organización de los componentes siguiendo la metodología de **Diseño Atómico**. Esto promueve la reutilización, consistencia y mantenibilidad de la UI.

### a. Átomos (`src/components/atoms/`)

Son los bloques de construcción más básicos de la interfaz. No se pueden dividir más sin perder su utilidad.

- **Ejemplos:** `Button.astro`, `H2.astro`, `P.astro`.
- **Función:** Encapsulan estilos y comportamientos básicos (ej. un botón con sus estilos base, un título h2 con su tipografía).
- **Regla:** Un átomo no contiene otros componentes.

### b. Moléculas (`src/components/molecules/`)

Son grupos de átomos unidos que funcionan como una unidad simple y reconocible.

- **Ejemplos:** `Navbar.astro`, `Footer.astro`, `SocialMediaBar.astro`.
- **Función:** Forman componentes más complejos. Por ejemplo, una barra de navegación (`Navbar`) puede estar compuesta por un átomo de logo y una lista de átomos de enlaces.
- **Regla:** Una molécula está compuesta por átomos.

### c. Plantillas / Templates (`src/components/templates/`)

Son secciones más grandes de una página, compuestas por moléculas y/o átomos, que estructuran el contenido. A veces se les llama "Organismos" en la terminología clásica del Diseño Atómico.

- **Ejemplos:** `Hero.astro`, `Services.astro`, `AboutUs.astro`.
- **Función:** Definen una sección completa y reutilizable de una página, como la sección de "Servicios" con su título y una colección de tarjetas (`CardServices.astro`).

## 4. Buenas Prácticas Adicionales

- **Constantes Globales:** El archivo `src/global/global.constants.ts` se utiliza para centralizar valores que se repiten en la aplicación (como URLs de redes sociales, números de teléfono, etc.). Esto evita tener "magic strings" o valores hardcodeados y facilita su actualización.
- **Layouts de Astro:** El `src/layouts/Layout.astro` define la estructura HTML base (incluyendo `<head>`, `<body>`, metatags, y la importación de estilos globales) que envuelve a todas las páginas, asegurando consistencia.
- **Componentes Auto-contenidos:** Cada componente `.astro` contiene su propio HTML y lógica. Gracias a Tailwind CSS, los estilos están co-ubicados en el marcado, lo que facilita entender y modificar un componente de forma aislada.

## 5. Internacionalización (i18n)

Para soportar múltiples idiomas de manera robusta y escalable, el proyecto implementa una estrategia de internacionalización (i18n) basada en TypeScript. Este enfoque proporciona seguridad de tipos, autocompletado y una excelente integración con las prácticas de SEO para Astro.

### a. Estructura y Definiciones Tipadas

Los textos y configuraciones de idioma se centralizan para simplificar la gestión.

```
/
└── src/
    └── i18n/
        └── index.ts  # Contiene todas las traducciones y utilidades
```

El archivo `src/i18n/index.ts` define los idiomas soportados, el idioma por defecto, un objeto con las cadenas de texto y una función de utilidad.

```typescript
// src/i18n/index.ts
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.servicios': 'Servicios',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.servicios': 'Services',
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key];
  }
}
```

### b. Integración con SEO para Astro

Una estrategia de i18n sólida es fundamental para el SEO internacional.

**1. Rutas de URL por Idioma:**
El proyecto debe usar rutas dedicadas para cada idioma (ej. `/en/about`, `/es/acerca-de`). Astro facilita esto con su [sistema de enrutamiento dinámico](https://docs.astro.build/es/guides/routing/#enrutamiento-dinamico), usando una estructura como `src/pages/[lang]/[...slug].astro`.

**2. Atributo `lang` en `<html>`:**
La etiqueta `<html>` debe tener el atributo `lang` correcto. Esto se gestiona en el layout principal.

```astro
---
// src/layouts/Layout.astro
import { defaultLang } from '../i18n';
const { lang = defaultLang } = Astro.props;
---
<html lang={lang}>
  <!-- ... -->
</html>
```

**3. Etiquetas `hreflang`:**
Para indicar a los motores de búsqueda las versiones alternativas de una página, se deben añadir etiquetas `<link rel="alternate" hreflang="..." />` en el `<head>`. Esto evita problemas de contenido duplicado.

```astro
---
// Un componente para generar estas etiquetas dinámicamente
import { languages } from '../../i18n';
const { pathname } = Astro.url;

const currentLang = Object.keys(languages).find(lang => pathname.startsWith(`/${lang}`)) || 'es';
const baseRoute = pathname.replace(new RegExp(`^/${currentLang}`), '');
---
{Object.keys(languages).map(lang => (
  <link rel="alternate" hreflang={lang} href={`${Astro.site.origin}/${lang}${baseRoute}`} />
))}
<link rel="alternate" hreflang="x-default" href={`${Astro.site.origin}/es${baseRoute}`} />
```

### c. Ventajas del Enfoque

- **Seguridad de Tipos:** TypeScript previene errores al usar claves de traducción inexistentes.
- **Autocompletado:** El editor sugiere las claves de traducción disponibles.
- **Fallback Automático:** Usa el idioma por defecto si una traducción falta.
- **SEO Optimizado:** Cumple con las mejores prácticas para sitios multi-idioma.

## 6. Prácticas SEO (Search Engine Optimization)

El proyecto está construido con una base sólida de SEO técnico y de contenido para maximizar su visibilidad en motores de búsqueda.

- **SEO Internacional (i18n):** Se implementan prácticas clave para sitios multi-idioma, como rutas específicas por idioma y la generación de etiquetas `hreflang` para indicar a los buscadores las versiones alternativas de cada página. Esto se detalla en la sección de *Internacionalización*.
- **Rendimiento Web:** El uso de Astro garantiza tiempos de carga extremadamente rápidos, un factor crucial para el ranking de búsqueda.
- **Metaetiquetas Completas:** El layout principal (`src/layouts/Layout.astro`) implementa un conjunto exhaustivo de metaetiquetas:
  - **`<title>`:** Título dinámico para cada página.
  - **`<meta name="description">`:** Descripción detallada para los snippets de búsqueda.
  - **`<meta name="keywords">`:** Palabras clave relevantes.
  - **`<link rel="canonical">`:** Evita problemas de contenido duplicado.
  - **`<meta name="robots">`:** Instruye a los bots para que indexen el sitio (`index, follow`).
- **Protocolos para Redes Sociales:**
  - **Open Graph (Facebook, LinkedIn, etc.):** Se incluyen etiquetas `og:title`, `og:description`, `og:image`, y más, para generar vistas previas enriquecidas.
  - **Twitter Cards:** Etiquetas `twitter:card`, `twitter:title`, etc., para el mismo propósito en Twitter.
- **SEO de Imágenes:**
  - **Optimización:** Se usa el componente `<Image>` de Astro para optimizar el tamaño y formato de las imágenes.
  - **Atributos `alt`:** Todas las imágenes importantes tienen texto alternativo descriptivo, mejorando la accesibilidad y el SEO.
  - **Nombres de Archivo:** Los nombres de los archivos de imagen son descriptivos (ej. `electricistadomiciliojonnyelectricista.webp`).
- **HTML Semántico:** Se utiliza una estructura HTML correcta, como el uso de `<h1>` para el título principal de la página, lo que ayuda a los motores de búsqueda a entender la jerarquía del contenido.
- **Rastreabilidad:** Se proporciona un enlace al sitemap (`<link rel="sitemap" href="/sitemap-index.xml">`) en el `<head>` para facilitar el descubrimiento de todas las páginas.
- **Análisis:** Integración con Google Analytics para monitorear el tráfico y el comportamiento de los usuarios.

## Resumen para Replicar el Proyecto

1.  **Iniciar un proyecto Astro con TypeScript y Tailwind CSS.**
2.  **Crear la estructura de directorios** `src/components/{atoms,molecules,templates}`, `src/global`, `src/layouts`.
3.  **Desarrollar la UI de abajo hacia arriba:**
    - Identificar y crear los **átomos** (botones, inputs, títulos).
    - Componer **moléculas** a partir de los átomos (formularios de búsqueda, barras de navegación).
    - Ensamblar las **plantillas/secciones** de página usando moléculas y átomos.
4.  **Usar `src/layouts`** para la estructura principal de la página.
5.  **Centralizar datos y constantes** en `src/global`.
6.  **Implementar la internacionalización (i18n)** con sus prácticas SEO, como se describe en la sección 5.
7.  **Crear las páginas finales** en `src/pages` combinando las diferentes plantillas.
