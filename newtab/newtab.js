// newtab.js — Root controller
import { loadShards } from './components/pomodoro.js';
document.getElementById('sidebar-toggle')?.addEventListener('click', () => { chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' }); });
const focusBtn = document.getElementById('focus-toggle-btn');
const body = document.body;
let focusActive = false;
chrome.storage.local.get(['focusMode','focusText'], ({ focusMode, focusText }) => {
  if (focusMode) enableFocus();
  if (focusText) { const input = document.getElementById('focus-input'); if (input) input.value = focusText; }
});
focusBtn?.addEventListener('click', () => { focusActive ? disableFocus() : enableFocus(); });
function enableFocus() { focusActive=true; body.classList.add('focus-mode'); focusBtn.classList.add('active'); focusBtn.textContent='◎ Focused'; chrome.storage.local.set({focusMode:true}); }
function disableFocus() { focusActive=false; body.classList.remove('focus-mode'); focusBtn.classList.remove('active'); focusBtn.textContent='◎ Focus'; chrome.storage.local.set({focusMode:false}); }
const focusInput = document.getElementById('focus-input');
focusInput?.addEventListener('input', () => { chrome.storage.local.set({focusText:focusInput.value}); });
document.getElementById('theme-btn')?.addEventListener('click', () => { showToast('✦ Theme gallery coming in v0.2', 'shard'); });
document.getElementById('settings-btn')?.addEventListener('click', () => { chrome.runtime.sendMessage({type:'OPEN_SETTINGS'}); });
export function showToast(message, type='', duration=3200) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div'); toast.className=`toast ${type}`; toast.textContent=message;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('removing'); toast.addEventListener('animationend',()=>toast.remove(),{once:true}); }, duration);
}
export function refreshShardDisplay(count) { const el=document.getElementById('shard-count'); if(el) el.textContent=count; }
loadShards();
