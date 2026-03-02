// Pomodoro + Void Shards system
const FOCUS_DURATION=25*60; const BREAK_DURATION=5*60;
const displayEl=document.getElementById('pomodoro-display');
const btn=document.getElementById('pomodoro-btn');
const modeEl=document.getElementById('pomodoro-mode');
const shardEl=document.getElementById('shard-count');
let timerInterval=null; let secondsLeft=FOCUS_DURATION; let isRunning=false; let isFocusSession=true;
function pad(n){return String(n).padStart(2,'0')}
function renderTimer(){const m=Math.floor(secondsLeft/60);const s=secondsLeft%60;if(displayEl)displayEl.textContent=`${pad(m)}:${pad(s)}`;}
function startTimer(){isRunning=true;btn.textContent='⏸';timerInterval=setInterval(()=>{secondsLeft--;renderTimer();if(secondsLeft<=0)onTimerComplete();},1000);}
function pauseTimer(){isRunning=false;btn.textContent='▶';clearInterval(timerInterval);timerInterval=null;}
function resetTimer(){pauseTimer();secondsLeft=isFocusSession?FOCUS_DURATION:BREAK_DURATION;renderTimer();}
async function onTimerComplete(){clearInterval(timerInterval);timerInterval=null;isRunning=false;
  if(isFocusSession){await earnShard();isFocusSession=false;secondsLeft=BREAK_DURATION;if(modeEl)modeEl.textContent='BREAK';}
  else{isFocusSession=true;secondsLeft=FOCUS_DURATION;if(modeEl)modeEl.textContent='FOCUS';}
  renderTimer();btn.textContent='▶';
  chrome.runtime.sendMessage({type:'POMODORO_COMPLETE',session:isFocusSession?'break':'focus'});
}
btn?.addEventListener('click',()=>{isRunning?pauseTimer():startTimer();});
let holdTimer=null;
btn?.addEventListener('mousedown',()=>{holdTimer=setTimeout(()=>{resetTimer();},600);});
btn?.addEventListener('mouseup',()=>clearTimeout(holdTimer));
export async function loadShards(){const{voidShards=0}=await chrome.storage.local.get('voidShards');if(shardEl)shardEl.textContent=voidShards;return voidShards;}
async function earnShard(){
  const{voidShards=0}=await chrome.storage.local.get('voidShards'); const newCount=voidShards+1;
  chrome.storage.local.set({voidShards:newCount});
  const counter=document.getElementById('shard-counter');
  if(counter){counter.classList.remove('shard-earning');void counter.offsetWidth;counter.classList.add('shard-earning');}
  if(shardEl)shardEl.textContent=newCount;
  const{showToast}=await import('../newtab.js'); showToast(`✦ +1 Void Shard — ${newCount} total`,'shard');
  checkThresholds(newCount);
}
function checkThresholds(count){
  const T={5:'Ember Glow theme unlocked',15:'The Amber Room unlocked',25:'Rose Chamber unlocked',50:'Void Core theme unlocked'};
  if(T[count]) import('../newtab.js').then(({showToast})=>showToast(`◈ ${T[count]}`,'shard'));
}
renderTimer();
