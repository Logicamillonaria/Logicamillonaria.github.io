// Lógica millonaria — versión con intro/sonidos robustecidos

// ==================== Datos ====================
const QUESTIONS = [
  { q: '¿Qué escritor es conocido por crear "Cien años de soledad"?', a: ['Pablo Neruda','Gabriel García Márquez','Julio Cortázar','Jorge Luis Borges'], correct: 1 },
  { q: '¿Cuál es el río más largo del mundo?', a: ['Nilo','Amazonas','Yangtsé','Misisipi'], correct: 1 },
  { q: '¿En qué año el hombre llegó a la Luna por primera vez?', a: ['1965','1969','1972','1958'], correct: 1 },
  { q: '¿Quién pintó "La noche estrellada"?', a: ['Pablo Picasso','Vincent van Gogh','Claude Monet','Salvador Dalí'], correct: 1 },
  { q: '¿Cuál es el metal más abundante en la corteza terrestre?', a: ['Hierro','Aluminio','Cobre','Oro'], correct: 1 },
  { q: '¿Qué elemento químico tiene el símbolo "Au"?', a: ['Plata','Argón','Oro','Arsénico'], correct: 2 },
  { q: '¿Qué famoso físico formuló la Teoría de la Relatividad?', a: ['Isaac Newton','Stephen Hawking','Albert Einstein','Niels Bohr'], correct: 2 },
  { q: '¿Cuál es el país más grande del mundo por superficie?', a: ['China','Canadá','Estados Unidos','Rusia'], correct: 3 },
  { q: '¿En qué continente se encuentra Egipto?', a: ['Asia','África','Europa','América'], correct: 1 },
  { q: '¿Qué planeta es conocido como "el planeta rojo"?', a: ['Venus','Júpiter','Marte','Saturno'], correct: 2 },
  { q: '¿Quién escribió la tragedia "Romeo y Julieta"?', a: ['William Shakespeare','Charles Dickens','Jane Austen','Oscar Wilde'], correct: 0 },
  { q: '¿Cuál es el océano más grande del mundo?', a: ['Océano Atlántico','Océano Índico','Océano Ártico','Océano Pacífico'], correct: 3 },
  { q: '¿Qué organelo es conocido como "la central energética de la célula"?', a: ['Núcleo','Mitocondria','Ribosoma','Retículo endoplásmico'], correct: 1 },
  { q: '¿Qué instrumento se utiliza para medir la presión atmosférica?', a: ['Termómetro','Barómetro','Sismógrafo','Higrómetro'], correct: 1 },
  { q: '¿Quién compuso la Novena Sinfonía, también conocida como "Coral"?', a: ['Wolfgang Amadeus Mozart','Ludwig van Beethoven','Johann Sebastian Bach','Frédéric Chopin'], correct: 1 },
]; // 15 preguntas

const PRIZES = ['100','200','300','500','1.000','2.000','4.000','8.000','16.000','32.000','64.000','125.000','250.000','500.000','1.000.000'];

// ==================== Estado ====================
let state = {
  order: [],
  idx: 0,
  running: false,
  canRunTimer: false, // timer arranca tras la intro
  timerMax: 35,
  timer: 35,
  usedLifelines: { '50': false, 'call': false, 'aud': false },
  bank: 0, // acumulado
};

