// panel.js — MIST Oracle sidebar
// Cascade: MIST Railway → Gemini 2.0 Flash → Groq Llama-3.1 → OpenAI
import{vaultStore,vaultLoad,vaultExists,vaultClear}from'../crypto/vault.js';
let secrets=null; let chatHistory=[];
const keySetup=document.getElementById('key-setup');
const vaultUnlock=document.getElementById('vault-unlock');
const chatArea=document.getElementById('chat-area');
const messagesEl=document.getElementById('messages');
const thinkingEl=document.getElementById('oracle-thinking');
const chatInput=document.getElementById('chat-input');
const sendBtn=document.getElementById('send-btn');
const statusDot=document.getElementById('status-dot');
const statusLabel=document.getElementById('status-label');
const providerBadge=document.getElementById('provider-badge');
async function init(){const exists=await vaultExists();if(!exists)show(keySetup);else show(vaultUnlock);}
document.getElementById('save-key-btn')?.addEventListener('click',async()=>{
  const apiKey=document.getElementById('api-key-input')?.value.trim();
  const provider=document.getElementById('provider-select')?.value;
  const passphrase=document.getElementById('passphrase-input')?.value;
  if(!apiKey||!passphrase){alert('Fill in API key and vault passphrase.');return;}
  await vaultStore({apiKey,provider},passphrase); secrets={apiKey,provider}; showChatUI();
});
document.getElementById('unlock-btn')?.addEventListener('click',async()=>{
  const passphrase=document.getElementById('unlock-passphrase')?.value;
  const loaded=await vaultLoad(passphrase);
  if(!loaded){document.getElementById('unlock-error')?.classList.remove('hidden');return;}
  secrets=loaded; document.getElementById('unlock-error')?.classList.add('hidden'); showChatUI();
});
document.getElementById('unlock-passphrase')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('unlock-btn')?.click();});
function showChatUI(){hide(keySetup);hide(vaultUnlock);show(chatArea);chatArea.classList.add('sidebar-content');if(providerBadge)providerBadge.textContent=`via ${secrets?.provider??'mist'}`;setStatus('online','ready');chatInput?.focus();}
sendBtn?.addEventListener('click',sendMessage);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
async function sendMessage(){
  const text=chatInput?.value.trim(); if(!text||!secrets)return;
  chatInput.value=''; appendMessage('user',text); chatHistory.push({role:'user',content:text});
  setThinking(true); setStatus('online','thinking...');
  try{const r=await routeToLLM(text,chatHistory,secrets);chatHistory.push({role:'assistant',content:r});appendMessage('assistant',r);setStatus('online','ready');}
  catch(err){appendMessage('error',`⚠ ${err.message}`);setStatus('offline','error');}
  finally{setThinking(false);}
}
async function routeToLLM(message,history,{provider,apiKey}){
  try{const{mistEndpoint}=await chrome.storage.local.get('mistEndpoint');if(mistEndpoint)return await callMIST(mistEndpoint,message,history);}
  catch{}
  switch(provider){
    case'gemini':return await callGemini(apiKey,message,history);
    case'openai':return await callOpenAI(apiKey,message,history);
    case'groq':return await callGroq(apiKey,message,history);
    default:return await callGemini(apiKey,message,history);
  }
}
async function callMIST(endpoint,message,history){
  const res=await fetch(`${endpoint}/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history,context:'aethertab_sidebar'})});
  if(!res.ok)throw new Error(`MIST ${res.status}`); const data=await res.json();
  if(providerBadge)providerBadge.textContent='via MIST Oracle';
  return data.response??data.message??JSON.stringify(data);
}
async function callGemini(apiKey,message,history){
  const contents=history.map(m=>({role:m.role==='user'?'user':'model',parts:[{text:m.content}]}));
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents})});
  if(!res.ok)throw new Error(`Gemini ${res.status}`); const data=await res.json();
  if(providerBadge)providerBadge.textContent='via Gemini 2.0 Flash';
  return data.candidates?.[0]?.content?.parts?.[0]?.text??'No response.';
}
async function callOpenAI(apiKey,message,history){
  const messages=[{role:'system',content:'You are MIST, an assistant in AetherTab. Be concise.'},...history];
  const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model:'gpt-4o-mini',messages,max_tokens:1024})});
  if(!res.ok)throw new Error(`OpenAI ${res.status}`); const data=await res.json();
  if(providerBadge)providerBadge.textContent='via GPT-4o mini';
  return data.choices?.[0]?.message?.content??'No response.';
}
async function callGroq(apiKey,message,history){
  const messages=[{role:'system',content:'You are MIST, an assistant in AetherTab. Be concise.'},...history];
  const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model:'llama-3.1-8b-instant',messages,max_tokens:1024})});
  if(!res.ok)throw new Error(`Groq ${res.status}`); const data=await res.json();
  if(providerBadge)providerBadge.textContent='via Groq / Llama-3.1';
  return data.choices?.[0]?.message?.content??'No response.';
}
function appendMessage(role,text){const div=document.createElement('div');div.className=`message ${role} fade-in`;div.textContent=text;messagesEl?.appendChild(div);messagesEl?.scrollTo({top:messagesEl.scrollHeight,behavior:'smooth'});}
function setThinking(active){thinkingEl?.classList.toggle('hidden',!active);}
function setStatus(state,label){if(statusDot){statusDot.className='';statusDot.classList.add(state);}if(statusLabel)statusLabel.textContent=label;}
function show(el){el?.classList.remove('hidden');} function hide(el){el?.classList.add('hidden');}
document.getElementById('clear-chat-btn')?.addEventListener('click',()=>{chatHistory=[];if(messagesEl)messagesEl.innerHTML='';});
document.getElementById('reset-key-btn')?.addEventListener('click',async()=>{if(!confirm('Clear vault and reset API key?'))return;await vaultClear();secrets=null;chatHistory=[];if(messagesEl)messagesEl.innerHTML='';hide(chatArea);show(keySetup);setStatus('','disconnected');});
init();
