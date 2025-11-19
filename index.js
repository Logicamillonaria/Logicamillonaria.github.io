
function resetLifelinesUI(){
  ['lf-5050','lf-call','lf-aud'].forEach(id=>{
    const btn=document.getElementById(id);
    if(btn) btn.classList.remove('used');
  });
}
function startTopic(){
  const t=currentTopic();
  document.getElementById('topicTitle').textContent=t.name;
  state.usedLifelines={'50':false,'call':false,'aud':false};
  resetLifelinesUI();
}
function endGame(win){
  resetLifelinesUI();
}
function startGameCore(){
  resetLifelinesUI();
}