// ==================== Utilidades ====================
function must(id){ const el = document.getElementById(id); if(!el) throw new Error(`Falta #${id} en el DOM`); return el; }
function fmt(n){ return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function shuffle(a){ const arr=[...a]; for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// ==================== DOM ====================
const qTitle = must('questionTitle');
const answersEl = must('answers');
const timerNum = must('timerNumber');
const prog = must('timerProgress');
const ladderEl = must('ladder');
const currentPrizeEl = must('currentPrize');
const menu = must('gameMenu');
const menuPrize = must('menuPrize');
const btnRetry = must('btnRetry');
const btnExit = must('btnExit');

// Audios (asegúrate de subir los archivos a assets/audio/)
const sTick = must('sTick');
const sSuspense = must('sSusp'); // ambiente del timer
const sSelect = must('sSelect');
const sCorrect = must('sCorrect');
const sWrong = must('sWrong');
const sAudience = must('sAudience');

// Ajustes de audio
[sTick, sSuspense, sSelect, sCorrect, sWrong, sAudience].forEach(a => {
  if (!a) return;
  a.volume = 1.0;              // ajusta si quieres
  a.preload = 'metadata';       // ya viene en HTML
});
sSuspense.loop = true;          // bucle ambiente de suspenso

// Intro/controles
const introOverlay = must('introOverlay');
const introVideo = must('introVideo');
const soundBtn2 = must('soundBtn2');
const skipBtn2 = must('skipBtn2');

// Canvas de fondo (chispas)
const canvas = must('bg-sparks');
const ctx = canvas.getContext('2d');
let sparks = [];
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resizeCanvas);
resizeCanvas();
function createSpark(){
  return { x: Math.random()*canvas.width, y: canvas.height + Math.random()*100, vY: 0.6 + Math.random()*1.4, vX: (Math.random()-0.5)*0.3, r: 1 + Math.random()*2.2, life: 60 + Math.random()*120, hue: 25 + Math.random()*25 };
}
for(let i=0;i<120;i++) sparks.push(createSpark());
function drawSparks(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const s of sparks){
    s.y -= s.vY; s.x += s.vX; s.life -= 1;
    if(s.life<=0 || s.y < -20){ Object.assign(s, createSpark(), { y: canvas.height + 10 }); }
    const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3);
    grd.addColorStop(0, `hsla(${s.hue}, 90%, 60%, .95)`);
    grd.addColorStop(1, 'hsla(0,0%,0%,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r*3, 0, Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(drawSparks);
}
requestAnimationFrame(drawSparks);

// ==================== Escalera ====================
function renderLadder(){
  ladderEl.innerHTML = '';
  for (let i = PRIZES.length - 1; i >= 0; i--) {
    const step = document.createElement('div');
    step.className = 'step' + (i === state.idx ? ' current' : '');
    const n = document.createElement('span'); n.textContent = String(i+1);
    const amount = document.createElement('span'); amount.className = 'amount'; amount.textContent = `$${PRIZES[i]}`;
    step.append(n, amount); ladderEl.appendChild(step);
  }
  updatePrizeDisplay();
}
function updatePrizeDisplay(){ currentPrizeEl.textContent = fmt(state.bank); }

// ==================== Temporizador ====================
let timerInterval = null; const CIRC = 2 * Math.PI * 54; // r=54
prog.style.strokeDasharray = String(CIRC);

function startTimer(){
  if (!state.canRunTimer) return;
  clearInterval(timerInterval);
  const start = Date.now();
  state.timer = state.timerMax;
  state.running = true;
  updateTimerUI();

  // intenta reproducir el ambiente
  try { sSuspense.currentTime = 0; sSuspense.play().catch(()=>{}); } catch(_) {}

  const tick = () => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const left = state.timerMax - elapsed;
    if (left !== state.timer) {
      state.timer = Math.max(0, left);
      updateTimerUI();
      if (state.timer <= 10) { try { sTick.currentTime = 0; sTick.play().catch(()=>{});} catch(_){} }
    }
    if (left <= 0){
      clearInterval(timerInterval);
      state.running = false;
      try { sSuspense.pause(); } catch(_) {}
      onTimeUp();
    }
  };
  timerInterval = setInterval(tick, 200);
  tick();
}
function stopTimer(){ clearInterval(timerInterval); try { sSuspense.pause(); } catch(_) {} }
function updateTimerUI(){ timerNum.textContent = String(state.timer); const ratio = (state.timerMax - state.timer) / state.timerMax; prog.style.strokeDashoffset = String(ratio * CIRC); }

// ==================== Preguntas/Respuestas ====================
function loadQuestionAt(pos){
  state.idx = pos;
  renderLadder();
  const qIdx = state.order[state.idx % state.order.length];
  const q = QUESTIONS[qIdx];
  qTitle.textContent = q.q;
  answersEl.innerHTML = '';
  q.a.forEach((txt,i)=>{
    const btn = document.createElement('button');
    btn.className = 'answer'; btn.type='button'; btn.dataset.index = String(i);
    const letter = document.createElement('span'); letter.className='letter'; letter.textContent = 'ABCD'[i];
    const label = document.createElement('span'); label.textContent = txt;
    btn.append(letter, label);
    btn.addEventListener('click', ()=>selectAnswer(btn,i,q.correct));
    answersEl.appendChild(btn);
  });
  unlockAnswers();
}

let locked = false;
function lockAnswers(){ locked = true; [...answersEl.children].forEach(b=> b.disabled = true); }
function unlockAnswers(){ locked = false; [...answersEl.children].forEach(b=> b.disabled = false); }

