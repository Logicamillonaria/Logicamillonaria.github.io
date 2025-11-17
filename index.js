// Millonario - main logic
const QUESTIONS = [
  { q: '¿En qué continente se encuentra el desierto del Sahara?', a:['Asia','África','Europa','América'], correct:1 },
  { q: '¿Cuál es la capital de Francia?', a:['Berlín','Madrid','París','Lisboa'], correct:2 },
  { q: '2 + 3 × 4 = ?', a:['20','14','16','12'], correct:1 },
  { q: '¿Qué elemento tiene el símbolo O?', a:['Oro','Oxígeno','Plata','Cobre'], correct:1 },
  { q: '¿Cuánto es 5 × 5?', a:['20','15','25','30'], correct:2 }
];

const PRIZES = ['100','200','300','500','1.000','2.000','4.000','8.000','16.000','32.000','64.000','125.000','250.000','500.000','1.000.000'];

let state = {
  order: [],
  idx: 0,
  running: false,
  timerMax: 35,
  timer: 35,
  usedLifelines: { '50': false, 'call': false, 'aud': false }
};

// dom
const qTitle = document.getElementById('questionTitle');
const answersEl = document.getElementById('answers');
const timerNum = document.getElementById('timerNumber');
const prog = document.querySelector('.timer-progress');
const ladderEl = document.getElementById('ladder');
const currentPrizeEl = document.getElementById('currentPrize');
const safeAmt = document.getElementById('safeAmt');

// audios
const sTick = document.getElementById('sTick');
const sSusp = document.getElementById('sSusp');
const sSelect = document.getElementById('sSelect');
const sCorrect = document.getElementById('sCorrect');
const sWrong = document.getElementById('sWrong');
const sAudience = document.getElementById('sAudience');

const introOverlay = document.getElementById('introOverlay');
const introVideo = document.getElementById('introVideo');
const soundBtn = document.getElementById('soundBtn');
const skipBtn = document.getElementById('skipBtn');

// helper shuffle
function shuffle(a){ return a.sort(()=>Math.random()-0.5); }

function init(){
  // build order
  state.order = QUESTIONS.map((_,i)=>i);
  state.order = shuffle(state.order);

  renderLadder();
  loadQuestionAt(0);
  attachLifelines();
  startIntro();
}

function renderLadder(){
  ladderEl.innerHTML = '';
  for(let i=PRIZES.length-1;i>=0;i--){
    const step = document.createElement('div');
    step.className = 'step' + (i===state.idx? ' current':'' ) + (i===4||i===9? ' safe':'');
    step.innerHTML = `<div>#${i+1}</div><div class="amount">$${PRIZES[i]}</div>`;
    ladderEl.appendChild(step);
  }
  updatePrizeDisplay();
}

function updatePrizeDisplay(){
  const prize = PRIZES[Math.max(0, Math.min(PRIZES.length-1, state.idx))];
  currentPrizeEl.textContent = `$${prize}`;
  // safe amount example
  safeAmt.textContent = '$16,000';
}

let timerInterval = null;
function startTimer(){
  clearInterval(timerInterval);
  state.timer = state.timerMax;
  updateTimerUI();
  sSusp.currentTime = 0;
  sSusp.play().catch(()=>{});
  state.running = true;
  timerInterval = setInterval(()=>{
    state.timer--;
    if(state.timer<=10) {
      sTick.currentTime = 0;
      sTick.play().catch(()=>{});
    }
    updateTimerUI();
    if(state.timer<=0){
      clearInterval(timerInterval);
      state.running=false;
      sSusp.pause();
      onTimeUp();
    }
  },1000);
}

function stopTimer(){
  clearInterval(timerInterval);
  sSusp.pause();
}

// timer svg math
const circumference = 2*Math.PI*50; // r=50
prog.style.strokeDasharray = String(circumference);
function updateTimerUI(){
  const pct = state.timer / state.timerMax;
  const offset = circumference * (1 - pct);
  prog.style.strokeDashoffset = String(offset);
  timerNum.textContent = String(state.timer);
}

// lifecycle: load question
function loadQuestionAt(pos){
  state.idx = pos;
  renderLadder();
  const qIdx = state.order[state.idx % state.order.length];
  const q = QUESTIONS[qIdx];
  qTitle.textContent = q.q;
  answersEl.innerHTML = '';
  q.a.forEach((txt,i)=>{
    const b = document.createElement('div');
    b.className = 'answer';
    b.tabIndex = 0;
    b.innerHTML = `<div class="letter">${'ABCD'[i]}</div><div>${txt}</div>`;
    b.onclick = ()=> selectAnswer(b,i,q.correct);
    answersEl.appendChild(b);
  });
  // start timer
  startTimer();
}

