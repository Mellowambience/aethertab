// AetherRose daily quote — deterministic daily rotation
import QUOTES from '../data/quotes.js';
const textEl=document.getElementById('quote-text');
const attrEl=document.getElementById('quote-attr');
function getDailyIndex(){return Math.floor(Date.now()/(1000*60*60*24))%QUOTES.length;}
function renderQuote(){
  const q=QUOTES[getDailyIndex()]; if(!textEl||!q)return;
  textEl.style.animation='none'; textEl.textContent=q.text;
  void textEl.offsetWidth; textEl.style.animation='';
  textEl.classList.add('rose-quote-text');
  if(attrEl)attrEl.textContent=q.attr?`— ${q.attr}`:'— AetherRose';
}
renderQuote();