function selectAnswer(el, chosen, correct){
  if (!state.running || locked) return;
  lockAnswers(); stopTimer();
  try { sSelect.currentTime = 0; sSelect.play().catch(()=>{});} catch(_) {}
  if (chosen === correct){
    const prizeVal = Number(PRIZES[state.idx].replace(/\./g,'')); // '1.000' -> 1000
    state.bank += prizeVal;
    el.classList.add('correct');
    try { sCorrect.currentTime = 0; sCorrect.play().catch(()=>{});} catch(_) {}
    setTimeout(()=> nextQuestion(), 1200);
  } else {
    el.classList.add('wrong');
    const nodes = [...answersEl.querySelectorAll('.answer')];
    if (nodes[correct]) nodes[correct].classList.add('correct');
    try { sWrong.currentTime = 0; sWrong.play().catch(()=>{});} catch(_) {}
    setTimeout(()=> endGame(false), 1200);
  }
}

function nextQuestion(){
  state.idx++;
  if (state.idx >= state.order.length){ endGame(true); }
  else { loadQuestionAt(state.idx); startTimer(); unlockAnswers(); }
}

function onTimeUp(){
  const qIdx = state.order[state.idx % state.order.length];
  const correct = QUESTIONS[qIdx].correct;
  const nodes = [...answersEl.querySelectorAll('.answer')];
  if (nodes[correct]) nodes[correct].classList.add('correct');
  try { sWrong.currentTime = 0; sWrong.play().catch(()=>{});} catch(_) {}
  setTimeout(()=> endGame(false), 1200);
}

// ==================== Menú final ====================
function endGame(win){
  stopTimer();
  showMenu(fmt(state.bank));
  if (win) { triggerConfetti(); }
}
function showMenu(prize){ menuPrize.textContent = prize; menu.classList.add('show'); }
function hideMenu(){ menu.classList.remove('show'); }
btnRetry.addEventListener('click', ()=>{ hideMenu(); startGame(); });
btnExit.addEventListener('click', ()=>{ location.reload(); });

// ==================== Comodines ====================
function attachLifelines(){
  const b5050 = must('lf-5050');
  const bCall = must('lf-call');
  const bAud = must('lf-aud');

  b5050.onclick = ()=>{ if(state.usedLifelines['50']) return; state.usedLifelines['50']=true; withLock(()=>{ use5050(); b5050.classList.add('used'); }); };
  bCall.onclick  = ()=>{ if(state.usedLifelines['call']) return; state.usedLifelines['call']=true; withLock(()=>{ useCall(); bCall.classList.add('used'); }); };
  bAud.onclick   = ()=>{ if(state.usedLifelines['aud']) return;  state.usedLifelines['aud']=true;  withLock(()=>{ useAudience(); bAud.classList.add('used'); }); };
}
function withLock(fn, delay=300){ lockAnswers(); try { fn(); } finally { setTimeout(unlockAnswers, delay); } }

function use5050(){
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const nodes = [...answersEl.querySelectorAll('.answer')];
  const wrongIdxs = nodes.map((_,i)=>i).filter(i=>i!==correct);
  wrongIdxs.sort(()=>Math.random()-0.5).slice(0,2).forEach(i=>{ const n=nodes[i]; if(n){ n.disabled=true; n.style.opacity='0.45'; } });
}
function useCall(){
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const pick = Math.random() < 0.75 ? correct : Math.floor(Math.random()*4);
  const callOverlay = must('callOverlay');
  const callAdvice  = must('callAdvice');
  const btnCloseCall = must('btnCloseCall');
  callAdvice.textContent = `Tu contacto sugiere: la ${'ABCD'[pick]}`;
  callOverlay.classList.add('show');
  btnCloseCall.onclick = () => callOverlay.classList.remove('show');
}
function useAudience(){
  try { sAudience.currentTime = 0; sAudience.play().catch(()=>{});} catch(_) {}
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const nodes = [...answersEl.querySelectorAll('.answer')];
  nodes.forEach((n,i)=>{
    n.querySelectorAll('.aud-pct').forEach(e=>e.remove());
    const span=document.createElement('span');
    span.className='aud-pct';
    span.textContent=(i===correct? Math.floor(50+Math.random()*30) : Math.floor(5+Math.random()*20)) + '%';
    span.style.marginLeft='8px'; span.style.opacity='0.9';
    n.appendChild(span);
  });
}

