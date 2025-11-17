document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("introVideo");
  const skipBtn = document.getElementById("skipBtn");
  const game = document.getElementById("game");

  function startGame() {
    video.style.display = "none";
    skipBtn.style.display = "none";
    game.style.display = "block";
  }

  skipBtn.addEventListener("click", startGame);
  video.addEventListener("ended", startGame);

  // lógica básica
  const pregunta = document.getElementById("pregunta");
  const respuestasDiv = document.getElementById("respuestas");

  const preguntas = [
    {
      q: "¿Capital de Francia?",
      r: ["Madrid", "París", "Roma", "Berlín"],
      c: 1
    },
    {
      q: "¿Cuánto es 5 × 5?",
      r: ["20", "15", "25", "30"],
      c: 2
    }
  ];

  function cargarPregunta() {
    const index = Math.floor(Math.random() * preguntas.length);
    const p = preguntas[index];

    pregunta.textContent = p.q;
    respuestasDiv.innerHTML = "";

    p.r.forEach((resp, i) => {
      const btn = document.createElement("button");
      btn.textContent = resp;
      btn.onclick = () => {
        if (i === p.c) {
          alert("Correcto!");
          cargarPregunta(); 
        } else {
          alert("Incorrecto!");
          cargarPregunta();
        }
      };
      respuestasDiv.appendChild(btn);
    });
  }

  cargarPregunta();
});
