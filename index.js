const questions = [
    { q: "¿2 + 2 = ?", a: ["3", "4", "5", "2"], correct: 1 },
    { q: "Capital de Francia", a: ["Londres", "Madrid", "París", "Roma"], correct: 2 },
    { q: "Color del cielo", a: ["Azul", "Rojo", "Verde", "Negro"], correct: 0 }
];

let timer = 20;
let countdown;

const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const game = document.getElementById("game");
const qBox = document.getElementById("question");
const aBox = document.getElementById("answers");
const tBox = document.getElementById("timer");

introVideo.onended = () => {
    intro.classList.add("hidden");
    game.classList.remove("hidden");
    loadQuestion();
};

function loadQuestion() {
    clearInterval(countdown);
    timer = 20;
    tBox.textContent = timer;

    const q = questions[Math.floor(Math.random() * questions.length)];

    qBox.textContent = q.q;
    aBox.innerHTML = "";

    q.a.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = () => check(i === q.correct);
        aBox.appendChild(btn);
    });

    countdown = setInterval(() => {
        timer--;
        tBox.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            alert("Tiempo agotado");
            loadQuestion();
        }
    }, 1000);
}

function check(correct) {
    clearInterval(countdown);
    if (correct) {
        alert("¡Correcto!");
        loadQuestion();
    } else {
        alert("Incorrecto");
        loadQuestion();
    }
}