// ==================== Intro (robustecida) ====================
function showIntro() {
  introOverlay.classList.add('show');
  state.canRunTimer = false;

  try {
    introVideo.currentTime = 0;
    const playPromise = introVideo.play(); // autoplay con muted
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(()=>{}).catch(()=>{/*esperamos gesto del usuario*/});
    }
  } catch(_) {}
}
function closeIntro() {
  try { introVideo.pause(); } catch(_) {}
  introOverlay.classList.remove('show');
  state.canRunTimer = true;
  startGame();
}
function bindIntroControls() {
  const tryPlayWithSound = () => {
    try {
      introVideo.muted = false;
      const p = introVideo.play();
      if (p && typeof p.then === 'function') {
        p.catch(()=>{ introVideo.muted = true; /* si falla, queda silenciado */ });
      }
      unlockAudio(); // ← asegura que los audios del juego queden habilitados
    } catch(_) {}
  };
  if (soundBtn2) soundBtn2.onclick = tryPlayWithSound;

  const doSkip = () => {
    try { introVideo.pause(); } catch(_) {}
    try { sSuspense.pause(); } catch(_) {}
    closeIntro();
  };
  if (skipBtn2) skipBtn2.onclick = doSkip;

  introVideo.addEventListener('ended', () => closeIntro());
  // Diagnóstico opcional (consola)
  introVideo.addEventListener('error', () => console.warn('Error al cargar/reproducir el video de intro'));
  introVideo.addEventListener('canplay', () => console.log('Intro: canplay'));
  introVideo.addEventListener('loadeddata', () => console.log('Intro: loadeddata'));
}

// ==================== Anti-trampas ====================
let cheatDetections = 0; const MAX_DETECTIONS = 1;
function onSuspiciousActivity(){ cheatDetections++; if (cheatDetections > MAX_DETECTIONS) { endByCheat(); } else { showWarn(); } }
function showWarn(){
  stopTimer();
  const warn = must('warnOverlay');
  const btn = must('btnWarnOk');
  warn.classList.add('show');
  btn.onclick = ()=>{ warn.classList.remove('show'); startTimer(); };
}
function endByCheat(){ stopTimer(); showMenu(fmt(state.bank)); }
document.addEventListener('visibilitychange', ()=>{ if (document.hidden) onSuspiciousActivity(); });
window.addEventListener('blur', ()=> onSuspiciousActivity());
document.addEventListener('keydown', (e)=>{
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
    e.preventDefault(); onSuspiciousActivity();
  }
});
document.addEventListener('contextmenu', e=> e.preventDefault());

// ==================== Confeti ====================
function triggerConfetti(){
  const wrap = must('confetti');
  wrap.innerHTML = '';
  for (let i=0;i<60;i++){
    const el=document.createElement('div');
    el.style.position='absolute';
    el.style.left=(Math.random()*100)+'%';
    el.style.top='-10%';
    el.style.width='10px';
    el.style.height='16px';
    el.style.background=`hsl(${Math.random()*360} 80% 60%)`;
    el.style.transform='rotate('+(Math.random()*360)+'deg)';
    el.style.opacity='0.95';
    wrap.appendChild(el);
    el.animate(
      [{transform:'translateY(0) rotate(0deg)'}, {transform:'translateY(110vh) rotate(720deg)'}],
      {duration: 2000+Math.random()*1200, easing:'cubic-bezier(.2,.6,.2,1)'}
    );
  }
}

// ==================== Desbloqueo de audio global ====================
let audioUnlocked = false;
function unlockAudio(){
  if (audioUnlocked) return;
  audioUnlocked = true;
  // Intenta reproducir/pausar una vez para “desbloquear” canal de audio
  [sTick, sSuspense, sSelect, sCorrect, sWrong, sAudience].forEach(a=>{
    try { const p=a.play(); if (p && p.then) p.then(()=>a.pause()).catch(()=>{}); } catch(_) {}
  });
  window.removeEventListener('pointerdown', unlockAudio);
  window.removeEventListener('keydown', unlockAudio);
}
// Primer gesto en cualquier parte desbloquea audio
window.addEventListener('pointerdown', unlockAudio, { once:false });
window.addEventListener('keydown', unlockAudio, { once:false });

// ==================== Ciclo de vida ====================
function startGame(){
  state.order = shuffle(QUESTIONS.map((_,i)=>i));
  state.idx = 0;
  state.bank = 0; // reiniciar acumulado
  state.usedLifelines = { '50': false, 'call': false, 'aud': false };
  renderLadder();
  loadQuestionAt(0);
  state.canRunTimer = true;
  startTimer();
}
function init(){ hideMenu(); showIntro(); attachLifelines(); bindIntroControls(); }
function showMenu(prize){ menuPrize.textContent = prize; menu.classList.add('show'); }
function hideMenu(){ menu.classList.remove('show'); }

init();
