// Lógica millonaria — lógica principal

const QUESTIONS = [
  { q: '¿En qué continente se encuentra el desierto del Sahara?', a:['Asia','África','Europa','América'], correct:1 },
  { q: '¿Cuál es la capital de Francia?', a:['Berlín','Madrid','París','Lisboa'], correct:2 },
  { q: '2 + 3 × 4 = ?', a:['20','14','16','12'], correct:1 },
  { q: '¿Qué elemento tiene el símbolo O?', a:['Oro','Oxígeno','Plata','Cobre'], correct:1 },
  { q: '¿Cuánto es 5 × 5?', a:['20','15','25','30'], correct:2 }
];

const PRIZES = ['100','200','300','500','1.000','2.000','4.000','8.000','16.000','32.000','64.000','125.000','250.000','500.000','1.000.000'];
const SAFE_LEVELS = new Set([4, 9]); // 1.000 y 32.000

let state = {
  order: [],
  idx: 0,
  running: false,
  canRunTimer: false, // ← el timer arranca solo después de la intro
  timerMax: 35,
  timer: 35,
  usedLifelines: { '50': false, 'call': false, 'aud': false }
};

// DOM
const qTitle = document.getElementById('questionTitle');
const answersEl = document.getElementById('answers');
const timerNum = document.getElementById('timerNumber');
const prog = document.getElementById('timerProgress');
const ladderEl = document.getElementById('ladder');
const currentPrizeEl = document.getElementById('currentPrize');
const safeAmt = document.getElementById('safeAmt');
const menu = document.getElementById('gameMenu');
const menuPrize = document.getElementById('menuPrize');
const btnRetry = document.getElementById('btnRetry');
const btnExit = document.getElementById('btnExit');

// Audios
const sTick = document.getElementById('sTick');
const sSuspense = document.getElementById('sSusp');
const sSelect = document.getElementById('sSelect');
const sCorrect = document.getElementById('sCorrect');
const sWrong = document.getElementById('sWrong');
const sAudience = document.getElementById('sAudience');

// Intro/controles
const introOverlay = document.getElementById('introOverlay');
const introVideo = document.getElementById('introVideo');
const soundBtn = document.getElementById('soundBtn');
const skipBtn = document.getElementById('skipBtn');
const soundBtn2 = document.getElementById('soundBtn2');
const skipBtn2 = document.getElementById('skipBtn2');

