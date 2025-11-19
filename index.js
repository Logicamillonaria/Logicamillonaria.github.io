
function resetLifelines() {
    state.usedLifelines = { '50': false, 'call': false, 'aud': false };
    ['lf-5050', 'lf-call', 'lf-aud'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('used');
    });
}

// Lógica millonaria — versión con temas y 24 preguntas
// ==================== Temas y preguntas ====================
const TOPICS = [
  {
    key: 'conectores',
    name: 'Conectores lógicos y simbología',
    icon: '∧∨→↔',
    questions: [
      { q: "Traduzca la proposición en lenguaje natural 'El servidor funciona (p) y la red no está caída (q)' al lenguaje simbólico.", a: ["p∧¬q","p∧q","p∨q","p→¬q"], correct: 1 },
      { q: "En el contexto de un servidor web, ¿qué conector lógico representa la situación en la que el acceso es concedido si y solo si el usuario tiene credenciales válidas Y el servidor no está en mantenimiento?", a: ["Negación (NOT)","Conjunción (AND)","Disyunción (OR)","Condicional (Si... entonces)"], correct: 1 },
      { q: "Un sistema de monitoreo activa una alarma si la temperatura de la CPU es alta O si el uso de memoria supera el 90%. ¿Qué conector lógico se utiliza?", a: ["Conjunción (∧)","Disyunción Exclusiva (⊕)","Disyunción Inclusiva (∨)","Bicondicional (↔)"], correct: 2 },
      { q: "Si definimos p como 'El código compila' y q como 'Se despliega a producción', ¿cómo se representa 'Si el código compila, entonces se despliega a producción'?", a: ["p→q","p∨q","p∧q","p↔q"], correct: 0 },
      { q: "¿Cuál es la ley lógica que establece que ¬(P∧Q) es equivalente a ¬P∨¬Q?", a: ["Ley de la Doble Negación","Ley Distributiva","Silogismo Hipotético","Ley de De Morgan"], correct: 3 },
      { q: "¿Cómo se simboliza la proposición 'El sistema es seguro si y solo si supera la prueba de penetración'?", a: ["P∧Q","P↔Q","P→Q","P∨Q"], correct: 1 },
      { q: "¿Cómo se representa la proposición 'Si el usuario inicia sesión, entonces el sistema genera un token'?", a: ["P→Q","P∧Q","P∨Q","P↔Q"], correct: 0 },
      { q: "¿Cuál es la expresión lógica de 'El programa compila y la prueba unitaria pasa'?", a: ["P∨Q","P∧Q","P→Q","P↔Q"], correct: 1 },
    ],
  },
  {
    key: 'fbf',
    name: 'Fórmulas bien formadas',
    icon: 'FBF',
    questions: [
      { q: "¿Cuál es la definición fundamental de una Fórmula Bien Formada (FBF) en lógica proposicional?", a: ["Al menos dos proposiciones atómicas y un conector","Secuencia que siempre produce Verdadero (Tautología)","Expresión algebraica con variables y constantes","Cualquier secuencia de símbolos lógicos aceptada por las reglas sintácticas de un lenguaje formal"], correct: 3 },
      { q: "¿Cuál de las siguientes expresiones es una fórmula bien formada?", a: ["P∨∧Q","(P→Q)∧R","∨PQ","P↔∨Q"], correct: 1 },
      { q: "¿Cuál de las siguientes NO es una fórmula bien formada?", a: ["(P∨Q)→R","¬(P∧Q)","(P∨)∧Q","(P↔Q)∨R"], correct: 2 },
      { q: "¿Cuál de las siguientes expresiones es una FBF con tres variables proposicionales?", a: ["P∨Q","(P∧Q)→R","¬(P∨Q)","P↔Q"], correct: 1 },
      { q: "La proposición 'Si el sistema es seguro, entonces si la red está activa, el servidor responde' se representa como:", a: ["P→(Q→R)","(P∧Q)→R","P∨(Q∧R)","(P→Q)→R"], correct: 0 },
      { q: "¿Cuál de las siguientes expresiones es una FBF con cuatro variables proposicionales?", a: ["(P∨Q)∧R","((P→Q)∨(¬R))∧S","(P∨Q)∨(R∨S)","¬(P∧Q)"], correct: 1 },
      { q: "¿Cuál de las siguientes fórmulas está incorrectamente parentizada?", a: ["¬(P∨Q)","P∨(Q∧R)","((P∨Q)∧)","P↔(Q→R)"], correct: 2 },
      { q: "¿Cuál de estas expresiones usa mal el operador de negación?", a: ["¬(P∨Q)","¬¬P","P∨¬Q","(P∧Q) ¬"], correct: 3 },
    ],
  },
  {
    key: 'cuantificadores',
    name: 'Cuantificadores',
    icon: '∀∃',
    questions: [
      { q: "¿Cómo se simboliza la proposición 'Todos los usuarios tienen acceso al sistema'?", a: ["∃x A(x)","∀x A(x)","∀x ¬A(x)","∃x ¬A(x)"], correct: 1 },
      { q: "'Si un sistema es seguro, entonces todos los usuarios pueden acceder' se simboliza como:", a: ["∀x (S(x)→A(x))","∃x (S(x)→A(x))","∀x (A(x)→S(x))","∃x (A(x)∧S(x))"], correct: 0 },
      { q: "¿Cuál es la forma lógica de 'Existe al menos un servidor que es seguro'?", a: ["∀x S(x)","∃x S(x)","¬∀x S(x)","∀x ¬S(x)"], correct: 1 },
      { q: "¿Cuál es la forma lógica de 'Todos los usuarios tienen contraseña'?", a: ["∀x U(x) → C(x)","∃x U(x) → C(x)","¬∀x U(x) → C(x)","∀x ¬U(x) → C(x)"], correct: 0 },
      { q: "¿Cuál es la forma lógica de 'Ningún sistema operativo es perfecto'?", a: ["∀x SO(x) → ¬P(x)","∃x SO(x) → ¬P(x)","¬∀x SO(x) → ¬P(x)","∀x ¬SO(x) → P(x)"], correct: 0 },
      { q: "¿Cuál es la forma lógica de 'Todos los paquetes de red tienen dirección IP'?", a: ["∀x Paq(x) → IP(x)","∃x Paq(x) → IP(x)","¬∀x Paq(x) → IP(x)","∀x ¬Paq(x) → IP(x)"], correct: 0 },
      { q: "¿Cuál es la forma lógica de 'Existe al menos un archivo corrupto'?", a: ["∀x File(x) → Corr(x)","∃x (File(x) ∧ Corr(x))","¬∀x File(x) → Corr(x)","∃x ¬File(x) → Corr(x)"], correct: 1 },
      { q: "¿Cuál es la forma lógica de 'No todos los servidores están disponibles'?", a: ["¬∀x Serv(x) → Disp(x)","∃x (Serv(x) ∧ ¬Disp(x))","¬∃x Serv(x) ∧ Disp(x)","∀x ¬Serv(x) → ¬Disp(x)"], correct: 1 },
    ],
  }
];

