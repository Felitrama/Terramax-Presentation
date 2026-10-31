# TerraMax · Grupo 7

Presentación web de diez diapositivas, construida con React, Vite, HTML, CSS y SVG. Una sola diapositiva visible, composición 16:9 y escalado proporcional. Conserva el contenido y agrega cinco segundos de agradecimiento al guion anterior: cuatro expositores, **6:00 estimados**.

## Requisitos e instalación

Usar Node.js **22.13 o superior** (probado con Node 24) y npm. Abrir una terminal dentro de esta carpeta:

```powershell
cd "C:\Users\felit\OneDrive\Escritorio\TERRAMAX final\terramax-presentacion-web"
npm install
```

La instalación inicial necesita conexión si los paquetes no están en la caché. La presentación no utiliza servicios externos, CDN, fuentes remotas ni imágenes del PowerPoint. Los íconos son SVG locales y la tipografía usa fuentes del sistema.

## Ejecutar en desarrollo

```sh
npm run dev
```

Abrir **http://127.0.0.1:5173** en Chrome o Edge. Si ese puerto está ocupado, Vite indica otro en la terminal. Para exigir el puerto indicado:

```sh
npm run dev -- --port 5173 --strictPort
```

Dejar la terminal abierta mientras se usa la presentación. Detener el servidor con `Ctrl+C`.

## Controles

| Tecla o control | Acción |
|---|---|
| `→` o espacio | Siguiente diapositiva |
| `←` | Diapositiva anterior |
| `F` | Activar o desactivar pantalla completa |
| `Escape` | Salir de pantalla completa |
| `P` o botón de notas | Abrir ventana del presentador |
| Botones inferiores | Navegación y pantalla completa |

La navegación se detiene en la primera y la última diapositiva. El indicador y la barra inferior muestran el avance. La dirección conserva el número de diapositiva: `/#8`, por ejemplo, abre la proyección financiera. No hay avance automático.

Para el aula, usar zoom del navegador al 100%, abrir la ventana principal en el proyector y pulsar `F`. Si el navegador bloquea la API de pantalla completa, se puede usar `F11` como alternativa; esa modalidad se cierra con `F11`.

## Notas del presentador

Pulsar `P` **antes de empezar**. Permitir la ventana emergente si el navegador lo solicita. En una configuración de escritorio extendido, mover las notas a la pantalla personal y dejar la ventana principal en el proyector. Después activar pantalla completa en la principal.

Las notas muestran el texto original, el expositor, el tiempo asignado y el intervalo de la intervención. Se sincronizan con la diapositiva principal mediante `BroadcastChannel`; las flechas de la ventana de notas también controlan la principal. Ambas ventanas deben permanecer abiertas en el mismo navegador y origen. La ventana de notas no es una segunda presentación autónoma. Su panel de texto puede desplazarse sin afectar la diapositiva proyectada.

El archivo `guion_exposicion_terramax.md` conserva el guion completo y las notas para responder preguntas. Las intervenciones originales se conservan; se añadió un cierre de cinco segundos.

## Producción y funcionamiento sin Internet

```sh
npm run build
npm run serve
```

Abrir **http://127.0.0.1:4173**. `dist/` contiene la aplicación compilada y ya se incluye generada. El servidor de producción usa exclusivamente módulos incorporados de Node; no necesita paquetes instalados ni acceso a Internet para servir una compilación existente.

Para otro puerto:

```sh
npm run serve -- --port 4180
```

Para llevarla a otra computadora, copiar la carpeta con **`dist/`, `scripts/serve.mjs` y `package.json`**, tener Node instalado y ejecutar `npm run serve`. También funciona directamente con `node scripts/serve.mjs`, sin npm. Mantener la terminal abierta. No abrir `dist/index.html` con doble clic: se sirve por HTTP local para que los módulos y las notas funcionen correctamente.

Vite también ofrece una vista de la compilación, si están instaladas las dependencias:

```sh
npm run preview
```

El funcionamiento sin conexión significa que los recursos se sirven desde la computadora; no depende de una caché del navegador ni de un sitio publicado. No hay que descargar nada durante la exposición.

## Organización

```text
src/
  content.js       Contenido, integrantes y datos financieros
  notes.json       Notas originales por diapositiva
  Slides.jsx       Diapositivas y componentes visuales reutilizables
  main.jsx         Navegación, escalado, pantalla completa y sincronización
  styles.css       Identidad visual, composiciones y modo presentador
scripts/
  serve.mjs        Servidor de producción sin dependencias
tests/
  presentation.mjs Pruebas reales de navegador con Playwright
public/images/     Imagen original del paisaje, disponible sin conexión
dist/              Compilación lista para servir sin conexión
test-results/      Capturas y resultado de la validación local
```

## Criterios del contenido

La diapositiva 10 cierra con «Gracias. ¿Preguntas?» y un paisaje ganadero original generado con `image_gen`. Se integra como archivo local, con tonos desaturados y composición despejada. El prompt y su procedencia están en `public/images/ORIGEN.md`. Es una imagen conceptual, no una fotografía documental del proyecto.

Se reutilizaron las fuentes y cifras de la presentación anterior. Los importes son estimaciones académicas en ARS constantes de 2026. Se distinguen inversión inicial, costos de operación, ingresos, flujo operativo y flujo total. El recupero alrededor del mes 22 supone flujo uniforme en el segundo año. No se añadió un costo de salida ni indicadores financieros nuevos.

La tabla financiera usa millones de ARS para importes; clientes y equilibrio son cantidades. La inversión inicial es ARS 12 M y no equivale a toda la necesidad de caja. El guion conserva la explicación del déficit máximo de ARS 17,24 M del anexo como respuesta de apoyo.

## Validación

Con el servidor de producción encendido en otra terminal:

```sh
npm run test:e2e
```

Las pruebas usan Playwright y **Microsoft Edge instalado**. No requieren descargar un navegador adicional. Para probar el servidor de desarrollo en PowerShell:

```powershell
$env:TEST_URL = 'http://127.0.0.1:5173'
npm run test:e2e
```

Se verifican las diez diapositivas a 1920×1080, 1366×768 y 390×844: límites de texto, ausencia de scroll en la vista proyectada, una diapositiva montada, navegación por teclado y botones, pantalla completa, sincronización de notas, enlace a diapositivas, importes financieros y navegación sin conexión externa. Las capturas a las dos resoluciones de proyección quedan en `test-results/`.

En teléfonos la composición se reduce proporcionalmente para mantener 16:9; para leer cómodamente, usar orientación horizontal. La presentación está diseñada principalmente para proyectores y pantallas de escritorio.
