// Clock component — locale-aware 12/24h, Cinzel type
const timeEl = document.getElementById('clock-time');
const dateEl = document.getElementById('clock-date');
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function pad(n){return String(n).padStart(2,'0')}
function tick() {
  const now = new Date();
  const use24h = !new Intl.DateTimeFormat(navigator.language,{hour:'numeric'}).format(now).match(/AM|PM/i);
  let hours = now.getHours(); let suffix='';
  if(!use24h){suffix=hours>=12?' PM':' AM'; hours=hours%12||12;}
  const h=pad(hours); const m=pad(now.getMinutes());
  if(timeEl) timeEl.innerHTML=`${h}<span class="clock-colon">:</span>${m}${suffix?`<span style="font-size:.3em;margin-left:6px;opacity:.7;vertical-align:middle">${suffix}</span>`:''}` ;
  if(dateEl){const day=DAY_NAMES[now.getDay()];const month=MONTH_NAMES[now.getMonth()];dateEl.textContent=`${day}, ${month} ${now.getDate()}`;}
}
tick(); setInterval(tick,1000);