// ==================== Premios ====================
function buildPrizes(count = 24, start = 1_000_000, end = 300_000_000) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const v = Math.round(start + t * (end - start));
    arr.push(v);
  }
  return arr; // valores enteros
}
const PRIZES = buildPrizes();

// ==================== Estado ====================
let state = {
  running: false,
  canRunTimer: false,
  timerMax: 120,
  timer: 120,
  usedLifelines: { '50': false, 'call': false, 'aud': false },
  bank: 0,                 // acumulado
  topicOrder: [],          // orden de temas (índices)
  topicIdx: 0,             // índice del tema actual dentro de topicOrder
  topicQOrder: [],         // orden aleatorio de preguntas del tema actual
  qIdxInTopic: 0,          // posición de la pregunta dentro del tema
  totalAsked: 0,           // preguntas globales ya respondidas
};

// ==================== Utilidades ====================
function must(id){ const el = document.getElementById(id); if(!el) throw new Error(`Falta #${id} en el DOM`); return el; }
function fmt(n){ return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function shuffle(a){ const arr=[...a]; for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// ==================== DOM refs ====================
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
const topicsOverlay = must('topicsOverlay');
const topicsGrid = must('topicsGrid');

// Audios
const sTick = must('sTick');
const sSuspense = must('sSusp');
const sSelect = must('sSelect');
const sCorrect = must('sCorrect');
const sWrong = must('sWrong');
const sAudience = must('sAudience');
[sTick, sSuspense, sSelect, sCorrect, sWrong, sAudience].forEach(a => { if(!a) return; a.volume = 1.0; a.preload = 'metadata'; });
sSuspense.loop = true;

// Intro
const introOverlay = must('introOverlay');
const introVideo = must('introVideo');
const soundBtn2 = must('soundBtn2');
const skipBtn2 = must('skipBtn2');

// Canvas fondo (chispas)
const canvas = must('bg-sparks');
const ctx = canvas.getContext('2d');
let sparks = [];
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resizeCanvas); resizeCanvas();
function createSpark(){ return { x: Math.random()*canvas.width, y: canvas.height + Math.random()*100, vY: 0.6 + Math.random()*1.4, vX: (Math.random()-0.5)*0.3, r: 1 + Math.random()*2.2, life: 60 + Math.random()*120, hue: 25 + Math.random()*25 }; }
for(let i=0;i<120;i++) sparks.push(createSpark());
function drawSparks(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(const s of sparks){ s.y -= s.vY; s.x += s.vX; s.life -= 1; if(s.life<=0 || s.y < -20){ Object.assign(s, createSpark(), { y: canvas.height + 10 }); } const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3); grd.addColorStop(0, `hsla(${s.hue}, 90%, 60%, .95)`); grd.addColorStop(1, 'hsla(0,0%,0%,0)'); ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, s.y, s.r*3, 0, Math.PI*2); ctx.fill(); } requestAnimationFrame(drawSparks); }
requestAnimationFrame(drawSparks);

