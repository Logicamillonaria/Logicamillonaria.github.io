
# Lógica millonaria — versión con temas (24 preguntas)

## Cómo usar
1. Abre `index.html` en tu navegador.
2. Sube tus archivos de audio a `assets/audio/` (opcional):
   - `tick.mp3`, `suspense.mp3`, `select.mp3`, `correct.mp3`, `wrong.mp3`, `audience.mp3`.
3. Coloca un video de intro en `assets/intro.mp4` (opcional). Si no está, puedes usar **Omitir**.

## Flujo del juego
- **Intro con video** → siempre al inicio.
- **Menú de temas** (elige el primer tema): Conectores, FBF, Cuantificadores.
- Cada tema tiene **8 preguntas** en orden aleatorio.
- Al terminar un tema, el juego selecciona **automáticamente** uno de los temas restantes al azar.
- Los **comodines** (50/50, Llamada, Público) se **reinician por tema** (1 uso por cada uno).
- **Temporizador**: 120 segundos por pregunta.
- **Premios**: escalan gradualmente desde **$1.000.000** hasta **$300.000.000** a lo largo de **24 preguntas**.

## Accesibilidad y compatibilidad
- Navegación por teclado soportada (`focus-visible`).
- Modo responsive para móviles.

## Créditos
- Fuentes: Google Fonts (Inter, Merriweather).
- Animaciones: Canvas y CSS.
