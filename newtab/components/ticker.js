// Ticker strip — pure CSS marquee, dual-copy for seamless scroll
const TICKER_ITEMS = [
  {icon:'✦',text:'AetherTab v0.1 — the void is live',link:null},
  {icon:'☽',text:'Support the build on Ko-fi',link:'https://ko-fi.com/mellowambience',cta:true},
  {icon:'◈',text:'Earn Void Shards via focus sessions',link:null},
  {icon:'⟐',text:'MIST Oracle — your own AI, not a wrapper',link:null},
  {icon:'✦',text:'Encrypted key storage. No server ever sees your keys.',link:null},
  {icon:'🌐',text:'Enter the Aetherhaven hub',link:'https://mellowambience.github.io',cta:true},
  {icon:'◈',text:'Void Shards unlock rooms, themes, & aesthetics',link:null},
  {icon:'☽',text:'Security consulting — handshake to full engagement',link:null},
  {icon:'✦',text:'No <all_urls> permission. No identity leak. No telemetry.',link:null},
  {icon:'⟐',text:'AetherRose — an identity built in the void',link:null},
];
function buildTickerItem(item){
  const span=document.createElement('span'); span.className='ticker-item';
  const icon=document.createElement('span'); icon.className='ticker-icon'; icon.textContent=item.icon; span.appendChild(icon);
  if(item.link){const a=document.createElement('a');a.href=item.link;a.target='_blank';a.rel='noopener';a.textContent=item.text;if(item.cta)a.classList.add('ticker-cta');span.appendChild(a);}
  else{const t=document.createElement('span');t.textContent=item.text;span.appendChild(t);}
  const sep=document.createElement('span');sep.className='ticker-sep';sep.textContent=' · ';span.appendChild(sep);
  return span;
}
const inner=document.getElementById('ticker-inner');
if(inner){[...TICKER_ITEMS,...TICKER_ITEMS].forEach(item=>inner.appendChild(buildTickerItem(item)));}