// ==================== Escalera ====================
function renderLadder(){
  ladderEl.innerHTML = '';
  // 24 pasos en total
  for (let i = PRIZES.length - 1; i >= 0; i--) {
    const step = document.createElement('div');
    const isCurrent = (i === state.totalAsked);
    step.className = 'step' + (isCurrent ? ' current' : '');
    const n = document.createElement('span'); n.textContent = String(i+1);
    const amount = document.createElement('span'); amount.className = 'amount'; amount.textContent = fmt(PRIZES[i]);
    step.append(n, amount); ladderEl.appendChild(step);
  }
  updatePrizeDisplay();
}
function updatePrizeDisplay(){ currentPrizeEl.textContent = fmt(state.bank); }

// ==================== Temporizador ====================
let timerInterval = null; const CIRC = 2 * Math.PI * 54; // r=54
prog.style.strokeDasharray = String(CIRC);
function startTimer(){
  if(!state.canRunTimer) return;
  clearInterval(timerInterval);
  const start = Date.now();
  state.timer = state.timerMax;
  state.running = true;
  updateTimerUI();
  try { sSuspense.currentTime = 0; sSuspense.play().catch(()=>{}); } catch(_) {}
  const tick = () => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const left = state.timerMax - elapsed;
    if (left !== state.timer) {
      state.timer = Math.max(0, left);
      updateTimerUI();
      if (state.timer <= 10) { try { sTick.currentTime = 0; sTick.play().catch(()=>{});} catch(_){}
      }
    }
    if (left <= 0){ clearInterval(timerInterval); state.running = false; try { sSuspense.pause(); } catch(_) {} onTimeUp(); }
  };
  timerInterval = setInterval(tick, 200);
  tick();
}
function stopTimer(){ clearInterval(timerInterval); try { sSuspense.pause(); } catch(_) {} }
function updateTimerUI(){ timerNum.textContent = String(state.timer); const ratio = (state.timerMax - state.timer) / state.timerMax; prog.style.strokeDashoffset = String(ratio * CIRC); }

// ==================== Preguntas ====================
function currentTopic(){ return TOPICS[state.topicOrder[state.topicIdx]]; }
function currentQuestion(){
  const topic = currentTopic();
  const qIdx = state.topicQOrder[state.qIdxInTopic];
  return topic.questions[qIdx];
}

