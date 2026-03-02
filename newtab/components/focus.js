// Focus input — persistence + keyboard UX
const input=document.getElementById('focus-input');
if(!input)throw new Error('focus-input not found');
chrome.storage.local.get('focusText',({focusText})=>{if(focusText)input.value=focusText;});
input.addEventListener('input',()=>{chrome.storage.local.set({focusText:input.value});});
input.addEventListener('keydown',e=>{if(e.key==='Enter')input.blur();});
document.addEventListener('keydown',e=>{
  if(document.activeElement!==document.body)return;
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey)input.focus();
});