function selectAnswer(el, chosen, correct){
  if(!state.running) return;
  state.running=false;
  stopTimer();
  sSelect.currentTime=0; sSelect.play().catch(()=>{});
  if(chosen===correct){
    el.classList.add('correct');
    sCorrect.currentTime=0; sCorrect.play().catch(()=>{});
    // celebration then next
    setTimeout(()=>{
      nextQuestion();
    },1200);
  } else {
    el.classList.add('wrong');
    // reveal correct
    const nodes = document.querySelectorAll('.answer');
    nodes[correct].classList.add('correct');
    sWrong.currentTime=0; sWrong.play().catch(()=>{});
    // end game after short delay
    setTimeout(()=> endGame(false),1300);
  }
}

function nextQuestion(){
  // advance order (random order already)
  state.idx++;
  if(state.idx >= state.order.length) {
    // won all
    endGame(true);
  } else {
    loadQuestionAt(state.idx);
  }
}

function onTimeUp(){
  // reveal correct and end
  const qIdx = state.order[state.idx % state.order.length];
  const correct = QUESTIONS[qIdx].correct;
  const nodes = document.querySelectorAll('.answer');
  if(nodes[correct]) nodes[correct].classList.add('correct');
  sWrong.currentTime=0; sWrong.play().catch(()=>{});
  setTimeout(()=> endGame(false),1200);
}

function endGame(win){
  stopTimer();
  // show confetti on win
  if(win){
    triggerConfetti();
    alert('¡Ganaste el juego!');
  } else {
    alert('Juego terminado. Volvé a intentarlo.');
  }
  // restart fresh: reshuffle questions and start again
  state.order = shuffle(state.order);
  state.idx = 0;
  loadQuestionAt(0);
}

// lifelines
function attachLifelines(){
  document.getElementById('lf-5050').onclick = ()=>{
    if(state.usedLifelines['50']) return;
    state.usedLifelines['50'] = true;
    use5050();
  };
  document.getElementById('lf-call').onclick = ()=>{
    if(state.usedLifelines['call']) return;
    state.usedLifelines['call'] = true;
    useCall();
  };
  document.getElementById('lf-aud').onclick = ()=>{
    if(state.usedLifelines['aud']) return;
    state.usedLifelines['aud'] = true;
    useAudience();
  };
}

function use5050(){
  const qIdx = state.order[state.idx % state.order.length];
  const correct = QUESTIONS[qIdx].correct;
  const nodes = Array.from(document.querySelectorAll('.answer'));
  const wrongIdxs = nodes.map((n,i)=>i).filter(i=>i!==correct).sort(()=>Math.random()-0.5).slice(0,2);
  wrongIdxs.forEach(i=> nodes[i].style.visibility='hidden');
}

function useCall(){
  const qIdx = state.order[state.idx % state.order.length];
  const correct = QUESTIONS[qIdx].correct;
  // simulated friend: 75% chance correct
  const pick = Math.random()<0.75 ? correct : Math.floor(Math.random()*4);
  alert('Llamada: Creo que la respuesta es ' + 'ABCD'[pick]);
}

function useAudience(){
  sAudience.currentTime=0; sAudience.play().catch(()=>{});
  const qIdx = state.order[state.idx % state.order.length];
  const correct = QUESTIONS[qIdx].correct;
  const nodes = Array.from(document.querySelectorAll('.answer'));
  // simple distribution
  nodes.forEach((n,i)=>{
    const bar = document.createElement('span');
    bar.textContent = (i===correct? Math.floor(50+Math.random()*30): Math.floor(5+Math.random()*20)) + '%';
    bar.style.marginLeft = '8px';
    bar.style.opacity = '0.9';
    n.appendChild(bar);
  });
}

// intro controls
soundBtn.onclick = ()=>{
  introVideo.muted = false;
  introVideo.play().catch(()=>{});
};

skipBtn.onclick = ()=>{
  closeIntro();
};

// intro auto close after 10s
introVideo.addEventListener('loadedmetadata', ()=>{
  introVideo.play().catch(()=>{});
});
setTimeout(()=> closeIntro(), 10000);

function startIntro(){
  introOverlay.style.display = 'flex';
}
function closeIntro(){
  introOverlay.style.display = 'none';
  initAfterIntro();
}

function initAfterIntro(){
  // start main logic render
  renderLadder();
  loadQuestionAt(0);
}

// confetti simple
function triggerConfetti(){
  const wrap = document.getElementById('confetti');
  wrap.innerHTML = '';
  for(let i=0;i<40;i++){
    const el = document.createElement('div');
    el.style.position='absolute';
    el.style.left = (Math.random()*100)+'%';
    el.style.top = '-10%';
    el.style.width='10px';
    el.style.height='16px';
    el.style.background = `hsl(${Math.random()*360} 80% 60%)`;
    el.style.transform = 'rotate('+ (Math.random()*360) +'deg)';
    el.style.opacity='0.95';
    wrap.appendChild(el);
    el.animate([{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(110vh) rotate(720deg)'}],{duration:2000+Math.random()*1200, easing:'cubic-bezier(.2,.6,.2,1)'});
  }
}

// start app
init();