function loadQuestion(){
  renderLadder();
    updateTopicLabel();
  const q = currentQuestion();
  qTitle.textContent = q.q;
  answersEl.innerHTML = '';
  q.a.forEach((txt,i)=>{
    const btn = document.createElement('button'); btn.className = 'answer'; btn.type='button'; btn.dataset.index = String(i);
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
  if(!state.running || locked) return;
  lockAnswers(); stopTimer();
  try { sSelect.currentTime = 0; sSelect.play().catch(()=>{});} catch(_) {}
  if (chosen === correct){
    const prizeVal = PRIZES[state.totalAsked];
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
  state.totalAsked++;
  state.qIdxInTopic++;
  if (state.qIdxInTopic >= state.topicQOrder.length){
    // Termina tema actual
    if (state.topicIdx + 1 >= state.topicOrder.length){
      endGame(true); // ganó, completó los 3 temas
      return;
    }
    // Avanza al siguiente tema
    state.topicIdx++;
    startTopic();
    return;
  }
  loadQuestion(); startTimer(); unlockAnswers();
}

function onTimeUp(){
  const q = currentQuestion();
  const nodes = [...answersEl.querySelectorAll('.answer')];
  if (nodes[q.correct]) nodes[q.correct].classList.add('correct');
  try { sWrong.currentTime = 0; sWrong.play().catch(()=>{});} catch(_) {}
  setTimeout(()=> endGame(false), 1200);
}

// ==================== Menú final ====================
function endGame(win){
    resetLifelines();
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
  bCall.onclick = ()=>{ if(state.usedLifelines['call']) return; state.usedLifelines['call']=true; withLock(()=>{ useCall(); bCall.classList.add('used'); }); };
  bAud.onclick = ()=>{ if(state.usedLifelines['aud']) return; state.usedLifelines['aud']=true; withLock(()=>{ useAudience(); bAud.classList.add('used'); }); };
}
function withLock(fn, delay=300){ lockAnswers(); try { fn(); } finally { setTimeout(unlockAnswers, delay); } }
function use5050(){
  const q = currentQuestion();
  const nodes = [...answersEl.querySelectorAll('.answer')];
  const wrongIdxs = nodes.map((_,i)=>i).filter(i=>i!==q.correct);
  wrongIdxs.sort(()=>Math.random()-0.5).slice(0,2).forEach(i=>{ const n=nodes[i]; if(n){ n.disabled=true; n.style.opacity='0.45'; } });
}
function useCall(){
  const q = currentQuestion();
  const pick = Math.random() < 0.75 ? q.correct : Math.floor(Math.random()*4);
  const callOverlay = must('callOverlay');
  const callAdvice = must('callAdvice');
  const btnCloseCall = must('btnCloseCall');
  callAdvice.textContent = `Tu contacto sugiere: la ${'ABCD'[pick]}`;
  callOverlay.classList.add('show');
  btnCloseCall.onclick = () => callOverlay.classList.remove('show');
}
function useAudience(){
  try { sAudience.currentTime = 0; sAudience.play().catch(()=>{});} catch(_) {}
  const q = currentQuestion();
  const nodes = [...answersEl.querySelectorAll('.answer')];
  nodes.forEach((n,i)=>{
    n.querySelectorAll('.aud-pct').forEach(e=>e.remove());
    const span=document.createElement('span'); span.className='aud-pct';
    span.textContent=(i===q.correct? Math.floor(50+Math.random()*30) : Math.floor(5+Math.random()*20)) + '%';
    span.style.marginLeft='8px'; span.style.opacity='0.9'; n.appendChild(span);
  });
}

// ==================== Intro y Menú de temas ====================
function showIntro() { introOverlay.classList.add('show'); state.canRunTimer = false; try { introVideo.currentTime = 0; const p = introVideo.play(); if (p && p.then) { p.catch(()=>{/*esperamos gesto*/}); } } catch(_) {} }
function closeIntro() { try { introVideo.pause(); } catch(_) {} introOverlay.classList.remove('show'); state.canRunTimer = true; showTopicsMenuInitial(); }
function bindIntroControls() {
  const tryPlayWithSound = () => { try { introVideo.muted = false; const p = introVideo.play(); if (p && p.then) { p.catch(()=>{ introVideo.muted = true; }); } unlockAudio(); } catch(_) {} };
  if (soundBtn2) soundBtn2.onclick = tryPlayWithSound;
  const doSkip = () => { try { introVideo.pause(); } catch(_) {} try { sSuspense.pause(); } catch(_) {} closeIntro(); };
  if (skipBtn2) skipBtn2.onclick = doSkip;
  introVideo.addEventListener('ended', () => closeIntro());
}

function showTopicsMenuInitial(){
  topicsGrid.innerHTML = '';
  TOPICS.forEach((t,idx)=>{
    const btn = document.createElement('button'); btn.type='button'; btn.className='topic-btn'; btn.setAttribute('role','listitem');
    const icon = document.createElement('div'); icon.className='topic-icon'; icon.textContent = t.icon;
    const name = document.createElement('div'); name.className='topic-name'; name.textContent = t.name;
    btn.append(icon, name);
    btn.onclick = () => selectFirstTopic(idx);
    topicsGrid.appendChild(btn);
  });
  topicsOverlay.classList.add('show');
}

function selectFirstTopic(firstIdx){
  // Define orden de temas: primero el elegido y luego shuffle del resto
  const allIdxs = TOPICS.map((_,i)=>i);
  const rest = allIdxs.filter(i=>i!==firstIdx);
  state.topicOrder = [firstIdx, ...shuffle(rest)];
  topicsOverlay.classList.remove('show');
  startGameCore();
}

function startGameCore(){
    resetLifelines();
  state.bank = 0;
  state.totalAsked = 0;
  state.topicIdx = 0;
  startTopic();
}


function updateTopicLabel() {
    const el = document.getElementById('currentTopic');
    if (el) el.textContent = `Tema: ${currentTopic().name}`;
}

function startTopic(){
  const t = currentTopic();
  // Reinicia comodines por tema
  state.usedLifelines = { '50': false, 'call': false, 'aud': false };
  // Orden aleatorio de preguntas del tema actual
  state.topicQOrder = shuffle(t.questions.map((_,i)=>i));
  state.qIdxInTopic = 0;
  renderLadder();
    updateTopicLabel();
  loadQuestion();
  state.canRunTimer = true;
  startTimer();
}

// ==================== Anti-trampas ====================
let cheatDetections = 0; const MAX_DETECTIONS = 1;
function onSuspiciousActivity(){ cheatDetections++; if (cheatDetections > MAX_DETECTIONS) { endByCheat(); } else { showWarn(); } }
function showWarn(){ stopTimer(); const warn = must('warnOverlay'); const btn = must('btnWarnOk'); warn.classList.add('show'); btn.onclick = ()=>{ warn.classList.remove('show'); startTimer(); }; }
function endByCheat(){
    resetLifelines(); stopTimer(); showMenu(fmt(state.bank)); }
document.addEventListener('visibilitychange', ()=>{ if (document.hidden) onSuspiciousActivity(); });
window.addEventListener('blur', ()=> onSuspiciousActivity());
document.addEventListener('keydown', (e)=>{ if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) { e.preventDefault(); onSuspiciousActivity(); } });
document.addEventListener('contextmenu', e=> e.preventDefault());

// ==================== Confeti ====================
function triggerConfetti(){ const wrap = must('confetti'); wrap.innerHTML = ''; for (let i=0;i<80;i++){ const el=document.createElement('div'); el.style.position='absolute'; el.style.left=(Math.random()*100)+'%'; el.style.top='-10%'; el.style.width='10px'; el.style.height='16px'; el.style.background=`hsl(${Math.random()*360} 80% 60%)`; el.style.transform='rotate('+(Math.random()*360)+'deg)'; el.style.opacity='0.95'; wrap.appendChild(el); el.animate([{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(110vh) rotate(720deg)'}], {duration: 2200+Math.random()*1200, easing:'cubic-bezier(.2,.6,.2,1)'}); } }

// ==================== Desbloqueo de audio global ====================
let audioUnlocked = false;
function unlockAudio(){ if (audioUnlocked) return; audioUnlocked = true; [sTick, sSuspense, sSelect, sCorrect, sWrong, sAudience].forEach(a=>{ try { const p=a.play(); if (p && p.then) p.then(()=>a.pause()).catch(()=>{}); } catch(_) {} }); window.removeEventListener('pointerdown', unlockAudio); window.removeEventListener('keydown', unlockAudio); }
window.addEventListener('pointerdown', unlockAudio, { once:false });
window.addEventListener('keydown', unlockAudio, { once:false });

// ==================== Ciclo de vida ====================
function startGame(){
  // Muestra intro y al cerrar, menu de temas
  hideMenu();
  showIntro();
}
function init(){ attachLifelines(); bindIntroControls(); startGame(); }
init();
