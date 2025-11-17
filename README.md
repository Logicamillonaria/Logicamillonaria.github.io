# Lógica millonaria

Juego web inspirado en formatos de concurso, con interfaz moderna, comodines, temporizador y escalera de premios.

## Archivos
- `index.html` — Estructura principal + overlays.
- `index.css` — Estilos, accesibilidad y **animación de fondo** (gradiente) + soporte para chispas con canvas.
- `index.js` — Lógica del juego, **intro con video**, menú estilizado al perder, temporizador y comodines.
- `assets/intro.mp4` — Video de introducción (colócalo aquí).
- `assets/sfx/*.mp3` — Efectos de sonido (reemplaza los placeholders).

## Cambios destacados
- Nombre del juego cambiado a **Lógica millonaria**.
- **Intro con video**: el juego arranca **después** de que termine o se omita la intro.
- **Menú de fin de partida** estilizado (sin `alert`).
- **Comodines** con mayor contraste y tipografía más clara.
- **Fondo animado**: gradiente sutil + **chispas** (canvas) para dar vida sin distraer.

## Publicar en GitHub Pages
1. Sube todos los archivos al repositorio (raíz).
2. Ve a **Settings → Pages** y usa **Deploy from branch**, rama **main**, carpeta **/** (root).
3. Guarda y espera el despliegue.