// Fondo chispas (canvas)
const canvas = document.getElementById('bg-sparks');
const ctx = canvas.getContext('2d');
let sparks = [];
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resizeCanvas);
resizeCanvas();
function createSpark(){
  return {
    x: Math.random()*canvas.width,
    y: canvas.height + Math.random()*100,
    vY: 0.6 + Math.random()*1.4,
    vX: (Math.random()-0.5)*0.3,
    r: 1 + Math.random()*2.2,
    life: 60 + Math.random()*120,
    hue: 25 + Math.random()*25 // naranja-amarillo
  };
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

// Utilidades
function shuffle(a){ const arr=[...a]; for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// --------- Ciclo de vida ----------
function init(){
  state.order = shuffle(QUESTIONS.map((_,i)=>i));
  hideMenu();
  showIntro();
  attachLifelines();
  bindIntroControls();
}

// Arranca juego tras la intro
function startGame(){
  state.idx = 0;
  state.usedLifelines = { '50': false, 'call': false, 'aud': false };
  renderLadder();
  loadQuestionAt(0);
  state.canRunTimer = true;
  startTimer();
}

// --------- Escalera ----------
function renderLadder(){
  ladderEl.innerHTML = '';
  for (let i = PRIZES.length - 1; i >= 0; i--) {
    const step = document.createElement('div');
    step.className = 'step' + (i === state.idx ? ' current' : '') + (SAFE_LEVELS.has(i) ? ' safe' : '');
    const n = document.createElement('span'); n.textContent = String(i+1);
    const amount = document.createElement('span'); amount.className = 'amount'; amount.textContent = `$${PRIZES[i]}`;
    step.append(n, amount); ladderEl.appendChild(step);
  }
  updatePrizeDisplay();
}
function updatePrizeDisplay(){
  const clamped = Math.max(0, Math.min(PRIZES.length-1, state.idx));
  currentPrizeEl.textContent = `$${PRIZES[clamped]}`;
  const reached = [...SAFE_LEVELS].filter(l => l <= clamped).sort((a,b)=>b-a)[0];
  const safe = typeof reached === 'number' ? PRIZES[reached] : '0';
  safeAmt.textContent = `$${safe}`;
}

// --------- Temporizador ----------
let timerInterval = null;
const CIRC = 2 * Math.PI * 54; // r=54
if (prog) prog.style.strokeDasharray = String(CIRC);

function startTimer(){
  if (!state.canRunTimer) return; // no iniciar hasta después de la intro
  clearInterval(timerInterval);
  state.timer = state.timerMax;
  state.running = true;
  updateTimerUI();
  try { sSuspense.currentTime = 0; sSuspense.play().catch(()=>{}); } catch(_) {}
  timerInterval = setInterval(()=>{
    state.timer--;
    if (state.timer <= 10) { try { sTick.currentTime = 0; sTick.play().catch(()=>{});} catch(_){} }
    updateTimerUI();
    if (state.timer <= 0){
      clearInterval(timerInterval);
      state.running = false;
      try { sSuspense.pause(); } catch(_) {}
      onTimeUp();
    }
  }, 1000);
}
function stopTimer(){ clearInterval(timerInterval); try { sSuspense.pause(); } catch(_) {} }
function updateTimerUI(){ timerNum.textContent = String(state.timer); const ratio = (state.timerMax - state.timer) / state.timerMax; prog.style.strokeDashoffset = String(ratio * CIRC); }

// --------- Preguntas/Respuestas ----------
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
    btn.innerHTML = `<span class="letter">${'ABCD'[i]}</span><span>${txt}</span>`;
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

// --------- Menú (fin de partida) ----------
function endGame(win){
  stopTimer();
  if (win){
    triggerConfetti();
    showMenu(`$${PRIZES[PRIZES.length-1]}`);
  } else {
    const clamped = Math.max(0, Math.min(PRIZES.length-1, state.idx));
    showMenu(`$${PRIZES[clamped]}`);
  }
}
function showMenu(prize){
  menuPrize.textContent = prize;
  menu.classList.add('show');      // ← mostrar con clase .show
}
function hideMenu(){
  menu.classList.remove('show');   // ← ocultar seguro
}
btnRetry.addEventListener('click', ()=>{
  hideMenu();
  state.order = shuffle(QUESTIONS.map((_,i)=>i));
  startGame();
});
btnExit.addEventListener('click', ()=>{ location.reload(); });

// --------- Comodines ----------
function attachLifelines(){
  const b5050 = document.getElementById('lf-5050');
  const bCall = document.getElementById('lf-call');
  const bAud  = document.getElementById('lf-aud');
  if (b5050) b5050.onclick = ()=>{
    if(state.usedLifelines['50']) return;
    state.usedLifelines['50']=true; use5050(); b5050.classList.add('used');
  };
  if (bCall) bCall.onclick = ()=>{
    if(state.usedLifelines['call']) return;
    state.usedLifelines['call']=true; useCall(); bCall.classList.add('used');
  };
  if (bAud)  bAud.onclick = ()=>{
    if(state.usedLifelines['aud']) return;
    state.usedLifelines['aud']=true; useAudience(); bAud.classList.add('used');
  };
}
function use5050(){
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const nodes = [...answersEl.querySelectorAll('.answer')];
  const wrongIdxs = nodes.map((_,i)=>i).filter(i=>i!==correct);
  wrongIdxs.sort(()=>Math.random()-0.5).slice(0,2).forEach(i=>{
    const n=nodes[i]; if(n){ n.disabled=true; n.style.opacity='0.45'; }
  });
}
function useCall(){
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const pick = Math.random() < 0.75 ? correct : Math.floor(Math.random()*4);
  alert('Llamada: Creo que la respuesta es la ' + 'ABCD'[pick]);
}
function useAudience(){
  try { sAudience.currentTime = 0; sAudience.play().catch(()=>{});} catch(_) {}
  const qIdx = state.order[state.idx % state.order.length]; const correct = QUESTIONS[qIdx].correct;
  const nodes = [...answersEl.querySelectorAll('.answer')];
  nodes.forEach((n,i)=>{
    const span=document.createElement('span');
    span.textContent=(i===correct? Math.floor(50+Math.random()*30) : Math.floor(5+Math.random()*20)) + '%';
    span.style.marginLeft='8px'; span.style.opacity='0.9';
    n.appendChild(span);
  });
}

// --------- Intro ----------
function showIntro(){
  introOverlay.classList.add('show');   // visible
  state.canRunTimer = false;            // evita que arranque el timer
  try { introVideo.currentTime = 0; introVideo.play().catch(()=>{});} catch(_) {}
}
function closeIntro(){
  introOverlay.classList.remove('show');
  state.canRunTimer = true;
  startGame();
}
function bindIntroControls(){
  const tryPlay = ()=>{ try { introVideo.muted = false; introVideo.play().catch(()=>{});} catch(_){} };
  if (soundBtn)  soundBtn.onclick  = tryPlay;   // botón fuera del overlay
  if (soundBtn2) soundBtn2.onclick = tryPlay;   // botón dentro del overlay
  const doSkip = ()=> closeIntro();
  if (skipBtn)  skipBtn.onclick  = doSkip;
  if (skipBtn2) skipBtn2.onclick = doSkip;
  introVideo.addEventListener('ended', ()=> closeIntro());
}

// --------- Confeti ----------
function triggerConfetti(){
  const wrap = document.getElementById('confetti');
  wrap.innerHTML = '';
  for (let i=0;i<60;i++){
    const el=document.createElement('div');
    el.style.position='absolute';
    el.style.left=(Math.random()*100)+'%';
    el.style.top='-10%';
    el.style.width='10px';
    el.style.height='16px';
    el.style.background=`hsl(${Math.random()*360} 80% 60%)`;
    el.style.transform='rotate('+ (Math.random()*360)+'deg)';
    el.style.opacity='0.95';
    wrap.appendChild(el);
    el.animate(
      [{transform:'translateY(0) rotate(0deg)'},
       {transform:'translateY(110vh) rotate(720deg)'}],
      {duration: 2000+Math.random()*1200, easing:'cubic-bezier(.2,.6,.2,1)'}
    );
  }
}

// Arranque
init();
