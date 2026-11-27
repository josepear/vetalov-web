# VETALOV Carpinteros — web

Sitio web estático de **VETALOV Carpinteros**, carpintería a medida en Canarias.
Diseño, fabricación e instalación: armarios, vestidores, cocinas, salones,
puertas, escaleras y carpintería para hostelería.

Sin frameworks ni compilación: HTML, CSS y JavaScript puro. Se publica
directamente en GitHub Pages.

## Ver el sitio en local

Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También puedes abrir `index.html` directamente,
aunque el servidor local reproduce mejor el comportamiento final.

## Antes de publicar: datos pendientes

El diseño y los textos están listos, pero **faltan los datos reales del
cliente**. Todo lo marcado con `TODO` está concentrado en un único archivo:

### `assets/js/site.js`

| Campo | Valor actual (provisional) |
| --- | --- |
| `phone` | `+34600000000` |
| `phoneDisplay` | `600 000 000` |
| `whatsapp` | `34600000000` |
| `email` | `hola@vetalov.com` |
| `instagram` | `https://www.instagram.com/vetalov/` |
| `hours` | `Lunes a viernes · 8:00–17:00` |
| `url` | `https://vetalov.com` |

Al cambiar estos valores se actualizan automáticamente todos los teléfonos,
emails, enlaces de WhatsApp, Instagram y la zona de trabajo del sitio.

### Otros datos por completar

- **Aviso legal** (`aviso-legal.html`): NIF, domicilio fiscal y revisión legal
  del texto. Hay una nota interna visible al final.
- **Dominio**: los metadatos `og:image` y la línea `Sitemap` de `robots.txt`
  usan rutas relativas / un dominio provisional. Cuando exista dominio final,
  conviene poner URLs absolutas en `og:url` y `og:image`.
- **Fotografías**: las fotos de proyectos son reales del cliente. Las dos fotos
  de taller (`taller-*.jpg` y `artesania-1400.jpg`) provienen de la carpeta
  `fotos Adobe Stock` del cliente: **confirma que la licencia cubre uso web**
  antes de publicar.

## Estructura

```text
vetalov-web/
├── index.html              Portada
├── servicios.html          Servicios y preguntas frecuentes
├── proyectos.html          Galería filtrable con lightbox
├── contacto.html           Formulario + contacto directo
├── aviso-legal.html        Aviso legal y privacidad
├── 404.html                Página de error
├── assets/
│   ├── css/styles.css      Todos los estilos
│   ├── js/site.js          Datos de contacto editables
│   ├── js/main.js          Menú, filtros, lightbox y formulario
│   └── img/                Logos, iconos y fotos optimizadas
├── .github/workflows/pages.yml
├── robots.txt
└── README.md
```

Las imágenes de proyectos están en dos tamaños: `-800.jpg` para las rejillas y
`-1600.jpg` para el lightbox. Los originales sin tratar siguen en
`../VETALOV_C/WEB` y `../fotos Adobe Stock`.

## Publicación en GitHub Pages

El repositorio incluye un workflow que publica el sitio en cada push a `main`.

1. En GitHub, entra en **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Haz push a `main` o lanza el workflow manualmente desde **Actions**.

Si el repositorio es privado, GitHub Pages con Actions requiere un plan de pago.
En ese caso, cambia la visibilidad del repositorio a pública o publica el
contenido en otro hosting estático (Netlify, Vercel, Cloudflare Pages…).

Para un dominio propio, añade el dominio en **Settings → Pages** y crea el
registro DNS correspondiente.

## Formulario de contacto

Ahora mismo el formulario **no envía a ningún servidor**: valida los campos y
abre el programa de correo del visitante con el mensaje ya redactado. Es la
opción más simple y no requiere backend.

Si prefieres recibir los envíos sin depender del cliente de correo, sustituye
el bloque del formulario en `assets/js/main.js` por un servicio como
[Formspree](https://formspree.io), Netlify Forms o un endpoint propio.

## Cambiar fotos o añadir proyectos

1. Exporta la foto a unos **1600 px de ancho** en JPG (calidad ~82).
2. Guarda dos versiones en `assets/img/proyectos/`: `nombre-1600.jpg` y
   `nombre-800.jpg`.
3. Añade un `<button class="tile">` en `proyectos.html` con los atributos
   `data-cat`, `data-full`, `data-title`, `data-project` y `data-alt`.
4. Añade la categoría al filtro si es nueva y actualiza el contador.

## Accesibilidad y rendimiento

- HTML semántico, enlace «saltar al contenido» y foco visible.
- Menú móvil con `aria-expanded`, `aria-hidden` e `inert`.
- Galería operable con teclado (`Tab`, `Esc`, flechas) y lightbox nativo
  `<dialog>`.
- Imágenes con `width`/`height`, `loading="lazy"` y textos alternativos.
- Respeta `prefers-reduced-motion`.
- Sin cookies propias ni analítica (ver aviso legal).

## Pendiente / ideas

- Conectar el formulario a un servicio real de envío.
- Añadir `sitemap.xml` y URLs absolutas cuando exista dominio definitivo.
- Añadir testimonios reales de clientes cuando el cliente los facilite.
- Revisar y ampliar la galería con más proyectos y fotos de detalle.
